import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { TaxiTrip } from './entities/taxi-trip.entity';
import { TaxiDriver } from './entities/taxi-driver.entity';
import { TaxiZone } from './entities/taxi-zone.entity';
import { TaxiPayment } from './entities/taxi-payment.entity';

@Injectable()
export class TaxiService extends BaseCrudService<TaxiTrip> {
  constructor(@InjectRepository(TaxiTrip) repo: Repository<TaxiTrip>) { super(repo); }
  async getActiveTrips() { return success(await this.repo.find({ where: { status: 'in_progress' }, order: { requestedAt: 'DESC' } })); }
  async getDispatchQueue() { return success({ pending: 8, accepted: 12, enRoute: 5, available: 23, avgWaitMin: 4.2 }); }
  async getStats() { return success({ totalTrips: 3450, completedToday: 245, avgFare: 42.5, totalRevenue: 10412, avgRating: 4.7, avgWaitMin: 3.8, surgeActive: false }); }
  async getMedallions() { return success([{ medallionId: 'M-001', vehicleId: 'v1', status: 'active', issuedDate: '2024-01-15', expiryDate: '2026-01-15' }]); }
}

// ── Driver Management Service ────────────────────────────────

@Injectable()
export class TaxiDriverService {
  getAll() {
    return success([
      { id: 'td-001', name: 'Ahmed Al-Mansouri', nameAr: 'أحمد المنصوري', licenseNumber: 'DXB-TX-4821', medallionId: 'M-001', vehicleNumber: 'TAXI-DXB-042', rating: 4.92, totalTrips: 8420, tripsToday: 14, revenueToday: 680, acceptanceRate: 96.2, cancellationRate: 1.8, status: 'on_trip', currentShift: 'morning', lastLat: 25.2048, lastLng: 55.2708, phone: '+971-50-123-4001' },
      { id: 'td-002', name: 'Tariq Hassan', nameAr: 'طارق حسن', licenseNumber: 'DXB-TX-3915', medallionId: 'M-002', vehicleNumber: 'TAXI-DXB-019', rating: 4.85, totalTrips: 6230, tripsToday: 11, revenueToday: 520, acceptanceRate: 94.5, cancellationRate: 2.1, status: 'available', currentShift: 'morning', lastLat: 25.0657, lastLng: 55.1713, phone: '+971-50-123-4002' },
      { id: 'td-003', name: 'Saif Al-Nuaimi', nameAr: 'سيف النعيمي', licenseNumber: 'DXB-TX-5102', medallionId: 'M-003', vehicleNumber: 'TAXI-DXB-087', rating: 4.78, totalTrips: 5180, tripsToday: 8, revenueToday: 385, acceptanceRate: 91.8, cancellationRate: 3.5, status: 'on_trip', currentShift: 'morning', lastLat: 25.2532, lastLng: 55.3657, phone: '+971-50-123-4003' },
      { id: 'td-004', name: 'Hamad Khalifa', nameAr: 'حمد خليفة', licenseNumber: 'DXB-TX-2847', medallionId: 'M-004', vehicleNumber: 'TAXI-DXB-055', rating: 4.95, totalTrips: 12100, tripsToday: 16, revenueToday: 820, acceptanceRate: 98.1, cancellationRate: 0.9, status: 'on_trip', currentShift: 'morning', lastLat: 25.1985, lastLng: 55.2796, phone: '+971-50-123-4004' },
      { id: 'td-005', name: 'Youssef Al-Zaabi', nameAr: 'يوسف الزعابي', licenseNumber: 'DXB-TX-6034', medallionId: 'M-005', vehicleNumber: 'TAXI-DXB-103', rating: 4.68, totalTrips: 3450, tripsToday: 0, revenueToday: 0, acceptanceRate: 88.4, cancellationRate: 4.2, status: 'off_duty', currentShift: 'afternoon', lastLat: 25.1165, lastLng: 55.2009, phone: '+971-50-123-4005' },
      { id: 'td-006', name: 'Rashid Obaid', nameAr: 'راشد عبيد', licenseNumber: 'DXB-TX-1923', medallionId: 'M-006', vehicleNumber: 'TAXI-DXB-071', rating: 4.71, totalTrips: 9800, tripsToday: 12, revenueToday: 590, acceptanceRate: 93.6, cancellationRate: 2.8, status: 'on_break', currentShift: 'morning', lastLat: 25.0775, lastLng: 55.1390, phone: '+971-50-123-4006' },
      { id: 'td-007', name: 'Majid Al-Ketbi', nameAr: 'ماجد الكتبي', licenseNumber: 'DXB-TX-7291', medallionId: 'M-007', vehicleNumber: 'TAXI-DXB-128', rating: 4.88, totalTrips: 7650, tripsToday: 13, revenueToday: 645, acceptanceRate: 95.8, cancellationRate: 1.5, status: 'available', currentShift: 'morning', lastLat: 25.2285, lastLng: 55.3273, phone: '+971-50-123-4007' },
      { id: 'td-008', name: 'Faisal Al-Hashimi', nameAr: 'فيصل الهاشمي', licenseNumber: 'DXB-TX-4156', medallionId: 'M-008', vehicleNumber: 'TAXI-DXB-092', rating: 4.82, totalTrips: 4920, tripsToday: 10, revenueToday: 475, acceptanceRate: 92.3, cancellationRate: 3.1, status: 'on_trip', currentShift: 'morning', lastLat: 25.2485, lastLng: 55.3524, phone: '+971-50-123-4008' },
    ]);
  }
  getLeaderboard() {
    return success([
      { rank: 1, name: 'Hamad Khalifa', rating: 4.95, trips: 16, revenue: 820, acceptance: 98.1 },
      { rank: 2, name: 'Ahmed Al-Mansouri', rating: 4.92, trips: 14, revenue: 680, acceptance: 96.2 },
      { rank: 3, name: 'Majid Al-Ketbi', rating: 4.88, trips: 13, revenue: 645, acceptance: 95.8 },
      { rank: 4, name: 'Tariq Hassan', rating: 4.85, trips: 11, revenue: 520, acceptance: 94.5 },
      { rank: 5, name: 'Faisal Al-Hashimi', rating: 4.82, trips: 10, revenue: 475, acceptance: 92.3 },
    ]);
  }
}

