import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { FinanceService } from './finance.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('finance') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('finance')
export class FinanceController {
  constructor(private svc: FinanceService) {}
  @RequirePermissions(Permission.FINANCE_READ)
  @HttpCacheTTL(300)
  @Get('cost-summary') @ApiOperation({ summary: 'Cost summary' }) getCosts() { return this.svc.getCostSummary(); }
  @RequirePermissions(Permission.FINANCE_READ)
  @HttpCacheTTL(300)
  @Get('tco') @ApiOperation({ summary: 'Total cost of ownership' }) getTCO(@Query('vehicleId') id?: string) { return this.svc.getTCO(id); }
  @RequirePermissions(Permission.FINANCE_READ)
  @HttpCacheTTL(300)
  @Get('invoices') @ApiOperation({ summary: 'Invoice management' }) getInvoices(@Query() q: any) { return this.svc.getInvoices(q); }
  @RequirePermissions(Permission.FINANCE_READ)
  @HttpCacheTTL(300)
  @Get('budget') @ApiOperation({ summary: 'Budget vs actual' }) getBudget() { return this.svc.getBudgetVsActual(); }
  @RequirePermissions(Permission.FINANCE_READ)
  @HttpCacheTTL(300)
  @Get('payroll') @ApiOperation({ summary: 'Driver payroll' }) getPayroll() { return this.svc.getDriverPayroll(); }
}
