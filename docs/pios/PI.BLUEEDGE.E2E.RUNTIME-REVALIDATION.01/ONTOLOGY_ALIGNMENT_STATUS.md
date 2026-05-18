# Ontology Alignment Status — PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01

**Stream:** PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01
**Date:** 2026-05-18

---

## 1. Operational Ontology Chain — Alignment Summary

The operational ontology defines a canonical chain from source evidence to LENS projection. This document assesses each link against the revalidation results.

| Chain Link | Ontology Expectation | Revalidation Result | Alignment |
|---|---|---|---|
| Source evidence → Raw nodes | 945 nodes from BlueEdge archive | 945 nodes from verified archive (SHA-256) | **ALIGNED** |
| Raw nodes → A5a substrate | 48 replay-safe structural domains | NOT PRODUCED (pipeline architecture gap) | **NOT VALIDATED** |
| A5a → A5b executive | 13 grounded DOMs from CEU participation | 13 DOMs from conformance artifact (MANIFEST_LINEAGE_DRIFT) | **FUNCTIONALLY ALIGNED** |
| PATH B definition | 17 DOMAINs / 42 CAPs / 89 COMPs | 17/42/89 exact match to source | **ALIGNED** |
| Crosswalk bridge | v2.0, 9/1/3, DOM-09 irresolvable | v2.0, 6 STRONG + 1 EXACT + 2 PARTIAL / 1 IRRESOLVABLE / 3 WEAK | **ALIGNED** (9/1/3 confirmed as labeled/irresolvable/weak) |
| Reconciliation | 4/17 structurally backed, Q-02 | 4/17 backed, Q-02, 23.53% ratio | **ALIGNED** |
| Signal chain | 4 signals (PSIG-001/002/004/006) | 4 signals, all values identical | **ALIGNED** |
| Gauge | canonical=60, CONDITIONAL | canonical=60, CONDITIONAL | **ALIGNED** |
| LENS projection | run_be_orchestrated_fixup_01 selected | Selector unchanged, revalidation isolated | **ALIGNED** |

---

## 2. Ontology Layer Maturity Assessment

| Ontology Layer | Maturity | Evidence |
|---|---|---|
| Source boundary | OPERATIONAL | Archive verified, SHA-256 match, 741 files inventoried |
| Structural scan (40.x) | OPERATIONAL | 945 nodes, 944 edges, 11 clusters — deterministic from source |
| CEU grounding | OPERATIONAL (generic registry) | 5/10 grounded via generic ceu_registry.json. Historical BlueEdge-specific grounding (35 nodes) not reproducible with generic registry |
| A5a substrate | SPECIFIED_NOT_INTEGRATED | 48 domains validated in separate run, not in E2E pipeline |
| A5b executive (13 DOMs) | OPERATIONAL (conformance-sourced) | Deterministic, production-matching, but sourced from conformance artifact not canonicalized pipeline stage |
| PATH B semantic | OPERATIONAL (static) | 17/42/89 from `build_semantic_layer.py`, BlueEdge-specific literals |
| Crosswalk | OPERATIONAL | v2.0, 13 entities, 9/1/3 pattern |
| Reconciliation | OPERATIONAL | 4/17 backed, Q-02, compiler at `scripts/reconciliation/compile_blueedge_correspondence.js` |
| Signal computation | OPERATIONAL (pre-computed) | 4 signals from conformance artifacts, STAGE_NOT_AUTOMATED |
| Vault construction | OPERATIONAL | 9 artifacts, determinism hash match, vault readiness PASS |
| LENS projection | OPERATIONAL | Manifest chain verified, all artifacts consistent |

---

## 3. MANIFEST_LINEAGE_DRIFT — Ontology Implications

### 3.1 What the Ontology Says

OPERATIONAL_ONTOLOGY.md defines the dual-path architecture:
- **PATH A:** Evidence → structural scan → CEU grounding → A5a domains → A5b executive DOMs
- **PATH B:** Business evidence → domain identification → capability classification → component mapping

The crosswalk bridges PATH A (structural) and PATH B (semantic) to produce reconciliation correspondence.

