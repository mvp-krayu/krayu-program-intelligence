# Qualification Upgrade Certification Boundaries

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.OPERATIONALIZATION-BASELINE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization

---

## 1. Purpose

This document defines the boundaries within which BlueEdge qualification
upgrades (Q-class improvement, S-state advancement) may be certified
via Dynamic CEU overlays.

---

## 2. Qualification Upgrade Types

### 2.1 Grounding Ratio Improvement

**Current:** 4/17 backed (23.5%)
**Target:** Up to 17/17 backed (100%)
**Mechanism:** LINEAGE_UPGRADE claims in overlay packages

**Certification boundary:** Each domain lineage upgrade MUST satisfy
the grounding boundary evidence standard:

| Upgrade | Required Confidence | Required Evidence |
|---------|-------------------|-------------------|
| NONE → STRONG | DIRECT_CITATION or STRONG_INFERENCE | Architecture record establishing structural correspondence |
| NONE → EXACT | DIRECT_CITATION only | Explicit structural identity mapping in source |
| WEAK → STRONG | DIRECT_CITATION or STRONG_INFERENCE | Architecture record establishing structural correspondence |
| WEAK → EXACT | DIRECT_CITATION only | Explicit structural identity mapping in source |

**Prohibited:** CONTEXTUAL_DERIVATION for EXACT lineage (capped at STRONG).

### 2.2 Q-Class Transition

**Current:** Q-02 (PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY)
**Target:** Q-01 (FULL_GROUNDING) when backed_count = total_count

**Certification boundary:** Q-class transition is automatic — the Q-class
formula is governance-locked and applied to whatever composite state exists.
There is no separate certification for Q-class transition.

**Disclosure:** Q-class transition from overlay contributions MUST include:
- static_backed_count vs overlay_backed_count distinction
- Percentage of backing that is overlay-derived
- Advisory note if overlay-derived backing > 50%

### 2.3 S-State Advancement

**Current:** S2 (partial grounding)
**Target:** S3 (full grounding) when all S3 gates met

**Certification boundary:** S3 achievement via overlay MUST satisfy ALL
S3 gate requirements from the composite state:

| Gate | Certified Substrate | Overlay Contribution | Composite |
|------|-------------------|---------------------|-----------|
| All 6 artifacts present | YES (pipeline-certified) | NOT APPLICABLE | GATE MET |
| semantic_level ≠ STRUCTURAL_LABELS_ONLY | YES | NOT APPLICABLE | GATE MET |
| At least 1 EXACT/STRONG domain | YES (4 backed) | Additional upgrades | GATE MET |
| Crosswalk with ≥ 1 mapping | YES (13 entities) | Extensions possible | GATE MET |
| Decision validation ≥ 1 check | YES (14/14 PASS) | NOT APPLICABLE | GATE MET |
| Reproducibility defined | YES (FULL) | NOT APPLICABLE | GATE MET |
| backed_count == total_count | NO (4/17) | MUST provide 13/17 | GATE PENDING |

**The sole S3 gate dependency on overlays is backed_count.**

---

## 3. Certification Constraints

### 3.1 No Bulk Certification

Each domain lineage upgrade MUST be individually certified:

- Individual provenance chain per domain
- Individual source hash per domain
- Individual confidence basis per domain
- Individual evidence basis per domain

**Prohibited:** A single entry claiming "all 13 domains upgraded" without
per-domain evidence. Each of the 13 domains requires its own evidence entry.

### 3.2 No Cascading Certification

Certifying domain A does not automatically certify domain B:

- Domain A's evidence is specific to domain A
- If domain B has similar structure, domain B still needs its own evidence
- Structural similarity is not evidence — only source material citations count

### 3.3 No Inference-Based Certification

Certification MUST be based on source material evidence, not inference:

| Allowed | Prohibited |
|---------|-----------|
| "ADR-7 states module X maps to business domain Y" (DIRECT_CITATION) | "Module X is probably business domain Y based on naming" (inference) |
| "Architecture record shows component Z serves capability W" (DIRECT_CITATION) | "Component Z looks like it serves capability W" (inference) |
| "Module relationships suggest structural correspondence" (STRONG_INFERENCE) | "AI analysis suggests domain mapping" (AI inference) |

### 3.4 No Retroactive Certification

An overlay activated today certifies the domain from today forward.
It does not retroactively certify past qualification states:

- Past qualification states remain as they were (S2, Q-02)
- Only current and future composite states reflect the overlay
- Historical replay reconstructs the state as it was at each point

---

## 4. Certification-to-S3 Pathway

```
Baseline:  S2, Q-02, 4/17 backed
    │
    ├── Overlay 1: +2 domains (DIRECT_CITATION) → 6/17
    │   Q-class unchanged (Q-02), S-state unchanged (S2)
    │
    ├── Overlay 2: +4 domains (DIRECT_CITATION + STRONG_INFERENCE) → 10/17
    │   Q-class unchanged (Q-02), S-state unchanged (S2)
    │   Advisory: majority backed (59% composite)
    │
    ├── Overlay 3: +4 domains (DIRECT_CITATION) → 14/17
    │   Q-class unchanged (Q-02), S-state unchanged (S2)
    │   Advisory: near-complete (82% composite)
    │
    └── Overlay 4: +3 domains (DIRECT_CITATION) → 17/17
        Q-class: Q-02 → Q-01 (FULL_GROUNDING)
        S-state: S2 → S3 (full grounding achieved)
        Disclosure: 4/17 certified, 13/17 overlay-derived
```

---

## 5. Post-Certification Obligations

After S3 is achieved via overlay:

### 5.1 Ongoing Disclosure

Every evaluation output MUST include:
- `static_backed_count: 4`
- `overlay_backed_count: 13`
- `composite_backed_count: 17`
- `overlay_derived_percentage: 76.5%`
- `advisory: S3 achieved via composite evaluation with overlay evidence`

### 5.2 Revocation Sensitivity

S3 is OVERLAY-DEPENDENT. Revoking any overlay that contributed domain
backing may cause S3 → S2 regression:
- Revoking 1 domain's overlay → 16/17 → S2 (backed ≠ total)
- Full overlay reset → 4/17 → S2 (certified baseline)

### 5.3 Maintenance Requirement

S3 via overlay requires ongoing overlay maintenance:
- Overlays must remain ACTIVATED
- Source material must remain valid
- Provenance chain must remain verifiable
- If source material is superseded, overlay should be version-upgraded

---

## 6. Governance Rules

1. Each domain upgrade requires individual, per-domain evidence.
2. EXACT lineage requires DIRECT_CITATION exclusively.
3. CONTEXTUAL_DERIVATION caps lineage at STRONG.
4. Q-class transition is automatic from formula (not separately certified).
5. S3 achievement via overlay carries mandatory disclosure requirements.
6. S3 via overlay is overlay-dependent and revocable.
7. No inference-based certification under any circumstances.
