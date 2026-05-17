# Reconciliation Correspondence Analysis

> **How grounding was computed, what "4 structurally backed / 13 semantic-only" means, and where reconciliation logic exists.**

---

## 1. Reconciliation Architecture

### Runtime Components

| Component | File | Role |
|---|---|---|
| ReconciliationCorrespondenceCompiler | `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler.js` | Compiles per-domain correspondence between PATH B semantic domains and PATH A structural registries |
| ReconciliationLifecycleCompiler | `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationLifecycleCompiler.js` | Tracks reconciliation epochs, progression, lifecycle state |
| ReconciliationArtifactWriter | `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationArtifactWriter.js` | Writes reconciliation artifacts to disk |
| ReconciliationLoopOrchestrator | `app/execlens-demo/lib/lens-v2/sqo/ReconciliationLoopOrchestrator.js` | Orchestrates the full reconciliation loop compilation |
| LensReconciliationConsumptionLayer | `app/execlens-demo/lib/lens-v2/LensReconciliationConsumptionLayer.js` | Transforms SQO reconciliation artifacts into LENS-consumable shapes |
| compile_blueedge_reconciliation_loop.js | `scripts/reconciliation/compile_blueedge_reconciliation_loop.js` | CLI entry point for BlueEdge reconciliation compilation |

### Artifact Outputs

| Artifact | Path | Content |
|---|---|---|
| reconciliation_correspondence.v1.json | `artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/` | Baseline: 4 reconciled, 13 unreconciled, ratio 0.2353 |
| reconciliation_correspondence.enriched.v1.json | same | Enriched: 4 reconciled, 13 unreconciled, weighted confidence 55.3 |
| reconciliation_lifecycle.v1.json | same | Lifecycle epochs, phase assessment, progression readiness |
| reconciliation_loop_state.v1.json | same | Loop state, propagation chain, rerun chain |
| reconciliation_temporal_analytics.v1.json | same | Temporal analytics across reconciliation epochs |

---

## 2. How "4 Structurally Backed / 13 Semantic-Only" Is Determined

### Step 1: Load Inputs (all read-only)

The ReconciliationCorrespondenceCompiler loads 5 inputs:

```
semantic_topology_model.json   → PATH B: 17 semantic domains
canonical_topology.json        → PATH A: 13 structural DOM groups (via 40.4 clusters)
semantic_continuity_crosswalk  → BRIDGE: DOM-XX → DOMAIN-XX mapping
signal_registry.json           → PATH A: vault-backed signals
evidence_trace.json            → PATH A: traceability chains
```

### Step 2: Build Indexes

1. **Structural index** — maps each DOM group to its structural properties (component count, evidence refs, grounding)
2. **Crosswalk bridge** — maps each DOM-XX to its crosswalk entry (business label, lineage status, confidence)
3. **Signal index** — maps each domain to its active signals
4. **Trace index** — maps each signal to its evidence trace chain

### Step 3: Assess Confidence Per Semantic Domain

For each of the 17 semantic domains, the compiler determines a graduated confidence level:

| Level | Name | Criteria |
|---|---|---|
| 5 | STRUCTURALLY_GROUNDED | Crosswalk EXACT + signal binding + trace chain; OR crosswalk EXACT + confidence ≥ 0.90; OR crosswalk STRONG + signals + trace |
| 4 | OBSERVATIONALLY_CORROBORATED | Crosswalk STRONG + structural DOM exists |
| 3 | SEMANTICALLY_COHERENT | Crosswalk PARTIAL match OR multiple semantic sources agree |
| 2 | UPSTREAM_EVIDENCE_BOUND | Crosswalk WEAK match (fallback used, below threshold) |
| 1 | UNMAPPED | No crosswalk entry, no structural correspondence |

### Step 4: Determine Reconciliation Status

A domain is **RECONCILED** when:
- It has a crosswalk match at EXACT or STRONG confidence
- A structural DOM group exists for it
- Active signal binding or evidence trace chain is present

A domain is **UNRECONCILED** when:
- No crosswalk entry exists (UNMAPPED)
- Crosswalk match is WEAK or PARTIAL without sufficient evidence

### Step 5: Compute Grounding Ratio (in SemanticActorHydrator)

The SemanticActorHydrator at `app/execlens-demo/lib/lens-v2/SemanticActorHydrator.js` lines 142-147 computes:

```javascript
const backedDomains = domains.filter(
  (d) => d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG'
);
const semanticOnlyDomains = domains.filter(
  (d) => d.lineage_status === 'NONE' || d.lineage_status === 'WEAK'
);
```

This produces:
- `backed_count = 4` (DOMAIN-01, DOMAIN-10, DOMAIN-14, DOMAIN-16)
- `semantic_only_count = 13` (all other domains)
- `grounding_ratio = 4/17 = 0.2353`

