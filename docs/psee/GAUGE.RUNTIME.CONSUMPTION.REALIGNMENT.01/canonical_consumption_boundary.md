# GAUGE.RUNTIME.CONSUMPTION.REALIGNMENT.01 — Canonical Consumption Boundary

## Candidate Evaluation

### Candidate 1: gauge_state.json (Chain A)

| field | value |
|-------|-------|
| Origin chain | A — IG/Gauge authority |
| Path | `clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json` |
| Run ID | `run_01_authoritative` |
| Completeness — score | YES: canonical=60, projection=100, confidence=[60–100], band_label=CONDITIONAL |
| Completeness — topology | NO: no node/edge data, no topology structure |
| Consistency with convergence | YES: is the declared source of Chain B (raw_input.__source_run_id=run_01_authoritative) |

**Assessment:** Authoritative for scoring. Incomplete for topology. Cannot serve as sole boundary.

---

### Candidate 2: binding_envelope.json (Chain B)

| field | value |
|-------|-------|
| Origin chain | B — PSEE/Topology authority |
| Path | `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json` |
| Run ID | `run_335c0575a080` (in `metadata.run_id`; NOT present at top level) |
| Completeness — score | NO: no score, no coverage, no reconstruction fields |
| Completeness — topology | YES: 45 nodes, 62 edges, 5 signals, constraint_flags, summary |
| Consistency with convergence | YES: raw_input.json (Chain B source) declares __source_run_id=run_01_authoritative |

**Assessment:** Authoritative for topology. Incomplete for scoring. Cannot serve as sole boundary.

---

### Candidate 3: derived combined artifact

| field | value |
|-------|-------|
| Exists? | NO — no merged artifact was found in any client path or docs path |
| Produced by any script? | NO — no script in scripts/psee/ produces a combined score+topology artifact |

**Assessment:** Does not exist. Cannot be a consumption boundary.

---

### Candidate 4: API-level merged payload

| field | value |
|-------|-------|
| Exists? | NO — no single API route returns both score and topology |
| `/api/gauge` | Returns score, coverage, reconstruction only |
| `/api/topology` | Returns render model (nodes, edges, signals) only |
| Combined endpoint? | NOT PRESENT |

**Assessment:** Does not exist. Cannot be a consumption boundary without creating a new endpoint (prohibited by contract).

---

## Decision

**The canonical consumption boundary is LAYERED — two explicit bindings, both required:**

```
canonical_consumption_boundary:
  layer_1:
    artifact: gauge_state.json
    path: clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json
    api_route: /api/gauge
    run_context: run_01_authoritative
    authority: SCORE, COVERAGE, RECONSTRUCTION, EXECUTION_STATUS
    justification: >
      Sole source of quantitative scoring data. Correctly bound by /api/gauge.
      Chain B's raw_input.json explicitly derives from this run.
      No other artifact contains equivalent scoring fields.

  layer_2:
    artifact: binding_envelope.json
    path: clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json
    api_route: /api/topology
    run_context: run_335c0575a080 (declared in envelope.metadata.run_id)
    authority: TOPOLOGY STRUCTURE, DOMAINS, OVERLAPS, UNKNOWN SPACE, SIGNALS
    justification: >
      Sole source of structural topology data. Correctly bound by /api/topology.
      Explicitly derived from run_01_authoritative via raw_input.__source_run_id.
      No equivalent topology data exists in Chain A artifacts.
```

---

## Boundary Integrity Condition

The layered boundary is lawful ONLY when:

1. Both layers are consumed together at runtime (score + topology co-present before derivation)
2. No UI layer substitutes hardcoded values for either layer's data
3. The declared derivation relationship (Chain B ← Chain A) is preserved — i.e., Chain A's run_id is never displayed as something it is not

**Current state:** The APIs are correctly bound to the right artifacts. The UI layer (index.js left column, index.js raw state table, overview.js header) violates condition 2 and condition 3 by substituting hardcoded literals (including the wrong run_id `run_01` instead of `run_01_authoritative`).
