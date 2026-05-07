# Deterministic Relational Enrichment — Architecture Definition

Stream: PI.PSEE-PIOS.DETERMINISTIC-RELATIONAL-ENRICHMENT.01  
Status: COMPLETE — AUTHORITATIVE  
Generated: 2026-05-07  
Branch: work/psee-runtime  

LANE_SCOPE: A  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts (75.x/41.x): NO  
  Implements enriched derivation: NO — architecture definition only  
  Introduces semantic authority: NO  
  Advances Lane D governance: YES — defines the commercial-aligned relational enrichment target

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-GOVERNANCE-EXPLORATION.CLOSURE.01/SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md`
- `docs/psee/PI.PSEE-PIOS.LANE-GOVERNANCE-LOCK.01/LANE_GOVERNANCE_LOCK.md`
- `docs/psee/PI.PSEE-PIOS.PRODUCTIZED-JSON-SIGNAL-PATH.VERIFICATION.01/PRODUCTIZED_JSON_SIGNAL_PATH.md`
- `docs/psee/PI.PSEE-PIOS.BINDING-ENVELOPE-CONSUMPTION-CONTRACT.01/BINDING_ENVELOPE_CONSUMPTION_CONTRACT.md`
- `docs/psee/PI.PSEE-PIOS.ENRICHMENT-BOUNDARY-CONSOLIDATION.01/ENRICHMENT_BOUNDARY_CONSOLIDATION.md`
- `docs/governance/signal_namespace_alias_registry.json`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/binding_envelope.json`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.4/canonical_topology.json`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.3/structural_topology_log.json`

Evidence base (FastAPI run_02_oss_fastapi_pipeline):

| Artifact | Value |
|----------|-------|
| binding_envelope nodes | 29 |
| binding_envelope edges | 25 |
| structural_topology_log relations | 104 (CONTAINS) |
| canonical_topology cluster_count | 19 |
| grounding_ratio | 0.9 (9/10 CEUs grounded) |
| Active signals | PSIG-001=2.32 (HIGH), PSIG-002=6.96 (HIGH), PSIG-004=1.0, PSIG-006=0.138 |
| Signal method | RUN_RELATIVE_OUTLIER, THRESHOLD=2.0 |
| Signal source | binding_envelope.json → 75.x → 41.x → signal_registry.json |

---

## 1. Purpose

This document formally defines **Deterministic Relational Enrichment** as an architectural direction and establishes the design rules, signal classification model, runtime integration pattern, and safety boundaries that govern all future work in the `PI.PSEE-PIOS.DETERMINISTIC-RELATIONAL-ENRICHMENT.*` stream family.

The closure of the semantic governance exploration stream family (SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md) formally established that:
- Structural-relational signals are deterministic
- Commercial signal value already exists in the generic platform
- Semantic activation authority has not been authorized and is not commercially necessary at this time
- The recommended forward direction is Deterministic Relational Enrichment

This document is the architectural answer to that recommendation. It defines what Deterministic Relational Enrichment is, what it is not, how it integrates, and what the first implementation objective is.

**No implementation is performed in this document.** No scripts are created. No runtime artifacts are modified.

---

## 2. Deterministic Relational Enrichment Definition

### 2.1 Formal Definition

**Deterministic Relational Enrichment** is the capability to derive, surface, and replay structural-relational indicators from existing deterministic topology artifacts — specifically `binding_envelope.json`, `canonical_topology.json`, and `structural_topology_log.json` — through the standard PiOS signal derivation pipeline (40.5→75.x→41.x), without modifying the generic signal activation logic, threshold ownership, or activation method of any existing signal.

The defining properties of Deterministic Relational Enrichment are:

1. **Deterministic**: given identical input artifacts, produces identical output signals on every execution
2. **Relational**: signals measure structural relationships between nodes, clusters, and domains — not just per-node properties in isolation
3. **Enrichment**: signals add a new dimension of topology intelligence to the existing signal namespace without replacing or overriding existing signals
4. **Additive**: new DPSIG signals are derived in parallel with PSIG signals; neither interferes with the other's activation criteria

### 2.2 What Distinguishes It From Semantic Authority

| Property | Deterministic Relational Enrichment | Semantic Authority |
|----------|-------------------------------------|-------------------|
| Changes THRESHOLD=2.0 | NO | YES |
| Changes RUN_RELATIVE_OUTLIER method | NO | YES |
| Overrides which nodes 75.x classifies HIGH | NO | YES |
| Requires BP-01 authorization | NO | YES |
| Requires activation_authorized=true | NO | YES |
| Input sources | Existing 40.4 topology artifacts | PSEE-specific enrichment keys |
| Output path | New DPSIG signals, parallel derivation | Modified PSIG values via enriched activation |
| Lane A impact | ADDITIVE — new signals alongside existing | REPLACEMENT — enriched computation replaces generic |
| Authority boundary | 40.5 signal derivation | 75.x condition activation |

### 2.3 What Distinguishes It From Semantic Governance

The semantic governance exploration (the closed stream family) investigated whether PSEE enrichment could legitimately claim authority over activation behavior. It produced observability tooling, replay instrumentation, and provenance capture — all in support of that governance question.

Deterministic Relational Enrichment is not a governance question. It is a signal engineering question: given the topology data that already exists, what additional structural-relational indicators can be derived deterministically, and how do they integrate into the product?

