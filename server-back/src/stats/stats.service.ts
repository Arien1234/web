import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

const HOME_VISITS = 'home_visits';

@Injectable()
export class StatsService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS site_counters (
        name VARCHAR(50) NOT NULL PRIMARY KEY,
        value BIGINT UNSIGNED NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    );
    await this.db.execute(
      `INSERT IGNORE INTO site_counters (name, value) VALUES (?, 0)`,
      [HOME_VISITS],
    );
  }

  async getHomeVisits() {
    const rows = await this.db.query<Array<{ value: number | string }>>(
      'SELECT value FROM site_counters WHERE name = ? LIMIT 1',
      [HOME_VISITS],
    );
    return Number(rows[0]?.value || 0);
  }

  async bumpHomeVisits() {
    await this.db.execute(
      `INSERT INTO site_counters (name, value) VALUES (?, 1)
       ON DUPLICATE KEY UPDATE value = value + 1`,
      [HOME_VISITS],
    );
    return this.getHomeVisits();
  }
}
