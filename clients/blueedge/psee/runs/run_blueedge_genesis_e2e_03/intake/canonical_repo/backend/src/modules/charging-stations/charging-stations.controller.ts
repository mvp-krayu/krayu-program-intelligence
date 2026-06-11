import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { ChargingStationsService } from './charging-stations.service';

@ApiTags('charging-stations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('charging-stations')
export class ChargingStationsController {
  constructor(private readonly svc: ChargingStationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all charging-stations' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get charging-stations by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create charging-stations' })
  @InvalidatesCache('charging-stations')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('nearby')
  @ApiOperation({ summary: 'Get Nearby' })
  @HttpCacheTTL(300)
  getNearby() { return this.svc.getNearby(); }

  @Get('network')
  @ApiOperation({ summary: 'Get Network' })
  @HttpCacheTTL(300)
  getNetwork() { return this.svc.getNetwork(); }

  @Get('route-planning')
  @ApiOperation({ summary: 'Get Route Planning' })
  @HttpCacheTTL(300)
  getRoutePlanning() { return this.svc.getRoutePlanning(); }

}
