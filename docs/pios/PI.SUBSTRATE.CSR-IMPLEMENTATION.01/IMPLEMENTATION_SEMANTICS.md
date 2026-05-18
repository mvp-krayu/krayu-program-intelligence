# Implementation Semantics — PI.SUBSTRATE.CSR-IMPLEMENTATION.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| extract_blueedge_csr | scripts/pios/extract_blueedge_csr.py | Mechanical CSR extraction for BlueEdge | CLIENT-SPECIFIC |
| generate_semantic_topology | scripts/pios/generate_semantic_topology.py | CSR → semantic_topology_model.json | MULTI-CLIENT |
| phase_05b_csr_semantic_topology | scripts/pios/run_client_pipeline.py | Pipeline phase: CSR detection + generation | MULTI-CLIENT |

## 2. Input Contracts

### generate_semantic_topology.py

| Input | Required | Path Pattern | Consumed Fields |
|---|---|---|---|
| CSR | YES | clients/{client}/semantic/client_semantic_registry.json | domains, capabilities, components, cluster_assignments, edges, lineage_overrides, metadata |
| Lineage | NO | clients/{client}/psee/runs/{run}/semantic/lineage/canonical_topology_with_lineage.json | domains[].semantic_lineage.{dominant_source_domain_id, lineage_status, confidence_score, zone_anchor} |
| Crosswalk | NO | clients/{client}/psee/runs/{run}/semantic/crosswalk/semantic_continuity_crosswalk.json | entities[].{dom_id, business_label} |

### extract_blueedge_csr.py

| Input | Required | Source |
|---|---|---|
| build_semantic_layer.py | YES | scripts/pios/41.1/build_semantic_layer.py — DOMAINS, CAPABILITIES, COMPONENTS dicts |
| Production topology | YES | clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_model.json |

## 3. Output Contracts

### generate_semantic_topology.py

| Output | Path | Schema |
|---|---|---|
| semantic_topology_model.json | {output_dir}/semantic_topology_model.json | schema_version 1.0, domains[], clusters[], edges[], metrics{}, dom_bindings_summary[], provenance{} |
| semantic_bundle_manifest.json | {output_dir}/../semantic_bundle_manifest.json | artifact_id, client, run_id, artifacts[], provenance{} |

### extract_blueedge_csr.py

| Output | Path | Schema |
|---|---|---|
| client_semantic_registry.json | clients/blueedge/semantic/client_semantic_registry.json | schema_version 1.0, domains[], capabilities[], components[], cluster_assignments[], edges[], lineage_overrides[], metadata{} |

## 4. Calibration Assumptions

| Constant | Value | Governed vs Tuned |
|---|---|---|
| GENERATOR_VERSION | 1.0.0 | GOVERNED — increment on behavioral change |
| GENERATOR_CONTRACT | PI.SUBSTRATE.CSR-IMPLEMENTATION.01 | GOVERNED |
| DOMAIN_TYPE_CLUSTER_FALLBACK | 5 types → CLU-01..CLU-05 | TUNED — fallback only, CSR explicit takes precedence |
| WEAK → NONE normalization | lineage_status WEAK treated as NONE | GOVERNED — WEAK at DOM level is ambiguous |

## 5. Extension Points

| Point | Description |
|---|---|
| CSR lineage_overrides | Per-client RC amendments to lineage bindings; generator applies before lineage file |
| CSR cluster_assignments | Per-client explicit cluster grouping; generator prefers over domain_type fallback |
| --output-dir flag | Generator output can be redirected for isolated validation |
| Pipeline Phase 5b skip | CSR-absent clients automatically skip to structural-only mode |

## 6. Module Responsibility Map

| File | Owns |
|---|---|
| client_semantic_registry.json | Ontology authority: domains, capabilities, components, cluster assignments, edges, lineage overrides |
| generate_semantic_topology.py | Deterministic derivation: CSR → semantic_topology_model.json |
| extract_blueedge_csr.py | One-time extraction: build_semantic_layer.py → CSR (BlueEdge-specific) |
| run_client_pipeline.py (Phase 5b) | Pipeline orchestration: CSR detection + generator invocation |
| semantic_topology_model.json | Derived projection artifact consumed by LENS resolver |
