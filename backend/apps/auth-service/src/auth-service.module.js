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
exports.AuthServiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../../../src/database/database.module");
const auth_module_1 = require("../../../src/modules/auth/auth.module");
const users_module_1 = require("../../../src/modules/users/users.module");
const event_bus_service_1 = require("../../../libs/contracts/src/event-bus.service");
let AuthHealthController = class AuthHealthController {
    check() {
        return { status: 'UP', service: 'auth-service', timestamp: new Date().toISOString() };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthHealthController.prototype, "check", null);
AuthHealthController = __decorate([
    (0, common_1.Controller)('health')
], AuthHealthController);
let AuthServiceModule = class AuthServiceModule {
};
exports.AuthServiceModule = AuthServiceModule;
exports.AuthServiceModule = AuthServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        controllers: [AuthHealthController],
        providers: [event_bus_service_1.EventBusService],
        exports: [event_bus_service_1.EventBusService],
    })
], AuthServiceModule);
//# sourceMappingURL=auth-service.module.js.map