# GAUGE Dual Run Comparison Specification
# PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01
- Authority: GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01 / GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01 / GAUGE.RUNTIME.SIGNAL.VISIBILITY.01
- Branch: feature/gauge-dual-run-comparison
- Date: 2026-04-14

---

## SECTION 1 — CURRENT APP BINDING MODEL

App: `app/gauge-product/` — Next.js application, port 3001 (default dev).

### Route binding table

| route | binding mechanism | default source | env override |
|-------|-----------------|----------------|-------------|
| `/api/gauge` | `process.env.GAUGE_PACKAGE_DIR` | `clients/blueedge/psee/runs/run_01_authoritative/package` | **YES** — `GAUGE_PACKAGE_DIR` |
| `/api/topology` | hardcoded path | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` | **NO** |
| `/api/signals` | hardcoded path | `docs/pios/41.4/signal_registry.json` | **NO** |

### Exact binding code — `/api/gauge` (pages/api/gauge.js lines 16–19)

```javascript
const REPO_ROOT  = path.resolve(process.cwd(), '..', '..')
const PACKAGE_DIR = process.env.GAUGE_PACKAGE_DIR || path.join(
  REPO_ROOT,
  'clients', 'blueedge', 'psee', 'runs', 'run_01_authoritative', 'package'
)
```

### Exact binding code — `/api/topology` (pages/api/topology.js lines 25–31)

```javascript
const CANONICAL_TOPOLOGY = path.join(
  REPO_ROOT,
  'docs', 'psee',
  '41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01',
  'canonical_topology.json'
)
```

No env var. Hardcoded. Both instances read the same file.

### Exact binding code — `/api/signals` (pages/api/signals.js lines 16–19)

```javascript
const SIGNAL_REGISTRY = path.join(
  REPO_ROOT, 'docs', 'pios', '41.4', 'signal_registry.json'
)
```

No env var. Hardcoded. Both instances read the same file.

### Binding summary

`GAUGE_PACKAGE_DIR` is the only env var that differentiates the two instances.
`/api/topology` and `/api/signals` are structurally identical across all instances.
The `/api/gauge` route is fully instance-isolable via `GAUGE_PACKAGE_DIR`.

---

## SECTION 2 — SECOND INSTANCE BINDING STRATEGY

**Mechanism:** `GAUGE_PACKAGE_DIR` environment variable, set at process launch time.

**Additive local override only** — no modification to any source file. The canonical
`localhost:3001` instance is not touched. The env var is scoped to the `localhost:3002`
process only.

**Binding target:**
```
GAUGE_PACKAGE_DIR=/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_gsca_validation_01/package
```

**Artifacts bound:**
- `gauge_state.json` → score=60, projected=100, NOT_EVALUATED
- `coverage_state.json` → state=COMPUTED coverage_percent=100.0
- `reconstruction_state.json` → state=PASS validated=2/2

**Not bindable (hardcoded routes):**
- `/api/topology` → reads canonical `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`
- `/api/signals` → reads canonical `docs/pios/41.4/signal_registry.json`

Both hardcoded sources contain the same topology (17/42/89) and same signals (5) as the
run_gsca_validation_01 package — verified. No behavioral difference.

---

## SECTION 3 — LAUNCH COMMANDS

### localhost:3001 (canonical — DO NOT TOUCH)

```bash
cd app/gauge-product
npm run dev
# equivalent: npx next dev -p 3001
# GAUGE_PACKAGE_DIR: unset → default run_01_authoritative
```

### localhost:3002 (computed run — second instance)

```bash
cd /Users/khorrix/Projects/k-pi-core/app/gauge-product && \
GAUGE_PACKAGE_DIR=/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_gsca_validation_01/package \
npx next dev -p 3002
```

**Working directory:** `/Users/khorrix/Projects/k-pi-core/app/gauge-product`
**Port:** 3002
**Env var:** `GAUGE_PACKAGE_DIR` (additive — scoped to this process only)
**Run bound:** `run_gsca_validation_01`
**localhost:3001 impact:** NONE

---

## SECTION 4 — VERIFIED DATA SOURCE FOR localhost:3002

### Confirmed by live API probe — `curl http://localhost:3002/api/gauge`

```json
{
  "run_id": "run_gsca_validation_01",
  "state": {
    "execution_status": "NOT_EVALUATED",
    "execution_layer_evaluated": false,
    "execution_mode": "STRUCTURAL_ONLY"
  },
  "score": {
    "canonical": 60,
    "projected": 100,
    "band_label": "CONDITIONAL",
    "components": {
      "completion_points": 0,
      "completion_status": "NOT_EVALUATED",
      "coverage_points": 35,
      "reconstruction_points": 25
    }
  },
  "confidence": {
    "lower": 60,
    "upper": 100,
    "status": "SPLIT_EXECUTION_NOT_EVALUATED"
  }
}
```

### Confirmed data source

File read: `clients/blueedge/psee/runs/run_gsca_validation_01/package/gauge_state.json`
Absolute path: `/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_gsca_validation_01/package/gauge_state.json`
Bound via: `GAUGE_PACKAGE_DIR` env var
No static fallback used: CONFIRMED

### Topology source — both instances

Both `localhost:3001` and `localhost:3002` read:
`docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`
This file exists. Returns: domains=17, capabilities=42, components=89, total_nodes=148.

