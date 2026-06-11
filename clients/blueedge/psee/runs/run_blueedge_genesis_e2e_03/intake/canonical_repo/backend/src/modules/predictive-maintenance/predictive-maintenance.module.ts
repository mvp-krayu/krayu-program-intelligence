import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictiveMaintenanceService } from './predictive-maintenance.service';
import { PredictiveMaintenanceController } from './predictive-maintenance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenancePrediction, MlModel, TelemetryFeature])],
  controllers: [PredictiveMaintenanceController],
  providers: [PredictiveMaintenanceService],
  exports: [PredictiveMaintenanceService],
})
export class PredictiveMaintenanceModule {}
