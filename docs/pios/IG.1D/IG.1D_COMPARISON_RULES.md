# IG.1D — Comparison Rules

**Stream:** IG.1D  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** COMPLETE  
**Date:** 2026-04-04  

---

## 1. ADMISSIBILITY PRECONDITION

This comparison is authorized by:

| Precondition | Source | Status |
|---|---|---|
| IG.1C-AC PASS | `docs/pios/IG.1C-AC/IG.1C_ADMISSIBILITY_VERDICT.md` | CONFIRMED |
| Namespace freshness: FRESH | `docs/pios/IG.1C-AC/IG.1C_NAMESPACE_FRESHNESS_CHECK.md` | CONFIRMED |
| Baseline integrity: INTACT | `docs/pios/IG.1C-AC/IG.1C_BASELINE_INTEGRITY_CHECK.md` | CONFIRMED |

If IG.1C-AC had returned FAIL, this comparison would not proceed.

---

## 2. COMPARISON INPUTS

| Role | Path |
|---|---|
| Baseline 40.2 | `docs/pios/40.2/` |
| Baseline 40.3 | `docs/pios/40.3/` |
| Baseline 40.4 | `docs/pios/40.4/` |
| Regenerated 40.2 | `docs/pios/runs/run_02_blueedge/40.2/` |
| Regenerated 40.3 | `docs/pios/runs/run_02_blueedge/40.3/` |
| Regenerated 40.4 | `docs/pios/runs/run_02_blueedge/40.4/` |

---

## 3. NORMALIZATION RULES

The following differences are normalized out before comparison. Normalized differences are not counted as drift.

| Rule | Scope | Basis |
|---|---|---|
| N-01 | `contract` field changes (e.g., `-CONTRACT-v2` → `-IG1C-REGEN`) | Provenance header — identifies run origin, not content |
| N-02 | `date` field changes (`2026-03-19` → `2026-04-04`) | Execution timestamp — normalizable |
| N-03 | `run_id` field changes (`run_01_blueedge` → `run_02_blueedge`) | Run identifier — normalizable |
| N-04 | `upstream_contract` field changes | Provenance chain reference — normalizable |
| N-05 | `regeneration_context` field additions | Provenance annotation added by IG.1C — not in baseline by design |
| N-06 | `version` field additions (absent in some baseline files) | Schema evolution of frontmatter — normalizable |
| N-07 | Header format changes (bold markdown → flat frontmatter) | Serialization format — normalizable |
| N-08 | Path references in validation logs (e.g., `docs/pios/40.2/` → `docs/pios/runs/run_02_blueedge/40.2/`) | Internal cross-reference paths updated to match regeneration namespace — correct, normalizable |
| N-09 | `structural_truth_source` path updates in structure_immutability_log | Same as N-08 — normalizable |
| N-10 | `input:` and `evidence_references_via:` path references in 40.4 files | Same as N-08 — normalizable |

---

## 4. COMPARISON LEVELS

| Level | Name | Description |
|---|---|---|
| L1 | Presence | Expected files exist; no missing, no extra uncontrolled |
| L2 | Structural Shape | Sections present; hierarchy consistent; object class structure consistent |
| L3 | Entity Set Equivalence | Same entities; same normalized identifiers; no additions or removals |
| L4 | Relationship / Topology | Same dependencies; same interfaces; same graph connectivity |
| L5 | Telemetry Coverage | Same telemetry object classes; same coverage across structure |
| L6 | Telemetry Values | Values grounded from same evidence class; no fabricated values; no missing mandatory fields |
| L7 | Traceability | Traceability links preserved; no broken references |

---

## 5. DRIFT CLASSIFICATION SCALE

| Class | Definition |
|---|---|
| NONE | No difference after normalization |
| STRUCTURALLY_EQUIVALENT | Differences present but all normalizable or formatting-only; semantic content preserved |
| DRIFT_MINOR | Non-normalizable differences that do not alter entity set, topology, or traceability; localized |
| DRIFT_MAJOR | Non-normalizable differences that alter entity set, topology, or traceability in a bounded way |
| DRIFT_CRITICAL | Structural collapse, missing entities, broken traceability, or fabricated topology |

---

## 6. VERDICT RULES

| Verdict | Condition | Next |
|---|---|---|
| PASS | NONE or STRUCTURALLY_EQUIVALENT only | IG.1E — Determinism Re-run |
| PARTIAL | DRIFT_MINOR only | IG.1-R — Ingestion Methodology Correction |
| FAIL | DRIFT_MAJOR or DRIFT_CRITICAL present | IG.1-R — Ingestion Methodology Correction |
