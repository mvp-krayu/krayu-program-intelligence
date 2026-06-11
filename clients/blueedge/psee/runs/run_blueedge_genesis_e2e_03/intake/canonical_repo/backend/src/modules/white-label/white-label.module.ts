import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantTheme } from './entities/tenant-theme.entity';
import { WhiteLabelService } from './white-label.service';
import { WhiteLabelController } from './white-label.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TenantTheme])],
  controllers: [WhiteLabelController],
  providers: [WhiteLabelService],
  exports: [WhiteLabelService],
})
export class WhiteLabelModule {}
