import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadSegment } from './entities/road-segment.entity';
import { RoadIntelligenceService } from './road-intelligence.service';
import { RoadIntelligenceController } from './road-intelligence.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoadSegment])],
  controllers: [RoadIntelligenceController],
  providers: [RoadIntelligenceService],
  exports: [RoadIntelligenceService],
})
export class RoadIntelligenceModule {}
