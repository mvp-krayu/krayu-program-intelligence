// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet Management — Core Types
// ══════════════════════════════════════════════════════════════

// ── Domain Entities ──────────────────────────────────────────
export interface Vehicle {
  id: string;
  vin: string;
  licensePlate: string;
  fleetType: 'tanker' | 'bus' | 'taxi';
  fleetId: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
  specifications?: Record<string, any>;
  tankUnit?: Record<string, any>;
  certifications?: any[];
  lastKnownPosition?: { type: string; coordinates: number[] };
  lastLatitude?: number;
  lastLongitude?: number;
  lastSpeed?: number;
  lastHeading?: number;
  lastPositionAt?: string;
  odometerKm?: number;
  engineHours?: number;
  fuelLevelPercent?: number;
  currentDriverId?: string;
  currentTripId?: string;
  deviceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  orgId?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'on_leave';
  licenses?: Array<{ type: string; number: string; issuedDate: string; expiryDate: string; country: string; endorsements?: string[] }>;
  certifications?: Array<{ type: string; name: string; issuedDate: string; expiryDate: string; authority: string }>;
  training?: Array<{ course: string; completedDate: string; expiryDate?: string; score?: number }>;
  safetyScore: number;
  efficiencyScore: number;
  complianceScore: number;
  currentVehicleId?: string;
  photoUrl?: string;
  dateOfBirth?: string;
  hireDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  fleetId?: string;
  driverId: string;
  coDriverId?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  tripType: 'tanker_delivery' | 'bus_route' | 'taxi_ride' | 'deadhead' | 'maintenance';
  startTime?: string;
  endTime?: string;
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
  startAddress?: string;
  endAddress?: string;
  distanceKm?: number;
  durationMinutes?: number;
  fuelUsedL?: number;
  avgSpeedKmh?: number;
  maxSpeedKmh?: number;
  cargoManifest?: any[];
  harshBrakingCount?: number;
  harshAccelCount?: number;
  speedingCount?: number;
  tripScore?: number;
  createdAt: string;
}

export interface Alert {
  id: string;
  vehicleId: string;
  driverId?: string;
  fleetId?: string;
  tripId?: string;
  type: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  details?: Record<string, any>;
  latitude?: number;
  longitude?: number;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MaintenanceOrder {
  id: string;
  vehicleId: string;
  serviceType: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLoginAt?: string;
  createdAt: string;
}

// ── Auth & RBAC ──────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'driver' | 'viewer';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ── API Responses ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// ── UI State ─────────────────────────────────────────────────
export type FleetType = 'all' | 'tanker' | 'bus' | 'taxi';
export type ThemeMode = 'dark' | 'light';
export type Language = 'en' | 'ar';
export type CrudMode = 'create' | 'edit' | 'view' | null;

export interface TableColumn<T = any> {
  label: string;
  key?: keyof T & string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

export interface SavedView {
  name: string;
  filters: Record<string, string>;
  search: string;
  sortCol: number | null;
  sortDir: 'asc' | 'desc';
}

export interface Preferences {
  timezone: string;
  dateFormat: string;
  units: 'metric' | 'imperial';
  currency: string;
  defaultPage: string;
  compactTables: boolean;
  soundAlerts: boolean;
  emailDigest: string;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface AuditEntry {
  id: number;
  action: 'create' | 'update' | 'delete' | 'login' | 'system';
  entity: string;
  entityId: string;
  user: string;
  details: string;
  timestamp: number;
  ip: string;
}

// ── Map Types ────────────────────────────────────────────────
export interface VehiclePosition {
  id: string;
  plate: string;
  type: FleetType;
  lat: number;
  lng: number;
  status: string;
  speed: number;
  driver: string;
  cargo: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'depot' | 'restricted' | 'corridor' | 'zone';
  color: string;
  lat?: number;
  lng?: number;
  radius?: number;
  points?: [number, number][];
  width?: number;
}
