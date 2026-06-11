import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { SensorsService } from './sensors.service';
import { PairSensorDto, UpdateSensorDto, CalibrateSensorDto, IngestReadingsDto, SensorQueryDto, ReadingsQueryDto, AcknowledgeAlertDto, ResolveAlertDto } from './dto';

@ApiTags('Sensors — External IoT Sensors & Actuators')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/sensors')
export class SensorsController {
  constructor(private readonly svc: SensorsService) {}

  // ── Sensor CRUD & Pairing (5 endpoints) ──────────────────────
  @Get()
  @ApiOperation({ summary: 'List sensors with filtering by device, type, protocol, status' })
  findAll(@Query() query: SensorQueryDto) { return this.svc.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get sensor details' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post('pair')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Pair external sensor to SVG gateway' })
  pair(@Body() dto: PairSensorDto, @Req() req: any) { return this.svc.pairSensor(dto, req.user?.id); }

  @Put(':id')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Update sensor configuration and thresholds' })
  update(@Param('id') id: string, @Body() dto: UpdateSensorDto) { return this.svc.updateSensor(id, dto); }

  @Delete(':id/unpair')
  @Roles('admin', 'fleet_manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unpair sensor from SVG gateway' })
  unpair(@Param('id') id: string, @Req() req: any) { return this.svc.unpairSensor(id, req.user?.id); }

  // ── Device Sensors (1 endpoint) ──────────────────────────────
  @Get('device/:svgDeviceId')
  @ApiOperation({ summary: 'List all sensors attached to an SVG device' })
  getDeviceSensors(@Param('svgDeviceId') svgDeviceId: string) { return this.svc.getDeviceSensors(svgDeviceId); }

  // ── Calibration (1 endpoint) ─────────────────────────────────
  @Post(':id/calibrate')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Calibrate sensor (set offset, factor, curve)' })
  calibrate(@Param('id') id: string, @Body() dto: CalibrateSensorDto, @Req() req: any) { return this.svc.calibrateSensor(id, dto, req.user?.id); }

  // ── Telemetry Ingestion (1 endpoint) ─────────────────────────
  @Post('ingest')
  @ApiOperation({ summary: 'Bulk ingest sensor readings from SVG device (called by firmware)' })
  @ApiResponse({ status: 201, description: 'Returns ingestion count and any alerts generated' })
  ingest(@Body() dto: IngestReadingsDto) { return this.svc.ingestReadings(dto); }

  // ── Readings (2 endpoints) ───────────────────────────────────
  @Get(':id/readings')
  @ApiOperation({ summary: 'Get sensor time-series readings with optional time range' })
  getReadings(@Param('id') id: string, @Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: number) {
    return this.svc.getReadings({ sensorId: id, from, to, limit });
  }

  @Get('device/:svgDeviceId/readings')
  @ApiOperation({ summary: 'Get all sensor readings for an SVG device' })
  getDeviceReadings(@Param('svgDeviceId') svgDeviceId: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.svc.getDeviceReadings(svgDeviceId, from, to);
  }

  // ── Alerts (4 endpoints) ─────────────────────────────────────
  @Get('alerts/list')
  @ApiOperation({ summary: 'List sensor alerts with filtering' })
  getAlerts(@Query('svgDeviceId') svgDeviceId?: string, @Query('severity') severity?: string, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.svc.getAlerts(svgDeviceId, severity, status, page, limit);
  }

  @Post('alerts/:alertId/acknowledge')
  @Roles('admin', 'fleet_manager', 'technician', 'driver')
  @ApiOperation({ summary: 'Acknowledge a sensor alert' })
  acknowledgeAlert(@Param('alertId') alertId: string, @Body() dto: AcknowledgeAlertDto, @Req() req: any) {
    return this.svc.acknowledgeAlert(alertId, req.user?.id, dto);
  }

  @Post('alerts/:alertId/resolve')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Resolve a sensor alert with root cause' })
  resolveAlert(@Param('alertId') alertId: string, @Body() dto: ResolveAlertDto, @Req() req: any) {
    return this.svc.resolveAlert(alertId, req.user?.id, dto);
  }

  // ── Fleet Analytics (1 endpoint) ─────────────────────────────
  @Get('fleet/health')
  @ApiOperation({ summary: 'Fleet-wide sensor health: active/error counts, calibration status, alert summary' })
  getFleetHealth() { return this.svc.getFleetSensorHealth(); }
}
