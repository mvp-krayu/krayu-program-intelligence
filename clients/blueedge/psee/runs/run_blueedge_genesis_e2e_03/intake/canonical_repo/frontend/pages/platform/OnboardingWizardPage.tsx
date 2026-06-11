import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';

/* ── Steps Config ──────────────────────────────────────────────── */
const STEPS = [
  { key: 'company', title: 'Company Profile', titleAr: 'الملف التعريفي للشركة', icon: '🏢', est: '5 min' },
  { key: 'fleet', title: 'Fleet Setup', titleAr: 'إعداد الأسطول', icon: '🚛', est: '10 min' },
  { key: 'team', title: 'Team Setup', titleAr: 'إعداد الفريق', icon: '👥', est: '5 min' },
  { key: 'drivers', title: 'Drivers', titleAr: 'تسجيل السائقين', icon: '🪪', est: '10 min' },
  { key: 'integrations', title: 'Integrations', titleAr: 'التكاملات', icon: '🔗', est: '8 min' },
  { key: 'golive', title: 'Go Live', titleAr: 'قائمة الإطلاق', icon: '🚀', est: '5 min' },
];

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

const FLEET_TYPES = [
  { id: 'tanker', name: 'Oil & Gas Tankers', nameAr: 'ناقلات النفط والغاز', icon: '🛢️', desc: 'HAZMAT cargo, custody transfers' },
  { id: 'bus', name: 'Bus Transit', nameAr: 'حافلات النقل', icon: '🚌', desc: 'Route management, scheduling' },
  { id: 'taxi', name: 'Taxi Fleet', nameAr: 'أسطول سيارات الأجرة', icon: '🚕', desc: 'Surge pricing, ride matching' },
  { id: 'logistics', name: 'Logistics & Delivery', nameAr: 'اللوجستيات', icon: '📦', desc: 'Route optimization, POD' },
  { id: 'ev', name: 'Electric Vehicles', nameAr: 'المركبات الكهربائية', icon: '⚡', desc: 'Battery, charging, V2G' },
];

const ROLES = [
  { role: 'admin', name: 'Administrator', nameAr: 'مدير النظام', icon: '👑', desc: 'Full access, billing', rec: '1-2' },
  { role: 'fleet_manager', name: 'Fleet Manager', nameAr: 'مدير الأسطول', icon: '📊', desc: 'Vehicles, analytics', rec: '1 per fleet' },
  { role: 'dispatcher', name: 'Dispatcher', nameAr: 'المنسق', icon: '📡', desc: 'Trips, tracking', rec: '1 per shift' },
  { role: 'driver', name: 'Driver', nameAr: 'سائق', icon: '🚗', desc: 'Mobile access', rec: '1 per driver' },
  { role: 'viewer', name: 'Viewer', nameAr: 'مشاهد', icon: '👁️', desc: 'Read-only', rec: 'As needed' },
];

const INTEGRATIONS = [
  { cat: 'GPS & Telematics', items: [
    { id: 'teltonika', name: 'Teltonika FMB920', status: 'available', icon: '📡' },
    { id: 'queclink', name: 'Queclink GV300', status: 'available', icon: '📡' },
    { id: 'custom', name: 'Custom GPS Device', status: 'available', icon: '🔧' },
  ]},
  { cat: 'Fuel', items: [
    { id: 'enoc', name: 'ENOC Fuel Cards', status: 'available', icon: '⛽' },
    { id: 'adnoc', name: 'ADNOC Fuel Cards', status: 'coming_soon', icon: '⛽' },
  ]},
  { cat: 'ERP', items: [
    { id: 'sap', name: 'SAP S/4HANA', status: 'available', icon: '🏭' },
    { id: 'quickbooks', name: 'QuickBooks', status: 'available', icon: '📒' },
  ]},
  { cat: 'Communication', items: [
    { id: 'whatsapp', name: 'WhatsApp Business', status: 'available', icon: '💬' },
    { id: 'sms', name: 'SMS (Twilio)', status: 'available', icon: '📱' },
  ]},
];

