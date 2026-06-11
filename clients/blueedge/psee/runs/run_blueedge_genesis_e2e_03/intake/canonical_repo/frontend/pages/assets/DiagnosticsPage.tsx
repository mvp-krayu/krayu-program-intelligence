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
interface BlockchainRecord {
  id: string; txHash: string; type: 'registration'|'transfer'|'config_update'|'audit'|'certificate'|'decommission';
  deviceId: string; blockNumber: number; chainId: string; timestamp: Date;
  status: 'confirmed'|'pending'|'failed'; gasUsed: number; from: string; to: string;
  payload: string; confirmations: number;
}

interface SmartContract {
  id: string; name: string; address: string; network: string; version: string;
  deployedAt: Date; totalCalls: number; status: 'active'|'paused'|'deprecated';
  functions: { name: string; calls: number; avgGas: number }[];
}

interface DeviceWallet {
  id: string; deviceId: string; hardwareId: string; address: string;
  balance: number; currency: string; nftTokenId: string;
  transactions: WalletTransaction[]; createdAt: Date;
}

interface WalletTransaction {
  id: string; type: 'mint'|'transfer'|'escrow_deposit'|'escrow_release'|'reward'|'fee';
  amount: number; currency: string; from: string; to: string;
  txHash: string; timestamp: Date; status: 'confirmed'|'pending';
}

interface OwnershipTransfer {
  id: string; deviceId: string; hardwareId: string;
  fromOrg: string; toOrg: string; type: 'sale'|'lease'|'return'|'reassignment'|'gift';
  status: 'pending_approval'|'approved'|'escrow'|'completed'|'rejected'|'cancelled';
  price: number; currency: string; useEscrow: boolean; transferWallet: boolean;
  escrowStatus: 'none'|'funded'|'released'|'refunded';
  terms: string; txHash: string; createdAt: Date; completedAt: Date|null;
  approvalChain: { role: string; name: string; status: string; date: Date|null }[];
}

interface DeviceCertificate {
  id: string; deviceId: string; hardwareId: string;
  type: 'device_auth'|'tls_client'|'mqtt_broker'|'code_signing'|'blockchain_identity';
  issuer: string; subject: string; algorithm: string;
  validFrom: Date; validUntil: Date; serialNumber: string;
  status: 'active'|'expiring_soon'|'expired'|'revoked';
  keyType: string; keySize: string; fingerprint: string;
}

interface DiagnosticRecord {
  id: string; vehicleId: string; dtcCode: string; description: string;
  system: string; severity: 'critical'|'warning'|'info'; status: 'active'|'pending'|'cleared';
  protocol: string; spn: string; fmi: string; occurrenceCount: number;
  recordedAt: Date; clearedAt: Date|null; freezeFrame: Record<string,string>;
  recommendations: string[];
}

/* ─────────────── Constants ─────────────── */
const TABS = [
  { id: 'dashboard', label: '📊 Overview' },
  { id: 'blockchain', label: '⛓️ Blockchain' },
  { id: 'wallets', label: '💰 Wallets' },
  { id: 'transfers', label: '🔄 Transfers' },
  { id: 'certificates', label: '🔐 Certificates' },
  { id: 'dtc', label: '🔧 DTC / Diagnostics' },
];
const spark = (n: number) => Array.from({ length: 12 }, () => n * (0.85 + Math.random() * 0.3));
const rHex = (n: number) => Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');

/* ─────────────── Mock Data ─────────────── */
const BLOCKCHAIN_RECORDS: BlockchainRecord[] = Array.from({ length: 15 }, (_, i) => ({
  id: `BC-${String(i+1).padStart(4,'0')}`,
  txHash: `0x${rHex(64)}`,
  type: (['registration','transfer','config_update','audit','certificate','decommission'] as const)[i%6],
  deviceId: `SVG-${['A1B2','C3D4','E5F6','G7H8','I9J0'][i%5]}AE-${String(i+1).padStart(3,'0')}`,
  blockNumber: 18500000 + i * 12,
  chainId: 'hyperledger-blueedge-prod',
  timestamp: new Date(Date.now() - i * 3600000 * 2),
  status: i < 14 ? 'confirmed' : 'pending',
  gasUsed: 45000 + Math.floor(Math.random() * 30000),
  from: `0x${rHex(40)}`,
  to: `0x${rHex(40)}`,
  payload: `{ "action": "${['register','transfer','update','audit','certify','decommission'][i%6]}", "device": "SVG-${i}" }`,
  confirmations: i < 14 ? 12 + Math.floor(Math.random() * 50) : 0,
}));

const SMART_CONTRACTS: SmartContract[] = [
  { id:'SC-001', name:'DeviceRegistry', address:`0x${rHex(40)}`, network:'Hyperledger Blue Edge', version:'v2.1.0', deployedAt:new Date(2024,6,1), totalCalls:45230, status:'active',
    functions:[{ name:'registerDevice', calls:12453, avgGas:65000 },{ name:'transferOwnership', calls:3847, avgGas:85000 },{ name:'updateConfig', calls:18450, avgGas:45000 },{ name:'decommission', calls:180, avgGas:55000 }] },
  { id:'SC-002', name:'CustodyChain', address:`0x${rHex(40)}`, network:'Hyperledger Blue Edge', version:'v1.5.0', deployedAt:new Date(2024,8,15), totalCalls:28900, status:'active',
    functions:[{ name:'createCustodyRecord', calls:15200, avgGas:72000 },{ name:'transferCustody', calls:8400, avgGas:92000 },{ name:'verifyCustody', calls:5300, avgGas:35000 }] },
  { id:'SC-003', name:'EscrowManager', address:`0x${rHex(40)}`, network:'Hyperledger Blue Edge', version:'v1.2.0', deployedAt:new Date(2024,10,1), totalCalls:5600, status:'active',
    functions:[{ name:'createEscrow', calls:2800, avgGas:110000 },{ name:'fundEscrow', calls:2600, avgGas:65000 },{ name:'releaseEscrow', calls:2400, avgGas:75000 },{ name:'refundEscrow', calls:200, avgGas:55000 }] },
  { id:'SC-004', name:'DeviceNFT (ERC-721)', address:`0x${rHex(40)}`, network:'Hyperledger Blue Edge', version:'v1.0.0', deployedAt:new Date(2024,6,1), totalCalls:12453, status:'active',
    functions:[{ name:'mint', calls:12453, avgGas:125000 },{ name:'transferFrom', calls:3847, avgGas:95000 },{ name:'tokenURI', calls:25000, avgGas:25000 }] },
  { id:'SC-005', name:'AuditTrail', address:`0x${rHex(40)}`, network:'Hyperledger Blue Edge', version:'v1.1.0', deployedAt:new Date(2024,7,1), totalCalls:125000, status:'active',
    functions:[{ name:'logEvent', calls:120000, avgGas:35000 },{ name:'getHistory', calls:5000, avgGas:28000 }] },
];

