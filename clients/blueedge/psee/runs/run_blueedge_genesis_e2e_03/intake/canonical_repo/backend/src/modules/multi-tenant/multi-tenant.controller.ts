import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { MultiTenantService } from './multi-tenant.service';

@ApiTags('multi-tenant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('multi-tenant')
export class MultiTenantController {
  constructor(private readonly svc: MultiTenantService) {}

  @Get()
  @ApiOperation({ summary: 'List all multi-tenant' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get multi-tenant by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create multi-tenant' })
  @InvalidatesCache('multi-tenant')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('tenants')
  @ApiOperation({ summary: 'List Tenants' })
  @HttpCacheTTL(300)
  listTenants(@Query() q: any) { return this.svc.listTenants(q); }

  @Get('tenant')
  @ApiOperation({ summary: 'Get Tenant' })
  @HttpCacheTTL(300)
  getTenant() { return this.svc.getTenant(); }

  @Post('tenant')
  @ApiOperation({ summary: 'Create Tenant' })
  @InvalidatesCache('multi-tenant')
  createTenant(@Body() dto: any) { return this.svc.createTenant(dto); }

  @Post('tenant/:id')
  @ApiOperation({ summary: 'Update Tenant' })
  @InvalidatesCache('multi-tenant')
  updateTenant(@Param('id') id: string, @Body() dto: any) { return this.svc.updateTenant(id, dto); }

  @Get('suspend-tenant')
  @ApiOperation({ summary: 'Suspend Tenant' })
  @HttpCacheTTL(300)
  suspendTenant() { return this.svc.suspendTenant(); }

  @Get('reactivate-tenant')
  @ApiOperation({ summary: 'Reactivate Tenant' })
  @HttpCacheTTL(300)
  reactivateTenant() { return this.svc.reactivateTenant(); }

  @Get('plans')
  @ApiOperation({ summary: 'Get Plans' })
  @HttpCacheTTL(300)
  getPlans() { return this.svc.getPlans(); }

  @Get('change-plan')
  @ApiOperation({ summary: 'Change Plan' })
  @HttpCacheTTL(300)
  changePlan() { return this.svc.changePlan(); }

  @Get('usage')
  @ApiOperation({ summary: 'Get Usage' })
  @HttpCacheTTL(300)
  getUsage() { return this.svc.getUsage(); }

  @Get('rls-config')
  @ApiOperation({ summary: 'Get Rls Config' })
  @HttpCacheTTL(300)
  getRlsConfig() { return this.svc.getRlsConfig(); }

  @Get('isolation-audit')
  @ApiOperation({ summary: 'Get Isolation Audit' })
  @HttpCacheTTL(300)
  getIsolationAudit() { return this.svc.getIsolationAudit(); }

}
