# PSEE.1 — Decision Points Catalog

**Stream:** PSEE.1
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document catalogs every decision point in the PSEE.0 execution model — both explicit (stated in psee_v0_execution_spec.md and rule_catalog_v0.md) and implicit (embedded in grounded applications as unstated branch logic). Each decision point is classified by type and given a stable identifier for use in the decision state model, determinism boundary, and decision contract.

**Value:** Decision points that are not named cannot be enforced, tested, or gated. This catalog is the prerequisite for all other PSEE.1 formalization work.

---

#### METHODOLOGY LAYER

1. Read psee_v0_execution_spec.md phases 0–6 and extract every stated decision point or stop condition.
2. Read rule_catalog_v0.md transformation_logic fields and extract every conditional branch embedded in grounded applications.
3. Read psee_v0_schema.json transition rules and extract state transition conditions.
4. Assign each decision point a stable ID: DP-<phase>-<sequence>.
5. Classify: PREREQUISITE | BRANCH | STOP | FALLBACK | CLASSIFICATION | ESCALATION.

Decision type definitions:
- **PREREQUISITE**: a condition that must be true before execution of a phase or rule proceeds
- **BRANCH**: a fork where two or more execution paths are possible
- **STOP**: a terminal failure condition that halts execution of the stream
- **FALLBACK**: a defined degraded-mode behavior when the primary path is unavailable
- **CLASSIFICATION**: a categorical assignment decision (assign one label from a defined set)
- **ESCALATION**: a deferral to external resolution (operator or downstream stream)

---

#### TECHNICAL LAYER

---

### Phase 0 — Prerequisites and Source Binding

#### DP-0-01
```
type:          PREREQUISITE / STOP
trigger:       Phase 0 entry
condition:     Source corpus root accessible
true-path:     Continue to P0-02
false-path:    STOP → SOURCE_RESOLUTION_FAIL
source:        psee_v0_execution_spec.md Phase 0 check P0-01
hidden:        NO (explicit)
```

#### DP-0-02
```
type:          PREREQUISITE / STOP / FALLBACK
trigger:       P0-01 PASS
condition:     Evidence boundary document (or equivalent) present
true-path:     Continue to P0-03
false-path:    STOP → SOURCE_RESOLUTION_FAIL
              Fallback note: psee_v0_execution_spec.md reusability statement declares
              "if it does not exist, create it before beginning Phase 2" —
              this converts STOP into a pre-execution creation task (operator action required)
source:        psee_v0_execution_spec.md Phase 0 check P0-02 + reusability statement §5
hidden:        FALLBACK path is implicit in reusability statement, not in Phase 0 check itself
```

#### DP-0-03
```
type:          PREREQUISITE / STOP
trigger:       P0-02 PASS
condition:     All required Phase B target artifacts present
true-path:     Continue to P0-04
false-path:    STOP → SOURCE_RESOLUTION_FAIL
source:        psee_v0_execution_spec.md Phase 0 check P0-03
hidden:        NO (explicit)
note:          "Phase B target artifacts" is engagement-specific — the operator must declare
               the target artifact set; PSEE.0 instantiation used 40.2 (4 artifacts)
```

#### DP-0-04
```
type:          PREREQUISITE / STOP
trigger:       P0-03 PASS
condition:     System identity confirmed (version match Phase A ↔ Phase B)
true-path:     Continue to Phase 1
false-path:    STOP → SOURCE_RESOLUTION_FAIL
source:        psee_v0_execution_spec.md Phase 0 check P0-04
hidden:        NO (explicit)
```

---

### Phase 1 — Source Normalization (R-NRM-01)

#### DP-1-01
```
type:          BRANCH
trigger:       Phase 1 entry; scan each path segment
condition:     Does the same directory name appear in immediate succession in any path?
true-path:     Duplication detected → DP-1-02
false-path:    No duplication → continue to Phase 2 with no normalization record
source:        psee_v0_execution_spec.md Phase 1, step 1; R-NRM-01 transformation_logic step 1
hidden:        NO (explicit)
```

