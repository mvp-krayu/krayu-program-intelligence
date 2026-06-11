import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { NotificationsService } from './notifications.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('notifications') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('notifications')
export class NotificationsController {
  constructor(private svc: NotificationsService) {}
  @RequirePermissions(Permission.NOTIFICATION_READ)
  @HttpCacheTTL(30)
  @Get() @ApiOperation({ summary: 'List notifications' })
  @ApiResponse({ status: 200, description: 'Paginated list', schema: { example: {"success":true,"data":{"items":[{"id":"uuid","type":"maintenance_due","title":"Oil Change Due — TK-007","message":"Vehicle TK-007 has reached 10,000 km service interval","severity":"medium","read":false,"createdAt":"2024-01-15T10:00:00Z"}],"total":120,"page":1,"limit":20}} } }) findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }
  @RequirePermissions(Permission.NOTIFICATION_READ)
  @HttpCacheTTL(30)
  @Get('unread/:userId') @ApiOperation({ summary: 'Unread notifications' }) getUnread(@Param('userId') id: string) { return this.svc.getUnread(id); }
  @RequirePermissions(Permission.NOTIFICATION_READ)
  @HttpCacheTTL(30)
  @Get('count/:userId') @ApiOperation({ summary: 'Unread count' }) getCount(@Param('userId') id: string) { return this.svc.getCount(id); }
  @RequirePermissions(Permission.NOTIFICATION_WRITE)
  @InvalidatesCache('notifications')
  @Post() @ApiOperation({ summary: 'Send notification' }) create(@Body() dto: Partial<Notification>) { return this.svc.create(dto); }
  @RequirePermissions(Permission.NOTIFICATION_WRITE)
  @InvalidatesCache('notifications')
  @Patch(':id/read') @ApiOperation({ summary: 'Mark as read' }) markRead(@Param('id') id: string) { return this.svc.markRead(id); }
  @RequirePermissions(Permission.NOTIFICATION_WRITE)
  @InvalidatesCache('notifications')
  @Patch('read-all/:userId') @ApiOperation({ summary: 'Mark all read' }) markAllRead(@Param('userId') id: string) { return this.svc.markAllRead(id); }
}
