# PSEE.X — Exploration Casebook

**Stream:** PSEE.X
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document records the concrete exploration cases performed in PSEE.X: the question asked, the evidence examined, the reasoning path taken, and what was learned. Cases are derived from the unknown-space and escalation positions cataloged in unknown_space_inventory.md. Each case produces either a candidate pattern (CP-xx) or a null result (position remains open). No case closes a position — that requires a governed admission stream.

**NOT CANONICAL — NO AUTOMATIC APPLICATION**

---

#### METHODOLOGY LAYER

1. For each exploration case: state the question, evidence examined, reasoning, and outcome.
2. If a pattern emerged: reference the CP-xx entry.
3. If no pattern emerged: state why and what remains open.
4. Cases are grouped by the unknown-space / escalation position they address.

---

#### TECHNICAL LAYER

---

### Case XC-01 — Can Structural Signals Narrow Overlap Pair Identification?

```
source_position:  USP-01 (file-level parity unknown); ESP-01 (architectural structure)
question:         Can observable structural signals (directory name, file count, depth)
                  provide a detection criterion for which CEU pairs to apply R-NRM-02 to,
                  without inferring file_level_parity?
evidence_examined:
  1. rule_catalog_v0.md R-NRM-02 — "structurally similar CEU pairs": uses "same directory
     organization, same module names" as the detection criterion but does not operationalize it.
  2. psee_v0_execution_spec.md Phase 4 Step 4.1 — describes overlap detection as
     "observing structural similarity" without defining what constitutes similarity.
  3. BlueEdge corpus pattern — backend/ appeared in both standalone (CEU-05) and
     platform (CEU-06) with identical depth-1 names. This was the structural signal used.
  4. source_normalization_log.md — normalization reduced backend/backend/ → backend/ but
     then compared standalone/backend/ vs platform/backend/ — the comparison was triggered
     by name identity at normalization output.

reasoning:
  The BlueEdge overlap was detected by post-normalization name identity at the canonical
  path level. The generalization is: after normalization (Phase 1), CEU pairs whose
  canonical paths share identical top-level directory names are candidates for R-NRM-02.
  Directory name identity is observable evidence (Phase A fact), not inference.
  File count within 10% adds a second signal — not because file count proves overlap,
  but because a pair with 5 files vs 500 files is unlikely to be structurally equivalent,
  even if names match.

outcome:
  Pattern emerged: CP-01 (structural similarity signal for overlap candidate identification)
  Open position remaining: USP-01 is not closed — parity still UNKNOWN until diff is performed.
  What was learned: The detection step (which pairs to check) was implicit in PSEE.0;
    it can be made explicit without modifying R-NRM-02. The parity question is separate from
    the detection question.
```

---

### Case XC-02 — Is the 50-File Threshold for Sub-Grouping Structurally Principled?

```
source_position:  PSEE.1/decision_points_catalog.md DP-3-02 (hidden threshold); CT-03
question:         What is the structural basis for the 50-file threshold in R-GRP-02?
                  Is there an alternative signal that would generalize better?
evidence_examined:
  1. rule_catalog_v0.md R-GRP-02 — "large monorepos have multiple layers: repository root
     (infra), application root (entry points), subsystem directories, domain modules."
     The layers are defined by structural role, not file count.
  2. psee_v0_execution_spec.md Phase 3 — "if a domain has more than 50 files, apply R-GRP-02."
     The 50-file number appears once, derived from BlueEdge backend/ having 63 module directories.
  3. BlueEdge sub-grouping execution — backend/ was sub-grouped because it had 63 module
     directories organized in sub-directories (each module directory containing ~5 files).
     The trigger was the presence of structurally regular sub-directories, not the total 63 count.
  4. source_variance_handling.md CT-03 note — "mixed domains (few files but complex
     architecture) may warrant sub-grouping below the threshold." This acknowledges the
     threshold is approximate.

reasoning:
  The 50-file threshold is a BlueEdge-derived approximation of a more principled criterion:
  the presence of sub-directories, each with substantial content (≥5 files).
  A domain with 48 files in 8 sub-directories of 6 files each is architecturally more complex
  than a domain with 55 flat files. The threshold mis-classifies the first (no sub-grouping)
  and correctly classifies the second (sub-grouping, but all flat so the sub-groups would be
  artificial). The more principled signal is sub-directory presence + minimum content per sub-dir.

outcome:
  Pattern emerged: CP-02 (architectural sub-division detection via directory depth)
  Open position remaining: The 50-file threshold in CT-03 remains operative until
    a PSEE.1R stream revises it.
  What was learned: DP-3-02 is a hidden threshold derived from one corpus instance.
    It is not the most precise operationalization of R-GRP-02's stated principle.
    The directory-depth signal is more faithful to the rule's theoretical basis.
    H-01 proximity (BHP-01) is real — the distinction between "observing sub-directories"
    and "assuming architectural responsibility zones" must be maintained explicitly.
```

