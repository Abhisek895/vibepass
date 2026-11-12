"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const realtime_service_module_1 = require("./realtime-service.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(realtime_service_module_1.RealtimeServiceModule);
    app.enableCors({ origin: true, credentials: true });
    const port = process.env.REALTIME_SERVICE_PORT || 4003;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host);
    console.log(`💬 [Realtime Service] Running on http://${host}:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map