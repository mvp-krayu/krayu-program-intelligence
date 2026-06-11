import type { UserRole, Preferences } from '@/types';

// ── RBAC Permissions ─────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, { label: string; access: string[] | '*' }> = {
  admin: { label: 'Administrator', access: '*' },
  manager: {
    label: 'Operations Manager',
    access: ['overview','vehicles','drivers','trips','fleets','operations','tanker','bus','taxi','surge',
      'alerts','safety','compliance','permits','crossborder','fatigue','maintenance','fuel','devices',
      'diagnostics','ota','lifecycle','parts','ev','v2g','electrification','depot','charging','coldchain',
      'executive','analytics','anomaly','predictive','scoring','geofencing','blockchain','reports','users','incentives','drivermobile',
      'notifications','customer','whitelabel','finance','auditlog','preferences'],
  },
  dispatcher: {
    label: 'Dispatcher',
    access: ['overview','vehicles','drivers','trips','operations','alerts','maintenance','fuel','notifications','preferences'],
  },
  driver: {
    label: 'Driver',
    access: ['overview','trips','alerts','drivermobile','incentives','preferences'],
  },
  viewer: {
    label: 'Read-Only Viewer',
    access: ['overview','executive','analytics','reports','preferences'],
  },
};

// ── Navigation Sections ──────────────────────────────────────
export const NAV_SECTIONS = [
  {
    title: 'Fleet Operations', icon: 'truck',
    items: [
      { id: 'overview', label: 'Overview', icon: 'dashboard' },
      { id: 'vehicles', label: 'Vehicles', icon: 'truck' },
      { id: 'drivers', label: 'Drivers', icon: 'users' },
      { id: 'trips', label: 'Trips', icon: 'route' },
      { id: 'fleets', label: 'Fleets', icon: 'fleets' },
      { id: 'operations', label: 'Operations', icon: 'ops' },
    ],
  },
  {
    title: 'Industry Verticals', icon: 'tanker',
    items: [
      { id: 'tanker', label: 'Tanker Ops', icon: 'tanker' },
      { id: 'bus', label: 'Bus Transit', icon: 'bus' },
      { id: 'taxi', label: 'Taxi / Ride-hail', icon: 'taxi' },
      { id: 'surge', label: 'Surge Pricing', icon: 'surge' },
    ],
  },
  {
    title: 'Safety & Compliance', icon: 'shield',
    items: [
      { id: 'alerts', label: 'Alerts', icon: 'alert' },
      { id: 'safety', label: 'Safety', icon: 'safety' },
      { id: 'compliance', label: 'Compliance', icon: 'shield' },
      { id: 'permits', label: 'Permits', icon: 'permit' },
      { id: 'crossborder', label: 'Cross-Border', icon: 'border' },
      { id: 'fatigue', label: 'Fatigue Risk', icon: 'fatigue' },
    ],
  },
  {
    title: 'Asset Management', icon: 'wrench',
    items: [
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
      { id: 'fuel', label: 'Fuel', icon: 'fuel' },
      { id: 'devices', label: 'IoT Devices', icon: 'device' },
      { id: 'diagnostics', label: 'Diagnostics', icon: 'diag' },
      { id: 'ota', label: 'OTA Updates', icon: 'ota' },
      { id: 'lifecycle', label: 'Fleet Lifecycle', icon: 'lifecycle' },
      { id: 'parts', label: 'Parts Market', icon: 'parts' },
    ],
  },
  {
    title: 'EV & Energy', icon: 'ev',
    items: [
      { id: 'ev', label: 'EV Management', icon: 'ev' },
      { id: 'v2g', label: 'V2G Energy', icon: 'v2g' },
      { id: 'electrification', label: 'Electrification', icon: 'elec' },
      { id: 'depot', label: 'Depot Charging', icon: 'depot' },
      { id: 'charging', label: 'Charging Stations', icon: 'charging' },
      { id: 'coldchain', label: 'Cold Chain', icon: 'cold' },
      { id: 'lstop', label: 'L-STOP Transit', icon: 'bus' },
    ],
  },
  {
    title: 'Intelligence', icon: 'chart',
    items: [
      { id: 'executive', label: 'Executive', icon: 'chart' },
      { id: 'analytics', label: 'Analytics', icon: 'analytics' },
      { id: 'anomaly', label: 'Anomaly Detection', icon: 'anomaly' },
      { id: 'predictive', label: 'Predictive Maintenance AI', icon: 'brain' },
      { id: 'scoring', label: 'Driver Scoring AI', icon: 'target' },
      { id: 'geofencing', label: 'Geofence Automation', icon: 'map-pin' },
      { id: 'blockchain', label: 'Blockchain & DLT', icon: 'blockchain' },
      { id: 'agenticai', label: 'Agentic AI', icon: 'brain' },
      { id: 'aftersales', label: 'Aftersales & OEM', icon: 'wrench' },
      { id: 'roadintel', label: 'Road Intelligence', icon: 'map-pin' },
      { id: 'monetization', label: 'Data Monetization', icon: 'finance' },
      { id: 'reports', label: 'Reports', icon: 'report' },
    ],
  },
  {
    title: 'People & Access', icon: 'user',
    items: [
      { id: 'users', label: 'Users', icon: 'user' },
      { id: 'incentives', label: 'Driver Incentives', icon: 'incentive' },
      { id: 'drivermobile', label: 'Driver Mobile', icon: 'mobile' },
      { id: 'notifications', label: 'Notifications', icon: 'notif' },
      { id: 'customer', label: 'Customer Portal', icon: 'customer' },
      { id: 'whitelabel', label: 'White Label', icon: 'whitelabel' },
      { id: 'finance', label: 'Finance', icon: 'finance' },
      { id: 'auditlog', label: 'Audit Log', icon: 'audit' },
      { id: 'preferences', label: 'Preferences', icon: 'settings' },
    ],
  },
  {
    title: 'Platform', icon: 'settings',
    items: [
      { id: 'integrations', label: 'Integration Hub', icon: 'integration' },
      { id: 'billing', label: 'Billing', icon: 'finance' },
      { id: 'multitenant', label: 'Multi-Tenant', icon: 'whitelabel' },
      { id: 'onboarding', label: 'Onboarding', icon: 'customer' },
    ],
  },
];

