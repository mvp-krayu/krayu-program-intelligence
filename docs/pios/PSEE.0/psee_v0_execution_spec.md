# PSEE.0 — Extraction Engine Execution Specification v0

**Stream:** PSEE.0
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document defines the canonical execution order, entity definitions, and decision points for the PSEE extraction engine. An analyst or automated system following this specification can reproduce the 40.2 intake structure from any equivalent source corpus. This specification is the operational form of the rule catalog — it tells you not just what the rules are, but how to apply them in sequence to produce a complete intake layer.

**Value:** Transforms rule catalog knowledge into a repeatable, auditable process. Enables consulting delivery of the extraction methodology as a standalone onboarding procedure for new repository engagements.

---

#### METHODOLOGY LAYER

The execution spec defines:
1. Phase prerequisites (what must exist before execution starts)
2. Five execution phases in dependency order
3. Decision points and stop conditions at each phase
4. Entity population sequence for each output artifact
5. Coverage gate (≥90% mapping) before formalization proceeds

---

#### TECHNICAL LAYER

---

### Phase 0 — Prerequisites and Source Binding

**Input requirements:**
- Source corpus root accessible (equivalent to `source-v3.23/`)
- Evidence boundary document accessible (`evidence_boundary.md` or equivalent)
- Phase B target artifacts readable (`40.2/*.md` files)

**Checks before proceeding:**
| # | Check | Stop condition |
|---|---|---|
| P0-01 | Source corpus root exists and is accessible | SOURCE_RESOLUTION_FAIL |
| P0-02 | Evidence boundary document (or equivalent) present | SOURCE_RESOLUTION_FAIL |
| P0-03 | All required Phase B artifacts present | SOURCE_RESOLUTION_FAIL |
| P0-04 | System identity confirmed (version match between Phase A and Phase B) | SOURCE_RESOLUTION_FAIL |

**Output:** `context_validation.md` confirming P0-01 through P0-04 pass.

---

### Phase 1 — Source Normalization (R-NRM-01)

**Objective:** Resolve all path-level ambiguity before any evidence reading proceeds.

**Execution steps:**
1. Scan the corpus root for directory names that repeat in immediate succession.
2. For each detected repetition: retrieve extraction log evidence (if available) OR perform manual inspection to classify.
3. Apply classification: EXTRACTION_ARTIFACT | PACKAGING_BOUNDARY | ARCHITECTURAL_STRUCTURE.
4. Declare canonical path for each collapsed duplication.
5. Populate `PathNormalizationRecord` for each detected duplication.

**Decision point:**
- If any duplication is classified as ARCHITECTURAL_STRUCTURE: DO NOT collapse — preserve both paths and document the architectural layering.
- If any duplication CANNOT be classified (no extraction log, no diff available): declare UNKNOWN classification and halt downstream processing that relies on that path until classification is resolved.

**Output:** `source_normalization_log.md`

**Feeds:** All subsequent phases use normalized canonical paths only.

---

### Phase 2 — Filtering (R-FLT-01, R-FLT-02, R-FLT-03)

**Objective:** Determine intake status for each source path before any grouping or abstraction.

**Step 2.1 — Provenance filtering (R-FLT-01):**
1. Read `provenance_only_paths` from evidence boundary.
2. For each path: verify existence + record size.
3. Assign `intake_status = NOT INGESTED`.
4. No content inspection.

**Step 2.2 — Support-only filtering (R-FLT-02):**
1. Identify extraction-generated metadata files (extraction logs, classification notes, overlap validation).
2. Cross-reference against `source_materials` or equivalent boundary annotation.
3. Assign `intake_status = ACCEPTED-SUPPORT-ONLY` with restriction note.

**Step 2.3 — Exclusion filtering (R-FLT-03):**
1. Read `explicitly_excluded_paths` from evidence boundary.
2. Verify each excluded path was NOT ACCESSED.
3. Populate prohibited path compliance record.

**Decision point:**
- If `explicitly_excluded_paths` list is absent from the boundary document: flag as GRAY-ZONE and require explicit scope statement before proceeding.

**Output:** Intake status table (path → status) used in domain population (Phase 3).

---

### Phase 3 — Grouping and Domain Formation (R-GRP-01, R-GRP-02, R-GRP-03)

