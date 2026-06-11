import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiTenantService } from './multi-tenant.service';
import { MultiTenantController } from './multi-tenant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [MultiTenantController],
  providers: [MultiTenantService],
  exports: [MultiTenantService],
})
export class MultiTenantModule {}
