# Admissibility and Quarantine Rules

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.ADMISSIBILITY-EVALUATION.01
**Type:** Reusable Doctrine — Quarantine Governance

---

## 1. Purpose

This document defines when and why semantic candidates are quarantined or rejected during Dynamic CEU admissibility evaluation. It governs visible failure, quarantine reasons, and the conditions required for quarantine resolution.

## 2. Quarantine Triggers

Candidates MUST be quarantined when:

### 2.1 Structurally Ambiguous

The candidate maps to a valid domain but has MODERATE or LOW structural compatibility. The structural binding is insufficient for direct admissibility.

- STRUCTURAL_SIGNAL candidates: organizational signal without direct grounding binding
- DIAGNOSTIC_DOMAIN_REFERENCE candidates: chip reference in diagnostic context
- DIAGNOSTIC_SECTION candidates: cross-domain organizational structure

### 2.2 Insufficient Evidence Confidence

The candidate has HIGH structural compatibility but MODERATE or WEAK confidence class. The evidence source provides ambiguous or weak grounding signal.

- DOMAIN_GROUNDING_STATUS with "Weakly Grounded" or "Focus Domain" tags
- Candidates from evidence marked with moderate or weak confidence badges

### 2.3 Conflicting Assertions

Two or more candidates from different evidence sources assert conflicting grounding status for the same domain. The conflict must be resolved through governance review before either candidate can be admitted.

### 2.4 Insufficient Repetition

A candidate targets a domain with evidence from only a single source, and the structural correlation is not HIGH. Multiple evidence sources provide stronger corroboration.

## 3. Rejection Triggers

Candidates MUST be rejected when:

### 3.1 No Domain Resolution

The candidate has candidate_domain = UNMAPPED_CANDIDATE. Without deterministic domain mapping, the candidate cannot enter the overlay proposal pipeline.

Rejection reasons:
- Diagnostic section titles spanning multiple domains
- Capability references without capability-to-domain mapping
- GAUGE artifacts scoped to multiple candidate domains

### 3.2 No Structural Correlation

The candidate type provides no structural context for domain binding. DIAGNOSTIC_CAPABILITY_REFERENCE candidates fall into this category — CAP-XX identifiers cannot be resolved to a single domain.

## 4. Quarantine Visibility

Quarantined candidates MUST be:

- Visible in the cockpit admissibility corridor
- Displayed with explicit QUARANTINED badge
- Accompanied by quarantine_reason explaining why
- Counted separately in the summary
- Grouped by quarantine reason for governance review
- Not hidden, suppressed, or silently discarded

## 5. Rejection Visibility

Rejected candidates MUST be:

- Visible in the cockpit admissibility corridor
- Displayed with explicit REJECTED badge
- Accompanied by admissibility_reason explaining why
- Counted separately in the summary
- Grouped by rejection reason
- Not hidden, suppressed, or silently discarded

## 6. Quarantine Resolution Pathways

Quarantined candidates may be resolved through:

### 6.1 Evidence Strengthening

Additional evidence sources provide stronger signals for the target domain, upgrading confidence from MODERATE/WEAK to STRONG.

### 6.2 Structural Binding

A future corridor establishes explicit structural binding between the candidate's source and the target domain's substrate entities.

### 6.3 Governance Review

A governance review determines that the quarantine reason does not apply or that the candidate should be admitted with conditions.

### 6.4 Conflict Resolution

For conflict-quarantined candidates: the governance review adjudicates the conflicting assertions and determines which candidate(s) should proceed.

## 7. Quarantine Does NOT Mean

- Silent rejection (quarantine is visible, not hidden)
- Permanent rejection (quarantine is potentially resolvable)
- Approval pending (quarantine requires active resolution)
- Low quality (quarantine may indicate ambiguity, not invalidity)

## 8. Governance Flags

The admissibility corridor enforces:

| Flag | Value | Meaning |
|------|-------|---------|
| no_grounding_mutation | true | Admissibility cannot change domain grounding status |
| no_overlay_generation | true | Admissibility cannot produce overlays |
| no_qualification_mutation | true | Admissibility cannot change S-state, Q-class, or gates |
| no_authority_assertion | true | Admissibility cannot assert authority |
| no_lens_mutation | true | Admissibility cannot modify LENS projection |
| admissibility_evaluation_only | true | Only admissibility classification is performed |
| additive_only | true | No existing artifacts or state are modified |
| fail_closed | true | Any failure halts evaluation |
