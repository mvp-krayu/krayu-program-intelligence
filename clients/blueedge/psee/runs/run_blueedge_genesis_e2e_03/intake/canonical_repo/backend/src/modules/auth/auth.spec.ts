// ══════════════════════════════════════════════════════════════
// Auth Module — Comprehensive Unit Tests
// ══════════════════════════════════════════════════════════════
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService, AuthController } from './auth.module';
import { createMockJwtService } from '../../test/test-utils';

describe('AuthModule', () => {
  let controller: AuthController;
  let service: AuthService;
  let mockJwt: ReturnType<typeof createMockJwtService>;

  beforeEach(async () => {
    mockJwt = createMockJwtService();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, { provide: JwtService, useValue: mockJwt }],
    }).compile();
    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('AuthService', () => {
    describe('login', () => {
      it('returns tokens for valid admin credentials', async () => {
        const result = await service.login('admin@blueedge.com', 'demo123');
        expect(result.data).toHaveProperty('accessToken', 'mock-jwt-token');
        expect(result.data).toHaveProperty('refreshToken', 'mock-jwt-token');
        expect(result.data).toHaveProperty('user');
        expect(result.data.user.role).toBe('admin');
        expect(result.data.user.name).toBe('Ahmed Al Rashid');
        expect(mockJwt.sign).toHaveBeenCalledTimes(2);
      });

      it('returns tokens for fleet_manager credentials', async () => {
        const result = await service.login('manager@blueedge.com', 'demo123');
        expect(result.data.user.role).toBe('fleet_manager');
        expect(result.data.user.name).toBe('Fatima Hassan');
      });

      it('returns tokens for dispatcher credentials', async () => {
        const result = await service.login('dispatcher@blueedge.com', 'demo123');
        expect(result.data.user.role).toBe('dispatcher');
      });

      it('returns tokens for driver credentials', async () => {
        const result = await service.login('driver@blueedge.com', 'demo123');
        expect(result.data.user.role).toBe('driver');
      });

      it('throws UnauthorizedException for invalid email', async () => {
        await expect(service.login('unknown@test.com', 'demo123'))
          .rejects.toThrow(UnauthorizedException);
      });

      it('throws UnauthorizedException for invalid password', async () => {
        await expect(service.login('admin@blueedge.com', 'wrong'))
          .rejects.toThrow(UnauthorizedException);
      });

      it('returns expiresIn field', async () => {
        const result = await service.login('admin@blueedge.com', 'demo123');
        expect(result.data.expiresIn).toBe(900);
      });

      it('signs refresh token with 7d expiry', async () => {
        await service.login('admin@blueedge.com', 'demo123');
        expect(mockJwt.sign).toHaveBeenCalledWith(expect.any(Object), { expiresIn: '7d' });
      });
    });

    describe('refresh', () => {
      it('returns new access token for valid refresh token', async () => {
        const result = await service.refresh('valid-refresh-token');
        expect(result.data).toHaveProperty('accessToken', 'mock-jwt-token');
        expect(result.data).toHaveProperty('expiresIn', 900);
        expect(mockJwt.verify).toHaveBeenCalledWith('valid-refresh-token');
      });

      it('throws UnauthorizedException for invalid refresh token', async () => {
        mockJwt.verify.mockImplementation(() => { throw new Error('invalid'); });
        await expect(service.refresh('invalid-token'))
          .rejects.toThrow(UnauthorizedException);
      });

      it('strips iat and exp from payload before re-signing', async () => {
        mockJwt.verify.mockReturnValue({ sub: 'u-001', email: 'admin@blueedge.com', role: 'admin', iat: 123, exp: 456 });
        await service.refresh('token');
        expect(mockJwt.sign).toHaveBeenCalledWith(
          expect.not.objectContaining({ iat: 123, exp: 456 })
        );
      });
    });

    describe('getProfile', () => {
      it('returns user profile with permissions', async () => {
        const result = await service.getProfile({ userId: 'u-001', sub: 'u-001' });
        expect(result.data).toHaveProperty('id', 'u-001');
        expect(result.data).toHaveProperty('email');
        expect(result.data).toHaveProperty('permissions');
        expect(result.data.permissions).toBeInstanceOf(Array);
      });
    });
  });

  describe('AuthController', () => {
    it('login delegates to service', async () => {
      const result = await controller.login({ email: 'admin@blueedge.com', password: 'demo123' });
      expect(result.data).toHaveProperty('accessToken');
    });

    it('refresh delegates to service', async () => {
      const result = await controller.refresh({ refreshToken: 'valid-token' });
      expect(result.data).toHaveProperty('accessToken');
    });

    it('getProfile delegates to service', async () => {
      const req = { user: { userId: 'u-001', sub: 'u-001' } };
      const result = await controller.getProfile(req);
      expect(result.data).toHaveProperty('id');
    });

    it('logout returns success', async () => {
      const result = await controller.logout();
      expect(result.data).toHaveProperty('message', 'Logged out successfully');
    });
  });
});
