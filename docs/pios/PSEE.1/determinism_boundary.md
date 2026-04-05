# PSEE.1 — Determinism Boundary

**Stream:** PSEE.1
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document separates the PSEE decision space into three categories: FIXED (fully deterministic given inputs), CONTINGENT (deterministic given observable corpus structure), and FORBIDDEN (any pattern that would introduce heuristic confidence in place of evidence). This is the governance fence between deterministic rule application and prohibited interpretive drift.

**Value:** The boundary is the enforcement surface for PSEE.F1 rule F.2 (no canonical bleed) and PSEE.0 R-NRM-03 (unknown-space supremacy). PSEE.2 must implement within these fences; any implementation that crosses them is non-compliant.

---

#### METHODOLOGY LAYER

1. For each decision point (DP-xx) from decision_points_catalog.md: classify as FIXED, CONTINGENT, or FORBIDDEN.
2. For each FIXED decision: state the exact deterministic rule.
3. For each CONTINGENT decision: state the observable condition that gates the decision and what makes it deterministic within that condition.
4. For each FORBIDDEN pattern: state what makes it forbidden (which canonical rule or doctrine principle it violates).
5. Source: psee_v0_execution_spec.md, rule_catalog_v0.md, psee_v0_schema.json, doctrine_genealogy.md TRANSITION A/B/C.

---

#### TECHNICAL LAYER

---

### Part 1 — FIXED Decisions (Fully Deterministic)

Fixed decisions produce the same output for the same input, unconditionally, with no operator judgment required.

---

#### FX-01 — Path segment repetition detection (DP-1-01)

```
rule:      If any path segment P appears in position N and position N+1 in the same path:
           duplication detected = TRUE
determinism: full — string comparison is mechanical; no judgment
source:    R-NRM-01
```

#### FX-02 — Provenance archive exclusion (DP-2-02)

```
rule:      If file path ∈ evidence_boundary.provenance_only_paths:
           intake_status = NOT INGESTED, no content inspection
determinism: full — set membership check; binary result
source:    R-FLT-01; psee_v0_schema.json intake_state_machine
```

#### FX-03 — Explicit exclusion list compliance (DP-2-04 true-path)

```
rule:      If file path ∈ evidence_boundary.explicitly_excluded_paths:
           intake_status = EXCLUDED; NOT ACCESSED; compliance record written
determinism: full — set membership check; binary result
source:    R-FLT-03
```

#### FX-04 — Default intake status for primary evidence (DP-2-04 false-path)

```
rule:      If file passes all filter checks (not provenance, not extraction, not excluded):
           intake_status = ACCEPTED
determinism: full — residual category after exhausting all filter conditions
source:    psee_v0_schema.json intake_state_machine transitions default_for_primary_origin_paths
```

#### FX-05 — CEU identifier sequencing (R-NAM-01)

```
rule:      CEU identifiers assigned in priority-tier order:
           Tier 1 (Documentation) → CEU-01..N
           Tier 2 (Extraction metadata) → CEU-(N+1)..M
           Tier 3 (Primary source trees) → CEU-(M+1)..P
           Tier 4 (Provenance-only) → CEU-(P+1)..Q
           Within each tier: sequential integer assignment
determinism: full — tier membership is determined by intake_status and evidence_class;
             sequencing within tier by enumeration order (R-GRP-01 domain order)
source:    R-NAM-01; psee_v0_execution_spec.md Phase 4 Step 4.1
```

#### FX-06 — CEU sub-unit identifier scheme (R-NAM-02)

```
rule:      sub_unit_id = <parent_CEU_id>-<ROLE_LABEL>
           ROLE_LABEL is derived from the architectural role label of the sub-table
           (from Phase 3 sub-grouping, R-GRP-02)
determinism: full — mechanical concatenation from parent ID and role label
source:    R-NAM-02; psee_v0_schema.json CEUSubUnit.sub_unit_id pattern
```

#### FX-07 — Unknown-space record creation (DP-4-03)

```
rule:      If any overlap has file_level_parity = UNKNOWN, OR if any position
           in the intake could theoretically be inferred but lacks evidence:
           UnknownSpace record MUST be created; no inference PERMITTED
determinism: full — the trigger is binary (UNKNOWN parity or inferrable gap exists);
             the action is mandatory (no conditional path that avoids US creation)
source:    R-NRM-03; psee_v0_execution_spec.md Phase 4 Step 4.3
```

