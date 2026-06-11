import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutiveReport } from './entities/executive-report.entity';
import { ExecutiveService } from './executive.service';
import { ExecutiveController } from './executive.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExecutiveReport])],
  controllers: [ExecutiveController],
  providers: [ExecutiveService],
  exports: [ExecutiveService],
})
export class ExecutiveModule {}
