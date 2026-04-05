# PSEE.X — Future Review Queue

**Stream:** PSEE.X
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document is the formal queue of candidate patterns assigned FUTURE_REVIEW containment in PSEE.X. Each entry specifies: what is being queued, what stream type is needed to evaluate it, what questions must be answered before admission, and what risk factors must be addressed. Queue entries are advisory only — they do not initiate streams and do not confer any admission status.

**NOT CANONICAL — NO AUTOMATIC APPLICATION**

---

#### METHODOLOGY LAYER

1. For each FUTURE_REVIEW candidate (CP-01/02/04/06/07/08): produce a queue entry.
2. Each entry must specify: the admission-qualifying stream type (PSEE.0R, PSEE.1R, or PSEE.2 implementation note); the required admission questions; the risk factors from admissibility_screening.md; the preconditions that must hold before the queue entry can be acted on.

---

#### TECHNICAL LAYER

---

### FRQ-01 — CP-01: Structural Similarity Signal for Overlap Candidate Identification

```
candidate:          CP-01
containment_class:  FUTURE_REVIEW
screening_result:   CLEAR (no structural conflicts)

admission_stream:   PSEE.0R
  Specifically: annotation to rule_catalog_v0.md R-NRM-02 that adds a detection
  criterion note. This is a documentation addition, not a rule change.
  Alternative: PSEE.2 implementation note (lower barrier; no canonical stream needed).

admission_questions:
  Q1: Is the "identical top-level directory name + file count within 10%" signal sufficient
      to identify all overlap candidates in a non-BlueEdge corpus, or does it produce
      false negatives for corpora with different naming conventions?
  Q2: Can the operator confirmation gate (before OVL record creation) be formally specified
      as a step in R-NRM-02 detection, without creating a new rule entry?
  Q3: Does the 10% file count tolerance introduce any instability (e.g., edge cases at
      exactly the boundary) that a simpler threshold (identical name only) would avoid?

risk_factors:       None from screening.
  Note: the most likely failure mode is over-narrowing (a valid overlap pair with non-identical
  directory names would be missed). The candidate should specify a "fallback to operator
  observation" clause.

preconditions:
  - At least one non-BlueEdge corpus execution (PSEE.2 output) is available for validation.
    The signal should be validated against a real corpus before canonical annotation.

priority:           MEDIUM
  Rationale: R-NRM-02 detection gap is a real usability issue for new corpora but not
  a correctness issue (the operator can always identify pairs manually).
```

---

### FRQ-02 — CP-02: Architectural Sub-Division Detection via Directory Depth

```
candidate:          CP-02
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (H-01 proximity risk; CT-03 revision required)

admission_stream:   PSEE.1R
  Requires: CT-03 threshold revision in determinism_boundary.md.
  If R-GRP-02 theoretical basis is also updated: PSEE.0R additionally required.

admission_questions:
  Q1: Can the ≥5-files-per-sub-directory criterion be proven to be an observable
      structural fact (not an architectural inference) in all corpus structures?
      Specifically: a sub-directory with ≥5 files is not equivalent to an
      "architectural responsibility zone" — what is the formal distinction?
  Q2: Does replacing or supplementing the 50-file threshold with a directory-depth
      criterion produce strictly better results, or does it introduce new edge cases
      (e.g., a corpus with many tiny sub-directories for non-architectural reasons)?
  Q3: How should the CT-03 revision be worded to explicitly exclude H-01 territory?
      The word "architectural" in R-GRP-02 creates a terminological risk.

risk_factors:
  H-01 PROXIMITY — the most significant risk. Any CP-02 admission document must include
  an explicit H-01 distinction section. The admissibility screening risk flag
  (H-01 / FB-04 proximity) must be resolved before admission.
  CONTRA-03 resolution (component track won over capability/architecture track) must
  be cited in the admission stream to confirm CP-02 does not reverse that resolution.

preconditions:
  - At least one corpus exploration where the 50-file threshold produces a mis-classification
    (sub-groups a flat domain or fails to sub-group a structured domain) — empirical evidence.
  - Explicit written distinction between "directory depth as structural evidence" and
    "directory depth as architectural inference" — this is the H-01 firewall.

priority:           MEDIUM-LOW
  Rationale: CT-03 is noted as approximate even in PSEE.1; the risk outweighs the
  benefit until empirical evidence from non-BlueEdge corpora is available.
```

---

### FRQ-03 — CP-04: Source Materials Annotation Vocabulary

