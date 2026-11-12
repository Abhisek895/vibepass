"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReverseProxyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReverseProxyService = void 0;
const common_1 = require("@nestjs/common");
const http = require("http");
const url = require("url");
let ReverseProxyService = ReverseProxyService_1 = class ReverseProxyService {
    constructor() {
        this.logger = new common_1.Logger(ReverseProxyService_1.name);
    }
    proxyRequest(targetBaseUrl, req, res, pathRewrite) {
        const targetUrl = new url.URL(targetBaseUrl);
        let finalPath = req.originalUrl;
        if (pathRewrite) {
            finalPath = pathRewrite(finalPath);
        }
        const headers = {
            ...req.headers,
            host: targetUrl.host,
            'x-forwarded-for': req.ip || req.socket.remoteAddress || '',
            'x-forwarded-proto': req.protocol,
            'x-forwarded-host': req.headers.host || '',
            'x-request-id': req.headers['x-request-id'] || `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
        };
        const options = {
            hostname: targetUrl.hostname,
            port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
            path: finalPath,
            method: req.method,
            headers: headers,
            timeout: 30000,
        };
        const proxyReq = http.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });
        proxyReq.on('error', (err) => {
            this.logger.error(`Proxy forwarding error to ${targetBaseUrl}${finalPath}: ${err.message}`);
            if (!res.headersSent) {
                res.status(502).json({
                    statusCode: 502,
                    message: `Bad Gateway: Unable to reach downstream service at ${targetBaseUrl}`,
                    error: err.message,
                    path: finalPath,
                });
            }
        });
        proxyReq.on('timeout', () => {
            proxyReq.destroy();
            if (!res.headersSent) {
                res.status(504).json({
                    statusCode: 504,
                    message: `Gateway Timeout: Downstream service timed out`,
                    path: finalPath,
                });
            }
        });
        if (req.readable) {
            req.pipe(proxyReq, { end: true });
        }
        else {
            proxyReq.end();
        }
    }
};
exports.ReverseProxyService = ReverseProxyService;
exports.ReverseProxyService = ReverseProxyService = ReverseProxyService_1 = __decorate([
    (0, common_1.Injectable)()
], ReverseProxyService);
//# sourceMappingURL=proxy.service.js.map