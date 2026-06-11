import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalTwinService } from './digital-twin.service';
import { DigitalTwinController } from './digital-twin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DigitalTwin, TwinSimulation, TwinSnapshot])],
  controllers: [DigitalTwinController],
  providers: [DigitalTwinService],
  exports: [DigitalTwinService],
})
export class DigitalTwinModule {}
