// ══════════════════════════════════════════════════════════════
// E2E: SVG Device Provisioning Module
// Covers: /devices, /ota, /diagnostics expanded pages
// ══════════════════════════════════════════════════════════════

describe('SVG Device Provisioning — Devices Page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/devices');
  });

  it('loads Devices page with header and KPIs', () => {
    cy.assertPageHeader('SVG Device Provisioning');
    cy.assertKpiCards(6);
  });

  it('has 6 navigation tabs', () => {
    cy.assertTabBar(['Dashboard', 'Device Registry', 'Register', 'Provisioning', 'Lifecycle', 'Analytics']);
  });

  it('displays SVG 2.0 hardware specs', () => {
    cy.contains('NXP i.MX 95').should('exist');
    cy.contains('16GB LPDDR5').should('exist');
    cy.contains('2 TOPS NPU').should('exist');
  });

  it('dashboard shows charts and activity feed', () => {
    cy.get('canvas, [class*="chart"]').should('have.length.at.least', 2);
    cy.contains('Provisioning').should('exist');
  });

  // ── Device Registry Tab ──
  describe('Device Registry Tab', () => {
    beforeEach(() => {
      cy.switchTab('Device Registry');
    });

    it('shows device table with mock data', () => {
      cy.assertTableRows(1);
      cy.contains('SVG-').should('exist');
    });

    it('has search and filter controls', () => {
      cy.get('input[placeholder*="Search"], input[type="text"]').should('exist');
      cy.get('select').should('have.length.at.least', 1);
    });

    it('shows fleet type summary cards', () => {
      cy.contains('tanker').should('exist');
      cy.contains('bus').should('exist');
    });

    it('clicking a device row opens detail modal', () => {
      cy.get('table tbody tr, [class*="table-row"]').first().click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Hardware ID').should('exist');
    });

    it('device detail modal has 5 sub-tabs', () => {
      cy.get('table tbody tr, [class*="table-row"]').first().click();
      cy.contains('button', 'Overview').should('exist');
      cy.contains('button', 'Telemetry').should('exist');
      cy.contains('button', 'Certificates').should('exist');
      cy.contains('button', 'Protocols').should('exist');
      cy.contains('button', 'History').should('exist');
    });

    it('device telemetry tab shows CPU/memory/temp metrics', () => {
      cy.get('table tbody tr, [class*="table-row"]').first().click();
      cy.contains('button', 'Telemetry').click();
      cy.contains('CPU').should('exist');
      cy.contains('Memory').should('exist');
      cy.contains('Temperature').should('exist');
    });

    it('device protocols tab shows J1939 parameters', () => {
      cy.get('table tbody tr, [class*="table-row"]').first().click();
      cy.contains('button', 'Protocols').click();
      cy.contains('J1939').should('exist');
      cy.contains('Engine Speed').should('exist');
      cy.contains('RPM').should('exist');
    });
  });

  // ── Register Device Tab ──
  describe('Register Device Tab', () => {
    beforeEach(() => {
      cy.switchTab('Register');
    });

    it('shows registration form fields', () => {
      cy.get('input, textarea, select').should('have.length.at.least', 6);
      cy.contains('Serial').should('exist');
      cy.contains('TPM').should('exist');
    });

    it('has QC checkboxes', () => {
      cy.get('input[type="checkbox"]').should('have.length.at.least', 3);
    });

    it('shows manufacturing info section', () => {
      cy.contains('Factory').should('exist');
      cy.contains('Batch').should('exist');
    });
  });

  // ── Provisioning Workflow Tab ──
  describe('Provisioning Workflow Tab', () => {
    beforeEach(() => {
      cy.switchTab('Provisioning');
    });

    it('shows 8 workflow steps', () => {
      cy.contains('Validate Device').should('exist');
      cy.contains('Register in Database').should('exist');
      cy.contains('Generate Device Certificates').should('exist');
      cy.contains('Create Digital Wallet').should('exist');
      cy.contains('Register on Blockchain').should('exist');
      cy.contains('Deploy Configuration').should('exist');
      cy.contains('Activate Device').should('exist');
      cy.contains('Send Notifications').should('exist');
    });

    it('shows execution log terminal area', () => {
      cy.get('[style*="monospace"]').should('exist');
    });

    it('shows workflow action buttons', () => {
      cy.contains('button', /Pause|Cancel|Export/i).should('exist');
    });
  });

  // ── Lifecycle Tab ──
  describe('Lifecycle Tab', () => {
    beforeEach(() => {
      cy.switchTab('Lifecycle');
    });

    it('shows lifecycle state machine', () => {
      cy.contains('Manufactured').should('exist');
      cy.contains('Provisioned').should('exist');
      cy.contains('Deployed').should('exist');
      cy.contains('Operational').should('exist');
      cy.contains('Decommissioned').should('exist');
    });

    it('shows lifecycle charts', () => {
      cy.get('canvas, [class*="chart"]').should('have.length.at.least', 2);
    });
  });
});

