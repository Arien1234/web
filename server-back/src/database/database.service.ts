import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: mysql.Pool;

  constructor(private readonly config: ConfigService) {}

  /** 进程启动时建连接池，并等待 MySQL 就绪 */
  async onModuleInit() {
    this.pool = mysql.createPool({
      host: this.config.get('DB_HOST', '127.0.0.1'),
      port: Number(this.config.get('DB_PORT', 3306)),
      user: this.config.get('DB_USER', 'root'),
      password: this.config.get('DB_PASSWORD', '123456'),
      database: this.config.get('DB_NAME', 'database'),
      waitForConnections: true,
      connectionLimit: 10,
      charset: 'utf8mb4',
    });
    await this.waitUntilReady();
  }

  async query<T = mysql.RowDataPacket[]>(sql: string, params: Array<string | number> = []) {
    const [rows] = await this.pool.query(sql, params);
    return rows as T;
  }

  async execute(sql: string, params: Array<string | number> = []) {
    return this.pool.query(sql, params);
  }

  private async waitUntilReady(retries = 30) {
    let lastError: unknown;
    for (let i = 1; i <= retries; i += 1) {
      try {
        await this.pool.query('SELECT 1');
        return;
      } catch (error) {
        lastError = error;
        console.log(`[db] 等待 MySQL（${i}/${retries}）...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
    throw lastError;
  }
}
