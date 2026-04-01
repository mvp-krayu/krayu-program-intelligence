# CE.5 — CI Enforcement Model

**Stream:** CE.5 — Enforcement Operationalization
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.4_VIOLATION_DETECTION_SYSTEM.md, CE.5_GUARD_HOOK_OPERATIONAL_MAP.md

---

## 1. Purpose

This document defines how CE.4/CE.5 enforcement is integrated into CI/automated pipeline execution. It specifies which checks run at CI time vs. runtime, what CI gates exist, and how CI failures map to enforcement outcomes.

---

## 2. Enforcement Phase Mapping

| Phase | When | Checks | Gate |
|---|---|---|---|
| Phase 1 — Static Analysis | CI on pull request / pre-commit | VD-01, VD-04, VD-07, DRIFT-001 text search | BLOCKING — PR cannot merge |
| Phase 2 — Pre-Execution | Before 40.5 runs | GH-01 (full I1 validation) | BLOCKING — run cannot start |
| Phase 3 — Intra-Core | Between each Core layer | GH-02..GH-07 | BLOCKING per hook — layer cannot pass |
| Phase 4 — Post-Core | After 40.11 | GH-08 (I2 validation) | BLOCKING — 41.x cannot start |
| Phase 5 — Pre-Downstream | Before 42.x renders | GH-10 (I3 validation) | BLOCKING — 42.x cannot render |
| Phase 6 — Regression | Nightly / on demand | validate_baseline.py, validate_identity_lock.py | ADVISORY — does not block PR |

---

## 3. Phase 1 — Static Analysis Checks

Runs at CI time (pull request, pre-commit hook, or scheduled scan). Does not require running any scripts — checks are text/path-based.

| Check | Implementation | Failure Action |
|---|---|---|
| VD-01: 40.4 access outside Core | grep -r "docs/pios/40.4" scripts/pios/41.x/ scripts/pios/42.x/ app/ | FAIL PR; block merge |
| VD-04: SSZ/SSI outside L3 | grep -r "computeSSZ\|computeSSI\|ssz\." outside scripts/pios/40.x/ | FAIL PR; block merge |
| VD-07: Reverse flow 42.x → Core | Scan for write operations to docs/pios/40.x/ in scripts/pios/42.x/ and app/ | FAIL PR; block merge |
| DRIFT-001 text search | grep -r "computeSSZ" app/ scripts/pios/42.x/ scripts/pios/41.x/ | FAIL PR; block merge |
| BV-12: Signal recomputation outside 40.5 | grep -r "NF-0\|PES-ESI\|ESI =\|RAG =" outside scripts/pios/40.5/ | FAIL PR; block merge |

Static analysis failures prevent merge. They do not produce enforcement records (they are pre-execution).

---

## 4. Phase 2 — Pre-Execution Gate (GH-01)

**CI job:** `ci_preflight`
**Script:** `scripts/pios/CE.5/run_guard_checks.py --hook GH-01`
**Trigger:** Before any Core derivation run begins

CI job behavior:
1. Run GH-01 checks (GH-01-C01..GH-01-C08).
2. If any check fails → CI job exits with code 1 → run does not start.
3. If all pass → CI job exits with code 0 → Core derivation run proceeds.

---

## 5. Phase 3 — Intra-Core Gates (GH-02..GH-07)

**CI job (if Core is run in CI):** Embedded in each Core layer's run script.
**Script:** `scripts/pios/CE.5/run_guard_checks.py --hook GH-0X`

In CI contexts, each Core layer's script must:
1. Execute its computation.
2. Call the outbound hook.
3. If hook fails → mark CI step as FAILED; subsequent steps do not run.

CI pipelines must not configure `continue-on-error: true` for intra-Core gate steps.

---

## 6. Phase 4 — Post-Core Gate (GH-08)

**CI job:** `ci_post_core_validate`
**Script:** `scripts/pios/CE.5/validate_interfaces.py --interface I2`

CI job behavior:
1. Run full I2 validation (structural + lineage + completeness).
2. If overall = FAIL → CI job exits 1 → 41.x stage does not run.
3. If overall = PARTIAL → CI job exits 0 with PARTIAL annotation → 41.x may run with PARTIAL state.
4. If overall = PASS → CI job exits 0 → 41.x runs normally.

---

## 7. Phase 5 — Pre-Downstream Gate (GH-10)

**CI job:** `ci_pre_render_validate`
**Script:** `scripts/pios/CE.5/validate_interfaces.py --interface I3`

CI job behavior:
1. Run full I3 validation against L5 payload.
2. If overall = FAIL → CI job exits 1 → 42.x render does not run.
3. If overall = PASS or PARTIAL → 42.x render proceeds accordingly.

---

## 8. Phase 6 — Regression Checks

**CI job:** `ci_regression` (scheduled, nightly or manual trigger)
**Scripts:** `validate_baseline.py`, `validate_identity_lock.py`

Behavior:
1. Re-run ESI + RAG derivation.
2. Compare outputs to frozen baseline.
3. If mismatch → report REGRESSION; advisory warning only (does not block PRs).
4. Recompute SHA-256 of identity lock artifacts.
5. If mismatch → report IDENTITY DRIFT; advisory warning.

Regression failures indicate a non-determinism event or baseline artifact corruption. They require human review. They do not automatically fail CI unless a human escalates.

---

## 9. CI Gate Summary

| Gate | CI Job | Blocking | On Failure |
|---|---|---|---|
| Static analysis | ci_static_scan | YES (PR merge) | PR blocked |
| Pre-execution | ci_preflight | YES (run start) | Run does not start |
| Intra-Core | (embedded) | YES (layer transition) | Layer blocked |
| Post-Core I2 | ci_post_core_validate | YES (41.x entry) | 41.x blocked |
| Pre-render I3 | ci_pre_render_validate | YES (42.x entry) | 42.x blocked |
| Regression | ci_regression | NO | Advisory warning |

---

## 10. CI Enforcement Record Handling

All CI enforcement jobs must write enforcement records using the same schema as runtime enforcement (CE.5_FAILURE_HANDLING_RUNTIME.md §4). Records from CI runs are tagged with `"context": "ci"` in the detail field.

CI enforcement records are written to the same paths as runtime records: `docs/pios/40.11/enforcement_log_<run_id>.json`. If a CI run does not reach 40.11 (pre-execution failure), records go to `docs/pios/CE.5/enforcement_pre_core_<run_id>.json`.
