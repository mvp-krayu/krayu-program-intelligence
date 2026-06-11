// ── E2E: Theme & Internationalization ────────────────────────
describe('Theme System', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/overview');
  });

  it('starts in dark mode by default', () => {
    cy.get('html').should('have.attr', 'data-theme', 'dark');
    cy.get('html').should('have.class', 'dark');
  });

  it('toggles to light mode on click', () => {
    cy.get('.theme-toggle, button[aria-label*="theme"], button[title*="Theme"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.get('html').should('have.class', 'light');
  });

  it('persists theme across reload', () => {
    cy.get('.theme-toggle, button[aria-label*="theme"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.reload();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });

  it('right-click shows theme menu with 3 options', () => {
    cy.get('.theme-toggle, button[aria-label*="theme"]').rightclick();
    cy.contains('Light').should('be.visible');
    cy.contains('Dark').should('be.visible');
    cy.contains('System').should('be.visible');
  });

  it('system theme follows OS preference', () => {
    cy.get('.theme-toggle, button[aria-label*="theme"]').rightclick();
    cy.contains('System').click();
    // Should resolve based on OS preference
    cy.get('html').should('have.attr', 'data-theme');
  });
});

describe('Internationalization (i18n)', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/overview');
  });

  it('defaults to English (LTR)', () => {
    cy.get('html').should('have.attr', 'dir', 'ltr');
  });

  it('switches to Arabic on language toggle', () => {
    cy.get('[class*="lang-toggle"], button[aria-label*="language"], button[title*="Language"]').click();
    cy.get('html').should('have.attr', 'dir', 'rtl');
  });

  it('translates navigation items to Arabic', () => {
    cy.get('[class*="lang-toggle"], button[aria-label*="language"]').click();
    cy.contains('المركبات').should('exist');
    cy.contains('السائقين').should('exist');
    cy.contains('الرحلات').should('exist');
  });

  it('preserves language across navigation', () => {
    cy.get('[class*="lang-toggle"], button[aria-label*="language"]').click();
    cy.visit('/vehicles');
    cy.get('html').should('have.attr', 'dir', 'rtl');
  });

  it('toggles back to English', () => {
    cy.get('[class*="lang-toggle"], button[aria-label*="language"]').click();
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('[class*="lang-toggle"], button[aria-label*="language"]').click();
    cy.get('html').should('have.attr', 'dir', 'ltr');
  });

  it('persists language across reload', () => {
    cy.get('[class*="lang-toggle"], button[aria-label*="language"]').click();
    cy.reload();
    cy.get('html').should('have.attr', 'dir', 'rtl');
  });
});
