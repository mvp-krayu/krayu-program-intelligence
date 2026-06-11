import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
interface SVGDevice {
  id: string; hardwareId: string; serialNumber: string; partNumber: string;
  status: 'online'|'offline'|'warning'|'error'|'provisioning';
  lifecycle: 'manufactured'|'provisioned'|'deployed'|'operational'|'maintenance'|'decommissioned';
  owner: string; fleetType: 'tanker'|'bus'|'taxi'|'ev'|'coldchain';
  location: string; lastSeen: Date; firmwareVersion: string; hardwareVersion: string;
  softwareVersion: string; configVersion: string; blockchainAddress: string;
  tpmAttested: boolean; qcPassed: boolean; uptime: number; cpuUsage: number;
  memoryUsage: number; temperature: number; networkType: string; gpsAccuracy: number;
  manufacturingDate: Date; factoryLocation: string; batchNumber: string;
  macAddress: string; imei: string; simIccid: string;
  certificates: { id: string; purpose: string; validUntil: Date; status: string; issuer: string }[];
  transferHistory: { id: string; from: string; to: string; type: string; date: Date; txHash: string }[];
}
interface ProvisioningStep { id: number; title: string; description: string; status: 'completed'|'active'|'pending'|'failed'; duration?: string; progress?: number; logs?: string[] }
interface RegForm {
  partNumber: string; serialNumber: string; macAddress: string; countryCode: string;
  manufacturer: string; tpmEndorsementKey: string; manufacturingDate: string;
  factoryLocation: string; batchNumber: string; hardwareVersion: string; fleetType: string;
  confirmedAccurate: boolean; qcPassed: boolean; readyForProvisioning: boolean;
}

/* ─────────────── Constants ─────────────── */
const TABS = [
  { id: 'dashboard', label: '📊 Dashboard' }, { id: 'devices', label: '📱 Device Registry' },
  { id: 'register', label: '➕ Register' }, { id: 'workflow', label: '⚡ Provisioning' },
  { id: 'lifecycle', label: '🔄 Lifecycle' }, { id: 'analytics', label: '📈 Analytics' },
];
const FLEET_TYPES = ['tanker','bus','taxi','ev','coldchain'] as const;
const OWNERS = ['Dubai Tanker Corp','RTA Bus Fleet','Dubai Taxi LLC','Green EV Transport','ColdLogistics ME','ENOC Fleet','Al Ghurair Tankers','Emirates Bus Co'];
const LOCATIONS = ['Dubai, UAE','Abu Dhabi, UAE','Sharjah, UAE','Jebel Ali, UAE','Ras Al Khaimah, UAE','Zürich, CH','Geneva, CH','Nairobi, KE'];
const FACTORIES = ['Taipei Facility A','Shenzhen Plant B','Dubai Assembly','Chennai Electronics'];
const spark = (n: number) => Array.from({ length: 12 }, () => n * (0.85 + Math.random() * 0.3));
const fleetIcon = (ft: string) => ({ tanker:'🛢️', bus:'🚌', taxi:'🚕', ev:'⚡', coldchain:'❄️' }[ft] || '🚗');
const statusDot = (s: string) => <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background: { online:'#10b981', offline:'#6b7280', warning:'#f59e0b', error:'#ef4444', provisioning:'#3b82f6' }[s] || '#6b7280', marginRight:6 }} />;

/* ─────────────── Mock Data ─────────────── */
const genDevice = (i: number): SVGDevice => {
  const ft = FLEET_TYPES[i % 5]; const online = Math.random() > 0.12;
  return {
    id: `dev-${String(i+1).padStart(5,'0')}`,
    hardwareId: `SVG-${['A1B2','C3D4','E5F6','G7H8','I9J0','K1L2','M3N4','O5P6','Q7R8','S9T0','U1V2','W3X4'][i%12]}${['AE','CH','KE','TZ'][i%4]}-${String(i+1).padStart(3,'0')}`,
    serialNumber: `SN-${100000+i}`, partNumber: `PN-SVG-2025-${ft.toUpperCase()}`,
    status: !online ? 'offline' : Math.random() > 0.85 ? 'warning' : 'online',
    lifecycle: (['operational','operational','operational','provisioned','maintenance','operational','operational','deployed','operational','operational'][i%10]) as SVGDevice['lifecycle'],
    owner: OWNERS[i%OWNERS.length], fleetType: ft, location: LOCATIONS[i%LOCATIONS.length],
    lastSeen: new Date(Date.now() - (online ? Math.random()*300000 : Math.random()*7200000)),
    firmwareVersion: `v${2+i%3}.${i%8}.${i%5}`, hardwareVersion: `v2.${1+i%3}`,
    softwareVersion: `v3.${11+i%7}.${i%4}`, configVersion: `v1.${i%6}.${i%3}`,
    blockchainAddress: `0x${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join('')}...`,
    tpmAttested: Math.random()>0.05, qcPassed: Math.random()>0.02, uptime: Math.floor(Math.random()*4320),
    cpuUsage: 15+Math.random()*55, memoryUsage: 30+Math.random()*45, temperature: 28+Math.random()*22,
    networkType: ['5G','4G LTE','4G','3G Fallback','Satellite'][i%5], gpsAccuracy: 2+Math.random()*8,
    manufacturingDate: new Date(2024, Math.floor(Math.random()*18), 1+Math.floor(Math.random()*28)),
    factoryLocation: FACTORIES[i%FACTORIES.length], batchNumber: `BATCH-2025-Q${1+Math.floor(i/50)}-${String(i+1).padStart(3,'0')}`,
    macAddress: Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':'),
    imei: String(350000000000000+Math.floor(Math.random()*999999999)),
    simIccid: `8997101${String(Math.floor(Math.random()*9999999999)).padStart(10,'0')}`,
    certificates: [
      { id:`cert-auth-${i}`, purpose:'Device Auth', validUntil:new Date(2026,6,30), status:'active', issuer:'Blue Edge CA' },
      { id:`cert-tls-${i}`, purpose:'TLS Client', validUntil:new Date(2026,6,30), status:'active', issuer:'Blue Edge CA' },
      { id:`cert-mqtt-${i}`, purpose:'MQTT Broker', validUntil:new Date(2026,11,31), status:'active', issuer:'AWS IoT CA' },
    ],
    transferHistory: i%3===0 ? [{ id:`TR-2025-${8800+i}`, from:OWNERS[(i+1)%OWNERS.length], to:OWNERS[i%OWNERS.length], type:'sale', date:new Date(2025,3,15), txHash:`0x${Array.from({length:16},()=>Math.floor(Math.random()*16).toString(16)).join('')}` }] : [],
  };
};
const MOCK_DEVICES: SVGDevice[] = Array.from({ length: 24 }, (_, i) => genDevice(i));

