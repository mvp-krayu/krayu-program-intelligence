import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { HasiService } from './hasi.service';
import { IngestCaptureDto, MitigateThreatDto, DeployFirewallRuleDto, HasiCaptureQueryDto, HasiThreatQueryDto } from './dto';

@ApiTags('HASI — Network Traffic Intelligence & Fleet SOC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/hasi')
export class HasiController {
  constructor(private readonly svc: HasiService) {}

  // ── Capture Ingestion (2 endpoints) ──────────────────────────
  @Post('captures/ingest')
  @ApiOperation({ summary: 'Ingest HASI capture report from SVG device (called by HASI agent on Yocto)' })
  @ApiResponse({ status: 201, description: 'Returns captureId and ingestion counts for packets, threats, and rules' })
  ingestCapture(@Body() dto: IngestCaptureDto) { return this.svc.ingestCapture(dto); }

  @Get('captures')
  @ApiOperation({ summary: 'List HASI captures with filtering by device and time range' })
  getCaptures(@Query() query: HasiCaptureQueryDto) { return this.svc.getCaptures(query); }

  @Get('captures/:id')
  @ApiOperation({ summary: 'Get HASI capture details with protocol summary and AI analysis' })
  getCapture(@Param('id') id: string) { return this.svc.getCapture(id); }

  // ── Threats (4 endpoints) ────────────────────────────────────
  @Get('threats')
  @ApiOperation({ summary: 'List threats fleet-wide with filtering by severity, category, device, status' })
  getThreats(@Query() query: HasiThreatQueryDto) { return this.svc.getThreats(query); }

  @Get('captures/:captureId/threats')
  @ApiOperation({ summary: 'List threats from a specific capture' })
  getCaptureThreats(@Param('captureId') captureId: string) { return this.svc.getCaptureThreats(captureId); }

  @Post('threats/:threatId/mitigate')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ summary: 'Mitigate a threat with action description' })
  mitigateThreat(@Param('threatId') threatId: string, @Body() dto: MitigateThreatDto, @Req() req: any) {
    return this.svc.mitigateThreat(threatId, dto, req.user?.id);
  }

  // ── Firewall Rules (3 endpoints) ─────────────────────────────
  @Get('firewall-rules')
  @ApiOperation({ summary: 'List HASI-generated firewall rules (iptables, Cisco ACL, Palo Alto, Fortinet)' })
  getFirewallRules(@Query('status') status?: string, @Query('svgDeviceId') svgDeviceId?: string) {
    return this.svc.getFirewallRules(status, svgDeviceId);
  }

  @Post('firewall-rules/:ruleId/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Approve a proposed firewall rule' })
  approveRule(@Param('ruleId') ruleId: string, @Req() req: any) {
    return this.svc.approveFirewallRule(ruleId, req.user?.id);
  }

  @Post('firewall-rules/:ruleId/deploy')
  @Roles('admin', 'fleet_manager')
  @ApiOperation({ summary: 'Deploy firewall rule to device(s) or fleet-wide' })
  deployRule(@Param('ruleId') ruleId: string, @Body() dto: DeployFirewallRuleDto, @Req() req: any) {
    return this.svc.deployFirewallRule(ruleId, dto, req.user?.id);
  }

  // ── Fleet SOC Dashboard (2 endpoints) ────────────────────────
  @Get('fleet/security-overview')
  @ApiOperation({ summary: 'Fleet-wide security overview: threat counts, categories, risk scores, protocol distribution' })
  getFleetSecurityOverview() { return this.svc.getFleetSecurityOverview(); }

  @Get('device/:svgDeviceId/security-profile')
  @ApiOperation({ summary: 'Single device security profile: threats, captures, risk score, active rules' })
  getDeviceSecurityProfile(@Param('svgDeviceId') svgDeviceId: string) {
    return this.svc.getDeviceSecurityProfile(svgDeviceId);
  }
}