### Signals source — both instances

Both `localhost:3001` and `localhost:3002` read:
`docs/pios/41.4/signal_registry.json`
This file exists. Returns: total=5, run_reference=run_01_blueedge.

---

## SECTION 5 — VALUE COMPARISON (localhost:3001 vs localhost:3002)

### /api/gauge

| field | localhost:3001 (run_01_authoritative) | localhost:3002 (run_gsca_validation_01) | match |
|-------|--------------------------------------|----------------------------------------|-------|
| run_id | run_01_authoritative | run_gsca_validation_01 | **DIFF** (expected — different runs) |
| canonical_score | 60 | 60 | SAME |
| projected_score | None (absent) | 100 | **DIFF** |
| band_label | CONDITIONAL | CONDITIONAL | SAME |
| execution_status | PHASE_1_ACTIVE | NOT_EVALUATED | **DIFF** |
| execution_layer_evaluated | None (absent) | False | **DIFF** |
| execution_mode | FULL | STRUCTURAL_ONLY | **DIFF** |
| completion_points | 0 | 0 | SAME |
| completion_status | None (absent) | NOT_EVALUATED | **DIFF** |
| coverage_points | 35 | 35 | SAME |
| reconstruction_points | 25 | 25 | SAME |
| confidence.lower | (not checked) | 60 | — |
| confidence.upper | (not checked) | 100 | — |
| confidence.status | (not checked) | SPLIT_EXECUTION_NOT_EVALUATED | — |

### /api/topology

| field | localhost:3001 | localhost:3002 | match |
|-------|---------------|---------------|-------|
| domains | 17 | 17 | SAME |
| capabilities | 42 | 42 | SAME |
| components | 89 | 89 | SAME |
| total_nodes | 148 | 148 | SAME |
| source | canonical_topology.json | canonical_topology.json | SAME |

### /api/signals

| field | localhost:3001 | localhost:3002 | match |
|-------|---------------|---------------|-------|
| total | 5 | 5 | SAME |
| run_reference | run_01_blueedge | run_01_blueedge | SAME |
| mounted | True | True | SAME |
| source | docs/pios/41.4/signal_registry.json | docs/pios/41.4/signal_registry.json | SAME |

---

## SECTION 6 — MISMATCH ANALYSIS

### Differing fields in /api/gauge

All differences are expected and explained by different run binding:

| field | localhost:3001 | localhost:3002 | root cause |
|-------|---------------|---------------|------------|
| `run_id` | run_01_authoritative | run_gsca_validation_01 | Different run — intended |
| `projected_score` | absent | 100 | run_01_authoritative has a pre-Stream-10 gauge_state.json — `projected` field did not exist before scoring alignment |
| `execution_status` | PHASE_1_ACTIVE | NOT_EVALUATED | run_01_authoritative uses legacy execution status semantics |
| `execution_layer_evaluated` | absent | False | run_01_authoritative pre-dates Stream 10 schema additions |
| `execution_mode` | FULL | STRUCTURAL_ONLY | run_01_authoritative pre-dates STRUCTURAL_ONLY classification |
| `completion_status` | absent | NOT_EVALUATED | run_01_authoritative pre-dates `completion_status` field |

### Classification

**All differences are due to different run binding + schema version gap.**

- `localhost:3001` reads `run_01_authoritative/package/gauge_state.json` — written before Stream 10
- `localhost:3002` reads `run_gsca_validation_01/package/gauge_state.json` — written by Stream 10

The structural score components (coverage_points=35, reconstruction_points=25, canonical=60,
band=CONDITIONAL) are IDENTICAL across both instances — the scoring foundation is consistent.

The difference is that `run_gsca_validation_01` carries the new scoring semantics (projected,
execution_layer_evaluated, STRUCTURAL_ONLY mode) while `run_01_authoritative` carries the
pre-Stream-10 gauge_state schema.

### No mismatch in topology or signals

Both instances serve identical topology (17/42/89) and signals (5) from the same hardcoded
canonical sources. No binding isolation is possible or needed for these routes — the canonical
sources are definitive and shared.

---

## SECTION 7 — FINAL VERDICT

**Comparison result: DIFFERENCE (expected — schema version gap)**

`localhost:3002` is correctly bound to `run_gsca_validation_01` and renders all Stream 10
semantics faithfully:
- canonical_score = 60 ✓
- projected_score = 100 ✓
- band = CONDITIONAL ✓
- execution_status = NOT_EVALUATED ✓
- completion_points = 0 ✓
- coverage_points = 35 / 35 ✓
- reconstruction_points = 25 / 25 ✓
- topology: 17 / 42 / 89 ✓
- signals: 5 ✓

`localhost:3001` renders pre-Stream-10 gauge_state (no projected, PHASE_1_ACTIVE status, FULL
mode) because its bound run (`run_01_authoritative`) was written before the scoring alignment.
The structural score foundation is identical — canonical=60, coverage=35, reconstruction=25.

**No product logic error detected.** The differences are run-binding differences, not UI logic
or scoring logic differences. The UI correctly renders whatever is in the bound gauge_state.json.

**Binding isolation is PROVEN** for `/api/gauge`. Topology and signals are shared by design —
both routes are hardcoded to canonical sources and not run-specific.

Authority: PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01
