# IG.1D — Invariance Verdict

**Stream:** IG.1D  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** COMPLETE  
**Date:** 2026-04-04  

---

## 1. VERDICT

**PARTIAL**

---

## 2. BASIS

| Component | Result |
|---|---|
| 40.2 comparison | NONE — all differences normalized; full structural equivalence |
| 40.3 comparison | NONE — all differences normalized; full structural equivalence |
| 40.4 comparison | DRIFT_MINOR — one fabricated reference in entity_telemetry.md (CE-003 section); three other files STRUCTURALLY_EQUIVALENT |
| Overall drift level | DRIFT_MINOR |
| Verdict rule applied | PARTIAL = DRIFT_MINOR only |

---

## 3. INVARIANCE STATUS BY LAYER

| Layer | Invariant | Basis |
|---|---|---|
| 40.2 | **YES** — INVARIANT | Full structural, entity, and content equivalence post-normalization |
| 40.3 | **YES** — INVARIANT | Full structural, entity, topology, and traceability equivalence post-normalization |
| 40.4 | **PARTIAL** — NOT FULLY INVARIANT | DRIFT_MINOR in entity_telemetry.md; STRUCTURALLY_EQUIVALENT in dependency/domain/interface telemetry |

---

## 4. FINDING DETAIL

### DRIFT-001 — entity_telemetry.md CE-003 (the only non-normalizable finding)

| Property | Value |
|---|---|
| File | `docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md` |
| Section | CE-003 entity telemetry entry |
| Issue | `node_ref: N-C03` — does not exist in 40.3 PEG node registry (N-01..N-17) |
| Issue | `M-08` entity reference — not defined in any governed 40.3 artifact |
| Issue | Description "Downstream consumer of M-08 outputs" — not traceable to evidence; does not match baseline |
| Scope | Localized; does not propagate; entity set intact; topology intact; traceability map unaffected |
| Severity | DRIFT_MINOR |

---

## 5. REGENERATION METHODOLOGY ADMISSIBILITY

| Layer | Methodology admissible as invariant |
|---|---|
| 40.2 | **YES** — fully invariant; regeneration methodology confirmed reproducible |
| 40.3 | **YES** — fully invariant; regeneration methodology confirmed reproducible |
| 40.4 | **PARTIAL** — methodology partially admissible; 14/17 files fully normalizable; 3 files structurally equivalent; 1 file (entity_telemetry.md) has a localized DRIFT_MINOR finding requiring correction |

The ingestion pipeline for 40.2 and 40.3 is **confirmed as deterministic and invariant** under the governed methodology.

The ingestion pipeline for 40.4 requires **targeted correction** of the entity_telemetry.md CE-003 section before full invariance can be declared.

---

## 6. BLOCKING ISSUES

| Issue | File | Block |
|---|---|---|
| Fabricated node reference N-C03 in CE-003 entry | `run_02_blueedge/40.4/entity_telemetry.md` | Blocks IG.1E authorization for 40.4 layer |
| Fabricated entity reference M-08 in CE-003 entry | `run_02_blueedge/40.4/entity_telemetry.md` | Same block |

These issues are isolated to one section in one file. They do not affect 40.2, 40.3, or any other 40.4 artifact.

---

## 7. IG.1E AUTHORIZATION

**IG.1E (Determinism Re-run) is NOT authorized at this time.**

Per verdict rules: PARTIAL verdict triggers IG.1-R, not IG.1E.

---

## 8. IG.1-R REQUIREMENT

**IG.1-R — Ingestion Methodology Correction is required.**

Scope of IG.1-R is narrow:

| Correction Required | File | Section |
|---|---|---|
| Remove fabricated `node_ref: N-C03` | `run_02_blueedge/40.4/entity_telemetry.md` | CE-003 section |
| Remove fabricated `M-08` entity reference | `run_02_blueedge/40.4/entity_telemetry.md` | CE-003 section |
| Restore CE-003 description to match baseline: entity contains OVL-01/OVL-02 embedded components; telemetry is on embedded components | `run_02_blueedge/40.4/entity_telemetry.md` | CE-003 section |

After IG.1-R correction of entity_telemetry.md CE-003 section only, a new admissibility check (IG.1C-AC-R) and re-comparison (IG.1D-R) should confirm PASS for 40.4, enabling IG.1E.

---

## 9. SUMMARY

| Dimension | Status |
|---|---|
| Verdict | **PARTIAL** |
| 40.2 invariant | YES |
| 40.3 invariant | YES |
| 40.4 invariant | PARTIAL (one localized DRIFT_MINOR) |
| Drift level | DRIFT_MINOR |
| Blocking issues | 1 (localized to entity_telemetry.md CE-003 section) |
| IG.1E authorized | **NO** |
| IG.1-R required | **YES** — narrow scope (one section, one file) |
