import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorderRegulation } from './entities/border-regulation.entity';
import { CrossBorderService } from './cross-border.service';
import { CrossBorderController } from './cross-border.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BorderRegulation])],
  controllers: [CrossBorderController],
  providers: [CrossBorderService],
  exports: [CrossBorderService],
})
export class CrossBorderModule {}
