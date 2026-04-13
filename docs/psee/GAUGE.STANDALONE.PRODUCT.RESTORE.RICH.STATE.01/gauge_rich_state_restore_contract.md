# GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01 — Contract

## Contract Identity

- ID: GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01
- Type: LAYOUT RESTORATION
- Mode: STRICT RESTORATION
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Restore the full three-column Gauge product layout, including runtime intelligence,
structural metrics, signal set, and topology summary panels in a new RIGHT column.
The baseline rebuild (GAUGE.STANDALONE.PRODUCT.REBUILD.01) produced a faithful 2-column
port of `gauge_v2_product.html`. This contract adds the governed data-rich RIGHT column.

---

## Layout Change

| Column  | Prior state       | Restored state                                     |
|---------|-------------------|----------------------------------------------------|
| LEFT    | Score + Detail + Capabilities + Confidence + Operator | Same (unchanged) |
| CENTER  | Was "col-right"   | Structural Proof + Discovery + State Summary        |
| RIGHT   | Did not exist     | Runtime Intelligence + Structural Metrics + Signal Set + Topology Summary |

CSS: `max-width` expanded to 1400px; `.col-left` 40%, `.col-center` 32%, `.col-right` flex:1.

---

## Data Sources

| Panel                | Source                                                    |
|----------------------|-----------------------------------------------------------|
| Runtime Intelligence | `clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json` |
| Structural Metrics   | `gauge_state.json` + `binding_envelope.json` summary      |
| Signal Set           | `binding_envelope.json` signals (via `/api/topology`)     |
| Topology Summary     | `binding_envelope.json` summary (via `/api/topology`)     |

---

## Files Changed

| File | Change |
|------|--------|
| `app/gauge-product/pages/index.js` | Three-column layout; new hooks; RIGHT column components |
| `app/gauge-product/styles/gauge.css` | Three-column layout; right panel styles |

## Files Created

| File | Description |
|------|-------------|
| `app/gauge-product/pages/api/gauge.js` | API route reading gauge_state.json |
| `docs/psee/GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01/gauge_rich_state_restore_contract.md` | This file |
| `docs/psee/GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01/gauge_rich_state_restore_validation.md` | Validation |
| `docs/psee/GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01/GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01_EXECUTION_LOG.md` | Execution log |

---

## RIGHT Column Panel Descriptions

### Runtime Intelligence
DIM-01 through DIM-06 from `gauge_state.json` — compact row format.
Each DIM: label, value, state (color-coded: PASS=green, COMPUTED=green, CLEAR=green, NONE=gray).

### Structural Metrics
6 metric cards in 2×3 grid:
- Validated Units (30), Recon Axes (4), Violations (0), Binding Nodes (45), Overlaps (2), Env Signals (5)
- Sources: `gauge_state.json` (dim data) + `binding_envelope.json` summary

### Signal Set
5 signals from `binding_envelope.json` (via /api/topology `signals_by_node`):
- L1-ST-CEU-08-001: file_count = 397
- L1-ST-CEU-08-002: module_count = 63
- L1-ST-CEU-09-001: file_count = 324
- L1-ST-CEU-10-001: file_count = 741
- SIG-006: sensor_batch_throughput_rate = 0.333 rec/sec

### Topology Summary (static)
Count display from `binding_envelope.json` summary:
- Total nodes: 45, Domains: 5, Surfaces: 30, Components: 10, Overlaps: 2, Unknown space: 3, Signals: 5

---

## API Routes

### `/api/gauge`
- Reads `clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json`
- Reads `coverage_state.json` and `reconstruction_state.json` from same path
- Override: `GAUGE_PACKAGE_DIR` env var
- Returns: `{ dimensions, score, projection, confidence, coverage, reconstruction }`
- 503 if source missing (references local path only)

### `/api/topology` (existing, unchanged)
- Reads `binding_envelope.json` — provides signals and summary for right column
- No modification

---

## Topology Add-on

Topology add-on (`TopologyAddon`) remains:
- Separate component, unmodified
- Default state: OFF (`showTopology = false`)
- Placed below the column body, same as prior state
- Does NOT replace Topology Summary panel in RIGHT column

---

## Governance

- Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
- Stream boundary: L6 runtime (wip/gauge-psee-hygiene-snapshot domain)
- No Core derivation, no semantic enrichment, no synthetic data
- No ExecLens DEMO dependency introduced
