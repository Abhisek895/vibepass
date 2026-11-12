import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as http from 'http';
import * as url from 'url';

@Injectable()
export class ReverseProxyService {
  private readonly logger = new Logger(ReverseProxyService.name);

  proxyRequest(targetBaseUrl: string, req: Request, res: Response, pathRewrite?: (path: string) => string) {
    const targetUrl = new url.URL(targetBaseUrl);
    let finalPath = req.originalUrl;
    if (pathRewrite) {
      finalPath = pathRewrite(finalPath);
    }

    const headers: http.OutgoingHttpHeaders = {
      ...req.headers,
      host: targetUrl.host,
      'x-forwarded-for': req.ip || req.socket.remoteAddress || '',
      'x-forwarded-proto': req.protocol,
      'x-forwarded-host': req.headers.host || '',
      'x-request-id': req.headers['x-request-id'] || `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
    };

    let bodyData: string | Buffer | null = null;
    if (req.body && Object.keys(req.body).length > 0) {
      bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      headers['content-length'] = Buffer.byteLength(bodyData);
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
    }

    const options: http.RequestOptions = {
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

    if (bodyData) {
      proxyReq.write(bodyData);
      proxyReq.end();
    } else if (req.readable) {
      req.pipe(proxyReq, { end: true });
    } else {
      proxyReq.end();
    }
  }
}