#### DP-1-02
```
type:          CLASSIFICATION
trigger:       Duplication detected (DP-1-01 true)
condition:     Classify duplication as one of:
               EXTRACTION_ARTIFACT | PACKAGING_BOUNDARY | ARCHITECTURAL_STRUCTURE | UNCLASSIFIABLE
true-paths:
  PACKAGING_BOUNDARY → DP-1-03 (collapse)
  ARCHITECTURAL_STRUCTURE → DP-1-04 (preserve)
  EXTRACTION_ARTIFACT → DP-1-03 (collapse)
  UNCLASSIFIABLE → DP-1-05 (halt dependent processing)
source:        psee_v0_execution_spec.md Phase 1, step 3; source_normalization_log.md methodology
classification_inputs:
  - extraction log (if available): confirms archive root folder name
  - diff evidence (if available): confirms canonical path
  - manual inspection otherwise
hidden:        The EXTRACTION_ARTIFACT class is defined in the schema but the execution spec
               focuses on PACKAGING_BOUNDARY. Both collapse → same path.
```

#### DP-1-03
```
type:          BRANCH (implicit)
trigger:       PACKAGING_BOUNDARY or EXTRACTION_ARTIFACT classification
action:        Declare inner path as canonical; do not treat outer as architectural layer
output:        PathNormalizationRecord with collapsed = true
source:        psee_v0_execution_spec.md Phase 1, step 4; R-NRM-01 transformation_logic step 4
hidden:        NO (explicit)
```

#### DP-1-04
```
type:          ESCALATION
trigger:       ARCHITECTURAL_STRUCTURE classification
action:        Preserve both paths; document the architectural layering; do NOT collapse
output:        PathNormalizationRecord with collapsed = false + architectural note
source:        psee_v0_execution_spec.md Phase 1 decision point §1
hidden:        NO (explicit) — but downstream impact is implicit:
               both paths create separate domains in Phase 3
```

#### DP-1-05
```
type:          STOP / ESCALATION
trigger:       UNCLASSIFIABLE duplication
action:        Halt all downstream processing that uses this path; flag for operator resolution
output:        UNKNOWN classification in PathNormalizationRecord; processing suspended for affected path
source:        psee_v0_execution_spec.md Phase 1 decision point §2
hidden:        NO (explicit)
```

---

### Phase 2 — Filtering (R-FLT-01/02/03)

#### DP-2-01
```
type:          PREREQUISITE / ESCALATION
trigger:       Phase 2 entry (Step 2.3)
condition:     explicitly_excluded_paths list present in evidence boundary document
true-path:     Apply R-FLT-03 (proceed)
false-path:    GRAY-ZONE flag → ESCALATION: require explicit scope statement before proceeding
source:        psee_v0_execution_spec.md Phase 2, decision point §3
hidden:        NO (explicit)
```

#### DP-2-02
```
type:          CLASSIFICATION
trigger:       For each file in corpus
condition:     Is file path in provenance_only_paths?
true-path:     intake_status = NOT INGESTED (R-FLT-01); no content inspection
false-path:    Continue to DP-2-03
source:        psee_v0_execution_spec.md Phase 2, Step 2.1; R-FLT-01
hidden:        NO (explicit)
```

#### DP-2-03
```
type:          CLASSIFICATION
trigger:       DP-2-02 false (not provenance-only)
condition:     Is file identified as extraction-generated (not from source codebase)?
detection:     Check source_materials field in evidence boundary for "lightweight" annotation;
               OR file is in analysis/ directory pattern
true-path:     intake_status = ACCEPTED-SUPPORT-ONLY; add restriction annotation (R-FLT-02)
false-path:    Continue to DP-2-04
source:        psee_v0_execution_spec.md Phase 2, Step 2.2; R-FLT-02 transformation_logic
hidden:        "Lightweight" heuristic — the word "lightweight" in source_materials is the
               detection signal. This is an implicit keyword detection that is not formalized
               in schema as a required field value.
```

#### DP-2-04
```
type:          CLASSIFICATION
trigger:       DP-2-03 false (not extraction-generated)
condition:     Is file path in explicitly_excluded_paths?
true-path:     intake_status = EXCLUDED; NOT ACCESSED; record compliance (R-FLT-03)
false-path:    intake_status = ACCEPTED (passes all filters)
source:        psee_v0_execution_spec.md Phase 2, Step 2.3; R-FLT-03
hidden:        NO (explicit)
```

---

### Phase 3 — Grouping (R-GRP-01/02/03)

