import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelTransaction } from './entities/fuel-transaction.entity';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FuelTransaction])],
  controllers: [FuelController],
  providers: [FuelService],
  exports: [FuelService],
})
export class FuelModule {}
