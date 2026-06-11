import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { BillingService } from './billing.service';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('billing')
export class BillingController {
  constructor(private readonly svc: BillingService) {}

  @Get()
  @ApiOperation({ summary: 'List all billing' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get billing by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create billing' })
  @InvalidatesCache('billing')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('invoices')
  @ApiOperation({ summary: 'Get Invoices' })
  @HttpCacheTTL(300)
  getInvoices(@Query() q: any) { return this.svc.getInvoices(q); }

  @Get('invoice')
  @ApiOperation({ summary: 'Get Invoice' })
  @HttpCacheTTL(300)
  getInvoice() { return this.svc.getInvoice(); }

  @Get('download-invoice-pdf')
  @ApiOperation({ summary: 'Download Invoice Pdf' })
  @HttpCacheTTL(300)
  downloadInvoicePdf() { return this.svc.downloadInvoicePdf(); }

  @Get('subscription')
  @ApiOperation({ summary: 'Get Subscription' })
  @HttpCacheTTL(300)
  getSubscription() { return this.svc.getSubscription(); }

  @Get('preview-plan-change')
  @ApiOperation({ summary: 'Preview Plan Change' })
  @HttpCacheTTL(300)
  previewPlanChange() { return this.svc.previewPlanChange(); }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get Payment Methods' })
  @HttpCacheTTL(300)
  getPaymentMethods() { return this.svc.getPaymentMethods(); }

  @Get('add-payment-method')
  @ApiOperation({ summary: 'Add Payment Method' })
  @HttpCacheTTL(300)
  addPaymentMethod() { return this.svc.addPaymentMethod(); }

  @Get('usage-metering')
  @ApiOperation({ summary: 'Get Usage Metering' })
  @HttpCacheTTL(300)
  getUsageMetering() { return this.svc.getUsageMetering(); }

  @Get('revenue-analytics')
  @ApiOperation({ summary: 'Get Revenue Analytics' })
  @HttpCacheTTL(300)
  getRevenueAnalytics() { return this.svc.getRevenueAnalytics(); }

}
