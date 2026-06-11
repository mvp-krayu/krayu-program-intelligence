import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DepotChargingService } from './depot-charging.service';

@ApiTags('depot-charging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('depot-charging')
export class DepotChargingController {
  constructor(private readonly svc: DepotChargingService) {}

  @Get()
  @ApiOperation({ summary: 'List all depot-charging' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get depot-charging by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create depot-charging' })
  @InvalidatesCache('depot-charging')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('schedule')
  @ApiOperation({ summary: 'Get Schedule' })
  @HttpCacheTTL(300)
  getSchedule() { return this.svc.getSchedule(); }

  @Get('energy-optimization')
  @ApiOperation({ summary: 'Get Energy Optimization' })
  @HttpCacheTTL(300)
  getEnergyOptimization() { return this.svc.getEnergyOptimization(); }

  @Get('charger-status/:id')
  @ApiOperation({ summary: 'Get Charger Status' })
  @HttpCacheTTL(300)
  getChargerStatus(@Param('id') id: string) { return this.svc.getChargerStatus(id); }

}
