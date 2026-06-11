import { api } from './client';
export const driverMobileApi = {
  getHome(driverId: string) { return api.get(`/driver-mobile/${driverId}/home`); },
  getNavigation(driverId: string) { return api.get(`/driver-mobile/${driverId}/navigation`); },
  submitChecklist(driverId: string, data: any) { return api.post(`/driver-mobile/${driverId}/checklist`, data); },
  reportIncident(driverId: string, data: any) { return api.post(`/driver-mobile/${driverId}/incident`, data); },
  startShift(driverId: string) { return api.post(`/driver-mobile/${driverId}/shift/start`); },
  endShift(driverId: string) { return api.post(`/driver-mobile/${driverId}/shift/end`); },
};
