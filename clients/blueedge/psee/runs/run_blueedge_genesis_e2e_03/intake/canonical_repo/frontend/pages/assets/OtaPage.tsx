import React, { useState, useMemo, useCallback } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import TabBar from '@/components/ui/TabBar';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import CrudDataTable from '@/components/data/CrudDataTable';
import TableCard from '@/components/data/TableCard';
import Modal from '@/components/ui/Modal';
import DetailView from '@/components/data/DetailView';
import { useSocketContext } from '@/socket';
import { useToast } from '@/hooks';
import { fmtDate, fmtCur } from '@/utils';

/* ─────────────── Types ─────────────── */
interface OtaCampaign {
  id: string; name: string; packageId: string; packageVersion: string;
  targetFleet: string; totalDevices: number; completed: number; failed: number; pending: number;
  status: 'draft'|'pending_approval'|'approved'|'rolling_out'|'completed'|'paused'|'cancelled';
  approver: string; approvedAt: Date|null; createdBy: string; createdAt: Date;
  rolloutStrategy: 'immediate'|'canary'|'staged'|'scheduled'; canaryPercent: number;
  rollbackOnFailure: boolean; maxFailurePercent: number;
}

interface FirmwarePackage {
  id: string; name: string; version: string; type: 'firmware'|'software'|'config'|'model'|'certificate';
  size: string; sha256: string; signedBy: string; targetHardware: string;
  releaseNotes: string; status: 'draft'|'testing'|'approved'|'released'|'deprecated';
  createdAt: Date; changelog: string[];
}

interface ConfigTemplate {
  id: string; name: string; version: string; type: 'global'|'organization'|'fleet_type'|'device';
  status: 'draft'|'pending_review'|'approved'|'active'|'deprecated';
  devices: number; updatedAt: Date; approvalChain: ApprovalStep[];
  parameters: ConfigParam[];
}

interface ApprovalStep {
  role: string; name: string; status: 'approved'|'pending'|'rejected'; date: Date|null; comment: string;
}

interface ConfigParam {
  key: string; value: string; category: string; description: string; type: string; editable: boolean;
}

interface J1939Parameter {
  pgn: string; spn: string; name: string; value: string; unit: string; rate: string;
  min: string; max: string; category: string;
}

/* ─────────────── Constants ─────────────── */
const TABS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'campaigns', label: '🚀 OTA Campaigns' },
  { id: 'packages', label: '📦 Packages' },
  { id: 'configs', label: '⚙️ Configurations' },
  { id: 'approval', label: '✅ Approval Queue' },
  { id: 'protocols', label: '🔌 J1939 / CAN FD' },
];
const spark = (n: number) => Array.from({ length: 12 }, () => n * (0.85 + Math.random() * 0.3));

/* ─────────────── Mock Data ─────────────── */
const CAMPAIGNS: OtaCampaign[] = [
  { id:'OTA-2025-001', name:'Bus Fleet FW v2.8.3 Rollout', packageId:'PKG-FW-012', packageVersion:'v2.8.3', targetFleet:'bus', totalDevices:200, completed:187, failed:2, pending:11, status:'rolling_out', approver:'Ahmed Al Mansouri', approvedAt:new Date(2025,1,10), createdBy:'Borhane Admin', createdAt:new Date(2025,1,8), rolloutStrategy:'staged', canaryPercent:10, rollbackOnFailure:true, maxFailurePercent:5 },
  { id:'OTA-2025-002', name:'Tanker Config v1.5.2 Update', packageId:'PKG-CFG-008', packageVersion:'v1.5.2', targetFleet:'tanker', totalDevices:150, completed:150, failed:0, pending:0, status:'completed', approver:'Khalid Al Maktoum', approvedAt:new Date(2025,1,12), createdBy:'System', createdAt:new Date(2025,1,11), rolloutStrategy:'canary', canaryPercent:5, rollbackOnFailure:true, maxFailurePercent:2 },
  { id:'OTA-2025-003', name:'Taxi Fleet AI Model Update', packageId:'PKG-ML-003', packageVersion:'v1.2.0', targetFleet:'taxi', totalDevices:300, completed:0, failed:0, pending:300, status:'pending_approval', approver:'', approvedAt:null, createdBy:'AI Team', createdAt:new Date(2025,1,14), rolloutStrategy:'canary', canaryPercent:10, rollbackOnFailure:true, maxFailurePercent:3 },
  { id:'OTA-2025-004', name:'All Fleet Security Patch', packageId:'PKG-SEC-001', packageVersion:'v3.11.1', targetFleet:'all', totalDevices:750, completed:0, failed:0, pending:750, status:'draft', approver:'', approvedAt:null, createdBy:'Security Team', createdAt:new Date(2025,1,15), rolloutStrategy:'immediate', canaryPercent:0, rollbackOnFailure:true, maxFailurePercent:1 },
  { id:'OTA-2025-005', name:'EV Fleet Charging Profile', packageId:'PKG-CFG-009', packageVersion:'v2.0.0', targetFleet:'ev', totalDevices:50, completed:48, failed:1, pending:1, status:'rolling_out', approver:'Sara Engineer', approvedAt:new Date(2025,1,13), createdBy:'EV Team', createdAt:new Date(2025,1,12), rolloutStrategy:'staged', canaryPercent:20, rollbackOnFailure:true, maxFailurePercent:5 },
  { id:'OTA-2025-006', name:'Cold Chain Temp Calibration', packageId:'PKG-CFG-010', packageVersion:'v1.1.0', targetFleet:'coldchain', totalDevices:50, completed:50, failed:0, pending:0, status:'completed', approver:'Fatima Al Zaabi', approvedAt:new Date(2025,1,9), createdBy:'Cold Chain Ops', createdAt:new Date(2025,1,7), rolloutStrategy:'immediate', canaryPercent:0, rollbackOnFailure:true, maxFailurePercent:2 },
];

