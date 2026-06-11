import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { FatigueRiskService } from './fatigue-risk.service';

@ApiTags('fatigue-risk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('fatigue-risk')
export class FatigueRiskController {
  constructor(private readonly svc: FatigueRiskService) {}

  @Get()
  @ApiOperation({ summary: 'List all fatigue-risk' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get fatigue-risk by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create fatigue-risk' })
  @InvalidatesCache('fatigue-risk')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('driver-risk')
  @ApiOperation({ summary: 'Get Driver Risk' })
  @HttpCacheTTL(300)
  getDriverRisk() { return this.svc.getDriverRisk(); }

  @Get('historical-trends')
  @ApiOperation({ summary: 'Get Historical Trends' })
  @HttpCacheTTL(300)
  getHistoricalTrends() { return this.svc.getHistoricalTrends(); }

}
