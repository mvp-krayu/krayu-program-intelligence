# IG.1D — Drift Classification

**Stream:** IG.1D  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** COMPLETE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document classifies every detected difference between baseline and regenerated artifacts. Normalized differences (per IG.1D_COMPARISON_RULES.md) are listed but not counted as drift.

---

## 2. NORMALIZED DIFFERENCES (NOT COUNTED AS DRIFT)

These differences are expected consequences of the IG.1C regeneration provenance mechanism. They are explicitly normalized out under rules N-01 through N-10.

| Diff ID | Affected Files | Difference | Normalization Rule |
|---|---|---|---|
| NRM-001 | All 41 files | `contract` field: `-CONTRACT-v*` → `-IG1C-REGEN` | N-01 |
| NRM-002 | All 41 files | `date` field: `2026-03-19` → `2026-04-04` | N-02 |
| NRM-003 | 40.4 files with `run_id` | `run_id: run_01_blueedge` → `run_02_blueedge` | N-03 |
| NRM-004 | 40.4 files with `upstream_contract` | contract chain reference updated | N-04 |
| NRM-005 | All 41 files | `regeneration_context` field added | N-05 |
| NRM-006 | 40.4 files, header format | Bold markdown header → flat frontmatter | N-07 |
| NRM-007 | reconstruction_validation_log.md | Input paths `docs/pios/40.2/` → `docs/pios/runs/run_02_blueedge/40.2/` | N-08 |
| NRM-008 | reconstruction_validation_log.md | Output paths `docs/pios/40.3/` → `docs/pios/runs/run_02_blueedge/40.3/` | N-08 |
| NRM-009 | telemetry_validation_log.md | Input/output paths updated to run_02_blueedge namespace | N-08, N-10 |
| NRM-010 | structure_immutability_log.md | `structural_truth_source` path updated | N-09 |
| NRM-011 | 40.4 telemetry files (8) | `input:` and `evidence_references_via:` paths updated | N-10 |
| NRM-012 | intake_validation_log.md (40.2) | `regeneration_context` note added to Check 1 body | N-05 |

**Total normalized differences: 12 categories, covering all 41 regenerated files**  
**Post-normalization remaining drift: see Section 3**

---

## 3. POST-NORMALIZATION DIFFERENCES (COUNTED FOR DRIFT)

### DRIFT-001 — Fabricated Node Reference in entity_telemetry.md CE-003 section

| Property | Value |
|---|---|
| File | `docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md` |
| Section | CE-003 — Integrated Platform Monorepo telemetry entry |
| Baseline value | `entity_ref: CE-003` — described as containing OVL-01/OVL-02 embedded components; telemetry on embedded components |
| Regenerated value | `entity_id: CE-003; node_ref: N-C03` — described as "Downstream consumer of M-08 outputs" |
| Finding (a) | `node_ref: N-C03` does not exist in the 40.3 entity catalog. Defined PEG nodes are N-01 through N-17 only. |
| Finding (b) | `M-08` is not a defined entity in any 40.3 artifact. It does not appear in entity_catalog.md, dependency_map.md, or any other governed 40.3 output. |
| Finding (c) | The description "Downstream consumer of M-08 outputs" does not match the baseline and is not traceable to any CEU evidence. |
| Scope | Localized to CE-003 entry in entity_telemetry.md only. Does not propagate to entity_catalog.md, dependency_map.md, structural_traceability_map.md, or any 40.3 artifact. |
| CE-003 entity ID itself | CORRECT — CE-003 (Blue Edge Platform Monorepo) is the correct entity reference |
| Entity set membership | NOT affected — CE-003 is still present; no entity was added or removed |
| Topology | NOT affected — no dependency edges reference N-C03 or M-08 in any artifact |
| Traceability map | NOT affected — telemetry_traceability_map.md does not reference N-C03 or M-08 |
| **Severity** | **DRIFT_MINOR** |

---

### STRUCT-001 — Section Structure Reformatting in dependency_telemetry.md

| Property | Value |
|---|---|
| File | `docs/pios/runs/run_02_blueedge/40.4/dependency_telemetry.md` |
| Nature | Presentation structure changed: baseline uses narrative bullet format; regenerated uses structured field format (dependency_id, dependency_type, from/to, protocol, telemetry_surfaces, etc.) |
| Dependency set | SD-001 through SD-009, BD-001 through BD-007, FD-001 through FD-005, LD-001/LD-002 — ALL PRESENT AND IDENTICAL |
| Telemetry surfaces | Same TS-xxx references present in both |
| Semantic content | Same evidence grounding, same unknown-space declarations |
| **Severity** | **STRUCTURALLY_EQUIVALENT** |

---

### STRUCT-002 — Section Structure Reformatting in domain_telemetry.md

| Property | Value |
|---|---|
| File | `docs/pios/runs/run_02_blueedge/40.4/domain_telemetry.md` |
| Nature | Presentation structure changed; domain set and coverage equivalent |
| Domain set | All domains from 40.3 present |
| **Severity** | **STRUCTURALLY_EQUIVALENT** |

---

### STRUCT-003 — Section Structure Reformatting in interface_telemetry.md

| Property | Value |
|---|---|
| File | `docs/pios/runs/run_02_blueedge/40.4/interface_telemetry.md` |
| Nature | Presentation structure changed; INT-001 through INT-008 all present; telemetry surface references preserved |
| Interface set | INT-001 through INT-008 — IDENTICAL |
| **Severity** | **STRUCTURALLY_EQUIVALENT** |

---

## 4. CLASSIFICATION SUMMARY

| Diff ID | File | Severity | Normalizable |
|---|---|---|---|
| NRM-001 through NRM-012 | All 41 files (various) | NONE (normalized) | YES |
| DRIFT-001 | entity_telemetry.md (CE-003 section) | **DRIFT_MINOR** | NO |
| STRUCT-001 | dependency_telemetry.md | STRUCTURALLY_EQUIVALENT | YES (post-normalization) |
| STRUCT-002 | domain_telemetry.md | STRUCTURALLY_EQUIVALENT | YES (post-normalization) |
| STRUCT-003 | interface_telemetry.md | STRUCTURALLY_EQUIVALENT | YES (post-normalization) |

---

## 5. AGGREGATE DRIFT LEVEL

| Layer | Max Drift | Basis |
|---|---|---|
| 40.2 | NONE | All differences normalized |
| 40.3 | NONE | All differences normalized |
| 40.4 | **DRIFT_MINOR** | DRIFT-001 in entity_telemetry.md CE-003 section |

**Overall drift level: DRIFT_MINOR**

---

## 6. SCOPE CONFIRMATION

- DRIFT_MAJOR not present
- DRIFT_CRITICAL not present
- No missing entities
- No broken traceability
- No missing artifact files
- No corrupted topology
- Drift is isolated to one fabricated reference in one section of one file
