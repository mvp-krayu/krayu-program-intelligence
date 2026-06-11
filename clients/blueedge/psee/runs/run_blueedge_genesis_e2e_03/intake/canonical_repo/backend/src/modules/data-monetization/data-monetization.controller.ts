import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DataMonetizationService } from './data-monetization.service';

@ApiTags('data-monetization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('data-monetization')
export class DataMonetizationController {
  constructor(private readonly svc: DataMonetizationService) {}

  @Get()
  @ApiOperation({ summary: 'List all data-monetization' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get data-monetization by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create data-monetization' })
  @InvalidatesCache('data-monetization')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('o-e-m-subscriptions')
  @ApiOperation({ summary: 'Get O E M Subscriptions' })
  @HttpCacheTTL(300)
  getOEMSubscriptions() { return this.svc.getOEMSubscriptions(); }

  @Get('city-saa-s')
  @ApiOperation({ summary: 'Get City Saa S' })
  @HttpCacheTTL(300)
  getCitySaaS() { return this.svc.getCitySaaS(); }

  @Get('data-marketplace')
  @ApiOperation({ summary: 'Get Data Marketplace' })
  @HttpCacheTTL(300)
  getDataMarketplace() { return this.svc.getDataMarketplace(); }

  @Get('revenue-projection')
  @ApiOperation({ summary: 'Get Revenue Projection' })
  @HttpCacheTTL(300)
  getRevenueProjection() { return this.svc.getRevenueProjection(); }

  @Post('data-product')
  @ApiOperation({ summary: 'Create Data Product' })
  @InvalidatesCache('data-monetization')
  createDataProduct(@Body() dto: any) { return this.svc.createDataProduct(dto); }

}
