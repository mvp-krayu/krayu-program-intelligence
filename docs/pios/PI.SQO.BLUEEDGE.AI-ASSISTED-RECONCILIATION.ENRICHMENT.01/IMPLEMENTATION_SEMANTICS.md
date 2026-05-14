---
stream: PI.SQO.BLUEEDGE.AI-ASSISTED-RECONCILIATION.ENRICHMENT.01
type: implementation-semantics
classification: G2
primitives:
  - compile_blueedge_enriched_correspondence
  - semantic_topology_model.enriched.json
related_concepts:
  - PATH A
  - PATH B
  - Reconciliation
  - Crosswalk
  - HYDRATED
---

# Implementation Semantics — AI-Assisted Reconciliation Enrichment

**Stream:** PI.SQO.BLUEEDGE.AI-ASSISTED-RECONCILIATION.ENRICHMENT.01

---

## 1. Primitive Inventory

| # | Primitive | Module | Purpose | Reuse Status |
|---|-----------|--------|---------|--------------|
| 1 | `compile_blueedge_enriched_correspondence.js` | scripts/reconciliation/ | Compile enriched correspondence with before/after comparison | **BlueEdge-specific** (hardcoded CLIENT/RUN_ID) |
| 2 | `semantic_topology_model.enriched.json` | clients/blueedge/psee/runs/.../semantic/topology/ | Enriched semantic topology with AI-reconstructed correspondences | **BlueEdge-specific** (client semantic material) |

**Note:** This stream introduces no new reusable code primitives. The enrichment pipeline is a BlueEdge-specific data transformation that feeds into the existing reusable compiler. The compiler itself (ReconciliationCorrespondenceCompiler.js) is unchanged.

---

## 2. Input Contracts

### Enriched Semantic Topology Model
- **Schema:** Same as original `semantic_topology_model.json` (schema_version 1.0)
- **Additional fields per domain (enriched domains only):**
  - `enrichment_status`: `AI_RECONSTRUCTED` | `UNMAPPED_RETAINED`
  - `enrichment_reason`: string explaining the enrichment rationale
  - `enrichment_evidence`: string[] of supporting evidence
  - `pre_enrichment`: object with original `lineage_status`, `dominant_dom_id`, `confidence`
- **Enrichment provenance fields (file-level):**
  - `enrichment_source`: stream ID
  - `enrichment_date`: ISO date
  - `enrichment_basis`: description of enrichment approach

### All Other Inputs
Unchanged from the original compiler (see PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01/IMPLEMENTATION_SEMANTICS.md).

---

## 3. Output Contracts

### reconciliation_correspondence.enriched.v1.json
- **Path:** `artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/reconciliation_correspondence.enriched.v1.json`
- **Schema:** Same as `reconciliation_correspondence.v1.json` plus:
  - `enrichment_metadata`: object with `enrichment_source`, `enrichment_date`, `enrichment_type`, `ai_confidence_cap`, `path_a_frozen`, `compiler_unchanged`
- **Coexists** with original artifact (does not overwrite)
- **Deterministic:** same enriched inputs → same output

---

## 4. Calibration Assumptions

No new calibration assumptions introduced. The enrichment pipeline uses the same confidence thresholds as the original compiler (0.90, 0.65, 0.50).

The AI-assigned confidence values in the enriched topology model are:

| Domain | AI Confidence | Rationale |
|--------|--------------|-----------|
| DOMAIN-06 | 0.55 | Strong: explicit agentic-ai sub-module name |
| DOMAIN-07 | 0.50 | Moderate: sensor_collector.py is sensor ingestion but shared with DOMAIN-01 |
| DOMAIN-09 | 0.50 | Moderate: guards are access control but DOM is cross-cutting |
| DOMAIN-17 | 0.50 | Moderate: aftersales sub-module is explicit but DOM-09 is merged |
| DOMAIN-05 | 0.40 | Weak: dashboards serve analytics but monitoring ≠ analytics |
| DOMAIN-03 | 0.35 | Weak: fleet operations in modules but no specific module identified |
| DOMAIN-04 | 0.30 | Weakest: vertical extensions are inferred, not evidenced |
| DOMAIN-12 | 0.30 | Weakest: app root IS the platform but tautological mapping |

These values are governance decisions, not calibration parameters. They represent honest assessment of evidence strength.

---

## 5. Extension Points

| Extension | Mechanism | Current State |
|-----------|-----------|---------------|
| Enrichment as reusable pipeline | Parameterize CLIENT/RUN_ID in enrichment script | Currently hardcoded; would need ~15 lines of CLI arg parsing |
| Enrichment rule engine | Extract enrichment logic into configurable rules | Currently inline in the JSON; would need a rule definition format |
| Progressive enrichment | Re-enrich after new PATH A analysis | Currently one-shot; would need merge logic for existing enrichments |

---

## 6. Module Responsibility Map

| Module | File | Responsibility | Client-Specific? |
|--------|------|---------------|------------------|
| Enrichment compiler | `scripts/reconciliation/compile_blueedge_enriched_correspondence.js` | Compile and compare enriched vs baseline | **YES** — BlueEdge hardcoded |
| Enriched topology | `clients/blueedge/.../semantic_topology_model.enriched.json` | AI-enriched domain correspondences | **YES** — BlueEdge semantic material |
| Enriched artifact | `artifacts/sqo/blueedge/.../reconciliation_correspondence.enriched.v1.json` | Compiled enriched correspondence | **YES** — BlueEdge output |
| Original compiler | `app/.../ReconciliationCorrespondenceCompiler.js` | Unchanged deterministic compiler | NO — reusable |
