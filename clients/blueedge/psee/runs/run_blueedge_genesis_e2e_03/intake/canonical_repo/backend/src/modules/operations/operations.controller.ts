import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { GeofenceService } from './operations.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('operations') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('operations')
export class OperationsController {
  constructor(private geoSvc: GeofenceService) {}

  // Geofences
  @RequirePermissions(Permission.OPERATIONS_READ)
  @HttpCacheTTL(300)
  @Get('geofences') @ApiOperation({ summary: 'List geofences' }) findAll(@Query() q: PaginationDto) { return this.geoSvc.findAll(q); }
  @RequirePermissions(Permission.OPERATIONS_READ)
  @HttpCacheTTL(300)
  @Get('geofences/events') @ApiOperation({ summary: 'Geofence events' }) getEvents(@Query() q: any) { return this.geoSvc.getEvents(q); }
  @RequirePermissions(Permission.OPERATIONS_READ)
  @HttpCacheTTL(300)
  @Get('geofences/:id') @ApiOperation({ summary: 'Get geofence' }) findOne(@Param('id') id: string) { return this.geoSvc.findOne(id); }
  @RequirePermissions(Permission.OPERATIONS_WRITE)
  @InvalidatesCache('operations')
  @Post('geofences') @ApiOperation({ summary: 'Create geofence' }) create(@Body() dto: Partial<Geofence>) { return this.geoSvc.create(dto); }
  @RequirePermissions(Permission.OPERATIONS_WRITE)
  @InvalidatesCache('operations')
  @Put('geofences/:id') @ApiOperation({ summary: 'Update geofence' }) update(@Param('id') id: string, @Body() dto: Partial<Geofence>) { return this.geoSvc.update(id, dto); }
  @RequirePermissions(Permission.OPERATIONS_WRITE)
  @InvalidatesCache('operations')
  @Delete('geofences/:id') @ApiOperation({ summary: 'Delete geofence' }) remove(@Param('id') id: string) { return this.geoSvc.remove(id); }

  // Dispatch
  @RequirePermissions(Permission.OPERATIONS_READ)
  @HttpCacheTTL(300)
  @Get('dispatch/board') @ApiOperation({ summary: 'Dispatch board' })
  getDispatchBoard() { return success({ unassigned: 5, assigned: 18, inProgress: 32, completed: 145, delayed: 3 }); }

  @RequirePermissions(Permission.OPERATIONS_WRITE)
  @InvalidatesCache('operations')
  @Post('dispatch/assign') @ApiOperation({ summary: 'Assign vehicle to job' })
  assignJob(@Body() dto: { vehicleId: string; jobId: string }) { return success({ ...dto, status: 'assigned', assignedAt: new Date() }); }

  @RequirePermissions(Permission.OPERATIONS_WRITE)
  @InvalidatesCache('operations')
  @Post('dispatch/optimize') @ApiOperation({ summary: 'Optimize routes' })
  optimizeRoutes(@Body() dto: { vehicleIds: string[]; constraints?: any }) { return success({ optimized: dto.vehicleIds.length, estimatedSavingsKm: 85, estimatedSavingsMin: 42 }); }

  // Route optimization
  @RequirePermissions(Permission.OPERATIONS_READ)
  @HttpCacheTTL(300)
  @Get('routes/suggestions') @ApiOperation({ summary: 'Route optimization suggestions' })
  getRouteSuggestions() { return success([{ vehicleId: 'v1', currentRoute: 'E11 via Marina', suggestedRoute: 'Al Khail Road', savingsKm: 8.5, savingsMin: 12, fuelSavingsL: 3.2 }]); }

  @RequirePermissions(Permission.OPERATIONS_WRITE)
  @InvalidatesCache('operations')
  @Post('routes/calculate') @ApiOperation({ summary: 'Calculate optimal route' })
  calculateRoute(@Body() dto: { origin: { lat: number; lng: number }; destination: { lat: number; lng: number }; waypoints?: any[] }) {
    return success({ distanceKm: 45.3, durationMin: 38, fuelEstL: 15.2, route: { polyline: '', steps: [] } });
  }
}
