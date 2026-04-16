# Graph Projection Specification
# PRODUCTIZE.LENS.GRAPH.PROJECTION.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.GRAPH.PROJECTION.01
- Date: 2026-04-16
- Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01 (this stream)
- Parent contracts: PRODUCTIZE.LENS.ZONE2.SAFE.PAYLOAD.01, PRODUCTIZE.LENS.PROJECTION.CONTRACT.01

---

## SECTION 1 — FORMAL DEFINITION OF GRAPH PROJECTION

**Graph projection is NOT raw topology exposure.**

Graph projection is a curated, governed abstraction of system knowledge — derived from the canonical topology and evidence base — that is:
- suitable for ZONE-2 client viewing
- designed to communicate system understanding, domain structure, and meaningful cross-connections
- safe to show a non-technical executive audience without exposing internal reconstruction-grade structure

**Graph projection is NOT:**
- the raw Obsidian vault graph
- the raw wikilink connectivity model
- the raw `canonical_topology.json` or `binding_envelope.json`
- the operator trace graph
- the PSEE evidence chain
- a reconstruction surface

### The Fundamental Distinction

| | Internal Graph Truth | Client-Safe Graph Projection |
|---|---|---|
| Node vocabulary | DOMAIN-XX IDs, CAP-XX IDs, COMP-XX IDs, raw code artifact names | Business-meaningful domain names, abstracted capability labels, no component names |
| Edge semantics | condition chains, evidence links, derivation steps, signal-to-condition mappings | curated relationship classes (supports, connects to, informs) |
| Density | full relational map: 148 nodes, 62+ edges in binding envelope | limited curated view: 17 domain-level nodes maximum, bounded edge count |
| Grounding access | full artifact paths, source_refs, chain steps | none; evidence backing stated as available, not exposed |
| Reconstruction risk | HIGH — raw topology enables reverse engineering of PSEE structure | NONE — curation removes all reconstruction entry points |

### The Projection Transform

```
internal graph truth
        │
        ▼
graph projection transform
        │
        ├── node class filter (allowed classes only)
        ├── label governance (direct / normalized / abstracted / hidden)
        ├── edge class filter (allowed relationship classes only)
        ├── density limit (maximum visible connections)
        └── ID stripping (no internal IDs in any rendered field)
        │
        ▼
client-safe graph payload
        │
        ▼
LENS rendering
```

The transform is one-way and non-reversible. A client receiving the graph payload cannot reconstruct the internal topology, signal chain, or evidence structure.

---

## SECTION 2 — GOVERNING PRINCIPLES

**GP-01: Evidence-bound.** Every node and edge in the client-safe graph must be traceable to a grounded vault claim or entity. No nodes or edges are invented.

**GP-02: Non-reconstructive.** A client receiving the full graph payload must not be able to reconstruct the internal topology model, signal derivation chain, or evidence layer structure.

**GP-03: Label-governed.** Every visible label is evaluated against the label governance rules in `safe_node_edge_vocabulary.md`. No raw internal identifiers appear in rendered output.

**GP-04: Density-controlled.** The number of visible nodes and edges is bounded. Density bounds prevent pattern leakage even when individual nodes are safe.

**GP-05: ZONE-2 only.** Graph projection is a ZONE-2 artifact. It follows all rules from `zone2_safe_payload_profile.md`. Any graph field with a `_graph` suffix is explicitly forbidden by that profile.

**GP-06: Fail-closed on leakage risk.** If a node class, edge class, or label cannot be made safe, it is excluded — not approximated, not summarized in a way that reveals the original, not deferred.

---

## SECTION 3 — THE 17-DOMAIN QUESTION

**Can the 17-domain / 42-capability / 89-component view be shown?**

The 17 domain names are ZONE-2 safe. They are grounded in CLM-14 and CLM-27. Their names are business-meaningful without revealing internal structure.

Canonical domain names (grounded in `canonical_topology.json`):
1. Edge Data Acquisition
2. Telemetry Transport and Messaging
3. Fleet Core Operations
4. Fleet Vertical Extensions
5. Analytics and Intelligence
6. AI/ML Intelligence Layer
7. Sensor and Security Ingestion
8. Real-Time Streaming and Gateway
9. Access Control and Identity
10. Platform Infrastructure and Data
11. Event-Driven Architecture
12. SaaS Platform Layer
13. External Integration
14. Frontend Application
15. EV and Electrification
16. Operational Engineering
17. Extended Operations and Driver Services

These 17 names MAY appear as Domain-class nodes in a client-safe graph.

**Capability names:** Conditionally safe. See Section 4 and `safe_node_edge_vocabulary.md §CAPABILITY`.

**Component names:** ZONE-1 only. Never appear in client-safe graph. Grounded in Rule L-07 of `lens_v1_content_model.md`.

**Rendering the 17 domains directly:** A 17-domain graph is dense but not reconstructive if edges are properly bounded. If rendered, edge count must not exceed the limits in `graph_leakage_prevention.md §DENSITY`. Cluster mode is strongly preferred for first-render.

---

## SECTION 4 — SCOPE OF THIS CONTRACT

This contract governs:
- which node classes are allowed
- which edge classes are allowed
- label governance rules
- density and abstraction limits
- the graph payload schema that LENS will consume
- leakage prevention rules
- rendering guidance

This contract does NOT govern:
- the implementation of a graph rendering library
- the projection runtime
- vault content or topology computation
- GAUGE topology page behavior

---

## SECTION 5 — RELATIONSHIP TO EXISTING CONTRACTS

| contract | relationship |
|----------|-------------|
| `zone2_safe_payload_profile.md` | Parent safety boundary. Graph payload is a ZONE-2 payload. All §3 forbidden fields apply. `_graph` key suffix is explicitly forbidden. |
| `projection_contract_spec.md` | Parent projection model. Graph projection is a new projection type; determinism, zone-filter, and fail-closed rules apply. |
| `lens_v1_content_model.md` | Domain names are ZONE-2 safe per Rule L-07 note. Component names forbidden. Signal domains (e.g., "Edge Data Acquisition" for SIG-001) are safe. |
| `ENT-topology-nodes.md` | Node class definitions grounded here: 17 domains, 42 capabilities, 89 components. |

**Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01**
