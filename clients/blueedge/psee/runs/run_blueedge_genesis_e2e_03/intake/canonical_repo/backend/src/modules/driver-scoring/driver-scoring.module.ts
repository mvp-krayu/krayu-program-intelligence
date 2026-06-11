import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverScoringService } from './driver-scoring.service';
import { DriverScoringController } from './driver-scoring.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverScore, DrivingEvent, CoachingRecommendation])],
  controllers: [DriverScoringController],
  providers: [DriverScoringService],
  exports: [DriverScoringService],
})
export class DriverScoringModule {}
