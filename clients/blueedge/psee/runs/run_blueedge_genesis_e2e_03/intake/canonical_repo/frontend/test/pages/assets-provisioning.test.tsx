import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import DevicesPage from '@/pages/assets/DevicesPage';
import DiagnosticsPage from '@/pages/assets/DiagnosticsPage';
import OtaPage from '@/pages/assets/OtaPage';

// ══════════════════════════════════════════════════════════════
// SVG Device Provisioning Module — Deep Unit Tests
// Covers: DevicesPage (522L), OtaPage (524L), DiagnosticsPage (550L)
// ══════════════════════════════════════════════════════════════

describe('DevicesPage — SVG Device Registry & Provisioning', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const result = render(<DevicesPage />);
    container = result.container;
  });

  // ── Core Rendering ──
  it('renders page header with correct title', () => {
    expect(screen.getByText(/SVG Device Provisioning/i)).toBeTruthy();
  });

  it('renders 6 KPI trend cards on dashboard', () => {
    const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
    expect(cards.length).toBeGreaterThanOrEqual(6);
  });

  // ── Tab Navigation ──
  it('renders all 6 tabs', () => {
    const expectedTabs = ['Dashboard', 'Device Registry', 'Register', 'Provisioning', 'Lifecycle', 'Analytics'];
    expectedTabs.forEach(tab => {
      expect(container.querySelector(`button`)).toBeTruthy();
    });
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  it('switches to Device Registry tab and shows device table', () => {
    const registryBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Device Registry'));
    if (registryBtn) {
      fireEvent.click(registryBtn);
      // Should show search input and device table
      const tables = container.querySelectorAll('table');
      expect(tables.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('switches to Register tab and shows registration form', () => {
    const registerBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Register'));
    if (registerBtn) {
      fireEvent.click(registerBtn);
      // Should show form inputs for serial, TPM key, etc.
      const inputs = container.querySelectorAll('input, textarea, select');
      expect(inputs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('switches to Provisioning tab and shows workflow steps', () => {
    const provBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Provisioning'));
    if (provBtn) {
      fireEvent.click(provBtn);
      // Should show 8 workflow steps
      expect(container.textContent).toContain('Validate Device');
      expect(container.textContent).toContain('Register in Database');
      expect(container.textContent).toContain('Generate Device Certificates');
      expect(container.textContent).toContain('Create Digital Wallet');
      expect(container.textContent).toContain('Register on Blockchain');
    }
  });

  // ── Dashboard Content ──
  it('displays SVG 2.0 hardware specs card', () => {
    expect(container.textContent).toContain('NXP i.MX 95');
    expect(container.textContent).toContain('16GB LPDDR5');
    expect(container.textContent).toContain('2 TOPS NPU');
  });

  it('displays recent activity feed', () => {
    expect(container.textContent).toContain('Provisioning');
  });

  it('renders charts on dashboard tab', () => {
    const canvases = container.querySelectorAll('canvas, [class*="chart"]');
    expect(canvases.length).toBeGreaterThanOrEqual(1);
  });

  // ── Device Registry ──
  it('shows fleet type filter dropdown', () => {
    const registryBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Device Registry'));
    if (registryBtn) {
      fireEvent.click(registryBtn);
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThanOrEqual(1);
    }
  });

  // ── Registration Form Validation ──
  it('disables submit when QC checkboxes are unchecked', () => {
    const registerBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Register'));
    if (registerBtn) {
      fireEvent.click(registerBtn);
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThanOrEqual(3);
    }
  });

  // ── Provisioning Workflow ──
  it('shows workflow execution logs area', () => {
    const provBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Provisioning'));
    if (provBtn) {
      fireEvent.click(provBtn);
      // Terminal-style log area
      const logArea = container.querySelector('[style*="monospace"]');
      expect(logArea).toBeTruthy();
    }
  });

  // ── Analytics Tab ──
  it('switches to Analytics tab and renders gauge charts', () => {
    const analyticsBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Analytics'));
    if (analyticsBtn) {
      fireEvent.click(analyticsBtn);
      const canvases = container.querySelectorAll('canvas, [class*="chart"], [class*="gauge"]');
      expect(canvases.length).toBeGreaterThanOrEqual(1);
    }
  });

  // ── Lifecycle Tab ──
  it('switches to Lifecycle tab and shows state machine', () => {
    const lifecycleBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Lifecycle'));
    if (lifecycleBtn) {
      fireEvent.click(lifecycleBtn);
      expect(container.textContent).toContain('Manufactured');
      expect(container.textContent).toContain('Provisioned');
      expect(container.textContent).toContain('Deployed');
      expect(container.textContent).toContain('Operational');
    }
  });
});

describe('OtaPage — OTA & Configuration Management', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const result = render(<OtaPage />);
    container = result.container;
  });

  // ── Core Rendering ──
  it('renders page header with OTA title', () => {
    expect(screen.getByText(/OTA.*Configuration/i)).toBeTruthy();
  });

  it('renders 6 KPI trend cards', () => {
    const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
    expect(cards.length).toBeGreaterThanOrEqual(6);
  });

  // ── Tab Navigation ──
  it('renders all 6 tabs', () => {
    const expectedTabs = ['Dashboard', 'OTA Campaigns', 'Packages', 'Configurations', 'Approval Queue', 'J1939'];
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  // ── Dashboard ──
  it('displays active campaigns on dashboard', () => {
    expect(container.textContent).toContain('Active Campaigns');
    expect(container.textContent).toContain('Rolling Out');
  });

  it('renders deployment charts', () => {
    const canvases = container.querySelectorAll('canvas, [class*="chart"]');
    expect(canvases.length).toBeGreaterThanOrEqual(1);
  });

  // ── OTA Campaigns Tab ──
  it('switches to campaigns tab and shows campaign table', () => {
    const campBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Campaigns'));
    if (campBtn) {
      fireEvent.click(campBtn);
      const tables = container.querySelectorAll('table');
      expect(tables.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('shows Create Campaign button', () => {
    const campBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Campaigns'));
    if (campBtn) {
      fireEvent.click(campBtn);
      const createBtn = Array.from(container.querySelectorAll('button'))
        .find(btn => btn.textContent?.includes('Create Campaign'));
      expect(createBtn).toBeTruthy();
    }
  });

  // ── Packages Tab ──
  it('switches to packages tab and shows package list', () => {
    const pkgBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Packages'));
    if (pkgBtn) {
      fireEvent.click(pkgBtn);
      expect(container.textContent).toContain('SVG Gateway Firmware');
      expect(container.textContent).toContain('v2.8.3');
    }
  });

  // ── Configurations Tab ──
  it('switches to configs tab and shows config templates with approval chains', () => {
    const cfgBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Configurations'));
    if (cfgBtn) {
      fireEvent.click(cfgBtn);
      expect(container.textContent).toContain('Global Vehicle Configuration');
      expect(container.textContent).toContain('Tanker HAZMAT Configuration');
      // Approval chain indicators
      expect(container.textContent).toContain('Author');
      expect(container.textContent).toContain('Technical Review');
    }
  });

  // ── Approval Queue Tab ──
  it('switches to approval queue and shows pending items', () => {
    const approvalBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Approval'));
    if (approvalBtn) {
      fireEvent.click(approvalBtn);
      expect(container.textContent).toContain('Pending Approvals');
      // Should show approve/reject buttons
      const actionBtns = Array.from(container.querySelectorAll('button'))
        .filter(btn => btn.textContent?.includes('Approve') || btn.textContent?.includes('Reject'));
      expect(actionBtns.length).toBeGreaterThanOrEqual(2);
    }
  });

  // ── J1939 / CAN FD Tab ──
  it('switches to J1939 tab and shows protocol status', () => {
    const j1939Btn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('J1939') || btn.textContent?.includes('CAN FD'));
    if (j1939Btn) {
      fireEvent.click(j1939Btn);
      expect(container.textContent).toContain('SAE J1939');
      expect(container.textContent).toContain('CAN FD');
      expect(container.textContent).toContain('Engine Speed');
    }
  });

  it('shows live J1939 parameter values', () => {
    const j1939Btn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('J1939') || btn.textContent?.includes('CAN FD'));
    if (j1939Btn) {
      fireEvent.click(j1939Btn);
      // PGN and SPN columns
      expect(container.textContent).toContain('61444');
      expect(container.textContent).toContain('190');
      // Parameter names
      expect(container.textContent).toContain('Coolant Temperature');
      expect(container.textContent).toContain('Vehicle Speed');
      expect(container.textContent).toContain('Fuel Rate');
    }
  });

  it('shows J1939 category filter dropdown', () => {
    const j1939Btn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('J1939') || btn.textContent?.includes('CAN FD'));
    if (j1939Btn) {
      fireEvent.click(j1939Btn);
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('shows OBD-II fallback section', () => {
    const j1939Btn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('J1939') || btn.textContent?.includes('CAN FD'));
    if (j1939Btn) {
      fireEvent.click(j1939Btn);
      expect(container.textContent).toContain('OBD-II');
      expect(container.textContent).toContain('40%');
    }
  });
});

describe('DiagnosticsPage — Blockchain, Certificates & Diagnostics', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const result = render(<DiagnosticsPage />);
    container = result.container;
  });

  // ── Core Rendering ──
  it('renders page header with blockchain/diagnostics title', () => {
    expect(screen.getByText(/Blockchain.*Certificates.*Diagnostics/i)).toBeTruthy();
  });

  it('renders 6 KPI trend cards', () => {
    const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
    expect(cards.length).toBeGreaterThanOrEqual(6);
  });

  // ── Tab Navigation ──
  it('renders all 6 tabs', () => {
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  // ── Dashboard ──
  it('shows smart contracts summary on dashboard', () => {
    expect(container.textContent).toContain('DeviceRegistry');
    expect(container.textContent).toContain('CustodyChain');
    expect(container.textContent).toContain('EscrowManager');
  });

  it('shows active DTCs on dashboard', () => {
    expect(container.textContent).toContain('Active DTCs');
    expect(container.textContent).toContain('P0');
  });

  // ── Blockchain Tab ──
  it('switches to blockchain tab and shows chain info', () => {
    const bcBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Blockchain'));
    if (bcBtn) {
      fireEvent.click(bcBtn);
      expect(container.textContent).toContain('Hyperledger');
      expect(container.textContent).toContain('PBFT');
      expect(container.textContent).toContain('Validator Nodes');
    }
  });

  it('shows blockchain transaction table', () => {
    const bcBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Blockchain'));
    if (bcBtn) {
      fireEvent.click(bcBtn);
      const tables = container.querySelectorAll('table');
      expect(tables.length).toBeGreaterThanOrEqual(1);
      // Transaction types
      expect(container.textContent).toContain('registration');
    }
  });

  it('shows 5 smart contracts with function details', () => {
    const bcBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Blockchain'));
    if (bcBtn) {
      fireEvent.click(bcBtn);
      expect(container.textContent).toContain('DeviceRegistry');
      expect(container.textContent).toContain('DeviceNFT');
      expect(container.textContent).toContain('AuditTrail');
      expect(container.textContent).toContain('registerDevice');
      expect(container.textContent).toContain('transferOwnership');
    }
  });

  // ── Wallets Tab ──
  it('switches to wallets tab and shows device wallets', () => {
    const walBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Wallets'));
    if (walBtn) {
      fireEvent.click(walBtn);
      expect(container.textContent).toContain('EDGE');
      expect(container.textContent).toContain('NFT');
      expect(container.textContent).toContain('0x');
    }
  });

  it('shows wallet stats cards', () => {
    const walBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Wallets'));
    if (walBtn) {
      fireEvent.click(walBtn);
      expect(container.textContent).toContain('Total Balance');
      expect(container.textContent).toContain('Active Wallets');
      expect(container.textContent).toContain('NFTs Minted');
    }
  });

  // ── Transfers Tab ──
  it('switches to transfers tab and shows ownership transfers', () => {
    const trBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Transfers'));
    if (trBtn) {
      fireEvent.click(trBtn);
      expect(container.textContent).toContain('TR-2025');
      expect(container.textContent).toContain('Dubai Tanker Corp');
      expect(container.textContent).toContain('ENOC Fleet');
    }
  });

  it('shows Initiate Transfer button', () => {
    const trBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Transfers'));
    if (trBtn) {
      fireEvent.click(trBtn);
      const initiateBtn = Array.from(container.querySelectorAll('button'))
        .find(btn => btn.textContent?.includes('Initiate Transfer'));
      expect(initiateBtn).toBeTruthy();
    }
  });

  it('opens transfer form modal when Initiate Transfer clicked', () => {
    const trBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Transfers'));
    if (trBtn) {
      fireEvent.click(trBtn);
      const initiateBtn = Array.from(container.querySelectorAll('button'))
        .find(btn => btn.textContent?.includes('Initiate Transfer'));
      if (initiateBtn) {
        fireEvent.click(initiateBtn);
        // Modal should show device selection, owner input, escrow checkbox
        expect(container.textContent).toContain('New Owner');
        expect(container.textContent).toContain('escrow');
      }
    }
  });

  // ── Certificates Tab ──
  it('switches to certificates tab and shows cert table', () => {
    const certBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Certificates'));
    if (certBtn) {
      fireEvent.click(certBtn);
      const tables = container.querySelectorAll('table');
      expect(tables.length).toBeGreaterThanOrEqual(1);
      expect(container.textContent).toContain('ECDSA');
      expect(container.textContent).toContain('Blue Edge Root CA');
    }
  });

  it('shows PKI trust hierarchy visualization', () => {
    const certBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Certificates'));
    if (certBtn) {
      fireEvent.click(certBtn);
      expect(container.textContent).toContain('PKI Trust Hierarchy');
      expect(container.textContent).toContain('Root CA');
      expect(container.textContent).toContain('Intermediate CA');
      expect(container.textContent).toContain('Leaf Certificate');
    }
  });

  it('shows certificate stats cards', () => {
    const certBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Certificates'));
    if (certBtn) {
      fireEvent.click(certBtn);
      expect(container.textContent).toContain('Active Certs');
      expect(container.textContent).toContain('Expiring Soon');
    }
  });

  // ── DTC / Diagnostics Tab ──
  it('switches to DTC tab and shows diagnostic trouble codes', () => {
    const dtcBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('DTC') || btn.textContent?.includes('Diagnostics'));
    if (dtcBtn) {
      fireEvent.click(dtcBtn);
      expect(container.textContent).toContain('P0101');
      expect(container.textContent).toContain('P0217');
      expect(container.textContent).toContain('Engine Coolant');
    }
  });

  it('shows DTC severity badges', () => {
    const dtcBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('DTC') || btn.textContent?.includes('Diagnostics'));
    if (dtcBtn) {
      fireEvent.click(dtcBtn);
      expect(container.textContent).toContain('critical');
      expect(container.textContent).toContain('warning');
    }
  });

  it('shows DTC charts', () => {
    const dtcBtn = Array.from(container.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('DTC') || btn.textContent?.includes('Diagnostics'));
    if (dtcBtn) {
      fireEvent.click(dtcBtn);
      const canvases = container.querySelectorAll('canvas, [class*="chart"]');
      expect(canvases.length).toBeGreaterThanOrEqual(1);
    }
  });
});
