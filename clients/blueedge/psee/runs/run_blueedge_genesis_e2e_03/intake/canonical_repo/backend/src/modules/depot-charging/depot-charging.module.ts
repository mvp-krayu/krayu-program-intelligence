import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingDepot } from './entities/charging-depot.entity';
import { DepotChargingService } from './depot-charging.service';
import { DepotChargingController } from './depot-charging.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingDepot])],
  controllers: [DepotChargingController],
  providers: [DepotChargingService],
  exports: [DepotChargingService],
})
export class DepotChargingModule {}
