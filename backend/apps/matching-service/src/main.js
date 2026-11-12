"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const matching_service_module_1 = require("./matching-service.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(matching_service_module_1.MatchingServiceModule);
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.MATCHING_SERVICE_PORT || 4002;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host);
    console.log(`🎯 [Matching Service] Running on http://${host}:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map