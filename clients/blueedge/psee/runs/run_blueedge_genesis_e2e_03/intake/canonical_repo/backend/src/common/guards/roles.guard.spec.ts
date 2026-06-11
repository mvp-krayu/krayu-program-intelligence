// ══════════════════════════════════════════════════════════════
// RBAC Guards — Comprehensive Unit Tests
// ══════════════════════════════════════════════════════════════
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard, Role, Permission, ROLES_KEY, PERMISSIONS_KEY } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const createMockContext = (user: any): ExecutionContext => ({
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as any);

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('No restrictions', () => {
    it('allows access when no roles or permissions required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
      const ctx = createMockContext({ role: 'viewer' });
      expect(guard.canActivate(ctx)).toBe(true);
    });
  });

  describe('Role-based access', () => {
    it('allows admin access to admin-only endpoint', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Role.ADMIN])
        .mockReturnValueOnce(undefined);
      const ctx = createMockContext({ role: 'admin' });
      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('denies driver access to admin-only endpoint', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Role.ADMIN])
        .mockReturnValueOnce(undefined);
      const ctx = createMockContext({ role: 'driver' });
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('allows fleet_manager access when admin or fleet_manager required', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Role.ADMIN, Role.FLEET_MANAGER])
        .mockReturnValueOnce(undefined);
      const ctx = createMockContext({ role: 'fleet_manager' });
      expect(guard.canActivate(ctx)).toBe(true);
    });
  });

  describe('Permission-based access', () => {
    it('allows admin with all permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([Permission.VEHICLE_READ]);
      const ctx = createMockContext({ role: 'admin' });
      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('allows fleet_manager with vehicle:read permission', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([Permission.VEHICLE_READ]);
      const ctx = createMockContext({ role: 'fleet_manager' });
      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('denies viewer write access', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([Permission.VEHICLE_WRITE]);
      const ctx = createMockContext({ role: 'viewer' });
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('denies driver admin:all permission', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([Permission.ADMIN_ALL]);
      const ctx = createMockContext({ role: 'driver' });
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });
  });

  describe('No authenticated user', () => {
    it('throws ForbiddenException when no user on request', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Role.ADMIN])
        .mockReturnValueOnce(undefined);
      const ctx = createMockContext(null);
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when user is undefined', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([Permission.FLEET_READ]);
      const ctx = createMockContext(undefined);
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });
  });

  describe('Domain-specific permissions', () => {
    it('allows fleet_manager tanker:read', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([Permission.TANKER_READ]);
      const ctx = createMockContext({ role: 'fleet_manager' });
      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('denies customer tanker:write', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce([Permission.TANKER_WRITE]);
      const ctx = createMockContext({ role: 'customer' });
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });
  });
});
