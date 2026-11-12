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
exports.SafetyServiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../../../src/database/database.module");
const safety_module_1 = require("../../../src/modules/safety/safety.module");
const admin_module_1 = require("../../../src/modules/admin/admin.module");
const event_bus_service_1 = require("../../../libs/contracts/src/event-bus.service");
let SafetyHealthController = class SafetyHealthController {
    check() {
        return { status: 'UP', service: 'safety-service', timestamp: new Date().toISOString() };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SafetyHealthController.prototype, "check", null);
SafetyHealthController = __decorate([
    (0, common_1.Controller)('health')
], SafetyHealthController);
let SafetyServiceModule = class SafetyServiceModule {
};
exports.SafetyServiceModule = SafetyServiceModule;
exports.SafetyServiceModule = SafetyServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            safety_module_1.SafetyModule,
            admin_module_1.AdminModule,
        ],
        controllers: [SafetyHealthController],
        providers: [event_bus_service_1.EventBusService],
        exports: [event_bus_service_1.EventBusService],
    })
], SafetyServiceModule);
//# sourceMappingURL=safety-service.module.js.map