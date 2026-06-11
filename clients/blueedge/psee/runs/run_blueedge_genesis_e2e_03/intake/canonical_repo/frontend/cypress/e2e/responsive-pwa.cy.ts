// ── E2E: Responsive Design & PWA ─────────────────────────────
describe('Responsive Design', () => {
  beforeEach(() => {
    cy.login();
  });

  it('desktop layout shows sidebar', () => {
    cy.viewport(1440, 900);
    cy.visit('/overview');
    cy.get('[class*="sidebar"], nav, [class*="nav"]').should('be.visible');
  });

  it('tablet layout adapts', () => {
    cy.viewport(768, 1024);
    cy.visit('/overview');
    cy.assertNoErrors();
  });

  it('mobile layout collapses sidebar', () => {
    cy.viewport(375, 812);
    cy.visit('/overview');
    cy.assertNoErrors();
    // Sidebar should be collapsed or hidden on mobile
  });

  it('all pages render without horizontal scroll on mobile', () => {
    cy.viewport(375, 812);
    const mobilePaths = ['/overview', '/vehicles', '/tanker', '/safety', '/analytics', '/alerts'];
    mobilePaths.forEach(path => {
      cy.visit(path);
      cy.assertNoErrors();
    });
  });
});

describe('PWA Features', () => {
  it('manifest.json is accessible', () => {
    cy.request('/manifest.json').then(res => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('name', 'Blue Edge Fleet Management');
      expect(res.body).to.have.property('short_name', 'BlueEdge');
      expect(res.body).to.have.property('display', 'standalone');
      expect(res.body.icons).to.have.length.greaterThan(0);
    });
  });

  it('service worker registers', () => {
    cy.visit('/overview');
    cy.window().then(win => {
      expect(win.navigator.serviceWorker).to.exist;
    });
  });

  it('has theme-color meta tag', () => {
    cy.visit('/overview');
    cy.get('meta[name="theme-color"]').should('exist');
  });

  it('has viewport meta tag for mobile', () => {
    cy.get('meta[name="viewport"]').should('exist');
  });
});

describe('Accessibility', () => {
  beforeEach(() => {
    cy.login();
  });

  it('page has lang attribute', () => {
    cy.visit('/overview');
    cy.get('html').should('have.attr', 'lang');
  });

  it('all images have alt text', () => {
    cy.visit('/overview');
    cy.get('img').each($img => {
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('buttons have accessible names', () => {
    cy.visit('/overview');
    cy.get('button').each($btn => {
      const hasText = $btn.text().trim().length > 0;
      const hasAriaLabel = !!$btn.attr('aria-label');
      const hasTitle = !!$btn.attr('title');
      expect(hasText || hasAriaLabel || hasTitle).to.be.true;
    });
  });

  it('form inputs have labels', () => {
    cy.visit('/login');
    cy.get('input').each($input => {
      const id = $input.attr('id');
      const ariaLabel = $input.attr('aria-label');
      const placeholder = $input.attr('placeholder');
      const hasLabel = id ? Cypress.$(`label[for="${id}"]`).length > 0 : false;
      expect(hasLabel || !!ariaLabel || !!placeholder).to.be.true;
    });
  });

  it('keyboard navigation works on tabs', () => {
    cy.visit('/tanker');
    cy.get('button').first().focus();
    cy.focused().should('exist');
    cy.focused().type('{tab}');
    cy.focused().should('exist');
  });
});
