# Safe Node and Edge Vocabulary
# PRODUCTIZE.LENS.GRAPH.PROJECTION.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.GRAPH.PROJECTION.01
- Date: 2026-04-16
- Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01

---

## PART A — ALLOWED NODE CLASSES

### NODE CLASS 1: Domain

**Purpose:** Represents a distinct functional boundary within the client system. The highest-level structural unit. Grounded in CLM-14, CLM-27, and `ENT-topology-nodes.md`.

**Grounding:** 17 domains in canonical topology. All are ZONE-2 safe per `zone2_safe_payload_profile.md` and `lens_v1_content_model.md` Rule L-07.

**Safe visible label rules:**
- DIRECT NAMING ALLOWED — domain names are business-meaningful and client-safe.
- All 17 canonical names may appear verbatim as node labels.
- Internal DOMAIN-XX IDs must never appear in any visible field.
- `domain_type` (FUNCTIONAL, INFRASTRUCTURE, CROSS-CUTTING, OPERATIONAL, INTEGRATION) is conditionally allowed as a secondary label if it aids readability; it must not appear as a raw code.

**Appearance:**
- PRIMARY NODE — can be the hub node or a top-level peer node
- CLUSTER NODE — can label a cluster of capabilities within it
- DETAIL NODE — not applicable (domain is the top level)

**Emphasis:**
- May be highlighted if it is the focus domain (e.g., Security Intelligence relates to Edge Data Acquisition + Sensor and Security Ingestion)
- May carry an evidence status indicator (VERIFIED / CONDITIONAL / PARTIAL) if a signal claim anchors to it

**Forbidden for this class:**
- `domain_id` (DOMAIN-XX) in any rendered field
- `capability_ids[]` or `component_ids[]` in the node payload
- `evidence_refs[]` in the node payload
- `grounding` status code (GROUNDED / WEAKLY GROUNDED) — allowed only as a safe translated label if needed

---

### NODE CLASS 2: Capability

**Purpose:** Represents a functional service or surface area within a domain. The mid-level structural unit. Grounded in CLM-15 (42 capabilities total).

**Grounding:** 42 capabilities across 17 domains. Capability names are generally functional and business-interpretable (e.g., "Sensor Ingestion", "Fleet Tracking", "Analytics Pipeline"). Not all capability names are safe — see rules below.

**Safe visible label rules:**
- CONDITIONAL DIRECT NAMING — capability names may appear ONLY if the name is interpretable without engineering context.
  - ALLOWED EXAMPLE: "Fleet Tracking", "Authentication and Authorization", "Analytics Pipeline"
  - REQUIRES ABSTRACTION: any capability name containing a version number, internal code reference, or ambiguous abbreviation
- If a capability name is not directly safe, replace with a plain English description derived from its domain context.
- CAP-XX IDs must never appear in any rendered field.

**Appearance:**
- CLUSTER NODE — preferred; capabilities appear as labels within a domain cluster
- DETAIL NODE — allowed in focus-domain subgraph only
- PRIMARY NODE — not recommended; domain is the appropriate primary node

**When to use:**
- In the focus-domain subgraph (Section F of graph_projection_spec.md)
- When capability-level granularity communicates meaningful client-facing detail
- When the capability count (42) is cited as a metric

**Forbidden for this class:**
- CAP-XX IDs in any rendered field
- Component-level names within a capability node
- Internal cross-reference identifiers

---

### NODE CLASS 3: Component

**ZONE-1 ONLY. Not allowed in client-safe graph projection.**

Component names are technical artifact names (e.g., `RedisCacheModule`, `hasi_bridge.py`, `FleetEventsModule`). These are explicitly forbidden from ZONE-2 output per Rule L-07 of `lens_v1_content_model.md`.

Components may appear as an aggregate count only:
- "89 components mapped" — safe
- Individual component names — forbidden

A component node must never appear in a client-safe graph payload at any depth.

---

### NODE CLASS 4: Focus Area

**Purpose:** A curated thematic lens over the graph — representing a cross-cutting concern or attention area that LENS wants to highlight. Not a raw topology class; a projection-layer concept.

**Examples of valid focus areas:**
- "Security Intelligence" — derived from SIG-001 (Edge Data Acquisition / Sensor and Security Ingestion) anchored to CLM-20
- "Platform Runtime" — derived from SIG-002 (Platform Infrastructure and Data) anchored to CLM-21
- "Operational Readiness" — the assessed readiness state, derived from CLM-25

**Safe visible label rules:**
- ABSTRACTED LABEL REQUIRED — focus area labels are projection-layer concepts, not raw topology classes
- Labels must be plain English business language
- Must not expose internal signal IDs, claim IDs, or derivation chain references

**Appearance:**
- PRIMARY NODE — may appear as the hub in a focus-domain subgraph
- CLUSTER NODE — may aggregate multiple domains under a thematic area
- DETAIL NODE — not applicable

**When to use:**
- When the graph communicates a specific readiness narrative (not just topology)
- In the focus-domain mini-network (connected to Domain nodes it draws from)

---

## PART B — FORBIDDEN NODE CLASSES

