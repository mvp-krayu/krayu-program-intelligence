import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { FleetsService } from './fleets.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('fleets') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('fleets')
export class FleetsController {
  constructor(private svc: FleetsService) {}
  @RequirePermissions(Permission.FLEET_READ)
  @HttpCacheTTL(300)
  @Get() @ApiOperation({ summary: 'List fleets' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","name":"Dubai Tanker Fleet Alpha","fleetType":"tanker","vehicleCount":12,"activeDrivers":10,"region":"dubai","status":"active","managerName":"Omar Farouk"}],"total":8,"page":1,"limit":20}} } }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.FLEET_READ)
  @HttpCacheTTL(300)
  @Get('kpis') @ApiOperation({ summary: 'Global fleet KPIs' }) getKpis() { return this.svc.getKpis(); }
  @RequirePermissions(Permission.FLEET_READ)
  @HttpCacheTTL(300)
  @Get(':id') @ApiOperation({ summary: 'Get fleet' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.FLEET_READ)
  @HttpCacheTTL(300)
  @Get(':id/dashboard') @ApiOperation({ summary: 'Fleet dashboard data' }) getDashboard(@Param('id') id: string) { return this.svc.getDashboard(id); }
  @RequirePermissions(Permission.FLEET_READ)
  @HttpCacheTTL(300)
  @Get(':id/vehicles') @ApiOperation({ summary: 'Vehicles in fleet' }) getVehicles(@Param('id') id: string) { return this.svc.findAll({ fleetId: id } as any); }
  @RequirePermissions(Permission.FLEET_WRITE)
  @InvalidatesCache('fleets')
  @Post() @ApiOperation({ summary: 'Create fleet' }) create(@Body() dto: Partial<Fleet>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.FLEET_WRITE)
  @InvalidatesCache('fleets')
  @Put(':id') @ApiOperation({ summary: 'Update fleet' }) update(@Param('id') id: string, @Body() dto: Partial<Fleet>) { return this.svc.update(id, dto); }
  @RequirePermissions(Permission.FLEET_DELETE)
  @InvalidatesCache('fleets')
  @Delete(':id') @ApiOperation({ summary: 'Delete fleet' }) remove(@Param('id') id: string) { return this.svc.remove(id); }
}
