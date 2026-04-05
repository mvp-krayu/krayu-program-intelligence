# PSEE.X — Pattern Containment Matrix

**Stream:** PSEE.X
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document is the authoritative containment assignment for all candidate patterns surfaced in PSEE.X. For each candidate, it records: containment class, the rationale that justifies the class, the enforcement constraint that applies while the candidate is held at that class, and the governed action required before the containment class can change.

**Containment classes:**
- **OBSERVE_ONLY**: Pattern is recognized but must not be applied in any context. Retained for documentation of what was considered.
- **REFERENCE_ONLY**: Pattern may be provided to operators as non-canonical guidance. No engine behavior changes. No downstream consumer may treat it as authoritative.
- **FUTURE_REVIEW**: Pattern may warrant evaluation for governed admission in a future PSEE stream. No admission is granted here. The pattern may not be applied until admitted.
- **FORBIDDEN**: Pattern is explicitly prohibited. Its application in any form constitutes a governance violation.

**NOT CANONICAL — NO AUTOMATIC APPLICATION**

---

#### METHODOLOGY LAYER

1. For each CP: record final containment class (from candidate_pattern_registry.md, confirmed by admissibility_screening.md).
2. State enforcement constraints for the assigned class.
3. Record what action changes the containment class.
4. Record what would cause a FORBIDDEN reclassification.

---

#### TECHNICAL LAYER

---

#### CP-01 — Structural Similarity Signal for Overlap Candidate Identification

```
containment_class:  FUTURE_REVIEW
screening_result:   CLEAR (PASS / PASS / PASS)

enforcement_constraints:
  - May NOT be applied as a detection rule in PSEE.0 or PSEE.1 logic
  - May NOT be used to produce OVL records without operator confirmation
  - May NOT suppress UNKNOWN-SPACE for any overlap pair (USP-01 still applies)
  - May be referenced in PSEE.2 implementation notes as a suggested detection approach
    provided it is labeled: "NON-CANONICAL IMPLEMENTATION SUGGESTION — NOT A RULE"

action_to_change_class:
  FUTURE_REVIEW → REFERENCE_ONLY:  Explicit decision by PSEE.X review body that
    the criterion does not warrant canonical admission (effectively: demote to operator guidance)
  FUTURE_REVIEW → ADMITTED:  PSEE.0R stream that annotates R-NRM-02 detection criteria;
    admission requires: (a) corpus-agnostic formulation confirmed, (b) operator confirmation
    gate preserved, (c) USP-01 US record requirement unchanged

causes_FORBIDDEN_reclassification:
  - Application of CP-01 to automatically produce OVL records without operator confirmation
  - Application of CP-01 to infer file_level_parity = KNOWN (violates FB-01)
```

---

#### CP-02 — Architectural Sub-Division Detection via Directory Depth

```
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (CONDITIONAL / CONDITIONAL / CONDITIONAL)

enforcement_constraints:
  - May NOT be applied to replace or supplement the 50-file threshold (CT-03) in any
    running PSEE execution
  - May NOT be used to classify a directory as an "architectural zone" (H-01 territory)
  - May be observed by a PSEE.2 implementor as context when CT-03 produces borderline results,
    provided all decisions still go through the canonical CT-03 path
  - Any reference to CP-02 must carry: "NOT A THRESHOLD REPLACEMENT — OBSERVE_ONLY in context"

action_to_change_class:
  FUTURE_REVIEW → REFERENCE_ONLY:  If review determines the H-01 proximity risk cannot
    be safely managed in guidance documentation
  FUTURE_REVIEW → ADMITTED:  PSEE.1R stream revising CT-03; requires explicit H-01
    distinction argument and risk analysis on TRANSITION B

causes_FORBIDDEN_reclassification:
  - Application of CP-02 to organize domains by "architectural responsibility zones"
    (this is precisely H-01 / FB-04 territory)
  - Claiming directory depth signals "what the domain does" rather than "what files are in it"
```

---

#### CP-03 — Evidence Boundary Minimum Viable Template

```
containment_class:  REFERENCE_ONLY
screening_result:   CLEAR (PASS / PASS / PASS)

enforcement_constraints:
  - May be provided to operators as documentation for constructing a valid boundary document
  - May be included in PSEE.2 implementation guidance
  - May NOT be presented as the canonical schema for evidence_boundary.md
    (no such canonical schema exists; CP-03 is guidance, not specification)
  - May NOT be used to validate operator-supplied boundary documents mechanically
    (Phase 0 check P0-02 governs presence; content validation is not currently specified)

action_to_change_class:
  REFERENCE_ONLY → CANONICAL:  PSEE.0R schema update that adds evidence_boundary.md
    validation schema to psee_v0_schema.json; this would make CP-03 the schema definition

causes_FORBIDDEN_reclassification:
  - Presenting CP-03 as a binding schema that an operator MUST follow
  - Using CP-03 fields as validation criteria for rejecting operator boundary documents
    (that would be unilateral schema extension without governed authority)
```

