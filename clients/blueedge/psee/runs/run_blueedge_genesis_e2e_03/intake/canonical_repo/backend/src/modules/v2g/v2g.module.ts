import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V2gService } from './v2g.service';
import { V2gController } from './v2g.controller';

@Module({
  imports: [TypeOrmModule.forFeature([V2gContract, V2gSession])],
  controllers: [V2gController],
  providers: [V2gService],
  exports: [V2gService],
})
export class V2gModule {}
