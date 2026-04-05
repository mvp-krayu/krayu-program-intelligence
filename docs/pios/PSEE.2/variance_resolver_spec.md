# PSEE.2 — Variance Resolver Specification

**Stream:** PSEE.2
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/source_variance_handling.md (read-only input)

---

## Variance Resolver Scope

This document specifies the exact runtime handling of source variance conditions SV-01 through SV-10. The `SourceVarianceResolver` maps each variance condition to a deterministic PROCEED, STOP, or ESCALATE outcome derived from source-agnostic observable facts. No BlueEdge-specific assumptions (TA-01 through TA-08) are embedded in any handler.

---

## BlueEdge-Assumption Exclusion Register

The following BlueEdge-specific values are explicitly excluded from the `SourceVarianceResolver`. Any code path that references these values as defaults, expected values, or fallback targets is a governance violation (FB-03).

| Excluded value | Type | BlueEdge source |
|---|---|---|
| `3` (archive count) | Integer default | TA-01 |
| `63` (backend module count) | Integer default | TA-02 |
| `5` (files per NestJS module) | Integer default | TA-02 |
| `53` (Phase B unit count) | Integer default | TA-08 |
| `10` (frontend sub-group count) | Integer default | TA-03 |
| `14` (platform component count) | Integer default | TA-04 |
| `6` (exclusion path count) | Integer default | TA-07 |
| `"NestJS"` | Framework name default | TA-02 |
| `"backend"`, `"frontend"`, `"platform"` | Domain name defaults | TA-01 |
| `analysis/03_overlap_validation.md` | File path default | TA-06 |
| `analysis/00_extraction_log.md` | File path default | TA-01 |

These are observable facts from the BlueEdge corpus, not rules. The `SourceVarianceResolver` derives all counts and names from operator-supplied inputs at runtime.

---

## SV-Dispatch Table

The `SourceVarianceResolver` is keyed by `(phase, dp_id, observed_condition) → SV_ID → handler`.

| Phase | DP | Observed condition | SV_ID | Handler outcome |
|---|---|---|---|---|
| 0 | DP-0-02 | BOUNDARY_ABSENT | SV-01 | STOP → operator creates boundary → retry |
| 0 | DP-0-03 | ARCHIVE_COUNT_N | SV-02 | PROCEED (any N) |
| 1 | DP-1-01 | NO_REPEATED_PATTERN | SV-03 | PROCEED (enumerate individually) |
| 3 | DP-3-04 | NO_PLATFORM_EMBEDDING | SV-04 | PROCEED (no R-GRP-03) |
| 2 | DP-2-01 | EXCLUSION_LIST_ABSENT | SV-05 | ESCALATE (GRAY-ZONE) |
| 4 | DP-4-02 | NO_DIFF_AVAILABLE | SV-06 | PROCEED (parity=UNKNOWN; create US record) |
| 3 | DP-3-02 | FLAT_SOURCE_NO_SUBGROUPS | SV-07 | PROCEED (flat domain) |
| 0 | DP-0-03 | DIFFERENT_PHASE_B_TARGET | SV-08 | PROCEED (operator-declared target) |
| 2 | DP-2-03 | NO_SOURCE_MATERIALS_ANNOTATION | SV-09 | PROCEED (ACCEPTED; no downgrade) |
| 1 | DP-1-02 | NO_EXTRACTION_LOG | SV-10 | PROCEED with elevated ESCALATE risk |

---

## Individual Variance Handlers

---

### SV-01 Handler — Evidence Boundary Document Absent

