import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationProvidersService } from './integration-notifications.service';
import { IntegrationNotificationsController } from './integration-notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationProvider, NotificationRule, NotificationLog])],
  controllers: [IntegrationNotificationsController],
  providers: [NotificationProvidersService],
  exports: [NotificationProvidersService],
})
export class NotificationProvidersModule {}