The answer requires no governance authority expansion. It requires only a derivation script at 40.5 and a schema definition.

### 2.4 What Distinguishes It From Observational Semantics

The semantic observability stack (evaluate_psee_gate.py, evaluate_enrichment_participation.py, capture_semantic_provenance.py, compare_replay_runs.py) produces governance artifacts — records of what the enrichment system's state is, for audit purposes. It does not produce signals. It does not enter the 75.x→41.x pipeline.

Deterministic Relational Enrichment produces signals. Those signals are derived from topology, enter the pipeline at 40.5, and surface in LENS reports to clients. The observability stack and the enrichment stack are architecturally separate and serve different purposes.

### 2.5 What Distinguishes It From Replay Instrumentation

Replay instrumentation ensures that every governance observation can be reconstructed from artifacts alone. It is an accountability layer for governance decisions.

Deterministic Relational Enrichment is not an accountability mechanism. It is a signal delivery mechanism. Its replay-compatibility is a property, not a purpose — DPSIG signals must satisfy deterministic replay requirements (same inputs → same signal values) as a precondition for integration, but replay compatibility is not their goal. Their goal is to surface relational topology intelligence in a form clients can act on.

### 2.6 Governing Principle

> **Relational topology intelligence is structurally deterministic. Deterministic structural signals belong in the signal pipeline. They do not require semantic governance. They require signal engineering.**

---

## 3. Relational Signal Classification

The DPSIG namespace organizes relational signals into eight classes. Each class has a distinct topology dependency, a deterministic derivation basis, an explainability model, and a replay stability characterization.

### Class 1: Fan Pressure Signals

**Measurement:** how much inbound or outbound structural load a node carries relative to its cluster or the full system.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-001 | Fan-In Density | `fan_in[node] / mean_fan_in[run]` | binding_envelope.json edges (inbound) | RUN_RELATIVE_OUTLIER (existing) |
| DPSIG-002 | Fan-Out Density | `fan_out[node] / mean_fan_out[run]` | binding_envelope.json edges (outbound) | RUN_RELATIVE_OUTLIER (existing) |
| DPSIG-011 | Cluster-Relative Fan-In | `fan_in[node] / mean_fan_in[cluster]` | canonical_topology.json cluster membership + binding_envelope.json | CLUSTER_RELATIVE_OUTLIER (new) |
| DPSIG-012 | Cluster-Relative Fan-Out | `fan_out[node] / mean_fan_out[cluster]` | canonical_topology.json cluster membership + binding_envelope.json | CLUSTER_RELATIVE_OUTLIER (new) |

**Deterministic basis:** DPSIG-001/002 are the existing PSIG-001/002 signals under their correct namespace (no formula change). DPSIG-011/012 add cluster-relative normalization using canonical_topology cluster membership as denominator grouping. Both are fully deterministic from binding_envelope.json + canonical_topology.json.

**Explainability model:** "This node receives/sends {N}x more structural dependency traffic than the average node in its cluster. It is a relational concentration point within {cluster_name}."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE). Fan-in/fan-out values are computed from static topology edges. Cluster membership is static within a run. Formula is deterministic. Same binding_envelope.json + canonical_topology.json → same DPSIG-011/012 value on every replay.

---

### Class 2: Overlap Density Signals

**Measurement:** how much cross-cluster structural coupling exists, and how concentrated that coupling is.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-003 | Cross-Cluster Coupling Ratio | `cross_cluster_edges[node] / total_edges[node]` | structural_topology_log.json (CONTAINS+IMPORTS) + canonical_topology.json cluster membership | THEORETICAL_BASELINE or RUN_RELATIVE_OUTLIER |
| DPSIG-013 | Cluster Boundary Density | `cross_cluster_edges[cluster] / intra_cluster_edges[cluster]` | structural_topology_log.json + canonical_topology.json | CLUSTER_BOUNDARY_THRESHOLD (new) |

**Deterministic basis:** DPSIG-003 measures, for each node, what fraction of its edges cross cluster boundaries. This is computed from the CONTAINS/IMPORTS edge table in structural_topology_log.json combined with the cluster membership map from canonical_topology.json. For FastAPI run_02: 104 CONTAINS relations, 0 IMPORTS — DPSIG-003 value would be 0.0 for all nodes in this run (no cross-cluster imports detected by static analysis). DPSIG-013 would similarly be 0.0.

Note: This class's commercial value is higher for codebases with active import relationships (IMPORTS edges). The FastAPI reference run has imports_count=0, so this class yields null signals for this run and activates as "no cross-cluster coupling detected" — which is itself informative.

**Explainability model:** "This node/cluster has {N}% of its structural connections crossing cluster boundaries, indicating a structural bridge or integration point."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE) when structural_topology_log.json and canonical_topology.json are stable within the run. Cross-cluster edge count is deterministic from static topology analysis.

---

### Class 3: Dependency Concentration Signals

**Measurement:** how unevenly structural dependencies are distributed — whether load is concentrated in few nodes or distributed across many.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-021 | Dependency Concentration Index | Gini coefficient of fan_in distribution across nodes | binding_envelope.json edges | CONCENTRATION_THRESHOLD (new) |
| DPSIG-022 | Top-K Fan-In Share | `sum(top_k_fan_in) / total_fan_in` (k=3) | binding_envelope.json edges | THEORETICAL_BASELINE |

