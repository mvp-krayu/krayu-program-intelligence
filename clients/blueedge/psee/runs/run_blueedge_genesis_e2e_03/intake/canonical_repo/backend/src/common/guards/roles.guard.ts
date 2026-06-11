import { Injectable, CanActivate, ExecutionContext, SetMetadata, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// ─── Role Hierarchy ───────────────────────────────────────────
export enum Role {
  ADMIN = 'admin',
  FLEET_MANAGER = 'fleet_manager',
  DISPATCHER = 'dispatcher',
  DRIVER = 'driver',
  CUSTOMER = 'customer',
  VIEWER = 'viewer',
}

// ─── Permissions ──────────────────────────────────────────────
export enum Permission {
  // Fleet
  FLEET_READ = 'fleet:read',
  FLEET_WRITE = 'fleet:write',
  FLEET_DELETE = 'fleet:delete',
  // Vehicles
  VEHICLE_READ = 'vehicle:read',
  VEHICLE_WRITE = 'vehicle:write',
  VEHICLE_COMMAND = 'vehicle:command',
  // Drivers
  DRIVER_READ = 'driver:read',
  DRIVER_WRITE = 'driver:write',
  // Trips
  TRIP_READ = 'trip:read',
  TRIP_WRITE = 'trip:write',
  // Alerts
  ALERT_READ = 'alert:read',
  ALERT_WRITE = 'alert:write',
  ALERT_ACKNOWLEDGE = 'alert:acknowledge',
  // Maintenance
  MAINTENANCE_READ = 'maintenance:read',
  MAINTENANCE_WRITE = 'maintenance:write',
  // Fuel
  FUEL_READ = 'fuel:read',
  FUEL_WRITE = 'fuel:write',
  // Tanker / HAZMAT
  TANKER_READ = 'tanker:read',
  TANKER_WRITE = 'tanker:write',
  // Bus Transit
  BUS_READ = 'bus:read',
  BUS_WRITE = 'bus:write',
  // Taxi Operations
  TAXI_READ = 'taxi:read',
  TAXI_WRITE = 'taxi:write',
  // Operations (geofences, scheduling)
  OPERATIONS_READ = 'operations:read',
  OPERATIONS_WRITE = 'operations:write',
  // Analytics
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_WRITE = 'analytics:write',
  ANALYTICS_EXPORT = 'analytics:export',
  // Compliance
  COMPLIANCE_READ = 'compliance:read',
  COMPLIANCE_WRITE = 'compliance:write',
  // Safety
  SAFETY_READ = 'safety:read',
  SAFETY_WRITE = 'safety:write',
  // Finance
  FINANCE_READ = 'finance:read',
  FINANCE_WRITE = 'finance:write',
  // Reports
  REPORT_READ = 'report:read',
  REPORT_GENERATE = 'report:generate',
  // Diagnostics
  DIAGNOSTICS_READ = 'diagnostics:read',
  // Notifications
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_WRITE = 'notification:write',
  // Devices
  DEVICE_READ = 'device:read',
  DEVICE_WRITE = 'device:write',
  DEVICE_OTA = 'device:ota',
  // Cold Chain
  COLDCHAIN_READ = 'coldchain:read',
  COLDCHAIN_WRITE = 'coldchain:write',
  // Electric Vehicles
  EV_READ = 'ev:read',
  EV_WRITE = 'ev:write',
  // OTA Firmware
  OTA_READ = 'ota:read',
  OTA_MANAGE = 'ota:manage',
  // Vehicle-to-Grid
  V2G_READ = 'v2g:read',
  V2G_MANAGE = 'v2g:manage',
  // Users / Admin
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  ADMIN_ALL = 'admin:all',
  // Multi-Tenant
  TENANT_READ = 'tenant:read',
  TENANT_WRITE = 'tenant:write',
  TENANT_MANAGE = 'tenant:manage',
  // Billing
  BILLING_READ = 'billing:read',
  BILLING_WRITE = 'billing:write',
  // Onboarding
  ONBOARDING_READ = 'onboarding:read',
  ONBOARDING_WRITE = 'onboarding:write',
}

// ─── Role → Permission Mapping ────────────────────────────────
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),

  [Role.FLEET_MANAGER]: [
    // Core fleet management
    Permission.FLEET_READ, Permission.FLEET_WRITE,
    Permission.VEHICLE_READ, Permission.VEHICLE_WRITE, Permission.VEHICLE_COMMAND,
    Permission.DRIVER_READ, Permission.DRIVER_WRITE,
    Permission.TRIP_READ, Permission.TRIP_WRITE,
    Permission.ALERT_READ, Permission.ALERT_WRITE, Permission.ALERT_ACKNOWLEDGE,
    Permission.MAINTENANCE_READ, Permission.MAINTENANCE_WRITE,
    Permission.FUEL_READ, Permission.FUEL_WRITE,
    // Industry modules
    Permission.TANKER_READ, Permission.TANKER_WRITE,
    Permission.BUS_READ, Permission.BUS_WRITE,
    Permission.TAXI_READ, Permission.TAXI_WRITE,
    // Operations & analytics
    Permission.OPERATIONS_READ, Permission.OPERATIONS_WRITE,
    Permission.ANALYTICS_READ, Permission.ANALYTICS_EXPORT,
    Permission.COMPLIANCE_READ, Permission.COMPLIANCE_WRITE,
    Permission.SAFETY_READ, Permission.SAFETY_WRITE,
    Permission.FINANCE_READ,
    Permission.REPORT_READ, Permission.REPORT_GENERATE,
    Permission.DIAGNOSTICS_READ,
    Permission.NOTIFICATION_READ, Permission.NOTIFICATION_WRITE,
    // Devices & advanced
    Permission.DEVICE_READ, Permission.DEVICE_WRITE,
    Permission.COLDCHAIN_READ, Permission.COLDCHAIN_WRITE,
    Permission.EV_READ, Permission.EV_WRITE,
    Permission.OTA_READ, Permission.OTA_MANAGE,
    Permission.V2G_READ, Permission.V2G_MANAGE,
    Permission.USER_READ,
  ],

  [Role.DISPATCHER]: [
    Permission.FLEET_READ,
    Permission.VEHICLE_READ, Permission.VEHICLE_COMMAND,
    Permission.DRIVER_READ,
    Permission.TRIP_READ, Permission.TRIP_WRITE,
    Permission.ALERT_READ, Permission.ALERT_ACKNOWLEDGE,
    Permission.MAINTENANCE_READ,
    Permission.FUEL_READ,
    Permission.TANKER_READ,
    Permission.BUS_READ,
    Permission.TAXI_READ,
    Permission.OPERATIONS_READ,
    Permission.ANALYTICS_READ,
    Permission.SAFETY_READ,
    Permission.REPORT_READ,
    Permission.DIAGNOSTICS_READ,
    Permission.NOTIFICATION_READ,
    Permission.DEVICE_READ,
    Permission.COLDCHAIN_READ,
    Permission.EV_READ,
    Permission.OTA_READ,
    Permission.V2G_READ,
  ],

  [Role.DRIVER]: [
    Permission.VEHICLE_READ,
    Permission.DRIVER_READ,
    Permission.TRIP_READ,
    Permission.ALERT_READ,
    Permission.FUEL_READ,
    Permission.TANKER_READ,
    Permission.BUS_READ,
    Permission.TAXI_READ,
    Permission.MAINTENANCE_READ,
    Permission.SAFETY_READ,
    Permission.NOTIFICATION_READ,
    Permission.COLDCHAIN_READ,
    Permission.EV_READ,
  ],

  [Role.CUSTOMER]: [
    Permission.TRIP_READ,
    Permission.ALERT_READ,
    Permission.NOTIFICATION_READ,
    Permission.REPORT_READ,
  ],

  [Role.VIEWER]: [
    Permission.FLEET_READ,
    Permission.VEHICLE_READ,
    Permission.ANALYTICS_READ,
    Permission.REPORT_READ,
    Permission.DIAGNOSTICS_READ,
  ],
};

// ─── Decorators ───────────────────────────────────────────────
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

/** Require specific roles: @Roles(Role.ADMIN, Role.FLEET_MANAGER) */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/** Require specific permissions: @RequirePermissions(Permission.VEHICLE_WRITE) */
export const RequirePermissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);

// ─── Roles Guard ──────────────────────────────────────────────
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check role-based access
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Check permission-based access
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No restriction — allow
    if (!requiredRoles && !requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No authenticated user');

    const userRole = user.role as Role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    // Role check
    if (requiredRoles?.length) {
      const hasRole = requiredRoles.includes(userRole);
      if (!hasRole) throw new ForbiddenException(`Required role: ${requiredRoles.join(' or ')}`);
    }

    // Permission check
    if (requiredPermissions?.length) {
      const hasAll = requiredPermissions.every(p => userPermissions.includes(p));
      if (!hasAll) throw new ForbiddenException(`Missing permissions: ${requiredPermissions.filter(p => !userPermissions.includes(p)).join(', ')}`);
    }

    return true;
  }
}
