# Binding Envelope Consumption Contract

Stream: PI.PSEE-PIOS.BINDING-ENVELOPE-CONSUMPTION-CONTRACT.01  
Status: COMPLETE  
Generated: 2026-05-06  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Modifies Lane B artifacts: NO  
  References Lane C artifacts: NO  
  Advances Lane D target: YES  

Authoritative inputs:
- LANE_GOVERNANCE_LOCK.md (3fa0ad2)
- CONSOLIDATION_RESTART_PLAN.md (5c4786e)
- NAMESPACE_DEBT_MAPPING.md (47557e2)
- signal_namespace_alias_registry.json (4b48f01)
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/binding_envelope.json`
- `scripts/pios/75x/compute_condition_correlation.py` (read and proven)
- `scripts/pios/75x/compute_pressure_candidates.py` (read and proven)
- `scripts/pios/41x/compute_signal_projection.py` (read and proven)

---

## 1. Purpose

This contract records the authoritative consumption interface for `binding/binding_envelope.json` as consumed by the Lane A active runtime. It is not a new interface design — it is a formal recording of the existing interface in use by the 75.x condition activation scripts.

The contract defines:
- which binding_envelope fields are required by the current Lane A runtime (REQUIRED)
- which fields are present but unused by the runtime (OPTIONAL / UNUSED)
- the correct architectural role of the 75.x layer
- rules governing future PSEE enrichment additions
- reserved enrichment namespaces for Lane D
- backward compatibility guarantees

This document does NOT modify any runtime artifact, script, or signal computation.

---

## 2. Current Runtime Consumption (Proven from Source)

### 2.1 Envelope Structure (Productized Baseline)

Source: `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/binding/binding_envelope.json`

Top-level keys present in the envelope:

```
artifact_id, contract_id, schema_version, generated_at, client_id, client_alias,
run_id, stream, nodes, edges, capability_surfaces, summary
```

Of these, the Lane A runtime reads exactly **three**:

```
nodes
edges
capability_surfaces
```

All other top-level keys (`artifact_id`, `contract_id`, `schema_version`, `generated_at`,
`client_id`, `client_alias`, `run_id`, `stream`, `summary`) are UNUSED by any 75.x or 41.x script.

**Productized baseline envelope counts (run_02_oss_fastapi_pipeline):**

| Array | Count |
|-------|-------|
| nodes | 29 |
| edges | 25 |
| capability_surfaces | 10 |
| — binding_context nodes | 9 |
| — component_entity nodes | 10 |
| — capability_surface nodes | 10 |

### 2.2 Consumption by Script

**S07_75X.1 — compute_condition_correlation.py** (line 42–86, proven):

```python
nodes               = binding["nodes"]              # REQUIRED
edges               = binding["edges"]              # REQUIRED
capability_surfaces = binding["capability_surfaces"] # REQUIRED
```

Sub-field access (proven from source):

| Field Path | Access Line | Usage |
|------------|-------------|-------|
| `nodes[*].node_id` | 46, 54–56, 58 | Node identity; all topology computations |
| `nodes[*].type` | 50–52 | Node classification (binding_context / component_entity / capability_surface) |
| `nodes[*].label` | 58 | Node label map for output |
| `edges[*].to_node` | 63 | Fan-in computation |
| `edges[*].from_node` | 64 | Fan-out computation |
| `capability_surfaces[*].provenance.parent_node` | 76 | CEU→surface count mapping |
| `capability_surfaces[*].parent_context` | 86 | CEU→domain mapping |

**S07_75X.2 — compute_pressure_candidates.py** (line 62–103, proven):

Reads `binding/binding_envelope.json` directly (line 356). Accesses identical field paths to compute_condition_correlation.py for independent topology recomputation. Additionally computes:
- Global signal values: `sig_val_001` = max(fan_in/mean_fan over component_node_ids)
- Global signal values: `sig_val_002` = max(fan_out/mean_fan over domain_node_ids)
- Global signal values: `sig_val_004` = max(surfaces_per_ceu/mean_surfaces over component_node_ids)

**S08_41X.1 — compute_signal_projection.py** (line 199–232, proven):

Reads `binding/binding_envelope.json` directly (line 393). Accesses:

| Field Path | Usage |
|------------|-------|
| `nodes[*].node_id` | Populating fan_in_b, fan_out_b for signal value derivation |
| `nodes[*].type` | Identifying domain_nodes vs component_nodes |
| `edges[*].from_node` | fan_out_b computation |
| `edges[*].to_node` | fan_in_b computation |
| `capability_surfaces[*].provenance.parent_node` | surfaces_per_ceu for sig_val_004 |

The 41.x layer also recomputes BFS connected components from `nodes[]` and `edges[]` to derive `sig_val_006_raw = (cluster_count - 1) / total_nodes`.

---

## 3. Canonical Field Inventory

### 3.1 REQUIRED Fields (All three scripts depend on these)

Any future `binding_envelope.json` variant — generic or PSEE-enriched — MUST contain all of the following:

| Field Path | Type | Constraint | Signal Driven |
|------------|------|------------|--------------|
| `nodes` | array | Non-empty; objects with `node_id`, `type`, `label` | PSIG-001/002/004/006 |
| `nodes[*].node_id` | string | Unique identifier; stable across pipeline stages | PSIG-001/002/004/006 |
| `nodes[*].type` | string | Must include values `"binding_context"`, `"component_entity"`, `"capability_surface"` | PSIG-001/002/004/006 |
| `nodes[*].label` | string | Human-readable label; used in output artifacts | (attribution) |
| `edges` | array | May be empty; objects with `from_node`, `to_node` | PSIG-001/002/006 |
| `edges[*].from_node` | string | Must match a `node_id` in `nodes` | PSIG-002 |
| `edges[*].to_node` | string | Must match a `node_id` in `nodes` | PSIG-001 |
| `capability_surfaces` | array | May be empty; objects with `provenance.parent_node`, `parent_context` | PSIG-004 |
| `capability_surfaces[*].provenance.parent_node` | string | Must match a `node_id` in `nodes` (a `component_entity` node) | PSIG-004 |
| `capability_surfaces[*].parent_context` | string | Must match a `node_id` in `nodes` (a `binding_context` node) | PSIG-004 |

**STABILITY GUARANTEE:** These field paths MUST remain present in any future binding_envelope variant. No field in this table may be renamed, removed, or made conditional without a formal Lane A modification contract.

### 3.2 OPTIONAL Fields (Present in envelope; not consumed by runtime)

The following fields are present in the productized binding_envelope but are NOT accessed by any 75.x or 41.x script. They may be changed, extended, or removed without affecting condition activation behavior.

| Field Path | Present | Accessed by Runtime |
|------------|---------|---------------------|
| `artifact_id` | YES | NO |
| `contract_id` | YES | NO |
| `schema_version` | YES | NO |
| `generated_at` | YES | NO |
| `client_id` | YES | NO |
| `client_alias` | YES | NO |
| `run_id` | YES | NO |
| `stream` | YES | NO |
| `summary` | YES | NO |
| `nodes[*].provenance` | YES | NO |
| `nodes[*].temporal_classification` | YES | NO |
| `edges[*].edge_id` | YES | NO |
| `edges[*].edge_type` | YES | NO |
| `edges[*].containment_level` | YES | NO |
| `edges[*].provenance` | YES | NO |
| `edges[*].temporal_classification` | YES | NO |
| `capability_surfaces[*].surface_id` | YES | NO |
| `capability_surfaces[*].label` | YES | NO |
| `capability_surfaces[*].path_pattern` | YES | NO |
| `capability_surfaces[*].provenance.*` (except `.parent_node`) | YES | NO |
| `capability_surfaces[*].temporal_classification` | YES | NO |

### 3.3 Fields Currently Driving Condition Activation

The following field paths are the precise inputs to PSIG-001/002/004/006 condition activation:

| Signal | Driving Fields | Formula |
|--------|---------------|---------|
| PSIG-001 (coupling_pressure) | `edges[*].to_node`, `nodes[*].node_id` | `fan_in[node] / mean_fan`; HIGH if ratio > 2.0 |
| PSIG-002 (export_pressure) | `edges[*].from_node`, `nodes[*].node_id` | `fan_out[node] / mean_fan`; HIGH if ratio > 2.0 |
| PSIG-004 (cluster_fragmentation) | `capability_surfaces[*].provenance.parent_node`, `nodes[*].node_id`, `nodes[*].type` | `surfaces_per_ceu / mean_surfaces`; HIGH if ratio > 2.0 |
| PSIG-006 (isolation_pressure) | `nodes[*].node_id`, `edges[*].from_node`, `edges[*].to_node` | BFS undirected; ACTIVATED if connected component size = 1 |

Where `mean_fan = round(total_edges / total_nodes, 3)` and `mean_surfaces = total_surfaces / total_ceus`.

---

## 4. 75.x Condition Activation Role

**75.x is NOT merely a signal computation layer.**

75.x is the **CONDITION ACTIVATION / THRESHOLD EVALUATION** layer. The distinction is architectural and must be maintained in all future contracts.

### 4.1 What 75.x Does

1. **Reads structural topology** from `binding_envelope.json` (the sole input to S07_75X.1)
2. **Computes structural ratios** (fan_in/mean_fan, fan_out/mean_fan, surfaces_per_ceu/mean_surfaces, BFS components) — these are the activation signals
3. **Evaluates threshold conditions** — compares each structural ratio against `THRESHOLD = 2.0`
4. **Assigns activation states** — HIGH / NORMAL / ACTIVATED / NOT — for each node for each signal
5. **Identifies pressure candidates** — nodes with activation_count ≥ 2 (S07_75X.2)
6. **Identifies pressure zones** — spatial groupings of activated nodes (S07_75X.3)

### 4.2 What 75.x Does NOT Do

- 75.x does NOT project results into executive language (that is 41.x)
- 75.x does NOT make semantic interpretations
- 75.x does NOT apply run-to-run ranking
- 75.x does NOT consume narrative or enrichment metadata
- 75.x does NOT accept precomputed signal values from external sources

### 4.3 RUN_RELATIVE_OUTLIER is a Threshold Activation Method

`RUN_RELATIVE_OUTLIER` means the activation threshold is evaluated relative to the structural distribution of the current run:

- `mean_fan = total_edges / total_nodes` — this is the run's own edge density baseline
- `mean_surfaces = total_surfaces / total_ceus` — this is the run's own surface density baseline
- A node is HIGH if its individual ratio exceeds 2× the run's own mean

This means activation states are NOT comparable across runs of different sizes. A node with fan_in=2 in a 10-node graph may be HIGH; the same node in a 1000-node dense graph may be NORMAL.

This is documented in the productized baseline as `guardrail_GR_01`.

### 4.4 Current PSIG Outputs are Condition Activation Outputs

The values in `vault/signal_registry.json` (PSIG-001=2.32, PSIG-002=6.96, PSIG-004=1.0, PSIG-006=0.138) are the **maximum structural ratios observed among all nodes** in the run. They are not absolute structural measurements — they are the peak activation intensities from the current run's condition activation pass.

41.x receives these as projection inputs and formats them for executive consumption, but it does NOT alter the activation states.

---

## 5. Additive Enrichment Rules

Future Lane D enrichment of `binding_envelope.json` is subject to the following rules, which may not be overridden except by an explicit Lane A modification contract with preservation proof.

### 5.1 Allowed

| Enrichment Type | Example | Constraint |
|----------------|---------|------------|
| New top-level fields | `"psee_context": {...}` | Must not shadow existing keys |
| New fields within nodes | `"psee_metadata": {...}` inside node objects | Must not reuse existing field names |
| New fields within edges | `"overlap_type": "..."` | Must not shadow `from_node`, `to_node`, `edge_id`, `edge_type` |
| New fields within capability_surfaces | `"evidence_anchor": {...}` | Must not shadow `provenance.parent_node`, `parent_context`, `surface_id` |
| Additional node type values | `"type": "psee_cluster"` | Must coexist with existing node types; existing logic filters by known types |
| Additional edge type values | `"edge_type": "OVERLAP_STRUCTURAL"` | Must not break existing fan-in/fan-out counting |

### 5.2 Forbidden

| Forbidden Action | Reason |
|-----------------|--------|
| Rename `nodes[*].node_id` | Breaks node identity across all 75.x/41.x computation |
| Rename `nodes[*].type` | Breaks node classification (binding_context / component_entity / capability_surface) |
| Rename `nodes[*].label` | Breaks attribution output |
| Rename `edges[*].from_node` or `to_node` | Breaks fan-in/fan-out computation |
| Rename `capability_surfaces[*].provenance.parent_node` | Breaks surfaces_per_ceu mapping |
| Rename `capability_surfaces[*].parent_context` | Breaks CEU→domain mapping |
| Change the semantics of `"binding_context"`, `"component_entity"`, `"capability_surface"` type values | Breaks node type filtering |
| Change the meaning of an edge from structural containment to logical grouping | Would alter fan-in/fan-out signals |
| Introduce mandatory PSEE-specific fields (fields that cause the runtime to fail if absent) | Violates backward compatibility guarantee |
| Inject precomputed PSIG values into the envelope for 75.x consumption | Violates condition activation architecture |

---

## 6. Reserved PSEE Enrichment Zone

The following top-level keys are RESERVED for future PSEE-specific enrichment within `binding_envelope.json`. None of these keys currently exist in the productized envelope. Their definition here establishes the namespace so that future implementation contracts have unambiguous field paths.

| Reserved Key | Purpose | Status |
|-------------|---------|--------|
| `psee_context` | Overall PSEE readiness metadata: cluster_count, grounding_ratio, readiness flag, disable_reason | RESERVED — not yet in use |
| `ceu_topology` | PSEE-specific CEU cluster membership, cross-cluster edges, cluster label assignments | RESERVED — not yet in use |
| `structural_overlap` | OVERLAP_STRUCTURAL edge data (CEU-to-CEU relational edges, distinct from containment edges) | RESERVED — not yet in use |
| `selector_context` | Selector-phase outputs: active selector, selector confidence, suppression flags | RESERVED — not yet in use |
| `evidence_state` | Evidence confidence, grounding state digest, vault_readiness reference | RESERVED — not yet in use |

**Current 75.x behavior toward these fields:** 75.x scripts do NOT iterate over all top-level keys. They access only `binding["nodes"]`, `binding["edges"]`, `binding["capability_surfaces"]` by direct key access. Unknown keys are naturally ignored at the Python dict access level. No `KeyError` is raised for unknown top-level keys.

**Future Lane D behavior:** When Lane D condition activation is authorized (pending BP-01 + BP-02), a future contract may extend 75.x to optionally read `psee_context.readiness` before deciding whether to use PSEE-enriched topology paths. This extension must be additive (a new conditional code path, not a replacement).

---

## 7. Compatibility Guarantees

### Guarantee G-01: Superset Rule

Any PSEE-enriched `binding_envelope.json` must be a strict superset of the generic schema. All REQUIRED fields from Section 3.1 must remain present, with identical field names and compatible semantics.

### Guarantee G-02: Unknown Field Tolerance

The current Lane A runtime (75.x and 41.x scripts) safely ignores any top-level or nested key it does not access. An enriched envelope containing any of the reserved PSEE enrichment keys (Section 6) will execute through the current Lane A pipeline without error or behavioral change.

**Proof:** All three scripts (`compute_condition_correlation.py`, `compute_pressure_candidates.py`, `compute_signal_projection.py`) use direct key access (`binding["nodes"]`, `binding["edges"]`, `binding["capability_surfaces"]`) and do not iterate over `binding.keys()`. Python dict access of named keys does not fail on presence of unknown keys.

### Guarantee G-03: No Mandatory PSEE Dependency

No future enrichment may introduce a PSEE-specific REQUIRED field into the generic binding_envelope schema. PSEE enrichment must remain entirely optional from the Lane A runtime's perspective.

### Guarantee G-04: Baseline Rerunability

The productized baseline (`run_02_oss_fastapi_pipeline`, commit 93098cb) must remain rerunnable through the Lane A pipeline with its current `binding_envelope.json` without modification. Any enrichment contract that breaks this guarantee constitutes a Lane A violation.

---

## 8. Future Condition Activation Boundary

### 8.1 What Future Enriched Condition Activation MAY Consume (pending BP-01 + BP-02)

When the PSIG derivation contract (Step E of the restart plan) is authorized:

| Allowable Input | Source | Purpose |
|----------------|--------|---------|
| `psee_context.readiness` | binding_envelope enriched | Gate: only consume enriched fields if `readiness = READY` |
| `psee_context.cluster_count` | binding_envelope enriched | Determine if PSEE topology is non-trivial |
| `ceu_topology.clusters` | binding_envelope enriched | PSEE-specific cluster membership for ST-035 |
| `structural_overlap[*]` | binding_envelope enriched | Cross-domain coupling edges for ST-032 |
| Sidecar: `psee_40_5_input.json` | Separate artifact | ST-030..035 values; consumed before 75.x execution |

### 8.2 What Remains Forbidden Until BP-01 + BP-02 Resolved

| Forbidden Action | Reason |
|-----------------|--------|
| Direct selector execution from within 75.x | Selector is not a runtime input to condition activation |
| Direct influence on 41.x projection output | 41.x projects from 75.x outputs; does not accept PSEE injection |
| Direct report influence | lens_report_generator.py reads from vault; PSEE enrichment must flow through vault to reach reports |
| Upstream signal injection | No precomputed PSIG values may bypass the condition activation computation |
| Precomputed PSIG values inserted into binding_envelope for 75.x to read directly | Violates the run-relative activation model — condition activation must recompute from raw topology |
| Activating Lane D PSIG derivation before BP-01 authorization | BP-01 gate is non-negotiable |
| Activating Lane D PSIG derivation before canonical_topology.cluster_count > 0 | BP-02 gate is non-negotiable |

---

## 9. Safe Next Implementation Step

**Contract:** PI.PSEE-PIOS.BINDING-ENVELOPE-ENRICHMENT-METADATA.IMPLEMENTATION.01  
**Lane scope:** A + D  
**Modifies Lane A runtime behavior:** NO  

**Scope:** Add the PSEE enrichment reserved key namespace (Section 6) as empty or placeholder fields to the PSEE-specific binding_envelope generation step. This establishes the structural hooks for future enrichment without changing any condition activation behavior.

**Why this is safe:**

1. The reserved keys (`psee_context`, `ceu_topology`, `structural_overlap`, `selector_context`, `evidence_state`) are not accessed by any current 75.x/41.x script (Guarantee G-02)
2. Their presence in the envelope does not alter fan_in, fan_out, or surfaces_per_ceu computation
3. An empty or stub enrichment field has no runtime effect
4. This step does not require BP-01 or BP-02 to be resolved

**What this step does NOT do:**

- Does not modify `compute_condition_correlation.py` or any 75.x script
- Does not activate enriched condition activation paths
- Does not change any PSIG values
- Does not require PSEE pipeline execution (BP-02)
- Does not authorize PSIG derivation (BP-01)

**Prerequisite:** This contract (PI.PSEE-PIOS.BINDING-ENVELOPE-CONSUMPTION-CONTRACT.01) must be committed and stable before the enrichment metadata step is issued.

---

## 10. Validation

PASS criteria:

- [x] Current runtime consumption proven from source (Sections 2.1, 2.2 — field access traced to line numbers in three scripts)
- [x] Canonical field inventory complete — all REQUIRED fields identified with signal association (Section 3.1)
- [x] Optional/unused fields explicitly enumerated (Section 3.2)
- [x] Fields driving each PSIG condition activation named with formula (Section 3.3)
- [x] 75.x role defined as condition activation / threshold evaluation layer — NOT reduced to "signal computation" (Section 4)
- [x] RUN_RELATIVE_OUTLIER correctly defined as a run-relative threshold activation method (Section 4.3)
- [x] PSIG outputs correctly characterized as condition activation outputs, not absolute measurements (Section 4.4)
- [x] Additive enrichment rules defined — allowed and forbidden actions enumerated (Section 5)
- [x] Reserved PSEE enrichment namespace defined with 5 reserved keys (Section 6)
- [x] Backward compatibility guaranteed (Section 7): superset rule, unknown-field tolerance, no mandatory PSEE dependency, baseline rerunability
- [x] Future condition activation boundary defined — allowed and forbidden (Section 8)
- [x] Safe next implementation step identified (Section 9)
- [x] No runtime artifacts mutated
- [x] No scripts modified
- [x] No pipeline executed
- [x] No signals recomputed

Status: PASS
