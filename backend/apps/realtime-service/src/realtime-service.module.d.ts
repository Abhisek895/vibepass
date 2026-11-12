import { OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../../libs/contracts/src/event-bus.service';
export declare class RealtimeServiceModule implements OnModuleInit {
    private readonly eventBus;
    constructor(eventBus: EventBusService);
    onModuleInit(): Promise<void>;
}
