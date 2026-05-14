# DPSIG Runtime Normalization — Production Contract Design

Stream: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01  
Status: COMPLETE — AUTHORITATIVE  
Generated: 2026-05-07  
Branch: feature/psee-pios-integration-productized  

UPSTREAM: PI.PSEE-PIOS.DETERMINISTIC-RELATIONAL-ENRICHMENT.01  
HANDOFF_TO: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01  

LANE_SCOPE: D (target architecture) with Lane A isolation guarantee  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts (75.x/41.x): NO  
  Modifies binding_envelope.json: NO — read-only input  
  Modifies signal_registry.json: NO — DPSIG produces separate artifact  
  Introduces new artifacts: YES — dpsig_signal_set.json (design only; no creation in this stream)  
  Introduces new scripts: NO — design contract only  

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.DETERMINISTIC-RELATIONAL-ENRICHMENT.01/DETERMINISTIC_RELATIONAL_ENRICHMENT.md`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.4/canonical_topology.json`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/binding_envelope.json`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.3/structural_topology_log.json`
- `docs/governance/psee_provenance_schema.json`

Evidence base (FastAPI run_02_oss_fastapi_pipeline):

| Artifact | Key Values |
|----------|-----------|
| canonical_topology | 19 clusters, 123 total structural nodes |
| Cluster distribution | CLU-17/src=89, CLU-12/generated=7, CLU-03/.github=6, CLU-08/.vscode=3, CLU-06=2, CLU-07=2, CLU-18/tests=2, 12 singletons |
| Non-singleton clusters | 7 (CLU-03, CLU-06, CLU-07, CLU-08, CLU-12, CLU-17, CLU-18) |
| Mean non-singleton size | 15.857 (111 nodes / 7 clusters) |
| binding_envelope | 29 nodes (9 DOM, 10 CE, 10 CS), 25 edges |
| structural_topology_log | 104 CONTAINS relations, 0 IMPORTS |
| grounding_state_v3 | total_ceu=10, grounded=9, ratio=0.9 |
| signal_registry | PSIG-001=2.32 HIGH, PSIG-002=6.96 HIGH (THRESHOLD=2.0, pop=33) |

Computed reference values:
- CPI (DPSIG-031) = 89 / 15.857 = **5.613** → CLUSTER_PRESSURE_HIGH
- CFA (DPSIG-032) = 89 / 123 = **0.7236** → DOMINANT_CLUSTER

---

## 1. Purpose

This document defines the **production-grade normalized runtime contract** for DPSIG signal production. It is the implementation specification that the `PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01` stream must execute against exactly.

This document specifies, with sufficient precision for unambiguous implementation:

1. The `dpsig_signal_set.json` artifact schema (Section 2)
2. The signal entry contract — every field that must appear per signal (Section 3)
3. Class 4 implementation target: DPSIG-031/032 with exact formulas (Section 4)
4. The normalization strategy — which normalization method is authorized for each signal type (Section 5)
5. DPSIG activation governance — threshold model, independent from PSIG (Section 6)
6. `derive_relational_signals.py` script contract — inputs, outputs, execution context (Section 7)
7. LENS integration model — where dpsig_signal_set.json is consumed (Section 8)
8. First implementation boundary — what is authorized vs. deferred (Section 9)
9. Validation model (Section 10)
10. Governance verdict (Section 11)

**No implementation is performed in this document.** No scripts are created. No runtime artifacts are produced or modified. Every formula and schema specified here is a contract — the implementation stream executes it, not this document.

---

## 2. dpsig_signal_set.json — Artifact Schema

### 2.1 Artifact Identity

```
Path:    artifacts/psee_dpsig/<client_id>/<run_id>/dpsig_signal_set.json
Produced by: derive_relational_signals.py
Input artifacts: canonical_topology.json, binding_envelope.json,
                 structural_topology_log.json, grounding_state_v3.json
Output consumers: lens_report_generator.py (read-only)
Lane A impact: NONE — separate artifact path; no existing artifact modified
```

### 2.2 Top-Level Schema

```json
{
  "schema_version": "1.0",
  "client_id": "<string>",
  "run_id": "<string>",
  "generated_at": "<ISO-8601 timestamp>",
  "script_version": "<semver string>",
  "derivation_context": {
    "canonical_topology_hash": "<sha256>",
    "binding_envelope_hash": "<sha256>",
    "structural_topology_log_hash": "<sha256>",
    "grounding_state_hash": "<sha256>",
    "total_structural_nodes": "<integer>",
    "total_clusters": "<integer>",
    "total_ceu_nodes": "<integer>",
    "total_edges": "<integer>"
  },
  "normalization_basis": {
    "run_relative_population": "<integer — node count used as denominator for run-relative signals>",
    "non_singleton_cluster_count": "<integer>",
    "mean_non_singleton_cluster_size": "<float>",
    "total_structural_node_count": "<integer>",
    "singleton_cluster_count": "<integer>"
  },
  "signal_entries": [
    { /* see Section 3 — signal entry contract */ }
  ],
  "derivation_summary": {
    "signals_derived": "<integer>",
    "signals_activated": "<integer>",
    "signals_null": "<integer>",
    "null_reasons": ["<string>", ...]
  },
  "replay_taxonomy": {
    "TAXONOMY_01_REPLAY_STABLE": ["signal_entries[*].signal_id", "signal_entries[*].signal_value", "..."],
    "TAXONOMY_02_TIME_VARYING": ["generated_at"],
    "TAXONOMY_03_VERSION_DEPENDENT": ["schema_version", "script_version", "derivation_context.*_hash"]
  }
}
```

### 2.3 Field-Level TAXONOMY Classification

| Field | TAXONOMY |
|-------|----------|
| `schema_version` | TAXONOMY-03 — version-dependent |
| `client_id` | TAXONOMY-01 — replay-stable |
| `run_id` | TAXONOMY-01 — replay-stable |
| `generated_at` | TAXONOMY-02 — time-varying, excluded from replay diff |
| `script_version` | TAXONOMY-03 — version-dependent, informational |
| `derivation_context.canonical_topology_hash` | TAXONOMY-03 — informational; hash changes across runs |
| `derivation_context.total_structural_nodes` | TAXONOMY-01 — deterministic from canonical_topology.json |
| `derivation_context.total_clusters` | TAXONOMY-01 |
| `derivation_context.total_ceu_nodes` | TAXONOMY-01 |
| `derivation_context.total_edges` | TAXONOMY-01 |
| `normalization_basis.*` | TAXONOMY-01 — deterministic from topology artifacts |
| `signal_entries[*].signal_id` | TAXONOMY-01 |
| `signal_entries[*].signal_value` | TAXONOMY-01 — must be identical on replay |
| `signal_entries[*].activation_state` | TAXONOMY-01 |
| `signal_entries[*].derivation_trace` | TAXONOMY-01 |
| `signal_entries[*].explainability_render` | TAXONOMY-01 — deterministic from signal_value |
| `derivation_summary.*` | TAXONOMY-01 |

### 2.4 Artifact Integrity Constraint

The `derivation_context` block records sha256 hashes of all four input artifacts. These hashes serve two functions:
1. **Replay anchor**: given identical hashes, identical `signal_entries` values MUST result
2. **Audit trail**: an independent auditor can verify the artifact inputs that produced the signal values

The hashes are TAXONOMY-03 (not directly compared in replay diff) because they change across runs. However, if hashes match between two runs, signal values MUST be identical. If hashes differ and signal values differ, that is expected. If hashes differ and signal values are identical, that may indicate a derivation anomaly and must be recorded.

---

## 3. Signal Entry Contract

### 3.1 Required Fields Per Signal Entry

Every signal in `signal_entries` must include ALL of the following fields. Omission of any field is a FAIL for that signal entry.

