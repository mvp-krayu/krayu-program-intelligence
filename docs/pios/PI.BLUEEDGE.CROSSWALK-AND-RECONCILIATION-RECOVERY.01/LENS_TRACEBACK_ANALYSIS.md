# LENS Traceback Analysis

> **Walking backwards from executive projection to structural evidence.**

---

## 1. Starting Point: Current LENS Executive Projection

The LENS executive surface renders (for BlueEdge):

```
"4 of 17 semantic domains are structurally backed; 13 remain semantic-only"
Q-class: Q-02 (Partial Grounding with Validated Semantic Continuity)
Grounding ratio: 0.2353
Decision posture: INVESTIGATE
```

This output appears in multiple LENS zones: evidence boundary, decision surface, qualifier summary, signal interpretations.

---

## 2. Traceback Chain

### Layer 7: LENS Executive Projection

**File:** `app/execlens-demo/lib/lens-v2/generic/GenericSemanticPayloadResolver.js`

At line 321:
```
grounding_label: `${derived.backed_count} of ${derived.total_domains} structurally backed · ${derived.semantic_only_count} semantic-only`
```

**Input:** `derived` object from SemanticActorHydrator.

---

### Layer 6: SemanticActorHydrator — Grounding Derivation

**File:** `app/execlens-demo/lib/lens-v2/SemanticActorHydrator.js`

At lines 142-147:
```javascript
const backedDomains = domains.filter(
  (d) => d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG'
);
const semanticOnlyDomains = domains.filter(
  (d) => d.lineage_status === 'NONE' || d.lineage_status === 'WEAK'
);
```

At line 159:
```javascript
const qualifier = deriveQualifierClass(backedDomains.length, totalDomains, { ... });
```

**Input:** `semanticTopologyModel.domains` — the 17 semantic domains with their `lineage_status`.

**Decision logic:** `lineage_status` of EXACT or STRONG = backed. NONE or WEAK = semantic-only. Q-class from ratio.

---

### Layer 5: Semantic Topology Model — Lineage Status

**File:** `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_model.json`

Each domain carries:
```json
{
  "domain_id": "DOMAIN-01",
  "domain_name": "Edge Data Acquisition",
  "lineage_status": "EXACT",
  "dominant_dom_id": "DOM-13",
  "confidence": 0.95
}
```

**Input:** The `lineage_status` and `dominant_dom_id` fields are populated from the crosswalk. `PI.LENS.SEMANTIC-TOPOLOGY-REBUILD.02` assembled this model from the provenance recovery and crosswalk mapping.

**Key detail:** `lineage_status` and `dominant_dom_id` are crosswalk-derived fields. The domain name, domain type, and cluster_id are 41.1 semantic construction outputs. The model merges both sources.

---

### Layer 4: Semantic Continuity Crosswalk — Bridge

**File:** `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/crosswalk/semantic_continuity_crosswalk.json`

Each entity maps a structural DOM to a semantic DOMAIN:
```json
{
  "current_entity_id": "DOM-13",
  "technical_label": "svg_agents",
  "business_label": "Edge Data Acquisition",
  "historical_entity_ref": "DOMAIN-01",
  "lineage_status": "STRONG",
  "confidence_score": 0.95,
  "comp_evidence": "COMP-73 (sensor_collector.py) → CAP-01 (Vehicle Sensor Collection) → DOMAIN-01"
}
```

**Input:** The COMP→CAP→DOMAIN derivation chain from `build_semantic_layer.py`. The crosswalk was produced by `PI.CLIENT-LANGUAGE-LAYER.DOM-REDERIVATION-WITH-LINEAGE.01`, recovering business labels from the 41.1 semantic layer.

---

### Layer 3: Reconciliation Correspondence — Assessment

**File:** `artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/reconciliation_correspondence.v1.json`
**Compiler:** `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler.js`

For each of 17 semantic domains, the compiler takes:
1. The semantic domain (from `semantic_topology_model.json`)
2. The structural DOM (from `canonical_topology.json` via crosswalk)
3. Signal binding (from `signal_registry.json`)
4. Evidence trace (from `evidence_trace.json`)

And produces a graduated confidence level (1-5):
```json
{
  "semantic_domain_id": "DOMAIN-01",
  "structural_dom_id": "DOM-13",
  "confidence_level": 5,
  "confidence_label": "Structurally Grounded",
  "reconciliation_status": "RECONCILED"
}
```

**Input:** All four artifact sets — semantic topology, structural topology, crosswalk bridge, signal/trace evidence.

---

### Layer 2: Structural DOM Groups — PATH A

**File:** `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/structure/40.4/canonical_topology.json`

The 13 structural DOM groups from CEU path-prefix grouping of 35 nodes. Each cluster has:
- `cluster_id` (CLU-NN)
- `name` (technical path-derived name)
- `node_ids` (the CEU-selected structural nodes)
- `node_count`

**Input:** `structural_scanner.py` → 40.x pipeline → CEU detection → path-prefix grouping.

---

### Layer 1: Semantic Domain Construction — PATH B

**File:** `scripts/pios/41.1/build_semantic_layer.py`

The 17 semantic domains embedded as static data, derived from:
- `component_model.md` (89 COMP-NN)
- `relationship_map.md` (41 R-NNN relationships)
- `execution_paths.md` (8 EP-NN)
- `intent_inference_map.md` (IIM-NN intent declarations)