**Objective:** Form the domain structure of `evidence_surface_inventory.md`.

**Step 3.1 — Top-level domain grouping (R-GRP-01):**
1. Enumerate top-level directories under the source root (after Phase 1 normalization).
2. For each directory in `primary_evidence_origin_paths`: create one `EvidenceDomain` entity.
3. Populate: domain_id (sequential), path (normalized), evidence_class, intake_status (from Phase 2).
4. Enumerate all files in each domain directory (non-recursive at first pass; recurse for sub-tables in step 3.2).

**Step 3.2 — Sub-grouping (R-GRP-02):**
1. For domains with large source trees (>50 files), apply sub-grouping by architectural role.
2. Identify structural layers: infrastructure root files, source entry points, utility subsystems, domain module directories.
3. Create `SubTable` entities per architectural layer.
4. Apply R-ABS-02 pattern rows for repeated module structures.

**Step 3.3 — Platform component separation (R-GRP-03):**
1. For the platform/integrated repository domain: separate platform-unique artifacts from embedded components.
2. List platform-unique artifacts individually.
3. Reference embedded component domains (from steps 3.1/3.2) by domain ID rather than re-enumerating.

**Completion gate:** All paths in `primary_evidence_origin_paths` must map to exactly one domain. No domain may contain paths from multiple provenance origins.

**Output:** All `EvidenceDomain` entities → populates `evidence_surface_inventory.md`.

---

### Phase 4 — Abstraction and CEU Formation (R-ABS-01, R-ABS-02)

**Objective:** Form the `normalized_evidence_map.md` CEU index.

**Step 4.1 — CEU entity creation (R-ABS-01):**
1. For each `EvidenceDomain`: create one `CanonicalEvidenceUnit`.
2. Assign canonical_id using R-NAM-01 (priority-ordered sequential assignment).
3. Populate: canonical_path (from domain), evidence_class, scope summary, intake_status.
4. For large source trees (≥3 architectural sub-groups): add `CEUSubUnit` records using R-ABS-02 + R-NAM-02.

**Step 4.2 — Overlap detection and declaration (R-NRM-02):**
1. For each pair of CEUs with structurally similar path organization: check whether a diff was available in Phase A extraction metadata.
2. If diff result available: create `OverlapDeclaration` with file_level_parity = KNOWN (identical) or KNOWN (different).
3. If diff not available but structural similarity observed: create `OverlapDeclaration` with file_level_parity = UNKNOWN.
4. Assign canonical preference: isolated evidence preferred for module-level analysis; integrated for system context.

**Step 4.3 — Unknown-space declaration (R-NRM-03):**
1. For each unresolved overlap (file_level_parity = UNKNOWN): create `UnknownSpace` record.
2. For any other position where information is absent (e.g., platform content beyond standalone equivalents): create `UnknownSpace` record.
3. STRICT: Do not infer or synthesize to fill unknown-space.

**Output:** All CEU, OVL, and US entities → populates `normalized_evidence_map.md`.

---

### Phase 5 — Classification and Validation Formation (R-NRM-01 through R-NAM-02)

**Objective:** Form `evidence_classification_map.md` and `intake_validation_log.md`.

**Step 5.1 — Classification mapping:**
1. Read `accepted_evidence_classes` from evidence boundary.
2. For each CEU and sub-unit: assign evidence_class, evidence_subclass, priority.
3. For pattern rows (R-ABS-02 outputs): apply the class from the file type pattern, not individual files.
4. Overlap-zone entries (OVERLAP-NOTED): reference the canonical CEU, do not re-classify content.
5. NOT INGESTED entries: classify as "provenance only" with NOT INGESTED priority.

**Step 5.2 — Validation check population:**
1. For each validation check type (existence, mapping, exclusion-compliance, type-compliance, assumption-compliance, completeness, inference-guard): populate findings and verdict.
2. Non-listed file type assessment: match against accepted_evidence_classes by content role, not file extension.
3. Completeness position: declare explicitly — do not omit unknown-space positions from the completeness statement.

**Coverage gate:**
- Compute: (mapped Phase B units) / (total Phase B units decomposed in phase_b_decomposition.md) × 100.
- Minimum: 90%. If below 90%: flag unmapped units and continue as PARTIAL (FALLBACK MODE: PROCEED per contract).
- At 100%: FULL coverage achieved.

