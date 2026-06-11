import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { AnomalyDetectionService } from './anomaly-detection.service';

@ApiTags('anomaly-detection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('anomaly-detection')
export class AnomalyDetectionController {
  constructor(private readonly svc: AnomalyDetectionService) {}

  @Get()
  @ApiOperation({ summary: 'List all anomaly-detection' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get anomaly-detection by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create anomaly-detection' })
  @InvalidatesCache('anomaly-detection')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('active-anomalies')
  @ApiOperation({ summary: 'Get Active Anomalies' })
  @HttpCacheTTL(300)
  getActiveAnomalies() { return this.svc.getActiveAnomalies(); }

  @Get('patterns')
  @ApiOperation({ summary: 'Get Patterns' })
  @HttpCacheTTL(300)
  getPatterns() { return this.svc.getPatterns(); }

  @Get('fleet-correlations')
  @ApiOperation({ summary: 'Get Fleet Correlations' })
  @HttpCacheTTL(300)
  getFleetCorrelations() { return this.svc.getFleetCorrelations(); }

  @Get('root-cause-analysis')
  @ApiOperation({ summary: 'Get Root Cause Analysis' })
  @HttpCacheTTL(300)
  getRootCauseAnalysis() { return this.svc.getRootCauseAnalysis(); }

  @Get('detection-config')
  @ApiOperation({ summary: 'Get Detection Config' })
  @HttpCacheTTL(300)
  getDetectionConfig() { return this.svc.getDetectionConfig(); }

}