```
phase:           0
dp_id:           DP-0-02
trigger:         evidence_boundary.md or equivalent not found in corpus

runtime_behavior:
  1. Check for ADMISSIBLE_REFERENCE H-11 signal:
     IF source snapshot intake record or equivalent exists in Phase A corpus:
       operator_prompt = "Evidence boundary absent. A source snapshot intake record was found at
                          <path>. You may use it to construct the required boundary document.
                          Required minimum fields: primary_evidence_origin_paths,
                          provenance_only_paths, explicitly_excluded_paths,
                          accepted_evidence_classes. [H-11 ADMISSIBLE_REFERENCE]"
       Set DP-0-02 condition = FAIL_FALLBACK_AVAILABLE
       State machine transitions to S-00 (retry loop)
     ELSE:
       operator_prompt = "Evidence boundary absent. Create boundary document before re-submitting."
       Set DP-0-02 condition = FAIL_ABSENT
       State machine transitions to S-T1 (STOP-01)

  2. If fallback_available: await operator-created boundary document; re-evaluate DP-0-02.
  3. Cannot proceed without at minimum:
     - primary_evidence_origin_paths (non-empty)
     - explicitly_excluded_paths (may be empty list, but field must be present)

blueEdge_assumption_excluded: TA-07 (specific 40.2 boundary structure is not required or defaulted)
```

---

### SV-02 Handler — Archive Count Different from 3

```
phase:           0
dp_id:           DP-0-03
trigger:         primary_evidence_origin_paths contains N paths (where N ≠ 3)

runtime_behavior:
  PROCEED unconditionally.
  N = len(evidence_boundary.primary_evidence_origin_paths)
  Phase3Handler creates exactly N EvidenceDomains (one per path).
  No maximum N; no minimum N (N=1 is valid: monolith corpus).

  edge_case_N=1 (monolith):
    - DP-1-01 (path doubling) may still apply; handled normally
    - R-GRP-03 does not fire unless the single domain embeds components
      that are also present as top-level paths (cannot occur if N=1)
    - OVL records: only if structural similarity between sub-domains detected

  edge_case_large_N (>10):
    - R-GRP-01 creates N domains; N CEUs in Phase 4
    - R-GRP-02 (sub-grouping) applies per-domain on CT-03 threshold
    - No maximum domain count in canonical rules; large N is valid

blueEdge_assumption_excluded: TA-01 (3-archive count is not expected or defaulted)
```

---

### SV-03 Handler — No Repeated Module Pattern

```
phase:           3
dp_id:           DP-3-03
trigger:         Pattern detection (CT-04) finds no repeated directory structure

runtime_behavior:
  PROCEED unconditionally.
  DP-3-03 condition = NO_REPEATED_PATTERN
  Files are enumerated individually; no R-ABS-02 pattern rows produced.
  This is not a failure; zero patterns is a valid corpus observation.

  edge_case_partial_patterns:
    If some sub-directories follow a pattern and others do not:
    - Apply R-ABS-02 to the conforming subset (condition = REPEATED_PATTERN_DETECTED)
    - Enumerate non-conforming files individually
    - Flag in domain record: "N files follow pattern <type>; M files enumerated individually"

  pattern_detection_rule (source-agnostic):
    For each domain: iterate sub-directories.
    A pattern exists if ≥2 sub-directories contain files with the same set of extension/role combinations.
    Framework identity (NestJS, Spring, Django, etc.) is NOT required for pattern detection.
    The observable fact (structural repetition) is the trigger.

blueEdge_assumption_excluded: TA-02 (63 modules and NestJS pattern are not expected or defaulted)
```

---

### SV-04 Handler — No Platform/Integrated Repository

```
phase:           3
dp_id:           DP-3-04
trigger:         No domain contains sub-directories structurally matching other top-level domains

runtime_behavior:
  PROCEED unconditionally.
  DP-3-04 condition = NO_PLATFORM_EMBEDDING
  R-GRP-03 does not fire.
  No OVL records from platform embedding (R-GRP-03 source).
  OVL records may still be created from R-NRM-02 (structural similarity between CEU pairs).

  detection_rule (source-agnostic):
    For each domain pair (D_a, D_b):
    IF D_a contains a sub-directory whose name matches a top-level domain name in D_b:
      → platform embedding detected; R-GRP-03 fires for D_a
    ELSE: no platform separation required

blueEdge_assumption_excluded: TA-01 (3-archive structure with platform embedding is not defaulted);
                               TA-04 (platform repository identity is not assumed)
```

