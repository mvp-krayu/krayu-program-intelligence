// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Tanker Operations API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const tankerApi = {
  // Cargo Manifests
  listManifests(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/tanker/manifests${q ? '?' + q : ''}`);
  },
  getActiveManifests() { return api.get('/tanker/manifests/active'); },
  getManifestStats() { return api.get('/tanker/manifests/stats'); },
  getManifest(id: string) { return api.get(`/tanker/manifests/${id}`); },
  createManifest(data: any) { return api.post('/tanker/manifests', data); },
  updateManifest(id: string, data: any) { return api.put(`/tanker/manifests/${id}`, data); },
  confirmManifest(id: string) { return api.patch(`/tanker/manifests/${id}/confirm`); },
  // Custody Transfers
  listCustodyTransfers(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/tanker/custody-transfers${q ? '?' + q : ''}`);
  },
  getDisputedTransfers() { return api.get('/tanker/custody-transfers/disputed'); },
  getCustodyTransfer(id: string) { return api.get(`/tanker/custody-transfers/${id}`); },
  createCustodyTransfer(data: any) { return api.post('/tanker/custody-transfers', data); },
  completeCustodyTransfer(id: string) { return api.patch(`/tanker/custody-transfers/${id}/complete`); },
  // ── Tank Monitoring ──
  getFleetTankStatus() { return api.get('/tanker/monitoring/fleet'); },
  getVehicleCompartments(vehicleId: string) { return api.get(`/tanker/monitoring/${vehicleId}/compartments`); },
  getCompartmentHistory(vehicleId: string, compId: string) { return api.get(`/tanker/monitoring/${vehicleId}/compartments/${compId}/history`); },
  // ── Transfer Operations ──
  getActiveTransfers() { return api.get('/tanker/transfers/active'); },
  advanceTransferStep(id: string, step: string) { return api.post(`/tanker/transfers/${id}/advance`, { step }); },
  // ── Safety Systems ──
  getSafetyDashboard() { return api.get('/tanker/safety/dashboard'); },
  getSafetyEvents() { return api.get('/tanker/safety/events'); },
  getIMUData(vehicleId: string) { return api.get(`/tanker/safety/${vehicleId}/imu`); },
  triggerEStop(vehicleId: string) { return api.post(`/tanker/safety/${vehicleId}/e-stop`); },
  // ── HAZMAT Compliance ──
  getHazmatDashboard() { return api.get('/tanker/hazmat/dashboard'); },
  getHazmatPermits() { return api.get('/tanker/hazmat/permits'); },
  getHazmatRoutes() { return api.get('/tanker/hazmat/routes'); },
  // ── Product Registry ──
  getProducts() { return api.get('/tanker/products'); },
  getProductCompatibility() { return api.get('/tanker/products/compatibility'); },
  // ── Inventory ──
  getInventory() { return api.get('/tanker/inventory'); },
  getLossTracking() { return api.get('/tanker/inventory/loss-tracking'); },
};
