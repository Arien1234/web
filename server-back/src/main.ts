import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const port = Number(process.env.PORT ?? 3000);
  // Docker 内必须监听所有网卡，不能只绑 127.0.0.1
  await app.listen(port, '0.0.0.0');
  console.log(`[server] http://0.0.0.0:${port}/api`);
}

bootstrap();
