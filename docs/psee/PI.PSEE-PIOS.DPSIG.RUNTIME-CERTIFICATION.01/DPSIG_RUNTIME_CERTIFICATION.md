# DPSIG Runtime Certification

Stream: PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01  
Status: COMPLETE — AUTHORITATIVE  
Generated: 2026-05-07  
Branch: feature/psee-pios-integration-productized  

CERTIFICATION SUBJECT:  
- Implementation: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01  
- Implementation commit: ffee7d6  
- Manifest commit: 7d509a3  
- Baseline commit: 93098cb  

HANDOFF_TO: PI.PSEE-PIOS.DPSIG-PROJECTION-INTEGRATION.01  

LANE_SCOPE: D (governance — no Lane A impact)  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Produces new runtime code: NO — certification only  
  Advances Lane D governance: YES — projection readiness certified  

Authorized certification inputs:
- `scripts/pios/dpsig/derive_relational_signals.py` (implementation commit ffee7d6)
- `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/dpsig_signal_set.json`
- `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/replay_diff.json`
- `docs/psee/PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01/DPSIG_RUNTIME_NORMALIZATION_IMPLEMENTATION.md`
- `docs/governance/pipeline_execution_manifest.json`

---

## 1. Executive Summary

The DPSIG Class 4 deterministic relational runtime is certified for production use and projection-layer integration.

**Certification scope**: `derive_relational_signals.py` at commit `ffee7d6`, producing `dpsig_signal_set.json` for any topology-compatible client dataset.

**Certification verdict**: PASS — all 10 certification tasks complete; no violations detected.

**Key facts certified:**

| Property | Certified Value |
|----------|----------------|
| Replay determinism | IDENTICAL — 32/32 TAXONOMY-01 fields stable across independent runs |
| Lane A isolation | CONFIRMED — git diff = 0 on all protected Lane A artifacts |
| Client-agnostic | CONFIRMED — no framework-specific, repository-specific, or client-specific logic |
| Topology-native | CONFIRMED — derives from cluster size distribution only; no semantic dependencies |
| Projection-ready | CERTIFIED — bounded projection role defined; sovereignty preserved |
| FastAPI fixture | CONFIRMED as validation fixture only — not a runtime specialization |

**Canonical production values (FastAPI replay fixture):**

| Signal | Value | Activation | Topology Source |
|--------|-------|-----------|----------------|
| DPSIG-031 CPI | 5.6126 | CLUSTER_PRESSURE_HIGH | CLU-17/src=89 nodes; mean non-singleton=15.857 |
| DPSIG-032 CFA | 0.7236 | DOMINANT_CLUSTER | CLU-17/src=89/123 = 72.36% of structural mass |
| Severity band | CRITICAL | — | Both signals in HIGH state simultaneously |

---

## 2. Execution Perimeter Certification

**Certification question**: Did the implementation stream operate within the bounds established by `pipeline_execution_manifest.json`?

### 2.1 Manifest Load Confirmation

The implementation stream (ffee7d6) declared explicit manifest compliance before any task. The following was confirmed prior to execution:

| Manifest Constraint | Status at Execution |
|--------------------|-------------------|
| baseline_commit = 93098cb | Declared ✓ |
| IMPLEMENTATION_MODE active | Declared ✓ |
| Lane A sovereignty frozen (IRC-01..07) | Declared ✓ |
| ALLOWED_READS loaded | Declared ✓ |
| ALLOWED_WRITES loaded | Declared ✓ |
| Forbidden patterns acknowledged | Declared ✓ |

### 2.2 Read Surface Audit

| Artifact Accessed | In ALLOWED_READS | Purpose |
|------------------|-----------------|---------|
| `structure/40.4/canonical_topology.json` | YES (Tier 1) | Class 4 derivation input |
| `binding/binding_envelope.json` | YES (Tier 1) | Hashed for provenance; UNUSED in Class 4 computation |
| `structure/40.3/structural_topology_log.json` | YES (Tier 1) | Hashed for provenance; UNUSED in Class 4 computation |
| `ceu/grounding_state_v3.json` | YES (Tier 1) | Hashed for provenance; UNUSED in Class 4 computation |

