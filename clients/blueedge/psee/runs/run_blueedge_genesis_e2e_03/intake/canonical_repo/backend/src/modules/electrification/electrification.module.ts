import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectrificationPlan } from './entities/electrification-plan.entity';
import { ElectrificationService } from './electrification.service';
import { ElectrificationController } from './electrification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ElectrificationPlan])],
  controllers: [ElectrificationController],
  providers: [ElectrificationService],
  exports: [ElectrificationService],
})
export class ElectrificationModule {}