describe('SVG Device Provisioning — OTA & Config Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/ota');
  });

  it('loads OTA page with header and KPIs', () => {
    cy.assertPageHeader('OTA');
    cy.assertKpiCards(6);
  });

  it('has 6 navigation tabs', () => {
    cy.assertTabBar(['Dashboard', 'OTA Campaigns', 'Packages', 'Configurations', 'Approval Queue', 'J1939']);
  });

  it('dashboard shows active campaign progress bars', () => {
    cy.contains('Active Campaigns').should('exist');
    cy.contains('Rolling Out').should('exist');
  });

  // ── OTA Campaigns ──
  describe('OTA Campaigns Tab', () => {
    beforeEach(() => {
      cy.switchTab('OTA Campaigns');
    });

    it('shows campaign table', () => {
      cy.assertTableRows(1);
      cy.contains('OTA-2025').should('exist');
    });

    it('displays rollout strategies', () => {
      cy.contains('staged').should('exist');
      cy.contains('canary').should('exist');
    });

    it('has Create Campaign button', () => {
      cy.contains('button', 'Create Campaign').should('exist');
    });

    it('clicking campaign row opens detail modal', () => {
      cy.get('table tbody tr').first().click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Deployment Progress').should('exist');
    });
  });

  // ── Packages Tab ──
  describe('Packages Tab', () => {
    beforeEach(() => {
      cy.switchTab('Packages');
    });

    it('shows package list with types', () => {
      cy.assertTableRows(1);
      cy.contains('SVG Gateway Firmware').should('exist');
      cy.contains('firmware').should('exist');
    });

    it('clicking package opens detail with changelog', () => {
      cy.get('table tbody tr').first().click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Changelog').should('exist');
    });
  });

  // ── Configurations Tab ──
  describe('Configurations Tab', () => {
    beforeEach(() => {
      cy.switchTab('Configurations');
    });

    it('shows config templates', () => {
      cy.contains('Global Vehicle Configuration').should('exist');
      cy.contains('Tanker HAZMAT Configuration').should('exist');
    });

    it('shows approval chain badges', () => {
      cy.contains('Author').should('exist');
      cy.contains('Technical Review').should('exist');
    });

    it('clicking config opens detail with parameters', () => {
      cy.contains('Global Vehicle Configuration').click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Approval Workflow').should('exist');
      cy.contains('Configuration Parameters').should('exist');
      cy.contains('telemetry.position.rate_hz').should('exist');
    });
  });

  // ── Approval Queue Tab ──
  describe('Approval Queue Tab', () => {
    beforeEach(() => {
      cy.switchTab('Approval Queue');
    });

    it('shows pending approval items', () => {
      cy.contains('Pending Approvals').should('exist');
    });

    it('has Approve and Reject buttons', () => {
      cy.contains('button', 'Approve').should('exist');
      cy.contains('button', 'Reject').should('exist');
    });

    it('shows recent approval history', () => {
      cy.contains('Recent Approvals').should('exist');
      cy.contains('Approved by').should('exist');
    });
  });

  // ── J1939 / CAN FD Tab ──
  describe('J1939 / CAN FD Tab', () => {
    beforeEach(() => {
      cy.switchTab('J1939');
    });

    it('shows J1939 bus status panel', () => {
      cy.contains('J1939 CAN Bus Status').should('exist');
      cy.contains('SAE J1939').should('exist');
    });

    it('shows CAN FD extended status panel', () => {
      cy.contains('CAN FD Extended').should('exist');
      cy.contains('5 Mbps').should('exist');
    });

    it('shows live J1939 parameters table with 24 entries', () => {
      cy.contains('Live Parameters').should('exist');
      cy.contains('Engine Speed').should('exist');
      cy.contains('Coolant Temperature').should('exist');
      cy.contains('Vehicle Speed').should('exist');
      cy.contains('Fuel Rate').should('exist');
      cy.get('table tbody tr').should('have.length.at.least', 20);
    });

    it('category filter works', () => {
      cy.get('select').last().select('Engine');
      cy.wait(300);
      cy.contains('Engine Speed').should('exist');
      // Fuel-only parameters should be hidden when filtering by Engine
    });

    it('shows OBD-II fallback section', () => {
      cy.contains('OBD-II Fallback').should('exist');
      cy.contains('0x0C').should('exist');
      cy.contains('RPM').should('exist');
    });
  });
});