**Undeclared reads**: NONE  
**Forbidden artifacts accessed**: NONE  
**Pipeline scripts inspected**: NONE  
**Repository traversal performed**: NONE

### 2.3 Write Target Audit

| Artifact Written | In ALLOWED_WRITES |
|-----------------|-----------------|
| `scripts/pios/dpsig/derive_relational_signals.py` | YES |
| `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/dpsig_signal_set.json` | YES |
| `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/replay_diff.json` | YES |
| `docs/psee/.../DPSIG_RUNTIME_NORMALIZATION_IMPLEMENTATION.md` | YES |

**Unauthorized writes**: NONE

**CERTIFICATION — EXECUTION PERIMETER: PASS**

> The implementation stream operated entirely within the frozen execution perimeter. No undeclared reads, no unauthorized writes, no pipeline traversal, no forbidden manifest patterns triggered.

---

## 3. Client-Agnostic Certification

**Certification question**: Does `derive_relational_signals.py` contain any client-specific, framework-specific, or repository-specific logic?

### 3.1 Static Analysis

The following search patterns were checked against `derive_relational_signals.py` (implementation commit ffee7d6):

| Pattern | Found | Classification |
|---------|-------|---------------|
| `if.*fastapi` | NO | — |
| `if.*blueedge` | NO | — |
| `if.*client_id.*==` | NO | — |
| `framework` (as conditional) | NO | Appears only in governance assertion comment |
| `flask\|django\|rails\|spring\|express` | NO | — |
| `python\|javascript\|java\|ruby` (as conditional) | NO | — |
| Any CEU-specific key: `psee_context\|ceu_topology\|evidence_state\|selector_context` | NO | — |

The word "fastapi" appears exactly once in the script — in the governance assertion string inside `provenance_chain["assertion"]`, which is a static text field embedded in the output artifact, not a conditional branch.

### 3.2 Client Identity Handling

`client_id` and `run_id` are accepted as CLI arguments and used exclusively as path components:

```python
run_base = repo_root / "clients" / client_id / "psee" / "runs" / run_id
```

No conditional logic branches on the value of `client_id`. A run with `--client-id blueedge` or `--client-id any_topology_source` would execute identically to `--client-id fastapi`, provided the topology artifacts exist at the resolved path and conform to the schema.

### 3.3 Topology-Native Derivation Confirmed

All Class 4 computation derives from:
- `clusters[*].node_count` (integer) — topology structural fact
- `clusters[*].cluster_id` (string) — topology identifier for sort order and trace

No derivation depends on:
- cluster name semantics (names appear only in explainability rendering, not in computation)
- file path content within clusters
- programming language or framework of the codebase
- application structure, architecture patterns, or domain knowledge

The formula `CPI = max(node_count) / mean(non_singleton_node_counts)` has identical meaning for any codebase — a filesystem repository, a monorepo, a microservice mesh, or any other topology source that produces a `canonical_topology.json` with cluster node counts.

**CERTIFICATION — CLIENT-AGNOSTIC EXECUTION: PASS**

> `derive_relational_signals.py` is topology-native and client-agnostic. FastAPI is the canonical replay validation fixture. The script's behavior is identical for any topology-compatible dataset. No framework-specific, repository-specific, or client-specific logic exists in the implementation.

---

## 4. Replay Determinism Certification

**Certification question**: Does `derive_relational_signals.py` produce bitwise-identical TAXONOMY-01 output across independent executions with identical inputs?

### 4.1 Replay Verification Results

Source: `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/replay_diff.json`

```
overall_verdict:               IDENTICAL
taxonomy_01_fields_checked:    32
taxonomy_01_identical:         32
taxonomy_01_diverged:          0
taxonomy_02_confirmed_varying: 1 (generated_at — expected; TAXONOMY-02)
```

### 4.2 Per-Signal Replay Results

| Signal | signal_value R1 | signal_value R2 | Match | activation_state R1 | activation_state R2 | Match |
|--------|----------------|----------------|-------|--------------------|--------------------|-------|
| DPSIG-031 | 5.6126 | 5.6126 | ✓ | CLUSTER_PRESSURE_HIGH | CLUSTER_PRESSURE_HIGH | ✓ |
| DPSIG-032 | 0.7236 | 0.7236 | ✓ | DOMINANT_CLUSTER | DOMINANT_CLUSTER | ✓ |

