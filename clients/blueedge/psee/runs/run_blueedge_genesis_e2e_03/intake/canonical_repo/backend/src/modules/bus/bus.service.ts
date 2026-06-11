import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { BusRoute } from './entities/bus-route.entity';
import { BusStop } from './entities/bus-stop.entity';
import { BusSchedule } from './entities/bus-schedule.entity';
import { BusPassengerCount } from './entities/bus-passenger-count.entity';
import { BusDispatch } from './entities/bus-dispatch.entity';

@Injectable()
export class BusService extends BaseCrudService<BusRoute> {
  constructor(@InjectRepository(BusRoute) repo: Repository<BusRoute>) { super(repo); }
  async getOTP() { return success({ overallOTP: 92.3, byRoute: [{ routeNumber: 'R101', otp: 94.5 }, { routeNumber: 'R202', otp: 88.1 }, { routeNumber: 'R303', otp: 95.2 }] }); }
  async getPassengerStats() { return success({ todayRidership: 12450, avgPerTrip: 28.5, peakHourLoad: 85, revenueToday: 18675 }); }
  async getScheduleAdherence(routeId: string) { return success({ routeId, adherence: 94.2, delaysAvgMin: 2.3, earlyDepartures: 3, missedStops: 0 }); }
}

// ── Stop Management Service ──────────────────────────────────

@Injectable()
export class StopService {
  getAll() {
    return success([
      { id: 'bs-001', stopCode: 'DXB-F55-01', name: 'Dubai Marina Mall', nameAr: 'دبي مارينا مول', latitude: 25.0775, longitude: 55.1390, sequence: 1, hasAccessibility: true, hasShelter: true, hasDisplay: true, status: 'active', avgBoardingsDay: 342, avgAlightingsDay: 128 },
      { id: 'bs-002', stopCode: 'DXB-F55-02', name: 'JBR The Walk', nameAr: 'ذا ووك جي بي آر', latitude: 25.0798, longitude: 55.1335, sequence: 2, hasAccessibility: true, hasShelter: true, hasDisplay: true, status: 'active', avgBoardingsDay: 285, avgAlightingsDay: 195 },
      { id: 'bs-003', stopCode: 'DXB-F55-03', name: 'Media City', nameAr: 'مدينة الإعلام', latitude: 25.0934, longitude: 55.1537, sequence: 3, hasAccessibility: true, hasShelter: false, hasDisplay: true, status: 'active', avgBoardingsDay: 198, avgAlightingsDay: 210 },
      { id: 'bs-004', stopCode: 'DXB-F55-04', name: 'Internet City', nameAr: 'مدينة الإنترنت', latitude: 25.0990, longitude: 55.1580, sequence: 4, hasAccessibility: true, hasShelter: true, hasDisplay: false, status: 'active', avgBoardingsDay: 420, avgAlightingsDay: 156 },
      { id: 'bs-005', stopCode: 'DXB-F55-05', name: 'Knowledge Village', nameAr: 'قرية المعرفة', latitude: 25.1035, longitude: 55.1645, sequence: 5, hasAccessibility: false, hasShelter: false, hasDisplay: false, status: 'active', avgBoardingsDay: 178, avgAlightingsDay: 145 },
      { id: 'bs-006', stopCode: 'DXB-E11-01', name: 'Mall of Emirates', nameAr: 'مول الإمارات', latitude: 25.1181, longitude: 55.2008, sequence: 1, hasAccessibility: true, hasShelter: true, hasDisplay: true, status: 'active', avgBoardingsDay: 680, avgAlightingsDay: 590 },
      { id: 'bs-007', stopCode: 'DXB-E11-02', name: 'Al Quoz Industrial', nameAr: 'القوز الصناعية', latitude: 25.1404, longitude: 55.2142, sequence: 2, hasAccessibility: false, hasShelter: true, hasDisplay: false, status: 'active', avgBoardingsDay: 145, avgAlightingsDay: 320 },
      { id: 'bs-008', stopCode: 'DXB-X28-01', name: 'Ibn Battuta Mall', nameAr: 'ابن بطوطة مول', latitude: 25.0441, longitude: 55.1186, sequence: 1, hasAccessibility: true, hasShelter: true, hasDisplay: true, status: 'active', avgBoardingsDay: 510, avgAlightingsDay: 485 },
    ]);
  }
  getByRoute(routeId: string) {
    return success({ routeId, stops: [
      { stopCode: 'DXB-F55-01', name: 'Dubai Marina Mall', sequence: 1, arrivalOffset: 0 },
      { stopCode: 'DXB-F55-02', name: 'JBR The Walk', sequence: 2, arrivalOffset: 4 },
      { stopCode: 'DXB-F55-03', name: 'Media City', sequence: 3, arrivalOffset: 9 },
      { stopCode: 'DXB-F55-04', name: 'Internet City', sequence: 4, arrivalOffset: 13 },
      { stopCode: 'DXB-F55-05', name: 'Knowledge Village', sequence: 5, arrivalOffset: 17 },
    ] });
  }
}

// ── Schedule Management Service ──────────────────────────────

