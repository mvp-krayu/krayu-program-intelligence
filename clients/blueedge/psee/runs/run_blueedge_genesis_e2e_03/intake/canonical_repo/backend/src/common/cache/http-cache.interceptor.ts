import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from './cache.service';
import {
  CACHE_TTL_KEY,
  CACHE_KEY_PREFIX,
  NO_CACHE_KEY,
  CACHE_INVALIDATION_KEY,
} from './cache.decorators';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method?.toUpperCase();

    // Skip caching if @NoCache() is set
    const noCache = this.reflector.getAllAndOverride<boolean>(NO_CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (noCache) return next.handle();

    // For mutations (POST/PUT/PATCH/DELETE), handle cache invalidation
    if (method !== 'GET') {
      return this.handleMutation(context, next);
    }

    // For GET requests, check cache TTL decorator
    const ttl = this.reflector.getAllAndOverride<number>(CACHE_TTL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No TTL decorator = no caching
    if (ttl === undefined || ttl === null) return next.handle();

    // Build cache key from request
    const cacheKey = this.buildCacheKey(context, request);

    // Try cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached !== undefined) {
      this.logger.debug(`Cache HIT: ${method} ${request.url}`);
      return of(cached);
    }

    // Cache MISS — execute handler and cache result
    this.logger.debug(`Cache MISS: ${method} ${request.url}`);
    return next.handle().pipe(
      tap(async (response) => {
        if (response !== undefined && response !== null) {
          await this.cacheService.set(cacheKey, response, ttl);
        }
      }),
    );
  }

  private handleMutation(context: ExecutionContext, next: CallHandler): Observable<any> {
    const invalidationPrefixes = this.reflector.getAllAndOverride<string[]>(
      CACHE_INVALIDATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!invalidationPrefixes?.length) return next.handle();

    return next.handle().pipe(
      tap(async () => {
        await this.cacheService.invalidateByPrefix(...invalidationPrefixes);
      }),
    );
  }

  private buildCacheKey(context: ExecutionContext, request: any): string {
    // Use custom prefix if set
    const prefix = this.reflector.getAllAndOverride<string>(CACHE_KEY_PREFIX, [
      context.getHandler(),
      context.getClass(),
    ]);

    const controller = context.getClass().name.replace('Controller', '').toLowerCase();
    const handler = context.getHandler().name;
    const baseKey = prefix || `${controller}:${handler}`;

    // Include query params and route params in key
    const params = { ...request.params, ...request.query };
    const userId = request.user?.sub;

    // Add user context for personalized responses
    if (userId) params._uid = userId;

    return this.cacheService.buildKey('http', baseKey, params);
  }
}
