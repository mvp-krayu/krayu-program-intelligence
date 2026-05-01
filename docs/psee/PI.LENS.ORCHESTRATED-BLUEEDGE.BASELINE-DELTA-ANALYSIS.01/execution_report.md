# Execution Report
## PI.LENS.ORCHESTRATED-BLUEEDGE.BASELINE-DELTA-ANALYSIS.01

**Generated:** 2026-05-01  
**Mode:** FORENSIC / READ_ONLY / NO_MUTATION  
**Branch:** work/psee-runtime  
**Head Commit:** c60634d

---

## Pre-Flight

| Check | Result |
|-------|--------|
| Branch authorized | work/psee-runtime — non-canonical per git_structure_contract; forensic output is docs-only, acceptable |
| Mode confirmed | FORENSIC / READ_ONLY — no mutation allowed |
| Baseline run exists | clients/blueedge/psee/runs/run_blueedge_productized_01/ — CONFIRMED |
| Orchestrated run exists | clients/blueedge/psee/runs/run_be_orchestrated_01/ — CONFIRMED |
| CONTROL_DOC_ROOT conflict | NOT PRESENT — no control doc root in delta analysis dir; pre-condition PASS |
| All required source artifacts present | CONFIRMED (vault, signal_registry, signal_projection, HTML reports) |

---

## Block Execution Log

| Block | Artifact | Verdict | Status |
|-------|----------|---------|--------|
| BLOCK_A | run_inventory.json | RUN_INVENTORY_COMPLETE | COMPLETE |
| BLOCK_B | source_scope_comparison.json | SOURCE_SCOPE_MATCH | COMPLETE |
| BLOCK_C | structural_topology_comparison.json | STRUCTURAL_DELTA | COMPLETE |
| BLOCK_D | ceu_grounding_comparison.json | CEU_MATCH | COMPLETE |
| BLOCK_E | 41x_artifact_comparison.json | 41X_DELTA | COMPLETE |
| BLOCK_F | 75x_signal_condition_comparison.json | SIGNAL_VALUE_DELTA | COMPLETE |
| BLOCK_G | schema_bridge_analysis.json | SCHEMA_BRIDGE_BUG | COMPLETE |
| BLOCK_H | report_surface_delta.json | REPORT_DELTA_FROM_ARTIFACT | COMPLETE |
| BLOCK_I | root_cause_classification.json | STRUCTURAL_TOPOLOGY_DELTA | COMPLETE |
| BLOCK_J | remediation_plan.md | BLOCKED / REVERT | COMPLETE |
| BLOCK_K | git_hygiene.json | NO_MUTATION_CONFIRMED | COMPLETE |
| BLOCK_L | baseline_delta_summary.md | Q1–Q7 ANSWERED | COMPLETE |

---

## Findings Summary

**Primary finding:** STRUCTURAL_TOPOLOGY_DELTA

The orchestrator (Phase 5 + PIOS run_end_to_end.py) computes signals from a synthetic CEU-DOM binding_envelope (33 nodes, 29 edges, GROUNDS/EXPOSES relations). The baseline computed signals from the real 40.3 structural import topology (35 nodes, 1937 IMPORTS relations). These are fundamentally different computation graphs. All signal value differences, primary domain shifts, and zone count differences trace to this single root cause.

**Secondary finding:** SCHEMA_BRIDGE_BUG

Phase 8a of run_client_pipeline.py incorrectly counts PSIG-006 (THEORETICAL_BASELINE/ACTIVATED) as an active pressure signal. vault/signal_registry.json shows active_pressure_signals=4; correct value is 3. The bug does not affect HTML report rendering but is a vault data quality defect.

**Score/Decision:** UNCHANGED — 60/CONDITIONAL/INVESTIGATE (both runs identical; score is evidence-anchored, not signal-driven)

---

## Validation

validation_log.json: 11/11 PASS

---

## Governance

- No runtime artifacts mutated
- No vault artifacts mutated
- No selector mutated
- All output is docs/psee/PI.LENS.ORCHESTRATED-BLUEEDGE.BASELINE-DELTA-ANALYSIS.01/*.json|*.md
- Forensic mode compliance: CONFIRMED

---

## Next Steps

1. Revert `clients/blueedge/lens/selector/selector.json` current_run → run_blueedge_rerun_01 (requires authorized contract)
2. Issue PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 — correct signal computation input, patch schema bridge bug
3. FastAPI integration remains BLOCKED until FIXUP completes and new delta check passes
