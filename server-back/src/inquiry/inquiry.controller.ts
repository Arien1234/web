import { Body, Controller, Post } from '@nestjs/common';
import { InquiryDto } from '../common/dto';
import { InquiryService } from './inquiry.service';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  async create(@Body() body: InquiryDto) {
    await this.inquiryService.create(body);
    return { code: 0, message: '已收到留言' };
  }
}
