import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxiTrip } from './entities/taxi-trip.entity';
import { TaxiDriver } from './entities/taxi-driver.entity';
import { TaxiZone } from './entities/taxi-zone.entity';
import { TaxiPayment } from './entities/taxi-payment.entity';
import { TaxiService, TaxiDriverService, ZoneService, PaymentService, DispatchBoardService, RatingService } from './taxi.service';
import { TaxiController } from './taxi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaxiTrip, TaxiDriver, TaxiZone, TaxiPayment])],
  controllers: [TaxiController],
  providers: [TaxiService, TaxiDriverService, ZoneService, PaymentService, DispatchBoardService, RatingService],
  exports: [TaxiService, TaxiDriverService, ZoneService, PaymentService, DispatchBoardService, RatingService],
})
export class TaxiModule {}
