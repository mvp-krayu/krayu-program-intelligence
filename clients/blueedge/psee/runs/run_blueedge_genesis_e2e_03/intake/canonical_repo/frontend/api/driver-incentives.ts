import { api } from './client';
export const driverIncentivesApi = {
  getPrograms() { return api.get('/driver-incentives/programs'); },
  getLeaderboard() { return api.get('/driver-incentives/leaderboard'); },
  getPayouts() { return api.get('/driver-incentives/payouts'); },
  getDriverStatus(driverId: string) { return api.get(`/driver-incentives/drivers/${driverId}`); },
  getById(id: string) { return api.get(`/driver-incentives/${id}`); },
  create(data: any) { return api.post('/driver-incentives', data); },
  update(id: string, data: any) { return api.put(`/driver-incentives/${id}`, data); },
};
