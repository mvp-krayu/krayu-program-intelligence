import { api } from './client';
export const financeApi = {
  getCostSummary() { return api.get('/finance/costs'); },
  getTCO(vehicleId?: string) { return api.get(`/finance/tco${vehicleId ? '?vehicleId=' + vehicleId : ''}`); },
  getInvoices(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/finance/invoices${q?'?'+q:''}`); },
  getBudgetVsActual() { return api.get('/finance/budget'); },
  getDriverPayroll() { return api.get('/finance/payroll'); },
};