#### DP-3-01
```
type:          PREREQUISITE / ESCALATION
trigger:       Phase 3 completion gate
condition:     All paths in primary_evidence_origin_paths map to exactly one domain
true-path:     Domains complete; continue to Phase 4
false-path:    Unclaimed path detected → ESCALATION: flag as unclaimed; investigate before continuing
source:        psee_v0_execution_spec.md Phase 3, completion gate
hidden:        NO (explicit)
note:          "No domain may contain paths from multiple provenance origins" — anti-merge constraint
```

#### DP-3-02
```
type:          BRANCH (implicit)
trigger:       R-GRP-01 domain population; per-domain file count
condition:     Does domain file count exceed 50?
true-path:     Apply R-GRP-02 sub-grouping
false-path:    No sub-grouping required; domain is flat
source:        R-GRP-02 transformation_logic step 1 ("large source directory, e.g., backend/src/")
hidden:        YES — the 50-file threshold is not stated explicitly; it is implied by "large source
               directory (>50 files)" in R-GRP-02 input_pattern. This is an implicit branch boundary.
```

#### DP-3-03
```
type:          BRANCH (implicit)
trigger:       R-GRP-02 sub-grouping; per-sub-table file pattern detection
condition:     Do many files within a sub-table share the same structural pattern
               (e.g., N modules each containing the same set of file roles)?
true-path:     Apply R-ABS-02 pattern rows (one row per role, count = N instances)
false-path:    Enumerate files individually
source:        R-GRP-02 transformation_logic step 3 ("For repeated structural patterns...")
hidden:        YES — the condition is embedded in transformation_logic, not in a named decision point.
               The threshold for "many" is unstated; context from R-ABS-02 suggests ≥2 instances.
```

#### DP-3-04
```
type:          BRANCH
trigger:       R-GRP-03; platform/integrated domain identified
condition:     Does the platform domain contain components that are also present as standalone archives?
true-path:     Separate platform-unique from embedded (R-GRP-03); reference embedded via OVL
false-path:    Enumerate platform contents without separation
source:        psee_v0_execution_spec.md Phase 3, Step 3.3; R-GRP-03 transformation_logic
hidden:        NO (explicit) — but the condition "platform/integrated repository domain" requires
               recognizing integration context, which is an implicit classification step
```

#### DP-3-05
```
type:          CLASSIFICATION (implicit)
trigger:       R-GRP-01 domain file enumeration
condition:     Files in a domain span multiple evidence classes
true-path:     Record union of classes (e.g., "code / configuration / structural artifact")
false-path:    Record single class
source:        R-GRP-01 transformation_logic step 5
hidden:        YES — the union rule for multi-class domains is embedded in transformation_logic
               step 5, not surfaced as a named decision point.
```

---

### Phase 4 — Abstraction and CEU Formation (R-ABS-01/02, R-NRM-02/03)

#### DP-4-01
```
type:          BRANCH (implicit)
trigger:       R-ABS-01 CEU formation; CEU sub-unit threshold
condition:     Does the source tree have ≥3 architectural sub-groups (sub-tables from Phase 3)?
true-path:     Create CEUSubUnit records (R-ABS-02 pattern)
false-path:    CEU has no sub-units; flat CEU record
source:        psee_v0_execution_spec.md Phase 4, Step 4.1: "large source trees (≥3 architectural sub-groups)"
hidden:        PARTIALLY — the ≥3 threshold is explicit but only in the execution spec,
               not in the rule catalog itself.
```

#### DP-4-02
```
type:          BRANCH
trigger:       R-NRM-02; per-CEU-pair structural similarity check
condition:     Was a diff performed between two structurally similar CEUs in Phase A?
true-path (diff available, identical):    OVL record; file_level_parity = KNOWN; resolution_status = RESOLVED
true-path (diff available, different):   OVL record; file_level_parity = KNOWN; resolution_status = UNRESOLVED
false-path (no diff, structural only):   OVL record; file_level_parity = UNKNOWN; resolution_status = UNRESOLVED → DP-4-03
source:        psee_v0_execution_spec.md Phase 4, Step 4.2; R-NRM-02 transformation_logic steps 2–3
hidden:        NO (explicit)
```

