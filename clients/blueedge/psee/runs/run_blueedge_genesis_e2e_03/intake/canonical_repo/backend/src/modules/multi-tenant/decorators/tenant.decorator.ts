import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Mark a controller or handler as tenant-aware.
 * The TenantInterceptor will automatically filter queries by tenantId.
 */
export const TENANT_AWARE_KEY = 'tenant_aware';
export const TenantAware = () => SetMetadata(TENANT_AWARE_KEY, true);

/**
 * Skip tenant filtering for a specific handler (e.g., super-admin endpoints).
 */
export const SKIP_TENANT_KEY = 'skip_tenant';
export const SkipTenantFilter = () => SetMetadata(SKIP_TENANT_KEY, true);

/**
 * Extract tenantId from the authenticated user's JWT payload.
 * Usage: @CurrentTenant() tenantId: string
 */
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId || request.user?.orgId || 'default';
  },
);

/**
 * Extract full tenant context from request.
 * Usage: @TenantContext() ctx: TenantCtx
 */
export interface TenantCtx {
  tenantId: string;
  plan: string;
  enabledModules: string[];
  limits: { maxVehicles: number; maxDrivers: number; maxUsers: number };
}

export const TenantContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TenantCtx => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantContext || {
      tenantId: request.user?.tenantId || request.user?.orgId || 'default',
      plan: 'enterprise',
      enabledModules: ['*'],
      limits: { maxVehicles: 999999, maxDrivers: 999999, maxUsers: 999999 },
    };
  },
);
