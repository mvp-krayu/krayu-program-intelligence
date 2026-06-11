import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

// Cache & Performance
import { RedisCacheModule, HttpCacheInterceptor } from './common/cache';
import { FleetThrottlerGuard, throttlerConfig } from './common/throttle/throttle.config';
import { HealthModule } from './health/health.module';

// Event-Driven Architecture
import { FleetEventsModule } from './events';

// Logging & Monitoring
import { getWinstonModuleOptions, RequestLoggingInterceptor, GlobalExceptionFilter, PerformanceMiddleware } from './common/logging';

// Auth
import { AuthModule } from './modules/auth/auth.module';

// Core domain modules
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { FleetsModule } from './modules/fleets/fleets.module';
import { TripsModule } from './modules/trips/trips.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { FuelModule } from './modules/fuel/fuel.module';

// Fleet-type modules
import { TankerModule } from './modules/tanker/tanker.module';
import { BusModule } from './modules/bus/bus.module';
import { TaxiModule } from './modules/taxi/taxi.module';

// Operations & infrastructure
import { OperationsModule } from './modules/operations/operations.module';
import { DevicesModule } from './modules/devices/devices.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// Analytics & reporting
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DiagnosticsModule } from './modules/diagnostics/diagnostics.module';

// Domain-specific
import { ComplianceModule } from './modules/compliance/compliance.module';
import { SafetyModule } from './modules/safety/safety.module';
import { FinanceModule } from './modules/finance/finance.module';

// Users
import { UsersModule } from './modules/users/users.module';

// Session 4 modules
import { ColdchainModule } from './modules/coldchain/coldchain.module';
import { EvModule } from './modules/ev/ev.module';
import { OtaModule } from './modules/ota/ota.module';
import { V2gModule } from './modules/v2g/v2g.module';

// Real-time WebSocket
import { GatewaysModule } from './gateways/gateways.module';

// Session 10: World-Class Gap Closure (16 new modules)
import { SurgePricingModule } from './modules/surge-pricing/surge-pricing.module';
import { DriverIncentivesModule } from './modules/driver-incentives/driver-incentives.module';
import { ElectrificationModule } from './modules/electrification/electrification.module';
import { DepotChargingModule } from './modules/depot-charging/depot-charging.module';
import { ExecutiveModule } from './modules/executive/executive.module';
import { AnomalyDetectionModule } from './modules/anomaly-detection/anomaly-detection.module';
import { CrossBorderModule } from './modules/cross-border/cross-border.module';
import { PermitsModule } from './modules/permits/permits.module';
import { PartsMarketplaceModule } from './modules/parts-marketplace/parts-marketplace.module';
import { FleetLifecycleModule } from './modules/fleet-lifecycle/fleet-lifecycle.module';
import { DriverMobileModule } from './modules/driver-mobile/driver-mobile.module';
import { FatigueRiskModule } from './modules/fatigue-risk/fatigue-risk.module';
import { CustomerPortalModule } from './modules/customer-portal/customer-portal.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { WhiteLabelModule } from './modules/white-label/white-label.module';
import { ChargingStationsModule } from './modules/charging-stations/charging-stations.module';

// Session 21: Advanced Features (5 modules)
import { PredictiveMaintenanceModule } from './modules/predictive-maintenance/predictive-maintenance.module';
import { DigitalTwinModule } from './modules/digital-twin/digital-twin.module';
import { DriverScoringModule } from './modules/driver-scoring/driver-scoring.module';
import { GeofenceAutomationModule } from './modules/geofence-automation/geofence-automation.module';
import { MessagingModule } from './modules/messaging/messaging.module';

// Session 23: Multi-Tenant SaaS
import { MultiTenantModule } from './modules/multi-tenant/multi-tenant.module';
import { BillingModule } from './modules/billing/billing.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';

// Session 24: Integration Layer
import { NotificationProvidersModule } from './modules/integration-notifications/integration-notifications.module';
import { ErpConnectorsModule } from './modules/erp-connectors/erp-connectors.module';
import { ApiMarketplaceModule } from './modules/api-marketplace/api-marketplace.module';
import { IntegrationHubModule } from './modules/integration-hub/integration-hub.module';
import { AgenticAIModule } from './modules/agentic-ai/agentic-ai.module';
import { AftersalesModule } from './modules/aftersales/aftersales.module';
import { RoadIntelligenceModule } from './modules/road-intelligence/road-intelligence.module';
import { DataMonetizationModule } from './modules/data-monetization/data-monetization.module';
import { DriverSessionsModule } from './modules/driver-sessions/driver-sessions.module';
import { VehicleLifecycleModule } from './modules/vehicle-lifecycle/vehicle-lifecycle.module';

