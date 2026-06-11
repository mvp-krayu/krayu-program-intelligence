// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet Platform — Test Utilities & Mock Factories
// v2.12.0 — Comprehensive Testing Suite
// ══════════════════════════════════════════════════════════════

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// ─── Mock Repository Factory ────────────────────────────────
export const createMockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  findAndCount: jest.fn().mockResolvedValue([[], 0]),
  count: jest.fn().mockResolvedValue(0),
  create: jest.fn().mockImplementation((dto) => ({ id: 'mock-uuid', ...dto })),
  save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'mock-uuid', createdAt: new Date(), updatedAt: new Date(), ...entity })),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  remove: jest.fn().mockResolvedValue(undefined),
  createQueryBuilder: jest.fn(() => mockQueryBuilder()),
  metadata: { tableName: 'mock_table', columns: [], relations: [] },
});

export const mockQueryBuilder = () => {
  const qb: any = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]),
    getRawOne: jest.fn().mockResolvedValue(null),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue(null),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    getCount: jest.fn().mockResolvedValue(0),
  };
  return qb;
};

// ─── Mock Event Emitter ─────────────────────────────────────
export const createMockEventEmitter = () => ({
  emit: jest.fn(),
  emitAsync: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  once: jest.fn(),
  removeListener: jest.fn(),
});

// ─── Mock Cache Service ─────────────────────────────────────
export const createMockCacheService = () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
  reset: jest.fn().mockResolvedValue(undefined),
  invalidateByPrefix: jest.fn().mockResolvedValue(undefined),
  invalidateEntity: jest.fn().mockResolvedValue(undefined),
});

// ─── Mock JwtService ────────────────────────────────────────
export const createMockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ sub: 'user-001', email: 'admin@blueedge.ae', role: 'admin', orgId: 'org-001' }),
  verifyAsync: jest.fn().mockResolvedValue({ sub: 'user-001', email: 'admin@blueedge.ae', role: 'admin', orgId: 'org-001' }),
});

// ─── Mock ConfigService ─────────────────────────────────────
export const createMockConfigService = () => ({
  get: jest.fn((key: string) => {
    const config: Record<string, any> = {
      'JWT_SECRET': 'test-secret-key-2026',
      'JWT_EXPIRES_IN': '15m',
      'REDIS_HOST': 'localhost',
      'REDIS_PORT': 6379,
      'NODE_ENV': 'test',
    };
    return config[key];
  }),
  getOrThrow: jest.fn().mockReturnValue('test-value'),
});

// ─── Mock WebSocket Gateway ─────────────────────────────────
export const createMockGateway = () => ({
  emitVehicleUpdate: jest.fn(),
  emitAlert: jest.fn(),
  emitToRoom: jest.fn(),
  server: { to: jest.fn().mockReturnThis(), emit: jest.fn(), in: jest.fn().mockReturnThis() },
});

// ─── UUID & Date Generators ─────────────────────────────────
export const mockUuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
export const mockUuid2 = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
export const mockUuid3 = 'c3d4e5f6-a7b8-9012-cdef-123456789012';
export const mockDate = new Date('2026-02-12T10:00:00Z');
export const mockDateString = '2026-02-12T10:00:00.000Z';

// ─── UAE Context Mock Data ──────────────────────────────────
export const mockVehicle = {
  id: mockUuid, licensePlate: 'دبي A 12345', fleetType: 'tanker', make: 'Mercedes-Benz', model: 'Actros 2645',
  year: 2024, vin: 'WDB96340310123456', status: 'active', fleetId: 'fleet-001', currentDriverId: 'driver-001',
  lastLatitude: 25.2048, lastLongitude: 55.2708, lastSpeed: 65.0, odometerKm: 45000, fuelLevelPercent: 72,
  engineHours: 3200, createdAt: mockDate, updatedAt: mockDate,
};

export const mockDriver = {
  id: 'driver-001', employeeId: 'BE-DXB-1001', nameEn: 'Ahmed Al Maktoum', nameAr: 'أحمد المكتوم',
  licenseNumber: 'DXB-CDL-2024-001', licenseClass: 'heavy_vehicle', licenseExpiryDate: new Date('2027-06-15'),
  phone: '+971501234567', email: 'ahmed@blueedge.ae', status: 'active', safetyScore: 92,
  fleetId: 'fleet-001', createdAt: mockDate, updatedAt: mockDate,
};

export const mockFleet = {
  id: 'fleet-001', name: 'Dubai Tanker Fleet Alpha', nameAr: 'أسطول ناقلات دبي ألفا', fleetType: 'tanker',
  status: 'active', vehicleCount: 25, activeVehicles: 22, baseLocation: 'Jebel Ali Free Zone, Dubai',
  operationalRegion: 'UAE', createdAt: mockDate, updatedAt: mockDate,
};

