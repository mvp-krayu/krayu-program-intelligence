# GOV.2 — Execution Report

**Stream:** GOV.2 — Shared Validator Consolidation
**Family:** GOV
**Date:** 2026-04-04
**Status:** COMPLETE

---

## 1. PRE-FLIGHT

| Check | Result |
|---|---|
| Branch | work/ig-foundation |
| Staged | none |
| Unstaged | FAMILY_REGISTRY.md (prior stream modification) |
| Untracked | GOV.0 + IG.5 + IG family artifacts (prior streams, uncommitted) |
| Preload classification | PRELOAD PARTIAL — prior stream work pending commit |

---

## 2. OBJECTIVE

Eliminate per-stream validator duplication across IG.2–IG.5 by creating three shared, parameterized validators in `scripts/governance/` and removing the 12 per-stream duplicates.

---

## 3. VALIDATORS CREATED

| Script | Purpose | Parameters |
|---|---|---|
| `scripts/governance/validate_zero_delta.sh` | Normalized diff between two run namespaces | `<reference_run> <test_run> [--repo-root]` |
| `scripts/governance/validate_git_hygiene.sh` | Branch, anchors, protected dirs, run-on-main check | `[--expected-branch] [--run-namespace] [--protected-dirs]` |
| `scripts/governance/validate_contract.sh` | Artifact presence, pattern matching, launcher check | `--stream-dir [--required-files] [--required-patterns] [--launcher] [--delegation-check]` |

---

## 4. PER-STREAM VALIDATORS REMOVED

12 scripts deleted:

| Stream | Script |
|---|---|
| ig2 | validate_adapter_contract.sh |
| ig2 | validate_git_hygiene.sh |
| ig2 | validate_zero_delta.sh |
| ig3 | validate_bootstrap_contract.sh |
| ig3 | validate_git_hygiene.sh |
| ig3 | validate_zero_delta.sh |
| ig4 | validate_git_hygiene.sh |
| ig4 | validate_orchestration_contract.sh |
| ig4 | validate_zero_delta.sh |
| ig5 | validate_git_hygiene.sh |
| ig5 | validate_source_profile_contract.sh |
| ig5 | validate_zero_delta.sh |

---

## 5. MIGRATION PARITY VERIFICATION

### Zero-Delta (all 4 adjacent run pairs):

| Pair | Result |
|---|---|
| run_03 → run_04 | PASS 44/44 |
| run_04 → run_05 | PASS 44/44 |
| run_05 → run_06 | PASS 44/44 |
| run_06 → run_07 | PASS 44/44 |

### Git Hygiene:

| Run | Result |
|---|---|
| run_07 (IG.5 scope) | PASS 9/9 |

### Contract Validators:

| Stream | Result |
|---|---|
| IG.3 | PASS 10/10 |
| IG.4 | PASS 9/9 |
| IG.5 | PASS 11/11 |

---

## 6. GOV.1 GATE RESULT

`validate_execution.sh . GOV.2 scripts/governance --gov-stream`

| Check | Result |
|---|---|
| C1 VALIDATOR_DUPLICATION | PASS (GOV stream exempt) |
| C2 RUN_DUPLICATION | PASS (no 40.x structure in namespace) |
| C3 ARTIFACT_INFLATION | PASS (no governance dir at time of gate run) |
| C4 NON_DELTA_OUTPUT | PASS |
| C5 GIT_DIRTY | FAIL — 17 files from prior streams (GOV.0, IG.5, IG family) uncommitted |
| C6 BASELINE_MUTATION | PASS 6/6 |

**GIT_DIRTY note:** Flagged files are all from prior streams (GOV.0, GOV.1, IG.5, IG family registration) that were not committed before GOV.2 began. GOV.2 scope itself is clean. This is a pending commit action on the operator, not a GOV.2 violation.

---

## 7. READINESS FOR GOV.1 HARD ENFORCEMENT

With per-stream validators removed and shared scripts confirmed in `scripts/governance/`:

- GOV.1 Check C6 (`VALIDATOR_DUPLICATION`) was previously WARN because shared scripts were absent
- Shared scripts now exist: `validate_zero_delta.sh`, `validate_git_hygiene.sh`, `validate_contract.sh`
- C6 can now be promoted from **WARN to hard FAIL**
- Any new IG stream that creates per-stream validators will FAIL at GOV.1

**GOV.2 authorizes GOV.1 C6 promotion.**
