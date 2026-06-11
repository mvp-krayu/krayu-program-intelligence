import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverSessionBlock } from './entities/driver-session-block.entity';
import { DriverSessionsService } from './driver-sessions.service';
import { DriverSessionsController } from './driver-sessions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverSessionBlock])],
  controllers: [DriverSessionsController],
  providers: [DriverSessionsService],
  exports: [DriverSessionsService],
})
export class DriverSessionsModule {}