---

### Case XC-03 — What Does a Minimal Valid Evidence Boundary Document Look Like?

```
source_position:  ESP-02 (exclusion list absent); SV-01 (boundary absent); USP-03
question:         What is the minimum viable structure for an evidence boundary document
                  that satisfies all Phase 0 checks and enables Phase 2 filtering without
                  cascading escalations?
evidence_examined:
  1. psee_v0_execution_spec.md Phase 0 — P0-02 check: "evidence boundary document present."
     No content validation specified.
  2. psee_v0_execution_spec.md Phase 2 — consumes: primary_evidence_origin_paths,
     provenance_only_paths, explicitly_excluded_paths, accepted_evidence_classes.
  3. escalation_and_fallback_spec.md ESC-03 — fires when explicitly_excluded_paths is ABSENT.
     "Absent" means the field is missing, not empty — an explicit empty list satisfies ESC-03.
  4. psee_v0_schema.json — no validation schema for evidence_boundary.md content.
  5. heuristic_admissibility_matrix.md H-11 — source snapshot intake record as construction
     basis for SV-01. H-11 specifies what to capture but not what structure is minimally valid.

reasoning:
  Deriving the minimum from what each consuming step needs:
  - Phase 0 P0-02: needs the file to exist (no content requirement)
  - Phase 2 DP-2-01: needs explicitly_excluded_paths to be present (even if empty)
  - Phase 2 filtering: needs primary_evidence_origin_paths (to know what to process)
  - Phase 5 classification: needs accepted_evidence_classes (to know what types to accept)
  - R-FLT-03: needs provenance_only_paths (may be empty but absence creates an ambiguity gap)
  The minimal viable structure is: all four fields present; three may be empty lists;
  primary_evidence_origin_paths must have at least one entry (no paths = no corpus).

outcome:
  Pattern emerged: CP-03 (evidence boundary minimum viable template)
  Open position remaining: No canonical validation schema for boundary content exists.
    The gap (USP-03) remains — what "valid boundary document" means is not formally defined.
  What was learned: The cascading escalation pattern under SV-01 is avoidable
    if operators are given a minimum viable template. H-11 is useful but incomplete —
    it describes what to observe, not what fields to produce. CP-03 bridges that gap.
```

---

### Case XC-04 — What Vocabulary Triggers R-FLT-02 for Non-BlueEdge Annotations?

```
source_position:  PSEE.1/decision_points_catalog.md DP-2-03 (hidden keyword); DP-S-01
question:         Is the "lightweight" string-match sufficient for new corpora where
                  operators may use different annotation language?
evidence_examined:
  1. rule_catalog_v0.md R-FLT-02 — trigger: source_materials annotation indicating
     reduced authority. The word "lightweight" appears in the BlueEdge boundary document.
  2. psee_v0_execution_spec.md Phase 2 Step 2.3 — "if source_materials contains 'lightweight'
     → ACCEPTED-SUPPORT-ONLY." Single word, string match.
  3. determinism_boundary.md CT-02 — "source_materials annotation present → ACCEPTED-SUPPORT-ONLY;
     semantic equivalents: 'support only', 'metadata only', 'context only'." PSEE.1 already
     recognized this as a semantic class.
  4. BlueEdge boundary document — used "lightweight" to describe extraction process annotations.
     An operator from a different background might use "analysis notes," "auxiliary," "context only."

reasoning:
  The semantic class is well-defined: documents whose epistemic role is reduced-authority
  process artifacts rather than primary source evidence. CT-02 in PSEE.1 already acknowledges
  this but does not formalize the vocabulary. The vocabulary gap is real: an operator who
  writes "context only" would not trigger R-FLT-02 even though the intent is identical.
  The vocabulary can be bounded: {lightweight, support only, metadata only, extraction notes,
  context only, analysis notes, auxiliary} are all in the reduced-authority class.
  The NOT-IN vocabulary: {primary evidence, verified, authoritative} → no downgrade.

outcome:
  Pattern emerged: CP-04 (source materials annotation vocabulary)
  Open position remaining: DP-S-01 (string-match) remains operative until PSEE.0R extends it.
  What was learned: CT-02 in PSEE.1 partially solves this but does not provide a formal list.
    The vocabulary gap is a genuine classification risk for new corpora. The list is bounded
    enough to be formally admitted without creating ambiguity.
```

