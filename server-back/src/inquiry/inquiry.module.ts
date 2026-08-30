import { Module } from '@nestjs/common';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
