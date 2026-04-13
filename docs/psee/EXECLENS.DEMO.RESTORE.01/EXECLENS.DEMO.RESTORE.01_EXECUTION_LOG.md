EXECUTION LOG
Contract ID: EXECLENS.DEMO.RESTORE.01
Start time: 2026-04-13 (session)
End time: 2026-04-13 (session)
Branch: wip/gauge-psee-hygiene-snapshot

---

## WORKING TREE STATUS — BEFORE EXECUTION

Dirty. Pre-existing modified files present. Not altered by this contract.

```
git status --short (before)

 M app/execlens-demo/components/TopologyPanel.js   ← pre-existing (GAUGE.RUNTIME.LABEL.CONSUMPTION.01)
 M app/execlens-demo/lib/gauge/envelope_adapter.py ← pre-existing (GAUGE.RUNTIME.LABEL.CONSUMPTION.01)
 M app/execlens-demo/pages/index.js               ← dirty from GAUGE.RUNTIME.REMOUNT.TOPOLOGY.ADDON.01
?? docs/psee/GAUGE.RUNTIME.LABEL.CONSUMPTION.01/
?? docs/psee/GAUGE.RUNTIME.REMOUNT.TOPOLOGY.ADDON.01/
?? docs/psee/GAUGE.RUNTIME.RENDERING.VALIDATION.01/
```

`pages/index.js` contained REMOUNT contract changes (showTopology state + toggle button) — these were the primary target for removal.

---

## PRE-FLIGHT STEPS

| Step | Action | Result |
|---|---|---|
| 1 | `git status --short` | Branch: wip/gauge-psee-hygiene-snapshot; 3 modified files |
| 2 | Listed pre-existing dirty files | TopologyPanel.js (GAUGE.RUNTIME.LABEL.CONSUMPTION.01), envelope_adapter.py (GAUGE.RUNTIME.LABEL.CONSUMPTION.01) — not altered |
| 3 | Identified REMOUNT changes in index.js | `git diff app/execlens-demo/pages/index.js` — confirmed showTopology state + toggle button present |
| 4 | Files to be modified declared | `app/execlens-demo/pages/index.js` only |

---

## COMMANDS RUN

```
git status --short
git diff app/execlens-demo/pages/index.js
Read: app/execlens-demo/components/TopologyPanel.js (lines 633-757) — confirmed rendering paths
Edit: app/execlens-demo/pages/index.js — removed showTopology state
Edit: app/execlens-demo/pages/index.js — removed toggle button + conditional; restored unconditional topology render with mode="topology"
Read: app/execlens-demo/pages/index.js (lines 66-105, 155-184) — verified clean state
git diff app/execlens-demo/pages/index.js — verified final diff
git status --short
```

---

## FILES INSPECTED

| File | Purpose |
|---|---|
| `app/execlens-demo/pages/index.js` | Primary target — identified REMOUNT artifacts for removal; restored DEMO topology section |
| `app/execlens-demo/components/TopologyPanel.js` | Read to confirm rendering path behavior: `mode="topology"` routes to 42.7 legacy path, not envelope/Gauge path |

---

## TOPOLOGY INJECTION POINT CORRECTED

**Before (REMOUNT state):**
```jsx
const [showTopology, setShowTopology] = useState(false)

...

{/* ── Structural topology add-on — explicit activation required ── */}
<div data-demo-section="topology">
  <div style={{ padding: '10px 0', borderBottom: showTopology ? 'none' : '1px solid #1f2937' }}>
    <button onClick={() => setShowTopology(prev => !prev)} style={{ ... }}>
      {showTopology ? '▲ Hide Structural Topology' : '▼ View Structural Topology'}
    </button>
  </div>
  {showTopology && <TopologyPanel selectedQuery={selectedQuery} />}
</div>
```

**After (restored DEMO state):**
```jsx
{/* ── Structural topology — DEMO presentation (42.7 signal-projection path) ── */}
<div data-demo-section="topology">
  <TopologyPanel selectedQuery={selectedQuery} mode="topology" />
</div>
```

Key changes:
1. `showTopology` state: REMOVED
2. Toggle button: REMOVED
3. Conditional render: REMOVED (unconditional restored)
4. `mode="topology"` added: routes to 42.7 DEMO presentation, not Gauge envelope

---

## RENDERING PATH DETERMINATION

`mode="topology"` → `mode !== 'envelope'` → fetch `/api/execlens?topology=true`

API response does NOT include `envelope: true` → `topology.envelope === true` check FAILS → `EnvelopeTopology` NOT rendered.

WOW chain check: `if (false && ...)` → always false.

Active path: legacy 42.7 hierarchy → `DomainBlock` / `CapabilityGroup` / `EntityChip` → "STRUCTURAL TOPOLOGY — SIGNAL PROJECTION".

Gauge presentation components (RegionCard, ComponentFooter, StandaloneSection, DiagnosticsPanel) are NEVER mounted in DEMO.

---

## FILES CHANGED

| File | Change | Contract |
|---|---|---|
| `app/execlens-demo/pages/index.js` | Removed `showTopology` state; removed toggle button and conditional render; restored unconditional topology section with `mode="topology"` | This contract |

No other files modified.

---

## WORKING TREE STATUS — AFTER EXECUTION

```
git status --short (after)

 M app/execlens-demo/components/TopologyPanel.js   ← pre-existing, not touched
 M app/execlens-demo/lib/gauge/envelope_adapter.py ← pre-existing, not touched
 M app/execlens-demo/pages/index.js               ← this contract
?? docs/psee/GAUGE.RUNTIME.LABEL.CONSUMPTION.01/
?? docs/psee/GAUGE.RUNTIME.REMOUNT.TOPOLOGY.ADDON.01/
?? docs/psee/GAUGE.RUNTIME.RENDERING.VALIDATION.01/
?? docs/psee/EXECLENS.DEMO.RESTORE.01/
```

---

## PRE-CLOSURE CHECK

| # | Check | Result |
|---|---|---|
| 1 | All three required artifacts exist | PASS — demo_restore_contract.md, demo_restore_validation.md, this file |
| 2 | Only authorized files changed | PASS — only `pages/index.js` (within `app/execlens-demo/pages/`) |
| 3 | Pre-existing dirty files not altered | PASS — TopologyPanel.js and envelope_adapter.py unmodified by this contract |
| 4 | Baseline reference file not altered | PASS — gauge_v2_product.html untouched |
| 5 | All 7 validation tests PASS | PASS — demo_restore_validation.md documents VT-01 through VT-07 |
| 6 | All 5 failure codes NOT TRIGGERED | PASS — EDR-01 through EDR-05 all clear |

---

## FINAL STATUS

**COMPLETE — PASS**

ExecLens DEMO is restored as its own product surface. Gauge-style topology add-on controls (showTopology state, toggle button) removed. Gauge envelope presentation (EnvelopeTopology) no longer mounts in DEMO. DEMO topology now uses 42.7 signal-projection presentation (DomainBlock hierarchy). DEMO is no longer used as Gauge host.