The following node classes must never appear in a client-safe graph:

| forbidden class | examples | reason |
|----------------|---------|--------|
| Evidence Artifact | ART-04, ART-01, canonical_topology.json | Internal pipeline artifact references; expose vault structure |
| Condition Node | COND-001..COND-N | Internal condition evidence IDs; expose signal derivation chain |
| Diagnosis Node | DIAG-001..DIAG-N | Internal diagnostic layer; expose reasoning model |
| Intelligence Node | INTEL-001..INTEL-N | Internal intelligence layer IDs; expose computation chain |
| Signal Registry Node | SIG-001..SIG-005 | Internal signal IDs; use signal title + domain mapping instead |
| Trace Node | Any node representing a derivation step | Exposes evidence chain; enables reconstruction |
| Governance Node | CONCEPT-XX, DIM-XX, BC-XX | Internal governance references; operator/audit only |
| Claim Node | CLM-01..CLM-27 | Internal claim IDs must never appear; use claim_label or business framing |
| Projection Rule Node | PR-XX | Internal projection rules; operator only |
| Run Node | run_id references | Internal execution references; never client-facing |
| Component Node | COMP-XX, filenames | ZONE-1 technical identifiers; forbidden per Rule L-07 |

---

## PART C — ALLOWED EDGE CLASSES

For each class: its client-safe meaning, rendering implication, and where it is allowed.

### EDGE CLASS 1: `supports`

**Client-safe meaning:** One domain/capability provides foundational function that enables another.
**Rendering:** Directed arrow; weight represents strength of dependency (optional, bounded — strong / moderate only)
**Allowed between:** Domain → Domain, Domain → Focus Area, Capability → Capability (focus subgraph only)
**Example:** "Edge Data Acquisition supports Security Intelligence" (grounded in SIG-001)

### EDGE CLASS 2: `connects to`

**Client-safe meaning:** Two domains have a defined structural relationship or data flow between them.
**Rendering:** Undirected line; default weight
**Allowed between:** Domain → Domain
**Example:** "Telemetry Transport and Messaging connects to Fleet Core Operations"

### EDGE CLASS 3: `depends on`

**Client-safe meaning:** One domain/capability requires the outputs or services of another to function.
**Rendering:** Directed arrow, dashed if the dependency is conditional or unvalidated
**Allowed between:** Domain → Domain, Focus Area → Domain
**Example:** "Analytics and Intelligence depends on Platform Infrastructure and Data"

### EDGE CLASS 4: `informs`

**Client-safe meaning:** One domain provides evidence or intelligence that shapes the assessment of another.
**Rendering:** Directed arrow, lighter weight than `supports`
**Allowed between:** Domain → Focus Area, Capability → Focus Area (focus subgraph only)
**Example:** "Edge Data Acquisition informs Operational Readiness assessment"

### EDGE CLASS 5: `part of`

**Client-safe meaning:** A capability or domain is a constituent part of a larger domain cluster.
**Rendering:** Containment indicator or bundled edge in cluster mode
**Allowed between:** Capability → Domain (cluster membership), Domain → Cluster Group
**Example:** "Sensor and Security Ingestion [is] part of Security Intelligence [focus area]"

---

## PART D — FORBIDDEN EDGE CLASSES

The following edge semantics must never appear in a client-safe graph:

| forbidden edge class | examples | reason |
|---------------------|---------|--------|
| Evidence chain step | COND → DIAG → INTEL | Exposes internal signal derivation chain |
| Derivation edge | SIG derived from COND | Exposes computation structure |
| Signal-to-claim link | CLM-20 ← SIG-001 | Exposes internal claim-to-signal mapping |
| Artifact dependency | ART-04 → CLM-14 | Exposes artifact graph structure |
| Trace link | Any "evidence for" edge | Enables reconstruction of PSEE layer structure |
| Raw topology link | COMP-XX → CAP-XX | Component-level edges; ZONE-1 only |
| Binding envelope link | Raw binding_envelope.json edges | Full relational map; enables IP reconstruction |
| Operator lineage edge | stage → stage pipeline edges | Internal execution pipeline; operator/audit only |

---

## PART E — SUMMARY TABLE

| class | type | zone | direct naming | max visible |
|-------|------|------|--------------|-------------|
| Domain | Node | ZONE-2 | YES | 17 |
| Capability | Node | ZONE-2 (conditional) | CONDITIONAL | As needed in focus subgraph |
| Component | Node | ZONE-1 ONLY | NEVER | 0 |
| Focus Area | Node | ZONE-2 | ABSTRACTED LABEL | 3–5 |
| `supports` | Edge | ZONE-2 | YES | Bounded (see density rules) |
| `connects to` | Edge | ZONE-2 | YES | Bounded |
| `depends on` | Edge | ZONE-2 | YES | Bounded |
| `informs` | Edge | ZONE-2 | YES | Bounded |
| `part of` | Edge | ZONE-2 | YES | Bounded |
| Condition/Diagnosis/Intelligence node | Node | ZONE-1+ | NEVER | 0 |
| Evidence chain edge | Edge | ZONE-1+ | NEVER | 0 |

**Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01**
