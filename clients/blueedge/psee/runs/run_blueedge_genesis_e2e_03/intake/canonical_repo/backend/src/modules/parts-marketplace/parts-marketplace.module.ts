import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsListing } from './entities/parts-listing.entity';
import { PartsMarketplaceService } from './parts-marketplace.service';
import { PartsMarketplaceController } from './parts-marketplace.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PartsListing])],
  controllers: [PartsMarketplaceController],
  providers: [PartsMarketplaceService],
  exports: [PartsMarketplaceService],
})
export class PartsMarketplaceModule {}
