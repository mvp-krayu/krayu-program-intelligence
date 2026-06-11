import { api } from './client';

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

export interface HasiCapture {
  id: string; svgDeviceId: string; svgHardwareId: string; vehicleId: string;
  hasiCaptureId: string; filename: string; fileSizeBytes: number; fileHashSha256: string; captureFormat: string;
  status: 'uploaded' | 'parsing' | 'analyzed' | 'error';
  totalPackets: number; captureDurationSec: number; captureStartTime: string; captureEndTime: string;
  uniqueSources: number; uniqueDestinations: number; totalFlows: number; threatCount: number;
  protocolSummary: Record<string, number>; protocolClassification: Record<string, number>;
  totalBytesIn: number; totalBytesOut: number;
  topSources: { ip: string; packets: number; bytes: number; country?: string; asn?: string }[];
  topDestinations: { ip: string; packets: number; bytes: number; country?: string; asn?: string }[];
  topPorts: { port: number; protocol: string; packets: number; service?: string }[];
  aiAnalyzed: boolean; aiSummary: string; aiRecommendations: { type: string; description: string; priority: string }[];
  captureMode: string; captureScope: string; latitude: number; longitude: number;
  createdAt: string; analyzedAt: string;
}

export interface HasiThreat {
  id: string; captureId: string; svgDeviceId: string; svgHardwareId: string;
  threatCategory: string; severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'active' | 'investigating' | 'mitigated' | 'resolved' | 'false_positive' | 'suppressed';
  confidenceScore: number; description: string; detailedAnalysis: string;
  indicatorType: string; indicatorValue: string;
  sourceIp: string; sourcePort: number; destinationIp: string; destinationPort: number;
  protocol: string; packetCount: number; byteCount: number;
  sourceCountry: string; sourceAsn: string; sourceOrg: string;
  destCountry: string; destAsn: string; destOrg: string;
  networkZone: string; latitude: number; longitude: number;
  recommendedActions: { action: string; priority: string; automated: boolean }[];
  autoMitigated: boolean; mitigationAction: string; mitigatedAt: string; mitigatedBy: string;
  mitreTacticId: string; mitreTacticName: string; mitreTechniqueId: string; mitreTechniqueName: string;
  detectedAt: string; createdAt: string; updatedAt: string;
}

export interface HasiFirewallRule {
  id: string; captureId: string; threatId: string; svgDeviceId: string;
  action: 'allow' | 'deny' | 'drop' | 'reject' | 'log' | 'rate_limit';
  direction: 'inbound' | 'outbound' | 'both';
  protocol: string; sourceIp: string; sourceMask: string; sourcePort: string;
  destinationIp: string; destinationMask: string; destinationPort: string;
  description: string; severity: string;
  iptablesRule: string; ciscoAcl: string; paloAltoRule: string; fortinetRule: string; vendorNeutralRule: string;
  status: 'proposed' | 'approved' | 'deployed' | 'active' | 'disabled' | 'rejected' | 'expired';
  fleetWide: boolean; deployedToDevices: string[]; deployedCount: number;
  approvedBy: string; approvedAt: string; deployedAt: string; expiresAt: string;
  hitCount: number; lastHitAt: string; createdAt: string; updatedAt: string;
}

export interface FleetSecurityOverview {
  totalCaptures: number; totalThreats: number; activeThreats: number; criticalThreats: number;
  proposedRules: number; deployedRules: number;
  threatsByCategory: { threatCategory: string; count: number }[];
  threatsBySeverity: { severity: string; count: number }[];
  threatsByDevice: { svgHardwareId: string; count: number }[];
  fleetProtocols: Record<string, number>;
  threatsTimeline: { hour: string; severity: string; count: number }[];
}

export interface DeviceSecurityProfile {
  svgDeviceId: string; totalCaptures: number; totalThreats: number; activeThreats: number;
  recentThreats: HasiThreat[]; firewallRules: HasiFirewallRule[];
  lastCapture: HasiCapture | null; riskScore: number;
}

/* ══════════════════════════════════════════════════════════════
   CAPTURE INGESTION & QUERIES
   ══════════════════════════════════════════════════════════════ */
export const ingestCapture = (data: any) => api.post<{ captureId: string; ingested: { packets: number; threats: number; firewallRules: number } }>('/hasi/captures/ingest', data);
export const getCaptures = (params?: Record<string, any>) => api.get<{ items: HasiCapture[]; total: number }>('/hasi/captures', { params });
export const getCapture = (id: string) => api.get<HasiCapture>(`/hasi/captures/${id}`);

/* ══════════════════════════════════════════════════════════════
   THREATS
   ══════════════════════════════════════════════════════════════ */
export const getThreats = (params?: Record<string, any>) => api.get<{ items: HasiThreat[]; total: number }>('/hasi/threats', { params });
export const getCaptureThreats = (captureId: string) => api.get<HasiThreat[]>(`/hasi/captures/${captureId}/threats`);
export const mitigateThreat = (threatId: string, data: { mitigationAction: string; notes?: string }) => api.post<HasiThreat>(`/hasi/threats/${threatId}/mitigate`, data);

/* ══════════════════════════════════════════════════════════════
   FIREWALL RULES
   ══════════════════════════════════════════════════════════════ */
export const getFirewallRules = (params?: Record<string, any>) => api.get<HasiFirewallRule[]>('/hasi/firewall-rules', { params });
export const approveFirewallRule = (ruleId: string) => api.post<HasiFirewallRule>(`/hasi/firewall-rules/${ruleId}/approve`);
export const deployFirewallRule = (ruleId: string, data: { fleetWide?: boolean; deviceIds?: string[]; expiresAt?: string }) => api.post<HasiFirewallRule>(`/hasi/firewall-rules/${ruleId}/deploy`, data);

/* ══════════════════════════════════════════════════════════════
   FLEET SOC DASHBOARD
   ══════════════════════════════════════════════════════════════ */
export const getFleetSecurityOverview = () => api.get<FleetSecurityOverview>('/hasi/fleet/security-overview');
export const getDeviceSecurityProfile = (svgDeviceId: string) => api.get<DeviceSecurityProfile>(`/hasi/device/${svgDeviceId}/security-profile`);
