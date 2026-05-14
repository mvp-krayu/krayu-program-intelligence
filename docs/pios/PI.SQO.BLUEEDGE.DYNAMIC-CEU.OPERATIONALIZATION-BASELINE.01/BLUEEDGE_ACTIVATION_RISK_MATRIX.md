# BlueEdge Activation Risk Matrix

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.OPERATIONALIZATION-BASELINE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization

---

## 1. Purpose

This document classifies operational risks for BlueEdge Dynamic CEU
activation, assesses their severity and likelihood, and defines
mitigation strategies.

---

## 2. Risk Registry

### R-01: Replay Contamination

**Description:** An overlay introduces state that cannot be deterministically
replayed — breaking the replay reconstruction guarantee.

**Likelihood:** LOW (replay safety is architecturally enforced via package
hashing, deterministic application order, and composite construction algorithm)

**Severity:** CRITICAL (replay failure is a governance event)

**Mitigation:**
- Package hash verification at every activation
- Replay verification after every re-evaluation
- Deterministic conflict resolution rules (no randomness)
- Snapshot at every state change

**Detection:** Replay verification process (differential or full)

### R-02: Overlay Collision

**Description:** Multiple overlays propose conflicting evidence for the
same BlueEdge domains, creating ambiguity.

**Likelihood:** MEDIUM (as overlay count increases, domain overlap becomes
more likely; BlueEdge has 17 domains, 13 unbacked — limited collision space)

**Severity:** MEDIUM (conflict resolution rules handle most cases; escalated
contradictions require governance review)

**Mitigation:**
- Conflict detection at Phase 3 (pre-activation)
- Precedence rules: later package wins, higher confidence overrides
- Contradiction escalation to governance review
- Conflict limits (20 max, 5 escalated max)

**Detection:** Phase 3 eligibility checks, composite construction conflict log

### R-03: Semantic Overreach

**Description:** An overlay makes claims beyond what the source evidence
supports — e.g., claiming EXACT lineage from weak circumstantial evidence.

**Likelihood:** MEDIUM (depends on evidence quality from onboarding streams)

**Severity:** HIGH (inflated qualification state misleads evaluation)

**Mitigation:**
- Grounding boundary: EXACT requires DIRECT_CITATION only
- CONTEXTUAL_DERIVATION caps lineage at STRONG (never EXACT)
- Per-entry provenance chain with source hash
- Confidence basis mandatory for every entry
- Governance review for high-impact overlays

**Detection:** Phase 1 validation (confidence basis check), governance audit

### R-04: Unauthorized Semantic Class Expansion

**Description:** An overlay claims enrichment in semantic classes not
authorized by its source type.

**Likelihood:** LOW (class authorization enforced at 3 points)

**Severity:** MEDIUM (unauthorized enrichment pollutes qualification)

**Mitigation:**
- 3-point enforcement: creation, Phase 2, composite construction
- Source-to-class default mapping
- Override requires explicit justification
- Class expansion in version upgrades escalates to governance review

**Detection:** Phase 2 authorization checks (A-01 through A-05)

### R-05: Hidden Substrate Coupling

**Description:** An overlay's evidence implicitly depends on substrate
details that, if the substrate changes (new pipeline run), would
invalidate the overlay.

**Likelihood:** LOW-MEDIUM (BlueEdge substrate is stable but could be
re-executed in future)

**Severity:** MEDIUM (overlay becomes invalid after substrate change)

**Mitigation:**
- Temporal boundary: substrate must exist before overlay activation
- If substrate is re-executed, all overlays must be re-validated
- Overlay scoped to specific (client, run_id)
- Package provenance links to source material, not to substrate internals

**Detection:** Substrate hash change detection; re-validation trigger

### R-06: Irreversible Qualification Mutation

**Description:** An activation produces a qualification state change that
cannot be cleanly reversed by revocation.

**Likelihood:** VERY LOW (independent removability is architecturally guaranteed)

**Severity:** CRITICAL (defeats the reversibility guarantee)

**Mitigation:**
- Overlay isolation: overlays never modify substrate
- Composite state computed from inputs (never persisted as replacement)
- Revocation triggers re-evaluation from remaining overlays
- Full overlay reset always available

**Detection:** Revocation verification (post-revocation state == state without overlay)

### R-07: Activation Drift

**Description:** Over time, many small overlays accumulate, creating a
qualification state that is increasingly distant from the certified baseline.

**Likelihood:** MEDIUM-HIGH (natural consequence of progressive activation)

**Severity:** LOW-MEDIUM (drift is expected and disclosed; not inherently harmful)

**Mitigation:**
- Overlay attribution mandatory in all evaluation outputs
- Distinction between certified (4/17) and overlay (N/17) backing
- Aggregate limits (10 packages, 200 entries)
- Consolidation model for approaching limits
- Full overlay reset as nuclear option

**Detection:** Overlay attribution ratios in re-evaluation artifacts

### R-08: Certification Invalidation Risk

**Description:** Achieving S3 via overlays and then revoking overlays
causes unexpected S3 → S2 regression, potentially confusing stakeholders
who treated S3 as stable.

**Likelihood:** MEDIUM (S3 via overlay is inherently overlay-dependent)

**Severity:** MEDIUM (regression is correct behavior but may surprise)

**Mitigation:**
- S3 disclosure: composite state with overlay attribution
- Advisory note: "76% of backing is overlay-derived"
- Stakeholder communication: S3 via overlay is overlay-dependent
- Revocation impact analysis available via audit trail

**Detection:** S-state transition events in audit trail

---

## 3. Risk Severity Matrix

| Risk | Likelihood | Severity | Risk Level |
|------|-----------|----------|------------|
| R-01: Replay contamination | LOW | CRITICAL | MEDIUM |
| R-02: Overlay collision | MEDIUM | MEDIUM | MEDIUM |
| R-03: Semantic overreach | MEDIUM | HIGH | HIGH |
| R-04: Unauthorized class expansion | LOW | MEDIUM | LOW |
| R-05: Hidden substrate coupling | LOW-MEDIUM | MEDIUM | LOW-MEDIUM |
| R-06: Irreversible mutation | VERY LOW | CRITICAL | LOW |
| R-07: Activation drift | MEDIUM-HIGH | LOW-MEDIUM | MEDIUM |
| R-08: Certification invalidation | MEDIUM | MEDIUM | MEDIUM |

---

## 4. Risk Mitigation Summary

| Defense Layer | Risks Mitigated |
|--------------|----------------|
| Package hashing + replay verification | R-01, R-06 |
| Conflict detection + resolution rules | R-02 |
| Grounding boundary + confidence gating | R-03 |
| 3-point class authorization enforcement | R-04 |
| Substrate-overlay scope isolation | R-05 |
| Independent removability + composite recomputation | R-06 |
| Aggregate limits + overlay attribution | R-07 |
| Disclosure requirements + S-state regression | R-08 |

---

## 5. Operational Risk Acceptance

| Risk | Acceptance | Condition |
|------|-----------|-----------|
| R-01 | NOT ACCEPTED | Must be zero; replay failure is a governance event |
| R-02 | ACCEPTED | Managed by conflict resolution rules |
| R-03 | ACCEPTED WITH VIGILANCE | Grounding boundary mitigates; audit required |
| R-04 | ACCEPTED | Low likelihood, enforced by architecture |
| R-05 | ACCEPTED | Managed by re-validation on substrate change |
| R-06 | NOT ACCEPTED | Must be zero; reversibility is constitutional |
| R-07 | ACCEPTED | Expected behavior; managed by limits and disclosure |
| R-08 | ACCEPTED | Correct behavior; managed by disclosure |