// Sensors & Network Security (v3.23.0)
import { SensorsModule } from './modules/sensors/sensors.module';
import { HasiModule } from './modules/hasi/hasi.module';

// API Versioning (v1/v2)
import { V2Module, ApiVersionMiddleware } from './common/versioning';

// Configuration
import { appConfig, databaseConfig, jwtConfig, redisConfig } from './config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
    }),

    // Structured Logging (Winston)
    WinstonModule.forRoot(getWinstonModuleOptions()),

    // Rate limiting (multi-tier)
    ThrottlerModule.forRoot(throttlerConfig),

    // Redis cache (auto-fallback to in-memory)
    RedisCacheModule,

    // Event-Driven Architecture (domain events → WebSocket, cache, audit, notifications)
    FleetEventsModule,

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host', 'localhost'),
        port: config.get('database.port', 5432),
        username: config.get('database.username', 'blueedge'),
        password: config.get('database.password', 'blueedge_dev'),
        database: config.get('database.name', 'fleet_management'),
        autoLoadEntities: true,
        synchronize: config.get('database.synchronize', true),
        logging: config.get('database.logging', false),
        ssl: config.get('database.ssl', false),
      }),
    }),

    // Auth
    AuthModule,

    // Core domains (7 modules, 66 endpoints)
    VehiclesModule,
    DriversModule,
    FleetsModule,
    TripsModule,
    AlertsModule,
    MaintenanceModule,
    FuelModule,

    // Fleet-type specific (3 modules, 32 endpoints)
    TankerModule,
    BusModule,
    TaxiModule,

    // Operations & infrastructure (3 modules, 27 endpoints)
    OperationsModule,
    DevicesModule,
    NotificationsModule,

    // Analytics & reporting (3 modules, 20 endpoints)
    AnalyticsModule,
    ReportsModule,
    DiagnosticsModule,

    // Domain-specific (3 modules, 19 endpoints)
    ComplianceModule,
    SafetyModule,
    FinanceModule,

    // Users (1 module, 5 endpoints)
    UsersModule,

    // Session 4: Stub modules (4 modules, ~43 endpoints)
    ColdchainModule,
    EvModule,
    OtaModule,
    V2gModule,

    // Session 10: World-Class modules (16 modules, ~115 endpoints)
    SurgePricingModule,
    DriverIncentivesModule,
    ElectrificationModule,
    DepotChargingModule,
    ExecutiveModule,
    AnomalyDetectionModule,
    CrossBorderModule,
    PermitsModule,
    PartsMarketplaceModule,
    FleetLifecycleModule,
    DriverMobileModule,
    FatigueRiskModule,
    CustomerPortalModule,
    BlockchainModule,
    WhiteLabelModule,
    ChargingStationsModule,

    // Real-time WebSocket gateway
    GatewaysModule,

    // Session 21: Advanced Features (5 modules, ~55 endpoints)
    PredictiveMaintenanceModule,
    DigitalTwinModule,
    DriverScoringModule,
    GeofenceAutomationModule,
    MessagingModule,

    // Session 23: Multi-Tenant SaaS
    MultiTenantModule,
    BillingModule,
    OnboardingModule,

    // Health & monitoring
    HealthModule,

    // Session 24: Integration Layer (4 modules, ~70 endpoints)
    NotificationProvidersModule,
    ErpConnectorsModule,
    ApiMarketplaceModule,
    IntegrationHubModule,
    AgenticAIModule,
    AftersalesModule,
    RoadIntelligenceModule,
    DataMonetizationModule,

    // Session 32: Vehicle 360° Lifecycle Intelligence (2 modules, ~18 endpoints)
    DriverSessionsModule,
    VehicleLifecycleModule,

    // Session 33: External Sensors + HASI Network Security (2 modules, ~25 endpoints)
    SensorsModule,
    HasiModule,

    // API v2 controllers (enhanced responses, cursor pagination)
    V2Module,
  ],
  providers: [
    // Global rate limiting guard (role-aware)
    { provide: APP_GUARD, useClass: FleetThrottlerGuard },
    // Global HTTP cache interceptor
    { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
    // Global request logging (correlation IDs, timing)
    { provide: APP_INTERCEPTOR, useClass: RequestLoggingInterceptor },
    // Global exception filter (structured error responses)
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    // Performance metrics middleware
    PerformanceMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiVersionMiddleware, PerformanceMiddleware).forRoutes('*');
  }
}
