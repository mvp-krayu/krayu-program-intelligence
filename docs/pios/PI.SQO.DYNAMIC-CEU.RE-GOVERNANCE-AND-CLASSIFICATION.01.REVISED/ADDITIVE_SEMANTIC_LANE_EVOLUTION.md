# Additive Semantic Lane Evolution

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete)

---

## 1. Purpose

This document traces the evolution of the additive semantic lane concept
from its origins in lane architecture through to its current manifestation
as the SQO overlay layer. It establishes how the lane model governs where
Dynamic CEU operates, what it can touch, and what is permanently off-limits.

---

## 2. Lane Architecture History

### 2.1 Pre-Lane Era (Early)

Before formal lane architecture, the program operated with implicit
separation between structural analysis (40.x), semantic interpretation
(75.x), and operational exposure (42.x/51.x). The separation was enforced
by stream boundaries in CLAUDE.md (§9) but was not formalized as a
lane model.

### 2.2 Lane Model Formalization (Mid Era)

**Authority:** SQO_LANE_ARCHITECTURE.md

The lane model formalized four lanes:

| Lane | Domain | Mutability | Dynamic CEU Access |
|------|--------|------------|-------------------|
| Lane A | Structural artifacts (topology, signals, validation) | FROZEN | READ-ONLY (no overlay) |
| Lane B | Reference documentation, PATH B projection | Reference | READ-ONLY (overlay does not target Lane B) |
| Lane C | Experimental / research | Experimental | NOT APPLICABLE (Dynamic CEU is governed, not experimental) |
| Lane D | DPSIG (CPI, CFA) | SOVEREIGN | READ-ONLY (no overlay) |

**SQO Lane** was introduced as the qualification governance lane — the
operational space where S-state evaluation, semantic debt analysis,
maturity scoring, and Dynamic CEU operate.

### 2.3 Current Era Refinement

The current era refines the lane model with the SEP overlay architecture:
- Static CEU lives in the certified substrate (derived from Lane A analysis)
- Dynamic CEU lives in the overlay layer (within the SQO qualification lane)
- Composite evaluation merges Static + Dynamic for qualification assessment
- The overlay layer is architecturally isolated from all other lanes

---

## 3. Additive Semantics Principle

### 3.1 Definition

Additive semantics means that Dynamic CEU ADDS evidence to a layer ABOVE
the certified substrate. It never subtracts, modifies, or replaces
existing certified information.

### 3.2 Historical Evolution

| Era | Additivity Concept | Enforcement |
|-----|-------------------|-------------|
| Early | Contamination prevention — prevent non-authorized additions to grounded mappings | Forbidden mapping sources (FM-1 through FM-9) |
| Mid | Additive-only persistence (R2) — enrichment is layered, never overwrites | Overlay rules OV-01 through OV-06 |
| Mid | SQO MUST NEVER mutate — explicit prohibition on modification | SQO boundary contract |
| Current | Overlay isolation — overlays produce contributions composited above substrate | Immutability boundary (9 protected elements) |

### 3.3 Additive vs Mutative Operations

| Operation | Additive? | Allowed? |
|-----------|----------|----------|
| Add label to unlabeled surface | YES | YES — LABEL_ASSIGNMENT claim |
| Upgrade lineage from NONE to STRONG | YES (adds grounding evidence) | YES — LINEAGE_UPGRADE claim |
| Extend crosswalk with new domain mapping | YES | YES — CONTINUITY_MAPPING claim |
| Modify existing certified label | NO (mutation) | PROHIBITED |
| Downgrade lineage classification | NO (reduction) | PROHIBITED |
| Remove existing crosswalk entry | NO (deletion) | PROHIBITED |
| Override Q-class calculation | NO (formula mutation) | PROHIBITED |
| Suppress disclosure of overlay presence | NO (information suppression) | PROHIBITED |

---

## 4. Lane Isolation Model

### 4.1 Why Lane Isolation Matters for Dynamic CEU