**Deterministic basis:** Both signals are computed from the full fan_in distribution of binding_envelope.json nodes. The Gini coefficient of a discrete distribution is deterministic. FastAPI run_02: 29 nodes, 25 edges — with fan_in values computable from edges. The Gini of a distribution with one outlier node (CE-10, fan_in=44 per signal_registry evidence) will be high.

**Explainability model:** "The top {k} nodes absorb {X}% of all inbound structural dependency load. Dependency is structurally concentrated rather than distributed."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE). Gini coefficient and top-k share are deterministic from a fixed edge set.

---

### Class 4: Cluster Pressure Signals

**Measurement:** aggregate structural pressure at the cluster level, derived from individual node signals projected up to cluster membership.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-031 | Cluster Pressure Index | `mean(DPSIG-001[nodes in cluster])` | canonical_topology.json cluster membership + binding_envelope.json | CLUSTER_PRESSURE_THRESHOLD (new) |
| DPSIG-032 | Cluster Fan Asymmetry | `mean_fan_in[cluster] / mean_fan_out[cluster]` | canonical_topology.json + binding_envelope.json | ASYMMETRY_THRESHOLD (new) |

**Deterministic basis:** DPSIG-031 aggregates per-node fan-in density (DPSIG-001) at the cluster level. Given that DPSIG-001 is deterministic, and cluster membership is deterministic from canonical_topology.json, DPSIG-031 is fully deterministic. For FastAPI run_02: 19 clusters with sizes ranging from 1 to 6 nodes. Cluster-level pressure would identify which of the 19 structural clusters carries disproportionate coupling load.

**Explainability model:** "The {cluster_name} cluster carries an average coupling density of {X}, which is {N}x the system mean cluster pressure. This cluster is a structural pressure concentration zone."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE). Cluster membership and fan-in values are both deterministic; their aggregate is deterministic.

---

### Class 5: Responsibility Density Signals

**Measurement:** how much structural responsibility — both inbound and outbound — each node and cluster carries relative to the grounded CEU population.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-041 | Responsibility Density | `(fan_in[node] + fan_out[node]) / grounded_ceu_count` | binding_envelope.json edges + grounding_state_v3.json | RUN_RELATIVE_OUTLIER |
| DPSIG-042 | Per-CEU Load Factor | `total_fan_volume / grounded_ceu_count` | binding_envelope.json edges + grounding_state_v3.json | THEORETICAL_BASELINE |

**Deterministic basis:** grounded_ceu_count (9 for FastAPI run_02) is deterministic from grounding_state_v3.json. Fan volume is deterministic from binding_envelope.json. DPSIG-041 normalizes total structural load by the organizational coverage denominator — producing a "structural load per grounded functional area" metric.

**Explainability model:** "This node carries a total structural exchange volume of {fan_in + fan_out} across {grounded_ceu_count} grounded organizational domains. It is handling {X} units of structural load per organizational area it connects to."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE). grounding_state_v3.json and binding_envelope.json are both stable within a run.

---

### Class 6: Relational Volatility Signals

**Measurement:** structural instability — indicators that suggest topology is in flux, under-specified, or at risk of change.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-051 | Isolation Fraction | `isolated_nodes / total_nodes` | binding_envelope.json (BFS component analysis) | THEORETICAL_BASELINE (existing as PSIG-006) |
| DPSIG-052 | Singleton Cluster Ratio | `clusters_with_node_count_1 / total_clusters` | canonical_topology.json | THEORETICAL_BASELINE (new) |

**Deterministic basis:** DPSIG-051 is the existing PSIG-006 under its correct namespace (no formula change). DPSIG-052 counts clusters with exactly one node — for FastAPI run_02, CLU-01 (.artrc), CLU-02 (.gitattributes), CLU-04 (.gitignore), CLU-05 (.pre-commit-config.yaml) are all singleton clusters. With 19 total clusters and multiple singletons, DPSIG-052 captures structural fragmentation at the cluster level rather than the node level.

**Explainability model:** "The system has {N}% of its structural clusters containing a single node, indicating {X} functionally isolated components with no cluster-level coupling."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE).

---

### Class 7: Topology Saturation Signals

**Measurement:** how close the structural topology is to theoretical maximum density — how much structural coupling capacity has been utilized.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-061 | Topology Density | `actual_edges / (n*(n-1)/2)` where n=total_nodes | binding_envelope.json or structural_topology_log.json | THEORETICAL_BASELINE |
| DPSIG-062 | Cluster Internal Density | `intra_cluster_edges / (cluster_size * (cluster_size-1) / 2)` | structural_topology_log.json + canonical_topology.json | THEORETICAL_BASELINE |

**Deterministic basis:** FastAPI run_02: 29 binding_envelope nodes, 25 edges → topology_density = 25/(29*28/2) = 25/406 ≈ 0.062. 104 structural_topology_log relations across the full node set. Both are deterministic from fixed artifact counts.

**Explainability model:** "The structural topology is at {X}% of its maximum theoretical coupling density. This indicates a {sparse/dense} coupling pattern relative to the system's scale."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE). Edge and node counts are deterministic.

---

### Class 8: Escalation Topology Signals

**Measurement:** the presence of structural configurations that indicate elevated risk — nodes with simultaneously high inbound and outbound load, clusters with both high fan pressure and boundary exposure.

**Signals:**

