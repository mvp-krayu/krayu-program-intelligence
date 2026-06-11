import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { ErpConnectorsService } from './erp-connectors.service';

@ApiTags('erp-connectors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('erp-connectors')
export class ErpConnectorsController {
  constructor(private readonly svc: ErpConnectorsService) {}

  @Get()
  @ApiOperation({ summary: 'List all erp-connectors' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get erp-connectors by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create erp-connectors' })
  @InvalidatesCache('erp-connectors')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('available-connectors')
  @ApiOperation({ summary: 'Get Available Connectors' })
  @HttpCacheTTL(300)
  getAvailableConnectors() { return this.svc.getAvailableConnectors(); }

  @Post('connector')
  @ApiOperation({ summary: 'Create Connector' })
  @InvalidatesCache('erp-connectors')
  createConnector(@Body() dto: any) { return this.svc.createConnector(dto); }

  @Get('test-connection')
  @ApiOperation({ summary: 'Test Connection' })
  @HttpCacheTTL(300)
  testConnection() { return this.svc.testConnection(); }

  @Get('trigger-sync')
  @ApiOperation({ summary: 'Trigger Sync' })
  @HttpCacheTTL(300)
  triggerSync() { return this.svc.triggerSync(); }

  @Get('sync-history')
  @ApiOperation({ summary: 'Get Sync History' })
  @HttpCacheTTL(300)
  getSyncHistory() { return this.svc.getSyncHistory(); }

  @Get('field-mappings')
  @ApiOperation({ summary: 'Get Field Mappings' })
  @HttpCacheTTL(300)
  getFieldMappings() { return this.svc.getFieldMappings(); }

  @Post('field-mapping/:id')
  @ApiOperation({ summary: 'Update Field Mapping' })
  @InvalidatesCache('erp-connectors')
  updateFieldMapping(@Param('id') id: string, @Body() dto: any) { return this.svc.updateFieldMapping(id, dto); }

  @Get('connector-config')
  @ApiOperation({ summary: 'Get Connector Config' })
  @HttpCacheTTL(300)
  getConnectorConfig() { return this.svc.getConnectorConfig(); }

  @Post('connector-config/:id')
  @ApiOperation({ summary: 'Update Connector Config' })
  @InvalidatesCache('erp-connectors')
  updateConnectorConfig(@Param('id') id: string, @Body() dto: any) { return this.svc.updateConnectorConfig(id, dto); }

}
