import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrometheusService } from './prometheus.service';
import { MonitoringMiddleware } from './monitoring.middleware';
import { PerformanceMiddleware } from '../common/logging';

@Module({
  controllers: [HealthController],
  providers: [PerformanceMiddleware, PrometheusService],
  exports: [PrometheusService],
})
export class HealthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MonitoringMiddleware).forRoutes('*');
  }
}