#### DP-4-03
```
type:          CLASSIFICATION → ESCALATION (R-NRM-03)
trigger:       DP-4-02 false-path (UNKNOWN parity) OR any other position where
               information is absent but could theoretically be inferred
condition:     Is there an unresolved unknown position in the intake?
true-path:     Create UnknownSpace record (US-NN); do NOT synthesize resolution
false-path:    No unknown-space (position is resolved)
source:        psee_v0_execution_spec.md Phase 4, Step 4.3; R-NRM-03
hidden:        NO (explicit) — R-NRM-03 is the explicit prohibition; the trigger is broad
               (any position where inference would be required)
```

---

### Phase 5 — Classification and Validation (R-ABS-02, R-NAM-01/02)

#### DP-5-01
```
type:          CLASSIFICATION (implicit)
trigger:       ECM file type assignment; file extension not in explicit_inclusions list
condition:     Is file type listed in explicit_inclusions?
true-path:     Assign class from explicit_inclusions entry
false-path:    Assess against accepted_evidence_classes by content role (not file extension)
source:        psee_v0_execution_spec.md Phase 5, Step 5.2; transformation_mapping.md IVL-U05
hidden:        YES — the "content role" assessment method is implicit; no schema defines how
               to classify an unlisted file type. This is a CLASSIFICATION decision that
               requires operator judgment unless the content role is unambiguous.
```

#### DP-5-02
```
type:          FALLBACK (coverage gate)
trigger:       Phase 5 coverage computation
condition:     (mapped Phase B units) / (total Phase B units) × 100 ≥ 90%
true-path:     FULL or PARTIAL coverage → proceed to Phase 6
false-path:    Coverage < 90% → PARTIAL flag; identify unmapped units; continue (FALLBACK MODE)
source:        psee_v0_execution_spec.md Phase 5, coverage gate; psee_v0_schema.json
               coverage_thresholds minimum_mapping_coverage_percent = 90
hidden:        NO (explicit)
note:          FALLBACK MODE is "PROCEED per contract" — this is a soft stop, not a hard STOP.
               Unmapped units must be flagged and documented.
```

---

### Phase 6 — Reconstruction Simulation

#### DP-6-01
```
type:          BRANCH / STOP
trigger:       Phase 6 comparison per artifact
condition:     For each Phase B artifact: structural_match = EQUIVALENT | PARTIAL | DIVERGENT
EQUIVALENT-path:   Record; continue
PARTIAL-path:      Record; continue with note
DIVERGENT-path:    STOP → investigate unmapped units; refine rules; re-run before closing stream
source:        psee_v0_execution_spec.md Phase 6, stop condition
hidden:        NO (explicit)
note:          The re-run instruction implies an iterative loop at Phase 6. The maximum
               number of iterations is not specified — this is an implicit open loop.
```

---

### Decision Points Derived from Schema Transitions

#### DP-S-01 (Schema-derived)
```
type:          CLASSIFICATION
trigger:       Any file with source_materials annotation "lightweight" in evidence boundary
condition:     intake_status transition ACCEPTED → ACCEPTED-SUPPORT-ONLY
trigger_field: evidence_boundary.source_materials value
source:        psee_v0_schema.json intake_state_machine transitions
hidden:        YES — the "lightweight" keyword in source_materials is the trigger; this
               is a string-matching condition not formalized as an enum value in the schema.
```

#### DP-S-02 (Schema-derived)
```
type:          PREREQUISITE
trigger:       Any ClassificationRecord assignment
condition:     priority value must be one of: PRIMARY | SUPPORT ONLY | OVERLAP-NOTED | NOT INGESTED
source:        psee_v0_schema.json ClassificationRecord.priority enum
hidden:        NO (explicit in schema)
note:          OVERLAP-NOTED is the correct priority for platform-embedded components that
               reference a standalone CEU. This prevents re-classification of content that
               is already covered by another CEU.
```

---

### Decision Points Catalog Summary

