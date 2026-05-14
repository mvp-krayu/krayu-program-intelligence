# Signal Layer and Semantic Continuity Relationship

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete)

---

## 1. Purpose

This document traces the relationship between the signal enrichment layer
(PSIG/DPSIG), semantic continuity concepts, and Dynamic CEU across all
three eras. It establishes which signal-layer concepts fed into Dynamic CEU,
which remain independent, and which are prohibited from cross-contamination.

---

## 2. Signal Layer Architecture (Established, Immutable)

### 2.1 DPSIG — Deterministic Pressure Signals

**Authority:** SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md, SQO_LANE_ARCHITECTURE.md

DPSIG produces deterministic pressure signals (CPI, CFA) that describe
structural pressure characteristics of analyzed artifacts.

**Sovereignty:** Lane D sovereign. Immutable. Not subject to Dynamic CEU overlay.

**Properties:**
- Deterministic: same input → same signal output
- Structural: derived from structural analysis, not semantic interpretation
- Lane D: isolated from all other lanes
- Read-only: any consumer (including SQO) MAY read, MUST NOT modify

### 2.2 Signal-Layer Enrichment (Early Era, BLOCKED)

**Authority:** SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md

The 21-stream governance exploration investigated whether PSIG signals
could be enriched with semantic context. The exploration concluded:
- Signal enrichment was the original enrichment direction
- Semantic activation authority was INTENTIONALLY BLOCKED
- The enrichment target shifted from signals to qualification state
- PSIG enrichment as a concept is OBSOLETE for Dynamic CEU purposes

---

## 3. Semantic Continuity Architecture

### 3.1 Definition

**Authority:** PATH_B_PRODUCTIZATION_MODEL.md, MINIMUM_SEMANTIC_ENVELOPE_SPECIFICATION.md

Semantic continuity measures whether business-domain knowledge is connected
to structural artifacts through a verifiable evidence chain. It is evaluated
via the crosswalk — the mapping between structural entities and business domains.

### 3.2 Relationship to Signal Layer

Semantic continuity and the signal layer are INDEPENDENT evaluation dimensions:

| Dimension | Signal Layer (DPSIG) | Semantic Continuity |
|-----------|---------------------|---------------------|
| Source | Structural pressure analysis | Business-to-structure mapping |
| Lane | Lane D (sovereign) | SQO qualification lane |
| Mutability | Immutable | Extensible via governed overlay |
| Dynamic CEU interaction | READ-ONLY (no overlay) | ENRICHABLE (via CONTINUITY_MAPPING) |

### 3.3 Crosswalk Continuity and Dynamic CEU

**Authority:** BLUEEDGE_SEMANTIC_PROVENANCE_CAPSULE.md, DYNAMIC_CEU_ACTIVATION_BOUNDARIES.md

Dynamic CEU can extend semantic continuity via the CONTINUITY_MAPPING claim type.
This is one of 6 authorized claim types in the SEP architecture.

**Boundary rules:**
- Dynamic CEU MAY add new crosswalk entries via overlay
- Dynamic CEU MUST NOT modify certified crosswalk entries
- Overlay crosswalk entries are composited with certified entries for evaluation
- Overlay attribution is mandatory: which entries are certified vs overlay-contributed

---

## 4. Signal-to-Qualification Pathway

### 4.1 How Signal Layer Feeds Qualification

```
DPSIG (Lane D)
  │
  ├── CPI (Complexity Pressure Index) ──→ structural analysis input
  ├── CFA (Contribution Factor Analysis) ──→ structural analysis input
  │
  └── READ-ONLY by SQO ──→ maturity scoring dimension
                           └── qualification state evaluation
```

DPSIG output is consumed as read-only input by the SQO qualification
framework. Dynamic CEU cannot intercept, modify, or overlay DPSIG signals
at any point in this pathway.

### 4.2 How Dynamic CEU Feeds Qualification (Parallel, Not Serial)

