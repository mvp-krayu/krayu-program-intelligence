// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Taxi / Ride-hail API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const taxiApi = {
  listTrips(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/taxi/trips${q ? '?' + q : ''}`);
  },
  getTrip(id: string) { return api.get(`/taxi/trips/${id}`); },
  getActiveTrips() { return api.get('/taxi/trips/active'); },
  getDispatchQueue() { return api.get('/taxi/dispatch/queue'); },
  getStats() { return api.get('/taxi/stats'); },
  getMedallions() { return api.get('/taxi/medallions'); },
  createTrip(data: any) { return api.post('/taxi/trips', data); },
  acceptTrip(id: string) { return api.patch(`/taxi/trips/${id}/accept`); },
  pickupTrip(id: string) { return api.patch(`/taxi/trips/${id}/pickup`); },
  completeTrip(id: string, totalFare: number) { return api.patch(`/taxi/trips/${id}/complete`, { totalFare }); },
  // ── Drivers ──
  getDrivers() { return api.get('/taxi/drivers'); },
  getLeaderboard() { return api.get('/taxi/drivers/leaderboard'); },
  // ── Zones & Surge ──
  getZones() { return api.get('/taxi/zones'); },
  getSurgeSummary() { return api.get('/taxi/zones/surge'); },
  // ── Payments ──
  getPaymentDashboard() { return api.get('/taxi/payments/dashboard'); },
  // ── Dispatch Board ──
  getDispatchBoard() { return api.get('/taxi/dispatch/board'); },
  // ── Ratings ──
  getRatingDashboard() { return api.get('/taxi/ratings/dashboard'); },
  // ── Medallions Deep ──
  getMedallionRegistry() { return api.get('/taxi/medallions/registry'); },
  // ── Compliance ──
  getCompliance() { return api.get('/taxi/compliance'); },
  // ── Live Fleet ──
  getLiveFleet() { return api.get('/taxi/fleet/live'); },
};
