# PSEE.X — Candidate Pattern Registry

**Stream:** PSEE.X
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document catalogs structural candidate patterns surfaced by exploring the unknown-space and escalation positions identified in unknown_space_inventory.md. Each candidate is a recurring structural situation that appears useful but cannot be admitted to canon here. No candidate is a rule. No candidate overrides any PSEE.0 rule or PSEE.1 decision.

**Disclaimer on every entry in this document:**
**NOT CANONICAL — NO AUTOMATIC APPLICATION**

---

#### METHODOLOGY LAYER

1. For each unknown-space or escalation position: identify whether a structural pattern exists that recurs across potential corpora.
2. Classify by candidate type: DECOMPOSITION_PATTERN | BOUNDARY_PATTERN | OVERLAP_PATTERN | NAMING_PATTERN | CLASSIFICATION_PATTERN | FALLBACK_PATTERN.
3. State the pattern formally enough that a future governed review can evaluate it rigorously.
4. Reference the PSEE.0 rule it would supplement (if any) and the unknown-space it addresses.
5. Do NOT state the pattern as a rule. Do NOT claim it is generalized.

---

#### TECHNICAL LAYER

---

### CP-01 — Structural Similarity Signal for Overlap Candidate Identification

```
candidate_id:    CP-01
candidate_type:  OVERLAP_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  When two evidence domains have (a) identical top-level directory names, (b) identical
  immediate sub-directory names at depth-1, and (c) file count within 10% of each other,
  they are candidates for OVL record creation in Phase 4 (R-NRM-02).

source position:  USP-01 (file-level parity unknown); ESP-01 (architectural structure ambiguity)
why surfaced:
  R-NRM-02 requires detecting "structurally similar CEU pairs" but does not specify
  detection criteria. In BlueEdge, structural similarity was obvious (backend/ in standalone
  vs backend/ in platform). For new corpora with less obvious naming, a detection signal
  is needed to know which pairs to check.

supporting evidence:
  PSEE.0/rule_catalog_v0.md R-NRM-02 input_pattern: "two or more evidence sources with
  observed structural similarity (same directory organization, same module names)" —
  "same directory organization" is the detection signal but is not operationalized.

relation to PSEE.0 rules:
  Supplements R-NRM-02 (overlap pair declaration) at the detection step only.
  Does NOT determine file_level_parity — that remains UNKNOWN until diff is performed (USP-01).
  Does NOT produce an OVL record — the operator still confirms the pair before OVL creation.

relation to PSEE.F1:
  H-06 (coordination hotspot detection) is ADMISSIBLE_REFERENCE.
  CP-01 is the structural formalization of the detection aspect of H-06.

admissibility boundary:
  CP-01 may identify WHICH pairs to check with R-NRM-02.
  CP-01 may NOT determine file_level_parity.
  CP-01 may NOT produce OVL records without operator confirmation.
  CP-01 may NOT suppress UNKNOWN-SPACE for any confirmed pair (USP-01 still applies).

containment decision:  FUTURE_REVIEW
rationale:  Detection criteria are operationalizable (directory name and count comparison
            are mechanical); the rule remains R-NRM-02 (no change to canon);
            CP-01 only formalizes when to trigger R-NRM-02 for new corpora.
```

---

### CP-02 — Architectural Sub-Division Detection via Directory Depth

```
candidate_id:    CP-02
candidate_type:  DECOMPOSITION_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  When a domain's top-level directory contains one or more sub-directories, each of which
  contains ≥5 files, those sub-directories represent candidate architectural sub-groups for
  R-GRP-02 sub-grouping — regardless of whether the total domain file count exceeds 50.

source position:  PSEE.1/decision_points_catalog.md DP-3-02 (hidden 50-file threshold);
                  ESP-01 (architectural structure); determinism_boundary.md CT-03

why surfaced:
  The 50-file threshold in DP-3-02 is observable but not fully principled. A domain with
  48 files organized across 6 sub-directories is structurally more complex than a domain
  with 55 flat files. The current threshold may mis-classify both (sub-group the flat one,
  leave the structured one flat).

supporting evidence:
  PSEE.0/rule_catalog_v0.md R-GRP-02 theoretical basis: "Large monorepos have multiple
  layers: repository root (infra), application root (entry points), subsystem directories,
  domain modules." These are defined by STRUCTURAL ROLE, not file count.
  PSEE.1/source_variance_handling.md CT-03 note: "Mixed domains (few files but complex
  architecture) may warrant sub-grouping below the threshold."

relation to PSEE.0 rules:
  Supplements R-GRP-02 at the threshold detection step.
  Does NOT change the sub-grouping logic — only when to apply it.

relation to PSEE.F1:
  H-01 (architecture-first) is BLOCKED; CP-02 is evidence-first (observes directory structure,
  does not assume architecture). These are epistemically distinct.

admissibility boundary:
  CP-02 is a detection heuristic only.
  If applied: sub-grouping is still performed per R-GRP-02 (unchanged).
  Cannot replace the 50-file threshold with this criterion; would require formal threshold
  revision in a governed stream.

containment decision:  FUTURE_REVIEW
rationale:  Sub-directory depth with ≥5 files per sub-directory is mechanically detectable;
            it operationalizes the "architectural layers" concept without bleed into capability
            domain organization. The 50-file threshold in CT-03 is noted as approximate;
            this candidate would sharpen it.
```

