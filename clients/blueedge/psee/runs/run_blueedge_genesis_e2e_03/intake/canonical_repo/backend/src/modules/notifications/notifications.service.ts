import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService extends BaseCrudService<Notification> {
  constructor(@InjectRepository(Notification) repo: Repository<Notification>) { super(repo); }
  async getUnread(userId: string) { return success(await this.repo.find({ where: { userId, read: false }, order: { createdAt: 'DESC' }, take: 50 })); }
  async markRead(id: string) { return this.update(id, { read: true, readAt: new Date() } as any); }
  async markAllRead(userId: string) { await this.repo.update({ userId, read: false } as any, { read: true, readAt: new Date() }); return success({ message: 'All marked as read' }); }
  async getCount(userId: string) { const unread = await this.repo.count({ where: { userId, read: false } }); return success({ unread }); }
}
