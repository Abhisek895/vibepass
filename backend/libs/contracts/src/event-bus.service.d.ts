import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DomainEvent } from './events';
export declare class EventBusService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private readonly localEmitter;
    private redisPublisher;
    private redisSubscriber;
    private isRedisActive;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    publish(event: DomainEvent): Promise<void>;
    subscribe(eventType: string, handler: (event: DomainEvent) => void | Promise<void>): Promise<void>;
}
