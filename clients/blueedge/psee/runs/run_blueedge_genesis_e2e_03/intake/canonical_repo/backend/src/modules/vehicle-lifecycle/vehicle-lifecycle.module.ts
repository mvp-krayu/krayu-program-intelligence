import { Module } from '@nestjs/common';
import { VehicleLifecycleService } from './vehicle-lifecycle.service';
import { VehicleLifecycleController } from './vehicle-lifecycle.controller';
import { DriverSessionsModule } from '../driver-sessions/driver-sessions.module';

@Module({
  imports: [DriverSessionsModule],
  controllers: [VehicleLifecycleController],
  providers: [VehicleLifecycleService],
  exports: [VehicleLifecycleService],
})
export class VehicleLifecycleModule {}
