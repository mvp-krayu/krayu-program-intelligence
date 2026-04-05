# PSEE.0 — Phase B Decomposition

**Stream:** PSEE.0
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document breaks each of the four 40.2 artifacts into their constituent atomic units: discrete entities, groupings, mappings, exclusions, and naming constructs. Decomposition to atomic units is necessary before transformation mapping can be performed — each unit needs a traceable Phase A contributor, and units that cannot be traced must be flagged.

**Value:** Provides the exact set of Phase B units that the extraction rules must account for. Any rule catalog that does not address all units here is incomplete.

---

#### METHODOLOGY LAYER

1. Read each 40.2 artifact in full.
2. Identify atomic units — the smallest independently traceable structural element (e.g., a single CEU record, a single domain grouping, a single classification row).
3. Type each unit as: ENTITY | GROUPING | MAPPING | EXCLUSION | NAMING-CONSTRUCT.
4. Record the structural role each unit plays in the artifact.

---

#### TECHNICAL LAYER

---

### Artifact 1 — evidence_surface_inventory.md

**Purpose:** Enumerate all evidence sources as discrete domains with file counts and intake status.

| Unit ID | Unit | Type | Structural Role |
|---------|------|------|-----------------|
| ESI-U01 | Domain 1 — HTML Documentation (path, class, status, file table, count) | GROUPING | Evidence domain grouping by source directory |
| ESI-U02 | Domain 2 — Extraction Analysis (path, class, status, restriction note, file table, count) | GROUPING | Evidence domain grouping with restriction annotation |
| ESI-U03 | Domain 3 — Extracted Backend Source (path, class, status, 2 sub-tables: infra + modules, count) | GROUPING | Evidence domain grouping with typed sub-tables |
| ESI-U04 | Domain 4 — Extracted Frontend Source (path, class, status, sub-tables: infra + src subsystems, count) | GROUPING | Evidence domain grouping with typed sub-tables |
| ESI-U05 | Domain 5 — Extracted Platform Source (path, class, status, platform root + sub-tables + unique artifacts, count) | GROUPING | Evidence domain grouping — unique artifacts highlighted |
| ESI-U06 | Domain 6 — Raw Provenance Archives (path, class, status=NOT-INGESTED, file table with sizes) | EXCLUSION | Explicit exclusion domain (existence-confirmed, not ingested) |
| ESI-U07 | Evidence Surface Summary table (domain × class × count × status) | MAPPING | Cross-domain summary → normalization input |
| ESI-U08 | Overlap Observation block (positions + resolution_position + unknown_space) | ENTITY | Forward-reference to normalized_evidence_map.md |
| ESI-U09 | Prohibited Path Compliance block (list of excluded paths + access status) | EXCLUSION | Boundary enforcement record |
| ESI-U10 | Status block (inventory_complete, evidence_boundary_compliance) | ENTITY | Completion state declaration |

**Domain header structure (shared across ESI-U01 to ESI-U06):**
```
Path: <source path>
Evidence class: <class>
Intake status: <status>
[File table]
File count: <N>
```

**Total atomic units in ESI: 10**

---

### Artifact 2 — normalized_evidence_map.md

**Purpose:** Assign a canonical evidence unit (CEU) identifier to each distinct evidence source, resolve overlaps, and declare unknown-space.

#### CEU Entities (13 units)

| Unit ID | Unit | Type | Structural Role |
|---------|------|------|-----------------|
| NEM-U01 | CEU-01: Architecture HTML | ENTITY | Canonical unit record (id, path, class, status, overlap, unknown_space) |
| NEM-U02 | CEU-02: Competitive Dashboard HTML | ENTITY | Same structure as CEU-01 |
| NEM-U03 | CEU-03: PMO Dashboard HTML | ENTITY | Same structure |
| NEM-U04 | CEU-04: Extraction log | ENTITY | Sub-authority restriction annotation |
| NEM-U05 | CEU-05: Repository classification | ENTITY | Sub-authority restriction annotation |
| NEM-U06 | CEU-06: Component inventory | ENTITY | Sub-authority restriction annotation |
| NEM-U07 | CEU-07: Overlap validation | ENTITY | Sub-authority restriction annotation |
| NEM-U08 | CEU-08: Backend source (standalone) | ENTITY + GROUPING | Entity with embedded sub-unit table (10 sub-units) |
| NEM-U09 | CEU-09: Frontend source (standalone) | ENTITY + GROUPING | Entity with embedded sub-unit table (14 sub-units) |
| NEM-U10 | CEU-10: Platform monorepo | ENTITY + GROUPING | Entity with embedded sub-unit table (7 sub-units) |
| NEM-U11 | CEU-11: Raw backend archive | EXCLUSION | Provenance-only record |
| NEM-U12 | CEU-12: Raw frontend archive | EXCLUSION | Provenance-only record |
| NEM-U13 | CEU-13: Raw platform archive | EXCLUSION | Provenance-only record |

