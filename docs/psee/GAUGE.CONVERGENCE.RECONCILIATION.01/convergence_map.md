# GAUGE.CONVERGENCE.RECONCILIATION.01 — Convergence Map

## Identity

| field | value |
|-------|-------|
| Stream | GAUGE.CONVERGENCE.RECONCILIATION.01 |
| Date | 2026-04-13 |
| Mode | FORENSIC — NO REMEDIATION |

---

## Chain Definitions

| chain | label | primary artifact | client path | run_id | generated |
|-------|-------|-----------------|-------------|--------|-----------|
| A | IG / Gauge Authority | `clients/blueedge/psee/runs/run_01_authoritative/package/gauge_state.json` | `clients/blueedge/` | `run_01_authoritative` | 2026-04-06T14:03:57Z |
| B | PSEE / Topology Authority | `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/psee/runs/run_335c0575a080/binding/binding_envelope.json` | `clients/1de0d815.../` | `run_335c0575a080` | 2026-04-10 |

---

## Side-by-Side Chain Map

| dimension | Chain A (IG/Gauge) | Chain B (PSEE/Topology) |
|-----------|-------------------|------------------------|
| **Client path** | `clients/blueedge/` | `clients/1de0d815-0721-58e9-bc8d-ca83e70fa903/` |
| **Run ID** | `run_01_authoritative` | `run_335c0575a080` |
| **Generation date** | 2026-04-06T14:03:57Z | 2026-04-10 |
| **Primary artifact** | `gauge_state.json` | `binding_envelope.json` |
| **Active API route** | `/api/gauge` | `/api/topology` |
| **Load mechanism** | `fs.readFileSync` (api/gauge.js:35) | `fs.readFileSync` (api/topology.js:46) |
| **Domain count** | 5 (DIM-01 scope = 5 verified domains, intake_result.json) | 5 (binding_context nodes: DOM-01–DOM-05) |
| **Domain labels** | documentation_root, extraction_analysis, backend_isolated, frontend_isolated, platform_monorepo | DOM-01 documentation_root, DOM-02 extraction_analysis, DOM-03 backend_isolated, DOM-04 frontend_isolated, DOM-05 platform_monorepo |
| **Entity count** | 10 CEUs (DIM-01 admissible_units=30 = 10 CEUs × 3 layers) | 10 component_entity nodes (NODE-001–NODE-010, labels CEU-01–CEU-10) |
| **Overlap / structural conflict count** | 0 (DIM-04.total_count=0) | 2 OVERLAP_STRUCTURAL edges (OVL-01: DOM-03↔DOM-05-C, OVL-02: DOM-04↔DOM-05-D) |
| **Unknown space count** | N/A (gauge scope) | 3 (constraint_flags.unknown_space_count = USP-01/02/03) |
| **Score/coverage** | score.canonical=60, coverage_percent=100.0 | No score — structural only |
| **Reconstruction state** | PASS (DIM-02) | N/A — topology does not evaluate reconstruction |
| **Intake verification** | PASS_FULL (intake_result.json, 2026-04-06T14:04:53Z) | N/A |

---

## Declared Convergence Link

`clients/1de0d815.../input/intake/raw_input.json` contains:

```json
"__source_run_id": "run_01_authoritative",
"__source_authority": "PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07",
"__coverage_percent": 100.0,
"__reconstruction_state": "PASS",
"__determinism_hash": "db206c60..."
```

**Chain B's source intake artifact explicitly declares that it was derived from Chain A's run (`run_01_authoritative`).** This is the documented convergence link.

---

## Convergence Topology

```
Chain A: run_01_authoritative
  └─ gauge_state.json (emission: 2026-04-06)
  └─ intake_result.json (intake: 2026-04-06)
        │
        │ [declared: raw_input.json.__source_run_id = run_01_authoritative]
        ▼
Chain B: run_335c0575a080
  └─ raw_input.json (source: IG, declared origin from Chain A)
  └─ structure_manifest.json
  └─ binding_model.json
  └─ binding_envelope.json (generated: 2026-04-10)
```

The convergence point is **not at runtime** — it is at the source intake document level (`raw_input.json`), which was produced after Chain A completed and which carries Chain A's run_id as its declared source.

---

## Third Run ID (Separate)

`docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/ceu_registry.json` declares `run_id: run_02_blueedge`. This run ID appears in neither Chain A nor Chain B's active serving path. It is a governance registry artifact from an intermediate step, not a live data source for any active GAUGE API route.
