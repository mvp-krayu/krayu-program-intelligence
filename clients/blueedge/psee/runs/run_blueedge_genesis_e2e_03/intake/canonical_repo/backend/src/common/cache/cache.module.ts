import { Module, Global, Logger } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { HttpCacheInterceptor } from './http-cache.interceptor';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisHost = config.get('redis.host', 'localhost');
        const redisPort = config.get('redis.port', 6379);
        const defaultTtl = config.get('redis.defaultTtl', 300);
        const logger = new Logger('CacheModule');

        try {
          // Attempt Redis connection
          const { redisStore } = await import('cache-manager-ioredis-yet');
          logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
          return {
            store: redisStore,
            host: redisHost,
            port: redisPort,
            password: config.get('redis.password'),
            db: config.get('redis.db', 0),
            ttl: defaultTtl * 1000, // cache-manager uses ms
            keyPrefix: config.get('redis.keyPrefix', 'blueedge:'),
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            enableReadyCheck: true,
          };
        } catch (error) {
          // Fallback to in-memory cache
          logger.warn(`Redis unavailable (${error.message}). Using in-memory cache.`);
          return {
            ttl: defaultTtl * 1000,
            max: 1000, // max items in memory
          };
        }
      },
    }),
  ],
  providers: [CacheService, HttpCacheInterceptor],
  exports: [CacheService, HttpCacheInterceptor, NestCacheModule],
})
export class RedisCacheModule {}
