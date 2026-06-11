import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { DiagnosticsService } from './diagnostics.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('diagnostics') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('diagnostics')
export class DiagnosticsController {
  constructor(private svc: DiagnosticsService) {}
  @RequirePermissions(Permission.DIAGNOSTICS_READ)
  @HttpCacheTTL(300)
  @Get('fleet-health') @ApiOperation({ summary: 'Fleet health overview' }) getFleetHealth() { return this.svc.getFleetHealth(); }
  @RequirePermissions(Permission.DIAGNOSTICS_READ)
  @HttpCacheTTL(300)
  @Get('vehicle/:id') @ApiOperation({ summary: 'Vehicle health report' }) getVehicleHealth(@Param('id') id: string) { return this.svc.getVehicleHealth(id); }
  @RequirePermissions(Permission.DIAGNOSTICS_READ)
  @HttpCacheTTL(300)
  @Get('vehicle/:id/dtcs') @ApiOperation({ summary: 'DTC analysis' }) getDTCs(@Param('id') id: string) { return this.svc.getDTCAnalysis(id); }
  @RequirePermissions(Permission.DIAGNOSTICS_READ)
  @HttpCacheTTL(300)
  @Get('vehicle/:id/rul') @ApiOperation({ summary: 'Remaining useful life' }) getRUL(@Param('id') id: string, @Query('component') c: string) { return this.svc.getRUL(id, c); }
}
