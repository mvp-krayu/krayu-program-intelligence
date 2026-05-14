# Canonical Dynamic CEU Reinterpretation

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete), PROTO_DYNAMIC_CEU_CLASSIFICATION.md (complete)

---

## 1. Purpose

This document establishes the canonical reinterpretation of Dynamic CEU under
SQO governance. It defines what Dynamic CEU IS in its current-era formalization,
drawing on the full historical authority chain to demonstrate that the canonical
definition is a principled evolution, not an arbitrary redefinition.

---

## 2. Canonical Definition

**Dynamic CEU** is the governed, replay-safe, additive semantic overlay
activation architecture within SQO qualification governance.

It consists of:
1. **Semantic Evidence Packages (SEPs)** — governed, versioned, provenance-bound
   containers of external semantic evidence
2. **Overlay mechanics** — deterministic layered application of evidence entries
   onto the certified structural substrate WITHOUT modifying it
3. **Activation boundaries** — 5 boundary types (temporal, scope, claim, grounding,
   immutability) that constrain what, when, and how evidence is activated
4. **Qualification re-evaluation** — the process by which activated evidence
   contributes to composite qualification state evaluation

---

## 3. What Dynamic CEU IS

| Property | Definition | Historical Authority |
|----------|-----------|---------------------|
| Governed | Subject to 9 pre-activation requirements, 7 semantic class authorizations, 5 activation boundaries | Mid era: SQO boundary contract; Current era: SEP architecture |
| Replay-safe | Package hashing, deterministic ordered application, source hash provenance, monotonic versioning | Mid era: R1–R5 guarantees; Current era: overlay architecture |
| Additive | Never modifies certified substrate; produces overlay contributions composited with static evaluation | Mid era: lane architecture; Current era: Static/Dynamic separation |
| Evidence-activated | Activates EVIDENCE for evaluation, not semantic authority for declaration | Early era: governance exploration closure; Current era: activation boundaries |
| Scoped | Bound to (client, run_id) pair; no cross-boundary enrichment | Current era: scope boundary |
| Provenance-bound | Every entry requires source hash, authority, confidence basis, ingestion stream | Mid era: evidence requirements; Current era: provenance chain |
| Independently removable | Any SEP can be revoked; composite state recomputes without it | Current era: revocation model, independent removability guarantee |

---

## 4. What Dynamic CEU IS NOT

| Misconception | Correction | Historical Authority |
|--------------|-----------|---------------------|
| Semantic activation | Dynamic CEU does not activate semantics; it activates EVIDENCE | Early era: semantic activation authority blocked |
| Pipeline enhancement | Dynamic CEU is not a patch for pipeline limitations; it is a SEPARATE evaluation dimension | Mid era: CEU Paradox |
| Signal enrichment | Dynamic CEU does not enrich DPSIG signals | Early era: signal enrichment abandoned; Lane D sovereign |
| Substrate modification | Dynamic CEU NEVER modifies certified artifacts | All eras: immutability governance |
| Authority declaration | Dynamic CEU presents evidence for evaluation, not truth for declaration | Early era: structural-relational intelligence ≠ semantic authority |
| Q-class override | Dynamic CEU contributes to composite evaluation; Q-class formula is immutable | Mid era: SQO boundary contract; Current era: immutability boundary |
| Automatic enrichment | Dynamic CEU requires explicit activation with governance verification | Current era: 9 pre-activation requirements |
| Unbounded augmentation | Dynamic CEU is bounded by 5 activation boundaries and aggregate limits | Current era: activation boundaries, cohabitation limits |

---

## 5. Reinterpretation of Historical Concepts

### 5.1 From "Computable Enhancement Unit" to "Evidence Activation"

**Historical framing (Early/Mid):** CEU = unit of computable semantic enhancement.
The emphasis was on COMPUTATION — the pipeline COMPUTES semantic mappings.