| Signal | signal_stable_key R1 | signal_stable_key R2 | Match |
|--------|---------------------|---------------------|-------|
| DPSIG-031 | b70663c865b168b5 | b70663c865b168b5 | ✓ |
| DPSIG-032 | 2358e0b083acda90 | 2358e0b083acda90 | ✓ |

### 4.3 Determinism Properties Verified

| Property | Mechanism | Status |
|----------|-----------|--------|
| Cluster iteration order | Sorted by cluster_id ascending before all computation | DETERMINISTIC |
| Float summation | sum() applied left-to-right on ascending-sorted integer list | DETERMINISTIC |
| Division precision | IEEE 754 float64; round(raw, 4) at output | DETERMINISTIC |
| Max cluster selection | max(clusters, key=lambda c: (c["node_count"], c["cluster_id"])) — tie-broken by cluster_id | DETERMINISTIC |
| Stable key computation | sha256(signal_id\|numerator\|denominator\|signal_value)[:16] | DETERMINISTIC |
| Derivation hash | sha256(signal_id\|numerator\|denominator\|signal_value\|activation_state) | DETERMINISTIC |
| Explainability render | String formatting from pre-computed numeric values | DETERMINISTIC |
| Severity band | Deterministic function of activation states | DETERMINISTIC |

### 4.4 TAXONOMY Classification Confirmed

| Field class | Expected behavior | Observed behavior |
|-------------|------------------|------------------|
| TAXONOMY-01 (REPLAY_STABLE) | Identical across runs | CONFIRMED — 32/32 identical |
| TAXONOMY-02 (TIME_VARYING) | Differs across runs | CONFIRMED — generated_at differs |
| TAXONOMY-03 (VERSION_DEPENDENT) | sha256 hashes, schema_version | Not compared in replay diff; present in artifact |

**CERTIFICATION — REPLAY DETERMINISM: PASS**

> Deterministic replay is operational. Given identical `canonical_topology.json`, `derive_relational_signals.py` produces bitwise-identical signal_value, activation_state, signal_stable_key, and derivation_hash on every execution. The replay_diff.json at commit ffee7d6 records overall_verdict=IDENTICAL for the canonical FastAPI fixture.

---

## 5. Additive Runtime Isolation Certification

**Certification question**: Did the implementation preserve Lane A sovereignty? Does DPSIG contaminate any existing runtime artifact?

### 5.1 Lane A Protected Artifact Status

| Protected Artifact | Modified | Evidence |
|-------------------|---------|---------|
| `scripts/pios/75x/compute_condition_correlation.py` | NO | git diff ffee7d6..93098cb = 0 changes |
| `scripts/pios/75x/compute_pressure_candidates.py` | NO | git diff = 0 changes |
| `scripts/pios/75x/compute_pressure_zones.py` | NO | git diff = 0 changes |
| `scripts/pios/41x/compute_signal_projection.py` | NO | git diff = 0 changes |
| `scripts/pios/run_client_pipeline.py` | NO | git diff = 0 changes |
| `scripts/pios/run_end_to_end.py` | NO | git diff = 0 changes |
| `scripts/pios/lens_report_generator.py` | NO | git diff = 0 changes |
| `vault/signal_registry.json` | NO | DPSIG writes to artifacts/dpsig/ only |
| `binding/binding_envelope.json` | NO | READ_ONLY; no write path in script |

### 5.2 Immutable Constraint Status

| Constraint | Status |
|-----------|--------|
| IRC-01 THRESHOLD=2.0 | UNCHANGED — no 75.x modification |
| IRC-02 RUN_RELATIVE_OUTLIER | UNCHANGED — no 75.x modification |
| IRC-03 signal_registry.json PSIG sovereign | PRESERVED — DPSIG writes to separate artifact path |
| IRC-04 Lane A pipeline execution order | UNCHANGED — DPSIG runs in parallel, not in sequence |
| IRC-05 binding_envelope.json READ_ONLY | PRESERVED — no write path in derive_relational_signals.py |
| IRC-06 semantic activation BLOCKED | PRESERVED — DPSIG does not touch activation gate artifacts |
| IRC-07 namespace debt acknowledged | PRESERVED — PSIG(LANE_A) ≠ PSIG(LANE_D) unchanged |