---

### CP-03 — Evidence Boundary Minimum Viable Template

```
candidate_id:    CP-03
candidate_type:  BOUNDARY_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  A minimum viable structure for an operator-constructed evidence_boundary.md equivalent
  when none exists (SV-01 / DP-0-02 fallback). Fields: primary_evidence_origin_paths
  (required), provenance_only_paths (may be empty), explicitly_excluded_paths (may be empty
  but must be explicitly declared), accepted_evidence_classes (default: code, documentation,
  configuration), source_materials (optional annotation).

source position:  USP-03 (generic inferrable); ESP-02 (exclusion list absent); SV-01 (boundary absent)

why surfaced:
  PSEE.0/psee_v0_execution_spec.md reusability statement §5 says "if boundary does not exist,
  create it." PSEE.1/source_variance_handling.md SV-01 says H-11 is ADMISSIBLE_REFERENCE for
  construction. But neither specifies what the minimum viable structure is.
  Without a template, an operator-created boundary may be incomplete in ways that trigger
  cascading escalations.

supporting evidence:
  psee_v0_schema.json does not define a validation schema for evidence_boundary.md.
  PSEE.0 psee_v0_execution_spec.md Phase 0 check P0-02 says "present" but not "valid."
  The only implied validation is that Phase 2 rules can read the required fields.

relation to PSEE.0 rules:
  CP-03 would formalize what "valid evidence boundary document" means for Phase 0 check P0-02.
  This is a schema gap in psee_v0_schema.json, not a rule gap.

relation to PSEE.F1:
  H-11 (source snapshot intake record) is the ADMISSIBLE_REFERENCE antecedent.
  CP-03 formalizes what H-11 should produce when used as construction basis.

admissibility boundary:
  CP-03 is a template specification only.
  Cannot modify the Phase 0 check logic (that would be a PSEE.0R action).
  Can be provided to operators as a reference document without canonical admission.

containment decision:  REFERENCE_ONLY
rationale:  An MVT (minimum viable template) for boundary construction is operator-facing
            reference material, not a canonical rule. It does not alter PSEE.0 decision logic.
            Can be published as an operator guidance document without stream admission.
```

---

### CP-04 — Source Materials Annotation Vocabulary

```
candidate_id:    CP-04
candidate_type:  CLASSIFICATION_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  A candidate vocabulary for source_materials annotations that trigger R-FLT-02
  (support-only downgrade). The vocabulary: {"lightweight", "support only", "metadata only",
  "extraction notes", "context only", "analysis notes", "auxiliary"} → intake_status =
  ACCEPTED-SUPPORT-ONLY. Absence of annotation or {"primary evidence", "verified", "authoritative"}
  → no downgrade.

source position:  PSEE.1/decision_points_catalog.md DP-2-03 (hidden keyword detection); DP-S-01

why surfaced:
  The "lightweight" trigger (DP-S-01) is a string-match on a single word. A new operator-created
  boundary document that uses "extraction analysis notes" instead of "lightweight" would fail
  to trigger R-FLT-02 even though the semantic intent is identical. This creates a hidden
  classification gap in new corpora.

supporting evidence:
  PSEE.0/rule_catalog_v0.md R-FLT-02 theoretical basis: "extraction process artifacts are
  epistemically different from raw source evidence." The principle is semantic; the
  trigger is currently lexical.
  PSEE.1/determinism_boundary.md CT-02: "source_materials annotation present → ACCEPTED-SUPPORT-ONLY;
  semantic equivalents: 'support only', 'metadata only', 'context only' trigger same rule."
  CT-02 in PSEE.1 already acknowledges semantic equivalents — this candidate formalizes them.

relation to PSEE.0 rules:
  Supplements R-FLT-02 detection step.
  Does NOT change the downgrade action (intake_status = ACCEPTED-SUPPORT-ONLY is unchanged).

relation to PSEE.F1:
  Not directly related to any PSEE.F1 heuristic.
  Addresses a lexical formalization gap, not a lineage issue.

admissibility boundary:
  If admitted: adds a recognized vocabulary list to psee_v0_schema.json source_materials field.
  This would be a minor schema extension (not a rule change) requiring a PSEE.0R or PSEE.1R stream.

containment decision:  FUTURE_REVIEW
rationale:  The vocabulary is semantically well-bounded (reduced-authority annotations
            are a recognized class); CT-02 in PSEE.1 already opens the door; formal admission
            would require a schema update (governed action).
```

