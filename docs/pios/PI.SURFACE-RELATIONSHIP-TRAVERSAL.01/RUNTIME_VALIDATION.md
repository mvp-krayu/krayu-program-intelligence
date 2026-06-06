# RUNTIME VALIDATION — PI.SURFACE-RELATIONSHIP-TRAVERSAL.01

Stream: PI.SURFACE-RELATIONSHIP-TRAVERSAL.01 | Branch: feature/runtime-demo

---

## Experiment

Constructed the Surface Relationship Graph from BlueEdge genesis_e2e_03 runtime data. Traversed it. Compared output against ConsequenceCompiler explanation.

## Result

**Surface-level traversal does not outperform condition-level consequence synthesis on BlueEdge.**

### What the ConsequenceCompiler produces

- 12 conditions across 2 active domains (DOMAIN-10, DOMAIN-14)
- 4 consequence objects including 3 combination patterns
- 9 cognition slices with domain attribution and severity
- 2 domain narratives with risk shape classification
- 3 reinforcement flow relationships with relationship verbs
- Rich emergence narrative: "gravity well — flow, concentration, and coupling converging"

### What the Surface Relationship Graph produces

- 1 surface-to-surface edge (Delivery Fragility ↔ Propagation Risk sharing "backend")
- 0 surface pairs sharing 2+ domains
- 0 domains with 3+ converging condition types
- 0 reinforcement edges (top_flows empty)
- Thin emergence narrative with less explanatory power than the compiler

### Why

`affected_domains` is sparsely populated — 6 of 10 surfaces have empty arrays. But this is the symptom, not the cause.

The cause: **surfaces are abstractions**. They are too coarse for emergence explanation. The ConsequenceCompiler works because it operates at condition granularity:

```
Condition A reinforces Condition B inside Domain X
```

The graph attempted:

```
Surface A relates to Surface B
```

Less information. Less specificity. Naturally less explanatory power.

## Verdict

### KILLED: Surface Relationship Graph as the next capability

Not because it is impossible. Because BlueEdge demonstrated it is the **wrong abstraction layer** for emergence explanation. Condition-level synthesis is richer, more specific, and already operational.

### PRESERVED: Observe → Relate → Explain

The architectural finding that cognition formation has stages remains valid. But the "Relate" stage operates closer to conditions and consequences than to surfaces.

### ELEVATED: ConsequenceCompiler

The experiment accidentally proved that the ConsequenceCompiler is not a narrative formatter. When challenged by an alternative explanatory model (graph traversal), it won. It is already performing a form of governed emergence explanation at the condition level.

The ConsequenceCompiler is elevated from:
- **Prior classification:** projection utility (proto-PRE Zone B)
- **New classification:** candidate core cognition mechanism

This is a more significant outcome than a successful graph prototype would have been.

## Evidence

Experiment script: `app/execlens-demo/lib/lens-v2/experiment_graph_delta.js` (disposable — deleted after validation)

Runtime data: BlueEdge genesis_e2e_03, 10 materialized surfaces, 12 conditions, 4 consequences.
