import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { V2gService } from './v2g.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('v2g') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('v2g')
export class V2gController {
  constructor(private svc: V2gService) {}

  @RequirePermissions(Permission.V2G_READ)
  @HttpCacheTTL(30)
  @Get('dashboard') @ApiOperation({ summary: 'V2G fleet dashboard' })
  getDashboard() { return this.svc.getDashboard(); }

  @RequirePermissions(Permission.V2G_READ)
  @HttpCacheTTL(30)
  @Get('contracts') @ApiOperation({ summary: 'List V2G contracts' })
  getContracts(@Query() q: PaginationDto) { return this.svc.getContracts(q); }

  @RequirePermissions(Permission.V2G_READ)
  @HttpCacheTTL(30)
  @Get('sessions') @ApiOperation({ summary: 'Live V2G sessions' })
  getSessions(@Query() q: PaginationDto) { return this.svc.getLiveSessions(q); }

  @RequirePermissions(Permission.V2G_READ)
  @HttpCacheTTL(30)
  @Get('analytics') @ApiOperation({ summary: 'Energy trading analytics' })
  getAnalytics(@Query() q: any) { return this.svc.getEnergyAnalytics(q); }

  @RequirePermissions(Permission.V2G_READ)
  @HttpCacheTTL(30)
  @Get('grid/signals') @ApiOperation({ summary: 'Real-time grid signals & pricing' })
  getGridSignals() { return this.svc.getGridSignals(); }

  @RequirePermissions(Permission.V2G_READ)
  @HttpCacheTTL(30)
  @Get('schedule') @ApiOperation({ summary: 'Optimized fleet charge/discharge schedule' })
  getSchedule() { return this.svc.getFleetSchedule(); }

  @RequirePermissions(Permission.V2G_MANAGE)
  @InvalidatesCache('v2g')
  @Post('contracts') @ApiOperation({ summary: 'Create V2G contract' })
  createContract(@Body() body: any) { return this.svc.createContract(body); }

  @RequirePermissions(Permission.V2G_MANAGE)
  @InvalidatesCache('v2g')
  @Post(':vehicleId/discharge') @ApiOperation({ summary: 'Start V2G discharge session' })
  startDischarge(@Param('vehicleId') id: string, @Body() body: any) { return this.svc.startDischarge(id, body); }

  @RequirePermissions(Permission.V2G_MANAGE)
  @InvalidatesCache('v2g')
  @Post(':vehicleId/stop') @ApiOperation({ summary: 'Stop V2G session' })
  stopSession(@Param('vehicleId') id: string) { return this.svc.stopSession(id); }

  @RequirePermissions(Permission.V2G_MANAGE)
  @InvalidatesCache('v2g')
  @Put('contracts/:id') @ApiOperation({ summary: 'Update V2G contract' })
  updateContract(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body); }
}