#### FX-08 — Overlap canonical preference assignment (DP-4-02)

```
rule:      For any OVL record:
           canonical_for_isolated_evidence = standalone CEU (module-level analysis)
           canonical_for_integrated_context = platform/integrated CEU (system context)
determinism: full — the isolated vs. integrated distinction maps directly to the
             CEU provenance: standalone archive CEU = isolated; platform CEU = integrated
source:    R-NRM-02; psee_v0_schema.json OverlapDeclaration fields
```

#### FX-09 — NOT INGESTED priority assignment (DP-S-02 for archives)

```
rule:      Any file with intake_status ∈ {NOT INGESTED, EXCLUDED}:
           ClassificationRecord.priority = NOT INGESTED (or EXCLUDED equivalent)
determinism: full — intake_status directly determines priority class
source:    psee_v0_schema.json ClassificationRecord.priority enum; R-FLT-01/03
```

#### FX-10 — OVERLAP-NOTED priority assignment (DP-S-02 for platform embedded)

```
rule:      Any platform-embedded component with an active OVL declaration:
           ClassificationRecord.priority = OVERLAP-NOTED
           (not re-classified; canonical source CEU is the authority)
determinism: full — OVL record existence triggers OVERLAP-NOTED; no judgment required
source:    psee_v0_execution_spec.md Phase 5 Step 5.1 step 4; R-GRP-03
```

---

### Part 2 — CONTINGENT Decisions (Deterministic Within Observable Conditions)

Contingent decisions are deterministic once the triggering observable condition is confirmed. The decision itself is not ambiguous — but the trigger requires reading corpus structure.

---

#### CT-01 — Packaging boundary collapse vs. architectural preservation (DP-1-02 → DP-1-03/04)

```
condition:     Duplication detected (DP-1-01 true)
deterministic_path: If extraction log available AND archive root folder name = outer directory name:
                    PACKAGING_BOUNDARY → collapse (FX-01 applies)
                If diff evidence confirms same content in both paths:
                    PACKAGING_BOUNDARY → collapse
                If paths serve provably different architectural roles:
                    ARCHITECTURAL_STRUCTURE → preserve (DP-1-04)
contingency:   Requires reading extraction log or performing diff. The decision is deterministic
               once the evidence is observed; only the evidence-gathering step is contingent.
non-deterministic trigger: UNCLASSIFIABLE (DP-1-05) → STOP; see FORBIDDEN section
source:        R-NRM-01; psee_v0_execution_spec.md Phase 1
```

#### CT-02 — Support-only downgrade detection (DP-2-03)

```
condition:     File is in primary_evidence_origin_paths but source_materials field
               contains annotation signaling reduced authority
deterministic_path: If source_materials annotation present → ACCEPTED-SUPPORT-ONLY
                    (rule applies; no judgment about severity required)
contingency:   Requires reading the source_materials field of the evidence boundary.
               The field may be absent (no annotation) → file remains ACCEPTED.
               The field content may not use "lightweight" exactly → use semantic
               equivalents: "support only", "metadata only", "context only" trigger same rule.
formalization: The keyword detection (DP-S-01) is the trigger; PSEE.2 must implement
               a normalized string-match for reduced-authority annotations.
source:        R-FLT-02; psee_v0_schema.json intake_state_machine
```

#### CT-03 — Sub-grouping threshold (DP-3-02)

```
condition:     Domain file count > 50 (approximate threshold from R-GRP-02 input_pattern)
deterministic_path: If count > 50 → apply sub-grouping by architectural role
                    If count ≤ 50 → flat domain (no sub-tables)
contingency:   File count is observable; the threshold is fixed at 50. However:
               - Mixed domains (few files but complex architecture) may warrant sub-grouping
                 below 50. This is a CONTINGENT extension: if architectural sub-groups are
                 identifiable (e.g., clearly distinct infra vs. source vs. tests), sub-grouping
                 may be applied even below the threshold.
note for PSEE.2: Implement 50 as the floor threshold; allow sub-grouping below if
               architectural sub-groups are explicitly identifiable in directory structure.
source:        R-GRP-02 input_pattern; PSEE.F1 TA-02 (module pattern is context-bound)
```

#### CT-04 — Repeated pattern detection (DP-3-03)

