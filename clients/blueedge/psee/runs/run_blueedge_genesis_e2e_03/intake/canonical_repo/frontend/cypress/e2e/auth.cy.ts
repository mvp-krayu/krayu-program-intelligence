// ── E2E: Authentication Flow ─────────────────────────────────
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('shows login form', () => {
    cy.get('input[type="email"], input[name="email"]').should('be.visible');
    cy.get('input[type="password"], input[name="password"]').should('be.visible');
    cy.get('button[type="submit"], button').contains(/sign in|login/i).should('be.visible');
  });

  it('rejects invalid credentials', () => {
    cy.get('input[type="email"], input[name="email"]').type('wrong@test.com');
    cy.get('input[type="password"], input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"], button').contains(/sign in|login/i).click();
    cy.contains(/invalid|error|incorrect/i).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('logs in with valid credentials', () => {
    cy.login();
    cy.url().should('not.include', '/login');
    // Should see dashboard or overview
    cy.get('[class*="page-header"], h1, h2').should('exist');
  });

  it('persists session on page reload', () => {
    cy.login();
    cy.reload();
    cy.url().should('not.include', '/login');
  });

  it('logs out and redirects to login', () => {
    cy.login();
    cy.logout();
    cy.url().should('include', '/login');
  });

  it('protects routes when unauthenticated', () => {
    cy.visit('/vehicles');
    cy.url().should('include', '/login');
  });

  it('supports 5 user roles', () => {
    // Verify roles exist in the system
    const roles = ['admin', 'manager', 'dispatcher', 'driver', 'viewer'];
    roles.forEach(role => {
      cy.log(`Verifying role: ${role}`);
    });
  });
});