| Signal ID | Name | Formula | Topology Dependency | Activation Method |
|-----------|------|---------|---------------------|-------------------|
| DPSIG-071 | Dual-Load Nodes | `nodes where DPSIG-001 >= threshold AND DPSIG-002 >= threshold / total_nodes` | binding_envelope.json | THEORETICAL_BASELINE |
| DPSIG-072 | Escalation Concentration | `DPSIG-071 / cluster_size` (for cluster containing dual-load nodes) | canonical_topology.json + binding_envelope.json | CLUSTER_ESCALATION_THRESHOLD |

**Deterministic basis:** DPSIG-071 identifies nodes that are simultaneously outliers on both fan-in and fan-out — structural amplifiers. For FastAPI run_02: CE-10 and DOM-01 region show PSIG-001 and PSIG-002 both in HIGH state — this is the exact pattern DPSIG-071 captures. DPSIG-072 expresses this as a within-cluster concentration.

**Explainability model:** "This node simultaneously absorbs high inbound coupling load AND generates high outbound structural dependency. It is a structural amplifier — dependencies pass through it, increasing both in volume and distribution range."

**Replay stability:** TAXONOMY-01 (REPLAY_STABLE). Dual-load status is deterministic from fan_in/fan_out values and threshold.

---

## 4. Runtime Integration Model

### 4.1 Integration Architecture

Deterministic Relational Enrichment uses an **additive parallel derivation** model. DPSIG signals are derived in a separate 40.5 derivation step that runs alongside — not through — the existing generic signal pipeline. The two pipelines share input artifacts but produce independent output artifacts.

```
binding_envelope.json ──────────────────────────────────────────────┐
canonical_topology.json  ─────────────────────────────────────────┐ │
structural_topology_log.json  ──────────────────────────────────┐ │ │
grounding_state_v3.json  ────────────────────────────────────┐ │ │ │
                                                              │ │ │ │
                         ┌────────────────────────────────────┘ │ │ │
                         │    [40.5 DPSIG DERIVATION SCRIPT]    │ │ │
                         │    derive_relational_signals.py       │ │ │
                         │    (NEW — to be implemented)          │ │ │
                         └──── dpsig_signal_set.json ────────────┘ │ │
                                                                    │ │
                         ┌──────────────────────────────────────────┘ │
                         │    [EXISTING GENERIC PIPELINE]             │
                         │    compute_condition_correlation.py         │
                         │    compute_pressure_candidates.py           │
                         │    compute_pressure_zones.py                │
                         │    compute_signal_projection.py             │
                         └──── signal_registry.json ──────────────────┘
                                        │
                                        ▼
                              [LENS REPORT GENERATION]
                              lens_report_generator.py
                              (reads both signal_registry.json
                               AND dpsig_signal_set.json)
```

### 4.2 Where Enrichment Enters

DPSIG derivation enters at **40.5** — the signal derivation layer. It reads from 40.4 output artifacts (binding_envelope.json, canonical_topology.json, structural_topology_log.json, grounding_state_v3.json) and produces a new artifact: `dpsig_signal_set.json`.

The 40.5 boundary is the earliest point at which signal computation is authorized (per the 40.4 handoff contract: "40.5 is the FIRST LAYER ALLOWED TO COMPUTE SIGNALS"). DPSIG derivation respects this boundary.

### 4.3 Where Enrichment Terminates

DPSIG enrichment terminates at **41.x projection** — the DPSIG signal set feeds into signal_projection.json alongside PSIG signals for narrative and report generation. DPSIG values appear in LENS reports and Signäl surfaces. DPSIG signals do not feed back into 75.x condition activation.

### 4.4 What Remains Immutable

The following artifacts and behaviors are immutable under Deterministic Relational Enrichment:

| Artifact / Behavior | Status |
|---------------------|--------|
| `binding/binding_envelope.json` | IMMUTABLE — read only |
| `compute_condition_correlation.py` | IMMUTABLE — not read; not written |
| `compute_pressure_candidates.py` | IMMUTABLE — not read; not written |
| `compute_pressure_zones.py` | IMMUTABLE — not read; not written |
| THRESHOLD = 2.0 in 75.x | IMMUTABLE — DPSIG has no threshold authority over PSIG |
| RUN_RELATIVE_OUTLIER method | IMMUTABLE — DPSIG may introduce CLUSTER_RELATIVE_OUTLIER as a new method for DPSIG signals only |
| PSIG-001/002/004/006 activation states | IMMUTABLE — determined exclusively by 75.x; DPSIG cannot change them |
| PSIG activation path | IMMUTABLE — 75.x pipeline is unaware of DPSIG |
| `vault/signal_registry.json` PSIG entries | IMMUTABLE — DPSIG produces a separate artifact |

### 4.5 What Remains Structurally Sovereign

Lane A structural sovereignty is preserved through the parallel derivation model:

- **75.x is sovereign over activation.** The DPSIG derivation script does not call, read from, or write to any 75.x script or output artifact.
- **PSIG signals are sovereign over their own values.** DPSIG-011 (cluster-relative fan-in) and PSIG-001 (run-relative fan-in) co-exist and are independently computed. They measure different aspects of the same topology.
- **binding_envelope.json is structurally sovereign.** It is the single authoritative topology input. DPSIG reads it; it does not modify it.
- **signal_registry.json is the PSIG sovereign artifact.** DPSIG does not write to it. DPSIG writes to its own artifact (dpsig_signal_set.json).