```json
{
  "signal_id": "DPSIG-031",
  "signal_class": 4,
  "signal_name": "Cluster Pressure Index",
  "formula": "max(cluster_node_count) / max(mean(cluster_node_count for non_singleton_clusters), 1)",
  "normalization_scope": "CLUSTER_RELATIVE",
  "normalization_basis_field": "normalization_basis.mean_non_singleton_cluster_size",
  "activation_method": "CLUSTER_MASS_THRESHOLD",
  "threshold_basis": "DPSIG_CLASS4_THRESHOLD",
  "threshold_value": 3.0,
  "signal_value": 5.613,
  "activation_state": "CLUSTER_PRESSURE_HIGH",
  "denominator_guard": {
    "guard_condition": "non_singleton_cluster_count == 0",
    "guard_action": "emit null — ALL_SINGLETON_CLUSTERS",
    "denominator_zero_flag": false
  },
  "derivation_trace": {
    "numerator_field": "max(cluster.node_count for all clusters)",
    "numerator_value": 89,
    "numerator_source": "canonical_topology.json → clusters[cluster_id=CLU-17].node_count",
    "denominator_field": "mean(cluster.node_count for clusters where node_count > 1)",
    "denominator_value": 15.857,
    "denominator_source": "canonical_topology.json → mean([6,2,2,3,7,89,2])",
    "result": 5.613,
    "rounding": "4 decimal places — float64"
  },
  "topology_dependencies": [
    {
      "artifact": "canonical_topology.json",
      "field": "clusters[*].node_count",
      "usage": "primary input — cluster size distribution"
    }
  ],
  "source_artifacts": {
    "canonical_topology": "<sha256>",
    "binding_envelope": "<sha256 or UNUSED>",
    "structural_topology_log": "<sha256 or UNUSED>",
    "grounding_state": "<sha256 or UNUSED>"
  },
  "explainability_template": "The {cluster_name} cluster (CLU-{id}) contains {numerator_value} structural nodes — {signal_value:.1f}x the mean non-singleton cluster size of {denominator_value:.1f} nodes. It is the dominant structural mass concentration zone in this codebase.",
  "explainability_render": "The src cluster (CLU-17) contains 89 structural nodes — 5.6x the mean non-singleton cluster size of 15.9 nodes. It is the dominant structural mass concentration zone in this codebase.",
  "lens_tier": ["TIER-1", "TIER-2", "TIER-3"],
  "replay_class": "TAXONOMY-01"
}
```

### 3.2 Field Definitions

| Field | Type | Description | Replay Class |
|-------|------|-------------|-------------|
| `signal_id` | string | Stable DPSIG namespace identifier — DPSIG-0Nc format | TAXONOMY-01 |
| `signal_class` | integer | Class 1–8 per architecture definition | TAXONOMY-01 |
| `signal_name` | string | Human-readable name | TAXONOMY-01 |
| `formula` | string | Closed-form algebraic expression in plain text | TAXONOMY-01 |
| `normalization_scope` | enum | See Section 5 — authorized normalization methods | TAXONOMY-01 |
| `normalization_basis_field` | string | JSON path in dpsig_signal_set.json to the denominator source | TAXONOMY-01 |
| `activation_method` | enum | CLUSTER_MASS_THRESHOLD / ASYMMETRY_THRESHOLD / RUN_RELATIVE_OUTLIER / CONCENTRATION_THRESHOLD / THEORETICAL_BASELINE | TAXONOMY-01 |
| `threshold_basis` | string | Named threshold constant — references threshold_model block | TAXONOMY-01 |
| `threshold_value` | number | Activation threshold at time of derivation (snapshot) | TAXONOMY-01 |
| `signal_value` | number or null | Computed value; null if denominator_guard fires | TAXONOMY-01 |
| `activation_state` | string | Activation outcome — see Section 6 | TAXONOMY-01 |
| `denominator_guard` | object | Guard condition, action, and fired flag | TAXONOMY-01 |
| `derivation_trace` | object | Full numerator/denominator with artifact-level field references | TAXONOMY-01 |
| `topology_dependencies` | array | Every artifact and field used; must be complete | TAXONOMY-01 |
| `source_artifacts` | object | sha256 hash of each input artifact used (UNUSED if not consumed) | TAXONOMY-03 |
| `explainability_template` | string | Template with {variable} placeholders for rendering | TAXONOMY-01 |
| `explainability_render` | string | Rendered plain-language explanation with actual values | TAXONOMY-01 |
| `lens_tier` | array | Which LENS tiers render this signal | TAXONOMY-01 |
| `replay_class` | string | Always TAXONOMY-01 for signal_value; field is informational | TAXONOMY-01 |

### 3.3 Stable Replay Identity Requirements

A signal entry is **replay-stable** if and only if:

1. Given identical `derivation_context.*_hash` values across two runs, `signal_value` and `activation_state` are identical
2. `derivation_trace.numerator_value`, `derivation_trace.denominator_value`, and `derivation_trace.result` are all bitwise-identical across runs with identical inputs
3. `explainability_render` is identical (since it is a function of `signal_value` and topology metadata)
4. `denominator_guard.denominator_zero_flag` is identical

Replay-stable fields correspond to TAXONOMY-01 in the replay_taxonomy block. The only legitimate TAXONOMY-02 field in a signal entry is none — timestamps do not appear at the signal entry level. The `source_artifacts` hashes are TAXONOMY-03.

### 3.4 Null Signal Contract

When a signal cannot be computed (denominator guard fires, missing artifact, or input data is degenerate), the signal entry must still be present with:

```json
{
  "signal_id": "DPSIG-031",
  "signal_value": null,
  "activation_state": "NULL_TOPOLOGY",
  "denominator_guard": {
    "guard_condition": "non_singleton_cluster_count == 0",
    "guard_action": "emit null — ALL_SINGLETON_CLUSTERS",
    "denominator_zero_flag": true
  },
  "derivation_trace": {
    "result": null,
    "null_reason": "ALL_SINGLETON_CLUSTERS — no non-singleton cluster exists to form a denominator"
  }
}
```

Null signal entries are TAXONOMY-01 — they must be identical across replays with identical inputs. A guard that fires deterministically must always fire.

---

## 4. Class 4 Implementation Target — Cluster Pressure Signals

### 4.1 Layer Resolution Decision

The architecture definition (`DETERMINISTIC_RELATIONAL_ENRICHMENT.md` Section 3, Class 4) stated the DPSIG-031 formula as `mean(DPSIG-001[nodes in cluster])` with a topology dependency on both `canonical_topology.json cluster membership` and `binding_envelope.json`.

This design stream resolves the **layer gap** identified in the pre-implementation analysis: canonical_topology.json clusters contain structural node IDs (NODE-XXXX from the 40.3 scan layer), while binding_envelope.json contains CEU/DOM/CE/CS node IDs at the semantic binding abstraction layer. These are different namespaces with no direct mapping artifact in the current pipeline.

**Design decision**: Class 4 signals (DPSIG-031, DPSIG-032) operate **exclusively at the structural topology layer** using `canonical_topology.json` as the sole input. Cluster pressure is defined in terms of **structural mass concentration** (node count per cluster), not fan-metric aggregation across mismatched namespaces.

Rationale:
- `canonical_topology.json` is the authoritative cluster source — cluster membership is definitional at this layer
- Structural node count per cluster is a direct, unambiguous topology measurement requiring no cross-artifact mapping
- With 0 IMPORTS edges in the FastAPI reference run, structural fan-in/fan-out derived from `structural_topology_log.json` would be degenerate for signal computation
- Structural mass concentration (which cluster holds the most files/nodes) is commercially legible and directly answers "which organizational code cluster is dominant"

**Architectural correction**: DPSIG-031 and DPSIG-032 formulas are refined from the architecture document. The formula correction is within the authorized scope of this design stream per Section 9.1 of the architecture definition: "define the exact formula specification for the first production DPSIG signal class."

---

