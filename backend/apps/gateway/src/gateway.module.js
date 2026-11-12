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
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const proxy_service_1 = require("./proxy.service");
const health_controller_1 = require("./health.controller");
const correlation_id_middleware_1 = require("../../../libs/common/src/correlation-id.middleware");
let GatewayModule = class GatewayModule {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    configure(consumer) {
        consumer.apply(correlation_id_middleware_1.CorrelationIdMiddleware).forRoutes('*');
        const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
        const matchUrl = process.env.MATCHING_SERVICE_URL || 'http://localhost:4002';
        const realtimeUrl = process.env.REALTIME_SERVICE_URL || 'http://localhost:4003';
        const socialUrl = process.env.SOCIAL_SERVICE_URL || 'http://localhost:4004';
        const safetyUrl = process.env.SAFETY_SERVICE_URL || 'http://localhost:4005';
        consumer
            .apply((req, res, next) => {
            const path = req.path;
            if (path === '/health' || path === '/api/v1/health') {
                return next();
            }
            if (path.startsWith('/auth') || path.startsWith('/api/v1/auth') ||
                path.startsWith('/users') || path.startsWith('/api/v1/users')) {
                return this.proxyService.proxyRequest(authUrl, req, res);
            }
            if (path.startsWith('/matches') || path.startsWith('/api/v1/matches') ||
                path.startsWith('/prompts') || path.startsWith('/api/v1/prompts') ||
                path.startsWith('/moods') || path.startsWith('/api/v1/moods')) {
                return this.proxyService.proxyRequest(matchUrl, req, res);
            }
            if (path.startsWith('/chat') || path.startsWith('/api/v1/chat') ||
                path.startsWith('/voice') || path.startsWith('/api/v1/voice') ||
                path.startsWith('/messages') || path.startsWith('/api/v1/messages')) {
                return this.proxyService.proxyRequest(realtimeUrl, req, res);
            }
            if (path.startsWith('/posts') || path.startsWith('/api/v1/posts') ||
                path.startsWith('/rooms') || path.startsWith('/api/v1/rooms')) {
                return this.proxyService.proxyRequest(socialUrl, req, res);
            }
            if (path.startsWith('/safety') || path.startsWith('/api/v1/safety') ||
                path.startsWith('/reports') || path.startsWith('/api/v1/reports') ||
                path.startsWith('/admin') || path.startsWith('/api/v1/admin')) {
                return this.proxyService.proxyRequest(safetyUrl, req, res);
            }
            next();
        })
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
        controllers: [health_controller_1.HealthController],
        providers: [proxy_service_1.ReverseProxyService],
    }),
    __metadata("design:paramtypes", [proxy_service_1.ReverseProxyService])
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map