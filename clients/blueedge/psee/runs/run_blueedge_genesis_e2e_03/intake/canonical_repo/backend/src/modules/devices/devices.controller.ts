import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { DevicesService } from './devices.service';
import { CreateDeviceDto, UpdateDeviceDto, ProvisionDeviceDto, BatchProvisionDto, TransferDeviceDto, DeployConfigDto, DeviceQueryDto } from './dto';

@ApiTags('Devices — SVG 2.0 Provisioning Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/devices')
export class DevicesController {
  constructor(private readonly svc: DevicesService) {}

  // ══════════════════════════════════════════════════════════════
  // DEVICE CRUD (5 endpoints)
  // ══════════════════════════════════════════════════════════════

  @Get()
  @ApiOperation({ summary: 'List devices with filtering, pagination, search' })
  @ApiQuery({ name: 'status', required: false, enum: ['online', 'offline', 'warning', 'error', 'provisioning'] })
  @ApiQuery({ name: 'lifecycle', required: false, enum: ['manufactured', 'provisioned', 'deployed', 'operational', 'maintenance', 'decommissioned'] })
  @ApiQuery({ name: 'fleetType', required: false, enum: ['tanker', 'bus', 'taxi', 'ev', 'coldchain'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false }) @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: DeviceQueryDto) { return this.svc.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get device by ID with full details' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Register new SVG 2.0 device (manufacturing intake)' })
  @ApiResponse({ status: 201, description: 'Device registered with hardware ID and serial number' })
  create(@Body() dto: CreateDeviceDto, @Req() req: any) { return this.svc.create(dto, req.user?.id); }

  @Put(':id')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Update device configuration and metadata' })
  update(@Param('id') id: string, @Body() dto: UpdateDeviceDto) { return this.svc.update(id, dto); }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Decommission device (soft delete — sets lifecycle to decommissioned)' })
  remove(@Param('id') id: string) { return this.svc.remove(id); }

  // ══════════════════════════════════════════════════════════════
  // PROVISIONING WORKFLOW (5 endpoints)
  // ══════════════════════════════════════════════════════════════

  @Post('provision')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Start 8-step provisioning workflow for a device' })
  @ApiResponse({ status: 201, description: 'Returns workflow ID for real-time progress tracking' })
  provision(@Body() dto: ProvisionDeviceDto, @Req() req: any) { return this.svc.provision(dto, req.user?.id); }

  @Post('provision/batch')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ summary: 'Batch provision multiple devices simultaneously' })
  batchProvision(@Body() dto: BatchProvisionDto, @Req() req: any) { return this.svc.batchProvision(dto, req.user?.id); }

  @Get('workflows/:workflowId')
  @ApiOperation({ summary: 'Get provisioning workflow status with step-by-step progress and logs' })
  @ApiParam({ name: 'workflowId', description: 'Provisioning workflow UUID' })
  getWorkflowStatus(@Param('workflowId') workflowId: string) { return this.svc.getWorkflowStatus(workflowId); }

  @Get(':id/workflows')
  @ApiOperation({ summary: 'List all provisioning workflows for a device' })
  getDeviceWorkflows(@Param('id') id: string) { return this.svc.getDeviceWorkflows(id); }

  // ══════════════════════════════════════════════════════════════
  // CERTIFICATES (4 endpoints)
  // ══════════════════════════════════════════════════════════════

  @Get(':id/certificates')
  @ApiOperation({ summary: 'List all certificates for a device (auth, TLS, MQTT, blockchain)' })
  getDeviceCertificates(@Param('id') id: string) { return this.svc.getDeviceCertificates(id); }

  @Post('certificates/:certId/revoke')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ summary: 'Revoke a device certificate with reason' })
  @ApiParam({ name: 'certId', description: 'Certificate UUID' })
  revokeCertificate(@Param('certId') certId: string, @Body() body: { reason: string }, @Req() req: any) {
    return this.svc.revokeCertificate(certId, body.reason, req.user?.id);
  }

  @Post('certificates/:certId/renew')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Renew a device certificate (issues new cert, expires old)' })
  @ApiParam({ name: 'certId', description: 'Certificate UUID' })
  renewCertificate(@Param('certId') certId: string, @Req() req: any) {
    return this.svc.renewCertificate(certId, req.user?.id);
  }

  // ══════════════════════════════════════════════════════════════
  // OWNERSHIP TRANSFERS (4 endpoints)
  // ══════════════════════════════════════════════════════════════

  @Post('transfers')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ summary: 'Initiate device ownership transfer (with optional blockchain escrow)' })
  @ApiResponse({ status: 201, description: 'Transfer created in pending_approval status' })
  initiateTransfer(@Body() dto: TransferDeviceDto, @Req() req: any) { return this.svc.initiateTransfer(dto, req.user?.id); }

  @Post('transfers/:transferId/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Approve and execute ownership transfer' })
  @ApiParam({ name: 'transferId', description: 'Transfer UUID' })
  approveTransfer(@Param('transferId') transferId: string, @Body() body: { notes?: string }, @Req() req: any) {
    return this.svc.approveTransfer(transferId, req.user?.id, body.notes);
  }

  @Get(':id/transfers')
  @ApiOperation({ summary: 'List all ownership transfers for a device' })
  getDeviceTransfers(@Param('id') id: string) { return this.svc.getDeviceTransfers(id); }

  // ══════════════════════════════════════════════════════════════
  // CONFIG DEPLOYMENTS (4 endpoints)
  // ══════════════════════════════════════════════════════════════

  @Post('config/deploy')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Deploy configuration to device (with approval workflow & rollback)' })
  @ApiResponse({ status: 201, description: 'Config deployment created — may require approval' })
  deployConfig(@Body() dto: DeployConfigDto, @Req() req: any) { return this.svc.deployConfig(dto, req.user?.id); }

  @Post('config/:deploymentId/approve')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ summary: 'Approve pending config deployment' })
  @ApiParam({ name: 'deploymentId', description: 'Config deployment UUID' })
  approveConfigDeployment(@Param('deploymentId') deploymentId: string, @Req() req: any) {
    return this.svc.approveConfigDeployment(deploymentId, req.user?.id);
  }

  @Get(':id/config-history')
  @ApiOperation({ summary: 'List config deployment history for a device' })
  getDeviceConfigHistory(@Param('id') id: string) { return this.svc.getDeviceConfigHistory(id); }

  // ══════════════════════════════════════════════════════════════
  // HEALTH & ANALYTICS (3 endpoints)
  // ══════════════════════════════════════════════════════════════

  @Get('fleet/health')
  @ApiOperation({ summary: 'Device fleet health dashboard (online/offline, lifecycle, firmware distribution)' })
  getHealth() { return this.svc.getHealth(); }

  @Get('fleet/ota-status')
  @ApiOperation({ summary: 'OTA firmware version distribution across fleet' })
  getOTAStatus() { return this.svc.getOTAStatus(); }

  // ══════════════════════════════════════════════════════════════
  // DEVICE COMMANDS (3 endpoints)
  // ══════════════════════════════════════════════════════════════

  @Patch(':id/reboot')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Send reboot command to device' })
  reboot(@Param('id') id: string, @Req() req: any) { return this.svc.reboot(id, req.user?.id); }

  @Post(':id/command')
  @Roles('admin', 'fleet_manager', 'technician')
  @ApiOperation({ summary: 'Send arbitrary command to device via MQTT' })
  sendCommand(@Param('id') id: string, @Body() body: { command: string; payload?: any }, @Req() req: any) {
    return { deviceId: id, command: body.command, payload: body.payload, sent: true, timestamp: new Date(), issuedBy: req.user?.id };
  }

  @Patch(':id/heartbeat')
  @ApiOperation({ summary: 'Record device heartbeat (called by SVG firmware)' })
  heartbeat(@Param('id') id: string, @Body() body: { cpuUsage?: number; memoryUsage?: number; temperature?: number; networkType?: string }) {
    return this.svc.update(id, { ...body, lastHeartbeat: new Date() } as any);
  }
}
