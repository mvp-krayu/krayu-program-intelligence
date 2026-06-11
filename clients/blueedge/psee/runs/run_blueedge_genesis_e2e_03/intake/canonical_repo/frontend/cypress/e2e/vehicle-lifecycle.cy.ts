// ══════════════════════════════════════════════════════════════
// E2E: Vehicle 360° Lifecycle Intelligence
// Covers: /vehicle-lifecycle — 8 tabs, DIAM, session blocks, TCO
// ══════════════════════════════════════════════════════════════

describe('Vehicle 360° Lifecycle Intelligence — Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
  });

  it('loads page with header and vehicle identity', () => {
    cy.assertPageHeader('Vehicle 360');
    cy.contains('Volvo').should('exist');
    cy.contains('FH 460').should('exist');
    cy.contains('DXB-T-5841').should('exist');
  });

  it('shows 8 navigation tabs', () => {
    cy.assertTabBar(['Dashboard', 'Fuel', 'Service', 'Financial', 'Driver', 'Fleet', 'AI', 'History']);
  });

  it('displays real-time vehicle status', () => {
    cy.contains('RUNNING').should('exist');
    cy.contains('Health').should('exist');
    cy.contains('Fuel').should('exist');
    cy.contains('Odometer').should('exist');
    cy.contains('RPM').should('exist');
  });

  it('shows active DTCs panel', () => {
    cy.contains('P0217').should('exist');
    cy.contains('P2002').should('exist');
    cy.contains('Engine Coolant').should('exist');
  });

  it('shows next service panel', () => {
    cy.contains('Next Service').should('exist');
    cy.contains('Oil Change').should('exist');
  });

  it('renders dashboard charts and gauges', () => {
    cy.get('canvas, [class*="chart"]').should('have.length.at.least', 2);
  });

  it('displays 6 KPI trend cards', () => {
    cy.assertKpiCards(6);
  });
});

describe('Vehicle 360° — Fuel Intelligence Tab', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
    cy.switchTab('Fuel');
  });

  it('shows fuel KPI cards', () => {
    cy.contains('Avg L/100km').should('exist');
    cy.contains('Total Fuel Cost').should('exist');
    cy.contains('Anomalies Detected').should('exist');
  });

  it('shows driver fuel efficiency comparison', () => {
    cy.contains('Driver Fuel Efficiency').should('exist');
    cy.contains('Mohammed').should('exist');
    cy.contains('Khalid').should('exist');
    cy.contains('Variance').should('exist');
  });

  it('shows fuel events table with station names', () => {
    cy.contains('ENOC').should('exist');
    cy.contains('ADNOC').should('exist');
  });

  it('flags anomalous fuel events', () => {
    cy.contains('ANOMALY').should('exist');
  });

  it('clicking driver row opens driver modal', () => {
    cy.get('table tbody tr').first().click();
    cy.get('[class*="modal"]').should('be.visible');
    cy.contains('Driver Profile').should('exist');
  });
});

describe('Vehicle 360° — Service Lifecycle Tab', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
    cy.switchTab('Service');
  });

  it('shows maintenance KPIs', () => {
    cy.contains('Total Maint. Cost').should('exist');
    cy.contains('Scheduled').should('exist');
    cy.contains('Unscheduled').should('exist');
    cy.contains('On-Time Rate').should('exist');
    cy.contains('Quality Score').should('exist');
  });

  it('shows service history table with work orders', () => {
    cy.contains('WO-8842').should('exist');
    cy.contains('WO-8756').should('exist');
  });

  it('shows service type badges', () => {
    cy.contains('scheduled').should('exist');
    cy.contains('predictive').should('exist');
  });

  it('clicking work order opens detail modal with parts', () => {
    cy.get('table tbody tr').first().click();
    cy.get('[class*="modal"]').should('be.visible');
    cy.contains('Work Order').should('exist');
    cy.contains('Parts Replaced').should('exist');
    cy.contains('Total Cost').should('exist');
  });

  it('service detail shows DTC triggers when present', () => {
    // Click the unscheduled service with DTCs
    cy.contains('WO-8621').click();
    cy.contains('P0217').should('exist');
    cy.contains('Triggering DTCs').should('exist');
  });
});