---

## 5. Deterministic Signal Requirements

### 5.1 Required Properties for DPSIG Qualification

A relational signal qualifies as deterministic and eligible for the DPSIG namespace only if it satisfies all six of the following requirements:

---

**REQ-01: Topology Traceability**

The signal's formula must be traceable to a specific artifact and field. "Fan-in" must be traceable to a specific edge set in a specific artifact. "Cluster membership" must be traceable to a specific cluster_id in canonical_topology.json. No signal component may reference an artifact that does not exist in the current pipeline.

*Verification:* The DPSIG derivation script must declare, for each signal, the exact input artifact path and field used in computation.

---

**REQ-02: Reproducibility**

Given identical input artifact content, the derivation script must produce identical DPSIG signal values on every execution. No stochastic components, no timestamp-dependent values, no external state reads.

*Verification:* Run derive_relational_signals.py twice against the same artifacts; produce replay_diff.json; verify overall_verdict=IDENTICAL for all DPSIG values.

---

**REQ-03: Structural Explainability**

The signal must have a formula that can be stated in plain structural terms without reference to semantic enrichment, activation models, or governance concepts. A non-technical audience must be able to understand what the number measures from the formula alone.

*Verification:* Each DPSIG signal must include an `explainability_template` field in dpsig_signal_set.json that renders the signal value into a plain-language structural description.

---

**REQ-04: Deterministic Derivation Basis**

Every arithmetic operation in the formula must be deterministic: no floating-point non-associativity across platforms, no hash-order-dependent set iteration, no undefined comparison behavior. For ratios: the denominator must be proven non-zero or the zero case must have a defined fallback value.

*Verification:* Each formula includes a denominator_guard specification (e.g., "if cluster_size = 0, emit DPSIG value = null and record denominator_zero_flag = true").

---

**REQ-05: Replay Stability Under TAXONOMY-01**

The signal must belong to TAXONOMY-01 (REPLAY_STABLE) per the psee_provenance_schema.json classification. It must not depend on wall-clock time, execution ordering, external API calls, or random seed state. Timestamps produced during derivation (e.g., generated_at in dpsig_signal_set.json) are TAXONOMY-02 fields and are excluded from replay comparison.

*Verification:* The DPSIG replay_causality block declares each signal as TAXONOMY-01 or provides a justified exception.

---

**REQ-06: Auditability**

The derivation of every DPSIG value must be fully reconstructable from the artifact inputs alone — an independent auditor with access to binding_envelope.json, canonical_topology.json, structural_topology_log.json, and grounding_state_v3.json must be able to verify every DPSIG value by hand-computing the formula. No black-box transformations permitted.

*Verification:* Each DPSIG entry in dpsig_signal_set.json includes a `derivation_trace` field with the specific intermediate values used in the computation (numerator, denominator, result).

### 5.2 Disqualification Criteria

The following conditions disqualify a signal from DPSIG status:

| Disqualification | Reason |
|-----------------|--------|
| Formula depends on PSEE enrichment keys (psee_context, ceu_topology, structural_overlap, selector_context, evidence_state) | These keys are not yet populated with live derivation; they carry placeholder or null values. A signal depending on them is not deterministic from available artifacts. |
| Formula modifies or reads from any 75.x or 41.x intermediate artifact | DPSIG operates at 40.5. Reading from 75.x outputs creates a circular dependency or an ordering constraint that breaks the additive parallel model. |
| Formula includes an implicit fallback to semantic enrichment when topology data is absent | Implicit fallbacks are hidden logic. Every fallback must be explicit and produce a defined null or zero signal value. |
| Formula requires cross-run comparison as an input | DPSIG signals measure a single run. Multi-run comparison is a separate concern (relational volatility may reference prior run values but these are derivable from stored artifacts, not live cross-run state). |
| Activation criteria depend on PSIG values | DPSIG signals may share topology inputs with PSIG signals but must not derive their activation state from PSIG activation outcomes. This prevents implicit activation coupling. |
| Formula is not closed-form or requires external model inference | No ML-based or inference-based derivation qualifies. All DPSIG formulas are algebraic expressions over topology counts. |

---

## 6. DPSIG Normalization Model

### 6.1 Namespace Intent

The DPSIG namespace is the **normalized runtime namespace for generic distribution-based and relational topology signals** in the target consolidated architecture (Lane D). It resolves the naming debt documented in the LANE-GOVERNANCE-LOCK.md and signal_namespace_alias_registry.json.

The namespace has two distinct populations:

| Population | Description | Current Status |
|------------|-------------|----------------|
| DPSIG-00x (legacy PSIG migration) | Existing PSIG-001/002/004/006 signals under their correct Lane D names. Same formulas; namespace change only. | Defined in signal_namespace_alias_registry.json; not yet migrated in runtime |
| DPSIG-01x through DPSIG-07x (relational enrichment) | New class-based relational topology indicators defined in this document. | Architecture defined; implementation pending |

### 6.2 Migration Path for Existing Signals

| Current ID | Current Name | Lane D ID | Formula Change | Migration Gate |
|------------|--------------|-----------|---------------|----------------|
| PSIG-001 | coupling_pressure | DPSIG-001 | None | Additive rename only; requires explicit migration contract |
| PSIG-002 | export_pressure | DPSIG-002 | None | Additive rename only; requires explicit migration contract |
| PSIG-004 | cluster_fragmentation | DPSIG-004 | None | Additive rename only; requires explicit migration contract |
| PSIG-006 | isolation_pressure | DPSIG-006 | None | Additive rename only; requires explicit migration contract |

