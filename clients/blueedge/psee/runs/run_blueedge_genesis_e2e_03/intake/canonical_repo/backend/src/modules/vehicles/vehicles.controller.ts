import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { VehiclesService } from './vehicles.service';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized — invalid or missing JWT' })
@ApiResponse({ status: 403, description: 'Forbidden — insufficient permissions' })
@Controller('vehicles')
export class VehiclesController {
  constructor(private svc: VehiclesService) {}

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(30)
  @Get() @ApiOperation({ summary: 'List vehicles with filters', description: 'Returns paginated list of vehicles, optionally filtered by fleet type and status.' })
  @ApiQuery({ name: 'fleetType', required: false, enum: ['tanker', 'bus', 'taxi'], description: 'Filter by fleet type' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'maintenance'], description: 'Filter by vehicle status' })
  @ApiResponse({ status: 200, description: 'Paginated vehicle list', schema: { example: { success: true, data: { items: [{ id: 'uuid', licensePlate: 'DXB-A-12345', fleetType: 'tanker', status: 'active', make: 'MAN', model: 'TGS 40.480', year: 2023, odometerKm: 45230, fuelLevelPercent: 72.5 }], total: 30, page: 1, limit: 20 } } } })
  findAll(@Query() q: FleetFilterDto) { return this.svc.findAll(q); }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(60)
  @Get('stats') @ApiOperation({ summary: 'Vehicle fleet statistics', description: 'Returns fleet-wide aggregated statistics by type and status.' })
  @ApiResponse({ status: 200, description: 'Fleet statistics', schema: { example: { success: true, data: { total: 30, active: 25, inMaintenance: 5, byType: { tankers: 10, buses: 10, taxis: 10 } } } } })
  getStats() { return this.svc.getStats(); }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(5)
  @Get('positions') @ApiOperation({ summary: 'All vehicle positions for live map' })
  @ApiQuery({ name: 'fleetType', required: false })
  getPositions(@Query('fleetType') fleetType?: string) { return this.svc.getPositions(fleetType); }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(5)
  @Get(':id') @ApiOperation({ summary: 'Get vehicle by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(5)
  @Get(':id/telemetry') @ApiOperation({ summary: 'Real-time telemetry data' })
  getTelemetry(@Param('id') id: string) { return this.svc.getTelemetry(id); }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(5)
  @Get(':id/dtcs') @ApiOperation({ summary: 'Active/historical DTCs' })
  getDtcs(@Param('id') id: string) { return this.svc.getDtcs(id); }

  @RequirePermissions(Permission.VEHICLE_READ)
  @HttpCacheTTL(5)
  @Get(':id/trips') @ApiOperation({ summary: 'Vehicle trip history' })
  getTrips(@Param('id') id: string, @Query() q: PaginationDto) { return this.svc.findAll({ ...q, vehicleId: id } as any); }

  @RequirePermissions(Permission.VEHICLE_WRITE)
  @InvalidatesCache('vehicles')
  @Post() @ApiOperation({ summary: 'Register new vehicle' })
  create(@Body() dto: Partial<Vehicle>) { return this.svc.create(dto); }

  @RequirePermissions(Permission.VEHICLE_COMMAND)
  @InvalidatesCache('vehicles')
  @Post(':id/commands') @ApiOperation({ summary: 'Send command to vehicle' })
  sendCommand(@Param('id') id: string, @Body() cmd: { type: string; payload?: any }) { return this.svc.sendCommand(id, cmd); }

  @RequirePermissions(Permission.VEHICLE_WRITE)
  @InvalidatesCache('vehicles')
  @Put(':id') @ApiOperation({ summary: 'Update vehicle' })
  update(@Param('id') id: string, @Body() dto: Partial<Vehicle>) { return this.svc.update(id, dto); }

  @RequirePermissions(Permission.VEHICLE_WRITE)
  @InvalidatesCache('vehicles')
  @Delete(':id') @ApiOperation({ summary: 'Decommission vehicle' })
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
