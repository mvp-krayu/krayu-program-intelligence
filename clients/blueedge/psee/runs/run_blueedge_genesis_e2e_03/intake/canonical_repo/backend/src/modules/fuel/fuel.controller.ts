import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { FuelService } from './fuel.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('fuel') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('fuel')
export class FuelController {
  constructor(private svc: FuelService) {}
  @RequirePermissions(Permission.FUEL_READ)
  @HttpCacheTTL(300)
  @Get('transactions') @ApiOperation({ summary: 'Fuel transactions' }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.FUEL_READ)
  @HttpCacheTTL(300)
  @Get('consumption') @ApiOperation({ summary: 'Fuel consumption analytics' }) getConsumption(@Query() q: any) { return this.svc.getConsumption(q); }
  @RequirePermissions(Permission.FUEL_READ)
  @HttpCacheTTL(300)
  @Get('theft-alerts') @ApiOperation({ summary: 'Fuel theft detection alerts' }) getTheftAlerts() { return this.svc.getTheftAlerts(); }
  @RequirePermissions(Permission.FUEL_READ)
  @HttpCacheTTL(300)
  @Get('stats') @ApiOperation({ summary: 'Fuel statistics' })
  @ApiResponse({ status: 200, description: 'Statistics', schema: { example: {"success":true,"data":{"totalLitersMonth":45000,"totalCostMonth":99000,"avgEfficiency":7.2,"bestEfficiency":9.1,"worstEfficiency":4.8,"theftAlerts":2}} } }) getStats() { return this.svc.getStats(); }
  @RequirePermissions(Permission.FUEL_READ)
  @HttpCacheTTL(300)
  @Get('efficiency/:vehicleId') @ApiOperation({ summary: 'Vehicle fuel efficiency' }) getEfficiency(@Param('vehicleId') id: string) { return this.svc.getEfficiency(id); }
  @RequirePermissions(Permission.FUEL_READ)
  @HttpCacheTTL(300)
  @Get('transactions/:id') @ApiOperation({ summary: 'Get fuel transaction' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.FUEL_WRITE)
  @InvalidatesCache('fuel')
  @Post('transactions') @ApiOperation({ summary: 'Record fuel transaction' }) create(@Body() dto: Partial<FuelTransaction>) { return this.svc.create(dto); }
}
