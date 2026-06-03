# PI Capsule Registry

Constitutional record of Program Intelligence cognition sciences. Each capsule represents a discovered or hypothesized science — a domain of reasoning that PI can or could perform over structural evidence.

Capsules are sciences. They are not modules, not SKUs, not implementation artifacts. A capsule answers: *What science was discovered?* — never *How is it implemented?*

**Last updated:** 2026-06-03
**Discovery instrument:** THORR governed interrogation
**Authoritative discovery log:** `pi_discovery_specimens.json`

---

## Registry

### PI.CAPSULE.01 — Structural Cognition

| Field | Value |
|-------|-------|
| Purpose | Discover structural truth |
| Produces | Graphs, signals, conditions, pressure zones, qualifications, confidence boundaries |
| Evidence substrate | Source code, dependency graphs, AST, file system structure |
| Constitutional position | Foundation. All other capsules reason over Structural Cognition outputs. |
| Discovery source | Genesis — this is the original PI science |
| Boundary specimens | — (no boundary specimen; this capsule existed before the discovery framework) |
| Status | **DISCOVERED** |

---

### PI.CAPSULE.02 — Governance Cognition

| Field | Value |
|-------|-------|
| Purpose | Translate structural truth into authority decisions |
| Produces | Risks, dependencies, milestones, escalations, governance altitude mappings |
| Evidence substrate | Structural Cognition outputs (signals, conditions, pressure zones) |
| Constitutional position | Reasoning layer. Converts structural findings into governance-grade judgments. |
| Discovery source | Seven governance vector interrogations (BlueEdge genesis_e2e_03 multi-persona, 2026-06-03) |
| Boundary specimens | PID-008 (Program Director hit governance reasoning boundary) |
| Status | **DISCOVERED** |

---

### PI.CAPSULE.03 — Trajectory Cognition

| Field | Value |
|-------|-------|
| Purpose | Reason about structural futures |
| Produces | Velocity, attractors, threshold proximity, regime transitions, future structural states |
| Evidence substrate | Structural Cognition outputs, ideally multi-run temporal comparison |
| Constitutional position | Reasoning layer. Extends structural truth into temporal and directional projections. |
| Discovery source | Chief Architect interrogation (BlueEdge genesis_e2e_03, 2026-06-03); PID-006 (temporal characterization gap) confirmed the boundary between static evidence and trajectory reasoning |
| Boundary specimens | PID-006 (temporal claims from static evidence), PID-008 (Program Director required future-state reasoning) |
| Status | **DISCOVERED** |

---

### PI.CAPSULE.04 — Transformation Cognition

| Field | Value |
|-------|-------|
| Purpose | Reason about structural change |
| Produces | Prerequisite chains, transformation readiness, sequencing constraints, intervention pathways |
| Evidence substrate | Structural Cognition outputs, Governance Cognition outputs |
| Constitutional position | Reasoning layer. Determines what structural states must exist before transformation is safe. |
| Discovery source | Not yet directly interrogated. Hypothesized from Program Director and Chief Architect boundary patterns. |
| Boundary specimens | — (none yet; hypothesis requires interrogation confirmation) |
| Status | **HYPOTHESIS** |

---

### PI.CAPSULE.05 — Investment Cognition

| Field | Value |
|-------|-------|
| Purpose | Reason about structural capital allocation |
| Produces | Absorption capacity, compounding effects, intervention economics, structural return surfaces |
| Evidence substrate | Structural Cognition outputs, Trajectory Cognition outputs |
| Constitutional position | Reasoning layer. Determines where investment is absorbed, where delay compounds, where structural return exists. |
| Discovery source | Not yet directly interrogated. Hypothesized from Program Director budget question (PID-008) — budget reasoning required structural investment analysis that does not exist. |
| Boundary specimens | — (none yet; PID-008 is indirect evidence, not boundary confirmation) |
| Status | **HYPOTHESIS** |

---

### PI.CAPSULE.06 — Scenario Cognition

| Field | Value |
|-------|-------|
| Purpose | Reason across alternative structural futures |
| Produces | Scenario branches, intervention outcomes, confidence corridors, future-state comparisons |
| Evidence substrate | Structural Cognition outputs, Trajectory Cognition outputs, Transformation Cognition outputs |
| Constitutional position | Reasoning layer. Compares alternative structural trajectories under different intervention assumptions. |
| Discovery source | Not yet directly interrogated. Hypothesized as natural extension of Trajectory + Transformation. |
| Boundary specimens | — (none yet) |
| Status | **HYPOTHESIS** |

---

## Commercial Composition Model

Capsules are sciences. Domain Modules are commerce. This section records the relationship without merging the two.

A Domain Module (commercial SKU) is a **composition** of capsules applied to a specific evidence substrate, delivered through specific projection families.

```
Domain Module = Capsule composition × Domain evidence substrate × Projection families
```

### Known compositions

| Domain Module | Capsules consumed | Domain evidence | Projection families |
|---|---|---|---|
| Software Intelligence | Structural, Governance, Trajectory | Code graph, AST, dependency, fragility | BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION |
| PMO Intelligence | Governance, Trajectory, Transformation | Jira, velocity, ART, capacity | Program Director, RTE, Steering Committee |
| Portfolio Intelligence | Governance, Investment, Scenario | Funding, allocation, portfolio structure | Portfolio Manager, CFO, Investment Committee |
| Security Intelligence | Structural, Governance, Trajectory | CVE, SBOM, threat model | CISO, Security Architect, Compliance |

**Note:** Software Intelligence exists as a commercial module today. PMO, Portfolio, and Security Intelligence are hypothesized compositions — their feasibility depends on the constituent capsules reaching CANONICAL status.

### Scaling property

Each new CANONICAL capsule multiplies the value of every Domain Module that consumes it. Each new Domain Module multiplies the value of every capsule it consumes. This is the marketplace scaling model.

### Consumer distinction

A Domain Module is not a consumer. A consumer is a delivery surface (EIR, LENS persona, marketplace subscriber). The chain is:

```
PI Core → Capsules → Domain Modules → PRE → Consumers
```

---

## Status Lifecycle

| Status | Meaning |
|--------|---------|
| HYPOTHESIS | Cognition boundary suspected but not confirmed through interrogation |
| DISCOVERED | Boundary confirmed through governed interrogation — at least one PID specimen proves the science exists |
| VALIDATED | Science demonstrated operationally — produces outputs from real evidence |
| CANONICAL | Science formally recognized as a PI cognition capability — available for commercial composition |

No capsule advances status without interrogation evidence. Status is earned, not declared.

---

## Governance

This registry is a constitutional artifact. It records what Program Intelligence has discovered about its own cognition sciences.

**What belongs here:** Discovered sciences, their boundaries, their evidence requirements, their outputs, their discovery lineage.

**What does not belong here:** Implementation details, file paths, function signatures, roadmap timelines, ticket references, Python packages.

**Relationship to other artifacts:**
- `pi_discovery_specimens.json` — authoritative discovery log (PID entries). Capsule boundaries are proven by PID specimens.
- `THORR_INTERROGATION_LEDGER.md` — session-level interrogation record. Capsule discoveries originate from interrogation sessions.
- Marketplace and SKU artifacts — consume this registry but do not modify it. Commercial composition references capsules by ID.
