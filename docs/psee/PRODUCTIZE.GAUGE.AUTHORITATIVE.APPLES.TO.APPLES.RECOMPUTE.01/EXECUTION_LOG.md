# Execution Log
# PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01

- Date: 2026-04-15
- Stream: PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01
- Branch: feature/gauge-authoritative-apples-to-apples-recompute
- Starting branch: feature/gauge-dual-run-comparison
- Execution engine: Claude Code (claude-sonnet-4-6)
- Fresh run_id: run_authoritative_recomputed_01

---

## 1. PRE-FLIGHT

| check | result |
|-------|--------|
| Contract loaded | docs/governance/runtime/git_structure_contract.md |
| Repository | k-pi-core (krayu-program-intelligence) |
| Branch | feature/gauge-authoritative-apples-to-apples-recompute |
| Branch domain | NON-CANONICAL (flagged per contract §11 — proceeding per standing instruction) |
| git status | clean (2 untracked intake dirs — not relevant) |

---

## 2. AUTHORITATIVE SOURCE BASIS DISCOVERY

### Files inspected for source lineage

| artifact | finding |
|----------|---------|
| `run_01_authoritative/intake/intake_result.json` | AUTHORITATIVE_INTAKE mode; no source_path |
| `run_01_authoritative/intake/intake_log.md` | Loaded package_manifest.json artifacts; no source path revealed |
| `run_01_authoritative/package/coverage_state.json` | required_units=30, source_path=None, intake_id=None |
| `run_01_authoritative/package/verification.log` | "Evidence Basis: BlueEdge run_01 — PSEE-GAUGE.0; 30/30 admissible units" |
| `run_01_authoritative/package/engine_state.json` | stream=PSEE-RUNTIME.4; psee_engine_invoked=true; no source path |
| All other 30-unit runs (run_04, run_05, run_06, run_cli_validation_01/02) | required=30, admissible=30, has_ig=False — ALL legacy static path runs |
| `docs/pios/IG.RUNTIME/run_01/admissibility_log.json` | 30 entries (all ADMITTED); summary.total=30; source_run=run_07_source_profiled_ingestion |
| `docs/pios/IG.RUNTIME/run_01/evidence_boundary.json` | enforcement=STRICT; source_run=run_07_source_profiled_ingestion |
| `docs/pios/IG.RUNTIME/run_01/normalized_intake_structure/layer_index.json` | L40_2:4, L40_3:6, L40_4:17 = 27 artifacts |
| `docs/pios/runs/run_07_source_profiled_ingestion/` | DOES NOT EXIST — original source absent |
| `clients/blueedge/psee/config/runtime_profile.json` | coverage_required_units=30; points to run_01_authoritative |

### Authoritative source basis proven

**`docs/pios/IG.RUNTIME/run_01/`** — the complete surviving IG handoff package.
30 ADMITTED units: ROOT(3) + L40_2(4) + L40_3(6) + L40_4(17).
Original source `run_07_source_profiled_ingestion/` no longer exists.
This is the only recoverable 30-unit authoritative basis.

### Compatibility with modern scripts verified

| script | source_run check | summary.total check | forbidden path check | result |
|--------|-----------------|--------------------|--------------------|--------|
| compute_coverage.sh | EB=AL (both run_07) → MATCH | admissibility_log.summary.total=30 → OK | IG.RUNTIME not forbidden → OK | COMPATIBLE |
| compute_reconstruction.sh | Same source_run consistency | N/A | Same check | COMPATIBLE |

---

## 3. WHY 30 UNITS

admissibility_log.json: 30 entries, all ADMITTED, summary.total=30.
Cross-reference: 27 layer artifacts + 3 root artifacts = 30 present_names.
30 ADMITTED entries in admissibility_log ALL have names in present_names → admissible_units=30.
required_units=30 (summary.total). coverage_percent=100.0.

---

## 4. CHAIN EXECUTION

