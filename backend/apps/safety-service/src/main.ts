import { NestFactory } from '@nestjs/core';
import { SafetyServiceModule } from './safety-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SafetyServiceModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.SAFETY_SERVICE_PORT || 4005;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`🛡️ [Safety & Moderation Service] Running on http://${host}:${port}`);
}

bootstrap();