---

### Case XC-05 — How Should CEU Identifiers Work in Sparse-Tier Corpora?

```
source_position:  FX-05 (priority-tier CEU ordering); SV-02 (archive count ≠ 3)
question:         What happens to CEU-NN identifier assignment when a corpus has no content
                  in one or more canonical priority tiers?
evidence_examined:
  1. rule_catalog_v0.md R-NAM-01 — "CEU-NN identifiers assigned in priority-tier order;
     within each tier: sequential integers starting from last assigned + 1."
  2. psee_v0_schema.json CEU pattern "CEU-[0-9]{2}" — compatible with sequential integers
     without tier-based gaps.
  3. BlueEdge execution — all four tiers had content. Tier 1 (docs): CEU-01/02.
     Tier 2 (extraction): CEU-03/04. Tier 3 (standalone source): CEU-05/06.
     Tier 4 (platform source): CEU-07/08. No empty tiers.
  4. determinism_boundary.md FX-05 — FIXED: priority-tier ordering applies;
     intake_status and evidence_class determine tier membership.

reasoning:
  If a corpus has no Tier 1 content (no documentation), R-NAM-01 produces no CEUs for Tier 1.
  Sequence starts at CEU-01 for the first populated tier (e.g., Tier 3 source trees → CEU-01).
  This is the correct behavior by the rule ("sequential integers within each tier; within
  each tier starting from last assigned + 1" — and if no prior assignments, start from 01).
  No gap, no skip. The sequence is dense and starts at CEU-01 regardless of which tier
  is first populated. The rule handles this implicitly; CP-05 makes it explicit.

outcome:
  Pattern emerged: CP-05 (sparse priority tier handling)
  Open position remaining: None. This is a clarification of existing behavior, not a gap.
  What was learned: R-NAM-01 is implicitly complete for sparse tiers. The only risk is
    a PSEE.2 implementor who hard-codes tier-offset starting points (e.g., Tier 2 starts at
    CEU-10, Tier 3 at CEU-20). CP-05 prevents that interpretation.
```

---

### Case XC-06 — Can Phase 6 Re-run Be Scoped to the Divergent Artifact's Phase Dependency?

```
source_position:  ESP-04 (reconstruction divergence); ESC-06; PSEE.1/decision_state_model.md
question:         When ESC-06 fires, is a full re-run from S-02 always necessary, or can
                  the re-entry point be derived from which Phase B artifact diverged?
evidence_examined:
  1. psee_v0_execution_spec.md Phase 6 — "investigate unmapped units, refine, re-run."
     No scope specified.
  2. decision_state_model.md ESC-06 — S-12 → S-02 (unconditional).
  3. PSEE.0 output artifacts and their producing phases:
     - evidence_surface_inventory (O-01): produced by Phase 3 (S-06/S-07)
     - normalized_evidence_map (O-02): produced by Phase 4 (S-08/S-09)
     - evidence_classification_map (O-03): produced by Phase 5 (S-10/S-11)
     - intake_validation_log (O-04): produced by Phase 5 (S-10/S-11)
  4. Phase-artifact dependency: ESI depends on grouping (S-06); NEM depends on abstracting
     (S-08) which depends on grouping; ECM/IVL depend on classifying (S-10) which depends on
     everything upstream.

reasoning:
  A divergence in O-01 (ESI) means a Phase B unit has no traceable Phase A contributor.
  This could be caused by: (a) a missed path in Phase 1 (S-02); (b) a mis-filtered file in
  Phase 2 (S-04); (c) a mis-grouped domain in Phase 3 (S-06); or (d) a missing rule for
  that type of content. Cases (a)-(c) are in the phase dependency chain; case (d) is a rule
  gap that requires STOP-02. For cases (a)-(c): if the divergent unit maps to O-02 only
  (not O-01), Phase 3 is confirmed correct and re-entry can start at S-08.
  The scoping logic is: earliest phase in the dependency chain of the divergent artifact.
  Full S-02 re-run is only necessary when no artifact-level attribution is possible.

outcome:
  Pattern emerged: CP-06 (convergent re-run scope narrowing)
  Open position remaining: ESP-04 remains open — the divergence cause attribution is
    still operator judgment; CP-06 provides the scoping framework, not an automatic cause detector.
  What was learned: The phase-artifact dependency is deterministic and derivable from
    PSEE.0 execution spec. The ESC-06 unconditional S-02 re-entry is conservative; it
    can be narrowed without loss of correctness if artifact-level attribution is performed first.
```

---

### Case XC-07 — Can the Double-Nesting Pattern Serve as Extraction Log Proxy?