// ── Zone & Surge Service ─────────────────────────────────────

@Injectable()
export class ZoneService {
  getAll() {
    return success([
      { id: 'tz-001', name: 'Dubai Mall / Burj Khalifa', nameAr: 'دبي مول / برج خليفة', centerLat: 25.1972, centerLng: 55.2744, radiusM: 800, zoneType: 'mall', surgeMultiplier: 1.0, currentDemand: 42, availableTaxis: 15, status: 'active', baseFare: 12, perKmRate: 1.96, perMinRate: 0.54 },
      { id: 'tz-002', name: 'DXB Airport T3', nameAr: 'مطار دبي T3', centerLat: 25.2532, centerLng: 55.3657, radiusM: 1200, zoneType: 'airport', surgeMultiplier: 1.0, currentDemand: 85, availableTaxis: 28, status: 'active', baseFare: 25, perKmRate: 1.96, perMinRate: 0.54 },
      { id: 'tz-003', name: 'DXB Airport T1', nameAr: 'مطار دبي T1', centerLat: 25.2485, centerLng: 55.3524, radiusM: 800, zoneType: 'airport', surgeMultiplier: 1.0, currentDemand: 38, availableTaxis: 12, status: 'active', baseFare: 25, perKmRate: 1.96, perMinRate: 0.54 },
      { id: 'tz-004', name: 'JBR / Marina Walk', nameAr: 'جي بي آر / مارينا ووك', centerLat: 25.0798, centerLng: 55.1335, radiusM: 600, zoneType: 'hotel', surgeMultiplier: 1.5, currentDemand: 35, availableTaxis: 8, status: 'surge', baseFare: 12, perKmRate: 1.96, perMinRate: 0.54 },
      { id: 'tz-005', name: 'DIFC / Business Bay', nameAr: 'مركز دبي المالي / الخليج التجاري', centerLat: 25.2117, centerLng: 55.2818, radiusM: 1000, zoneType: 'business', surgeMultiplier: 1.8, currentDemand: 55, availableTaxis: 10, status: 'surge', baseFare: 12, perKmRate: 1.96, perMinRate: 0.54 },
      { id: 'tz-006', name: 'Palm Jumeirah', nameAr: 'نخلة جميرا', centerLat: 25.1124, centerLng: 55.1390, radiusM: 2000, zoneType: 'hotel', surgeMultiplier: 1.3, currentDemand: 22, availableTaxis: 6, status: 'surge', baseFare: 12, perKmRate: 1.96, perMinRate: 0.54 },
      { id: 'tz-007', name: 'Deira Gold Souk', nameAr: 'سوق الذهب ديرة', centerLat: 25.2697, centerLng: 55.3095, radiusM: 500, zoneType: 'standard', surgeMultiplier: 1.0, currentDemand: 18, availableTaxis: 9, status: 'active', baseFare: 12, perKmRate: 1.96, perMinRate: 0.54 },
      { id: 'tz-008', name: 'Global Village', nameAr: 'القرية العالمية', centerLat: 25.0700, centerLng: 55.3070, radiusM: 1500, zoneType: 'event', surgeMultiplier: 2.0, currentDemand: 120, availableTaxis: 18, status: 'surge', baseFare: 12, perKmRate: 1.96, perMinRate: 0.54 },
    ]);
  }
  getSurgeSummary() {
    return success({
      activeZones: 8, surgeZones: 4, totalDemand: 415, totalAvailable: 106,
      avgSurge: 1.33, maxSurge: 2.0, maxSurgeZone: 'Global Village',
      demandTrend: [
        { time: '06:00', demand: 85, supply: 120 }, { time: '08:00', demand: 280, supply: 105 },
        { time: '10:00', demand: 180, supply: 108 }, { time: '12:00', demand: 220, supply: 102 },
        { time: '14:00', demand: 250, supply: 98 }, { time: '16:00', demand: 320, supply: 95 },
        { time: '18:00', demand: 415, supply: 106 }, { time: '20:00', demand: 380, supply: 110 },
        { time: '22:00', demand: 190, supply: 115 },
      ],
    });
  }
}