| DP ID | Phase | Type | Hidden | Rule/Source |
|---|---|---|---|---|
| DP-0-01 | 0 | PREREQUISITE / STOP | NO | P0-01 |
| DP-0-02 | 0 | PREREQUISITE / STOP / FALLBACK | FALLBACK hidden | P0-02 |
| DP-0-03 | 0 | PREREQUISITE / STOP | NO | P0-03 |
| DP-0-04 | 0 | PREREQUISITE / STOP | NO | P0-04 |
| DP-1-01 | 1 | BRANCH | NO | R-NRM-01 |
| DP-1-02 | 1 | CLASSIFICATION | NO | R-NRM-01 |
| DP-1-03 | 1 | BRANCH | NO | R-NRM-01 |
| DP-1-04 | 1 | ESCALATION | NO | R-NRM-01 |
| DP-1-05 | 1 | STOP / ESCALATION | NO | R-NRM-01 |
| DP-2-01 | 2 | PREREQUISITE / ESCALATION | NO | R-FLT-03 |
| DP-2-02 | 2 | CLASSIFICATION | NO | R-FLT-01 |
| DP-2-03 | 2 | CLASSIFICATION | YES (keyword) | R-FLT-02 |
| DP-2-04 | 2 | CLASSIFICATION | NO | R-FLT-03 |
| DP-3-01 | 3 | PREREQUISITE / ESCALATION | NO | R-GRP-01 gate |
| DP-3-02 | 3 | BRANCH | YES (50-file threshold) | R-GRP-02 |
| DP-3-03 | 3 | BRANCH | YES (pattern threshold) | R-ABS-02 |
| DP-3-04 | 3 | BRANCH | NO | R-GRP-03 |
| DP-3-05 | 3 | CLASSIFICATION | YES (union rule) | R-GRP-01 |
| DP-4-01 | 4 | BRANCH | PARTIALLY | R-ABS-01 |
| DP-4-02 | 4 | BRANCH | NO | R-NRM-02 |
| DP-4-03 | 4 | CLASSIFICATION / ESCALATION | NO | R-NRM-03 |
| DP-5-01 | 5 | CLASSIFICATION | YES (role assessment) | IVL-U05 |
| DP-5-02 | 5 | FALLBACK | NO | Coverage gate |
| DP-6-01 | 6 | BRANCH / STOP | NO | Phase 6 |
| DP-S-01 | Schema | CLASSIFICATION | YES (keyword match) | intake_state_machine |
| DP-S-02 | Schema | PREREQUISITE | NO | ClassificationRecord.priority |

**Total decision points: 26**
**Hidden or partially hidden: 7 (DP-0-02 fallback, DP-2-03, DP-3-02, DP-3-03, DP-3-05, DP-5-01, DP-S-01)**

---

#### EVIDENCE LAYER

| Decision point | Source citation |
|---|---|
| DP-0-01 through DP-0-04 | psee_v0_execution_spec.md Phase 0 checks P0-01 through P0-04 |
| DP-1-01 through DP-1-05 | psee_v0_execution_spec.md Phase 1 steps 1–5 + decision points |
| DP-2-01 through DP-2-04 | psee_v0_execution_spec.md Phase 2 steps 2.1–2.3 + decision point §3 |
| DP-3-01 through DP-3-05 | psee_v0_execution_spec.md Phase 3 steps 3.1–3.3 + completion gate |
| DP-4-01 through DP-4-03 | psee_v0_execution_spec.md Phase 4 steps 4.1–4.3 |
| DP-5-01, DP-5-02 | psee_v0_execution_spec.md Phase 5 steps 5.1–5.2 + coverage gate |
| DP-6-01 | psee_v0_execution_spec.md Phase 6 stop condition |
| DP-S-01, DP-S-02 | psee_v0_schema.json intake_state_machine, ClassificationRecord |

---

#### LIMITATIONS & BOUNDARIES

- Seven decision points are classified as hidden or partially hidden. These are not defects in PSEE.0 — they are correct behaviors embedded in transformation logic or grounded examples. PSEE.1 names them explicitly so PSEE.2 can implement them as formal gates rather than inline logic.
- DP-6-01 (re-run loop) has no iteration limit in PSEE.0. PSEE.1 formalizes this as an ESCALATION after N re-runs in escalation_and_fallback_spec.md.
- DP-5-01 (unlisted file type assessment by content role) is the highest-risk hidden decision. It requires operator judgment; PSEE.1 surfaces this as an ESCALATION condition.

---

#### STATUS

| Check | Result |
|---|---|
| Decision points extracted | 26 (DP-0-01 through DP-S-02) |
| Hidden/implicit identified | 7 |
| All evidence-backed | CONFIRMED |
| No canonical mutation | CONFIRMED |

**DECISION POINTS CATALOG: COMPLETE — 26 decision points, 7 hidden**
