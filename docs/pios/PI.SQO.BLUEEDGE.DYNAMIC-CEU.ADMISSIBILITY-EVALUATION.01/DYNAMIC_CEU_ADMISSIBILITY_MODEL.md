# Dynamic CEU Admissibility Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.ADMISSIBILITY-EVALUATION.01
**Type:** Reusable Doctrine — Admissibility Model

---

## 1. Purpose

This document defines the admissibility evaluation model used to classify semantic candidates into admissible, quarantined, rejected, or unresolved states. It governs how candidates are assessed for structural compatibility, replay safety, conflict status, and evidence repetition.

## 2. Admissibility States

Four states are defined:

### ADMISSIBLE

The candidate has passed all admissibility checks and may proceed to future overlay proposal corridors.

- Structural compatibility: HIGH
- Confidence class: STRONG
- Replay compatibility: COMPATIBLE
- Conflict status: NONE
- Required next step: OVERLAY_PROPOSAL_ELIGIBLE

### QUARANTINED

The candidate has structural presence but insufficient evidence strength, structural correlation, or conflict-free status for direct admissibility.

- Structural compatibility: HIGH (with MODERATE/WEAK confidence), MODERATE, or LOW
- Admissibility confidence: LOW
- Required next step: QUARANTINE_REVIEW_REQUIRED

Quarantine reasons include:
- Moderate evidence strength with high structural correlation
- Moderate structural correlation without strong binding
- Low structural correlation with cross-domain scope
- Conflicting grounding assertions

### REJECTED

The candidate cannot proceed without fundamental changes to domain resolution or evidence strength.

- Either: UNMAPPED domain (no deterministic resolution)
- Or: NONE structural compatibility (no domain context)
- Admissibility confidence: N_A
- Required next step: REJECTED

### UNRESOLVED

The candidate could not be deterministically classified by the evaluation rules.

- Fallback state for edge cases
- Required next step: ADDITIONAL_EVIDENCE_REQUIRED

## 3. Evaluation Fields

Each admissibility evaluation produces:

```
candidate_id              string   From input candidate
admissibility_state       string   ADMISSIBLE | QUARANTINED | REJECTED | UNRESOLVED
admissibility_reason      string   Human-readable explanation
structural_compatibility  string   HIGH | MODERATE | LOW | NONE
evidence_repetition_score number   Count of evidence sources targeting same domain
replay_compatibility      string   COMPATIBLE | UNCERTAIN | INCOMPATIBLE
conflict_status           string   NONE | DETECTED
quarantine_reason         string   Null or quarantine explanation
admissibility_confidence  string   HIGH | LOW | N_A
required_next_step        string   Next required action
authority_state           string   NON_AUTHORITATIVE_ADMISSIBILITY_RESULT
```

## 4. Structural Compatibility

Structural compatibility is determined by candidate type:

| Candidate Type | Structural Compatibility |
|---------------|------------------------|
| DOMAIN_GROUNDING_STATUS | HIGH |
| FOCUS_DOMAIN_DESIGNATION | HIGH |
| GAUGE_ARTIFACT_TITLE | HIGH |
| GAUGE_CLAIM_LABEL | HIGH |
| GAUGE_METRIC_VALUE | HIGH |
| STRUCTURAL_SIGNAL | MODERATE |
| DIAGNOSTIC_DOMAIN_REFERENCE | MODERATE |
| DIAGNOSTIC_SECTION | LOW |
| DIAGNOSTIC_CAPABILITY_REFERENCE | NONE |

HIGH indicates direct structural correlation to substrate entities. MODERATE indicates organizational signal without direct binding. LOW indicates cross-domain scope. NONE indicates no structural context.

## 5. Admissibility Determination Rules

Rules are applied in priority order. First matching rule determines the state.

1. **UNMAPPED → REJECTED**: If candidate_domain is UNMAPPED_CANDIDATE
2. **NONE structural → REJECTED**: If structural_compatibility is NONE
3. **Conflict → QUARANTINED**: If conflict detected for target domain
4. **HIGH + STRONG → ADMISSIBLE**: High structural with strong confidence
5. **HIGH + MODERATE → QUARANTINED**: High structural but insufficient confidence
6. **HIGH + WEAK → QUARANTINED**: High structural but weak evidence
7. **MODERATE → QUARANTINED**: Moderate structural regardless of confidence
8. **LOW → QUARANTINED**: Low structural regardless of confidence
9. **Fallback → UNRESOLVED**: No rule matched

## 6. Evidence Repetition Score

The evidence repetition score counts distinct evidence sources (evidence_id) that produce candidates targeting the same domain. Higher scores indicate more corroborated domain targeting.

- Score 1: Single evidence source for domain
- Score 2+: Multiple evidence sources corroborate domain targeting
- Score 0: Unmapped candidates

## 7. Replay Compatibility

All candidates from hash-verified deterministic extraction are COMPATIBLE. Replay compatibility evaluates whether a candidate would preserve:

- Replay determinism (same inputs → same evaluation)
- Rollback determinism (revocation restores prior state)
- Overlay removability (candidate contribution independently removable)
- Authority isolation (no authority leakage from evaluation)

## 8. Conflict Detection

Conflict detection checks for competing grounding assertions:

- Multiple DOMAIN_GROUNDING_STATUS candidates from different evidence sources targeting the same domain with different labels
- Currently: no conflicts detected in the BlueEdge evidence corpus (single Tier 1 source for domain grounding)

## 9. Authority Boundary

All evaluations carry:

```
authority_state: NON_AUTHORITATIVE_ADMISSIBILITY_RESULT
```

Admissibility evaluation does NOT produce:
- Semantic authority
- Grounding evidence
- Overlay proposals
- Qualification deltas
- LENS-consumable projections
- Publication eligibility

## 10. Pipeline Position

```
Semantic Candidates (NON_AUTHORITATIVE_SEMANTIC_CANDIDATE)
  ↓ [PI.SQO.BLUEEDGE.DYNAMIC-CEU.ADMISSIBILITY-EVALUATION.01] ← THIS CORRIDOR
Admissibility Evaluations (NON_AUTHORITATIVE_ADMISSIBILITY_RESULT)
  ↓ [FUTURE: Overlay proposal corridor]
Overlay Proposals (proposed, governance-reviewed)
  ↓ [FUTURE: Qualification delta calculation]
Qualification Deltas (computed, applied)
  ↓ [FUTURE: Authority certification]
Certified Authority (consumable by LENS)
```
