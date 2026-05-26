# Implementation Semantics — PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01

Per §5.5 — this stream defines reusable concepts consumed by future streams.

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| Domain Cognition Module pattern | CONSTITUTIONAL_DEFINITION.md §2-5 | Architectural pattern for domain-specific interpretation of PI Core | REUSABLE — all future domain modules follow this pattern |
| Cognition Function taxonomy (CF-01 through CF-10) | CONSTITUTIONAL_DEFINITION.md §4 | Classification of PI Core → domain module interpretation functions | REUSABLE — every domain module defines its own CF set following this taxonomy |
| Module artifact contract | CONSTITUTIONAL_DEFINITION.md §6 | Output schema for domain module artifacts | REUSABLE — all modules produce `<module_id>_module.json` following this contract pattern |
| Corridor activation criteria | CONSTITUTIONAL_DEFINITION.md §7 | Conditions for domain corridor ABSENT → VALID transition | REUSABLE — all domain corridors follow same activation pattern |
| Permeation model | CONSTITUTIONAL_DEFINITION.md §5 | 5-stratum permeation specification | REUSABLE — all domain modules permeate all strata |
| Module registration contract | MARKETPLACE_ARCHITECTURE.md §5 | Registration schema for domain modules | REUSABLE — all modules register through this contract |
| Persona consumption specification | PERSONA_CONSUMPTION_SPEC.md | Per-persona projection consumption model | REUSABLE — pattern for how personas consume any domain module |
| Pressure-topology integration model | PRESSURE_TOPOLOGY_SPEC.md | Pressure zone → topology rendering integration | REUSABLE — pattern for any domain-specific topology rendering |

---

## 2. Input Contracts

### Domain Cognition Module — Input

A domain cognition module consumes:

| Input Artifact | Consumed Fields | Purpose |
|---|---|---|
| `canonical_topology.json` (40.4) | Full topology structure | Structural topology for role abstraction |
| `node_inventory.json` (40.2) | Node paths, types, relationships | Structural entity inventory |
| `code_graph.json` (40.3s) | Resolved imports, definitions | Code-graph structural evidence |
| `structural_centrality.json` (40.3c) | Centrality metrics, structural roles | Centrality evidence for role classification |
| `pressure_zone_state.json` (75.x) | Zones, conditions, members | Pressure evidence for interpretation |
| `enrichment_summary.json` | Enrichment events, corrections | Enrichment evidence for grounding assessment |
| `binding_envelope.json` | Architectural binding topology | Binding evidence for coupling analysis |
| Various corridor evaluations | Corridor states (VALID/PARTIAL/ABSENT) | Authority corridor context |

### Persona Consumption — Input

Each persona consumes:

| Input | Consumed Fields | Purpose |
|---|---|---|
| `fullReport.software_intelligence` | All SW-Intel projection fields | Domain-specific operational intelligence |
| `deriveProjections(fullReport, persona).software_intelligence_labels` | Boolean — corridor gate | Projection availability gate |

---

## 3. Output Contracts

### Domain Cognition Module — Output

| Output Artifact | Fields | Consumers |
|---|---|---|
| `software_intelligence_module.json` | role_abstractions, pressure_interpretations, execution_corridors, topology_roles, attention_signals, coordination_spines, validation_posture, deployment_risk, qualification_cognition, derivation_lineage | GenericSemanticPayloadResolver → fullReport → persona surfaces |

### Corridor Evaluation — Output

| Output | Shape | Consumers |
|---|---|---|
| `evaluateSoftwareIntelligenceCorridor()` return | `{ status: VALID|PARTIAL|ABSENT, detail: string }` | `computeAuthorityComposition()` → `authority_composition` |

---

## 4. Calibration Assumptions

| Assumption | Value | Status |
|---|---|---|
| Maximum domain modules per specimen | 1 | CONSTITUTIONAL — single module at a time |
| Module artifact must exist for corridor VALID | Unconditional | CONSTITUTIONAL — no module artifact = ABSENT |
| Authority ceiling inheritance | Module inherits lowest-authority input | CONSTITUTIONAL — cannot elevate beyond evidence |
| Orphaned abstraction tolerance | 0 | CONSTITUTIONAL — every abstraction must trace |
| Corridor model version compatibility | Module must match corridor model major version | CONSTITUTIONAL — version mismatch = ABSENT |

---

## 5. Extension Points

| Extension Point | Parameterization | Future Consumers |
|---|---|---|
| Domain module identity | `module_id` field in registration contract | Infrastructure Intelligence, Cyber Intelligence, etc. |
| Cognition function set | Module-specific CF definitions following CF taxonomy | Each domain module defines its own CF set |
| Operational vocabulary | Module-specific role abstractions and pressure types | Each domain module provides domain-specific vocabulary |
| Artifact contract schema | Module-specific fields within the `<module_id>_module.json` pattern | Each module extends the base contract with domain-specific fields |
| Persona consumption patterns | Module-specific projection fields consumed per persona | Each module specifies its own persona consumption spec |

---

## 6. Module Responsibility Map

| Concern | Responsible Document | Owner |
|---|---|---|
| Constitutional definition (what SW-Intel IS) | CONSTITUTIONAL_DEFINITION.md | This stream |
| Marketplace architecture (module pattern) | MARKETPLACE_ARCHITECTURE.md | This stream |
| Persona consumption (how personas consume) | PERSONA_CONSUMPTION_SPEC.md | This stream |
| Pressure-topology integration (rendering model) | PRESSURE_TOPOLOGY_SPEC.md | This stream |
| Module artifact implementation | Future pipeline stream | Not this stream |
| Corridor evaluation implementation | Future corridor stream | Not this stream |
| Topology rendering implementation | Future LENS stream | Not this stream |
| Pressure zone manifest loading | Future resolver stream | Not this stream |
