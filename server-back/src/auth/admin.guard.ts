import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

/** 仅系统管理员可通过：以数据库中的 role 为准 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & { user?: { id: number } }>();
    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('仅系统管理员可操作');
    }
    const profile = await this.authService.profile(userId);
    if (profile.role !== 'admin') {
      throw new ForbiddenException('仅系统管理员可管理成员名单');
    }
    return true;
  }
}
