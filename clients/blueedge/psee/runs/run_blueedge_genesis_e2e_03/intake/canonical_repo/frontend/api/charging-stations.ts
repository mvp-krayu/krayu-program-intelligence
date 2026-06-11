import { api } from './client';
export const chargingStationsApi = {
  getNearby(lat: number, lng: number, radius = 10) { return api.get(`/charging-stations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`); },
  getNetwork() { return api.get('/charging-stations/network'); },
  getRoutePlanning(oLat: number, oLng: number, dLat: number, dLng: number, range: number) { return api.get(`/charging-stations/route-planning?oLat=${oLat}&oLng=${oLng}&dLat=${dLat}&dLng=${dLng}&range=${range}`); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/charging-stations${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/charging-stations/${id}`); },
  create(data: any) { return api.post('/charging-stations', data); },
  update(id: string, data: any) { return api.put(`/charging-stations/${id}`, data); },
};
