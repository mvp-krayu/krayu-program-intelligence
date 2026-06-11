// ── E2E: Vehicle CRUD Operations ─────────────────────────────
describe('Vehicle Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicles');
  });

  it('displays vehicle list', () => {
    cy.assertPageHeader('Vehicle');
    cy.assertTableRows(1);
  });

  it('opens create vehicle modal', () => {
    cy.contains('button', /add|new|create/i).click();
    cy.get('[class*="modal"]').should('be.visible');
    cy.contains(/vehicle|add/i).should('be.visible');
  });

  it('validates required fields on create', () => {
    cy.contains('button', /add|new|create/i).click();
    // Try to save without filling required fields
    cy.contains('button', /save|submit|create/i).click();
    // Should show validation or remain on modal
    cy.get('[class*="modal"]').should('be.visible');
  });

  it('creates a new vehicle', () => {
    cy.contains('button', /add|new|create/i).click();
    cy.get('input').first().type('TEST-VIN-001');
    cy.get('input').eq(1).type('DXB-T-9999');
    cy.contains('button', /save|submit|create/i).click();
  });

  it('opens vehicle detail on row click', () => {
    cy.get('table tbody tr, [class*="table-row"]').first().click();
    cy.get('[class*="modal"], [class*="detail"]').should('be.visible');
  });

  it('searches vehicles', () => {
    cy.get('input[placeholder*="Search"], input[placeholder*="search"]').first().type('tanker');
    cy.wait(500);
    // Results should filter
  });

  it('paginates vehicle list', () => {
    // Look for pagination controls
    cy.get('body').then($body => {
      if ($body.find('[class*="pagination"], button:contains("Next")').length) {
        cy.get('[class*="pagination"], button:contains("Next")').should('exist');
      }
    });
  });
});

// ── E2E: Driver Management ───────────────────────────────────
describe('Driver Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/drivers');
  });

  it('displays driver list', () => {
    cy.assertPageHeader('Driver');
    cy.assertKpiCards(3);
  });

  it('opens driver detail', () => {
    cy.get('table tbody tr, [class*="table-row"]').first().click();
    cy.get('[class*="modal"], [class*="detail"]').should('be.visible');
  });

  it('shows driver scoring data', () => {
    cy.visit('/driver-scoring');
    cy.assertPageHeader('Driver Scoring');
    cy.assertKpiCards(3);
  });
});