### run_id: run_authoritative_recomputed_01

| step | command | result |
|------|---------|--------|
| S0-01 | `pios ledger create --run-id run_authoritative_recomputed_01 --client blueedge --source-version blueedge-platform-v1` | PASS — intake_record.json written |
| S0-02 | `pios bootstrap --run-dir $RUN_DIR` | PASS — engine_state.json + gauge_inputs.json written |
| BLOCKED | `pios intake create` | BLOCKED — run_07_source_profiled_ingestion/ absent |
| BLOCKED | `pios ig materialize` | BLOCKED — no intake bundle |
| BLOCKED | `pios structural extract/relate/normalize` | BLOCKED — no intake bundle |
| BLOCKED | `pios ig integrate-structural-layers` | BLOCKED — no modern ig/ |
| S1-01 | `pios emit coverage --run-dir $RUN_DIR --ig-dir docs/pios/IG.RUNTIME/run_01` | PASS — required=30 admissible=30 coverage=100.0 |
| S1-02 | `pios emit reconstruction --run-dir $RUN_DIR --ig-dir docs/pios/IG.RUNTIME/run_01` | PASS — state=PASS validated=30/30 violations=0 |
| S2-01 | `pios emit topology --run-dir $RUN_DIR --run-id run_authoritative_recomputed_01` | PASS — 17/42/89/148 |
| S3-01 | `pios emit signals --run-dir $RUN_DIR` | PASS — 5 signals |
| S4-01 | `pios compute gauge --run-dir $RUN_DIR` | PASS — score=60 projected=100 band=CONDITIONAL NOT_EVALUATED |
| S4-02 | `pios declare coherence --run-dir $RUN_DIR` | PASS — MODE_B COHERENT |
| S4-03 | `pios validate freshness --run-dir $RUN_DIR` | **GOVERNED AND FRESH THROUGH S4** |

### Artifacts produced by chain (not copied)

| artifact | produced by |
|----------|-------------|
| intake_record.json | pios ledger create |
| engine_state.json | pios bootstrap |
| gauge_inputs.json | pios bootstrap |
| coverage_state.json | pios emit coverage (compute_coverage.sh) |
| reconstruction_state.json | pios emit reconstruction (compute_reconstruction.sh) |
| canonical_topology.json | pios emit topology (emit_canonical_topology.py) |
| signal_registry.json | pios emit signals (build_signals.py) |
| gauge_state.json | pios compute gauge |
| coherence_record.json | pios declare coherence |

**No package artifacts were copied from run_01_authoritative.**

---

## 5. REQUIRED VALUE VERIFICATION

| check | expected | actual | result |
|-------|----------|--------|--------|
| validated_units | 30 | 30 | PASS |
| coverage 30/30 | 30/30 | 30/30 | PASS |
| reconstruction 30/30 | 30/30 | 30/30 | PASS |
| topology 17/42/89 | 17/42/89 | 17/42/89 | PASS |
| signals = 5 | 5 | 5 | PASS |
| canonical_score = 60 | 60 | 60 | PASS |
| projected_score = 100 | 100 | 100 | PASS |
| execution_status = NOT_EVALUATED | NOT_EVALUATED | NOT_EVALUATED | PASS |
| completion_points = 0 | 0 | 0 | PASS |
| verdict = GOVERNED AND FRESH | GOVERNED AND FRESH THROUGH S4 | GOVERNED AND FRESH THROUGH S4 | PASS |

All 10 required checks: PASS.

---

## 6. localhost:3002 LAUNCH AND BINDING PROOF

### Launch command

```bash
cd /Users/khorrix/Projects/k-pi-core/app/gauge-product && \
GAUGE_PACKAGE_DIR=/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_authoritative_recomputed_01/package \
npx next dev -p 3002
```

### Binding proof (live API probe)

```
run_id:                    run_authoritative_recomputed_01
coverage required_units:   30
coverage admissible_units: 30
canonical_score:           60
projected_score:           100
execution_status:          NOT_EVALUATED
```

