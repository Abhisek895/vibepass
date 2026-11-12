import { NestFactory } from '@nestjs/core';
import { MatchingServiceModule } from './matching-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MatchingServiceModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.MATCHING_SERVICE_PORT || 4002;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`🎯 [Matching Service] Running on http://${host}:${port}`);
}

bootstrap();