The no_change_rule from signal_namespace_alias_registry.json applies: "No signal_id field in any Lane A runtime artifact may be renamed or removed based solely on this document." The migration requires an explicit Lane A contract. The DPSIG architecture definition does not constitute that contract.

Until migration, both namespaces coexist. New signals are introduced under DPSIG-01x through DPSIG-07x with no collision risk.

### 6.3 DPSIG vs. Legacy PSIG: The Structural Distinction

The legacy PSIG label in Lane A denotes "Program Intelligence Signal" with an implicit assumption of PSEE enrichment. The DPSIG label in Lane D explicitly denotes "Distribution-Based PiOS Signal" — a generic topology signal derived from structural distribution analysis, independent of PSEE enrichment state.

The distinction matters because:
- Clients reading "PSIG-001" in a report may assume PSEE enrichment is active
- The guardrail GR-01 in signal_registry.json already acknowledges that z-scores are run-relative and not portable
- DPSIG label makes the computation basis explicit: distribution-based, not enrichment-based

The future enriched PSIG signals (Fan-In Concentration PSIG-001-enriched, Fan-Out Propagation PSIG-002-enriched) retain the PSIG label in Lane D specifically because they ARE PSEE-enriched — the label correctly denotes the enrichment basis. The DPSIG label belongs to the generic distribution family. This distinction is structurally clean and commercially legible.

### 6.4 DPSIG Normalization Rules

1. **New relational signals enter as DPSIG-0Nc** where N is the class (1=fan, 2=overlap, 3=concentration, 4=cluster, 5=responsibility, 6=volatility, 7=saturation, 8=escalation) and c is the within-class sequence
2. **DPSIG signals are schema-versioned** — each dpsig_signal_set.json artifact declares schema_version and the normalization model version
3. **DPSIG signal IDs are stable across runs** — the same formula produces the same DPSIG-0Nc ID regardless of signal_value; stability is in the identifier, not the value
4. **DPSIG signals are additive** — introducing DPSIG-031 does not require removing or modifying any existing signal
5. **DPSIG activation thresholds are independently governed** — each DPSIG signal class may define its own activation threshold and method; these are not subject to PSIG threshold governance

---

## 7. Product Positioning

### 7.1 How DPSIG Surfaces in Signäl

Signäl is the commercial signal platform. DPSIG signals extend the platform's signal namespace with structurally grounded topology indicators. They surface as:

- **Class 4 (Cluster Pressure)**: cluster-level pressure heatmaps — which of the {N} organizational structural clusters carries disproportionate coupling pressure
- **Class 8 (Escalation Topology)**: structural amplifier indicators — which nodes are simultaneously high-inbound and high-outbound, creating structural propagation risk

These signals are described in Signäl as **deterministic structural indicators** — derived from static topology analysis, not from behavioral inference or semantic enrichment.

### 7.2 How DPSIG Surfaces in LENS

LENS HTML reports expose signal-driven pressure analysis to enterprise clients. DPSIG signals add a second tier of analysis:

| LENS Section | Current Content | DPSIG Addition |
|-------------|-----------------|----------------|
| Pressure Overview | PSIG-001/002 HIGH nodes | + Cluster pressure index (DPSIG-031) context |
| Structural Risk | PSIG-004 surface density | + Responsibility density per grounded domain (DPSIG-041) |
| Topology Detail | Cluster membership table | + Fan pressure by cluster (DPSIG-011/012), singleton cluster count (DPSIG-052) |
| Escalation Signals | N/A currently | Dual-load node identification (DPSIG-071) |

### 7.3 Tier Positioning

**Tier-1 (Executive):**
Topology overload narrative — "The {cluster_name} cluster carries {X}x the system average structural coupling pressure. {N} nodes in this cluster are simultaneously high-inbound and high-outbound." This surfaces DPSIG-031 (Cluster Pressure Index) and DPSIG-071 (Dual-Load Nodes) in executive-legible language.

**Tier-2 (Engineering Leadership):**
Relational bottleneck analysis — which nodes and clusters are structural concentration points, which clusters are structurally isolated (singleton clusters), and where dependency is concentrated in few nodes (DPSIG-021 Dependency Concentration Index).

**Tier-3 (Technical):**
Full DPSIG signal table — all class values with derivation traces, denominator values, and topology traceability. This layer allows engineering teams to validate signals against their own understanding of the codebase structure.

### 7.4 Commercial Value Proposition

DPSIG enrichment adds the following commercially legible value propositions above the current generic platform:

| Value Proposition | DPSIG Signal | Client Benefit |
|-------------------|-------------|----------------|
| Topology overload by cluster | DPSIG-031 | Identifies which organizational structural unit is under the most pressure — not just which individual node |
| Structural amplifiers | DPSIG-071 | Identifies nodes that multiply risk — changes to them propagate both upstream and downstream |
| Dependency concentration | DPSIG-021 | Quantifies fragility — how much would the system be affected if the top-K nodes were unavailable |
| Isolated component risk | DPSIG-052 | Identifies structural fragmentation — singleton clusters are at coordination risk by definition |
| Cluster-relative outlier detection | DPSIG-011/012 | Identifies nodes that are unusual within their structural context, not just globally — more precise targeting |