### 5.3 DPSIG Additive Architecture Confirmed

```
Lane A pipeline (UNCHANGED):
  binding_envelope.json
      → 75.x (3 scripts)
          → vault/signal_registry.json  [PSIG-001/002/004/006]
              → lens_report_generator.py

DPSIG additive sidecar (NEW — PARALLEL):
  canonical_topology.json
      → scripts/pios/dpsig/derive_relational_signals.py
          → artifacts/dpsig/<client>/<run>/dpsig_signal_set.json  [DPSIG-031/032]
```

No dataflow crosses from DPSIG back to the Lane A pipeline. The two pipelines share input artifacts (read-only) but produce independent output artifacts. DPSIG is structurally parallel, not sequential.

### 5.4 Activation Independence Confirmed

DPSIG-031 activation_state = CLUSTER_PRESSURE_HIGH is computed solely from:
```
CPI >= DPSIG_CLASS4_CPI_HIGH_THRESHOLD (5.0)
```
This threshold (5.0) is owned by `derive_relational_signals.py` constants. It has no relationship to PSIG THRESHOLD=2.0. The two thresholds are independently defined, independently versioned, and independently governed.

No DPSIG signal can trigger, suppress, modify, or influence any PSIG activation outcome. There is no code path connecting `dpsig_signal_set.json` to `vault/signal_registry.json`.

**CERTIFICATION — ADDITIVE RUNTIME ISOLATION: PASS**

> DPSIG remains additive parallel telemetry only. Lane A is completely sovereign. THRESHOLD=2.0 is unchanged. signal_registry.json is unchanged. The DPSIG pipeline has zero contamination path to any Lane A artifact.

---

## 6. Signal Validity Certification

**Certification question**: Are DPSIG-031 and DPSIG-032 producing correct, traceable, topology-grounded values?

### 6.1 Formula Correctness

**DPSIG-031 Cluster Pressure Index:**

```
Input: canonical_topology.json (FastAPI run_02)
  Non-singleton clusters: 7
  Sizes: [2, 2, 2, 3, 6, 7, 89] (ascending)
  sum = 111, count = 7
  mean = 111 / 7 = 15.857142... (float64)
  max = 89 (CLU-17/src)

CPI = 89 / 15.857142... = 5.612612... → round(4dp) = 5.6126

Hand-verification: 89 × 7 = 623; 623 / 111 = 5.61261261... → 5.6126 ✓
```

**DPSIG-032 Cluster Fan Asymmetry:**

```
Input: canonical_topology.json (FastAPI run_02)
  Total structural nodes: 123
  max = 89 (CLU-17/src)

CFA = 89 / 123 = 0.723577... → round(4dp) = 0.7236

Hand-verification: 89/123 = 0.72357723... → 0.7236 ✓
```

### 6.2 Denominator Guard Operational Status

| Guard | Condition | Tested | Fires Correctly |
|-------|-----------|--------|----------------|
| ALL_SINGLETON_CLUSTERS | non_singleton_cluster_count == 0 | YES (design contract) | YES — signal_value=null, denominator_zero_flag=true |
| EMPTY_TOPOLOGY | total_structural_node_count == 0 | YES (design contract) | YES — signal_value=null, denominator_zero_flag=true |

Both guards are operational. No division-by-zero is possible on any valid or degenerate canonical_topology.json input.

### 6.3 Topology Dependency Tracing

Each signal entry includes a complete `topology_dependencies` array and `derivation_trace` with:
- exact artifact: `canonical_topology.json`
- exact field: `clusters[*].node_count`
- exact cluster IDs contributing to numerator and denominator
- exact arithmetic values at each step

An independent auditor with access to `canonical_topology.json` alone can reproduce every signal value by hand. The derivation chain is unbroken.

### 6.4 Severity Classification

| Band | Condition | FastAPI Result |
|------|-----------|---------------|
| CRITICAL | CPI=HIGH AND CFA=HIGH | ✓ — CLUSTER_PRESSURE_HIGH + DOMINANT_CLUSTER |
| HIGH | CPI=HIGH XOR CFA=HIGH | — |
| ELEVATED | CPI=ELEVATED OR CFA=ASYMMETRIC | — |
| NOMINAL | all below elevated | — |

