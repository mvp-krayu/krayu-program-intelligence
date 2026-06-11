// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet Platform — Deprecation Headers Middleware
// ══════════════════════════════════════════════════════════════

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { V1_SUNSET_DATE, V1_DEPRECATION_DATE, CURRENT_VERSION } from './versioning.config';

@Injectable()
export class DeprecationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Detect if request targets v1
    if (req.path.startsWith('/api/v1')) {
      // RFC 8594 Sunset header
      res.setHeader('Sunset', new Date(V1_SUNSET_DATE).toUTCString());
      // RFC 8594 Deprecation header
      res.setHeader('Deprecation', new Date(V1_DEPRECATION_DATE).toUTCString());
      // Link to v2 equivalent
      const v2Path = req.path.replace('/api/v1', '/api/v2');
      res.setHeader('Link', `<${v2Path}>; rel="successor-version"`);
      // Custom header with migration info
      res.setHeader('X-API-Deprecated', 'true');
      res.setHeader('X-API-Current-Version', `v${CURRENT_VERSION}`);
      res.setHeader('X-API-Sunset-Date', V1_SUNSET_DATE);
      // Warning header (RFC 7234)
      res.setHeader('Warning', `299 - "API v1 is deprecated. Migrate to v${CURRENT_VERSION} before ${V1_SUNSET_DATE}. See /api/v${CURRENT_VERSION}/docs"`);
    }

    // Add version headers to all responses
    res.setHeader('X-API-Version', req.path.match(/\/api\/v(\d+)/)?.[1] || CURRENT_VERSION);
    res.setHeader('X-Supported-Versions', '1, 2');

    next();
  }
}
