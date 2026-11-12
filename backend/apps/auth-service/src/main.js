"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const auth_service_module_1 = require("./auth-service.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_service_module_1.AuthServiceModule);
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.AUTH_SERVICE_PORT || 4001;
    const host = process.env.HOST || '0.0.0.0';
    await app.listen(port, host);
    console.log(`🔐 [Auth Service] Running on http://${host}:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map