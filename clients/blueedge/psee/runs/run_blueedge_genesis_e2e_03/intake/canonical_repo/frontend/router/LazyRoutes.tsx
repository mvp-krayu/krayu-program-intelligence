// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Lazy-Loaded Router
// Code-splits all 56 pages for optimal initial bundle size
// ══════════════════════════════════════════════════════════════

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '@/components/ui/Loading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// ── Lazy Page Loader with retry ─────────────────────────────
function lazyWithRetry(importFn: () => Promise<any>, retries = 3) {
  return lazy(() =>
    importFn().catch((err) => {
      if (retries > 0) {
        return new Promise<any>((resolve) =>
          setTimeout(() => resolve(lazyWithRetry(importFn, retries - 1)), 1000)
        );
      }
      throw err;
    })
  );
}

// ── Fleet Operations ────────────────────────────────────────
const OverviewPage = lazyWithRetry(() => import('@/pages/fleet/OverviewPage'));
const VehiclesPage = lazyWithRetry(() => import('@/pages/fleet/VehiclesPage'));
const DriversPage = lazyWithRetry(() => import('@/pages/fleet/DriversPage'));
const TripsPage = lazyWithRetry(() => import('@/pages/fleet/TripsPage'));
const FleetsPage = lazyWithRetry(() => import('@/pages/fleet/FleetsPage'));
const OperationsPage = lazyWithRetry(() => import('@/pages/fleet/OperationsPage'));
const VehicleLifecyclePage = lazyWithRetry(() => import('@/pages/fleet/VehicleLifecyclePage'));
const AlertsPage = lazyWithRetry(() => import('@/pages/fleet/AlertsPage'));
const MaintenancePage = lazyWithRetry(() => import('@/pages/fleet/MaintenancePage'));
const FuelPage = lazyWithRetry(() => import('@/pages/fleet/FuelPage'));

// ── Industry Verticals ──────────────────────────────────────
const TankerPage = lazyWithRetry(() => import('@/pages/fleet/TankerPage'));
const BusPage = lazyWithRetry(() => import('@/pages/fleet/BusPage'));
const TaxiPage = lazyWithRetry(() => import('@/pages/fleet/TaxiPage'));
const SurgePricingPage = lazyWithRetry(() => import('@/pages/fleet/SurgePricingPage'));

// ── Safety & Compliance ─────────────────────────────────────
const SafetyPage = lazyWithRetry(() => import('@/pages/safety/SafetyPage'));
const CompliancePage = lazyWithRetry(() => import('@/pages/safety/CompliancePage'));
const PermitsPage = lazyWithRetry(() => import('@/pages/safety/PermitsPage'));
const CrossBorderPage = lazyWithRetry(() => import('@/pages/safety/CrossBorderPage'));
const FatigueRiskPage = lazyWithRetry(() => import('@/pages/safety/FatigueRiskPage'));
const InsurancePage = lazyWithRetry(() => import('@/pages/safety/InsurancePage'));
const InsurancePage = lazyWithRetry(() => import('@/pages/safety/InsurancePage'));

// ── Asset Management ────────────────────────────────────────
const DevicesPage = lazyWithRetry(() => import('@/pages/assets/DevicesPage'));
const DiagnosticsPage = lazyWithRetry(() => import('@/pages/assets/DiagnosticsPage'));
const OtaPage = lazyWithRetry(() => import('@/pages/assets/OtaPage'));
const FleetLifecyclePage = lazyWithRetry(() => import('@/pages/assets/FleetLifecyclePage'));
const PartsMarketplacePage = lazyWithRetry(() => import('@/pages/assets/PartsMarketplacePage'));

// ── EV & Energy ─────────────────────────────────────────────
const EvPage = lazyWithRetry(() => import('@/pages/energy/EvPage'));
const V2gPage = lazyWithRetry(() => import('@/pages/energy/V2gPage'));
const ElectrificationPage = lazyWithRetry(() => import('@/pages/energy/ElectrificationPage'));
const DepotChargingPage = lazyWithRetry(() => import('@/pages/energy/DepotChargingPage'));
const ChargingStationsPage = lazyWithRetry(() => import('@/pages/energy/ChargingStationsPage'));
const ColdchainPage = lazyWithRetry(() => import('@/pages/energy/ColdchainPage'));
const LStopTransitPage = lazyWithRetry(() => import('@/pages/energy/LStopTransitPage'));

