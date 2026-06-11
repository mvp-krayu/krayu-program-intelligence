// Extracted from dashboard.html — Sidebar
// Line 5124 | 113 lines

import { useI18n } from '@/hooks';
import { hasAccess } from '@/utils';
import { ROLE_PERMISSIONS, PAGE_MAP } from '@/constants';

export default function Sidebar({ active, onNav, alertCount, userRole, className, favorites, onToggleFav }: any) {
  const { t } = useI18n();
  const sections = [
    { title: t('Fleet Operations'), items: [
      { id: 'overview', label: t('Overview'), icon: 'dashboard' },
      { id: 'vehicles', label: t('Vehicles'), icon: 'truck' },
      { id: 'drivers', label: t('Drivers'), icon: 'users' },
      { id: 'trips', label: t('Trips'), icon: 'route' },
      { id: 'fleets', label: t('Fleets'), icon: 'fleets' },
      { id: 'operations', label: t('Operations'), icon: 'ops' },
    ]},
    { title: t('Industry Verticals'), items: [
      { id: 'tanker', label: t('Tanker Ops'), icon: 'tanker' },
      { id: 'bus', label: t('Bus Transit'), icon: 'bus' },
      { id: 'taxi', label: t('Taxi / Ride-hail'), icon: 'taxi' },
      { id: 'surge', label: t('Surge Pricing'), icon: 'surge' },
    ]},
    { title: t('Safety & Compliance'), items: [
      { id: 'alerts', label: t('Alerts'), icon: 'alert', badge: alertCount },
      { id: 'safety', label: t('Safety'), icon: 'safety' },
      { id: 'compliance', label: t('Compliance'), icon: 'shield' },
      { id: 'permits', label: t('Permits'), icon: 'permit' },
      { id: 'crossborder', label: t('Cross-Border'), icon: 'border' },
      { id: 'fatigue', label: t('Fatigue Risk'), icon: 'fatigue' },
    ]},
    { title: t('Asset Management'), items: [
      { id: 'maintenance', label: t('Maintenance'), icon: 'wrench' },
      { id: 'fuel', label: t('Fuel'), icon: 'fuel' },
      { id: 'devices', label: t('IoT Devices'), icon: 'device' },
      { id: 'diagnostics', label: t('Diagnostics'), icon: 'diag' },
      { id: 'ota', label: t('OTA Updates'), icon: 'ota' },
      { id: 'lifecycle', label: t('Fleet Lifecycle'), icon: 'lifecycle' },
      { id: 'parts', label: t('Parts Market'), icon: 'parts' },
    ]},
    { title: t('EV & Energy'), items: [
      { id: 'ev', label: t('EV Management'), icon: 'ev' },
      { id: 'v2g', label: t('V2G Energy'), icon: 'v2g' },
      { id: 'electrification', label: t('Electrification'), icon: 'elec' },
      { id: 'depot', label: t('Depot Charging'), icon: 'depot' },
      { id: 'charging', label: t('Charging Stations'), icon: 'charging' },
      { id: 'coldchain', label: t('Cold Chain'), icon: 'cold' },
    ]},
    { title: t('Intelligence'), items: [
      { id: 'executive', label: t('Executive'), icon: 'chart' },
      { id: 'analytics', label: t('Analytics'), icon: 'analytics' },
      { id: 'anomaly', label: t('Anomaly Detection'), icon: 'anomaly' },
      { id: 'blockchain', label: t('Blockchain'), icon: 'blockchain' },
      { id: 'reports', label: t('Reports'), icon: 'report' },
    ]},
    { title: t('People & Access'), items: [
      { id: 'users', label: t('Users'), icon: 'user' },
      { id: 'incentives', label: t('Driver Incentives'), icon: 'incentive' },
      { id: 'drivermobile', label: t('Driver Mobile'), icon: 'mobile' },
      { id: 'notifications', label: t('Notifications'), icon: 'notif' },
      { id: 'customer', label: t('Customer Portal'), icon: 'customer' },
      { id: 'whitelabel', label: t('White Label'), icon: 'whitelabel' },
      { id: 'finance', label: t('Finance'), icon: 'finance' },
      { id: 'auditlog', label: t('Audit Log'), icon: 'audit' },
      { id: 'preferences', label: t('Preferences'), icon: 'settings' },
    ]},
  ];

  // Filter sections by RBAC
  const filteredSections = sections.map(s => ({
    ...s,
    items: s.items.filter(item => hasAccess(userRole, item.id))
  })).filter(s => s.items.length > 0);

  const roleInfo = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.viewer;
  const accessCount = roleInfo.access === '*' ? Object.keys(PAGE_MAP).length : roleInfo.access.length;

  return (
    <nav className={`sidebar ${className || ''}`}>
      <div style={{padding:'8px 12px 4px',borderBottom:'1px solid var(--border)',marginBottom:4}}>
        <div className={`role-badge role-${userRole}`}>{roleInfo.label}</div>
        <div style={{fontSize:'.6rem',color:'var(--text-muted)',marginTop:4}}>{accessCount} modules accessible</div>
      </div>
      {/* Favorites Section */}
      {favorites && favorites.length > 0 && (
        <div className="fav-section">
          <div className="fav-section-title">⭐ {t('Favorites')}</div>
          {favorites.map(fId => {
            const item = filteredSections.flatMap(s => s.items).find(i => i.id === fId);
            if (!item) return null;
            return (
              <div key={fId} className={`fav-item ${active===fId?'active':''}`} onClick={() => onNav(fId)}>
                <Icon name={item.icon} /><span>{item.label}</span>
                <span className="fav-pin pinned" onClick={e => { e.stopPropagation(); onToggleFav(fId); }} title="Unpin">★</span>
              </div>
            );
          })}
        </div>
      )}
      {filteredSections.map(s => (
        <div key={s.title} className="nav-section">
          <div className="nav-section-title">{s.title}</div>
          {s.items.map(item => (
            <div key={item.id} className={`nav-item ${active===item.id?'active':''}`} onClick={() => onNav(item.id)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              {onToggleFav && <span className={`fav-pin ${favorites?.includes(item.id)?'pinned':''}`} onClick={e => { e.stopPropagation(); onToggleFav(item.id); }} title={favorites?.includes(item.id)?'Unpin':'Pin to favorites'}>{favorites?.includes(item.id)?'★':'☆'}</span>}
            </div>
          ))}
        </div>
      ))}
      <div style={{padding:'8px 12px',borderTop:'1px solid var(--border)',marginTop:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:'.6rem',color:'var(--text-muted)'}}>Press <span className="kbd">⌘K</span> to search · <span className="kbd">?</span> shortcuts</span>
        <span style={{fontSize:'.6rem',color:'var(--text-muted)',fontFamily:'var(--mono)'}}>v3.0.0</span>
      </div>
    </nav>
  );
}
