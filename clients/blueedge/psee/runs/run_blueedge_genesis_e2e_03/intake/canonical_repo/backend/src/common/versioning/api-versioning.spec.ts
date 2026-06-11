import { Test, TestingModule } from '@nestjs/testing';
import { ApiVersionMiddleware, V2ResponseInterceptor, VERSION_CONFIG, getApiVersion, isV2 } from './api-versioning';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('API Versioning', () => {
  describe('ApiVersionMiddleware', () => {
    let middleware: ApiVersionMiddleware;
    let mockRes: any;
    let mockNext: jest.Mock;

    beforeEach(() => {
      middleware = new ApiVersionMiddleware();
      mockRes = { setHeader: jest.fn() };
      mockNext = jest.fn();
    });

    it('extracts v1 from URI', () => {
      const req: any = { originalUrl: '/api/v1/vehicles' };
      middleware.use(req, mockRes, mockNext);
      expect(req.apiVersion).toBe('1');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-API-Version', '1');
      expect(mockNext).toHaveBeenCalled();
    });

    it('extracts v2 from URI', () => {
      const req: any = { originalUrl: '/api/v2/vehicles' };
      middleware.use(req, mockRes, mockNext);
      expect(req.apiVersion).toBe('2');
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-API-Version', '2');
    });

    it('defaults to v1 for unversioned requests', () => {
      const req: any = { originalUrl: '/health' };
      middleware.use(req, mockRes, mockNext);
      expect(req.apiVersion).toBe(VERSION_CONFIG.default);
    });

    it('sets supported versions header', () => {
      const req: any = { originalUrl: '/api/v1/vehicles' };
      middleware.use(req, mockRes, mockNext);
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-API-Supported-Versions', '1, 2');
    });

    it('sets deprecation headers for v1', () => {
      const req: any = { originalUrl: '/api/v1/vehicles' };
      middleware.use(req, mockRes, mockNext);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Deprecation', 'true');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Link', expect.stringContaining('successor-version'));
      expect(mockRes.setHeader).toHaveBeenCalledWith('Sunset', expect.any(String));
    });

    it('does NOT set deprecation headers for v2', () => {
      const req: any = { originalUrl: '/api/v2/vehicles' };
      middleware.use(req, mockRes, mockNext);
      expect(mockRes.setHeader).not.toHaveBeenCalledWith('Deprecation', expect.anything());
    });
  });

  describe('V2ResponseInterceptor', () => {
    let interceptor: V2ResponseInterceptor;

    beforeEach(() => {
      interceptor = new V2ResponseInterceptor();
    });

    const createContext = (apiVersion: string): ExecutionContext => ({
      switchToHttp: () => ({
        getRequest: () => ({ apiVersion, headers: { 'x-request-id': 'test-req-001' } }),
        getResponse: () => ({}),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as any);

    const createHandler = (data: any): CallHandler => ({
      handle: () => of(data),
    });

    it('passes v1 responses through unchanged', (done) => {
      const ctx = createContext('1');
      const handler = createHandler({ success: true, data: [1, 2, 3] });
      interceptor.intercept(ctx, handler).subscribe((result) => {
        expect(result).toEqual({ success: true, data: [1, 2, 3] });
        expect(result._meta).toBeUndefined();
        done();
      });
    });

    it('wraps v2 responses with _meta envelope', (done) => {
      const ctx = createContext('2');
      const handler = createHandler({ success: true, data: { vehicles: 342 } });
      interceptor.intercept(ctx, handler).subscribe((result) => {
        expect(result.success).toBe(true);
        expect(result.data).toEqual({ vehicles: 342 });
        expect(result._meta).toBeDefined();
        expect(result._meta.apiVersion).toBe('v2');
        expect(result._meta.requestId).toBe('test-req-001');
        expect(result._meta.timestamp).toBeDefined();
        expect(result._meta.latencyMs).toBeGreaterThanOrEqual(0);
        done();
      });
    });

    it('wraps raw v2 data in success envelope', (done) => {
      const ctx = createContext('2');
      const handler = createHandler({ name: 'raw data' });
      interceptor.intercept(ctx, handler).subscribe((result) => {
        expect(result.success).toBe(true);
        expect(result.data).toEqual({ name: 'raw data' });
        expect(result._meta.apiVersion).toBe('v2');
        done();
      });
    });

    it('includes pagination in _meta when present', (done) => {
      const ctx = createContext('2');
      const handler = createHandler({ success: true, data: [], meta: { page: 1, limit: 25, total: 100, totalPages: 4 } });
      interceptor.intercept(ctx, handler).subscribe((result) => {
        expect(result._meta.pagination).toEqual({ page: 1, limit: 25, total: 100, totalPages: 4 });
        done();
      });
    });
  });

  describe('VERSION_CONFIG', () => {
    it('has v1 and v2 as supported versions', () => {
      expect(VERSION_CONFIG.supported).toContain('1');
      expect(VERSION_CONFIG.supported).toContain('2');
    });

    it('has v1 in deprecated list', () => {
      expect(VERSION_CONFIG.deprecated).toContain('1');
    });

    it('has v2 as current version', () => {
      expect(VERSION_CONFIG.current).toBe('2');
    });

    it('has sunset date for v1', () => {
      expect(VERSION_CONFIG.sunset['1']).toBe('2027-06-30T00:00:00Z');
    });
  });

  describe('Helper functions', () => {
    it('getApiVersion extracts version from request', () => {
      expect(getApiVersion({ apiVersion: '2' } as any)).toBe('2');
    });

    it('getApiVersion defaults to v1', () => {
      expect(getApiVersion({} as any)).toBe(VERSION_CONFIG.default);
    });

    it('isV2 returns true for v2 requests', () => {
      expect(isV2({ apiVersion: '2' } as any)).toBe(true);
    });

    it('isV2 returns false for v1 requests', () => {
      expect(isV2({ apiVersion: '1' } as any)).toBe(false);
    });
  });
});
