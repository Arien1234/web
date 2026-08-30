import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMemberDto, UpdateMemberDto } from '../common/dto';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async list() {
    const data = await this.usersService.list();
    return { code: 0, data };
  }

  @Post()
  async create(@Body() body: CreateMemberDto) {
    const data = await this.usersService.create(body);
    return { code: 0, message: '已添加成员', data };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateMemberDto) {
    const data = await this.usersService.update(id, body);
    return { code: 0, message: '已保存', data };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
  ) {
    await this.usersService.remove(id, req.user.id);
    return { code: 0, message: '已删除' };
  }
}