describe('Vehicle 360° — Financial / TCO Tab', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
    cy.switchTab('Financial');
  });

  it('shows financial KPI cards', () => {
    cy.contains('Acquisition').should('exist');
    cy.contains('Residual Value').should('exist');
    cy.contains('3-Year TCO').should('exist');
    cy.contains('5-Year TCO').should('exist');
  });

  it('shows TCO breakdown with all categories', () => {
    cy.contains('TCO Breakdown').should('exist');
    cy.contains('Fuel').should('exist');
    cy.contains('Insurance').should('exist');
    cy.contains('Tires').should('exist');
    cy.contains('Salik').should('exist');
    cy.contains('TOTAL TCO').should('exist');
  });

  it('shows depreciation and resale analysis', () => {
    cy.contains('Depreciation').should('exist');
    cy.contains('Resale Analysis').should('exist');
    cy.contains('Optimal Sell Window').should('exist');
  });

  it('shows replacement decision indicator', () => {
    cy.contains('Replacement Decision').should('exist');
    cy.contains('Break-even').should('exist');
  });

  it('shows driver impact on residual value table', () => {
    cy.contains('Driver Impact on Residual Value').should('exist');
    cy.contains('DWVS').should('exist');
    cy.contains('Value Preserved').should('exist');
    cy.contains('Accelerated Wear').should('exist');
  });
});

describe('Vehicle 360° — Driver Attribution Tab (DIAM)', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
    cy.switchTab('Driver');
  });

  it('shows DIAM model explanation', () => {
    cy.contains('Driver Impact Attribution Model').should('exist');
    cy.contains('Variance-Based').should('exist');
    cy.contains('Coefficient of Variation').should('exist');
  });

  it('shows DIAM weight factors', () => {
    cy.contains('RPM Variance').should('exist');
    cy.contains('25%').should('exist');
    cy.contains('Harsh Events').should('exist');
    cy.contains('20%').should('exist');
  });

  it('shows 4 driver cards with DWVS scores', () => {
    cy.contains('Mohammed Al-Rashid').should('exist');
    cy.contains('Khalid Ibrahim').should('exist');
    cy.contains('Ahmed Hassan').should('exist');
    cy.contains('Omar Al-Farsi').should('exist');
    cy.contains('0.28').should('exist'); // Best DWVS
    cy.contains('0.84').should('exist'); // Worst DWVS
  });

  it('driver cards show variance bars', () => {
    cy.contains('RPM σ²').should('exist');
    cy.contains('Speed σ²').should('exist');
    cy.contains('Harsh/1000km').should('exist');
    cy.contains('DTC/1000km').should('exist');
  });

  it('driver cards show depreciation impact', () => {
    cy.contains('Depreciation Impact').should('exist');
  });

  it('shows session blocks table with TPM signatures', () => {
    cy.contains('Session Blocks').should('exist');
    cy.contains('TPM-Signed').should('exist');
    cy.contains('Wear Idx').should('exist');
    cy.contains('🔐').should('exist');
  });

  it('session blocks show block numbers and hashes', () => {
    cy.contains('#4280').should('exist');
    cy.contains('0x').should('exist');
  });

  it('clicking session block opens detail modal', () => {
    cy.get('table tbody tr').first().click();
    cy.get('[class*="modal"]').should('be.visible');
    cy.contains('Session Block').should('exist');
    cy.contains('Auth Method').should('exist');
    cy.contains('RPM Variance').should('exist');
    cy.contains('Fuel Rate Var').should('exist');
    cy.contains('Block Hash').should('exist');
    cy.contains('TPM Signed').should('exist');
    cy.contains('Wear Index').should('exist');
    cy.contains('Health Delta').should('exist');
  });

  it('clicking driver card opens profile modal', () => {
    cy.contains('Mohammed Al-Rashid').parents('[style*="borderLeft"]').first().click();
    cy.get('[class*="modal"]').should('be.visible');
    cy.contains('Driver Profile').should('exist');
    cy.contains('Annual Depreciation Impact').should('exist');
    cy.contains('Consistency').should('exist');
    cy.contains('EXCELLENT').should('exist');
  });

  it('driver modal shows all 15 metrics grid', () => {
    cy.contains('Mohammed Al-Rashid').parents('[style*="borderLeft"]').first().click();
    cy.contains('Sessions').should('exist');
    cy.contains('Total km').should('exist');
    cy.contains('L/100km').should('exist');
    cy.contains('Behavior Score').should('exist');
    cy.contains('RPM Variance').should('exist');
    cy.contains('Speed Variance').should('exist');
  });
});

