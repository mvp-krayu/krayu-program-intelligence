# Brain Node — Canonical
# Trace Graph Model

**Authority:** TIER2.TRACE.QUERY.CONTRACT.01
**Brain:** CANONICAL
**Status:** DEFINED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.TRACE.QUERY.CONTRACT.01.md
**Upstream:** docs/brain/canonical/diagnostic_zone_construct.md

---

## CONSTRUCT DEFINITION

The trace graph is a canonical structural representation of the program topology, its signals, and its evidence artifacts. It is constructed deterministically from the canonical data sources at query time. It is not stored as a persistent artifact — it is derived on demand and discarded after query execution.

---

## NODE TYPES

| Node type | Identifier format | Source artifact | Source field |
|---|---|---|---|
| `DOMAIN` | `DOMAIN-{NN}` | `canonical_topology.json` | `domains[].domain_id` |
| `CAPABILITY` | `CAP-{NN}` | `canonical_topology.json` | `domains[].capability_ids[]` |
| `COMPONENT` | `COMP-{NN}` | `canonical_topology.json` | `domains[].component_ids[]` |
| `SIGNAL` | `SIG-{NNN}` | `signal_registry.json` | `signals[].signal_id` |
| `ARTIFACT` | `ART-{NNN}` | `signal_registry.json` | `signals[].artifacts[]` |
| `GAUGE` | `GAUGE` | `gauge_state.json` | singleton context node |

All node IDs are canonical and immutable within a run. No node ID may be invented.

---

## EDGE TYPES

| Edge type | Source node type | Target node type | Derivation |
|---|---|---|---|
| `CONTAINMENT` | DOMAIN | CAPABILITY | `domains[].capability_ids[]` |
| `CONTAINMENT` | CAPABILITY | COMPONENT | `domains[].component_ids[]` |
| `DEPENDENCY` | DOMAIN | DOMAIN | `edges[]` in canonical_topology |
| `DEPENDENCY` | CAPABILITY | CAPABILITY | structural derivation from domain edges |
| `SIGNAL_EMISSION` | DOMAIN/CAPABILITY/COMPONENT | SIGNAL | `signals[].domain_id` + scope |
| `EVIDENCE_LINK` | SIGNAL | ARTIFACT | `signals[].artifacts[]` |
| `PROPAGATION` | NODE | NODE | declared in Diagnostic Narrative propagation paths |

Constraint: All edges must be derivable from the source fields listed above. No edge may be constructed from inference alone — inferred edges must be labeled `INFERRED` with explicit declaration.

---

## GRAPH CONSTRUCTION RULES

1. Graph is built from the three canonical data sources: `canonical_topology.json`, `signal_registry.json`, `gauge_state.json`
2. Construction is deterministic: same inputs produce identical graph
3. DOMAIN nodes are created first; CAPABILITY and COMPONENT nodes are attached via CONTAINMENT
4. SIGNAL nodes are attached to their scope nodes via SIGNAL_EMISSION
5. ARTIFACT nodes are attached to SIGNAL nodes via EVIDENCE_LINK
6. GAUGE node is a singleton attached to all DOMAIN nodes via an implicit scoring context edge (not traversable, read-only context)
7. Grounding state is a node attribute, not an edge — derived from `domains[].grounding`

---

## TRAVERSAL RULES

1. Traversal starts from an entry node (valid canonical node ID)
2. Traversal follows declared edge types only
3. Direction is caller-specified: `UPSTREAM` | `DOWNSTREAM` | `BOTH`
4. Depth is bounded by `depth_limit` (integer 1–5 for v1)
5. Each traversed node records:
   - `node_id`
   - `node_type`
   - `grounding_state` (if DOMAIN)
   - `evidence_support` (STRONG | PARTIAL | INFERRED)
6. Traversal terminates on:
   - No further edges in the specified direction
   - `depth_limit` reached
   - Evidence exhausted (no EVIDENCE_LINK reachable from current node)

---

## EVIDENCE SUPPORT CLASSIFICATION

```
STRONG:
  - Path segment has a SIGNAL node with at least one EVIDENCE_LINK to an ARTIFACT
  - Signal confidence in signal_registry is not WEAK

PARTIAL:
  - Path segment has a SIGNAL node but EVIDENCE_LINK leads to missing or incomplete artifact
  - Signal confidence in signal_registry is WEAK

INFERRED:
  - Path segment has no SIGNAL node
  - Connection derived from topology structure only
  - MUST be labeled INFERRED
  - inferred_declaration REQUIRED in all rendered outputs
```

---

## DIRECT EVIDENCE vs INFERRED PATH

```
direct_evidence:
  A path segment where a SIGNAL node exists with at least one reachable ARTIFACT
  via EVIDENCE_LINK. Evidence is observable and artifact-referenced.

inferred_path:
  A path segment where no SIGNAL → ARTIFACT chain exists.
  The structural connection is derivable from topology but not artifact-confirmed.
  MUST carry: evidence_support = INFERRED
  MUST carry: inferred_declaration = "This path segment is inferred. No artifact
  evidence directly confirms this structural connection."
```

---

## INVARIANTS

- Graph is stateless between queries — not cached, not mutated
- No node is added to the graph unless derivable from canonical sources
- No edge is traversed silently as inferred — all inferred segments are declared
- GAUGE node is context-only — not a traversal target
- Grounding state is read-only on nodes — traversal does not modify it
- The same query on the same canonical sources produces the same traversal result
