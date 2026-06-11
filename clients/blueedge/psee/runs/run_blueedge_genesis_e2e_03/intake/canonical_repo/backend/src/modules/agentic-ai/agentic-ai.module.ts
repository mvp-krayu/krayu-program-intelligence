import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentTask } from './entities/agent-task.entity';
import { AgenticAIService } from './agentic-ai.service';
import { AgenticAiController } from './agentic-ai.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgentTask])],
  controllers: [AgenticAiController],
  providers: [AgenticAIService],
  exports: [AgenticAIService],
})
export class AgenticAIModule {}
