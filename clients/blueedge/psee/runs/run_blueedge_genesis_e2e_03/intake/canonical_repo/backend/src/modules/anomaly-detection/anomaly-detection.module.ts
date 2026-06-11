import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anomaly } from './entities/anomaly.entity';
import { AnomalyDetectionService } from './anomaly-detection.service';
import { AnomalyDetectionController } from './anomaly-detection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Anomaly])],
  controllers: [AnomalyDetectionController],
  providers: [AnomalyDetectionService],
  exports: [AnomalyDetectionService],
})
export class AnomalyDetectionModule {}
