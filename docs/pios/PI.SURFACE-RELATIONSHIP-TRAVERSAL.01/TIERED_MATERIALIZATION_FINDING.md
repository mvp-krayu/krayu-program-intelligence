# TIERED MATERIALIZATION — Architectural Finding

Stream: PI.SURFACE-RELATIONSHIP-TRAVERSAL.01 | Classification: G1 | Branch: feature/runtime-demo

---

## Finding

The Surface Relationship Graph is not a thirteenth surface. It is the first object that consumes **surfaces**, not evidence. This reveals that the cognition pipeline has stages that the current architecture does not recognize.

---

## 1. The Distinction

Every existing cognition object in the system — all 12 SW-Intel surfaces, all 9 PICP cognition objects — consumes CIP independently. Each reads `fullReport` and produces its own output. None reads another's output.

The Surface Relationship Graph would read:
- `reinforcement_flows.constituents.top_flows` (surface output)
- `convergence_patterns.constituents.convergence_domains` (surface output)
- `*.affected_domains` from all 12 surfaces (surface output)

It operates on the **surface layer**, not the evidence layer. That is categorically different from a surface.

---

## 2. The Existing 12 Were Never Peers

`reinforcementFlows.js` and `convergencePatterns.js` read `signal_interpretations` from CIP — same input as the other materializers. But they compute **relationships between condition types**, not independent structural observations:

- `reinforcementFlows` detects which condition types co-occur within a domain → produces edges
- `convergencePatterns` detects which domains have multiple condition types → produces convergence nodes

The other 10 materializers describe **what exists structurally**:
- `deliveryFragility` describes delivery pressure concentration
- `structuralFragility` describes structural hotspot density
- `topologyPosture` describes graph structure and grounding

The 12-surface model was:

| Role | Count | What they describe |
|---|---|---|
| **Observation surfaces** | 10 | Independent structural phenomena |
| **Relationship surfaces** | 2 | Condition co-occurrence and convergence |

This was not recognized because all 12 use the same shape (`surface_id`, `severity`, `affected_domains`, `constituents`, `trace_sources`) and all consume CIP through the same entry point. The shape uniformity masked a categorical difference in what they compute.

---

## 3. Two-Tier Materialization

The cognition pipeline currently assumes one tier of materialization:

```
CIP → [12 materializers in parallel] → 12 surfaces
```

The Surface Relationship Graph requires a second tier:

```
CIP → [Tier 1: 12 materializers] → 12 surfaces
                                        ↓
                              [Tier 2: graph materializer] → Surface Relationship Graph
```

Tier 2 runs AFTER Tier 1 completes. It consumes Tier 1 outputs. This is second-order materialization.

### Tier Definition

| Tier | Consumes | Produces | Nature |
|---|---|---|---|
| **Tier 1 — Observation** | CIP (evidence substrate) | Named structural phenomena: delivery_fragility, structural_fragility, topology_posture, structural_coupling, integration_exposure, boundary_alignment, operational_ceiling, coordination_saturation, propagation_risk, qualification_exposure | What exists |
| **Tier 1 — Relationship** | CIP (evidence substrate) | Condition co-occurrence and convergence: reinforcement_flows, convergence_patterns | What relates (computed from evidence, not from surfaces) |
| **Tier 2 — Emergence** | Tier 1 surface outputs | Surface relationship graph | Why it emerged (computed from surfaces, not from evidence) |

### Key Properties

- Tier 1 materializers are parallelizable (no cross-dependencies)
- Tier 2 materializers depend on Tier 1 completion
- Tier 2 does not re-read CIP — it reads only surface outputs
- Tier 2 is deterministic: same Tier 1 outputs → same Tier 2 output
- Tier 2 requires ZERO interpretive authority

---

## 4. Constitutional Implications

### 4.1 PICR Definition

Current PICR definition (TERMINOLOGY_LOCK): "The L4 runtime component that produces the PICP from CIP. Contains 9 materializers — pure functions, each producing one cognition object. ZERO interpretive authority. Deterministic: same CIP → same PICP."

If Tier 2 is recognized, PICR gains:
- A sequencing requirement (Tier 1 before Tier 2)
- A materializer that consumes PICP surfaces, not CIP
- The definition "produces the PICP from CIP" becomes "produces the PICP from CIP in staged materialization"

This is a **G1-grade modification** to the PICR definition — if accepted.

### 4.2 Cognition Object Qualification Test

Gate 1 (Derivation) currently reads: "deterministically derivable from CIP."

A Tier 2 object is derivable from CIP — transitively. It is directly derivable from Tier 1 outputs, which are directly derivable from CIP. The derivation has two stages, but the chain is fully deterministic.

The gate may need refinement: "deterministically derivable from CIP, directly or through staged materialization."

### 4.3 The 22 Cognitive Functions

Cognition formation has stages:

1. **Observe** — extract structural phenomena from evidence (Tier 1 observation surfaces)
2. **Relate** — detect co-occurrence and convergence patterns (Tier 1 relationship surfaces — already exist but not classified as a distinct stage)
3. **Explain** — derive emergence from surface relationships (Tier 2 — does not exist yet)

These stages may correspond to cognitive functions within the 22-function taxonomy, or they may represent a structural property of cognition formation that sits below the function level. This is an open question (see OPEN_QUESTIONS.md Q7).

---

## 5. What This Finding Does NOT Change

- The 12 existing surfaces remain valid — they are correctly materialized from CIP
- The PICP 9 cognition objects are unaffected — they consume CIP, not surfaces
- The ConsequenceCompiler is unaffected — it consumes conditions, not surfaces
- PRE three-zone model is unaffected
- Consumer-genericity invariant is unaffected
- No existing code requires modification to accommodate this finding

The finding is purely architectural recognition. The system already has proto-tiered materialization (the 2 relationship surfaces compute relationships between condition types). The Surface Relationship Graph would formalize what is already implicit.

---

## 6. Relationship to Prior Discoveries

| Discovery | What it revealed | Significance |
|---|---|---|
| ConsequenceCompiler as proto-PRE Zone B | Audience calibration already exists through a different path | Prevented wasted implementation effort |
| Dead code in BOARDROOM/BALANCED SW-Intel components | 3 ELEVATED issues were based on examining unused code | Corrected the product flow assessment |
| **Tiered materialization** | Cognition formation has stages (observe → relate → explain) | **Reframes the PICR from "parallel materializers" to "staged cognition formation"** |

The third discovery is potentially the most architecturally significant. The first two corrected misunderstandings about existing code. This one identifies a structural property of cognition formation that the architecture did not previously recognize.
