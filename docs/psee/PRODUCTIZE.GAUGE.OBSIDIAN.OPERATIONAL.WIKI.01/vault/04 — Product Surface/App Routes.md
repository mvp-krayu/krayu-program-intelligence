---
title: App Routes
node_type: product-surface
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01
status: ACTIVE
---

## Purpose

Documents the GAUGE product app (`app/gauge-product/`) route binding model. Defines which routes are run-isolable and which are shared canonical sources.

## Authoritative Paths

- `app/gauge-product/pages/api/gauge.js`
- `app/gauge-product/pages/api/topology.js`
- `app/gauge-product/pages/api/signals.js`

## Classification

canonical-doc

## Route Binding Table

| route | binding mechanism | default source | env override | run-isolable |
|-------|-----------------|----------------|-------------|--------------|
| `/api/gauge` | `process.env.GAUGE_PACKAGE_DIR` | `clients/blueedge/psee/runs/run_01_authoritative/package` | YES — `GAUGE_PACKAGE_DIR` | YES |
| `/api/topology` | hardcoded path | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` | NO | NO |
| `/api/signals` | hardcoded path | `docs/pios/41.4/signal_registry.json` | NO | NO |

## Exact Binding Code

**`/api/gauge` (gauge.js lines 16–19):**
```javascript
const PACKAGE_DIR = process.env.GAUGE_PACKAGE_DIR || path.join(
  REPO_ROOT,
  'clients', 'blueedge', 'psee', 'runs', 'run_01_authoritative', 'package'
)
```

**`/api/topology` (topology.js):**
```javascript
const CANONICAL_TOPOLOGY = path.join(
  REPO_ROOT, 'docs', 'psee',
  '41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01', 'canonical_topology.json'
)
```

**`/api/signals` (signals.js):**
```javascript
const SIGNAL_REGISTRY = path.join(REPO_ROOT, 'docs', 'pios', '41.4', 'signal_registry.json')
```

## Launch Model

**Default (localhost:3001):**
```bash
cd app/gauge-product && npm run dev
# GAUGE_PACKAGE_DIR: unset → reads run_01_authoritative/package/
```

**Alternative run binding (localhost:3002):**
```bash
cd /path/to/k-pi-core/app/gauge-product && \
GAUGE_PACKAGE_DIR=/path/to/k-pi-core/clients/blueedge/psee/runs/run_authoritative_recomputed_01/package \
npx next dev -p 3002
```

## Determinism / Constraint Notes

`GAUGE_PACKAGE_DIR` is the only env var that differentiates multiple instances. `/api/topology` and `/api/signals` are structurally identical across all instances — both routes serve from the same hardcoded canonical sources regardless of which run is bound.

## Linked Specs

- `docs/psee/PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01/gauge_dual_run_comparison_spec.md`

## Input Artifacts

- `clients/<tenant>/psee/runs/<run_id>/package/gauge_state.json` (via GAUGE_PACKAGE_DIR → /api/gauge)
- `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` (hardcoded → /api/topology)
- `docs/pios/41.4/signal_registry.json` (hardcoded → /api/signals)

## Consumed By

Product surface — end-user UI

## See Also

[[Dual-Run Comparison]], [[S4 — Gauge Computation and Freshness]], [[Gauge State]]
