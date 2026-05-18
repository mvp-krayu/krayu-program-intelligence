# Crosswalk and Reconciliation

> **The bridge between structural proof and semantic meaning — dual-path ontology bridge and correspondence assessment.**

---

## Scope

All specific values in this page (13 DOMs, 17 DOMAINs, 4/17 grounding ratio, DOM-09 irresolvability, crosswalk v2.0 mapping counts) are **BlueEdge reference implementation** values. The crosswalk/reconciliation architecture is substrate-general; the instantiation values are client-specific.

---

## What Crosswalk Does

SemanticCrosswalkMapper translates structural domain identifiers (DOM-XX) to semantic domain identifiers (DOMAIN-XX) using `semantic_continuity_crosswalk.json` (v2.0) as its translation table.

**Critical distinction:** The crosswalk is a **bridge translation table** between PATH A (structural topology) and PATH B (semantic topology). It is NOT a reconciliation engine. It maps structural boundaries to semantic boundaries. It does not verify correspondence — that is reconciliation's job.

### Crosswalk Structure (v2.0)

The crosswalk maps 13 structural DOMs to 17 semantic DOMAINs:

| Mapping Type | Count | Description |
|---|---|---|
| 1:1 mapped | 9 DOMs | Direct DOM-XX → DOMAIN-XX correspondence |
| IRRESOLVABLE | 1 DOM | DOM-09 (backend_modules) → 6+ semantic domains |
| UNMAPPED | 3 DOMs | No semantic domain correspondence found |

**DOM-09 irresolvability:** DOM-09 (backend_modules) is a single structural boundary covering 6 CEU nodes that correspond to 6+ semantic domains. This is permanently irresolvable in a 1:1 crosswalk model because the structural granularity is coarser than the semantic granularity at this boundary. DOM-09 is the root cause of 10/13 unreconciled semantic domains.

### Crosswalk Runtime Location

- **Translation table:** `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/crosswalk/semantic_continuity_crosswalk.json`
- **Runtime mapper:** `app/execlens-demo/lib/lens-v2/SemanticCrosswalkMapper.js`

## What Reconciliation Does

ReconciliationCorrespondenceCompiler is a **compiler** that assesses correspondence between PATH A structural claims and PATH B semantic claims. It produces a graduated confidence assessment for each semantic domain.

### Reconciliation Inputs (5)

1. `semantic_continuity_crosswalk.json` — bridge translation table
2. `semantic_topology_model.json` — PATH B semantic domain definitions
3. `canonical_topology.json` — PATH A structural topology
4. `signal_registry.json` — activation state per domain
5. `reconciliation_correspondence.v1.json` — prior correspondence state (if exists)

### Reconciliation Output

A per-domain graduated confidence level:

| Level | Name | Meaning |
|---|---|---|
| Level 1 | UNMAPPED | No crosswalk entry exists for this domain |
| Level 2 | MAPPED_UNVERIFIED | Crosswalk entry exists, no structural verification |
| Level 3 | OBSERVATIONALLY_CORROBORATED | Evidence suggests correspondence |
| Level 4 | EVIDENCE_BOUND | Binding envelope confirms correspondence |
| Level 5 | STRUCTURALLY_GROUNDED | Full structural proof with vault anchor |

### Current Reconciliation Result (BlueEdge)

- **4 domains RECONCILED** (Level 4-5): domains with structural DOM backing via crosswalk
- **13 domains UNRECONCILED** (Level 1-2): 10 due to DOM-09 irresolvability, 3 due to unmapped DOMs
- **Grounding ratio:** 4/17 = 0.2353 → Q-02 (Partial Grounding)

### Reconciliation Runtime Location

- **Compiler:** `app/execlens-demo/lib/lens-v2/reconciliation/ReconciliationCorrespondenceCompiler.js`
- **Output artifact:** `artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/reconciliation_correspondence.v1.json`

## Grounding Ratio and Q-Class

The grounding ratio is computed by SemanticActorHydrator (lines 142-147) by filtering `lineage_status`:

- EXACT or STRONG lineage → **backed** (structurally grounded via crosswalk)
- NONE or WEAK lineage → **semantic-only** (no structural correspondence)

Result: `backed / total = grounding_ratio` → Q-class classification per Q02_GOVERNANCE_AMENDMENT.md.

**Grounding discrepancy (important):** Two different grounding questions produce different answers:
- **41.1 evidence-boundary grounding:** 15/17 domains "GROUNDED" (meaning upstream evidence artifacts exist)
- **Reconciliation crosswalk grounding:** 4/17 domains RECONCILED (meaning structural DOM correspondence confirmed via crosswalk)

These are NOT contradictory — they answer different questions. 41.1 asks "does evidence exist for this domain?" Reconciliation asks "does a structural DOM map to this domain?"