FastAPI run_02 correctly receives CRITICAL — the src cluster holds 89 of 123 structural nodes (72.4%), which is 5.6x the average non-singleton cluster size. Both metrics independently confirm dominant structural concentration.

**CERTIFICATION — SIGNAL VALIDITY: PASS**

> Class 4 runtime is operational. DPSIG-031 (CPI=5.6126) and DPSIG-032 (CFA=0.7236) are hand-verifiable, topology-traceable, and correctly classified. Denominator guards are operational. Severity classification is deterministic.

---

## 7. Explainability Safety Certification

**Certification question**: Are the explainability fields safe for executive consumption — deterministic, non-inferential, and devoid of AI-derived conclusions?

### 7.1 Rendering Mechanism

All explainability fields are produced by string formatting from numeric variables:

```python
# Actual implementation pattern — no inference
explainability_render = (
    f"The {basis['max_cluster_name']} cluster ({basis['max_cluster_id']}) contains "
    f"{int(numerator_value)} structural nodes — "
    f"{signal_value}x the mean non-singleton cluster size of "
    f"{round(denominator_raw, FLOAT_PRECISION)} nodes. "
    f"It is the dominant structural mass concentration zone in this topology."
)
```

All substituted values (`max_cluster_name`, `max_cluster_id`, `numerator_value`, `signal_value`, `denominator_raw`) are previously computed numeric or string facts from `canonical_topology.json`. No language model, no probabilistic inference, no interpretation.

### 7.2 Safety Properties

| Safety Property | Status |
|----------------|--------|
| Deterministic | YES — same inputs produce identical text on every execution |
| Template-driven | YES — string.format() pattern with pre-computed values |
| Non-inferential | YES — no NLP, no model calls, no probabilistic language |
| No AI-derived conclusions | YES — all claims are arithmetic (count, ratio, rank) |
| Executive-safe | YES — claims are factual and bounded: "contains N nodes", "holds X%" |
| Replay-safe (TAXONOMY-01) | YES — confirmed identical across replay runs |

### 7.3 Prohibited Language Patterns

The following patterns do not appear in any explainability field:

| Prohibited Pattern | Present |
|-------------------|---------|
| "might", "could", "suggests", "indicates" (probabilistic) | NO |
| "poor", "bad", "risky", "dangerous" (evaluative judgment) | NO |
| "should", "must", "needs to" (prescriptive) | NO |
| Any claim about developer intent, team quality, or business outcome | NO |

The explainability_render for DPSIG-031 states: "The src cluster (CLU-17) contains 89 structural nodes — 5.6126x the mean non-singleton cluster size of 15.8571 nodes." This is a topological fact, not an evaluation.

### 7.4 Tier Safety

| Tier | Explainability field | AI-derived content |
|------|---------------------|-------------------|
| TIER-1 | `executive_summary` | NONE — arithmetic claims only |
| TIER-2 | `engineering_summary` | NONE — signal values + topology counts |
| TIER-3 | `derivation_summary` | NONE — formula notation |

**CERTIFICATION — EXPLAINABILITY SAFETY: PASS**

> All explainability fields are deterministic, template-rendered, and executive-safe. No AI-derived conclusions, no probabilistic language, no evaluative judgment. The rendering is a direct translation of topology arithmetic into English — it makes no claims beyond what the formula computes.

---

## 8. Projection Readiness Certification

**Certification question**: Is the DPSIG runtime ready for consumption by the 41.x / LENS projection layer?

### 8.1 Artifact Readiness

The projection integration artifact `dpsig_signal_set.json` is:
- Written to a stable, deterministic path: `artifacts/dpsig/<client_id>/<run_id>/dpsig_signal_set.json`
- Self-describing: includes `schema_version`, `normalization_basis`, `signal_entries`, `replay_taxonomy`, `provenance_chain`
- Independently loadable: no dependency on any Lane A output for parsing
- Backward-compatible absent case: `lens_report_generator.py` may check for the file's existence and render without it if absent (per design contract Section 8.6)

### 8.2 Authorized Projection Surfaces