---

#### CP-04 — Source Materials Annotation Vocabulary

```
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (CONDITIONAL / CONDITIONAL / PASS)

enforcement_constraints:
  - May NOT be used to trigger R-FLT-02 downgrade for terms not currently in the
    PSEE.0/PSEE.1 vocabulary (i.e., only "lightweight" and CT-02 equivalents apply)
  - May be referenced by operators when authoring boundary documents to avoid classification gaps
  - May be included in PSEE.2 implementation notes with label:
    "CANDIDATE VOCABULARY — NOT CANONICAL; CT-02 is the operative rule"
  - Must not be presented as authoritative until admitted via PSEE.0R

action_to_change_class:
  FUTURE_REVIEW → REFERENCE_ONLY:  If review determines the vocabulary list would cause
    R-FLT-02 to be over-triggered in edge cases
  FUTURE_REVIEW → ADMITTED:  PSEE.0R annotates source_materials field in psee_v0_schema.json;
    PSEE.1R updates CT-02 to reference the vocabulary formally

causes_FORBIDDEN_reclassification:
  - Application of CP-04 vocabulary to automatically trigger R-FLT-02 outside the
    current CT-02 operative equivalents
```

---

#### CP-05 — Sparse Priority Tier Handling

```
containment_class:  REFERENCE_ONLY
screening_result:   CLEAR (PASS / PASS / PASS)

enforcement_constraints:
  - May be referenced as a clarification of FX-05 and R-NAM-01 behavior for sparse inputs
  - May be included in PSEE.2 implementation notes
  - May NOT be presented as a modification of R-NAM-01 or FX-05
    (the canonical rule already handles this correctly; CP-05 is explicit documentation only)

action_to_change_class:
  REFERENCE_ONLY → CANONICAL NOTE:  Addition of explicit sparse-tier note to
    rule_catalog_v0.md R-NAM-01 annotation; no rule change required

causes_FORBIDDEN_reclassification:
  - None identified. CP-05 documents implicit canonical behavior.
    The only risk is misrepresentation (presenting it as a rule change when it is a clarification).
```

---

#### CP-06 — Convergent Re-run Scope Narrowing

```
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (PASS / CONDITIONAL / PASS)

enforcement_constraints:
  - May NOT modify the ESC-06 transition in PSEE.1 decision_state_model.md
    (that document is read-only; PSEE.X has no authority to modify PSEE.1 artifacts)
  - May be applied by a PSEE.2 implementor as an internal optimization within the
    ESC-06 envelope, provided the S-02 full re-run path remains available
  - If applied by PSEE.2: must be labeled "IMPLEMENTATION OPTIMIZATION — NOT A SPEC CHANGE"
    and must be documented in PSEE.2 execution_report.md as a local decision

action_to_change_class:
  FUTURE_REVIEW → ADMITTED:  PSEE.1R updates decision_state_model.md ESC-06 transition
    to include phase-artifact-targeted re-entry paths; requires: (a) formal phase-artifact
    dependency table, (b) correctness proof that targeted re-run produces equivalent result
    to full re-run

causes_FORBIDDEN_reclassification:
  - Treating CP-06 as canonical by modifying PSEE.1 artifacts without a governed stream
  - Applying the scoping logic in a way that skips phases which affect the divergent artifact
    (an incorrect attribution would produce a divergent result identical to the original)
```

---

#### CP-07 — Extraction Log Proxy Signal

```
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (CONDITIONAL / CONDITIONAL / PASS)

enforcement_constraints:
  - May NOT be applied to automatically classify any duplication as PACKAGING_BOUNDARY
    without operator confirmation
  - May NOT be applied to suppress ESC-02 (UNCLASSIFIABLE → ESCALATE)
  - An operator who observes the proxy signal may use it as supporting context when
    providing their ESC-02 classification — this is human judgment, not engine logic
  - Must carry: "FB-02 proximity — this is observation of directory structure, not inference
    about archive origin"

action_to_change_class:
  FUTURE_REVIEW → ADMITTED:  PSEE.0R updates R-NRM-01 to add CONDITIONAL_PACKAGING_BOUNDARY
    state; PSEE.1R updates ESC-02 branch to defer escalation on proxy-signal match until
    operator confirmation timeout

causes_FORBIDDEN_reclassification:
  - Application of CP-07 to automatically classify PACKAGING_BOUNDARY without operator input
    (this is inference from structure → archive origin, which violates FB-02)
  - Application of CP-07 to suppress a US record for the parity-unknown case
```

