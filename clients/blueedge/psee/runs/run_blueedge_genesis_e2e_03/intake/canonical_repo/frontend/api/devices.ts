import { api } from './client';

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

export interface SVGDevice {
  id: string; hardwareId: string; serialNumber: string; partNumber: string;
  macAddress: string; imei: string; simIccid: string;
  status: 'online' | 'offline' | 'warning' | 'error' | 'provisioning';
  lifecycle: 'manufactured' | 'provisioned' | 'deployed' | 'operational' | 'maintenance' | 'decommissioned';
  deviceType: string; fleetType: 'tanker' | 'bus' | 'taxi' | 'ev' | 'coldchain';
  ownerId: string; ownerName: string; vehicleId: string; location: string;
  firmwareVersion: string; hardwareVersion: string; softwareVersion: string; configVersion: string;
  manufacturingDate: string; factoryLocation: string; batchNumber: string; manufacturer: string;
  tpmAttested: boolean; tpmEndorsementKey: string; qcPassed: boolean;
  blockchainAddress: string; blockchainNftTokenId: string;
  networkType: string; gpsAccuracy: number;
  uptimeHours: number; cpuUsage: number; memoryUsage: number; temperature: number;
  lastHeartbeat: string; lastTelemetryAt: string;
  capabilities: string[]; configuration: Record<string, any>; protocolConfig: Record<string, any>;
  createdAt: string; updatedAt: string; provisionedAt: string; deployedAt: string; decommissionedAt: string;
  provisionedBy: string; notes: string;
}

export interface DeviceCertificate {
  id: string; deviceId: string; purpose: string; commonName: string; issuer: string;
  fingerprint: string; issuedAt: string; validUntil: string;
  status: 'active' | 'expired' | 'revoked' | 'pending_renewal' | 'suspended';
  keyAlgorithm: string; publicKey: string; certificatePem: string;
  parentCertId: string; chainLevel: string;
  revokedAt: string; revocationReason: string; revokedBy: string;
  renewedFromId: string; renewalCount: number; autoRenew: boolean;
  createdAt: string; createdBy: string;
}

export interface DeviceTransfer {
  id: string; deviceId: string;
  fromOwnerId: string; fromOwnerName: string; toOwnerId: string; toOwnerName: string;
  toOwnerEmail: string; toOwnerBlockchainAddress: string;
  transferType: 'sale' | 'gift' | 'lease' | 'return' | 'reassignment' | 'warranty_replacement' | 'decommission';
  status: 'pending_approval' | 'approved' | 'in_progress' | 'awaiting_payment' | 'completed' | 'rejected' | 'cancelled' | 'disputed';
  priceAmount: number; priceCurrency: string; useEscrow: boolean;
  escrowContractAddress: string; escrowStatus: string;
  recordOnBlockchain: boolean; blockchainTxHash: string; blockNumber: number;
  blockchainConfirmedAt: string; nftTransferTxHash: string;
  requiresApproval: boolean; approvedBy: string; approvedAt: string; approvalNotes: string;
  conditions: { id: string; description: string; met: boolean; verifiedAt?: string }[];
  warrantyTransferred: boolean; configResetRequired: boolean; configResetCompleted: boolean; certificatesReissued: boolean;
  initiatedAt: string; completedAt: string; initiatedBy: string; notes: string;
  createdAt: string; updatedAt: string;
}

export interface ProvisioningWorkflow {
  id: string; deviceId: string; batchId: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'rolling_back' | 'rolled_back';
  currentStep: number; totalSteps: number; progressPercent: number;
  steps: ProvisioningStep[];
  triggerType: string; initiatedBy: string; startedAt: string; completedAt: string;
  totalDurationMs: number; retryCount: number; maxRetries: number;
  notes: string; createdAt: string; updatedAt: string;
}

export interface ProvisioningStep {
  step: number; title: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'skipped';
  startedAt: string | null; completedAt: string | null; duration: string | null;
  logs: string[]; error?: string;
}

export interface ConfigDeployment {
  id: string; deviceId: string; campaignId: string;
  configType: string; fromVersion: string; toVersion: string;
  status: 'pending_approval' | 'approved' | 'scheduled' | 'deploying' | 'deployed' | 'verifying' | 'verified' | 'failed' | 'rolled_back' | 'rejected';
  configPayload: Record<string, any>; configDiff: { field: string; oldValue: any; newValue: any }[];
  requiresApproval: boolean; requestedBy: string; approvedBy: string; approvedAt: string;
  scheduledAt: string; deploymentWindow: string; rolloutStrategy: string;
  deployedAt: string; verifiedAt: string; deployDurationMs: number;
  deviceAcknowledged: boolean; autoRollbackOnFailure: boolean;
  previousConfig: Record<string, any>;
  createdAt: string; updatedAt: string;
}

export interface DeviceQuery {
  status?: string; lifecycle?: string; fleetType?: string; ownerId?: string;
  search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  items: T[]; total: number; page: number; limit: number; totalPages: number;
}

export interface FleetHealth {
  total: number; online: number; warning: number; error: number; offline: number;
  uptimePercent: number; byLifecycle: { lifecycle: string; count: number }[];
  byFleetType: { fleetType: string; count: number }[];
  averageUptimeHours: number; certificatesExpiringSoon: number;
}

/* ══════════════════════════════════════════════════════════════
   DEVICE CRUD (5 endpoints)
   ══════════════════════════════════════════════════════════════ */

export const getDevices = (query: DeviceQuery = {}) =>
  api.get<PaginatedResult<SVGDevice>>('/devices', { params: query });

export const getDevice = (id: string) =>
  api.get<SVGDevice>(`/devices/${id}`);