#### CEU record structure (canonical schema):
```
canonical_id: CEU-NN
canonical_path: <path>
evidence_class: <class>
intake_status: <status>
overlap: <OVL-ID | NONE>
unknown_space: <US-ID | NONE>
[optional: sub_units table]
```

#### Overlap Records (2 units)

| Unit ID | Unit | Type | Structural Role |
|---------|------|------|-----------------|
| NEM-U14 | OVL-01: Backend standalone vs platform embedded | MAPPING | Overlap declaration with canonical preference assignment |
| NEM-U15 | OVL-02: Frontend standalone vs platform embedded | MAPPING | Overlap declaration with canonical preference assignment |

**OVL record structure:**
```
overlap_id: OVL-NN
unit_a: <CEU-ID> (<path>)
unit_b: <CEU-ID> (<path>)
observed_similarity: <description>
file_level_parity: <KNOWN | UNKNOWN>
canonical_for_isolated_evidence: <CEU-ID>
canonical_for_integrated_context: <CEU-ID>
resolution_status: <status>
pipeline_impact: <description>
```

#### Unknown-Space Records (3 units)

| Unit ID | Unit | Type | Structural Role |
|---------|------|------|-----------------|
| NEM-U16 | US-01: backend parity unknown | ENTITY | Unknown-space preservation record |
| NEM-U17 | US-02: frontend parity unknown | ENTITY | Unknown-space preservation record |
| NEM-U18 | US-03: platform-unique content unknown | ENTITY | Unknown-space preservation record |

#### Structural elements

| Unit ID | Unit | Type |
|---------|------|------|
| NEM-U19 | Evidence Priority Hierarchy table (4-tier ordering) | MAPPING |
| NEM-U20 | CEU Summary Table (13 rows × 4 columns) | MAPPING |

**Total atomic units in NEM: 20**

---

### Artifact 3 — evidence_classification_map.md

**Purpose:** Assign evidence_class, evidence_subclass, and priority to each ingested evidence unit. Provides the classification basis for all downstream processing.

| Unit ID | Unit | Type | Structural Role |
|---------|------|------|-----------------|
| ECM-U01 | Classification basis section (accepted_evidence_classes list) | ENTITY | Defines valid class vocabulary |
| ECM-U02 | HTML Documentation classification table (3 rows) | MAPPING | Unit → class/subclass/priority |
| ECM-U03 | Extraction Analysis classification table (4 rows, SUPPORT-ONLY annotation) | MAPPING | Unit → class/subclass/priority with restriction |
| ECM-U04 | Extracted Backend Infrastructure classification table (7 rows) | MAPPING | Infrastructure files → class/subclass/priority |
| ECM-U05 | Extracted Backend Source Code classification table (14 pattern rows) | MAPPING | Pattern-based classification (e.g., "{name}.controller.ts") |
| ECM-U06 | Extracted Frontend Infrastructure classification table (15 rows) | MAPPING | Frontend infra → class/subclass/priority |
| ECM-U07 | Extracted Frontend Source Code classification table (19 pattern rows) | MAPPING | Pattern-based classification |
| ECM-U08 | Platform-Unique Artifacts classification table (18 rows) | MAPPING | Platform-specific files → class/subclass/priority |
| ECM-U09 | Platform Embedded classification table (2 rows with OVERLAP-NOTED status) | MAPPING | Overlap zone classification record |
| ECM-U10 | Raw Provenance Archives classification table (3 rows with NOT-INGESTED status) | EXCLUSION | Provenance-only classification record |
| ECM-U11 | Classification Summary table (class × count × notes) | MAPPING | Cross-class summary |
| ECM-U12 | Status block | ENTITY | Completion state |

**Classification column structure (shared across all mapping tables):**
```
Evidence Unit | Domain | Class | Subclass | Priority
```

**Total atomic units in ECM: 12**

---

### Artifact 4 — intake_validation_log.md

**Purpose:** Validate that the intake honored the evidence_boundary.md rules across 8 explicitly checked dimensions.

