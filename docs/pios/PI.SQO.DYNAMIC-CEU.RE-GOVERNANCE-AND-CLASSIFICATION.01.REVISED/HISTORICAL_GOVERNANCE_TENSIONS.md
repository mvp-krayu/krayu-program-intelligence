# Historical Governance Tensions

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete)

---

## 1. Purpose

This document identifies, documents, and resolves the governance tensions
that emerged across the three eras of Dynamic CEU evolution. Each tension
represents a point where the evolving governance model encountered internal
contradiction, ambiguity, or conceptual friction.

---

## 2. Tension Registry

### T-01: Enrichment vs Activation

**Era of origin:** Early (governance exploration)
**Source authority:** SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md

**Tension:** The 21-stream exploration investigated whether semantic enrichment
IS semantic activation. If enrichment modifies the semantic state of an artifact,
is it activating semantic authority?

**Resolution:** RESOLVED in Mid Era.
- Enrichment = additive overlay that augments evaluation without modifying substrate
- Activation = granting semantic authority to modify certified artifacts
- Dynamic CEU performs enrichment, not activation
- The overlay model ensures that enrichment never becomes activation: certified
  artifacts remain immutable; overlays contribute to COMPOSITE evaluation only

**Current era enforcement:**
- Immutability boundary (9 protected elements)
- Overlay isolation architecture
- Pre-activation requirement: "No substrate mutation"

---

### T-02: Commercial Necessity for Semantic Authority

**Era of origin:** Early (governance exploration)
**Source authority:** SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md

**Tension:** The exploration concluded that commercial necessity for semantic
authority was NOT established. Yet the mid era proceeded to design Dynamic CEU.
Is Dynamic CEU implicitly establishing semantic authority without commercial
justification?

**Resolution:** RESOLVED in Current Era.
- Dynamic CEU does NOT establish semantic authority
- It establishes EVIDENCE authority — the right to present governed evidence
  that augments qualification evaluation
- Evidence authority is commercially justified: clients need to progress from
  S1→S2→S3, which requires semantic debt resolution, which requires external
  evidence beyond the deterministic pipeline
- The distinction is critical: semantic authority = right to declare semantic truth;
  evidence authority = right to present governed evidence for evaluation

**Current era enforcement:**
- Semantic class authorization model (restricts evidence scope)
- Provenance requirements (evidence must be traceable to external source)
- Qualification re-evaluation (evidence is EVALUATED, not DECLARED)

---

### T-03: DPSIG Sovereignty vs Dynamic Enrichment

**Era of origin:** Early/Mid (lane architecture)
**Source authority:** SQO_LANE_ARCHITECTURE.md, SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md

**Tension:** DPSIG is declared Lane D sovereign and immutable. Dynamic CEU
operates within the SQO lane. Can Dynamic CEU produce overlays that reference,
contextualize, or qualify DPSIG signals without violating sovereignty?

**Resolution:** RESOLVED in Mid Era, confirmed in Current Era.
- Dynamic CEU MAY reference DPSIG output as read-only input
- Dynamic CEU MUST NOT modify, reinterpret, or override DPSIG signals
- DPSIG signals are immutability-boundary-protected elements
- Overlays may OBSERVE DPSIG state but cannot ENRICH it

**Current era enforcement:**
- Immutability boundary: "Modify DPSIG signals — PROHIBITED"
- Scope boundary: overlays scoped to (client, run_id), not to signal-layer
- Claim boundary: no claim type maps to DPSIG modification

---

### T-04: Static CEU Completeness vs Dynamic CEU Necessity

**Era of origin:** Mid (CEU Paradox)
**Source authority:** DYNAMIC_CEU_GOVERNANCE_MODEL.md

**Tension:** If Static CEU is the pipeline-certified grounding truth, and
Dynamic CEU adds overlays on top, does this imply that Static CEU is
incomplete? If so, should the pipeline be improved rather than adding
an overlay layer?

**Resolution:** RESOLVED in Mid Era via the CEU Paradox.
- Static CEU IS complete for structural grounding (what the pipeline can determine)
- Structural grounding completeness ≠ semantic maturity completeness
- FastAPI: 0.90 structural grounding, 0/9 semantic domains grounded
- The pipeline cannot determine semantic domain grounding — that requires
  external evidence (business context, architecture decisions, operational history)
- Dynamic CEU is not a patch for pipeline failure; it is a SEPARATE evaluation
  dimension that the pipeline CANNOT and SHOULD NOT perform

**Current era enforcement:**
- Static vs Dynamic CEU separation model
- 9 protected elements that Dynamic CEU must never mutate
- Composite evaluation with overlay attribution

---

### T-05: Deterministic Relational Enrichment vs Dynamic CEU

**Era of origin:** Early/Mid (governance exploration closure → mid era design)
**Source authority:** SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md, DYNAMIC_CEU_GOVERNANCE_MODEL.md

**Tension:** The governance exploration closure recommended "Deterministic
Relational Enrichment" as the forward direction. The mid era designed
"Dynamic CEU" instead. Are these the same thing? Is Dynamic CEU a deviation
from the recommended forward direction?

**Resolution:** RESOLVED — they are convergent.
- "Deterministic Relational Enrichment" = governance-first, replay-safe, additive
  enrichment that respects structural relationships
- Dynamic CEU (as formalized in current era) = governed, replay-safe, additive
  semantic evidence activation within SQO qualification
- The SEP architecture satisfies ALL properties that "Deterministic Relational
  Enrichment" demanded:
  1. Deterministic: package hashing, ordered application, deterministic recomputation
  2. Relational: scoped to (client, run_id), respects structural topology
  3. Enrichment: additive overlays, never mutation
  4. Governed: 9 pre-activation requirements, 5 activation boundaries, 7 semantic classes

