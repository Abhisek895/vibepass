"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const gateway_module_1 = require("./gateway.module");
const net = require("net");
function resolveCorsOrigins() {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
    }
    if (process.env.NODE_ENV !== 'production') {
        return true;
    }
    return frontendUrl.split(',').map((origin) => origin.trim()).filter(Boolean);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(gateway_module_1.GatewayModule);
    app.enableCors({
        origin: resolveCorsOrigins(),
        credentials: true,
    });
    const server = app.getHttpServer();
    const realtimeUrl = new URL(process.env.REALTIME_SERVICE_URL || 'http://localhost:4003');
    server.on('upgrade', (req, socket, head) => {
        if (req.url && (req.url.startsWith('/socket.io') || req.url.startsWith('/ws'))) {
            const proxySocket = net.connect(Number(realtimeUrl.port) || 4003, realtimeUrl.hostname || 'localhost', () => {
                proxySocket.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
                    Object.entries(req.headers)
                        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}\r\n`)
                        .join('') +
                    '\r\n');
                proxySocket.write(head);
                socket.pipe(proxySocket).pipe(socket);
            });
            proxySocket.on('error', (err) => {
                console.error('[Gateway] WebSocket proxy error:', err.message);
                socket.destroy();
            });
        }
    });
    const port = process.env.PORT || 3003;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host);
    console.log(`=======================================================`);
    console.log(`🚀 [API Gateway] Running on http://${host}:${port}`);
    console.log(`   Dispatching to:`);
    console.log(`   - Auth Service:     ${process.env.AUTH_SERVICE_URL || 'http://localhost:4001'}`);
    console.log(`   - Matching Service: ${process.env.MATCHING_SERVICE_URL || 'http://localhost:4002'}`);
    console.log(`   - Realtime Service: ${process.env.REALTIME_SERVICE_URL || 'http://localhost:4003'}`);
    console.log(`   - Social Service:   ${process.env.SOCIAL_SERVICE_URL || 'http://localhost:4004'}`);
    console.log(`   - Safety Service:   ${process.env.SAFETY_SERVICE_URL || 'http://localhost:4005'}`);
    console.log(`=======================================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map