export const createDevice = (data: {
  partNumber: string; serialNumber?: string; macAddress: string; countryCode: string;
  manufacturer?: string; tpmEndorsementKey?: string; manufacturingDate?: string;
  factoryLocation?: string; batchNumber?: string; hardwareVersion?: string;
  fleetType: string; notes?: string;
  confirmedAccurate: boolean; qcPassed: boolean; readyForProvisioning: boolean;
}) => api.post<SVGDevice>('/devices', data);

export const updateDevice = (id: string, data: Partial<SVGDevice>) =>
  api.put<SVGDevice>(`/devices/${id}`, data);

export const decommissionDevice = (id: string) =>
  api.delete(`/devices/${id}`);

/* ══════════════════════════════════════════════════════════════
   PROVISIONING WORKFLOW (4 endpoints)
   ══════════════════════════════════════════════════════════════ */

export const provisionDevice = (data: {
  deviceId: string; triggerType?: string;
  autoRetryOnFailure?: boolean; rollbackOnCriticalFailure?: boolean;
  networkConfig?: { primaryNetwork: string; fallbackNetwork: string; mqttBroker: string; mqttPort: number; telemetryInterval: number; heartbeatInterval: number };
  protocolConfig?: { j1939Enabled: boolean; canFdEnabled: boolean; obdIIEnabled: boolean; pgns: number[]; baudRate: number };
  targetFleetId?: string; targetVehicleId?: string; notes?: string;
}) => api.post<{ workflowId: string; deviceId: string; hardwareId: string; status: string; message: string }>('/devices/provision', data);

export const batchProvisionDevices = (data: {
  deviceIds: string[]; batchLabel?: string;
  networkConfig?: Record<string, any>; protocolConfig?: Record<string, any>;
}) => api.post<{ batchId: string; total: number; succeeded: number; failed: number }>('/devices/provision/batch', data);

export const getWorkflowStatus = (workflowId: string) =>
  api.get<ProvisioningWorkflow>(`/devices/workflows/${workflowId}`);

export const getDeviceWorkflows = (deviceId: string) =>
  api.get<ProvisioningWorkflow[]>(`/devices/${deviceId}/workflows`);

/* ══════════════════════════════════════════════════════════════
   CERTIFICATES (3 endpoints)
   ══════════════════════════════════════════════════════════════ */

export const getDeviceCertificates = (deviceId: string) =>
  api.get<DeviceCertificate[]>(`/devices/${deviceId}/certificates`);

export const revokeCertificate = (certId: string, reason: string) =>
  api.post<DeviceCertificate>(`/devices/certificates/${certId}/revoke`, { reason });

export const renewCertificate = (certId: string) =>
  api.post<DeviceCertificate>(`/devices/certificates/${certId}/renew`);

/* ══════════════════════════════════════════════════════════════
   OWNERSHIP TRANSFERS (3 endpoints)
   ══════════════════════════════════════════════════════════════ */

export const initiateTransfer = (data: {
  deviceId: string; toOwnerIdentifier: string;
  transferType: string; priceAmount?: number; priceCurrency?: string;
  useEscrow?: boolean; recordOnBlockchain?: boolean;
  transferWarranty?: boolean; resetConfig?: boolean; reissueCertificates?: boolean; notes?: string;
}) => api.post<DeviceTransfer>('/devices/transfers', data);

export const approveTransfer = (transferId: string, notes?: string) =>
  api.post<DeviceTransfer>(`/devices/transfers/${transferId}/approve`, { notes });

export const getDeviceTransfers = (deviceId: string) =>
  api.get<DeviceTransfer[]>(`/devices/${deviceId}/transfers`);

/* ══════════════════════════════════════════════════════════════
   CONFIG DEPLOYMENTS (3 endpoints)
   ══════════════════════════════════════════════════════════════ */

export const deployConfig = (data: {
  deviceId: string; configType: string; toVersion: string;
  configPayload: Record<string, any>;
  deploymentWindow?: string; scheduledAt?: string;
  rolloutStrategy?: string; autoRollbackOnFailure?: boolean; approvalNotes?: string;
}) => api.post<ConfigDeployment>('/devices/config/deploy', data);

export const approveConfigDeployment = (deploymentId: string) =>
  api.post<ConfigDeployment>(`/devices/config/${deploymentId}/approve`);

export const getDeviceConfigHistory = (deviceId: string) =>
  api.get<ConfigDeployment[]>(`/devices/${deviceId}/config-history`);

/* ══════════════════════════════════════════════════════════════
   HEALTH & ANALYTICS (2 endpoints)
   ══════════════════════════════════════════════════════════════ */

export const getFleetHealth = () =>
  api.get<FleetHealth>('/devices/fleet/health');

export const getOTAStatus = () =>
  api.get<{ totalDevices: number; firmwareDistribution: Record<string, number> }>('/devices/fleet/ota-status');

/* ══════════════════════════════════════════════════════════════
   DEVICE COMMANDS (3 endpoints)
   ══════════════════════════════════════════════════════════════ */

export const rebootDevice = (id: string) =>
  api.patch<{ deviceId: string; hardwareId: string; command: string; sent: boolean; timestamp: string }>(`/devices/${id}/reboot`);

export const sendDeviceCommand = (id: string, command: string, payload?: any) =>
  api.post<{ deviceId: string; command: string; sent: boolean; timestamp: string }>(`/devices/${id}/command`, { command, payload });

export const sendHeartbeat = (id: string, data: { cpuUsage?: number; memoryUsage?: number; temperature?: number; networkType?: string }) =>
  api.patch<SVGDevice>(`/devices/${id}/heartbeat`, data);