## Reconciliation ≠ Proof

| Operation | What It Proves | Layer |
|---|---|---|
| Crosswalk translation | Label mapping exists | L4 display |
| Crosswalk reconciliation | Correspondence assessed at graduated levels | L4 reconciliation |
| Structural grounding | Structure is verified | L3-L4 verification |
| Authority promotion | Governance gate passed | L8 governance |

Reconciliation produces correspondence evidence. Correspondence ≠ structural proof. Structural proof ≠ authority.

## Current State

| Component | Status |
|---|---|
| SemanticCrosswalkMapper | OPERATIONAL — bridge translation (v2.0, DOM→DOMAIN) |
| semantic_continuity_crosswalk.json | OPERATIONAL — v2.0, 13 DOMs mapped |
| ReconciliationCorrespondenceCompiler | OPERATIONAL — 5-input graduated correspondence compiler |
| Graduated grounding model | OPERATIONAL — 5-level (Level 1 UNMAPPED → Level 5 STRUCTURALLY_GROUNDED) |
| SemanticActorHydrator grounding ratio | OPERATIONAL — lineage-based Q-class computation |
| Q-class classification | OPERATIONAL — Q-02 for BlueEdge (4/17 grounding ratio) |

## LENS Consumption

The crosswalk and reconciliation chain feeds LENS v2 through this traceback:

```
LENS executive projection
  ← Zone derive functions (GUIDED_QUERY_ANSWERS, etc.)
    ← GenericSemanticPayloadResolver (fullReport normalization)
      ← SemanticActorHydrator (grounding ratio, lineage classification)
        ← semantic_topology_model.json (PATH B: 17 domains)
        ← semantic_continuity_crosswalk.json (bridge: DOM→DOMAIN)
        ← ReconciliationCorrespondenceCompiler (correspondence assessment)
          ← canonical_topology.json (PATH A: 13 DOMs)
          ← binding_envelope.json (CEU→DOM grounding)
```

Every LENS output that references domain grounding, Q-class, or reconciliation status traces through this chain.

## Dual-Path Ontology (Operational Summary)

PATH A and PATH B are INDEPENDENT derivation paths from the SAME upstream evidence:

| Path | Derivation | Result | Count |
|---|---|---|---|
| PATH A | structural_scanner → CEU grounding → path-prefix grouping | 13 structural DOMs | 945→35→13 |
| PATH B | 41.1 build_semantic_layer → evidence → semantic construction | 17 semantic DOMAINs | 89 COMP→42 CAP→17 DOMAIN |

The crosswalk bridges these two independent ontologies. Reconciliation assesses how well the bridge holds. The 17/4/13 semantics (17 total domains, 4 reconciled, 13 unreconciled) is the current operational reality.

## Cross-References

- [[PATH_A_EMERGENCE]] — structural grounding (reconciliation target)
- [[PATH_A5_PARTICIPATION_ARCHITECTURE]] — 945→35→13 compression chain, CEU registry
- [[PATH_B_EMERGENCE]] — semantic reconstruction (reconciliation source)
- [[TOPOLOGY_AND_HYDRATION_SPLIT]] — how these concerns separated
- [[../04_SQO_AND_QUALIFICATION/HYDRATED_AND_QSTATE_EVOLUTION]] — state progression through reconciliation

## GIT_LINEAGE

| Field | Value |
|---|---|
| Original creation | Unknown (pre-stream vault page) |
| Staleness detected by | PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01 |
| Staleness assessed by | PI.CANONICALIZATION.END-TO-END-LOCK.01 (AMOPS_VAULT_SUFFICIENCY_ASSESSMENT.md) |
| Fixed by | PI.VAULT.OPERATIONAL-ONTOLOGY-CANONICALIZATION.01 |
| Fix commit | 16b96aa |
| Recovered-from artifacts | CROSSWALK_RUNTIME_ANALYSIS.md, RECONCILIATION_CORRESPONDENCE_ANALYSIS.md, LENS_TRACEBACK_ANALYSIS.md (PI.BLUEEDGE.CROSSWALK-AND-RECONCILIATION-RECOVERY.01) |
| Authoritative runtime artifacts | ReconciliationCorrespondenceCompiler.js, SemanticCrosswalkMapper.js, SemanticActorHydrator.js, semantic_continuity_crosswalk.json, reconciliation_correspondence.v1.json |
| Client binding | BlueEdge reference implementation. All instantiation values (13 DOMs, 17 DOMAINs, 4/17 ratio, DOM-09 irresolvability, crosswalk v2.0 mapping counts) are BlueEdge-specific. Architecture is substrate-general. |
| Last verified | 2026-05-17 |