const WALLETS: DeviceWallet[] = Array.from({ length: 8 }, (_, i) => ({
  id: `WAL-${String(i+1).padStart(4,'0')}`,
  deviceId: `dev-${String(i+1).padStart(5,'0')}`,
  hardwareId: `SVG-${['A1B2','C3D4','E5F6','G7H8','I9J0','K1L2','M3N4','O5P6'][i]}AE-${String(i+1).padStart(3,'0')}`,
  address: `0x${rHex(40)}`,
  balance: Math.random() * 500 + 50,
  currency: 'EDGE',
  nftTokenId: `#${10000 + i}`,
  createdAt: new Date(2024, 6 + Math.floor(i/3), 1 + i*3),
  transactions: Array.from({ length: 4 }, (_, j) => ({
    id: `TX-${i}-${j}`, type: (['mint','reward','transfer','fee'] as const)[j%4],
    amount: j===0 ? 100 : j===1 ? 25 + Math.random()*50 : j===2 ? -(50 + Math.random()*100) : -(0.5 + Math.random()*2),
    currency: 'EDGE', from: j<2 ? 'System' : `0x${rHex(8)}...`, to: j<2 ? `0x${rHex(8)}...` : 'System',
    txHash: `0x${rHex(16)}...`, timestamp: new Date(Date.now() - j*86400000*(1+i)), status: 'confirmed' as const,
  })),
}));

const TRANSFERS: OwnershipTransfer[] = [
  { id:'TR-2025-8829', deviceId:'SVG-C3D4AE-002', hardwareId:'SVG-C3D4AE-002', fromOrg:'Dubai Tanker Corp', toOrg:'ENOC Fleet', type:'sale', status:'completed', price:15000, currency:'AED', useEscrow:true, transferWallet:true, escrowStatus:'released', terms:'Device sold as-is with 90-day warranty', txHash:`0x${rHex(64)}`, createdAt:new Date(2025,0,14), completedAt:new Date(2025,0,16), approvalChain:[{ role:'Seller', name:'Khalid', status:'approved', date:new Date(2025,0,14) },{ role:'Buyer', name:'ENOC Ops', status:'approved', date:new Date(2025,0,15) },{ role:'Escrow Agent', name:'System', status:'approved', date:new Date(2025,0,16) }] },
  { id:'TR-2025-8830', deviceId:'SVG-G7H8AE-004', hardwareId:'SVG-G7H8AE-004', fromOrg:'RTA Bus Fleet', toOrg:'Emirates Bus Co', type:'lease', status:'pending_approval', price:500, currency:'AED/month', useEscrow:false, transferWallet:false, escrowStatus:'none', terms:'12-month lease with option to purchase', txHash:'', createdAt:new Date(2025,0,15), completedAt:null, approvalChain:[{ role:'Lessor', name:'Fatima', status:'approved', date:new Date(2025,0,15) },{ role:'Lessee', name:'Emirates Bus', status:'pending', date:null },{ role:'Legal', name:'Legal Dept', status:'pending', date:null }] },
  { id:'TR-2025-8831', deviceId:'SVG-K1L2AE-006', hardwareId:'SVG-K1L2AE-006', fromOrg:'Green EV Transport', toOrg:'ColdLogistics ME', type:'sale', status:'escrow', price:18500, currency:'AED', useEscrow:true, transferWallet:true, escrowStatus:'funded', terms:'Includes 1-year extended warranty', txHash:`0x${rHex(64)}`, createdAt:new Date(2025,0,15), completedAt:null, approvalChain:[{ role:'Seller', name:'Sara', status:'approved', date:new Date(2025,0,15) },{ role:'Buyer', name:'Cold Ops', status:'approved', date:new Date(2025,0,15) },{ role:'Escrow', name:'System', status:'pending', date:null }] },
  { id:'TR-2025-8832', deviceId:'SVG-A1B2AE-001', hardwareId:'SVG-A1B2AE-001', fromOrg:'ENOC Fleet', toOrg:'Al Ghurair Tankers', type:'reassignment', status:'approved', price:0, currency:'AED', useEscrow:false, transferWallet:true, escrowStatus:'none', terms:'Internal fleet reassignment', txHash:`0x${rHex(64)}`, createdAt:new Date(2025,0,16), completedAt:null, approvalChain:[{ role:'Fleet Manager', name:'Ahmed', status:'approved', date:new Date(2025,0,16) },{ role:'Operations', name:'Ops Team', status:'approved', date:new Date(2025,0,16) }] },
];