### 4.2 DPSIG-031 — Cluster Pressure Index (CPI)

#### Definition

**Cluster Pressure Index** measures the degree to which structural mass (file/node count) is concentrated in a single cluster relative to the typical non-singleton cluster. A high CPI identifies a dominant structural cluster that holds disproportionate codebase complexity.

#### Exact Formula

```
CPI = max(cluster_node_count[k] for all k)
      ─────────────────────────────────────────────────────────────────
      max(mean(cluster_node_count[k] for k where cluster_node_count[k] > 1), 1)
```

Where:
- `cluster_node_count[k]` = `canonical_topology.json → clusters[k].node_count`
- Numerator = single maximum cluster node count across all clusters
- Denominator = arithmetic mean of node counts for all non-singleton clusters (clusters with node_count > 1); guarded to minimum 1.0

#### Denominator Guard

| Condition | Guard Action | Resulting signal_value | Resulting activation_state |
|-----------|-------------|----------------------|--------------------------|
| All clusters are singletons (`non_singleton_cluster_count == 0`) | emit null | null | NULL_TOPOLOGY |
| Only one non-singleton cluster exists | denominator = that cluster's node_count; CPI = 1.0 | 1.0 | CLUSTER_PRESSURE_NOMINAL |
| Normal case: ≥ 2 non-singleton clusters | mean of non-singleton node counts | computed float | per threshold |

#### Null Behavior

When `signal_value = null` (ALL_SINGLETON_CLUSTERS guard):
- `denominator_zero_flag = true`
- `null_reason = "ALL_SINGLETON_CLUSTERS"`
- `explainability_render = "All structural clusters contain exactly one node. No cluster pressure differential exists."`
- Signal is omitted from Tier-1 rendering; included in Tier-3 with null notation

#### Normalization Scope

`CLUSTER_RELATIVE` — the denominator is the mean of the cluster distribution within this run. CPI is not comparable across runs with different total cluster counts; it is a within-run concentration measure.

#### Activation Thresholds

| Threshold | Bound | Activation State | Severity |
|-----------|-------|-----------------|---------|
| CPI ≥ 5.0 | upper | CLUSTER_PRESSURE_HIGH | HIGH |
| 2.0 ≤ CPI < 5.0 | upper | CLUSTER_PRESSURE_ELEVATED | ELEVATED |
| CPI < 2.0 | lower | CLUSTER_PRESSURE_NOMINAL | NOMINAL |
| signal_value = null | guard | NULL_TOPOLOGY | NONE |

**Threshold basis**: `DPSIG_CLASS4_CPI_THRESHOLD`. These thresholds are independent from PSIG-001/002 THRESHOLD=2.0. The value 5.0 for HIGH is chosen because a CPI of 5.0 means the dominant cluster is 5x the average — a structurally significant concentration. A CPI of 2.0 (ELEVATED) indicates a cluster 2x the mean — notable but not extreme.

#### Replay Expectations

Given identical canonical_topology.json:
- `cluster_node_count` values are identical (deterministic from static filesystem scan)
- `max(cluster_node_count)` is identical
- `mean(non_singleton_node_counts)` is identical (arithmetic mean of a fixed set)
- `CPI` is identical (float division to 4 decimal places, IEEE 754 double precision)
- `activation_state` is identical (threshold comparison is deterministic)

Overall: TAXONOMY-01 REPLAY_STABLE. Two independent runs of derive_relational_signals.py against the same canonical_topology.json must produce identical `signal_value` and `activation_state` for DPSIG-031.

#### FastAPI Reference Computation

```
canonical_topology.json run_02_oss_fastapi_pipeline:
  Total clusters: 19
  Non-singleton clusters: 7
    CLU-17 (src):            89 nodes  ← MAX
    CLU-12 (generated):       7 nodes
    CLU-03 (.github):         6 nodes
    CLU-08 (.vscode):         3 nodes
    CLU-06 (.readme_assets):  2 nodes
    CLU-07 (.sqlite_db):      2 nodes
    CLU-18 (tests):           2 nodes
  Mean non-singleton size: (89+7+6+3+2+2+2)/7 = 111/7 = 15.857

CPI = 89 / 15.857 = 5.613

activation_state = CLUSTER_PRESSURE_HIGH (5.613 ≥ 5.0)
```

#### Explainability Template

```
"The {max_cluster_name} cluster (CLU-{max_cluster_id}) contains {numerator_value} structural 
nodes — {signal_value:.1f}x the mean non-singleton cluster size of {denominator_value:.1f} 
nodes. It is the dominant structural mass concentration zone in this codebase."
```

#### Rendered Example (FastAPI run_02)

> "The src cluster (CLU-17) contains 89 structural nodes — 5.6x the mean non-singleton cluster size of 15.9 nodes. It is the dominant structural mass concentration zone in this codebase."

#### Executive Interpretation Examples

**High-pressure context (CPI ≥ 5.0):**
> "72% of the codebase's structural files reside in a single cluster (src). This concentration means that changes, refactors, or quality issues in this cluster have system-wide structural impact. Engineering leadership should prioritize organizational clarity within the src cluster."

**Nominal context (CPI < 2.0):**
> "Structural mass is evenly distributed across {N} clusters. No single cluster dominates. This indicates healthy modular separation at the filesystem organizational level."

#### LENS Rendering Intent

| LENS Tier | Rendering |
|-----------|----------|
| TIER-1 (Executive) | Cluster pressure narrative: "The dominant cluster carries {CPI:.1f}x average structural load — {cluster_name} is the structural concentration point." |
| TIER-2 (Engineering Leadership) | Cluster size table ranked by node_count; CPI value highlighted; comparison to system mean |
| TIER-3 (Technical) | Full derivation trace including numerator cluster, denominator cluster list, threshold comparison, and replay_class declaration |

---

### 4.3 DPSIG-032 — Cluster Fan Asymmetry (CFA)

#### Definition

**Cluster Fan Asymmetry** measures the fraction of total structural mass (nodes) held by the largest cluster. A high CFA indicates that one cluster dominates the codebase's structural footprint — it is a mass share metric, not a relative-size metric.

#### Exact Formula

```
CFA = max(cluster_node_count[k] for all k)
      ──────────────────────────────────────────
      max(sum(cluster_node_count[k] for all k), 1)
```

Where:
- `cluster_node_count[k]` = `canonical_topology.json → clusters[k].node_count`
- Numerator = maximum cluster node count
- Denominator = total structural node count across all clusters
- Result: a proportion in [0, 1] — the dominant cluster's share of total structural mass

CFA differs from CPI:
- CPI measures *relative* pressure (max vs. mean of non-singletons) — a within-distribution comparison
- CFA measures *absolute* share (max vs. total) — a direct mass fraction

They are complementary: a codebase can have high CPI but low CFA if many clusters are large; it can have high CFA with moderate CPI if many clusters are singletons (lowering mean).

#### Denominator Guard

| Condition | Guard Action | Resulting signal_value | Resulting activation_state |
|-----------|-------------|----------------------|--------------------------|
| total_structural_node_count == 0 | emit null | null | NULL_TOPOLOGY |
| total_structural_node_count > 0 | normal computation | float in [0, 1] | per threshold |

The ALL-ZERO case cannot occur if canonical_topology.json exists and has non-empty clusters. The guard is a defensive measure against malformed input.

#### Normalization Scope

`RUN_RELATIVE` — the denominator is the total structural node count within this run. CFA is comparable across runs when expressed as a proportion, but threshold interpretation should account for codebase size.

#### Activation Thresholds

| Threshold | Bound | Activation State | Severity | Interpretation |
|-----------|-------|-----------------|---------|---------------|
| CFA ≥ 0.60 | upper | DOMINANT_CLUSTER | HIGH | One cluster holds ≥60% of structural mass |
| 0.35 ≤ CFA < 0.60 | upper | CLUSTER_ASYMMETRIC | ELEVATED | One cluster holds 35–59% of structural mass |
| CFA < 0.35 | lower | CLUSTER_BALANCED | NOMINAL | No cluster holds more than 35% |
| signal_value = null | guard | NULL_TOPOLOGY | NONE | |

