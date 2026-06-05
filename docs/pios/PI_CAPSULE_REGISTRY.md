# PI Cognition Vector Registry

Constitutional record of Program Intelligence cognition vectors. Each vector represents a canonical cognitive primitive — a fundamental question that PI can ask of any evidence substrate.

Vectors are cognitive primitives. They are domain-neutral. They are not modules, not SKUs, not implementation artifacts. A vector answers a fundamental question that survives domain changes — software, PMO, security, architecture, transformation all consume the same vectors.

Domain Modules are compositions of vectors applied to specific evidence substrates. Software Intelligence is not new cognition — it is vectors applied to code evidence. PMO Intelligence is not new cognition — it is vectors applied to planning evidence.

**The vector count is emergent, not fixed.** Current vectors are those discovered through interrogation. Future sessions may reveal more, or may collapse vectors that turn out to be the same primitive under pressure.

**Last updated:** 2026-06-03
**Discovery instrument:** THORR governed interrogation
**Authoritative discovery log:** `pi_discovery_specimens.json`

---

## Vectors

### VEC-01 — GOVERNANCE

| Field | Value |
|-------|-------|
| Fundamental question | Can this conclusion be trusted? |
| Concerned with | Evidence quality, qualification, confidence, authority, escalation, governance boundaries |
| Output | GOVERNED / ADVISORY_BOUND / INSUFFICIENT_EVIDENCE |
| PI Core status | **EXISTS** — 19+ mechanisms. Confidence hierarchy, floor propagation, context honesty, 12 prohibitions, per-condition governance boundary. End-to-end propagation from signal extraction through narrative. |
| Discovery source | Genesis — this vector existed before the discovery framework. Formalized through BlueEdge multi-persona interrogation (2026-06-03). |
| Boundary specimens | PID-002 (confidence not propagated to finding level), PID-003 (combination confidence inherits ceiling not floor) |
| Status | **DISCOVERED** |

Domain projections:
- Software: Is this architecture conclusion trustworthy?
- PMO: Is this planning conclusion trustworthy?
- Security: Is this vulnerability assessment trustworthy?

---

### VEC-02 — STRUCTURE

| Field | Value |
|-------|-------|
| Fundamental question | What actually exists? |
| Concerned with | Topology, relationships, dependency networks, concentrations, coupling, organizational shape |
| Output | Structural truth |
| PI Core status | **EXISTS** — this IS PI Core. Graph construction, dependency analysis, coupling measurement, structural mass, topology derivation, domain classification. |
| Discovery source | Genesis — the foundational PI science. |
| Boundary specimens | — (no boundary specimen; this vector IS the foundation) |
| Status | **DISCOVERED** |

Domain projections:
- Software: Dependency graph, code topology
- PMO: Planning graph, program structure, ART dependency graph
- Security: Attack surface topology, exposure graph

---

### VEC-03 — PRESSURE

| Field | Value |
|-------|-------|
| Fundamental question | Where is stress accumulating? |
| Concerned with | Bottlenecks, saturation, fragility, concentration, overload, execution pressure |
| Output | Pressure zones |
| PI Core status | **EXISTS** — 16+ mechanisms. Pressure zone detection, constriction points, hub centrality, fragility scoring, signal synthesis, condition derivation, multi-factor escalation gates. |
| Discovery source | Genesis — pressure detection was the first cognition that went beyond structural measurement. |
| Boundary specimens | PID-004 (structural absence not surfaced — pressure detection missed Fleet Operations because zero-evidence domains were not flagged) |
| Status | **DISCOVERED** |

Domain projections:
- Software: Infrastructure chokepoint, frontend fragility cluster
- PMO: ART dependency bottleneck, capacity saturation, planning overload
- Security: Exposure concentration, attack surface pressure

---

### VEC-04 — TRAJECTORY

| Field | Value |
|-------|-------|
| Fundamental question | What is changing? |
| Concerned with | Drift, acceleration, deterioration, improvement, trend, evolution |
| Output | Direction of movement |
| PI Core status | **ABSENT** for structural domain. Infrastructure designed (temporal_marker field on every consequence, EXSIG/TIMSIG signal family vocabulary) but not activated. SQO reconciliation domain has proven temporal architecture pattern (reusable). trajectoryAssessment.js is pseudo-temporal (PID-006 pattern — static property lookup using trajectory language). |
| Discovery source | Chief Architect interrogation (2026-06-03). PID-006 confirmed the boundary between static evidence and trajectory reasoning. |
| Boundary specimens | PID-006 (temporal claims from static evidence), PID-008 (Program Director required future-state reasoning) |
| Status | **DISCOVERED** (boundary proven, capability absent) |

Domain projections:
- Software: Coupling increasing, fragility worsening
- PMO: Dependency pressure worsening, capacity trending toward saturation
- Security: Exposure surface expanding, vulnerability density increasing

---

### VEC-05 — TRANSFORMATION

| Field | Value |
|-------|-------|
| Fundamental question | What must change? |
| Concerned with | Prerequisite chains, readiness, transition pathways, capability maturation, intervention sequencing |
| Output | Transformation readiness |
| PI Core status | **PARTIAL** — lower layers exist (constraint identification, execution ceiling detection via DEL_CEILING consequence, dependency qualification, constriction detection). Orchestration layer absent (prerequisite chains, readiness models, intervention sequencing). |
| Discovery source | Hypothesized from Program Director and Chief Architect boundary patterns. Not yet directly interrogated as an isolated vector. |
| Boundary specimens | — (indirect evidence from PID-008; direct boundary interrogation needed) |
| Status | **HYPOTHESIS** |