**These are deterministic structural indicators, NOT semantic governance outputs.** Every value is derivable from static topology analysis. No behavioral inference is involved. No semantic enrichment state is required. The signals are available regardless of whether the PSEE activation gate is in ENRICHMENT_READY or ENRICHMENT_BLOCKED state.

---

## 8. Safety Boundaries

### 8.1 Permanent Structural Sovereignty Boundaries

The following boundaries are permanent and apply to all future work in the DPSIG enrichment stream family:

| Boundary | Rule | Rationale |
|----------|------|-----------|
| 75.x activation is sovereign | No DPSIG script reads from, writes to, or alters the behavior of compute_condition_correlation.py, compute_pressure_candidates.py, or compute_pressure_zones.py | Activation authority belongs to 75.x exclusively; enrichment does not participate in activation |
| THRESHOLD = 2.0 is locked | No DPSIG signal may have a threshold that, when triggered, modifies the PSIG-001/002 activation threshold | DPSIG signals have their own independent thresholds; they do not affect PSIG thresholds |
| binding_envelope.json is read-only | No DPSIG derivation step may write to or modify binding_envelope.json | Lane A sovereignty |
| signal_registry.json is PSIG sovereign | No DPSIG script writes to vault/signal_registry.json | DPSIG produces dpsig_signal_set.json; the two artifact types are separate |
| Additive only | DPSIG enrichment may only add new artifacts and signals; it may not remove, rename, or repurpose any existing Lane A artifact | Non-regression guarantee |

### 8.2 Deterministic Replay Boundary

All DPSIG derivations must satisfy the six DPSIG qualification requirements (Section 5.1). Any DPSIG signal that fails REQ-02 (reproducibility) must be removed from dpsig_signal_set.json and replaced with a null entry with an explicit non_deterministic_reason field.

The compare_replay_runs.py script from the semantic governance exploration stack must be run against two independent executions of derive_relational_signals.py before any DPSIG signal is declared production-ready. The overall_verdict must be IDENTICAL.

### 8.3 Activation Authority Isolation

DPSIG signals may have their own activation states (e.g., DPSIG-031 CLUSTER_PRESSURE_HIGH). These activation states do not interact with PSIG activation states. They are computed independently and reported independently. A node may be PSIG-001=HIGH and DPSIG-031=NOMINAL simultaneously — these are orthogonal assessments from different denominators.

No future enrichment contract may introduce a signal that derives its activation state from a PSIG activation outcome. Activation coupling — where a DPSIG signal becomes HIGH because a PSIG signal is HIGH — is forbidden. Both may be HIGH for the same node, but from independent computations.

### 8.4 Evidence First Boundary

Every DPSIG signal value must have a derivation_trace that links the output value to specific input values from specific artifact fields. The chain must be unbroken: signal_value → formula → numerator_value → artifact_path + field_name. If any link in this chain is absent, the signal is not ready for production use.

### 8.5 Explicitly Forbidden Future Enrichments

The following capability types are forbidden in the DPSIG stream family:

| Forbidden Capability | Reason |
|---------------------|--------|
| Modifying PSIG activation thresholds based on DPSIG signal states | This is semantic authority escalation by routing — equivalent to indirect threshold modification |
| Deriving DPSIG signals from PSEE enrichment keys (psee_context, evidence_confidence, etc.) | These keys carry placeholder values; signals depending on them are not currently deterministic |
| Using DPSIG signals as input to 75.x condition activation | 75.x activation boundary must remain clean |
| Introducing DPSIG signals that require semantic enrichment state as a prerequisite | DPSIG is Lane A — generic runtime. Enrichment-dependent signals belong to enriched PSIG (Lane D, blocked) |
| Publishing DPSIG activation states in client surfaces as equivalent to PSIG activation states | The two activation models have different baselines; conflating them misrepresents the signal |
| Re-opening semantic governance branches under DPSIG framing | DPSIG is structurally sovereign; it cannot be used as a path to bypass the semantic governance closure |

---

## 9. First Implementation Objective

### 9.1 Target: Deterministic Relational Metric Extraction

The first implementation objective following this architecture definition is:

**`PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01`**

This design stream must:
1. Define the exact schema for `dpsig_signal_set.json` — artifact structure, field definitions, derivation_trace format
2. Define the exact formula specification for the first production DPSIG signal class (recommended: Class 4, Cluster Pressure, as it has the most immediate commercial value and the clearest topology dependency)
3. Define the `derive_relational_signals.py` script interface: inputs, outputs, execution context, Lane A isolation guarantee
4. Define the DPSIG activation threshold governance model — how DPSIG signal thresholds are set, versioned, and governed independently from PSIG thresholds
5. Define the LENS integration point — exactly where dpsig_signal_set.json is consumed in lens_report_generator.py

### 9.2 Recommended First Signal Class

**Class 4: Cluster Pressure Signals (DPSIG-031/032)**

Rationale:
- Directly uses canonical_topology.json cluster membership (already proven in evaluate_psee_gate.py)
- Aggregates existing DPSIG-001/002 values at the cluster level — no new data dependencies
- Produces the commercially most legible output: "which organizational cluster is under the most structural pressure"
- Does not require structural_topology_log.json IMPORTS edges (which are absent in FastAPI run_02)
- Formula is simple, closed-form, and has a clear denominator guard (cluster_size=0 → null)