export const mockTrip = {
  id: 'trip-001', vehicleId: mockUuid, driverId: 'driver-001', fleetType: 'tanker',
  origin: 'ADNOC Ruwais Terminal', destination: 'Jebel Ali Storage Depot', status: 'in_progress',
  startedAt: mockDate, distanceKm: 245.6, createdAt: mockDate, updatedAt: mockDate,
};

export const mockAlert = {
  id: 'alert-001', vehicleId: mockUuid, type: 'overspeed', severity: 'high',
  message: 'Vehicle exceeded 120 km/h on E11 Sheikh Zayed Road', status: 'active',
  latitude: 25.0657, longitude: 55.1713, createdAt: mockDate,
};

export const mockWorkOrder = {
  id: 'wo-001', vehicleId: mockUuid, type: 'preventive', priority: 'high', status: 'open',
  title: 'Scheduled 50K Service', description: 'Full service at 50,000 km interval',
  scheduledDate: new Date('2026-02-20'), estimatedCostAed: 2500, createdAt: mockDate, updatedAt: mockDate,
};

export const mockFuelTransaction = {
  id: 'fuel-001', vehicleId: mockUuid, driverId: 'driver-001', fuelType: 'diesel',
  volumeLiters: 280.5, costAed: 756.00, station: 'ADNOC Jebel Ali #12',
  odometerKm: 44800, transactionDate: mockDate, createdAt: mockDate,
};

export const mockUser = {
  id: 'user-001', email: 'admin@blueedge.ae', nameEn: 'System Admin', role: 'admin',
  isActive: true, lastLoginAt: mockDate, createdAt: mockDate, updatedAt: mockDate,
};

export const mockSafetyEvent = {
  id: 'safety-001', vehicleId: mockUuid, driverId: 'driver-001', eventType: 'harsh_braking',
  severity: 'high', latitude: 25.2048, longitude: 55.2708, speedKmh: 95, gForce: 0.8,
  description: 'Harsh braking detected on E11', createdAt: mockDate,
};

export const mockNotification = {
  id: 'notif-001', userId: 'user-001', type: 'alert', title: 'Overspeed Alert',
  message: 'Vehicle exceeded speed limit', isRead: false,
  data: { vehicleId: mockUuid, alertType: 'overspeed' }, createdAt: mockDate,
};

export const mockDevice = {
  id: 'device-001', serialNumber: 'BE-IOT-2024-001', deviceType: 'gps_tracker',
  manufacturer: 'CalAmp', model: 'LMU-5530', firmwareVersion: '3.2.1',
  vehicleId: mockUuid, status: 'active', lastPingAt: mockDate, createdAt: mockDate,
};

export const mockComplianceRecord = {
  id: 'comp-001', vehicleId: mockUuid, type: 'vehicle_inspection', status: 'valid',
  issuedDate: new Date('2025-06-01'), expiryDate: new Date('2026-06-01'),
  issuingAuthority: 'Dubai RTA', documentNumber: 'RTA-INSP-2025-001', createdAt: mockDate,
};

export const mockFinanceTransaction = {
  id: 'fin-001', category: 'fuel', type: 'expense', amount: 756.00, currency: 'AED',
  description: 'Diesel refueling - ADNOC Jebel Ali', vehicleId: mockUuid,
  status: 'approved', createdAt: mockDate,
};

export const mockCargoManifest = {
  id: 'cargo-001', vehicleId: mockUuid, productName: 'Diesel EN590', volumeLiters: 35000,
  origin: 'ADNOC Ruwais Refinery', destination: 'Jebel Ali Fuel Depot', status: 'in_transit',
  loadedAt: mockDate, createdAt: mockDate,
};

export const mockCustodyTransfer = {
  id: 'custody-001', cargoManifestId: 'cargo-001', fromParty: 'ADNOC Distribution',
  toParty: 'Blue Edge Transport LLC', volumeLiters: 35000, status: 'completed',
  transferredAt: mockDate, createdAt: mockDate,
};

export const mockColdChainShipment = {
  id: 'cc-001', vehicleId: mockUuid, minTempC: -18, maxTempC: -15, currentTempC: -16.5,
  humidity: 45, status: 'in_transit', breachCount: 0, createdAt: mockDate,
};

export const mockOtaUpdate = {
  id: 'ota-001', deviceId: 'device-001', packageName: 'gps-firmware-v3.3.0',
  version: '3.3.0', status: 'pending', scheduledAt: new Date('2026-02-15'), createdAt: mockDate,
};

