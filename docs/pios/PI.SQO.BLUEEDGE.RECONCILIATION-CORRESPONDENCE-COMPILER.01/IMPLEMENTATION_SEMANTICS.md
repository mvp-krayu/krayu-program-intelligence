---
stream: PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01
type: implementation-semantics
classification: G2
primitives:
  - compileCorrespondence
  - assessConfidence
  - buildStructuralIndex
  - buildCrosswalkBridge
  - buildSignalIndex
  - buildTraceIndex
  - ReconciliationArtifactWriter
related_concepts:
  - PATH A
  - PATH B
  - Reconciliation
  - Crosswalk
  - HYDRATED
  - SQO
  - LENS v2
retroactive: true
retroactive_source: PI.PIOS.AMOPS-VAULT.IMPLEMENTATION-SEMANTICS-EXTENSION.ASSESSMENT.01
---

# Implementation Semantics — Reconciliation Correspondence Compiler

**Stream:** PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01
**Retroactive:** This artifact was produced by PI.PIOS.AMOPS-VAULT.IMPLEMENTATION-SEMANTICS-EXTENSION.ASSESSMENT.01 to address the implementation-semantic gap identified during the reconciliation generalization assessment.

---

## 1. Primitive Inventory

| # | Primitive | Module | Purpose | Reuse Status |
|---|-----------|--------|---------|--------------|
| 1 | `compileCorrespondence()` | ReconciliationCorrespondenceCompiler.js | Compile per-domain correspondence from 5 artifact types | Client-agnostic |
| 2 | `assessConfidence()` | ReconciliationCorrespondenceCompiler.js | Assign graduated L1–L5 confidence per semantic domain | Client-agnostic (calibration risk: thresholds) |
| 3 | `buildStructuralIndex()` | ReconciliationCorrespondenceCompiler.js | Index canonical topology by domain/cluster ID | Client-agnostic (dual-format: vault + 40.4) |
| 4 | `buildCrosswalkBridge()` | ReconciliationCorrespondenceCompiler.js | Index crosswalk entities by current_entity_id | Client-agnostic |
| 5 | `buildSignalIndex()` | ReconciliationCorrespondenceCompiler.js | Index signal registry by primary_domain | Client-agnostic (graceful when absent) |
| 6 | `buildTraceIndex()` | ReconciliationCorrespondenceCompiler.js | Index evidence traces by source domain/entity | Client-agnostic (graceful when absent) |
| 7 | `ReconciliationArtifactWriter` | ReconciliationArtifactWriter.js | Write/read reconciliation_correspondence.v1.json | Client-agnostic (path parameterized) |
| 8 | `CONFIDENCE_LEVELS` | ReconciliationCorrespondenceCompiler.js | 5-level confidence model constant | Universal — not per-client |
| 9 | `compile_blueedge_correspondence.js` | scripts/reconciliation/ | Standalone BlueEdge compilation orchestrator | **BlueEdge-hardcoded** (CLIENT, RUN_ID constants) |

---

## 2. Input Contracts

### semanticTopologyModel (REQUIRED)
- **Schema:** Object with `domains[]` array
- **Each domain:** `domain_id` (string), `domain_name` (string), `domain_type` (string), `cluster_id` (string), `lineage_status` (string: EXACT|STRONG|PARTIAL|WEAK|NONE), `dominant_dom_id` (string|null), `confidence` (number 0–1), `business_label` (string)
- **Source:** Manifest key `semantic_topology_model`
- **Path pattern:** `clients/<client>/psee/runs/<run>/semantic/topology/semantic_topology_model.json`

### canonicalTopology (REQUIRED)
- **Dual format:**
  - Vault format: Object with `domains[]` array. Each entry: `domain_id`, `grounding_status`, `component_ids[]`, `evidence_refs[]`
  - 40.4 format: Object with `clusters[]` array. Each entry: `cluster_id`, `name`, `node_count`, `node_ids[]`
- `buildStructuralIndex()` handles both formats transparently. Vault format indexes by `domain_id`. 40.4 format indexes by `cluster_id`.
- **Source:** Manifest key `canonical_topology` (vault) or `canonical_topology_40_4` (40.4)
- **Path pattern:** `clients/<client>/psee/runs/<run>/vault/canonical_topology.json` or `clients/<client>/psee/runs/<run>/structure/40.4/canonical_topology.json`