// ── Default Preferences ──────────────────────────────────────
export const DEFAULT_PREFS: Preferences = {
  timezone: 'Asia/Dubai',
  dateFormat: 'DD/MM/YYYY',
  units: 'metric',
  currency: 'AED',
  defaultPage: 'overview',
  compactTables: false,
  soundAlerts: true,
  emailDigest: 'daily',
  autoRefresh: true,
  refreshInterval: 30,
};

// ── i18n Translations ────────────────────────────────────────
// Translations moved to translations.ts for maintainability (180+ keys)
export { TRANSLATIONS } from './translations';

// ── API Base URL ─────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_VERSION = 'api/v1';
export const WS_URL = import.meta.env.VITE_WS_URL || window.location.origin;

// ── Mock Geospatial Data ─────────────────────────────────────
export const VEHICLE_POSITIONS = [
  { id: 'V001', lat: 25.2048, lng: 55.2708, plate: 'DXB-7291', status: 'active', type: 'tanker', speed: 62, driver: 'Ahmed Al-Rashid', cargo: 'Diesel - 32,000L' },
  { id: 'V008', lat: 25.0657, lng: 55.1712, plate: 'DXB-4490', status: 'active', type: 'tanker', speed: 45, driver: 'Mohammed Hassan', cargo: 'Jet Fuel - 28,000L' },
  { id: 'V022', lat: 25.1118, lng: 55.2012, plate: 'BUS-1103', status: 'active', type: 'bus', speed: 38, driver: 'Khalid Ibrahim', cargo: '42 passengers' },
  { id: 'V045', lat: 25.2532, lng: 55.3657, plate: 'TAXI-2201', status: 'idle', type: 'taxi', speed: 0, driver: 'Omar Farid', cargo: '' },
  { id: 'V012', lat: 25.0194, lng: 55.1068, plate: 'DXB-8834', status: 'active', type: 'tanker', speed: 55, driver: 'Saeed Al-Mansoori', cargo: 'LPG - 18,000L' },
];

export const MARKER_COLORS: Record<string, string> = {
  active: '#22c55e', idle: '#f59e0b', offline: '#ef4444', maintenance: '#6b7280',
  tanker: '#3b82f6', bus: '#10b981', taxi: '#f59e0b',
};

