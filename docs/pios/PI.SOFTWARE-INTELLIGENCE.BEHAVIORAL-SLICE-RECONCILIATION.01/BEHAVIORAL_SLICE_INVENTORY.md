# Behavioral Slice Inventory

> **Stream:** PI.SOFTWARE-INTELLIGENCE.BEHAVIORAL-SLICE-RECONCILIATION.01
> **Classification:** G1 — Architecture-Mutating
> **Governing Doctrine:** PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01 §5–§13
> **Governing Principle:** "The behavior is the slice. The graph metric is evidence."

---

## §1 — Purpose

This document reconciles the full SW-INTEL slice candidate set against a behavior-first qualification framework. Every candidate must answer: "What operational behavior emerges?" — not "What graph metric can we compute?"

The output is a locked behavioral slice inventory that implementation streams consume. No code changes are authorized by this document.

---

## §2 — Reconciliation Framework

Each candidate is assessed against 8 dimensions:

| # | Dimension | Question |
|---|-----------|----------|
| 1 | **Behavioral Pattern** | What operational behavior emerges? |
| 2 | **Operational Mechanic** | What dynamic drives this behavior? |
| 3 | **Structural Evidence** | Which L1 evidence objects activate it? |
| 4 | **Activation Rule** | What deterministic condition triggers the slice? |
| 5 | **Consequence Interactions** | Which consequence objects does it interact with? |
| 6 | **Persona Projection Value** | What does each persona gain? |
| 7 | **Static Derivability** | Can this be derived from static file structure analysis? |
| 8 | **Commercial Relevance** | Does this answer a question an operator/CTO actually asks? |

**Qualification gate (§5 of taxonomy):** A candidate that cannot answer all 10 qualification criteria from the taxonomy is not yet a slice. It may be a CANDIDATE (§13).

---

## §3 — Group 1: Existing FOUNDATIONAL Slices (Behavioral Validation)

These slices are operational. This section confirms their behavioral definitions are behavior-first and records them in the reconciliation format. No status changes.

---

### SLICE F-1: Propagation Asymmetry

**Ontology Class:** A — Flow & Propagation
**Maturity:** FOUNDATIONAL
**Runtime:** PROPAGATION_ASYMMETRY condition, ISIG-002 Import Fan Asymmetry

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **Localized changes produce disproportionately distant disruption.** A modification in one structural region reaches further downstream than the local structure predicts — the blast radius exceeds apparent scope. |
| 2. Operational Mechanic | Asymmetric propagation. Fan-out edges carry change impact along paths that are structurally invisible at the origination point. The asymmetry is between perceived locality and actual reach. |
| 3. Structural Evidence | ISIG-002 (import fan asymmetry ratio), code-graph import edges (40.3s), structural centrality (40.3c) |
| 4. Activation Rule | Import fan-out significantly exceeds fan-in at a structural node, creating directional propagation imbalance |
| 5. Consequence Interactions | PROP_EXP (defining), DEL_EXP (conditional via DPC) |
| 6. Persona Projection | BOARDROOM: "Change risk is asymmetric — blast radius exceeds locality." BALANCED: "Propagation paths carry risk further than local structure suggests." DENSE: topology corridor overlay showing asymmetric reach. OPERATOR: full evidence chain with fan ratios |
| 7. Static Derivability | YES — import graph fan-in/fan-out from 40.3s + 40.3c |
| 8. Commercial Relevance | "Why do changes in this area break things we don't expect?" — every CTO asks this |

**Behavioral validation:** PASS — the slice is defined by what happens (disproportionate disruption), not by what is measured (fan ratio).

---

### SLICE F-2: Dependency Choke Point

**Ontology Class:** B — Concentration & Saturation
**Maturity:** FOUNDATIONAL
**Runtime:** DEPENDENCY_CHOKE_POINT condition, ISIG-001 Import Hub Pressure

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **A single structural component absorbs disproportionate downstream dependency, making it an unavoidable transit point for change.** Touching this component requires assessing impact across many dependents. |
| 2. Operational Mechanic | Dependency concentration. Many modules route through one hub, creating a structural monopoly on certain operational paths. |
| 3. Structural Evidence | ISIG-001 (import hub pressure), code-graph inbound edges (40.3s), structural centrality (40.3c) |
| 4. Activation Rule | Inbound dependency count significantly exceeds peer median, creating a hub |
| 5. Consequence Interactions | DEP_AMP (defining), COORD_FRAG (conditional), OP_BOTTLENECK (conditional) |
| 6. Persona Projection | BOARDROOM: "Dependency risk concentrates on a single point." BALANCED: "Changes here require broader impact assessment." DENSE: topology corridor overlay showing hub concentration. OPERATOR: full dependency graph with evidence |
| 7. Static Derivability | YES — import graph inbound edges from 40.3s |
| 8. Commercial Relevance | "What's the single point that everything depends on?" — fundamental structural risk question |

**Behavioral validation:** PASS — defined by operational behavior (unavoidable transit point), evidence is the graph metric.

