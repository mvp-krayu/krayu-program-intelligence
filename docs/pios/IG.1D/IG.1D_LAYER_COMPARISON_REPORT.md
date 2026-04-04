# IG.1D — Layer Comparison Report

**Stream:** IG.1D  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** COMPLETE  
**Date:** 2026-04-04  

---

## 1. LAYER 40.2 — EVIDENCE CLASSIFICATION AND NORMALIZATION

**Baseline:** `docs/pios/40.2/` (4 files)  
**Regenerated:** `docs/pios/runs/run_02_blueedge/40.2/` (4 files)

### L1 — Presence

| File | Baseline | Regenerated | Status |
|---|---|---|---|
| evidence_classification_map.md | PRESENT | PRESENT | PASS |
| evidence_surface_inventory.md | PRESENT | PRESENT | PASS |
| intake_validation_log.md | PRESENT | PRESENT | PASS |
| normalized_evidence_map.md | PRESENT | PRESENT | PASS |

**L1 result: PASS** — 4/4 matched, 0 missing, 0 extra

### L2 — Structural Shape

All 4 files have identical section structures after normalization of headers. Evidence domains, classification tables, CEU sections, and overlap declaration sections are present and consistent.

**L2 result: PASS**

### L3 — Entity Set Equivalence

Canonical Evidence Units: CEU-01 through CEU-13 — identical in both baseline and regenerated. No CEU added or removed. Overlap declarations OVL-01, OVL-02 preserved. Unknown-space declarations US-01, US-02, US-03 preserved.

**L3 result: PASS**

### L4 — Relationship / Topology

Not directly applicable at 40.2 (evidence classification layer has no topology). Evidence boundary and canonical paths are equivalent.

**L4 result: N/A (40.2 scope)**

### L5 — Telemetry Coverage

Not applicable at 40.2.

**L5 result: N/A (40.2 scope)**

### L6 — Telemetry Values

Not applicable at 40.2.

**L6 result: N/A (40.2 scope)**

### L7 — Traceability

CEU-to-path mappings identical. Evidence boundary reference (`runs/run_02_blueedge/evidence_boundary.md`) consistent. All cross-references preserved.

**L7 result: PASS**

### Raw Differences Found (pre-normalization)

| File | Difference | Normalizable |
|---|---|---|
| All 4 files | `contract` field changed | YES — N-01 |
| All 4 files | `date` field changed | YES — N-02 |
| All 4 files | `regeneration_context` field added | YES — N-05 |
| intake_validation_log.md | `regeneration_context` note added to Check 1 body | YES — N-05 |

**Post-normalization differences: NONE**

### 40.2 Layer Verdict: **NONE**

---

## 2. LAYER 40.3 — STRUCTURAL RECONSTRUCTION

**Baseline:** `docs/pios/40.3/` (20 files)  
**Regenerated:** `docs/pios/runs/run_02_blueedge/40.3/` (20 files)

### L1 — Presence

All 20 files present in both baseline and regenerated (6 root, 13 reconstruction/, 1 traceability/).

**L1 result: PASS** — 20/20 matched, 0 missing, 0 extra

### L2 — Structural Shape

All section structures preserved after header normalization. Tier classifications, module categories, dependency groups, interface types, and PEG execution paths all consistent.

**L2 result: PASS**

### L3 — Entity Set Equivalence

Entity IDs CE-001 through CE-003, SA-001 through SA-002, INF-001 through INF-005, BM-001 through BM-065, FE-001 through FE-011, DS-001 through DS-061 — identical in baseline and regenerated. PEG node registry N-01 through N-17 identical. No entities added or removed.

**L3 result: PASS**

### L4 — Relationship / Topology

System dependencies SD-001 through SD-009 identical. Backend dependencies BD-001 through BD-007 identical. Frontend dependencies FD-001 through FD-005 identical. Library dependencies LD-001, LD-002 identical. Interface map INT-001 through INT-008 identical. PEG execution paths EP-01 through EP-08 identical.

**L4 result: PASS**

### L5 — Telemetry Coverage

Not applicable at 40.3.

**L5 result: N/A (40.3 scope)**

### L6 — Telemetry Values

Not applicable at 40.3.

**L6 result: N/A (40.3 scope)**

### L7 — Traceability

structural_traceability_map.md entries identical post-normalization. All entity traces (CEU-08, CEU-09, CEU-10 references) preserved. Unknown-space declarations US-04 through US-13 all present. Overlap carry-forwards OVL-01, OVL-02 intact.

**L7 result: PASS**

### Raw Differences Found (pre-normalization)

| File | Difference | Normalizable |
|---|---|---|
| All 20 files | `contract` field changed | YES — N-01 |
| All 20 files | `date` field changed | YES — N-02 |
| All 20 files | `regeneration_context` field added | YES — N-05 |
| reconstruction_validation_log.md | Input path references updated to run_02_blueedge/40.2/ | YES — N-08 |
| reconstruction_validation_log.md | Output path references updated to run_02_blueedge/40.3/ | YES — N-08 |
| reconstruction/ files | `input:` field paths updated | YES — N-10 |

**Post-normalization differences: NONE**

### 40.3 Layer Verdict: **NONE**

---

## 3. LAYER 40.4 — TELEMETRY GENERATION

