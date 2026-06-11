import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { ReportsService } from './reports.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('reports') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}
  @RequirePermissions(Permission.REPORT_READ)
  @HttpCacheTTL(1800)
  @Get('templates') @ApiOperation({ summary: 'Report templates' }) getTemplates() { return this.svc.getTemplates(); }
  @RequirePermissions(Permission.REPORT_GENERATE)
  @InvalidatesCache('reports')
  @Post('generate') @ApiOperation({ summary: 'Generate report' }) generate(@Body() dto: any) { return this.svc.generate(dto); }
  @RequirePermissions(Permission.REPORT_READ)
  @HttpCacheTTL(1800)
  @Get(':id/status') @ApiOperation({ summary: 'Report generation status' }) getStatus(@Param('id') id: string) { return this.svc.getStatus(id); }
  @RequirePermissions(Permission.REPORT_READ)
  @HttpCacheTTL(1800)
  @Get(':id/download') @ApiOperation({ summary: 'Download report' }) download(@Param('id') id: string) { return this.svc.getStatus(id); }
  @RequirePermissions(Permission.REPORT_READ)
  @HttpCacheTTL(1800)
  @Get('scheduled') @ApiOperation({ summary: 'Scheduled reports' }) getScheduled() { return this.svc.getScheduled(); }
  @RequirePermissions(Permission.REPORT_READ)
  @InvalidatesCache('reports')
  @Post('scheduled') @ApiOperation({ summary: 'Schedule report' }) schedule(@Body() dto: any) { return this.svc.scheduleReport(dto); }
  @RequirePermissions(Permission.REPORT_READ)
  @InvalidatesCache('reports')
  @Delete('scheduled/:id') @ApiOperation({ summary: 'Cancel scheduled report' }) cancelSchedule(@Param('id') id: string) { return success({ id, status: 'cancelled' }); }
}