---

### SLICE F-3: Pressure Zone Convergence

**Ontology Class:** B — Concentration & Saturation
**Maturity:** FOUNDATIONAL
**Runtime:** DELIVERY_PRESSURE_CONCENTRATION condition, pressure_zone_state artifact

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **Multiple independent delivery streams collide in the same structural region, creating coordination pressure that exceeds the structure's capacity to absorb concurrent change.** |
| 2. Operational Mechanic | Delivery pressure concentration. Independent workstreams (PRs, features, fixes) converge on a shared structural bottleneck. The structure forces sequential coordination where parallel work was intended. |
| 3. Structural Evidence | pressure_zone_state artifact, PSIG signals (coupling_pressure, export_pressure), active delivery indicators |
| 4. Activation Rule | Multiple delivery signals converge on a single structural region with higher density than surrounding areas |
| 5. Consequence Interactions | COORD_FRAG (defining), DEL_EXP (defining), OP_BOTTLENECK (conditional) |
| 6. Persona Projection | BOARDROOM: "Delivery pressure is concentrating dangerously." BALANCED: "Teams are colliding in the same structural bottleneck." DENSE: pressure zone overlay on topology. OPERATOR: zone decomposition with signal evidence |
| 7. Static Derivability | PARTIAL — pressure zone state derives from binding envelope + topology. Full delivery pressure requires external signals (PRs, commits) not yet integrated |
| 8. Commercial Relevance | "Why do our releases keep slipping in this area?" — directly operational |

**Behavioral validation:** PASS — defined by operational collision behavior, not by zone count.

---

### SLICE F-4: Structural Mass Concentration

**Ontology Class:** B — Concentration & Saturation
**Maturity:** FOUNDATIONAL
**Runtime:** STRUCTURAL_MASS_CONCENTRATION condition, DPSIG topology metrics

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **One region carries disproportionate structural weight — more logic, complexity, and responsibility — creating a gravity well that attracts operational dependency.** |
| 2. Operational Mechanic | Structural gravity. The region's mass (file count, complexity, responsibility density) makes it both essential and fragile. It resists decomposition because too much depends on it staying intact. |
| 3. Structural Evidence | DPSIG (topology distribution metrics), 40.4 canonical topology, file/cluster size and complexity metrics |
| 4. Activation Rule | Structural weight (files, complexity, responsibility) in a region significantly exceeds proportional share |
| 5. Consequence Interactions | RESIL_DEF (defining), STAB_RISK (conditional) |
| 6. Persona Projection | BOARDROOM: "Structural resilience depends on one area." BALANCED: "This region's weight makes it both critical and fragile." DENSE: cluster gravity overlay on topology. OPERATOR: full mass decomposition with structural metrics |
| 7. Static Derivability | YES — file tree structure, topology metrics, DPSIG |
| 8. Commercial Relevance | "What would break everything if it went down?" — the monolith-within-the-system question |

**Behavioral validation:** PASS — defined by gravity behavior, not by file count.

---

### SLICE F-5: Import Pressure Concentration

**Ontology Class:** B — Concentration & Saturation
**Maturity:** FOUNDATIONAL (no topology projection yet)
**Runtime:** IMPORT_PRESSURE_CONCENTRATION condition (SignalSynthesisEngine)

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **Import dependency load concentrates on a few files, creating pressure points where structural changes have outsized import-chain impact.** |
| 2. Operational Mechanic | Import concentration. A small number of files absorb the majority of import relationships, creating a structural pressure surface where import-chain disruption cascades. |
| 3. Structural Evidence | ISIG (import hub/fan signals), 40.3s import edges, 40.3c centrality |
| 4. Activation Rule | Import hub pressure or import fan asymmetry exceeds threshold (from ISIG-001/ISIG-002 computation) |
| 5. Consequence Interactions | Overlaps with DEPENDENCY_CHOKE_POINT consequence chain. Currently shares DEP_AMP, COORD_FRAG interaction space |
| 6. Persona Projection | BOARDROOM: compressed into dependency concentration narrative. BALANCED: import-specific pressure context. DENSE: import-level topology overlay. OPERATOR: full ISIG evidence |
| 7. Static Derivability | YES — code-graph import edges |
| 8. Commercial Relevance | "Which files cause the most downstream breakage when touched?" — engineering-level operational question |

**Behavioral validation:** PASS — defined by import-chain pressure behavior.

**Note:** F-5 is currently operationally close to F-2 (Dependency Choke Point) — both describe dependency concentration. F-5 operates at file-level (Level 1 ISIG signals), F-2 at architectural level. They are distinct behaviors at different structural altitudes but may need explicit altitude-separation governance in implementation.

---

## §4 — Group 2: Proposed Candidates (Full Reconciliation)

---

### CANDIDATE C-1: Execution Fragility

