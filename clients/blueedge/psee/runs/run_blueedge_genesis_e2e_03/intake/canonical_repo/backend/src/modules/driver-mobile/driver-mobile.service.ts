import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { DriverSession } from './entities/driver-session.entity';

@Injectable()
export class DriverMobileService extends BaseCrudService<DriverSession> {
  constructor(@InjectRepository(DriverSession) repo: Repository<DriverSession>) { super(repo); }
  async getDriverHome(driverId: string) {
    return success({
      driver: { id: driverId, name: 'Ahmed Al Rashid', vehicle: 'DXB-7291', type: 'tanker', status: 'on_duty', shift: '06:00-14:00', hosDriving: 5.2, hosRemaining: 2.8 },
      currentTrip: { id: 't1', origin: 'JAFZA Terminal 4', destination: 'Port Rashid', cargo: 'Diesel EN590', progress: 67, etaMin: 22 },
      todayStats: { trips: 3, distanceKm: 145, earnings: 580, rating: 4.9, fuelUsedL: 42 },
      notifications: [
        { type: 'alert', message: 'Speed advisory: Slow zone ahead on Sheikh Zayed Rd', time: '2 min ago' },
        { type: 'info', message: 'Fuel stop available at ENOC Al Quoz — 1.2km', time: '5 min ago' },
      ],
    });
  }
  async getNavigation(driverId: string) {
    return success({ driverId, activeRoute: { origin: { lat: 25.0657, lng: 55.1713 }, dest: { lat: 25.2630, lng: 55.3088 }, waypoints: 3, distanceKm: 28.5, etaMin: 35, trafficLevel: 'moderate', nextTurn: { instruction: 'Turn right onto E11', distanceM: 450 } } });
  }
  async submitChecklist(driverId: string, checklist: any) {
    return success({ driverId, checklistId: `CL-${Date.now()}`, status: 'submitted', submittedAt: new Date(), items: checklist });
  }
  async reportIncident(driverId: string, incident: any) {
    return success({ incidentId: `INC-${Date.now()}`, driverId, status: 'reported', reportedAt: new Date(), ...incident });
  }
  async startShift(driverId: string) {
    return success({ driverId, shiftId: `SH-${Date.now()}`, startedAt: new Date(), status: 'active' });
  }
  async endShift(driverId: string) {
    return success({ driverId, endedAt: new Date(), status: 'completed', summary: { trips: 5, distanceKm: 220, durationHrs: 7.5, earnings: 890 } });
  }
}
