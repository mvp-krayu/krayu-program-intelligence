import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { ElectrificationService } from './electrification.service';

@ApiTags('electrification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('electrification')
export class ElectrificationController {
  constructor(private readonly svc: ElectrificationService) {}

  @Get()
  @ApiOperation({ summary: 'List all electrification' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get electrification by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create electrification' })
  @InvalidatesCache('electrification')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('tco-analysis')
  @ApiOperation({ summary: 'Get Tco Analysis' })
  @HttpCacheTTL(300)
  getTcoAnalysis() { return this.svc.getTcoAnalysis(); }

  @Get('transition-timeline')
  @ApiOperation({ summary: 'Get Transition Timeline' })
  @HttpCacheTTL(300)
  getTransitionTimeline() { return this.svc.getTransitionTimeline(); }

  @Get('route-readiness')
  @ApiOperation({ summary: 'Get Route Readiness' })
  @HttpCacheTTL(300)
  getRouteReadiness() { return this.svc.getRouteReadiness(); }

}
