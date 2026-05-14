# Evidence Graph Binding Summary
## PI.LENS.WORKSPACE.EVIDENCE-GRAPH-PSIG-BINDING.02

**Date:** 2026-05-03

---

## Root Cause (confirmed via live API)

```
GET /api/query?zone_id=PZ-001&mode=EVIDENCE&client=blueedge&runId=run_blueedge_productized_01
→ status: ok
→ signal_coverage: 3 entries (PSIG-001, PSIG-002, PSIG-004)
→ vault_targets: [] (EMPTY)
```

Two separate ID-mismatch problems:

1. `vaultIndex.signals` keys = `SIG-001..SIG-005` (from graph_state.json)  
   `signal_coverage` / `vault_targets` IDs = `PSIG-001`, `PSIG-002`, `PSIG-004`  
   → No PSIG nodes existed in the graph

2. `vault_targets = []` (empty)  
   `computeRelevance` EVIDENCE branch checks `Array.isArray(qs.data.vault_targets)` → true, but empty  
   → Returns empty Set → all signal nodes MUTED

---

## Three-Part Fix in workspace.js

### 1. `psigSignals` — authoritative PSIG list

```js
const psigSignals = (graphQs?.mode === 'EVIDENCE')
  ? (graphQs.data?.result?.signal_coverage || []).filter(s => s.signal_id)
  : []
```

Source: `signal_coverage` — identical to what EvidenceResult panel renders. 3 entries for PZ-001.

### 2. `graphVaultIndex` — PSIG-keyed vaultIndex

```js
const graphVaultIndex = psigSignals.length > 0
  ? (() => {
      const signals = {}
      psigSignals.forEach(s => { signals[s.signal_id] = null })
      return { export_status: 'EXPORTED', base_url: null, signals, artifacts: {}, claims: {} }
    })()
  : vaultIndex
```

VaultGraph `buildGraph` now iterates `{PSIG-001:null, PSIG-002:null, PSIG-004:null}` → constructs 3 PSIG nodes.

### 3. `graphQsForVault` — populated vault_targets

```js
const graphQsForVault = (graphQs?.mode === 'EVIDENCE' && psigSignals.length > 0)
  ? {
      mode: 'EVIDENCE',
      data: {
        ...graphQs.data,
        vault_targets: psigSignals.map(s => ({ type: 'signal', id: s.signal_id })),
      },
    }
  : graphQs
```

`computeRelevance` now sees `vault_targets = [{type:'signal',id:'PSIG-001'}, ...]`  
→ `relevantIds = {PZ-001, PSIG-001, PSIG-002, PSIG-004}`  
→ all 3 PSIG nodes and zone root render BRIGHT.

### 4. Visible signal strip

```jsx
{psigSignals.length > 0 && (
  <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'6px 12px', ... }}>
    <span>active signals</span>
    {psigSignals.map(s => (
      <span key={s.signal_id} style={{ color:'#52d97e', ... }}>{s.signal_id}</span>
    ))}
  </div>
)}
```

Positioned between graph panel header and VaultGraph canvas.  
Renders: `active signals  [PSIG-001]  [PSIG-002]  [PSIG-004]`  
Browser-visible text — not dependent on 3D canvas node label rendering.

---

## Expected Graph State — EVIDENCE Mode

| Node | Type | Style |
|------|------|-------|
| PZ-001 | ZONE | BRIGHT (#f0f0f0, val:12) |
| PSIG-001 | SIGNAL | BRIGHT (#52d97e, val:6) |
| PSIG-002 | SIGNAL | BRIGHT (#52d97e, val:6) |
| PSIG-004 | SIGNAL | BRIGHT (#52d97e, val:6) |

**Nodes: 4 · Links: 3 · VaultGraph header: "4 nodes · 3 signals"**

---

## Non-EVIDENCE Modes (Unchanged)

OVERVIEW: `psigSignals=[]` → `graphVaultIndex=vaultIndex`, `graphQsForVault=null`, `isOverview=true` → full 18-node graph  
WHY / TRACE: `graphQs.mode ≠ EVIDENCE` → fallback to `vaultIndex`, `graphQs` unchanged
