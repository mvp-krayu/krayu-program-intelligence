# Graph Leakage Prevention Model
# PRODUCTIZE.LENS.GRAPH.PROJECTION.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.GRAPH.PROJECTION.01
- Date: 2026-04-16
- Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01

---

## SECTION 1 — PURPOSE

This document defines concrete prevention rules for client-safe graph projection. It addresses five distinct leakage vectors: node leakage, edge leakage, density leakage, naming leakage, and pattern leakage. It also defines the reconstruction risk test and red flag catalogue.

These rules are prevention-by-design, not detection-after-render. A graph projection that complies with this model cannot leak — it does not rely on post-render scrubbing.

---

## SECTION 2 — NODE LEAKAGE

### Definition
Node leakage occurs when a rendered node discloses internal system structure that a client should not have access to.

### Prevention Rules

**NL-01: No internal IDs in any rendered field.**
DOMAIN-XX, CAP-XX, COMP-XX, SIG-XX, COND-XX, DIAG-XX, INTEL-XX, ART-XX, CLM-XX, CONCEPT-XX, BC-XX — none of these may appear in any node field: id, label, class, cluster, status, emphasis, visible_reason, or summary.

**NL-02: Component nodes are absolutely forbidden.**
89 component-level nodes are ZONE-1 only. A single leaked component node (e.g., `RedisCacheModule`) reveals infrastructure naming convention, technology stack choices, and internal architecture at the module level. Zero tolerance.

**NL-03: Node IDs are opaque.**
Node `id` fields must be generated safe identifiers (`gn-01`, `gn-02` etc.) or a safe hash with no semantic content. An internal ID used as a node ID is immediately reconstructable.

**NL-04: Grounding metadata is stripped.**
`grounding` status (GROUNDED / WEAKLY GROUNDED) from canonical_topology.json must not appear in client-safe nodes. "WEAKLY GROUNDED" reveals where the assessment has gaps — this is operator/audit information only. It may be represented as a status: "partial" or status: "pending" only.

**NL-05: Domain type codes are not labels.**
`domain_type` values (FUNCTIONAL, INFRASTRUCTURE, CROSS-CUTTING, OPERATIONAL, INTEGRATION) are safe as human-readable secondary descriptors but must never appear as technical codes. If rendered, they must be translated to business language.

---

## SECTION 3 — EDGE LEAKAGE

### Definition
Edge leakage occurs when rendered edges disclose the internal relational model, derivation chain, or evidence structure.

### Prevention Rules

**EL-01: No chain-step edges.**
The internal signal derivation chain (CONDITION → DIAGNOSIS → INTELLIGENCE → SIGNAL) must never be represented as graph edges, even with renamed labels. A "condition informs diagnosis" edge is a chain-step edge regardless of its label.

**EL-02: No evidence-trace edges.**
Edges that represent "this node is evidence for this claim" (e.g., ART-04 → CLM-14) expose the artifact graph. These are ZONE-1 only. Not allowed even if the claim and artifact are renamed.

**EL-03: Edge direction governs information.**
A directed edge from Domain A to Domain B communicates a dependency. This is safe. A directed edge from Claim CLM-XX to Domain would communicate claim-to-topology mapping — this is a leakage vector even if the claim ID is hidden, because the structure itself reveals how claims map to domains.

**EL-04: No numeric edge weights.**
A numeric weight (0.7, 0.85) on an edge enables density analysis. A client could reconstruct which dependencies are strongest, thereby revealing the confidence model. Edge strength is bounded to "strong" / "moderate" / null only.

**EL-05: visible_reason is content-governed.**
The optional `visible_reason` field on an edge is the highest-risk string field in the schema. Rules:
- No claim IDs, signal IDs, or internal references
- No chain notation ("A → B → C → D")
- No derivation language ("derived from", "computed via", "grounded in ART-04")
- Maximum 120 characters
- Must describe the business relationship, not the evidence relationship

---

## SECTION 4 — DENSITY LEAKAGE

### Definition
Density leakage occurs when the number, pattern, or structure of rendered nodes/edges enables a technically capable client to infer the internal topology granularity, even if individual nodes and edges are safe.

### Prevention Rules

**DL-01: Maximum edges in full-domain view.**
When all 17 domains are shown, the maximum number of rendered edges is 25.
- Rationale: The binding envelope has 62 edges across 45 nodes. Rendering 62 edges against 17 domain nodes would compress all envelope edges into domain-to-domain pairs, fully revealing the cross-domain connectivity map.
- 25 edges against 17 nodes is below the threshold where the connectivity pattern becomes reconstructive.

**DL-02: Maximum edges in focus-domain subgraph.**
When a single domain or focus area is shown, the maximum number of rendered edges is 10.
- Rationale: Focus mode enables higher granularity (capabilities visible). Tight edge count prevents the subgraph from becoming a traceable subgraph of the full topology.

**DL-03: No isolated node clusters.**
If a domain appears with zero edges in a view that shows edges for other domains, it signals that the domain has no structural connections — this is an assertion about the topology that may be accurate or inaccurate. If a domain has no safe edges to show, it should appear in a cluster without individual edges, not as an isolated node.

**DL-04: No full cross-domain map.**
A view that shows all 17 domains AND all cross-domain relationships is equivalent to exposing the binding envelope. This is forbidden. If all 17 domains are shown, edges must be curated to a bounded subset (≤25), not exhaustive.

**DL-05: Cluster mode prevents density inference.**
When domain groups are clustered, the number of edges between clusters is inherently bounded. Cluster mode is the safest rendering for full-platform views because it abstracts away inter-domain edge specifics.

