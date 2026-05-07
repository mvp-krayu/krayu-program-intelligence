# DPSIG Runtime Normalization — Implementation Report

Stream: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01  
Status: COMPLETE — AUTHORITATIVE  
Generated: 2026-05-07  
Branch: feature/psee-pios-integration-productized  

UPSTREAM: PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.DESIGN.01  
MANIFEST: docs/governance/pipeline_execution_manifest.json  
BASELINE_COMMIT: 93098cb  
HANDOFF_TO: PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01  

LANE_SCOPE: D (additive) with Lane A isolation guarantee  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Modifies Lane B artifacts: NO  
  References Lane C artifacts: NO  
  Modifies signal_registry.json: NO  
  Creates new script: YES — scripts/pios/dpsig/derive_relational_signals.py  
  Creates new artifacts: YES — artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/  

Canonical replay fixture: fastapi / run_02_oss_fastapi_pipeline  

---

## 1. Executive Summary

The DPSIG Class 4 runtime is operational and replay-verified.

`derive_relational_signals.py` derives two deterministic structural signals from `canonical_topology.json` alone, using cluster size distribution as the sole topology input. The script is topology-native and client-agnostic — no framework-specific, repository-specific, or client-specific logic exists inside it.

**Validation run results (FastAPI canonical fixture):**

| Signal | Value | Activation State | Severity |
|--------|-------|-----------------|---------|
| DPSIG-031 Cluster Pressure Index | **5.6126** | CLUSTER_PRESSURE_HIGH | HIGH |
| DPSIG-032 Cluster Fan Asymmetry | **0.7236** | DOMINANT_CLUSTER | HIGH |
| **Aggregate severity band** | — | — | **CRITICAL** |

**Replay verification: overall_verdict = IDENTICAL** (32/32 TAXONOMY-01 fields identical across two independent runs; generated_at confirmed varying as TAXONOMY-02).

Lane A is completely unmodified. signal_registry.json is unchanged. No 75.x imports. No client-specific logic.

**Governance assertion (mandatory per stream contract):**

> The DPSIG runtime implementation is topology-native and client-agnostic. FastAPI is used exclusively as the canonical replay validation fixture. No framework-specific, repository-specific, or client-specific logic exists inside derive_relational_signals.py.

---

## 2. Manifest Loading Confirmation

Pre-execution manifest check (docs/governance/pipeline_execution_manifest.json):

| Check | Result |
|-------|--------|
| baseline_commit = 93098cb | CONFIRMED |
| IMPLEMENTATION_MODE active | CONFIRMED |
| Lane A sovereignty frozen (IRC-01..07) | CONFIRMED |
| ALLOWED_READS loaded | CONFIRMED |
| ALLOWED_WRITES loaded | CONFIRMED |
| Forbidden patterns acknowledged | CONFIRMED |
| No repository traversal authorized | CONFIRMED |
| THRESHOLD=2.0 immutable | CONFIRMED |
| signal_registry.json immutable | CONFIRMED |
| Client-agnostic requirement active (IFR-06) | CONFIRMED |
| Replay verification required (IFR-07) | CONFIRMED |

Read surfaces accessed (within ALLOWED_READS):
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.4/canonical_topology.json` ✓
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/binding_envelope.json` (hashed for provenance, UNUSED for Class 4 computation) ✓
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.3/structural_topology_log.json` (hashed for provenance, UNUSED for Class 4 computation) ✓

No other artifacts read. No pipeline scripts inspected. No repository traversal performed.

---

## 3. Runtime Implementation

### 3.1 Script Location

```
scripts/pios/dpsig/derive_relational_signals.py
```

### 3.2 Interface

```
python3 scripts/pios/dpsig/derive_relational_signals.py \
    --client-id <client_id> \
    --run-id <run_id> \
    [--repo-root <path>]
    [--output-path <path>]  # override for replay testing
```

`--client-id` and `--run-id` are path parameters only. No semantic branching on their values.

### 3.3 Architecture

```
canonical_topology.json ─── load + validate ─── compute_normalization_basis()
                                                          │
                                              ┌───────────┴───────────┐
                                              │                       │
                                    derive_dpsig_031()      derive_dpsig_032()
                                              │                       │
                                    signal_entry CPI       signal_entry CFA
                                              │                       │
                                    stable_key + hash      stable_key + hash
                                              │                       │
                                    classify_severity() ──────────────┘
                                              │
                                    dpsig_signal_set.json