const DRIVERS = ['Ahmed Al-Rashid', 'Mohammed Hassan', 'Khalid Ibrahim', 'Omar Farid', 'Saeed Al-Mansoori', 'Yusuf Bakr', 'Tariq Noor'];
const LOCATIONS = ['JAFZA Terminal 4', 'Al Quoz Industrial', 'DXB Airport T3', 'Jebel Ali Port', 'Dubai Marina', 'ENOC Station Al Barsha', 'ADNOC Depot'];

export const ACTIVITY_TEMPLATES = [
  { type: 'trip_start', icon: '🚛', bg: 'rgba(59,130,246,0.15)', template: '{driver} started trip to {dest}',
    gen: () => ({ title: `${DRIVERS[Math.floor(Math.random()*DRIVERS.length)]} started trip`, detail: `En route to ${LOCATIONS[Math.floor(Math.random()*LOCATIONS.length)]}` }) },
  { type: 'delivery', icon: '📦', bg: 'rgba(34,197,94,0.15)', template: '{driver} completed delivery at {location}',
    gen: () => ({ title: `${DRIVERS[Math.floor(Math.random()*DRIVERS.length)]} completed delivery`, detail: `At ${LOCATIONS[Math.floor(Math.random()*LOCATIONS.length)]}` }) },
  { type: 'alert', icon: '⚠️', bg: 'rgba(245,158,11,0.15)', template: 'Alert: {message} on {vehicle}',
    gen: () => ({ title: 'Speed alert triggered', detail: `Vehicle DXB-${Math.floor(1000+Math.random()*9000)} exceeded limit` }) },
  { type: 'geofence', icon: '📍', bg: 'rgba(139,92,246,0.15)', template: '{vehicle} entered {zone}',
    gen: () => ({ title: `Vehicle entered geofence`, detail: `${LOCATIONS[Math.floor(Math.random()*LOCATIONS.length)]} zone` }) },
  { type: 'maintenance', icon: '🔧', bg: 'rgba(107,114,128,0.15)', template: '{vehicle} scheduled for {service}',
    gen: () => ({ title: `Maintenance scheduled`, detail: `DXB-${Math.floor(1000+Math.random()*9000)} — Oil change & inspection` }) },
];

export const TOUR_STEPS = [
  { target: '.sidebar', title: 'Navigation', content: 'Access all fleet management modules here.', body: 'Use the sidebar to navigate between fleet operations, safety, assets, and more.', position: 'right' as const, top: 120, left: 280 },
  { target: '.stat-cards', title: 'Fleet Overview', content: 'Real-time metrics at a glance.', body: 'Monitor active vehicles, alerts, fuel consumption, and driver status in real time.', position: 'center' as const },
  { target: '.fleet-map', title: 'Live Map', content: 'Track all vehicles in real-time with geofences.', body: 'View vehicle positions, geofence zones, speed trails, and heatmaps on the interactive map.', position: 'center' as const },
  { target: '.data-table', title: 'Data Tables', content: 'Sort, filter, and export fleet data.', body: 'Use column filters, saved views, bulk operations, and export to CSV/JSON.', position: 'center' as const },
  { target: '.notification-bell', title: 'Alerts', content: 'Stay updated with real-time notifications.', body: 'Receive critical alerts, warnings, and system notifications in real time.', position: 'right' as const, top: 60, right: 100 },
  { target: '.command-palette', title: 'Quick Access', content: 'Press ⌘K to search anything instantly.', body: 'Use the command palette to quickly navigate, search records, and execute actions.', position: 'center' as const },
];

export const SESSION_WARNING_MS = 120000;
export const SESSION_TIMEOUT_MS = 900000;

// ── Map Constants ────────────────────────────────────────────
export const DUBAI_CENTER: [number, number] = [25.2048, 55.2708];

export const MARKER_ICONS: Record<string, string> = {
  tanker: '🛢️', bus: '🚌', taxi: '🚕', default: '🚛',
};

