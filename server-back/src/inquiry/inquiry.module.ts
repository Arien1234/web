import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [AuthModule],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
