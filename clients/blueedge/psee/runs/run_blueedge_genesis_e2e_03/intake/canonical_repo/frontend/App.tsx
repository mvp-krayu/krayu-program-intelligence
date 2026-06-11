import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useFavorites, useSessionTimeout, useSwipeGesture, useMediaQuery } from '@/hooks';
import { ROLE_PERMISSIONS, NAV_SECTIONS } from '@/constants';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CommandPalette from '@/components/ui/CommandPalette';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import SessionTimeoutWarning from '@/components/ui/SessionTimeoutWarning';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SwipeableDrawer from '@/components/ui/SwipeableDrawer';
import PullToRefresh from '@/components/ui/PullToRefresh';
import Loading from '@/components/ui/Loading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { LiveAlertBanner, ConnectionStatus } from '@/components/realtime';
import { OfflineIndicator, UpdatePrompt } from '@/pwa';

// ── Lazy-loaded pages ────────────────────────────────────────
const OverviewPage = lazy(() => import('@/pages/fleet/OverviewPage'));
const VehiclesPage = lazy(() => import('@/pages/fleet/VehiclesPage'));
const DriversPage = lazy(() => import('@/pages/fleet/DriversPage'));
const TripsPage = lazy(() => import('@/pages/fleet/TripsPage'));
const FleetsPage = lazy(() => import('@/pages/fleet/FleetsPage'));
const OperationsPage = lazy(() => import('@/pages/fleet/OperationsPage'));
const TankerPage = lazy(() => import('@/pages/fleet/TankerPage'));
const BusPage = lazy(() => import('@/pages/fleet/BusPage'));
const TaxiPage = lazy(() => import('@/pages/fleet/TaxiPage'));
const SurgePricingPage = lazy(() => import('@/pages/fleet/SurgePricingPage'));
const AlertsPage = lazy(() => import('@/pages/safety/AlertsPage'));
const SafetyPage = lazy(() => import('@/pages/safety/SafetyPage'));
const CompliancePage = lazy(() => import('@/pages/safety/CompliancePage'));
const PermitsPage = lazy(() => import('@/pages/safety/PermitsPage'));
const CrossBorderPage = lazy(() => import('@/pages/safety/CrossBorderPage'));
const FatigueRiskPage = lazy(() => import('@/pages/safety/FatigueRiskPage'));
const MaintenancePage = lazy(() => import('@/pages/assets/MaintenancePage'));
const FuelPage = lazy(() => import('@/pages/assets/FuelPage'));
const DevicesPage = lazy(() => import('@/pages/assets/DevicesPage'));
const DiagnosticsPage = lazy(() => import('@/pages/assets/DiagnosticsPage'));
const OtaPage = lazy(() => import('@/pages/assets/OtaPage'));
const FleetLifecyclePage = lazy(() => import('@/pages/assets/FleetLifecyclePage'));
const PartsMarketplacePage = lazy(() => import('@/pages/assets/PartsMarketplacePage'));
const EvPage = lazy(() => import('@/pages/energy/EvPage'));
const V2gPage = lazy(() => import('@/pages/energy/V2gPage'));
const ElectrificationPage = lazy(() => import('@/pages/energy/ElectrificationPage'));
const DepotChargingPage = lazy(() => import('@/pages/energy/DepotChargingPage'));
const ChargingStationsPage = lazy(() => import('@/pages/energy/ChargingStationsPage'));
const ColdchainPage = lazy(() => import('@/pages/energy/ColdchainPage'));
const ExecutivePage = lazy(() => import('@/pages/intelligence/ExecutivePage'));
const AnalyticsPage = lazy(() => import('@/pages/intelligence/AnalyticsPage'));
const AnomalyDetectionPage = lazy(() => import('@/pages/intelligence/AnomalyDetectionPage'));
const BlockchainPage = lazy(() => import('@/pages/intelligence/BlockchainPage'));
const ReportsPage = lazy(() => import('@/pages/intelligence/ReportsPage'));
const PredictiveMaintenancePage = lazy(() => import('@/pages/intelligence/PredictiveMaintenancePage'));
const DriverScoringPage = lazy(() => import('@/pages/intelligence/DriverScoringPage'));
const GeofenceAutomationPage = lazy(() => import('@/pages/intelligence/GeofenceAutomationPage'));
const UsersPage = lazy(() => import('@/pages/people/UsersPage'));
const DriverIncentivesPage = lazy(() => import('@/pages/people/DriverIncentivesPage'));
const DriverMobilePage = lazy(() => import('@/pages/people/DriverMobilePage'));
const NotificationsPage = lazy(() => import('@/pages/people/NotificationsPage'));
const CustomerPortalPage = lazy(() => import('@/pages/people/CustomerPortalPage'));
const WhiteLabelPage = lazy(() => import('@/pages/people/WhiteLabelPage'));
const FinancePage = lazy(() => import('@/pages/people/FinancePage'));
const AuditLogPage = lazy(() => import('@/pages/people/AuditLogPage'));
const PreferencesPage = lazy(() => import('@/pages/people/PreferencesPage'));
const BillingPage = lazy(() => import('@/pages/platform/BillingPage'));
const MultiTenantPage = lazy(() => import('@/pages/platform/MultiTenantPage'));
const OnboardingWizardPage = lazy(() => import('@/pages/platform/OnboardingWizardPage'));
const IntegrationHubPage = lazy(() => import('@/pages/platform/IntegrationHubPage'));
const AgenticAIPage = lazy(() => import('@/pages/intelligence/AgenticAIPage'));
const AftersalesOEMPage = lazy(() => import('@/pages/intelligence/AftersalesOEMPage'));
const RoadIntelligencePage = lazy(() => import('@/pages/intelligence/RoadIntelligencePage'));
const DataMonetizationPage = lazy(() => import('@/pages/intelligence/DataMonetizationPage'));
const LStopTransitPage = lazy(() => import('@/pages/energy/LStopTransitPage'));

