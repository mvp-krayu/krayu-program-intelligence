import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { AnalyticsService } from './analytics.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('analytics') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('analytics')
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}
  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(1800)
  @Get('fleet/summary') @ApiOperation({ summary: 'Fleet dashboard KPIs' }) getFleetSummary() { return this.svc.getFleetSummary(); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(1800)
  @Get('drivers') @ApiOperation({ summary: 'Driver analytics' }) getDrivers(@Query() q: any) { return this.svc.getDriverAnalytics(q); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(1800)
  @Get('fuel') @ApiOperation({ summary: 'Fuel analytics' }) getFuel(@Query() q: any) { return this.svc.getFuelAnalytics(q); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(1800)
  @Get('maintenance') @ApiOperation({ summary: 'Maintenance analytics' }) getMaintenance() { return this.svc.getMaintenanceAnalytics(); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(1800)
  @Get('safety') @ApiOperation({ summary: 'Safety analytics' }) getSafety() { return this.svc.getSafetyAnalytics(); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(1800)
  @Get('revenue') @ApiOperation({ summary: 'Revenue analytics' }) getRevenue() { return this.svc.getRevenueAnalytics(); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @HttpCacheTTL(1800)
  @Get('compliance') @ApiOperation({ summary: 'Compliance analytics' }) getCompliance() { return this.svc.getComplianceAnalytics(); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @InvalidatesCache('analytics')
  @Post('dashboard') @ApiOperation({ summary: 'Custom dashboard config' }) getCustom(@Body() config: any) { return this.svc.getCustomDashboard(config); }
  @RequirePermissions(Permission.ANALYTICS_READ)
  @InvalidatesCache('analytics')
  @Post('nl-query') @ApiOperation({ summary: 'Natural language fleet query' }) nlQuery(@Body() body: { query: string }) { return this.svc.nlQuery(body.query); }
}