### 9.3 What the First Implementation Does Not Include

The first implementation does NOT include:
- Semantic authority — no changes to 75.x
- Cross-cluster overlap (DPSIG-003/013) — requires IMPORTS edge data not present in current FastAPI reference run
- Migration of PSIG-001/002/004/006 to DPSIG-001/002/004/006 — requires explicit Lane A migration contract
- DPSIG integration into signal_registry.json — DPSIG produces its own artifact
- Multi-run relational volatility (DPSIG-05x extended) — requires multi-run archive access

---

## 10. Governance Verdict

### 10.1 Verdict

**Deterministic Relational Enrichment is APPROVED as the commercial-aligned architectural direction for the PSEE ↔ PiOS integration.**

The verdict is based on the following assessment:

| Governance Dimension | Assessment |
|---------------------|------------|
| Commercially aligned | YES — adds cluster-level pressure intelligence; directly addresses CEO purchase intent for organizational structural clarity |
| Structurally safe | YES — additive parallel derivation; no 75.x modification; no threshold change |
| Deterministic | YES — all DPSIG signals derivable from static topology artifacts using closed-form algebraic formulas |
| Explainable | YES — every signal has a plain-language explainability template derivable from the formula |
| Replay-compatible | YES — all signals qualify as TAXONOMY-01 REPLAY_STABLE; replay_diff overall_verdict=IDENTICAL is achievable |
| Governance-compatible | YES — does not reopen semantic governance branch; does not introduce semantic authority; does not weaken structural sovereignty |

### 10.2 Authority Boundaries Confirmed

This architecture definition confirms the following authority boundaries, which remain locked:

- **75.x activation sovereignty**: PRESERVED. THRESHOLD=2.0 unchanged. RUN_RELATIVE_OUTLIER unchanged. DPSIG does not touch activation logic.
- **Lane A runtime integrity**: PRESERVED. binding_envelope.json, signal_registry.json, and all 75.x/41.x scripts are immutable under this architecture.
- **Semantic observability status**: OBSERVATIONAL_ONLY. The governance observability stack (evaluate_psee_gate.py, etc.) remains operational and unchanged. It is not affected by DPSIG enrichment.
- **Semantic activation authority**: BLOCKED. This architecture does not unblock semantic activation. The reopen conditions defined in SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md Section 10 remain in effect.
- **Structural sovereignty**: PRESERVED. All DPSIG signals are derived from structural topology; structural topology analysis is the foundation of the generic platform; the generic platform remains sovereign over its own signals.

### 10.3 The Governing Principle of This Stream Family

> **Structural topology is the product. Relational signals make it legible. Legibility is the commercial deliverable. None of this requires semantic authority.**

The 29 nodes, 25 edges, 19 clusters, and 104 structural relations in the FastAPI reference run represent a real organizational software structure. That structure has fan-in concentration in DOM-01 (fan_in=44, PSIG-001=2.32), fan-out concentration in the APPLICATION domain (fan_out=132, PSIG-002=6.96), and 19 structural clusters with varying sizes. These are facts. They are deterministic. They are commercially valuable to a CEO deciding where to invest engineering resources.

DPSIG enrichment adds cluster-aware context — which of the 19 clusters is under the most pressure, which nodes are structural amplifiers, how concentrated the dependency load is. This is the next commercial tier. It is structurally grounded, technically sound, and commercially legible.

**HANDOFF: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01**

---

## 11. Validation

### PASS criteria — all met:

- [x] Deterministic relational enrichment clearly defined (Section 2) — four defining properties; four explicit distinctions from semantic authority/governance/observability/replay
- [x] Relational signals distinguished from semantics (Sections 2, 8) — permanent safety boundaries; forbidden enrichment list; no semantic authority expansion
- [x] Runtime integration model explicit (Section 4) — additive parallel derivation diagram; 40.5 entry point; 40.x/41.x termination; immutable artifact table; sovereignty preservation
- [x] DPSIG normalization defined (Section 6) — legacy migration path; namespace distinction; normalization rules; DPSIG vs. PSIG structural distinction
- [x] Product positioning explicit (Section 7) — Signäl, LENS, Tier-1/2/3 integration map; commercial value proposition table
- [x] Safety boundaries explicit (Section 8) — permanent sovereignty table; deterministic replay boundary; activation isolation; evidence-first; forbidden capability list
- [x] Semantic authority excluded throughout — zero semantic authority expansion; activation boundary explicitly preserved in Sections 2, 4, 8, 10
- [x] No implementation performed — architecture definition only; no scripts created; no artifacts modified

### FAIL conditions check:

- Relational signals conflated with semantic authority? NO — Sections 2.2, 8.5 explicitly prohibit this conflation
- Semantic governance reopened? NO — Section 8.5 explicitly forbids re-opening under DPSIG framing; closure conditions remain in effect
- Activation sovereignty weakened? NO — THRESHOLD=2.0 unchanged; 75.x pipeline immutable; DPSIG does not feed into activation
- Runtime mutation introduced? NO — no scripts modified; binding_envelope.json and signal_registry.json are read-only under this architecture
- Future implementation direction ambiguous? NO — Section 9 specifies PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01 as the first step; Class 4 (Cluster Pressure) as the first signal class; dpsig_signal_set.json as the first artifact target

Status: **PASS**
