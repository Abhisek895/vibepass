import { NestFactory } from '@nestjs/core';
import { RealtimeServiceModule } from './realtime-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RealtimeServiceModule);
  app.enableCors({ origin: true, credentials: true });

  const port = process.env.REALTIME_SERVICE_PORT || 4003;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`💬 [Realtime Service] Running on http://${host}:${port}`);
}

bootstrap();

