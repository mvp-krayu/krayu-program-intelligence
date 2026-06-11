import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { RoadIntelligenceService } from './road-intelligence.service';

@ApiTags('road-intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('road-intelligence')
export class RoadIntelligenceController {
  constructor(private readonly svc: RoadIntelligenceService) {}

  @Get()
  @ApiOperation({ summary: 'List all road-intelligence' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get road-intelligence by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create road-intelligence' })
  @InvalidatesCache('road-intelligence')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('road-analysis')
  @ApiOperation({ summary: 'Get Road Analysis' })
  @HttpCacheTTL(300)
  getRoadAnalysis() { return this.svc.getRoadAnalysis(); }

  @Get('predictive-degradation')
  @ApiOperation({ summary: 'Get Predictive Degradation' })
  @HttpCacheTTL(300)
  getPredictiveDegradation() { return this.svc.getPredictiveDegradation(); }

  @Get('city-authority-feeds')
  @ApiOperation({ summary: 'Get City Authority Feeds' })
  @HttpCacheTTL(300)
  getCityAuthorityFeeds() { return this.svc.getCityAuthorityFeeds(); }

  @Get('report-hazard')
  @ApiOperation({ summary: 'Report Hazard' })
  @HttpCacheTTL(300)
  reportHazard() { return this.svc.reportHazard(); }

}