const PACKAGES: FirmwarePackage[] = [
  { id:'PKG-FW-012', name:'SVG Gateway Firmware', version:'v2.8.3', type:'firmware', size:'48.2 MB', sha256:'a1b2c3d4e5f6...', signedBy:'Blue Edge Code Signing CA', targetHardware:'SVG 2.0 (i.MX 95)', releaseNotes:'CAN FD stability fix, NPU perf boost', status:'released', createdAt:new Date(2025,1,5), changelog:['Fixed CAN FD arbitration timeout','NPU inference 12% faster','MQTT reconnect improvement','Memory leak fix in telemetry buffer'] },
  { id:'PKG-FW-011', name:'SVG Gateway Firmware', version:'v2.8.2', type:'firmware', size:'47.8 MB', sha256:'f6e5d4c3b2a1...', signedBy:'Blue Edge Code Signing CA', targetHardware:'SVG 2.0 (i.MX 95)', releaseNotes:'GPS accuracy improvement', status:'released', createdAt:new Date(2025,0,20), changelog:['Kalman filter tuning','Multi-constellation GNSS'] },
  { id:'PKG-CFG-008', name:'Tanker Fleet Config', version:'v1.5.2', type:'config', size:'2.4 KB', sha256:'1a2b3c4d5e6f...', signedBy:'Fleet Config Authority', targetHardware:'All SVG 2.0', releaseNotes:'Updated geofence rules, HAZMAT thresholds', status:'released', createdAt:new Date(2025,1,10), changelog:['Jebel Ali geofence updated','Tank pressure alert threshold: 2.5 bar→2.8 bar','MQTT topic structure v2'] },
  { id:'PKG-ML-003', name:'DMS AI Model', version:'v1.2.0', type:'model', size:'28.5 MB', sha256:'3c4d5e6f7a8b...', signedBy:'AI Model Signing CA', targetHardware:'SVG 2.0 NPU', releaseNotes:'Improved fatigue & phone detection', status:'testing', createdAt:new Date(2025,1,12), changelog:['Fatigue detection F1: 0.89→0.94','Phone detection: +15% accuracy','Night vision model added','Reduced false positives by 30%'] },
  { id:'PKG-SEC-001', name:'Security Patch', version:'v3.11.1', type:'firmware', size:'12.1 MB', sha256:'7a8b9c0d1e2f...', signedBy:'Blue Edge Security CA', targetHardware:'All SVG 2.0', releaseNotes:'Post-quantum key exchange, TLS 1.3 update', status:'approved', createdAt:new Date(2025,1,14), changelog:['CRYSTALS-Kyber key exchange','TLS 1.3 ciphersuite update','Certificate pinning hardened'] },
  { id:'PKG-CERT-001', name:'Certificate Bundle', version:'v2026-Q1', type:'certificate', size:'156 KB', sha256:'9c0d1e2f3a4b...', signedBy:'Blue Edge Root CA', targetHardware:'All SVG', releaseNotes:'Q1 2026 certificate rotation', status:'approved', createdAt:new Date(2025,1,13), changelog:['Root CA rotated','Intermediate CA renewed','MQTT broker cert updated'] },
];

