import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class InquiryService {
  constructor(private readonly db: DatabaseService) {}

  async create(payload: { name: string; company?: string; message: string }) {
    await this.db.execute(
      'INSERT INTO inquiries (name, company, message) VALUES (?, ?, ?)',
      [payload.name, payload.company || '', payload.message],
    );
  }

  async list() {
    const rows = await this.db.query<
      Array<{
        id: number
        name: string
        company: string
        message: string
        createdAt: Date
      }>
    >(
      `SELECT id, name, company, message, created_at AS createdAt
       FROM inquiries
       ORDER BY id DESC`,
    );
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      message: row.message,
      createdAt: row.createdAt,
    }));
  }

  async remove(id: number) {
    const [result] = await this.db.execute('DELETE FROM inquiries WHERE id = ?', [id]);
    const header = result as { affectedRows?: number };
    if (!header.affectedRows) {
      throw new NotFoundException('留言不存在');
    }
  }
}