const CERTIFICATES: DeviceCertificate[] = Array.from({ length: 12 }, (_, i) => ({
  id: `CERT-${String(i+1).padStart(4,'0')}`,
  deviceId: `SVG-${['A1B2','C3D4','E5F6','G7H8'][i%4]}AE-${String(Math.floor(i/3)+1).padStart(3,'0')}`,
  hardwareId: `SVG-${['A1B2','C3D4','E5F6','G7H8'][i%4]}AE-${String(Math.floor(i/3)+1).padStart(3,'0')}`,
  type: (['device_auth','tls_client','mqtt_broker','code_signing','blockchain_identity'] as const)[i%5],
  issuer: ['Blue Edge Root CA','Blue Edge Intermediate CA','AWS IoT CA','Blue Edge Code Signing CA','Blue Edge Blockchain CA'][i%5],
  subject: `CN=SVG-${['A1B2','C3D4','E5F6','G7H8'][i%4]}AE, O=Blue Edge Network LLC, C=AE`,
  algorithm: ['ECDSA P-384','RSA-4096','ECDSA P-256','ECDSA P-384','Ed25519'][i%5],
  validFrom: new Date(2025, 0, 1),
  validUntil: new Date(2026, i%3===2 ? 1 : 6, 30),
  serialNumber: `${rHex(20)}`,
  status: i%3===2 && i>8 ? 'expiring_soon' : 'active',
  keyType: ['EC','RSA','EC','EC','EdDSA'][i%5],
  keySize: ['384-bit','4096-bit','256-bit','384-bit','256-bit'][i%5],
  fingerprint: `SHA256:${rHex(32)}`,
}));

const DIAGNOSTICS: DiagnosticRecord[] = [
  { id:'DTC-001', vehicleId:'VEH-TK-001', dtcCode:'P0101', description:'Mass Air Flow Circuit Range/Performance', system:'Engine', severity:'warning', status:'active', protocol:'J1939', spn:'132', fmi:'2', occurrenceCount:3, recordedAt:new Date(Date.now()-3600000*2), clearedAt:null, freezeFrame:{ 'Engine RPM':'1450', 'Vehicle Speed':'65 km/h', 'Coolant Temp':'92°C', 'MAF Rate':'12.5 g/s' }, recommendations:['Check MAF sensor connector','Clean MAF sensor element','Inspect air filter'] },
  { id:'DTC-002', vehicleId:'VEH-BUS-012', dtcCode:'P0217', description:'Engine Coolant Over Temperature', system:'Cooling', severity:'critical', status:'active', protocol:'J1939', spn:'110', fmi:'0', occurrenceCount:1, recordedAt:new Date(Date.now()-1800000), clearedAt:null, freezeFrame:{ 'Coolant Temp':'108°C', 'Engine RPM':'2200', 'Ambient Temp':'45°C', 'Fan Speed':'100%' }, recommendations:['Stop vehicle immediately','Check coolant level','Inspect thermostat','Check water pump'] },
  { id:'DTC-003', vehicleId:'VEH-TK-005', dtcCode:'P0563', description:'System Voltage High', system:'Electrical', severity:'warning', status:'active', protocol:'OBD-II', spn:'158', fmi:'0', occurrenceCount:5, recordedAt:new Date(Date.now()-7200000), clearedAt:null, freezeFrame:{ 'Battery Voltage':'29.2V', 'Engine RPM':'1800', 'Alt Output':'30.1V' }, recommendations:['Check voltage regulator','Test alternator output','Inspect battery connections'] },
  { id:'DTC-004', vehicleId:'VEH-TAXI-034', dtcCode:'U0100', description:'Lost Communication with ECM/PCM', system:'Communication', severity:'critical', status:'pending', protocol:'CAN', spn:'520', fmi:'12', occurrenceCount:2, recordedAt:new Date(Date.now()-900000), clearedAt:null, freezeFrame:{ 'CAN Bus Load':'92%', 'Error Frames':'45', 'Bus State':'Error Passive' }, recommendations:['Check CAN bus wiring','Inspect ECM connectors','Verify CAN termination resistors'] },
  { id:'DTC-005', vehicleId:'VEH-BUS-008', dtcCode:'P2002', description:'Diesel Particulate Filter Efficiency Below Threshold', system:'Emissions', severity:'warning', status:'active', protocol:'J1939', spn:'3251', fmi:'18', occurrenceCount:8, recordedAt:new Date(Date.now()-86400000), clearedAt:null, freezeFrame:{ 'DPF Pressure':'12.5 kPa', 'Exhaust Temp':'380°C', 'Soot Load':'85%' }, recommendations:['Initiate forced DPF regeneration','Check exhaust temperature sensor','Inspect DPF for damage'] },
  { id:'DTC-006', vehicleId:'VEH-TK-003', dtcCode:'P0191', description:'Fuel Rail Pressure Sensor Circuit Range', system:'Fuel', severity:'info', status:'cleared', protocol:'J1939', spn:'157', fmi:'2', occurrenceCount:1, recordedAt:new Date(Date.now()-172800000), clearedAt:new Date(Date.now()-86400000), freezeFrame:{ 'Fuel Pressure':'35 MPa', 'Engine RPM':'800', 'Fuel Temp':'42°C' }, recommendations:['Cleared after fuel filter replacement'] },
];