// ── Payment & Settlement Service ─────────────────────────────

@Injectable()
export class PaymentService {
  getDashboard() {
    return success({
      todayRevenue: 28900, weeklyRevenue: 198500, monthlyRevenue: 842000, currency: 'AED',
      driverPayouts: 23120, companyRevenue: 5780, avgFare: 42.5, avgTip: 5.20,
      paymentBreakdown: { card: 48, cash: 28, wallet: 15, corporate: 7, nol: 2 },
      settlementStatus: { settled: 342, pending: 45, disputed: 3, refunded: 2 },
      topEarners: [
        { name: 'Hamad Khalifa', trips: 16, revenue: 820, tips: 95 },
        { name: 'Ahmed Al-Mansouri', trips: 14, revenue: 680, tips: 72 },
        { name: 'Majid Al-Ketbi', trips: 13, revenue: 645, tips: 68 },
      ],
      trend7d: [
        { date: '2026-02-08', revenue: 24200, trips: 342 }, { date: '2026-02-09', revenue: 26800, trips: 378 },
        { date: '2026-02-10', revenue: 25500, trips: 361 }, { date: '2026-02-11', revenue: 28100, trips: 395 },
        { date: '2026-02-12', revenue: 31200, trips: 438 }, { date: '2026-02-13', revenue: 33800, trips: 472 },
        { date: '2026-02-14', revenue: 28900, trips: 387 },
      ],
    });
  }
}

// ── Dispatch Board Service ───────────────────────────────────

