import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.AUTH_SERVICE_PORT || 4001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`🔐 [Auth Service] Running on http://${host}:${port}`);
}

bootstrap();

