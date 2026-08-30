import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../auth/auth.service';

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  display_name: string;
  role: string;
  created_at: Date;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly authService: AuthService,
  ) {}

  async list() {
    const rows = await this.db.query<UserRow[]>(
      `SELECT id, username, display_name, role, created_at
       FROM users
       ORDER BY id ASC`,
    );
    return rows.map((row) => ({
      ...this.authService.toPublicUser(row),
      createdAt: row.created_at,
    }));
  }

  async create(payload: { username: string; password: string; displayName?: string }) {
    const username = payload.username.trim();
    const exists = await this.db.query<UserRow[]>(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username],
    );
    if (exists.length) {
      throw new ConflictException('该用户名已被注册');
    }
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const displayName = payload.displayName?.trim() || username;
    await this.db.execute(
      'INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, displayName, 'user'],
    );
    return { username, displayName, role: 'user' };
  }

  async update(
    id: number,
    payload: { displayName?: string; password?: string },
  ) {
    const [user] = await this.db.query<UserRow[]>(
      'SELECT id, username, display_name, role FROM users WHERE id = ? LIMIT 1',
      [id],
    );
    if (!user) {
      throw new NotFoundException('成员不存在');
    }
    const displayName = payload.displayName?.trim() ?? user.display_name;
    if (payload.password) {
      const passwordHash = await bcrypt.hash(payload.password, 10);
      await this.db.execute(
        'UPDATE users SET display_name = ?, password_hash = ? WHERE id = ?',
        [displayName, passwordHash, id],
      );
    } else {
      await this.db.execute('UPDATE users SET display_name = ? WHERE id = ?', [displayName, id]);
    }
    return this.authService.profile(id);
  }

  async remove(id: number, operatorId: number) {
    if (id === operatorId) {
      throw new BadRequestException('不能删除当前登录账号');
    }
    const [user] = await this.db.query<UserRow[]>(
      'SELECT id, role FROM users WHERE id = ? LIMIT 1',
      [id],
    );
    if (!user) {
      throw new NotFoundException('成员不存在');
    }
    if (user.role === 'admin') {
      throw new BadRequestException('不能删除系统管理员');
    }
    await this.db.execute('DELETE FROM users WHERE id = ?', [id]);
  }
}
