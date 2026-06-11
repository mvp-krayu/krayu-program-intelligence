import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';

@Injectable()
export class BaseCrudService<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  findAll(_filter?: any) { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } as any }); }
  create(data: DeepPartial<T>) { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: DeepPartial<T>) { await this.repo.update(id, data as any); return this.findOne(id); }
  async remove(id: string) { await this.repo.delete(id); return { deleted: true }; }
}
