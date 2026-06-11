import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DriverIncentivesService } from './driver-incentives.service';

@ApiTags('driver-incentives')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('driver-incentives')
export class DriverIncentivesController {
  constructor(private readonly svc: DriverIncentivesService) {}

  @Get()
  @ApiOperation({ summary: 'List all driver-incentives' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver-incentives by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create driver-incentives' })
  @InvalidatesCache('driver-incentives')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('active-programs')
  @ApiOperation({ summary: 'Get Active Programs' })
  @HttpCacheTTL(300)
  getActivePrograms() { return this.svc.getActivePrograms(); }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get Leaderboard' })
  @HttpCacheTTL(300)
  getLeaderboard() { return this.svc.getLeaderboard(); }

  @Get('payout-summary')
  @ApiOperation({ summary: 'Get Payout Summary' })
  @HttpCacheTTL(300)
  getPayoutSummary() { return this.svc.getPayoutSummary(); }

  @Get('driver-incentive-status/:id')
  @ApiOperation({ summary: 'Get Driver Incentive Status' })
  @HttpCacheTTL(300)
  getDriverIncentiveStatus(@Param('id') id: string) { return this.svc.getDriverIncentiveStatus(id); }

}
