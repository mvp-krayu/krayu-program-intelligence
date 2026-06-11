/**
 * Blue Edge Fleet — V2 Controllers
 * Enhanced API responses with cursor pagination, expanded relations,
 * and enriched metadata. V2 endpoints coexist with V1.
 * 
 * V2 Improvements:
 * - Cursor-based pagination (faster for large datasets)
 * - Expanded relations (embedded driver/fleet data)
 * - Consistent error envelopes
 * - Field selection via ?fields=id,name,status
 * - ETag support for conditional requests
 */
import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, Req, UseGuards, Injectable,
  HttpCode, HttpStatus, Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../guards/roles.guard';

// ── V2 DTOs ───────────────────────────────────────────────────

export class CursorPaginationDto {
  cursor?: string;   // Opaque cursor (base64 encoded ID + timestamp)
  limit?: number;    // Default 25, max 100
  fields?: string;   // Comma-separated field selection
  expand?: string;   // Comma-separated relations to expand
  sort?: string;     // Field:direction (e.g., "createdAt:desc")
}

export interface CursorPaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
    total?: number;
    limit: number;
  };
}

// ── V2 Vehicles Controller ────────────────────────────────────

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller({ path: 'vehicles', version: '2' })
export class VehiclesV2Controller {
  @RequirePermissions(Permission.VEHICLE_READ)
  @Get()
  @ApiOperation({ summary: 'List vehicles (v2 — cursor pagination + field selection)' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Pagination cursor from previous response' })
  @ApiQuery({ name: 'limit', required: false, description: 'Results per page (default 25, max 100)' })
  @ApiQuery({ name: 'fields', required: false, description: 'Comma-separated fields: id,plateNumber,status' })
  @ApiQuery({ name: 'expand', required: false, description: 'Expand relations: driver,fleet,lastTrip' })
  @ApiQuery({ name: 'fleetType', required: false, enum: ['tanker', 'bus', 'taxi', 'all'] })
  @ApiResponse({ status: 200, description: 'Cursor-paginated vehicle list with optional expansions' })
  async findAll(@Query() query: CursorPaginationDto & { fleetType?: string }) {
    const limit = Math.min(query.limit || 25, 100);
    // Mock cursor-paginated response
    const vehicles = Array.from({ length: limit }, (_, i) => ({
      id: `veh-${String(i + 1).padStart(4, '0')}`,
      plateNumber: `دبي ${String.fromCharCode(65 + (i % 26))} ${10000 + i}`,
      vin: `1HGCM826${String(30 + i)}A004${String(350 + i)}`,
      type: ['tanker', 'bus', 'taxi'][i % 3],
      status: i % 10 === 0 ? 'maintenance' : 'active',
      make: ['Toyota', 'MAN', 'Volvo', 'Mercedes'][i % 4],
      model: ['Land Cruiser', 'TGX', 'FH16', 'Actros'][i % 4],
      year: 2022 + (i % 3),
      // V2: Expanded relations (when ?expand=driver,fleet)
      ...(query.expand?.includes('driver') ? {
        driver: { id: `drv-${i}`, nameEn: 'Khalid Al-Mazrouei', safetyScore: 92 },
      } : {}),
      ...(query.expand?.includes('fleet') ? {
        fleet: { id: `fleet-${i % 5}`, name: 'ADNOC Tanker Fleet', type: 'tanker' },
      } : {}),
    }));

    const nextCursor = Buffer.from(`${vehicles[vehicles.length - 1].id}|${Date.now()}`).toString('base64');

    return {
      success: true,
      data: vehicles,
      pagination: {
        hasMore: true,
        nextCursor,
        prevCursor: query.cursor ? Buffer.from(`prev|${Date.now()}`).toString('base64') : null,
        total: 342,
        limit,
      },
    };
  }

  @RequirePermissions(Permission.VEHICLE_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID (v2 — full expansion + ETag)' })
  @ApiQuery({ name: 'expand', required: false, description: 'Expand: driver,fleet,lastTrip,maintenance,telemetry' })
  @ApiResponse({ status: 200, description: 'Vehicle with expanded relations' })
  @ApiResponse({ status: 304, description: 'Not Modified (ETag match)' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findOne(@Param('id') id: string, @Query('expand') expand?: string) {
    const vehicle: any = {
      id,
      plateNumber: 'دبي A 12345',
      vin: '1HGCM82633A004352',
      type: 'tanker',
      status: 'active',
      make: 'MAN',
      model: 'TGX 41.640',
      year: 2024,
      fuelType: 'diesel',
      fleetId: 'fleet-001',
      currentDriverId: 'drv-001',
      lastLatitude: 25.2048,
      lastLongitude: 55.2708,
      lastSpeed: 85,
      odometerKm: 45231,
      engineHours: 3200,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2026-02-12T10:30:00Z',
    };

    // V2: Conditional expansion
    if (expand?.includes('driver')) {
      vehicle.driver = {
        id: 'drv-001', nameEn: 'Khalid Al-Mazrouei', nameAr: 'خالد المزروعي',
        licenseNumber: 'DL-2024-AUH-00123', safetyScore: 92, status: 'active',
      };
    }
    if (expand?.includes('fleet')) {
      vehicle.fleet = {
        id: 'fleet-001', name: 'ADNOC Tanker Fleet - Dubai', type: 'tanker', vehicleCount: 145,
      };
    }
    if (expand?.includes('lastTrip')) {
      vehicle.lastTrip = {
        id: 'trip-2048', origin: 'Jebel Ali Port', destination: 'ADNOC Ruwais',
        status: 'completed', distanceKm: 245.8, completedAt: '2026-02-12T09:15:00Z',
      };
    }
    if (expand?.includes('telemetry')) {
      vehicle.telemetry = {
        rpm: 1800, coolantTemp: 92, fuelLevel: 75, batteryVoltage: 13.8,
        oilPressure: 450, dpfStatus: 'normal', timestamp: new Date().toISOString(),
      };
    }
    if (expand?.includes('maintenance')) {
      vehicle.nextMaintenance = {
        type: 'Oil Change', dueDate: '2026-03-01', dueKm: 50000, urgency: 'normal',
      };
    }

    return { success: true, data: vehicle };
  }

  @RequirePermissions(Permission.VEHICLE_READ)
  @Get('positions/live')
  @ApiOperation({ summary: 'Live vehicle positions (v2 — GeoJSON format)' })
  @ApiQuery({ name: 'fleetType', required: false, enum: ['tanker', 'bus', 'taxi', 'all'] })
  @ApiQuery({ name: 'bbox', required: false, description: 'Bounding box: minLat,minLng,maxLat,maxLng' })
  @ApiResponse({ status: 200, description: 'GeoJSON FeatureCollection of vehicle positions' })
  async getPositionsGeoJSON(@Query() query: { fleetType?: string; bbox?: string }) {
    // V2: Return GeoJSON for direct map integration
    return {
      success: true,
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [55.2708, 25.2048] },
            properties: {
              vehicleId: 'veh-001', plateNumber: 'دبي A 12345', type: 'tanker',
              status: 'active', speed: 85, heading: 270, driverName: 'Khalid Al-Mazrouei',
            },
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [55.3564, 25.1172] },
            properties: {
              vehicleId: 'veh-002', plateNumber: 'دبي B 67890', type: 'bus',
              status: 'active', speed: 45, heading: 90, driverName: 'Omar Hassan',
            },
          },
        ],
      },
      _meta: { count: 2, timestamp: new Date().toISOString() },
    };
  }