/* ─────────────── Component ─────────────── */
export default function DiagnosticsPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('dashboard');
  const [selectedTx, setSelectedTx] = useState<BlockchainRecord|null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<OwnershipTransfer|null>(null);
  const [selectedCert, setSelectedCert] = useState<DeviceCertificate|null>(null);
  const [selectedDtc, setSelectedDtc] = useState<DiagnosticRecord|null>(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferForm, setTransferForm] = useState({ device:'', newOwner:'', type:'sale', price:'', useEscrow:true, transferWallet:true, terms:'' });
  const toast = useToast();

  const bcStats = useMemo(() => ({
    totalTx: BLOCKCHAIN_RECORDS.length * 823,
    confirmed: BLOCKCHAIN_RECORDS.filter(r=>r.status==='confirmed').length * 820,
    pending: BLOCKCHAIN_RECORDS.filter(r=>r.status==='pending').length * 3,
    contracts: SMART_CONTRACTS.length,
    totalDevicesOnChain: 12453,
    totalTransfers: 3847,
  }), []);

  const certStats = useMemo(() => ({
    total: CERTIFICATES.length * 62,
    active: CERTIFICATES.filter(c=>c.status==='active').length * 60,
    expiring: CERTIFICATES.filter(c=>c.status==='expiring_soon').length * 8,
    expired: 2, revoked: 1,
  }), []);

  const kpis = [
    { title:'Blockchain TXs', value:bcStats.totalTx, trend:125, sparkline:spark(bcStats.totalTx) },
    { title:'Devices On-Chain', value:bcStats.totalDevicesOnChain, trend:210, sparkline:spark(bcStats.totalDevicesOnChain) },
    { title:'Active Transfers', value:TRANSFERS.filter(t=>!['completed','rejected','cancelled'].includes(t.status)).length, trend:2, sparkline:spark(4) },
    { title:'Certificates', value:certStats.total, trend:62, sparkline:spark(certStats.total) },
    { title:'Smart Contracts', value:bcStats.contracts, trend:0, sparkline:spark(5) },
    { title:'Active DTCs', value:DIAGNOSTICS.filter(d=>d.status==='active').length, trend:-1, sparkline:spark(5) },
  ];

  const txTypeIcon = (t: string) => ({ registration:'📋', transfer:'🔄', config_update:'⚙️', audit:'📝', certificate:'🔐', decommission:'🗑️' }[t] || '📦');
  const sevColor = (s: string) => ({ critical:'#ef4444', warning:'#f59e0b', info:'#3b82f6' }[s] || '#6b7280');

  return (<div>
    <PageHeader title="Blockchain, Certificates & Diagnostics" breadcrumb="Assets › Diagnostics" subtitle="Blockchain records, wallet management, ownership transfers, certificates & DTC diagnostics" />
    <div className="grid grid-3" style={{ marginBottom:20 }}>{kpis.map((k,i) => <TrendCard key={i} {...k} />)}</div>
    <TabBar tabs={TABS} active={tab} onChange={setTab} />

    {/* ═ DASHBOARD ═ */}
    {tab==='dashboard' && (<>
      <div className="grid grid-2">
        <ChartCard title="Blockchain Transactions — Monthly" type="line" data={{ labels:['Sep','Oct','Nov','Dec','Jan','Feb'], datasets:[
          { label:'Registrations', data:[800,1200,1800,2500,3200,4100], borderColor:'#22d3ee', fill:true, backgroundColor:'rgba(34,211,238,0.08)' },
          { label:'Transfers', data:[200,350,500,750,900,1200], borderColor:'#f59e0b' },
          { label:'Config Updates', data:[1500,2000,2800,3500,4200,5500], borderColor:'#10b981' },
          { label:'Audits', data:[5000,8000,12000,18000,24000,32000], borderColor:'#8b5cf6', borderDash:[5,5] },
        ] }} />
        <ChartCard title="Certificate Status" type="doughnut" data={{ labels:['Active','Expiring Soon','Expired','Revoked'], datasets:[{ data:[certStats.active,certStats.expiring,certStats.expired,certStats.revoked], backgroundColor:['#10b981','#f59e0b','#ef4444','#6b7280'] }] }} />
      </div>
      <div className="grid grid-4" style={{ marginTop:16 }}>
        <GaugeChart title="Chain Sync" value={99.99} max={100} thresholds={[99,99.9]} trend={0.01} />
        <GaugeChart title="Cert Compliance" value={99.6} max={100} thresholds={[95,98]} trend={0.2} />
        <GaugeChart title="Escrow Fill Rate" value={100} max={100} thresholds={[90,95]} trend={0} />
        <GaugeChart title="DTC Resolution" value={85.2} max={100} thresholds={[70,85]} trend={3.1} />
      </div>
      <div className="grid grid-2" style={{ marginTop:16 }}>
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>⛓️ Smart Contracts</h3>
          {SMART_CONTRACTS.map(sc => (
            <div key={sc.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:12 }}>
              <div><span style={{ fontWeight:600 }}>{sc.name}</span><span style={{ fontSize:10, color:'var(--text-muted)', marginLeft:8 }}>{sc.version}</span></div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontFamily:'monospace', fontSize:10, color:'var(--text-muted)' }}>{sc.address.slice(0,10)}...</span>
                <span style={{ fontWeight:600, color:'#22d3ee' }}>{sc.totalCalls.toLocaleString()} calls</span>
                <Badge status="active">{sc.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>🔧 Active DTCs</h3>
          {DIAGNOSTICS.filter(d=>d.status==='active').map(d => (
            <div key={d.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:12 }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:sevColor(d.severity) }} />
                <span style={{ fontFamily:'monospace', fontWeight:600 }}>{d.dtcCode}</span>
                <span style={{ color:'var(--text-muted)' }}>{d.description.slice(0,40)}...</span>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <span style={{ fontSize:10, color:'var(--text-muted)' }}>{d.vehicleId}</span>
                <Badge status={d.severity==='critical'?'critical':'warning'}>{d.severity}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>)}

    {/* ═ BLOCKCHAIN ═ */}
    {tab==='blockchain' && (<div>
      <div className="grid grid-2" style={{ marginBottom:16 }}>
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>⛓️ Chain Info</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
            {[['Network','Hyperledger Blue Edge (Private)'],['Consensus','PBFT (Practical Byzantine Fault Tolerance)'],['Block Time','~2 seconds'],['Latest Block',`#${(18500000+BLOCKCHAIN_RECORDS.length*12).toLocaleString()}`],
              ['Total Transactions',bcStats.totalTx.toLocaleString()],['Devices Registered',bcStats.totalDevicesOnChain.toLocaleString()],['Validator Nodes','7 (Dubai, Abu Dhabi, Zurich, Geneva, Nairobi, Mombasa, Dar es Salaam)'],['Chain Size','42.8 GB'],
            ].map(([l,v],i) => (
              <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:12, fontWeight:600, fontFamily:'monospace' }}>{v}</div></div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding:16 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>📜 Smart Contracts</h3>
          {SMART_CONTRACTS.map(sc => (
            <div key={sc.id} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6, marginBottom:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontWeight:600, fontSize:12 }}>{sc.name} <span style={{ fontFamily:'monospace', fontSize:10, color:'var(--text-muted)' }}>{sc.version}</span></span>
                <Badge status="active">{sc.status}</Badge>
              </div>
              <div style={{ fontFamily:'monospace', fontSize:10, color:'#8b5cf6', marginBottom:4 }}>{sc.address}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {sc.functions.map((f,i) => (
                  <span key={i} style={{ fontSize:10, padding:'2px 6px', background:'var(--bg-primary)', borderRadius:4, color:'var(--text-muted)' }}>{f.name}() — {f.calls.toLocaleString()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <TableCard title="Recent Blockchain Transactions" count={BLOCKCHAIN_RECORDS.length}>
        <CrudDataTable columns={[
          { label:'TX Hash', render:(r:BlockchainRecord) => <span style={{ fontFamily:'monospace', fontSize:10 }}>{r.txHash.slice(0,18)}...</span> },
          { label:'Type', render:(r:BlockchainRecord) => <span>{txTypeIcon(r.type)} <Badge status={r.type==='registration'?'info':r.type==='transfer'?'warning':r.type==='audit'?'secondary':'active'}>{r.type.replace(/_/g,' ')}</Badge></span> },
          { label:'Device', render:(r:BlockchainRecord) => <span style={{ fontFamily:'monospace', fontSize:11 }}>{r.deviceId}</span> },
          { label:'Block', render:(r:BlockchainRecord) => <span style={{ fontFamily:'monospace', fontSize:11 }}>#{r.blockNumber.toLocaleString()}</span> },
          { label:'Confirmations', render:(r:BlockchainRecord) => <span style={{ fontWeight:600, color:r.confirmations>6?'#10b981':'#f59e0b' }}>{r.confirmations}</span> },
          { label:'Status', render:(r:BlockchainRecord) => <Badge status={r.status==='confirmed'?'active':r.status==='pending'?'warning':'critical'}>{r.status}</Badge> },
          { label:'Time', render:(r:BlockchainRecord) => { const m=Math.floor((Date.now()-r.timestamp.getTime())/60000); return m<60?`${m}m ago`:`${Math.floor(m/60)}h ago`; } },
        ]} rows={BLOCKCHAIN_RECORDS} onRowClick={(r:BlockchainRecord) => setSelectedTx(r)} />
      </TableCard>
    </div>)}

    {/* ═ WALLETS ═ */}
    {tab==='wallets' && (<div>
      <div className="grid grid-4" style={{ marginBottom:16 }}>
        {[['Total Balance',`${WALLETS.reduce((s,w)=>s+w.balance,0).toFixed(2)} EDGE`,'#f59e0b'],['Active Wallets',`${WALLETS.length * 1556}`,'#10b981'],['NFTs Minted',`${bcStats.totalDevicesOnChain}`,'#8b5cf6'],['Escrow Held','45,200 AED','#3b82f6']].map(([l,v,c],i) => (
          <div key={i} className="card" style={{ padding:14, textAlign:'center' }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:700, color:c }}>{v}</div>
          </div>
        ))}
      </div>
      {WALLETS.map(w => (
        <div key={w.id} className="card" style={{ padding:16, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div><span style={{ fontWeight:700, fontSize:14 }}>{w.hardwareId}</span><span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:8 }}>NFT {w.nftTokenId}</span></div>
            <div style={{ fontSize:18, fontWeight:700, color:'#f59e0b' }}>{w.balance.toFixed(2)} EDGE</div>
          </div>
          <div style={{ fontFamily:'monospace', fontSize:11, color:'#8b5cf6', marginBottom:8 }}>{w.address}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8 }}>Created: {fmtDate(w.createdAt)}</div>
          <h4 style={{ fontSize:12, fontWeight:600, marginBottom:6 }}>Recent Transactions</h4>
          {w.transactions.map((tx,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0', borderBottom:i<w.transactions.length-1?'1px solid var(--border)':'none', fontSize:11 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <span>{tx.type==='mint'?'🪙':tx.type==='reward'?'🎁':tx.type==='transfer'?'🔄':'💸'}</span>
                <span style={{ textTransform:'capitalize' }}>{tx.type.replace(/_/g,' ')}</span>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontWeight:600, color:tx.amount>0?'#10b981':'#ef4444', fontFamily:'monospace' }}>{tx.amount>0?'+':''}{tx.amount.toFixed(2)} EDGE</span>
                <span style={{ color:'var(--text-muted)', fontSize:10 }}>{fmtDate(tx.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>)}

    {/* ═ TRANSFERS ═ */}
    {tab==='transfers' && (<div>
      <div style={{ marginBottom:12, display:'flex', justifyContent:'flex-end' }}>
        <button onClick={() => setShowTransferForm(true)} style={{ padding:'8px 16px', fontSize:12, fontWeight:600, background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>🔄 Initiate Transfer</button>
      </div>
      <TableCard title="Ownership Transfers" count={TRANSFERS.length}>
        <CrudDataTable columns={[
          { label:'Transfer ID', render:(r:OwnershipTransfer) => <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:600 }}>{r.id}</span> },
          { label:'Device', render:(r:OwnershipTransfer) => <span style={{ fontFamily:'monospace', fontSize:11 }}>{r.hardwareId}</span> },
          { label:'From', key:'fromOrg' },
          { label:'To', key:'toOrg' },
          { label:'Type', render:(r:OwnershipTransfer) => <Badge status={r.type==='sale'?'info':r.type==='lease'?'warning':'secondary'}>{r.type}</Badge> },
          { label:'Price', render:(r:OwnershipTransfer) => r.price>0?`${r.price.toLocaleString()} ${r.currency}`:'—' },
          { label:'Escrow', render:(r:OwnershipTransfer) => r.useEscrow?<Badge status={r.escrowStatus==='released'?'active':r.escrowStatus==='funded'?'info':'secondary'}>{r.escrowStatus}</Badge>:<span style={{ color:'var(--text-muted)' }}>N/A</span> },
          { label:'Status', render:(r:OwnershipTransfer) => <Badge status={r.status==='completed'?'active':r.status==='escrow'?'info':r.status==='pending_approval'?'warning':r.status==='approved'?'info':'secondary'}>{r.status.replace(/_/g,' ')}</Badge> },
          { label:'Date', render:(r:OwnershipTransfer) => fmtDate(r.createdAt) },
        ]} rows={TRANSFERS} onRowClick={(r:OwnershipTransfer) => setSelectedTransfer(r)} />
      </TableCard>
    </div>)}

    {/* ═ CERTIFICATES ═ */}
    {tab==='certificates' && (<div>
      <div className="grid grid-4" style={{ marginBottom:16 }}>
        {[['Active Certs',certStats.active,'#10b981'],['Expiring Soon',certStats.expiring,'#f59e0b'],['Expired',certStats.expired,'#ef4444'],['Revoked',certStats.revoked,'#6b7280']].map(([l,v,c],i) => (
          <div key={i} className="card" style={{ padding:14, textAlign:'center' }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:700, color:c as string }}>{v}</div>
          </div>
        ))}
      </div>
      <TableCard title="Device Certificates" count={CERTIFICATES.length}>
        <CrudDataTable columns={[
          { label:'Cert ID', render:(r:DeviceCertificate) => <span style={{ fontFamily:'monospace', fontSize:10 }}>{r.id}</span> },
          { label:'Device', render:(r:DeviceCertificate) => <span style={{ fontFamily:'monospace', fontSize:11 }}>{r.hardwareId}</span> },
          { label:'Type', render:(r:DeviceCertificate) => <Badge status={r.type==='device_auth'?'info':r.type==='tls_client'?'active':r.type==='blockchain_identity'?'warning':'secondary'}>{r.type.replace(/_/g,' ')}</Badge> },
          { label:'Algorithm', render:(r:DeviceCertificate) => <span style={{ fontFamily:'monospace', fontSize:10 }}>{r.algorithm}</span> },
          { label:'Key', render:(r:DeviceCertificate) => <span style={{ fontSize:10 }}>{r.keyType} {r.keySize}</span> },
          { label:'Issuer', render:(r:DeviceCertificate) => <span style={{ fontSize:11 }}>{r.issuer}</span> },
          { label:'Valid Until', render:(r:DeviceCertificate) => fmtDate(r.validUntil) },
          { label:'Status', render:(r:DeviceCertificate) => <Badge status={r.status==='active'?'active':r.status==='expiring_soon'?'warning':'critical'}>{r.status.replace(/_/g,' ')}</Badge> },
        ]} rows={CERTIFICATES} onRowClick={(r:DeviceCertificate) => setSelectedCert(r)} />
      </TableCard>
      {/* PKI Architecture */}
      <div className="card" style={{ padding:16, marginTop:12 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, color:'#22d3ee' }}>🔐 PKI Trust Hierarchy</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center', padding:16 }}>
          {[{ name:'Blue Edge Root CA', algo:'ECDSA P-384', level:0 },
            { name:'Blue Edge Intermediate CA', algo:'ECDSA P-384', level:1 },
            { name:'Device Auth CA | TLS CA | Code Signing CA | Blockchain CA', algo:'Various', level:2 },
            { name:'12,453 Device Leaf Certificates', algo:'Per-device keys', level:3 },
          ].map((ca,i) => (<div key={i} style={{ width:'100%', maxWidth:500 }}>
            {i > 0 && <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:14, margin:'4px 0' }}>↓</div>}
            <div style={{ padding:10, background:`var(--bg-secondary)`, borderRadius:8, textAlign:'center', border:`1px solid ${i===0?'#ef444444':i===1?'#f59e0b44':i===2?'#3b82f644':'#10b98144'}` }}>
              <div style={{ fontWeight:600, fontSize:12 }}>{ca.name}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>{ca.algo}</div>
            </div>
          </div>))}
        </div>
      </div>
    </div>)}

    {/* ═ DTC / DIAGNOSTICS ═ */}
    {tab==='dtc' && (<div>
      <div className="grid grid-2">
        <ChartCard title="DTC Events — Weekly" type="bar" data={{ labels:['W1','W2','W3','W4','W5','W6'], datasets:[
          { label:'Critical', data:[2,1,3,0,2,1], backgroundColor:'#ef4444' },
          { label:'Warning', data:[5,8,4,6,3,7], backgroundColor:'#f59e0b' },
          { label:'Info', data:[12,8,15,10,8,14], backgroundColor:'#3b82f6' },
        ] }} />
        <ChartCard title="DTC by System" type="doughnut" data={{ labels:['Engine','Cooling','Electrical','Communication','Emissions','Fuel'], datasets:[{ data:[35,12,18,8,15,12], backgroundColor:['#22d3ee','#ef4444','#f59e0b','#8b5cf6','#10b981','#06b6d4'] }] }} />
      </div>
      <div style={{ marginTop:16 }}>
        <TableCard title="Active Diagnostic Trouble Codes" count={DIAGNOSTICS.length}>
          <CrudDataTable columns={[
            { label:'DTC Code', render:(r:DiagnosticRecord) => <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:12, color:sevColor(r.severity) }}>{r.dtcCode}</span> },
            { label:'Description', render:(r:DiagnosticRecord) => <span style={{ fontSize:12 }}>{r.description}</span> },
            { label:'Vehicle', render:(r:DiagnosticRecord) => <span style={{ fontFamily:'monospace', fontSize:11 }}>{r.vehicleId}</span> },
            { label:'System', render:(r:DiagnosticRecord) => <Badge status={r.system==='Engine'?'info':r.system==='Cooling'?'critical':'secondary'}>{r.system}</Badge> },
            { label:'Severity', render:(r:DiagnosticRecord) => <Badge status={r.severity==='critical'?'critical':r.severity==='warning'?'warning':'info'}>{r.severity}</Badge> },
            { label:'Protocol', render:(r:DiagnosticRecord) => <span style={{ fontSize:10, fontFamily:'monospace' }}>{r.protocol}</span> },
            { label:'SPN/FMI', render:(r:DiagnosticRecord) => <span style={{ fontSize:10, fontFamily:'monospace' }}>{r.spn}/{r.fmi}</span> },
            { label:'Count', render:(r:DiagnosticRecord) => <span style={{ fontWeight:600 }}>{r.occurrenceCount}</span> },
            { label:'Status', render:(r:DiagnosticRecord) => <Badge status={r.status==='active'?'warning':r.status==='cleared'?'active':'info'}>{r.status}</Badge> },
          ]} rows={DIAGNOSTICS} onRowClick={(r:DiagnosticRecord) => setSelectedDtc(r)} />
        </TableCard>
      </div>
    </div>)}

    {/* ═ TX DETAIL MODAL ═ */}
    <Modal open={!!selectedTx} onClose={() => setSelectedTx(null)} title="Blockchain Transaction" lg>
      {selectedTx && (<div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {[['TX Hash',selectedTx.txHash],['Block',`#${selectedTx.blockNumber.toLocaleString()}`],['Type',selectedTx.type],['Device',selectedTx.deviceId],['Status',selectedTx.status],['Confirmations',`${selectedTx.confirmations}`],['Gas Used',`${selectedTx.gasUsed.toLocaleString()}`],['Chain',selectedTx.chainId],['From',selectedTx.from],['To',selectedTx.to]].map(([l,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:11, fontWeight:600, fontFamily:'monospace', wordBreak:'break-all' }}>{v}</div></div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, margin:'16px 0 8px' }}>Payload</h4>
        <pre style={{ background:'#0a0f1a', color:'#22d3ee', padding:12, borderRadius:8, fontFamily:'monospace', fontSize:11, overflow:'auto' }}>{JSON.stringify(JSON.parse(selectedTx.payload),null,2)}</pre>
      </div>)}
    </Modal>

    {/* ═ TRANSFER DETAIL MODAL ═ */}
    <Modal open={!!selectedTransfer} onClose={() => setSelectedTransfer(null)} title="Transfer Details" lg>
      {selectedTransfer && (<div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }}>
          {[['Transfer ID',selectedTransfer.id],['Device',selectedTransfer.hardwareId],['From',selectedTransfer.fromOrg],['To',selectedTransfer.toOrg],
            ['Type',selectedTransfer.type],['Price',selectedTransfer.price>0?`${selectedTransfer.price.toLocaleString()} ${selectedTransfer.currency}`:'N/A'],
            ['Escrow',selectedTransfer.useEscrow?`${selectedTransfer.escrowStatus}`:'Disabled'],['Transfer Wallet',selectedTransfer.transferWallet?'Yes':'No'],
          ].map(([l,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:12, fontWeight:600 }}>{v}</div></div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8, color:'#22d3ee' }}>Approval Chain</h4>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {selectedTransfer.approvalChain.map((a,i) => (
            <div key={i} style={{ flex:1, padding:10, background:'var(--bg-secondary)', borderRadius:8, textAlign:'center', border:`1px solid ${a.status==='approved'?'#10b98144':'#f59e0b44'}` }}>
              <div style={{ fontSize:16 }}>{a.status==='approved'?'✅':'⏳'}</div>
              <div style={{ fontSize:11, fontWeight:600 }}>{a.role}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>{a.name}</div>
              {a.date && <div style={{ fontSize:10, color:'#10b981' }}>{fmtDate(a.date)}</div>}
            </div>
          ))}
        </div>
        {selectedTransfer.terms && (<div style={{ padding:10, background:'var(--bg-secondary)', borderRadius:8, fontSize:12 }}><strong>Terms:</strong> {selectedTransfer.terms}</div>)}
        {selectedTransfer.txHash && (<div style={{ marginTop:8, fontFamily:'monospace', fontSize:10, color:'#8b5cf6', wordBreak:'break-all' }}>TX: {selectedTransfer.txHash}</div>)}
      </div>)}
    </Modal>

    {/* ═ CERT DETAIL MODAL ═ */}
    <Modal open={!!selectedCert} onClose={() => setSelectedCert(null)} title="Certificate Details" lg>
      {selectedCert && (<div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {[['Certificate ID',selectedCert.id],['Device',selectedCert.hardwareId],['Type',selectedCert.type.replace(/_/g,' ')],['Issuer',selectedCert.issuer],
            ['Subject',selectedCert.subject],['Algorithm',selectedCert.algorithm],['Key Type',`${selectedCert.keyType} ${selectedCert.keySize}`],['Serial',selectedCert.serialNumber],
            ['Valid From',fmtDate(selectedCert.validFrom)],['Valid Until',fmtDate(selectedCert.validUntil)],['Status',selectedCert.status],['Fingerprint',selectedCert.fingerprint],
          ].map(([l,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:11, fontWeight:600, fontFamily:'monospace', wordBreak:'break-all' }}>{v}</div></div>
          ))}
        </div>
      </div>)}
    </Modal>

    {/* ═ DTC DETAIL MODAL ═ */}
    <Modal open={!!selectedDtc} onClose={() => setSelectedDtc(null)} title="DTC Details" lg>
      {selectedDtc && (<div>
        <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:16 }}>
          <span style={{ fontSize:24, fontWeight:700, fontFamily:'monospace', color:sevColor(selectedDtc.severity) }}>{selectedDtc.dtcCode}</span>
          <Badge status={selectedDtc.severity==='critical'?'critical':'warning'}>{selectedDtc.severity}</Badge>
          <Badge status={selectedDtc.status==='active'?'warning':'active'}>{selectedDtc.status}</Badge>
        </div>
        <p style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>{selectedDtc.description}</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }}>
          {[['Vehicle',selectedDtc.vehicleId],['System',selectedDtc.system],['Protocol',selectedDtc.protocol],['SPN / FMI',`${selectedDtc.spn} / ${selectedDtc.fmi}`],
            ['Occurrences',`${selectedDtc.occurrenceCount}`],['First Seen',fmtDate(selectedDtc.recordedAt)],
          ].map(([l,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div><div style={{ fontSize:13, fontWeight:600 }}>{v}</div></div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8, color:'#22d3ee' }}>❄️ Freeze Frame Data</h4>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginBottom:16 }}>
          {Object.entries(selectedDtc.freezeFrame).map(([k,v],i) => (
            <div key={i} style={{ padding:8, background:'var(--bg-secondary)', borderRadius:6 }}>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>{k}</div>
              <div style={{ fontSize:14, fontWeight:700, fontFamily:'monospace', color:'#22d3ee' }}>{v}</div>
            </div>
          ))}
        </div>
        <h4 style={{ fontSize:13, fontWeight:600, marginBottom:8, color:'#f59e0b' }}>🔧 Recommendations</h4>
        {selectedDtc.recommendations.map((r,i) => (
          <div key={i} style={{ padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:12 }}>
            <span style={{ color:'#f59e0b', marginRight:8 }}>{i+1}.</span>{r}
          </div>
        ))}
      </div>)}
    </Modal>

    {/* ═ TRANSFER FORM MODAL ═ */}
    <Modal open={showTransferForm} onClose={() => setShowTransferForm(false)} title="Initiate Device Transfer" lg>
      <div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
          <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Device *</label>
            <select value={transferForm.device} onChange={e => setTransferForm(p=>({...p,device:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }}>
              <option value="">Select Device</option>
              {['SVG-A1B2AE-001','SVG-C3D4AE-002','SVG-E5F6AE-003','SVG-G7H8AE-004'].map(d => <option key={d} value={d}>{d}</option>)}
            </select></div>
          <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>New Owner *</label>
            <input type="text" placeholder="org@company.com or 0x..." value={transferForm.newOwner} onChange={e => setTransferForm(p=>({...p,newOwner:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }} /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
          <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Transfer Type *</label>
            <select value={transferForm.type} onChange={e => setTransferForm(p=>({...p,type:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }}>
              {['sale','gift','lease','return','reassignment'].map(t => <option key={t} value={t}>{t}</option>)}
            </select></div>
          <div><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Price (AED)</label>
            <input type="number" placeholder="15000.00" value={transferForm.price} onChange={e => setTransferForm(p=>({...p,price:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)' }} /></div>
        </div>
        <label style={{ display:'flex', gap:8, alignItems:'center', cursor:'pointer', marginBottom:8, fontSize:12 }}>
          <input type="checkbox" checked={transferForm.useEscrow} onChange={e => setTransferForm(p=>({...p,useEscrow:e.target.checked}))} /><span>Use escrow for payment</span>
        </label>
        <label style={{ display:'flex', gap:8, alignItems:'center', cursor:'pointer', marginBottom:12, fontSize:12 }}>
          <input type="checkbox" checked={transferForm.transferWallet} onChange={e => setTransferForm(p=>({...p,transferWallet:e.target.checked}))} /><span>Transfer device wallet & NFT to new owner</span>
        </label>
        <div style={{ marginBottom:12 }}><label style={{ display:'block', fontSize:12, fontWeight:600, marginBottom:4 }}>Terms & Conditions</label>
          <textarea placeholder="Device sold 'as-is' with 90-day warranty..." value={transferForm.terms} onChange={e => setTransferForm(p=>({...p,terms:e.target.value}))} style={{ width:'100%', padding:'8px 10px', fontSize:12, background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-primary)', minHeight:60, resize:'vertical', fontFamily:'inherit' }} />
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end', paddingTop:12, borderTop:'1px solid var(--border)' }}>
          <button onClick={() => setShowTransferForm(false)} style={{ padding:'8px 20px', fontSize:12, background:'var(--bg-secondary)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:6, cursor:'pointer' }}>Cancel</button>
          <button onClick={() => { toast.success('Transfer submitted — pending approval'); setShowTransferForm(false); }} style={{ padding:'8px 20px', fontSize:12, fontWeight:600, background:'#3b82f6', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>Review & Sign</button>
        </div>
      </div>
    </Modal>

    <toast.Toast />
  </div>);
}