**Proposed by:** User assessment (was "Structural Fragility Surface")
**Proposed Class:** C — Fragility & Resilience

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **Localized structural weakness amplifies operational disruption beyond the weak point's apparent importance.** A region that appears minor in the dependency graph causes outsized damage when it fails — not because it is large, but because it is structurally exposed. |
| 2. Operational Mechanic | Fragility propagation. High external coupling combined with low internal cohesion creates a region that both receives many inbound change vectors AND lacks the structural integrity to absorb them. Changes pass through rather than being contained. |
| 3. Structural Evidence | Fan-in count (40.3s inbound edges), fan-out count (40.3s outbound edges), intra-module import density (internal cohesion from 40.3s), structural role (40.3c) |
| 4. Activation Rule | A structural node exhibits: (a) high external coupling (fan-in + fan-out above threshold) AND (b) low internal cohesion (ratio of intra-module imports to total imports below threshold). The combination — not either metric alone — triggers activation. |
| 5. Consequence Interactions | COORD_FRAG (amplifies — fragile regions make coordination harder), DEP_AMP (compounds — fragile hubs amplify dependency impact), RESIL_DEF (defines — fragility IS the resilience deficit at the component level), SYSTEMIC_OP_FRAG (contributes — fragile nodes are prime candidates for multi-factor convergence) |
| 6. Persona Projection | BOARDROOM: "Structural fragility concentrates here — disruption risk exceeds the region's apparent importance." BALANCED: "This area has high coupling and low cohesion — changes pass through instead of being absorbed." DENSE: fragility overlay showing coupling/cohesion surface. OPERATOR: full evidence (fan ratios, cohesion metrics, downstream impact chain) |
| 7. Static Derivability | **YES** — fan-in, fan-out, and intra-module import density are all derivable from 40.3s code-graph import edges. No temporal data required. |
| 8. Commercial Relevance | **"Where are we most fragile?"** — the question every CTO asks after an incident. Currently no tool answers this from structural evidence rather than anecdote. High commercial value. |

**§5 Qualification Check:**
1. Behavioral pattern: YES — fragility propagation (structural weakness amplifying operational disruption)
2. Evidence objects: YES — fan-in, fan-out, intra-module cohesion from 40.3s/40.3c
3. Structural/topological mechanics: YES — coupling/cohesion interaction creates propagation surface
4. Operational consequence: YES — maps to RESIL_DEF (defining), COORD_FRAG (amplifying)
5. Runtime layer: L2 — Consequence Cognition
6. Consequence consumer: ConsequenceCompiler mapping to RESIL_DEF
7. Persona projection: All 4 personas (varies by depth)
8. Evidence lineage: Traceable through import graph analysis
9. Replay guarantees: Deterministic — same import graph produces same fragility surface
10. Governance constraints: Evidence-bound, STRUCTURAL_ONLY confidence basis

**VERDICT: ACCEPTED — Class C (Fragility & Resilience)**

This is the first primary Class C slice. It fills the ontology gap identified in PI.SOFTWARE-INTELLIGENCE.EXISTING-SLICE-AUDIT-AND-CLASSIFICATION.01 §5: "No condition type, consequence type, or cognition slice currently maps to Class C as primary."

---

### CANDIDATE C-2: Execution Constriction

**Proposed by:** User assessment (was "Operational Bottleneck Topology")
**Proposed Class:** B — Concentration & Saturation (or A — Flow & Propagation)

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **Operational flow is forced through a narrow structural passage, creating a throughput ceiling that cannot be raised by adding capacity.** Work queues up because the structure permits only sequential or tightly-coordinated passage through this point. |
| 2. Operational Mechanic | Execution constriction. A structural node sits on every (or nearly every) critical traversal path. Unlike a dependency choke point (which is about how many things depend on it), this is about how many paths pass THROUGH it — it is a structural bridge that, if removed, disconnects operational flow. |
| 3. Structural Evidence | Graph traversal analysis on 40.3s import edges — betweenness centrality (40.3c), cut vertex detection, bridge edge detection |
| 4. Activation Rule | A node's betweenness centrality significantly exceeds peers AND it sits on paths connecting otherwise-independent structural regions (bridge detection) |
| 5. Consequence Interactions | OP_BOTTLENECK (defining — constriction IS the bottleneck mechanic), COORD_FRAG (conditional — constricted paths force coordination), DEP_AMP (amplifying — if a choke point sits on a constriction, both behaviors compound) |
| 6. Persona Projection | BOARDROOM: "Structural throughput has a ceiling here — adding people won't help." BALANCED: "Operational flow is forced through a narrow passage." DENSE: betweenness/bridge overlay on topology. OPERATOR: full traversal analysis with path counts |
| 7. Static Derivability | **YES** — betweenness centrality and cut vertex/bridge detection are standard graph algorithms on the import graph |
| 8. Commercial Relevance | **"Why doesn't adding more developers make this area faster?"** — the structural answer to Brooks's Law at the module level |

**Collapse test against F-2 (Dependency Choke Point):**

