import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { TaxiService } from './taxi.service';
import { TaxiDriverService } from './taxi.service';
import { ZoneService } from './taxi.service';
import { PaymentService } from './taxi.service';
import { DispatchBoardService } from './taxi.service';
import { RatingService } from './taxi.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('taxi') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('taxi')
export class TaxiController {
  constructor(
    private svc: TaxiService, private driverSvc: TaxiDriverService, private zoneSvc: ZoneService,
    private paymentSvc: PaymentService, private dispatchBoardSvc: DispatchBoardService, private ratingSvc: RatingService,
  ) {}
  @RequirePermissions(Permission.TAXI_READ)
  @HttpCacheTTL(30)
  @Get('trips') @ApiOperation({ summary: 'List taxi trips' }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.TAXI_READ)
  @HttpCacheTTL(30)
  @Get('trips/active') @ApiOperation({ summary: 'Active taxi trips' }) getActive() { return this.svc.getActiveTrips(); }
  @RequirePermissions(Permission.TAXI_READ)
  @HttpCacheTTL(30)
  @Get('dispatch/queue') @ApiOperation({ summary: 'Dispatch queue status' }) getQueue() { return this.svc.getDispatchQueue(); }
  @RequirePermissions(Permission.TAXI_READ)
  @HttpCacheTTL(60)
  @Get('stats') @ApiOperation({ summary: 'Taxi statistics' })
  @ApiResponse({ status: 200, description: 'Statistics', schema: { example: {"success":true,"data":{"totalTaxis":25,"available":8,"onTrip":12,"offline":5,"avgFareToday":42.5,"tripsToday":180,"revenueToday":7650}} } }) getStats() { return this.svc.getStats(); }
  @RequirePermissions(Permission.TAXI_READ)
  @HttpCacheTTL(30)
  @Get('medallions') @ApiOperation({ summary: 'Medallion registry' }) getMedallions() { return this.svc.getMedallions(); }
  @RequirePermissions(Permission.TAXI_READ)
  @HttpCacheTTL(30)
  @Get('trips/:id') @ApiOperation({ summary: 'Get taxi trip' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.TAXI_WRITE)
  @InvalidatesCache('taxi')
  @Post('trips') @ApiOperation({ summary: 'Create taxi trip' }) create(@Body() dto: Partial<TaxiTrip>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.TAXI_WRITE)
  @InvalidatesCache('taxi')
  @Patch('trips/:id/accept') @ApiOperation({ summary: 'Accept trip' }) accept(@Param('id') id: string) { return this.svc.update(id, { status: 'accepted', acceptedAt: new Date() } as any); }
  @RequirePermissions(Permission.TAXI_WRITE)
  @InvalidatesCache('taxi')
  @Patch('trips/:id/pickup') @ApiOperation({ summary: 'Passenger picked up' }) pickup(@Param('id') id: string) { return this.svc.update(id, { status: 'in_progress', pickedUpAt: new Date() } as any); }
  @RequirePermissions(Permission.TAXI_WRITE)
  @InvalidatesCache('taxi')
  @Patch('trips/:id/complete') @ApiOperation({ summary: 'Complete trip' }) complete(@Param('id') id: string, @Body() body: { totalFare: number }) { return this.svc.update(id, { status: 'completed', completedAt: new Date(), totalFare: body.totalFare } as any); }

  // ═══ Driver Management (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(30)
  @Get('drivers') @ApiOperation({ summary: 'List all taxi drivers with ratings, trips, revenue' })
  getDrivers() { return this.driverSvc.getAll(); }

  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(60)
  @Get('drivers/leaderboard') @ApiOperation({ summary: 'Driver performance leaderboard' })
  getLeaderboard() { return this.driverSvc.getLeaderboard(); }

  // ═══ Zones & Surge (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(15)
  @Get('zones') @ApiOperation({ summary: 'All taxi zones with demand/supply and surge multipliers' })
  getZones() { return this.zoneSvc.getAll(); }

  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(10)
  @Get('zones/surge') @ApiOperation({ summary: 'Surge pricing summary — active zones, demand/supply trend' })
  getSurgeSummary() { return this.zoneSvc.getSurgeSummary(); }

  // ═══ Payment & Settlements (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(60)
  @Get('payments/dashboard') @ApiOperation({ summary: 'Payment dashboard — revenue, payouts, settlements, payment methods' })
  getPaymentDashboard() { return this.paymentSvc.getDashboard(); }

  // ═══ Dispatch Board (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(5)
  @Get('dispatch/board') @ApiOperation({ summary: 'Live dispatch board — queue, requests, driver availability' })
  getDispatchBoard() { return this.dispatchBoardSvc.getDashboard(); }

  // ═══ Ratings & Feedback (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(60)
  @Get('ratings/dashboard') @ApiOperation({ summary: 'Rating dashboard — avg rating, recent reviews, complaint categories' })
  getRatingDashboard() { return this.ratingSvc.getDashboard(); }

  // ═══ Medallion Registry Deep (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(300)
  @Get('medallions/registry') @ApiOperation({ summary: 'Full medallion registry with driver assignments and expiry' })
  getMedallionRegistry() {
    return success([
      { medallionId: 'M-001', vehicleNumber: 'TAXI-DXB-042', driverName: 'Ahmed Al-Mansouri', issuedDate: '2024-01-15', expiryDate: '2026-01-15', status: 'active', annualFee: 15000, type: 'premium' },
      { medallionId: 'M-002', vehicleNumber: 'TAXI-DXB-019', driverName: 'Tariq Hassan', issuedDate: '2024-03-01', expiryDate: '2026-03-01', status: 'active', annualFee: 15000, type: 'standard' },
      { medallionId: 'M-003', vehicleNumber: 'TAXI-DXB-087', driverName: 'Saif Al-Nuaimi', issuedDate: '2024-06-15', expiryDate: '2026-06-15', status: 'active', annualFee: 15000, type: 'standard' },
      { medallionId: 'M-004', vehicleNumber: 'TAXI-DXB-055', driverName: 'Hamad Khalifa', issuedDate: '2023-11-01', expiryDate: '2025-11-01', status: 'expiring', annualFee: 18000, type: 'premium' },
      { medallionId: 'M-005', vehicleNumber: 'TAXI-DXB-103', driverName: 'Youssef Al-Zaabi', issuedDate: '2025-01-01', expiryDate: '2027-01-01', status: 'active', annualFee: 12000, type: 'economy' },
      { medallionId: 'M-006', vehicleNumber: 'TAXI-DXB-071', driverName: 'Rashid Obaid', issuedDate: '2024-09-15', expiryDate: '2026-09-15', status: 'active', annualFee: 15000, type: 'standard' },
      { medallionId: 'M-007', vehicleNumber: 'TAXI-DXB-128', driverName: 'Majid Al-Ketbi', issuedDate: '2025-02-01', expiryDate: '2027-02-01', status: 'active', annualFee: 15000, type: 'standard' },
      { medallionId: 'M-008', vehicleNumber: 'TAXI-DXB-092', driverName: 'Faisal Al-Hashimi', issuedDate: '2024-04-15', expiryDate: '2026-04-15', status: 'active', annualFee: 12000, type: 'economy' },
    ]);
  }

  // ═══ Compliance (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(300)
  @Get('compliance') @ApiOperation({ summary: 'Taxi fleet compliance — RTA permits, vehicle inspections, driver licenses' })
  getCompliance() {
    return success({
      overallPct: 95.4,
      rtaPermits: { valid: 28, expiring: 2, expired: 0, total: 30 },
      vehicleInspections: { passed: 27, due: 3, overdue: 0, nextDue: '2026-02-28' },
      driverLicenses: { valid: 55, expiringSoon: 3, expired: 0, suspended: 0 },
      meterCalibration: { calibrated: 28, due: 2, overdue: 0, lastCalibration: '2026-01-20' },
      insurancePolicies: { active: 30, expiring: 1, lapsed: 0 },
    });
  }

  // ═══ Live Fleet (NEW) ═══
  @RequirePermissions(Permission.TAXI_READ) @HttpCacheTTL(5)
  @Get('fleet/live') @ApiOperation({ summary: 'Live taxi positions for map — all active taxis with status, passenger info' })
  getLiveFleet() {
    return success([
      { vehicleId: 'TAXI-DXB-042', driver: 'Ahmed Al-Mansouri', lat: 25.2048, lng: 55.2708, speed: 38, heading: 90, status: 'on_trip', passenger: 'Sarah M.', dropoff: 'Marina Gate', eta: '8 min', fare: 35 },
      { vehicleId: 'TAXI-DXB-019', driver: 'Tariq Hassan', lat: 25.0657, lng: 55.1713, speed: 0, heading: 0, status: 'available', passenger: null, dropoff: null, eta: null, fare: null },
      { vehicleId: 'TAXI-DXB-087', driver: 'Saif Al-Nuaimi', lat: 25.2532, lng: 55.3657, speed: 45, heading: 270, status: 'on_trip', passenger: 'Airport Queue #47', dropoff: 'JBR Hilton', eta: '22 min', fare: 85 },
      { vehicleId: 'TAXI-DXB-055', driver: 'Hamad Khalifa', lat: 25.2117, lng: 55.2818, speed: 22, heading: 180, status: 'on_trip', passenger: 'Khalid A.', dropoff: 'Business Bay', eta: '4 min', fare: 22 },
      { vehicleId: 'TAXI-DXB-071', driver: 'Rashid Obaid', lat: 25.2697, lng: 55.3095, speed: 15, heading: 315, status: 'on_trip', passenger: 'Walk-in', dropoff: 'Al Rigga Metro', eta: '6 min', fare: 15 },
      { vehicleId: 'TAXI-DXB-128', driver: 'Majid Al-Ketbi', lat: 25.2285, lng: 55.3273, speed: 0, heading: 45, status: 'available', passenger: null, dropoff: null, eta: null, fare: null },
      { vehicleId: 'TAXI-DXB-092', driver: 'Faisal Al-Hashimi', lat: 25.2485, lng: 55.3524, speed: 52, heading: 135, status: 'on_trip', passenger: 'James K.', dropoff: 'City Walk', eta: '12 min', fare: 48 },
    ]);
  }
}
