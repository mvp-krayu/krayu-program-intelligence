import { api } from './client';
export const otaApi = {
  getDashboard() { return api.get('/ota/dashboard'); },
  listFirmware() { return api.get('/ota/firmware'); },
  listCampaigns() { return api.get('/ota/campaigns'); },
  getCampaign(id: string) { return api.get(`/ota/campaigns/${id}`); },
  getDeviceStatus(deviceId: string) { return api.get(`/ota/devices/${deviceId}/status`); },
  uploadFirmware(data: any) { return api.post('/ota/firmware', data); },
  createCampaign(data: any) { return api.post('/ota/campaigns', data); },
  pauseCampaign(id: string) { return api.patch(`/ota/campaigns/${id}/pause`); },
  rollback(deviceId: string) { return api.post(`/ota/devices/${deviceId}/rollback`); },
};