@Injectable()
export class ScheduleService {
  getDashboard() {
    return success({
      publishedSchedules: 24, draftSchedules: 3, totalTripsToday: 486, adherencePct: 93.8,
      peakHeadway: '6 min', offPeakHeadway: '12 min', firstService: '05:00', lastService: '00:30',
      gtfsVersion: 'v2026.02.14', gtfsLastPublished: '2026-02-14T04:00:00Z',
    });
  }
  getByRoute(routeId: string) {
    return success([
      { id: 'sch-001', routeNumber: 'F55', dayType: 'weekday', firstDeparture: '05:30', lastDeparture: '23:45', headwayPeakMin: 6, headwayOffPeakMin: 12, tripsPerDay: 108, status: 'published', effectiveFrom: '2026-01-15' },
      { id: 'sch-002', routeNumber: 'F55', dayType: 'friday', firstDeparture: '06:00', lastDeparture: '00:30', headwayPeakMin: 8, headwayOffPeakMin: 15, tripsPerDay: 82, status: 'published', effectiveFrom: '2026-01-15' },
      { id: 'sch-003', routeNumber: 'F55', dayType: 'saturday', firstDeparture: '06:00', lastDeparture: '23:00', headwayPeakMin: 10, headwayOffPeakMin: 15, tripsPerDay: 72, status: 'published', effectiveFrom: '2026-01-15' },
    ]);
  }
  getTimetable(routeId: string) {
    const departures = Array.from({ length: 20 }, (_, i) => {
      const h = 5 + Math.floor(i * 0.9); const m = (i * 6) % 60;
      return { departure: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, tripId: `T-${routeId}-${i + 1}`, adherence: 90 + Math.random() * 10 };
    });
    return success({ routeId, dayType: 'weekday', departures });
  }
  getAdherenceTrend() {
    return success([
      { date: '2026-02-08', adherencePct: 91.2, onTime: 412, late: 38, early: 12 },
      { date: '2026-02-09', adherencePct: 93.1, onTime: 428, late: 31, early: 9 },
      { date: '2026-02-10', adherencePct: 92.5, onTime: 420, late: 35, early: 11 },
      { date: '2026-02-11', adherencePct: 94.8, onTime: 441, late: 22, early: 8 },
      { date: '2026-02-12', adherencePct: 93.2, onTime: 430, late: 30, early: 10 },
      { date: '2026-02-13', adherencePct: 95.1, onTime: 448, late: 19, early: 7 },
      { date: '2026-02-14', adherencePct: 93.8, onTime: 435, late: 28, early: 9 },
    ]);
  }
}

// ── Passenger Analytics Service ──────────────────────────────

@Injectable()
export class PassengerAnalyticsService {
  getDashboard() {
    return success({
      todayRidership: 12450, weeklyRidership: 84200, monthlyRidership: 358700,
      avgLoadFactor: 62.4, peakLoadFactor: 91.3, avgBoardingTime: 3.2,
      accessibilityRequests: 28, wheelchairBoardings: 12,
      byHour: Array.from({ length: 18 }, (_, i) => ({ hour: `${String(i + 5).padStart(2, '0')}:00`, pax: i < 3 ? 200 + i * 150 : i < 5 ? 800 + (i - 3) * 200 : i < 9 ? 1200 - (i - 5) * 100 : i < 12 ? 600 + (i - 9) * 250 : i < 15 ? 1400 - (i - 12) * 150 : 500 - (i - 15) * 100 })),
      topRoutes: [
        { routeNumber: 'F55', name: 'Dubai Marina Loop', dailyPax: 2840, loadFactor: 78 },
        { routeNumber: 'E11', name: 'SZR Express', dailyPax: 2210, loadFactor: 72 },
        { routeNumber: 'F17', name: 'JBR — Media City', dailyPax: 1890, loadFactor: 68 },
        { routeNumber: 'E303', name: 'Deira — Bur Dubai', dailyPax: 1650, loadFactor: 65 },
        { routeNumber: 'X28', name: 'Ibn Battuta Express', dailyPax: 1420, loadFactor: 58 },
      ],
    });
  }
  getLiveLoadFactors() {
    return success([
      { vehicleId: 'BUS-DXB-042', routeNumber: 'F55', onboard: 38, capacity: 45, loadPct: 84, nextStop: 'JBR The Walk', status: 'en_route' },
      { vehicleId: 'BUS-DXB-015', routeNumber: 'E11', onboard: 52, capacity: 60, loadPct: 87, nextStop: 'Mall of Emirates', status: 'en_route' },
      { vehicleId: 'BUS-DXB-078', routeNumber: 'F17', onboard: 12, capacity: 45, loadPct: 27, nextStop: 'Media City', status: 'en_route' },
      { vehicleId: 'BUS-DXB-023', routeNumber: 'F55', onboard: 41, capacity: 45, loadPct: 91, nextStop: 'Internet City', status: 'en_route' },
      { vehicleId: 'BUS-DXB-091', routeNumber: 'E303', onboard: 28, capacity: 60, loadPct: 47, nextStop: 'Gold Souk', status: 'en_route' },
      { vehicleId: 'BUS-DXB-067', routeNumber: 'X28', onboard: 0, capacity: 45, loadPct: 0, nextStop: 'Ibn Battuta', status: 'at_stop' },
      { vehicleId: 'BUS-DXB-034', routeNumber: 'N55', onboard: 8, capacity: 45, loadPct: 18, nextStop: 'Dubai Marina', status: 'en_route' },
      { vehicleId: 'BUS-DXB-108', routeNumber: 'DM1', onboard: 35, capacity: 45, loadPct: 78, nextStop: 'Al Rigga', status: 'en_route' },
    ]);
  }
}