**Threshold basis**: `DPSIG_CLASS4_CFA_THRESHOLD`. These thresholds represent structural reasoning about mass distribution: ≥60% dominant (majority of codebase in one cluster), 35–60% asymmetric (plurality concentration), <35% balanced (no single dominant cluster).

#### Replay Expectations

Identical to DPSIG-031 — TAXONOMY-01 REPLAY_STABLE. Total node count and max cluster count are both deterministic from static topology analysis.

#### FastAPI Reference Computation

```
canonical_topology.json run_02_oss_fastapi_pipeline:
  Total structural nodes: 123
  Maximum cluster (CLU-17/src): 89 nodes

CFA = 89 / 123 = 0.7236

activation_state = DOMINANT_CLUSTER (0.7236 ≥ 0.60)
```

#### Explainability Template

```
"The {max_cluster_name} cluster (CLU-{max_cluster_id}) holds {pct:.1f}% of the 
codebase's {total_nodes} structural nodes ({numerator_value} of {denominator_value}). 
{N} of {total_clusters} clusters ({singleton_pct:.0f}%) contain only a single structural node."
```

#### Rendered Example (FastAPI run_02)

> "The src cluster (CLU-17) holds 72.4% of the codebase's 123 structural nodes (89 of 123). 12 of 19 clusters (63.2%) contain only a single structural node."

#### Executive Interpretation Examples

**Dominant context (CFA ≥ 0.60):**
> "More than 70% of the codebase's files belong to a single structural cluster (src). This is the architecture's center of gravity. Investment decisions, technical debt, and quality initiatives in this cluster have maximum system-wide leverage."

**Balanced context (CFA < 0.35):**
> "Structural mass is well-distributed. No single cluster holds more than 35% of the codebase's files. This indicates effective modular decomposition at the organizational level."

#### LENS Rendering Intent

| LENS Tier | Rendering |
|-----------|----------|
| TIER-1 (Executive) | "The {cluster_name} cluster holds {pct:.0f}% of this codebase's structural files. It is the dominant organizational unit." |
| TIER-2 (Engineering Leadership) | Stacked bar chart data: cluster-by-cluster node count with dominant cluster highlighted; singleton count noted |
| TIER-3 (Technical) | Full derivation trace; CFA alongside CPI; singleton cluster list; all 19 cluster sizes |

---

### 4.4 Class 4 Signal Pair Summary

| Property | DPSIG-031 (CPI) | DPSIG-032 (CFA) |
|----------|----------------|----------------|
| Measurement type | Relative concentration | Absolute mass share |
| Formula | max / mean(non-singletons) | max / total |
| Denominator | mean of non-singleton cluster sizes | total structural node count |
| Output range | ≥ 1.0 (unbounded above) | [0.0, 1.0] |
| HIGH threshold | ≥ 5.0 | ≥ 0.60 |
| Artifacts used | canonical_topology.json only | canonical_topology.json only |
| Replay class | TAXONOMY-01 | TAXONOMY-01 |
| FastAPI value | 5.613 → HIGH | 0.7236 → HIGH |
| Executive read | "X× larger than typical cluster" | "X% of all files in one cluster" |

The two signals are complementary and should be rendered together in Tier-1 when both are activated.

---

## 5. Normalization Strategy

### 5.1 Authorized Normalization Methods

Five normalization methods are defined for the DPSIG signal namespace. Each has a precise authorization scope that determines which signal classes may use it.

---

#### METHOD-1: RUN_RELATIVE_OUTLIER

**Definition**: Signal value = observed metric / mean(observed metric across all nodes or clusters in the run).

**Authorization**: Class 1 (fan pressure), Class 5 (responsibility density).

**Formula form**: `signal_value = metric[node] / mean(metric[all_nodes_in_run])`

**Denominator guard**: if `mean(metric) == 0`, emit null with reason `ZERO_MEAN_DENOMINATOR`.

**Replay stability**: TAXONOMY-01 — metric values and population are both static within a run.

**When to use**: When comparing an individual node's metric against the run-wide average. Suitable for node-level signals where cross-run portability is NOT required.

**When NOT to use**: Class 4 (cluster pressure) — cluster-level signals require cluster-level denominators, not node-level means. Class 2/3 (overlap/concentration) — these require absolute thresholds or theoretical baselines because their values have defined structural meaning (0.0 = no overlap; 1.0 = complete overlap).

---

#### METHOD-2: CLUSTER_RELATIVE_OUTLIER

**Definition**: Signal value = observed metric for a node / mean(observed metric across all nodes in the same cluster).

**Authorization**: Class 1 cluster-relative variants (DPSIG-011, DPSIG-012).

**Formula form**: `signal_value = metric[node] / mean(metric[all_nodes_in_cluster(node)])`

**Denominator guard**: if cluster has only one node (singleton cluster), or `mean(metric[cluster]) == 0`, emit null with reason `SINGLETON_CLUSTER` or `ZERO_MEAN_CLUSTER`.

**Replay stability**: TAXONOMY-01 — cluster membership is deterministic from canonical_topology.json.

**When to use**: When identifying within-cluster outliers — which node within a structural cluster carries disproportionate load relative to its peers. More precise targeting than run-relative.

**When NOT to use**: Class 4 — cluster pressure signals aggregate at the cluster level; they do not measure individual node deviation within the cluster.

---

#### METHOD-3: CLUSTER_MASS_THRESHOLD

**Definition**: Signal value is a cluster-level aggregate metric; activation is determined by comparing the metric against a named threshold.

**Authorization**: Class 4 (cluster pressure, DPSIG-031/032). May extend to Class 7 (saturation) in future design.

**Formula form**: `signal_value = aggregate_function(cluster-level metric)` where aggregate_function is max, mean, or sum as specified per signal.

**Activation**: `if signal_value >= threshold → HIGH; elif signal_value >= lower_bound → ELEVATED; else → NOMINAL`

**Denominator guard**: class-specific (see Section 4.2 for DPSIG-031, Section 4.3 for DPSIG-032).

**Replay stability**: TAXONOMY-01 — threshold is a named constant; aggregate is deterministic.

**When to use**: When the signal measures cluster-level properties directly — not as a ratio of individual node metrics, but as a direct property of the cluster's structural characteristics.

---

#### METHOD-4: CONCENTRATION_THRESHOLD

**Definition**: Signal value is a concentration coefficient (e.g., Gini coefficient, top-K share); activation is determined by comparing against a named threshold.

**Authorization**: Class 3 (dependency concentration, DPSIG-021/022). Class 6 (relational volatility, DPSIG-052/singleton cluster ratio).

**Formula form**: `signal_value = concentration_measure(distribution)` where concentration_measure produces a value in [0, 1].

**Denominator guard**: if `total_population == 0` or `sum(distribution) == 0`, emit null.

**Replay stability**: TAXONOMY-01 — Gini coefficient of a fixed distribution is bitwise-deterministic when computed using consistent sorting (ascending sort before summation).

**Determinism note**: Gini coefficient computation must use a defined sort order to prevent floating-point summation order variance. Required: ascending sort of the distribution before accumulation.

---

#### METHOD-5: THEORETICAL_BASELINE

**Definition**: Signal value is measured against a theoretically defined maximum or reference point (not a run-specific average).

**Authorization**: Class 2 (overlap density), Class 7 (topology saturation), Class 8 (escalation topology proportion).

**Formula form**: `signal_value = observed / theoretical_maximum`

**Example**: DPSIG-061 topology density = actual_edges / (n*(n-1)/2) where n*(n-1)/2 is the theoretical maximum for a directed graph.

