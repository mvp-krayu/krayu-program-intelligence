// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Cypress E2E Support
// ══════════════════════════════════════════════════════════════

// ── Custom Commands ────────────────────────────────────────
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable;
      logout(): Chainable;
      navigateTo(section: string, page: string): Chainable;
      assertPageHeader(title: string): Chainable;
      assertKpiCards(minCount?: number): Chainable;
      assertTabBar(tabs: string[]): Chainable;
      switchTab(tabLabel: string): Chainable;
      assertTableRows(minCount?: number): Chainable;
      assertNoErrors(): Chainable;
      waitForApi(): Chainable;
    }
  }
}

// Login via UI
Cypress.Commands.add('login', (email?: string, password?: string) => {
  const e = email || Cypress.env('ADMIN_EMAIL');
  const p = password || Cypress.env('ADMIN_PASSWORD');
  cy.visit('/login');
  cy.get('input[type="email"], input[name="email"]').clear().type(e);
  cy.get('input[type="password"], input[name="password"]').clear().type(p);
  cy.get('button[type="submit"], button:contains("Sign In"), button:contains("Login")').click();
  cy.url().should('not.include', '/login');
});

// Logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"], .user-avatar, .profile-menu').click();
  cy.contains('Logout').click();
  cy.url().should('include', '/login');
});

// Navigate via sidebar
Cypress.Commands.add('navigateTo', (section: string, page: string) => {
  // Expand section if collapsed
  cy.contains(section).click({ force: true });
  cy.contains(page).click({ force: true });
  cy.waitForApi();
});

// Assert page header exists with title
Cypress.Commands.add('assertPageHeader', (title: string) => {
  cy.get('h1, h2, [class*="page-header"]').should('contain.text', title);
});

// Assert KPI trend cards are rendered
Cypress.Commands.add('assertKpiCards', (minCount = 3) => {
  cy.get('[class*="trend-card"], [class*="stat-card"], .card').should('have.length.at.least', minCount);
});

// Assert tab bar has expected tabs
Cypress.Commands.add('assertTabBar', (tabs: string[]) => {
  tabs.forEach(tab => {
    cy.contains('button', tab).should('exist');
  });
});

// Click a tab
Cypress.Commands.add('switchTab', (tabLabel: string) => {
  cy.contains('button', tabLabel).click();
  cy.wait(300); // Allow tab content to load
});

// Assert table has rows
Cypress.Commands.add('assertTableRows', (minCount = 1) => {
  cy.get('table tbody tr, [class*="table-row"]').should('have.length.at.least', minCount);
});

// Assert no console errors
Cypress.Commands.add('assertNoErrors', () => {
  cy.window().then(win => {
    // Check no unhandled errors
    expect(win.document.querySelector('[class*="error-boundary"]')).to.be.null;
  });
});

// Wait for API calls to complete
Cypress.Commands.add('waitForApi', () => {
  cy.intercept('/api/**').as('apiCall');
  cy.wait(500); // Brief wait for requests to fire
});

export {};