const CONFIG_TEMPLATES: ConfigTemplate[] = [
  { id:'CFG-001', name:'Global Vehicle Configuration', version:'v1.2.3', type:'global', status:'active', devices:750, updatedAt:new Date(2025,1,10),
    approvalChain:[
      { role:'Author', name:'Borhane Admin', status:'approved', date:new Date(2025,1,8), comment:'Initial draft' },
      { role:'Technical Review', name:'Ahmed Al Mansouri', status:'approved', date:new Date(2025,1,9), comment:'LGTM - CAN params verified' },
      { role:'Fleet Manager', name:'Khalid Al Maktoum', status:'approved', date:new Date(2025,1,10), comment:'Approved for deployment' },
    ],
    parameters:[
      { key:'telemetry.position.rate_hz', value:'1', category:'Telemetry', description:'GPS position report rate', type:'integer', editable:true },
      { key:'telemetry.engine.rate_hz', value:'10', category:'Telemetry', description:'J1939 engine data rate', type:'integer', editable:true },
      { key:'telemetry.can_fd.baud_data', value:'5000000', category:'CAN Bus', description:'CAN FD data phase baud rate', type:'integer', editable:false },
      { key:'telemetry.can_fd.baud_arb', value:'500000', category:'CAN Bus', description:'CAN FD arbitration baud rate', type:'integer', editable:false },
      { key:'mqtt.broker', value:'a1b2c3-ats.iot.me-south-1.amazonaws.com', category:'MQTT', description:'AWS IoT Core endpoint', type:'string', editable:false },
      { key:'mqtt.qos', value:'1', category:'MQTT', description:'MQTT Quality of Service', type:'integer', editable:true },
      { key:'mqtt.keepalive_sec', value:'30', category:'MQTT', description:'MQTT keepalive interval', type:'integer', editable:true },
      { key:'edge_ai.dms.enabled', value:'true', category:'Edge AI', description:'Driver monitoring system', type:'boolean', editable:true },
      { key:'edge_ai.adas.enabled', value:'true', category:'Edge AI', description:'ADAS collision warning', type:'boolean', editable:true },
      { key:'edge_ai.anomaly.enabled', value:'true', category:'Edge AI', description:'Anomaly detection model', type:'boolean', editable:true },
      { key:'security.tpm.attestation_interval_min', value:'60', category:'Security', description:'TPM re-attestation interval', type:'integer', editable:true },
      { key:'security.tls.min_version', value:'1.3', category:'Security', description:'Minimum TLS version', type:'string', editable:false },
      { key:'storage.buffer_hours', value:'72', category:'Storage', description:'Offline data buffer (Store & Forward)', type:'integer', editable:true },
      { key:'geofence.check_interval_sec', value:'5', category:'Geofence', description:'Geofence boundary check rate', type:'integer', editable:true },
    ],
  },
  { id:'CFG-002', name:'Tanker HAZMAT Configuration', version:'v2.0.1', type:'fleet_type', status:'active', devices:150, updatedAt:new Date(2025,1,14),
    approvalChain:[
      { role:'Author', name:'Tanker Ops', status:'approved', date:new Date(2025,1,12), comment:'HAZMAT thresholds updated' },
      { role:'Safety Officer', name:'Omar Al Rashid', status:'approved', date:new Date(2025,1,13), comment:'PHMSA compliant' },
      { role:'Fleet Manager', name:'Khalid Al Maktoum', status:'approved', date:new Date(2025,1,14), comment:'Deploy to tanker fleet' },
    ],
    parameters:[
      { key:'tanker.tank_pressure.alert_bar', value:'2.8', category:'Tank Monitoring', description:'Tank pressure alert threshold', type:'float', editable:true },
      { key:'tanker.leak_detection.sensitivity', value:'high', category:'Tank Monitoring', description:'Leak detection sensitivity', type:'enum', editable:true },
      { key:'tanker.custody.blockchain_enabled', value:'true', category:'Custody', description:'Blockchain custody chain', type:'boolean', editable:false },
      { key:'tanker.hazmat.placard_scan', value:'true', category:'HAZMAT', description:'Auto HAZMAT placard scanning', type:'boolean', editable:true },
    ],
  },
  { id:'CFG-003', name:'Bus Transit Configuration', version:'v1.8.0', type:'fleet_type', status:'active', devices:200, updatedAt:new Date(2025,1,11),
    approvalChain:[
      { role:'Author', name:'Bus Ops', status:'approved', date:new Date(2025,1,9), comment:'Schedule integration updated' },
      { role:'RTA Compliance', name:'RTA Dubai', status:'approved', date:new Date(2025,1,10), comment:'GTFS-RT compliant' },
      { role:'Fleet Manager', name:'Fatima Al Zaabi', status:'approved', date:new Date(2025,1,11), comment:'Approved' },
    ],
    parameters:[
      { key:'bus.apc.enabled', value:'true', category:'Passenger', description:'Automatic passenger counting', type:'boolean', editable:true },
      { key:'bus.gtfs_rt.enabled', value:'true', category:'Transit', description:'GTFS-RT feed generation', type:'boolean', editable:false },
      { key:'bus.schedule.adherence_threshold_sec', value:'120', category:'Transit', description:'Schedule adherence alert', type:'integer', editable:true },
    ],
  },
  { id:'CFG-004', name:'High Security Configuration', version:'v1.0.0', type:'device', status:'pending_review', devices:0, updatedAt:new Date(2025,1,15),
    approvalChain:[
      { role:'Author', name:'Security Team', status:'approved', date:new Date(2025,1,14), comment:'Post-quantum config' },
      { role:'CISO Review', name:'CISO', status:'pending', date:null, comment:'' },
      { role:'CTO Approval', name:'CTO', status:'pending', date:null, comment:'' },
    ],
    parameters:[
      { key:'security.post_quantum.enabled', value:'true', category:'Security', description:'CRYSTALS-Kyber key exchange', type:'boolean', editable:false },
      { key:'security.tpm.continuous_attestation', value:'true', category:'Security', description:'Continuous TPM attestation', type:'boolean', editable:false },
      { key:'security.cert_pinning.strict', value:'true', category:'Security', description:'Strict certificate pinning', type:'boolean', editable:false },
    ],
  },
];

