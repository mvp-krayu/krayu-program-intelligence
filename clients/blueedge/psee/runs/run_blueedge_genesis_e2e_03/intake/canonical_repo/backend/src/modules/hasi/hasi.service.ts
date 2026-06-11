import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HasiCapture } from './entities/hasi-capture.entity';
import { HasiThreat } from './entities/hasi-threat.entity';
import { HasiFirewallRule } from './entities/hasi-firewall-rule.entity';
import { FleetEventEmitterService } from '../../events/fleet-event-emitter.service';
import { IngestCaptureDto, MitigateThreatDto, DeployFirewallRuleDto, HasiCaptureQueryDto, HasiThreatQueryDto } from './dto';

@Injectable()
export class HasiService {
  private readonly logger = new Logger(HasiService.name);

  constructor(
    @InjectRepository(HasiCapture) private readonly captureRepo: Repository<HasiCapture>,
    @InjectRepository(HasiThreat) private readonly threatRepo: Repository<HasiThreat>,
    @InjectRepository(HasiFirewallRule) private readonly ruleRepo: Repository<HasiFirewallRule>,
    private readonly events: FleetEventEmitterService,
  ) {}

  // ══════════════════════════════════════════════════════════════
  // CAPTURE INGESTION (from SVG HASI agent)
  // ══════════════════════════════════════════════════════════════

  async ingestCapture(dto: IngestCaptureDto) {
    // 1. Save capture record
    const capture = this.captureRepo.create({
      svgDeviceId: dto.svgDeviceId, svgHardwareId: dto.svgHardwareId, vehicleId: dto.vehicleId,
      hasiCaptureId: dto.hasiCaptureId, filename: dto.filename, fileSizeBytes: dto.fileSizeBytes,
      fileHashSha256: dto.fileHashSha256, status: 'analyzed',
      totalPackets: dto.totalPackets, captureDurationSec: dto.captureDurationSec,
      captureStartTime: dto.captureStartTime ? new Date(dto.captureStartTime) : null,
      captureEndTime: dto.captureEndTime ? new Date(dto.captureEndTime) : null,
      uniqueSources: dto.uniqueSources, uniqueDestinations: dto.uniqueDestinations, totalFlows: dto.totalFlows,
      protocolSummary: dto.protocolSummary, protocolClassification: dto.protocolClassification,
      totalBytesIn: dto.totalBytesIn, totalBytesOut: dto.totalBytesOut,
      topSources: dto.topSources, topDestinations: dto.topDestinations, topPorts: dto.topPorts,
      captureMode: dto.captureMode as any || 'continuous', captureScope: dto.captureScope as any || 'all',
      latitude: dto.latitude, longitude: dto.longitude, analyzedAt: new Date(),
      aiAnalyzed: dto.aiAnalyzed || false, aiSummary: dto.aiSummary, aiRecommendations: dto.aiRecommendations,
      threatCount: dto.threats?.length || 0,
    });
    const savedCapture = await this.captureRepo.save(capture);

    // 2. Save threats
    let savedThreats = 0;
    if (dto.threats?.length) {
      for (const t of dto.threats) {
        const threat = this.threatRepo.create({
          captureId: savedCapture.id, svgDeviceId: dto.svgDeviceId, svgHardwareId: dto.svgHardwareId,
          threatCategory: t.threatCategory as any, severity: t.severity as any, status: 'active',
          confidenceScore: t.confidenceScore, description: t.description, detailedAnalysis: t.detailedAnalysis,
          indicatorType: t.indicatorType, indicatorValue: t.indicatorValue,
          sourceIp: t.sourceIp, sourcePort: t.sourcePort, destinationIp: t.destinationIp, destinationPort: t.destinationPort,
          protocol: t.protocol, packetCount: t.packetCount, byteCount: t.byteCount,
          networkZone: t.networkZone as any || 'vehicle_network',
          recommendedActions: t.recommendedActions, mitreTacticId: t.mitreTacticId, mitreTechniqueId: t.mitreTechniqueId,
          latitude: dto.latitude, longitude: dto.longitude,
          detectedAt: t.detectedAt ? new Date(t.detectedAt) : new Date(),
        });
        await this.threatRepo.save(threat);
        savedThreats++;

        if (t.severity === 'critical' || t.severity === 'high') {
          this.events.emit('hasi.threat.detected', {
            captureId: savedCapture.id, svgDeviceId: dto.svgDeviceId, svgHardwareId: dto.svgHardwareId,
            category: t.threatCategory, severity: t.severity, description: t.description,
          });
        }
      }
    }

    // 3. Save firewall rules
    let savedRules = 0;
    if (dto.firewallRules?.length) {
      for (const r of dto.firewallRules) {
        await this.ruleRepo.save(this.ruleRepo.create({
          captureId: savedCapture.id, svgDeviceId: dto.svgDeviceId,
          action: r.action as any, direction: r.direction as any, protocol: r.protocol,
          sourceIp: r.sourceIp, destinationIp: r.destinationIp, destinationPort: r.destinationPort,
          description: r.description, severity: r.severity as any, status: 'proposed',
          iptablesRule: r.iptablesRule, ciscoAcl: r.ciscoAcl, paloAltoRule: r.paloAltoRule,
          fortinetRule: r.fortinetRule, vendorNeutralRule: r.vendorNeutralRule,
        }));
        savedRules++;
      }
    }

    this.events.emit('hasi.capture.ingested', {
      captureId: savedCapture.id, svgDeviceId: dto.svgDeviceId,
      packets: dto.totalPackets, threats: savedThreats, rules: savedRules,
    });
    this.logger.log(`HASI capture ingested from ${dto.svgHardwareId}: ${dto.totalPackets} packets, ${savedThreats} threats, ${savedRules} rules`);

    return { captureId: savedCapture.id, ingested: { packets: dto.totalPackets, threats: savedThreats, firewallRules: savedRules } };
  }

