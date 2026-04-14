# Execution Log
# PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01

- Date: 2026-04-14
- Stream: PRODUCTIZE.GAUGE.DUAL.RUN.COMPARISON.01
- Branch: feature/gauge-dual-run-comparison
- Starting branch: feature/gauge-scoring-semantic-alignment
- Execution engine: Claude Code (claude-sonnet-4-6)

---

## 1. PRE-FLIGHT

| check | result |
|-------|--------|
| Contract loaded | docs/governance/runtime/git_structure_contract.md |
| Repository | k-pi-core (krayu-program-intelligence) |
| Branch | feature/gauge-dual-run-comparison (created from feature/gauge-scoring-semantic-alignment) |
| Branch domain | NON-CANONICAL (flagged per contract §11 — proceeding per standing instruction) |
| git status | clean (2 untracked intake dirs — not relevant) |
| Port 3001 | IN USE (PID 1414, 84260) — confirmed active |
| Computed package | clients/blueedge/psee/runs/run_gsca_validation_01/package/ — all 5 required artifacts present |

---

## 2. BINDING INVESTIGATION

### Files inspected

| file | finding |
|------|---------|
| app/gauge-product/package.json | dev command: `next dev -p 3001` |
| app/gauge-product/next.config.js | empty — no port/env config |
| app/gauge-product/pages/api/gauge.js | GAUGE_PACKAGE_DIR env var (line 16) — overridable |
| app/gauge-product/pages/api/topology.js | hardcoded canonical path (line 25-31) — NOT overridable |
| app/gauge-product/pages/api/signals.js | hardcoded signal registry path (line 16-19) — NOT overridable |

### Binding mechanism extracted

| route | mechanism | override |
|-------|-----------|---------|
| /api/gauge | `process.env.GAUGE_PACKAGE_DIR` | YES — env var |
| /api/topology | hardcoded `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` | NO |
| /api/signals | hardcoded `docs/pios/41.4/signal_registry.json` | NO |

---

## 3. CANONICAL SOURCE VERIFICATION

| source file | exists | counts |
|-------------|--------|--------|
| docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json | YES | domains=17, capabilities=42, components=89 |
| docs/pios/41.4/signal_registry.json | YES | total=5, run_reference=run_01_blueedge |
| clients/blueedge/psee/runs/run_gsca_validation_01/package/gauge_state.json | YES | score=60, projected=100, NOT_EVALUATED |
| clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json | YES | score=60, projected=None, PHASE_1_ACTIVE |

Topology and signals in run_gsca_validation_01 package agree with canonical sources (17/42/89, 5 signals).

---

## 4. LAUNCH COMMANDS

### localhost:3001 (canonical — untouched)

```bash
cd app/gauge-product
npm run dev
# npx next dev -p 3001, no GAUGE_PACKAGE_DIR set
# → reads clients/blueedge/psee/runs/run_01_authoritative/package/
```

Already running. NOT stopped or restarted. Confirmed untouched (PID same throughout session).

### localhost:3002 (computed run — launched this stream)

```bash
cd /Users/khorrix/Projects/k-pi-core/app/gauge-product && \
GAUGE_PACKAGE_DIR=/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_gsca_validation_01/package \
npx next dev -p 3002
```

Process started in background. Log: `/tmp/gauge_3002.log`
Startup confirmed: API responsive within 6 seconds of launch.

---

## 5. VERIFIED DATA SOURCE FOR localhost:3002

### Live probe — curl http://localhost:3002/api/gauge

```
run_id:                   run_gsca_validation_01
canonical_score:          60
projected_score:          100
band_label:               CONDITIONAL
execution_status:         NOT_EVALUATED
execution_layer_evaluated: False
execution_mode:           STRUCTURAL_ONLY
completion_points:        0
completion_status:        NOT_EVALUATED
coverage_points:          35
reconstruction_points:    25
coverage %:               100.0
coverage state:           COMPUTED
reconstruction state:     PASS
confidence lower:         60
confidence upper:         100
confidence status:        SPLIT_EXECUTION_NOT_EVALUATED
```

Bound artifact confirmed: `gauge_state.json` from `run_gsca_validation_01/package/`.
No fallback to default path. `GAUGE_PACKAGE_DIR` binding proven by `run_id=run_gsca_validation_01`.

### Live probe — curl http://localhost:3002/api/topology

```
source:          canonical_topology.json
canonical:       True
nodes_total:     148
domains (roots): 17
counts:          {domains: 17, capabilities: 42, components: 89, total_nodes: 148}
```

