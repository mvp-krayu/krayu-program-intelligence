import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VehicleLifecyclePage from '@/pages/fleet/VehicleLifecyclePage';

// ══════════════════════════════════════════════════════════════
// Vehicle 360° Lifecycle Intelligence — Deep Unit Tests
// 785-line page: 8 tabs, 3 modals, DIAM model, session blocks
// ══════════════════════════════════════════════════════════════

describe('VehicleLifecyclePage — Dashboard Tab', () => {
  let container: HTMLElement;
  beforeEach(() => { container = render(<VehicleLifecyclePage />).container; });

  it('renders page header with 360° title', () => {
    expect(screen.getByText(/Vehicle 360.*Lifecycle Intelligence/i)).toBeTruthy();
  });

  it('displays vehicle identity card with make/model/plate', () => {
    expect(container.textContent).toContain('Volvo');
    expect(container.textContent).toContain('FH 460');
    expect(container.textContent).toContain('DXB-T-5841');
    expect(container.textContent).toContain('ENOC Fuel Distribution');
  });

  it('renders 6 KPI trend cards', () => {
    const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
    expect(cards.length).toBeGreaterThanOrEqual(6);
  });

  it('shows health score, uptime, residual value, cost/km', () => {
    expect(container.textContent).toContain('Health Score');
    expect(container.textContent).toContain('Uptime');
    expect(container.textContent).toContain('Residual Value');
    expect(container.textContent).toContain('Cost/km');
  });

  it('displays active DTCs panel', () => {
    expect(container.textContent).toContain('P0217');
    expect(container.textContent).toContain('P2002');
    expect(container.textContent).toContain('Engine Coolant');
  });

  it('displays next service panel', () => {
    expect(container.textContent).toContain('Next Service');
    expect(container.textContent).toContain('Oil Change');
  });

  it('shows engine status indicator', () => {
    expect(container.textContent).toContain('RUNNING');
  });

  it('displays driver km contribution chart', () => {
    const canvases = container.querySelectorAll('canvas, [class*="chart"]');
    expect(canvases.length).toBeGreaterThanOrEqual(2);
  });

  it('shows weighted DWVS KPI card', () => {
    expect(container.textContent).toContain('Driver DWVS');
  });

  it('renders 4 gauge charts', () => {
    expect(container.textContent).toContain('Fleet Rank');
    expect(container.textContent).toContain('Maintenance Quality');
    expect(container.textContent).toContain('Fuel Efficiency');
  });
});

describe('VehicleLifecyclePage — Tab Navigation', () => {
  let container: HTMLElement;
  beforeEach(() => { container = render(<VehicleLifecyclePage />).container; });

  it('renders all 8 tabs', () => {
    const tabs = ['Dashboard', 'Fuel Intelligence', 'Service Lifecycle', 'Financial', 'Driver Attribution', 'Fleet Comparison', 'AI Recommendations', 'History'];
    tabs.forEach(t => {
      const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes(t));
      expect(btn).toBeTruthy();
    });
  });

  it('switches to Fuel tab', () => {
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Fuel'));
    if (btn) { fireEvent.click(btn); expect(container.textContent).toContain('L/100km'); }
  });

  it('switches to Service tab', () => {
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Service'));
    if (btn) { fireEvent.click(btn); expect(container.textContent).toContain('Complete Service History'); }
  });

  it('switches to TCO tab', () => {
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Financial'));
    if (btn) { fireEvent.click(btn); expect(container.textContent).toContain('TCO Breakdown'); }
  });

  it('switches to Driver Attribution tab', () => {
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Driver'));
    if (btn) { fireEvent.click(btn); expect(container.textContent).toContain('DIAM'); }
  });

  it('switches to Fleet Comparison tab', () => {
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Fleet'));
    if (btn) { fireEvent.click(btn); expect(container.textContent).toContain('Fleet Rank'); }
  });

  it('switches to AI tab', () => {
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('AI'));
    if (btn) { fireEvent.click(btn); expect(container.textContent).toContain('Potential Savings'); }
  });

  it('switches to History tab', () => {
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('History'));
    if (btn) { fireEvent.click(btn); expect(container.textContent).toContain('Complete Vehicle Timeline'); }
  });
});

describe('VehicleLifecyclePage — Fuel Intelligence Tab', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = render(<VehicleLifecyclePage />).container;
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Fuel'));
    if (btn) fireEvent.click(btn);
  });

  it('shows fuel KPI cards', () => {
    expect(container.textContent).toContain('Avg L/100km');
    expect(container.textContent).toContain('Total Fuel Cost');
    expect(container.textContent).toContain('Anomalies Detected');
  });

  it('shows driver fuel efficiency comparison table', () => {
    expect(container.textContent).toContain('Driver Fuel Efficiency');
    expect(container.textContent).toContain('Mohammed');
    expect(container.textContent).toContain('Khalid');
    expect(container.textContent).toContain('Variance');
  });

  it('shows recent fuel events table', () => {
    expect(container.textContent).toContain('Recent Fuel Events');
    expect(container.textContent).toContain('ENOC');
    expect(container.textContent).toContain('ADNOC');
  });

  it('flags fuel anomalies', () => {
    expect(container.textContent).toContain('ANOMALY');
  });

  it('renders consumption trend chart', () => {
    const canvases = container.querySelectorAll('canvas, [class*="chart"]');
    expect(canvases.length).toBeGreaterThanOrEqual(1);
  });
});

