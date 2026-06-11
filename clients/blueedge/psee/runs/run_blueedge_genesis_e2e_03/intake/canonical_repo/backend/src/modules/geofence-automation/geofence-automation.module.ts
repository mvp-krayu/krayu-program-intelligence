import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeofenceAutomationService } from './geofence-automation.service';
import { GeofenceAutomationController } from './geofence-automation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeofenceRule, GeofenceTrigger, GeofenceZone])],
  controllers: [GeofenceAutomationController],
  providers: [GeofenceAutomationService],
  exports: [GeofenceAutomationService],
})
export class GeofenceAutomationModule {}