**Denominator guard**: if n ≤ 1 (zero or one node), emit null with reason `INSUFFICIENT_NODES`.

**Replay stability**: TAXONOMY-01 — theoretical maximum is a closed-form function of node count; node count is deterministic.

**When to use**: When the signal has structural meaning as a fraction of the theoretical maximum. Avoids run-relative distortion for signals that have a known reference point.

---

### 5.2 Normalization Method Authorization Table

| Signal | Class | Authorized Method |
|--------|-------|-----------------|
| DPSIG-001 | 1 | RUN_RELATIVE_OUTLIER |
| DPSIG-002 | 1 | RUN_RELATIVE_OUTLIER |
| DPSIG-011 | 1 | CLUSTER_RELATIVE_OUTLIER |
| DPSIG-012 | 1 | CLUSTER_RELATIVE_OUTLIER |
| DPSIG-003 | 2 | THEORETICAL_BASELINE |
| DPSIG-013 | 2 | THEORETICAL_BASELINE |
| DPSIG-021 | 3 | CONCENTRATION_THRESHOLD |
| DPSIG-022 | 3 | THEORETICAL_BASELINE |
| DPSIG-031 | 4 | CLUSTER_MASS_THRESHOLD |
| DPSIG-032 | 4 | CLUSTER_MASS_THRESHOLD |
| DPSIG-041 | 5 | RUN_RELATIVE_OUTLIER |
| DPSIG-042 | 5 | RUN_RELATIVE_OUTLIER |
| DPSIG-051 | 6 | THEORETICAL_BASELINE |
| DPSIG-052 | 6 | CONCENTRATION_THRESHOLD |
| DPSIG-061 | 7 | THEORETICAL_BASELINE |
| DPSIG-062 | 7 | THEORETICAL_BASELINE |
| DPSIG-071 | 8 | THEORETICAL_BASELINE |
| DPSIG-072 | 8 | CLUSTER_MASS_THRESHOLD |

Cross-method mixing within a single signal is prohibited. A signal must use exactly one normalization method. The method determines the denominator source, the denominator guard logic, and the activation comparison type.

---

## 6. DPSIG Activation Governance

### 6.1 Independence Principle

DPSIG activation states are **fully independent** from PSIG activation states. This independence is a hard architectural rule, not a soft preference.

| Rule | Enforcement |
|------|-------------|
| DPSIG thresholds are owned by `DPSIG_CLASS{N}_THRESHOLD` named constants | No PSIG threshold may serve as a DPSIG threshold |
| DPSIG activation states are computed by `derive_relational_signals.py` | No 75.x script computes or reads DPSIG activation states |
| DPSIG HIGH state does not propagate to PSIG HIGH | PSIG activation is determined exclusively by 75.x against signal_registry.json |
| PSIG HIGH state does not alter DPSIG thresholds | Activation coupling is forbidden |

### 6.2 Activation States

DPSIG signals use the following activation state vocabulary. States are signal-class-appropriate — not all classes use all states.

| Activation State | Description | Classes |
|-----------------|-------------|---------|
| `CLUSTER_PRESSURE_HIGH` | Cluster pressure index above HIGH threshold | Class 4 (DPSIG-031) |
| `CLUSTER_PRESSURE_ELEVATED` | Cluster pressure index between ELEVATED and HIGH bounds | Class 4 (DPSIG-031) |
| `CLUSTER_PRESSURE_NOMINAL` | Cluster pressure index below ELEVATED bound | Class 4 (DPSIG-031) |
| `DOMINANT_CLUSTER` | Cluster mass share above 60% | Class 4 (DPSIG-032) |
| `CLUSTER_ASYMMETRIC` | Cluster mass share 35–60% | Class 4 (DPSIG-032) |
| `CLUSTER_BALANCED` | Cluster mass share below 35% | Class 4 (DPSIG-032) |
| `HIGH` | Run-relative outlier above threshold | Class 1, 5 |
| `NOMINAL` | Below threshold | Class 1, 5 |
| `CONCENTRATION_HIGH` | Concentration coefficient above HIGH threshold | Class 3 |
| `CONCENTRATION_NOMINAL` | Below threshold | Class 3 |
| `COUPLING_DETECTED` | Cross-cluster coupling ratio > 0 | Class 2 |
| `NO_COUPLING` | Cross-cluster coupling ratio = 0 | Class 2 |
| `TOPOLOGY_DENSE` | Above density threshold | Class 7 |
| `TOPOLOGY_SPARSE` | Below density threshold | Class 7 |
| `ESCALATION_DETECTED` | Dual-load nodes present | Class 8 |
| `NO_ESCALATION` | No dual-load nodes | Class 8 |
| `NULL_TOPOLOGY` | Denominator guard fired; signal not computable | All classes |

### 6.3 Threshold Governance Model

Named threshold constants are stored in `derive_relational_signals.py` as module-level constants. They are not externally configurable at runtime — they are hardcoded in the script and versioned through script_version.

```python
# Class 4 thresholds (TASK-03 implementation target)
DPSIG_CLASS4_CPI_HIGH_THRESHOLD = 5.0        # CPI >= 5.0 → CLUSTER_PRESSURE_HIGH
DPSIG_CLASS4_CPI_ELEVATED_THRESHOLD = 2.0    # CPI >= 2.0 → CLUSTER_PRESSURE_ELEVATED
DPSIG_CLASS4_CFA_DOMINANT_THRESHOLD = 0.60   # CFA >= 0.60 → DOMINANT_CLUSTER
DPSIG_CLASS4_CFA_ASYMMETRIC_THRESHOLD = 0.35 # CFA >= 0.35 → CLUSTER_ASYMMETRIC
```

**Threshold change governance**: Any change to a named threshold constant:
1. Requires an increment to `SCRIPT_VERSION` in derive_relational_signals.py
2. Must be documented in the stream contract that authorizes the change
3. Must produce a new CLOSURE.md referencing the threshold change
4. Causes all previously computed DPSIG signals derived with the old threshold to become stale (TAXONOMY-03 impact)

### 6.4 Severity Bands for Tier-1 Projection

DPSIG activation states map to severity bands for Tier-1 executive rendering:

| Severity Band | DPSIG States | Tier-1 Language |
|--------------|-------------|----------------|
| CRITICAL | CLUSTER_PRESSURE_HIGH + DOMINANT_CLUSTER simultaneously | "Structural mass is critically concentrated in {cluster_name}. Both pressure index and mass share indicate structural overload." |
| HIGH | CLUSTER_PRESSURE_HIGH OR DOMINANT_CLUSTER (but not both) | "The {cluster_name} cluster is under elevated structural pressure." |
| ELEVATED | CLUSTER_PRESSURE_ELEVATED OR CLUSTER_ASYMMETRIC | "Structural mass shows asymmetric distribution toward {cluster_name}." |
| NOMINAL | CLUSTER_PRESSURE_NOMINAL AND CLUSTER_BALANCED | "Structural mass is distributed across clusters without dominant concentration." |

CRITICAL severity requires both DPSIG-031 and DPSIG-032 to be in their HIGH states simultaneously. For FastAPI run_02: CPI=5.613 (HIGH) + CFA=0.7236 (HIGH) → **CRITICAL** band.

### 6.5 Prohibited Activation Behaviors

The following activation behaviors are hard-prohibited. If the implementation stream introduces any of them, this design contract is violated and the implementation must be rejected.

| Prohibited Behavior | Why Prohibited |
|--------------------|---------------|
| DPSIG threshold initialized from PSIG threshold value | Activation coupling by initialization — even if both thresholds happen to have the same numerical value, DPSIG must own its threshold independently |
| DPSIG HIGH → PSIG threshold reduced | Indirect threshold modification — forbidden by DETERMINISTIC_RELATIONAL_ENRICHMENT.md Section 8.5 |
| DPSIG activation_state read by any 75.x script | 75.x activation is sovereign; it must not see DPSIG activation state |
| DPSIG activation based on PSIG_HIGH count | Activation coupling — forbidden |
| DPSIG activation_state stored in signal_registry.json | signal_registry.json is PSIG sovereign; DPSIG writes to dpsig_signal_set.json only |

