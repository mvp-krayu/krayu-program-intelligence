import { api } from './client';

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

export interface SensorDevice {
  id: string; svgDeviceId: string; svgHardwareId: string;
  serialNumber: string; model: string; manufacturer: string; firmwareVersion: string;
  sensorType: string; verticalCategory: string; protocol: string;
  canId: string; modbusAddress: number; modbusRegister: number; gpioPin: number; i2cAddress: number; bleUuid: string;
  protocolConfig: Record<string, any>;
  status: 'active' | 'inactive' | 'paired' | 'unpaired' | 'error' | 'calibrating' | 'maintenance';
  lastReadingAt: string; lastReadingValue: number; totalReadings: number; errorCount: number;
  signalStrength: number; batteryLevel: number;
  unit: string; minRange: number; maxRange: number; resolution: number; accuracy: number; samplingIntervalMs: number;
  lastCalibratedAt: string; nextCalibrationDue: string; calibrationOffset: number; calibrationFactor: number;
  calibrationCurve: { input: number; output: number }[];
  alertThresholdLow: number; alertThresholdHigh: number;
  criticalThresholdLow: number; criticalThresholdHigh: number;
  alertsEnabled: boolean; alertCooldownSeconds: number;
  installLocation: string; hazmatCertified: boolean; atexCertified: boolean;
  silRated: boolean; silLevel: number; certificationNumber: string;
  pairedAt: string; pairedBy: string; createdAt: string; updatedAt: string; notes: string;
}

export interface SensorReading {
  id: string; sensorId: string; svgDeviceId: string; sensorType: string;
  timestamp: string; value: number; rawValue: number; unit: string;
  quality: 'good' | 'degraded' | 'suspect' | 'bad' | 'out_of_range';
  signalStrength: number; alertTriggered: boolean; alertType: string;
  latitude: number; longitude: number; vehicleSpeed: number; vehicleState: string;
}

export interface SensorAlert {
  id: string; sensorId: string; svgDeviceId: string; sensorType: string;
  alertType: string; severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'active' | 'acknowledged' | 'investigating' | 'resolved' | 'suppressed' | 'auto_resolved' | 'escalated';
  triggerValue: number; thresholdValue: number; unit: string; message: string;
  latitude: number; longitude: number; locationDescription: string;
  escalated: boolean; escalationLevel: number; hazmatProtocolActivated: boolean;
  acknowledgedAt: string; acknowledgedBy: string; resolvedAt: string; resolvedBy: string;
  resolutionNotes: string; rootCause: string;
  timeToAcknowledgeMs: number; timeToResolveMs: number;
  incidentId: string; workOrderId: string; createdAt: string; updatedAt: string;
}

export interface FleetSensorHealth {
  total: number; active: number; error: number; calibrationOverdue: number;
  byType: { sensorType: string; count: number }[];
  byProtocol: { protocol: string; count: number }[];
  activeAlerts: number; criticalAlerts: number;
}

/* ══════════════════════════════════════════════════════════════
   SENSOR CRUD & PAIRING
   ══════════════════════════════════════════════════════════════ */
export const getSensors = (params?: Record<string, any>) => api.get<{ items: SensorDevice[]; total: number }>('/sensors', { params });
export const getSensor = (id: string) => api.get<SensorDevice>(`/sensors/${id}`);
export const pairSensor = (data: Partial<SensorDevice> & { svgDeviceId: string }) => api.post<SensorDevice>('/sensors/pair', data);
export const updateSensor = (id: string, data: Partial<SensorDevice>) => api.put<SensorDevice>(`/sensors/${id}`, data);
export const unpairSensor = (id: string) => api.delete(`/sensors/${id}/unpair`);
export const getDeviceSensors = (svgDeviceId: string) => api.get<SensorDevice[]>(`/sensors/device/${svgDeviceId}`);

/* ══════════════════════════════════════════════════════════════
   CALIBRATION & TELEMETRY
   ══════════════════════════════════════════════════════════════ */
export const calibrateSensor = (id: string, data: { calibrationOffset: number; calibrationFactor?: number; nextCalibrationDue?: string }) => api.post<SensorDevice>(`/sensors/${id}/calibrate`, data);
export const ingestReadings = (data: { svgDeviceId: string; readings: any[] }) => api.post<{ ingested: number; alertsGenerated: number }>('/sensors/ingest', data);
export const getSensorReadings = (id: string, from?: string, to?: string, limit?: number) => api.get<SensorReading[]>(`/sensors/${id}/readings`, { params: { from, to, limit } });
export const getDeviceReadings = (svgDeviceId: string, from?: string, to?: string) => api.get<SensorReading[]>(`/sensors/device/${svgDeviceId}/readings`, { params: { from, to } });

/* ══════════════════════════════════════════════════════════════
   ALERTS
   ══════════════════════════════════════════════════════════════ */
export const getSensorAlerts = (params?: Record<string, any>) => api.get<{ items: SensorAlert[]; total: number }>('/sensors/alerts/list', { params });
export const acknowledgeAlert = (alertId: string, notes?: string) => api.post<SensorAlert>(`/sensors/alerts/${alertId}/acknowledge`, { notes });
export const resolveAlert = (alertId: string, data: { resolutionNotes: string; rootCause?: string }) => api.post<SensorAlert>(`/sensors/alerts/${alertId}/resolve`, data);

/* ══════════════════════════════════════════════════════════════
   FLEET ANALYTICS
   ══════════════════════════════════════════════════════════════ */
export const getFleetSensorHealth = () => api.get<FleetSensorHealth>('/sensors/fleet/health');