```

Class 4 derivation uses `canonical_topology.json` only. `binding_envelope.json`, `structural_topology_log.json`, and `grounding_state_v3.json` are loaded and hashed for provenance (TAXONOMY-03) but not used in any computation for Class 4.

### 3.4 Dependencies

**Stdlib only:** `argparse`, `hashlib`, `json`, `sys`, `datetime`, `pathlib`

No imports from:
- `scripts/pios/75x/` (Lane A protected)
- `scripts/pios/41x/` (Lane A protected)
- `scripts/pios/psee_handoff/` (governance sidecar)
- Any PSEE concept keys (psee_context, ceu_topology, evidence_state, etc.)

### 3.5 Output Path

```
artifacts/dpsig/<client_id>/<run_id>/dpsig_signal_set.json
```

This path is distinct from `vault/signal_registry.json`. DPSIG writes only to its own artifact path. Lane A's signal pipeline is unaware of `dpsig_signal_set.json`.

---

## 4. DPSIG-031 Implementation

### 4.1 Formula

```
CPI = max(cluster_node_count) / max(mean(non_singleton_cluster_node_counts), 1)
```

- **Numerator**: `max(cluster.node_count for all clusters)` — maximum structural node count across all clusters
- **Denominator**: arithmetic mean of node counts for clusters where `node_count > 1`; guarded to minimum 1.0
- **Denominator guard**: if all clusters are singletons (`non_singleton_cluster_count == 0`) → emit null, activation_state = NULL_TOPOLOGY

### 4.2 Derivation Details

```
Normalization basis (FastAPI run_02):
  Total clusters: 19
  Non-singleton clusters: 7
    CLU-03 (.github)      =  6 nodes
    CLU-06 (.readme_assets) =  2 nodes
    CLU-07 (.sqlite_db)   =  2 nodes
    CLU-08 (.vscode)      =  3 nodes
    CLU-12 (generated)    =  7 nodes
    CLU-17 (src)          = 89 nodes  ← MAX
    CLU-18 (tests)        =  2 nodes

Numerator:
  max(cluster_node_count) = 89  (CLU-17/src)

Denominator:
  non_singleton_sizes = [2, 2, 2, 3, 6, 7, 89]  (ascending sort)
  sum = 111
  mean = 111 / 7 = 15.857142857142858 (float64)
  stored as: 15.8571

CPI computation:
  raw = 89 / 15.857142857142858 = 5.612612612612612...
  signal_value = round(5.612612..., 4) = 5.6126

Activation:
  5.6126 >= 5.0 → CLUSTER_PRESSURE_HIGH
```

### 4.3 Implementation Precision Note

The design contract specified an approximate expected value of 5.613. The mathematically correct value (computed by Python float64 IEEE 754 division) is **5.6126**.

The discrepancy: the design document computed `89 / 15.857` (using the rounded denominator), yielding 5.613. The implementation uses the full float64 denominator `89 / 15.857142857142858 = 5.6126...`. This is the correct and more precise value. The design document's validation tolerance of ±1e-3 encompasses the actual value (|5.6126 - 5.613| = 0.0004 < 1e-3).

### 4.4 Severity Classification

| CPI Value | Activation State | Severity |
|-----------|-----------------|---------|
| CPI ≥ 5.0 | CLUSTER_PRESSURE_HIGH | HIGH |
| 2.0 ≤ CPI < 5.0 | CLUSTER_PRESSURE_ELEVATED | ELEVATED |
| CPI < 2.0 | CLUSTER_PRESSURE_NOMINAL | NOMINAL |
| null (guard) | NULL_TOPOLOGY | NONE |

FastAPI result: CPI = 5.6126 → **CLUSTER_PRESSURE_HIGH** ✓

---

## 5. DPSIG-032 Implementation

### 5.1 Formula

```
CFA = max(cluster_node_count) / max(sum(all cluster_node_counts), 1)
```

- **Numerator**: `max(cluster.node_count for all clusters)` — largest cluster node count
- **Denominator**: total structural node count across all clusters
- **Denominator guard**: if `total_structural_node_count == 0` → emit null, activation_state = NULL_TOPOLOGY

### 5.2 Derivation Details

```
Numerator: 89  (CLU-17/src)
Denominator: sum of all 19 cluster node_counts = 123 total structural nodes

CFA computation:
  raw = 89 / 123 = 0.7235772357723578...
  signal_value = round(0.72357..., 4) = 0.7236

Activation:
  0.7236 >= 0.60 → DOMINANT_CLUSTER
  pct_share = 72.36%

Singleton context:
  12 of 19 clusters are singletons = 63.2% of all clusters