---

## 7. derive_relational_signals.py — Script Contract

### 7.1 Script Identity

```
Path:     scripts/pios/psee_dpsig/derive_relational_signals.py
Version:  1.0 (initial implementation)
Layer:    40.5 — signal derivation
Authority: PiOS Core (feature/pios-core branch)
```

### 7.2 Input Artifacts

| Artifact | Path Pattern | Required | Usage |
|----------|-------------|----------|-------|
| canonical_topology.json | `clients/<client>/psee/runs/<run_id>/structure/40.4/canonical_topology.json` | REQUIRED | Cluster membership, node counts — primary input for Class 4 |
| binding_envelope.json | `clients/<client>/psee/runs/<run_id>/binding/binding_envelope.json` | REQUIRED for Class 1, 5 | Node fan-in/fan-out for run-relative signals |
| structural_topology_log.json | `clients/<client>/psee/runs/<run_id>/structure/40.3/structural_topology_log.json` | REQUIRED for Class 2, 6, 7 | CONTAINS/IMPORTS edge table |
| grounding_state_v3.json | `clients/<client>/psee/runs/<run_id>/grounding/grounding_state_v3.json` | REQUIRED for Class 5 | grounded_ceu_count denominator |

For the **Class 4 first implementation** (DPSIG-031, DPSIG-032): only `canonical_topology.json` is consumed. The other artifacts are loaded and hashed for provenance but not used in computation. They must be recorded in `source_artifacts` as `UNUSED` with their sha256 hashes.

### 7.3 Output Artifacts

| Artifact | Path | Created By | Written Once |
|----------|------|-----------|-------------|
| dpsig_signal_set.json | `artifacts/psee_dpsig/<client_id>/<run_id>/dpsig_signal_set.json` | derive_relational_signals.py | YES — idempotent rewrite |

### 7.4 Execution Interface

```
python3 scripts/pios/psee_dpsig/derive_relational_signals.py \
    --client-id <client_id> \
    --run-id <run_id>
```

The script resolves artifact paths from `--client-id` and `--run-id`. It does not accept direct file path arguments — all paths are derived from the canonical client/run path pattern.

### 7.5 Execution Order Within 40.5

derive_relational_signals.py executes **in parallel** with the existing 40.5 generic pipeline. It does not call, import, or depend on:

- `compute_condition_correlation.py`
- `compute_pressure_candidates.py`
- `compute_pressure_zones.py`
- `compute_signal_projection.py`

It does not read from `vault/signal_registry.json`. The DPSIG derivation pipeline has zero awareness of 75.x outputs.

Execution ordering constraint: none. derive_relational_signals.py may run before, after, or concurrently with the 40.5 PSIG pipeline. Both pipelines read from the same 40.4 output artifacts (read-only).

### 7.6 Fail-Closed Behavior

| Failure Mode | Behavior |
|-------------|---------|
| canonical_topology.json not found | Exit with non-zero status; emit no output artifact; log: `REQUIRED_ARTIFACT_MISSING: canonical_topology.json` |
| canonical_topology.json has no `clusters` key | Exit with non-zero; log: `SCHEMA_VIOLATION: canonical_topology.json missing clusters` |
| binding_envelope.json not found (Class 1/5 signals) | Those signals emit null with reason `REQUIRED_ARTIFACT_MISSING`; Class 4 computation proceeds |
| Denominator guard fires for a signal | That signal emits null with guard reason; other signals are unaffected; execution continues |
| Any signal computation raises exception | That signal emits null with reason `DERIVATION_EXCEPTION: <exception_type>`; other signals unaffected |
| Output directory not writable | Exit with non-zero; emit no partial output |

### 7.7 Lane A Isolation Contract

The script must not contain any of the following:
- Import of any 75.x script or module
- Import of any psee_handoff module (evaluate_psee_gate.py, evaluate_enrichment_participation.py, capture_semantic_provenance.py)
- Reference to any PSEE concept: `psee_context`, `ceu_topology`, `structural_overlap`, `selector_context`, `evidence_state`, `activation_authorized`, `grounding_ratio` (the last two are used only from grounding_state_v3.json for Class 5, not from gate evaluation context)
- Any code path that reads from `vault/signal_registry.json`
- Any code path that writes to `vault/signal_registry.json`
- Any awareness of `binding/psee_40_5_input.json`

The script uses only: stdlib (`json`, `hashlib`, `pathlib`, `math`, `statistics`, `argparse`, `datetime`) and constants from its own module.

### 7.8 Replay Contract

```python
# Replay contract — all of these must hold:
# 1. Given identical input artifacts, produce identical dpsig_signal_set.json signal_values
# 2. Float operations use IEEE 754 double precision — no Decimal, no round-half-up except
#    where explicitly specified in the signal formula
# 3. mean() computed as sum/count using Python sum() on a list (not statistics.fmean)
#    to ensure consistent floating-point summation order
# 4. Cluster node_count values are integers — summation is exact
# 5. Division result is stored as float64 to 4 decimal places in output JSON
```

Note on float determinism: Python's built-in `sum()` sums left-to-right in list order. Cluster lists in canonical_topology.json must be iterated in canonical order (as-read from JSON) to ensure consistent summation. Do not sort cluster lists during computation unless the sort order is specified and stable.

---

## 8. LENS Integration Model

### 8.1 Integration Point

`lens_report_generator.py` currently reads:
- `vault/signal_registry.json` (PSIG signals)
- Various semantic provenance artifacts

DPSIG integration adds a **second signal source** read at the beginning of report generation:

```python
# In lens_report_generator.py — DPSIG integration point
dpsig_path = run_dir / "artifacts" / "psee_dpsig" / client_id / run_id / "dpsig_signal_set.json"
if dpsig_path.exists():
    with open(dpsig_path) as f:
        dpsig_signal_set = json.load(f)
else:
    dpsig_signal_set = None  # DPSIG optional — report proceeds without it
```

DPSIG is **optional** in LENS — reports render correctly if dpsig_signal_set.json is absent. This maintains backward compatibility with existing LENS report generation for runs that have not yet been processed by derive_relational_signals.py.

### 8.2 Tier-1 — Executive Cluster Narrative

**Condition**: DPSIG-031 activation_state in {CLUSTER_PRESSURE_HIGH, CLUSTER_PRESSURE_ELEVATED} OR DPSIG-032 activation_state in {DOMINANT_CLUSTER, CLUSTER_ASYMMETRIC}

**Rendering**: A cluster pressure narrative block appears above the existing "Pressure Overview" section:

```html
<!-- DPSIG Tier-1 cluster narrative block -->
<div class="dpsig-cluster-narrative tier-1">
  <h3>Structural Concentration</h3>
  <p>{explainability_render for DPSIG-031}</p>
  <p>{explainability_render for DPSIG-032}</p>
  <!-- severity badge -->
  <span class="severity-badge {severity_band}">{severity_band}</span>
</div>
```

**Executive-safe constraints**:
- No formula text in Tier-1 rendering
- No DPSIG signal IDs in Tier-1 text
- No denominator/numerator values in Tier-1 text — only the final rendered statement
- No reference to PSIG values in the DPSIG narrative block
- CRITICAL severity badge is rendered only when both CPI ≥ 5.0 AND CFA ≥ 0.60

### 8.3 Tier-2 — Engineering Leadership Cluster Table

**Rendering**: A cluster breakdown table added to the "Structural Risk" section:

```
Cluster Distribution (by structural node count)
─────────────────────────────────────────────────────────────
Cluster ID  | Name         | Nodes | Share | CPI Contribution
─────────────────────────────────────────────────────────────
CLU-17      | src          | 89    | 72.4% | ← dominant
CLU-12      | generated    |  7    |  5.7% |
CLU-03      | .github      |  6    |  4.9% |
...         | ...          | ...   | ...   |
(12 singletons, listed as: 12 singleton clusters, 9.8% combined)
─────────────────────────────────────────────────────────────
CPI = 5.61  |  CFA = 0.72  |  Severity: CRITICAL
```

**Rendering constraints**:
- Table sorted by node_count descending
- Singleton clusters collapsed to a single summary row
- CPI and CFA displayed as final values (2 decimal places)
- Severity band displayed; individual thresholds not exposed

### 8.4 Tier-3 — Technical Signal Detail

**Rendering**: Full dpsig_signal_set.json signal_entries displayed in collapsible section "DPSIG Signal Trace":

- All signal entries including null signals
- derivation_trace expanded (numerator/denominator values, artifact source)
- activation_state with threshold values shown
- replay_class and normalization_scope shown
- source artifact hashes shown (TAXONOMY-03, shown as informational)

### 8.5 Cluster Heatmap Rendering Intent

For future implementation (not required in first implementation boundary):

A cluster heatmap renders each cluster as a cell with size proportional to node_count and color intensity proportional to CPI contribution (cluster_node_count / mean_non_singleton). This provides visual cluster mass distribution without requiring the user to read the table.

### 8.6 Backward Compatibility Guarantee

If `dpsig_signal_set.json` is absent:
- Tier-1 cluster narrative block is omitted entirely
- Tier-2 cluster table is omitted entirely
- Tier-3 DPSIG section is omitted entirely
- Existing LENS report content is unchanged
- No error is raised; no fallback synthetic data is substituted

This guarantee ensures that LENS reports generated before derive_relational_signals.py is available remain valid.

---

## 9. First Implementation Boundary

### 9.1 AUTHORIZED — Class 4 First Implementation

The following is the authorized scope for `PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01`:

| Authorized Item | Description |
|----------------|-------------|
| Create `scripts/pios/psee_dpsig/derive_relational_signals.py` | New script; stdlib only; no 75.x imports |
| Implement DPSIG-031 (Cluster Pressure Index) | Formula as specified in Section 4.2 |
| Implement DPSIG-032 (Cluster Fan Asymmetry) | Formula as specified in Section 4.3 |
| Write `dpsig_signal_set.json` for FastAPI run_02 | Reference run validation output |
| Validate replay identity: run twice, verify overall_verdict=IDENTICAL | Using compare_replay_runs.py or equivalent |
| Add DPSIG optional read to `lens_report_generator.py` | Per Section 8.1 integration point |
| Add Tier-1 cluster narrative block to LENS | Per Section 8.2 |
| Add Tier-2 cluster table to LENS | Per Section 8.3 |
| Add Tier-3 DPSIG signal detail to LENS | Per Section 8.4 |

### 9.2 DEFERRED — Not Part of First Implementation

The following items are explicitly deferred. They require separate stream contracts.

| Deferred Item | Reason for Deferral |
|--------------|---------------------|
| Class 1 (DPSIG-001/002) fan pressure signals | Requires binding_envelope fan-in/fan-out computation; trivial but separate contract |
| Class 2 (DPSIG-003/013) overlap density | Requires IMPORTS edges; absent in FastAPI reference run (0 IMPORTS) |
| Class 3 (DPSIG-021/022) dependency concentration | Requires Gini coefficient implementation; separate contract for float determinism verification |
| Class 5 (DPSIG-041/042) responsibility density | Requires grounding_state_v3 + binding_envelope joint computation |
| Class 6 (DPSIG-051/052) relational volatility | Class 6 partially covered by existing PSIG-006; separate normalization contract needed |
| Class 7 (DPSIG-061/062) topology saturation | Theoretical baseline requires max edge count computation; separate contract |
| Class 8 (DPSIG-071/072) escalation topology | Requires dual-load node identification using both Class 1 signals as prerequisites |
| PSIG-001/002/004/006 → DPSIG-001/002/004/006 migration | Requires explicit Lane A migration contract per normalization rules |
| Cluster heatmap visualization | Rendering enhancement; deferred until signal delivery proven |
| Multi-run relational volatility | Requires multi-run archive access; separate stream |
| DPSIG signals in signal_registry.json | signal_registry.json is PSIG sovereign; dpsig_signal_set.json is the DPSIG artifact |

### 9.3 Hard Boundaries for First Implementation

The following boundaries must be respected in the implementation stream and will be verified in the closure audit:

1. **No 75.x modification**: compute_condition_correlation.py, compute_pressure_candidates.py, compute_pressure_zones.py, compute_signal_projection.py — all untouched
2. **No signal_registry.json modification**: PSIG entries unchanged; DPSIG-031/032 do not appear in signal_registry.json
3. **No binding_envelope.json modification**: read-only input
4. **No psee_handoff import**: derive_relational_signals.py must not import any psee_handoff module
5. **No threshold inheritance**: DPSIG_CLASS4_CPI_HIGH_THRESHOLD = 5.0 is independently defined; not derived from PSIG THRESHOLD=2.0
6. **Backward-compatible LENS**: LENS reports for existing runs without dpsig_signal_set.json must render identically to pre-DPSIG reports

---

## 10. Validation Model

### 10.1 Replay Validation

**Requirement**: Run `derive_relational_signals.py` twice against the same FastAPI run_02 artifacts. Produce `dpsig_signal_set.json` for each run. Compare them.

**Expected result**: Every TAXONOMY-01 field in `signal_entries` must be bitwise-identical between the two runs. In particular:

```
signal_value:         must match to 4 decimal places
activation_state:     must match exactly
derivation_trace.*:   all fields must match exactly
explainability_render: must match exactly
denominator_guard.*:  all fields must match exactly
```

**Tool**: Use the existing `compare_replay_runs.py` framework or an equivalent comparison script. Produce a diff artifact at `artifacts/psee_dpsig/<client_id>/<run_id>/replay_diff.json` with an `overall_verdict` field.

**Pass condition**: `overall_verdict = "IDENTICAL"`

**Fail condition**: Any TAXONOMY-01 field differs → non-determinism detected → implementation fails validation.

### 10.2 Determinism Verification

**Requirement**: Verify the following properties hold for DPSIG-031 and DPSIG-032:

| Check | Verification Method |
|-------|---------------------|
| max(cluster_node_count) is stable | Assert CLU-17.node_count = 89 across two reads of canonical_topology.json |
| sum(cluster_node_count) is stable | Assert total = 123 across two reads |
| mean(non-singleton sizes) is stable | Assert mean([89,7,6,3,2,2,2]) = 15.857... across runs |
| CPI = 89/15.857 = 5.613 | Assert signal_value within 1e-10 tolerance |
| CFA = 89/123 = 0.7236 | Assert signal_value within 1e-10 tolerance |

### 10.3 Formula Validation

**Requirement**: Hand-compute DPSIG-031 and DPSIG-032 from canonical_topology.json before running the script. Record expected values. Verify script output matches expected values.

**FastAPI run_02 expected values**:

```
DPSIG-031:
  numerator:   89 (CLU-17.node_count)
  denominator: 15.857142857... (mean of [89,7,6,3,2,2,2])
  result:      5.6128... ≈ 5.6129 (float64)
  activation:  CLUSTER_PRESSURE_HIGH (5.613 >= 5.0)

DPSIG-032:
  numerator:   89 (CLU-17.node_count)
  denominator: 123 (sum of all cluster node_counts)
  result:      0.72357... ≈ 0.7236 (float64)
  activation:  DOMINANT_CLUSTER (0.7236 >= 0.60)
```

The implementation stream must verify these exact values are produced.

### 10.4 Denominator Safety

**Requirement**: Verify denominator guards fire correctly under degenerate inputs.