**Baseline:** `docs/pios/40.4/` (17 files)  
**Regenerated:** `docs/pios/runs/run_02_blueedge/40.4/` (17 files)

### L1 — Presence

All 17 files present in both baseline and regenerated.

**L1 result: PASS** — 17/17 matched, 0 missing, 0 extra

### L2 — Structural Shape

After normalization of headers and path references: most files consistent. Exception noted in entity_telemetry.md, dependency_telemetry.md, domain_telemetry.md, interface_telemetry.md — section heading formats differ and internal organization differs beyond ordering/casing normalization.

**L2 result: STRUCTURALLY_EQUIVALENT for 13 files; NON-EQUIVALENT format in 4 files (entity_telemetry, dependency_telemetry, domain_telemetry, interface_telemetry)**

### L3 — Entity Set Equivalence

Telemetry entity set — same CE, SA, INF, BM, FE, DS entities covered. No entity IDs added or removed in the covered set.

**L3 result: PASS** — with one noted anomaly in entity_telemetry.md CE-003 entry (see L6 below)

### L4 — Relationship / Topology

Dependency telemetry covers same SD/BD/FD/LD dependency set. Interface telemetry covers same INT-001 through INT-008 set. PEG mapping covers same EP paths.

**L4 result: PASS** (structural_equivalent on covered set)

### L5 — Telemetry Coverage

Same telemetry surface identifiers (TS-001 through TS-017) referenced. Same dimension IDs (DIM-PR, DIM-CP, DIM-ET, DIM-VP, DIM-VT, etc.) referenced. Same temporal patterns (TMP-001 through TMP-012) referenced. Coverage levels (HIGH, PARTIAL, NONE, INDIRECT) consistent across entity set with minor presentation differences.

**L5 result: STRUCTURALLY_EQUIVALENT**

### L6 — Telemetry Values

Evidence grounding is consistent for 16/17 files — all telemetry values reference the same CEU sources.

**Exception identified — entity_telemetry.md, CE-003 section:**
- Baseline: `entity_ref: CE-003` — describes it as containing OVL-01/OVL-02 embedded components; telemetry on embedded components
- Regenerated: `entity_id: CE-003; node_ref: N-C03` — describes it as "Downstream consumer of M-08 outputs"
- Finding 1: `node_ref: N-C03` is not a defined PEG node in the 40.3 entity catalog (N-01 through N-17 are the defined nodes; N-C03 does not exist)
- Finding 2: "M-08" is not a defined entity in any 40.3 artifact
- Finding 3: "Downstream consumer of M-08 outputs" does not match the baseline description or evidence

This constitutes a fabricated reference introduced during IG.1C regeneration. It is localized to the CE-003 entry in entity_telemetry.md only. The CE-003 entity itself (Blue Edge Platform Monorepo) is correctly identified; the error is in the node_ref and description metadata.

**L6 result: DRIFT_MINOR** — one localized fabricated reference (N-C03, M-08) in entity_telemetry.md CE-003 section

### L7 — Traceability

telemetry_traceability_map.md: consistent post-normalization. Telemetry surface-to-entity links preserved. Evidence references consistent.

**L7 result: PASS** — the CE-003/N-C03 fabrication is within entity_telemetry.md only and does not corrupt telemetry_traceability_map.md

### Raw Differences Found (pre-normalization)

| File | Difference | Normalizable | Severity |
|---|---|---|---|
| All 17 files | `contract`, `upstream_contract` fields changed | YES — N-01 | — |
| All 17 files | `run_id` changed | YES — N-03 | — |
| All 17 files | `date` changed | YES — N-02 | — |
| All 17 files | `regeneration_context` added | YES — N-05 | — |
| 8 files (bold-header style) | Header format changed to frontmatter | YES — N-07 | — |
| telemetry_validation_log.md | Input path references updated | YES — N-08, N-10 | — |
| structure_immutability_log.md | `structural_truth_source` path updated | YES — N-09 | — |
| structural_telemetry.md, temporal_telemetry_series.md | Header + path only (≤18 diff lines each) | YES — N-07, N-10 | — |
| entity_telemetry.md | Section structure reformatted beyond normalization; CE-003 node_ref N-C03 fabricated; M-08 entity reference fabricated | **NO** | **DRIFT_MINOR** |
| dependency_telemetry.md, domain_telemetry.md, interface_telemetry.md | Section structure reformatted; same dependency/domain/interface IDs but different presentation depth | PARTIAL | STRUCTURALLY_EQUIVALENT |

**Post-normalization remaining:**
- DRIFT_MINOR: 1 finding (entity_telemetry.md CE-003 fabricated references)
- STRUCTURALLY_EQUIVALENT: 3 files (dependency/domain/interface telemetry — reformatted but same IDs)

### 40.4 Layer Verdict: **DRIFT_MINOR**

---

## 4. LAYER SUMMARY

| Layer | L1 | L2 | L3 | L4 | L5 | L6 | L7 | Verdict |
|---|---|---|---|---|---|---|---|---|
| 40.2 | PASS | PASS | PASS | N/A | N/A | N/A | PASS | **NONE** |
| 40.3 | PASS | PASS | PASS | PASS | N/A | N/A | PASS | **NONE** |
| 40.4 | PASS | STRUCT.EQ | PASS | PASS | STRUCT.EQ | DRIFT_MINOR | PASS | **DRIFT_MINOR** |
