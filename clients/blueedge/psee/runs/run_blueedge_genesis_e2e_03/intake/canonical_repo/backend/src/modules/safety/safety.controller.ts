import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { SafetyService } from './safety.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('safety') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('safety')
export class SafetyController {
  constructor(private svc: SafetyService) {}
  @RequirePermissions(Permission.SAFETY_READ)
  @HttpCacheTTL(300)
  @Get('dashboard') @ApiOperation({ summary: 'Safety dashboard' }) getDashboard() { return this.svc.getDashboard(); }
  @RequirePermissions(Permission.SAFETY_READ)
  @HttpCacheTTL(300)
  @Get('incidents') @ApiOperation({ summary: 'Incident log' }) getIncidents(@Query() q: any) { return this.svc.getIncidents(q); }
  @RequirePermissions(Permission.SAFETY_READ)
  @HttpCacheTTL(300)
  @Get('risk-assessment') @ApiOperation({ summary: 'Fleet risk assessment' }) getRisk() { return this.svc.getRiskAssessment(); }
  @RequirePermissions(Permission.SAFETY_READ)
  @HttpCacheTTL(300)
  @Get('video-events') @ApiOperation({ summary: 'Video safety events' }) getVideo(@Query() q: any) { return this.svc.getVideoEvents(q); }
  @RequirePermissions(Permission.SAFETY_READ)
  @HttpCacheTTL(300)
  @Get('drivers/:id') @ApiOperation({ summary: 'Driver safety profile' }) getDriverSafety(@Param('id') id: string) { return this.svc.getDriverSafety(id); }
  @RequirePermissions(Permission.SAFETY_WRITE)
  @InvalidatesCache('safety')
  @Post('incidents') @ApiOperation({ summary: 'Report incident' }) createIncident(@Body() dto: any) { return this.svc.createIncident(dto); }
}