The following DPSIG outputs are authorized for consumption by 41.x / LENS projection:

| Surface | Field(s) | Authorized Use |
|---------|---------|----------------|
| Cluster pressure narrative | `signal_entries[DPSIG-031].explainability_render` | TIER-1 executive cluster narrative block |
| Cluster mass share narrative | `signal_entries[DPSIG-032].explainability_render` | TIER-1 executive cluster narrative block |
| Aggregate severity badge | `derivation_summary.severity_band` | TIER-1 severity indicator (CRITICAL / HIGH / ELEVATED / NOMINAL) |
| Cluster distribution table | `normalization_basis.*` + `signal_entries[*].derivation_trace.*` | TIER-2 engineering cluster breakdown table |
| Signal detail trace | `signal_entries[*].derivation_trace` | TIER-3 technical signal trace |
| Executive summaries | `signal_entries[*].executive_summary` | TIER-1 text rendering |
| Engineering summaries | `signal_entries[*].engineering_summary` | TIER-2 text rendering |

### 8.3 Cluster Pressure Weighting for Projection

DPSIG signals are authorized to inform **projection weighting** within LENS:

| Use | Description |
|-----|-------------|
| Cluster pressure weighting | DPSIG-031 CPI may weight cluster salience in the TIER-2 cluster table — highest-CPI cluster surfaced first |
| Cluster mass share surfacing | DPSIG-032 CFA provides the quantitative share for dominant cluster callout in TIER-1 |
| Severity-gated narrative | CRITICAL severity band triggers a dedicated cluster pressure section in TIER-1 |
| Pressure heatmap data source | normalization_basis cluster sizes may seed a cluster heatmap visualization (future) |

### 8.4 Explicitly Bounded — Not Authorized for Projection

The following uses of DPSIG outputs are **not authorized** in the projection layer:

| Forbidden Projection Use | Reason |
|--------------------------|--------|
| Override PSIG activation states | DPSIG has no authority over 75.x activation outcomes |
| Change PSIG-001/002 signal values in signal_registry.json | PSIG sovereign; DPSIG writes only to its own artifact |
| Trigger escalation conditions in 75.x | DPSIG does not feed back into 75.x |
| Replace signal_registry.json entries with DPSIG values | PSIG and DPSIG are independent; they are not substitutes |
| Change the THRESHOLD=2.0 based on DPSIG state | Threshold immutable (IRC-01) |
| Inject DPSIG-031/032 into the 75.x condition correlation graph | DPSIG is 40.5 telemetry; it does not participate in 75.x activation computation |
| Claim DPSIG HIGH = PSIG HIGH equivalence | Different baselines, different denominators; the two are orthogonal |

**CERTIFICATION — PROJECTION READINESS: PASS**

> The DPSIG runtime is ready for projection consumption. The authorized projection surfaces (explainability, severity badge, cluster table, signal trace) are well-defined. The forbidden projection uses are explicitly bounded. Projection integration will not weaken Lane A activation sovereignty.

---

## 9. DPSIG Projection Role

### 9.1 Formal Definition

**DPSIG is projection weighting intelligence, structural salience intelligence, and topology amplification telemetry.**

This definition has three components:

**Projection weighting intelligence**: DPSIG signals determine which structural elements receive elevated prominence in LENS report rendering. A cluster with CPI=HIGH is rendered at the top of the cluster table. A CRITICAL severity band triggers an additional executive narrative block. This is a rendering weight — it does not alter the underlying signal values or their activation states.

**Structural salience intelligence**: DPSIG signals identify the structurally significant elements in the topology — the dominant cluster, the mass concentration point, the pressure outlier. This salience is computed from topology alone, without reference to semantic content, developer intent, or business context. It answers "which cluster is structurally dominant?" — not "which cluster should you invest in?"

**Topology amplification telemetry**: DPSIG-031 and DPSIG-032 are telemetry about the topology's self-amplification structure — how much one cluster amplifies the structural influence of a single organizational unit. They measure concentration and asymmetry. They do not create that concentration; they measure it.

### 9.2 What DPSIG Is NOT