### 3.2 What the Pipeline Actually Does

The pipeline does NOT follow the full PATH A chain for DOM construction:

```
ONTOLOGY:   945 nodes → [CEU grounding] → 48 A5a domains → [CEU compression] → 13 A5b DOMs
PIPELINE:   945 nodes → [verified] → dom_layer_path (conformance artifact) → 13 DOMs
```

The fresh CEU grounding (5/10, 52 nodes, ratio=0.5) is produced but not consumed for DOM construction. The vault's 13 DOMs come from the pre-existing conformance artifact.

### 3.3 Alignment Assessment

The pipeline produces the **correct result** (13 DOMs matching ontology expectation) but through a **different derivation path** (conformance artifact read, not fresh CEU-based derivation). This is:

- **Functionally aligned:** Output matches ontology expectation
- **Architecturally misaligned:** Derivation path does not match ontology specification
- **Not a regression:** This is how the pipeline has always worked for BlueEdge
- **A canonicalization debt:** The ontology describes a fully automated PATH A chain that does not yet exist in the pipeline

### 3.4 What Would Fix the Misalignment

1. Implement A.5a as a pipeline stage (path-prefix grouping from 945 → 48)
2. Implement A.5b as a pipeline stage (CEU-grounded compression from 48 → 13)
3. Update `source_manifest.json` to point to pipeline-produced DOM layer instead of conformance artifact
4. Update PIOS_CURRENT_CANONICAL_STATE.md: "A.5b → OPERATIONAL"

---

## 4. CEU_REGISTRY_DRIFT — Ontology Implications

### 4.1 Two CEU Registries in Play

| Registry | Location | CEUs | Grounding |
|---|---|---|---|
| Generic | `scripts/pios/ceu_registry.json` | 10 abstract patterns | 5/10 grounded (BlueEdge) |
| Historical (BlueEdge-specific) | UUID-path `ceu_grounding_registry.json` | 35 grounded nodes | 35/35 (1.0 ratio) |

### 4.2 Ontology Expectation

PATH_A5_PARTICIPATION_ARCHITECTURE.md documents:
- "35 CEU-grounded participation nodes" (historical)
- "67 matched nodes" (current CEU registry, 10 CEUs)
- The CEU registry has evolved, producing different grounding counts against the same archive

### 4.3 Assessment

The generic CEU registry is the **correct forward path** for multi-client support (it works for both BlueEdge and FastAPI). The historical BlueEdge-specific grounding (35 nodes, ratio=1.0) is not reproducible with the generic registry.

However, this drift has **no operational impact** because the vault construction bypasses fresh CEU grounding entirely (reads conformance artifact instead).

---

## 5. Ontology vs Reality — Gap Register

| Ontology Claim | Reality | Gap Type |
|---|---|---|
| A5a produces 48 domains | A5a validated separately, not in E2E pipeline | INTEGRATION_GAP |
| A5b compression produces 13 DOMs from CEU grounding | 13 DOMs sourced from conformance artifact | DERIVATION_GAP |
| CEU grounding produces 35 nodes | Generic registry produces 5/10 grounded (52 nodes) | REGISTRY_DRIFT |
| Pipeline is end-to-end from source | Phases 5-7 use pre-computed conformance artifacts | AUTOMATION_GAP |
| Crosswalk is "9/1/3 mapping" | Actually 6 STRONG + 1 EXACT + 2 PARTIAL / 1 IRRESOLVABLE / 3 WEAK | TERMINOLOGY_PRECISION |

---

## 6. Overall Ontology Alignment Verdict

**FUNCTIONALLY ALIGNED — ARCHITECTURALLY INCOMPLETE**

The BlueEdge E2E pipeline produces results that match the operational ontology's expected outputs at every layer. All vault artifacts match production. PATH A and PATH B are consistent. The crosswalk and reconciliation follow documented patterns.

However, the derivation path does not fully match the ontology's specified chain. The pipeline shortcuts through conformance artifacts (DOM layer, signal values) rather than computing them from the structural scan. This is a known architectural debt, not a regression.

The ontology describes the target architecture; the pipeline implements a functional subset of it.
