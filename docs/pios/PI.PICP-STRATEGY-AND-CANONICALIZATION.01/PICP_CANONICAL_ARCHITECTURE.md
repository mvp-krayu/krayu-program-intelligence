# PICP Canonical Architecture

**Stream:** PI.PICP-STRATEGY-AND-CANONICALIZATION.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. Canonical Pipeline Architecture

```
L0: Evidence Intake
    ├── Source archive extraction
    ├── Structural scanning (40.2, 40.3, 40.4)
    └── Evidence classification
         ↓
L1: Structural Derivation
    ├── Structural relevance (40.2r, 40.3r)
    ├── Code graph enrichment (40.3s)
    ├── Structural centrality (40.3c)
    ├── DOM layer generation
    └── CEU grounding
         ↓
L2: Signal & Condition Computation
    ├── Signal families (PSIG, DPSIG, ISIG, BSIG, CSIG)
    ├── SignalSynthesisEngine — 12 condition types
    └── Structural enrichment surfaces
         ↓
L3: Consequence Compilation
    ├── ConsequenceCompiler — 8 types + 3 combinations
    ├── CognitionOntology — static cognition graph
    └── InvestigationVerifier — compilation chain proof
         ↓
    ────── L0-L3 assembly = Compiled Intelligence Package (CIP) ──────
         ↓
L4: Program Intelligence Cognition Runtime (PICR)
    ├── 9 materializers — one per cognition object
    ├── ZERO interpretive authority
    ├── Deterministic, replayable, diffable
    └── Output: Program Intelligence Cognition Package (PICP)
         ↓
L5: Projection Rendering Engine (PRE)
    ├── Consumes PICP + ProjectionConfig
    ├── 75.x bounded interpretive authority
    ├── Format-specific, audience-specific, tone-calibrated
    └── Output: Audience-specific deliverable
         ↓
Surface: Report | Briefing | Memo | Assessment | Review | Workshop | Dashboard
```

### 1.1 Layer Authority Model

| Layer | Authority Level | What Is Permitted | What Is Prohibited |
|-------|----------------|-------------------|-------------------|
| L0-L1 | DETERMINISTIC | Measurement, extraction, classification | Interpretation, inference |
| L2 | DETERMINISTIC | Signal computation, condition synthesis | Audience targeting, narrative |
| L3 | DETERMINISTIC | Consequence mapping, combination detection | New truth creation above L2 |
| L4 | ZERO INTERPRETIVE | Structured cognition assembly from governed inputs | Any interpretation, audience awareness, format selection |
| L5 | 75.x BOUNDED | Narrative phrasing, vocabulary selection, compression, tone | 13 absolute prohibitions (no team behavior, no organizational intent, no human motive, etc.) |

### 1.2 Critical Boundary: L3 → L4

The CIP is the canonical handoff artifact between the existing operational pipeline (L0-L3) and the cognition layer (L4).

**CIP composition:**

| Input | Source | Type |
|-------|--------|------|
| fullReport | GenericSemanticPayloadResolver | Resolved structural payload |
| synthesisResult | SignalSynthesisEngine | Condition inventory |
| consequenceResult | ConsequenceCompiler | Consequence inventory |
| cognitionOntology | CognitionOntology | Static cognition graph |
| classRiskLabels | InvestigationVerifier | Compilation chain proof |
| qualificationPackage | SQO resolver | Qualification state |

### 1.3 Critical Boundary: L4 → L5

The PICP is the canonical handoff artifact between the cognition layer (L4) and the projection layer (L5). The separation is clean:

- **L4 produces cognition.** The 9 cognition objects are structured, deterministic, and projection-independent. The PICP exists BEFORE any rendering decision.
- **L5 produces surfaces.** The PRE selects which objects to render, at what depth, in what vocabulary, for what audience. This is the ONLY layer that operates under 75.x interpretive authority.

No cognition may be introduced at L5 that does not exist in the PICP. The PICP is the truth ceiling for all projections.

---

## 2. The PICP — Canonical Artifact

### 2.1 Definition

The Program Intelligence Cognition Package is the canonical runtime artifact of L4. It contains 9 structured cognition objects that together represent the complete executive-level intelligence derivable from a single PI pipeline run.

### 2.2 Properties

| Property | Value |
|----------|-------|
| Format | Structured (JSON-serializable) |
| Determinism | DETERMINISTIC — same CIP inputs → same PICP output |
| Interpretive authority | ZERO — no inference, no audience awareness |
| Replayability | FULL — deterministic from governed inputs |
| Diffability | FULL — structured objects can be diff'd across runs |
| Projection independence | COMPLETE — no rendering decisions, no format awareness |
| Storage | `program_intelligence_cognition_package.json` alongside specimen artifacts |

