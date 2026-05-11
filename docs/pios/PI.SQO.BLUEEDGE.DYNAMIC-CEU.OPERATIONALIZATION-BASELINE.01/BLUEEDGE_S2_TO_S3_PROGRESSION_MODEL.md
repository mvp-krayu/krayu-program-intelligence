# BlueEdge S2 → S3 Progression Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.OPERATIONALIZATION-BASELINE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization

---

## 1. Purpose

This document defines how BlueEdge may progress from S2 (partial grounding)
to S3 (full grounding) through governed Dynamic CEU overlays, without
invalidating prior certification.

---

## 2. S2 → S3 Gate Requirements

Per MINIMUM_SEMANTIC_ENVELOPE_SPECIFICATION:

**S3 requires:** `backed_count == total_count`

For BlueEdge: `backed_count must reach 17/17`

Current: `backed_count = 4/17`

**Gap:** 13 domains require lineage upgrade to STRONG or EXACT.

**Additional S3 gate requirements (already met by BlueEdge S2):**
- All 6 required artifacts present: YES (pipeline-certified)
- semantic_level != STRUCTURAL_LABELS_ONLY: YES (full semantic model)
- At least 1 domain with EXACT or STRONG lineage: YES (4 domains)
- Crosswalk with at least 1 mapping: YES (13 entities)
- Decision validation with at least 1 check: YES (14/14)
- Reproducibility verdict defined: YES (FULL_REPRODUCIBILITY)

**The ONLY remaining S3 gate is full domain backing.**

---

## 3. Domain-by-Domain Progression Map

### 3.1 Currently Backed Domains (4/17)

| Domain | Lineage | Status | Overlay Needed |
|--------|---------|--------|----------------|
| 3 EXACT domains | EXACT | BACKED | NO — already at maximum |
| 1 STRONG domain | STRONG | BACKED | NO — already sufficient |

These 4 domains are immutable anchors. Dynamic CEU does not touch them.

### 3.2 Domains Requiring Upgrade (13/17)

| Category | Count | Current Lineage | Target Lineage | Evidence Required |
|----------|-------|----------------|----------------|-------------------|
| NONE → STRONG | 12 | NONE | STRONG (minimum) | DIRECT_CITATION or STRONG_INFERENCE of structural correspondence |
| WEAK → STRONG | 1 | WEAK | STRONG (minimum) | DIRECT_CITATION or STRONG_INFERENCE of structural correspondence |
| NONE → EXACT | 12 | NONE | EXACT (optimal) | DIRECT_CITATION of explicit structural identity mapping |
| WEAK → EXACT | 1 | WEAK | EXACT (optimal) | DIRECT_CITATION of explicit structural identity mapping |

**Note:** STRONG is sufficient for backed_count. EXACT is stronger but
requires stricter evidence. Pragmatically, upgrading to STRONG with
DIRECT_CITATION evidence is the safest pathway.

### 3.3 Evidence Source Requirements per Domain

Each domain lineage upgrade requires evidence from BlueEdge source
material demonstrating structural correspondence:

- Architecture Decision Records (ADRs) defining module-to-domain mappings
- Component documentation with explicit business domain references
- Capability models mapping structural components to business capabilities
- Architecture records showing structural groups' business function

---

## 4. Progression Phases

### Phase A — First Overlay (2–4 domains)

**Target:** Upgrade 2–4 domains with strongest available evidence.
**Expected result:** backed_count = 6–8/17, Q-02 maintained.
**Purpose:** Establish operational precedent and verify governance machinery.

**Candidate domains:** Those with the clearest structural-to-business
correspondence in available documentation. Priority to domains where
DIRECT_CITATION evidence exists.

### Phase B — Expansion (5–8 additional domains)

**Target:** Upgrade 5–8 additional domains (total: 9–14/17 backed).
**Expected result:** backed_count = 9–14/17, Q-02 with significant backing.
**Purpose:** Demonstrate scaled overlay activation with coexistence.

