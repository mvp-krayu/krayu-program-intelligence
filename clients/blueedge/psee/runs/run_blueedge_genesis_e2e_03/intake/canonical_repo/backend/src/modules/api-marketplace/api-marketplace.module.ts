import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiMarketplaceService } from './api-marketplace.service';
import { ApiMarketplaceController } from './api-marketplace.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, WebhookSubscription, WebhookDeliveryLog])],
  controllers: [ApiMarketplaceController],
  providers: [ApiMarketplaceService],
  exports: [ApiMarketplaceService],
})
export class ApiMarketplaceModule {}