---

#### CP-08 — Capability Metadata Passthrough Annotation

```
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (CONDITIONAL / PASS / CONDITIONAL)

enforcement_constraints:
  - May NOT add any capability-related field to EvidenceDomain, CEU, or any other
    psee_v0_schema.json entity without a PSEE.0R schema update
  - May NOT be used to annotate PSEE outputs with capability context in production
    until the schema update is in place
  - May be described to operators as a future schema enhancement to preserve context
    that is otherwise discarded
  - Any description must include: "Requires PSEE.0R schema update; NOT CURRENTLY AVAILABLE"

action_to_change_class:
  FUTURE_REVIEW → ADMITTED:  PSEE.0R schema update adds "capability_context" (optional,
    non_canonical: true, not_for_intake_organization: true) to EvidenceDomain and CEU;
    PSEE.2 implementation note isolates the field from all rule evaluation paths

causes_FORBIDDEN_reclassification:
  - Application of capability_context values to organize intake domains (this is FB-04)
  - Treating capability_context as authoritative for any Phase 3 grouping decision
  - Passing capability_context to any 40.2 rule evaluation as input
```

---

#### CP-09 — Iterative Boundary Refinement Log

```
containment_class:  REFERENCE_ONLY
screening_result:   CLEAR (PASS / PASS / PASS)

enforcement_constraints:
  - May be provided to operators as a boundary document governance practice
  - May be included alongside CP-03 in operator guidance
  - May NOT be presented as a PSEE engine requirement
    (PSEE does not validate boundary document versioning; this is a human practice)

action_to_change_class:
  REFERENCE_ONLY → CANONICAL PROCEDURE:  Requires PSEE.1R or PSEE.2 implementation
    spec to formally require boundary version tracking (this would be a governance
    practice formalization, not a rule change)

causes_FORBIDDEN_reclassification:
  - None identified. CP-09 is a documentation practice with no engine logic impact.
```

---

### Pattern Containment Matrix Summary

| CP ID | Containment Class | Screening | Admission Path | Key Risk |
|---|---|---|---|---|
| CP-01 | FUTURE_REVIEW | CLEAR | PSEE.0R annotation | None identified |
| CP-02 | FUTURE_REVIEW | CONDITIONAL | PSEE.1R CT-03 revision | H-01 / FB-04 proximity |
| CP-03 | REFERENCE_ONLY | CLEAR | No stream needed | Misrepresentation as binding |
| CP-04 | FUTURE_REVIEW | CONDITIONAL | PSEE.0R + PSEE.1R | CT-02 over-triggering |
| CP-05 | REFERENCE_ONLY | CLEAR | No stream needed | None identified |
| CP-06 | FUTURE_REVIEW | CONDITIONAL | PSEE.1R ESC-06 revision | Incorrect phase attribution |
| CP-07 | FUTURE_REVIEW | CONDITIONAL | PSEE.0R R-NRM-01 + PSEE.1R ESC-02 | FB-02 proximity |
| CP-08 | FUTURE_REVIEW | CONDITIONAL | PSEE.0R schema + PSEE.2 isolation | FB-04 / H-03 proximity |
| CP-09 | REFERENCE_ONLY | CLEAR | No stream needed | None identified |

**Distribution: FUTURE_REVIEW: 6 | REFERENCE_ONLY: 3 | OBSERVE_ONLY: 0 | FORBIDDEN: 0**

---

#### EVIDENCE LAYER

| Containment decision | Source |
|---|---|
| All FUTURE_REVIEW assignments | admissibility_screening.md (this stream) |
| All REFERENCE_ONLY assignments | candidate_pattern_registry.md; admissibility_screening.md |
| No FORBIDDEN/OBSERVE_ONLY assignments | 0 FAIL results in admissibility_screening.md |
| FB-02 proximity (CP-07) | PSEE.1/determinism_boundary.md FB-02 |
| FB-04 proximity (CP-02, CP-08) | PSEE.1/determinism_boundary.md FB-04 |
| H-01/H-03 proximity (CP-02, CP-08) | PSEE.1/heuristic_admissibility_matrix.md |

---

#### STATUS

| Check | Result |
|---|---|
| All 9 candidates assigned a containment class | CONFIRMED |
| Enforcement constraints defined for each | CONFIRMED |
| Admission path defined for each | CONFIRMED |
| FORBIDDEN reclassification triggers defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**PATTERN CONTAINMENT MATRIX: COMPLETE — 9 candidates, 0 FORBIDDEN, 0 OBSERVE_ONLY**