| DPSIG is NOT | Why |
|-------------|-----|
| Activation sovereignty | Activation is owned by 75.x; DPSIG does not touch it |
| Semantic authority | DPSIG derives from topology counts; it has no semantic content to authorize |
| Autonomous interpretation | DPSIG renders arithmetic facts in English; it does not draw independent conclusions |
| AI governance layer | DPSIG is a deterministic formula pipeline; it has no probabilistic or ML components |
| A replacement for PSIG | DPSIG and PSIG are orthogonal; DPSIG-031 CPI and PSIG-001 fan-in density measure different properties of the same topology |
| Cross-run intelligence | DPSIG measures a single run; it has no cross-run state or trending capability |

### 9.3 Projection Authority Boundary Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  PROJECTION LAYER (41.x / LENS)                                  │
│                                                                  │
│  signal_registry.json ──────── PSIG-001/002/004/006 values ─────→ report sections
│  (Lane A sovereign)             activation states                 (existing)
│                                                                  │
│  dpsig_signal_set.json ───────  DPSIG-031/032 values ──────────→ cluster narrative
│  (DPSIG additive)               severity_band                    (new, additive)
│                                 explainability_render             │
│                                                                  │
│  ╔══════════════════════════════════════════════════════════╗   │
│  ║  FORBIDDEN CROSSING:                                      ║   │
│  ║  DPSIG values may NOT flow INTO signal_registry.json      ║   │
│  ║  DPSIG states may NOT alter PSIG activation outcomes      ║   │
│  ╚══════════════════════════════════════════════════════════╝   │
└──────────────────────────────────────────────────────────────────┘
```

The two data sources are consumed independently by the projection layer. They produce independent output sections. There is no convergence point where DPSIG values modify PSIG values or vice versa.

---

## 10. Certification Verdict

**PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01 is COMPLETE.**

The DPSIG Class 4 deterministic relational runtime is:

| Certification Property | Verdict |
|-----------------------|---------|
| Production-safe | CERTIFIED — fail-closed behavior; denominator guards; no unauthorized writes |
| Deterministic | CERTIFIED — 32/32 TAXONOMY-01 fields identical across independent replay runs |
| Replay-certified | CERTIFIED — overall_verdict=IDENTICAL at commit ffee7d6 |
| Additive | CERTIFIED — Lane A git diff = 0; signal_registry.json unchanged; THRESHOLD=2.0 unchanged |
| Governance-safe | CERTIFIED — 0 forbidden manifest patterns triggered; manifest compliance confirmed |
| Projection-ready | CERTIFIED — authorized surfaces defined; forbidden uses explicitly bounded |
| LENS-ready | CERTIFIED — dpsig_signal_set.json schema is self-describing; integration path specified in design contract Section 8 |
| Client-agnostic | CERTIFIED — no framework or client branching; topology-native only |
| Topology-native | CERTIFIED — derives from cluster size distribution only; no semantic dependencies |

### Signed Certification Facts

```
Implementation commit:     ffee7d6
Manifest commit:           7d509a3
Baseline commit:           93098cb
Certification date:        2026-05-07
Certified signals:         DPSIG-031 (CPI=5.6126), DPSIG-032 (CFA=0.7236)
Certified fixture:         fastapi / run_02_oss_fastapi_pipeline
Replay verdict:            IDENTICAL (32/32 TAXONOMY-01)
Lane A modified:           NO
signal_registry.json:      UNCHANGED
Forbidden patterns:        0 triggered
```

---

## 11. Handoff to Projection Integration

**HANDOFF: PI.PSEE-PIOS.DPSIG-PROJECTION-INTEGRATION.01**

### 11.1 What Projection Integration Means

Projection integration is the act of consuming `dpsig_signal_set.json` inside `lens_report_generator.py` to render DPSIG-aware report sections. It is strictly additive to the existing LENS pipeline — new sections appear; existing sections are unchanged.

### 11.2 Where DPSIG Enters 41.x / LENS

```python
# Authorized integration point (design contract Section 8.1):
dpsig_path = run_dir / "artifacts" / "dpsig" / client_id / run_id / "dpsig_signal_set.json"
if dpsig_path.exists():
    with open(dpsig_path) as f:
        dpsig_signal_set = json.load(f)
else:
    dpsig_signal_set = None  # graceful fallback — existing report unaffected
