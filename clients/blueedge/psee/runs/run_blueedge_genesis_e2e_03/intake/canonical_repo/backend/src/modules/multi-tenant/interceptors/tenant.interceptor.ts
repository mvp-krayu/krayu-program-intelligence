import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TENANT_AWARE_KEY, SKIP_TENANT_KEY } from '../decorators/tenant.decorator';

/**
 * TenantInterceptor: Core row-level security mechanism.
 *
 * Intercepts all requests to tenant-aware controllers and:
 * 1. Extracts tenantId from JWT payload (set by JwtStrategy)
 * 2. Injects tenantId into request for downstream services
 * 3. Ensures no cross-tenant data leakage
 *
 * Usage: Apply @TenantAware() on controller class or use globally.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipTenant = this.reflector.getAllAndOverride<boolean>(SKIP_TENANT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipTenant) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return next.handle(); // Let auth guards handle unauthenticated

    // Extract tenantId from JWT payload
    const tenantId = user.tenantId || user.orgId;

    if (!tenantId) {
      throw new ForbiddenException('No tenant context — access denied');
    }

    // Inject tenant context into request for services to use
    request.tenantId = tenantId;
    request.tenantContext = {
      tenantId,
      plan: user.plan || 'enterprise',
      enabledModules: user.enabledModules || ['*'],
      limits: user.limits || { maxVehicles: 999999, maxDrivers: 999999, maxUsers: 999999 },
    };

    // For query params: automatically inject tenantId filter
    if (request.query) {
      request.query._tenantId = tenantId;
    }

    return next.handle();
  }
}
