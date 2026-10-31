import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PythonClient } from './python.client';

@Module({
  imports: [AuthModule],
  controllers: [AiController],
  providers: [AiService, PythonClient],
  exports: [PythonClient],
})
export class AiModule {}
