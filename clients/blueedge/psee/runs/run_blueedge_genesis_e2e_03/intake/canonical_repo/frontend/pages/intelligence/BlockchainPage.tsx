import { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/ui/StatCard';
import TabBar from '@/components/ui/TabBar';
import Badge from '@/components/ui/Badge';
import TableCard from '@/components/data/TableCard';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';

const TABS = [
  { id: 'overview', label: '⛓️ Overview' },
  { id: 'cargo', label: '🛢️ Cargo Tokens' },
  { id: 'nft', label: '🎫 NFT Registry' },
  { id: 'settlement', label: '💳 Settlement' },
  { id: 'marketplace', label: '🏪 Data Market' },
  { id: 'carbon', label: '🌿 Carbon & ESG' },
];

const api = (path: string) => fetch(`/api/v1/blockchain/${path}`).then(r => r.json()).catch(() => null);

export default function BlockchainPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('overview');
  const [dash, setDash] = useState<any>(null);
  const [cargo, setCargo] = useState<any>(null);
  const [nfts, setNfts] = useState<any>(null);
  const [settlement, setSettlement] = useState<any>(null);
  const [market, setMarket] = useState<any>(null);
  const [carbon, setCarbon] = useState<any>(null);

  useEffect(() => {
    api('dashboard').then(d => setDash(d?.data));
    api('cargo-tokens').then(d => setCargo(d?.data));
    api('nft-registry').then(d => setNfts(d?.data));
    api('payment-settlement').then(d => setSettlement(d?.data));
    api('data-marketplace').then(d => setMarket(d?.data));
    api('carbon-credits').then(d => setCarbon(d?.data));
  }, []);

  // Fallback data
  const d = dash || { network: { tps: 9845, blockHeight: 2845672, nodes: 24 }, records: { total: 145230, today: 1312, cargoTokens: 3420, nftsMinted: 4230, settlements: 12450, carbonCredits: 24500 }, useCases: [] };
  const cg = cargo || { tokens: [], total: 3420, disputes: 0 };
  const nf = nfts || { nfts: [], total: 4230 };
  const st = settlement || { network: { tps: 9845 }, settlements: { today: { count: 12450, volumeAed: 894230 } }, interOperator: [] };
  const mk = market || { marketplace: { totalPartners: 52, activeListings: 38 }, listings: [], revenue: { yearAed: 2847000 } };
  const cb = carbon || { portfolio: { availableCredits: 12500, valueAed: 1875000 }, carbonBySource: [], esg: { rating: 'AA' } };

  return (
    <div>
      <PageHeader title="Blockchain & DLT" breadcrumb="Blockchain" subtitle="5 use cases — Cargo tokenization, NFT registry, payment settlement, data marketplace, carbon credits & ESG" />
      <div className="stats-grid">
        <StatCard label="Network TPS" value={d.network.tps?.toLocaleString()} color="cyan" />
        <StatCard label="Block Height" value={d.network.blockHeight?.toLocaleString()} />
        <StatCard label="Records Today" value={d.records.today?.toLocaleString()} color="green" />
        <StatCard label="Cargo Tokens" value={d.records.cargoTokens?.toLocaleString()} color="blue" />
        <StatCard label="NFTs Minted" value={d.records.nftsMinted?.toLocaleString()} color="violet" />
        <StatCard label="Carbon Credits" value={d.records.carbonCredits?.toLocaleString()} color="emerald" />
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="content-grid">
          <TableCard title="Active Use Cases" count={5}>
            <table className="data-table"><thead><tr><th>ID</th><th>Use Case</th><th>Status</th><th>Key Metric</th></tr></thead>
            <tbody>
              {(d.useCases?.length ? d.useCases : [
                { id: 'UC-BC-01', name: 'Cargo Chain-of-Custody Tokenization', status: 'active', txToday: 142 },
                { id: 'UC-BC-02', name: 'Vehicle & Device NFT Registry', status: 'active', nftsActive: 4185 },
                { id: 'UC-BC-03', name: 'Cross-Operator Payment Settlement', status: 'active', settlementsToday: 12450 },
                { id: 'UC-BC-04', name: 'Inter-Operator Data Marketplace', status: 'active', partners: 52 },
                { id: 'UC-BC-05', name: 'Carbon Credit Tokenization & ESG', status: 'active', creditsAvailable: 12500 },
              ]).map((uc: any) => (
                <tr key={uc.id}><td style={{fontFamily:'var(--mono)',fontSize:'.75rem',color:'var(--cyan)'}}>{uc.id}</td><td>{uc.name}</td>
                <td><Badge status="active" label={uc.status} /></td><td>{Object.values(uc).filter(v => typeof v === 'number')[0]?.toLocaleString()}</td></tr>
              ))}
            </tbody></table>
          </TableCard>
          <div className="card" style={{padding:'1.5rem'}}>
            <h3 style={{color:'var(--text-primary)',marginBottom:'1rem'}}>Network Architecture</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
              <div className="info-row"><span className="info-label">Chain Type</span><span>Hyperledger Fabric + Polygon L2</span></div>
              <div className="info-row"><span className="info-label">Nodes</span><span>{d.network.nodes}</span></div>
              <div className="info-row"><span className="info-label">Smart Contracts</span><span>84 deployed, 78 active</span></div>
              <div className="info-row"><span className="info-label">Consensus</span><span>PBFT (Hyperledger) + PoS (Polygon)</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'cargo' && (
        <div className="content-grid">
          <TableCard title="Cargo Custody Tokens (ERC-1155)" count={cg.total}>
            <table className="data-table"><thead><tr><th>Token ID</th><th>Cargo</th><th>Volume</th><th>Custody Steps</th><th>Status</th></tr></thead>
            <tbody>{(cg.tokens || []).map((t: any) => (
              <tr key={t.tokenId}><td style={{fontFamily:'var(--mono)',fontSize:'.72rem'}}>{t.tokenId}</td><td>{t.cargoType}</td>
              <td>{(t.volumeLiters/1000).toFixed(0)}K L</td><td>{t.custodyChain?.length || 0} steps</td>
              <td><Badge status={t.status==='delivered'?'active':t.status==='in_transit'?'warning':'default'} label={t.status?.replace(/_/g,' ')} /></td></tr>
            ))}</tbody></table>
          </TableCard>
          <div className="card" style={{padding:'1.5rem'}}>
            <h3 style={{color:'var(--text-primary)',marginBottom:'1rem'}}>Dispute Reduction</h3>
            <StatCard label="Paper disputes eliminated" value={`${cg.disputeReductionPct || 98.5}%`} color="green" />
          </div>
        </div>
      )}

      {tab === 'nft' && (
        <TableCard title="Asset NFT Registry (ERC-721)" count={nf.total}>
          <table className="data-table"><thead><tr><th>NFT ID</th><th>Type</th><th>Entity</th><th>Details</th><th>Status</th></tr></thead>
          <tbody>{(nf.nfts || []).map((n: any) => (
            <tr key={n.nftId}><td style={{fontFamily:'var(--mono)',fontSize:'.72rem'}}>{n.nftId}</td>
            <td><Badge status={n.type==='VehicleNFT'?'active':n.type==='DeviceNFT'?'warning':'default'} label={n.type} /></td>
            <td>{n.plate || n.entityId}</td><td>{n.vehicleType || n.deviceType || n.certType || n.zone || ''}</td>
            <td><Badge status="active" label={n.status} /></td></tr>
          ))}</tbody></table>
        </TableCard>
      )}

      {tab === 'settlement' && (
        <div className="content-grid">
          <div className="stats-grid">
            <StatCard label="Settlements Today" value={st.settlements?.today?.count?.toLocaleString()} color="cyan" />
            <StatCard label="Volume (AED)" value={`${(st.settlements?.today?.volumeAed/1000)?.toFixed(0)}K`} color="green" />
            <StatCard label="L2 TPS" value={st.network?.tps?.toLocaleString()} color="blue" />
            <StatCard label="Avg Settlement" value={`${st.settlements?.today?.avgSettlementMs || 340}ms`} />
          </div>
          <TableCard title="Inter-Operator Settlements" count={st.interOperator?.length}>
            <table className="data-table"><thead><tr><th>Operator</th><th>Type</th><th>Settlements</th><th>Volume (AED)</th><th>Fare Split</th><th>Status</th></tr></thead>
            <tbody>{(st.interOperator || []).map((op: any, i: number) => (
              <tr key={i}><td>{op.operator}</td><td>{op.type}</td><td>{op.settlementsToday?.toLocaleString()}</td>
              <td>{op.volumeAed?.toLocaleString()}</td><td>{op.fareSplitPct}%</td>
              <td><Badge status="active" label={op.status} /></td></tr>
            ))}</tbody></table>
          </TableCard>
        </div>
      )}

      {tab === 'marketplace' && (
        <div className="content-grid">
          <div className="stats-grid">
            <StatCard label="Partners" value={mk.marketplace?.totalPartners} color="violet" />
            <StatCard label="Active Listings" value={mk.marketplace?.activeListings} />
            <StatCard label="Annual Revenue" value={`${(mk.revenue?.yearAed/1e6)?.toFixed(1)}M AED`} color="green" />
          </div>
          <TableCard title="Data Listings" count={mk.listings?.length}>
            <table className="data-table"><thead><tr><th>Product</th><th>Type</th><th>Price (AED)</th><th>Quality</th><th>Subscribers</th></tr></thead>
            <tbody>{(mk.listings || []).map((l: any) => (
              <tr key={l.id}><td>{l.name}</td><td>{l.dataType?.replace(/_/g,' ')}</td>
              <td>{l.monthly ? `${l.priceAed?.toLocaleString()}/mo` : `${l.priceAed}/query`}</td>
              <td>{l.qualityScore}%</td><td>{l.subscribers}</td></tr>
            ))}</tbody></table>
          </TableCard>
        </div>
      )}

      {tab === 'carbon' && (
        <div className="content-grid">
          <div className="stats-grid">
            <StatCard label="Available Credits" value={cb.portfolio?.availableCredits?.toLocaleString()} color="emerald" />
            <StatCard label="Portfolio Value" value={`${(cb.portfolio?.valueAed/1e6)?.toFixed(1)}M AED`} color="green" />
            <StatCard label="FLEET Token Staked" value="3.5M" color="blue" />
            <StatCard label="ESG Rating" value={cb.esg?.rating} color="cyan" />
          </div>
          <TableCard title="Carbon Credit Sources" count={cb.carbonBySource?.length}>
            <table className="data-table"><thead><tr><th>Source</th><th>Credits</th><th>% of Total</th></tr></thead>
            <tbody>{(cb.carbonBySource || []).map((s: any, i: number) => (
              <tr key={i}><td>{s.source}</td><td>{s.credits?.toLocaleString()}</td><td>{s.pct}%</td></tr>
            ))}</tbody></table>
          </TableCard>
        </div>
      )}

      {/* ── Status Overview ── */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {[
          { title: "Operational Health", items: [["System Uptime", "99.97%"], ["API Latency", "42ms"], ["Error Rate", "0.03%"], ["Active Connections", "1,284"]] },
          { title: "Fleet Status", items: [["Active Vehicles", "198"], ["In Transit", "87"], ["At Depot", "96"], ["Maintenance", "15"]] },
          { title: "Today Highlights", items: [["Trips Completed", "342"], ["Revenue", "28,450 AED"], ["Fuel Consumed", "4,280L"], ["Distance", "12,450 km"]] },
        ].map((card, ci) => (
          <div key={ci} className="card" style={{ padding: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#22d3ee", marginBottom: 10 }}>{card.title}</h4>
            {card.items.map(([lbl, val], ii) => (
              <div key={ii} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: ii < 3 ? "1px solid var(--border)" : "none", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>{lbl}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Recent Activity ── */}
      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#22d3ee" }}>🕐 Recent Activity</h3>
        {[
          { time: "2 min ago", action: "System health check completed", user: "System", sev: "info" },
          { time: "15 min ago", action: "New record created by dispatcher", user: "Fatima Al Zaabi", sev: "success" },
          { time: "42 min ago", action: "Alert acknowledged and resolved", user: "Khalid Al Maktoum", sev: "warning" },
          { time: "1 hour ago", action: "Scheduled maintenance triggered", user: "System", sev: "info" },
          { time: "2 hours ago", action: "Configuration updated", user: "Borhane Admin", sev: "success" },
          { time: "3 hours ago", action: "Driver safety score recalculated", user: "AI Agent", sev: "info" },
          { time: "5 hours ago", action: "Compliance report generated", user: "System", sev: "success" },
          { time: "8 hours ago", action: "Night shift handover completed", user: "Ahmed Al Mansouri", sev: "info" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 7 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.sev === "warning" ? "#f59e0b" : a.sev === "success" ? "#10b981" : "#64748b" }} />
              <span style={{ fontSize: 13 }}>{a.action}</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
              <span>{a.user}</span>
              <span>{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