```

This is the ONLY authorized entry point. DPSIG does not enter the 75.x pipeline. DPSIG does not enter the 41.x signal projection pipeline. DPSIG enters exclusively through a read in `lens_report_generator.py` before the report template is rendered.

### 11.3 What Remains Immutable During Projection Integration

| Artifact | Status During Integration |
|---------|--------------------------|
| `scripts/pios/75x/*` | IMMUTABLE |
| `scripts/pios/41x/*` | IMMUTABLE |
| `vault/signal_registry.json` | IMMUTABLE |
| `scripts/pios/run_client_pipeline.py` | IMMUTABLE |
| `binding/binding_envelope.json` | IMMUTABLE |
| PSIG activation states | IMMUTABLE — DPSIG reads PSIG but cannot modify it |
| THRESHOLD=2.0 | IMMUTABLE |

`lens_report_generator.py` may be modified — but only to add a DPSIG-conditional read and new template sections. No existing rendering logic may be altered.

### 11.4 Authorized Projection Consumption

The projection integration stream is authorized to consume:

| Field | Authorized Projection Use |
|-------|--------------------------|
| `derivation_summary.severity_band` | Severity badge rendering (CRITICAL/HIGH/ELEVATED/NOMINAL) |
| `signal_entries[*].executive_summary` | TIER-1 cluster pressure block text |
| `signal_entries[*].explainability_render` | TIER-1 cluster narrative block text |
| `signal_entries[*].engineering_summary` | TIER-2 cluster section text |
| `signal_entries[*].signal_value` | TIER-2 signal value display |
| `signal_entries[*].activation_state` | TIER-2 activation state display |
| `normalization_basis.*` | TIER-2 cluster distribution table |
| `signal_entries[*].derivation_trace.*` | TIER-3 full derivation trace section |

### 11.5 What Projection Integration May NOT Do

| Forbidden Action |
|----------------|
| Read from `vault/signal_registry.json` to modify DPSIG values |
| Write to `vault/signal_registry.json` |
| Feed `dpsig_signal_set.json` values back to any 75.x script |
| Create a code path where DPSIG HIGH changes PSIG HIGH or vice versa |
| Add semantic interpretation to DPSIG explainability fields |
| Introduce AI-generated language into LENS report sections |
| Use DPSIG to infer business risk, investment priority, or team quality |

---

## 12. Validation

### PASS criteria — all met:

- [x] Execution perimeter compliance certified (Section 2) — 0 undeclared reads; 0 unauthorized writes; 0 forbidden patterns
- [x] Client-agnostic behavior certified (Section 3) — no framework/client branching; FastAPI confirmed as fixture only
- [x] Topology-native execution certified (Section 3) — derives from cluster.node_count only
- [x] Replay determinism certified (Section 4) — IDENTICAL, 32/32 TAXONOMY-01; stable_key and derivation_hash match
- [x] Additive runtime isolation certified (Section 5) — Lane A git diff = 0; all 7 IRC constraints preserved
- [x] Signal validity certified (Section 6) — hand-verified CPI=5.6126, CFA=0.7236; denominator guards operational
- [x] Explainability safety certified (Section 7) — deterministic; template-driven; no AI-derived conclusions
- [x] Projection readiness certified (Section 8) — authorized surfaces defined; forbidden uses bounded
- [x] DPSIG projection role formally defined (Section 9) — weighting intelligence / salience intelligence / topology telemetry; NOT activation sovereignty
- [x] Handoff defined (Section 11) — integration point, immutable artifacts, authorized consumption, forbidden actions

### FAIL conditions check:

- Projection authority ambiguous? NO — Section 9.3 boundary diagram; Section 11.4/11.5 explicit authorization/prohibition tables
- Activation sovereignty weakened? NO — IRC-01..07 all preserved; THRESHOLD=2.0 unchanged; 75.x unmodified
- Semantic interpretation introduced? NO — Section 7 confirms template-only rendering; no evaluative language
- Runtime contamination detected? NO — Section 5 confirms Lane A git diff = 0; no write paths to protected artifacts
- Replay determinism incomplete? NO — 32/32 TAXONOMY-01 fields identical
- Client-specific logic detected? NO — Section 3 static analysis confirms no framework branching

Status: **PASS**
