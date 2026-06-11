import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Mark a controller/handler as requiring a specific module to be enabled.
 * Usage: @RequireModule('predictive-maintenance')
 */
export const REQUIRE_MODULE_KEY = 'require_module';
export const RequireModule = (module: string) => SetMetadata(REQUIRE_MODULE_KEY, module);

/**
 * Mark a handler as requiring quota check before creating resources.
 * Usage: @CheckQuota('vehicles') on POST endpoints
 */
export const CHECK_QUOTA_KEY = 'check_quota';
export const CheckQuota = (resource: 'vehicles' | 'drivers' | 'users' | 'fleets') => SetMetadata(CHECK_QUOTA_KEY, resource);

/**
 * TenantGuard: Enforces module-level access and quota limits per tenant plan.
 *
 * Flow:
 * 1. Check if the required module is enabled for this tenant's plan
 * 2. Check if the tenant has exceeded its quota for the given resource
 * 3. Allow or deny access with a clear error message
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantCtx = request.tenantContext;

    if (!tenantCtx) return true; // No tenant context = not enforced

    // ── Module Access Check ──────────────────────────────────
    const requiredModule = this.reflector.getAllAndOverride<string>(REQUIRE_MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredModule && tenantCtx.enabledModules) {
      const modules = tenantCtx.enabledModules;
      if (!modules.includes('*') && !modules.includes(requiredModule)) {
        throw new ForbiddenException(
          `Module "${requiredModule}" is not available on your ${tenantCtx.plan} plan. ` +
          `Upgrade to access this feature.`
        );
      }
    }

    // ── Quota Check ──────────────────────────────────────────
    const quotaResource = this.reflector.getAllAndOverride<string>(CHECK_QUOTA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (quotaResource && tenantCtx.limits) {
      const limitKey = `max${quotaResource.charAt(0).toUpperCase()}${quotaResource.slice(1)}`;
      const limit = tenantCtx.limits[limitKey];
      const current = tenantCtx.usage?.[`current${quotaResource.charAt(0).toUpperCase()}${quotaResource.slice(1)}`] || 0;

      if (limit && current >= limit) {
        throw new ForbiddenException(
          `${quotaResource} quota exceeded (${current}/${limit}). ` +
          `Upgrade your plan to add more ${quotaResource}.`
        );
      }
    }

    return true;
  }
}

/**
 * SuperAdminGuard: Only allows platform-level super admins.
 * Used for tenant management, billing admin, platform settings.
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Authentication required');

    if (user.role !== 'super_admin' && user.role !== 'platform_admin') {
      throw new ForbiddenException('Super admin access required');
    }

    return true;
  }
}
