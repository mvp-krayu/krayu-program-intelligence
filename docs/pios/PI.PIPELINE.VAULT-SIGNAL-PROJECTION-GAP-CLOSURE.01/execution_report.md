# Execution Report — PI.PIPELINE.VAULT-SIGNAL-PROJECTION-GAP-CLOSURE.01

## Stream Classification: G2 (Architecture-Consuming)

## Pre-Flight

| Check | Status |
|-------|--------|
| Branch | feature/PI.PIPELINE.VAULT-SIGNAL-PROJECTION-GAP-CLOSURE.01 |
| Baseline | 6c001e5 (main) |
| Canonical state loaded | YES |
| Terminology loaded | YES |
| Branch authorized | YES (feature/* pattern) |
| Preflight result | PASS |

## Purpose

Close 3 blocking gaps identified in BLUEEDGE_TRUE_E2E_GENESIS_REALITY_CHECK.md that prevent a fresh canonical run from exercising the full evolved pipeline:

1. ISIG/DPSIG not projected to vault signal_registry.json
2. LENS not consuming ISIG signals or exposing Level 1 vs Level 2 lineage
3. SQO not initialized for genesis runs (no promotion_state.json)

## Execution Steps

### Gap 1: Vault Signal Projection (Phase 8a)

Added `_aggregate_standalone_signals()` to run_client_pipeline.py:
- Reads `artifacts/isig/<client>/<run>/isig_signal_set.json` (if exists)
- Reads `artifacts/dpsig/<client>/<run>/dpsig_signal_set.json` (if exists)
- Appends ISIG/DPSIG signals to existing vault signal_registry.json (after PSIG write)
- Maps signal_entry fields to vault signal schema: signal_id, signal_family, derivation_level, activation_state, signal_value, primary_entity (from derivation_trace.numerator_file), source_traceability
- Updates total_signals, active_pressure_signals, telemetry_signals counts
- Updates registry_basis to include ISIG/DPSIG counts
- Graceful no-op if standalone signal sets absent (PATH B specimens, pre-ISIG runs)
- Idempotent: skips signals already in registry (by signal_id)
- Called from Phase 8a after signal_registry.json is written (step 5b)

**Verification:** Tested against BlueEdge genesis_e2e_02 — 4 PSIG + 2 ISIG + 2 DPSIG = 8 total signals projected.

### Gap 2: LENS Consumption

**DPSIGSignalMapper.js (`projectPSIGSignals`):**
- Added `signal_family` and `derivation_level` fields to projected signal shape
- Defaults: signal_family='PSIG', derivation_level='Level_2' (backward compatible)
- ISIG/DPSIG signals now carry their family and level through to UI

**GenericSemanticPayloadResolver.js (`buildSignalInterpretations`):**
- Extended to accept `psigSummary` parameter (vault signal registry)
- DPSIG signals still come from standalone dpsig_signal_set (primary interpretation source)
- ISIG and PSIG signals now appended from vault signal_registry
- Each signal carries: signal_family, derivation_level, interpretation, confidence_note
- Level 1 signals: "file-level structural pressure detected" + file path
- Level 2 signals: "architectural pressure at Level 2"
- Deduplication: signals already in DPSIG interpretations are not duplicated from vault
- No UI redesign — signals appear in existing signal_interpretations array

### Gap 3: SQO Initialization

Added SQO initialization to Phase 8a (step 10, after vault construction):
- Creates `sqo/promotion_state.json` at S0 if absent
- Idempotent: preserves existing promotion_state (governance-earned states not overwritten)
- Schema: current_state=S0, qualification_provenance=PIPELINE_GENESIS, authority_ceiling=L3, promotion_eligible=true
- Governance provenance: PIPELINE_GENESIS corridor, initial structural substrate materialized
- s0_evidence: vault_readiness PENDING, structural_substrate true, governance_lifecycle NOT_STARTED

## Governance Confirmation
- No data mutation outside run directories
- No new computation semantics (projection only)
- No interpretation
- No new API calls
- No vault changes (G2)