/* J1939 Full Parameter Database */
const J1939_PARAMS: J1939Parameter[] = [
  { pgn:'61444', spn:'190', name:'Engine Speed', value:'', unit:'RPM', rate:'10 Hz', min:'0', max:'8000', category:'Engine' },
  { pgn:'61444', spn:'513', name:'Actual Engine Torque', value:'', unit:'%', rate:'10 Hz', min:'-125', max:'125', category:'Engine' },
  { pgn:'65262', spn:'110', name:'Engine Coolant Temperature', value:'', unit:'°C', rate:'1 Hz', min:'-40', max:'210', category:'Engine' },
  { pgn:'65263', spn:'100', name:'Engine Oil Pressure', value:'', unit:'kPa', rate:'1 Hz', min:'0', max:'1000', category:'Engine' },
  { pgn:'65265', spn:'84', name:'Wheel-Based Vehicle Speed', value:'', unit:'km/h', rate:'10 Hz', min:'0', max:'250', category:'Vehicle' },
  { pgn:'65266', spn:'183', name:'Engine Fuel Rate', value:'', unit:'L/h', rate:'10 Hz', min:'0', max:'3212', category:'Fuel' },
  { pgn:'65266', spn:'184', name:'Instantaneous Fuel Economy', value:'', unit:'km/L', rate:'10 Hz', min:'0', max:'125', category:'Fuel' },
  { pgn:'65269', spn:'171', name:'Ambient Air Temperature', value:'', unit:'°C', rate:'0.1 Hz', min:'-273', max:'1735', category:'Environment' },
  { pgn:'65269', spn:'108', name:'Barometric Pressure', value:'', unit:'kPa', rate:'0.1 Hz', min:'0', max:'125', category:'Environment' },
  { pgn:'65270', spn:'102', name:'Boost Pressure', value:'', unit:'kPa', rate:'1 Hz', min:'0', max:'500', category:'Engine' },
  { pgn:'65270', spn:'105', name:'Intake Manifold Temperature', value:'', unit:'°C', rate:'1 Hz', min:'-40', max:'210', category:'Engine' },
  { pgn:'65271', spn:'158', name:'Battery Potential (Voltage)', value:'', unit:'V', rate:'1 Hz', min:'0', max:'3212', category:'Electrical' },
  { pgn:'65276', spn:'96', name:'Fuel Level', value:'', unit:'%', rate:'0.5 Hz', min:'0', max:'100', category:'Fuel' },
  { pgn:'65253', spn:'247', name:'Total Engine Hours', value:'', unit:'hr', rate:'1/min', min:'0', max:'210554060', category:'Engine' },
  { pgn:'65248', spn:'245', name:'Total Vehicle Distance', value:'', unit:'km', rate:'1/min', min:'0', max:'21055406', category:'Vehicle' },
  { pgn:'65257', spn:'182', name:'Trip Fuel', value:'', unit:'L', rate:'1 Hz', min:'0', max:'3212', category:'Fuel' },
  { pgn:'65217', spn:'520', name:'DTC (Diagnostic Trouble Code)', value:'', unit:'code', rate:'event', min:'', max:'', category:'Diagnostics' },
  { pgn:'65279', spn:'175', name:'Engine Oil Temperature', value:'', unit:'°C', rate:'1 Hz', min:'-273', max:'1735', category:'Engine' },
  { pgn:'65272', spn:'91', name:'Throttle Position', value:'', unit:'%', rate:'10 Hz', min:'0', max:'100', category:'Engine' },
  { pgn:'65264', spn:'86', name:'Cruise Control Speed', value:'', unit:'km/h', rate:'1 Hz', min:'0', max:'250', category:'Vehicle' },
  { pgn:'65267', spn:'185', name:'Average Fuel Economy', value:'', unit:'km/L', rate:'1 Hz', min:'0', max:'125', category:'Fuel' },
  { pgn:'61443', spn:'92', name:'Engine Percent Load', value:'', unit:'%', rate:'10 Hz', min:'0', max:'125', category:'Engine' },
  { pgn:'65098', spn:'1760', name:'DEF Tank Level', value:'', unit:'%', rate:'0.5 Hz', min:'0', max:'100', category:'Emissions' },
  { pgn:'65110', spn:'3226', name:'SCR Inlet NOx', value:'', unit:'ppm', rate:'1 Hz', min:'0', max:'3012', category:'Emissions' },
].map(p => ({ ...p, value: p.unit === 'RPM' ? `${(650+Math.random()*1200).toFixed(0)}` : p.unit === '°C' ? `${(20+Math.random()*70).toFixed(1)}` : p.unit === '%' ? `${(Math.random()*100).toFixed(1)}` : p.unit === 'kPa' ? `${(Math.random()*500).toFixed(0)}` : p.unit === 'km/h' ? `${(Math.random()*90).toFixed(1)}` : p.unit === 'L/h' ? `${(5+Math.random()*30).toFixed(2)}` : p.unit === 'V' ? `${(24+Math.random()*4).toFixed(1)}` : p.unit === 'hr' ? `${(2000+Math.random()*8000).toFixed(0)}` : p.unit === 'km' ? `${(50000+Math.random()*300000).toFixed(0)}` : p.unit === 'ppm' ? `${(Math.random()*200).toFixed(0)}` : `${(Math.random()*100).toFixed(1)}` }));

