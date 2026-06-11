import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncentiveProgram } from './entities/incentive-program.entity';
import { DriverIncentivesService } from './driver-incentives.service';
import { DriverIncentivesController } from './driver-incentives.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IncentiveProgram])],
  controllers: [DriverIncentivesController],
  providers: [DriverIncentivesService],
  exports: [DriverIncentivesService],
})
export class DriverIncentivesModule {}
