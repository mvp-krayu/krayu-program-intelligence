# PSEE.1 — Source Variance Handling

**Stream:** PSEE.1
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document defines how PSEE handles source corpora that differ structurally from the BlueEdge v3.23.0 instantiation. For each identified variance type, it specifies the exact decision path, fallback behavior, and conditions under which the variance triggers STOP, ESCALATE, or PROCEED. This is the generalization contract for PSEE.0 rules.

**Value:** Without explicit variance handling, PSEE.2 implementors would either embed BlueEdge-specific assumptions (violating FB-03 through FB-07) or fail on new corpora with no defined behavior. This document eliminates both failure modes.

---

#### METHODOLOGY LAYER

1. Identify the BlueEdge-specific assumptions (TA-01 through TA-08 from PSEE.F1 transitional_assumptions.md).
2. For each: define what the variance looks like in a non-BlueEdge corpus.
3. Define the source-agnostic decision criteria and execution path.
4. State the outcome: PROCEED | FALLBACK | ESCALATE | STOP.

---

#### TECHNICAL LAYER

---

### SV-01 — Evidence Boundary Document Absent (TA-07 variance)

```
BlueEdge baseline:   evidence_boundary.md exists with all required fields
Variance condition:  No equivalent document exists in Phase A corpus

Detection:           DP-0-02 false-path
Outcome:             STOP → SOURCE_RESOLUTION_FAIL (hard stop per psee_v0_execution_spec.md P0-02)
Fallback path:       Operator creates evidence_boundary.md equivalent before re-entering PSEE
                     (psee_v0_execution_spec.md reusability statement §5)
                     H-11 (source snapshot intake record) is ADMISSIBLE_REFERENCE: if a
                     snapshot intake record or equivalent exists in Phase A, use it as the
                     basis for constructing the boundary document.

Required minimum content for operator-created boundary:
  - primary_evidence_origin_paths: at minimum, the list of directories containing
    evidence to be ingested
  - provenance_only_paths: any archives or non-ingested artifacts (may be empty)
  - explicitly_excluded_paths: any directories to be excluded from ingestion
    (if unknown → DP-2-01 will fire GRAY-ZONE; see SV-05)
  - accepted_evidence_classes: at minimum, ["code", "documentation", "configuration"]

Cannot proceed without:
  - primary_evidence_origin_paths (required for R-GRP-01)
  - explicitly_excluded_paths OR explicit GRAY-ZONE declaration (required for R-FLT-03)
```

---

### SV-02 — Archive Count Different from 3 (TA-01 variance)

```
BlueEdge baseline:   3 archives (backend, frontend, platform)
Variance conditions: 1 integrated archive; or 2 archives; or 5+ component archives

Detection:           Phase 0 / Phase 1 — enumeration of primary_evidence_origin_paths
Outcome:             PROCEED (no special handling required)
Source-agnostic rule: R-GRP-01 creates one EvidenceDomain per primary_evidence_origin_path,
                     regardless of count. N archives → N domains.

Edge case — 1 archive (monolith):
  - Path doubling (DP-1-01) may still apply if archive root matches container dir
  - R-GRP-03 does not apply (no embedded component separation needed if no standalones)
  - OVL records: none if no overlap observed

Edge case — large N (>10 component archives):
  - R-GRP-01 creates N domains
  - R-ABS-01 creates N CEUs
  - Sub-grouping (R-GRP-02) applies to any domain >50 files (CT-03)
  - No maximum domain count in canonical rules

Note:    The 3-archive structure (TA-01) is an observable corpus fact, not a rule requirement.
         PSEE produces the correct output for any N.
```

---

### SV-03 — No Repeated Module Pattern (TA-02 variance)

```
BlueEdge baseline:   63 modules × 5-file NestJS pattern → R-ABS-02 pattern rows
Variance condition:  Source tree has no repeated directory structure; all files unique

Detection:           DP-3-03 false-path (no pattern detected)
Outcome:             PROCEED — enumerate files individually; no pattern rows
Source-agnostic rule: R-ABS-02 applies only when repeated patterns are observed (CT-04).
                      Zero patterns → zero pattern rows. This is not a failure.

Edge case — framework-agnostic patterns:
  If source tree uses a different framework (Spring Boot, Django, Rails, etc.)
  that mandates a different per-module file pattern, the pattern may still be
  detectable from directory layout. The pattern type is framework-specific;
  the pattern detection logic (CT-04) is source-agnostic.
  PSEE.2 must not hard-code NestJS as the only detectable pattern.

Edge case — partial patterns (some modules follow pattern, some do not):
  Apply R-ABS-02 to the consistent subset; enumerate non-conforming files individually.
  Flag the inconsistency in the sub-table as: "N files follow pattern X; M files enumerated individually."
```

---

### SV-04 — No Platform/Integrated Repository (TA-01/TA-04 variance)

