import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FaceService } from './face.service';

const imageUpload = FileInterceptor('file', { limits: { fileSize: 8 * 1024 * 1024 } });

@Controller('face')
@UseGuards(JwtAuthGuard)
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Get('status')
  async status(@Req() req: { user: { id: number } }) {
    const data = await this.faceService.status(req.user.id);
    return { code: 0, data };
  }

  @Post('probe')
  @UseInterceptors(imageUpload)
  async probe(@UploadedFile() file?: Express.Multer.File) {
    this.requireFile(file);
    const data = await this.faceService.probe(file);
    return { code: 0, data };
  }

  @Post('miss')
  async miss(@Req() req: { user: { id: number } }) {
    await this.faceService.recordMiss(req.user.id);
    return { code: 0, message: '检测失败' };
  }

  @Post('checkin')
  @UseInterceptors(imageUpload)
  async checkIn(
    @Req() req: { user: { id: number } },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    this.requireFile(file);
    const data = await this.faceService.checkIn(req.user.id, file);
    return { code: 0, message: data.message, data };
  }

  @Get('records')
  async records(@Req() req: { user: { id: number; role?: string } }) {
    const data =
      req.user.role === 'admin'
        ? await this.faceService.attendance()
        : await this.faceService.myRecords(req.user.id);
    return { code: 0, data };
  }

  @Get('library')
  @UseGuards(AdminGuard)
  async library() {
    const data = await this.faceService.library();
    return { code: 0, data };
  }

  @Post('library')
  @UseGuards(AdminGuard)
  @UseInterceptors(imageUpload)
  async enrollForUser(
    @Body('userId', ParseIntPipe) userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    this.requireFile(file);
    const data = await this.faceService.enroll(userId, file);
    return { code: 0, message: '已写入人脸库', data };
  }

  @Delete('library/:userId')
  @UseGuards(AdminGuard)
  async remove(@Param('userId', ParseIntPipe) userId: number) {
    await this.faceService.removeProfile(userId);
    return { code: 0, message: '已移出人脸库' };
  }

  @Get('attendance')
  @UseGuards(AdminGuard)
  async attendance() {
    const data = await this.faceService.attendance();
    return { code: 0, data };
  }

  private requireFile(file?: Express.Multer.File): asserts file is Express.Multer.File {
    if (!file?.buffer?.length) {
      throw new BadRequestException('请先打开摄像头完成检测');
    }
  }
}
