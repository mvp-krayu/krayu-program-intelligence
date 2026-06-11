import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AftersalesWorkOrder } from './entities/aftersales-work-order.entity';
import { AftersalesService } from './aftersales.service';
import { AftersalesController } from './aftersales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AftersalesWorkOrder])],
  controllers: [AftersalesController],
  providers: [AftersalesService],
  exports: [AftersalesService],
})
export class AftersalesModule {}