```
condition:     Multiple directories with identical internal file structure exist within a domain
deterministic_path: If ≥2 directories share the same set of file extensions/roles:
                    Apply R-ABS-02 pattern rows; record count = N instances
                    If all files are unique: enumerate individually
contingency:   Pattern detection requires structural analysis of the directory tree.
               The ≥2 threshold is the lower bound (1 instance = not a pattern).
               Framework-mandated patterns (NestJS, Spring, etc.) are discoverable from
               directory layout without reading file content.
source:        R-ABS-02; PSEE.F1 TA-02 (NestJS is BlueEdge-specific; the pattern detection
               principle is generalizable)
```

#### CT-05 — Platform/integrated domain identification (DP-3-04)

```
condition:     One evidence domain contains sub-directories that are structurally identical
               (by name and layout) to other top-level domains
deterministic_path: If platform domain contains backend/ and frontend/ (or equivalent)
                    that match standalone domain structures → R-GRP-03 (separation + OVL)
                    If no such embedding exists → no platform separation required
contingency:   Identification requires comparing top-level directory names across domains.
               If names match standalones exactly → deterministic R-GRP-03 trigger.
               If names differ but content overlaps → DP-4-02 (diff required; parity = UNKNOWN).
source:        R-GRP-03; R-NRM-02; PSEE.F1 TA-01 (3-archive pattern is BlueEdge-specific)
```

#### CT-06 — Multi-class domain union (DP-3-05)

```
condition:     A domain contains files that belong to more than one evidence class
deterministic_path: Assign evidence_class = union of all classes present in domain
                    (e.g., "code / configuration / structural artifact")
contingency:   Requires enumerating file types in the domain. The union rule is fixed;
               the observable fact (which classes are present) is contingent on corpus content.
source:        R-GRP-01 transformation_logic step 5
```

#### CT-07 — Coverage gate outcome (DP-5-02)

```
condition:     Coverage = (mapped Phase B units) / (total Phase B units) × 100
deterministic_path: If ≥ 90% → proceed; if < 90% → PARTIAL flag
contingency:   Coverage depends on how many Phase B target units are defined. The
               computation is deterministic; the Phase B unit set is engagement-specific.
source:        psee_v0_schema.json coverage_thresholds; psee_v0_execution_spec.md Phase 5
```

---

### Part 3 — FORBIDDEN Patterns (Prohibited Heuristic Drift)

Forbidden patterns are execution behaviors that would introduce interpretation, inference, or heuristic confidence in place of evidence-backed decisions. These are the encoding of TRANSITION A (epistemic mode resolution) from doctrine_genealogy.md.

---

#### FB-01 — Inferring overlap parity from structural similarity alone

```
prohibited:    Declaring file_level_parity = KNOWN based on identical directory names,
               identical file counts, or identical top-level structure, WITHOUT
               an explicit diff or content comparison result
canonical_rule_violated: R-NRM-02 (parity = KNOWN requires actual comparison evidence)
               + R-NRM-03 (unknown-space supremacy)
correct_path:  Declare file_level_parity = UNKNOWN; create US record; proceed
source:        PSEE.0 rule_catalog_v0.md R-NRM-02 theoretical basis;
               transformation_mapping.md NEM-U14 (diff ran but parity still unknown-space)
```

#### FB-02 — Filling unknown-space by inference from system knowledge

```
prohibited:    Resolving a US record by applying knowledge of the subject system
               (e.g., "NestJS modules always follow this pattern, therefore we know...")
               without direct evidence from the corpus
canonical_rule_violated: R-NRM-03; doctrine_genealogy.md TRANSITION A (epistemic mode)
correct_path:  US record stands; downstream consumers are informed of the unknown position
source:        PSEE.0 rule_catalog_v0.md R-NRM-03 theoretical basis;
               PSEE.F1 heuristic_registry.md H-02 DISCARDED
```

#### FB-03 — Applying BlueEdge-specific module counts to new corpora

```
prohibited:    Assuming 63 backend modules, 5-file NestJS pattern, or any other
               BlueEdge-specific quantity as a default or validation target for a new corpus
canonical_rule_violated: PSEE.1 design rule F.3 (no BlueEdge lock-in);
               PSEE.F1 transitional_assumptions.md TA-02 (NestJS pattern is context-bound)
correct_path:  Count and pattern discovery from actual source tree inspection (CT-04)
source:        PSEE.F1 transitional_assumptions.md TA-02; PSEE.1 design rule F.3
```

