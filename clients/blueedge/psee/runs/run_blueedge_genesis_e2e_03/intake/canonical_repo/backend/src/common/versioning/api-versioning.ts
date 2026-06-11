/**
 * Blue Edge Fleet — API Versioning Infrastructure
 * 
 * Strategy: URI-based versioning (api/v1/*, api/v2/*)
 * - v1: Current stable (all 214+ endpoints)
 * - v2: Next-gen with enhanced responses, pagination cursors, and envelope changes
 * - Deprecation headers per RFC 8594 (Sunset header)
 * - Version negotiation middleware
 */
import {
  Injectable,
  NestMiddleware,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable, map } from 'rxjs';

// ── Version Configuration ─────────────────────────────────────

export const API_VERSIONS = {
  V1: '1',
  V2: '2',
} as const;

export const VERSION_CONFIG = {
  current: API_VERSIONS.V2,
  supported: [API_VERSIONS.V1, API_VERSIONS.V2],
  deprecated: [API_VERSIONS.V1],
  sunset: {
    [API_VERSIONS.V1]: '2027-06-30T00:00:00Z', // v1 sunset date
  },
  default: API_VERSIONS.V1, // Default for unversioned requests
};

// ── Deprecation Header Middleware ──────────────────────────────

@Injectable()
export class ApiVersionMiddleware implements NestMiddleware {
  private readonly logger = new Logger('ApiVersion');

  use(req: Request, res: Response, next: NextFunction) {
    // Extract version from URI path
    const versionMatch = req.originalUrl.match(/\/api\/v(\d+)\//);
    const version = versionMatch ? versionMatch[1] : VERSION_CONFIG.default;

    // Inject version into request for downstream use
    (req as any).apiVersion = version;

    // Add standard version headers
    res.setHeader('X-API-Version', version);
    res.setHeader('X-API-Supported-Versions', VERSION_CONFIG.supported.join(', '));
    res.setHeader('X-API-Current-Version', VERSION_CONFIG.current);

    // Add deprecation headers for deprecated versions (RFC 8594)
    if (VERSION_CONFIG.deprecated.includes(version as any)) {
      res.setHeader('Deprecation', 'true');
      res.setHeader('Link', `</api/v${VERSION_CONFIG.current}>; rel="successor-version"`);

      const sunsetDate = VERSION_CONFIG.sunset[version];
      if (sunsetDate) {
        res.setHeader('Sunset', new Date(sunsetDate).toUTCString());
      }

      // Log deprecated version usage (sampled)
      if (Math.random() < 0.01) {
        this.logger.warn(`Deprecated API v${version} called: ${req.method} ${req.originalUrl}`);
      }
    }

    next();
  }
}

// ── V2 Response Envelope Interceptor ──────────────────────────
// V2 uses a standardized envelope with request metadata

@Injectable()
export class V2ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const version = (req as any).apiVersion;

    // Only transform v2 responses
    if (version !== API_VERSIONS.V2) return next.handle();

    const start = Date.now();

    return next.handle().pipe(
      map((data) => {
        // If already wrapped in our envelope, enhance it
        if (data?.success !== undefined) {
          return {
            ...data,
            _meta: {
              apiVersion: 'v2',
              timestamp: new Date().toISOString(),
              requestId: req.headers['x-request-id'] || crypto.randomUUID?.() || 'n/a',
              latencyMs: Date.now() - start,
              ...(data.meta ? { pagination: data.meta } : {}),
            },
          };
        }

        // Wrap raw responses
        return {
          success: true,
          data,
          _meta: {
            apiVersion: 'v2',
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'] || 'n/a',
            latencyMs: Date.now() - start,
          },
        };
      }),
    );
  }
}

// ── Version Extraction Helper ─────────────────────────────────

export function getApiVersion(req: Request): string {
  return (req as any).apiVersion || VERSION_CONFIG.default;
}

export function isV2(req: Request): boolean {
  return getApiVersion(req) === API_VERSIONS.V2;
}
