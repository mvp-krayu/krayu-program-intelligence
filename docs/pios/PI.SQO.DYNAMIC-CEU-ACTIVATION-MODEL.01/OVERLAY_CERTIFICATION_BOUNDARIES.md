# Overlay Certification Boundaries

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines the boundaries that constrain overlay activation
to ensure substrate immutability, replay safety, and governance
compliance. These boundaries are the architectural guarantee that
Dynamic CEU activation never becomes runtime semantic mutation.

---

## 2. Boundary Types

### 2.1 Temporal Boundary

An overlay MAY ONLY be activated AFTER the following preconditions
are met for the target (client, run_id):

| Precondition | Verification |
|-------------|-------------|
| Certified substrate exists | Pipeline execution complete with FULL_REPRODUCIBILITY |
| Qualification state evaluated from Static CEU | State detection engine has produced initial S-state |
| Semantic debt inventory computed | Debt engine has produced debt inventory artifact |
| Maturity scores computed | Maturity engine has produced dimension scores |
| DPSIG signals available | CPI/CFA computed and available as read-only input |

**Rule:** Dynamic CEU cannot substitute for an absent certified substrate.
It can only augment an existing one.

**Rule:** If the substrate is re-executed (new pipeline run), all overlays
must be re-validated against the new substrate before contributing to
the new evaluation.

### 2.2 Scope Boundary

An overlay is scoped to a single `(client, run_id)` pair:

| Prohibition | Enforcement |
|------------|-------------|
| Cross-client enrichment | Package client must match target client |
| Cross-run enrichment | Package run_id must match target run_id |
| Global enrichment | No mechanism for non-scoped enrichment |
| Template enrichment | Enrichment applies to specific run, not templates |

### 2.3 Claim Boundary

An overlay's evidence entries may ONLY make claims within the authorized
claim type taxonomy:

```
LABEL_ASSIGNMENT
LINEAGE_UPGRADE
CONTINUITY_MAPPING
CAPABILITY_BINDING
EDGE_ENRICHMENT
DOMAIN_TYPING
```

Claims outside this taxonomy are REJECTED. New claim types require a
dedicated governance specification extension.

### 2.4 Grounding Boundary

Lineage upgrades must satisfy evidence standards:

| Target | Required Confidence | Required Evidence |
|--------|-------------------|-------------------|
| WEAK → STRONG | DIRECT_CITATION or STRONG_INFERENCE | Architecture record establishing structural correspondence |
| NONE → STRONG | DIRECT_CITATION | Direct evidence of structural-to-business mapping |
| NONE → EXACT | DIRECT_CITATION | Explicit structural identity mapping in source |
| WEAK → EXACT | DIRECT_CITATION | Explicit structural identity mapping in source |

**Rule:** CONTEXTUAL_DERIVATION confidence caps lineage at STRONG (never EXACT).
**Rule:** EXACT lineage requires DIRECT_CITATION exclusively.

### 2.5 Immutability Boundary

Dynamic CEU activation MUST NOT modify:

| Protected Element | Why Protected |
|-------------------|--------------|
| Certified topology | Pipeline-derived structural truth |
| DPSIG signals (CPI, CFA) | Lane D sovereign |
| Decision validation results | Pipeline-executed checks |
| Reproducibility verdict | Pipeline guarantee |
| Rendering metadata (certified) | Pipeline-produced display metadata |
| Crosswalk (certified entries) | Pipeline-certified mappings |
| Semantic topology model (certified) | Pipeline-derived model |
| Q-class formula | Governance-locked evaluation function |
| S-state gate definitions | Governance-locked progression gates |

Overlay contributions are COMPOSITED ABOVE these elements, never
merged INTO them.

---

## 3. Certification Boundary Matrix

| Action | Boundary | Verdict |
|--------|----------|---------|
| Add label to unlabeled surface | Claim + class | PERMITTED — within LABEL_ASSIGNMENT |
| Upgrade lineage from NONE → STRONG | Grounding | PERMITTED — if DIRECT_CITATION evidence |
| Extend crosswalk with new mapping | Claim + class | PERMITTED — within CONTINUITY_MAPPING |
| Modify existing certified label | Immutability | PROHIBITED — certified label is protected |
| Downgrade lineage classification | Immutability | PROHIBITED — reduction not additive |
| Remove certified crosswalk entry | Immutability | PROHIBITED — certified entries protected |
| Override Q-class calculation | Immutability | PROHIBITED — formula is governance-locked |
| Activate before substrate exists | Temporal | PROHIBITED — substrate must exist first |
| Enrich a different client's run | Scope | PROHIBITED — cross-client enrichment |
| Propose a new claim type | Claim | PROHIBITED — requires governance extension |
| Auto-activate on pipeline completion | Authorization | PROHIBITED — no autonomous activation |
| Suppress overlay attribution | Disclosure | PROHIBITED — attribution is mandatory |

---

## 4. Boundary Enforcement During Activation

Each activation phase enforces specific boundaries:

| Phase | Boundaries Enforced |
|-------|-------------------|
| Phase 0 (Registration) | Scope (client/run matching) |
| Phase 1 (Validation) | Temporal (substrate exists), Claim (valid taxonomy), Immutability (no substrate references) |
| Phase 2 (Authorization) | Class gating, Grounding (evidence standards) |
| Phase 3 (Eligibility) | Aggregate limits, Dependency resolution, Conflict detection |
| Phase 4 (Activation Auth) | No autonomous activation |
| Phase 5 (Re-evaluation) | Formula immutability, Gate definition immutability |
| Phase 6 (Qualification-visible) | Disclosure requirements, Overlay attribution |

---

## 5. Boundary Violation Handling

### 5.1 Pre-activation Violation

If a boundary violation is detected during Phases 0–4:
- Activation is REJECTED
- Package remains STAGED
- Violation details logged in audit trail
- Package may be corrected via new version

### 5.2 Post-activation Violation Discovery

If a boundary violation is discovered after activation (e.g., during
audit or replay verification):
- Package is flagged for governance review
- Emergency revocation may be triggered
- Composite state recomputed without violating package
- Full audit of all re-evaluations since the violating activation

### 5.3 Systemic Boundary Violation

If a boundary violation reveals a systemic issue (e.g., a validation
check was missing):
- Full overlay reset may be triggered
- All active overlays re-validated
- Activation profile updated to prevent recurrence
- Governance audit of the gap

---

## 6. Boundary Evolution Governance

Boundaries are governance-locked. Modifying any boundary requires:

1. **Dedicated governance specification stream** — not an incidental change
2. **Historical authority assessment** — does the change violate any
   historical governance authority?
3. **Impact analysis** — which existing overlays would be affected?
4. **Activation profile versioning** — new version of the activation profile
5. **Re-validation** — all active overlays re-validated against new boundaries

Boundary RELAXATION (making something previously prohibited now permitted)
requires additional governance scrutiny because it expands the activation
surface.

Boundary TIGHTENING (making something previously permitted now prohibited)
may require emergency revocation of overlays that no longer comply.

---

## 7. Governance Rules

1. All 5 boundary types are enforced at every relevant activation phase.
2. Boundary violation at any phase MUST fail closed.
3. No boundary may be bypassed by authorization (authorization operates
   WITHIN boundaries, not above them).
4. Boundary modifications require dedicated governance streams.
5. Post-activation violation discovery triggers governance review.
6. Boundary enforcement is deterministic — same package produces same
   boundary evaluation.
