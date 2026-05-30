import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

function resolveCorsOrigins(): boolean | string[] {
  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
  }

  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  return frontendUrl
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from 'public' directory
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });
  
  // Enable CORS for frontend
  app.enableCors({
    origin: resolveCorsOrigins(),
    credentials: true,
  });

  // Global validation pipe for all DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`VibePass Backend running on http://${host}:${port}`);
}
bootstrap();