```
source_position:  SV-10 (extraction log absent); ESP-01 (architectural structure); ESC-02
question:         When no extraction log exists and path duplication appears, are there
                  structural signals in the directory content that narrow the classification space?
evidence_examined:
  1. source_normalization_log.md DUP-01 — double-nesting (backend/backend/) caused by
     tar extraction into a named sub-directory when the archive root shares that name.
  2. rule_catalog_v0.md R-NRM-01 theoretical basis — "extraction artifacts are packaging
     artifacts, not architectural or data entities."
  3. psee_v0_execution_spec.md Phase 1 — classification uses extraction log as primary
     evidence; "PACKAGING_BOUNDARY means the duplication is an extraction artifact."
  4. determinism_boundary.md CT-01 — duplication classification with extraction log.
     SV-10 — extraction log absent → escalation risk.

reasoning:
  The double-nesting pattern has a specific structural signature: outer directory contains
  exactly one sub-directory; that sub-directory name = outer directory name; no other files
  in outer directory. This signature is the physical trace of "tar xf x.tar -C dir/x/"
  when x.tar's root is also named x. It is not an inference about archive origin — it is
  direct observation of a directory structure that only exists due to extraction.
  An ARCHITECTURAL_STRUCTURE or EXTRACTION_ARTIFACT case would not produce this exact
  signature: architectural nesting has different content in the outer and inner directories;
  a genuine ARCHITECTURAL_STRUCTURE has files or multiple sub-directories at the outer level.
  The proxy signal is: outer dir has exactly one sub-dir with same name AND outer dir
  contains no files. This is observable Phase A evidence.

outcome:
  Pattern emerged: CP-07 (extraction log proxy signal)
  Open position remaining: ESC-02 still required for confirmation. The proxy narrows from
    UNCLASSIFIABLE to CONDITIONAL_PACKAGING_BOUNDARY; operator confirmation is mandatory.
  What was learned: The double-nesting structural signature is reproducible and derives
    from the physics of tar extraction (TA-01 generalizable principle). The proxy signal
    is structurally grounded. The FB-02 boundary (no inference from system knowledge)
    is not crossed — directory content is Phase A evidence.
```

---

### Case XC-08 — Can Capability Domain Information Be Preserved Without Affecting Intake?

```
source_position:  BHP-03 (capability taxonomy BLOCKED at 40.2); INV-10
question:         Is there a form in which capability domain context from Phase A can be
                  preserved in PSEE outputs without affecting intake_status, evidence_class,
                  or domain grouping decisions?
evidence_examined:
  1. heuristic_admissibility_matrix.md H-03 — capability labels may appear as metadata
     in Phase B semantic layers (40.3+) but must not be used as domain grouping criteria at 40.2.
  2. psee_v0_schema.json — EvidenceDomain and CEU entities have no optional metadata field.
  3. determinism_boundary.md FB-04 — "capability/architecture organization of intake is
     FORBIDDEN." This refers to organizing (grouping) by capability, not to annotating.
  4. doctrine_genealogy.md TRANSITION B — organizational anchor is component/provenance.
     Capability domain does not organize; it contextualizes.
  5. PSEE.1/psee_decision_contract_v1.md INV-10 — "no capability-domain intake."
     This is an invariant, not a prohibition on annotation.

reasoning:
  The distinction is: organizing vs. annotating. TRANSITION B resolved that capability
  cannot organize intake (H-03 → DISCARDED as grouping anchor). But the Phase A corpus
  may contain rich capability domain documentation (e.g., capability_domain_taxonomy.md)
  that would be valuable to 40.3+ consumers. A passthrough annotation that does not feed
  into any rule evaluation preserves context without violating the organizational prohibition.
  The risk is downstream misuse — if a 40.3 consumer treats a "capability_context" field as
  authoritative for intake organization, the isolation fails. This requires schema-level
  enforcement (non_canonical: true; not_for_intake_organization: true).

outcome:
  Pattern emerged: CP-08 (capability metadata passthrough annotation)
  Open position remaining: USP-03 (generic inferrable position) is not closed. The capability
    context from Phase A remains UNKNOWN-SPACE unless a Phase A source explicitly annotates it.
  What was learned: The INV-10 prohibition is on intake organization, not annotation.
    The distinction is valid. The schema gap is real. CP-08 requires careful scoping to
    prevent H-03 territory re-entry through a metadata back door.
```

---

### Case XC-09 — Is There a Structural Analog to the Exclusion List Construction Problem?