### 2.3 Nine Cognition Objects

| Object | Purpose | Derivation |
|--------|---------|------------|
| structural_posture | Program identity, scale, qualification state, architecture profile | DETERMINISTIC from fullReport |
| tension_map | Convergence centers, behavioral class activation, cross-center coupling | DETERMINISTIC from synthesisResult |
| constraint_inventory | Throughput ceilings, blast radii, governance misalignments, fragility, rigidity | DETERMINISTIC from synthesisResult + consequenceResult |
| exposure_assessment | Concentration surfaces, governance gaps, fragility vulnerability | RULE-BASED from consequenceResult |
| trajectory_assessment | Worsening/stable/unmeasured pattern trajectories | RULE-BASED from synthesisResult |
| decision_surface | Leverage points with urgency classification | RULE-BASED from consequenceResult + synthesisResult |
| absence_profile | Inactive conditions, unmeasured conditions, non-activated signals | DETERMINISTIC from synthesisResult |
| competitive_intelligence | Detection advantages, detectability gaps vs traditional methods | RULE-BASED from synthesisResult |
| operational_ceiling | Ceiling drivers, ceiling properties, likely symptoms | RULE-BASED from consequenceResult |

**Derivation classification:**
- DETERMINISTIC: mechanical extraction or computation from governed inputs
- RULE-BASED: deterministic application of governed rules to governed inputs (no interpretive judgment)

Both classifications operate at ZERO interpretive authority. The distinction is between extraction (DETERMINISTIC) and governed transformation (RULE-BASED).

### 2.4 Lifecycle

```
PRODUCTION → STORAGE → VERSIONING → DELTA ANALYSIS
     ↑                                      │
     └──────────── RECOMPUTATION ←──────────┘
```

1. **Production:** L4 materializers consume CIP, produce PICP
2. **Storage:** PICP serialized alongside specimen artifacts
3. **Versioning:** Each pipeline run produces a new PICP version
4. **Delta analysis:** Structured diff between PICP versions (run-over-run comparison)
5. **Recomputation:** CIP changes trigger PICP recomputation — deterministic

### 2.5 Validation

| Level | What Is Checked |
|-------|----------------|
| Internal | Each cognition object validates its own schema constraints |
| Cross-object | Consistency between objects (e.g., constraint_inventory references convergence centers from tension_map) |
| Pipeline | CIP provenance verification — every PICP field traces to a specific pipeline output |

---

## 3. Materializer Architecture

### 3.1 Definition

A materializer is a pure function that produces exactly one cognition object from CIP inputs. 9 materializers, one per object.

### 3.2 Dependency Graph

```
                    CIP
                     │
    ┌────────────────┼────────────────────┐
    │                │                    │
structural_    tension_map         absence_profile
posture       (independent)        (independent)
    │                │
    │         ┌──────┼──────┐
    │         │      │      │
    │    constraint  exposure trajectory
    │    _inventory  _assessment _assessment
    │         │      │      │
    │         └──────┼──────┘
    │                │
    │         decision_surface
    │                │
    │         ┌──────┴──────┐
    │         │             │
    │   competitive    operational
    │   _intelligence  _ceiling
    │
    └─────────────────┘
```

**Parallelization:** structural_posture, tension_map, and absence_profile can be materialized in parallel (no dependencies). The remaining 6 objects form a dependency chain.

### 3.3 Governance

- Each materializer operates at ZERO interpretive authority
- Each materializer produces a single object — no side effects
- Materializers do not communicate with each other during execution
- Materializer output is validated before PICP assembly
- Materializer failure → PICP production FAILS (fail-closed)

---

## 4. The PRE — Projection Rendering Engine

### 4.1 Definition

The Projection Rendering Engine is the L5 component that transforms a PICP into a specific projection. It is the ONLY component that operates under 75.x bounded interpretive authority.

### 4.2 ProjectionConfig Schema

```
ProjectionConfig: {
  projection_type: REPORT | BOARDROOM_BRIEFING | ADVISORY_MEMO |
                   M&A_ASSESSMENT | TRANSFORMATION_REVIEW |
                   PORTFOLIO_REVIEW | EXECUTIVE_WORKSHOP |
                   INVESTMENT_REVIEW,
  audience: {
    primary: CEO | CTO | Board | Investor | Transformation_Lead,
    technical_depth: EXECUTIVE | TECHNICAL | MIXED,
  },
  format: {
    structure: CHAPTERS | SLIDES | MEMO | DASHBOARD | WORKSHOP,
    compression: FULL | MODERATE | AGGRESSIVE | SEVERE,
  },
  rendering_overrides: {
    objects_to_hide: string[],
    objects_to_expand: string[],
    vocabulary_domain: STRUCTURAL | INVESTMENT | TRANSFORMATION | OPERATIONAL,
    tone: ANALYTICAL | ADVISORY | FACILITATIVE,
  },
}
```

