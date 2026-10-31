import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { FaceModule } from './face/face.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    InquiryModule,
    StatsModule,
    AiModule,
    FaceModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