@Injectable()
export class DispatchBoardService {
  getDashboard() {
    return success({
      queuedRequests: 8, acceptedEnRoute: 12, inProgress: 18, completed24h: 387,
      avgWaitSec: 252, avgPickupDistKm: 1.8, avgTripDurationMin: 18.5,
      availableDrivers: 23, totalDriversOnShift: 58,
      recentRequests: [
        { id: 'req-001', passengerName: 'Sarah M.', pickup: 'Dubai Mall Valet', dropoff: 'Marina Gate Tower', bookingType: 'app_dispatch', requestedAt: '2026-02-14T18:32:00Z', status: 'pending', estimatedFare: 35 },
        { id: 'req-002', passengerName: 'Corporate — Hilton', pickup: 'Hilton Dubai Creek', dropoff: 'DXB Terminal 3', bookingType: 'corporate', requestedAt: '2026-02-14T18:30:00Z', status: 'accepted', driverName: 'Ahmed Al-Mansouri', estimatedFare: 65 },
        { id: 'req-003', passengerName: 'Airport Queue #47', pickup: 'DXB Terminal 1', dropoff: 'JBR Hilton', bookingType: 'airport', requestedAt: '2026-02-14T18:28:00Z', status: 'en_route', driverName: 'Saif Al-Nuaimi', estimatedFare: 85 },
        { id: 'req-004', passengerName: 'Khalid A.', pickup: 'DIFC Gate Village', dropoff: 'Business Bay', bookingType: 'app_dispatch', requestedAt: '2026-02-14T18:25:00Z', status: 'in_progress', driverName: 'Hamad Khalifa', estimatedFare: 22 },
        { id: 'req-005', passengerName: 'Walk-in', pickup: 'Gold Souk', dropoff: 'Al Rigga Metro', bookingType: 'street_hail', requestedAt: '2026-02-14T18:20:00Z', status: 'in_progress', driverName: 'Rashid Obaid', estimatedFare: 15 },
      ],
    });
  }
}

// ── Rating & Feedback Service ────────────────────────────────

@Injectable()
export class RatingService {
  getDashboard() {
    return success({
      avgRating: 4.72, totalReviews: 34500, fiveStarPct: 68, fourStarPct: 22, threeStarPct: 7, twoStarPct: 2, oneStarPct: 1,
      recentFeedback: [
        { tripId: 'trip-001', passengerName: 'Sarah M.', rating: 5, comment: 'Excellent service, very clean car. Driver knew the best route.', driverName: 'Hamad Khalifa', date: '2026-02-14T17:45:00Z' },
        { tripId: 'trip-002', passengerName: 'James K.', rating: 4, comment: 'Good ride, slightly long wait time at pickup.', driverName: 'Ahmed Al-Mansouri', date: '2026-02-14T16:20:00Z' },
        { tripId: 'trip-003', passengerName: 'Fatima S.', rating: 5, comment: 'Very professional and courteous driver.', driverName: 'Majid Al-Ketbi', date: '2026-02-14T15:10:00Z' },
        { tripId: 'trip-004', passengerName: 'Tourist', rating: 3, comment: 'Driver took a longer route than expected.', driverName: 'Youssef Al-Zaabi', date: '2026-02-14T12:30:00Z' },
        { tripId: 'trip-005', passengerName: 'Corporate — DIFC', rating: 5, comment: 'Perfect corporate pickup, on time as always.', driverName: 'Tariq Hassan', date: '2026-02-14T09:15:00Z' },
      ],
      topComplaints: [
        { category: 'Long wait time', count: 12, pct: 35 },
        { category: 'Route inefficiency', count: 8, pct: 23 },
        { category: 'Vehicle cleanliness', count: 6, pct: 17 },
        { category: 'AC temperature', count: 5, pct: 14 },
        { category: 'Driver behavior', count: 4, pct: 11 },
      ],
      trend30d: [4.65, 4.68, 4.70, 4.69, 4.71, 4.72, 4.70, 4.73, 4.72, 4.74, 4.71, 4.72, 4.75, 4.73, 4.72, 4.76, 4.74, 4.73, 4.75, 4.72, 4.74, 4.73, 4.71, 4.72, 4.73, 4.74, 4.72, 4.73, 4.72, 4.72],
    });
  }
}
