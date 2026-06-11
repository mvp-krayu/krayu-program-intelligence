import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geofence } from './entities/geofence.entity';
import { GeofenceService } from './operations.service';
import { OperationsController } from './operations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Geofence])],
  controllers: [OperationsController],
  providers: [GeofenceService],
  exports: [GeofenceService],
})
export class OperationsModule {}