// ── Page Map ─────────────────────────────────────────────────
const PAGE_MAP: Record<string, React.LazyExoticComponent<any>> = {
  overview: OverviewPage, vehicles: VehiclesPage, drivers: DriversPage,
  trips: TripsPage, fleets: FleetsPage, operations: OperationsPage,
  tanker: TankerPage, bus: BusPage, taxi: TaxiPage, surge: SurgePricingPage,
  alerts: AlertsPage, safety: SafetyPage, compliance: CompliancePage,
  permits: PermitsPage, crossborder: CrossBorderPage, fatigue: FatigueRiskPage,
  maintenance: MaintenancePage, fuel: FuelPage, devices: DevicesPage,
  diagnostics: DiagnosticsPage, ota: OtaPage, lifecycle: FleetLifecyclePage,
  parts: PartsMarketplacePage,
  ev: EvPage, v2g: V2gPage, electrification: ElectrificationPage,
  depot: DepotChargingPage, charging: ChargingStationsPage, coldchain: ColdchainPage,
  executive: ExecutivePage, analytics: AnalyticsPage, anomaly: AnomalyDetectionPage,
  blockchain: BlockchainPage, reports: ReportsPage,
  predictive: PredictiveMaintenancePage, scoring: DriverScoringPage, geofencing: GeofenceAutomationPage,
  users: UsersPage, incentives: DriverIncentivesPage, drivermobile: DriverMobilePage,
  notifications: NotificationsPage, customer: CustomerPortalPage,
  whitelabel: WhiteLabelPage, finance: FinancePage,
  auditlog: AuditLogPage, preferences: PreferencesPage,
  billing: BillingPage, multitenant: MultiTenantPage, onboarding: OnboardingWizardPage,
  integrations: IntegrationHubPage,
  agenticai: AgenticAIPage,
  aftersales: AftersalesOEMPage,
  roadintel: RoadIntelligencePage,
  monetization: DataMonetizationPage,
  lstop: LStopTransitPage,
};

