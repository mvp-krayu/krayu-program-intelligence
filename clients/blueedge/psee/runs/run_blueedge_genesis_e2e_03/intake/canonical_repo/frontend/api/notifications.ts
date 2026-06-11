import { api } from './client';
export const notificationsApi = {
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/notifications${q?'?'+q:''}`); },
  getUnread(userId: string) { return api.get(`/notifications/unread/${userId}`); },
  getCount(userId: string) { return api.get(`/notifications/count/${userId}`); },
  create(data: any) { return api.post('/notifications', data); },
  markRead(id: string) { return api.patch(`/notifications/${id}/read`); },
  markAllRead(userId: string) { return api.patch(`/notifications/${userId}/read-all`); },
};
