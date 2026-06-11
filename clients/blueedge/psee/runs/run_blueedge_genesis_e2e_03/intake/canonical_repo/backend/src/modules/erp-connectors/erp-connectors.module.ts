import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpConnectorsService } from './erp-connectors.service';
import { ErpConnectorsController } from './erp-connectors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ErpConnector, ErpSyncLog, ErpFieldMapping])],
  controllers: [ErpConnectorsController],
  providers: [ErpConnectorsService],
  exports: [ErpConnectorsService],
})
export class ErpConnectorsModule {}
