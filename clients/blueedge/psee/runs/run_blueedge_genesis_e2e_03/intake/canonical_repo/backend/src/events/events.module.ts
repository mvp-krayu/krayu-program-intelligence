import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FleetEventEmitter } from './fleet-event-emitter.service';
import { WebSocketBroadcastHandler } from './handlers/websocket-broadcast.handler';
import { CacheInvalidationHandler } from './handlers/cache-invalidation.handler';
import { AuditLogHandler } from './handlers/audit-log.handler';
import { NotificationHandler } from './handlers/notification.handler';
import { GatewaysModule } from '../gateways/gateways.module';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,            // Enable 'vehicle.*' pattern matching
      delimiter: '.',            // Use dot notation for event hierarchy
      maxListeners: 20,          // Per event name
      verboseMemoryLeak: true,   // Warn on listener leaks
      ignoreErrors: false,       // Don't swallow handler errors
    }),
    GatewaysModule,
  ],
  providers: [
    FleetEventEmitter,
    WebSocketBroadcastHandler,
    CacheInvalidationHandler,
    AuditLogHandler,
    NotificationHandler,
  ],
  exports: [FleetEventEmitter],
})
export class FleetEventsModule {}
