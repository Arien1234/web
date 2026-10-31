import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import { PythonClient } from '../ai/python.client';
import { toBeijingDateTime } from '../common/time';
import { DatabaseService } from '../database/database.service';

type FaceRow = RowDataPacket & {
  user_id: number;
  feature: unknown;
};

type AttendanceRow = RowDataPacket & {
  id: number;
  user_id: number;
  similarity: number;
  status: string;
  created_at: Date;
  username: string;
  display_name: string;
};

type LibraryRow = RowDataPacket & {
  id: number;
  username: string;
  display_name: string;
  role: string;
  enrolledAt: Date | null;
};

@Injectable()
export class FaceService implements OnModuleInit {
  constructor(
    private readonly db: DatabaseService,
    private readonly python: PythonClient,
  ) {}

  async onModuleInit() {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS face_profiles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL UNIQUE,
        feature JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_face_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        similarity DECIMAL(6,4) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'ok',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_att_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_att_user_time (user_id, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    try {
      await this.db.execute(
        "ALTER TABLE attendance_records ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ok'",
      );
    } catch (error) {
      const errno = (error as { errno?: number }).errno;
      if (errno !== 1060) {
        throw error;
      }
    }
  }

  async status(userId: number) {
    const rows = await this.db.query<FaceRow[]>(
      'SELECT user_id FROM face_profiles WHERE user_id = ? LIMIT 1',
      [userId],
    );
    return { enrolled: Boolean(rows[0]) };
  }

  async probe(file: { buffer: Buffer; originalname: string; mimetype: string }) {
    return this.embed(file);
  }

  async recordMiss(userId: number) {
    await this.db.execute(
      "INSERT INTO attendance_records (user_id, similarity, status) VALUES (?, 0, 'fail')",
      [userId],
    );
  }

  async enroll(userId: number, file: { buffer: Buffer; originalname: string; mimetype: string }) {
    await this.ensureUser(userId);
    const data = await this.embed(file);
    await this.db.execute(
      `INSERT INTO face_profiles (user_id, feature) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE feature = VALUES(feature)`,
      [userId, JSON.stringify(data.feature)],
    );
    return { enrolled: true, image: data.image, score: data.score };
  }

  async checkIn(userId: number, file: { buffer: Buffer; originalname: string; mimetype: string }) {
    const enrolled = await this.status(userId);
    if (!enrolled.enrolled) {
      throw new BadRequestException('尚未录入人脸，请联系管理员');
    }
    await this.assertCooldown(userId);

    const gallery = await this.loadGallery();
    const { blob, name } = this.python.toBlob(file);
    const form = new FormData();
    form.append('file', blob, name);
    form.append('gallery', JSON.stringify(gallery));

    const payload = await this.pythonCall('/face/match', form);
    const data = payload.data as {
      userId: number | null;
      similarity: number;
      matched: boolean;
      image: string;
    };
    if (!data.matched || data.userId !== userId) {
      throw new BadRequestException('未识别为当前账号，打卡失败');
    }

    await this.db.execute(
      "INSERT INTO attendance_records (user_id, similarity, status) VALUES (?, ?, 'ok')",
      [userId, data.similarity],
    );
    return {
      message: '打卡成功',
      similarity: data.similarity,
      image: data.image,
    };
  }

  async myRecords(userId: number) {
    const rows = await this.db.query<AttendanceRow[]>(
      `SELECT a.id, a.user_id, a.similarity, a.status, a.created_at, u.username, u.display_name
       FROM attendance_records a
       JOIN users u ON u.id = a.user_id
       WHERE a.user_id = ?
       ORDER BY a.id DESC
       LIMIT 100`,
      [userId],
    );
    return rows.map((row) => this.toRecord(row));
  }

  async library() {
    const rows = await this.db.query<LibraryRow[]>(
      `SELECT u.id, u.username, u.display_name, u.role, f.updated_at AS enrolledAt
       FROM users u
       LEFT JOIN face_profiles f ON f.user_id = u.id
       ORDER BY u.id ASC`,
    );
    return rows.map((row) => ({
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      role: row.role,
      enrolled: Boolean(row.enrolledAt),
      enrolledAt: row.enrolledAt ? toBeijingDateTime(row.enrolledAt) : null,
    }));
  }

  async removeProfile(userId: number) {
    const [result] = await this.db.execute('DELETE FROM face_profiles WHERE user_id = ?', [userId]);
    const header = result as { affectedRows?: number };
    if (!header.affectedRows) {
      throw new NotFoundException('该成员尚未录入人脸');
    }
  }

  async attendance() {
    const rows = await this.db.query<AttendanceRow[]>(
      `SELECT a.id, a.user_id, a.similarity, a.status, a.created_at, u.username, u.display_name
       FROM attendance_records a
       JOIN users u ON u.id = a.user_id
       ORDER BY a.id DESC
       LIMIT 200`,
    );
    return rows.map((row) => this.toRecord(row));
  }

  private async embed(file: { buffer: Buffer; originalname: string; mimetype: string }) {
    const { blob, name } = this.python.toBlob(file);
    const form = new FormData();
    form.append('file', blob, name);
    const payload = await this.pythonCall('/face/embed', form);
    const data = payload.data as { feature: number[]; score: number; image: string };
    if (!data?.feature?.length) {
      throw new BadRequestException('未能提取人脸特征');
    }
    return data;
  }

  private async pythonCall(path: string, form: FormData) {
    try {
      return await this.python.postForm(path, form);
    } catch (err) {
      const message = err instanceof Error ? err.message : '人脸推理失败';
      const status = (err as { status?: number }).status;
      if (status === 400) {
        throw new BadRequestException(message);
      }
      throw new BadGatewayException(message);
    }
  }

  private async loadGallery() {
    const rows = await this.db.query<FaceRow[]>('SELECT user_id, feature FROM face_profiles');
    return rows
      .map((row) => ({
        id: row.user_id,
        feature: this.parseFeature(row.feature),
      }))
      .filter((item) => item.feature.length);
  }

  private parseFeature(raw: unknown): number[] {
    if (Array.isArray(raw)) {
      return raw as number[];
    }
    if (typeof raw === 'string') {
      return JSON.parse(raw) as number[];
    }
    return [];
  }

  private async ensureUser(userId: number) {
    const rows = await this.db.query<RowDataPacket[]>('SELECT id FROM users WHERE id = ? LIMIT 1', [
      userId,
    ]);
    if (!rows[0]) {
      throw new NotFoundException('成员不存在');
    }
  }

  private async assertCooldown(userId: number) {
    const rows = await this.db.query<Array<{ created_at: Date }>>(
      'SELECT created_at FROM attendance_records WHERE user_id = ? AND status = ? ORDER BY id DESC LIMIT 1',
      [userId, 'ok'],
    );
    const last = rows[0]?.created_at;
    if (!last) {
      return;
    }
    if (Date.now() - new Date(last).getTime() < 60 * 1000) {
      throw new BadRequestException('打卡过于频繁，请稍后再试');
    }
  }

  private toRecord(row: AttendanceRow) {
    return {
      id: row.id,
      userId: row.user_id,
      username: row.username,
      displayName: row.display_name,
      similarity: Number(row.similarity),
      status: row.status === 'fail' ? 'fail' : 'ok',
      createdAt: toBeijingDateTime(row.created_at),
    };
  }
}