  // ══════════════════════════════════════════════════════════════
  // CAPTURES
  // ══════════════════════════════════════════════════════════════

  async getCaptures(query: HasiCaptureQueryDto) {
    const { svgDeviceId, from, to, page = 1, limit = 25 } = query;
    const qb = this.captureRepo.createQueryBuilder('c');
    if (svgDeviceId) qb.andWhere('c.svgDeviceId = :svgDeviceId', { svgDeviceId });
    if (from) qb.andWhere('c.createdAt >= :from', { from: new Date(from) });
    if (to) qb.andWhere('c.createdAt <= :to', { to: new Date(to) });
    qb.orderBy('c.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getCapture(id: string) {
    const capture = await this.captureRepo.findOne({ where: { id } });
    if (!capture) throw new NotFoundException(`HASI Capture ${id} not found`);
    return capture;
  }

  // ══════════════════════════════════════════════════════════════
  // THREATS
  // ══════════════════════════════════════════════════════════════

  async getThreats(query: HasiThreatQueryDto) {
    const { svgDeviceId, severity, threatCategory, status, networkZone, from, to, page = 1, limit = 25 } = query;
    const qb = this.threatRepo.createQueryBuilder('t');
    if (svgDeviceId) qb.andWhere('t.svgDeviceId = :svgDeviceId', { svgDeviceId });
    if (severity) qb.andWhere('t.severity = :severity', { severity });
    if (threatCategory) qb.andWhere('t.threatCategory = :threatCategory', { threatCategory });
    if (status) qb.andWhere('t.status = :status', { status });
    if (networkZone) qb.andWhere('t.networkZone = :networkZone', { networkZone });
    if (from) qb.andWhere('t.detectedAt >= :from', { from: new Date(from) });
    if (to) qb.andWhere('t.detectedAt <= :to', { to: new Date(to) });
    qb.orderBy('t.detectedAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async mitigateThreat(threatId: string, dto: MitigateThreatDto, userId: string) {
    const threat = await this.threatRepo.findOne({ where: { id: threatId } });
    if (!threat) throw new NotFoundException(`Threat ${threatId} not found`);
    threat.status = 'mitigated'; threat.mitigationAction = dto.mitigationAction;
    threat.mitigatedAt = new Date(); threat.mitigatedBy = userId;
    threat.resolutionNotes = dto.notes;
    const saved = await this.threatRepo.save(threat);
    this.events.emit('hasi.threat.mitigated', { threatId, svgDeviceId: threat.svgDeviceId, action: dto.mitigationAction });
    return saved;
  }

  async getCaptureThreats(captureId: string) {
    return this.threatRepo.find({ where: { captureId }, order: { severity: 'ASC', detectedAt: 'DESC' } });
  }

  // ══════════════════════════════════════════════════════════════
  // FIREWALL RULES
  // ══════════════════════════════════════════════════════════════

  async getFirewallRules(status?: string, svgDeviceId?: string) {
    const qb = this.ruleRepo.createQueryBuilder('r');
    if (status) qb.andWhere('r.status = :status', { status });
    if (svgDeviceId) qb.andWhere('r.svgDeviceId = :svgDeviceId', { svgDeviceId });
    qb.orderBy('r.createdAt', 'DESC');
    return qb.getMany();
  }

  async approveFirewallRule(ruleId: string, userId: string) {
    const rule = await this.ruleRepo.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException(`Firewall rule ${ruleId} not found`);
    rule.status = 'approved'; rule.approvedBy = userId; rule.approvedAt = new Date();
    return this.ruleRepo.save(rule);
  }

  async deployFirewallRule(ruleId: string, dto: DeployFirewallRuleDto, userId: string) {
    const rule = await this.ruleRepo.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException(`Firewall rule ${ruleId} not found`);
    rule.status = 'deployed'; rule.deployedAt = new Date();
    rule.fleetWide = dto.fleetWide || false;
    if (dto.deviceIds) { rule.deployedToDevices = dto.deviceIds; rule.deployedCount = dto.deviceIds.length; }
    if (dto.expiresAt) rule.expiresAt = new Date(dto.expiresAt);
    const saved = await this.ruleRepo.save(rule);
    this.events.emit('hasi.firewall.deployed', { ruleId, fleetWide: rule.fleetWide, deviceCount: rule.deployedCount });
    return saved;
  }

  // ══════════════════════════════════════════════════════════════
  // FLEET SOC DASHBOARD ANALYTICS
  // ══════════════════════════════════════════════════════════════

  async getFleetSecurityOverview() {
    const totalCaptures = await this.captureRepo.count();
    const totalThreats = await this.threatRepo.count();
    const activeThreats = await this.threatRepo.count({ where: { status: 'active' } });
    const criticalThreats = await this.threatRepo.query(`SELECT COUNT(*) as count FROM hasi_threats WHERE severity = 'critical' AND status = 'active'`);
    const proposedRules = await this.ruleRepo.count({ where: { status: 'proposed' } });
    const deployedRules = await this.ruleRepo.count({ where: { status: 'deployed' } });

    const threatsByCategory = await this.threatRepo.query(`SELECT "threatCategory", COUNT(*) as count FROM hasi_threats GROUP BY "threatCategory" ORDER BY count DESC LIMIT 15`);
    const threatsBySeverity = await this.threatRepo.query(`SELECT severity, COUNT(*) as count FROM hasi_threats GROUP BY severity`);
    const threatsByDevice = await this.threatRepo.query(`SELECT "svgHardwareId", COUNT(*) as count FROM hasi_threats WHERE status = 'active' GROUP BY "svgHardwareId" ORDER BY count DESC LIMIT 10`);
    const protocolsFleetWide = await this.captureRepo.query(`SELECT "protocolSummary" FROM hasi_captures ORDER BY "createdAt" DESC LIMIT 100`);
    const threatsTimeline = await this.threatRepo.query(`SELECT DATE_TRUNC('hour', "detectedAt") as hour, severity, COUNT(*) as count FROM hasi_threats WHERE "detectedAt" > NOW() - INTERVAL '24 hours' GROUP BY hour, severity ORDER BY hour`);

    // Aggregate protocol summary across fleet
    const fleetProtocols: Record<string, number> = {};
    for (const row of protocolsFleetWide) {
      if (row.protocolSummary) {
        for (const [proto, count] of Object.entries(row.protocolSummary)) {
          fleetProtocols[proto] = (fleetProtocols[proto] || 0) + (count as number);
        }
      }
    }

    return {
      totalCaptures, totalThreats, activeThreats, criticalThreats: criticalThreats[0]?.count || 0,
      proposedRules, deployedRules,
      threatsByCategory, threatsBySeverity, threatsByDevice, fleetProtocols, threatsTimeline,
    };
  }

  async getDeviceSecurityProfile(svgDeviceId: string) {
    const captures = await this.captureRepo.count({ where: { svgDeviceId } });
    const threats = await this.threatRepo.find({ where: { svgDeviceId }, order: { detectedAt: 'DESC' }, take: 50 });
    const activeThreats = threats.filter(t => t.status === 'active');
    const rules = await this.ruleRepo.find({ where: { svgDeviceId }, order: { createdAt: 'DESC' } });
    const lastCapture = await this.captureRepo.findOne({ where: { svgDeviceId }, order: { createdAt: 'DESC' } });
    return {
      svgDeviceId, totalCaptures: captures, totalThreats: threats.length,
      activeThreats: activeThreats.length, recentThreats: threats.slice(0, 10),
      firewallRules: rules, lastCapture, riskScore: this.calculateRiskScore(threats),
    };
  }

  private calculateRiskScore(threats: HasiThreat[]): number {
    const active = threats.filter(t => t.status === 'active');
    let score = 0;
    for (const t of active) {
      score += t.severity === 'critical' ? 30 : t.severity === 'high' ? 15 : t.severity === 'medium' ? 5 : 1;
    }
    return Math.min(100, score);
  }
}
