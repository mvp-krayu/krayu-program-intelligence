import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { BorderRegulation } from './entities/border-regulation.entity';

@Injectable()
export class CrossBorderService extends BaseCrudService<BorderRegulation> {
  constructor(@InjectRepository(BorderRegulation) repo: Repository<BorderRegulation>) { super(repo); }
  async getRegulationsByCountry(country: string) {
    const regs = {
      UAE: [
        { id: 'r1', type: 'HAZMAT Transport', authority: 'NCEMA / RTA Dubai', requirements: ['ADR certification', 'HAZMAT driver license', 'Emergency response plan', 'GPS tracking mandatory'], status: 'active' },
        { id: 'r2', type: 'Vehicle Registration', authority: 'RTA Dubai', requirements: ['Annual technical inspection', 'Insurance (Comprehensive)', 'Emirates ID for driver'], status: 'active' },
        { id: 'r3', type: 'Fuel Transport', authority: 'ENOC / ADNOC', requirements: ['Product quality certificate', 'Bill of lading', 'Customs clearance'], status: 'active' },
      ],
      KSA: [
        { id: 'r4', type: 'Cross-Border Entry', authority: 'Saudi Customs', requirements: ['TIR Carnet', 'Saudi visa for driver', 'Vehicle import permit', 'SASO conformity'], status: 'active' },
        { id: 'r5', type: 'HAZMAT Transport', authority: 'GDCD', requirements: ['GDCD permit', 'Arabic safety data sheets', 'Saudi emergency number'], status: 'active' },
      ],
      Oman: [
        { id: 'r6', type: 'Cross-Border Entry', authority: 'Royal Oman Police', requirements: ['Entry visa', 'Vehicle insurance extension', 'Customs declaration'], status: 'active' },
      ],
    };
    return success(regs[country] || []);
  }
  async getComplianceMatrix() {
    return success({
      countries: ['UAE', 'KSA', 'Oman', 'Bahrain', 'Kuwait', 'Qatar'],
      fleetCompliance: { UAE: 98.5, KSA: 94.2, Oman: 96.1, Bahrain: 93.8, Kuwait: 95.5, Qatar: 97.2 },
      expiringPermits: { UAE: 2, KSA: 5, Oman: 1, Bahrain: 0, Kuwait: 3, Qatar: 1 },
      activeVehicles: { UAE: 156, KSA: 12, Oman: 8, Bahrain: 3, Kuwait: 5, Qatar: 4 },
    });
  }
  async getRoutePlanning(origin: string, destination: string) {
    return success({ origin, destination, crossings: [{ border: 'UAE-Oman (Al Ain/Hatta)', documentsRequired: 8, estimatedWaitMin: 45, status: 'open' }], totalDocuments: 12, estimatedClearanceHrs: 2.5, requiredPermits: ['Transit permit', 'HAZMAT clearance', 'Customs declaration'] });
  }
}
