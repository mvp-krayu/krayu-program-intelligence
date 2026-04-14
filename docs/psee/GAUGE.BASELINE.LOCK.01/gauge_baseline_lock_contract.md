# GAUGE Baseline Lock Contract
# GAUGE.BASELINE.LOCK.01 — Deliverable 1

## Identity

- Contract: GAUGE.BASELINE.LOCK.01
- Baseline ID: GAUGE.V1.STRUCTURAL.INTELLIGENCE.BASELINE
- Date: 2026-04-14
- Branch: wip/gauge-psee-hygiene-snapshot
- HEAD: efe037867d1722156b1cf5a1720224a7fe18b24f
- Mode: STRICT LOCK — NO FEATURE / NO UI / NO DATA / NO REFACTOR

---

## Objective

Freeze the current GAUGE implementation as the first stable baseline.
Define what is locked, what is allowed, and what is forbidden.

---

## Locked Components

### L1 — Topology Source

- **Source:** `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`
- **API route:** `app/gauge-product/pages/api/topology.js`
- **Adapter:** inline `buildCanonicalRenderModel()` — field-location mapping only
- **No envelope-derived topology allowed**

### L2 — Signal Source

- **Source:** `docs/pios/41.4/signal_registry.json`
- **API route:** `app/gauge-product/pages/api/signals.js`
- **No inferred signals allowed**
- **No topology-derived signals allowed**

### L3 — Data Flow (IMMUTABLE)

```
STRUCTURAL PROOF
↓
SIGNAL AVAILABILITY
↓
DISCOVERY QUERIES (LOCKED)
```

Panel order in `pages/index.js` center column is fixed.

### L4 — Structural Metrics (EXACT — DO NOT CHANGE)

| metric | value |
|--------|-------|
| Domains | 17 |
| Capabilities | 42 |
| Components | 89 |
| Total nodes | 148 |

Source: `canonical_topology.json` — verified at lock time via Node.js.

### L5 — Signal Block

- Summary count: "5 signals detected"
- Evidence confidence distribution: STRONG: 2 · MODERATE: 2 · WEAK: 1
- Compact list: max 5 visible (all 5 shown)
- No full table rendering
- Source: `signal_registry.json` (PIOS-41.4-RUN01-SIGNAL-REGISTRY)

### L6 — Discovery Queries

- Locked state preserved — structural queries require access key, execution queries require execution layer
- No auto-unlock
- No query execution logic added
- `discoveryEnabled` state and `openModal` flow unchanged

### L7 — Execution State

- Completion component: NOT EVALUATED
- `gauge_state.json` execution_status: PHASE_1_ACTIVE
- No simulated execution allowed
- Completion remains 0 / 40 points

### L8 — UI Behavior

**Topology (TopologyAddon.js):**
- All domains collapsed except DOMAIN-01 (first non-orphan root)
- Single-domain expansion enforced (`toggleDomain` — one domain open at a time)
- First capability preselected on load (CAP-01 — "Vehicle Sensor Collection")
- Detail panel (NodeInspector) populated on load — `selectedNodeId = 'CAP-01'`

**Signal block:**
- Positioned above Discovery Queries
- Compact rendering (no table)

### L9 — Wording

| context | required wording | forbidden wording |
|---------|-----------------|-------------------|
| Zero-signal state | "No signal instances currently mounted for this run" | "No signals exist" |
| Completion | "NOT EVALUATED" | Any implication of failure |
| Signal layer note | "Signal layer requires execution telemetry or deeper intake coverage" | Any completeness claim |

---

## Authorized Runtime Files at Baseline

| file | role | contract origin |
|------|------|-----------------|
| `pages/api/topology.js` | Topology API | GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01 |
| `pages/api/signals.js` | Signal API | GAUGE.RUNTIME.SIGNAL.VISIBILITY.01 |
| `pages/api/gauge.js` | Gauge state API | GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01 |
| `components/TopologyAddon.js` | Topology UI | GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.01 + .02 |
| `components/GaugeContextPanels.js` | Shared hooks + panels | GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01 + GAUGE.RUNTIME.SIGNAL.VISIBILITY.01 |
| `pages/index.js` | Main GAUGE page | GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01 |
| `styles/gauge.css` | Styles | Multiple streams |

---

## Forbidden Changes

| ID | rule |
|----|------|
| F1 | Changing topology source (canonical_topology.json is the only authorized topology source) |
| F2 | Changing signal source (signal_registry.json fallback; gauge_state.signals primary when available) |
| F3 | Changing structural counts (17/42/89/148 are locked) |
| F4 | Moving UI sections (flow order is immutable) |
| F5 | Adding derived or simulated data |
| F6 | Expanding signal rendering into full intelligence view |
| F7 | Unlocking Discovery Queries without a new authorized stream |
| F8 | Merging topology and signal logic |
| F9 | Adding new data sources without explicit new stream |

---

## Allowed Changes (Require New Stream)

| ID | rule |
|----|------|
| A1 | UI polish (spacing, typography) |
| A2 | Metadata wording improvements |
| A3 | Signal visibility refinement (not expansion) |
| A4 | Bug fixes |

All allowed changes must:
- preserve data
- preserve structure
- preserve flow order

---

## Validation at Lock Time

| check | verified value |
|-------|---------------|
| V1 — topology source | canonical_topology.json (pages/api/topology.js confirmed) |
| V2 — signal source | signal_registry.json (pages/api/signals.js confirmed) |
| V3 — flow order | Structural Proof → Signal Availability → Discovery Queries (index.js) |
| V4 — node counts | 17 domains, 42 capabilities, 89 components, 148 total (Node.js verified) |
| V5 — signal block | 5 signals, STRONG:2 MODERATE:2 WEAK:1 |
| V6 — queries locked | discoveryEnabled gate unchanged |
| V7 — no simulated data | gauge_state.json: execution_status=PHASE_1_ACTIVE, completion=0 |
| V8 — UI behavior | DOMAIN-01 open, CAP-01 selected, single-focus expansion |