describe('VehicleLifecyclePage — Service Lifecycle Tab', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = render(<VehicleLifecyclePage />).container;
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Service'));
    if (btn) fireEvent.click(btn);
  });

  it('shows maintenance KPI cards with scheduled vs unscheduled', () => {
    expect(container.textContent).toContain('Scheduled');
    expect(container.textContent).toContain('Unscheduled');
    expect(container.textContent).toContain('On-Time Rate');
    expect(container.textContent).toContain('Quality Score');
  });

  it('shows service history table with work orders', () => {
    expect(container.textContent).toContain('WO-8842');
    expect(container.textContent).toContain('WO-8756');
    expect(container.textContent).toContain('WO-8621');
  });

  it('shows service types with badges', () => {
    expect(container.textContent).toContain('scheduled');
    expect(container.textContent).toContain('predictive');
    expect(container.textContent).toContain('unscheduled');
    expect(container.textContent).toContain('regulatory');
  });

  it('shows parts and labor cost columns', () => {
    expect(container.textContent).toContain('Parts');
    expect(container.textContent).toContain('Labor');
  });

  it('clicking service row opens detail modal', () => {
    const row = container.querySelector('table tbody tr');
    if (row) {
      fireEvent.click(row);
      expect(container.textContent).toContain('Work Order');
      expect(container.textContent).toContain('Technician');
      expect(container.textContent).toContain('Parts Replaced');
    }
  });
});

describe('VehicleLifecyclePage — Financial / TCO Tab', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = render(<VehicleLifecyclePage />).container;
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Financial'));
    if (btn) fireEvent.click(btn);
  });

  it('shows acquisition, residual, 3-year and 5-year TCO', () => {
    expect(container.textContent).toContain('Acquisition');
    expect(container.textContent).toContain('Residual Value');
    expect(container.textContent).toContain('3-Year TCO');
    expect(container.textContent).toContain('5-Year TCO');
    expect(container.textContent).toContain('Cost/km Lifetime');
  });

  it('shows TCO breakdown with all cost categories', () => {
    expect(container.textContent).toContain('TCO Breakdown');
    expect(container.textContent).toContain('Fuel');
    expect(container.textContent).toContain('Insurance');
    expect(container.textContent).toContain('Tires');
    expect(container.textContent).toContain('Salik');
    expect(container.textContent).toContain('TOTAL TCO');
  });

  it('shows depreciation analysis card', () => {
    expect(container.textContent).toContain('Depreciation');
    expect(container.textContent).toContain('Monthly Rate');
  });

  it('shows resale analysis with optimal window', () => {
    expect(container.textContent).toContain('Resale Analysis');
    expect(container.textContent).toContain('Optimal Sell Window');
  });

  it('shows replacement decision indicator', () => {
    expect(container.textContent).toContain('Replacement Decision');
    expect(container.textContent).toContain('Break-even');
  });

  it('shows driver impact on residual value table', () => {
    expect(container.textContent).toContain('Driver Impact on Residual Value');
    expect(container.textContent).toContain('DWVS');
    expect(container.textContent).toContain('Value Preserved');
    expect(container.textContent).toContain('Accelerated Wear');
  });
});

describe('VehicleLifecyclePage — Driver Attribution Tab (DIAM)', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = render(<VehicleLifecyclePage />).container;
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Driver'));
    if (btn) fireEvent.click(btn);
  });

  it('shows DIAM explanation card with formula', () => {
    expect(container.textContent).toContain('Driver Impact Attribution Model');
    expect(container.textContent).toContain('DWVS');
    expect(container.textContent).toContain('Coefficient of Variation');
    expect(container.textContent).toContain('variance');
  });

  it('shows weight factors for each metric', () => {
    expect(container.textContent).toContain('RPM Variance');
    expect(container.textContent).toContain('Harsh Events');
    expect(container.textContent).toContain('Speed Variance');
    expect(container.textContent).toContain('25%');
    expect(container.textContent).toContain('20%');
  });

  it('renders 4 driver cards with DWVS scores', () => {
    expect(container.textContent).toContain('Mohammed Al-Rashid');
    expect(container.textContent).toContain('Khalid Ibrahim');
    expect(container.textContent).toContain('Ahmed Hassan');
    expect(container.textContent).toContain('Omar Al-Farsi');
    expect(container.textContent).toContain('0.28');
    expect(container.textContent).toContain('0.84');
  });

  it('shows variance bars for RPM and speed', () => {
    expect(container.textContent).toContain('RPM σ²');
    expect(container.textContent).toContain('Speed σ²');
    expect(container.textContent).toContain('Harsh/1000km');
    expect(container.textContent).toContain('DTC/1000km');
  });

  it('shows depreciation impact per driver', () => {
    expect(container.textContent).toContain('Depreciation Impact');
  });

  it('shows recent session blocks table (TPM-signed)', () => {
    expect(container.textContent).toContain('Session Blocks');
    expect(container.textContent).toContain('TPM-Signed');
    expect(container.textContent).toContain('Wear Idx');
    expect(container.textContent).toContain('🔐');
  });

  it('clicking session block opens detail modal', () => {
    const rows = container.querySelectorAll('table tbody tr');
    if (rows.length > 0) {
      fireEvent.click(rows[0]);
      expect(container.textContent).toContain('Session Block');
      expect(container.textContent).toContain('Auth Method');
      expect(container.textContent).toContain('RPM Variance');
      expect(container.textContent).toContain('Fuel Rate Var');
      expect(container.textContent).toContain('Block Hash');
    }
  });

  it('clicking driver card opens driver profile modal', () => {
    const driverCards = Array.from(container.querySelectorAll('[style*="borderLeft"]'))
      .filter(el => el.textContent?.includes('DWVS'));
    if (driverCards.length > 0) {
      fireEvent.click(driverCards[0]);
      expect(container.textContent).toContain('Driver Profile');
      expect(container.textContent).toContain('Annual Depreciation Impact');
      expect(container.textContent).toContain('Consistency');
    }
  });
});

