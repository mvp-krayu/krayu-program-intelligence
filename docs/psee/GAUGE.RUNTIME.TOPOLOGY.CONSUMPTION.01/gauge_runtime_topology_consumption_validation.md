# GAUGE Runtime Topology Consumption Validation
# GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01 — Deliverable 2

## Identity

- Contract: GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01
- Date: 2026-04-13
- Branch: wip/gauge-psee-hygiene-snapshot
- Validation method: Node.js inline script against canonical_topology.json

---

## Validation Execution

Validation was executed via Node.js script that replicates `buildCanonicalRenderModel` logic against the canonical source. All 12 required checks evaluated.

---

## Validation Results

| check | description | result |
|-------|-------------|--------|
| V1 | domains count = 17 | PASS |
| V2 | capabilities count = 42 | PASS |
| V3 | components count = 89 | PASS |
| V4 | total nodes = 148 | PASS |
| V5 | domain_capability edges = 42 | PASS |
| V6 | capability_component edges = 89 | PASS |
| V7 | weakly grounded nodes preserved (9 total) | PASS |
| V8 | COMP-25 cross_domain_ref = "DOM-01" | PASS |
| V9 (contract V9) | cross-domain encoding preserved without normalization | PASS |
| V10 | confidence = null preserved in all capability/component nodes | PASS |
| V11 | component_component = [] preserved | PASS |
| V12 | no active binding_envelope.json read path in topology.js | PASS |

**PASS: 12/12**

---

## Detailed Validation Evidence

### V7 — Weakly Grounded Node Preservation

| type | nodes |
|------|-------|
| WEAKLY GROUNDED domains | DOMAIN-02, DOMAIN-10 |
| WEAKLY_GROUNDED capabilities | CAP-04, CAP-06, CAP-28 |
| WEAKLY_GROUNDED components | COMP-77, COMP-82, COMP-84, COMP-85 |
| **Total** | **9** |

All 9 nodes carry their grounding values unchanged from canonical_topology.json.

### V8 — Cross-Domain Encoding

```
COMP-25: cross_domain_ref = "DOM-01"
```
- Value preserved exactly as encoded in canonical source (not normalized to "DOMAIN-01")
- `is_overlap_endpoint: true` set on COMP-25 to expose cross-domain flag in UI
- No synthetic overlap edge created (per R4/R7 — no invention; "DOM-01" ≠ any node_id)

### V10 — Null Confidence

All 42 capability nodes: `confidence: null` ✓
All 89 component nodes: `confidence: null` ✓
All 17 domain nodes: `confidence: null` ✓

### V12 — No Envelope Path Active

Before (removed):
```javascript
import { validateEnvelope, buildRenderModel } from '../../lib/envelope_adapter'
const DEFAULT_ENVELOPE = path.join(REPO_ROOT, 'clients', '1de0d815-...')
// validateEnvelope(envelope)
// const model = buildRenderModel(envelope, envelopePath)
```

After (topology.js):
```javascript
const CANONICAL_TOPOLOGY = path.join(REPO_ROOT, 'docs', 'psee',
  '41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01', 'canonical_topology.json')
// No envelope_adapter import
// No binding_envelope.json path
```

---

## Mandatory Question Answers

**Q1 — What exact runtime file now consumes topology?**
`app/gauge-product/pages/api/topology.js`

**Q2 — Does it read canonical_topology.json directly?**
YES. `fs.readFileSync(CANONICAL_TOPOLOGY, 'utf8')` where `CANONICAL_TOPOLOGY` resolves to `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` relative to repo root.

**Q3 — Was envelope-derived topology logic removed from topology.js?**
YES. `validateEnvelope`, `buildRenderModel`, `envelope_adapter` import, and `DEFAULT_ENVELOPE` path are all removed.

**Q4 — Do runtime counts match 17 / 42 / 89 / 148?**
YES. V1–V4 all PASS.

**Q5 — Were any semantic values changed?**
NO. All IDs, names, grounding values, null confidence, null source_ref, and cross_domain_ref "DOM-01" are preserved exactly from canonical source without normalization, renaming, or transformation.

---

## UI Compatibility Assessment

| UI consumer | field(s) used | compatible with canonical render model | notes |
|-------------|--------------|----------------------------------------|-------|
| `TopologySummaryPanel` | `nodes[]` typed counts, `summary.nodes_count` | YES — 17/42/89/148 render correctly | "source: binding_envelope.json" label in component text is hardcoded string — not a data field |
| `TopologyAddon/TopologyView` | `nodes[]`, `roots[]`, `containment_tree{}`, `overlap_edges[]` | YES — 17 domain regions, capabilities and components nested correctly | |
| `SignalSet` | `signals_by_node{}` | YES — renders "No signals in this run." (empty object) | |
| `StructuralMetrics` | `summary.nodes_count`, `summary.overlap_edges_count`, `summary.signals_count` | YES | |

### Topology Tree Structure

The containment_tree maps:
```
DOMAIN-NN → [CAP-NN, ...]   (42 capability entries across 17 domains)
CAP-NN    → [COMP-NN, ...]  (89 component entries across 42 capabilities)
```

`TopologyView` accesses:
```javascript
const surfaceIds = containmentTree[rootId] || []          // capability IDs for this domain
for (const sid of surfaceIds) {
  for (const cid of (containmentTree[sid] || [])) ...    // component IDs for each capability
}
```

This matches exactly. All 17 regions render with correct capability and component counts.

---

## Files Changed

| file | change |
|------|--------|
| `app/gauge-product/pages/api/topology.js` | REWRITTEN — topology source switched from binding_envelope.json to canonical_topology.json |

**Total runtime files changed: 1** (minimum necessary; no additional files required)

---

## Files NOT Changed (Confirmed)

| file | status |
|------|--------|
| `app/gauge-product/lib/envelope_adapter.js` | UNCHANGED |
| `app/gauge-product/pages/api/gauge.js` | UNCHANGED |
| `app/gauge-product/pages/index.js` | UNCHANGED |
| `app/gauge-product/pages/overview.js` | UNCHANGED |
| `app/gauge-product/pages/topology.js` | UNCHANGED |
| `app/gauge-product/components/TopologyAddon.js` | UNCHANGED |
| `app/gauge-product/components/GaugeContextPanels.js` | UNCHANGED |
| Any docs/pios/41.x file | UNCHANGED |
| Any scripts/pios/41.1 file | UNCHANGED |
| `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` | UNCHANGED (read-only input) |

---

## Governing Verdict

**CANONICAL_TOPOLOGY_CONSUMED**

`/api/topology` now sources topology exclusively from `canonical_topology.json`. All 12 validation checks pass. No semantic values changed. Runtime file changes are minimal (1 file). Envelope system preserved for all non-topology routes.