---

### CP-05 — Sparse Priority Tier Handling

```
candidate_id:    CP-05
candidate_type:  NAMING_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  When a corpus has no files in one or more canonical priority tiers (e.g., no HTML documentation,
  no analysis/ extraction metadata), the CEU-NN sequence should skip that tier and start
  the next tier at the next available sequential integer — not leave gaps or reuse tier-reserved
  ranges.

source position:  PSEE.1/source_variance_handling.md SV-02 (N archives may not include documentation);
                  determinism_boundary.md FX-05 (priority-tier CEU ordering)

why surfaced:
  R-NAM-01 assigns CEU identifiers "in priority-tier order." The BlueEdge corpus had content
  in all four tiers. A corpus with no documentation (Tier 1 empty) and no extraction metadata
  (Tier 2 empty) would start at CEU-01 for Tier 3 (source trees). This is the correct behavior
  but is not explicitly stated in R-NAM-01.

supporting evidence:
  PSEE.0/rule_catalog_v0.md R-NAM-01 states "within each tier: sequential integers" but
  does not address empty tiers. psee_v0_schema.json CEU pattern "CEU-[0-9]{2}" is compatible
  with sparse tier sequences.
  The FX-05 formalization in PSEE.1 defines tier membership by intake_status and evidence_class —
  an empty tier simply contributes no CEUs.

relation to PSEE.0 rules:
  Clarification of R-NAM-01 behavior for sparse inputs.
  No change to naming rule logic; the rule handles it implicitly (empty tier → no CEUs).

admissibility boundary:
  CP-05 is an explicit clarification of implicit R-NAM-01 behavior.
  Could be added as a note in psee_v0_schema.json or rule_catalog_v0.md without rule change.
  This is documentation gap closure, not rule admission.

containment decision:  REFERENCE_ONLY
rationale:  The canonical rule already handles sparse tiers correctly (implicitly).
            CP-05 makes it explicit without requiring rule modification.
            Suitable for addition to schema documentation or PSEE.2 implementation notes.
```

---

### CP-06 — Convergent Re-run Scope Narrowing

```
candidate_id:    CP-06
candidate_type:  FALLBACK_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  When Phase 6 first divergence fires (ESC-06), the re-run from S-02 can be scoped
  to only the phases that could affect the divergent Phase B units. Specifically:
  - If divergent units are in evidence_surface_inventory: re-run from S-06 (grouping)
  - If divergent units are in normalized_evidence_map: re-run from S-08 (abstracting)
  - If divergent units are in evidence_classification_map: re-run from S-10 (classifying)
  - If divergent units are in intake_validation_log: re-run from S-10 (classifying)
  - If no artifact-level attribution is possible: re-run from S-02 (full)

source position:  ESP-04 (reconstruction divergence); PSEE.1/escalation_and_fallback_spec.md ESC-06

why surfaced:
  ESC-06 always re-enters from S-02. For large corpora, a full re-run from S-02 is
  expensive and may re-trigger escalations that were already resolved. A targeted re-run
  to the earliest phase that affects the divergent artifact reduces cost without reducing correctness.

supporting evidence:
  PSEE.0/psee_v0_execution_spec.md Phase 6 stop condition: "investigate unmapped units, refine rules,
  and re-run before closing stream" — does not specify scope of re-run.
  PSEE.1/decision_state_model.md ESC-06 branch: "S-12 → S-02 (re-enter)" — currently always S-02.
  Phase-artifact dependency: ESI is produced by S-06/S-07; NEM/OVL/US by S-08/S-09;
  ECM/IVL by S-10/S-11. This dependency is deterministic.

relation to PSEE.0 rules:
  No rule change. This is an implementation optimization within the state machine (PSEE.1).

admissibility boundary:
  If admitted: would modify decision_state_model.md ESC-06 transition in a PSEE.1R stream.
  Cannot be applied here — PSEE.1 artifacts are read-only.

containment decision:  FUTURE_REVIEW
rationale:  The narrowing logic is derivable from the existing phase-artifact dependency
            (deterministic); the optimization is sound; the change is a PSEE.1R action.
            Preserving here for PSEE.1R consideration.
```

