import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, RequirePermissions, Permission } from '../../common/guards/roles.guard';
import { HttpCacheTTL, InvalidatesCache } from '../../common/cache';
import { PaginationDto } from '../../common/dto';
import { OtaService } from './ota.service';

@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiTags('ota') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Controller('ota')
export class OtaController {
  constructor(private svc: OtaService) {}

  @RequirePermissions(Permission.OTA_READ)
  @HttpCacheTTL(300)
  @Get('dashboard') @ApiOperation({ summary: 'OTA fleet dashboard' })
  getDashboard() { return this.svc.getDashboard(); }

  @RequirePermissions(Permission.OTA_READ)
  @HttpCacheTTL(300)
  @Get('firmware') @ApiOperation({ summary: 'List firmware versions' })
  getFirmware(@Query() q: PaginationDto) { return this.svc.getFirmwareVersions(q); }

  @RequirePermissions(Permission.OTA_READ)
  @HttpCacheTTL(300)
  @Get('campaigns') @ApiOperation({ summary: 'List deployment campaigns' })
  getCampaigns(@Query() q: PaginationDto) { return this.svc.getCampaigns(q); }

  @RequirePermissions(Permission.OTA_READ)
  @HttpCacheTTL(300)
  @Get('campaigns/:id') @ApiOperation({ summary: 'Campaign details with stage progress' })
  getCampaignDetails(@Param('id') id: string) { return this.svc.getCampaignDetails(id); }

  @RequirePermissions(Permission.OTA_READ)
  @HttpCacheTTL(300)
  @Get('devices/:deviceId/status') @ApiOperation({ summary: 'Device OTA deployment status' })
  getDeviceStatus(@Param('deviceId') id: string) { return this.svc.getDeploymentStatus(id); }

  @RequirePermissions(Permission.OTA_MANAGE)
  @InvalidatesCache('ota')
  @Post('firmware') @ApiOperation({ summary: 'Upload new firmware version' })
  uploadFirmware(@Body() body: any) { return this.svc.uploadFirmware(body); }

  @RequirePermissions(Permission.OTA_MANAGE)
  @InvalidatesCache('ota')
  @Post('campaigns') @ApiOperation({ summary: 'Create deployment campaign' })
  createCampaign(@Body() body: any) { return this.svc.createCampaign(body); }

  @RequirePermissions(Permission.OTA_MANAGE)
  @InvalidatesCache('ota')
  @Post('campaigns/:id/pause') @ApiOperation({ summary: 'Pause active campaign' })
  pauseCampaign(@Param('id') id: string) { return this.svc.pauseCampaign(id); }

  @RequirePermissions(Permission.OTA_MANAGE)
  @InvalidatesCache('ota')
  @Post('devices/:deviceId/rollback') @ApiOperation({ summary: 'Rollback device firmware' })
  rollback(@Param('deviceId') id: string) { return this.svc.rollbackDevice(id); }
}
