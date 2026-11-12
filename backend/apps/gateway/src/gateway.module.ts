import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReverseProxyService } from './proxy.service';
import { HealthController } from './health.controller';
import { CorrelationIdMiddleware } from '../../../libs/common/src/correlation-id.middleware';
import { Request, Response, NextFunction } from 'express';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController],
  providers: [ReverseProxyService],
})
export class GatewayModule implements NestModule {
  constructor(private readonly proxyService: ReverseProxyService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');

    // Microservice Route Dispatcher
    const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
    const matchUrl = process.env.MATCHING_SERVICE_URL || 'http://localhost:4002';
    const realtimeUrl = process.env.REALTIME_SERVICE_URL || 'http://localhost:4003';
    const socialUrl = process.env.SOCIAL_SERVICE_URL || 'http://localhost:4004';
    const safetyUrl = process.env.SAFETY_SERVICE_URL || 'http://localhost:4005';

    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const path = req.path;

        // Skip health endpoints handled directly by Gateway
        if (path === '/health' || path === '/api/v1/health') {
          return next();
        }

        // Auth & Identity routes
        if (path.startsWith('/auth') || path.startsWith('/api/v1/auth') || 
            path.startsWith('/users') || path.startsWith('/api/v1/users')) {
          return this.proxyService.proxyRequest(authUrl, req, res);
        }

        // Matching & Discovery routes
        if (path.startsWith('/matches') || path.startsWith('/api/v1/matches') ||
            path.startsWith('/prompts') || path.startsWith('/api/v1/prompts') ||
            path.startsWith('/moods') || path.startsWith('/api/v1/moods')) {
          return this.proxyService.proxyRequest(matchUrl, req, res);
        }

        // Realtime Chat & WebRTC routes
        if (path.startsWith('/chat') || path.startsWith('/api/v1/chat') ||
            path.startsWith('/voice') || path.startsWith('/api/v1/voice') ||
            path.startsWith('/messages') || path.startsWith('/api/v1/messages')) {
          return this.proxyService.proxyRequest(realtimeUrl, req, res);
        }

        // Social & Room routes
        if (path.startsWith('/posts') || path.startsWith('/api/v1/posts') ||
            path.startsWith('/rooms') || path.startsWith('/api/v1/rooms')) {
          return this.proxyService.proxyRequest(socialUrl, req, res);
        }

        // Safety, Moderation & Admin routes
        if (path.startsWith('/safety') || path.startsWith('/api/v1/safety') ||
            path.startsWith('/reports') || path.startsWith('/api/v1/reports') ||
            path.startsWith('/admin') || path.startsWith('/api/v1/admin')) {
          return this.proxyService.proxyRequest(safetyUrl, req, res);
        }

        // Default: If route is unrecognized, fallback to next()
        next();
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