---

### CP-07 — Extraction Log Proxy Signal

```
candidate_id:    CP-07
candidate_type:  BOUNDARY_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  When no extraction log exists (SV-10), path duplication classification (DP-1-02) can use
  a proxy signal: if the outer directory is empty except for one sub-directory that shares
  its exact name, the probability of PACKAGING_BOUNDARY is high enough to warrant
  conditional classification pending operator confirmation.

source position:  SV-10 (extraction log absent); ESP-01/ESC-02 (unclassifiable duplication)

why surfaced:
  DP-1-02 without an extraction log defaults to UNCLASSIFIABLE → ESC-02. The proxy signal
  (outer dir contains only one sub-dir with identical name) is a structural observation,
  not an inference about the archive origin. It narrows the classification space without
  eliminating operator confirmation.

supporting evidence:
  PSEE.0/source_normalization_log.md DUP-01: "tar xf backend.tar -C extracted/backend/ produces
  extracted/backend/backend/ when the archive root is named backend." This is the physical
  origin of the double-nesting pattern. The structural signature is: outer dir has exactly one
  sub-dir; the sub-dir name = outer dir name. No other content in outer dir.

relation to PSEE.0 rules:
  Supplements R-NRM-01 classification step for the extraction-log-absent case.
  Does NOT change the classification outcome — PACKAGING_BOUNDARY still requires operator
  confirmation even with proxy signal.

relation to PSEE.F1:
  Directly addresses TA-01 (extraction pattern) when the log is absent.
  Stays within the observable-evidence boundary: directory structure is Phase A evidence.

admissibility boundary:
  If admitted: would add a conditional branch in the DP-1-02 classification for
  log-absent case. Would require updating R-NRM-01 in a PSEE.0R stream.
  Operator confirmation remains mandatory; this only changes UNCLASSIFIABLE to
  CONDITIONAL_PACKAGING_BOUNDARY (pending confirmation).

containment decision:  FUTURE_REVIEW
rationale:  The proxy signal is structurally grounded, not inferential (observing directory
            content is not an inference about archive origin); it reduces escalation frequency;
            operator confirmation preserves determinism. The pattern is worth formal evaluation.
```

---

### CP-08 — Capability Metadata Passthrough Annotation

```
candidate_id:    CP-08
candidate_type:  CLASSIFICATION_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  Capability domain information observed in Phase A (e.g., capability_domain_taxonomy.md)
  may be preserved as non-intake metadata annotations on EvidenceDomain or CEU records,
  without affecting intake_status, evidence_class, or any canonical field.
  A candidate annotation field: "capability_context" (type: string, optional, non-authoritative).

source position:  BHP-03 (capability taxonomy BLOCKED at 40.2); USP-03 (generic inferrable position)

why surfaced:
  H-03 (capability taxonomy) is BLOCKED from intake organization but some Phase A corpora
  will contain rich capability domain documentation. Discarding it entirely loses contextual
  information that might be useful to 40.3+ layers. A passthrough annotation preserves it
  without affecting canonical intake logic.

supporting evidence:
  PSEE.1/heuristic_admissibility_matrix.md H-03: "capability labels may appear as metadata
  in Phase B semantic layers (40.3+) but must not be used as domain grouping criteria at 40.2."
  psee_v0_schema.json EvidenceDomain and CEU entities have no optional non-canonical metadata
  field. A "notes" or "context" field does not exist.

relation to PSEE.0 rules:
  Requires addition of an optional metadata field to EvidenceDomain and CEU schemas.
  Does NOT affect any decision logic — optional fields are ignored by all rules.

admissibility boundary:
  Schema addition only; no rule change.
  Would require a schema update in a PSEE.0R stream.
  Risk: if downstream consumers treat "capability_context" as authoritative, it bleeds into
  40.3+ semantic layer. Strict annotation: "non_canonical: true" on the field.

containment decision:  FUTURE_REVIEW
rationale:  The passthrough concept is sound (preserving discarded information without
            using it). The implementation requires a schema update (governed action).
            The risk of misuse must be addressed in the schema update.
```