**Input:** Upstream evidence artifacts from the BlueEdge reverse engineering workspace.

---

### Layer 0: Upstream Evidence — Source of Both Paths

**Evidence sources:**
- `BlueEdge_Unified_Architecture_v3_23_0.html` — architecture artifact
- `Blue_Edge_PMO_Dashboard.html` — operational dashboard
- `BlueEdge_Competitive_Dashboard_Feb2026.html` — competitive dashboard
- `source-v3.23/extracted/platform/blueedge-platform` — source snapshot
- `app.module.ts` — NestJS module registry with session comment labels

Both PATH A (structural) and PATH B (semantic) derive from this same upstream evidence. They extract different signals using different methods.

---

## 3. Complete Traceback Diagram

```
LENS EXECUTIVE PROJECTION
  "4 of 17 structurally backed · Q-02"
         │
    GenericSemanticPayloadResolver.js
         │ reads derived.backed_count, derived.semantic_only_count
         │
    SemanticActorHydrator.js
         │ filters domains by lineage_status (EXACT/STRONG vs NONE/WEAK)
         │ derives Q-class from grounding_ratio
         │
    ┌────┴────┐
    │         │
SEMANTIC    CROSSWALK
TOPOLOGY    BRIDGE
MODEL       │
(17 DOMAIN) │ maps DOM-XX → DOMAIN-XX
    │       │ with confidence scores
    │       │
    │   semantic_continuity_crosswalk.json
    │       │
    │   ┌───┴───┐
    │   │       │
    │  DOM     COMP→CAP→DOMAIN
    │  groups  derivation chain
    │   │       │
    │   │   build_semantic_layer.py (41.1)
    │   │       │
    │   │   89 COMP → 42 CAP → 17 DOMAIN
    │   │       │
    │   │   ┌───┘
    │   │   │
    │   │   Stage 3: IIM intent extraction
    │   │   │         COMP re-enumeration
    │   │   │
    │   │   Stage 2: app.module.ts enumeration
    │   │   │         89 BM-NNN entities (40.x)
    │   │   │
    │   │   Stage 1: architecture taxonomy
    │   │             7-layer model, 16 domains
    │   │
    │   PATH A: 40.x → CEU → 35 nodes → 13 DOMs
    │   │
    │   structural_scanner.py + CEU detection
    │   │
    │   RECONCILIATION CORRESPONDENCE
    │   │ (ReconciliationCorrespondenceCompiler.js)
    │   │ reads BOTH semantic topology + structural topology
    │   │ produces graduated confidence per domain
    │   │
    └───┴───────────────────┐
                            │
                    UPSTREAM EVIDENCE
                    HTML briefs, architecture docs,
                    source snapshot, app.module.ts
```

---

## 4. Two Distinct LENS Pathways

The current LENS runtime operates on TWO distinct artifact sets through TWO distinct pathways:

### Pathway 1: Manifest-Driven Payload (Semantic + Reconciliation)

**Run:** `run_blueedge_productized_01_fixed`
**Manifest:** `app/execlens-demo/lib/lens-v2/manifests/blueedge.run_blueedge_productized_01_fixed.json`
**Loads:**
- `semantic_topology_model.json` (PATH B: 17 domains)
- `semantic_continuity_crosswalk.json` (crosswalk bridge)
- `decision_validation.json` (validation checks)
- `canonical_topology_40_4.json` (PATH A: structural clusters)
- `dpsig_signal_set.json` (DPSIG signals)
- `signal_registry.json` (vault signals)
- `evidence_trace.json` (traceability chains)

**Produces:** The full semantic payload — grounding ratio, Q-class, domain registry, signal interpretations, evidence boundary, decision posture.

### Pathway 2: Selector-Driven Vault (Structural Pipeline)

**Run:** `run_be_orchestrated_fixup_01`
**Selector:** `clients/blueedge/lens/selector/selector.json`
**Loads:**
- `vault/signal_registry.json`
- `vault/evidence_trace.json`
- `vault/binding_envelope.json`
- `vault/canonical_topology.json`
- `vault/coverage_state.json`
- `vault/gauge_state.json`
- `vault/reconstruction_state.json`
- `41.x/signal_projection.json`
- `75.x/pressure_zone_state.json`

**Produces:** The structural pipeline output — signals, pressure zones, conditions, evidence traces.

### How They Converge

The manifest for `run_blueedge_productized_01_fixed` references the structural topology from the productized run's structure directory. The selector for `run_be_orchestrated_fixup_01` drives the live PATH A pipeline output. Both feed into the LENS rendering surface, which combines:
- Semantic domain awareness (from Pathway 1)
- Structural signal computation (from Pathway 2)
- Reconciliation assessment (from the SQO artifacts)

---

## 5. Critical Finding: The Vault Page Is Stale

The vault page `CROSSWALK_AND_RECONCILIATION.md` describes the reconciliation compiler as "NOT IMPLEMENTED — Phase 3 territory" and the graduated grounding model as "NOT IMPLEMENTED — binary only."

**Both are now implemented:**
- `ReconciliationCorrespondenceCompiler.js` — operational, producing artifacts
- 5-level graduated confidence model — operational (Level 1-5)

The vault page was written before these implementations were completed under `PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01`. This constitutes a vault staleness violation per AMOps.
