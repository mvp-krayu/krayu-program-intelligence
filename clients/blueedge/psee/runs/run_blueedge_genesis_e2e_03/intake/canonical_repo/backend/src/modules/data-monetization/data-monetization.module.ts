import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataProduct } from './entities/data-product.entity';
import { DataMonetizationService } from './data-monetization.service';
import { DataMonetizationController } from './data-monetization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DataProduct])],
  controllers: [DataMonetizationController],
  providers: [DataMonetizationService],
  exports: [DataMonetizationService],
})
export class DataMonetizationModule {}