export const GEOFENCE_ZONES = [
  { id: 'GF001', name: 'JAFZA Free Zone', type: 'depot' as const, color: '#3b82f6', lat: 25.0194, lng: 55.0680, radius: 2500 },
  { id: 'GF002', name: 'Al Quoz Industrial', type: 'zone' as const, color: '#22c55e', lat: 25.1365, lng: 55.2246, radius: 1800 },
  { id: 'GF003', name: 'DXB Airport Restricted', type: 'restricted' as const, color: '#ef4444', lat: 25.2532, lng: 55.3657, radius: 3000 },
  { id: 'GF004', name: 'Dubai Marina', type: 'zone' as const, color: '#8b5cf6', lat: 25.0805, lng: 55.1403, radius: 1200 },
  { id: 'GF005', name: 'SZR Corridor', type: 'corridor' as const, color: '#f59e0b', points: [[25.22, 55.28], [25.18, 55.24], [25.10, 55.17], [25.07, 55.13]] as [number, number][], width: 200 },
];

// ── Mobile Navigation ────────────────────────────────────────
export const BOTTOM_NAV_ITEMS = [
  { id: 'overview', label: 'Home', icon: '🏠' },
  { id: 'vehicles', label: 'Fleet', icon: '🚛' },
  { id: 'alerts', label: 'Alerts', icon: '⚠️' },
  { id: 'trips', label: 'Trips', icon: '🗺️' },
  { id: 'preferences', label: 'More', icon: '⚙️' },
];