```
BlueEdge baseline:   One platform repository that embeds standalone components
Variance condition:  All repositories are independent; no platform embedding

Detection:           DP-3-04 false-path (no domain contains directories matching standalones)
Outcome:             PROCEED — R-GRP-03 does not fire; no OVL records from platform embedding
Source-agnostic rule: R-GRP-03 is a conditional rule (only applies when embedding detected).
                      Zero platform embedding → zero OVL records from this rule.

Note on OVL records:  R-NRM-02 may still produce OVL records if non-platform structural
                      similarity is observed between two CEUs (e.g., two microservices with
                      identical internal structure). The detection criterion is structural
                      similarity, not platform embedding specifically.
```

---

### SV-05 — Explicitly Excluded Paths List Absent (TA-07 variance, partial)

```
BlueEdge baseline:   evidence_boundary.md contains explicitly_excluded_paths with 6 paths
Variance condition:  Evidence boundary exists but explicitly_excluded_paths field is absent

Detection:           DP-2-01 false-path
Outcome:             ESCALATE → GRAY-ZONE flag; request explicit scope statement from operator
                     (psee_v0_execution_spec.md Phase 2 decision point §3)
Fallback path:       Operator must provide one of:
                     (a) an explicit exclusion list (add to boundary document), OR
                     (b) a declaration that no paths are excluded ("explicitly_excluded_paths: []")
Cannot proceed without operator response to DP-2-01 ESCALATION.

Source-agnostic note: An empty exclusion list ([]) is a valid operator declaration.
                      The requirement is that the operator explicitly state the scope,
                      not that paths are excluded. "Nothing is excluded" is a valid answer.
```

---

### SV-06 — Overlap Diff Evidence Absent (TA-06 variance)

```
BlueEdge baseline:   analysis/03_overlap_validation.md provides diff -qr results
Variance condition:  No diff was performed; structural similarity observed but no comparison

Detection:           DP-4-02 false-path (no diff available)
Outcome:             PROCEED — create OVL record with file_level_parity = UNKNOWN
                     + create US record (R-NRM-03)
Source-agnostic rule: R-NRM-02 handles all three diff states: KNOWN identical, KNOWN different,
                      UNKNOWN. The absence of diff evidence is an explicitly handled case.

Note on forbidden substitution (FB-01):
  Structural similarity alone CANNOT produce file_level_parity = KNOWN.
  Even if directory names, file counts, and top-level structure are identical:
  file_level_parity = UNKNOWN until a content comparison is performed.
  This applies regardless of operator intuition or system knowledge (FB-02).
```

---

### SV-07 — No Top-Level Architectural Sub-Division (TA-02/TA-03 variance)

```
BlueEdge baseline:   Each component has clearly identifiable infra / src / modules layers
Variance condition:  Source tree is flat; no clear architectural sub-division

Detection:           DP-3-02 false-path (file count ≤ 50 or no identifiable sub-groups)
Outcome:             PROCEED — flat domain; no sub-tables; no CEUSubUnit records
Source-agnostic rule: R-GRP-02 sub-grouping is conditional on observable structure.
                      Flat source tree → flat EvidenceDomain → flat CEU. This is valid.

Edge case — large flat source (>50 files, no clear sub-groups):
  R-GRP-02 threshold (CT-03) is exceeded but no architectural sub-division is identifiable.
  Decision: apply R-ABS-02 to enumerate file types as a proxy organization (not architectural roles).
  Flag in the domain record: "Sub-grouping by architectural role not applicable; files enumerated by type."
  Do NOT invent architectural roles that are not observable.
```

---

### SV-08 — Phase B Target Structure Different from 40.2 (TA-08 variance)

```
BlueEdge baseline:   4 × 40.2 artifacts (ESI, NEM, ECM, IVL); 53 atomic units
Variance condition:  A different engagement has a different Phase B target (fewer or more artifacts)

Detection:           Phase 0, DP-0-03 (operator must declare Phase B target artifacts)
Outcome:             PROCEED — PSEE rules apply to any Phase B target structure;
                     the 4-artifact decomposition is engagement-specific, not a rule requirement

PSEE.1 source-agnostic contract:
  Phase B target MUST be declared by the operator in the stream contract before execution.
  The declared artifacts become the baseline for:
  - Phase 0 prerequisite check (P0-03)
  - Phase 5 coverage computation (DP-5-02: total Phase B units comes from declared target)
  - Phase 6 reconstruction simulation (compare against declared Phase B artifacts only)

Note:    A new engagement may have 2 Phase B artifacts or 8. The 4-artifact structure of
         40.2 is the PiOS-specific instantiation. PSEE.0 rules are portable; the target
         artifact schema is engagement-specific.
```

---

### SV-09 — Source Materials Annotation Not Present (TA-07 variant)