const WORKFLOW_STEPS: ProvisioningStep[] = [
  { id:1, title:'Validate Device Information', description:'Hardware ID generated, serial verified, no duplicates', status:'completed', duration:'2.3s', logs:['[10:23:45] Starting validation...','[10:23:47] ✓ Validation complete'] },
  { id:2, title:'Register in Device Database', description:'PostgreSQL record created, TimescaleDB hypertable initialized', status:'completed', duration:'1.8s', logs:['[10:23:49] Creating device record...','[10:23:50] ✓ Registration complete'] },
  { id:3, title:'TPM Attestation & Key Enrollment', description:'TPM 2.0 EK verified, AIK generated, PCR measurements validated', status:'completed', duration:'4.7s', logs:['[10:23:51] Reading TPM endorsement key...','[10:23:55] ✓ TPM attestation passed'] },
  { id:4, title:'Generate Device Certificates', description:'X.509: device auth, TLS client, MQTT broker, code signing', status:'completed', duration:'3.9s', logs:['[10:23:56] Generating CSR (ECDSA P-384)...','[10:24:00] ✓ 4 certificates provisioned'] },
  { id:5, title:'Create Blockchain Wallet & NFT', description:'HD wallet created, device NFT minted (ERC-721), ownership token', status:'active', progress:68, logs:['[10:24:01] Generating HD wallet (BIP-44)...','[10:24:05] TX submitted: 0x1a2b3c...','[10:24:08] Waiting for confirmation (2/3)...'] },
  { id:6, title:'Register on Blockchain', description:'Identity anchored on Hyperledger, smart contract updated', status:'pending', logs:[] },
  { id:7, title:'Deploy Configuration Profile', description:'Fleet-specific config: telemetry rates, CAN FD baud, MQTT topics', status:'pending', logs:[] },
  { id:8, title:'Activate & Send Notifications', description:'Device activated, fleet manager notified, monitoring started', status:'pending', logs:[] },
];

