import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { ExecutiveReport } from './entities/executive-report.entity';

@Injectable()
export class ExecutiveService extends BaseCrudService<ExecutiveReport> {
  constructor(@InjectRepository(ExecutiveReport) repo: Repository<ExecutiveReport>) { super(repo); }
  async getCeoDashboard() {
    return success({
      revenue: { today: 84500, mtd: 1845000, ytd: 22140000, currency: 'AED', trendPercent: 12.4 },
      fleet: { totalVehicles: 156, utilization: 87.5, availability: 92.1, onTimeDelivery: 96.8 },
      safety: { incidentRate: 0.8, complianceScore: 97.2, driverScore: 91.5, zeroIncidentDays: 18 },
      financial: { opex: 3250000, fuel: 1420000, maintenance: 580000, profitMargin: 22.8 },
      customers: { activeContracts: 42, satisfaction: 4.6, slaCompliance: 98.2, newThisMonth: 3 },
      alerts: { critical: 2, high: 5, pending: 8, resolvedToday: 14 },
    });
  }
  async getCtoDashboard() {
    return success({
      system: { apiUptime: 99.97, avgResponseMs: 42, errorRate: 0.02, activeConnections: 1245 },
      iot: { devicesOnline: 312, telemetryEventsHr: 45000, firmwareCompliance: 98.5, batteryAlerts: 3 },
      data: { storageUsedGb: 245, dailyIngestGb: 2.8, queryAvgMs: 18, replicationLag: '< 1s' },
      security: { failedLogins24h: 12, activeSessions: 89, certificatesExpiring: 2, lastPenTestDate: '2025-12-15' },
    });
  }
  async getBoardReport(period: string) {
    return success({ period, generatedAt: new Date(), sections: ['Executive Summary', 'Financial Performance', 'Fleet Operations', 'Safety & Compliance', 'Technology Infrastructure', 'Strategic Outlook'], status: 'ready', format: 'PDF', pages: 24, downloadUrl: `/api/v1/executive/reports/${period}/download` });
  }
  async getCrossFleetKpis() {
    return success({
      tanker: { vehicles: 48, revenue: 8500000, utilization: 91.2, compliance: 98.5, costPerKm: 4.85 },
      bus: { vehicles: 65, revenue: 6200000, utilization: 85.8, compliance: 97.1, costPerKm: 3.22 },
      taxi: { vehicles: 43, revenue: 7440000, utilization: 88.5, compliance: 96.8, costPerKm: 2.15 },
    });
  }
}
