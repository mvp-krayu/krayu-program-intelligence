import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { BusService } from './bus.service';
import { StopService } from './bus.service';
import { ScheduleService } from './bus.service';
import { PassengerAnalyticsService } from './bus.service';
import { DispatchService } from './bus.service';
import { FareService } from './bus.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('bus') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('bus')
export class BusController {
  constructor(
    private svc: BusService, private stopSvc: StopService, private scheduleSvc: ScheduleService,
    private paxSvc: PassengerAnalyticsService, private dispatchSvc: DispatchService, private fareSvc: FareService,
  ) {}
  @RequirePermissions(Permission.BUS_READ)
  @HttpCacheTTL(300)
  @Get('routes') @ApiOperation({ summary: 'List bus routes' }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.BUS_READ)
  @HttpCacheTTL(300)
  @Get('routes/otp') @ApiOperation({ summary: 'On-time performance' }) getOTP() { return this.svc.getOTP(); }
  @RequirePermissions(Permission.BUS_READ)
  @HttpCacheTTL(300)
  @Get('passengers/stats') @ApiOperation({ summary: 'Passenger statistics' }) getPassengerStats() { return this.svc.getPassengerStats(); }
  @RequirePermissions(Permission.BUS_READ)
  @HttpCacheTTL(300)
  @Get('routes/:id') @ApiOperation({ summary: 'Get route' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.BUS_READ)
  @HttpCacheTTL(300)
  @Get('routes/:id/schedule') @ApiOperation({ summary: 'Route schedule adherence' }) getSchedule(@Param('id') id: string) { return this.svc.getScheduleAdherence(id); }
  @RequirePermissions(Permission.BUS_WRITE)
  @InvalidatesCache('bus')
  @Post('routes') @ApiOperation({ summary: 'Create route' }) create(@Body() dto: Partial<BusRoute>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.BUS_WRITE)
  @InvalidatesCache('bus')
  @Put('routes/:id') @ApiOperation({ summary: 'Update route' }) update(@Param('id') id: string, @Body() dto: Partial<BusRoute>) { return this.svc.update(id, dto); }
  @RequirePermissions(Permission.BUS_WRITE)
  @InvalidatesCache('bus')
  @Delete('routes/:id') @ApiOperation({ summary: 'Delete route' }) remove(@Param('id') id: string) { return this.svc.remove(id); }

  // ═══ Stop Management (NEW) ═══
  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(300)
  @Get('stops') @ApiOperation({ summary: 'List all bus stops with accessibility and ridership data' })
  getStops() { return this.stopSvc.getAll(); }

  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(300)
  @Get('stops/by-route/:routeId') @ApiOperation({ summary: 'Stops for a specific route with sequence and timing offsets' })
  getStopsByRoute(@Param('routeId') id: string) { return this.stopSvc.getByRoute(id); }

  // ═══ Schedule Management (NEW) ═══
  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(60)
  @Get('schedules/dashboard') @ApiOperation({ summary: 'Schedule dashboard — GTFS version, adherence, headways' })
  getScheduleDashboard() { return this.scheduleSvc.getDashboard(); }

  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(300)
  @Get('schedules/route/:routeId') @ApiOperation({ summary: 'Schedules for a route (weekday, friday, saturday, holiday)' })
  getSchedulesByRoute(@Param('routeId') id: string) { return this.scheduleSvc.getByRoute(id); }

  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(300)
  @Get('schedules/timetable/:routeId') @ApiOperation({ summary: 'Full timetable with departure times and adherence' })
  getTimetable(@Param('routeId') id: string) { return this.scheduleSvc.getTimetable(id); }

  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(60)
  @Get('schedules/adherence-trend') @ApiOperation({ summary: '7-day schedule adherence trend' })
  getAdherenceTrend() { return this.scheduleSvc.getAdherenceTrend(); }

  // ═══ Passenger Analytics (NEW) ═══
  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(30)
  @Get('passengers/dashboard') @ApiOperation({ summary: 'Passenger analytics dashboard — ridership, load factors, top routes' })
  getPassengerDashboard() { return this.paxSvc.getDashboard(); }

  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(10)
  @Get('passengers/live-load') @ApiOperation({ summary: 'Live load factors for all active buses' })
  getLiveLoadFactors() { return this.paxSvc.getLiveLoadFactors(); }

  // ═══ Dispatch (NEW) ═══
  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(15)
  @Get('dispatch/dashboard') @ApiOperation({ summary: 'Dispatch dashboard — driver status, bus availability, alerts' })
  getDispatchDashboard() { return this.dispatchSvc.getDashboard(); }

  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(30)
  @Get('dispatch/assignments') @ApiOperation({ summary: 'Current driver-vehicle-route assignments' })
  getAssignments() { return this.dispatchSvc.getAssignments(); }

  // ═══ Fare & Revenue (NEW) ═══
  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(60)
  @Get('fare/dashboard') @ApiOperation({ summary: 'Fare & revenue dashboard — today/weekly/monthly, by route, by payment method' })
  getFareDashboard() { return this.fareSvc.getDashboard(); }

  // ═══ Compliance (NEW) ═══
  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(300)
  @Get('compliance') @ApiOperation({ summary: 'Bus fleet compliance status — RTA, ADA, safety equipment' })
  getCompliance() {
    return success({
      overallPct: 96.8,
      rtaDubai: { compliant: 40, nonCompliant: 2, inspectionsDue: 3, lastAudit: '2026-02-01' },
      ada: { accessibleBuses: 38, totalBuses: 42, rampWorking: 36, audioAnnouncements: 42 },
      safetyEquipment: { fireExtinguishers: 42, firstAid: 42, emergencyHammers: 40, cctv: 42, panicButtons: 42 },
      driverCertifications: { valid: 60, expiring: 3, expired: 1, pendingRenewal: 2 },
    });
  }

  // ═══ Live Fleet Status (NEW) ═══
  @RequirePermissions(Permission.BUS_READ) @HttpCacheTTL(5)
  @Get('fleet/live') @ApiOperation({ summary: 'Live bus fleet status for map display' })
  getLiveFleet() {
    return success([
      { vehicleId: 'BUS-DXB-042', routeNumber: 'F55', driver: 'Mohammed Al-Hashimi', lat: 25.0810, lng: 55.1380, speed: 32, heading: 45, nextStop: 'JBR The Walk', onboard: 38, capacity: 45, status: 'en_route', delaySec: 0 },
      { vehicleId: 'BUS-DXB-015', routeNumber: 'E11', driver: 'Fatima Al-Zaabi', lat: 25.1165, lng: 55.1985, speed: 48, heading: 180, nextStop: 'Mall of Emirates', onboard: 52, capacity: 60, status: 'en_route', delaySec: -120 },
      { vehicleId: 'BUS-DXB-078', routeNumber: 'F17', driver: 'Rashid Khalfan', lat: 25.0920, lng: 55.1520, speed: 0, heading: 90, nextStop: 'Media City', onboard: 12, capacity: 45, status: 'at_stop', delaySec: 480 },
      { vehicleId: 'BUS-DXB-023', routeNumber: 'F55', driver: 'Aisha Bint Saeed', lat: 25.1005, lng: 55.1595, speed: 28, heading: 315, nextStop: 'Internet City', onboard: 41, capacity: 45, status: 'en_route', delaySec: 0 },
      { vehicleId: 'BUS-DXB-091', routeNumber: 'E303', driver: 'Khalid Al-Nuaimi', lat: 25.2697, lng: 55.3095, speed: 35, heading: 225, nextStop: 'Gold Souk', onboard: 28, capacity: 60, status: 'en_route', delaySec: 60 },
      { vehicleId: 'BUS-DXB-067', routeNumber: 'X28', driver: 'Salma Al-Ketbi', lat: 25.0441, lng: 55.1186, speed: 0, heading: 0, nextStop: 'Ibn Battuta', onboard: 0, capacity: 45, status: 'at_terminus', delaySec: 0 },
    ]);
  }
}