| Dimension | Dependency Choke Point (F-2) | Execution Constriction (C-2) |
|-----------|------|------|
| What concentrates? | Inbound dependencies (things that depend on it) | Traversal paths (things that flow through it) |
| Graph metric | In-degree (fan-in) | Betweenness centrality + bridge detection |
| Operational meaning | "Many things break if this changes" | "Many paths are blocked if this jams" |
| Failure mode | Change amplification (blast radius) | Throughput ceiling (queuing) |

**Verdict:** These are DISTINCT behaviors. A node can be a dependency hub without being a path constriction (many dependents but alternative paths exist). A node can be a path constriction without being a dependency hub (few direct dependents but sole bridge between regions). They may co-locate on the same node, but the behavioral patterns — and the operational questions they answer — are different.

**§5 Qualification Check:** All 10 criteria satisfied. Betweenness centrality and bridge detection are deterministic, evidence-bound, and replayable from 40.3s import graph.

**VERDICT: ACCEPTED — Class A (Flow & Propagation)**

Reclassified from B to A. The behavior is about flow constriction (how operational activity moves through topology), not about concentration of load. This makes it the third Class A slice alongside Propagation Asymmetry and the flow aspect of Dependency Choke Point.

---

### CANDIDATE C-3: Change Absorption Dynamics

**Proposed by:** User assessment (was "Change Absorption Capacity")
**Proposed Class:** C — Fragility & Resilience

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **A structural region absorbs modifications without propagating disruption to its dependents.** The inverse of fragility — changes arrive but are contained rather than transmitted. High absorption capacity means the region acts as a structural firewall. |
| 2. Operational Mechanic | Change containment. A well-encapsulated module with a narrow, stable interface surface absorbs internal changes without disturbing its consumers. The ratio of internal modification freedom to external impact determines absorption capacity. |
| 3. Structural Evidence | Exported symbol count vs total symbol count (interface surface ratio), dependency depth (how deep the dependency chain extends), encapsulation ratio (internal imports / total imports), structural role stability (40.3c role classification) |
| 4. Activation Rule | A module's interface surface ratio (exported / total) is below threshold AND its internal cohesion is above threshold — indicating strong encapsulation |
| 5. Consequence Interactions | RESIL_DEF (inverse relationship — high absorption = low resilience deficit), COORD_FRAG (mitigates — absorptive modules reduce coordination burden), PROP_EXP (contains — absorption prevents propagation exposure) |
| 6. Persona Projection | BOARDROOM: "This area can safely absorb change — low disruption risk." BALANCED: "Well-encapsulated modules act as structural firewalls." DENSE: absorption surface overlay showing containment boundaries. OPERATOR: interface surface analysis with encapsulation metrics |
| 7. Static Derivability | **PARTIAL** — encapsulation and interface surface require symbol-level analysis (exports, function visibility). Currently 40.3s captures class/function definitions but not export visibility for Python. JavaScript/TypeScript would require different analysis. |
| 8. Commercial Relevance | **"Where can we safely change things?"** — the positive counterpart to the fragility question. Reduces fear-driven development paralysis. |

**Collapse test against C-1 (Execution Fragility):**

| Dimension | Execution Fragility (C-1) | Change Absorption Dynamics (C-3) |
|-----------|------|------|
| Perspective | Negative — weakness amplifies disruption | Positive — strength contains disruption |
| Signal | High coupling + low cohesion | Low interface surface + high cohesion |
| Question | "Where are we fragile?" | "Where can we safely change?" |
| Activation | Coupling/cohesion imbalance | Encapsulation strength |

**Assessment:** These describe the SAME behavioral axis (structural resilience) from opposite ends. They are not independent behaviors — they are the resilience spectrum. A module is either absorptive or fragile depending on where it falls on the coupling/cohesion/encapsulation continuum.

However, the projection value differs significantly. "Where are we fragile?" and "Where can we safely change?" are distinct operational questions even though the underlying mechanic is the same axis. The question is whether they should be ONE slice with two projections, or TWO slices.

**Decision:** COLLAPSED INTO C-1 (Execution Fragility) as its positive projection.

The behavioral pattern is ONE: structural resilience determined by coupling/cohesion/encapsulation balance. Execution Fragility (C-1) becomes a bidirectional slice:
- Fragile end: high coupling + low cohesion → disruption amplification
- Absorptive end: low interface surface + high cohesion → disruption containment

The persona projection layer handles the dual framing: BOARDROOM sees "fragile here, safe there." Both questions are answered by the same slice computation with different projection thresholds.

**VERDICT: COLLAPSED — merged into C-1 (Execution Fragility) as bidirectional resilience axis**

---

### CANDIDATE C-4: Dependency Debt Accumulation

