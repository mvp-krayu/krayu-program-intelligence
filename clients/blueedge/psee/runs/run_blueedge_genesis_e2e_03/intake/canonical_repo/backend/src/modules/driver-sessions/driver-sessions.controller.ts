import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DriverSessionsService } from './driver-sessions.service';

@ApiTags('driver-sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized — invalid or missing JWT' })
@ApiResponse({ status: 403, description: 'Forbidden — insufficient permissions' })
@Controller('driver-sessions')
export class DriverSessionsController {
  constructor(private svc: DriverSessionsService) {}

  // ═══════════════════════════════════════════════════════════════
  // SESSION LIFECYCLE ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.DRIVER_WRITE)
  @InvalidatesCache('driver-sessions')
  @Post('open')
  @ApiOperation({
    summary: 'Open new driver session block',
    description: 'Called when driver authenticates on an SVG device. Automatically closes any active session on the same vehicle. Returns the new session block with unique block number.',
  })
  @ApiBody({ schema: { type: 'object', required: ['vehicleId', 'driverId', 'driverName', 'authMethod', 'svgDeviceId', 'odometerStart', 'fuelLevelStart'], properties: {
    vehicleId: { type: 'string', format: 'uuid' }, driverId: { type: 'string', format: 'uuid' },
    driverName: { type: 'string', example: 'Mohammed Al-Rashid' },
    authMethod: { type: 'string', enum: ['faceid_nfc', 'pin_rfid', 'biometric', 'manual'] },
    svgDeviceId: { type: 'string', example: 'SVG-A1B2AE-001' },
    odometerStart: { type: 'number', example: 344000 }, fuelLevelStart: { type: 'number', example: 78 },
  }}})
  @ApiResponse({ status: 201, description: 'Session block opened successfully' })
  openSession(@Body() dto: {
    vehicleId: string; driverId: string; driverName: string;
    authMethod: string; svgDeviceId: string;
    odometerStart: number; fuelLevelStart: number;
  }) {
    return this.svc.openSession(dto);
  }

  @RequirePermissions(Permission.DRIVER_WRITE)
  @InvalidatesCache('driver-sessions')
  @Post(':id/close')
  @ApiOperation({
    summary: 'Close an active session block with final metrics',
    description: 'Called when driver logs out or next driver authenticates. Edge device sends all accumulated metrics including Welford variance results. Block becomes immutable after close.',
  })
  @ApiParam({ name: 'id', description: 'Session block ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Session block closed with final metrics' })
  @ApiResponse({ status: 404, description: 'Session block not found' })
  @ApiResponse({ status: 400, description: 'Session block already closed' })
  closeSession(@Param('id') id: string, @Body() metrics: {
    odometerEnd: number; fuelLevelEnd: number; endTime: Date;
    fuelConsumedL?: number; fuelCostAED?: number;
    harshBrakes?: number; harshAccelerations?: number; harshCorners?: number;
    maxSpeedKmh?: number; avgSpeedKmh?: number; idleMinutes?: number;
    routeHighwayPct?: number; routeUrbanPct?: number; elevationGainM?: number;
    loadWeightKg?: number; ambientTempC?: number; dtcsGenerated?: string[];
    rpmMean?: number; rpmVariance?: number; speedVariance?: number;
    fuelRateVariance?: number; accelVariance?: number;
    blockHash?: string; tpmSignature?: string; tpmSigned?: boolean;
    gpsPolyline?: string;
  }) {
    return this.svc.closeSession(id, { ...metrics, endTime: new Date(metrics.endTime) });
  }

  // ═══════════════════════════════════════════════════════════════
  // QUERY ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(10)
  @Get('stats')
  @ApiOperation({ summary: 'Global session block statistics' })
  @ApiResponse({ status: 200, description: 'Session block statistics', schema: { example: { success: true, data: { totalBlocks: 84200, activeBlocks: 312, closedBlocks: 83888, totalKmTracked: 12450000 } } } })
  getStats() { return this.svc.getStats(); }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(5)
  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Session blocks for a vehicle', description: 'Returns paginated session blocks for a specific vehicle, newest first.' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Paginated session blocks' })
  findByVehicle(@Param('vehicleId') vehicleId: string, @Query() q: PaginationDto) {
    return this.svc.findByVehicle(vehicleId, q);
  }

  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(5)
  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Session blocks for a driver', description: 'Returns all session blocks for a driver, optionally filtered by vehicle.' })
  @ApiParam({ name: 'driverId', description: 'Driver UUID' })
  @ApiQuery({ name: 'vehicleId', required: false, description: 'Optional: filter by vehicle' })
  @ApiResponse({ status: 200, description: 'Paginated session blocks for driver' })
  findByDriver(
    @Param('driverId') driverId: string,
    @Query('vehicleId') vehicleId?: string,
    @Query() q?: PaginationDto,
  ) {
    return this.svc.findByDriver(driverId, vehicleId, q);
  }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(5)
  @Get('vehicle/:vehicleId/active')
  @ApiOperation({ summary: 'Get active session for a vehicle', description: 'Returns the currently active session block, or null if no driver is authenticated.' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Active session block (or null)' })
  getActiveSession(@Param('vehicleId') vehicleId: string) {
    return this.svc.getActiveSession(vehicleId);
  }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(30)
  @Get('vehicle/:vehicleId/range')
  @ApiOperation({ summary: 'Session blocks within time range' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiQuery({ name: 'start', description: 'Start date ISO string' })
  @ApiQuery({ name: 'end', description: 'End date ISO string' })
  findByTimeRange(
    @Param('vehicleId') vehicleId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.svc.findByTimeRange(vehicleId, new Date(start), new Date(end));
  }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(10)
  @Get(':id')
  @ApiOperation({ summary: 'Get session block by ID', description: 'Returns complete session block with all variance metrics, GPS trace, and TPM signature.' })
  @ApiParam({ name: 'id', description: 'Session block UUID' })
  @ApiResponse({ status: 200, description: 'Complete session block' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  // ═══════════════════════════════════════════════════════════════
  // DWVS COMPUTATION ENDPOINTS
  // ═══════════════════════════════════════════════════════════════

  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(60)
  @Get('dwvs/driver/:driverId/vehicle/:vehicleId')
  @ApiOperation({
    summary: 'Compute DWVS for driver on vehicle',
    description: 'Calculates the Driver Wear Variance Score (patent-pending) for a specific driver on a specific vehicle. Requires at least 5 closed session blocks. Returns DWVS, consistency rating, and detailed metrics.',
  })
  @ApiParam({ name: 'driverId', description: 'Driver UUID' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'DWVS computation result', schema: { example: { success: true, data: { driverId: 'uuid', vehicleId: 'uuid', dwvs: 0.28, consistencyRating: 'excellent', confidence: 'high', blockCount: 847, totalKm: 142800 } } } })
  computeDWVS(@Param('driverId') driverId: string, @Param('vehicleId') vehicleId: string) {
    return this.svc.computeDWVS(driverId, vehicleId);
  }

  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(60)
  @Get('dwvs/vehicle/:vehicleId')
  @ApiOperation({
    summary: 'Compute DWVS for ALL drivers on a vehicle',
    description: 'Returns sorted array of DWVS scores for every driver who has operated this vehicle. Essential for Driver Attribution Matrix (DIAM).',
  })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Array of DWVS per driver, sorted best→worst' })
  computeVehicleDWVS(@Param('vehicleId') vehicleId: string) {
    return this.svc.computeVehicleDWVS(vehicleId);
  }
}