// ── Search Index ─────────────────────────────────────────────
export const SEARCH_INDEX = [
  { id: 'overview', label: 'Overview', section: 'Fleet Operations', keywords: 'dashboard home summary live' },
  { id: 'vehicles', label: 'Vehicles', section: 'Fleet Operations', keywords: 'fleet truck bus tanker taxi car' },
  { id: 'drivers', label: 'Drivers', section: 'Fleet Operations', keywords: 'driver staff employee license' },
  { id: 'trips', label: 'Trips', section: 'Fleet Operations', keywords: 'trip route journey travel distance' },
  { id: 'fleets', label: 'Fleets', section: 'Fleet Operations', keywords: 'fleet group division' },
  { id: 'operations', label: 'Operations', section: 'Fleet Operations', keywords: 'dispatch assign schedule' },
  { id: 'tanker', label: 'Tanker Ops', section: 'Industry Verticals', keywords: 'oil gas hazmat cargo manifest tanker' },
  { id: 'bus', label: 'Bus Transit', section: 'Industry Verticals', keywords: 'bus transit passenger route schedule' },
  { id: 'taxi', label: 'Taxi / Ride-hail', section: 'Industry Verticals', keywords: 'taxi ride hail dispatch' },
  { id: 'surge', label: 'Surge Pricing', section: 'Industry Verticals', keywords: 'surge price demand multiplier' },
  { id: 'alerts', label: 'Alerts', section: 'Safety & Compliance', keywords: 'alert notification warning critical' },
  { id: 'safety', label: 'Safety', section: 'Safety & Compliance', keywords: 'safety score incident accident' },
  { id: 'compliance', label: 'Compliance', section: 'Safety & Compliance', keywords: 'regulation law permit inspection' },
  { id: 'permits', label: 'Permits', section: 'Safety & Compliance', keywords: 'permit license registration document' },
  { id: 'crossborder', label: 'Cross-Border', section: 'Safety & Compliance', keywords: 'cross border international customs' },
  { id: 'fatigue', label: 'Fatigue Risk', section: 'Safety & Compliance', keywords: 'fatigue drowsy hours rest HOS ELD' },
  { id: 'maintenance', label: 'Maintenance', section: 'Asset Management', keywords: 'maintenance repair service mechanic' },
  { id: 'fuel', label: 'Fuel', section: 'Asset Management', keywords: 'fuel consumption diesel petrol cost' },
  { id: 'devices', label: 'IoT Devices', section: 'Asset Management', keywords: 'iot sensor gps tracker device' },
  { id: 'diagnostics', label: 'Diagnostics', section: 'Asset Management', keywords: 'diagnostic DTC error code fault OBD' },
  { id: 'ota', label: 'OTA Updates', section: 'Asset Management', keywords: 'ota firmware update software deploy' },
  { id: 'lifecycle', label: 'Fleet Lifecycle', section: 'Asset Management', keywords: 'lifecycle acquisition depreciation retire' },
  { id: 'parts', label: 'Parts Market', section: 'Asset Management', keywords: 'parts spare marketplace order' },
  { id: 'ev', label: 'EV Management', section: 'EV & Energy', keywords: 'electric vehicle ev battery charge' },
  { id: 'v2g', label: 'V2G Energy', section: 'EV & Energy', keywords: 'vehicle grid energy trading v2g' },
  { id: 'electrification', label: 'Electrification', section: 'EV & Energy', keywords: 'electrification transition planning' },
  { id: 'depot', label: 'Depot Charging', section: 'EV & Energy', keywords: 'depot charging station schedule' },
  { id: 'charging', label: 'Charging Stations', section: 'EV & Energy', keywords: 'charging station charger EVSE' },
  { id: 'coldchain', label: 'Cold Chain', section: 'EV & Energy', keywords: 'cold chain temperature refrigeration' },
  { id: 'lstop', label: 'L-STOP Transit', section: 'EV & Energy', keywords: 'L-STOP Lalibela EV bus electric transit fleet battery BESS charging solar depot zone smart transport' },
  { id: 'executive', label: 'Executive', section: 'Intelligence', keywords: 'executive ceo cto kpi revenue' },
  { id: 'analytics', label: 'Analytics', section: 'Intelligence', keywords: 'analytics chart graph data insight' },
  { id: 'anomaly', label: 'Anomaly Detection', section: 'Intelligence', keywords: 'anomaly outlier detection AI' },
  { id: 'predictive', label: 'Predictive Maintenance AI', section: 'Intelligence', keywords: 'predictive maintenance AI ML RUL failure prediction component' },
  { id: 'scoring', label: 'Driver Scoring AI', section: 'Intelligence', keywords: 'driver score scoring safety efficiency compliance coaching leaderboard' },
  { id: 'geofencing', label: 'Geofence Automation', section: 'Intelligence', keywords: 'geofence zone automation rule trigger HAZMAT school speed border' },
  { id: 'blockchain', label: 'Blockchain & DLT', section: 'Intelligence', keywords: 'blockchain ledger hash verify cargo token NFT custody settlement carbon credits ESG DLT' },
  { id: 'agenticai', label: 'Agentic AI', section: 'Intelligence', keywords: 'agentic AI agent orchestrator multi-agent MAAS predictive maintenance ML mesh companion journey' },
  { id: 'aftersales', label: 'Aftersales & OEM', section: 'Intelligence', keywords: 'aftersales OEM repair scheduling parts WMS workshop R155 R156 cybersecurity field intelligence digital passport' },
  { id: 'roadintel', label: 'Road Intelligence', section: 'Intelligence', keywords: 'road condition intelligence stochastic analysis degradation predictive city authority smart city IRI pothole' },
  { id: 'monetization', label: 'Data Monetization', section: 'Intelligence', keywords: 'data monetization revenue OEM subscription city SaaS marketplace API pricing B2B ARR' },
  { id: 'reports', label: 'Reports', section: 'Intelligence', keywords: 'report export pdf download' },
  { id: 'users', label: 'Users', section: 'People & Access', keywords: 'user account role permission' },
  { id: 'incentives', label: 'Driver Incentives', section: 'People & Access', keywords: 'incentive reward bonus gamification' },
  { id: 'drivermobile', label: 'Driver Mobile', section: 'People & Access', keywords: 'driver mobile app phone' },
  { id: 'notifications', label: 'Notifications', section: 'People & Access', keywords: 'notification push email sms' },
  { id: 'customer', label: 'Customer Portal', section: 'People & Access', keywords: 'customer client portal tracking' },
  { id: 'whitelabel', label: 'White Label', section: 'People & Access', keywords: 'white label brand theme' },
  { id: 'finance', label: 'Finance', section: 'People & Access', keywords: 'finance invoice billing payment' },
  { id: 'integrations', label: 'Integration Hub', section: 'Platform', keywords: 'integration hub whatsapp sms erp sap oracle dynamics api webhook notification connector' },
  { id: 'billing', label: 'Billing', section: 'Platform', keywords: 'billing subscription invoice payment plan usage' },
  { id: 'multitenant', label: 'Multi-Tenant', section: 'Platform', keywords: 'multi tenant organization workspace isolate' },
  { id: 'onboarding', label: 'Onboarding', section: 'Platform', keywords: 'onboarding wizard setup getting started' },
];

