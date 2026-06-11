import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { ApiMarketplaceService } from './api-marketplace.service';

@ApiTags('api-marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('api-marketplace')
export class ApiMarketplaceController {
  constructor(private readonly svc: ApiMarketplaceService) {}

  @Get()
  @ApiOperation({ summary: 'List all api-marketplace' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get api-marketplace by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create api-marketplace' })
  @InvalidatesCache('api-marketplace')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('api-keys')
  @ApiOperation({ summary: 'Get Api Keys' })
  @HttpCacheTTL(300)
  getApiKeys() { return this.svc.getApiKeys(); }

  @Post('api-key')
  @ApiOperation({ summary: 'Create Api Key' })
  @InvalidatesCache('api-marketplace')
  createApiKey(@Body() dto: any) { return this.svc.createApiKey(dto); }

  @Get('rotate-api-key')
  @ApiOperation({ summary: 'Rotate Api Key' })
  @HttpCacheTTL(300)
  rotateApiKey() { return this.svc.rotateApiKey(); }

  @Get('api-key-usage')
  @ApiOperation({ summary: 'Get Api Key Usage' })
  @HttpCacheTTL(300)
  getApiKeyUsage() { return this.svc.getApiKeyUsage(); }

  @Get('webhooks')
  @ApiOperation({ summary: 'Get Webhooks' })
  @HttpCacheTTL(300)
  getWebhooks() { return this.svc.getWebhooks(); }

  @Get('available-events')
  @ApiOperation({ summary: 'Get Available Events' })
  @HttpCacheTTL(300)
  getAvailableEvents() { return this.svc.getAvailableEvents(); }

  @Post('webhook')
  @ApiOperation({ summary: 'Create Webhook' })
  @InvalidatesCache('api-marketplace')
  createWebhook(@Body() dto: any) { return this.svc.createWebhook(dto); }

  @Get('test-webhook')
  @ApiOperation({ summary: 'Test Webhook' })
  @HttpCacheTTL(300)
  testWebhook() { return this.svc.testWebhook(); }

  @Get('webhook-deliveries')
  @ApiOperation({ summary: 'Get Webhook Deliveries' })
  @HttpCacheTTL(300)
  getWebhookDeliveries() { return this.svc.getWebhookDeliveries(); }

  @Get('api-documentation')
  @ApiOperation({ summary: 'Get Api Documentation' })
  @HttpCacheTTL(300)
  getApiDocumentation() { return this.svc.getApiDocumentation(); }

  @Get('available-scopes')
  @ApiOperation({ summary: 'Get Available Scopes' })
  @HttpCacheTTL(300)
  getAvailableScopes() { return this.svc.getAvailableScopes(); }

}