/* ─────────────── Component ─────────────── */
export default function OtaPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<OtaCampaign|null>(null);
  const [selectedConfig, setSelectedConfig] = useState<ConfigTemplate|null>(null);
  const [selectedPkg, setSelectedPkg] = useState<FirmwarePackage|null>(null);
  const [j1939Filter, setJ1939Filter] = useState('all');
  const toast = useToast();

  const campaignStats = useMemo(() => ({
    active: CAMPAIGNS.filter(c => c.status === 'rolling_out').length,
    pending: CAMPAIGNS.filter(c => c.status === 'pending_approval').length,
    completed: CAMPAIGNS.filter(c => c.status === 'completed').length,
    totalDevices: CAMPAIGNS.reduce((s, c) => s + c.totalDevices, 0),
    successRate: 99.4,
    avgDuration: '4.2 min',
  }), []);

  const kpis = [
    { title:'Active Campaigns', value:campaignStats.active, trend:1, sparkline:spark(3) },
    { title:'Pending Approval', value:campaignStats.pending, trend:2, sparkline:spark(2) },
    { title:'Completed (30d)', value:campaignStats.completed, trend:8, sparkline:spark(12) },
    { title:'Success Rate', value:`${campaignStats.successRate}%`, trend:0.2, sparkline:spark(99) },
    { title:'Total Devices', value:campaignStats.totalDevices, trend:45, sparkline:spark(750) },
    { title:'Avg Duration', value:campaignStats.avgDuration, trend:-0.3, sparkline:spark(5) },
  ];

  const filteredJ1939 = useMemo(() => j1939Filter === 'all' ? J1939_PARAMS : J1939_PARAMS.filter(p => p.category === j1939Filter), [j1939Filter]);
  const j1939Categories = useMemo(() => [...new Set(J1939_PARAMS.map(p => p.category))], []);

  const statusColor = (s: string) => ({ draft:'#6b7280', pending_approval:'#f59e0b', approved:'#3b82f6', rolling_out:'#22d3ee', completed:'#10b981', paused:'#f59e0b', cancelled:'#ef4444', pending_review:'#f59e0b', active:'#10b981', released:'#10b981', testing:'#8b5cf6', deprecated:'#6b7280' }[s] || '#6b7280');

  return (<div>
    <PageHeader title="OTA & Configuration Management" breadcrumb="Assets › OTA" subtitle="Firmware updates, configuration deployment, approval workflows & protocol management" />
    <div className="grid grid-3" style={{ marginBottom:20 }}>{kpis.map((k,i) => <TrendCard key={i} {...k} />)}</div>
    <TabBar tabs={TABS} active={tab} onChange={setTab} />

    {/* ═ DASHBOARD ═ */}
    {tab==='dashboard' && (<>
      <div className="grid grid-2">
        <ChartCard title="OTA Deployments — Monthly" type="line" data={{ labels:['Sep','Oct','Nov','Dec','Jan','Feb'], datasets:[
          { label:'Successful', data:[28,35,42,55,68,82], borderColor:'#10b981', fill:true, backgroundColor:'rgba(16,185,129,0.08)' },
          { label:'Failed', data:[2,1,3,1,2,1], borderColor:'#ef4444' },
          { label:'Rollback', data:[1,0,1,0,1,0], borderColor:'#f59e0b', borderDash:[5,5] },
        ] }} />
        <ChartCard title="Package Type Distribution" type="doughnut" data={{ labels:['Firmware','Config','AI Model','Security','Certificate'], datasets:[{ data:[35,28,15,12,10], backgroundColor:['#22d3ee','#10b981','#8b5cf6','#ef4444','#f59e0b'] }] }} />
      </div>
      <div className="grid grid-4" style={{ marginTop:16 }}>
        <GaugeChart title="Success Rate" value={99.4} max={100} thresholds={[95,98]} trend={0.2} />
        <GaugeChart title="Avg Deploy Time" value={4.2} max={15} thresholds={[8,12]} trend={-0.3} />
        <GaugeChart title="Config Compliance" value={98.8} max={100} thresholds={[95,98]} trend={0.5} />
        <GaugeChart title="Approval SLA" value={96.5} max={100} thresholds={[90,95]} trend={1.2} />
      </div>
      {/* Active campaigns overview */}
      <div className="card" style={{ padding:16, marginTop:16 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>🚀 Active Campaigns</h3>
        {CAMPAIGNS.filter(c => c.status === 'rolling_out').map(c => (
          <div key={c.id} style={{ padding:12, background:'var(--bg-secondary)', borderRadius:8, marginBottom:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div><span style={{ fontWeight:600, fontSize:13 }}>{c.name}</span><span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:8 }}>{c.id}</span></div>
              <Badge status="active">Rolling Out</Badge>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>
              <span>{c.completed}/{c.totalDevices} devices ({((c.completed/c.totalDevices)*100).toFixed(1)}%)</span>
              <span>{c.failed} failed · {c.pending} pending</span>
            </div>
            <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${(c.completed/c.totalDevices)*100}%`, background:'linear-gradient(90deg,#10b981,#22d3ee)', borderRadius:3, transition:'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>
    </>)}

    {/* ═ OTA CAMPAIGNS ═ */}
    {tab==='campaigns' && (<div>
      <div style={{ marginBottom:12, display:'flex', justifyContent:'flex-end' }}>
        <button style={{ padding:'8px 16px', fontSize:12, fontWeight:600, background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>➕ Create Campaign</button>
      </div>
      <TableCard title="OTA Campaigns" count={CAMPAIGNS.length}>
        <CrudDataTable columns={[
          { label:'ID', render:(r:OtaCampaign) => <span style={{ fontFamily:'monospace', fontSize:11 }}>{r.id}</span> },
          { label:'Campaign', render:(r:OtaCampaign) => <div><div style={{ fontWeight:600, fontSize:12 }}>{r.name}</div><div style={{ fontSize:10, color:'var(--text-muted)' }}>{r.packageVersion} · {r.targetFleet}</div></div> },
          { label:'Strategy', render:(r:OtaCampaign) => <Badge status="info">{r.rolloutStrategy}{r.canaryPercent>0?` (${r.canaryPercent}%)`:''}</Badge> },
          { label:'Progress', render:(r:OtaCampaign) => { const pct = r.totalDevices>0?((r.completed/r.totalDevices)*100):0; return (
            <div style={{ minWidth:120 }}>
              <div style={{ fontSize:11, marginBottom:2 }}>{r.completed}/{r.totalDevices} ({pct.toFixed(0)}%)</div>
              <div style={{ height:4, background:'var(--border)', borderRadius:2, overflow:'hidden' }}><div style={{ height:'100%', width:`${pct}%`, background:pct===100?'#10b981':'#22d3ee', borderRadius:2 }} /></div>
            </div>
          ); }},
          { label:'Status', render:(r:OtaCampaign) => <Badge status={r.status==='completed'?'active':r.status==='rolling_out'?'info':r.status==='pending_approval'?'warning':'secondary'}>{r.status.replace(/_/g,' ')}</Badge> },
          { label:'Approver', render:(r:OtaCampaign) => r.approver || '—' },
          { label:'Created', render:(r:OtaCampaign) => fmtDate(r.createdAt) },
        ]} rows={CAMPAIGNS} onRowClick={(r:OtaCampaign) => setSelectedCampaign(r)} />
      </TableCard>
    </div>)}

    {/* ═ PACKAGES ═ */}
    {tab==='packages' && (<div>
      <div style={{ marginBottom:12, display:'flex', justifyContent:'flex-end' }}>
        <button style={{ padding:'8px 16px', fontSize:12, fontWeight:600, background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>📦 Upload Package</button>
      </div>
      <TableCard title="OTA Packages" count={PACKAGES.length}>
        <CrudDataTable columns={[
          { label:'Package', render:(r:FirmwarePackage) => <div><div style={{ fontWeight:600, fontSize:12 }}>{r.name}</div><div style={{ fontSize:10, fontFamily:'monospace', color:'var(--text-muted)' }}>{r.id}</div></div> },
          { label:'Version', render:(r:FirmwarePackage) => <span style={{ fontFamily:'monospace', fontWeight:600 }}>{r.version}</span> },
          { label:'Type', render:(r:FirmwarePackage) => <Badge status={r.type==='firmware'?'info':r.type==='config'?'active':r.type==='model'?'warning':'secondary'}>{r.type}</Badge> },
          { label:'Size', key:'size' },
          { label:'Target', render:(r:FirmwarePackage) => <span style={{ fontSize:11 }}>{r.targetHardware}</span> },
          { label:'Status', render:(r:FirmwarePackage) => <Badge status={r.status==='released'?'active':r.status==='approved'?'info':r.status==='testing'?'warning':'secondary'}>{r.status}</Badge> },
          { label:'Signed By', render:(r:FirmwarePackage) => <span style={{ fontSize:11 }}>{r.signedBy}</span> },
          { label:'Released', render:(r:FirmwarePackage) => fmtDate(r.createdAt) },
        ]} rows={PACKAGES} onRowClick={(r:FirmwarePackage) => setSelectedPkg(r)} />
      </TableCard>
    </div>)}

    {/* ═ CONFIGURATIONS ═ */}
    {tab==='configs' && (<div>
      <div style={{ marginBottom:12, display:'flex', justifyContent:'flex-end' }}>
        <button style={{ padding:'8px 16px', fontSize:12, fontWeight:600, background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>⚙️ Create Configuration</button>
      </div>
      {CONFIG_TEMPLATES.map(cfg => (
        <div key={cfg.id} className="card" style={{ padding:16, marginBottom:12, cursor:'pointer' }} onClick={() => setSelectedConfig(cfg)}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div><span style={{ fontWeight:700, fontSize:14 }}>{cfg.name}</span><span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:8 }}>{cfg.version}</span></div>
            <div style={{ display:'flex', gap:8 }}>
              <Badge status={cfg.type==='global'?'info':cfg.type==='fleet_type'?'warning':'secondary'}>{cfg.type.replace(/_/g,' ')}</Badge>
              <Badge status={cfg.status==='active'?'active':cfg.status==='pending_review'?'warning':'secondary'}>{cfg.status.replace(/_/g,' ')}</Badge>
            </div>
          </div>
          <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--text-muted)' }}>
            <span>📱 {cfg.devices} devices</span><span>📋 {cfg.parameters.length} parameters</span><span>Updated: {fmtDate(cfg.updatedAt)}</span>
          </div>
          {/* Approval chain */}
          <div style={{ display:'flex', gap:4, marginTop:8 }}>
            {cfg.approvalChain.map((a,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
                {i > 0 && <span style={{ color:'var(--text-muted)', fontSize:10 }}>→</span>}
                <div style={{ padding:'3px 8px', borderRadius:12, fontSize:10, fontWeight:600,
                  background: a.status==='approved'?'#10b98122':a.status==='pending'?'#f59e0b22':'#ef444422',
                  color: a.status==='approved'?'#10b981':a.status==='pending'?'#f59e0b':'#ef4444' }}>
                  {a.status==='approved'?'✓':a.status==='pending'?'⏳':'✗'} {a.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>)}

    {/* ═ APPROVAL QUEUE ═ */}
    {tab==='approval' && (<div>
      <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Pending Approvals</h3>
      {[...CAMPAIGNS.filter(c => c.status === 'pending_approval').map(c => ({ id:c.id, title:c.name, type:'OTA Campaign', detail:`${c.totalDevices} devices · ${c.targetFleet} fleet · ${c.rolloutStrategy}`, createdBy:c.createdBy, createdAt:c.createdAt, urgency:'high' as const })),
        ...CONFIG_TEMPLATES.filter(c => c.status === 'pending_review').map(c => ({ id:c.id, title:c.name, type:'Configuration', detail:`${c.parameters.length} parameters · ${c.type} scope`, createdBy:'Security Team', createdAt:c.updatedAt, urgency:'critical' as const })),
      ].map((item, i) => (
        <div key={i} className="card" style={{ padding:16, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <span style={{ fontWeight:700, fontSize:14 }}>{item.title}</span>
                <Badge status={item.type==='OTA Campaign'?'info':'warning'}>{item.type}</Badge>
                <Badge status={item.urgency==='critical'?'critical':'high'}>{item.urgency}</Badge>
              </div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>{item.detail}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>Created by {item.createdBy} · {fmtDate(item.createdAt)}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => toast.success(`${item.id} approved`)} style={{ padding:'8px 16px', fontSize:12, fontWeight:600, background:'#10b981', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>✓ Approve</button>
              <button onClick={() => toast.error(`${item.id} rejected`)} style={{ padding:'8px 16px', fontSize:12, fontWeight:600, background:'#ef4444', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>✗ Reject</button>
              <button style={{ padding:'8px 16px', fontSize:12, background:'var(--bg-secondary)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:6, cursor:'pointer' }}>💬 Comment</button>
            </div>
          </div>
        </div>
      ))}
      {/* Approval history */}
      <h3 style={{ fontSize:16, fontWeight:700, margin:'24px 0 16px' }}>Recent Approvals</h3>
      {CAMPAIGNS.filter(c => c.approvedAt).map(c => (
        <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:12 }}>
          <div><span style={{ fontWeight:600 }}>{c.name}</span><span style={{ color:'var(--text-muted)', marginLeft:8 }}>{c.id}</span></div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <span style={{ color:'#10b981' }}>✓ Approved by {c.approver}</span>
            <span style={{ color:'var(--text-muted)' }}>{c.approvedAt ? fmtDate(c.approvedAt) : ''}</span>
          </div>
        </div>
      ))}
    </div>)}

    {/* ═ J1939 / CAN FD PROTOCOLS ═ */}
    {tab==='protocols' && (<div>
      <div className="grid grid-2" style={{ marginBottom:16 }}>
        {/* J1939 Bus Status */}
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>🔌 J1939 CAN Bus Status</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
            {[['Protocol','SAE J1939-71/73'],['Baud Rate','250 kbps (J1939) / 500 kbps (CAN 2.0B)'],['Bus State','Active — No errors'],['Bus Load',`${(18+Math.random()*25).toFixed(1)}%`],
              ['Messages/sec',`${(450+Math.random()*200).toFixed(0)}`],['Error Frames','0'],['Active PGNs',`${J1939_PARAMS.length}`],['Source Addresses','3 (Engine ECU, TCM, ABS)'],
            ].map(([l,v],i) => (
              <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:12, fontWeight:600, fontFamily:'monospace' }}>{v}</div></div>
            ))}
          </div>
        </div>
        {/* CAN FD Status */}
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>⚡ CAN FD Extended Status</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
            {[['Protocol','ISO 11898-1:2015 (CAN FD)'],['Arbitration Phase','500 kbps'],['Data Phase','5 Mbps'],['Max Payload','64 bytes'],
              ['Bus Load',`${(8+Math.random()*15).toFixed(1)}%`],['BRS (Bit Rate Switch)','Enabled'],['ESI (Error State)','Active'],['Transceiver','TJA1463 (NXP)'],
            ].map(([l,v],i) => (
              <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:12, fontWeight:600, fontFamily:'monospace' }}>{v}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* J1939 Parameter Table */}
      <div className="card" style={{ padding:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <h3 style={{ fontSize:14, fontWeight:600, color:'#22d3ee' }}>📊 J1939 Live Parameters ({filteredJ1939.length})</h3>
          <div style={{ display:'flex', gap:8 }}>
            <select value={j1939Filter} onChange={e => setJ1939Filter(e.target.value)} style={{ padding:'4px 8px', fontSize:11, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:4, color:'var(--text-primary)' }}>
              <option value="all">All Categories</option>
              {j1939Categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
            <thead><tr style={{ borderBottom:'2px solid var(--border)' }}>
              {['PGN','SPN','Parameter Name','Live Value','Unit','Sample Rate','Range','Category'].map(h => (
                <th key={h} style={{ padding:'6px 8px', textAlign:'left', color:'var(--text-muted)', fontWeight:600, whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filteredJ1939.map((p,i) => (
                <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                  <td style={{ padding:'5px 8px', fontFamily:'monospace', color:'#8b5cf6' }}>{p.pgn}</td>
                  <td style={{ padding:'5px 8px', fontFamily:'monospace', color:'#8b5cf6' }}>{p.spn}</td>
                  <td style={{ padding:'5px 8px', fontWeight:500 }}>{p.name}</td>
                  <td style={{ padding:'5px 8px', fontWeight:700, fontFamily:'monospace', color:'#22d3ee', fontSize:12 }}>{p.value}</td>
                  <td style={{ padding:'5px 8px', color:'var(--text-muted)' }}>{p.unit}</td>
                  <td style={{ padding:'5px 8px', color:'var(--text-muted)' }}>{p.rate}</td>
                  <td style={{ padding:'5px 8px', fontFamily:'monospace', fontSize:10, color:'var(--text-muted)' }}>{p.min && p.max ? `${p.min}–${p.max}` : '—'}</td>
                  <td style={{ padding:'5px 8px' }}><Badge status={p.category==='Engine'?'info':p.category==='Fuel'?'warning':p.category==='Vehicle'?'active':'secondary'}>{p.category}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OBD-II Fallback */}
      <div className="card" style={{ padding:16, marginTop:12 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>🔧 OBD-II Fallback (Mode 01 PIDs)</h3>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>When J1939 is unavailable, OBD-II provides ~40% coverage as automatic fallback.</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
          {[['0x0C','RPM',`${(650+Math.random()*1200).toFixed(0)}`,'RPM'],['0x0D','Speed',`${(Math.random()*90).toFixed(0)}`,'km/h'],['0x05','Coolant',`${(75+Math.random()*15).toFixed(0)}`,'°C'],['0x0F','Intake Temp',`${(25+Math.random()*15).toFixed(0)}`,'°C'],
            ['0x11','Throttle',`${(Math.random()*100).toFixed(0)}`,'%'],['0x2F','Fuel Level',`${(20+Math.random()*70).toFixed(0)}`,'%'],['0x04','Engine Load',`${(Math.random()*100).toFixed(0)}`,'%'],['0x42','Voltage',`${(24+Math.random()*4).toFixed(1)}`,'V'],
          ].map(([pid,name,val,unit],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}><span style={{ fontFamily:'monospace', color:'#8b5cf6' }}>{pid}</span> {name}</div>
              <div style={{ fontSize:14, fontWeight:700, fontFamily:'monospace', color:'#f59e0b' }}>{val} <span style={{ fontSize:10, fontWeight:400, color:'var(--text-muted)' }}>{unit}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>)}

    {/* ═ CAMPAIGN DETAIL MODAL ═ */}
    <Modal open={!!selectedCampaign} onClose={() => setSelectedCampaign(null)} title="OTA Campaign Details" lg>
      {selectedCampaign && (<div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <div><h3 style={{ fontSize:16, fontWeight:700 }}>{selectedCampaign.name}</h3><span style={{ fontSize:12, color:'var(--text-muted)' }}>{selectedCampaign.id} · Package: {selectedCampaign.packageVersion}</span></div>
          <Badge status={selectedCampaign.status==='completed'?'active':'info'}>{selectedCampaign.status.replace(/_/g,' ')}</Badge>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
          {[['Target Fleet',selectedCampaign.targetFleet],['Strategy',`${selectedCampaign.rolloutStrategy}${selectedCampaign.canaryPercent>0?` (${selectedCampaign.canaryPercent}%)`:''}`],['Rollback on Fail',selectedCampaign.rollbackOnFailure?'Yes':'No'],
            ['Max Failure %',`${selectedCampaign.maxFailurePercent}%`],['Created By',selectedCampaign.createdBy],['Approved By',selectedCampaign.approver||'—'],
          ].map(([l,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:13, fontWeight:600 }}>{v}</div></div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>Deployment Progress</h4>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
          {[['Total',selectedCampaign.totalDevices,'#6b7280'],['Completed',selectedCampaign.completed,'#10b981'],['Failed',selectedCampaign.failed,'#ef4444'],['Pending',selectedCampaign.pending,'#f59e0b']].map(([l,v,c],i) => (
            <div key={i} style={{ padding:10, textAlign:'center', background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:20, fontWeight:700, color:c as string }}>{v}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{l}</div></div>
          ))}
        </div>
        <div style={{ height:8, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:'100%', display:'flex' }}>
            <div style={{ width:`${(selectedCampaign.completed/selectedCampaign.totalDevices)*100}%`, background:'#10b981' }} />
            <div style={{ width:`${(selectedCampaign.failed/selectedCampaign.totalDevices)*100}%`, background:'#ef4444' }} />
          </div>
        </div>
      </div>)}
    </Modal>

    {/* ═ CONFIG DETAIL MODAL ═ */}
    <Modal open={!!selectedConfig} onClose={() => setSelectedConfig(null)} title="Configuration Details" lg>
      {selectedConfig && (<div>
        <div style={{ marginBottom:16 }}>
          <h3 style={{ fontSize:16, fontWeight:700 }}>{selectedConfig.name} <span style={{ fontFamily:'monospace', fontSize:12, color:'var(--text-muted)' }}>{selectedConfig.version}</span></h3>
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8, color:'#22d3ee' }}>Approval Workflow</h4>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {selectedConfig.approvalChain.map((a,i) => (
            <div key={i} style={{ flex:1, padding:10, background:'var(--bg-secondary)', borderRadius:8, textAlign:'center', border:`1px solid ${a.status==='approved'?'#10b98144':a.status==='rejected'?'#ef444444':'#f59e0b44'}` }}>
              <div style={{ fontSize:16, marginBottom:4 }}>{a.status==='approved'?'✅':a.status==='pending'?'⏳':'❌'}</div>
              <div style={{ fontSize:11, fontWeight:600 }}>{a.role}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>{a.name}</div>
              {a.date && <div style={{ fontSize:10, color:'var(--text-muted)' }}>{fmtDate(a.date)}</div>}
              {a.comment && <div style={{ fontSize:10, color:a.status==='approved'?'#10b981':'var(--text-muted)', marginTop:2 }}>"{a.comment}"</div>}
            </div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8, color:'#22d3ee' }}>Configuration Parameters ({selectedConfig.parameters.length})</h4>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
          <thead><tr style={{ borderBottom:'2px solid var(--border)' }}>
            {['Key','Value','Type','Category','Editable'].map(h => <th key={h} style={{ padding:'6px 8px', textAlign:'left', color:'var(--text-muted)', fontWeight:600 }}>{h}</th>)}
          </tr></thead>
          <tbody>{selectedConfig.parameters.map((p,i) => (
            <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
              <td style={{ padding:'5px 8px', fontFamily:'monospace', fontSize:10 }}>{p.key}</td>
              <td style={{ padding:'5px 8px', fontWeight:600, fontFamily:'monospace', color:'#22d3ee' }}>{p.value}</td>
              <td style={{ padding:'5px 8px', color:'var(--text-muted)' }}>{p.type}</td>
              <td style={{ padding:'5px 8px' }}><Badge status="info">{p.category}</Badge></td>
              <td style={{ padding:'5px 8px' }}>{p.editable?'✏️':'🔒'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>)}
    </Modal>

    {/* ═ PACKAGE DETAIL MODAL ═ */}
    <Modal open={!!selectedPkg} onClose={() => setSelectedPkg(null)} title="Package Details" lg>
      {selectedPkg && (<div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }}>
          {[['Name',selectedPkg.name],['Version',selectedPkg.version],['Type',selectedPkg.type],['Size',selectedPkg.size],['Target',selectedPkg.targetHardware],['Status',selectedPkg.status],['Signed By',selectedPkg.signedBy],['SHA-256',selectedPkg.sha256]].map(([l,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:12, fontWeight:600, fontFamily:'monospace' }}>{v}</div></div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>📝 Changelog</h4>
        {selectedPkg.changelog.map((c,i) => <div key={i} style={{ padding:'4px 0', fontSize:12, borderBottom:'1px solid var(--border)' }}>• {c}</div>)}
      </div>)}
    </Modal>

    <toast.Toast />
  </div>);
}
