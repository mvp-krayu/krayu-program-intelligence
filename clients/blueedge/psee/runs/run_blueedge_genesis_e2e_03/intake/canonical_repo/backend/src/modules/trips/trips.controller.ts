import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { TripsService } from './trips.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('trips') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('trips')
export class TripsController {
  constructor(private svc: TripsService) {}
  @RequirePermissions(Permission.TRIP_READ)
  @HttpCacheTTL(30)
  @Get() @ApiOperation({ summary: 'List trips' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","vehicleId":"uuid","driverId":"uuid","origin":"Jebel Ali Free Zone","destination":"Fujairah Port","distanceKm":152,"durationMin":135,"status":"completed","fuelUsedLiters":42,"startedAt":"2024-01-15T06:00:00Z"}],"total":250,"page":1,"limit":20}} } }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.TRIP_READ)
  @HttpCacheTTL(30)
  @Get('active') @ApiOperation({ summary: 'Active trips' }) getActive() { return this.svc.getActive(); }
  @RequirePermissions(Permission.TRIP_READ)
  @HttpCacheTTL(60)
  @Get('stats') @ApiOperation({ summary: 'Trip statistics' })
  @ApiResponse({ status: 200, description: 'Statistics', schema: { example: {"success":true,"data":{"totalTrips":250,"completedToday":42,"avgDistanceKm":85,"avgDurationMin":95,"totalDistanceKm":21250,"fuelEfficiency":7.2}} } }) getStats(@Query() q: any) { return this.svc.getStats(q); }
  @RequirePermissions(Permission.TRIP_READ)
  @HttpCacheTTL(30)
  @Get(':id') @ApiOperation({ summary: 'Get trip' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.TRIP_READ)
  @HttpCacheTTL(30)
  @Get(':id/timeline') @ApiOperation({ summary: 'Trip event timeline' }) getTimeline(@Param('id') id: string) { return this.svc.getTimeline(id); }
  @RequirePermissions(Permission.TRIP_READ)
  @HttpCacheTTL(5)
  @Get(':id/telemetry') @ApiOperation({ summary: 'Trip telemetry track' }) getTelemetry(@Param('id') id: string) { return success({ tripId: id, trackPoints: [] }); }
  @RequirePermissions(Permission.TRIP_WRITE)
  @InvalidatesCache('trips')
  @Post() @ApiOperation({ summary: 'Create trip' }) create(@Body() dto: Partial<Trip>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.TRIP_WRITE)
  @InvalidatesCache('trips')
  @Post(':id/start') @ApiOperation({ summary: 'Start trip' }) start(@Param('id') id: string) { return this.svc.update(id, { status: 'in_progress', startTime: new Date() } as any); }
  @RequirePermissions(Permission.TRIP_WRITE)
  @InvalidatesCache('trips')
  @Post(':id/complete') @ApiOperation({ summary: 'Complete trip' }) complete(@Param('id') id: string) { return this.svc.update(id, { status: 'completed', endTime: new Date() } as any); }
  @RequirePermissions(Permission.TRIP_WRITE)
  @InvalidatesCache('trips')
  @Put(':id') @ApiOperation({ summary: 'Update trip' }) update(@Param('id') id: string, @Body() dto: Partial<Trip>) { return this.svc.update(id, dto); }
  @RequirePermissions(Permission.TRIP_WRITE)
  @InvalidatesCache('trips')
  @Delete(':id') @ApiOperation({ summary: 'Cancel trip' }) remove(@Param('id') id: string) { return this.svc.remove(id); }
}