```
candidate:          CP-04
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (CT-02 revision; schema annotation)

admission_stream:   PSEE.0R (schema annotation) + PSEE.1R (CT-02 update)
  PSEE.0R: annotate psee_v0_schema.json source_materials field with the recognized
           reduced-authority vocabulary.
  PSEE.1R: update CT-02 to formally reference the vocabulary rather than listing
           ad hoc equivalents.
  These two streams may be combined.

admission_questions:
  Q1: Is the proposed vocabulary exhaustive for the reduced-authority semantic class,
      or are there common annotation patterns not in the list?
  Q2: Does formalizing the vocabulary risk over-triggering R-FLT-02 for annotations
      that superficially match but are not intended to reduce authority?
      Example: a file named "analysis_notes.md" as a primary analysis document, not
      as an extraction note — would "analysis notes" in its source_materials annotation
      trigger R-FLT-02 incorrectly?
  Q3: Should the vocabulary be a canonical list (must match exactly) or a semantic
      category description (match by intent)? The former is more deterministic;
      the latter is more robust but introduces semantic judgment.

risk_factors:
  CT-02 OVER-TRIGGERING — a too-broad vocabulary could downgrade primary evidence
  that merely resembles annotation language.
  Mitigation in Q3: canonical list is safer from a determinism standpoint.

preconditions:
  - Test the vocabulary against at least one non-BlueEdge corpus's boundary documents
    to confirm no false positives.

priority:           HIGH
  Rationale: This gap affects every new engagement. An operator who uses "analysis notes"
  instead of "lightweight" will get incorrect intake_status assignments without any
  escalation or warning. The issue is silent and determinism-violating.
```

---

### FRQ-04 — CP-06: Convergent Re-run Scope Narrowing

```
candidate:          CP-06
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (PSEE.1 decision_state_model.md ESC-06 revision)

admission_stream:   PSEE.1R
  Requires: decision_state_model.md ESC-06 transition updated from unconditional S-02
  to phase-artifact-targeted re-entry with S-02 fallback.
  No PSEE.0 change required.

admission_questions:
  Q1: Is the phase-artifact dependency table (ESI → S-06; NEM → S-08; ECM/IVL → S-10)
      exhaustive? Are there edge cases where a Phase B artifact divergence could be caused
      by a phase earlier than its primary producer?
      Example: a divergent NEM unit that exists because a domain was mis-grouped (S-06)
      rather than because abstraction (S-08) failed — this would require S-06 re-entry,
      not S-08.
  Q2: What is the failure mode if the targeted re-entry is applied but the actual cause
      is in a phase upstream of the re-entry point? The result would be a second divergence
      (STOP-02) that a full S-02 re-run would have avoided.
  Q3: Is the cost reduction sufficient to justify the complexity of targeted re-entry?
      For small corpora, a full S-02 re-run is fast. The optimization matters most for
      large corpora — should the threshold for applying targeted re-entry be corpus-size-gated?

risk_factors:
  INCORRECT ATTRIBUTION — if the PSEE.2 implementor applies the targeted re-entry for
  the wrong phase, it causes a second divergence and STOP-02 instead of a successful re-run.
  This is a correctness regression. The S-02 fallback (no artifact attribution possible)
  must remain available.

preconditions:
  - A formal phase-artifact dependency table verified against PSEE.0 execution spec.
  - An explicit correctness proof: targeted re-entry from S-N produces the same result
    as full re-entry from S-02, given that phases prior to S-N are correct.

priority:           LOW
  Rationale: ESC-06 is rare (LOW recurrence per PSEE.1). The optimization matters for
  large corpora; the complexity is not worth it for the typical case.
  Better addressed as a PSEE.2 implementation note than a PSEE.1R change.
```

---

### FRQ-05 — CP-07: Extraction Log Proxy Signal

```
candidate:          CP-07
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (R-NRM-01 extension; ESC-02 branch modification; FB-02 proximity)

admission_stream:   PSEE.0R (R-NRM-01 conditional state) + PSEE.1R (ESC-02 branch)

admission_questions:
  Q1: Is the structural signature (outer dir contains exactly one same-named sub-dir,
      no files in outer dir) truly specific to extraction artifacts, or can it appear
      in genuine ARCHITECTURAL_STRUCTURE cases?
      Example: a monorepo where the outer "backend/" directory is a namespace container
      with only one sub-project "backend/" — same signature, different cause.
  Q2: If admitted, what is the CONDITIONAL_PACKAGING_BOUNDARY state's downstream handling?
      Does it suspend ESC-02 entirely until operator confirmation, or does ESC-02 still
      fire with the proxy signal as supporting evidence?
  Q3: What is the operator's obligation when the proxy signal is present but operator
      judgment overrides it (classifies as ARCHITECTURAL_STRUCTURE)? Is the proxy evidence
      recorded in the escalation_log?

risk_factors:
  FB-02 PROXIMITY — the critical risk. This must be addressed head-on in the admission stream:
  the proxy signal is an observation of Phase A directory content, not an inference about
  archive origin. The admission stream must include an explicit FB-02 non-violation argument.
  FALSE POSITIVE RISK — the monorepo namespace case in Q1 is real. Admission must include
  a corpus-validated false positive rate assessment.

preconditions:
  - Confirmation that the monorepo namespace case (Q1) does not produce the exact proxy
    signature (typically, a namespace container has README.md or other files in the outer dir).
  - At least one non-BlueEdge corpus with extraction log absent tested for proxy signal accuracy.

priority:           MEDIUM
  Rationale: SV-10 (extraction log absent) is a real variance; ESC-02 frequency is MEDIUM
  for new corpora. Reducing unnecessary escalations has practical value.
  The FB-02 argument must be watertight before admission.
```