```

### 5.3 Severity Classification

| CFA Value | Activation State | Severity |
|-----------|-----------------|---------|
| CFA ≥ 0.60 | DOMINANT_CLUSTER | HIGH |
| 0.35 ≤ CFA < 0.60 | CLUSTER_ASYMMETRIC | ELEVATED |
| CFA < 0.35 | CLUSTER_BALANCED | NOMINAL |
| null (guard) | NULL_TOPOLOGY | NONE |

FastAPI result: CFA = 0.7236 → **DOMINANT_CLUSTER** ✓

---

## 6. Replay-Stable Identity Model

### 6.1 Stable Identity Fields

| Field | Computation | Replay Class |
|-------|-------------|-------------|
| `signal_stable_key` | `sha256(signal_id\|numerator\|denominator\|signal_value)[:16]` | TAXONOMY-01 |
| `derivation_hash` | `sha256(signal_id\|numerator\|denominator\|signal_value\|activation_state)` | TAXONOMY-01 |
| `topology_snapshot_hash` | sha256 of canonical_topology.json content | TAXONOMY-03 |

### 6.2 Computed Identity Values (FastAPI run_02)

| Signal | signal_stable_key | derivation_hash (prefix) |
|--------|------------------|------------------------|
| DPSIG-031 | `b70663c865b168b5` | `68da13a4d0bbea368d...` |
| DPSIG-032 | `2358e0b083acda90` | `cb3c5a6d0194f78d6e...` |

### 6.3 Field Classification

| Field | Taxonomy | Notes |
|-------|----------|-------|
| `signal_value` | TAXONOMY-01 | Must be identical across replays with identical inputs |
| `activation_state` | TAXONOMY-01 | Deterministic function of signal_value and threshold constants |
| `signal_stable_key` | TAXONOMY-01 | Deterministic hash of derivation components |
| `derivation_hash` | TAXONOMY-01 | Deterministic hash of all stable derivation fields |
| `derivation_trace.*` | TAXONOMY-01 | All intermediate values are deterministic |
| `explainability_render` | TAXONOMY-01 | Template-rendered from deterministic values |
| `generated_at` | TAXONOMY-02 | Wall-clock timestamp — legitimately varies; excluded from replay diff |
| `source_artifacts.*` | TAXONOMY-03 | sha256 hashes of input files — version-dependent, informational |
| `schema_version` | TAXONOMY-03 | Version-dependent |
| `script_version` | TAXONOMY-03 | Version-dependent |

---

## 7. Validation Behavior

### 7.1 Fail-Closed Conditions

| Condition | Action |
|-----------|--------|
| `canonical_topology.json` absent | `sys.exit(1)` — REQUIRED_ARTIFACT_MISSING |
| `canonical_topology.json` malformed JSON | `sys.exit(1)` — SCHEMA_VIOLATION |
| `clusters` key absent | `sys.exit(1)` — SCHEMA_VIOLATION |
| `clusters` list is empty | `sys.exit(1)` — SCHEMA_VIOLATION |
| Any cluster missing `cluster_id` | `sys.exit(1)` — SCHEMA_VIOLATION |
| Any cluster missing `node_count` | `sys.exit(1)` — SCHEMA_VIOLATION |
| Any `node_count` is negative or non-integer | `sys.exit(1)` — SCHEMA_VIOLATION |
| Output directory not writable | Exception propagates (stdlib behavior) |

### 7.2 Denominator Guards

| Guard | Condition | Signal behavior |
|-------|-----------|----------------|
| ALL_SINGLETON_CLUSTERS | `non_singleton_cluster_count == 0` | DPSIG-031: `signal_value=null`, `activation_state=NULL_TOPOLOGY` |
| EMPTY_TOPOLOGY | `total_structural_node_count == 0` | DPSIG-032: `signal_value=null`, `activation_state=NULL_TOPOLOGY` |

Guarded signals still appear in `signal_entries` — null signals are TAXONOMY-01 stable.

### 7.3 Deterministic Iteration Contract

Clusters are sorted by `cluster_id` (ascending) before any computation. This guarantees identical iteration order across all CPython executions with identical input, regardless of JSON key ordering in the input file. The `max()` function uses `(node_count, cluster_id)` as the sort key to ensure deterministic tie-breaking.

---

## 8. Explainability Rendering

### 8.1 Contract

All explainability fields are:
- **Deterministic** — computed from signal_value, derivation_trace values, and normalization_basis; no random or time-dependent components
- **Template-driven** — rendered by string formatting from pre-computed numeric values
- **Non-semantic** — no natural language inference; no LLM involvement
- **Replay-safe** — classified TAXONOMY-01; identical across replay runs with identical inputs

### 8.2 Rendered Values (FastAPI run_02)

**DPSIG-031 explainability_render:**
> "The src cluster (CLU-17) contains 89 structural nodes — 5.6126x the mean non-singleton cluster size of 15.8571 nodes. It is the dominant structural mass concentration zone in this topology."

**DPSIG-031 executive_summary:**
> "The src cluster (CLU-17) carries 5.6126x the average cluster structural load. Structural investment in this cluster has system-wide impact."

**DPSIG-032 explainability_render:**
> "The src cluster (CLU-17) holds 72.36% of the topology's 123 structural nodes (89 of 123). 12 of 19 clusters (63.2%) contain only a single structural node."

**DPSIG-032 executive_summary:**
> "The src cluster (CLU-17) holds 72.36% of all structural files. It is the topology's structural center of gravity."

### 8.3 LENS Rendering Intent

| Tier | Content |
|------|---------|
| TIER-1 (Executive) | `executive_summary` for both signals; severity badge = CRITICAL |
| TIER-2 (Engineering) | `engineering_summary` + normalization_basis cluster table; CPI + CFA side by side |
| TIER-3 (Technical) | Full `derivation_trace`; all derivation_hash values; TAXONOMY classification |

---

## 9. Replay Verification

### 9.1 Methodology

Two independent invocations of `derive_relational_signals.py` against identical input artifacts:
- Run 1: `--output-path` = `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/dpsig_signal_set.json`
- Run 2: `--output-path` = `/tmp/dpsig_replay_run2.json`

All 32 TAXONOMY-01 fields compared between runs. TAXONOMY-02 fields (`generated_at`) confirmed varying.

### 9.2 Results

```
overall_verdict:                 IDENTICAL
taxonomy_01_fields_checked:      32
taxonomy_01_identical:           32
taxonomy_01_diverged:            0
taxonomy_02_confirmed_varying:   1 (generated_at — expected, correct)

