import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';
import { SetMetadata } from '@nestjs/common';

// ──────── Rate Limit Tiers ────────

/**
 * Named rate limit configurations for different endpoint categories.
 * Applied via @Throttle() decorator or ThrottlerModule.forRoot()
 */
export const RATE_LIMIT_TIERS = {
  // Auth endpoints: strict to prevent brute force
  auth: { ttl: 60000, limit: 5 },        // 5 req/min

  // Write operations: moderate limits
  write: { ttl: 60000, limit: 30 },       // 30 req/min

  // Read operations: generous limits
  read: { ttl: 60000, limit: 100 },       // 100 req/min

  // Real-time/telemetry: high throughput
  telemetry: { ttl: 60000, limit: 500 },  // 500 req/min

  // Analytics/reports: moderate (expensive queries)
  analytics: { ttl: 60000, limit: 20 },   // 20 req/min

  // Admin operations
  admin: { ttl: 60000, limit: 50 },       // 50 req/min

  // Public/health endpoints
  public: { ttl: 60000, limit: 200 },     // 200 req/min
};

// ──────── Role-Based Multipliers ────────

const ROLE_MULTIPLIERS: Record<string, number> = {
  admin: 3.0,           // 3x limits
  fleet_manager: 2.0,   // 2x limits
  dispatcher: 1.5,      // 1.5x limits
  driver: 1.0,          // base limits
  customer: 0.5,        // restricted
  viewer: 0.8,          // slightly restricted
};

// ──────── Custom Throttler Guard ────────

@Injectable()
export class FleetThrottlerGuard extends ThrottlerGuard {
  /**
   * Extract client identifier: JWT user ID → API key → IP
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const userId = req.user?.sub;
    if (userId) return `user:${userId}`;

    const apiKey = req.headers?.['x-api-key'];
    if (apiKey) return `apikey:${apiKey}`;

    return req.ip || req.connection?.remoteAddress || 'unknown';
  }

  /**
   * Skip rate limiting for health checks and internal calls
   */
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.url || '';

    // Skip for health/readiness probes
    if (path.includes('/health') || path.includes('/ready')) return true;

    // Skip if marked with @SkipThrottle()
    return false;
  }

  /**
   * Apply role-based multiplier to rate limits
   */
  protected async getLimit(context: ExecutionContext): Promise<number> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.role || 'viewer';
    const multiplier = ROLE_MULTIPLIERS[userRole] || 1.0;

    // Get base limit from parent
    const baseLimit = await this.resolveLimitValue(context);
    return Math.ceil(baseLimit * multiplier);
  }

  private async resolveLimitValue(context: ExecutionContext): Promise<number> {
    // Check handler-level @Throttle() first, then controller-level
    const handlerLimit = this.reflector.getAllAndOverride<Array<{ limit: number }>>('THROTTLER:limit', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (handlerLimit?.[0]?.limit) return handlerLimit[0].limit;
    return RATE_LIMIT_TIERS.read.limit; // default
  }
}

// ──────── Skip Throttle Decorator ────────

export const SKIP_THROTTLE_KEY = 'throttle:skip';
export const SkipThrottle = () => SetMetadata(SKIP_THROTTLE_KEY, true);

// ──────── Throttler Module Config ────────

export const throttlerConfig: ThrottlerModuleOptions = [
  // Default tier: 100 requests per minute
  { name: 'default', ttl: 60000, limit: 100 },
  // Short burst tier: 10 requests per 10 seconds
  { name: 'burst', ttl: 10000, limit: 10 },
  // Daily limit: 10,000 requests per day
  { name: 'daily', ttl: 86400000, limit: 10000 },
];
