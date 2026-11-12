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
exports.SocialServiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../../../src/database/database.module");
const posts_module_1 = require("../../../src/modules/posts/posts.module");
const rooms_module_1 = require("../../../src/modules/rooms/rooms.module");
const event_bus_service_1 = require("../../../libs/contracts/src/event-bus.service");
let SocialHealthController = class SocialHealthController {
    check() {
        return { status: 'UP', service: 'social-service', timestamp: new Date().toISOString() };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SocialHealthController.prototype, "check", null);
SocialHealthController = __decorate([
    (0, common_1.Controller)('health')
], SocialHealthController);
let SocialServiceModule = class SocialServiceModule {
};
exports.SocialServiceModule = SocialServiceModule;
exports.SocialServiceModule = SocialServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            posts_module_1.PostsModule,
            rooms_module_1.RoomsModule,
        ],
        controllers: [SocialHealthController],
        providers: [event_bus_service_1.EventBusService],
        exports: [event_bus_service_1.EventBusService],
    })
], SocialServiceModule);
//# sourceMappingURL=social-service.module.js.map