// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Agentic Ai API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const agenticAiApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/agentic-ai${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/agentic-ai/${id}`); },
  create(data: any) { return api.post('/agentic-ai', data); },
  update(id: string, data: any) { return api.put(`/agentic-ai/${id}`, data); },
  remove(id: string) { return api.delete(`/agentic-ai/${id}`); },
};
