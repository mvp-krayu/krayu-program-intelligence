import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Geofence } from './entities/geofence.entity';

@Injectable()
export class GeofenceService extends BaseCrudService<Geofence> {
  constructor(@InjectRepository(Geofence) repo: Repository<Geofence>) { super(repo); }
  async getEvents(query: any) { return success([{ vehicleId: 'v1', geofenceId: 'g1', type: 'entry', timestamp: new Date(), geofenceName: 'Jebel Ali Depot' }]); }
}
