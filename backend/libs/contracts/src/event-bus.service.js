"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EventBusService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusService = void 0;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
let EventBusService = EventBusService_1 = class EventBusService {
    constructor() {
        this.logger = new common_1.Logger(EventBusService_1.name);
        this.localEmitter = new events_1.EventEmitter();
        this.redisPublisher = null;
        this.redisSubscriber = null;
        this.isRedisActive = false;
    }
    async onModuleInit() {
        const redisUrl = process.env.REDIS_URL;
        if (redisUrl) {
            try {
                const { createClient } = await Promise.resolve().then(() => require('redis'));
                this.redisPublisher = createClient({ url: redisUrl });
                this.redisSubscriber = createClient({ url: redisUrl });
                this.redisPublisher.on('error', (err) => {
                    this.logger.warn(`Redis publisher disconnected: ${err.message}. Using in-memory fallback.`);
                    this.isRedisActive = false;
                });
                await Promise.all([this.redisPublisher.connect(), this.redisSubscriber.connect()]);
                this.isRedisActive = true;
                this.logger.log(`Connected to Redis Event Bus at ${redisUrl}`);
            }
            catch (err) {
                this.logger.warn(`Failed to connect Redis: ${err.message}. Using in-memory event bus.`);
                this.isRedisActive = false;
            }
        }
        else {
            this.logger.log('No REDIS_URL configured; operating with in-memory Event Bus.');
        }
    }
    async onModuleDestroy() {
        if (this.redisPublisher) {
            try {
                await this.redisPublisher.disconnect();
            }
            catch { }
        }
        if (this.redisSubscriber) {
            try {
                await this.redisSubscriber.disconnect();
            }
            catch { }
        }
    }
    async publish(event) {
        const channel = `vibepass.events.${event.eventType}`;
        const payload = JSON.stringify(event);
        this.logger.log(`[EventBus] Publishing ${event.eventType} (ID: ${event.eventId})`);
        this.localEmitter.emit(event.eventType, event);
        this.localEmitter.emit('*', event);
        if (this.isRedisActive && this.redisPublisher) {
            try {
                await this.redisPublisher.publish(channel, payload);
            }
            catch (err) {
                this.logger.error(`Failed to publish event to Redis: ${err.message}`);
            }
        }
    }
    async subscribe(eventType, handler) {
        this.logger.log(`[EventBus] Subscribing to event: ${eventType}`);
        this.localEmitter.on(eventType, handler);
        if (this.isRedisActive && this.redisSubscriber) {
            const channel = `vibepass.events.${eventType}`;
            try {
                await this.redisSubscriber.subscribe(channel, (message) => {
                    try {
                        const parsed = JSON.parse(message);
                        handler(parsed);
                    }
                    catch (e) {
                        this.logger.error(`Error parsing Redis message: ${e.message}`);
                    }
                });
            }
            catch (err) {
                this.logger.error(`Failed to subscribe via Redis: ${err.message}`);
            }
        }
    }
};
exports.EventBusService = EventBusService;
exports.EventBusService = EventBusService = EventBusService_1 = __decorate([
    (0, common_1.Injectable)()
], EventBusService);
//# sourceMappingURL=event-bus.service.js.map