---

### CP-09 — Iterative Boundary Refinement Log

```
candidate_id:    CP-09
candidate_type:  FALLBACK_PATTERN
NOT CANONICAL — NO AUTOMATIC APPLICATION

description:
  When an operator creates an evidence_boundary.md equivalent for the first time (SV-01 / CP-03),
  successive refinements (e.g., adding to explicitly_excluded_paths after GRAY-ZONE discovery)
  should be logged as version-stamped refinements rather than overwriting the original.
  This preserves the audit trail of boundary evolution.

source position:  ESP-02 (exclusion list absent / GRAY-ZONE); SV-01 (boundary absent)

why surfaced:
  The current model treats the evidence boundary as a static input. In practice, an operator
  constructing a boundary for a new engagement will refine it as escalations surface new
  GRAY-ZONE positions. If each refinement overwrites the previous version, the audit trail
  of what was excluded and when is lost.

supporting evidence:
  PSEE.1/source_variance_handling.md SV-01: "operator creates boundary document before
  re-submitting." No versioning mechanism is specified.
  PSEE.0/psee_v0_execution_spec.md reusability §5: "create it before beginning Phase 2."
  No refinement or versioning guidance.

relation to PSEE.0 rules:
  No canonical rule change. This is a boundary document governance practice.

admissibility boundary:
  Operator-facing procedure, not a PSEE engine rule.
  Could be formalized in a boundary document template (CP-03) without canonical admission.

containment decision:  REFERENCE_ONLY
rationale:  Versioned boundary refinement is good operator practice; it does not affect
            the engine. Can be included in operator guidance alongside CP-03 without
            requiring a governed stream.
```

---

### Candidate Pattern Registry Summary

| CP ID | Type | Addresses | Containment |
|---|---|---|---|
| CP-01 | OVERLAP_PATTERN | USP-01; R-NRM-02 detection gap | FUTURE_REVIEW |
| CP-02 | DECOMPOSITION_PATTERN | DP-3-02 threshold; structural sub-division | FUTURE_REVIEW |
| CP-03 | BOUNDARY_PATTERN | USP-03; SV-01; ESP-02 (boundary MVT) | REFERENCE_ONLY |
| CP-04 | CLASSIFICATION_PATTERN | DP-2-03 keyword gap; source_materials vocabulary | FUTURE_REVIEW |
| CP-05 | NAMING_PATTERN | FX-05 sparse tier; R-NAM-01 clarification | REFERENCE_ONLY |
| CP-06 | FALLBACK_PATTERN | ESP-04; ESC-06 re-run scope | FUTURE_REVIEW |
| CP-07 | BOUNDARY_PATTERN | SV-10; DP-1-02 extraction log proxy | FUTURE_REVIEW |
| CP-08 | CLASSIFICATION_PATTERN | BHP-03; capability metadata passthrough | FUTURE_REVIEW |
| CP-09 | FALLBACK_PATTERN | ESP-02; SV-01; boundary refinement log | REFERENCE_ONLY |

**Containment distribution: FUTURE_REVIEW: 6 | REFERENCE_ONLY: 3 | OBSERVE_ONLY: 0 | FORBIDDEN: 0**

---

#### EVIDENCE LAYER

Each CP entry cites its source position, PSEE.0/PSEE.1 rule relationship, and PSEE.F1 connection directly in its definition. All evidence is traceable to documents in the allowed input scope.

---

#### LIMITATIONS & BOUNDARIES

- No candidate in this registry is a rule. All use "description:" not "rule:".
- FUTURE_REVIEW classification means "may warrant evaluation in a governed stream." It does not mean "will be admitted."
- REFERENCE_ONLY classification means "useful to operators as guidance." It does not mean "admitted as non-canonical procedure."
- All candidates marked NOT CANONICAL — NO AUTOMATIC APPLICATION.

---

#### STATUS

| Check | Result |
|---|---|
| Candidate patterns surfaced | 9 (CP-01 through CP-09) |
| All marked NOT CANONICAL | CONFIRMED |
| No canonical mutation | CONFIRMED |

**CANDIDATE PATTERN REGISTRY: COMPLETE — 9 candidates, 0 canonical mutations**
