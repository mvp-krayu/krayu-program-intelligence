import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HasiController } from './hasi.controller';
import { HasiService } from './hasi.service';
import { HasiCapture } from './entities/hasi-capture.entity';
import { HasiThreat } from './entities/hasi-threat.entity';
import { HasiFirewallRule } from './entities/hasi-firewall-rule.entity';
import { EventsModule } from '../../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HasiCapture, HasiThreat, HasiFirewallRule]),
    EventsModule,
  ],
  controllers: [HasiController],
  providers: [HasiService],
  exports: [HasiService],
})
export class HasiModule {}