`run_id=run_authoritative_recomputed_01` proves the binding is to the recomputed run, not run_01_authoritative.

### localhost:3001 untouched

curl http://localhost:3001/api/gauge returns `run_id=run_01_authoritative` throughout.
No process kills, no file modifications, no env var changes to the :3001 process.

---

## 7. APPLES-TO-APPLES COMPARISON

### Structural foundation (IDENTICAL)

| metric | 3001 (run_01_authoritative) | 3002 (run_authoritative_recomputed_01) | match |
|--------|-----------------------------|----------------------------------------|-------|
| coverage required_units | 30 | 30 | SAME |
| coverage admissible_units | 30 | 30 | SAME |
| coverage_percent | 100.0 | 100.0 | SAME |
| reconstruction validated_units | 30 | 30 | SAME |
| reconstruction state | PASS | PASS | SAME |
| canonical_score | 60 | 60 | SAME |
| band_label | CONDITIONAL | CONDITIONAL | SAME |
| completion_points | 0 | 0 | SAME |
| coverage_points | 35 | 35 | SAME |
| reconstruction_points | 25 | 25 | SAME |
| confidence lower | 60 | 60 | SAME |
| confidence upper | 100 | 100 | SAME |
| topology domains | 17 | 17 | SAME |
| topology capabilities | 42 | 42 | SAME |
| topology components | 89 | 89 | SAME |
| signals total | 5 | 5 | SAME |

### Schema version differences (EXPECTED)

| field | 3001 | 3002 | cause |
|-------|------|------|-------|
| run_id | run_01_authoritative | run_authoritative_recomputed_01 | Different runs — expected |
| projected_score | absent | 100 | Stream 10 addition |
| execution_status | PHASE_1_ACTIVE | NOT_EVALUATED | Stream 10 semantics |
| execution_layer_evaluated | absent | False | Stream 10 addition |
| execution_mode | FULL | STRUCTURAL_ONLY | Stream 10 addition |
| confidence.status | COMPUTED | SPLIT_EXECUTION_NOT_EVALUATED | Stream 10 semantics |

**Zero unintended differences. 16 structural fields IDENTICAL. 6 schema version differences — all Stream 10 intentional additions.**

---

## 8. PRE-CLOSURE CHECKS

| check | result |
|-------|--------|
| git status --short | 2 untracked intake dirs (not staged) + new run_authoritative_recomputed_01 (not staged — runtime artifact) |
| Only intended files changed | CONFIRMED — only docs/psee/PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01/ to be committed |
| localhost:3001 untouched | CONFIRMED — run_id=run_01_authoritative confirmed live |
| localhost:3002 bound to recomputed run | CONFIRMED — run_id=run_authoritative_recomputed_01 confirmed live |
| validated_units = 30 | CONFIRMED |
| apples-to-apples comparison succeeded | CONFIRMED — structural foundation identical |

---

## 9. EXECUTION STATUS

Status: COMPLETE — GOVERNED AND FRESH THROUGH S4

SC-01: PASS — authoritative source basis proven (docs/pios/IG.RUNTIME/run_01/)
SC-02: PASS — why 30 units documented (admissibility_log.json.summary.total=30)
SC-03: PASS — recomputed run built from authoritative IG basis
SC-04: PASS — intake create and ig materialize blocked (source absent) — documented
SC-05: PASS — all package artifacts produced by executable chain
SC-06: PASS — validated_units=30 confirmed
SC-07: PASS — localhost:3002 bound to run_authoritative_recomputed_01
SC-08: PASS — localhost:3001 untouched
SC-09: PASS — apples-to-apples: 16 structural fields IDENTICAL, 6 schema version differences (expected)
SC-10: PASS — no score logic changed; no artifacts copied; no fabrication
SC-11: PASS — spec (8 sections) and execution log issued