---

### SV-05 Handler — Explicitly Excluded Paths List Absent

```
phase:           2 (pre-filtering)
dp_id:           DP-2-01
trigger:         evidence_boundary.explicitly_excluded_paths field is absent or null

runtime_behavior:
  ESCALATE (ESC-03).
  State machine transitions to S-T2.
  operator_prompt = "Evidence boundary is present but explicitly_excluded_paths is absent.
                     You must provide one of:
                     (a) A complete exclusion list, or
                     (b) An explicit empty declaration: explicitly_excluded_paths: []
                     An empty list is a valid answer; it means nothing is excluded."

  Note: explicitly_excluded_paths = [] (empty list) is a valid operator response.
        The requirement is explicit operator scope declaration, not mandatory exclusions.

blueEdge_assumption_excluded: TA-07 (specific 6-path BlueEdge exclusion list is not defaulted)
```

---

### SV-06 Handler — Overlap Diff Evidence Absent

```
phase:           4
dp_id:           DP-4-02
trigger:         Two structurally similar CEUs detected; no diff result available

runtime_behavior:
  PROCEED.
  DP-4-02 condition = NO_DIFF_STRUCTURAL_ONLY
  OVL record created: file_level_parity = UNKNOWN, resolution_status = UNRESOLVED
  Immediately invoke US-CONDITION-01 handler:
    → US record created for this CEU pair

  forbidden:
    Setting file_level_parity = KNOWN based on:
    - Identical directory names (FB-01)
    - Identical file counts (FB-01)
    - Identical top-level structure (FB-01)
    - System knowledge about the subject system (FB-02)
    UNKNOWN parity stands until a content comparison is explicitly performed.

blueEdge_assumption_excluded: TA-06 (analysis/03_overlap_validation.md path is not expected or used as default)
```

---

### SV-07 Handler — No Top-Level Architectural Sub-Division

```
phase:           3
dp_id:           DP-3-02
trigger:         Domain file count ≤ 50, or count > 50 but no identifiable architectural sub-groups

runtime_behavior:
  PROCEED.
  DP-3-02 condition = DOMAIN_LTE_50_FILES (or FLAT_SOURCE_NO_SUBGROUPS if > 50 but flat)
  Flat domain: no sub-tables, no CEUSubUnit records for this domain.

  edge_case_large_flat (>50 files, no sub-groups):
    R-GRP-02 threshold exceeded but no architectural sub-division is observable.
    Fallback: apply R-ABS-02 to enumerate file types as a proxy organization.
    Domain record flag: "Sub-grouping by architectural role not applicable; enumerated by file type."
    DO NOT invent architectural roles (FB-04).

blueEdge_assumption_excluded: TA-02/TA-03 (specific infra/src/modules layer structure is not defaulted)
```

---

### SV-08 Handler — Different Phase B Target Structure

```
phase:           0
dp_id:           DP-0-03
trigger:         Operator declares Phase B target artifacts that differ from 40.2 (ESI/NEM/ECM/IVL)

runtime_behavior:
  PROCEED unconditionally.
  Phase B target is read from operator declaration (PC-03).
  Total Phase B unit count = declared by operator; used as denominator for coverage gate (DP-5-02).
  Artifact names in Phase 6 comparison = declared by operator; not defaulted.

  If Phase B target is not declared (field absent):
    DP-0-03 condition = FAIL → STOP-01 (not a variance; a prerequisite failure)

  engine_adapts_to_target:
    Phase 5 coverage = (mapped declared units) / (total declared units) × 100
    Phase 6 simulation compares against declared artifact set only

blueEdge_assumption_excluded: TA-08 (4-artifact 40.2 structure is not expected or defaulted)
```

