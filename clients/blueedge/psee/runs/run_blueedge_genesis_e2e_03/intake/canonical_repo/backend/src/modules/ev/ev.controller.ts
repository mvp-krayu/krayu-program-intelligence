import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { EvService } from './ev.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('ev') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('ev')
export class EvController {
  constructor(private svc: EvService) {}

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get() @ApiOperation({ summary: 'List EV vehicles' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","vehicleId":"uuid","batteryLevelPercent":72,"rangeKm":185,"chargingStatus":"discharging","batteryHealthPercent":96,"totalCycleCount":342,"lastChargedAt":"2024-01-15T06:00:00Z"}],"total":18,"page":1,"limit":20}} } })
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get('dashboard') @ApiOperation({ summary: 'EV fleet dashboard' })
  getDashboard() { return this.svc.getDashboard(); }

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get('charging/sessions') @ApiOperation({ summary: 'Charging session history' })
  getSessions(@Query() q: PaginationDto) { return this.svc.getChargingSessions(q); }

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get('charging/schedule') @ApiOperation({ summary: 'Optimized charging schedule' })
  getSchedule() { return this.svc.getChargingSchedule(); }

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get('analytics/energy') @ApiOperation({ summary: 'Energy consumption analytics' })
  getEnergyAnalytics(@Query() q: any) { return this.svc.getEnergyAnalytics(q); }

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get(':id') @ApiOperation({ summary: 'Get EV vehicle details' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get(':id/battery') @ApiOperation({ summary: 'Battery health & degradation' })
  getBattery(@Param('id') id: string) { return this.svc.getBatteryHealth(id); }

  @RequirePermissions(Permission.EV_READ)
  @HttpCacheTTL(30)
  @Get(':id/range') @ApiOperation({ summary: 'Range prediction with factors' })
  getRange(@Param('id') id: string, @Query() q: any) { return this.svc.getRangePrediction(id, q); }

  @RequirePermissions(Permission.EV_WRITE)
  @InvalidatesCache('ev')
  @Post() @ApiOperation({ summary: 'Register EV vehicle' })
  create(@Body() dto: any) { return this.svc.create(dto); }

  @RequirePermissions(Permission.EV_WRITE)
  @InvalidatesCache('ev')
  @Post(':id/charging/start') @ApiOperation({ summary: 'Start charging session' })
  startCharging(@Param('id') id: string, @Body() body: any) { return this.svc.startCharging(id, body); }

  @RequirePermissions(Permission.EV_WRITE)
  @InvalidatesCache('ev')
  @Post(':id/charging/stop') @ApiOperation({ summary: 'Stop charging session' })
  stopCharging(@Param('id') id: string) { return this.svc.stopCharging(id); }

  @RequirePermissions(Permission.EV_WRITE)
  @InvalidatesCache('ev')
  @Put(':id') @ApiOperation({ summary: 'Update EV vehicle' })
  update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
}
