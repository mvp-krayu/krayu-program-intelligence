import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { PartsMarketplaceService } from './parts-marketplace.service';

@ApiTags('parts-marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('parts-marketplace')
export class PartsMarketplaceController {
  constructor(private readonly svc: PartsMarketplaceService) {}

  @Get()
  @ApiOperation({ summary: 'List all parts-marketplace' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get parts-marketplace by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create parts-marketplace' })
  @InvalidatesCache('parts-marketplace')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('parts')
  @ApiOperation({ summary: 'Search Parts' })
  @HttpCacheTTL(300)
  searchParts(@Query() q: any) { return this.svc.searchParts(q); }

  @Get('vendor-bids')
  @ApiOperation({ summary: 'Get Vendor Bids' })
  @HttpCacheTTL(300)
  getVendorBids() { return this.svc.getVendorBids(); }

  @Get('procurement-stats')
  @ApiOperation({ summary: 'Get Procurement Stats' })
  @HttpCacheTTL(300)
  getProcurementStats() { return this.svc.getProcurementStats(); }

  @Post('purchase-order')
  @ApiOperation({ summary: 'Create Purchase Order' })
  @InvalidatesCache('parts-marketplace')
  createPurchaseOrder(@Body() dto: any) { return this.svc.createPurchaseOrder(dto); }

}