```
External Evidence
  │
  └── SEP (governed container)
        │
        ├── LABEL_ASSIGNMENT ──→ enriches label coverage
        ├── LINEAGE_UPGRADE ──→ upgrades grounding classification
        ├── CONTINUITY_MAPPING ──→ extends crosswalk coverage
        ├── CAPABILITY_BINDING ──→ binds capability assertions
        ├── EDGE_ENRICHMENT ──→ enriches structural edge semantics
        └── DOMAIN_TYPING ──→ assigns domain classification
              │
              └── Overlay layer
                    │
                    └── COMPOSITE evaluation (Static + Dynamic)
                          │
                          └── Qualification re-evaluation
```

Dynamic CEU and DPSIG are PARALLEL inputs to qualification evaluation.
Neither depends on the other. Neither modifies the other.

---

## 5. Historical Signal-Semantic Conflation (Resolved)

### 5.1 Early Era Conflation

In the early era, signal enrichment and semantic enrichment were not cleanly
separated. The 21-stream governance exploration investigated them as a
single continuum:

- Phase 1–2: boundary discovery and lane clarification
- Phase 3–4: namespace stabilization and enrichment governance
- Phase 5–8: semantic participation governance, replayability, replay determinism

The exploration's key contribution was SEPARATING these concerns:
- Signal analysis → DPSIG (sovereign, immutable, Lane D)
- Semantic enrichment → blocked as activation, redirected to governed evaluation

### 5.2 Mid Era Separation

The lane architecture formalized the separation:
- Lane A: structural (frozen)
- Lane D: DPSIG (sovereign)
- SQO Lane: qualification governance
- PATH B: semantic projection

This separation means Dynamic CEU operates in the SQO Lane, not in Lane D.
The signal layer and the semantic overlay layer are architecturally isolated.

### 5.3 Current Era Enforcement

The SEP architecture enforces the separation via:
- Scope boundary: SEP scoped to (client, run_id), not to signal-layer
- Immutability boundary: "Modify DPSIG signals — PROHIBITED"
- Claim boundary: no claim type addresses signal-layer modification
- Activation boundaries: temporal boundary requires DPSIG to be computed BEFORE overlay activation

---

## 6. Semantic Continuity Extension Model

### 6.1 What Dynamic CEU Can Do

| Action | Mechanism | Boundary |
|--------|-----------|----------|
| Add new domain mappings | CONTINUITY_MAPPING claim in SEP | Overlay-attributed, independently removable |
| Provide evidence for unmapped entities | LABEL_ASSIGNMENT + DOMAIN_TYPING claims | Subject to semantic class authorization |
| Upgrade lineage from NONE/WEAK to STRONG/EXACT | LINEAGE_UPGRADE claim | Subject to grounding boundary evidence standards |
| Bind capabilities to unmapped surfaces | CAPABILITY_BINDING claim | Subject to provenance requirements |

### 6.2 What Dynamic CEU Cannot Do

| Action | Why Prohibited |
|--------|---------------|
| Modify certified crosswalk entries | Immutability boundary: certified crosswalk is protected |
| Override continuity assessment | Immutability boundary: continuity status is evaluation output |
| Declare domain authority | Activation = evidence presentation, not authority declaration |
| Bypass continuity evaluation formula | Immutability boundary: Q-class formula is protected |

---

## 7. Relationship Summary

```
SIGNAL LAYER (DPSIG)          SEMANTIC CONTINUITY           DYNAMIC CEU (SEP)
─────────────────────         ────────────────────          ──────────────────
Lane D sovereign              SQO evaluation dimension      SQO overlay layer
Immutable                     Certified + overlay composite Evidence-activated
No Dynamic CEU overlay        Dynamic CEU can EXTEND        Governed additive
READ-ONLY to all consumers    Crosswalk is extensible       Replay-safe
                                      ↑                           │
                                      └───────────────────────────┘
                                      (CONTINUITY_MAPPING claim type)
```

The signal layer and Dynamic CEU are architecturally independent.
Semantic continuity is the BRIDGE — it is the evaluation dimension
that Dynamic CEU can extend (via overlay) without touching the signal layer.
