import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtaService } from './ota.service';
import { OtaController } from './ota.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OtaFirmware, OtaDeployment, OtaCampaign])],
  controllers: [OtaController],
  providers: [OtaService],
  exports: [OtaService],
})
export class OtaModule {}
