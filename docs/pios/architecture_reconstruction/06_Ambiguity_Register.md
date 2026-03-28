---
title: Ambiguity Register
type: ambiguity-register
status: OBSERVED
confidence: HIGH
date: 2026-03-28
total_ambiguities: 7
---

# Ambiguity Register

## AMB-001 — Stream 00.2 Canonical Layer Model Absent (HIGH IMPACT)

**Title:** Defining document for L0-L8 layer model not found in this repo

**Description:** 43.1, 44.1, 44.2, 43.2, 43.3 all reference "Stream 00.2 — Canonical Layer Model Restoration" as the authority for the canonical L0-L8 model. Fragments extracted: L3=signal derivation, L4=semantic shaping, L5=presentation assembly, L6=runtime rendering. L0-L2 and L7-L8 are undefined in available evidence.

**Impact on L1-L6 Adjudication:** HIGH — L1-L6 as a complete bounded model cannot be confirmed or denied from evidence in this repo alone. The verdict is MODIFIED rather than CONFIRMED or REJECTED.

**Resolution path:** Obtain Stream 00.2 from its source authority (external governance context or prior session archive).

**Status:** OPEN

---

## AMB-002 — 40.8 Naming Conflict (LOW IMPACT)

**Title:** Stream 40.8 described as both "Agentic Orchestration" and "Delivery Structuring"

**Description:** pios_pipeline_specification.md names Stream 40.8 "Agentic Orchestration Layer." The 40.11/stream_50_handover_capsule.md names it "Delivery Structuring" in the pipeline summary (40.8 → Delivery Structuring).

**Impact:** Concept C-013 "Delivery" is ambiguous. Low architectural impact — same stream, different labels.

**Status:** OPEN (LOW PRIORITY)

---

## AMB-003 — L5 Stream Mapping Unclear (MEDIUM IMPACT)

**Title:** L5 (presentation assembly) not explicitly assigned to 43.x or 44.x or both

**Description:** 43.1 Section 10 states 43.x holds "no presentation assembly responsibility (L5)" — confirming 43.x is NOT L5. But whether L5 maps to 44.x alone, or to both 43.x+44.x together, or to something else, is not defined in available evidence.

**Impact:** Boundary between L4 (41.x) and L5 is not precisely locatable without Stream 00.2.

**Status:** OPEN

---

## AMB-004 — 40.6 Hosts Two Pipeline Stages (LOW, RESOLVED-PARTIAL)

**Title:** Condition Activation (Stage 5) and Diagnosis Activation (Stage 6) both assigned to Stream 40.6

**Description:** pios_pipeline_specification.md assigns both Stage 5 and Stage 6 to Stream 40.6. State-Diagnosis Separation Principle (GC-07) requires analytical separation. How this is enforced within a single stream is not shown in pipeline spec but is confirmed in 40.7 boundary enforcement (40.6 outputs are the input boundary for 40.7).

**Resolution:** Analytical separation enforced internally to 40.6; architecturally expressed by distinct output sets (condition_output_set.md vs diagnosis artifacts).

**Status:** RESOLVED-PARTIAL

---

## AMB-005 — CKR 34-Construct Registry Not Fully Enumerable (MEDIUM IMPACT)

**Title:** GOV-00 states 34 CKR constructs; only 15 referenced in available evidence

**Description:** GOV-00.md states CKR governs "all 34 CKR constructs." Evidence shows references to CKR-001 through CKR-015. No complete CKR listing is available in this repo.

**Impact:** Signal admission completeness cannot be fully confirmed. 43.1 requires all binding inputs to be CKR-admitted. If additional signals are defined in CKR beyond CKR-015, their status is unknown.

**Status:** OPEN

---

## AMB-006 — Run Continuity Gaps Between 40.x and 41.x (LOW IMPACT)

**Title:** 40.5 uses run_01_blueedge; 41.1 uses run_03_blueedge_derivation_validation

**Description:** 40.5 execution manifest references run_01_blueedge. 41.1/semantic_elevation_report.md references run_03_blueedge_derivation_validation. Run_02 is not visible in the current artifact structure. The lineage between run_01 (40.x) and run_03 (41.x) is inferred rather than explicitly documented.

**Impact:** Lineage confidence between 40.x and 41.x is HIGH (observed artifacts exist in both) but run ancestry is MEDIUM confidence.

**Status:** OPEN

---

## AMB-007 — 75.x Interpretation Layer Referenced But Absent (MEDIUM IMPACT)

**Title:** Stream 75 — Program Diagnosis and Intelligence Models not found in this repo

**Description:** pios_execution_contract.md references Stream 75 as "Program Diagnosis and Intelligence Models." 42.23/rewiring_plan.md states "75.x interpretation layer: remains blocked." No 75.x artifacts exist in this repo.

**Impact:** A defined interpretation layer is architecturally referenced but absent. The demo surface explicitly works around it as "blocked." This suggests 75.x is a planned or partially executed stream.

**Status:** OPEN

---

## Summary

| ID | Impact | Status |
|---|---|---|
| AMB-001 | HIGH | OPEN |
| AMB-002 | LOW | OPEN |
| AMB-003 | MEDIUM | OPEN |
| AMB-004 | LOW | RESOLVED-PARTIAL |
| AMB-005 | MEDIUM | OPEN |
| AMB-006 | LOW | OPEN |
| AMB-007 | MEDIUM | OPEN |

Total open: 6
Total resolved-partial: 1
