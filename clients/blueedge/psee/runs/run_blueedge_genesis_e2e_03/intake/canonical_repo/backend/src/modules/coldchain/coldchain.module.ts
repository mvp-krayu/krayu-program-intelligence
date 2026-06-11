import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColdchainService } from './coldchain.service';
import { ColdchainController } from './coldchain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ColdchainShipment])],
  controllers: [ColdchainController],
  providers: [ColdchainService],
  exports: [ColdchainService],
})
export class ColdchainModule {}
