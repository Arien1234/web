import { Injectable } from '@nestjs/common';
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
}
