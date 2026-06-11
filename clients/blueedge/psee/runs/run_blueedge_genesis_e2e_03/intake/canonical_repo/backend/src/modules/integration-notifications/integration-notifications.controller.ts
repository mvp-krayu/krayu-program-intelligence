import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { NotificationProvidersService } from './integration-notifications.service';

@ApiTags('integration-notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('integration-notifications')
export class IntegrationNotificationsController {
  constructor(private readonly svc: NotificationProvidersService) {}

  @Get()
  @ApiOperation({ summary: 'List all integration-notifications' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration-notifications by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create integration-notifications' })
  @InvalidatesCache('integration-notifications')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('providers-dashboard')
  @ApiOperation({ summary: 'Get Providers Dashboard' })
  @HttpCacheTTL(300)
  getProvidersDashboard() { return this.svc.getProvidersDashboard(); }

  @Get('provider-health')
  @ApiOperation({ summary: 'Get Provider Health' })
  @HttpCacheTTL(300)
  getProviderHealth() { return this.svc.getProviderHealth(); }

  @Get('test-provider')
  @ApiOperation({ summary: 'Test Provider' })
  @HttpCacheTTL(300)
  testProvider() { return this.svc.testProvider(); }

  @Get('configure-provider')
  @ApiOperation({ summary: 'Configure Provider' })
  @HttpCacheTTL(300)
  configureProvider() { return this.svc.configureProvider(); }

  @Get('rules')
  @ApiOperation({ summary: 'Get Rules' })
  @HttpCacheTTL(300)
  getRules() { return this.svc.getRules(); }

  @Post('rule')
  @ApiOperation({ summary: 'Create Rule' })
  @InvalidatesCache('integration-notifications')
  createRule(@Body() dto: any) { return this.svc.createRule(dto); }

  @Get('test-rule')
  @ApiOperation({ summary: 'Test Rule' })
  @HttpCacheTTL(300)
  testRule() { return this.svc.testRule(); }

  @Post('rule/:id')
  @ApiOperation({ summary: 'Update Rule' })
  @InvalidatesCache('integration-notifications')
  updateRule(@Param('id') id: string, @Body() dto: any) { return this.svc.updateRule(id, dto); }

  @Get('delivery-analytics')
  @ApiOperation({ summary: 'Get Delivery Analytics' })
  @HttpCacheTTL(300)
  getDeliveryAnalytics() { return this.svc.getDeliveryAnalytics(); }

  @Get('delivery-logs')
  @ApiOperation({ summary: 'Get Delivery Logs' })
  @HttpCacheTTL(300)
  getDeliveryLogs(@Query() q: any) { return this.svc.getDeliveryLogs(q); }

  @Get('webhook-config')
  @ApiOperation({ summary: 'Get Webhook Config' })
  @HttpCacheTTL(300)
  getWebhookConfig() { return this.svc.getWebhookConfig(); }

  @Get('process-inbound-webhook')
  @ApiOperation({ summary: 'Process Inbound Webhook' })
  @HttpCacheTTL(300)
  processInboundWebhook() { return this.svc.processInboundWebhook(); }

}
