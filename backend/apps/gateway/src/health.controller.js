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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const http = require("http");
let HealthController = class HealthController {
    constructor() {
        this.services = [
            { name: 'auth-service', url: process.env.AUTH_SERVICE_URL || 'http://localhost:4001' },
            { name: 'matching-service', url: process.env.MATCHING_SERVICE_URL || 'http://localhost:4002' },
            { name: 'realtime-service', url: process.env.REALTIME_SERVICE_URL || 'http://localhost:4003' },
            { name: 'social-service', url: process.env.SOCIAL_SERVICE_URL || 'http://localhost:4004' },
            { name: 'safety-service', url: process.env.SAFETY_SERVICE_URL || 'http://localhost:4005' },
        ];
    }
    async getHealth() {
        const checks = await Promise.all(this.services.map(async (svc) => {
            const start = Date.now();
            const isUp = await this.pingService(svc.url);
            return {
                name: svc.name,
                url: svc.url,
                status: isUp ? 'UP' : 'DOWN',
                responseTimeMs: Date.now() - start,
            };
        }));
        const isAllHealthy = checks.every((c) => c.status === 'UP');
        return {
            status: isAllHealthy ? 'ok' : 'degraded',
            architecture: '10/10 Microservices Architecture',
            gateway: 'UP',
            timestamp: new Date().toISOString(),
            services: checks,
        };
    }
    async getApiV1Health() {
        return this.getHealth();
    }
    pingService(baseUrl) {
        return new Promise((resolve) => {
            try {
                const parsed = new URL(`${baseUrl}/health`);
                const req = http.get({
                    hostname: parsed.hostname,
                    port: parsed.port,
                    path: parsed.pathname,
                    timeout: 2000,
                }, (res) => {
                    resolve(res.statusCode === 200);
                });
                req.on('error', () => resolve(false));
                req.on('timeout', () => {
                    req.destroy();
                    resolve(false);
                });
            }
            catch {
                resolve(false);
            }
        });
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('api/v1/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getApiV1Health", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)()
], HealthController);
//# sourceMappingURL=health.controller.js.map