### semanticCrosswalk (REQUIRED)
- **Schema:** Object with `entities[]` array
- **Each entity:** `current_entity_id` (string, format DOM-XX), `match_classification` (string: EXACT|STRONG|PARTIAL|WEAK|IRRESOLVABLE), `confidence_score` (number 0–1), `lineage_status` (string), `fallback_used` (boolean), `fallback_reason` (string|null)
- **Source:** Manifest key `semantic_continuity_crosswalk`
- **Path pattern:** `clients/<client>/psee/runs/<run>/semantic/crosswalk/semantic_continuity_crosswalk.json`

### signalRegistry (OPTIONAL)
- **Schema:** Object with `signals[]` array
- **Each signal:** `signal_id` (string, format PSIG-NNN), `primary_domain` (string, format DOM-XX), `activation_state` (string: HIGH|ACTIVATED|LOW|INACTIVE), `severity` (string)
- **Graceful degradation:** When absent, signals are not considered in confidence assessment. No domain can reach L5 via the signal+trace path without this artifact.
- **Source:** Manifest key `signal_registry`

### evidenceTrace (OPTIONAL)
- **Schema:** Object with `traces[]` or `chains[]` array
- **Each trace:** `source_domain` (string) or `source_entity` (string), plus traceability chain data
- **Graceful degradation:** When absent, trace chains are not considered. No domain can reach L5 via the signal+trace path without this artifact.
- **Source:** Manifest key `evidence_trace`

---

## 3. Output Contracts

### reconciliation_correspondence.v1.json
- **Path:** `artifacts/sqo/<client>/<run>/reconciliation_correspondence.v1.json`
- **Schema:**
  ```
  {
    metadata: {
      compiler_version, compiled_at, client, run_id, stream_lineage,
      artifact_counts: { semantic_domains, structural_domains, crosswalk_entities, active_signals, trace_chains }
    },
    summary: {
      total_domains, reconciled_count, unreconciled_count, reconciliation_ratio,
      weighted_confidence_score,
      confidence_distribution: { L5, L4, L3, L2, L1 }
    },
    correspondences: [
      { domain_id, domain_name, confidence_level, confidence_score,
        reconciliation_status, structural_correspondence, crosswalk_entry, signals, evidence_chain }
    ],
    unmatched_structural: [
      { structural_id, name, status }
    ]
  }
  ```
- **Deterministic:** Same inputs always produce the same output. No randomness, no timestamps in decision logic.
- **Replay-safe:** Deleting the artifact and re-running the compiler produces an identical result (except `compiled_at` timestamp in metadata).

### reconciliation_summary (in LENS v2 payload)
- **Location:** `payload.reconciliation_summary` in GenericSemanticPayloadResolver output
- **Schema:** Same as `summary` + `correspondences` + `unmatched_structural` from the artifact
- **Lifecycle:** Ephemeral — computed per request during payload resolution

---

## 4. Calibration Assumptions

| Constant | Value | Type | Provenance | Notes |
|----------|-------|------|------------|-------|
| L5 confidence threshold | 0.90 | Calibration | Tuned against BlueEdge crosswalk confidence_score distribution | Should become configurable per-client |
| L4 confidence threshold | 0.65 | Calibration | Tuned against BlueEdge crosswalk confidence_score distribution | Should become configurable per-client |
| L3 confidence threshold | 0.50 | Calibration | Tuned against BlueEdge crosswalk confidence_score distribution | Should become configurable per-client |
| L4+ = RECONCILED cutoff | L4 | Governance | Defined in reconciliation formalization | Fixed — not per-client |
| CONFIDENCE_LEVELS definitions | 5 levels | Governance | Defined in reconciliation formalization | Fixed — not per-client |

---

## 5. Extension Points

| Extension | Mechanism | Current State | Effort to Generalize |
|-----------|-----------|---------------|---------------------|
| Confidence thresholds | Options object in `compileCorrespondence()` | Hardcoded defaults in function body | ~10 lines: extract to options parameter with defaults |
| Client/run selection | Manifest system (manifests/index.js REGISTRY) | Already parameterized | None needed |
| Topology format | `buildStructuralIndex()` dual-format detection | Already handles vault `domains[]` and 40.4 `clusters[]` | None needed |
| Signal/trace optionality | Null checks in `assessConfidence()` | Already gracefully degrades when artifacts absent | None needed |
| Compilation orchestration | CLI arguments in compile script | Currently hardcoded to BlueEdge | ~15 lines: add CLI arg parsing |

