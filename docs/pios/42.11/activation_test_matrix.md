# Activation Test Matrix
## Stream 42.11 — Semantic Path Activation

**contract_id:** PIOS-42.11-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## Matrix Rules

1. Every test targets a specific runtime state: INACTIVE, ACTIVE, or FALLBACK
2. Every test must be deterministic — identical repository state produces identical result
3. Non-regression tests verify that adding 42.11 does not change pre-existing behavior
4. All tests executed in `validate_semantic_activation.py`

---

## INACTIVE Mode Tests (AT-01..AT-08)

These tests verify that when `ACTIVATION_STATUS == "NOT_ACTIVATED"`, behavior is
**identical** to ENL-driven behavior before 42.11.

| Test | ID | Check | Pass Condition |
|---|---|---|---|
| Default state is INACTIVE | AT-01 | `get_path_state()["path_state"]` when ACTIVATION_STATUS is default | `== SEMANTIC_PATH_INACTIVE` |
| Activation status reported honestly | AT-02 | `get_path_state()["activation_status"]` when INACTIVE | `== "NOT_ACTIVATED"` |
| No acceptance checks run | AT-03 | `get_path_state()["acceptance_results"]` when INACTIVE | `== {}` |
| No fallback triggers when INACTIVE | AT-04 | `get_path_state()["fallback_triggers"]` when INACTIVE | `== []` |
| annotate_signal returns None | AT-05 | `annotate_signal("SIG-001")` when INACTIVE | `is None` |
| annotate_query returns None | AT-06 | `annotate_query("GQ-001")` when INACTIVE | `is None` |
| run_id present in inactive state | AT-07 | `get_path_state()["run_id"]` | `== "run_01_blueedge"` |
| INACTIVE state is deterministic | AT-08 | Call `get_path_state()` twice; compare results | Both calls identical |

---

## ACTIVE Mode Tests (AT-09..AT-18)

These tests verify that when `ACTIVATION_STATUS == "ACTIVATED"` and all AC-001..008 pass,
semantic annotations are correctly produced and are additive only.

| Test | ID | Check | Pass Condition |
|---|---|---|---|
| Path becomes ACTIVE when activated | AT-09 | `get_path_state()["path_state"]` when ACTIVATED with valid 41.6 | `== SEMANTIC_PATH_ACTIVE` |
| All AC-001..008 pass when ACTIVE | AT-10 | `get_path_state()["acceptance_results"]` when ACTIVE | All 8 values == True |
| No fallback triggers when ACTIVE | AT-11 | `get_path_state()["fallback_triggers"]` when ACTIVE | `== []` |
| annotate_signal returns dict (not None) for valid ID | AT-12 | `annotate_signal("SIG-001")` when ACTIVE | not None |
| Annotation has required fields | AT-13 | annotation keys when ACTIVE | contains `semantic_id`, `construct_type`, `source_enl_id` |
| semantic_id format is valid | AT-14 | `annotation["semantic_id"]` | matches `SEM-[A-Z]+-\d+` |
| annotate_query returns dict for valid query | AT-15 | `annotate_query("GQ-001")` when ACTIVE | not None, has `semantic_id` |
| Unknown signal_id returns None (not error) | AT-16 | `annotate_signal("UNKNOWN-999")` when ACTIVE | `is None` |
| Annotation is additive — no ENL fields replaced | AT-17 | annotation keys do not include ENL core fields | no `title`, `statement`, `evidence_chain` |
| ACTIVE state is deterministic | AT-18 | Call `get_path_state()` twice; compare results | Both calls identical |

---

## FALLBACK Mode Tests (AT-19..AT-26)

These tests verify that when `ACTIVATION_STATUS == "ACTIVATED"` but acceptance conditions fail,
the runtime silently reverts to ENL direct behavior.

| Test | ID | Check | Pass Condition |
|---|---|---|---|
| Path falls back when AC-001 fails | AT-19 | `get_path_state()` when registry files removed from eval | `path_state == SEMANTIC_PATH_FALLBACK` |
| Fallback triggers identifies failing ACs | AT-20 | `fallback_triggers` is non-empty when FALLBACK | `len(fallback_triggers) >= 1` |
| annotate_signal returns None when FALLBACK | AT-21 | `annotate_signal("SIG-001")` when FALLBACK | `is None` |
| annotate_query returns None when FALLBACK | AT-22 | `annotate_query("GQ-001")` when FALLBACK | `is None` |
| Fallback is silent — no exception raised | AT-23 | Calling annotate functions when FALLBACK raises no exception | `no Exception` |
| Path state honestly reports FALLBACK | AT-24 | `get_path_state()["path_state"]` when FALLBACK | `== SEMANTIC_PATH_FALLBACK` |
| Activation_status still reports ACTIVATED in FALLBACK | AT-25 | `get_path_state()["activation_status"]` when FALLBACK | `== "ACTIVATED"` |
| FALLBACK is deterministic | AT-26 | Call `get_path_state()` twice with same broken condition | Both calls identical |

---

## Reversibility Tests (AT-27..AT-30)

These tests verify that deactivating the semantic path fully restores ENL direct behavior.

| Test | ID | Check | Pass Condition |
|---|---|---|---|
| ACTIVE → INACTIVE (deactivation) | AT-27 | Set ACTIVATED, confirm ACTIVE, then set NOT_ACTIVATED | `path_state == SEMANTIC_PATH_INACTIVE` |
| Annotations disappear after deactivation | AT-28 | `annotate_signal()` returns non-None when ACTIVE, then None after NOT_ACTIVATED | None after deactivation |
| INACTIVE → ACTIVE (reactivation) | AT-29 | Cycle: NOT_ACTIVATED → ACTIVATED → NOT_ACTIVATED → ACTIVATED | ACTIVE state restored |
| No residual annotation state after deactivation | AT-30 | `get_path_state()["acceptance_results"]` after deactivation | `== {}` |

---

## Non-Regression Coverage (AT-31..AT-36)

These tests verify that 42.11 adds no regression to existing 42.1–42.9 behavior.

| Test | ID | Check | Pass Condition |
|---|---|---|---|
| 42.10 validator still passes | AT-31 | Run `validate_semantic_binding.py` | 64/64 PASS |
| 41.6 artifacts unmodified | AT-32 | All 6 41.6 artifacts exist and are non-empty | All files present |
| ENL modules have no 42.11 dependency | AT-33 | ENL module files contain no `42.11` import | 0 references |
| 42.1..42.9 adapters have no 42.11 dependency | AT-34 | Adapter files contain no `42.11` or `semantic_activation` import | 0 references |
| Demo integrity: 42.9 validator exists unmodified | AT-35 | `scripts/pios/42.9/validate_demo_package.py` exists | file present |
| Activation module imports no 42.x layer | AT-36 | `semantic_activation.py` does not import 42.1..42.9 | 0 cross-layer imports |

---

## Summary

| Mode | Tests | Coverage |
|---|---|---|
| INACTIVE | AT-01..AT-08 | Default state, no-annotation parity, honesty |
| ACTIVE | AT-09..AT-18 | Activation, annotation content, additive-only |
| FALLBACK | AT-19..AT-26 | Silent fallback, honest reporting, no-annotation parity |
| Reversibility | AT-27..AT-30 | Cycle: INACTIVE↔ACTIVE, state cleanup |
| Non-regression | AT-31..AT-36 | 42.10 recheck, ENL isolation, adapter isolation |

**Total tests: 36**
