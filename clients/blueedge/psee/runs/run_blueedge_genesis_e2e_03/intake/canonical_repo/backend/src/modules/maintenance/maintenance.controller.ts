import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { MaintenanceService } from './maintenance.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('maintenance') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('maintenance')
export class MaintenanceController {
  constructor(private svc: MaintenanceService) {}
  @RequirePermissions(Permission.MAINTENANCE_READ)
  @HttpCacheTTL(300)
  @Get('work-orders') @ApiOperation({ summary: 'List work orders' }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.MAINTENANCE_READ)
  @HttpCacheTTL(300)
  @Get('work-orders/overdue') @ApiOperation({ summary: 'Overdue work orders' }) getOverdue() { return this.svc.getOverdue(); }
  @RequirePermissions(Permission.MAINTENANCE_READ)
  @HttpCacheTTL(300)
  @Get('predictive') @ApiOperation({ summary: 'Predictive maintenance alerts' }) getPredictive() { return this.svc.getPredictive(); }
  @RequirePermissions(Permission.MAINTENANCE_READ)
  @HttpCacheTTL(300)
  @Get('stats') @ApiOperation({ summary: 'Maintenance statistics' })
  @ApiResponse({ status: 200, description: 'Statistics', schema: { example: {"success":true,"data":{"totalWorkOrders":45,"pending":12,"inProgress":8,"completed":25,"avgCompletionDays":1.8,"monthlyBudget":450000,"monthlySpent":312000}} } }) getStats() { return this.svc.getStats(); }
  @RequirePermissions(Permission.MAINTENANCE_READ)
  @HttpCacheTTL(300)
  @Get('schedule') @ApiOperation({ summary: 'Maintenance calendar' }) getSchedule(@Query() q: any) { return this.svc.getSchedule(q); }
  @RequirePermissions(Permission.MAINTENANCE_READ)
  @HttpCacheTTL(300)
  @Get('work-orders/:id') @ApiOperation({ summary: 'Get work order' }) findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @RequirePermissions(Permission.MAINTENANCE_WRITE)
  @InvalidatesCache('maintenance')
  @Post('work-orders') @ApiOperation({ summary: 'Create work order' }) create(@Body() dto: Partial<WorkOrder>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.MAINTENANCE_WRITE)
  @InvalidatesCache('maintenance')
  @Put('work-orders/:id') @ApiOperation({ summary: 'Update work order' }) update(@Param('id') id: string, @Body() dto: Partial<WorkOrder>) { return this.svc.update(id, dto); }
  @RequirePermissions(Permission.MAINTENANCE_WRITE)
  @InvalidatesCache('maintenance')
  @Patch('work-orders/:id/complete') @ApiOperation({ summary: 'Complete work order' }) complete(@Param('id') id: string) { return this.svc.update(id, { status: 'completed', completedDate: new Date() } as any); }
  @RequirePermissions(Permission.MAINTENANCE_WRITE)
  @InvalidatesCache('maintenance')
  @Delete('work-orders/:id') @ApiOperation({ summary: 'Cancel work order' }) remove(@Param('id') id: string) { return this.svc.remove(id); }
}
