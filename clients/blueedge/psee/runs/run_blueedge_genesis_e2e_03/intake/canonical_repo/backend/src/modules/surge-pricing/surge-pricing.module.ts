import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeZone } from './entities/surge-zone.entity';
import { SurgePricingService } from './surge-pricing.service';
import { SurgePricingController } from './surge-pricing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SurgeZone])],
  controllers: [SurgePricingController],
  providers: [SurgePricingService],
  exports: [SurgePricingService],
})
export class SurgePricingModule {}