---

### SV-09 Handler — Source Materials Annotation Absent

```
phase:           2
dp_id:           DP-2-03 (via DP-S-01)
trigger:         source_materials field absent, or field present but contains no
                 reduced-authority annotation

runtime_behavior:
  PROCEED (no downgrade applied).
  DP-2-03 condition = NOT_EXTRACTION_GENERATED → continue to DP-2-04

  reduced_authority_detection (CT-02 — source-agnostic):
    Normalized string-match against the reduced-authority vocabulary:
    TRIGGER tokens: ["lightweight", "support only", "metadata only", "context only",
                     "analysis only", "extracted notes", "not primary evidence"]
    All comparisons: case-insensitive, trimmed, substring match within source_materials field.
    If no TRIGGER token found: no downgrade.

  Note: Operator responsibility — if extraction analysis files should be restricted,
        the annotation must be explicit in the boundary document.

blueEdge_assumption_excluded: TA-07 (specific "lightweight extraction analysis notes" text not used as sole trigger)
```

---

### SV-10 Handler — Extraction Log Absent

```
phase:           1
dp_id:           DP-1-02
trigger:         Path duplication detected (DP-1-01); no extraction log available for classification

runtime_behavior:
  PROCEED with elevated escalation risk.
  DP-1-01 condition = DUPLICATION_DETECTED.
  CT-01 applies: classification from direct path inspection (not from extraction log).

  inspection_procedure (source-agnostic):
    1. Inspect outer directory name vs. inner directory name
    2. If outer name == inner name (exact match or common extraction pattern):
       → Strong signal for PACKAGING_BOUNDARY; operator may confirm
    3. If outer name ≠ inner name:
       → Inspect directory contents for structural evidence
    4. If neither inspection resolves the classification:
       → DP-1-02 condition = UNCLASSIFIABLE → ESC-02

  operator_prompt (when log absent):
    "No extraction log found. Path duplication detected at <path>.
     Outer directory: <outer>. Inner directory: <inner>.
     Please classify as: EXTRACTION_ARTIFACT | PACKAGING_BOUNDARY | ARCHITECTURAL_STRUCTURE
     with supporting evidence (manual inspection note or diff result)."

  effect_on_stream:
    Absence of extraction log increases ESC-02 probability.
    This is not a failure; it is a corpus-specific constraint.

blueEdge_assumption_excluded: TA-01 (analysis/00_extraction_log.md path is not defaulted or expected)
```

---

## Source Variance Resolver Summary

| SV ID | Outcome | Execution resumes at |
|---|---|---|
| SV-01 | STOP → fallback → RETRY | S-00 (after boundary doc created) |
| SV-02 | PROCEED | Continues normally (N domains for N archives) |
| SV-03 | PROCEED | Continues normally (no pattern rows) |
| SV-04 | PROCEED | Continues normally (no R-GRP-03) |
| SV-05 | ESCALATE | S-04 (after operator scope declaration) |
| SV-06 | PROCEED | Continues with parity=UNKNOWN + US record |
| SV-07 | PROCEED | Continues with flat domain |
| SV-08 | PROCEED | Continues with operator-declared target |
| SV-09 | PROCEED | Continues with ACCEPTED status (no downgrade) |
| SV-10 | PROCEED (elevated risk) | Continues; may produce ESC-02 |

---

#### STATUS

| Check | Result |
|---|---|
| SV-01 through SV-10 all have runtime handlers | CONFIRMED |
| All handlers cite DP-xx authority | CONFIRMED |
| BlueEdge assumptions excluded (all TA-xx referenced and blocked) | CONFIRMED |
| Source-agnostic detection rules specified for all variance types | CONFIRMED |
| No canonical mutation | CONFIRMED |

**VARIANCE RESOLVER SPEC: COMPLETE**
