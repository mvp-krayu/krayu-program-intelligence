import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { GeofenceAutomationService } from './geofence-automation.service';

@ApiTags('geofence-automation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('geofence-automation')
export class GeofenceAutomationController {
  constructor(private readonly svc: GeofenceAutomationService) {}

  @Get()
  @ApiOperation({ summary: 'List all geofence-automation' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get geofence-automation by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create geofence-automation' })
  @InvalidatesCache('geofence-automation')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('zones')
  @ApiOperation({ summary: 'Get Zones' })
  @HttpCacheTTL(300)
  getZones() { return this.svc.getZones(); }

  @Get('rules')
  @ApiOperation({ summary: 'Get Rules' })
  @HttpCacheTTL(300)
  getRules() { return this.svc.getRules(); }

  @Get('recent-triggers')
  @ApiOperation({ summary: 'Get Recent Triggers' })
  @HttpCacheTTL(300)
  getRecentTriggers() { return this.svc.getRecentTriggers(); }

  @Post('zone')
  @ApiOperation({ summary: 'Create Zone' })
  @InvalidatesCache('geofence-automation')
  createZone(@Body() dto: any) { return this.svc.createZone(dto); }

  @Post('rule')
  @ApiOperation({ summary: 'Create Rule' })
  @InvalidatesCache('geofence-automation')
  createRule(@Body() dto: any) { return this.svc.createRule(dto); }

  @Get('test-rule')
  @ApiOperation({ summary: 'Test Rule' })
  @HttpCacheTTL(300)
  testRule() { return this.svc.testRule(); }

}
