import { api } from './client';
export const surgePricingApi = {
  getActiveZones() { return api.get('/surge-pricing/zones'); },
  getDemandHeatmap() { return api.get('/surge-pricing/heatmap'); },
  getPricingConfig() { return api.get('/surge-pricing/config'); },
  getRevenueImpact() { return api.get('/surge-pricing/revenue'); },
  getById(id: string) { return api.get(`/surge-pricing/${id}`); },
  calculateFare(data: any) { return api.post('/surge-pricing/calculate', data); },
  create(data: any) { return api.post('/surge-pricing', data); },
  update(id: string, data: any) { return api.put(`/surge-pricing/${id}`, data); },
};