| Test Case | Input | Expected |
|-----------|-------|---------|
| All-singleton run | canonical_topology.json where all node_counts = 1 | DPSIG-031: signal_value=null, activation_state=NULL_TOPOLOGY, denominator_zero_flag=true |
| Single-node codebase | canonical_topology.json with 1 cluster, 1 node | DPSIG-031: signal_value=null; DPSIG-032: signal_value=1.0, activation_state=DOMINANT_CLUSTER |
| Empty clusters array | canonical_topology.json with clusters=[] | Both signals: signal_value=null, activation_state=NULL_TOPOLOGY |

### 10.5 Topology Traceability

**Requirement**: Verify that every `derivation_trace` field references a specific artifact and field.

Pass condition:
- `derivation_trace.numerator_source` = `"canonical_topology.json → clusters[cluster_id=CLU-17].node_count"`
- `derivation_trace.denominator_source` = `"canonical_topology.json → mean([CLU-17.node_count=89, CLU-12.node_count=7, ...])"` (with explicit list)
- No derivation_trace field may contain `"UNKNOWN"`, `"INFERRED"`, or `"COMPUTED"` without a specific artifact reference

### 10.6 LENS Integration Validation

**Requirement**: Run lens_report_generator.py against FastAPI run_02 with dpsig_signal_set.json present. Verify:

1. Tier-1 cluster narrative block appears in HTML output
2. "The src cluster (CLU-17) contains 89 structural nodes — 5.6x the mean non-singleton cluster size of 15.9 nodes" appears in rendered output
3. Severity badge = "CRITICAL" (both CPI and CFA in HIGH state)
4. Run lens_report_generator.py without dpsig_signal_set.json; verify no cluster narrative block appears; verify no error is raised

### 10.7 Validation Summary Table

| Check ID | Description | Pass Condition |
|----------|-------------|---------------|
| VAL-01 | Replay identity — DPSIG-031 | signal_value identical across two runs |
| VAL-02 | Replay identity — DPSIG-032 | signal_value identical across two runs |
| VAL-03 | Overall replay verdict | overall_verdict = IDENTICAL |
| VAL-04 | DPSIG-031 formula accuracy | signal_value = 5.613 (±1e-4) |
| VAL-05 | DPSIG-032 formula accuracy | signal_value = 0.7236 (±1e-4) |
| VAL-06 | DPSIG-031 activation state | CLUSTER_PRESSURE_HIGH |
| VAL-07 | DPSIG-032 activation state | DOMINANT_CLUSTER |
| VAL-08 | Denominator guard — all-singletons | DPSIG-031 signal_value = null |
| VAL-09 | Lane A isolation | No 75.x imports in derive_relational_signals.py |
| VAL-10 | signal_registry.json unchanged | No DPSIG entries added; no PSIG entries modified |
| VAL-11 | LENS backward compatibility | Report without dpsig_signal_set.json = unchanged |
| VAL-12 | LENS Tier-1 narrative | Cluster narrative block present with correct values |
| VAL-13 | LENS severity badge | CRITICAL displayed for FastAPI run_02 |
| VAL-14 | Derivation trace completeness | All traces reference specific artifacts and field paths |

All 14 checks must PASS. Any FAIL = implementation incomplete; must be resolved before the implementation stream closure.

---

## 11. Governance Verdict

### 11.1 Verdict

**PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01 is COMPLETE.**

This design stream has produced a production-grade normalized runtime contract for DPSIG signal production. The contract is sufficient for unambiguous implementation by `PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01`.

### 11.2 Design Decisions Made

| Decision | Justification |
|----------|--------------|
| Class 4 operates at structural layer (canonical_topology only) | Resolved layer gap between NODE-XXXX namespace and DOM/CE/CS namespace; structural mass concentration is a direct topology measurement requiring no cross-artifact mapping |
| CPI formula refined from architecture definition | Original formula `mean(DPSIG-001[nodes in cluster])` requires binding_envelope→canonical_topology namespace mapping that does not exist in current pipeline; structural mass formula is equivalent commercial signal with cleaner derivation |
| CPI HIGH threshold = 5.0 | Validated against FastAPI reference (CLU-17=89, mean=15.9, CPI=5.613); threshold correctly identifies dominant cluster |
| CFA HIGH threshold = 0.60 | 60% mass share = clear structural majority; validated against FastAPI (CLU-17 = 72.4% → correctly activates HIGH) |
| LENS integration is optional (graceful fallback) | Backward compatibility with existing LENS runs that pre-date DPSIG derivation |
| Float determinism via canonical list order + Python sum() | Prevents floating-point summation order variance without requiring Decimal — adequate for integer input (cluster node_counts are always integers) |

### 11.3 Authority Boundaries Confirmed Unchanged

| Boundary | Status |
|----------|--------|
| 75.x activation sovereignty | PRESERVED — no 75.x script touched by this design or implementation target |
| Lane A runtime integrity | PRESERVED — signal_registry.json, binding_envelope.json, all 75.x/41.x scripts are immutable |
| PSIG threshold governance | PRESERVED — DPSIG thresholds are independently owned |
| Semantic activation authority | BLOCKED — no semantic enrichment dependency in DPSIG-031/032 |
| Structural sovereignty | PRESERVED — all DPSIG signals derive from static topology artifacts |

### 11.4 Governing Principle

> **Cluster pressure is a deterministic structural fact. The src cluster (CLU-17) holds 89 of 123 structural nodes — 72.4% of this codebase's structural mass. That is the commercial signal. It requires no semantic authority, no activation gate, and no enrichment permission. It requires only a formula and a denominator guard.**

### 11.5 Handoff

**HANDOFF: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01**

Implementation stream must execute against this design document exactly. Any deviation from the specified formulas, schema, or validation requirements must be justified in the implementation stream's CLOSURE.md.

---

## 12. Validation

### PASS criteria — all met:

- [x] dpsig_signal_set.json schema defined (Section 2) — top-level structure, field-level TAXONOMY classification, integrity constraint
- [x] Signal entry contract defined (Section 3) — all required fields, null signal contract, stable replay identity requirements
- [x] Class 4 DPSIG-031 fully specified (Section 4.2) — exact formula, layer resolution decision, denominator guard, activation thresholds, replay expectations, explainability template, LENS rendering intent, executive examples
- [x] Class 4 DPSIG-032 fully specified (Section 4.3) — same completeness as DPSIG-031
- [x] Normalization strategy defined (Section 5) — 5 methods, authorization table, when-to-use and when-not-to-use guidance
- [x] DPSIG activation governance defined (Section 6) — independence principle, activation states, threshold governance, severity bands, prohibited behaviors
- [x] derive_relational_signals.py contract defined (Section 7) — inputs, outputs, execution interface, execution order, fail-closed behavior, Lane A isolation contract, replay contract
- [x] LENS integration model defined (Section 8) — integration point, Tier-1/2/3 rendering, backward compatibility guarantee
- [x] First implementation boundary defined (Section 9) — authorized scope, deferred items, hard boundaries
- [x] Validation model defined (Section 10) — 14 validation checks, formula validation with expected values
- [x] Governance verdict issued (Section 11) — COMPLETE; design decisions justified; handoff specified

### FAIL conditions check:

- Any 75.x modification specified? NO — Section 9.3 explicitly prohibits; derive_relational_signals.py has zero 75.x awareness
- signal_registry.json modification specified? NO — Section 7.3 confirms DPSIG writes only to dpsig_signal_set.json
- Activation coupling introduced? NO — Section 6.1 independence principle; Section 6.5 prohibited behaviors list
- Semantic authority reopened? NO — Class 4 formulas use canonical_topology.json only; no PSEE enrichment dependency
- Implementation scope ambiguous? NO — Section 9.1 authorized table is exhaustive; Section 9.2 deferred list is exhaustive
- Layer gap resolved? YES — Section 4.1 documents the resolution decision and justification

Status: **PASS**
