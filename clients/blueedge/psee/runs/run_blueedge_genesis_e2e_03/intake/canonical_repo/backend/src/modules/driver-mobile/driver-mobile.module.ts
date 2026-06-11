import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverSession } from './entities/driver-session.entity';
import { DriverMobileService } from './driver-mobile.service';
import { DriverMobileController } from './driver-mobile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverSession])],
  controllers: [DriverMobileController],
  providers: [DriverMobileService],
  exports: [DriverMobileService],
})
export class DriverMobileModule {}