**Current era enforcement:**
- The entire SEP architecture IS the Deterministic Relational Enrichment the
  governance exploration recommended — formalized under the name "Dynamic CEU"

---

### T-06: Replay Safety Across Eras

**Era of origin:** Mid (replay-safe enrichment model)
**Source authority:** REPLAY_SAFE_ENRICHMENT_MODEL.md

**Tension:** Mid era defined 5 replay-safe guarantees (R1–R5) and 6 overlay
rules (OV-01 through OV-06). Current era defined SEP overlay architecture
with package hashing and deterministic ordered application. Are the mid era
guarantees preserved, or has the current era introduced replay safety gaps?

**Resolution:** RESOLVED — no gaps.
- R1 (deterministic derivation): preserved via deterministic overlay application order
- R2 (additive-only persistence): preserved via overlay isolation (never modifies substrate)
- R3 (source immutability): preserved via source hash in provenance chain
- R4 (hash-anchored provenance): preserved and EXTENDED via package-level hashing
- R5 (operation versioning): preserved via monotonic integer versioning
- OV-01 through OV-06: subsumed by the more comprehensive overlay architecture

**Current era enforcement:**
- Replay verification process in REPLAY_SAFE_OVERLAY_ARCHITECTURE.md
- Package hashing at SEP level (extends R4)
- Ordered layered application with conflict resolution rules

---

### T-07: Evidence Standard Asymmetry

**Era of origin:** Mid/Current (grounding design → activation boundaries)
**Source authority:** GROUNDING_DESIGN_SPECIFICATION.md, DYNAMIC_CEU_ACTIVATION_BOUNDARIES.md

**Tension:** The early era's grounding design required DIRECT evidence mapping
(11-step algorithm, 6 allowed sources). Current era's activation boundaries
allow 3 confidence tiers (DIRECT_CITATION, STRONG_INFERENCE, CONTEXTUAL_DERIVATION).
Does CONTEXTUAL_DERIVATION violate the early era's evidence standard?

**Resolution:** RESOLVED — no violation.
- Early era grounding design applies to STATIC CEU — pipeline-certified mappings
  where only direct, deterministic evidence is acceptable
- Current era confidence tiers apply to DYNAMIC CEU — external evidence overlays
  where the evidence basis MUST be disclosed and confidence level GATES what
  claims are allowed (CONTEXTUAL_DERIVATION caps lineage at STRONG, never EXACT)
- The key distinction: Static CEU has no confidence tier because ALL mappings
  are either pipeline-verified (GROUNDED) or not (NON_GROUNDED)
- Dynamic CEU requires confidence tiers because external evidence has varying
  degrees of authority

**Current era enforcement:**
- Grounding boundary: EXACT lineage requires DIRECT_CITATION only
- CONTEXTUAL_DERIVATION capped at STRONG (never EXACT)
- Provenance requirements: confidence basis is mandatory for every entry
- Activation impact disclosure: overlay attribution is mandatory

---

### T-08: Multi-Package Aggregation Limits

**Era of origin:** Current (new governance)
**Source authority:** MULTI_PACKAGE_COHABITATION_RULES.md

**Tension:** No prior era addressed multi-package cohabitation. The current
era introduces limits (10 packages, 50 entries/package, 200 total entries).
These limits are governance decisions without historical precedent. Are they
adequately grounded?

**Resolution:** PARTIALLY RESOLVED — governance decision without historical authority.
- The limits are NEW governance — not derived from any prior era authority
- They are PROTECTIVE governance: caps prevent unbounded overlay accumulation
- They are consistent with the governance philosophy established in all eras:
  enrichment must be bounded, controlled, and auditable
- The specific numeric limits (10/50/200) are implementation governance decisions
  that may be adjusted in future based on operational experience

**Current era enforcement:**
- Pre-activation requirement: "Entry count within limits"
- Pre-activation requirement: "Aggregate limits respected"
- Multi-package cohabitation rules: consolidation model for approaching limits

---

## 3. Tension Resolution Summary

| Tension | Status | Era Resolved |
|---------|--------|-------------|
| T-01: Enrichment vs Activation | RESOLVED | Mid Era |
| T-02: Commercial Necessity | RESOLVED | Current Era |
| T-03: DPSIG Sovereignty | RESOLVED | Mid Era, confirmed Current |
| T-04: Static CEU Completeness | RESOLVED | Mid Era (CEU Paradox) |
| T-05: DRE vs Dynamic CEU | RESOLVED | Current Era (convergent) |
| T-06: Replay Safety Across Eras | RESOLVED | Current Era (no gaps) |
| T-07: Evidence Standard Asymmetry | RESOLVED | Current Era (Static ≠ Dynamic standards) |
| T-08: Multi-Package Limits | PARTIALLY RESOLVED | New governance, no precedent |

---

## 4. Open Governance Considerations

1. **T-08 limits may need operational calibration.** The 10/50/200 limits are
   governance design decisions without historical validation. Runtime experience
   may require adjustment.

2. **Evidence authority vs semantic authority distinction (T-02) requires ongoing
   vigilance.** If Dynamic CEU is ever used to DECLARE semantic truth rather than
   PRESENT evidence for evaluation, the T-02 resolution is violated.

3. **DPSIG sovereignty (T-03) must be re-validated if any future Dynamic CEU
   extension proposes signal-layer interaction.** Current architecture is safe;
   future extensions must re-prove safety.
