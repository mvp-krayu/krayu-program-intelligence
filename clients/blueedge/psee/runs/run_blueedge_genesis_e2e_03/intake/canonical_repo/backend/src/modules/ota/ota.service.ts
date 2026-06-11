import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class OtaService extends BaseCrudService<OtaFirmware> {
  constructor(
    @InjectRepository(OtaFirmware) repo: Repository<OtaFirmware>,
    @InjectRepository(OtaDeployment) private deployRepo: Repository<OtaDeployment>,
    @InjectRepository(OtaCampaign) private campaignRepo: Repository<OtaCampaign>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      firmware: { totalVersions: 12, currentStable: '4.2.1', latestBeta: '4.3.0-beta.2' },
      fleet: { totalDevices: 847, upToDate: 792, pendingUpdate: 38, updating: 12, failed: 5 },
      activeCampaigns: 2,
      last24h: { deploymentsStarted: 45, completed: 41, failed: 3, rolledBack: 1 },
      avgUpdateTime: '12.5 min',
      successRate: 97.8,
    });
  }

  async getCampaigns(query: PaginationDto) {
    const campaigns = [
      { id: 'camp-001', name: 'SVG 4.2.1 Fleet Rollout', targetVersion: '4.2.1', strategy: 'staged', status: 'active', progress: 93.5, totalDevices: 847, completed: 792, failed: 5, startedAt: '2026-02-01' },
      { id: 'camp-002', name: 'Security Patch CVE-2026-1234', targetVersion: '4.2.1-patch1', strategy: 'emergency', status: 'completed', progress: 100, totalDevices: 847, completed: 847, failed: 0, startedAt: '2026-01-28' },
      { id: 'camp-003', name: 'Beta 4.3 Canary Test', targetVersion: '4.3.0-beta.2', strategy: 'canary', status: 'active', progress: 40, totalDevices: 20, completed: 8, failed: 0, startedAt: '2026-02-10' },
    ];
    return success(campaigns);
  }

  async getCampaignDetails(id: string) {
    return success({
      id, name: 'SVG 4.2.1 Fleet Rollout', targetVersion: '4.2.1', strategy: 'staged',
      stages: [
        { name: 'Canary (5%)', devices: 42, completed: 42, failed: 0, status: 'completed' },
        { name: 'Early Adopters (25%)', devices: 212, completed: 212, failed: 2, status: 'completed' },
        { name: 'General (70%)', devices: 593, completed: 538, failed: 3, status: 'in_progress' },
      ],
      failureThreshold: 10, currentFailureRate: 0.6,
      deployments: { pending: 52, downloading: 8, installing: 4, completed: 792, failed: 5, rolledBack: 1 },
    });
  }

  async getDeploymentStatus(deviceId: string) {
    return success({
      deviceId, currentVersion: '4.2.0', targetVersion: '4.2.1',
      status: 'downloading', progressPercent: 62,
      downloadSpeed: '245 KB/s', estimatedCompletion: '8 min',
      lastAttempt: new Date().toISOString(), retryCount: 0,
    });
  }

  async getFirmwareVersions(query: PaginationDto) {
    const versions = [
      { version: '4.2.1', channel: 'stable', status: 'released', releaseDate: '2026-02-01', packageSizeMB: 48, devicesRunning: 792, releaseNotes: 'Safety agent improvements, CAN bus optimization' },
      { version: '4.3.0-beta.2', channel: 'beta', status: 'testing', releaseDate: '2026-02-10', packageSizeMB: 52, devicesRunning: 8, releaseNotes: 'Edge SLM integration, V2X proto support' },
      { version: '4.2.0', channel: 'stable', status: 'deprecated', releaseDate: '2026-01-15', packageSizeMB: 47, devicesRunning: 38, releaseNotes: 'Baseline tanker safety update' },
    ];
    return success(versions);
  }

  async createCampaign(body: any) {
    return success({ id: 'camp-new', name: body.name, targetVersion: body.targetVersion, strategy: body.strategy, status: 'draft', totalDevices: body.deviceIds?.length || 0, createdAt: new Date() });
  }

  async pauseCampaign(id: string) {
    return success({ id, status: 'paused', pausedAt: new Date() });
  }

  async rollbackDevice(deviceId: string) {
    return success({ deviceId, status: 'rolling_back', fromVersion: '4.2.1', toVersion: '4.2.0', estimatedMinutes: 15 });
  }

  async uploadFirmware(body: any) {
    return success({ id: 'fw-new', version: body.version, channel: body.channel || 'beta', status: 'draft', checksumSha256: 'pending_upload' });
  }
}

// ─── Controller ───────────────────────────────────────────────