---

## 6. Module Responsibility Map

| Module | File | Responsibility | Client-Specific? |
|--------|------|---------------|------------------|
| Correspondence compiler | `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler.js` | Core compilation: input → correspondence table | NO |
| Artifact writer | `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationArtifactWriter.js` | Read/write reconciliation artifact JSON | NO |
| Barrel export | `app/execlens-demo/lib/lens-v2/reconciliation/index.js` | Module re-export | NO |
| Compile script | `scripts/reconciliation/compile_blueedge_correspondence.js` | BlueEdge-specific orchestration | **YES** — hardcoded CLIENT, RUN_ID |
| Payload integration | `app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js` (reconciliation_summary section) | Inline compilation during payload resolution | NO |
| Cockpit loader | `app/execlens-demo/lib/sqo-cockpit/SQOCockpitArtifactLoader.js` | Loads reconciliation artifact for cockpit | NO |
| Cockpit formatter | `app/execlens-demo/lib/sqo-cockpit/SQOCockpitFormatter.js` (formatReconciliationSection) | Formats reconciliation data for cockpit display | NO |
| Cockpit panel | `app/execlens-demo/components/sqo-cockpit/ReconciliationCorrespondencePanel.jsx` | UI rendering of reconciliation data | NO |
| Page route | `app/execlens-demo/pages/sqo/client/[client]/run/[run]/reconciliation.js` | Next.js route | NO |

---

## 7. Confidence Assessment Decision Tree

```
For each semantic domain:
  1. Find crosswalk entry by dominant_dom_id
  2. Find structural entry by dominant_dom_id
  3. Find signals by dominant_dom_id
  4. Find trace chains by dominant_dom_id or domain_id

  IF crosswalk.lineage_status == EXACT AND crosswalk.confidence_score >= 0.90:
    → L5 STRUCTURALLY_GROUNDED (basis: EXACT_CROSSWALK_FULL_CONFIDENCE)

  IF crosswalk.lineage_status == STRONG AND structural_entry AND has_active_signals AND has_trace_chain:
    → L5 STRUCTURALLY_GROUNDED (basis: STRONG_CROSSWALK_WITH_SIGNAL_AND_TRACE)

  IF crosswalk.lineage_status == STRONG AND structural_entry:
    → L4 OBSERVATIONALLY_CORROBORATED (basis: STRONG_CROSSWALK_WITH_STRUCTURAL)

  IF has_active_signals AND structural_entry:
    → L4 OBSERVATIONALLY_CORROBORATED (basis: SIGNAL_BINDING_WITH_STRUCTURAL)

  IF crosswalk.lineage_status == PARTIAL:
    → L3 SEMANTICALLY_COHERENT (basis: PARTIAL_CROSSWALK)

  IF structural_entry AND crosswalk.confidence_score >= 0.50:
    → L3 SEMANTICALLY_COHERENT (basis: STRUCTURAL_WITH_MODERATE_CONFIDENCE)

  IF crosswalk.lineage_status == WEAK OR crosswalk.fallback_used:
    → L2 UPSTREAM_EVIDENCE_BOUND (basis: WEAK_CROSSWALK or FALLBACK_USED)

  IF structural_entry AND crosswalk.confidence_score < 0.50:
    → L2 UPSTREAM_EVIDENCE_BOUND (basis: LOW_CONFIDENCE_STRUCTURAL)

  ELSE:
    → L1 UNMAPPED (basis: NO_STRUCTURAL_CORRESPONDENCE)
```

---

## 8. BlueEdge-Specific Dependencies (3 total)

| # | Dependency | Location | Type | Removal Effort |
|---|-----------|----------|------|---------------|
| D-01 | `const CLIENT = 'blueedge'` | compile_blueedge_correspondence.js:3 | Hardcoded constant | ~5 lines (CLI arg) |
| D-02 | `const RUN_ID = 'run_blueedge_productized_01_fixed'` | compile_blueedge_correspondence.js:4 | Hardcoded constant | ~5 lines (CLI arg) |
| D-03 | `stream_lineage: 'PI.SQO.BLUEEDGE...'` | compile_blueedge_correspondence.js (metadata) | Metadata reference | ~5 lines (parameterize) |

All in the orchestration script. Zero BlueEdge dependencies in the compiler engine, artifact writer, payload integration, cockpit, or UI.