#### FB-04 — Using capability-domain organization as intake structure

```
prohibited:    Grouping evidence by what the system does (functional capability domains)
               rather than by evidence provenance (source directory / repository origin)
canonical_rule_violated: R-GRP-01 (group by top-level source domain);
               doctrine_genealogy.md TRANSITION B (organizational anchor shift)
correct_path:  R-GRP-01 (source-domain grouping is the canonical primary organizer)
source:        PSEE.F1 heuristic_registry.md H-03 DISCARDED;
               contradiction_matrix.md CONTRA-03 resolution
```

#### FB-05 — Iterative narrative assessment output

```
prohibited:    Producing narrative "preliminary assessment" artifacts as part of
               PSEE execution output — interpretive analysis not grounded in direct
               evidence observation
canonical_rule_violated: R-NRM-03; PSEE.0 CLAUDE.md §3.4 (no interpretation);
               doctrine_genealogy.md TRANSITION A
correct_path:  No assessment artifacts; structural enumeration only
source:        PSEE.F1 heuristic_registry.md H-02 DISCARDED;
               contradiction_matrix.md CONTRA-05 resolution
```

#### FB-06 — Claiming EQUIVALENT reconstruction without artifact-by-artifact comparison

```
prohibited:    Recording structural_match = EQUIVALENT without performing the
               element-by-element comparison defined in Phase 6
canonical_rule_violated: psee_v0_execution_spec.md Phase 6 (compare each produced element
               against corresponding Phase B unit)
correct_path:  Produce comparison table per artifact; EQUIVALENT requires all units matched
source:        PSEE.0 reconstruction_validation_report.md methodology
```

#### FB-07 — Using prior PSEE run output as Phase A input for a new run

```
prohibited:    Feeding PSEE.0 output artifacts (e.g., normalized_evidence_map.md from
               a prior run) as Phase A evidence for a subsequent PSEE execution
canonical_rule_violated: IG.1B_INPUT_BOUNDARY.md §3.1 (generated artifacts not inputs);
               R-FLT-03 principle (prior analytical outputs are excluded)
correct_path:  Phase A must be raw source evidence only
source:        IG.1B_INPUT_BOUNDARY.md; PSEE.0 psee_v0_execution_spec.md Phase 0 prerequisites
```

---

### Determinism Boundary Summary

| Category | Count | Key principle |
|---|---|---|
| FIXED decisions | 10 (FX-01..10) | Fully deterministic; same input → same output; no operator judgment |
| CONTINGENT decisions | 7 (CT-01..07) | Deterministic within observable corpus condition; requires evidence-gathering step |
| FORBIDDEN patterns | 7 (FB-01..07) | Prohibited behaviors; canonical rule violations; always → STOP or ESCALATE |

**Total decision space categorized: 24 elements**

---

#### EVIDENCE LAYER

| Boundary element | Source |
|---|---|
| FX-01..10 | psee_v0_execution_spec.md rule-specific transformation_logic fields; psee_v0_schema.json |
| CT-01..07 | rule_catalog_v0.md input_pattern + transformation_logic; PSEE.F1 transitional_assumptions.md |
| FB-01..07 | rule_catalog_v0.md theoretical basis; doctrine_genealogy.md TRANSITION A/B/C; PSEE.F1 heuristic_registry.md |

---

#### LIMITATIONS & BOUNDARIES

- The 10 FIXED decisions are unconditionally deterministic given the defined inputs. If inputs are missing or corrupt, the decision path leads to STOP (DP-0-xx) rather than heuristic substitution.
- CT-03's 50-file threshold is explicit in R-GRP-02 input_pattern but is a heuristic threshold, not a schema-enforced rule. PSEE.2 may adjust this threshold for specific corpus types, but must document the adjustment as a contingent parameter, not a canonical rule change.
- FB-03 (BlueEdge module counts) is the most critical forbidden pattern for generalization. Any implementation that hard-codes 63, 10, or 14 as expected sub-unit counts for a new corpus violates this boundary.

---

#### STATUS

| Check | Result |
|---|---|
| FIXED decisions enumerated | 10 |
| CONTINGENT decisions enumerated | 7 |
| FORBIDDEN patterns enumerated | 7 |
| All evidence-backed | CONFIRMED |
| No canonical mutation | CONFIRMED |

**DETERMINISM BOUNDARY: COMPLETE — 24 elements classified**
