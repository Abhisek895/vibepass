"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeServiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../../../src/database/database.module");
const chat_module_1 = require("../../../src/modules/chat/chat.module");
const voice_module_1 = require("../../../src/modules/voice/voice.module");
const messages_module_1 = require("../../../src/modules/messages/messages.module");
const notifications_module_1 = require("../../../src/modules/notifications/notifications.module");
const event_bus_service_1 = require("../../../libs/contracts/src/event-bus.service");
let RealtimeHealthController = class RealtimeHealthController {
    check() {
        return { status: 'UP', service: 'realtime-service', timestamp: new Date().toISOString() };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RealtimeHealthController.prototype, "check", null);
RealtimeHealthController = __decorate([
    (0, common_1.Controller)('health')
], RealtimeHealthController);
let RealtimeServiceModule = class RealtimeServiceModule {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async onModuleInit() {
        await this.eventBus.subscribe('match.formed', (event) => {
            const matchEvent = event;
            console.log(`⚡ [Realtime Service] Match formed event received for User A: ${matchEvent.payload.userAId} and User B: ${matchEvent.payload.userBId}`);
        });
    }
};
exports.RealtimeServiceModule = RealtimeServiceModule;
exports.RealtimeServiceModule = RealtimeServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            chat_module_1.ChatModule,
            voice_module_1.VoiceModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [RealtimeHealthController],
        providers: [event_bus_service_1.EventBusService],
        exports: [event_bus_service_1.EventBusService],
    }),
    __metadata("design:paramtypes", [event_bus_service_1.EventBusService])
], RealtimeServiceModule);
//# sourceMappingURL=realtime-service.module.js.map