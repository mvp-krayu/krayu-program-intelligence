import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DriversService } from './drivers.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('drivers') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('drivers')
export class DriversController {
  constructor(private svc: DriversService) {}

  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get() @ApiOperation({ summary: 'List drivers' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","firstName":"Ahmed","lastName":"Al Rashid","licenseNumber":"DXB-DL-2024-1234","status":"active","fleetType":"tanker","safetyScore":92,"totalTrips":456}],"total":78,"page":1,"limit":20}} } }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get('stats') @ApiOperation({ summary: 'Driver statistics' })
  @ApiResponse({ status: 200, description: 'Statistics', schema: { example: {"success":true,"data":{"total":78,"active":65,"onLeave":13,"avgSafetyScore":87.5,"avgEfficiencyScore":82.3}} } }) getStats() { return this.svc.getStats(); }
  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get('leaderboard') @ApiOperation({ summary: 'Driver safety leaderboard' }) getLeaderboard(@Query() q: PaginationDto) { return this.svc.getLeaderboard(q); }
  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get(':id') @ApiOperation({ summary: 'Get driver by ID' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get(':id/scorecard') @ApiOperation({ summary: 'Driver behavior scorecard' }) getScorecard(@Param('id') id: string) { return this.svc.getScorecard(id); }
  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get(':id/hos') @ApiOperation({ summary: 'HOS/ELD compliance status' }) getHOS(@Param('id') id: string) { return this.svc.getHOSStatus(id); }
  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get(':id/trips') @ApiOperation({ summary: 'Driver trip history' }) getTrips(@Param('id') id: string, @Query() q: PaginationDto) { return this.svc.findAll({ ...q } as any); }
  @RequirePermissions(Permission.DRIVER_READ)
  @HttpCacheTTL(300)
  @Get(':id/certifications') @ApiOperation({ summary: 'Driver certifications' }) getCerts(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.DRIVER_WRITE)
  @InvalidatesCache('drivers')
  @Post() @ApiOperation({ summary: 'Register driver' }) create(@Body() dto: Partial<Driver>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.DRIVER_WRITE)
  @InvalidatesCache('drivers')
  @Put(':id') @ApiOperation({ summary: 'Update driver' }) update(@Param('id') id: string, @Body() dto: Partial<Driver>) { return this.svc.update(id, dto); }
  @RequirePermissions(Permission.DRIVER_WRITE)
  @InvalidatesCache('drivers')
  @Delete(':id') @ApiOperation({ summary: 'Deactivate driver' }) remove(@Param('id') id: string) { return this.svc.remove(id); }
}
