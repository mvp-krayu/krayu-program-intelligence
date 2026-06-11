import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { SurgePricingService } from './surge-pricing.service';

@ApiTags('surge-pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('surge-pricing')
export class SurgePricingController {
  constructor(private readonly svc: SurgePricingService) {}

  @Get()
  @ApiOperation({ summary: 'List all surge-pricing' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get surge-pricing by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create surge-pricing' })
  @InvalidatesCache('surge-pricing')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('active-zones')
  @ApiOperation({ summary: 'Get Active Zones' })
  @HttpCacheTTL(300)
  getActiveZones() { return this.svc.getActiveZones(); }

  @Get('demand-heatmap')
  @ApiOperation({ summary: 'Get Demand Heatmap' })
  @HttpCacheTTL(300)
  getDemandHeatmap() { return this.svc.getDemandHeatmap(); }

  @Post('fare')
  @ApiOperation({ summary: 'Calculate Fare' })
  @InvalidatesCache('surge-pricing')
  calculateFare(@Body() dto: any) { return this.svc.calculateFare(dto); }

  @Get('pricing-config')
  @ApiOperation({ summary: 'Get Pricing Config' })
  @HttpCacheTTL(300)
  getPricingConfig() { return this.svc.getPricingConfig(); }

  @Get('revenue-impact')
  @ApiOperation({ summary: 'Get Revenue Impact' })
  @HttpCacheTTL(300)
  getRevenueImpact() { return this.svc.getRevenueImpact(); }

}