// ── Breadcrumbs ──────────────────────────────────────────────
export const PAGE_BREADCRUMBS: Record<string, string[]> = Object.fromEntries(
  NAV_SECTIONS.flatMap(section =>
    section.items.map(item => [item.id, [section.title, item.label]])
  )
);

// ── Keyboard Shortcuts ───────────────────────────────────────
export const SHORTCUTS = [
  { keys: ['⌘', 'K'], label: 'Command Palette' },
  { keys: ['⌘', 'B'], label: 'Toggle Sidebar' },
  { keys: ['⌘', 'J'], label: 'Toggle Theme' },
  { keys: ['⌘', 'E'], label: 'Export CSV' },
  { keys: ['⌘', 'P'], label: 'Print / PDF' },
  { keys: ['⌘', '/'], label: 'Keyboard Shortcuts' },
  { keys: ['⌘', '1–7'], label: 'Navigate Sections' },
  { keys: ['Esc'], label: 'Close Modal / Dialog' },
  { keys: ['↑', '↓'], label: 'Navigate Table Rows' },
  { keys: ['Enter'], label: 'Open Selected Row' },
];

// ── Mock Audit Log ───────────────────────────────────────────
export const MOCK_AUDIT_LOG = [
  { id: 1, action: 'login' as const, entity: 'session', entityId: 'S001', user: 'admin@blueedge.ae', details: 'Login from 192.168.1.100', timestamp: Date.now() - 300000, ip: '192.168.1.100' },
  { id: 2, action: 'create' as const, entity: 'vehicle', entityId: 'V091', user: 'manager@blueedge.ae', details: 'Created vehicle DXB-9912', timestamp: Date.now() - 600000, ip: '192.168.1.105' },
  { id: 3, action: 'update' as const, entity: 'driver', entityId: 'D045', user: 'admin@blueedge.ae', details: 'Updated license expiry for Ahmed Al-Rashid', timestamp: Date.now() - 1200000, ip: '192.168.1.100' },
  { id: 4, action: 'delete' as const, entity: 'alert', entityId: 'A332', user: 'dispatcher@blueedge.ae', details: 'Resolved and archived alert #332', timestamp: Date.now() - 1800000, ip: '192.168.1.112' },
  { id: 5, action: 'system' as const, entity: 'maintenance', entityId: 'M018', user: 'system', details: 'Auto-scheduled maintenance for V012', timestamp: Date.now() - 3600000, ip: '10.0.0.1' },
  { id: 6, action: 'update' as const, entity: 'compliance', entityId: 'C009', user: 'manager@blueedge.ae', details: 'Updated HAZMAT certification for fleet group A', timestamp: Date.now() - 7200000, ip: '192.168.1.105' },
];

export const PAGE_MAP: Record<string, string> = {
  overview: 'Fleet Overview', vehicles: 'Vehicles', drivers: 'Drivers', trips: 'Trips',
  fleets: 'Fleets', operations: 'Operations', tanker: 'Tanker Ops', bus: 'Bus Transit',
  taxi: 'Taxi Ops', surge: 'Surge Pricing', alerts: 'Alerts', safety: 'Safety',
  compliance: 'Compliance', permits: 'Permits', crossborder: 'Cross-Border', fatigue: 'Fatigue Risk',
  maintenance: 'Maintenance', fuel: 'Fuel', devices: 'Devices', diagnostics: 'Diagnostics',
  ota: 'OTA Updates', lifecycle: 'Fleet Lifecycle', parts: 'Parts Marketplace',
  ev: 'EV Management', v2g: 'V2G Energy', electrification: 'Electrification', depot: 'Depot Charging',
  charging: 'Charging Stations', coldchain: 'Cold Chain', executive: 'Executive Dashboard',
  analytics: 'Analytics', anomaly: 'Anomaly Detection', predictive: 'Predictive Maintenance AI',
  scoring: 'Driver Scoring AI', geofencing: 'Geofence Automation', blockchain: 'Blockchain', reports: 'Reports',
  users: 'User Management', incentives: 'Driver Incentives', drivermobile: 'Driver Mobile',
  notifications: 'Notifications', customer: 'Customer Portal', whitelabel: 'White Label',
  finance: 'Finance', auditlog: 'Audit Log', preferences: 'Preferences',
};