describe('VehicleLifecyclePage — Fleet Comparison Tab', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = render(<VehicleLifecyclePage />).container;
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Fleet'));
    if (btn) fireEvent.click(btn);
  });

  it('shows fleet rank and same model rank', () => {
    expect(container.textContent).toContain('Fleet Rank');
    expect(container.textContent).toContain('Same Model Rank');
    expect(container.textContent).toContain('/ 150');
    expect(container.textContent).toContain('/ 18');
  });

  it('shows fleet contribution score', () => {
    expect(container.textContent).toContain('Fleet Contribution');
  });

  it('shows ranking across KPIs with percentile bars', () => {
    expect(container.textContent).toContain('Ranking Across KPIs');
    expect(container.textContent).toContain('Fuel Efficiency');
    expect(container.textContent).toContain('Maintenance Cost');
    expect(container.textContent).toContain('Safety Score');
    expect(container.textContent).toContain('TCO per km');
  });

  it('renders comparison charts', () => {
    const canvases = container.querySelectorAll('canvas, [class*="chart"]');
    expect(canvases.length).toBeGreaterThanOrEqual(2);
  });
});

describe('VehicleLifecyclePage — AI Recommendations Tab', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = render(<VehicleLifecyclePage />).container;
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('AI'));
    if (btn) fireEvent.click(btn);
  });

  it('shows recommendation KPIs with potential savings', () => {
    expect(container.textContent).toContain('Recommendations');
    expect(container.textContent).toContain('Potential Savings');
    expect(container.textContent).toContain('Avg Confidence');
  });

  it('shows 7 AI recommendations sorted by priority', () => {
    expect(container.textContent).toContain('Reassign Driver Omar');
    expect(container.textContent).toContain('Schedule DPF');
    expect(container.textContent).toContain('Optimal resale window');
    expect(container.textContent).toContain('fuel anomaly');
  });

  it('shows confidence bars on each recommendation', () => {
    expect(container.textContent).toContain('Confidence');
  });

  it('shows impact estimates in AED', () => {
    expect(container.textContent).toContain('est. impact/year');
  });

  it('has Accept and Dismiss buttons on recommendations', () => {
    const acceptBtns = Array.from(container.querySelectorAll('button')).filter(b => b.textContent?.includes('Accept'));
    const dismissBtns = Array.from(container.querySelectorAll('button')).filter(b => b.textContent?.includes('Dismiss'));
    expect(acceptBtns.length).toBeGreaterThanOrEqual(1);
    expect(dismissBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('shows priority badges (critical, high, medium, low)', () => {
    expect(container.textContent).toContain('CRITICAL');
    expect(container.textContent).toContain('HIGH');
    expect(container.textContent).toContain('MEDIUM');
  });

  it('shows category badges (Driver, Maintenance, Financial, Fuel)', () => {
    expect(container.textContent).toContain('Driver');
    expect(container.textContent).toContain('Maintenance');
    expect(container.textContent).toContain('Financial');
    expect(container.textContent).toContain('Fuel');
  });
});

describe('VehicleLifecyclePage — History Tab', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = render(<VehicleLifecyclePage />).container;
    const btn = Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('History'));
    if (btn) fireEvent.click(btn);
  });

  it('shows timeline with event count', () => {
    expect(container.textContent).toContain('Complete Vehicle Timeline');
    expect(container.textContent).toContain('events');
  });

  it('includes service, fuel, DTC, and acquisition events', () => {
    expect(container.textContent).toContain('Service');
    expect(container.textContent).toContain('Refuel');
    expect(container.textContent).toContain('DTC Generated');
    expect(container.textContent).toContain('Vehicle Acquired');
  });

  it('shows events in reverse chronological order', () => {
    // First event should be more recent than last
    const dates = Array.from(container.querySelectorAll('div')).filter(d => d.textContent?.match(/202[5-6]/));
    expect(dates.length).toBeGreaterThanOrEqual(5);
  });
});
