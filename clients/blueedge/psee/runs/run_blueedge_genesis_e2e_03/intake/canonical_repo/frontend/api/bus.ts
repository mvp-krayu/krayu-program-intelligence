// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Bus Transit API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const busApi = {
  listRoutes(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/bus/routes${q ? '?' + q : ''}`);
  },
  getRoute(id: string) { return api.get(`/bus/routes/${id}`); },
  getOTP() { return api.get('/bus/routes/otp'); },
  getPassengerStats() { return api.get('/bus/passengers/stats'); },
  getScheduleAdherence(id: string) { return api.get(`/bus/routes/${id}/schedule`); },
  createRoute(data: any) { return api.post('/bus/routes', data); },
  updateRoute(id: string, data: any) { return api.put(`/bus/routes/${id}`, data); },
  deleteRoute(id: string) { return api.delete(`/bus/routes/${id}`); },
  // ── Stops ──
  getStops() { return api.get('/bus/stops'); },
  getStopsByRoute(routeId: string) { return api.get(`/bus/stops/by-route/${routeId}`); },
  // ── Schedules ──
  getScheduleDashboard() { return api.get('/bus/schedules/dashboard'); },
  getSchedulesByRoute(routeId: string) { return api.get(`/bus/schedules/route/${routeId}`); },
  getTimetable(routeId: string) { return api.get(`/bus/schedules/timetable/${routeId}`); },
  getAdherenceTrend() { return api.get('/bus/schedules/adherence-trend'); },
  // ── Passengers ──
  getPassengerDashboard() { return api.get('/bus/passengers/dashboard'); },
  getLiveLoadFactors() { return api.get('/bus/passengers/live-load'); },
  // ── Dispatch ──
  getDispatchDashboard() { return api.get('/bus/dispatch/dashboard'); },
  getAssignments() { return api.get('/bus/dispatch/assignments'); },
  // ── Fare & Revenue ──
  getFareDashboard() { return api.get('/bus/fare/dashboard'); },
  // ── Compliance ──
  getCompliance() { return api.get('/bus/compliance'); },
  // ── Live Fleet ──
  getLiveFleet() { return api.get('/bus/fleet/live'); },
};
