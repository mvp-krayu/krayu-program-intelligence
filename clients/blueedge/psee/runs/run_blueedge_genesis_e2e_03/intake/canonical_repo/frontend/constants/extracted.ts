// ═══════════════════════════════════════════════════
// Blue Edge — Extracted Constants from dashboard.html
// Lines 768-791
// ═══════════════════════════════════════════════════

const ROLE_PERMISSIONS = {
  admin: { label: 'Administrator', access: '*', description: 'Full platform access' },
  manager: {
    label: 'Fleet Manager', description: 'Operations & reporting access',
    access: ['overview','vehicles','drivers','trips','fleets','operations','tanker','bus','taxi','surge',
      'alerts','safety','compliance','permits','crossborder','fatigue','maintenance','fuel','devices',
      'diagnostics','ota','lifecycle','parts','ev','v2g','electrification','depot','charging','coldchain',
      'executive','analytics','anomaly','reports','incentives','notifications','finance','auditlog','preferences']
  },
  dispatcher: {
    label: 'Dispatcher', description: 'Day-to-day fleet operations',
    access: ['overview','vehicles','drivers','trips','operations','tanker','bus','taxi','alerts','safety',
      'maintenance','fuel','coldchain','notifications','drivermobile','preferences']
  },
  driver: {
    label: 'Driver', description: 'Personal driving dashboard',
    access: ['overview','trips','alerts','safety','drivermobile','notifications','fatigue','incentives','preferences']
  },
  viewer: {
    label: 'Viewer', description: 'Read-only analytics access',
    access: ['overview','analytics','reports','executive','preferences']
  }
};

