interface ServiceCheck {
    name: string;
    url: string;
    status: 'UP' | 'DOWN';
    responseTimeMs?: number;
}
export declare class HealthController {
    private readonly services;
    getHealth(): Promise<{
        status: string;
        architecture: string;
        gateway: string;
        timestamp: string;
        services: ServiceCheck[];
    }>;
    getApiV1Health(): Promise<{
        status: string;
        architecture: string;
        gateway: string;
        timestamp: string;
        services: ServiceCheck[];
    }>;
    private pingService;
}
export {};