**Output:** `evidence_classification_map.md` + `intake_validation_log.md`.

---

### Phase 6 — Reconstruction Simulation

**Objective:** Verify that applying the 13 rules to Phase A produces a Phase B structure equivalent to the actual 40.2 artifacts.

**Execution:**
1. Apply rules in execution order from psee_v0_schema.json rule_execution_order.
2. From Phase A input: produce (a) an evidence domain list, (b) a CEU list, (c) a classification table, (d) a validation check list.
3. Compare each produced element against the corresponding Phase B unit from phase_b_decomposition.md.
4. Record: structural_match (EQUIVALENT | PARTIAL | DIVERGENT) per artifact.

**Stop condition:** If any artifact shows DIVERGENT result: investigate unmapped units, refine rules, and re-run before closing stream.

**Output:** `reconstruction_validation_report.md`

---

## ENTITY POPULATION SEQUENCE

| Phase | Rules applied | Entities produced | Output artifact |
|---|---|---|---|
| 0 | — | System identity confirmation | context_validation.md |
| 1 | R-NRM-01 | PathNormalizationRecord | source_normalization_log.md |
| 2 | R-FLT-01/02/03 | Intake status table | (feeds Phase 3) |
| 3 | R-GRP-01/02/03 | EvidenceDomain, SubTable, FileRow | evidence_surface_inventory.md |
| 4 | R-ABS-01/02, R-NRM-02/03, R-NAM-01/02 | CEU, CEUSubUnit, OVL, US | normalized_evidence_map.md |
| 5 | R-ABS-01/02, R-NAM-01/02, R-NRM-03 | ClassificationRecord, ValidationCheck | evidence_classification_map.md, intake_validation_log.md |
| 6 | All 13 rules (simulation) | Reconstruction comparison | reconstruction_validation_report.md |

---

## DECISION TREE SUMMARY

```
START
  └── Phase 0: Source binding
        ├── FAIL: SOURCE_RESOLUTION_FAIL → STOP
        └── PASS → Phase 1: Normalization
              ├── ARCHITECTURAL_STRUCTURE duplication found → preserve both paths → document
              ├── UNCLASSIFIABLE duplication → halt dependent processing → flag
              └── PACKAGING_BOUNDARY → collapse → Phase 2: Filtering
                    ├── Exclusion list absent → GRAY-ZONE flag → request scope statement
                    └── Filtering complete → Phase 3: Grouping
                          ├── Path not in any domain → flag as unclaimed → investigate
                          └── Domains formed → Phase 4: Abstraction + CEU formation
                                └── Phase 5: Classification + Validation
                                      ├── Coverage < 90% → PARTIAL flag → continue
                                      └── Coverage ≥ 90% → Phase 6: Reconstruction simulation
                                            ├── DIVERGENT result → refine rules → re-run
                                            └── EQUIVALENT or PARTIAL → COMPLETE
```

---

#### LIMITATIONS & BOUNDARIES

- This execution spec is derived from the BlueEdge v3.23.0 instantiation. Repositories without extraction logs will require manual execution of R-NRM-01 path classification.
- The 90% coverage threshold is the minimum; 100% is achievable and was achieved in this instantiation.
- Phase 6 (reconstruction simulation) is a logical simulation (compare by structure), not a code execution. Automated execution of this spec would require tooling not defined in PSEE.0.
- The entity schema in psee_v0_schema.json is the authoritative reference for field types and constraints.

---

#### REUSABILITY STATEMENT

To execute this specification for a new repository:
1. Replace all BlueEdge-specific paths and file names with the new repository's equivalents.
2. Create or locate an equivalent of evidence_boundary.md for the new engagement — this is the single most important Phase A artifact; if it does not exist, create it before beginning Phase 2.
3. Execute phases 0 through 6 in sequence, producing each output artifact.
4. The rule catalog (rule_catalog_v0.md) and schema (psee_v0_schema.json) are portable without modification.
5. Apply R-NRM-03 rigorously — do not synthesize unknown-space positions.

---

#### STATUS

**EXECUTION SPEC v0: COMPLETE**