Lane isolation ensures that Dynamic CEU activity in the SQO lane cannot
propagate effects into other lanes. This is not merely an implementation
detail — it is a governance requirement derived from:

1. **Lane A immutability:** structural artifacts must be reproducible
   regardless of Dynamic CEU activity
2. **Lane D sovereignty:** DPSIG signals must be deterministic regardless
   of Dynamic CEU activity
3. **Replay safety:** removing all Dynamic CEU must restore the pre-overlay
   state exactly

### 4.2 Isolation Enforcement

| Boundary | Mechanism |
|----------|-----------|
| Lane A → SQO | One-way read: SQO reads structural output; cannot write back |
| Lane D → SQO | One-way read: SQO reads DPSIG output; cannot write back |
| SQO → Lane A | BLOCKED: no SQO operation may modify structural artifacts |
| SQO → Lane D | BLOCKED: no SQO operation may modify DPSIG signals |
| SQO overlay → certified substrate | BLOCKED: overlay is composited above, never merged into |
| SQO overlay → PATH B projection | BLOCKED: overlay does not target projection layer directly |

### 4.3 Composite Evaluation — The Safe Merge Point

The ONLY point where Dynamic CEU information merges with structural
information is the composite evaluation. This merge is:
- READ-ONLY from both sources
- Computation-only (produces evaluation output, modifies nothing)
- Formula-bound (Q-class formula is immutable)
- Attributed (overlay contributions are tagged)

```
composite_evaluation = Q_CLASS_FORMULA(
    certified_substrate,  // immutable input from Lane A analysis
    activated_overlays,   // additive input from SQO overlay layer
    debt_inventory,       // from semantic debt engine
    maturity_scores       // from maturity scoring engine
)
```

---

## 5. Evolution of the Additive Lane

### 5.1 From "Enrichment Target" to "Overlay Layer"

| Stage | Model | Problem |
|-------|-------|---------|
| Early | Enrich signals in 75.x | Conflates enrichment with activation |
| Mid | Enrich via additive lane | Lane exists but governance boundaries unclear |
| Current | Evidence-activated overlay in SQO lane | Fully governed: boundaries, classes, limits |

### 5.2 What Changed Between Stages

**Early → Mid:**
- Enrichment target shifted from signals to qualification state
- Lane model formalized the structural boundaries
- Replay safety became a formal requirement

**Mid → Current:**
- "Additive lane" became "overlay layer within SQO lane"
- Enrichment governance became activation governance
- Informal behavior lists became formal boundary model
- Evidence requirements became provenance chain requirements
- Lifecycle became SEP lifecycle (CREATION → STAGED → ACTIVATED → [REVOKED/SUPERSEDED])

### 5.3 What Did NOT Change

- Additive-only principle (never mutate substrate)
- Lane A immutability (frozen structural artifacts)
- Lane D sovereignty (DPSIG signals immutable)
- Replay safety requirement (deterministic, reproducible)
- Governance-first approach (enrichment requires authorization)

---

## 6. Forward Governance Requirements

The additive semantic lane (now: SQO overlay layer) has the following
forward requirements for any future extension:

1. **No lane boundary weakening.** Future extensions must not create pathways
   from the overlay layer to Lane A or Lane D.

2. **No substrate merge.** The overlay layer must remain architecturally
   separate from the certified substrate. Proposals to "merge proven overlays
   into the substrate" violate the additive principle.

3. **No implicit activation.** Future extensions must not create mechanisms
   for automatic or unsupervised overlay activation. All activation must
   pass through the pre-activation requirements.

4. **No scope expansion without governance stream.** The (client, run_id)
   scoping of overlays must not be expanded (e.g., to cross-client or
   global overlays) without a dedicated governance specification.

5. **Lane isolation is permanent.** The isolation model is not a temporary
   safety measure that can be relaxed once Dynamic CEU is "mature." It is
   a constitutional property of the architecture.
