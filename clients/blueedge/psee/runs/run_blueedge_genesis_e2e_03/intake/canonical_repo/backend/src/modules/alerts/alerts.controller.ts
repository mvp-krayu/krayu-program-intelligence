import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { AlertsService } from './alerts.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('alerts') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('alerts')
export class AlertsController {
  constructor(private svc: AlertsService) {}
  @RequirePermissions(Permission.ALERT_READ)
  @HttpCacheTTL(5)
  @Get() @ApiOperation({ summary: 'List alerts' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","type":"geofence_exit","severity":"high","vehicleId":"uuid","message":"Tanker TK-007 left Jebel Ali zone","status":"active","createdAt":"2024-01-15T10:30:00Z"}],"total":45,"page":1,"limit":20}} } }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.ALERT_READ)
  @HttpCacheTTL(5)
  @Get('active') @ApiOperation({ summary: 'Active alerts' }) getActive() { return this.svc.getActive(); }
  @RequirePermissions(Permission.ALERT_READ)
  @HttpCacheTTL(30)
  @Get('stats') @ApiOperation({ summary: 'Alert statistics' })
  @ApiResponse({ status: 200, description: 'Statistics', schema: { example: {"success":true,"data":{"active":12,"critical":3,"acknowledged":8,"resolvedToday":15,"avgResolutionMinutes":23}} } }) getStats() { return this.svc.getStats(); }
  @RequirePermissions(Permission.ALERT_READ)
  @HttpCacheTTL(5)
  @Get(':id') @ApiOperation({ summary: 'Get alert' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.ALERT_WRITE)
  @InvalidatesCache('alerts')
  @Post() @ApiOperation({ summary: 'Create alert' }) create(@Body() dto: Partial<Alert>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.ALERT_ACKNOWLEDGE)
  @InvalidatesCache('alerts')
  @Patch(':id/acknowledge') @ApiOperation({ summary: 'Acknowledge alert' }) ack(@Param('id') id: string, @Body() body: { userId: string }) { return this.svc.acknowledge(id, body.userId); }
  @RequirePermissions(Permission.ALERT_ACKNOWLEDGE)
  @InvalidatesCache('alerts')
  @Patch(':id/resolve') @ApiOperation({ summary: 'Resolve alert' }) resolve(@Param('id') id: string, @Body() body: { userId: string; resolution: string }) { return this.svc.resolve(id, body.userId, body.resolution); }
  @RequirePermissions(Permission.ALERT_WRITE)
  @InvalidatesCache('alerts')
  @Patch(':id/dismiss') @ApiOperation({ summary: 'Dismiss alert' }) dismiss(@Param('id') id: string) { return this.svc.update(id, { status: 'dismissed' } as any); }
}
