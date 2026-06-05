# Runtime Cognition Weight Audit Report

Stream: PI.RUNTIME-COGNITION-WEIGHT-AUDIT.01
Date: 2026-06-05
Specimen: blueedge / run_blueedge_genesis_e2e_03

---

## Finding

The cognitive weight asymmetry between static and runtime cognition is NOT in the consequence objects, themes, or slices. It is in the **evidence topology sections** of the THORR prompt.

### Spine-level comparison (EQUAL)

| Stage | Static fields | Runtime fields | Asymmetry |
|---|---|---|---|
| Signals | 8-9 fields per signal | 13-14 fields per signal | **Runtime has MORE fields** |
| Conditions | 19 fields | 22 fields | **Runtime has MORE fields** |
| Consequences (atomic) | 25 fields avg | 25 fields avg | EQUAL |
| Themes | same structure | same structure | EQUAL |
| Slices | 11 fields avg | 11 fields avg | EQUAL |

**At the spine level, runtime cognition objects are structurally equivalent to or richer than static objects.**

### Prompt-level comparison (ASYMMETRIC)

| Section | Tokens | z-scores | Hub/edge counts | Percentages | File paths | Event counts |
|---|---|---|---|---|---|---|
| Verdict/Boardroom | 2,562 | 0 | 0 | 0 | 0 | 0 |
| Structural Topology | 1,478 | 3 | 13 | 5 | 44 | 0 |
| Runtime Topology | **0** | **0** | **0** | **0** | **0** | **0** |

**The asymmetry is that static evidence has a 1,478-token quantitative topology section in the THORR prompt. Runtime evidence has NO equivalent section.**

### What the structural topology section contains

```
Cluster → Domain Topology (named clusters, domains, structural backing)
Domain Relationships (source → target, type)
Dependency Hubs (file paths, inbound/outbound counts, centrality ranks)
Pressure Zones (zone IDs, classes, anchors, condition counts)
Active Signals (signal IDs, labels, activation, values, primary domains)
Constriction Points (paths, scores, through-flow, bridges)
Fragility Hotspots (paths, scores, coupling, cohesion)
Structural Mass by Cluster (domain counts, grounding ratios)
Code graph (file counts, edge counts, classes, functions)
```

### What the runtime equivalent would contain

```
Event Topology (53 event types, 4 handlers, 17 emitters)
MQTT Topic Structure (6 channels, 2 edge agents, broker endpoint)
WebSocket Gateway (12 streams, 7 subscribe channels, 6 frontend hooks)
DI Module Graph (2 global modules, 5 providers, 63 domain modules)
Runtime Hubs (FleetGateway: 12 streams, FleetEventEmitter: 53 events)
Runtime Concentration (13.3 events per handler, single broker)
Edge-Cloud Paths (2 agents → 4 cloud-bound topics)
```

This data EXISTS in the forensic JSON artifacts. It is NOT rendered into the THORR prompt.

---

## Root Cause

The `formatStructuralTopology()` function in PIContextAssembler renders a rich quantitative section from static specimen data. There is no `formatRuntimeTopology()` equivalent.

Runtime evidence enters the prompt only through:
- Cognition slices (qualitative labels)
- Consequence themes (severity + description)
- Domain narratives (risk labels)
- Executive synthesis (one sentence)

None of these carry the quantitative evidence that the structural topology section provides for static evidence.

---

## Recommended Fix

**Option A (recommended):** Add a `formatRuntimeTopology()` function that renders runtime connectivity data in the same quantitative format as static topology. Source: the runtime graph artifacts that are already loaded for LENS/EIR.

**Option B:** Enrich runtime signals to carry quantitative metrics that propagate through consequences into themes (e.g., "53 events → 4 handlers = 13.3:1 concentration ratio, single broker handles 100% of edge-cloud traffic").

**Option C:** Both — richer signals AND a prompt topology section.

Option A is the fastest to implement and directly addresses the prompt-level asymmetry. Option B addresses the spine-level richness for all consumers, not just THORR.
