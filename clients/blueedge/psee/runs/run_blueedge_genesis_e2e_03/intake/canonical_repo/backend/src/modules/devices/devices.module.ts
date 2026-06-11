import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';
import { DeviceCertificate } from './entities/device-certificate.entity';
import { DeviceTransfer } from './entities/device-transfer.entity';
import { ProvisioningWorkflow } from './entities/provisioning-workflow.entity';
import { ConfigDeployment } from './entities/config-deployment.entity';
import { EventsModule } from '../../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Device,
      DeviceCertificate,
      DeviceTransfer,
      ProvisioningWorkflow,
      ConfigDeployment,
    ]),
    EventsModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