| Unit ID | Unit | Type | Structural Role |
|---------|------|------|-----------------|
| IVL-U01 | Check 1: Evidence origin root existence (findings + result: PASS) | ENTITY | Boundary confirmation check |
| IVL-U02 | Check 2: Primary evidence path availability (table: path × status) | MAPPING | Declared paths → existence verification |
| IVL-U03 | Check 3: Provenance-only path handling (table: path × existence × ingested) | EXCLUSION | Archive non-ingestion confirmation |
| IVL-U04 | Check 4: Explicitly excluded paths (table: path × accessed) | EXCLUSION | Boundary enforcement record |
| IVL-U05 | Check 5: Accepted file type compliance (list of types + non-listed type assessment) | MAPPING | File type → evidence class assignment with justification |
| IVL-U06 | Check 6: Intake assumptions compliance (table: assumption × status) | MAPPING | evidence_boundary.md assumptions → compliance status |
| IVL-U07 | Check 7: Completeness position (findings + unknown-space handling) | ENTITY | Completeness state with unknown-space acknowledgment |
| IVL-U08 | Check 8: No inferred missing evidence (findings + result) | ENTITY | Zero-inference confirmation |
| IVL-U09 | Validation Summary table (8 checks × description × result) | MAPPING | Summary of all checks |
| IVL-U10 | Intake Completeness Statement (COMPLETE + 3 unknown-space positions) | ENTITY | Final intake verdict with US-01/US-02/US-03 |
| IVL-U11 | Status block (validation_complete, overall_result, intake_status, final_completeness) | ENTITY | Completion state declaration |

**Check record structure (shared across IVL-U01 through IVL-U08):**
```
Check: <description>
[evidence table or findings]
Result: PASS | FAIL
```

**Total atomic units in IVL: 11**

---

### Phase B Decomposition Summary

| Artifact | Total units | ENTITY | GROUPING | MAPPING | EXCLUSION | NAMING-CONSTRUCT |
|---|---|---|---|---|---|---|
| evidence_surface_inventory.md | 10 | 2 | 5 | 1 | 2 | 0 |
| normalized_evidence_map.md | 20 | 10 | 0 | 5 | 3 | 2 (CEU-NN, OVL-NN naming) |
| evidence_classification_map.md | 12 | 2 | 0 | 9 | 1 | 0 |
| intake_validation_log.md | 11 | 5 | 0 | 3 | 3 | 0 |
| **Total** | **53** | **19** | **5** | **18** | **9** | **2** |

---

### Cross-Artifact Naming Constructs

Two systematic naming schemes span multiple Phase B artifacts:

| Naming Construct ID | Pattern | Scope | Role |
|---|---|---|---|
| NC-01 | `CEU-NN` (sequential integer, 2-digit) | normalized_evidence_map.md + evidence_surface_inventory.md (overlap cross-reference) | Canonical evidence unit identifier |
| NC-02 | `OVL-NN` (sequential integer) | normalized_evidence_map.md + evidence_surface_inventory.md | Overlap declaration identifier |
| NC-03 | `US-NN` (sequential integer) | normalized_evidence_map.md | Unknown-space declaration identifier |
| NC-04 | `CEU-NN-ROLE` suffix pattern (e.g., CEU-08-INFRA, CEU-08-SQL) | normalized_evidence_map.md sub-unit tables | Sub-unit identifier within a CEU |
| NC-05 | `DOMAIN-N` (sequential integer with "Evidence Domain N" label) | evidence_surface_inventory.md | Domain grouping identifier |

---

#### EVIDENCE LAYER

All units above were derived by reading the full text of each 40.2 artifact. No unit was inferred from partial reading. Cross-references between artifacts (e.g., ESI-U08 → NEM overlap records) are documented in transformation_mapping.md.

---

#### LIMITATIONS & BOUNDARIES

- Pattern-based classification rows (e.g., ECM-U05 "src/modules/{name}/{name}.controller.ts") are counted as single units representing a class of files, not as one unit per file. This is the correct abstraction level for rule derivation.
- The 10 CEU sub-unit entries within CEU-08 (NEM-U08) are sub-units of the CEU record, not independent CEU-level entities; they are documented within the parent CEU count.
- Unit count of 53 total represents the Phase B transformation surface. The extraction rule catalog must achieve ≥90% mapping coverage (≥48 of 53 units mapped to Phase A contributors).

---

#### REUSABILITY STATEMENT

To apply this decomposition to another pipeline's intake layer:
1. Decompose each output artifact into its smallest independently traceable structural element.
2. Record unit type consistently (ENTITY / GROUPING / MAPPING / EXCLUSION / NAMING-CONSTRUCT).
3. Count total units — this becomes the denominator for coverage measurement.
4. Identify shared naming constructs across artifacts — these typically indicate cross-cutting transformation rules.

---

#### STATUS

| Check | Result |
|---|---|
| All 4 Phase B artifacts decomposed | COMPLETE |
| Total atomic units | 53 |
| Naming constructs identified | 5 (NC-01 through NC-05) |
| Cross-artifact references documented | 3 (ESI→NEM, NEM→IVL, ECM→NEM) |

**PHASE B DECOMPOSITION: COMPLETE**
