import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsurancePolicy } from './entities/insurance-policy.entity';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InsurancePolicy])],
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}
