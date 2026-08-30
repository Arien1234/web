import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import { DatabaseService } from '../database/database.service';

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  password_hash: string;
  display_name: string;
  role: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  /** 补齐 role 字段并确保有系统管理员 */
  async onModuleInit() {
    await this.ensureRoleColumn();
    const username = this.config.get('ADMIN_USERNAME', 'admin');
    const rows = await this.db.query<UserRow[]>(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username],
    );
    if (rows.length) {
      await this.db.execute('UPDATE users SET role = ? WHERE username = ?', ['admin', username]);
      return;
    }
    const password = this.config.get('ADMIN_PASSWORD', 'admin123');
    const passwordHash = await bcrypt.hash(password, 10);
    await this.db.execute(
      'INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, '系统管理员', 'admin'],
    );
    console.log(`[auth] 已创建默认账号 ${username} / ${password}`);
  }

  /** 已有库没有 role 列时自动补上 */
  private async ensureRoleColumn() {
    try {
      await this.db.execute(
        "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色'",
      );
    } catch (error) {
      const errno = (error as { errno?: number }).errno;
      if (errno !== 1060) {
        throw error;
      }
    }
  }

  async login(username: string, password: string) {
    const rows = await this.db.query<UserRow[]>(
      'SELECT id, username, password_hash, display_name, role FROM users WHERE username = ? LIMIT 1',
      [username],
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return this.buildSession(user);
  }

  /** 注册成功后直接返回登录态，省去再填一次表单 */
  async register(payload: {
    username: string;
    password: string;
    displayName?: string;
  }) {
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
    const [result] = await this.db.execute(
      'INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, displayName, 'user'],
    );
    const insertId = (result as { insertId: number }).insertId;
    return this.buildSession({
      id: insertId,
      username,
      display_name: displayName,
      role: 'user',
    });
  }

  private buildSession(user: {
    id: number;
    username: string;
    display_name: string;
    role: string;
  }) {
    const secret = this.config.get<string>('JWT_SECRET') || 'lanzhi-ai-jwt-secret';
    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') || '7d';
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn } as jwt.SignOptions,
    );
    return {
      token,
      user: this.toPublicUser(user),
    };
  }

  toPublicUser(user: { id: number; username: string; display_name: string; role: string }) {
    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      role: user.role || 'user',
    };
  }

  async profile(userId: number) {
    const [user] = await this.db.query<UserRow[]>(
      'SELECT id, username, display_name, role FROM users WHERE id = ? LIMIT 1',
      [userId],
    );
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return this.toPublicUser(user);
  }
}
