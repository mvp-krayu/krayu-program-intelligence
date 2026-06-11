import { SetMetadata, applyDecorators } from '@nestjs/common';

// Cache TTL values in seconds
export enum CacheTTL {
  REALTIME = 5,           // Live vehicle positions, alerts
  SHORT = 30,             // Dashboards, active trips
  MEDIUM = 300,           // Fleet lists, driver rosters (5 min)
  LONG = 1800,            // Analytics summaries (30 min)
  EXTENDED = 3600,        // Reports, compliance docs (1 hour)
  STATIC = 86400,         // Config, enum lookups (24 hours)
}

// Cache tier metadata keys
export const CACHE_TTL_KEY = 'cache:ttl';
export const CACHE_KEY_PREFIX = 'cache:prefix';
export const NO_CACHE_KEY = 'cache:skip';
export const CACHE_INVALIDATION_KEY = 'cache:invalidate';

/**
 * Set cache TTL for a specific endpoint
 * @example @HttpCacheTTL(CacheTTL.MEDIUM)
 */
export const HttpCacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_KEY, ttl);

/**
 * Set a custom cache key prefix for an endpoint
 * @example @CachePrefix('vehicles:list')
 */
export const CachePrefix = (prefix: string) => SetMetadata(CACHE_KEY_PREFIX, prefix);

/**
 * Skip caching for a specific endpoint
 * @example @NoCache()
 */
export const NoCache = () => SetMetadata(NO_CACHE_KEY, true);

/**
 * Mark which cache keys to invalidate when this mutation runs
 * @example @InvalidatesCache('vehicles', 'fleets')
 */
export const InvalidatesCache = (...prefixes: string[]) =>
  SetMetadata(CACHE_INVALIDATION_KEY, prefixes);

/**
 * Composite decorator: Cache a GET endpoint with TTL + prefix
 */
export const Cached = (ttl: number, prefix?: string) =>
  applyDecorators(
    HttpCacheTTL(ttl),
    ...(prefix ? [CachePrefix(prefix)] : []),
  );
