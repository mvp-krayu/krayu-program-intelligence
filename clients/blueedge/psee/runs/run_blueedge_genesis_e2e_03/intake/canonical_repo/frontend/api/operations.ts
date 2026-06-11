// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Operations API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const operationsApi = {
  // Geofences
  listGeofences(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/operations/geofences${q ? '?' + q : ''}`);
  },
  getGeofence(id: string) { return api.get(`/operations/geofences/${id}`); },
  getGeofenceEvents(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/operations/geofences/events${q ? '?' + q : ''}`);
  },
  createGeofence(data: any) { return api.post('/operations/geofences', data); },
  updateGeofence(id: string, data: any) { return api.put(`/operations/geofences/${id}`, data); },
  deleteGeofence(id: string) { return api.delete(`/operations/geofences/${id}`); },
  // Dispatch
  getDispatchBoard() { return api.get('/operations/dispatch/board'); },
  assignVehicle(data: { vehicleId: string; jobId: string }) { return api.post('/operations/dispatch/assign', data); },
  optimizeDispatch() { return api.post('/operations/dispatch/optimize'); },
  // Routes
  getRouteSuggestions() { return api.get('/operations/routes/suggestions'); },
  calculateRoute(data: any) { return api.post('/operations/routes/calculate', data); },
};
