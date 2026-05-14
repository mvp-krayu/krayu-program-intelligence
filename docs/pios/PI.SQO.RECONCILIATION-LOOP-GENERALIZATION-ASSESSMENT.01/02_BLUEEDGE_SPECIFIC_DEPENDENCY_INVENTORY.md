# BlueEdge-Specific Dependency Inventory

**Stream:** PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01

---

## 1. Code-Level Dependencies

### HARDCODED — Must be removed for multi-client

| # | Location | Dependency | Severity |
|---|----------|-----------|----------|
| D-01 | `scripts/reconciliation/compile_blueedge_correspondence.js:23-24` | `const CLIENT = 'blueedge'` and `const RUN_ID = 'run_blueedge_productized_01_fixed'` | HIGH — script only compiles for BlueEdge |
| D-02 | `scripts/reconciliation/compile_blueedge_correspondence.js:26-32` | PATH constants constructed from BlueEdge client/run | HIGH — paths are BlueEdge-specific |
| D-03 | `ReconciliationCorrespondenceCompiler.js:372` | `compiler_version: 'PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01'` | LOW — cosmetic, but ties the artifact metadata to a BlueEdge stream |

### IMPLICIT — Works for any client but calibrated against BlueEdge

| # | Location | Dependency | Severity |
|---|----------|-----------|----------|
| D-04 | `assessConfidence():193` | Threshold `domConfidence >= 0.90` for L5 alt path | LOW — calibrated against BlueEdge crosswalk confidence scores |
| D-05 | `assessConfidence():223` | Threshold `domConfidence >= 0.65` for L4 alt path | LOW — same |
| D-06 | `assessConfidence():248` | Threshold `domConfidence >= 0.50` for L3 alt path | LOW — same |

---

## 2. Data-Level Dependencies

These are not code dependencies but are essential context: the compiler works because BlueEdge has these artifacts available.

### Artifacts the compiler consumes (exist for BlueEdge, must exist for any new client)

| Artifact | BlueEdge Source | Schema Version | Generic? |
|----------|-----------------|----------------|----------|
| `semantic_topology_model.json` | `clients/blueedge/psee/runs/.../semantic/topology/` | 1.0 | YES — schema is client-agnostic. Requires `domains[]` with `domain_id`, `lineage_status`, `dominant_dom_id`, `confidence` |
| `canonical_topology.json` | `clients/blueedge/psee/runs/.../vault/` or `.../structure/40.4/` | 1.0 | YES — but the vault version uses `domains[]` and the 40.4 version uses `clusters[]`. Compiler handles both. |
| `semantic_continuity_crosswalk.json` | `clients/blueedge/psee/runs/.../semantic/crosswalk/` | 2.0 | YES — requires `entities[]` with `current_entity_id`, `match_classification`, `confidence_score`, `lineage_status`, `fallback_used` |
| `signal_registry.json` | `clients/blueedge/psee/runs/.../vault/` | 1.0 | YES — optional. Requires `signals[]` with `primary_domain`, `activation_state` |
| `evidence_trace.json` | `clients/blueedge/psee/runs/.../vault/` | 1.0 | YES — optional. Requires `traceability_chains[]` with `signal_id`, `chain[]` |

### Artifacts the compiler produces

| Artifact | Path Pattern | Schema Version |
|----------|-------------|----------------|
| `reconciliation_correspondence.v1.json` | `artifacts/sqo/<client>/<run>/` | 1.0 |

---

## 3. Domain Model Dependencies

### BlueEdge-specific domain model facts (NOT embedded in code)

These are properties of BlueEdge's data, not code dependencies. They affect the results, not the engine.

| Fact | BlueEdge Value | Implication |
|------|----------------|-------------|
| Semantic domain count | 17 | A new client could have 5 or 50 domains. Engine is count-agnostic. |
| Structural DOM count | 13 | Varies by client. Engine is count-agnostic. |
| Crosswalk coverage | 69.2% (9/13 DOMs with business labels) | Drives confidence distribution. A client with 100% or 0% coverage produces different but valid results. |
| Signal count | 4 (3 active HIGH) | Affects L5/L4 elevation. A client with no signals still gets valid L1-L3 results. |
| HYDRATED state | S2_QUALIFIED_WITH_DEBT, Q-02 | Not consumed by the compiler. SQO state is irrelevant to correspondence compilation. |
| Reconciliation ratio | 23.5% | Output, not input. Each client will have its own ratio. |

---

## 4. Infrastructure Dependencies

| Dependency | BlueEdge Status | Generic? |
|-----------|----------------|----------|
| Client registered in manifest registry (`REGISTRY`) | YES — `blueedge` is in the allow-list | Each new client needs a registry entry |
| Client run has a manifest file | YES — `blueedge.run_blueedge_productized_01_fixed.json` | Each new client/run needs a manifest |
| SQO artifact directory exists | YES — `artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/` | Each new client/run needs this directory |
| PSEE run directory exists | YES — `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/` | Each new client needs this directory structure |

---

## 5. Summary

**Total dependencies: 6 code-level, 5 data-level, 4 infrastructure-level.**

Only 3 are actually BlueEdge-bound (D-01, D-02, D-03). The rest are schematic requirements that any client must satisfy — they are the interface contract, not BlueEdge coupling.

The compiler is architecturally clean. The orchestration layer (compile script) is the hardcoded point. The confidence thresholds are the only implicit calibration risk.