**Proposed by:** Claude assessment
**Proposed Class:** D — Reinforcement & Accumulation

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **Dependency patterns self-reinforce over time, creating compounding structural debt that resists remediation.** Each new dependency added to an already-heavy node makes it harder to refactor, increasing the cost of future change and attracting more dependencies through path-of-least-resistance coupling. |
| 2. Operational Mechanic | Accumulation reinforcement. Dependency hubs attract more dependencies because developers route through the existing hub rather than creating new architectural paths. The hub grows, becomes more expensive to change, and attracts yet more dependencies. A positive feedback loop. |
| 3. Structural Evidence | Current dependency graph (40.3s import edges), transitive dependency depth, circular dependency detection, dependency concentration trends |
| 4. Activation Rule | A structural node has: (a) dependency count above threshold AND (b) transitive dependency depth exceeding structural locality threshold (dependencies-of-dependencies chain is deep) AND/OR (c) participates in circular dependency cycles |
| 5. Consequence Interactions | DEP_AMP (reinforces — accumulated debt amplifies dependency impact), STAB_RISK (contributes — deep transitive chains create instability), STRUCT_GRAVITY_WELL (feeds — accumulated debt increases structural mass) |
| 6. Persona Projection | BOARDROOM: "Technical debt is compounding here — remediation cost increases with time." BALANCED: "Dependency patterns are self-reinforcing — this area resists refactoring." DENSE: dependency depth overlay with cycle detection. OPERATOR: full transitive chain analysis with circular dependency evidence |
| 7. Static Derivability | **PARTIAL** — current dependency depth and circular dependencies are derivable from 40.3s. But the "accumulation" behavior (getting worse over time) requires temporal comparison across runs. Static analysis can detect the CONDITIONS for accumulation (deep chains, cycles, high concentration) but cannot prove the DYNAMIC (it's getting worse) without multi-run comparison. |
| 8. Commercial Relevance | **"Where is our technical debt compounding?"** — significant commercial question. However, the honest answer from static analysis is "where conditions exist for compounding" not "where compounding is happening." |

**Assessment:** The behavioral pattern is real and commercially compelling. But there is a critical honesty issue: the ACCUMULATION dynamic requires temporal evidence (multi-run comparison) to prove. Static analysis can identify structural conditions that enable accumulation (deep transitive chains, circular dependencies, high hub concentration) — but these conditions are already captured by existing slices:

- Deep transitive chains → Dependency Choke Point (F-2) at scale
- Circular dependencies → a detection mechanism, not a behavioral pattern
- High concentration → Structural Mass Concentration (F-4)

What's genuinely NEW about this candidate is the reinforcement dynamic — the positive feedback loop. But this requires temporal evidence to activate honestly.

**VERDICT: DEFERRED — requires temporal evidence (multi-run comparison) for honest activation**

The structural conditions for debt accumulation are already covered by existing slices (F-2, F-4). The genuinely new behavioral pattern (self-reinforcing accumulation) cannot be activated from static analysis alone without overclaiming. This becomes a Class D candidate when temporal signals (EXSIG/TIMSIG) are operational.

**Circular dependency detection** remains useful as a detection mechanism within existing slices, not as an independent behavioral pattern.

---

### CANDIDATE C-5: Boundary Erosion

**Proposed by:** Claude assessment
**Proposed Class:** E — Drift & Instability

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **A module's operational boundary no longer matches its structural boundary — its actual dependency footprint extends beyond its declared scope, making its name and location misleading about what it does and what depends on it.** |
| 2. Operational Mechanic | Boundary divergence. Cross-boundary imports accumulate beyond a module's intended scope. The module's directory position (its "declared" boundary) increasingly diverges from its actual dependency membership (its "operational" boundary). The module's name lies about its function. |
| 3. Structural Evidence | Directory tree structure (declared boundary), import graph edges crossing directory boundaries (40.3s), module naming patterns, structural role classification (40.3c) |
| 4. Activation Rule | A module's outbound cross-boundary imports exceed a threshold percentage of its total imports, AND/OR a significant proportion of its inbound dependencies come from structurally distant regions (outside its parent/sibling directories) |
| 5. Consequence Interactions | COORD_FRAG (contributes — eroded boundaries increase coordination burden because team ownership doesn't match structural reality), PROP_EXP (amplifies — changes in an eroded module propagate beyond the boundary that developers expect) |
| 6. Persona Projection | BOARDROOM: "Module boundaries don't match operational reality — teams may be governing the wrong thing." BALANCED: "This module's scope has grown beyond its declared boundary." DENSE: boundary overlay showing declared vs actual scope. OPERATOR: cross-boundary import analysis |
| 7. Static Derivability | **YES** — directory tree gives declared boundary, import graph gives actual operational boundary. The divergence is computable from static structure. |
| 8. Commercial Relevance | **"Does our module structure actually reflect how the system is organized?"** — architectural truth question. Exposes the gap between what teams THINK they own and what the dependency graph says they actually depend on. |

**Collapse test against C-7 (Structural Drift Potential):**

| Dimension | Boundary Erosion (C-5) | Structural Drift Potential (C-7) |
|-----------|------|------|
| What diverges? | Declared boundary vs operational boundary | Organizational intent vs structural reality |
| Evidence | Cross-boundary imports vs directory tree | Naming conventions vs dependency membership |
| Scope | Single module boundary | System-wide organizational alignment |
| Question | "Has this module outgrown its boundaries?" | "Does the system structure match its organization?" |

**Assessment:** These are the SAME behavioral family — both describe structural inconsistency between declared organization and actual dependency reality. Boundary Erosion focuses on individual module boundaries. Structural Drift Potential is the system-wide generalization. But the underlying behavioral mechanic is identical: organizational declaration diverges from structural reality.

**Decision:** MERGE into a single slice called **Structural Boundary Divergence** that operates at both module-level and system-level.

See C-7 for final merged definition.

**VERDICT: COLLAPSED — merged with C-7 into "Structural Boundary Divergence"**

---

### CANDIDATE C-6: Coupling Inertia

**Proposed by:** Claude assessment
**Proposed Class:** D — Reinforcement & Accumulation

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **Tightly-coupled module clusters resist independent evolution — changes to one module in the cluster force changes across the cluster, decaying velocity in proportion to cluster density.** |
| 2. Operational Mechanic | Coupling resistance. When modules are bidirectionally or cyclically coupled, modifying one requires modifying others. The cluster behaves as a single unit for change purposes, even though it appears to be multiple independent modules. Development velocity decays because "independent" modules are structurally fused. |
| 3. Structural Evidence | Bidirectional import edges in 40.3s, module cluster analysis, intra-cluster coupling density, cross-module modification requirements |
| 4. Activation Rule | A cluster of 3+ modules exhibits: (a) bidirectional import relationships (A imports B, B imports A) AND/OR (b) coupling density within the cluster (imports between cluster members / total imports) exceeds threshold, indicating the cluster functions as a monolithic unit |
| 5. Consequence Interactions | COORD_FRAG (amplifies — coupled clusters force coordination), OP_BOTTLENECK (contributes — coupled clusters constrain parallel work), DEP_AMP (compounds — if a coupled cluster contains a choke point, the entire cluster becomes the amplification surface) |
| 6. Persona Projection | BOARDROOM: "These modules can't change independently — they're structurally fused." BALANCED: "Coupling between these modules means changes always cascade." DENSE: coupling cluster overlay on topology showing bidirectional edges. OPERATOR: full intra-cluster coupling analysis |
| 7. Static Derivability | **YES** — bidirectional import detection and cluster coupling density are computable from 40.3s import graph |
| 8. Commercial Relevance | **"Why can't we change anything in this area without touching everything else?"** — the question that surfaces during every refactoring discussion |

**Collapse test against C-3 (Change Absorption Dynamics):**

| Dimension | Coupling Inertia (C-6) | Change Absorption Dynamics (C-3, now merged into C-1) |
|-----------|------|------|
| Scope | Inter-module (cluster behavior) | Single-module (internal encapsulation) |
| Mechanic | Bidirectional coupling prevents independent evolution | Encapsulation quality determines disruption containment |
| Question | "Why can't these modules change independently?" | "Where can we safely change?" |
| Evidence | Bidirectional edges, cluster coupling density | Interface surface ratio, internal cohesion |

**Assessment:** These are DISTINCT behaviors. Coupling Inertia is about inter-module relationships (the cluster acts as one unit). Change Absorption / Fragility is about intra-module quality (the module's ability to contain change). A well-encapsulated module can still be part of a tightly-coupled cluster. A poorly-encapsulated module can exist in a loosely-coupled region. The behaviors are independent.

**§5 Qualification Check:** All 10 criteria satisfied. Bidirectional import detection and cluster analysis are deterministic graph operations on 40.3s.

**VERDICT: ACCEPTED — Class D (Reinforcement & Accumulation)**

The coupling pattern self-reinforces: tightly-coupled clusters attract more inter-module dependencies because developers working in the cluster treat it as one unit. This is genuinely accumulative, and unlike C-4 (Dependency Debt), the accumulation is observable from static structure (bidirectional edges exist NOW) without requiring temporal comparison.

---

### CANDIDATE C-7: Structural Boundary Divergence (merged from Boundary Erosion + Structural Drift Potential)

**Proposed by:** Claude assessment (two candidates merged)
**Proposed Class:** E — Drift & Instability

| Dimension | Record |
|-----------|--------|
| 1. Behavioral Pattern | **The system's declared organizational structure (directory hierarchy, module naming, package boundaries) increasingly diverges from its actual operational structure (dependency graph, import patterns, cross-boundary coupling).** Names and locations lie about relationships. |
| 2. Operational Mechanic | Organizational-structural divergence. As systems evolve, developers add cross-boundary dependencies for expedience. Over time, the directory tree becomes an archaeological record of past organizational intent rather than a map of current structural reality. Teams govern based on the directory tree; the dependency graph tells a different story. |
| 3. Structural Evidence | Directory tree structure (organizational declaration), import graph edges (40.3s — actual dependency structure), naming pattern analysis, cross-boundary import ratio per module, orphaned modules (modules with no inbound imports from their declared scope) |
| 4. Activation Rule | ANY of: (a) A module's cross-boundary imports exceed threshold of total imports, (b) A module receives significant inbound dependencies from structurally distant regions, (c) Orphaned modules exist with zero inbound edges from their declared package/directory scope, (d) Module naming patterns conflict with actual dependency membership (e.g., a module named "utils" in package A has all its consumers in package B) |
| 5. Consequence Interactions | COORD_FRAG (amplifies — diverged boundaries mean governance doesn't match reality, increasing coordination confusion), PROP_EXP (contributes — changes propagate across "boundaries" that aren't real), GOV_GAP (defines — divergence IS a governance gap when ownership follows directory structure) |
| 6. Persona Projection | BOARDROOM: "Module structure doesn't match operational reality — you may be governing the wrong boundaries." BALANCED: "Organizational boundaries have drifted from structural reality in these areas." DENSE: declared-vs-actual boundary overlay. OPERATOR: full cross-boundary import analysis, orphan detection |
| 7. Static Derivability | **YES** — directory tree gives declared structure, import graph gives actual structure. The divergence between them is fully computable from static analysis. No temporal data required. |
| 8. Commercial Relevance | **"Does our org chart match our architecture?"** — Conway's Law in reverse. When boundaries erode, governance fails. High commercial relevance because every team assumes their module boundaries are meaningful. |

**§5 Qualification Check:** All 10 criteria satisfied. Directory tree vs import graph divergence is deterministic, evidence-bound, and replayable.

**VERDICT: ACCEPTED — Class E (Drift & Instability)**

This is the first primary Class E slice that does NOT require temporal data. It measures structural inconsistency against the codebase's own declared organization, not against historical versions of itself.

---

## §5 — Collapse Detection Results

### Hypothesis 1: Boundary Erosion ↔ Structural Drift Potential

**Result: COLLAPSED — merged into "Structural Boundary Divergence" (C-7)**

Both describe the divergence between declared organizational structure and actual dependency structure. Boundary Erosion focuses on individual modules; Structural Drift Potential generalizes to system-wide. The underlying mechanic is identical: organizational declaration diverges from structural reality. One slice with multi-scale activation (module-level AND system-level) is more honest than two slices with the same behavioral pattern.

### Hypothesis 2: Coupling Inertia ↔ Change Absorption Dynamics

**Result: INDEPENDENT — no collapse**

Coupling Inertia operates at the inter-module level (cluster behavior — modules can't change independently). Change Absorption Dynamics (now merged into Execution Fragility C-1) operates at the intra-module level (internal encapsulation quality). A well-encapsulated module can be part of a tightly-coupled cluster. A poorly-encapsulated module can exist in isolation. The behaviors are orthogonal.

### Hypothesis 3: Execution Constriction ↔ Dependency Amplification (Choke Point)

**Result: INDEPENDENT — no collapse**

Dependency Choke Point measures inbound dependency count (how many things depend on this node). Execution Constriction measures path centrality (how many traversal paths flow through this node). A node can have many dependents without being a path bottleneck (alternative routes exist). A node can be a sole bridge between regions without having many direct dependents. Different graph properties, different operational questions, different failure modes.

### Additional Collapse Finding: Change Absorption Dynamics ↔ Execution Fragility

**Result: COLLAPSED — Change Absorption merged into Execution Fragility (C-1)**

These describe the same behavioral axis (structural resilience / coupling-cohesion balance) from opposite ends. Fragility and absorption are not independent behaviors — they are the positive and negative poles of the same spectrum. One bidirectional slice is more honest than two slices that measure the same thing inversely.

---

## §6 — Locked Behavioral Slice Inventory

### MVP Inventory: 9 Slices

| # | Slice Name | Behavioral Pattern | Operational Mechanic | Ontology Class | Static Derivable | MVP Status |
|---|------------|-------------------|---------------------|----------------|-----------------|------------|
| F-1 | **Propagation Asymmetry** | Localized changes produce disproportionately distant disruption | Asymmetric propagation via fan-out edges | A — Flow & Propagation | YES | FOUNDATIONAL |
| F-2 | **Dependency Choke Point** | Single component absorbs disproportionate downstream dependency | Dependency concentration creating structural monopoly | B — Concentration & Saturation | YES | FOUNDATIONAL |
| F-3 | **Pressure Zone Convergence** | Independent delivery streams collide in same structural region | Delivery pressure concentration forcing sequential coordination | B — Concentration & Saturation | PARTIAL | FOUNDATIONAL |
| F-4 | **Structural Mass Concentration** | One region carries disproportionate structural weight | Structural gravity attracting operational dependency | B — Concentration & Saturation | YES | FOUNDATIONAL |
| F-5 | **Import Pressure Concentration** | Import dependency load concentrates on few files | Import concentration creating pressure points | B — Concentration & Saturation | YES | FOUNDATIONAL |
| **N-1** | **Execution Fragility** | Structural weakness amplifies operational disruption; structural strength contains it | Fragility propagation (coupling/cohesion imbalance) — bidirectional resilience axis | **C — Fragility & Resilience** | YES | **ACCEPTED** |
| **N-2** | **Execution Constriction** | Operational flow forced through narrow structural passage | Path centrality creating throughput ceiling | **A — Flow & Propagation** | YES | **ACCEPTED** |
| **N-3** | **Coupling Inertia** | Tightly-coupled clusters resist independent evolution | Bidirectional coupling preventing independent change | **D — Reinforcement & Accumulation** | YES | **ACCEPTED** |
| **N-4** | **Structural Boundary Divergence** | Declared organization diverges from actual dependency structure | Organizational-structural divergence via cross-boundary accumulation | **E — Drift & Instability** | YES | **ACCEPTED** |

### Deferred

| # | Candidate | Reason |
|---|-----------|--------|
| D-1 | **Dependency Debt Accumulation** | Requires temporal evidence (multi-run comparison) for honest activation. Structural conditions already covered by F-2, F-4. Genuinely new accumulation dynamic cannot be proved from static analysis. |

### Collapsed

| # | Candidate | Collapsed Into | Reason |
|---|-----------|---------------|--------|
| — | Change Absorption Dynamics | N-1 (Execution Fragility) | Same behavioral axis (resilience), opposite pole. One bidirectional slice, not two inverse slices. |
| — | Boundary Erosion | N-4 (Structural Boundary Divergence) | Same behavioral pattern (organizational-structural divergence) at module level. Merged with system-level generalization. |
| — | Structural Drift Potential | N-4 (Structural Boundary Divergence) | Same behavioral pattern at system level. Merged with module-level focus. |

---

## §7 — Ontology Class Coverage After Reconciliation

| Ontology Class | Before | After | Change |
|---------------|--------|-------|--------|
| **A — Flow & Propagation** | 1 primary (Propagation Asymmetry) | 2 primary (+ Execution Constriction) | +1 slice |
| **B — Concentration & Saturation** | 3 primary (DCP, PZC, SMC) + 1 (IPC) | 4 primary (unchanged) | No change |
| **C — Fragility & Resilience** | 0 primary (GAP — identified in audit §5) | **1 primary (Execution Fragility)** | **GAP CLOSED** |
| **D — Reinforcement & Accumulation** | 0 primary slice (combination patterns only) | **1 primary (Coupling Inertia)** | **+1 primary slice** |
| **E — Drift & Instability** | 0 primary static-derivable | **1 primary (Structural Boundary Divergence)** | **+1 static-derivable** |

**Ontology completeness:** All 5 classes now have at least one primary, static-derivable behavioral slice. The system can produce a holistic structural cognition posture across all behavioral dimensions from static file structure analysis alone.

---

## §8 — Implementation Priority (Advisory — Not Binding)

This section provides guidance for implementation stream sequencing. Implementation streams make their own scoping decisions.

**Recommended first implementation: N-1 (Execution Fragility)**

Rationale:
1. Closes the Class C ontology gap — the only class with zero primary representation
2. Highest commercial signal ("Where are we fragile?")
3. Creates the strongest consequence object interactions with existing slices
4. Evidence (fan-in, fan-out, cohesion) already available in 40.3s/40.3c
5. Bidirectional projection (fragile + absorptive) doubles commercial value from one slice computation

**Recommended second: N-2 (Execution Constriction)** — completes Class A with path-centrality behavior distinct from dependency concentration.

**Recommended third: N-4 (Structural Boundary Divergence)** — high commercial impact ("does our structure match our org?"), no new evidence sources required.

**Recommended fourth: N-3 (Coupling Inertia)** — requires cluster analysis which is more computationally complex but highly valuable for refactoring guidance.

---

## §9 — Governing Rules for Implementation Streams

1. **"The behavior is the slice. The graph metric is evidence."** Every slice implementation must define behavior first, compute evidence second. If the implementation produces a metric without projecting behavior, it is not a slice — it is a signal.

2. **Every new slice must pass all 10 qualification criteria** from PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01 §5 before reaching FOUNDATIONAL maturity.

3. **New slices enter as CANDIDATE** and advance through the promotion lifecycle (CANDIDATE → SPECIMEN → FOUNDATIONAL). Implementation may produce SPECIMEN-grade slices initially.

4. **Consequence interactions are bidirectional.** New slices both consume AND enrich existing consequence objects. The ConsequenceCompiler §4 mapping rules must be extended for each new slice.

5. **Persona projection is mandatory.** No slice is complete until it has distinct projection value for each persona that consumes its ontology class (per consumption model).

6. **Static derivability is a requirement for MVP.** If a slice requires temporal evidence, it is DEFERRED until temporal signals (EXSIG/TIMSIG) are operational.

---

## §10 — Final Verdict

**MVP-9 LOCKED**

9 behavioral slices across 5 ontology classes. All static-derivable. All behavior-first.

- 5 FOUNDATIONAL (existing, operational)
- 4 ACCEPTED (new, ready for implementation)
- 1 DEFERRED (requires temporal evidence)
- 3 COLLAPSED (merged into surviving candidates)

The SW-INTEL module can produce a holistic structural cognition posture from static file structure analysis. This is commercially viable as a first release. Temporal enrichment deepens the posture but does not gate it.