export const mockElectricVehicle = {
  id: 'ev-001', vehicleId: mockUuid3, batteryCapacityKwh: 100, currentChargePercent: 78,
  estimatedRangeKm: 312, chargingStatus: 'not_charging', totalEnergyConsumedKwh: 4500, createdAt: mockDate,
};

export const mockV2gSession = {
  id: 'v2g-001', vehicleId: mockUuid3, sessionType: 'discharge', energyKwh: 15.5,
  pricePerKwh: 0.45, status: 'active', startedAt: mockDate, createdAt: mockDate,
};

export const mockBusRoute = {
  id: 'route-001', routeNumber: 'F55A', routeName: 'Ibn Battuta ↔ Mall of the Emirates',
  routeNameAr: 'ابن بطوطة ↔ مول الإمارات', status: 'active', totalStops: 18,
  estimatedDurationMin: 35, distanceKm: 15.2, createdAt: mockDate,
};

export const mockTaxiTrip = {
  id: 'taxi-001', vehicleId: mockUuid2, driverId: 'driver-002', pickupLocation: 'Dubai Mall',
  dropoffLocation: 'Dubai Marina', status: 'completed', fareAed: 45.00, distanceKm: 18.5,
  durationMin: 25, rating: 4.8, createdAt: mockDate,
};

export const mockDiagnosticRecord = {
  id: 'diag-001', vehicleId: mockUuid, dtcCode: 'P0420',
  description: 'Catalyst System Efficiency Below Threshold', severity: 'warning',
  status: 'active', detectedAt: mockDate, createdAt: mockDate,
};

export const mockGeofence = {
  id: 'geo-001', name: 'ADNOC Ruwais Terminal', type: 'circle',
  latitude: 24.0889, longitude: 52.7312, radiusMeters: 500, status: 'active',
  alertOnEntry: true, alertOnExit: true, createdAt: mockDate,
};

// ─── Request/Response Mocks ─────────────────────────────────
export const mockRequest = {
  user: { userId: 'user-001', email: 'admin@blueedge.ae', role: 'admin', orgId: 'org-001' },
  headers: { authorization: 'Bearer mock-jwt-token' },
  ip: '10.0.0.1', method: 'GET', url: '/api/v1/vehicles',
};

export const mockManagerRequest = {
  user: { userId: 'user-002', email: 'manager@blueedge.ae', role: 'fleet_manager', orgId: 'org-001' },
  headers: { authorization: 'Bearer mock-jwt-token' }, ip: '10.0.0.2', method: 'GET', url: '/api/v1/vehicles',
};

export const mockDriverRequest = {
  user: { userId: 'user-004', email: 'driver@blueedge.ae', role: 'driver', orgId: 'org-001' },
  headers: { authorization: 'Bearer mock-jwt-token' }, ip: '10.0.0.3', method: 'GET', url: '/api/v1/vehicles',
};

export const mockResponse = {
  status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(),
  header: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis(),
};

// ─── Assertion Helpers ──────────────────────────────────────
export const expectPaginatedResponse = (result: any) => {
  expect(result).toHaveProperty('data');
  expect(result).toHaveProperty('meta');
  expect(result.meta).toHaveProperty('total');
  expect(result.meta).toHaveProperty('page');
  expect(result.meta).toHaveProperty('limit');
};

export const expectSuccessResponse = (result: any) => {
  expect(result).toHaveProperty('data');
  expect(result).toHaveProperty('success');
  expect(result.success).toBe(true);
};

// ─── Event Payload Builders ─────────────────────────────────
export const buildVehicleEvent = (type: string, overrides: any = {}) => ({
  event: type, timestamp: mockDateString, source: 'vehicles', correlationId: 'corr-001',
  vehicleId: mockUuid, userId: 'user-001', data: {}, ...overrides,
});

export const buildAlertEvent = (overrides: any = {}) => ({
  event: 'fleet.alert.created', timestamp: mockDateString, source: 'alerts',
  alertId: 'alert-001', vehicleId: mockUuid, type: 'overspeed', severity: 'high',
  message: 'Vehicle exceeded speed limit', metadata: {}, ...overrides,
});

export const buildSafetyEvent = (overrides: any = {}) => ({
  event: 'fleet.safety.event_detected', timestamp: mockDateString, source: 'safety',
  safetyEventId: 'safety-001', vehicleId: mockUuid, driverId: 'driver-001',
  eventType: 'harsh_braking', severity: 'high', ...overrides,
});

export const buildPositionEvent = (overrides: any = {}) => ({
  event: 'fleet.vehicle.position_updated', timestamp: mockDateString, vehicleId: mockUuid,
  fleetType: 'tanker', position: { latitude: 25.2048, longitude: 55.2708, speed: 65, heading: 180 },
  ...overrides,
});
