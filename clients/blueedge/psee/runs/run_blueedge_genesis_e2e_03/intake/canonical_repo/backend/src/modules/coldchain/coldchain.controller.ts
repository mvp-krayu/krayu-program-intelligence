import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { ColdchainService } from './coldchain.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('coldchain') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('coldchain')
export class ColdchainController {
  constructor(private svc: ColdchainService) {}

  @RequirePermissions(Permission.COLDCHAIN_READ)
  @HttpCacheTTL(30)
  @Get() @ApiOperation({ summary: 'List cold chain shipments' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","vehicleId":"uuid","compartment":"main","currentTempC":-18.2,"setpointC":-18,"humidityPercent":45,"doorStatus":"closed","status":"normal","lastReadingAt":"2024-01-15T10:30:00Z"}],"total":15,"page":1,"limit":20}} } })
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @RequirePermissions(Permission.COLDCHAIN_READ)
  @HttpCacheTTL(30)
  @Get('dashboard') @ApiOperation({ summary: 'Cold chain dashboard overview' })
  getDashboard() { return this.svc.getDashboard(); }

  @RequirePermissions(Permission.COLDCHAIN_READ)
  @HttpCacheTTL(30)
  @Get('breaches') @ApiOperation({ summary: 'Temperature breach report' })
  getBreaches(@Query() q: any) { return this.svc.getBreachReport(q); }

  @RequirePermissions(Permission.COLDCHAIN_READ)
  @HttpCacheTTL(30)
  @Get('compliance') @ApiOperation({ summary: 'Cold chain compliance status' })
  getCompliance() { return this.svc.getComplianceStatus(); }

  @RequirePermissions(Permission.COLDCHAIN_READ)
  @HttpCacheTTL(30)
  @Get('sensors') @ApiOperation({ summary: 'Sensor health overview' })
  getSensorHealth() { return this.svc.getSensorHealth(); }

  @RequirePermissions(Permission.COLDCHAIN_READ)
  @HttpCacheTTL(30)
  @Get(':id') @ApiOperation({ summary: 'Get shipment by ID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @RequirePermissions(Permission.COLDCHAIN_READ)
  @HttpCacheTTL(30)
  @Get(':id/temperature') @ApiOperation({ summary: 'Temperature history for shipment' })
  getTempHistory(@Param('id') id: string, @Query() q: any) { return this.svc.getTemperatureHistory(id, q); }

  @RequirePermissions(Permission.COLDCHAIN_WRITE)
  @InvalidatesCache('coldchain')
  @Post() @ApiOperation({ summary: 'Create cold chain shipment' })
  create(@Body() dto: any) { return this.svc.create(dto); }

  @RequirePermissions(Permission.COLDCHAIN_WRITE)
  @InvalidatesCache('coldchain')
  @Post('thresholds') @ApiOperation({ summary: 'Set alert threshold' })
  setThreshold(@Body() body: any) { return this.svc.setAlertThreshold(body); }

  @RequirePermissions(Permission.COLDCHAIN_WRITE)
  @InvalidatesCache('coldchain')
  @Put(':id') @ApiOperation({ summary: 'Update shipment' })
  update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
}