The `deriveQualifierClass()` function then determines Q-class from this ratio:
- ratio < 0.6 → **Q-02** (Partial Grounding with Validated Semantic Continuity)

---

## 3. What Constitutes Structural Backing

A semantic domain is "structurally backed" when ALL of the following are true:

1. **Crosswalk entry exists** — a DOM-XX maps to this DOMAIN-NN via the semantic_continuity_crosswalk
2. **Crosswalk lineage is EXACT or STRONG** — confidence ≥ 0.78, based on COMP→CAP→DOMAIN derivation chain evidence
3. **Structural DOM group exists** — the DOM-XX has actual file evidence in the PATH A canonical topology

### The 4 Structurally Backed Domains

| Semantic Domain | Crosswalk Target | Structural Evidence | Lineage | Confidence |
|---|---|---|---|---|
| DOMAIN-01 Edge Data Acquisition | DOM-13 svg_agents | hasi_bridge.py, sensor_collector.py | STRONG (via COMP-73/74) | 0.95 |
| DOMAIN-10 Platform Infrastructure | DOM-04 backend_app_root | app.module.ts, main.ts | STRONG (via COMP-01/CAP-29) | 0.78 |
| DOMAIN-14 Frontend Application | DOM-10 frontend | App.tsx, index.html, main.tsx | EXACT | 0.92 |
| DOMAIN-16 Operational Engineering | DOM-11 load_tests | api-load.js, run.sh | STRONG (via COMP-88/CAP-40) | 0.93 |

### What Constitutes Semantic-Only (No Structural Backing)

A semantic domain is "semantic-only" when:
- No crosswalk entry maps to it, OR
- The crosswalk entry has WEAK or NONE lineage (confidence < 0.60), OR
- No structural DOM group corresponds to it in the PATH A topology

---

## 4. Where Reconciliation Logic Exists

### Active Runtime Code

```
app/execlens-demo/lib/lens-v2/reconciliation/
├── ReconciliationCorrespondenceCompiler.js   ← compiles per-domain correspondence
├── ReconciliationLifecycleCompiler.js        ← tracks lifecycle across epochs
├── ReconciliationArtifactWriter.js           ← writes JSON artifacts
└── index.js                                  ← barrel export

app/execlens-demo/lib/lens-v2/sqo/
├── ReconciliationLoopOrchestrator.js         ← orchestrates full loop
├── RuntimeSemanticOperationsSubstrate.js     ← runtime substrate operations
├── RuntimeQualificationProjectionCompiler.js ← qualification → projection
├── SemanticDebtEngine.js                     ← debt computation
├── SemanticDebtIndexCompiler.js              ← debt index
├── QualificationStateEngine.js               ← S-state computation
└── ContinuityAssessmentEngine.js             ← continuity assessment

app/execlens-demo/lib/lens-v2/
├── LensReconciliationConsumptionLayer.js     ← LENS consumption of reconciliation
├── SemanticActorHydrator.js                  ← grounding ratio + Q-class derivation
└── BlueEdgePayloadResolver.js                ← payload assembly (delegates to generic)

scripts/reconciliation/
├── compile_blueedge_reconciliation_loop.js   ← CLI orchestrator
├── compile_blueedge_correspondence.js        ← correspondence compilation
├── compile_blueedge_enriched_correspondence.js ← enriched correspondence
├── compile_blueedge_lifecycle.js             ← lifecycle compilation
└── compile_blueedge_debt_index.js            ← debt index compilation
```

### Governance Documents

```
docs/governance/Q02_GOVERNANCE_AMENDMENT.md              ← Q-class governance
docs/governance/q02_governance_matrix.json               ← Q-class matrix
docs/pios/vault/03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION.md ← vault page (STALE — see §5)
```

---

## 5. Vault Staleness Warning

The vault page `CROSSWALK_AND_RECONCILIATION.md` states:

> "Crosswalk reconciliation compiler | NOT IMPLEMENTED — Phase 3 territory"

This is **STALE**. The ReconciliationCorrespondenceCompiler is fully implemented and operational. The vault page predates the compiler's implementation under `PI.SQO.BLUEEDGE.RECONCILIATION-CORRESPONDENCE-COMPILER.01`.

The vault also states the graduated grounding model is "NOT IMPLEMENTED — binary only." This is also **STALE** — the 5-level graduated model (Level 1–5) is implemented in the ReconciliationCorrespondenceCompiler.

---

## 6. Reconciliation Does NOT Create Domains

The reconciliation chain is purely assessment:
- It reads semantic domains (PATH B input, already exist)
- It reads structural domains (PATH A input, already exist)
- It reads the crosswalk bridge (already exists)
- It ASSESSES the correspondence
- It PRODUCES a reconciliation artifact

At no point does reconciliation create, modify, or mutate either the semantic or structural domains. It is a governed assessment of correspondence between two independently-derived ontologies.