```
source_position:  ESP-02 (exclusion list absent / GRAY-ZONE); SV-01 (boundary absent)
question:         When an operator constructs an exclusion list for the first time, what
                  structural patterns indicate which paths should be excluded?
evidence_examined:
  1. escalation_and_fallback_spec.md ESC-03 — operator must provide either a complete
     exclusion list or an explicit declaration of no exclusions.
  2. rule_catalog_v0.md R-FLT-03 — "provenance_only_paths are filtered before Phase A
     evidence extraction." The filter boundary is operator-declared.
  3. BlueEdge evidence_boundary.md — explicitly_excluded_paths included: prior PSEE outputs
     (docs/pios/), telemetry artifacts (monitoring/), case study outputs (docs/case_studies/).
  4. PSEE.0 design rules F.3 — "no BlueEdge-specific module counts or path assumptions
     in canonical rules." Any exclusion template must be corpus-agnostic.

reasoning:
  The BlueEdge exclusion list covers three structural categories: (a) prior analytical outputs
  (anything produced by previous PSEE streams), (b) runtime/telemetry artifacts (monitoring,
  logging, metrics), (c) domain-specific non-evidence (case studies, documentation outputs).
  These categories generalize: any corpus has analytical outputs that are R-FLT-03 candidates,
  operational artifacts that are not evidence, and context documents that are not source.
  A template that asks: "Do you have prior PSEE outputs in this corpus? | Do you have telemetry
  or monitoring artifacts? | Do you have case studies or derived documents?" provides a
  structured entry point for exclusion list construction. No path names are assumed.
  This exploration produced CP-03 (minimum viable template) and CP-09 (refinement log)
  rather than a new candidate — the position maps to existing patterns.

outcome:
  No new pattern: this position is addressed by CP-03 (template) + CP-09 (refinement log).
  Open position remaining: The GRAY-ZONE condition (ESP-02) is inherent to first-time
    boundary construction; CP-03 reduces but does not eliminate it.
  What was learned: The exclusion list construction problem has structural regularity.
    The three-category template is corpus-agnostic. CP-03 should explicitly include
    a "candidate exclusion categories" section. This is noted for the future_review_queue.
```

---

### Exploration Casebook Summary

| Case | Position | Outcome | Candidate |
|---|---|---|---|
| XC-01 | USP-01 / ESP-01 | Pattern emerged | CP-01 |
| XC-02 | DP-3-02 / CT-03 | Pattern emerged | CP-02 |
| XC-03 | ESP-02 / SV-01 / USP-03 | Pattern emerged | CP-03 |
| XC-04 | DP-2-03 / DP-S-01 | Pattern emerged | CP-04 |
| XC-05 | FX-05 / SV-02 | Pattern emerged (clarification) | CP-05 |
| XC-06 | ESP-04 / ESC-06 | Pattern emerged | CP-06 |
| XC-07 | SV-10 / ESC-02 | Pattern emerged | CP-07 |
| XC-08 | BHP-03 / INV-10 | Pattern emerged | CP-08 |
| XC-09 | ESP-02 / SV-01 | Maps to existing | CP-03 + CP-09 (no new CP) |

**9 cases explored; 8 distinct candidates emerged; 1 case maps to existing candidates.**

---

#### EVIDENCE LAYER

| Exploration finding | Source evidence |
|---|---|
| XC-01 (R-NRM-02 detection gap) | rule_catalog_v0.md R-NRM-02 input_pattern |
| XC-02 (50-file threshold) | psee_v0_execution_spec.md Phase 3; CT-03 note |
| XC-03 (ESC-03 field requirement) | escalation_and_fallback_spec.md ESC-03 |
| XC-04 (CT-02 vocabulary) | determinism_boundary.md CT-02 |
| XC-05 (FX-05 sparse) | rule_catalog_v0.md R-NAM-01; determinism_boundary.md FX-05 |
| XC-06 (phase-artifact dependency) | psee_v0_execution_spec.md phases 3-5 output structure |
| XC-07 (DUP-01 signature) | source_normalization_log.md DUP-01 |
| XC-08 (INV-10 annotation vs. org) | psee_decision_contract_v1.md INV-10; heuristic_admissibility_matrix.md H-03 |
| XC-09 (exclusion categories) | rule_catalog_v0.md R-FLT-03; BlueEdge boundary analysis |

---

#### STATUS

| Check | Result |
|---|---|
| Exploration cases documented | 9 (XC-01 through XC-09) |
| Cases producing new candidates | 8 |
| Cases mapping to existing | 1 (XC-09 → CP-03/CP-09) |
| All cases cite evidence sources | CONFIRMED |
| No canonical mutation | CONFIRMED |

**EXPLORATION CASEBOOK: COMPLETE — 9 cases, 8 distinct candidates, 0 canonical mutations**
