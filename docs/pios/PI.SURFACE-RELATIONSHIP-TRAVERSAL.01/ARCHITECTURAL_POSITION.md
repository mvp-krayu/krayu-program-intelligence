# ARCHITECTURAL POSITION — PI.SURFACE-RELATIONSHIP-TRAVERSAL.01

Stream: PI.SURFACE-RELATIONSHIP-TRAVERSAL.01 | Classification: G1 | Branch: feature/runtime-demo

---

## 1. Position in the Cognition Pipeline

```
CIP → PICR → PICP → PRE → Consumer
       ↑               ↑
       │               │
  Graph construction   Graph narration
  (new materializer)   (PRE Zone B traversal)
       │               
       ↓               
  Surface Relationship Graph
       │
       ↓
  Deterministic traversal
  (PRE Zone A)
```

### 1.1 What Changes

| Component | Change | Nature |
|---|---|---|
| **CIP** | NONE | No new evidence extraction, no new signal computation |
| **PICR** | One new materializer | Pure assembly from existing materializer outputs — reads `reinforcement_flows.top_flows`, `convergence_patterns.convergence_domains`, and `surface.affected_domains` |
| **PICP** | One new cognition object (if it passes 7-gate test) | `surface_relationship_graph` — the explicit edge structure |
| **PRE Zone A** | Graph traversal function | Deterministic: same graph → same traversal path → same output |
| **PRE Zone B** | Audience-calibrated narration of traversal | Governed: 75.x bounded. Same traversal, different language per audience |
| **PRE Zone C** | Authority ceiling on traversal depth | SQO S-level gates how deep emergence explanation can go |

### 1.2 What Does Not Change

- Signal families (PSIG, DPSIG, ISIG, BSIG, CSIG, ESIG)
- SignalSynthesisEngine (12 condition types)
- ConsequenceCompiler (8 consequence types, 3 combination patterns)
- Existing 12 SW-Intel surface materializers
- CognitionOntology (5 classes, A-E)
- Existing PICP cognition objects (structural_posture, tension_map, constraint_inventory, exposure_assessment, trajectory_assessment, decision_surface, absence_profile, detection_boundary, operational_ceiling)
- ConsequenceCompiler persona functions (forBoardroom, forBalanced, forOperator, forInvestigation)
- LENS persona projection architecture

---

## 2. Relationship to Existing Architecture

### 2.1 The Cognition Anatomy (22 Functions × 5 Strata)

Where would Emergence Explanation sit in the 22 cognitive functions?

It is not a new stratum. It operates on existing Stratum B (Synthesis & Transformation) outputs. It could be:
- A new Stratum B function (synthesis of surface relationships)
- A Stratum D function (evidence authentication — the graph proves why)
- A new function class entirely (emergence)

**Open question:** The 22 cognitive functions and 5 cognition strata are CANONICAL. Adding a function requires G1 justification. This stream identifies the candidate — it does not add it.

### 2.2 The PICP Constitution (7-Gate Test)

If `surface_relationship_graph` is proposed as a cognition object, it must pass the 7-gate qualification test:

| Gate | Assessment |
|---|---|
| **1. Derivation** | PASS — deterministically derivable from existing PICP surfaces |
| **2. Evidence Binding** | CONDITIONAL — edges trace to `top_flows` (L2 signal co-presence) and `convergence_domains` (L2 domain condition counts). Condition-type-to-surface mapping is implicit. |
| **3. Audience Independence** | PASS — the graph structure is audience-independent. Traversal narration is audience-specific (PRE). |
| **4. Projection Freedom** | PASS — the graph contains no rendering vocabulary, no commercial framing. |
| **5. Structural Novelty** | PASS — no existing cognition object captures surface-to-surface relationships. `reinforcement_flows` captures condition-type co-presence. `convergence_patterns` captures domain convergence. Neither captures the surface-level graph. |
| **6. Cognitive Question** | PASS — answers: "Why do these structural conditions co-exist and compound?" No existing object answers this. |
| **7. Zero Authority** | PASS — the graph is deterministic. No interpretive authority required to construct it. |

