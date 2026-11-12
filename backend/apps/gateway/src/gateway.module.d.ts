import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ReverseProxyService } from './proxy.service';
export declare class GatewayModule implements NestModule {
    private readonly proxyService;
    constructor(proxyService: ReverseProxyService);
    configure(consumer: MiddlewareConsumer): void;
}