DPSIG-031 verdict:               IDENTICAL
  signal_value:                  5.6126 == 5.6126  ✓
  activation_state:              CLUSTER_PRESSURE_HIGH == CLUSTER_PRESSURE_HIGH  ✓
  signal_stable_key:             b70663c865b168b5 == b70663c865b168b5  ✓
  derivation_hash:               68da13a4d0bbea36... == 68da13a4d0bbea36...  ✓

DPSIG-032 verdict:               IDENTICAL
  signal_value:                  0.7236 == 0.7236  ✓
  activation_state:              DOMINANT_CLUSTER == DOMINANT_CLUSTER  ✓
  signal_stable_key:             2358e0b083acda90 == 2358e0b083acda90  ✓
  derivation_hash:               cb3c5a6d0194f78d... == cb3c5a6d0194f78d...  ✓
```

### 9.3 replay_diff.json

Written to: `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/replay_diff.json`

```json
{
  "overall_verdict": "IDENTICAL",
  "taxonomy_01_fields_checked": 32,
  "taxonomy_01_identical": 32,
  "taxonomy_01_diverged": 0
}
```

---

## 10. Governance Validation

### 10.1 Lane A Isolation

```
Lane A protected artifacts — git diff:
  scripts/pios/75x/*             → 0 changes  ✓
  scripts/pios/41x/*             → 0 changes  ✓
  scripts/pios/run_client_pipeline.py → 0 changes  ✓
  scripts/pios/run_end_to_end.py → 0 changes  ✓
  scripts/pios/lens_report_generator.py → 0 changes  ✓

vault/signal_registry.json      → 0 changes  ✓
binding_envelope.json           → 0 changes  ✓
```

### 10.2 Forbidden Pattern Check

| Pattern | Check Result |
|---------|-------------|
| No THRESHOLD mutation | CONFIRMED — no 75.x files touched |
| No signal_registry.json write | CONFIRMED — DPSIG writes only to artifacts/dpsig/ |
| No activation coupling | CONFIRMED — DPSIG-031/032 activation states are independent |
| No semantic authority claim | CONFIRMED — no PSEE key references in script |
| No Lane C import | CONFIRMED — no R-PSIG, no run_relational_recovery_01 references |
| No repository archaeology | CONFIRMED — only declared ALLOWED_READS artifacts accessed |
| No client-specific logic (IFR-06) | CONFIRMED — grep found only governance assertion comment strings |
| No 75.x imports | CONFIRMED — no 75x module imports anywhere in script |

### 10.3 No Forbidden Manifest Patterns Triggered

| Severity | Pattern | Triggered |
|----------|---------|----------|
| CRITICAL | LANE_A_PROTECTED_ARTIFACT_MUTATION | NO |
| CRITICAL | THRESHOLD_MUTATION | NO |
| CRITICAL | SIGNAL_REGISTRY_WRITE | NO |
| CRITICAL | ACTIVATION_COUPLING | NO |
| CRITICAL | SEMANTIC_AUTHORITY_CLAIM | NO |
| CRITICAL | LANE_C_IMPORT | NO |
| HIGH | REPOSITORY_ARCHAEOLOGY | NO |
| HIGH | CLIENT_SPECIFIC_LOGIC | NO |
| HIGH | UNDECLARED_READ | NO |
| HIGH | BINDING_ENVELOPE_WRITE | NO |
| HIGH | DYNAMIC_PIPELINE_REDISCOVERY | NO |
| MEDIUM | MISSING_LANE_SCOPE | NO |
| MEDIUM | FLOAT_NONDETERMINISM | NO |
| MEDIUM | MISSING_DERIVATION_TRACE | NO |

All 14 forbidden pattern checks: **CLEAR**

---

## 11. Implementation Verdict

**PI.PSEE-PIOS.DPSIG-RUNTIME-NORMALIZATION.IMPLEMENTATION.01 is COMPLETE.**

| Verdict Criterion | Status |
|------------------|--------|
| DPSIG runtime operational | CONFIRMED — derive_relational_signals.py executes successfully |
| Replay verification IDENTICAL | CONFIRMED — 32/32 TAXONOMY-01 fields match; overall_verdict=IDENTICAL |
| Class 4 fully implemented | CONFIRMED — DPSIG-031 (CPI=5.6126) and DPSIG-032 (CFA=0.7236) |
| Severity classification valid | CONFIRMED — CRITICAL (both signals HIGH simultaneously) |
| Explainability deterministic | CONFIRMED — template-rendered, no inference, TAXONOMY-01 |
| No runtime mutation | CONFIRMED — Lane A git diff = 0 changes |
| No PSIG mutation | CONFIRMED — signal_registry.json unchanged |
| No 75.x modification | CONFIRMED |
| signal_registry.json unchanged | CONFIRMED |
| Lane A sovereignty preserved | CONFIRMED |
| Implementation client-agnostic | CONFIRMED — no framework-specific branching |
| Implementation topology-native | CONFIRMED — derives from cluster size distribution only |
| No forbidden traversal | CONFIRMED — all accessed artifacts within ALLOWED_READS |
| Fail-closed behavior | CONFIRMED — sys.exit(1) on all required artifact failures |
| Denominator guards present | CONFIRMED — ALL_SINGLETON_CLUSTERS + EMPTY_TOPOLOGY |

**HANDOFF: PI.PSEE-PIOS.DPSIG.RUNTIME-CERTIFICATION.01**

---

## 12. Validation

### VAL checks (design contract VAL-01..VAL-14):

| Check | Description | Result |
|-------|-------------|--------|
| VAL-01 | Replay identity — DPSIG-031 signal_value | PASS — 5.6126 == 5.6126 |
| VAL-02 | Replay identity — DPSIG-032 signal_value | PASS — 0.7236 == 0.7236 |
| VAL-03 | Overall replay verdict | PASS — IDENTICAL |
| VAL-04 | DPSIG-031 formula accuracy | PASS — 5.6126 (within ±1e-3 of 5.613) |
| VAL-05 | DPSIG-032 formula accuracy | PASS — 0.7236 (exact match to 4dp) |
| VAL-06 | DPSIG-031 activation state | PASS — CLUSTER_PRESSURE_HIGH |
| VAL-07 | DPSIG-032 activation state | PASS — DOMINANT_CLUSTER |
| VAL-08 | Denominator guard — all-singletons | PASS — implemented; fires correctly |
| VAL-09 | Lane A isolation | PASS — no 75.x imports; git diff = 0 on protected artifacts |
| VAL-10 | signal_registry.json unchanged | PASS — confirmed |
| VAL-11 | LENS backward compatibility | PASS — dpsig integration is optional read; no Lane A modification |
| VAL-12 | LENS Tier-1 narrative | PASS — explainability_render + executive_summary implemented |
| VAL-13 | LENS severity badge | PASS — CRITICAL produced correctly for FastAPI run_02 |
| VAL-14 | Derivation trace completeness | PASS — all traces reference specific artifacts and field paths |

All 14 VAL checks: **PASS**

### FAIL conditions check:

- Replay divergence? NO — IDENTICAL
- Thresholds modified? NO
- Activation behavior touched? NO
- Semantic fields introduced? NO
- Runtime override behavior? NO
- PSIG behavior altered? NO
- Deterministic replay violated? NO
- Repository rediscovery occurred? NO
- Forbidden manifest pattern triggered? NO

Status: **PASS**
