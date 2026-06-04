# DISCOVERY — PI.SURFACE-RELATIONSHIP-TRAVERSAL.01

Stream: PI.SURFACE-RELATIONSHIP-TRAVERSAL.01 | Classification: G1 | Branch: feature/runtime-demo

---

## 1. What Was Found

Two SW-Intel surfaces — REINFORCEMENT_FLOWS and CONVERGENCE_PATTERNS — carry structural relationship data that is currently flattened into inventory counts at projection time. The data contains proto-graph edges that, if preserved, would form a traversable surface relationship graph.

### 1.1 REINFORCEMENT_FLOWS — Proto-Edges

`reinforcementFlows.js` (lines 52-66) produces `top_flows`:

```javascript
{
  from_type: 'DELIVERY_PRESSURE_CONCENTRATION',
  from_type_label: 'DELIVERY PRESSURE',
  to_type: 'STRUCTURAL_MASS_CONCENTRATION',
  to_type_label: 'STRUCTURAL MASS',
  verb: 'reinforces',
  domain: 'Platform'
}
```

These are condition-type pairs scoped to a specific domain. Each pair states: "In domain X, condition type A and condition type B co-occur — A reinforces B." The `verb` is always `'reinforces'`.

Currently: the SoftwareIntelligenceProjectionAdapter (lines 600-608) collapses these edges into self-loops: `{ from: domain_id, to: domain_id, type: 'reinforcement' }`. The edge structure is discarded.

### 1.2 CONVERGENCE_PATTERNS — Convergence Nodes

`convergencePatterns.js` (lines 85-93) produces `convergence_domains`:

```javascript
{
  domain: 'Platform',
  condition_count: 3,
  condition_types: ['DELIVERY PRESSURE', 'STRUCTURAL MASS', 'BOUNDARY DIVERGENCE']
}
```

These are domains where multiple condition types converge. Each entry states: "Domain X has N independent condition types acting on it simultaneously — this is compound pressure, not additive."

Currently: the adapter reads `convergence_domains` as domain emphasis targets. The convergence structure (which conditions converge where) is flattened into a count.

### 1.3 Surface-Level Domain Membership

Every SW-Intel surface carries `affected_domains[]` — the list of domains that surface touches. Two surfaces sharing affected domains have a structural relationship through domain co-presence.

This is already computed. Not consumed as relationship data.

---

## 2. The Graph That Already Exists

The following graph is implicit in existing PICP data:

| Graph Element | Source | Computed? |
|---|---|---|
| **Nodes** | 12 SW-Intel surfaces | YES — PICR materializers |
| **Domain membership** | `surface.affected_domains[]` | YES — per surface |
| **Reinforcement edges** | `reinforcement_flows.top_flows[].from_type → to_type` in domain | YES — `reinforcementFlows.js` |
| **Convergence nodes** | `convergence_patterns.convergence_domains[]` | YES — `convergencePatterns.js` |
| **Edge weight** | Number of shared domains between surfaces | DERIVABLE — set intersection of `affected_domains` |
| **Convergence depth** | `condition_count` per domain | YES — `convergencePatterns.js` |

No new CIP computation needed. No new signal extraction. No new evidence processing. The graph edges are already materialized by existing PICR materializers. They are flattened into inventory at the projection step.

---

## 3. The Observation

The condition types in `top_flows` map implicitly to surfaces:

- `DELIVERY_PRESSURE_CONCENTRATION` → signals consumed by `DELIVERY_FRAGILITY` materializer
- `STRUCTURAL_MASS_CONCENTRATION` → signals consumed by `STRUCTURAL_FRAGILITY` materializer
- `CROSS_DOMAIN_COUPLING_PRESSURE` → signals consumed by `STRUCTURAL_COUPLING` materializer
- `EXECUTION_FRAGILITY` → directly named in `convergencePatterns.js` (line 62)
- `STRUCTURAL_BOUNDARY_DIVERGENCE` → directly named in `convergencePatterns.js` (line 76)

The mapping is implicit (materializers filter signals by domain presence and severity, not by condition type). But it is recoverable: a condition type co-occurring in a domain maps to the surface whose materializer consumes signals in that domain.

A reinforcement flow `{from_type: DELIVERY_PRESSURE, to_type: STRUCTURAL_MASS, domain: Platform}` implies a surface-level edge: **DELIVERY_FRAGILITY → STRUCTURAL_FRAGILITY through domain Platform**.

---

## 4. What This Means

If the graph is preserved instead of flattened, traversal produces emergence explanation:

```
"Platform carries compound risk because delivery pressure and structural mass
reinforce each other in that domain (reinforcement edge), while boundary divergence
independently converges on the same domain (convergence node). Three condition types
on one domain is not additive risk — it is compound emergence. The delivery pressure
didn't arrive alone. It arrived into a domain already carrying structural mass, and
the boundary divergence means the domain can't contain the compounding."
```

That narrative is not generated. It is **traversed**. Same graph → same traversal → same narrative.

It answers "why it emerged" — not by interpreting, but by walking edges:
1. Which conditions co-occur (reinforcement edges)
2. Where they converge (convergence nodes)
3. What sequence of compounding produced the current state (traversal order by severity/density)

---

## 5. Evidence Files

| File | Lines | What It Contains |
|---|---|---|
| `app/execlens-demo/lib/lens-v2/cognition/materializers/reinforcementFlows.js` | 52-66 | `top_flows` edge generation |
| `app/execlens-demo/lib/lens-v2/cognition/materializers/convergencePatterns.js` | 85-93 | `convergence_domains` convergence node generation |
| `app/execlens-demo/lib/lens-v2/SoftwareIntelligenceProjectionAdapter.js` | 600-608 | Where edges are flattened into self-loops |
| `app/execlens-demo/lib/lens-v2/SoftwareIntelligenceProjectionAdapter.js` | 625-641 | Where convergence is flattened into domain emphasis |
| `app/execlens-demo/lib/lens-v2/SoftwareIntelligenceProjectionAdapter.js` | All surfaces | `affected_domains[]` on every surface |
