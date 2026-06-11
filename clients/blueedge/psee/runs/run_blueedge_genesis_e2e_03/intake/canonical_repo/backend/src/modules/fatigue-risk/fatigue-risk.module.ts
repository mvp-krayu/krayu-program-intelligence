import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FatigueAssessment } from './entities/fatigue-assessment.entity';
import { FatigueRiskService } from './fatigue-risk.service';
import { FatigueRiskController } from './fatigue-risk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FatigueAssessment])],
  controllers: [FatigueRiskController],
  providers: [FatigueRiskService],
  exports: [FatigueRiskService],
})
export class FatigueRiskModule {}