/* ─────────────── Component ─────────────── */
export default function DevicesPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('dashboard');
  const [selected, setSelected] = useState<SVGDevice|null>(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [filterLifecycle, setFilterLifecycle] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [filterFleet, setFilterFleet] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [workflowSteps] = useState(WORKFLOW_STEPS);
  const [regForm, setRegForm] = useState<RegForm>({
    partNumber:'PN-SVG-2025', serialNumber:'', macAddress:'', countryCode:'UAE',
    manufacturer:'Blue Edge Electronics (Taipei)', tpmEndorsementKey:'',
    manufacturingDate: new Date().toISOString().split('T')[0], factoryLocation:'Taipei Facility A',
    batchNumber:'', hardwareVersion:'v2.1', fleetType:'tanker',
    confirmedAccurate:false, qcPassed:false, readyForProvisioning:false,
  });
  const toast = useToast();

  const workflowProgress = useMemo(() => {
    const done = workflowSteps.filter(s => s.status === 'completed').length;
    const ap = workflowSteps.find(s => s.status === 'active')?.progress || 0;
    return Math.round(((done + ap / 100) / workflowSteps.length) * 100);
  }, [workflowSteps]);

  const filteredDevices = useMemo(() => MOCK_DEVICES.filter(d => {
    if (filterLifecycle !== 'all' && d.lifecycle !== filterLifecycle) return false;
    if (filterOwner !== 'all' && d.owner !== filterOwner) return false;
    if (filterFleet !== 'all' && d.fleetType !== filterFleet) return false;
    if (searchQuery && !d.hardwareId.toLowerCase().includes(searchQuery.toLowerCase()) && !d.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) && !d.owner.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [filterLifecycle, filterOwner, filterFleet, searchQuery]);

  const stats = useMemo(() => {
    const t = MOCK_DEVICES.length, on = MOCK_DEVICES.filter(d => d.status==='online').length;
    return { total:t, online:on, provisioning:MOCK_DEVICES.filter(d=>d.lifecycle==='provisioned').length, maintenance:MOCK_DEVICES.filter(d=>d.lifecycle==='maintenance').length, operational:MOCK_DEVICES.filter(d=>d.lifecycle==='operational').length, tpmOk:MOCK_DEVICES.filter(d=>d.tpmAttested).length };
  }, []);

  const handleRegister = useCallback(() => {
    if (!regForm.serialNumber || !regForm.tpmEndorsementKey) { toast.error('Serial Number and TPM Key required'); return; }
    if (!regForm.confirmedAccurate || !regForm.qcPassed || !regForm.readyForProvisioning) { toast.error('All QC checkboxes must be confirmed'); return; }
    toast.success(`Device ${regForm.serialNumber} registered — provisioning started`);
    setTab('workflow');
  }, [regForm, toast]);

  const workflowLogs = useMemo(() => workflowSteps.flatMap(s => s.logs || []), [workflowSteps]);
  const kpis = [
    { title:'Total Devices', value:stats.total, trend:45, sparkline:spark(stats.total) },
    { title:'Online', value:stats.online, trend:12, sparkline:spark(stats.online) },
    { title:'Operational', value:stats.operational, trend:8, sparkline:spark(stats.operational) },
    { title:'Provisioning', value:stats.provisioning, trend:3, sparkline:spark(stats.provisioning) },
    { title:'Maintenance', value:stats.maintenance, trend:-2, sparkline:spark(stats.maintenance) },
    { title:'TPM Attested', value:`${((stats.tpmOk/stats.total)*100).toFixed(1)}%`, trend:0.3, sparkline:spark(95) },
  ];

  /* ───── Workflow Step Renderer ───── */
  const renderStep = (step: ProvisioningStep, idx: number) => {
    const isLast = idx === workflowSteps.length - 1;
    const bg = step.status==='completed'?'#10b981':step.status==='active'?'#3b82f6':step.status==='failed'?'#ef4444':'transparent';
    const bdr = step.status==='pending'?'2px solid var(--border)':`2px solid ${bg}`;
    const ic = step.status==='completed'?'✓':step.status==='active'?'⟳':step.status==='failed'?'✗':String(step.id);
    return (
      <div key={step.id} style={{ display:'flex', gap:16, position:'relative', paddingBottom:isLast?0:24 }}>
        {!isLast && <div style={{ position:'absolute', left:15, top:38, width:2, height:'calc(100% - 14px)', background:step.status==='completed'?'#10b981':'var(--border)' }} />}
        <div style={{ width:32, height:32, borderRadius:'50%', background:bg, border:bdr, color:step.status==='pending'?'var(--text-muted)':'#fff',
          display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0, zIndex:1,
          animation:step.status==='active'?'pulse 2s infinite':undefined }}>{ic}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:14, color:step.status==='pending'?'var(--text-muted)':'var(--text-primary)', marginBottom:2 }}>{step.title}</div>
          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{step.description}</div>
          {step.duration && <div style={{ fontSize:11, color:'#10b981', marginTop:2 }}>Completed in {step.duration}</div>}
          {step.status==='active' && step.progress!==undefined && (
            <div style={{ marginTop:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginBottom:3 }}><span>Processing...</span><span>{step.progress}%</span></div>
              <div style={{ height:6, background:'var(--bg-secondary)', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${step.progress}%`, background:'linear-gradient(90deg,#3b82f6,#22d3ee)', borderRadius:3, transition:'width 0.5s' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ───── Device Detail Modal ───── */
  const renderDetail = () => {
    if (!selected) return null;
    const d = selected;
    const dtabs = [{ id:'overview', label:'Overview' },{ id:'telemetry', label:'Telemetry' },{ id:'certificates', label:'Certificates' },{ id:'protocols', label:'Protocols' },{ id:'history', label:'History' }];
    const DetailGrid = ({ items }: { items: [string,string][] }) => (
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
        {items.map(([lbl,val],i) => (
          <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}>
            <div style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>{lbl}</div>
            <div style={{ fontSize:13, fontWeight:500 }}>{val}</div>
          </div>
        ))}
      </div>
    );

    return (<div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, paddingBottom:12, borderBottom:'1px solid var(--border)' }}>
        <div><h3 style={{ fontSize:18, fontWeight:700 }}>{d.hardwareId}</h3><span style={{ fontSize:12, color:'var(--text-muted)' }}>Serial: {d.serialNumber} · {fleetIcon(d.fleetType)} {d.fleetType.toUpperCase()}</span></div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>{statusDot(d.status)}<Badge status={d.status==='online'?'active':d.status}>{d.status}</Badge></div>
      </div>
      <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--border)', marginBottom:16 }}>
        {dtabs.map(t => <button key={t.id} onClick={()=>setDetailTab(t.id)} style={{ padding:'8px 14px', fontSize:12, fontWeight:600, border:'none', background:'none', cursor:'pointer', color:detailTab===t.id?'#22d3ee':'var(--text-muted)', borderBottom:detailTab===t.id?'2px solid #22d3ee':'2px solid transparent' }}>{t.label}</button>)}
      </div>

      {detailTab==='overview' && (<div>
        <DetailGrid items={[['Hardware ID',d.hardwareId],['Part Number',d.partNumber],['Lifecycle',d.lifecycle],['Owner',d.owner],['Location',d.location],['Last Seen',fmtDate(d.lastSeen)],['Blockchain',d.blockchainAddress],['Uptime',`${Math.floor(d.uptime/24)}d ${d.uptime%24}h`],['TPM',d.tpmAttested?'✅ Verified':'❌ Failed'],['QC',d.qcPassed?'✅ Passed':'❌ Failed'],['IMEI',d.imei],['MAC',d.macAddress],['Factory',d.factoryLocation],['Batch',d.batchNumber]]} />
        <h4 style={{ fontSize:13, fontWeight:600, margin:'16px 0 8px', color:'#22d3ee' }}>Software Versions</h4>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {[['Hardware',d.hardwareVersion],['Firmware',d.firmwareVersion],['Software',d.softwareVersion],['Config',d.configVersion]].map(([l,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6, textAlign:'center' }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:14, fontWeight:700, fontFamily:'monospace' }}>{v}</div></div>
          ))}
        </div>
      </div>)}

      {detailTab==='telemetry' && (<div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Real-time Device Health</h4>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
          {[{ l:'CPU Usage', v:`${d.cpuUsage.toFixed(1)}%`, p:d.cpuUsage, c:d.cpuUsage>70?'#ef4444':d.cpuUsage>50?'#f59e0b':'#10b981' },
            { l:'Memory', v:`${(d.memoryUsage*0.16).toFixed(1)} GB / 16 GB`, p:d.memoryUsage, c:d.memoryUsage>70?'#ef4444':'#3b82f6' },
            { l:'Temperature', v:`${d.temperature.toFixed(1)}°C`, p:(d.temperature/85)*100, c:d.temperature>60?'#ef4444':'#10b981' },
            { l:'Storage', v:`${(Math.random()*12+4).toFixed(1)} GB / 32 GB`, p:35+Math.random()*30, c:'#8b5cf6' },
          ].map((m,i) => (
            <div key={i} style={{ padding:12, background:'var(--bg-secondary)', borderRadius:8 }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{m.l}</div>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{m.v}</div>
              <div style={{ height:5, background:'var(--border)', borderRadius:3, overflow:'hidden' }}><div style={{ height:'100%', width:`${m.p}%`, background:m.c, borderRadius:3 }} /></div>
            </div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, margin:'16px 0 8px', color:'#22d3ee' }}>🧠 Edge AI / NPU (2 TOPS)</h4>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
          {[['DMS Inference','8.2 ms'],['ADAS Inference','6.7 ms'],['Anomaly Detection','3.1 ms'],['Active Models','6 (TFLite+ONNX)'],['Total Inferences','2.4M today'],['NPU Load',`${(15+Math.random()*35).toFixed(1)}%`]].map(([l,v],i) => (
            <div key={i} style={{ padding:6, background:'var(--bg-secondary)', borderRadius:4 }}><div style={{ fontSize:9, color:'var(--text-muted)' }}>{l}</div><div style={{ fontWeight:600, fontFamily:'monospace', fontSize:11 }}>{v}</div></div>
          ))}
        </div>
      </div>)}

      {detailTab==='certificates' && (<div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Device Certificates</h4>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>{['ID','Purpose','Issuer','Valid Until','Status'].map(h => <th key={h} style={{ padding:'8px 6px', textAlign:'left', color:'var(--text-muted)', fontWeight:600 }}>{h}</th>)}</tr></thead>
          <tbody>{d.certificates.map((c,i) => (
            <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
              <td style={{ padding:'8px 6px', fontFamily:'monospace', fontSize:11 }}>{c.id}</td><td style={{ padding:'8px 6px' }}>{c.purpose}</td>
              <td style={{ padding:'8px 6px' }}>{c.issuer}</td><td style={{ padding:'8px 6px' }}>{fmtDate(c.validUntil)}</td>
              <td style={{ padding:'8px 6px' }}><Badge status={c.status==='active'?'active':'warning'}>{c.status}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
        <h4 style={{ fontSize:13, fontWeight:600, margin:'16px 0 8px', color:'#22d3ee' }}>🔐 TPM 2.0 Status</h4>
        <DetailGrid items={[['Manufacturer','Infineon SLB 9670'],['Firmware','v7.85.4555.0'],['Endorsement Key',`EK-${d.hardwareId.slice(4,12)}...`],['Attestation',d.tpmAttested?'✅ Verified':'❌ Failed'],['Secure Boot','✅ Enabled'],['Measured Boot','✅ PCR[0-7] Valid']]} />
      </div>)}

      {detailTab==='protocols' && (<div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>🔌 J1939 CAN Bus — Live Parameters</h4>
        <div style={{ padding:12, background:'var(--bg-secondary)', borderRadius:8, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontWeight:700, fontSize:13 }}>J1939 CAN Bus</span><Badge status="active">Active · 500 kbps</Badge>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
            <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>{['PGN','SPN','Parameter','Value','Unit','Rate'].map(h => <th key={h} style={{ padding:'4px 6px', textAlign:'left', color:'var(--text-muted)' }}>{h}</th>)}</tr></thead>
            <tbody>{[
              ['61444','190','Engine Speed',`${(650+Math.random()*900).toFixed(0)}`,'RPM','10 Hz'],
              ['65262','110','Coolant Temp',`${(75+Math.random()*15).toFixed(1)}`,'°C','1 Hz'],
              ['65265','84','Vehicle Speed',`${(Math.random()*85).toFixed(1)}`,'km/h','10 Hz'],
              ['65266','183','Fuel Rate',`${(8+Math.random()*25).toFixed(2)}`,'L/h','10 Hz'],
              ['65269','171','Ambient Temp',`${(32+Math.random()*10).toFixed(1)}`,'°C','0.1 Hz'],
              ['65263','100','Oil Pressure',`${(300+Math.random()*200).toFixed(0)}`,'kPa','1 Hz'],
              ['65276','96','Fuel Level',`${(20+Math.random()*70).toFixed(1)}`,'%','0.5 Hz'],
              ['65253','247','Engine Hours',`${(4000+Math.random()*8000).toFixed(1)}`,'hours','1/min'],
            ].map(([pgn,spn,p,v,u,r],i) => (
              <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                <td style={{ padding:'4px 6px', fontFamily:'monospace' }}>{pgn}</td><td style={{ padding:'4px 6px', fontFamily:'monospace' }}>{spn}</td>
                <td style={{ padding:'4px 6px' }}>{p}</td><td style={{ padding:'4px 6px', fontWeight:600, fontFamily:'monospace', color:'#22d3ee' }}>{v}</td>
                <td style={{ padding:'4px 6px', color:'var(--text-muted)' }}>{u}</td><td style={{ padding:'4px 6px', color:'var(--text-muted)' }}>{r}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ padding:12, background:'var(--bg-secondary)', borderRadius:8, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontWeight:700, fontSize:13 }}>CAN FD Extended</span><Badge status="info">5 Mbps Data Phase</Badge></div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, fontSize:11 }}>
            {[['Arbitration','500 kbps'],['Data Phase','5 Mbps'],['Max Payload','64 bytes'],['Bus Load',`${(15+Math.random()*30).toFixed(1)}%`],['Error Frames',`${Math.floor(Math.random()*3)}`],['Bus-off','0']].map(([l,v],i) => (
              <div key={i} style={{ padding:6, background:'var(--bg-primary)', borderRadius:4 }}><div style={{ fontSize:9, color:'var(--text-muted)' }}>{l}</div><div style={{ fontWeight:600, fontFamily:'monospace' }}>{v}</div></div>
            ))}
          </div>
        </div>
        <div style={{ padding:12, background:'var(--bg-secondary)', borderRadius:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontWeight:700, fontSize:13 }}>MQTT / TLS 1.3</span><Badge status="active">Connected</Badge></div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6, fontSize:11 }}>
            {[['Broker','a1b2c3-ats.iot.me-south-1.amazonaws.com'],['QoS','1 (At least once)'],['Subscribed Topics','8'],['Publishing Topics','12'],['Messages/sec',`${(25+Math.random()*20).toFixed(0)}`],['Keepalive','30 sec']].map(([l,v],i) => (
              <div key={i} style={{ padding:6, background:'var(--bg-primary)', borderRadius:4 }}><div style={{ fontSize:9, color:'var(--text-muted)' }}>{l}</div><div style={{ fontWeight:600, fontFamily:'monospace', fontSize:11, wordBreak:'break-all' }}>{v}</div></div>
            ))}
          </div>
        </div>
      </div>)}

      {detailTab==='history' && (<div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Lifecycle History</h4>
        {[
          { icon:'✅', title:'Operational', desc:'Transitioned to operational', date:fmtDate(new Date(2025,2,25)), color:'#10b981' },
          { icon:'🚀', title:'Deployed', desc:`Deployed to ${d.owner}`, date:fmtDate(new Date(2025,2,25)), color:'#3b82f6' },
          { icon:'📋', title:'Config Deployed', desc:`Config ${d.configVersion} applied`, date:fmtDate(new Date(2025,2,24)), color:'#22d3ee' },
          { icon:'⛓️', title:'Blockchain Anchored', desc:`Identity on Hyperledger (${d.blockchainAddress})`, date:fmtDate(new Date(2025,2,23)), color:'#8b5cf6' },
          { icon:'🔑', title:'Certificates Issued', desc:`${d.certificates.length} certs by Blue Edge CA`, date:fmtDate(new Date(2025,2,22)), color:'#f59e0b' },
          { icon:'🔐', title:'TPM Attested', desc:'TPM 2.0 attestation passed', date:fmtDate(new Date(2025,2,21)), color:'#10b981' },
          { icon:'✓', title:'Provisioned', desc:'8/8 provisioning steps completed', date:fmtDate(new Date(2025,2,20)), color:'#10b981' },
          { icon:'🏭', title:'Manufactured', desc:`${d.factoryLocation} (${d.batchNumber})`, date:fmtDate(d.manufacturingDate), color:'#6b7280' },
          ...d.transferHistory.map(t => ({ icon:'🔄', title:`Transfer (${t.type})`, desc:`${t.from} → ${t.to}`, date:fmtDate(t.date), color:'#f59e0b' })),
        ].map((e,i) => (
          <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`${e.color}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14 }}>{e.icon}</div>
            <div><div style={{ fontSize:13, fontWeight:600 }}>{e.title}</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>{e.desc}</div><div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{e.date}</div></div>
          </div>
        ))}
      </div>)}

      <div style={{ display:'flex', gap:8, marginTop:16, paddingTop:12, borderTop:'1px solid var(--border)' }}>
        {[['🔄 Transfer','#3b82f6'],['📋 Deploy Config','#10b981'],['🔧 OTA Update','#f59e0b'],['⛓️ View on Chain','#8b5cf6']].map(([lbl,bg],i) => (
          <button key={i} style={{ padding:'8px 14px', fontSize:12, background:bg, color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>{lbl}</button>
        ))}
      </div>
    </div>);
  };

  /* ═══════ MAIN RENDER ═══════ */
  return (<div>
    <PageHeader title="SVG Device Provisioning" breadcrumb="Assets › Devices" subtitle="Registration, provisioning, lifecycle management & blockchain identity" />
    <div className="grid grid-3" style={{ marginBottom:20 }}>{kpis.map((k,i) => <TrendCard key={i} {...k} />)}</div>
    <TabBar tabs={TABS} active={tab} onChange={setTab} />

    {/* ═ DASHBOARD ═ */}
    {tab==='dashboard' && (<>
      <div className="grid grid-2">
        <ChartCard title="Device Registrations — Monthly" type="line" data={{ labels:['Sep','Oct','Nov','Dec','Jan','Feb'], datasets:[
          { label:'Registered', data:[42,58,85,120,165,210], borderColor:'#22d3ee', fill:true, backgroundColor:'rgba(34,211,238,0.08)' },
          { label:'Provisioned', data:[38,52,78,112,158,195], borderColor:'#10b981' },
          { label:'Deployed', data:[35,48,70,105,145,180], borderColor:'#8b5cf6', borderDash:[5,5] },
        ] }} />
        <ChartCard title="Fleet Distribution" type="doughnut" data={{ labels:['Tanker','Bus','Taxi','EV','Cold Chain'], datasets:[{ data:[150,200,300,50,50], backgroundColor:['#22d3ee','#f59e0b','#10b981','#8b5cf6','#06b6d4'] }] }} />
      </div>
      <div className="grid grid-4" style={{ marginTop:16 }}>
        <GaugeChart title="Fleet Online %" value={98.9} max={100} thresholds={[90,95]} trend={0.3} />
        <GaugeChart title="TPM Attestation" value={97.8} max={100} thresholds={[90,95]} trend={1.2} />
        <GaugeChart title="Cert Validity" value={99.4} max={100} thresholds={[85,95]} trend={0.1} />
        <GaugeChart title="Edge AI Latency" value={7.8} max={20} thresholds={[10,15]} trend={-0.5} />
      </div>
      <div className="grid grid-2" style={{ marginTop:16 }}>
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>🕐 Recent Activity</h3>
          {[{ t:'2 min', a:'SVG-A1B2AE-025 provisioned — 8/8 steps', s:'success' },{ t:'8 min', a:'TPM attestation passed (PCR verified)', s:'success' },{ t:'15 min', a:'Transfer TR-2025-8832 approved', s:'info' },{ t:'22 min', a:'Blockchain NFT minted for SVG-E5F6KE', s:'info' },{ t:'45 min', a:'Config v1.5.2 deployed to 45 tankers', s:'success' },{ t:'1h', a:'12 TLS certificates auto-renewed', s:'info' },{ t:'2h', a:'OTA v2.8.3 → bus fleet (200 devices)', s:'success' },{ t:'4h', a:'SVG-Q7R8FR-008 entered maintenance', s:'warning' }].map((a,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:i<7?'1px solid var(--border)':'none' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}><div style={{ width:6, height:6, borderRadius:'50%', background:a.s==='warning'?'#f59e0b':a.s==='success'?'#10b981':'#3b82f6' }} /><span style={{ fontSize:12 }}>{a.a}</span></div>
              <span style={{ fontSize:11, color:'var(--text-muted)', whiteSpace:'nowrap', marginLeft:8 }}>{a.t} ago</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>🏗️ SVG 2.0 Hardware Specs</h3>
          {[['Processor','NXP i.MX 95 (A55+M33)'],['RAM','16 GB LPDDR5'],['NPU','2 TOPS AI accelerator'],['Storage','32 GB eMMC + SD'],['Security','TPM 2.0 + Post-Quantum'],['Connectivity','5G/LTE + Dual SIM + Satellite'],['CAN','J1939 + CAN FD (5 Mbps)'],['Protocols','MQTT/TLS, HTTP/2, BLE 5.3']].map(([k,v],i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:12, borderBottom:i<7?'1px solid var(--border)':'none' }}>
              <span style={{ color:'var(--text-muted)' }}>{k}</span><span style={{ fontWeight:600, fontFamily:'monospace' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </>)}

    {/* ═ DEVICE REGISTRY ═ */}
    {tab==='devices' && (<div>
      <div className="card" style={{ padding:12, marginBottom:12, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <input type="text" placeholder="🔍 Search Hardware ID, Serial, Owner..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex:1, minWidth:200, padding:'6px 12px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }} />
        <select value={filterLifecycle} onChange={e => setFilterLifecycle(e.target.value)} style={{ padding:'6px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }}>
          <option value="all">All States</option>{['manufactured','provisioned','deployed','operational','maintenance','decommissioned'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterFleet} onChange={e => setFilterFleet(e.target.value)} style={{ padding:'6px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }}>
          <option value="all">All Fleets</option>{FLEET_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
        </select>
        <button onClick={() => setTab('register')} style={{ padding:'6px 14px', fontSize:12, fontWeight:600, background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>➕ Register Device</button>
      </div>
      <TableCard title="SVG Device Registry" count={filteredDevices.length}>
        <CrudDataTable columns={[
          { label:'Hardware ID', render:(r:SVGDevice) => <div><div style={{ fontWeight:600, fontFamily:'monospace', fontSize:12 }}>{r.hardwareId}</div><div style={{ fontSize:10, color:'var(--text-muted)' }}>{r.serialNumber}</div></div> },
          { label:'Status', render:(r:SVGDevice) => <span>{statusDot(r.status)}{r.status}</span> },
          { label:'Lifecycle', render:(r:SVGDevice) => <Badge status={r.lifecycle==='operational'?'active':r.lifecycle==='maintenance'?'warning':'info'}>{r.lifecycle}</Badge> },
          { label:'Fleet', render:(r:SVGDevice) => <span>{fleetIcon(r.fleetType)} {r.fleetType}</span> },
          { label:'Owner', key:'owner' }, { label:'Location', key:'location' },
          { label:'Firmware', render:(r:SVGDevice) => <span style={{ fontFamily:'monospace', fontSize:11 }}>{r.firmwareVersion}</span> },
          { label:'Last Seen', render:(r:SVGDevice) => { const d=Date.now()-r.lastSeen.getTime(); return d<60000?`${Math.floor(d/1000)}s`:d<3600000?`${Math.floor(d/60000)}m`:`${Math.floor(d/3600000)}h`; } },
        ]} rows={filteredDevices} onRowClick={(r:SVGDevice) => { setSelected(r); setDetailTab('overview'); }} />
      </TableCard>
      <div className="grid grid-5" style={{ marginTop:12 }}>
        {FLEET_TYPES.map(ft => { const c=MOCK_DEVICES.filter(d=>d.fleetType===ft).length, o=MOCK_DEVICES.filter(d=>d.fleetType===ft&&d.status==='online').length; return (
          <div key={ft} className="card" style={{ padding:12, textAlign:'center', cursor:'pointer' }} onClick={()=>setFilterFleet(ft)}>
            <div style={{ fontSize:24 }}>{fleetIcon(ft)}</div><div style={{ fontSize:18, fontWeight:700 }}>{c}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase' }}>{ft}</div><div style={{ fontSize:10, color:'#10b981' }}>{o} online</div>
          </div>
        ); })}
      </div>
    </div>)}

    {/* ═ REGISTER ═ */}
    {tab==='register' && (<div className="card" style={{ padding:20, maxWidth:800, margin:'0 auto' }}>
      <div style={{ padding:12, background:'#1e3a5f', border:'1px solid #2563eb44', borderRadius:8, marginBottom:20, fontSize:12 }}>ℹ️ Ensure all information is accurate. QC must be completed and TPM key verified.</div>
      <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>🔧 Hardware Information</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        {[['Part Number *','partNumber','PN-SVG-2025'],['Serial Number *','serialNumber','SN-']].map(([lbl,key,ph]) => (
          <div key={key}><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>{lbl}</label>
            <input type="text" placeholder={ph} value={(regForm as any)[key]} onChange={e => setRegForm(p => ({ ...p, [key]:e.target.value }))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }} /></div>
        ))}
      </div>
      <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>MAC Address *</label>
        <input type="text" placeholder="00:1A:2B:3C:4D:5E" value={regForm.macAddress} onChange={e => setRegForm(p=>({...p,macAddress:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }} /></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Country *</label>
          <select value={regForm.countryCode} onChange={e => setRegForm(p=>({...p,countryCode:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }}>
            {[['UAE','UAE'],['CHE','Switzerland'],['KEN','Kenya'],['TZA','Tanzania']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select></div>
        <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Fleet Type *</label>
          <select value={regForm.fleetType} onChange={e => setRegForm(p=>({...p,fleetType:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }}>
            {FLEET_TYPES.map(ft => <option key={ft} value={ft}>{fleetIcon(ft)} {ft}</option>)}
          </select></div>
      </div>
      <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>TPM Endorsement Key (Public) *</label>
        <textarea placeholder="-----BEGIN PUBLIC KEY-----" value={regForm.tpmEndorsementKey} onChange={e => setRegForm(p=>({...p,tpmEndorsementKey:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:11, fontFamily:'monospace', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)', minHeight:80, resize:'vertical' }} /></div>
      <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12, marginTop:24 }}>🏭 Manufacturing</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Mfg Date</label><input type="date" value={regForm.manufacturingDate} onChange={e => setRegForm(p=>({...p,manufacturingDate:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }} /></div>
        <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Factory</label><select value={regForm.factoryLocation} onChange={e => setRegForm(p=>({...p,factoryLocation:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }}>{FACTORIES.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
      </div>
      <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>✅ Quality Control</h3>
      {[['confirmedAccurate','I confirm all information is accurate'],['qcPassed','QC inspection passed — all tests completed'],['readyForProvisioning','Device ready for provisioning']].map(([key,lbl]) => (
        <label key={key} style={{ display:'flex', gap:8, alignItems:'center', cursor:'pointer', marginBottom:8, fontSize:12 }}><input type="checkbox" checked={(regForm as any)[key]} onChange={e => setRegForm(p=>({...p,[key]:e.target.checked}))} /><span>{lbl}</span></label>
      ))}
      <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
        <button onClick={()=>setTab('devices')} style={{ padding:'8px 20px', fontSize:12, background:'var(--bg-secondary)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:6, cursor:'pointer' }}>Cancel</button>
        <button onClick={handleRegister} style={{ padding:'8px 20px', fontSize:12, fontWeight:600, background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>Register & Start Provisioning</button>
      </div>
    </div>)}

    {/* ═ PROVISIONING WORKFLOW ═ */}
    {tab==='workflow' && (<div className="card" style={{ padding:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div><h3 style={{ fontSize:16, fontWeight:700 }}>Device Provisioning Workflow</h3><span style={{ fontSize:12, color:'var(--text-muted)' }}>WF-2025-001234 · SVG-A1B2AE-025</span></div>
        <Badge status="active">⟳ Running</Badge>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}><span style={{ fontWeight:600 }}>Progress: {workflowProgress}%</span><span style={{ color:'var(--text-muted)' }}>Elapsed: 00:02:34 · Step 5/8</span></div>
        <div style={{ height:8, background:'var(--bg-secondary)', borderRadius:4, overflow:'hidden' }}><div style={{ height:'100%', width:`${workflowProgress}%`, background:'linear-gradient(90deg,#10b981,#22d3ee,#3b82f6)', borderRadius:4, transition:'width 0.5s' }} /></div>
      </div>
      <div style={{ padding:'8px 0' }}>{workflowSteps.map((s,i) => renderStep(s,i))}</div>
      <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8 }}>📜 Execution Logs</h4>
        <div style={{ background:'#0a0f1a', color:'#00ff88', padding:12, borderRadius:8, fontFamily:'monospace', fontSize:11, maxHeight:240, overflowY:'auto', lineHeight:1.7 }}>
          {workflowLogs.map((l,i) => <div key={i} style={{ opacity:i===workflowLogs.length-1?1:0.75 }}>{l}</div>)}
          <div style={{ animation:'blink 1s infinite' }}>▋</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginTop:16 }}>
        {[['⏸ Pause','var(--bg-secondary)','var(--text-primary)','1px solid var(--border)'],['✗ Cancel','#ef4444','#fff','none'],['📋 Export Logs','#3b82f6','#fff','none']].map(([lbl,bg,cl,bd],i) => (
          <button key={i} style={{ padding:'8px 16px', fontSize:12, background:bg, color:cl, border:bd, borderRadius:6, cursor:'pointer' }}>{lbl}</button>
        ))}
      </div>
    </div>)}

    {/* ═ LIFECYCLE ═ */}
    {tab==='lifecycle' && (<>
      <div className="grid grid-2">
        <ChartCard title="Lifecycle Transitions — Monthly" type="bar" data={{ labels:['Sep','Oct','Nov','Dec','Jan','Feb'], datasets:[
          { label:'Manufactured', data:[50,65,80,110,130,160], backgroundColor:'#6b7280' },
          { label:'Provisioned', data:[48,60,75,105,125,150], backgroundColor:'#3b82f6' },
          { label:'Deployed', data:[42,55,68,98,115,140], backgroundColor:'#8b5cf6' },
          { label:'Operational', data:[38,50,62,90,108,130], backgroundColor:'#10b981' },
        ] }} />
        <ChartCard title="MTBF (hours)" type="line" data={{ labels:['Sep','Oct','Nov','Dec','Jan','Feb'], datasets:[
          { label:'MTBF', data:[2400,2800,3200,3500,4000,4320], borderColor:'#22d3ee', fill:true, backgroundColor:'rgba(34,211,238,0.08)' },
          { label:'Target', data:[3000,3000,3500,3500,4000,4000], borderColor:'#f59e0b', borderDash:[5,5] },
        ] }} />
      </div>
      <div className="grid grid-4" style={{ marginTop:16 }}>
        <GaugeChart title="Avg Provisioning" value={12.4} max={30} thresholds={[15,20]} trend={-1.2} />
        <GaugeChart title="First-Pass Yield" value={98.2} max={100} thresholds={[95,98]} trend={0.4} />
        <GaugeChart title="MTTR (hours)" value={2.1} max={8} thresholds={[4,6]} trend={-0.3} />
        <GaugeChart title="Decommission %" value={0.4} max={5} thresholds={[2,3]} trend={-0.1} />
      </div>
      <div className="card" style={{ padding:16, marginTop:16 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>🔄 State Machine</h3>
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', justifyContent:'center', padding:16 }}>
          {['Manufactured','→','Provisioned','→','Deployed','→','Operational','↔','Maintenance','→','Decommissioned'].map((s,i) => (
            s.includes('→')||s.includes('↔') ? <span key={i} style={{ fontSize:18, color:'var(--text-muted)' }}>{s}</span> :
            <div key={i} style={{ padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, background:s==='Operational'?'#10b98122':s==='Decommissioned'?'#ef444422':s==='Maintenance'?'#f59e0b22':'#3b82f622', color:s==='Operational'?'#10b981':s==='Decommissioned'?'#ef4444':s==='Maintenance'?'#f59e0b':'#3b82f6', border:`1px solid ${s==='Operational'?'#10b98144':s==='Decommissioned'?'#ef444444':s==='Maintenance'?'#f59e0b44':'#3b82f644'}` }}>{s}</div>
          ))}
        </div>
      </div>
    </>)}

    {/* ═ ANALYTICS ═ */}
    {tab==='analytics' && (<>
      <div className="grid grid-2">
        <ChartCard title="Provisioning Success Rate" type="line" data={{ labels:['Sep','Oct','Nov','Dec','Jan','Feb'], datasets:[
          { label:'Success %', data:[96.2,97.1,97.8,98.2,98.5,99.4], borderColor:'#10b981', fill:true, backgroundColor:'rgba(16,185,129,0.08)' },
          { label:'Target', data:[98,98,98,98,99,99], borderColor:'#f59e0b', borderDash:[5,5] },
        ] }} />
        <ChartCard title="Avg Time by Fleet" type="bar" data={{ labels:['Tanker','Bus','Taxi','EV','Cold Chain'], datasets:[
          { label:'Minutes', data:[14.2,11.8,10.5,12.1,13.5], backgroundColor:['#22d3ee','#f59e0b','#10b981','#8b5cf6','#06b6d4'] },
        ] }} />
      </div>
      <div className="grid grid-4" style={{ marginTop:16 }}>
        <GaugeChart title="Fleet Utilization" value={87.3} max={100} thresholds={[70,85]} trend={2.1} />
        <GaugeChart title="Health Score" value={94.6} max={100} thresholds={[85,92]} trend={0.8} />
        <GaugeChart title="Cert Compliance" value={99.2} max={100} thresholds={[95,98]} trend={0.2} />
        <GaugeChart title="Blockchain Sync" value={99.8} max={100} thresholds={[95,99]} trend={0.1} />
      </div>
    </>)}

    <Modal open={!!selected} onClose={() => setSelected(null)} title="SVG Device Details" lg>{renderDetail()}</Modal>
    <style>{`@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(59,130,246,0.4)}70%{box-shadow:0 0 0 6px transparent}100%{box-shadow:0 0 0 0 transparent}}`}</style>
    <toast.Toast />
  </div>);
}
