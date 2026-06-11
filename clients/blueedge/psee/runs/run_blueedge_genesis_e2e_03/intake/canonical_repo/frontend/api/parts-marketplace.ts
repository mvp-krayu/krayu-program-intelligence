import { api } from './client';
export const partsApi = {
  search(query: string, category?: string) { return api.get(`/parts-marketplace/search?q=${encodeURIComponent(query)}${category ? '&category=' + category : ''}`); },
  getVendorBids(partId: string) { return api.get(`/parts-marketplace/${partId}/bids`); },
  getStats() { return api.get('/parts-marketplace/stats'); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/parts-marketplace${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/parts-marketplace/${id}`); },
  createPurchaseOrder(data: any) { return api.post('/parts-marketplace/purchase-order', data); },
  create(data: any) { return api.post('/parts-marketplace', data); },
  update(id: string, data: any) { return api.put(`/parts-marketplace/${id}`, data); },
};
