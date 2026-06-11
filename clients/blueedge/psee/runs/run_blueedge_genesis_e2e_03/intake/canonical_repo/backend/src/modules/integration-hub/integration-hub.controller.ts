import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { IntegrationHubService } from './integration-hub.service';

@ApiTags('integration-hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('integration-hub')
export class IntegrationHubController {
  constructor(private readonly svc: IntegrationHubService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('health-overview')
  @ApiOperation({ summary: 'Get Health Overview' })
  @HttpCacheTTL(300)
  getHealthOverview() { return this.svc.getHealthOverview(); }

  @Get('data-flows')
  @ApiOperation({ summary: 'Get Data Flows' })
  @HttpCacheTTL(300)
  getDataFlows() { return this.svc.getDataFlows(); }

  @Get('audit-log')
  @ApiOperation({ summary: 'Get Audit Log' })
  @HttpCacheTTL(300)
  getAuditLog(@Query() q: any) { return this.svc.getAuditLog(q); }

  @Get('integration-metrics')
  @ApiOperation({ summary: 'Get Integration Metrics' })
  @HttpCacheTTL(300)
  getIntegrationMetrics() { return this.svc.getIntegrationMetrics(); }

  @Post('diagnostics')
  @ApiOperation({ summary: 'Run Diagnostics' })
  @InvalidatesCache('integration-hub')
  runDiagnostics() { return this.svc.runDiagnostics(); }

}
