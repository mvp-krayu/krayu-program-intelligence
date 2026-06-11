import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { DriverMobileService } from './driver-mobile.service';

@ApiTags('driver-mobile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@Controller('driver-mobile')
export class DriverMobileController {
  constructor(private readonly svc: DriverMobileService) {}

  @Get()
  @ApiOperation({ summary: 'List all driver-mobile' })
  @HttpCacheTTL(300)
  findAll(@Query() q: PaginationDto) { return this.svc.findAll(q); }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver-mobile by ID' })
  @HttpCacheTTL(300)
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create driver-mobile' })
  @InvalidatesCache('driver-mobile')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Get('driver-home')
  @ApiOperation({ summary: 'Get Driver Home' })
  @HttpCacheTTL(300)
  getDriverHome() { return this.svc.getDriverHome(); }

  @Get('navigation')
  @ApiOperation({ summary: 'Get Navigation' })
  @HttpCacheTTL(300)
  getNavigation() { return this.svc.getNavigation(); }

  @Get('submit-checklist')
  @ApiOperation({ summary: 'Submit Checklist' })
  @HttpCacheTTL(300)
  submitChecklist() { return this.svc.submitChecklist(); }

  @Get('report-incident')
  @ApiOperation({ summary: 'Report Incident' })
  @HttpCacheTTL(300)
  reportIncident() { return this.svc.reportIncident(); }

  @Post('shift')
  @ApiOperation({ summary: 'Start Shift' })
  @InvalidatesCache('driver-mobile')
  startShift(@Body() dto: any) { return this.svc.startShift(dto); }

  @Get('end-shift')
  @ApiOperation({ summary: 'End Shift' })
  @HttpCacheTTL(300)
  endShift() { return this.svc.endShift(); }

}
