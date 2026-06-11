import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripsService extends BaseCrudService<Trip> {
  constructor(@InjectRepository(Trip) repo: Repository<Trip>) { super(repo); }
  async getActive() { return success(await this.repo.find({ where: { status: 'in_progress' }, order: { startTime: 'DESC' } })); }
  async getTimeline(id: string) { return success({ tripId: id, events: [{ type: 'start', time: new Date(Date.now() - 3600000), location: 'Jebel Ali Terminal' }, { type: 'geofence_exit', time: new Date(Date.now() - 3000000), location: 'Jebel Ali Zone' }, { type: 'current', time: new Date(), location: 'Sheikh Zayed Road' }] }); }
  async getStats(query: { startDate?: string; endDate?: string }) { return success({ totalTrips: 1250, completed: 1180, inProgress: 42, avgDistanceKm: 85.3, avgDurationMin: 67, totalFuelL: 45000, avgScore: 88.5 }); }
}
