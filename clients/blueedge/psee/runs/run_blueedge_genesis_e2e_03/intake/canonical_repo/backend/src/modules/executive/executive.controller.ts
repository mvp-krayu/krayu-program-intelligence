import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { ExecutiveService } from './executive.service';

@ApiTags('executive')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('executive')
export class ExecutiveController {
  constructor(private readonly svc: ExecutiveService) {}

  @Get()
  @ApiOperation({ summary: 'List all executive' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get executive by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create executive' })
  @InvalidatesCache('executive')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('ceo-dashboard')
  @ApiOperation({ summary: 'Get Ceo Dashboard' })
  @HttpCacheTTL(300)
  getCeoDashboard() { return this.svc.getCeoDashboard(); }

  @Get('cto-dashboard')
  @ApiOperation({ summary: 'Get Cto Dashboard' })
  @HttpCacheTTL(300)
  getCtoDashboard() { return this.svc.getCtoDashboard(); }

  @Get('board-report')
  @ApiOperation({ summary: 'Get Board Report' })
  @HttpCacheTTL(300)
  getBoardReport() { return this.svc.getBoardReport(); }

  @Get('cross-fleet-kpis')
  @ApiOperation({ summary: 'Get Cross Fleet Kpis' })
  @HttpCacheTTL(300)
  getCrossFleetKpis() { return this.svc.getCrossFleetKpis(); }

}
