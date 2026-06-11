import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) { super(repo); }
  async findByEmail(email: string) { return this.repo.findOne({ where: { email } }); }
}
