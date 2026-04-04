# IG.1E — Determinism Comparison

**Stream:** IG.1E
**Parent:** IG.1
**Layer:** INGESTION
**Status:** COMPLETE
**Date:** 2026-04-04

---

## 1. COMPARISON INPUTS

| Role | Path |
|---|---|
| Reference run (admissible) | `docs/pios/runs/run_02_blueedge/` |
| Repeat run (determinism test) | `docs/pios/runs/run_03_blueedge_repeat/` |

---

## 2. NORMALIZATION RULES APPLIED

The following differences are normalized before comparison (consistent with IG.1D_COMPARISON_RULES.md):

| Rule | Field | run_02 value | run_03 value | Normalizable |
|---|---|---|---|---|
| N-01 | `contract` suffix | `-IG1C-REGEN` | `-IG1E-REPEAT` | YES |
| N-02 | `date` | `2026-04-04` | `2026-04-04` | N/A — identical |
| N-03 | `run_id` | `run_02_blueedge` | `run_03_blueedge_repeat` | YES |
| N-04 | `upstream_contract` | `-IG1C-REGEN` suffix | `-IG1E-REPEAT` suffix | YES |
| N-05 | `regeneration_context` | IG.1C provenance | IG.1E provenance | YES |
| N-08 | Path references in logs | `run_02_blueedge` paths | `run_03_blueedge_repeat` paths | YES |

---

## 3. 40.2 COMPARISON RESULT

| Check | Result |
|---|---|
| All 4 files present in run_03 | PASS |
| Post-normalization differences | **NONE** |
| Entity set (CEU-01..CEU-13) | IDENTICAL |
| Overlap declarations (OVL-01, OVL-02) | IDENTICAL |
| Unknown-space (US-01..US-03) | IDENTICAL |

**40.2 determinism result: NONE — fully deterministic**

---

## 4. 40.3 COMPARISON RESULT

| Check | Result |
|---|---|
| All 20 files present in run_03 | PASS |
| Post-normalization differences | **NONE** |
| Entity set (CE/SA/INF/BM/FE/DS tiers) | IDENTICAL |
| PEG node registry (N-01..N-17) | IDENTICAL |
| Dependency map (SD/BD/FD/LD) | IDENTICAL |
| Interface map (INT-001..INT-008) | IDENTICAL |
| PEG execution paths (EP-01..EP-08) | IDENTICAL |
| Traceability map | IDENTICAL |

**40.3 determinism result: NONE — fully deterministic**

---

## 5. 40.4 COMPARISON RESULT

| Check | Result |
|---|---|
| All 17 files present in run_03 | PASS |
| Post-normalization differences | **NONE** |
| entity_telemetry.md CE-003 section | IDENTICAL — entity_ref: CE-003, telemetry_coverage: INDIRECT, OVL-01/OVL-02 description |
| Fabricated identifiers (N-C03, M-08) | ABSENT in both runs |
| Telemetry surface set (TS-001..TS-017) | IDENTICAL |
| Dimension registry | IDENTICAL |
| Temporal patterns (TMP-001..TMP-012) | IDENTICAL |

**40.4 determinism result: NONE — fully deterministic**

---

## 6. AGGREGATE COMPARISON RESULT

| Diff ID | Files | After normalization | Severity |
|---|---|---|---|
| Provenance fields | All 41 files | NORMALIZED — not counted | NONE |
| Semantic content | All 41 files | **NONE** | **NONE** |

**Post-normalization residual differences: ZERO**

Comparison method: semantic diff of all 41 governed artifacts (40.2 × 4, 40.3 × 20, 40.4 × 17) with provenance field stripping. Zero files showed any non-provenance difference.

---

## 7. DETERMINISM CONFIRMATION

The repeat run (run_03_blueedge_repeat) matches the admissible reference run (run_02_blueedge) in all semantic content. The ingestion pipeline produces identical outputs from identical evidence inputs. The governed methodology is confirmed deterministic.

**Repeat run matches admissible run: YES — at NONE level (no differences post-normalization)**