// ── App Component ────────────────────────────────────────────
export default function App() {
  const { userRole, isAuthenticated, logout } = useAuth();
  const { t } = useI18n();
  const { favorites, toggle: toggleFav } = useFavorites();
  const [page, setPage] = useState('overview');
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showWarning, countdown, stayActive } = useSessionTimeout();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);

  // Listen for SW update events
  useEffect(() => {
    const handler = () => setSwUpdateAvailable(true);
    window.addEventListener('sw-update-available', handler);
    return () => window.removeEventListener('sw-update-available', handler);
  }, []);

  // RBAC check
  const perms = ROLE_PERMISSIONS[userRole];
  const canAccess = perms.access === '*' || (perms.access as string[]).includes(page);

  // Navigation handler
  const handleNav = useCallback((pageId: string) => {
    setPage(pageId);
    setMobileMenu(false);
    window.scrollTo(0, 0);
  }, []);

  // Swipe to open/close drawer
  useSwipeGesture(
    () => { if (isMobile && !mobileMenu) setMobileMenu(true); },
    () => { if (isMobile && mobileMenu) setMobileMenu(false); }
  );

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    await new Promise(r => setTimeout(r, 600)); // simulate
    setRefreshKey(k => k + 1);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCmdPalette(s => !s);
        return;
      }
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === '1') setPage('overview');
      if (e.key === '2') setPage('vehicles');
      if (e.key === '3') setPage('drivers');
      if (e.key === '4') setPage('trips');
      if (e.key === '5') setPage('alerts');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Resolve page component
  const PageComponent = PAGE_MAP[page] || PAGE_MAP.overview;

  // Desktop sidebar vs mobile drawer
  const sidebarContent = (
    <Sidebar
      active={page}
      onNav={handleNav}
      userRole={userRole}
      favorites={favorites}
      onToggleFav={toggleFav}
    />
  );

  return (
    <div className="app-container">
      {/* Skip to content — accessibility */}
      <a className="skip-to-content" href="#main-content">Skip to content</a>

      {/* Real-time critical alert banner (fixed, top center) */}
      <LiveAlertBanner />

      {/* Desktop sidebar */}
      {!isMobile && sidebarContent}

      {/* Mobile swipeable drawer */}
      {isMobile && (
        <SwipeableDrawer open={mobileMenu} onClose={() => setMobileMenu(false)}>
          {sidebarContent}
        </SwipeableDrawer>
      )}

      <main className="main" id="main-content" role="main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Breadcrumbs page={page} onNavigate={handleNav} />
          <ConnectionStatus compact />
        </div>
        <PullToRefresh onRefresh={handleRefresh} disabled={!isMobile}>
          <ErrorBoundary pageName={page} key={`eb-${page}`}>
            <Suspense fallback={<Loading />}>
              {canAccess ? <div className="page-enter" key={page}><PageComponent key={refreshKey} /></div> : (
                <div className="restricted-screen">
                  <h2>🔒 {t('Access Restricted')}</h2>
                  <p>Your role ({userRole}) does not have access to this page.</p>
                </div>
              )}
            </Suspense>
          </ErrorBoundary>
        </PullToRefresh>
      </main>

      <CommandPalette
        open={showCmdPalette}
        onClose={() => setShowCmdPalette(false)}
        onNavigate={handleNav}
        sections={NAV_SECTIONS}
      />

      <MobileBottomNav
        page={page}
        onNavigate={handleNav}
        onToggleMenu={() => setMobileMenu(m => !m)}
      />

      <ScrollToTop />

      {showWarning && <SessionTimeoutWarning countdown={countdown} onStay={stayActive} onLogout={logout} />}

      {/* PWA: offline indicator + update prompt */}
      <OfflineIndicator />
      {swUpdateAvailable && <UpdatePrompt onDismiss={() => setSwUpdateAvailable(false)} />}
    </div>
  );
}
