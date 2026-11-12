import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
import { DomainEvent } from './events';

@Injectable()
export class EventBusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventBusService.name);
  private readonly localEmitter = new EventEmitter();
  private redisPublisher: any = null;
  private redisSubscriber: any = null;
  private isRedisActive = false;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        const { createClient } = await import('redis');
        this.redisPublisher = createClient({
          url: redisUrl,
          socket: { reconnectStrategy: () => false },
        });
        this.redisSubscriber = createClient({
          url: redisUrl,
          socket: { reconnectStrategy: () => false },
        });

        this.redisPublisher.on('error', () => {
          this.isRedisActive = false;
        });
        this.redisSubscriber.on('error', () => {
          this.isRedisActive = false;
        });

        await Promise.all([this.redisPublisher.connect(), this.redisSubscriber.connect()]);
        this.isRedisActive = true;
        this.logger.log(`Connected to Redis Event Bus at ${redisUrl}`);
      } catch (err: any) {
        this.logger.warn(`Failed to connect Redis: ${err.message}. Using in-memory event bus.`);
        this.isRedisActive = false;
      }
    } else {
      this.logger.log('No REDIS_URL configured; operating with in-memory Event Bus.');
    }
  }

  async onModuleDestroy() {
    if (this.redisPublisher) {
      try {
        await this.redisPublisher.disconnect();
      } catch {}
    }
    if (this.redisSubscriber) {
      try {
        await this.redisSubscriber.disconnect();
      } catch {}
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    const channel = `vibepass.events.${event.eventType}`;
    const payload = JSON.stringify(event);

    this.logger.log(`[EventBus] Publishing ${event.eventType} (ID: ${event.eventId})`);

    // Emit locally within same process
    this.localEmitter.emit(event.eventType, event);
    this.localEmitter.emit('*', event);

    // If Redis is active, publish across microservice boundary
    if (this.isRedisActive && this.redisPublisher) {
      try {
        await this.redisPublisher.publish(channel, payload);
      } catch (err: any) {
        this.logger.error(`Failed to publish event to Redis: ${err.message}`);
      }
    }
  }

  async subscribe(
    eventType: string,
    handler: (event: DomainEvent) => void | Promise<void>,
  ): Promise<void> {
    this.logger.log(`[EventBus] Subscribing to event: ${eventType}`);

    // Subscribe to in-process events
    this.localEmitter.on(eventType, handler);

    // Subscribe to distributed Redis channel
    if (this.isRedisActive && this.redisSubscriber) {
      const channel = `vibepass.events.${eventType}`;
      try {
        await this.redisSubscriber.subscribe(channel, (message: string) => {
          try {
            const parsed = JSON.parse(message) as DomainEvent;
            handler(parsed);
          } catch (e: any) {
            this.logger.error(`Error parsing Redis message: ${e.message}`);
          }
        });
      } catch (err: any) {
        this.logger.error(`Failed to subscribe via Redis: ${err.message}`);
      }
    }
  }
}