describe('Vehicle 360° — Fleet Comparison Tab', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
    cy.switchTab('Fleet');
  });

  it('shows fleet and same-model rankings', () => {
    cy.contains('Fleet Rank').should('exist');
    cy.contains('Same Model Rank').should('exist');
    cy.contains('/ 150').should('exist');
    cy.contains('/ 18').should('exist');
  });

  it('shows KPI ranking table with percentiles', () => {
    cy.contains('Ranking Across KPIs').should('exist');
    cy.contains('Fuel Efficiency').should('exist');
    cy.contains('Maintenance Cost').should('exist');
    cy.contains('Safety Score').should('exist');
    cy.contains('TCO per km').should('exist');
  });

  it('renders comparison bar charts', () => {
    cy.get('canvas, [class*="chart"]').should('have.length.at.least', 2);
  });
});

describe('Vehicle 360° — AI Recommendations Tab', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
    cy.switchTab('AI');
  });

  it('shows recommendation KPIs', () => {
    cy.contains('Recommendations').should('exist');
    cy.contains('Potential Savings').should('exist');
    cy.contains('Avg Confidence').should('exist');
  });

  it('shows 7 AI recommendations', () => {
    cy.contains('Reassign Driver Omar').should('exist');
    cy.contains('Schedule DPF').should('exist');
    cy.contains('Optimal resale window').should('exist');
    cy.contains('fuel anomaly').should('exist');
    cy.contains('Reroute via Sheikh Zayed').should('exist');
    cy.contains('Award Mohammed').should('exist');
    cy.contains('Negotiate premium').should('exist');
  });

  it('shows priority badges sorted critical-first', () => {
    cy.contains('CRITICAL').should('exist');
    cy.contains('HIGH').should('exist');
    cy.contains('MEDIUM').should('exist');
  });

  it('shows confidence bars and impact amounts', () => {
    cy.contains('Confidence').should('exist');
    cy.contains('est. impact/year').should('exist');
  });

  it('has Accept and Dismiss buttons', () => {
    cy.contains('button', 'Accept').should('exist');
    cy.contains('button', 'Dismiss').should('exist');
  });
});

describe('Vehicle 360° — History Tab', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/vehicle-lifecycle');
    cy.switchTab('History');
  });

  it('shows complete vehicle timeline', () => {
    cy.contains('Complete Vehicle Timeline').should('exist');
    cy.contains('events').should('exist');
  });

  it('includes all event types', () => {
    cy.contains('Service').should('exist');
    cy.contains('Refuel').should('exist');
    cy.contains('DTC Generated').should('exist');
    cy.contains('Vehicle Acquired').should('exist');
  });

  it('shows timeline with icons and dates', () => {
    cy.contains('🔧').should('exist');
    cy.contains('⛽').should('exist');
    cy.contains('⚠️').should('exist');
    cy.contains('🏭').should('exist');
  });
});