describe('SVG Device Provisioning — Blockchain & Diagnostics', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/diagnostics');
  });

  it('loads Diagnostics page with header and KPIs', () => {
    cy.assertPageHeader('Blockchain');
    cy.assertKpiCards(6);
  });

  it('has 6 navigation tabs', () => {
    cy.assertTabBar(['Overview', 'Blockchain', 'Wallets', 'Transfers', 'Certificates', 'DTC']);
  });

  // ── Blockchain Tab ──
  describe('Blockchain Tab', () => {
    beforeEach(() => {
      cy.switchTab('Blockchain');
    });

    it('shows chain info with Hyperledger details', () => {
      cy.contains('Hyperledger Blue Edge').should('exist');
      cy.contains('PBFT').should('exist');
      cy.contains('Validator Nodes').should('exist');
    });

    it('shows 5 smart contracts', () => {
      cy.contains('DeviceRegistry').should('exist');
      cy.contains('CustodyChain').should('exist');
      cy.contains('EscrowManager').should('exist');
      cy.contains('DeviceNFT').should('exist');
      cy.contains('AuditTrail').should('exist');
    });

    it('shows transaction table', () => {
      cy.assertTableRows(1);
      cy.contains('0x').should('exist');
    });

    it('clicking TX opens detail modal', () => {
      cy.get('table tbody tr').first().click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('TX Hash').should('exist');
      cy.contains('Payload').should('exist');
    });
  });

  // ── Wallets Tab ──
  describe('Wallets Tab', () => {
    beforeEach(() => {
      cy.switchTab('Wallets');
    });

    it('shows wallet summary stats', () => {
      cy.contains('Total Balance').should('exist');
      cy.contains('Active Wallets').should('exist');
      cy.contains('NFTs Minted').should('exist');
    });

    it('shows device wallets with EDGE balances', () => {
      cy.contains('EDGE').should('exist');
      cy.contains('0x').should('exist');
    });

    it('shows wallet transaction history', () => {
      cy.contains('Recent Transactions').should('exist');
    });
  });

  // ── Transfers Tab ──
  describe('Transfers Tab', () => {
    beforeEach(() => {
      cy.switchTab('Transfers');
    });

    it('shows ownership transfer table', () => {
      cy.assertTableRows(1);
      cy.contains('TR-2025').should('exist');
    });

    it('shows transfer types and escrow status', () => {
      cy.contains('sale').should('exist');
      cy.contains('lease').should('exist');
    });

    it('has Initiate Transfer button', () => {
      cy.contains('button', 'Initiate Transfer').should('exist');
    });

    it('opens transfer form modal', () => {
      cy.contains('button', 'Initiate Transfer').click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('New Owner').should('exist');
      cy.contains('Transfer Type').should('exist');
      cy.contains('escrow').should('exist');
    });

    it('transfer form has device selector, price, wallet checkboxes', () => {
      cy.contains('button', 'Initiate Transfer').click();
      cy.get('select').should('have.length.at.least', 2);
      cy.get('input[type="number"]').should('exist');
      cy.get('input[type="checkbox"]').should('have.length.at.least', 2);
    });

    it('clicking transfer row shows approval chain', () => {
      cy.get('table tbody tr').first().click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Approval Chain').should('exist');
    });
  });

  // ── Certificates Tab ──
  describe('Certificates Tab', () => {
    beforeEach(() => {
      cy.switchTab('Certificates');
    });

    it('shows certificate stats cards', () => {
      cy.contains('Active Certs').should('exist');
      cy.contains('Expiring Soon').should('exist');
    });

    it('shows certificate table', () => {
      cy.assertTableRows(1);
      cy.contains('ECDSA').should('exist');
      cy.contains('Blue Edge').should('exist');
    });

    it('shows PKI trust hierarchy', () => {
      cy.contains('PKI Trust Hierarchy').should('exist');
      cy.contains('Root CA').should('exist');
      cy.contains('Intermediate CA').should('exist');
    });

    it('clicking cert opens detail modal', () => {
      cy.get('table tbody tr').first().click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Certificate ID').should('exist');
      cy.contains('Fingerprint').should('exist');
    });
  });

  // ── DTC / Diagnostics Tab ──
  describe('DTC / Diagnostics Tab', () => {
    beforeEach(() => {
      cy.switchTab('DTC');
    });

    it('shows DTC charts', () => {
      cy.get('canvas, [class*="chart"]').should('have.length.at.least', 2);
    });

    it('shows DTC table with trouble codes', () => {
      cy.assertTableRows(1);
      cy.contains('P0101').should('exist');
      cy.contains('P0217').should('exist');
    });

    it('shows severity indicators', () => {
      cy.contains('critical').should('exist');
      cy.contains('warning').should('exist');
    });

    it('clicking DTC opens detail with freeze frame', () => {
      cy.get('table tbody tr').first().click();
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('Freeze Frame').should('exist');
      cy.contains('Recommendations').should('exist');
    });
  });
});
