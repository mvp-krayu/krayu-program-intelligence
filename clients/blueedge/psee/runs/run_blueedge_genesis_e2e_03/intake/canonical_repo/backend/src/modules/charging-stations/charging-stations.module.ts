import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { ChargingStationsService } from './charging-stations.service';
import { ChargingStationsController } from './charging-stations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingStation])],
  controllers: [ChargingStationsController],
  providers: [ChargingStationsService],
  exports: [ChargingStationsService],
})
export class ChargingStationsModule {}