---

### FRQ-06 — CP-08: Capability Metadata Passthrough Annotation

```
candidate:          CP-08
containment_class:  FUTURE_REVIEW
screening_result:   CONDITIONAL (schema update; H-03/FB-04 proximity)

admission_stream:   PSEE.0R (schema update to psee_v0_schema.json)

admission_questions:
  Q1: Is the "non_canonical: true, not_for_intake_organization: true" schema annotation
      sufficient to prevent downstream consumers from misusing the field?
      Or are additional runtime guards needed (e.g., PSEE.2 refusing to populate the field
      if the input capability taxonomy is from a source that was BLOCKED as H-03)?
  Q2: Should the field be on EvidenceDomain, CEU, or both? CEU-level annotation is more
      granular; Domain-level is more consistent with how capability domains are expressed in
      Phase A corpus (taxonomy.md documents describe domain-level, not file-level, capability).
  Q3: What is the traceability requirement for the capability_context value? Must it cite a
      specific Phase A source file (e.g., capability_domain_taxonomy.md line 42) or is a
      free-text annotation acceptable?

risk_factors:
  H-03 / FB-04 PROXIMITY — the most significant risk. Any capability-related field in
  PSEE outputs risks re-activating the H-03 pattern through a metadata channel.
  The admission stream must demonstrate that 40.3+ consumers cannot use capability_context
  to reverse-engineer intake organization decisions.
  DOCTRINE GENEALOGY — TRANSITION B (component/provenance anchor) resolved against H-03.
  The admission must argue that a non-authoritative annotation does not reverse TRANSITION B.

preconditions:
  - A 40.3 layer consumer specification is available that can confirm isolation requirements.
    Without knowing how 40.3 consumes PSEE outputs, the risk cannot be fully assessed.
  - An explicit schema enforcement mechanism (not just documentation) for non_canonical field.

priority:           LOW
  Rationale: The information (capability context) is currently discarded without loss
  to the intake process. The benefit (downstream 40.3 context) is real but not urgent.
  The proximity risks require careful governance; rushing admission creates H-03 re-entry risk.
```

---

### Future Review Queue Summary

| FRQ ID | Candidate | Stream Needed | Priority | Key Risk |
|---|---|---|---|---|
| FRQ-01 | CP-01 | PSEE.0R annotation or PSEE.2 note | MEDIUM | False negatives on non-identical names |
| FRQ-02 | CP-02 | PSEE.1R (CT-03 revision) | MEDIUM-LOW | H-01 / FB-04 proximity |
| FRQ-03 | CP-04 | PSEE.0R + PSEE.1R (CT-02) | HIGH | CT-02 over-triggering |
| FRQ-04 | CP-06 | PSEE.1R (ESC-06 transition) | LOW | Incorrect phase attribution |
| FRQ-05 | CP-07 | PSEE.0R + PSEE.1R (ESC-02) | MEDIUM | FB-02 proximity; false positives |
| FRQ-06 | CP-08 | PSEE.0R (schema update) | LOW | H-03 / FB-04 re-entry risk |

**Recommended action order by priority: FRQ-03 → FRQ-01 → FRQ-05 → FRQ-02 → FRQ-04 → FRQ-06**

---

#### EVIDENCE LAYER

| Queue entry | Source |
|---|---|
| FRQ-01 admission questions | XC-01 exploration case; R-NRM-02 detection criterion gap |
| FRQ-02 risk factor | admissibility_screening.md CP-02 Gate 3; CONTRA-03 |
| FRQ-03 priority HIGH | PSEE.1/determinism_boundary.md CT-02; silent misclassification risk |
| FRQ-04 admission questions | PSEE.1/decision_state_model.md ESC-06; phase-artifact dependency |
| FRQ-05 risk factor | admissibility_screening.md CP-07 FB-02 proximity |
| FRQ-06 preconditions | PSEE.1/heuristic_admissibility_matrix.md H-03; psee_decision_contract_v1.md INV-10 |

---

#### STATUS

| Check | Result |
|---|---|
| All 6 FUTURE_REVIEW candidates queued | CONFIRMED (FRQ-01..06) |
| Admission stream type specified for each | CONFIRMED |
| Admission questions specified for each | CONFIRMED |
| Risk factors addressed for each | CONFIRMED |
| Priority order stated | CONFIRMED |
| No canonical mutation | CONFIRMED |

**FUTURE REVIEW QUEUE: COMPLETE — 6 entries, admission paths defined, risks documented**
