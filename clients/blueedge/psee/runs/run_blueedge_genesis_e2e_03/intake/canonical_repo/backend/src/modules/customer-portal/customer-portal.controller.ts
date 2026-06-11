import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { CustomerPortalService } from './customer-portal.service';

@ApiTags('customer-portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('customer-portal')
export class CustomerPortalController {
  constructor(private readonly svc: CustomerPortalService) {}

  @Get()
  @ApiOperation({ summary: 'List all customer-portal' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer-portal by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create customer-portal' })
  @InvalidatesCache('customer-portal')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('customer-dashboard')
  @ApiOperation({ summary: 'Get Customer Dashboard' })
  @HttpCacheTTL(300)
  getCustomerDashboard() { return this.svc.getCustomerDashboard(); }

  @Get('track-shipment')
  @ApiOperation({ summary: 'Track Shipment' })
  @HttpCacheTTL(300)
  trackShipment() { return this.svc.trackShipment(); }

  @Get('sla-report')
  @ApiOperation({ summary: 'Get Sla Report' })
  @HttpCacheTTL(300)
  getSlaReport() { return this.svc.getSlaReport(); }

  @Get('documents')
  @ApiOperation({ summary: 'Get Documents' })
  @HttpCacheTTL(300)
  getDocuments() { return this.svc.getDocuments(); }

}