**Canonical reinterpretation:** Dynamic CEU = unit of governed evidence that
augments qualification evaluation. The emphasis shifts from COMPUTATION to
GOVERNANCE. The pipeline still computes (that is Static CEU). Dynamic CEU is
not about computation — it is about presenting governed external evidence
for a composite evaluation.

### 5.2 From "Governed Maturation Assistance" to "Evidence-Activated Overlay"

**Historical framing (Mid):** Dynamic CEU helps clients mature through S-states.
The emphasis was on ASSISTANCE — helping clients progress.

**Canonical reinterpretation:** Dynamic CEU provides evidence that, when
activated and evaluated, may contribute to qualification state changes.
The emphasis shifts from ASSISTANCE to EVALUATION. Dynamic CEU does not
"help" clients — it provides evidence that the qualification framework
evaluates. Whether that evaluation produces state advancement is a function
of the Q-class formula, not of Dynamic CEU intent.

### 5.3 From "Enrichment" to "Overlay"

**Historical framing (All eras):** Enrichment = making something semantically
richer by adding information to it.

**Canonical reinterpretation:** Overlay = adding evidence contributions to a
separate layer that is composited with the certified substrate for evaluation.
The emphasis shifts from IN-PLACE enrichment to LAYERED composition. This is
the critical architectural distinction: enrichment implies modification;
overlay implies composition.

### 5.4 From "Activation Authority" to "Activation Boundaries"

**Historical framing (Early/Mid):** The question was whether authority to
activate semantic enrichment should be granted.

**Canonical reinterpretation:** Authority IS granted, but within strict
boundaries. The early era's block on semantic activation is respected by
making Dynamic CEU an evidence activation system (not a semantic activation
system) bounded by 5 boundary types. The authority model is not binary
(granted/blocked) but BOUNDED (granted within boundaries).

---

## 6. Canonical Dynamic CEU Architecture Summary

```
EXTERNAL EVIDENCE SOURCE
        │
        ▼
  ┌─────────────────────────────────┐
  │  Semantic Evidence Package (SEP) │
  │  ─────────────────────────────── │
  │  provenance chain               │
  │  semantic class authorizations   │
  │  evidence entries (6 claim types)│
  │  overlay metadata               │
  │  governance assertions          │
  └──────────────┬──────────────────┘
                 │
    ┌────────────▼────────────┐
    │  PRE-ACTIVATION         │
    │  9 requirements checked │
    │  5 boundaries verified  │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │  ACTIVATION             │
    │  Package → ACTIVATED    │
    │  Overlay → composite    │
    └────────────┬────────────┘
                 │
    ┌────────────▼─────────────────┐
    │  QUALIFICATION RE-EVALUATION  │
    │  Static CEU + Dynamic CEU     │
    │  = Composite evaluation       │
    │  Q-class formula (immutable)  │
    │  S-state gate check           │
    │  Overlay attribution          │
    └───────────────────────────────┘
```

---

## 7. Why This Reinterpretation Is Valid

The canonical reinterpretation is valid because:

1. **Conceptual continuity:** 53% of proto-concepts survive as canonical, 35%
   survive in reformulated form (per PROTO_DYNAMIC_CEU_CLASSIFICATION.md)

2. **Governance strengthening:** Every governance rule from prior eras is either
   preserved or strengthened — never weakened (per CROSS_ERA_RECONCILIATION_MODEL.md)

3. **Prohibition preservation:** All prohibited behaviors remain prohibited —
   the early era's semantic activation block is respected (per HISTORICAL_GOVERNANCE_TENSIONS.md)

4. **Replay safety preservation:** R1–R5 guarantees are fully incorporated into
   SEP architecture — no replay safety regression

5. **Boundary respect:** Lane architecture boundaries are enforced via the
   immutability boundary model — Dynamic CEU never touches Lane A or Lane D

6. **Historical authority loading:** The reinterpretation is based on 53 documents
   across 12 tiers spanning all 3 eras — not branch-local inference
