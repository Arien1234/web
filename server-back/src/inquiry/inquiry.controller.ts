import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InquiryDto } from '../common/dto';
import { InquiryService } from './inquiry.service';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  /** 官网公开提交 */
  @Post()
  async create(@Body() body: InquiryDto) {
    await this.inquiryService.create(body);
    return { code: 0, message: '已收到留言' };
  }

  /** 系统管理员查看留言箱 */
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async list() {
    const data = await this.inquiryService.list();
    return { code: 0, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.inquiryService.remove(id);
    return { code: 0, message: '已删除' };
  }
}