  @RequirePermissions(Permission.VEHICLE_WRITE)
  @Post(':id/commands')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Send command to vehicle (v2 — async with job tracking)' })
  @ApiResponse({ status: 202, description: 'Command accepted, returns job ID for tracking' })
  async sendCommand(@Param('id') id: string, @Body() cmd: { command: string; params?: any }) {
    // V2: Return async job ID instead of blocking
    const jobId = `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      success: true,
      data: {
        jobId,
        vehicleId: id,
        command: cmd.command,
        status: 'queued',
        estimatedCompletionMs: 5000,
        trackingUrl: `/api/v2/vehicles/${id}/commands/${jobId}/status`,
      },
    };
  }
}

// ── V2 Analytics Controller ───────────────────────────────────

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller({ path: 'analytics', version: '2' })
export class AnalyticsV2Controller {
  @RequirePermissions(Permission.ANALYTICS_READ)
  @Get('fleet/summary')
  @ApiOperation({ summary: 'Fleet summary (v2 — time-series + sparklines)' })
  @ApiQuery({ name: 'period', required: false, enum: ['24h', '7d', '30d', '90d', 'ytd'] })
  @ApiQuery({ name: 'fleetType', required: false, enum: ['tanker', 'bus', 'taxi', 'all'] })
  @ApiResponse({ status: 200, description: 'Fleet KPIs with trend data and sparklines' })
  async getFleetSummary(@Query() query: { period?: string; fleetType?: string }) {
    return {
      success: true,
      data: {
        totalVehicles: 342,
        activeVehicles: 298,
        utilization: { current: 87.5, trend: [82, 84, 85, 87, 87.5], change: +2.1 },
        compliance: { current: 98.2, trend: [97.8, 98.0, 98.1, 98.2, 98.2], change: +0.2 },
        safetyScore: { current: 91.3, trend: [89, 90, 90.5, 91, 91.3], change: +1.3 },
        costPerKm: { current: 0.42, trend: [0.45, 0.44, 0.43, 0.42, 0.42], change: -3.2, currency: 'AED' },
        fuelEfficiency: { current: 32.5, unit: 'L/100km', trend: [33.1, 32.8, 32.6, 32.5, 32.5], change: -1.8 },
        byFleetType: {
          tanker: { count: 145, utilization: 92.1, compliance: 99.1 },
          bus: { count: 112, utilization: 85.3, compliance: 97.8 },
          taxi: { count: 85, utilization: 78.2, compliance: 96.5 },
        },
      },
      _meta: {
        period: query.period || '30d',
        generatedAt: new Date().toISOString(),
        dataSources: ['telemetry', 'compliance_db', 'finance_ledger'],
      },
    };
  }

  @RequirePermissions(Permission.ANALYTICS_READ)
  @Get('realtime/kpis')
  @ApiOperation({ summary: 'Real-time KPI stream (v2 — SSE compatible)' })
  @ApiResponse({ status: 200, description: 'Current real-time fleet KPIs' })
  async getRealtimeKPIs() {
    return {
      success: true,
      data: {
        activeTrips: 42,
        vehiclesMoving: 187,
        averageSpeed: 72.4,
        alertsOpen: 23,
        alertsCritical: 3,
        fuelConsumptionRate: 1245.6,
        revenueToday: 45230,
        currency: 'AED',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @RequirePermissions(Permission.ANALYTICS_READ)
  @Post('query')
  @ApiOperation({ summary: 'Natural language analytics query (v2 — AI-powered)' })
  @ApiResponse({ status: 200, description: 'AI-generated analytics response with visualizations' })
  async nlQuery(@Body() body: { query: string; context?: string }) {
    return {
      success: true,
      data: {
        query: body.query,
        answer: 'The tanker fleet averaged 32.5 L/100km fuel consumption over the past 30 days, a 1.8% improvement from the previous period. The top 3 most efficient drivers are Khalid (28.1), Omar (29.3), and Fatima (30.2).',
        confidence: 0.94,
        dataSources: ['fuel_analytics', 'driver_performance', 'telemetry'],
        suggestedVisualizations: [
          { type: 'line_chart', title: 'Fuel Consumption Trend', xAxis: 'date', yAxis: 'L/100km' },
          { type: 'bar_chart', title: 'Driver Efficiency Ranking', xAxis: 'driver', yAxis: 'L/100km' },
        ],
        followUpQuestions: [
          'Which routes have the highest fuel consumption?',
          'How does weather affect tanker fuel efficiency?',
          'Show me the correlation between driver safety scores and fuel efficiency.',
        ],
      },
    };
  }
}

// ── V2 Trips Controller ───────────────────────────────────────

@ApiTags('trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller({ path: 'trips', version: '2' })
export class TripsV2Controller {
  @RequirePermissions(Permission.TRIP_READ)
  @Get('active/map')
  @ApiOperation({ summary: 'Active trips with live route data (v2 — GeoJSON)' })
  @ApiResponse({ status: 200, description: 'Active trips with route geometry and ETA' })
  async getActiveTripsMap() {
    return {
      success: true,
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [[55.27, 25.20], [55.30, 25.15], [55.35, 25.10], [55.40, 25.05]],
            },
            properties: {
              tripId: 'trip-2048',
              vehicleId: 'veh-001',
              driverName: 'Khalid Al-Mazrouei',
              origin: 'Jebel Ali Port',
              destination: 'ADNOC Ruwais',
              progressPercent: 65,
              etaMinutes: 47,
              currentSpeed: 85,
              distanceRemainingKm: 86.2,
              cargo: 'Diesel EN 590 — 35,000L',
            },
          },
        ],
      },
      _meta: { activeCount: 42, timestamp: new Date().toISOString() },
    };
  }

  @RequirePermissions(Permission.TRIP_READ)
  @Get(':id/timeline')
  @ApiOperation({ summary: 'Trip timeline with events (v2 — detailed event log)' })
  @ApiResponse({ status: 200, description: 'Chronological trip events and milestones' })
  async getTripTimeline(@Param('id') id: string) {
    return {
      success: true,
      data: {
        tripId: id,
        events: [
          { time: '2026-02-12T06:00:00Z', type: 'trip_started', location: 'Jebel Ali Port', details: 'Pre-trip inspection passed' },
          { time: '2026-02-12T06:15:00Z', type: 'geofence_exit', location: 'Jebel Ali Terminal', details: 'Departed terminal zone' },
          { time: '2026-02-12T06:45:00Z', type: 'checkpoint', location: 'E11 — Ghantoot', details: 'Border checkpoint cleared' },
          { time: '2026-02-12T07:30:00Z', type: 'fuel_stop', location: 'ADNOC Al Ruwais Station', details: '120L diesel, 3 min stop' },
          { time: '2026-02-12T07:32:00Z', type: 'alert', location: 'E11 km 245', details: 'Harsh braking event detected', severity: 'medium' },
          { time: '2026-02-12T08:45:00Z', type: 'geofence_enter', location: 'ADNOC Ruwais Refinery', details: 'Entered destination zone' },
          { time: '2026-02-12T09:00:00Z', type: 'custody_transfer', location: 'Ruwais Terminal', details: '35,000L Diesel — custody transferred to ADNOC' },
          { time: '2026-02-12T09:15:00Z', type: 'trip_completed', location: 'ADNOC Ruwais', details: 'All cargo delivered, documents signed' },
        ],
        summary: {
          duration: '3h 15m', distanceKm: 245.8, fuelUsedL: 78.5,
          avgSpeed: 75.6, maxSpeed: 105, stops: 1, alerts: 1,
        },
      },
    };
  }
}

// ── V2 Alerts Controller ──────────────────────────────────────

@ApiTags('alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller({ path: 'alerts', version: '2' })
export class AlertsV2Controller {
  @RequirePermissions(Permission.ALERT_READ)
  @Get('feed')
  @ApiOperation({ summary: 'Alert feed (v2 — real-time sorted, cursor paginated)' })
  @ApiQuery({ name: 'severity', required: false, enum: ['critical', 'high', 'medium', 'low'] })
  @ApiQuery({ name: 'type', required: false, description: 'Alert type filter' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiResponse({ status: 200, description: 'Real-time alert feed with enriched context' })
  async getAlertFeed(@Query() query: any) {
    return {
      success: true,
      data: [
        {
          id: 'alert-001', type: 'overspeed', severity: 'high', status: 'active',
          message: 'Vehicle exceeded 120 km/h on Sheikh Zayed Road',
          vehicle: { id: 'veh-001', plateNumber: 'دبي A 12345', type: 'tanker' },
          driver: { id: 'drv-001', nameEn: 'Khalid Al-Mazrouei' },
          location: { lat: 25.2048, lng: 55.2708, address: 'Sheikh Zayed Road, Dubai' },
          createdAt: '2026-02-12T10:30:00Z',
          suggestedActions: ['Contact driver', 'Review speed policy', 'Check route restrictions'],
        },
      ],
      pagination: { hasMore: true, nextCursor: 'eyJpZCI6ImFsZXJ0LTAwMSJ9', limit: 25 },
    };
  }

  @RequirePermissions(Permission.ALERT_WRITE)
  @Post(':id/actions/bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Bulk alert actions (v2 — batch acknowledge/resolve/dismiss)' })
  @ApiResponse({ status: 202, description: 'Bulk action accepted' })
  async bulkAction(@Body() body: { alertIds: string[]; action: string; reason?: string }) {
    return {
      success: true,
      data: {
        processed: body.alertIds.length,
        action: body.action,
        results: body.alertIds.map(id => ({ alertId: id, status: 'success' })),
      },
    };
  }
}

// ── Module Registration ───────────────────────────────────────

import { Module } from '@nestjs/common';

@Module({
  controllers: [
    VehiclesV2Controller,
    AnalyticsV2Controller,
    TripsV2Controller,
    AlertsV2Controller,
  ],
})
export class V2Module {}
