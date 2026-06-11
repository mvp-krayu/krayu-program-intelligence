// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — API Services Index (57 modules)
// ══════════════════════════════════════════════════════════════

export { api, apiRequest, setTokens, clearTokens, getAccessToken, setOnUnauthorized } from './client';
export type { ApiResponse, PaginatedResponse, ApiError } from './client';

// ── Auth & Users ──
export { authApi } from './auth';
export type { LoginRequest, LoginResponse, AuthUser } from './auth';
export { usersApi } from './users';

// ── Core Fleet ──
export { vehiclesApi } from './vehicles';
export type { VehicleStats, VehiclePosition, VehicleTelemetry, VehicleDtc, VehicleListParams } from './vehicles';
export { driversApi } from './drivers';
export type { DriverStats, DriverScorecard, DriverHOS, LeaderboardEntry, DriverListParams } from './drivers';
export { tripsApi } from './trips';
export type { TripStats, TripTimeline, TripListParams } from './trips';
export { fleetsApi } from './fleets';
export type { FleetKpis } from './fleets';
export { operationsApi } from './operations';

// ── Fleet Types ──
export { tankerApi } from './tanker';
export { busApi } from './bus';
export { taxiApi } from './taxi';

// ── Assets ──
export { devicesApi } from './devices';
export { diagnosticsApi } from './diagnostics';
export { otaApi } from './ota';
export { partsApi } from './parts-marketplace';
export { fleetLifecycleApi } from './fleet-lifecycle';
export { maintenanceApi } from './maintenance';
export type { MaintenanceStats } from './maintenance';

// ── Safety & Compliance ──
export { safetyApi } from './safety';
export { complianceApi } from './compliance';
export { permitsApi } from './permits';
export { crossBorderApi } from './cross-border';
export { fatigueRiskApi } from './fatigue-risk';

// ── Energy & EV ──
export { evApi } from './ev';
export { chargingStationsApi } from './charging-stations';
export { depotChargingApi } from './depot-charging';
export { v2gApi } from './v2g';
export { electrificationApi } from './electrification';
export { coldchainApi } from './coldchain';

// ── Intelligence ──
export { analyticsApi } from './analytics';
export { reportsApi } from './reports';
export { executiveApi } from './executive';
export { anomalyApi } from './anomaly-detection';
export { predictiveMaintenanceApi } from './predictive-maintenance';
export { agenticAiApi } from './agentic-ai';
export { driverScoringApi } from './driver-scoring';
export { roadIntelligenceApi } from './road-intelligence';
export { digitalTwinApi } from './digital-twin';
export { blockchainApi } from './blockchain';
export { aftersalesApi } from './aftersales';

// ── People & Operations ──
export { alertsApi } from './alerts';
export type { AlertStats, AlertListParams } from './alerts';
export { notificationsApi } from './notifications';
export { fuelApi } from './fuel';
export type { FuelStats } from './fuel';
export { financeApi } from './finance';
export { surgePricingApi } from './surge-pricing';
export { driverIncentivesApi } from './driver-incentives';
export { driverMobileApi } from './driver-mobile';
export { customerPortalApi } from './customer-portal';
export { messagingApi } from './messaging';

// ── Platform ──
export { whiteLabelApi } from './white-label';
export { multiTenantApi } from './multi-tenant';
export { billingApi } from './billing';
export { onboardingApi } from './onboarding';
export { geofenceAutomationApi } from './geofence-automation';
export { integrationHubApi } from './integration-hub';
export { integrationNotificationsApi } from './integration-notifications';
export { erpConnectorsApi } from './erp-connectors';
export { dataMonetizationApi } from './data-monetization';
export { apiMarketplaceApi } from './api-marketplace';

// ── Vehicle 360° Lifecycle Intelligence (Session 32) ──
export { driverSessionsApi } from './driver-sessions';
export type { DriverSessionBlock, DWVSResult, SessionStats, OpenSessionDto, CloseSessionDto } from './driver-sessions';
export { vehicleLifecycleApi } from './vehicle-lifecycle';
export type { Vehicle360Summary, TCOResult, TCOBreakdown, FleetRanking, DriverAttribution, AIRecommendation, MaintenanceQuality, FuelIntelligence } from './vehicle-lifecycle';

// ── Insurance Integration (Session 33) ──
export { insuranceApi } from './insurance';
export type { InsurancePolicy, PremiumComputation, InsuranceAnalytics, InsuranceProvider, RiskAssessment, BlockSubmissionResult } from './insurance';
