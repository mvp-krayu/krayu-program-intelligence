import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { WhiteLabelService } from './white-label.service';

@ApiTags('white-label')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('white-label')
export class WhiteLabelController {
  constructor(private readonly svc: WhiteLabelService) {}

  @Get()
  @ApiOperation({ summary: 'List all white-label' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get white-label by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create white-label' })
  @InvalidatesCache('white-label')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('tenant-theme')
  @ApiOperation({ summary: 'Get Tenant Theme' })
  @HttpCacheTTL(300)
  getTenantTheme() { return this.svc.getTenantTheme(); }

  @Get('tenants')
  @ApiOperation({ summary: 'List Tenants' })
  @HttpCacheTTL(300)
  listTenants() { return this.svc.listTenants(); }

  @Get('customization-options')
  @ApiOperation({ summary: 'Get Customization Options' })
  @HttpCacheTTL(300)
  getCustomizationOptions() { return this.svc.getCustomizationOptions(); }

}