// ── Intelligence ────────────────────────────────────────────
const ExecutivePage = lazyWithRetry(() => import('@/pages/intelligence/ExecutivePage'));
const AnalyticsPage = lazyWithRetry(() => import('@/pages/intelligence/AnalyticsPage'));
const AnomalyDetectionPage = lazyWithRetry(() => import('@/pages/intelligence/AnomalyDetectionPage'));
const PredictiveMaintenancePage = lazyWithRetry(() => import('@/pages/intelligence/PredictiveMaintenancePage'));
const DriverScoringPage = lazyWithRetry(() => import('@/pages/intelligence/DriverScoringPage'));
const GeofenceAutomationPage = lazyWithRetry(() => import('@/pages/intelligence/GeofenceAutomationPage'));
const BlockchainPage = lazyWithRetry(() => import('@/pages/intelligence/BlockchainPage'));
const AgenticAIPage = lazyWithRetry(() => import('@/pages/intelligence/AgenticAIPage'));
const ReportsPage = lazyWithRetry(() => import('@/pages/intelligence/ReportsPage'));
const RoadIntelligencePage = lazyWithRetry(() => import('@/pages/intelligence/RoadIntelligencePage'));
const AftersalesOEMPage = lazyWithRetry(() => import('@/pages/intelligence/AftersalesOEMPage'));
const DigitalTwinPage = lazyWithRetry(() => import('@/pages/intelligence/DigitalTwinPage'));
const DataMonetizationPage = lazyWithRetry(() => import('@/pages/intelligence/DataMonetizationPage'));
const FleetDwvsDashboardPage = lazyWithRetry(() => import('@/pages/intelligence/FleetDwvsDashboardPage'));

// ── People & Access ─────────────────────────────────────────
const UsersPage = lazyWithRetry(() => import('@/pages/people/UsersPage'));
const DriverIncentivesPage = lazyWithRetry(() => import('@/pages/people/DriverIncentivesPage'));
const DriverMobilePage = lazyWithRetry(() => import('@/pages/people/DriverMobilePage'));
const NotificationsPage = lazyWithRetry(() => import('@/pages/people/NotificationsPage'));
const FinancePage = lazyWithRetry(() => import('@/pages/people/FinancePage'));
const AuditLogPage = lazyWithRetry(() => import('@/pages/people/AuditLogPage'));
const PreferencesPage = lazyWithRetry(() => import('@/pages/people/PreferencesPage'));
const CustomerPortalPage = lazyWithRetry(() => import('@/pages/people/CustomerPortalPage'));
const WhiteLabelPage = lazyWithRetry(() => import('@/pages/people/WhiteLabelPage'));

// ── Platform ────────────────────────────────────────────────
const IntegrationHubPage = lazyWithRetry(() => import('@/pages/platform/IntegrationHubPage'));
const MultiTenantPage = lazyWithRetry(() => import('@/pages/platform/MultiTenantPage'));
const BillingPage = lazyWithRetry(() => import('@/pages/platform/BillingPage'));
const OnboardingPage = lazyWithRetry(() => import('@/pages/platform/OnboardingPage'));

// SVG Hardware & Security (v3.23.0)
const SensorsPage = lazyWithRetry(() => import('@/pages/SensorsPage'));
const NetworkSecurityPage = lazyWithRetry(() => import('@/pages/NetworkSecurityPage'));

// ── Auth ────────────────────────────────────────────────────
const LoginScreen = lazyWithRetry(() => import('@/pages/fleet/LoginScreen'));