Reads hardcoded `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`.
Same as localhost:3001.

### Live probe — curl http://localhost:3002/api/signals

```
source:          docs/pios/41.4/signal_registry.json
total:           5
run_reference:   run_01_blueedge
mounted:         True
```

Reads hardcoded `docs/pios/41.4/signal_registry.json`. Same as localhost:3001.

---

## 6. LOCALHOST:3001 UNTOUCHED PROOF

| check | result |
|-------|--------|
| Process killed? | NO |
| Source files modified? | NO |
| GAUGE_PACKAGE_DIR set globally? | NO — env var scoped to localhost:3002 process only |
| curl localhost:3001/api/gauge returns run_01_authoritative? | YES — confirmed |
| curl localhost:3001/api/topology returns 17/42/89? | YES — confirmed |
| curl localhost:3001/api/signals returns total=5? | YES — confirmed |

---

## 7. COMPARISON RESULT

### /api/gauge — DIFFERENCE (expected)

| field | 3001 | 3002 | match |
|-------|------|------|-------|
| run_id | run_01_authoritative | run_gsca_validation_01 | DIFF — expected |
| canonical_score | 60 | 60 | SAME |
| projected_score | absent | 100 | DIFF — schema gap |
| band_label | CONDITIONAL | CONDITIONAL | SAME |
| execution_status | PHASE_1_ACTIVE | NOT_EVALUATED | DIFF — schema gap |
| execution_layer_evaluated | absent | False | DIFF — schema gap |
| execution_mode | FULL | STRUCTURAL_ONLY | DIFF — schema gap |
| completion_points | 0 | 0 | SAME |
| coverage_points | 35 | 35 | SAME |
| reconstruction_points | 25 | 25 | SAME |

### /api/topology — MATCH (same hardcoded source)

| field | 3001 | 3002 | match |
|-------|------|------|-------|
| domains | 17 | 17 | SAME |
| capabilities | 42 | 42 | SAME |
| components | 89 | 89 | SAME |

### /api/signals — MATCH (same hardcoded source)

| field | 3001 | 3002 | match |
|-------|------|------|-------|
| total | 5 | 5 | SAME |
| run_reference | run_01_blueedge | run_01_blueedge | SAME |

### Root cause of difference

ALL differences in /api/gauge are due to schema version gap:
`run_01_authoritative/package/gauge_state.json` was written before Stream 10
(PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01). It carries legacy fields
(PHASE_1_ACTIVE, FULL mode) and does not carry the new fields (projected, NOT_EVALUATED,
STRUCTURAL_ONLY, execution_layer_evaluated, completion_status).

No product logic error. No UI transformation error. The rendering engine correctly
reflects what is in the bound gauge_state.json for each instance.

---

## 8. REQUIRED VALUE VERIFICATION (run_gsca_validation_01 / localhost:3002)

| check | expected | actual | result |
|-------|----------|--------|--------|
| canonical_score | 60 | 60 | PASS |
| projected_score | 100 | 100 | PASS |
| band | CONDITIONAL | CONDITIONAL | PASS |
| execution_status | NOT_EVALUATED | NOT_EVALUATED | PASS |
| completion_points | 0 | 0 | PASS |
| completion_status | NOT_EVALUATED | NOT_EVALUATED | PASS |
| coverage_points | 35 | 35 | PASS |
| reconstruction_points | 25 | 25 | PASS |
| topology domains | 17 | 17 | PASS |
| topology capabilities | 42 | 42 | PASS |
| topology components | 89 | 89 | PASS |
| total signals | 5 | 5 | PASS |

All 12 required checks: PASS.

---

## 9. EXECUTION STATUS

Status: COMPLETE

SC-01: PASS — binding mechanism identified (GAUGE_PACKAGE_DIR for /api/gauge)
SC-02: PASS — topology and signals binding documented (hardcoded — not run-specific)
SC-03: PASS — second instance launched on port 3002 with computed run binding
SC-04: PASS — localhost:3001 untouched throughout
SC-05: PASS — data source proven by run_id=run_gsca_validation_01 in API response
SC-06: PASS — all 12 required values verified
SC-07: PASS — comparison completed with evidence; differences classified
SC-08: PASS — no product logic error detected; differences are schema version gap
SC-09: PASS — no score logic changed; no pipeline changed; no artifacts mutated
SC-10: PASS — exact launch command recorded and reproducible
SC-11: PASS — spec (7 sections) and execution log issued
