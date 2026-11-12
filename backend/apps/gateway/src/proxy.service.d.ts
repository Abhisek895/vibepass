import { Request, Response } from 'express';
export declare class ReverseProxyService {
    private readonly logger;
    proxyRequest(targetBaseUrl: string, req: Request, res: Response, pathRewrite?: (path: string) => string): void;
}