// ── Dispatch Service ─────────────────────────────────────────

@Injectable()
export class DispatchService {
  getDashboard() {
    return success({
      totalDriversToday: 64, activeDrivers: 52, onBreak: 8, offDuty: 4,
      totalBuses: 42, inService: 36, inDepot: 4, inMaintenance: 2,
      tripsCompleted: 312, tripsRemaining: 174, nextShiftChange: '14:00',
      alerts: [
        { type: 'delay', message: 'BUS-078 running 8 min late on F17', severity: 'high', time: '08:41' },
        { type: 'breakdown', message: 'BUS-112 mechanical issue — Al Quoz', severity: 'critical', time: '07:55' },
        { type: 'coverage', message: 'Route N55 needs backup driver for evening shift', severity: 'medium', time: '06:30' },
      ],
    });
  }
  getAssignments() {
    return success([
      { id: 'bd-001', driverName: 'Mohammed Al-Hashimi', vehicleNumber: 'BUS-DXB-042', routeNumber: 'F55', shift: 'morning', startTime: '05:00', endTime: '13:00', status: 'active', tripsCompleted: 8, totalPassengers: 342 },
      { id: 'bd-002', driverName: 'Fatima Al-Zaabi', vehicleNumber: 'BUS-DXB-015', routeNumber: 'E11', shift: 'morning', startTime: '05:30', endTime: '13:30', status: 'active', tripsCompleted: 6, totalPassengers: 278 },
      { id: 'bd-003', driverName: 'Rashid Khalfan', vehicleNumber: 'BUS-DXB-078', routeNumber: 'F17', shift: 'morning', startTime: '06:00', endTime: '14:00', status: 'active', tripsCompleted: 5, totalPassengers: 185 },
      { id: 'bd-004', driverName: 'Aisha Bint Saeed', vehicleNumber: 'BUS-DXB-023', routeNumber: 'F55', shift: 'morning', startTime: '05:15', endTime: '13:15', status: 'active', tripsCompleted: 7, totalPassengers: 310 },
      { id: 'bd-005', driverName: 'Khalid Al-Nuaimi', vehicleNumber: 'BUS-DXB-091', routeNumber: 'E303', shift: 'afternoon', startTime: '13:00', endTime: '21:00', status: 'scheduled', tripsCompleted: 0, totalPassengers: 0 },
      { id: 'bd-006', driverName: 'Salma Al-Ketbi', vehicleNumber: 'BUS-DXB-067', routeNumber: 'X28', shift: 'afternoon', startTime: '13:00', endTime: '21:00', status: 'scheduled', tripsCompleted: 0, totalPassengers: 0 },
      { id: 'bd-007', driverName: 'Omar Darwish', vehicleNumber: 'BUS-DXB-034', routeNumber: 'N55', shift: 'evening', startTime: '17:00', endTime: '01:00', status: 'scheduled', tripsCompleted: 0, totalPassengers: 0 },
    ]);
  }
}

// ── Fare & Revenue Service ───────────────────────────────────

@Injectable()
export class FareService {
  getDashboard() {
    return success({
      todayRevenue: 28400, weeklyRevenue: 192800, monthlyRevenue: 824500, currency: 'AED',
      avgFare: 2.28, fareByType: { regular: 18200, student: 4800, senior: 2100, nol_silver: 2400, nol_gold: 900 },
      paymentMethods: { nolCard: 68, cashless: 22, cash: 10 },
      revenueByRoute: [
        { routeNumber: 'F55', revenue: 6480, trips: 108, paxPerTrip: 26 },
        { routeNumber: 'E11', revenue: 5340, trips: 96, paxPerTrip: 23 },
        { routeNumber: 'F17', revenue: 4320, trips: 84, paxPerTrip: 22 },
        { routeNumber: 'E303', revenue: 3780, trips: 78, paxPerTrip: 21 },
        { routeNumber: 'X28', revenue: 3240, trips: 72, paxPerTrip: 19 },
      ],
      trend7d: [
        { date: '2026-02-08', revenue: 24800 }, { date: '2026-02-09', revenue: 26100 },
        { date: '2026-02-10', revenue: 27200 }, { date: '2026-02-11', revenue: 28900 },
        { date: '2026-02-12', revenue: 27600 }, { date: '2026-02-13', revenue: 25400 },
        { date: '2026-02-14', revenue: 28400 },
      ],
    });
  }
}
