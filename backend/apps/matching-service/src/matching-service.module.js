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
exports.MatchingServiceModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../../../src/database/database.module");
const matches_module_1 = require("../../../src/modules/matches/matches.module");
const lookups_module_1 = require("../../../src/modules/lookups/lookups.module");
const event_bus_service_1 = require("../../../libs/contracts/src/event-bus.service");
let MatchingHealthController = class MatchingHealthController {
    check() {
        return { status: 'UP', service: 'matching-service', timestamp: new Date().toISOString() };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MatchingHealthController.prototype, "check", null);
MatchingHealthController = __decorate([
    (0, common_1.Controller)('health')
], MatchingHealthController);
let MatchingServiceModule = class MatchingServiceModule {
};
exports.MatchingServiceModule = MatchingServiceModule;
exports.MatchingServiceModule = MatchingServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            matches_module_1.MatchesModule,
            lookups_module_1.LookupsModule,
        ],
        controllers: [MatchingHealthController],
        providers: [event_bus_service_1.EventBusService],
        exports: [event_bus_service_1.EventBusService],
    })
], MatchingServiceModule);
//# sourceMappingURL=matching-service.module.js.map