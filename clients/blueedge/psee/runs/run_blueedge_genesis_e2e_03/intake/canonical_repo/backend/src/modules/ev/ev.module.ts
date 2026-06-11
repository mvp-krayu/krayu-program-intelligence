import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvService } from './ev.service';
import { EvController } from './ev.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EvVehicle, EvChargingSession])],
  controllers: [EvController],
  providers: [EvService],
  exports: [EvService],
})
export class EvModule {}
