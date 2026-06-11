import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusRoute } from './entities/bus-route.entity';
import { BusStop } from './entities/bus-stop.entity';
import { BusSchedule } from './entities/bus-schedule.entity';
import { BusPassengerCount } from './entities/bus-passenger-count.entity';
import { BusDispatch } from './entities/bus-dispatch.entity';
import { BusService, StopService, ScheduleService, PassengerAnalyticsService, DispatchService, FareService } from './bus.service';
import { BusController } from './bus.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusRoute, BusStop, BusSchedule, BusPassengerCount, BusDispatch])],
  controllers: [BusController],
  providers: [BusService, StopService, ScheduleService, PassengerAnalyticsService, DispatchService, FareService],
  exports: [BusService, StopService, ScheduleService, PassengerAnalyticsService, DispatchService, FareService],
})
export class BusModule {}
