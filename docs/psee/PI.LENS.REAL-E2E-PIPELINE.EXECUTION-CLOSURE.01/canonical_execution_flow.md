# Canonical Execution Flow
## PI.LENS.REAL-E2E-PIPELINE.EXECUTION-CLOSURE.01

**Date:** 2026-05-03
**Baseline tag:** lens-e2e-stable-v1
**Branch:** work/psee-runtime

---

## Pipeline Stages

| Stage | Name | Script | Idempotency |
|-------|------|--------|-------------|
| 00 | Source Extraction | source_intake.py (extract mode) | artifact-gated |
| 01 | Intake Validation | source_intake.py (validate mode) | VALIDATED_ONLY if artifacts present |
| 02 | Intake Idempotency | source_intake.py (register mode) | VALIDATED_ONLY if registry present |
| 03 | Structure (40.x) | structural_scanner.py | VALIDATED_ONLY if 40.2/40.3/40.4 present |
| 04 | CEU Grounding | ceu_grounding.py | VALIDATED_ONLY if grounding_state_v3.json present |
| 05 | DOM Layer | dom_layer_generator.py | VALIDATED_ONLY if dom artifacts present |
| 06 | Pipeline Orchestrator | run_client_pipeline.py (phases 1–9) | Phase 8b VALIDATED_ONLY if vault_readiness.json present |
| 07 | Semantic Bundle | — (LOCKED_REFERENCE_INPUT) | READY_LOCKED_REFERENCE always |
| 08 | Report Generation | lens_report_generator.py (explicit mapping) | runs each invocation |
| 09 | Runtime Validation | inline bash checks | VALIDATED on artifact presence |

---

## Stage 06 Internal Phases

| Phase | Name |
|-------|------|
| 1 | Source Boundary |
| 2 | Intake |
| 3 | Structure (40.x) |
| 4 | CEU |
| 5 | Binding Envelope |
| 6 | 75.x / 41.x Projection |
| 7 | Vault Construction |
| 8a | Vault Readiness Check (prep) |
| 8b | Vault Readiness (write) — idempotent |
| 9 | Selector Update |

---

## Execution Order

Stages execute sequentially 00 → 09. Each stage records exit code, status, and notes into:
- `EXEC_STATUS[]`
- `EXEC_EXIT[]`
- `EXEC_NOTES[]`

OVERALL STATUS is COMPLETE only if all stages exit 0.