**Governance considerations:**
- Multiple packages may coexist (per cohabitation rules)
- Conflict detection active across packages
- Aggregate limits apply (200 total entries)
- Each package independently removable

### Phase C — Completion (remaining domains)

**Target:** Upgrade remaining domains to reach 17/17 backed.
**Expected result:** backed_count = 17/17, Q-01 (FULL_GROUNDING), S3 gate met.
**Purpose:** Achieve S3 qualification state via governed overlay evidence.

**Critical governance:**
- S3 transition is the highest-impact qualification change
- All overlay contributions MUST be individually verifiable
- Overlay attribution MUST distinguish certified (4) from overlay (13) backing
- The S3 state is COMPOSITE — it depends on overlays remaining active

---

## 5. S3 Qualification State (Projected)

### 5.1 Composite State at S3

```
backed_count:          17/17 (4 certified + 13 overlay)
Q-class:               Q-01 (FULL_GROUNDING)
S-state:               S3
semantic_continuity:   VALIDATED
progression_readiness: 1.0 (no blocking debt)

Overlay attribution:
  static_backed:   4/17 (pipeline-certified)
  overlay_backed:  13/17 (Dynamic CEU overlays)
  total_backed:    17/17 (composite)
```

### 5.2 S3 Disclosure Requirements

When S3 is achieved via overlay contributions:

1. **S3 is COMPOSITE.** The qualification state depends on 4 certified +
   13 overlay-backed domains. This MUST be disclosed.
2. **Overlay attribution is mandatory.** Every evaluation output must
   distinguish certified from overlay backing.
3. **Revocation sensitivity.** Revoking overlays that provide 13 of 17
   backing domains would regress S3 → S2 immediately.
4. **Advisory note.** S3 achieved via overlay evidence carries an
   advisory note that 76% of backing is overlay-derived.

### 5.3 What S3 Does NOT Mean

S3 via overlay does NOT mean:
- The substrate has been re-run (substrate is unchanged)
- Pipeline grounding has improved (Static CEU is still 4/17)
- Evidence is permanent (overlays can be revoked)
- Domain backing is pipeline-certified (it is overlay-certified)

S3 via overlay DOES mean:
- All 17 domains have verifiable structural correspondence evidence
- Evidence is provenance-bound, replay-safe, and independently removable
- Qualification evaluation considers the complete semantic surface
- Semantic debt related to grounding gaps is resolved (via overlay)

---

## 6. Progression Invariants

Throughout the S2 → S3 progression:

| Invariant | Enforcement |
|-----------|-------------|
| Certified substrate unchanged | Immutability boundary — 9 protected elements |
| Each overlay independently removable | Revocation model — independent removability guarantee |
| Q-class formula unchanged | Governance-locked — same formula applied to composite |
| Replay reconstructable at any point | 5-input replay model — snapshot at every re-evaluation |
| Overlay attribution transparent | Mandatory disclosure — certified vs overlay backing |
| Backward progression possible | Revocation → re-evaluation → lower backed_count → lower S-state |

---

## 7. Progression Risk Profile

| Phase | Risk Level | Primary Risk | Mitigation |
|-------|-----------|-------------|------------|
| Phase A (first overlay) | LOW | Governance process friction | Small scope (2–4 domains) limits impact |
| Phase B (expansion) | MEDIUM | Overlay coexistence complexity | Cohabitation rules, conflict detection |
| Phase C (completion) | MEDIUM-HIGH | S3 dependency on overlays | Disclosure requirements, revocation sensitivity awareness |

---

## 8. Progression Governance

1. Each progression phase requires its own onboarding execution stream.
2. Each phase's overlays are independently activated and independently removable.
3. S3 achievement does not lock overlays — they remain revocable.
4. If any overlay is revoked after S3, S-state automatically regresses.
5. Progression is not irreversible — it is governed, overlay-dependent state.