### 4.3 PRE Responsibilities

The PRE is the ONLY component that:
- Selects metaphors
- Calibrates tone
- Chooses narrative sequence
- Applies audience vocabulary
- Compresses cognition for format
- Hides/expands cognition objects per ProjectionConfig

The PICR (L4) does NONE of these. The separation is clean.

### 4.4 Invariant vs Variant

**Always rendered (regardless of projection):**
- Specimen identity (name, scale headline)
- Qualification state (S-level)
- Convergence center count
- Operational ceiling existence
- Evidence-bound disclaimer

**Always hidden (regardless of projection):**
- Pipeline internals
- Signal family technical details
- Derivation log

Everything else varies by ProjectionConfig.

---

## 5. Relationship to Existing Architecture

### 5.1 What Exists Today (Runtime Reality)

| PICP Concept | Current Implementation | Status |
|-------------|----------------------|--------|
| PICR (L4 runtime) | Does not exist as separate component | NOT IMPLEMENTED |
| PICP (L4 artifact) | Does not exist as separate artifact | NOT IMPLEMENTED |
| 9 cognition objects | Partially exist embedded in `forBoardroom()` and `forBalanced()` | PROTO-L4 |
| Materializers | Do not exist — cognition is computed inline during rendering | NOT IMPLEMENTED |
| PRE (L5 engine) | `forBoardroom()`, `forBalanced()`, LENS zone rendering | PROTO-L5 |
| ProjectionConfig | Does not exist — projection is hardcoded per persona | NOT IMPLEMENTED |

### 5.2 Extraction Path

The discovery confirmed: **extraction — not invention — is the path to L4.** The existing `forBoardroom()` function already computes most PICP objects but embeds them inside rendered strings. Separating computation from rendering produces the PICR.

### 5.3 Maturity Classification

| Construct | Maturity |
|-----------|----------|
| PICP concept | ARCHITECTURALLY_DEFINED — 9 objects with full schemas |
| PICR concept | ARCHITECTURALLY_DEFINED — materializer architecture specified |
| PRE concept | ARCHITECTURALLY_DEFINED — projection config schema specified |
| L4/L5 separation | ARCHITECTURALLY_DEFINED — boundary rules specified |
| 8 projection families | ARCHITECTURALLY_DEFINED — rendering tables specified |
| CIP input contract | ARCHITECTURALLY_DEFINED — 6 inputs specified |
| forBoardroom() as proto-L4 | OPERATIONAL — computes cognition, embeds in rendering |
| forBalanced() as proto-L5 | OPERATIONAL — governed narrative rendering |

### 5.4 No Code Changes Required

This stream is architecture definition only. The PICP architecture describes a target state. The existing proto-L4/L5 implementations (`forBoardroom()`, `forBalanced()`, LENS zones) continue to operate unchanged. Implementation — extracting cognition from rendering — is a future stream.

---

## 6. Canonical Product Hierarchy Update

The PICP discovery adds two layers to the canonical product hierarchy:

```
Program Intelligence (category/discipline)
  └── GEIOS (operating architecture)
        ├── PiOS (computational substrate)
        │     ├── Ingestion (L0: 40.x)
        │     ├── Core Derivation (L1-L3: 40.x, 41.x, SW-Intel)
        │     ├── Cognition Assembly (L4: PICR → PICP)        ← NEW
        │     └── Projection Rendering (L5: PRE → surfaces)   ← NEW
        ├── LENS (projection surface)
        │     ├── Cognitive Projection (5-persona)
        │     ├── Guided Investigation (5A/5B)
        │     └── Evidence Record Export
        ├── SQO (qualification overlay)
        └── Marketplace (domain cognition modules)
```

L4 and L5 sit WITHIN PiOS — they are computational substrate layers, not LENS projection layers. LENS consumes L5 output. The hierarchy position is clear: PiOS produces intelligence, LENS presents it.

---

## 7. Governance Boundaries

### 7.1 L4 Governance

- ZERO interpretive authority
- No audience awareness
- No format decisions
- No narrative phrasing
- All 13 prohibitions inherited (but moot — L4 never interprets)
- Fail-closed on invalid CIP inputs

### 7.2 L5 Governance

- 75.x bounded interpretive authority
- All 13 absolute prohibitions enforced
- Vocabulary constrained by ProjectionConfig.vocabulary_domain
- Compression constrained by ProjectionConfig.compression
- Tone constrained by ProjectionConfig.tone
- No cognition creation beyond PICP content
