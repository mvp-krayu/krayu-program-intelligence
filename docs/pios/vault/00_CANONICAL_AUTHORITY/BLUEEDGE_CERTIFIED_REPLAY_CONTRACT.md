# BlueEdge Certified Replay Contract

> **The exact replay procedure, expectations, and trust boundaries for BlueEdge runtime replay.**

---

## A. Exact Replay Procedure

### Step 1 — Source Boundary Verification

```bash
# Verify archive exists and SHA-256 matches
python3 scripts/pios/source_intake.py \
    --client blueedge \
    --source source_01 \
    --run-id <new_run_id> \
    --validate-only
```

**Expected:** Archive present, SHA-256 = `672a841277541921bf8ade69a467d35d9f105a1525c754fa4b750f0aa50e9c80`

### Step 2 — Source Extraction

Extract archive into run-local intake directory:

```bash
mkdir -p clients/blueedge/psee/runs/<run_id>/intake/canonical_repo
tar xf /Users/khorrix/Projects/blueedge-clean-run/source-raw/raw/blueedge-platform-v3_23_0-COMPLETE.tar \
    -C clients/blueedge/psee/runs/<run_id>/intake/canonical_repo/
```

### Step 3 — Source Intake

```bash
python3 scripts/pios/source_intake.py \
    --client blueedge \
    --source source_01 \
    --run-id <run_id>
```

**Expected:** INTAKE PASS — 741 files inventoried

### Step 4 — Structural Scan

```bash
python3 scripts/pios/structural_scanner.py \
    --client blueedge \
    --source source_01 \
    --run-id <run_id>
```

**Expected:** 945 nodes, 944 edges, 11 clusters

### Step 5 — CEU Grounding

```bash
python3 scripts/pios/ceu_grounding.py \
    --client blueedge \
    --run-id <run_id>
```

**Expected (generic registry):** 5/10 grounded, ratio=0.5, PASS

### Step 6 — Orchestrator Phases 2-8

```bash
for phase in 2 3 4 5 6 7 8; do
    python3 scripts/pios/run_client_pipeline.py \
        --client blueedge \
        --source source_01 \
        --run-id <run_id> \
        --phase $phase
done
```

**Note:** Phase 8 = Phase 8b (vault readiness). Orchestrator numbering maps phases 1-9 to internal indices.

**Manual bridge required before Phase 8b:**
- Copy `dom_layer_path` artifact to `<run_dir>/dom/dom_layer.json`
- Copy `integration_validation_path` artifact to `<run_dir>/integration/integration_validation.json`
- Bridge `validation_status` field if absent

### Step 7 — DO NOT RUN Phase 9

Phase 9 (selector update) MUST NOT be run unless you intend to switch the production selector. For revalidation or certification, ALWAYS skip Phase 9.

---

## B. Exact Replay Expectations

| Layer | Count | Description |
|---|---|---|
| Source files | 741 | Files extracted from verified archive |
| Raw nodes | 945 | 204 directories + 741 files |
| Raw edges | 944 | CONTAINS only (import analysis = 0 for tar) |
| Raw clusters | 11 | Top-level directory grouping |
| A5a domains | 48 | All 945 nodes, path-prefix grouping (separate validation) |
| CEU grounded (generic) | 5/10 | Generic 10-CEU registry, ratio=0.5 |
| CEU grounded (historical) | 35 | Historical BlueEdge-specific, ratio=1.0 |
| Executive DOMs | 13 | From conformance artifact (A5b) |
| DOM nodes | 35 | CEU-grounded participation nodes |
| Semantic domains | 17 | PATH B static definitions |
| Capabilities | 42 | PATH B static definitions |
| Components | 89 | PATH B static definitions |
| Crosswalk entities | 13 | v2.0, one per DOM |
| Reconciled domains | 4/17 | Level 5 structurally grounded |
| Signals | 4 | 3 active pressure + 1 telemetry |
| Gauge score | 60 | CONDITIONAL band |
| Vault artifacts | 9 | Standard vault package |

---

## C. Acceptable Deviations

| Deviation | Acceptable? | Condition |
|---|---|---|
| CEU grounding count differs from historical 35 | YES | Generic registry produces different grounding. Document as CEU_REGISTRY_DRIFT. |
| A5a not produced during E2E replay | YES | A5a is a separate validation. Document as PIPELINE_ARCHITECTURE_GAP. |
| Signal values from pre-computed conformance | YES | This is the canonical computation path (STAGE_NOT_AUTOMATED). |
| dom_layer sourced from conformance artifact | YES | This is current pipeline architecture. Document as MANIFEST_LINEAGE_DRIFT. |
| Vault readiness schema bridge required | YES | Known schema gap (VR-09). Apply bridge. |
| Run-local artifact copy required | YES | Known pipeline architecture gap. Copy from manifest paths. |
| Minor node/edge count variation (±5) | YES | If archive version unchanged, investigate. Likely extraction tool difference. |

