import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { CrossBorderService } from './cross-border.service';

@ApiTags('cross-border')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('cross-border')
export class CrossBorderController {
  constructor(private readonly svc: CrossBorderService) {}

  @Get()
  @ApiOperation({ summary: 'List all cross-border' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get cross-border by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create cross-border' })
  @InvalidatesCache('cross-border')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('regulations-by-country')
  @ApiOperation({ summary: 'Get Regulations By Country' })
  @HttpCacheTTL(300)
  getRegulationsByCountry() { return this.svc.getRegulationsByCountry(); }

  @Get('compliance-matrix')
  @ApiOperation({ summary: 'Get Compliance Matrix' })
  @HttpCacheTTL(300)
  getComplianceMatrix() { return this.svc.getComplianceMatrix(); }

  @Get('route-planning')
  @ApiOperation({ summary: 'Get Route Planning' })
  @HttpCacheTTL(300)
  getRoutePlanning() { return this.svc.getRoutePlanning(); }

}