**DL-06: Capability-level edges only in focus subgraph.**
Capability-to-capability edges may only appear within a focus-domain subgraph, and only up to 6. Capability edges across different domains would expose the binding envelope connectivity model.

---

## SECTION 5 — NAMING LEAKAGE

### Definition
Naming leakage occurs when node or edge labels reveal internal system conventions, pipeline architecture, or internal nomenclature — even if no explicit ID is present.

### Prevention Rules

**NameL-01: No PSEE pipeline vocabulary.**
Terms from the internal pipeline (PSEE stage names, layer names, stream numbers) must not appear in any visible field. Examples of forbidden naming: "S2 topology", "L3 evidence", "40.x stream output", "binding layer".

**NameL-02: No evidence class vocabulary beyond bounded set.**
`evidence_class` vocabulary (VERIFIED, CONDITIONAL, PARTIAL, BLOCKED) is safe. Any other evidence status vocabulary (GROUNDED, WEAKLY GROUNDED, NOT_EVALUATED, UNKNOWN) must be translated before display.

**NameL-03: No internal abbreviations.**
Abbreviations that are meaningful inside PiOS but opaque externally must be expanded or replaced. Examples: "CEU" → "structural element", "ZFR" → not applicable in graph context, "CLM" → not applicable.

**NameL-04: Capability label review.**
Each capability label must be reviewed before use in a client-safe graph. A capability named with an internal abbreviation or technical artifact reference is not directly safe. Only capabilities whose names are interpretable without PiOS knowledge may appear directly.

**NameL-05: No run_id in visible graph fields.**
The `run_id` in the payload envelope is acceptable (same semantics as claim payloads). It must not appear as a visible node label, edge label, or cluster summary.

---

## SECTION 6 — PATTERN LEAKAGE

### Definition
Pattern leakage occurs when the combination of safe elements — individually harmless — collectively reveals internal structure. The primary risk is that a technically capable consumer with domain knowledge can combine safe labels, safe edges, and safe density to reconstruct a significant portion of the internal model.

### Prevention Rules

**PL-01: The narrative + graph combination test.**
If a client receives BOTH the LENS narrative (signal business_impact, executive verdict, decision conditions) AND the graph projection, can they reverse-engineer the mapping from signal to topology?

Prevention: Signal domain context (e.g., SIG-001 → "Edge Data Acquisition") may appear as a graph relationship at the focus-area level. The specific signal-to-capability mapping (which capability within the domain) must not be inferrable from the graph alone.

**PL-02: No complete hub-and-spoke from a single domain.**
If every capability of a domain is shown as a node, plus that domain's every peer domain, the subgraph is structurally equivalent to a portion of the binding envelope. Focus subgraphs must show EITHER selected capabilities OR peer domain connections — not both exhaustively.

**PL-03: The "helpful detail" boundary.**
A `visible_reason` field that explains too much can reconstruct the evidence chain even without IDs. Example of over-disclosure: "This relationship exists because the sensor bridge component (throughput ceiling: 250/s) constrains intelligence pathway capacity." This sentence contains: component reference, metric, and signal derivation basis — all from a supposedly safe field. Maximum visibility_reason length (120 chars) is enforced in part to prevent this.

**PL-04: Cross-domain signals and multi-domain edges.**
SIG-002 spans Platform Infrastructure and Data (7 unknown dimensions). Showing edges from Platform Infrastructure and Data to every domain that depends on it — combined with the signal narrative — would reveal which domains are structurally dependent on unknown runtime state. Edge count must be curated: show the 2–3 most meaningful, not all.

---

## SECTION 7 — RECONSTRUCTION RISK TEST

Before any graph payload is approved for delivery, apply this test:

1. Take the full graph payload (all nodes, all edges, clusters, labels).
2. Assume the consumer is technically capable and has general knowledge of fleet management platforms.
3. Ask: given only this payload, can they:
   - Identify the number of capabilities within any domain? → Must be NO (unless explicitly shown in focus mode)
   - Identify the names of any components? → Must be NO (always)
   - Reconstruct which signals map to which domains? → Must be NO (domain names are visible, but the specific signal-to-domain mapping at capability level must not be inferrable)
   - Infer which internal PSEE stages produced this graph? → Must be NO
   - Use the edge density to infer the full binding envelope? → Must be NO

If any answer is YES: the payload violates this model and must be revised before delivery.

---

## SECTION 8 — RED FLAG CATALOGUE

The following patterns are red flags that require review before delivery:

| red flag | threshold | action |
|----------|-----------|--------|
| Edge count > 25 in full-domain view | > 25 | Reduce to ≤ 25, curate to most meaningful |
| Edge count > 10 in focus subgraph | > 10 | Reduce to ≤ 10 |
| Any node label containing "-" followed by digits (ID pattern) | Any | Strip or replace |
| Any edge `visible_reason` containing "→" | Any | Remove chain notation |
| Capability nodes appearing outside focus mode | Any | Move to cluster or remove |
| Component names in any field | Any | Hard violation — remove immediately |
| `grounding` status exposed verbatim | Any | Translate to evidence status vocabulary |
| Node ID that matches `DOMAIN-\d+` or `CAP-\d+` pattern | Any | Replace with opaque gn-XX identifier |
| `visible_reason` > 120 characters | > 120 chars | Truncate or rewrite |
| Two domains connected by more than 3 edges | > 3 | Collapse to single curated edge with combined visible_reason |
| Graph payload + narrative combination enables signal-to-capability inference | Detectable | Reduce edge specificity |

**Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01**