const GO_LIVE = [
  { id: 'company', label: 'Company profile completed', status: 'done' },
  { id: 'vehicles', label: 'At least 1 vehicle added', status: 'done', count: 15 },
  { id: 'users', label: 'Team members invited', status: 'done', count: 4 },
  { id: 'drivers', label: 'Drivers registered', status: 'done', count: 12 },
  { id: 'gps', label: 'GPS devices connected', status: 'warning', count: 8, note: '8 of 15 connected' },
  { id: 'alerts', label: 'Alert rules configured', status: 'pending' },
  { id: 'geofences', label: 'Geofences defined', status: 'pending' },
  { id: 'trip', label: 'Test trip completed', status: 'pending' },
  { id: 'billing', label: 'Billing verified', status: 'done' },
];

/* ── Main Component ────────────────────────────────────────────── */
export default function OnboardingWizardPage() {
  const { connected: wsConnected } = useSocketContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFleets, setSelectedFleets] = useState<string[]>(['tanker']);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [invites, setInvites] = useState([{ email: '', role: 'fleet_manager' }]);

  const step = STEPS[currentStep];
  const progressPct = Math.round(((currentStep) / STEPS.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Onboarding" subtitle="Set up your fleet management platform — مرحبًا بك" />

      {/* ── Progress Bar ────────────────────────────────────────── */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-white font-medium">Setup Progress</div>
          <div className="text-xs text-slate-400">{progressPct}% complete · ~{STEPS.slice(currentStep).reduce((s, st) => s + parseInt(st.est), 0)} min remaining</div>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <button key={s.key} onClick={() => i <= currentStep && setCurrentStep(i)}
              className={`flex flex-col items-center gap-1 transition ${i <= currentStep ? 'cursor-pointer' : 'cursor-default opacity-40'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition ${
                i < currentStep ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                i === currentStep ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' :
                'bg-slate-700 text-slate-400'
              }`}>
                {i < currentStep ? '✓' : s.icon}
              </div>
              <span className={`text-[10px] hidden md:block ${i === currentStep ? 'text-cyan-400 font-medium' : 'text-slate-500'}`}>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step Content ────────────────────────────────────────── */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 min-h-[400px]">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{step.icon}</span>
          <div>
            <h2 className="text-lg text-white font-semibold">{step.title}</h2>
            <div className="text-xs text-slate-400">{step.titleAr} · Est. {step.est}</div>
          </div>
        </div>

        {/* Step 0: Company Profile */}
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Company Name" labelAr="اسم الشركة" placeholder="Blue Edge Network LLC" required />
            <FormField label="Trade License Number" labelAr="رقم الرخصة التجارية" placeholder="DED-2024-XXXXXX" required />
            <FormField label="Tax Registration (TRN)" labelAr="رقم التسجيل الضريبي" placeholder="TRN-100XXXXXXXXX" />
            <div>
              <label className="block text-xs text-slate-400 mb-1">Emirate <span className="text-slate-600">الإمارة</span></label>
              <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white">
                {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <FormField label="Business Address" labelAr="عنوان العمل" placeholder="JAFZA, Dubai, UAE" />
            <FormField label="Company Email" labelAr="البريد الإلكتروني" placeholder="admin@company.ae" type="email" required />
            <FormField label="Phone" labelAr="الهاتف" placeholder="+971 XX XXX XXXX" type="tel" required />
            <div>
              <label className="block text-xs text-slate-400 mb-1">Brand Color</label>
              <div className="flex gap-2">
                {['#0891b2', '#16a34a', '#dc2626', '#8b5cf6', '#f59e0b'].map(c => (
                  <button key={c} className="w-8 h-8 rounded-lg border-2 border-slate-600 hover:border-white transition" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Fleet Setup */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-white font-medium mb-3">Select Fleet Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {FLEET_TYPES.map(ft => {
                  const selected = selectedFleets.includes(ft.id);
                  return (
                    <button key={ft.id} onClick={() => setSelectedFleets(prev => selected ? prev.filter(x => x !== ft.id) : [...prev, ft.id])}
                      className={`text-left p-4 rounded-xl border transition ${selected ? 'bg-cyan-900/20 border-cyan-600' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}>
                      <div className="text-xl mb-1">{ft.icon}</div>
                      <div className="text-sm text-white font-medium">{ft.name}</div>
                      <div className="text-[10px] text-slate-400">{ft.nameAr}</div>
                      <div className="text-xs text-slate-400 mt-1">{ft.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-white font-medium mb-3">Import Vehicles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Add Manually', 'CSV Upload', 'Excel Upload', 'API Import'].map(m => (
                  <button key={m} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-cyan-600 text-xs text-slate-300 transition">
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Team Setup */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {ROLES.map(r => (
                <div key={r.role} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                  <div className="text-lg mb-1">{r.icon}</div>
                  <div className="text-sm text-white font-medium">{r.name}</div>
                  <div className="text-[10px] text-slate-400">{r.nameAr}</div>
                  <div className="text-xs text-slate-400 mt-1">{r.desc}</div>
                  <div className="text-[10px] text-cyan-400 mt-1">Rec: {r.rec}</div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm text-white font-medium mb-3">Invite Team Members</h3>
              <div className="space-y-2">
                {invites.map((inv, i) => (
                  <div key={i} className="flex gap-2">
                    <input className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500"
                      placeholder="email@company.ae" value={inv.email} onChange={e => {
                        const updated = [...invites]; updated[i].email = e.target.value; setInvites(updated);
                      }} />
                    <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white"
                      value={inv.role} onChange={e => {
                        const updated = [...invites]; updated[i].role = e.target.value; setInvites(updated);
                      }}>
                      {ROLES.map(r => <option key={r.role} value={r.role}>{r.name}</option>)}
                    </select>
                  </div>
                ))}
                <button onClick={() => setInvites(prev => [...prev, { email: '', role: 'viewer' }])}
                  className="text-xs text-cyan-400 hover:text-cyan-300">+ Add another</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Drivers */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" labelAr="الاسم الأول" placeholder="Mohammed" required />
              <FormField label="Last Name" labelAr="اسم العائلة" placeholder="Al Mansoori" required />
              <FormField label="Employee ID" placeholder="EMP-001" required />
              <FormField label="Phone" placeholder="+971 50 XXX XXXX" required />
              <FormField label="License Number" labelAr="رقم الرخصة" placeholder="DXB-DL-123456" required />
              <div>
                <label className="block text-xs text-slate-400 mb-1">License Type</label>
                <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white">
                  {['Light Vehicle', 'Heavy Vehicle', 'Bus', 'HAZMAT', 'Motorcycle'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <FormField label="License Expiry" type="date" required />
              <FormField label="Emirates ID" labelAr="رقم الهوية" placeholder="784-XXXX-XXXXXXX-X" />
            </div>
            <div>
              <h3 className="text-sm text-white font-medium mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {['HAZMAT', 'ADR', 'Defensive Driving', 'First Aid', 'Fatigue Mgmt'].map(c => (
                  <label key={c} className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-700">
                    <input type="checkbox" className="accent-cyan-500" />
                    <span className="text-xs text-slate-300">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="text-xs text-cyan-400 hover:text-cyan-300">📋 Or bulk import via CSV</button>
          </div>
        )}

        {/* Step 4: Integrations */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {INTEGRATIONS.map(cat => (
              <div key={cat.cat}>
                <h3 className="text-sm text-white font-medium mb-2">{cat.cat}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {cat.items.map(item => {
                    const connected = selectedIntegrations.includes(item.id);
                    return (
                      <button key={item.id} disabled={item.status === 'coming_soon'}
                        onClick={() => setSelectedIntegrations(prev => connected ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                        className={`text-left p-3 rounded-lg border transition ${
                          item.status === 'coming_soon' ? 'opacity-40 cursor-not-allowed bg-slate-700/30 border-slate-700' :
                          connected ? 'bg-cyan-900/20 border-cyan-600' :
                          'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                        }`}>
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-sm text-white">{item.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {item.status === 'coming_soon' ? 'Coming Soon' : connected ? '✓ Connected' : 'Click to connect'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Go Live */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <ReadinessGauge score={72} />
              <div>
                <div className="text-white font-semibold">Readiness Score: 72%</div>
                <div className="text-xs text-slate-400">6 of 9 items complete · 2 blockers remaining</div>
              </div>
            </div>
            <div className="space-y-2">
              {GO_LIVE.map(item => (
                <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                  item.status === 'done' ? 'bg-emerald-900/10 border border-emerald-700/20' :
                  item.status === 'warning' ? 'bg-amber-900/10 border border-amber-700/20' :
                  'bg-slate-700/30 border border-slate-700'
                }`}>
                  <span className="text-sm">
                    {item.status === 'done' ? '✅' : item.status === 'warning' ? '⚠️' : '⬜'}
                  </span>
                  <span className={`text-sm flex-1 ${item.status === 'done' ? 'text-emerald-300' : item.status === 'warning' ? 'text-amber-300' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {item.count && <span className="text-xs text-slate-400">{item.count}</span>}
                  {item.note && <span className="text-xs text-amber-400">{item.note}</span>}
                </div>
              ))}
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="text-sm text-white font-medium mb-2">📚 Support Resources</h3>
              <div className="grid grid-cols-2 gap-3">
                <ResourceLink icon="🎥" title="Platform Tour" detail="8 min video" />
                <ResourceLink icon="📖" title="Quick Start Guide" detail="12 pages" />
                <ResourceLink icon="🎥" title="Alerts & Geofences" detail="5 min video" />
                <ResourceLink icon="📞" title="Book Onboarding Call" detail="30 min with specialist" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div className="flex justify-between">
        <button onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm disabled:opacity-30 hover:bg-slate-600 transition">
          ← Previous
        </button>
        <button onClick={() => currentStep < 5 ? setCurrentStep(currentStep + 1) : null}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
            currentStep === 5
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-cyan-600 text-white hover:bg-cyan-500'
          }`}>
          {currentStep === 5 ? '🚀 Go Live!' : `Next: ${STEPS[currentStep + 1]?.title} →`}
        </button>
      </div>
    </div>
  );
}

/* ── Form Field Component ──────────────────────────────────────── */
function FormField({ label, labelAr, placeholder, type = 'text', required }: any) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
        {labelAr && <span className="text-slate-600 ml-1">{labelAr}</span>}
      </label>
      <input type={type} placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none" />
    </div>
  );
}

/* ── Readiness Gauge ───────────────────────────────────────────── */
function ReadinessGauge({ score }: { score: number }) {
  const r = 40, c = Math.PI * 2 * r;
  const offset = c - (score / 100) * c;
  const color = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="90" height="90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 50 50)" className="transition-all duration-700" />
      <text x="50" y="46" textAnchor="middle" className="fill-white text-lg font-bold">{score}%</text>
      <text x="50" y="60" textAnchor="middle" className="fill-slate-400 text-[8px]">Ready</text>
    </svg>
  );
}

/* ── Resource Link ─────────────────────────────────────────────── */
function ResourceLink({ icon, title, detail }: any) {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition">
      <span>{icon}</span>
      <div>
        <div className="text-xs text-white">{title}</div>
        <div className="text-[10px] text-slate-400">{detail}</div>
      </div>
    </div>
  );
}
