import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { V2ResponseInterceptor } from './common/versioning';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer until Winston is ready
  });

  // Use Winston as NestJS logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger = new Logger('Bootstrap');

  // Global prefix — excludes health endpoints for Docker/k8s probes
  app.setGlobalPrefix('api', {
    exclude: ['health', 'health/ready', 'health/metrics', 'health/cache/stats', 'health/cache/flush'],
  });

  // API Versioning — URI-based (/api/v1/*, /api/v2/*)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // V2 Response Envelope Interceptor
  app.useGlobalInterceptors(new V2ResponseInterceptor());

  // CORS
  app.enableCors({
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Blue Edge Fleet Management API')
    .setDescription(
      'Unified API for Oil & Gas Tanker, Bus Transit, and Taxi fleet operations.\n\n' +
      '**Blue Edge Network LLC/SA** — Dubai | Switzerland | Global Operations',
    )
    .setVersion('2.15.0')
    .addBearerAuth()
    .addServer('http://localhost:3001', 'Local Development')
    .addServer('https://api.blueedge.ae', 'Production — UAE')
    .addServer('https://api.blueedge.ch', 'Production — Switzerland')
    .addTag('auth', 'Authentication & authorization')
    .addTag('vehicles', 'Vehicle management')
    .addTag('drivers', 'Driver management')
    .addTag('fleets', 'Fleet management')
    .addTag('trips', 'Trip tracking')
    .addTag('alerts', 'Alert management')
    .addTag('tanker', 'Oil & Gas tanker operations')
    .addTag('bus', 'Bus transit operations')
    .addTag('taxi', 'Taxi/ride-hail operations')
    .addTag('operations', 'Fleet operations & dispatch')
    .addTag('compliance', 'Regulatory compliance')
    .addTag('finance', 'Finance & billing')
    .addTag('safety', 'Safety & incidents')
    .addTag('maintenance', 'Maintenance & work orders')
    .addTag('fuel', 'Fuel management')
    .addTag('devices', 'IoT device management')
    .addTag('diagnostics', 'Vehicle diagnostics')
    .addTag('coldchain', 'Cold chain monitoring')
    .addTag('ota', 'OTA firmware updates')
    .addTag('v2g', 'V2X communication')
    .addTag('ev', 'EV fleet management')
    .addTag('reports', 'Reports & exports')
    .addTag('notifications', 'Notifications & webhooks')
    .addTag('analytics', 'Analytics & dashboards')
    .addTag('users', 'User management')
    .addTag('health', 'Health checks & metrics')
    .addTag('surge-pricing', 'Dynamic surge pricing & demand zones')
    .addTag('driver-incentives', 'Driver reward & incentive programs')
    .addTag('electrification', 'Fleet electrification planning')
    .addTag('depot-charging', 'Depot charging infrastructure')
    .addTag('executive', 'Executive dashboards & KPIs')
    .addTag('anomaly-detection', 'ML anomaly detection')
    .addTag('cross-border', 'Cross-border regulatory compliance')
    .addTag('permits', 'Permit & license management')
    .addTag('parts-marketplace', 'Parts marketplace & procurement')
    .addTag('fleet-lifecycle', 'Fleet lifecycle & asset management')
    .addTag('driver-mobile', 'Driver mobile experience')
    .addTag('fatigue-risk', 'Fatigue risk assessment')
    .addTag('customer-portal', 'Customer self-service portal')
    .addTag('blockchain', 'Blockchain verification & audit trail')
    .addTag('white-label', 'White-label & multi-tenant theming')
    .addTag('charging-stations', 'Public charging station network')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Blue Edge Fleet API Docs',
    customfavIcon: 'https://blueedge.ae/favicon.ico',
    customCss: `
      .swagger-ui .topbar { background: #1e293b; }
      .swagger-ui .topbar .download-url-wrapper .select-label select { border-color: #3b82f6; }
      .swagger-ui .info .title { color: #1e293b; }
      .swagger-ui .info .title small.version-stamp { background: #3b82f6; }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #3b82f6; }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #10b981; }
      .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #f59e0b; }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #ef4444; }
      .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #8b5cf6; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  // Export raw OpenAPI JSON spec at /docs-json
  app.getHttpAdapter().get('/docs-json', (req, res) => res.json(document));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`
╔══════════════════════════════════════════════════╗
║   Blue Edge Fleet Management API v2.15.0         ║
║   Running on: http://localhost:${port}               ║
║   Swagger UI: http://localhost:${port}/docs           ║
║   WebSocket:  ws://localhost:${port}/fleet            ║
║   Health:     http://localhost:${port}/health         ║
║   Metrics:    http://localhost:${port}/health/metrics  ║
║   API:        /api/v1/* (stable) + /api/v2/* (next)  ║
║   Versions:   v1 (deprecated 2027-06-30) | v2 ✓     ║
║   Logger:     Winston (structured JSON)          ║
╚══════════════════════════════════════════════════╝
  `);
}
bootstrap();
