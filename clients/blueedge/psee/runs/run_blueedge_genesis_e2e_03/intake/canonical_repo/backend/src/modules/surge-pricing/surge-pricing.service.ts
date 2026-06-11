import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { SurgeZone } from './entities/surge-zone.entity';

@Injectable()
export class SurgePricingService extends BaseCrudService<SurgeZone> {
  constructor(@InjectRepository(SurgeZone) repo: Repository<SurgeZone>) { super(repo); }

  async getActiveZones() {
    return success([
      { id: 'z1', name: 'Downtown Dubai', centerLat: 25.2048, centerLng: 55.2708, multiplier: 2.1, radiusKm: 3.5, demandLevel: 87, availableDrivers: 12, status: 'surge', peakReason: 'Evening rush + Dubai Mall events' },
      { id: 'z2', name: 'DXB Airport T3', centerLat: 25.2532, centerLng: 55.3657, multiplier: 1.8, radiusKm: 2.0, demandLevel: 72, availableDrivers: 28, status: 'surge', peakReason: 'International arrivals peak' },
      { id: 'z3', name: 'Marina Walk', centerLat: 25.0836, centerLng: 55.1466, multiplier: 1.5, radiusKm: 2.5, demandLevel: 55, availableDrivers: 18, status: 'elevated', peakReason: 'Friday evening dining' },
      { id: 'z4', name: 'DIFC', centerLat: 25.2100, centerLng: 55.2790, multiplier: 1.3, radiusKm: 1.5, demandLevel: 42, availableDrivers: 15, status: 'elevated', peakReason: 'After-work commuters' },
      { id: 'z5', name: 'JBR Beach', centerLat: 25.0780, centerLng: 55.1340, multiplier: 1.0, radiusKm: 2.0, demandLevel: 25, availableDrivers: 22, status: 'normal', peakReason: 'Steady demand' },
      { id: 'z6', name: 'Al Quoz Industrial', centerLat: 25.1553, centerLng: 55.2255, multiplier: 1.0, radiusKm: 4.0, demandLevel: 15, availableDrivers: 8, status: 'normal', peakReason: 'Low demand area' },
    ]);
  }

  async getDemandHeatmap() {
    return success({
      timestamp: new Date(),
      gridSize: '500m',
      hotspots: [
        { lat: 25.2048, lng: 55.2708, intensity: 0.92, label: 'Burj Khalifa / Dubai Mall' },
        { lat: 25.2532, lng: 55.3657, intensity: 0.85, label: 'DXB Airport' },
        { lat: 25.0836, lng: 55.1466, intensity: 0.68, label: 'Marina' },
        { lat: 25.1972, lng: 55.2744, intensity: 0.55, label: 'Deira City Centre' },
        { lat: 25.1185, lng: 55.2012, intensity: 0.45, label: 'Business Bay' },
      ],
      totalRequests: 1245,
      avgWaitTime: '4.2 min',
      supplyDemandRatio: 0.72,
    });
  }

  async calculateFare(body: { originLat: number; originLng: number; destLat: number; destLng: number }) {
    const distKm = Math.sqrt(Math.pow((body.destLat - body.originLat) * 111, 2) + Math.pow((body.destLng - body.originLng) * 111 * Math.cos(body.originLat * Math.PI / 180), 2));
    const baseFare = 12; const perKm = 2.19; const surgeMultiplier = 1.8;
    const estimatedFare = (baseFare + distKm * perKm) * surgeMultiplier;
    return success({ distanceKm: Math.round(distKm * 10) / 10, baseFare, perKmRate: perKm, surgeMultiplier, estimatedFare: Math.round(estimatedFare * 100) / 100, currency: 'AED', estimatedDuration: `${Math.round(distKm * 2.5)} min`, surgeReason: 'High demand in Downtown Dubai area' });
  }

  async getPricingConfig() {
    return success({
      baseFare: 12.0, minimumFare: 12.0, perKmRate: 2.19, perMinRate: 0.55, bookingFee: 5.0, currency: 'AED',
      surgeTiers: [
        { level: 'normal', multiplierRange: [1.0, 1.0], demandThreshold: 0, color: '#10b981' },
        { level: 'elevated', multiplierRange: [1.1, 1.5], demandThreshold: 40, color: '#eab308' },
        { level: 'surge', multiplierRange: [1.5, 2.5], demandThreshold: 65, color: '#f97316' },
        { level: 'peak', multiplierRange: [2.5, 3.5], demandThreshold: 85, color: '#ef4444' },
      ],
      maxMultiplier: 3.5, cooldownMinutes: 15, rtaRegulatedCap: 3.5,
    });
  }

  async getRevenueImpact() {
    return success({
      today: { surgeRevenue: 12450, normalRevenue: 34200, surgePercent: 26.7, avgMultiplier: 1.65, peakMultiplier: 2.8 },
      weekly: { surgeRevenue: 78320, normalRevenue: 245800, surgePercent: 24.2 },
      topZones: [
        { zone: 'Downtown Dubai', revenue: 4200, avgMultiplier: 2.1 },
        { zone: 'DXB Airport T3', revenue: 3800, avgMultiplier: 1.8 },
        { zone: 'Marina Walk', revenue: 2100, avgMultiplier: 1.5 },
      ],
    });
  }
}
