import { Injectable, Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly keyPrefix = 'blueedge:';

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  // ──────── Core Operations ────────

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const fullKey = this.prefixKey(key);
      const value = await this.cache.get<T>(fullKey);
      if (value !== undefined && value !== null) {
        this.logger.debug(`Cache HIT: ${fullKey}`);
      }
      return value ?? undefined;
    } catch (error) {
      this.logger.warn(`Cache GET error for ${key}: ${error.message}`);
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const fullKey = this.prefixKey(key);
      await this.cache.set(fullKey, value, ttlSeconds ? ttlSeconds * 1000 : undefined);
      this.logger.debug(`Cache SET: ${fullKey} (TTL: ${ttlSeconds ?? 'default'}s)`);
    } catch (error) {
      this.logger.warn(`Cache SET error for ${key}: ${error.message}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const fullKey = this.prefixKey(key);
      await this.cache.del(fullKey);
      this.logger.debug(`Cache DEL: ${fullKey}`);
    } catch (error) {
      this.logger.warn(`Cache DEL error for ${key}: ${error.message}`);
    }
  }

  // ──────── Pattern Invalidation ────────

  /**
   * Invalidate all cache keys matching given prefixes.
   * Used after mutations to clear stale data.
   * @example await invalidateByPrefix('vehicles', 'fleets')
   */
  async invalidateByPrefix(...prefixes: string[]): Promise<number> {
    let count = 0;
    try {
      const store = (this.cache as any).store;
      if (store?.keys) {
        for (const prefix of prefixes) {
          const pattern = `${this.keyPrefix}${prefix}:*`;
          const keys: string[] = await store.keys(pattern);
          if (keys.length > 0) {
            for (const key of keys) {
              await this.cache.del(key);
              count++;
            }
            this.logger.log(`Invalidated ${keys.length} keys matching ${pattern}`);
          }
        }
      }
    } catch (error) {
      this.logger.warn(`Pattern invalidation error: ${error.message}`);
    }
    return count;
  }

  /**
   * Invalidate cache for a specific entity by ID.
   * @example await invalidateEntity('vehicle', 'uuid-123')
   */
  async invalidateEntity(entity: string, id: string): Promise<void> {
    await this.del(`${entity}:${id}`);
    await this.invalidateByPrefix(`${entity}:list`);
  }

  // ──────── Fleet-Aware Caching ────────

  /**
   * Get or set pattern: fetch from cache, or compute + cache
   */
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds: number): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /**
   * Build a cache key from route parameters
   * @example buildKey('vehicles', 'list', { fleetId: 'abc', page: 1 })
   * → 'vehicles:list:fleetId=abc&page=1'
   */
  buildKey(entity: string, operation: string, params?: Record<string, any>): string {
    let key = `${entity}:${operation}`;
    if (params && Object.keys(params).length > 0) {
      const sorted = Object.keys(params)
        .filter(k => params[k] !== undefined && params[k] !== null)
        .sort()
        .map(k => `${k}=${params[k]}`)
        .join('&');
      if (sorted) key += `:${sorted}`;
    }
    return key;
  }

  // ──────── Stats & Health ────────

  async getStats(): Promise<{
    connected: boolean;
    keyCount?: number;
    memoryUsage?: string;
  }> {
    try {
      const store = (this.cache as any).store;
      if (store?.getClient) {
        const client = store.getClient();
        const info = await client.info('memory');
        const keyCount = await client.dbsize();
        const memMatch = info.match(/used_memory_human:(.+)/);
        return {
          connected: true,
          keyCount,
          memoryUsage: memMatch ? memMatch[1].trim() : 'unknown',
        };
      }
      return { connected: true };
    } catch {
      return { connected: false };
    }
  }

  async flushAll(): Promise<void> {
    try {
      const store = (this.cache as any).store;
      if (store?.getClient) {
        await store.getClient().flushdb();
        this.logger.warn('Cache flushed');
      } else {
        await this.cache.del('*');
      }
    } catch (error) {
      this.logger.error(`Cache flush error: ${error.message}`);
    }
  }

  // ──────── Internals ────────

  private prefixKey(key: string): string {
    return key.startsWith(this.keyPrefix) ? key : `${this.keyPrefix}${key}`;
  }

  onModuleDestroy() {
    this.logger.log('Cache service shutting down');
  }
}
