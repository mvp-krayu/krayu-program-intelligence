import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { PermitsService } from './permits.service';

@ApiTags('permits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('permits')
export class PermitsController {
  constructor(private readonly svc: PermitsService) {}

  @Get()
  @ApiOperation({ summary: 'List all permits' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get permits by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create permits' })
  @InvalidatesCache('permits')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @HttpCacheTTL(300)
  getDashboard() { return this.svc.getDashboard(); }

  @Get('expiring-permits')
  @ApiOperation({ summary: 'Get Expiring Permits' })
  @HttpCacheTTL(300)
  getExpiringPermits() { return this.svc.getExpiringPermits(); }

  @Get('request-renewal')
  @ApiOperation({ summary: 'Request Renewal' })
  @HttpCacheTTL(300)
  requestRenewal() { return this.svc.requestRenewal(); }

}
