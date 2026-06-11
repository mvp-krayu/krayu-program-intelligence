import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { ShipmentTracking } from './entities/shipment-tracking.entity';

@Injectable()
export class CustomerPortalService extends BaseCrudService<ShipmentTracking> {
  constructor(@InjectRepository(ShipmentTracking) repo: Repository<ShipmentTracking>) { super(repo); }
  async getCustomerDashboard(customerId: string) {
    return success({
      customer: { id: customerId, name: 'ENOC Distribution LLC', activeShipments: 5, completedThisMonth: 42, slaCompliance: 98.2 },
      activeShipments: [
        { id: 's1', shipmentNumber: 'SH-2026-04521', cargo: 'Diesel EN590', volume: '32,000 L', origin: 'JAFZA Terminal 4', destination: 'Port Rashid Depot', vehicle: 'DXB-7291', driver: 'Ahmed Al Rashid', status: 'in_transit', progress: 67, eta: '14:30', sla: { onTime: true, tempCompliant: true } },
        { id: 's2', shipmentNumber: 'SH-2026-04522', cargo: 'LPG (Propane)', volume: '18,500 L', origin: 'Jebel Ali Gas Plant', destination: 'Al Quoz Distribution', vehicle: 'DXB-4518', driver: 'Mohammed Al Farsi', status: 'in_transit', progress: 42, eta: '15:45', sla: { onTime: true, tempCompliant: true } },
      ],
      monthlyMetrics: { deliveries: 42, onTimePercent: 97.6, avgTransitHrs: 2.8, incidentsCount: 0, volume: '1,250,000 L' },
    });
  }
  async trackShipment(shipmentNumber: string) {
    return success({ shipmentNumber, status: 'in_transit', progress: 67, events: [
      { time: '08:15', event: 'Loaded at JAFZA Terminal 4', location: 'JAFZA' },
      { time: '08:45', event: 'Gate exit — customs cleared', location: 'JAFZA Gate 7' },
      { time: '09:30', event: 'In transit on Sheikh Zayed Rd', location: '25.1185°N, 55.2012°E' },
      { time: '10:15', event: 'ETA update: 14:30', location: 'Al Quoz area' },
    ], currentPosition: { lat: 25.1553, lng: 55.2255 }, eta: '14:30' });
  }
  async getSlaReport(customerId: string, period: string) {
    return success({ customerId, period, slaMetrics: { onTimeDelivery: 97.6, targetPercent: 95.0, temperatureCompliance: 99.1, documentAccuracy: 98.5, incidentRate: 0.0 }, penalties: { applicable: false, amountAed: 0 }, rating: 'A+' });
  }
  async getDocuments(shipmentId: string) {
    return success([
      { type: 'Bill of Lading', filename: 'BOL-2026-04521.pdf', uploadedAt: new Date(), status: 'verified' },
      { type: 'Safety Data Sheet', filename: 'SDS-Diesel-EN590.pdf', uploadedAt: new Date(), status: 'verified' },
      { type: 'Customs Declaration', filename: 'CD-2026-04521.pdf', uploadedAt: new Date(), status: 'verified' },
      { type: 'Delivery Receipt', filename: null, uploadedAt: null, status: 'pending' },
    ]);
  }
}
