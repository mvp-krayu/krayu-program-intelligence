import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CargoService, CustodyService, TankerController } from './tanker.module';
import { CargoManifest } from './entities/cargo-manifest.entity';
import { CustodyTransfer } from './entities/custody-transfer.entity';
import { createMockRepository, mockCargoManifest, mockCustodyTransfer, mockUuid } from '../../test/test-utils';

describe('TankerModule', () => {
  let controller: TankerController;
  let cargoSvc: CargoService;
  let custodySvc: CustodyService;
  let cargoRepo: ReturnType<typeof createMockRepository>;
  let custodyRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    cargoRepo = createMockRepository();
    custodyRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TankerController],
      providers: [
        CargoService, CustodyService,
        { provide: getRepositoryToken(CargoManifest), useValue: cargoRepo },
        { provide: getRepositoryToken(CustodyTransfer), useValue: custodyRepo },
      ],
    }).compile();
    controller = module.get(TankerController);
    cargoSvc = module.get(CargoService);
    custodySvc = module.get(CustodyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cargoSvc).toBeDefined();
    expect(custodySvc).toBeDefined();
  });

  describe('CargoService', () => {
    it('findAll returns manifests', async () => {
      cargoRepo.find.mockResolvedValue([mockCargoManifest]);
      expect(await cargoSvc.findAll({})).toHaveLength(1);
    });

    it('getActive returns in-transit manifests', async () => {
      cargoRepo.find.mockResolvedValue([mockCargoManifest]);
      const result = await cargoSvc.getActive();
      expect(result).toHaveProperty('data');
      expect(cargoRepo.find).toHaveBeenCalledWith(expect.objectContaining({
        where: { status: 'in_transit' },
      }));
    });

    it('getStats returns cargo statistics', async () => {
      const result = await cargoSvc.getStats();
      expect(result.data).toHaveProperty('totalManifests');
      expect(result.data).toHaveProperty('inTransit');
      expect(result.data).toHaveProperty('discrepancyRate');
    });

    it('create saves manifest', async () => {
      cargoRepo.create.mockReturnValue(mockCargoManifest);
      cargoRepo.save.mockResolvedValue(mockCargoManifest);
      await cargoSvc.create({ productName: 'Diesel' } as any);
      expect(cargoRepo.save).toHaveBeenCalled();
    });
  });

  describe('CustodyService', () => {
    it('findAll returns transfers', async () => {
      custodyRepo.find.mockResolvedValue([mockCustodyTransfer]);
      expect(await custodySvc.findAll({})).toHaveLength(1);
    });

    it('getDisputed returns disputed transfers', async () => {
      custodyRepo.find.mockResolvedValue([]);
      const result = await custodySvc.getDisputed();
      expect(custodyRepo.find).toHaveBeenCalledWith(expect.objectContaining({
        where: { status: 'disputed' },
      }));
    });
  });

  describe('TankerController', () => {
    it('findAll manifests', async () => {
      cargoRepo.find.mockResolvedValue([]);
      await controller.findAll({});
      expect(cargoRepo.find).toHaveBeenCalled();
    });

    it('getActive manifests', async () => {
      cargoRepo.find.mockResolvedValue([]);
      const result = await controller.getActive();
      expect(result).toHaveProperty('data');
    });

    it('getStats returns stats', async () => {
      const result = await controller.getStats();
      expect(result.data.totalManifests).toBeDefined();
    });

    it('getTankStatus returns compartment data', async () => {
      const result = await controller.getTankStatus(mockUuid);
      expect(result.data).toHaveProperty('vehicleId', mockUuid);
      expect(result.data).toHaveProperty('compartments');
      expect(result.data.compartments).toHaveLength(4);
      expect(result.data.compartments[0]).toHaveProperty('productName');
      expect(result.data.compartments[0]).toHaveProperty('volumeL');
      expect(result.data.compartments[0]).toHaveProperty('tempC');
      expect(result.data).toHaveProperty('gasDetection');
      expect(result.data).toHaveProperty('sloshRisk', 'LOW');
    });

    it('getHazmat returns compliance data', async () => {
      const result = await controller.getHazmat();
      expect(result.data).toHaveProperty('compliantVehicles');
      expect(result.data).toHaveProperty('nonCompliant');
      expect(result.data).toHaveProperty('expiringPermits');
    });

    it('custody transfer flow', async () => {
      custodyRepo.find.mockResolvedValue([]);
      await controller.getCustody({});
      expect(custodyRepo.find).toHaveBeenCalled();
    });
  });
});