Domain projections:
- Software: Preconditions for modernization, migration readiness
- PMO: Preconditions for PI success, program transformation readiness
- Security: Preconditions for compliance, remediation sequencing

---

### VEC-06 — IMPACT

| Field | Value |
|-------|-------|
| Fundamental question | Why does this matter? |
| Concerned with | Consequences, propagation, blast radius, business implications, operational implications |
| Output | Qualified consequences |
| PI Core status | **EXISTS** — 14+ mechanisms. 11 consequence types with three-layer vocabulary, combination detection (3 named patterns), risk class behavioral classification (A-E), relationship verbs, exposure widening, domain risk profiles, boardroom narrative synthesis. |
| Discovery source | Genesis — consequence framing is what transformed PI from measurement into cognition. |
| Boundary specimens | PID-007 (two risk zones at different evidence depths presented with equivalent weight — impact framing lacked depth asymmetry) |
| Status | **DISCOVERED** |

Domain projections:
- Software: Delivery ceiling, propagation risk, coordination fragility
- PMO: Program execution ceiling, cross-ART blast radius
- Security: Breach impact, compliance exposure, supply chain consequences

---

### VEC-07 — DECISION

| Field | Value |
|-------|-------|
| Fundamental question | What action becomes possible? |
| Concerned with | Intervention points, prioritization, options, executive choices, decision qualification |
| Output | Decision surface |
| PI Core status | **PARTIAL** — guided interventions exist (INSPECT, TRACE, COMPARE, QUALIFY, DECOMPOSE per condition), altitude translation for different decision-makers, module activation gating. Prescriptive action is constitutionally prohibited (13 prohibitions) — which is correct. Decision surfaces are bounded by evidence, not prescriptive. |
| Discovery source | Multi-persona interrogation (2026-06-03). Each persona exercised a different decision altitude over the same structural evidence. |
| Boundary specimens | PID-008 (Program Director needed decision inputs PI Core couldn't provide — budget, planning, capacity decisions) |
| Status | **DISCOVERED** |

Domain projections:
- Software: Areas requiring structural intervention
- PMO: Programs requiring intervention, budget allocation signals
- Security: Vulnerabilities requiring remediation, compliance actions

---

## Domain Module Composition

Vectors are the science. Domain Modules are the commerce. A Domain Module is a composition of vectors applied to a specific evidence substrate, delivered through specific projection families.

```
Domain Module = Vectors × Evidence Substrate × Projection Families
```

Personas are projections OF vectors, not consumers of modules. A Program Director sees the vectors projected at program-governance altitude. An RTE sees the same vectors at execution-flow altitude. Altitude translation already exists for this (22 mechanisms in PI Core).

### Known compositions

| Domain Module | Vectors consumed | Evidence substrate | Example projections |
|---|---|---|---|
| Software Intelligence | All vectors | Code graph, AST, dependency, fragility | BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION |
| PMO Intelligence | All vectors | Jira, velocity, ART structure, capacity, PI objectives | Program Director, RTE, Portfolio Manager, Steering Committee |
| Portfolio Intelligence | All vectors | Funding, allocation, portfolio structure | Portfolio Manager, CFO, Investment Committee |
| Security Intelligence | All vectors | CVE, SBOM, threat model | CISO, Security Architect, Compliance |

**Note:** Software Intelligence exists as a commercial module today. All others are hypothesized. Every domain module consumes ALL vectors — what differs is the evidence substrate and the projection altitude. A vector that is ABSENT (e.g., TRAJECTORY) limits what any domain module can answer, regardless of domain.

### Scaling property

Each new vector multiplies the capability of every domain module. Each new domain module multiplies the value of every vector. Each new projection family multiplies the reach of every module. This is the marketplace formula.

---

## Vector Status Lifecycle

| Status | Meaning |
|--------|---------|
| HYPOTHESIS | Cognitive primitive suspected but boundary not confirmed through interrogation |
| DISCOVERED | Boundary confirmed — at least one PID specimen proves this question is a distinct cognitive primitive |
| VALIDATED | Vector demonstrated operationally — produces outputs from real evidence in at least one domain |
| CANONICAL | Vector formally recognized — available for commercial composition across all domain modules |

No vector advances status without interrogation evidence. The vector count is emergent — new vectors may be discovered, existing vectors may be merged. Status is earned, not declared.

---

## Governance

This registry is a constitutional artifact. It records what Program Intelligence has discovered about its own cognitive primitives.

**What belongs here:** Discovered vectors, their fundamental questions, their PI Core implementation status, their discovery lineage, their domain projections.

**What does not belong here:** Implementation details, file paths, function signatures, roadmap timelines, ticket references. The PMO Cognition Capability Matrix (PI.PMO-COGNITION-MODULE.01) contains the implementation-level forensic mapping.

**Relationship to other artifacts:**
- `pi_discovery_specimens.json` — authoritative discovery log. Vector boundaries are proven by PID specimens.
- `THORR_INTERROGATION_LEDGER.md` — session-level interrogation record. Vector discoveries originate from interrogation sessions.
- `PI.PMO-COGNITION-MODULE.01/PMO_COGNITION_CAPABILITY_MATRIX.md` — forensic mapping of vectors to PI Core implementation.
- Marketplace and SKU artifacts — consume this registry. Domain modules reference vectors by ID.
