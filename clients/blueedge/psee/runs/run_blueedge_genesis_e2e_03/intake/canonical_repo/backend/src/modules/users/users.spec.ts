import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService, UsersController } from './users.module';
import { User } from './entities/user.entity';
import { createMockRepository, mockUser } from '../../test/test-utils';

describe('UsersModule', () => {
  let controller: UsersController;
  let service: UsersService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: mockRepo }],
    }).compile();
    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('UsersService', () => {
    it('findAll returns users', async () => {
      mockRepo.find.mockResolvedValue([mockUser]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('findOne returns user', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne('user-001');
      expect(result.email).toBe('admin@blueedge.ae');
      expect(result.role).toBe('admin');
    });

    it('create saves user', async () => {
      mockRepo.create.mockReturnValue(mockUser);
      mockRepo.save.mockResolvedValue(mockUser);
      await service.create({ email: 'new@blueedge.ae' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('remove deletes user', async () => {
      expect(await service.remove('user-001')).toHaveProperty('deleted', true);
    });
  });
});
