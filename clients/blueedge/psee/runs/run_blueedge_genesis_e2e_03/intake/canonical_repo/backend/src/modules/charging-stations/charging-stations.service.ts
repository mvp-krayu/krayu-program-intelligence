import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { ChargingStation } from './entities/charging-station.entity';

@Injectable()
export class ChargingStationsService extends BaseCrudService<ChargingStation> {
  constructor(@InjectRepository(ChargingStation) repo: Repository<ChargingStation>) { super(repo); }
  async getNearby(lat: number, lng: number, radiusKm: number) {
    return success([
      { id: 'cs1', name: 'DEWA EV Green Charger — Mall of Emirates', operator: 'DEWA', address: 'Mall of Emirates, Al Barsha', lat: 25.1185, lng: 55.2008, distanceKm: 1.2, connectors: [{ type: 'CCS2', powerKw: 150, available: 2 }, { type: 'CHAdeMO', powerKw: 50, available: 1 }], status: 'operational', pricePerKwh: 0.29 },
      { id: 'cs2', name: 'ENOC E-Station — Sheikh Zayed Rd', operator: 'ENOC', address: 'ENOC Station 142, SZR', lat: 25.1350, lng: 55.1920, distanceKm: 2.8, connectors: [{ type: 'CCS2', powerKw: 350, available: 1 }, { type: 'Type2', powerKw: 22, available: 3 }], status: 'operational', pricePerKwh: 0.29 },
      { id: 'cs3', name: 'Tesla Supercharger — DIFC', operator: 'Tesla', address: 'Gate Village, DIFC', lat: 25.2100, lng: 55.2790, distanceKm: 4.5, connectors: [{ type: 'Tesla', powerKw: 250, available: 4 }], status: 'operational', pricePerKwh: 0.35 },
      { id: 'cs4', name: 'ADNOC Distribution — Jebel Ali', operator: 'ADNOC', address: 'ADNOC Station, Jebel Ali', lat: 25.0580, lng: 55.1350, distanceKm: 8.2, connectors: [{ type: 'CCS2', powerKw: 150, available: 3 }, { type: 'Type2', powerKw: 22, available: 2 }], status: 'operational', pricePerKwh: 0.29 },
    ]);
  }
  async getNetwork() {
    return success({
      totalStations: 485, totalConnectors: 1240, operators: ['DEWA', 'ENOC', 'ADNOC', 'Tesla', 'ChargePoint'],
      byPower: { dcFast150kw: 320, dcUltra350kw: 85, acLevel2: 835 },
      byStatus: { operational: 458, maintenance: 18, offline: 9 },
      coverage: { dubai: 285, abuDhabi: 120, sharjah: 45, other: 35 },
      avgAvailability: 92.5, avgPricePerKwh: 0.29,
    });
  }
  async getRoutePlanning(originLat: number, originLng: number, destLat: number, destLng: number, vehicleRangeKm: number) {
    return success({ route: { origin: { lat: originLat, lng: originLng }, dest: { lat: destLat, lng: destLng }, totalDistanceKm: 145, vehicleRangeKm, stopsRequired: 1, chargingStops: [{ station: 'DEWA EV Green Charger — Al Ain Rd', chargeTimeMin: 25, targetSoc: 80 }], totalTimeMin: 125, totalChargeCostAed: 45.50 } });
  }
}