// ── Suspense Wrapper ────────────────────────────────────────
function SuspenseRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// ── Route Definitions ───────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<SuspenseRoute><LoginScreen /></SuspenseRoute>} />

      {/* Fleet Operations */}
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/overview" element={<SuspenseRoute><OverviewPage /></SuspenseRoute>} />
      <Route path="/vehicles" element={<SuspenseRoute><VehiclesPage /></SuspenseRoute>} />
      <Route path="/drivers" element={<SuspenseRoute><DriversPage /></SuspenseRoute>} />
      <Route path="/trips" element={<SuspenseRoute><TripsPage /></SuspenseRoute>} />
      <Route path="/fleets" element={<SuspenseRoute><FleetsPage /></SuspenseRoute>} />
      <Route path="/operations" element={<SuspenseRoute><OperationsPage /></SuspenseRoute>} />
      <Route path="/alerts" element={<SuspenseRoute><AlertsPage /></SuspenseRoute>} />
      <Route path="/maintenance" element={<SuspenseRoute><MaintenancePage /></SuspenseRoute>} />
      <Route path="/fuel" element={<SuspenseRoute><FuelPage /></SuspenseRoute>} />

      {/* Industry Verticals */}
      <Route path="/tanker" element={<SuspenseRoute><TankerPage /></SuspenseRoute>} />
      <Route path="/bus" element={<SuspenseRoute><BusPage /></SuspenseRoute>} />
      <Route path="/taxi" element={<SuspenseRoute><TaxiPage /></SuspenseRoute>} />
      <Route path="/surge-pricing" element={<SuspenseRoute><SurgePricingPage /></SuspenseRoute>} />

      {/* Safety & Compliance */}
      <Route path="/safety" element={<SuspenseRoute><SafetyPage /></SuspenseRoute>} />
      <Route path="/compliance" element={<SuspenseRoute><CompliancePage /></SuspenseRoute>} />
      <Route path="/permits" element={<SuspenseRoute><PermitsPage /></SuspenseRoute>} />
      <Route path="/cross-border" element={<SuspenseRoute><CrossBorderPage /></SuspenseRoute>} />
      <Route path="/fatigue-risk" element={<SuspenseRoute><FatigueRiskPage /></SuspenseRoute>} />
      <Route path="/insurance" element={<SuspenseRoute><InsurancePage /></SuspenseRoute>} />
      <Route path="/insurance" element={<SuspenseRoute><InsurancePage /></SuspenseRoute>} />

      {/* Assets */}
      <Route path="/devices" element={<SuspenseRoute><DevicesPage /></SuspenseRoute>} />
      <Route path="/diagnostics" element={<SuspenseRoute><DiagnosticsPage /></SuspenseRoute>} />
      <Route path="/ota" element={<SuspenseRoute><OtaPage /></SuspenseRoute>} />
      <Route path="/fleet-lifecycle" element={<SuspenseRoute><FleetLifecyclePage /></SuspenseRoute>} />
      <Route path="/vehicle-lifecycle" element={<SuspenseRoute><VehicleLifecyclePage /></SuspenseRoute>} />
      <Route path="/parts-marketplace" element={<SuspenseRoute><PartsMarketplacePage /></SuspenseRoute>} />

      {/* EV & Energy */}
      <Route path="/ev" element={<SuspenseRoute><EvPage /></SuspenseRoute>} />
      <Route path="/v2g" element={<SuspenseRoute><V2gPage /></SuspenseRoute>} />
      <Route path="/electrification" element={<SuspenseRoute><ElectrificationPage /></SuspenseRoute>} />
      <Route path="/depot-charging" element={<SuspenseRoute><DepotChargingPage /></SuspenseRoute>} />
      <Route path="/charging-stations" element={<SuspenseRoute><ChargingStationsPage /></SuspenseRoute>} />
      <Route path="/cold-chain" element={<SuspenseRoute><ColdchainPage /></SuspenseRoute>} />
      <Route path="/l-stop" element={<SuspenseRoute><LStopTransitPage /></SuspenseRoute>} />

      {/* Intelligence */}
      <Route path="/executive" element={<SuspenseRoute><ExecutivePage /></SuspenseRoute>} />
      <Route path="/analytics" element={<SuspenseRoute><AnalyticsPage /></SuspenseRoute>} />
      <Route path="/anomaly-detection" element={<SuspenseRoute><AnomalyDetectionPage /></SuspenseRoute>} />
      <Route path="/predictive-maintenance" element={<SuspenseRoute><PredictiveMaintenancePage /></SuspenseRoute>} />
      <Route path="/driver-scoring" element={<SuspenseRoute><DriverScoringPage /></SuspenseRoute>} />
      <Route path="/geofence-automation" element={<SuspenseRoute><GeofenceAutomationPage /></SuspenseRoute>} />
      <Route path="/blockchain" element={<SuspenseRoute><BlockchainPage /></SuspenseRoute>} />
      <Route path="/agentic-ai" element={<SuspenseRoute><AgenticAIPage /></SuspenseRoute>} />
      <Route path="/reports" element={<SuspenseRoute><ReportsPage /></SuspenseRoute>} />
      <Route path="/road-intelligence" element={<SuspenseRoute><RoadIntelligencePage /></SuspenseRoute>} />
      <Route path="/aftersales" element={<SuspenseRoute><AftersalesOEMPage /></SuspenseRoute>} />
      <Route path="/digital-twin" element={<SuspenseRoute><DigitalTwinPage /></SuspenseRoute>} />
      <Route path="/data-monetization" element={<SuspenseRoute><DataMonetizationPage /></SuspenseRoute>} />
      <Route path="/fleet-dwvs" element={<SuspenseRoute><FleetDwvsDashboardPage /></SuspenseRoute>} />

      {/* People & Access */}
      <Route path="/users" element={<SuspenseRoute><UsersPage /></SuspenseRoute>} />
      <Route path="/driver-incentives" element={<SuspenseRoute><DriverIncentivesPage /></SuspenseRoute>} />
      <Route path="/driver-mobile" element={<SuspenseRoute><DriverMobilePage /></SuspenseRoute>} />
      <Route path="/notifications" element={<SuspenseRoute><NotificationsPage /></SuspenseRoute>} />
      <Route path="/finance" element={<SuspenseRoute><FinancePage /></SuspenseRoute>} />
      <Route path="/audit-log" element={<SuspenseRoute><AuditLogPage /></SuspenseRoute>} />
      <Route path="/preferences" element={<SuspenseRoute><PreferencesPage /></SuspenseRoute>} />
      <Route path="/customer-portal" element={<SuspenseRoute><CustomerPortalPage /></SuspenseRoute>} />
      <Route path="/white-label" element={<SuspenseRoute><WhiteLabelPage /></SuspenseRoute>} />

      {/* Platform */}
      <Route path="/sensors" element={<SuspenseRoute><SensorsPage /></SuspenseRoute>} />
      <Route path="/network-security" element={<SuspenseRoute><NetworkSecurityPage /></SuspenseRoute>} />
      <Route path="/integration-hub" element={<SuspenseRoute><IntegrationHubPage /></SuspenseRoute>} />
      <Route path="/multi-tenant" element={<SuspenseRoute><MultiTenantPage /></SuspenseRoute>} />
      <Route path="/billing" element={<SuspenseRoute><BillingPage /></SuspenseRoute>} />
      <Route path="/onboarding" element={<SuspenseRoute><OnboardingPage /></SuspenseRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
