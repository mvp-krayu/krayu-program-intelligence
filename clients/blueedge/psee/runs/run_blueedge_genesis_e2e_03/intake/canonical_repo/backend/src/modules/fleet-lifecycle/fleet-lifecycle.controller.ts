import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { FleetLifecycleService } from './fleet-lifecycle.service';

@ApiTags('fleet-lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('fleet-lifecycle')
export class FleetLifecycleController {
  constructor(private readonly svc: FleetLifecycleService) {}

  @Get()
  @ApiOperation({ summary: 'List all fleet-lifecycle' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get fleet-lifecycle by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create fleet-lifecycle' })
  @InvalidatesCache('fleet-lifecycle')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('vehicle-lifecycle')
  @ApiOperation({ summary: 'Get Vehicle Lifecycle' })
  @HttpCacheTTL(300)
  getVehicleLifecycle() { return this.svc.getVehicleLifecycle(); }

  @Get('retirement-candidates')
  @ApiOperation({ summary: 'Get Retirement Candidates' })
  @HttpCacheTTL(300)
  getRetirementCandidates() { return this.svc.getRetirementCandidates(); }

}