---

## D. Critical Regressions

The following are CRITICAL REGRESSIONS — if observed, STOP and classify accordingly:

| Condition | Classification | Action |
|---|---|---|
| Pipeline produces 1 ROOT domain (GAP-001) | CRITICAL REGRESSION | STOP. A.5 canonicalization fix has regressed. |
| Wrapper normalization fails (blueedge-platform not normalized) | CRITICAL REGRESSION | STOP. structural_scanner.py wrapper detection broken. |
| Structural scan produces ≠ 945 nodes (same archive) | CRITICAL REGRESSION | STOP. Scanner output has changed. |
| Vault determinism hash differs (same inputs) | CRITICAL REGRESSION | STOP. Pipeline non-determinism detected. |
| PATH B produces ≠ 17 domains | CRITICAL REGRESSION | STOP. build_semantic_layer.py has changed. |
| Crosswalk version ≠ 2.0 | CRITICAL REGRESSION | STOP. Crosswalk has been modified outside governance. |
| Reconciled count changes without crosswalk/evidence change | CRITICAL REGRESSION | STOP. Reconciliation compiler behavior change. |
| Source archive SHA-256 mismatch | CRITICAL REGRESSION | STOP. Source evidence integrity compromised. |

---

## E. Production Protection Rules

### MANDATORY — NEVER violate during replay

1. **ALL replay outputs go to isolated run directory:** `clients/blueedge/psee/runs/<new_run_id>/`
2. **NEVER write to:** `run_be_orchestrated_fixup_01/`, `run_blueedge_productized_01_fixed/`
3. **NEVER run Phase 9** unless explicitly switching production selector
4. **NEVER modify** `clients/blueedge/lens/selector/selector.json` during replay
5. **NEVER overwrite** current vault artifacts in production run directories
6. **NEVER delete** prior run directories during replay

---

## F. Selector Protection Rules

| Rule | Detail |
|---|---|
| Current selector | `run_be_orchestrated_fixup_01` |
| Selector file | `clients/blueedge/lens/selector/selector.json` |
| Protection | Phase 9 MUST be explicitly authorized to change selector |
| Rollback | If selector accidentally changed, restore `current_run: "run_be_orchestrated_fixup_01"` |
| Available runs | `clients/blueedge/lens/selector/available_runs.json` — append-only during replay |

---

## G. Trust Boundaries

### What You CAN Trust

- **Vault artifact determinism:** Verified 2026-05-18. Same inputs → same hash.
- **LENS projection consistency:** 7-layer traceback verified end-to-end.
- **PATH A structural scan:** Deterministic from archive.
- **PATH B semantic topology:** Static data, always consistent.
- **Crosswalk structure:** Static data, v2.0 locked.
- **Reconciliation computation:** Compiler deterministic from 5 inputs.
- **Signal values:** Fixed from conformance contracts.

### What You CANNOT Trust (without verification)

- **CEU grounding count:** Registry has evolved. Verify against which registry version.
- **A5a → A5b chain:** Not integrated into pipeline. Verify conformance artifact matches A5b expectations.
- **Signal independence:** Values are pre-computed, not independently derivable from structural scan.
- **Run-local completeness:** Pipeline reads from external manifest paths. Vault readiness may require manual bridging.
- **Generic pipeline parity:** Generic CEU registry (10 CEUs) is not equivalent to historical BlueEdge-specific CEU configuration.

### What You MUST NEVER Assume

- That the pipeline freshly computes the 13 DOMs from the structural scan (it reads a conformance artifact)
- That PSIG signal values can be independently reproduced from the structural scan alone
- That the CEU grounding output is consumed by vault construction (it is produced but bypassed)
- That A5a and A5b are the same thing (48 vs 13 — different grouping, different purpose)
- That 13 DOMs ≠ 17 DOMAINs is a bug (they measure different things by design)

---

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.BLUEEDGE.CANONICAL-TRUTH-CERTIFICATION.01 |
| Derived from | PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01 (replay procedure verified) |
| Verification date | 2026-05-18 |
| Operational trust status | OPERATIONALLY_CERTIFIED_WITH_ARCHITECTURAL_DEBT |
