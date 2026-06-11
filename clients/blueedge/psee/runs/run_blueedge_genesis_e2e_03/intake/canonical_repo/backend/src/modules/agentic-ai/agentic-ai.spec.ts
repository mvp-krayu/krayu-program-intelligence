import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AgenticAIService } from './agentic-ai.module';
import { AgentTask } from './entities/agent-task.entity';

describe('AgenticAIService', () => {
  let service: AgenticAIService;
  const mockRepo = { find: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(null), save: jest.fn().mockImplementation(e => ({ id: 'test-id', ...e })), create: jest.fn().mockImplementation(e => e), count: jest.fn().mockResolvedValue(0), delete: jest.fn().mockResolvedValue({ affected: 1 }) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AgenticAIService, { provide: getRepositoryToken(AgentTask), useValue: mockRepo }],
    }).compile();
    service = module.get(AgenticAIService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

    it('should execute getOrchestratorDashboard', async () => {
      const result = await service.getOrchestratorDashboard();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getPredictiveEngine', async () => {
      const result = await service.getPredictiveEngine();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getAIMesh', async () => {
      const result = await service.getAIMesh();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getJourneyCompanion', async () => {
      const result = await service.getJourneyCompanion();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
});