**Preliminary assessment: 6 PASS, 1 CONDITIONAL.** Gate 2 depends on whether the implicit condition-type-to-surface mapping can be made explicit with full evidence traceability.

### 2.3 Relationship to ConsequenceCompiler

| Concept | ConsequenceCompiler | Surface Relationship Graph |
|---|---|---|
| **Level** | Condition → Consequence | Surface → Surface |
| **Mechanism** | Pattern matching + vocabulary | Graph construction + traversal |
| **What it explains** | What the operational implications are | Why the conditions co-exist and compound |
| **Combination awareness** | Yes — 3 combination patterns (same-locus convergence) | Yes — but cross-domain, not same-locus only |
| **Persona projection** | forBoardroom(), forBalanced(), etc. | Traversal narration in PRE Zone B |
| **Temporal scope** | Current state | Current state (TEMPORAL would require EXSIG/TIMSIG) |

The ConsequenceCompiler and the Surface Relationship Graph are complementary, not competitive. The compiler answers "what compounds?" The graph answers "why it compounds."

### 2.4 Relationship to Combination Patterns

The 3 existing combination patterns:

```
AMPLIFIED_DEPENDENCY_FRAGILITY    — pressure + choke point at same locus
STRUCTURAL_GRAVITY_WELL           — mass + pressure at same locus
SYSTEMIC_OPERATIONAL_FRAGILITY    — 3+ conditions converging
```

These fire at the CONSEQUENCE level when conditions share a primary locus. They are detector rules.

The Surface Relationship Graph operates at the SURFACE level and is structural, not rule-based. It doesn't fire — it exists. The graph explains the structural path that caused a combination pattern to fire.

Example: SYSTEMIC_OPERATIONAL_FRAGILITY fires because 3+ conditions converge on a domain. The graph shows: DELIVERY_FRAGILITY reinforces STRUCTURAL_FRAGILITY through 2 shared domains, and BOUNDARY_ALIGNMENT independently converges on one of those domains. The combination pattern detects the convergence. The graph explains the structural topology of the convergence.

---

## 3. Architectural Layer Assignment

### 3.1 The Core Question

Is the Surface Relationship Graph:

**Option A — A PICR cognition object?**
- Produced by a materializer from CIP
- Part of the PICP
- Consumed by PRE like any other cognition object

**Option B — A PRE Zone A construction?**
- Assembled at projection time from PICP surface data
- Not part of the PICP
- Consumer-specific (different consumers might traverse differently)

### 3.2 Arguments for Option A (PICR)

1. The graph is audience-independent — its structure doesn't change per consumer
2. The graph is deterministic — same CIP → same graph
3. The graph passes the 7-gate test (conditionally)
4. The graph produces structural novelty — no existing object captures surface relationships
5. Making it a PICP object means it's portable, versionable, diffable

### 3.3 Arguments for Option B (PRE Zone A)

1. The graph is DERIVED from existing PICP objects, not from CIP directly
2. PICR materializers consume CIP — this would consume PICP (a second-order materializer)
3. Different consumers might want different traversal strategies
4. Keeping it in PRE preserves the existing PICP boundary

### 3.4 Resolution: Deferred

This is a load-bearing architectural decision. The answer determines whether the cognition pipeline gains a second-order materializer (PICP → PICP enrichment) or whether PRE gains structural construction capability beyond rendering.

Both options preserve the constitutional constraint: AI does not explain. Traversal explains.

---

## 4. Summary

The Surface Relationship Graph is architecturally positioned as:

- **Not CIP** — no new evidence computation
- **Potentially PICR** — new materializer, pure assembly, audience-independent, deterministic
- **Potentially PRE Zone A** — deterministic construction from PICP data at projection time
- **Traversal is PRE Zone A** — deterministic walk, same graph → same path
- **Narration is PRE Zone B** — audience-calibrated language for the traversal output
- **Qualification is PRE Zone C** — SQO authority ceiling on explanation depth

The PICR vs PRE Zone A decision is the primary open architectural question.
