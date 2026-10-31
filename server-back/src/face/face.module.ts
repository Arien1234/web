import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { FaceController } from './face.controller';
import { FaceService } from './face.service';

@Module({
  imports: [AuthModule, AiModule],
  controllers: [FaceController],
  providers: [FaceService],
})
export class FaceModule {}
