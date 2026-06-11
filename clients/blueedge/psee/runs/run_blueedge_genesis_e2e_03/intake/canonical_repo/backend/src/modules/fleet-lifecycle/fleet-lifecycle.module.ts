import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifecyclePlan } from './entities/lifecycle-plan.entity';
import { FleetLifecycleService } from './fleet-lifecycle.service';
import { FleetLifecycleController } from './fleet-lifecycle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LifecyclePlan])],
  controllers: [FleetLifecycleController],
  providers: [FleetLifecycleService],
  exports: [FleetLifecycleService],
})
export class FleetLifecycleModule {}
