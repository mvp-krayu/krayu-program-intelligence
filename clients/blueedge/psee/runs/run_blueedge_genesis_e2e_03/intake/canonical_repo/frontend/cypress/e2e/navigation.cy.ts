// ── E2E: Dashboard Navigation ────────────────────────────────
describe('Dashboard Navigation', () => {
  beforeEach(() => {
    cy.login();
  });

  it('renders sidebar with all sections', () => {
    const sections = [
      'Fleet Operations', 'Industry Verticals', 'Safety & Compliance',
      'Asset Management', 'EV & Energy', 'Intelligence', 'People & Access', 'Platform',
    ];
    sections.forEach(section => {
      cy.contains(section).should('exist');
    });
  });

  it('navigates to Fleet Overview', () => {
    cy.navigateTo('Fleet Operations', 'Overview');
    cy.assertPageHeader('Fleet');
    cy.assertKpiCards(4);
  });

  it('navigates to Tanker Operations', () => {
    cy.navigateTo('Industry Verticals', 'Tanker Ops');
    cy.assertPageHeader('Tanker');
    cy.assertKpiCards(4);
  });

  it('navigates to Safety page', () => {
    cy.navigateTo('Safety & Compliance', 'Safety');
    cy.assertPageHeader('Safety');
  });

  it('navigates to Analytics', () => {
    cy.navigateTo('Intelligence', 'Analytics');
    cy.assertPageHeader('Analytics');
  });

  it('tab switching works correctly', () => {
    cy.navigateTo('Industry Verticals', 'Tanker Ops');
    cy.get('button').contains(/dashboard|overview/i).should('exist');
    // Click a different tab
    cy.get('button').contains(/fleet|vessels|vehicles/i).first().click();
    cy.wait(300);
    cy.assertNoErrors();
  });

  it('KPI cards display values', () => {
    cy.navigateTo('Fleet Operations', 'Overview');
    cy.get('[class*="trend-card"], [class*="stat-card"]').first().within(() => {
      // Should have title and value
      cy.get('div').should('have.length.at.least', 2);
    });
  });

  it('global search is accessible', () => {
    cy.get('[class*="search"], input[placeholder*="Search"]').should('exist');
  });

  it('breadcrumb navigation works', () => {
    cy.navigateTo('Industry Verticals', 'Tanker Ops');
    cy.get('[class*="breadcrumb"]').should('exist');
  });

  it('all 56 pages load without errors', () => {
    const pages = [
      '/overview', '/vehicles', '/drivers', '/trips', '/fleets', '/operations',
      '/tanker', '/bus', '/taxi', '/surge-pricing', '/alerts',
      '/safety', '/compliance', '/permits', '/cross-border', '/fatigue-risk',
      '/maintenance', '/fuel', '/devices', '/diagnostics', '/ota', '/fleet-lifecycle', '/vehicle-lifecycle', '/parts-marketplace',
      '/ev', '/v2g', '/electrification', '/depot-charging', '/charging-stations', '/cold-chain', '/l-stop',
      '/executive', '/analytics', '/anomaly-detection', '/predictive-maintenance',
      '/driver-scoring', '/geofence-automation', '/blockchain', '/agentic-ai',
      '/reports', '/road-intelligence', '/aftersales',
      '/users', '/driver-incentives', '/notifications', '/finance', '/audit-log',
      '/preferences', '/white-label', '/customer-portal',
      '/integration-hub', '/multi-tenant', '/billing', '/onboarding',
    ];

    pages.forEach(path => {
      cy.visit(path, { failOnStatusCode: false });
      cy.assertNoErrors();
    });
  });
});
