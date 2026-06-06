# OPEN QUESTIONS — PI.SURFACE-RELATIONSHIP-TRAVERSAL.01

Stream: PI.SURFACE-RELATIONSHIP-TRAVERSAL.01 | Classification: G1 | Branch: feature/runtime-demo

---

## Q1. PICR or PRE?

Is the Surface Relationship Graph a PICR cognition object (part of PICP) or a PRE Zone A deterministic construction?

**Why this matters:** If PICR, it sets precedent for second-order materializers (materializers that consume PICP objects, not CIP directly). If PRE, it expands PRE Zone A from "rendering rules" to "structural construction" — which changes the definition of what PRE does.

**Decision criteria:** The 7-gate qualification test gives a CONDITIONAL on Gate 2 (Evidence Binding). The condition-type-to-surface mapping is currently implicit. If it can be made explicit with full traceability, the gate passes and the PICR position is justified.

---

## Q2. Condition-Type-to-Surface Mapping

The `top_flows` edges carry condition types (`DELIVERY_PRESSURE_CONCENTRATION`, `STRUCTURAL_MASS_CONCENTRATION`, etc.). Surfaces carry `affected_domains`. The mapping between condition types and surfaces is implicit — materializers filter signals by domain presence, not by condition type.

**Can this mapping be made explicit?** Options:
- A static lookup table (condition_type → surface_id) — simple but fragile
- A runtime derivation (which materializer consumed which signals in which domains) — accurate but requires materializer introspection
- A governance declaration (each materializer declares its condition type affinity) — explicit but adds governance burden

**Why this matters:** Without an explicit mapping, the graph edges are condition-type pairs, not surface pairs. The surface-level graph requires this mapping.

---

## Q3. Are Reinforcement Flows and Convergence Patterns Meta-Surfaces?

Current model: 12 surfaces, all peers. REINFORCEMENT_FLOWS and CONVERGENCE_PATTERNS sit alongside DELIVERY_FRAGILITY and STRUCTURAL_FRAGILITY as equals.

But REINFORCEMENT_FLOWS and CONVERGENCE_PATTERNS don't describe independent structural phenomena. They describe RELATIONSHIPS BETWEEN other surfaces' phenomena. They are surfaces ABOUT surfaces.

**Should they be reclassified as meta-surfaces?** If so:
- The 12-surface model becomes 10 primary surfaces + 2 meta-surfaces
- The meta-surfaces produce the graph edges
- The primary surfaces are the graph nodes
- The distinction becomes architecturally significant

---

## Q4. Directionality

The current `top_flows` data has `from_type` and `to_type` fields, but the generation is combinatorial (all pairs within a domain, line 57-65 of `reinforcementFlows.js`). The `from_type`/`to_type` ordering is arbitrary (loop index order).

**Is there a natural directionality to reinforcement?** Could structural evidence determine direction? For example:
- Dependency structure has inherent directionality (upstream → downstream)
- Propagation has directionality (origin → terminal)
- Coupling may be bidirectional by nature

If directionality can be derived from evidence, the graph becomes a directed graph, and traversal produces causal sequence (A causes B which amplifies C). If not, the graph is undirected, and traversal produces co-occurrence narrative (A and B compound).

---

## Q5. Temporal Extension

The current data is a snapshot — a single-run structural state. The hypothesis describes emergence explanation for current state.

**Could the graph support temporal emergence?** If multiple runs produce graphs, the DIFFERENCE between graphs becomes temporal emergence:
- New edges = new reinforcement relationships
- Lost edges = resolved reinforcement
- Growing convergence depth = accelerating compound pressure

This requires EXSIG/TIMSIG signal families (classified as TEMPORAL in the terminology lock — not yet implemented). The graph architecture should not preclude temporal extension but should not require it.

---

## Q6. Traversal Strategy

If the graph exists, how is it traversed?

Options:
- **Severity-first:** Start at highest-severity surface, follow edges by severity
- **Convergence-first:** Start at highest-convergence domain, trace surfaces that converge
- **Domain-first:** Start at a specific domain, trace all surfaces that affect it
- **Causal-first:** Follow reinforcement edges to trace compounding chains

Different traversal strategies may serve different consumers:
- BOARDROOM: convergence-first (compound risk narrative)
- BALANCED: causal-first (why this happened)
- DENSE: domain-first (structural exploration)
- INVESTIGATION: evidence-first (prove the edges)

**Is traversal strategy consumer-specific (PRE) or consumer-independent (PICR)?**

---

## Q7. Relationship to the 22 Cognitive Functions

The cognition anatomy defines 22 cognitive functions across 5 strata. Where does "emergence explanation through graph traversal" sit?

Candidates:
- **Stratum B — Synthesis & Transformation:** CF-08 (Operational Attention Routing) or CF-09 (Structural Integrity Verification)? Neither quite fits.
- **Stratum C — Temporal Continuity:** CF-13 (Emergence Chronicle Construction)? This is the closest named function, but it's about temporal chronicle, not structural emergence.
- **New function:** CF-23 (Structural Emergence Derivation)? This would require a G1 amendment to the cognition anatomy.

**This is deferred.** The hypothesis must be validated before proposing an addition to the canonical cognitive function inventory.

---

## Q8. Validation Approach

How do we test whether graph traversal produces meaningful emergence explanation?

Proposed approach:
1. Construct the graph from BlueEdge genesis_e2e_03 runtime data
2. Traverse it using severity-first strategy
3. Compare the traversal output to the existing ConsequenceCompiler narrative
4. Assess whether the traversal reveals emergence that the compiler's condition-level synthesis does not capture

**Success criterion:** The graph traversal produces at least one structural explanation that is:
- Not present in existing ConsequenceCompiler output
- Traceable entirely to evidence
- Deterministically reproducible
- Meaningful to an operator assessing the specimen
