import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoManifest } from './entities/cargo-manifest.entity';
import { CustodyTransfer } from './entities/custody-transfer.entity';
import { TankerProduct } from './entities/tanker-product.entity';
import { HazmatPermit } from './entities/hazmat-permit.entity';
import { HazmatRoute } from './entities/hazmat-route.entity';
import { TankerSafetyEvent } from './entities/tanker-safety-event.entity';
import { CargoService, CustodyService, TankMonitoringService, TankerSafetyService, HazmatService, ProductService, InventoryService } from './tanker.service';
import { TankerController } from './tanker.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CargoManifest, CustodyTransfer, TankerProduct, HazmatPermit, HazmatRoute, TankerSafetyEvent])],
  controllers: [TankerController],
  providers: [CargoService, CustodyService, TankMonitoringService, TankerSafetyService, HazmatService, ProductService, InventoryService],
  exports: [CargoService, CustodyService, TankMonitoringService, TankerSafetyService, HazmatService, ProductService, InventoryService],
})
export class TankerModule {}
