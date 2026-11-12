import { NestFactory } from '@nestjs/core';
import { SocialServiceModule } from './social-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SocialServiceModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.SOCIAL_SERVICE_PORT || 4004;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`🌐 [Social Service] Running on http://${host}:${port}`);
}

bootstrap();

