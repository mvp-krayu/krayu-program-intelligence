// ══════════════════════════════════════════════════════════════
// Vehicles Module — Comprehensive Unit Tests
// ══════════════════════════════════════════════════════════════
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehiclesService, VehiclesController } from './vehicles.module';
import { Vehicle } from './entities/vehicle.entity';
import { createMockRepository, mockVehicle, mockUuid } from '../../test/test-utils';

describe('VehiclesModule', () => {
  let controller: VehiclesController;
  let service: VehiclesService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [VehiclesService, { provide: getRepositoryToken(Vehicle), useValue: mockRepo }],
    }).compile();
    controller = module.get(VehiclesController);
    service = module.get(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // ─── VehiclesService Tests ──────────────────────────────────

  describe('VehiclesService', () => {
    describe('findAll', () => {
      it('returns empty array when no vehicles', async () => {
        mockRepo.find.mockResolvedValue([]);
        const result = await service.findAll({});
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);
      });

      it('returns vehicles array', async () => {
        mockRepo.find.mockResolvedValue([mockVehicle]);
        const result = await service.findAll({});
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result[0].licensePlate).toBe('دبي A 12345');
      });

      it('returns multiple vehicles', async () => {
        mockRepo.find.mockResolvedValue([mockVehicle, { ...mockVehicle, id: 'v2', licensePlate: 'دبي B 67890' }]);
        const result = await service.findAll({});
        expect(result).toHaveLength(2);
      });
    });

    describe('findOne', () => {
      it('returns a vehicle by id', async () => {
        mockRepo.findOne.mockResolvedValue(mockVehicle);
        const result = await service.findOne(mockUuid);
        expect(result).toEqual(mockVehicle);
        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: mockUuid } });
      });

      it('returns null for non-existent vehicle', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await service.findOne('nonexistent');
        expect(result).toBeNull();
      });
    });

    describe('findByFleet', () => {
      it('returns paginated vehicles for a fleet', async () => {
        mockRepo.findAndCount.mockResolvedValue([[mockVehicle], 1]);
        const result = await service.findByFleet('fleet-001', { page: 1, limit: 20 });
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('meta');
        expect(result.meta.total).toBe(1);
      });

      it('respects pagination parameters', async () => {
        mockRepo.findAndCount.mockResolvedValue([[], 50]);
        const result = await service.findByFleet('fleet-001', { page: 3, limit: 10 });
        expect(mockRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
          skip: 20, take: 10,
        }));
      });

      it('uses default pagination when not provided', async () => {
        mockRepo.findAndCount.mockResolvedValue([[], 0]);
        await service.findByFleet('fleet-001', {});
        expect(mockRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
          skip: 0, take: 20,
        }));
      });
    });

    describe('findByType', () => {
      it('filters vehicles by fleet type', async () => {
        mockRepo.findAndCount.mockResolvedValue([[mockVehicle], 1]);
        const result = await service.findByType('tanker', { page: 1, limit: 20 });
        expect(result.data).toHaveLength(1);
        expect(mockRepo.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
          where: { fleetType: 'tanker' },
        }));
      });
    });

    describe('getPositions', () => {
      it('returns all vehicle positions', async () => {
        mockRepo.find.mockResolvedValue([mockVehicle]);
        const result = await service.getPositions();
        expect(result).toHaveProperty('data');
        expect(result.success).toBe(true);
      });

      it('filters by fleet type', async () => {
        mockRepo.find.mockResolvedValue([]);
        await service.getPositions('tanker');
        expect(mockRepo.find).toHaveBeenCalledWith(expect.objectContaining({
          where: { fleetType: 'tanker' },
        }));
      });

      it('returns all positions when fleetType is "all"', async () => {
        mockRepo.find.mockResolvedValue([]);
        await service.getPositions('all');
        expect(mockRepo.find).toHaveBeenCalledWith(expect.objectContaining({
          where: {},
        }));
      });
    });

    describe('getTelemetry', () => {
      it('returns telemetry data for existing vehicle', async () => {
        mockRepo.findOne.mockResolvedValue(mockVehicle);
        const result = await service.getTelemetry(mockUuid);
        expect(result.data).toHaveProperty('vehicleId', mockUuid);
        expect(result.data).toHaveProperty('engineRpm');
        expect(result.data).toHaveProperty('fuelLevelPercent', 72);
        expect(result.data).toHaveProperty('odometerKm', 45000);
        expect(result.data).toHaveProperty('coolantTempC');
        expect(result.data).toHaveProperty('batteryVoltage');
      });

      it('returns null data for missing vehicle', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await service.getTelemetry('nonexistent');
        expect(result.data).toBeNull();
      });
    });

    describe('getDtcs', () => {
      it('returns DTC codes array', async () => {
        const result = await service.getDtcs(mockUuid);
        expect(result.data).toBeInstanceOf(Array);
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data[0]).toHaveProperty('code');
        expect(result.data[0]).toHaveProperty('description');
        expect(result.data[0]).toHaveProperty('severity');
      });
    });

    describe('getStats', () => {
      it('returns fleet statistics', async () => {
        mockRepo.count.mockResolvedValue(100);
        const result = await service.getStats();
        expect(result.data).toHaveProperty('total', 100);
        expect(result.data).toHaveProperty('active');
        expect(result.data).toHaveProperty('byType');
        expect(result.data.byType).toHaveProperty('tankers');
        expect(result.data.byType).toHaveProperty('buses');
        expect(result.data.byType).toHaveProperty('taxis');
      });

      it('calls count for each fleet type', async () => {
        mockRepo.count.mockResolvedValue(0);
        await service.getStats();
        // total + active + tankers + buses + taxis = 5 calls
        expect(mockRepo.count).toHaveBeenCalledTimes(5);
      });
    });

    describe('sendCommand', () => {
      it('sends immobilize command', async () => {
        const result = await service.sendCommand(mockUuid, { type: 'immobilize' });
        expect(result.data).toHaveProperty('command', 'immobilize');
        expect(result.data).toHaveProperty('status', 'sent');
        expect(result.data).toHaveProperty('vehicleId', mockUuid);
      });

      it('sends unlock command', async () => {
        const result = await service.sendCommand(mockUuid, { type: 'unlock', payload: { duration: 30 } });
        expect(result.data.command).toBe('unlock');
      });
    });

    describe('create', () => {
      it('saves a new vehicle', async () => {
        mockRepo.create.mockReturnValue(mockVehicle);
        mockRepo.save.mockResolvedValue(mockVehicle);
        const result = await service.create({ licensePlate: 'دبي C 11111' } as any);
        expect(mockRepo.create).toHaveBeenCalled();
        expect(mockRepo.save).toHaveBeenCalled();
      });
    });

    describe('update', () => {
      it('updates a vehicle', async () => {
        mockRepo.findOne.mockResolvedValue({ ...mockVehicle, status: 'maintenance' });
        const result = await service.update(mockUuid, { status: 'maintenance' } as any);
        expect(mockRepo.update).toHaveBeenCalledWith(mockUuid, expect.any(Object));
      });
    });

    describe('remove', () => {
      it('deletes a vehicle', async () => {
        const result = await service.remove(mockUuid);
        expect(mockRepo.delete).toHaveBeenCalledWith(mockUuid);
        expect(result).toHaveProperty('deleted', true);
      });
    });
  });

  // ─── VehiclesController Tests ───────────────────────────────

  describe('VehiclesController', () => {
    it('findAll delegates to service', async () => {
      mockRepo.find.mockResolvedValue([mockVehicle]);
      const result = await controller.findAll({});
      expect(result).toBeInstanceOf(Array);
    });

    it('getStats delegates to service', async () => {
      mockRepo.count.mockResolvedValue(50);
      const result = await controller.getStats();
      expect(result).toHaveProperty('data');
    });

    it('getPositions delegates to service', async () => {
      mockRepo.find.mockResolvedValue([]);
      const result = await controller.getPositions('tanker');
      expect(result).toHaveProperty('data');
    });

    it('findOne delegates to service', async () => {
      mockRepo.findOne.mockResolvedValue(mockVehicle);
      const result = await controller.findOne(mockUuid);
      expect(result).toEqual(mockVehicle);
    });

    it('getTelemetry delegates to service', async () => {
      mockRepo.findOne.mockResolvedValue(mockVehicle);
      const result = await controller.getTelemetry(mockUuid);
      expect(result.data).toHaveProperty('vehicleId');
    });

    it('getDtcs delegates to service', async () => {
      const result = await controller.getDtcs(mockUuid);
      expect(result.data).toBeInstanceOf(Array);
    });

    it('create delegates to service', async () => {
      mockRepo.create.mockReturnValue(mockVehicle);
      mockRepo.save.mockResolvedValue(mockVehicle);
      await controller.create({ licensePlate: 'test' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('sendCommand delegates to service', async () => {
      const result = await controller.sendCommand(mockUuid, { type: 'lock' });
      expect(result.data).toHaveProperty('command', 'lock');
    });

    it('update delegates to service', async () => {
      mockRepo.findOne.mockResolvedValue(mockVehicle);
      await controller.update(mockUuid, { status: 'active' } as any);
      expect(mockRepo.update).toHaveBeenCalled();
    });

    it('remove delegates to service', async () => {
      const result = await controller.remove(mockUuid);
      expect(result).toHaveProperty('deleted', true);
    });
  });
});
