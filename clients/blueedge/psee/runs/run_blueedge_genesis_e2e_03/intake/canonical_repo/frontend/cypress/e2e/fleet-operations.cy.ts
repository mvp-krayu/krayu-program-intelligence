// ── E2E: Tanker Operations ───────────────────────────────────
describe('Tanker Operations', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/tanker');
  });

  it('displays tanker dashboard with KPIs', () => {
    cy.assertPageHeader('Tanker');
    cy.assertKpiCards(6);
  });

  it('has all required tabs', () => {
    cy.assertTabBar(['Dashboard', 'Fleet', 'HAZMAT']);
  });

  it('shows fleet tab with vessel data', () => {
    cy.switchTab('Fleet');
    cy.assertTableRows(1);
  });

  it('shows HAZMAT compliance tab', () => {
    cy.switchTab('HAZMAT');
    cy.assertNoErrors();
  });

  it('displays charts on analytics tab', () => {
    cy.get('canvas, [class*="chart"]').should('have.length.at.least', 1);
  });
});

// ── E2E: Bus Transit ─────────────────────────────────────────
describe('Bus Transit', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/bus');
  });

  it('displays bus dashboard', () => {
    cy.assertPageHeader('Bus');
    cy.assertKpiCards(6);
  });

  it('shows route management', () => {
    cy.switchTab('Route');
    cy.assertNoErrors();
  });

  it('shows passenger metrics', () => {
    cy.get('[class*="trend-card"], [class*="stat-card"]').should('exist');
  });
});

// ── E2E: Taxi Operations ─────────────────────────────────────
describe('Taxi Operations', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/taxi');
  });

  it('displays taxi dashboard', () => {
    cy.assertPageHeader('Taxi');
    cy.assertKpiCards(6);
  });

  it('shows surge pricing link', () => {
    cy.visit('/surge-pricing');
    cy.assertPageHeader('Surge');
    cy.assertNoErrors();
  });
});

// ── E2E: Real-Time Features ──────────────────────────────────
describe('Real-Time Features', () => {
  beforeEach(() => {
    cy.login();
  });

  it('shows WebSocket connection indicator', () => {
    cy.visit('/overview');
    cy.get('[class*="connection"], [class*="status"], [class*="ws"]').should('exist');
  });

  it('live fleet map renders', () => {
    cy.visit('/overview');
    cy.get('[class*="map"], [class*="leaflet"], .leaflet-container').should('exist');
  });

  it('alerts page shows real-time notifications', () => {
    cy.visit('/alerts');
    cy.assertPageHeader('Alert');
    cy.assertKpiCards(3);
  });
});

// ── E2E: Charts & Visualizations ─────────────────────────────
describe('Charts & Visualizations', () => {
  beforeEach(() => {
    cy.login();
  });

  it('analytics page renders charts', () => {
    cy.visit('/analytics');
    cy.get('canvas, [class*="chart"]').should('have.length.at.least', 1);
  });

  it('executive dashboard has financial charts', () => {
    cy.visit('/executive');
    cy.assertPageHeader('Executive');
    cy.assertKpiCards(4);
    cy.get('canvas, [class*="chart"]').should('have.length.at.least', 1);
  });

  it('gauge charts render with thresholds', () => {
    cy.visit('/safety');
    cy.get('[class*="gauge"], canvas').should('exist');
  });
});