```
BlueEdge baseline:   evidence_boundary.source_materials field notes "lightweight extraction
                     analysis notes" → triggers R-FLT-02 support-only downgrade
Variance condition:  source_materials field absent or contains no reduced-authority annotation

Detection:           DP-2-03 false-path (no annotation found)
Outcome:             PROCEED — extraction analysis files retain ACCEPTED status (no downgrade)
Source-agnostic rule: R-FLT-02 is a conditional rule. The downgrade only fires when
                      evidence of reduced authority is observed. Absence of annotation → ACCEPTED.

Note:    This means a new corpus where the operator has not annotated extraction analysis files
         will treat those files as full primary evidence. Operator responsibility: if extraction
         analysis files should be restricted, the source_materials annotation must be explicit.
```

---

### SV-10 — Extraction Log Absent (TA-01 variant)

```
BlueEdge baseline:   analysis/00_extraction_log.md documents archive structure and extraction paths
Variance condition:  No extraction log exists; path normalization must rely on inspection alone

Detection:           Phase 1 (R-NRM-01 step 2) — evidence chain for duplication classification
Outcome:             PROCEED with CONTINGENT limitation
                     CT-01 still applies: classification from direct path inspection
                     If inspection is sufficient to determine PACKAGING_BOUNDARY → proceed
                     If classification CANNOT be determined from inspection → DP-1-05 ESCALATE

Fallback path:       Operator performs manual inspection and declares classification.
                     Without an extraction log, DP-1-02 UNCLASSIFIABLE is more likely.
                     This increases the probability of S-T2 ESCALATED for Phase 1 paths.
```

---

### Source Variance Summary

| SV ID | Variance condition | Outcome | Rule path |
|---|---|---|---|
| SV-01 | Evidence boundary absent | STOP → operator creates → retry | DP-0-02; H-11 ADMISSIBLE |
| SV-02 | Archive count ≠ 3 | PROCEED | R-GRP-01 (N domains for N archives) |
| SV-03 | No repeated module pattern | PROCEED | DP-3-03 false-path; no R-ABS-02 |
| SV-04 | No platform/integrated repository | PROCEED | DP-3-04 false-path; no R-GRP-03 |
| SV-05 | Exclusion list absent | ESCALATE → operator declares scope | DP-2-01; GRAY-ZONE |
| SV-06 | No diff evidence for overlap | PROCEED | OVL parity = UNKNOWN; US record |
| SV-07 | No architectural sub-division | PROCEED | Flat domain; no sub-tables |
| SV-08 | Different Phase B target structure | PROCEED | Operator declares target; PSEE adapts |
| SV-09 | No source_materials annotation | PROCEED | R-FLT-02 not triggered; ACCEPTED |
| SV-10 | Extraction log absent | PROCEED with escalation risk | CT-01 inspection; DP-1-05 if needed |

---

#### EVIDENCE LAYER

| Variance | Source |
|---|---|
| SV-01 | psee_v0_execution_spec.md P0-02 + reusability §5; PSEE.F1 transitional_assumptions.md TA-07 |
| SV-02 | PSEE.F1 transitional_assumptions.md TA-01; R-GRP-01 transformation_logic |
| SV-03 | PSEE.F1 transitional_assumptions.md TA-02; R-ABS-02 input_pattern |
| SV-04 | PSEE.F1 transitional_assumptions.md TA-01/TA-04; R-GRP-03 input_pattern |
| SV-05 | psee_v0_execution_spec.md Phase 2 decision point §3; R-FLT-03 |
| SV-06 | PSEE.F1 transitional_assumptions.md TA-06; R-NRM-02/03; determinism_boundary.md FB-01 |
| SV-07 | PSEE.F1 transitional_assumptions.md TA-02/TA-03; R-GRP-02 |
| SV-08 | PSEE.F1 transitional_assumptions.md TA-08; psee_v0_execution_spec.md Phase 0 |
| SV-09 | R-FLT-02; psee_v0_schema.json intake_state_machine transition |
| SV-10 | R-NRM-01 step 2; psee_v0_execution_spec.md Phase 1 |

---

#### LIMITATIONS & BOUNDARIES

- SV-02 (any archive count) assumes all archives have been extracted to distinct directories. If multiple archives are extracted into the same directory, path normalization (R-NRM-01) handles any resulting duplications.
- SV-08 requires operator-declared Phase B target structure. PSEE has no default Phase B structure; an undeclared target is equivalent to DP-0-03 FAIL.
- SV-10 increases ESCALATION probability but does not prevent execution. Corpora without extraction logs require more operator involvement at Phase 1.

---

#### STATUS

| Check | Result |
|---|---|
| Source variance types identified | 10 (SV-01 through SV-10) |
| Each linked to TA-xx source | CONFIRMED |
| Source-agnostic decision path defined for each | CONFIRMED |
| No canonical mutation | CONFIRMED |

**SOURCE VARIANCE HANDLING: COMPLETE — 10 variance types with defined execution paths**
