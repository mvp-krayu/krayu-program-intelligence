# Historical Ontology Confidence Assessment

> **What is fully evidenced, what is strongly inferred, and what remains unresolved.**

---

## Assessment Framework

Each claim is classified as:
- **FULLY EVIDENCED** — artifact exists, code confirms, traceback verified
- **STRONGLY INFERRED** — multiple converging evidence sources, no contradicting artifact, but no single definitive proof
- **STILL UNRESOLVED** — ambiguity remains, no sufficient evidence to determine

---

## 1. Historical LENS Ontology

### FULLY EVIDENCED

| Claim | Evidence |
|---|---|
| LENS executive projection shows "4 of 17 structurally backed, 13 semantic-only" | `GenericSemanticPayloadResolver.js` line 321, `SemanticActorHydrator.js` lines 142-147 |
| Q-class Q-02 derived from grounding ratio 4/17 = 0.2353 | `SemanticActorHydrator.js` line 159, `deriveQualifierClass()` |
| Two distinct LENS pathways: manifest-driven (productized run) and selector-driven (orchestrated fixup run) | `manifests/blueedge.run_blueedge_productized_01_fixed.json`, `selector/selector.json` |
| BOARDROOM/BALANCED/DENSE/INVESTIGATION are four cognitive projection personas | Zone component implementations, condition-driven layout resolution code |
| Decision posture (PROCEED/INVESTIGATE/ESCALATE) is deterministically derived | `fullReport` payload resolution, readiness band computation |

### STRONGLY INFERRED

| Claim | Basis | Why not fully evidenced |
|---|---|---|
| The manifest-driven and selector-driven pathways were intentionally separate (not an accident) | Different runs serve different purposes; manifest loads semantic artifacts, selector loads structural pipeline | No explicit design document stating the dual-pathway intent |

### STILL UNRESOLVED

None. The LENS ontology is fully understood through code traceback and artifact forensics.

---

## 2. Runtime Chain

### FULLY EVIDENCED

| Claim | Evidence |
|---|---|
| `run_client_pipeline.py` is the canonical 9-phase orchestrator | Script exists with contract ID, phase structure documented |
| Phase sequence: source boundary → intake → 40.x verification → CEU grounding → binding envelope → 75.x + 41.x → vault construction → vault validation → selector update | `run_client_pipeline.py` phase functions |
| `run_end_to_end.py` is called as subprocess in Phase 6+7 | `run_client_pipeline.py` subprocess call |
| 75.x produces: condition_correlation, pressure_candidates, pressure_zones | `scripts/pios/75x/` — 3 compute scripts |
| 41.x produces: signal_projection, pressure_zone_projection | `scripts/pios/41x/` — 2 compute scripts |
| Vault construction produces 9 artifacts | `run_client_pipeline.py` phase_08a_vault() |
| Selector update writes selector.json + available_runs.json | `run_client_pipeline.py` phase_09_selector_update() |

### STRONGLY INFERRED

| Claim | Basis | Why not fully evidenced |
|---|---|---|
| Phases 1-4 are verification-only (no generation) | Code structure shows validate-and-check pattern | No formal "verification vs generation" classification in governance |
| Phase 8a signal_registry THEORETICAL_BASELINE exclusion is intentional | Code comment suggests deliberate design | No governing spec |
| FastAPI conformance path (STAGE_NOT_AUTOMATED bypass) is a transitional mechanism | Code comments indicate temporary state | No sunset timeline or governance |

### STILL UNRESOLVED

| Question | Why unresolved |
|---|---|
| Phase numbering reconciliation: IG-era 40.5/40.6/40.7 vs current 75.x/41.x | No document reconciles the renumbering. IG-era docs exist under `docs/pios/40.5/`, `40.6/`, `40.7/` but refer to different pipeline stages than current orchestrator phases. |
| run_end_to_end.py internal structure | No documentation. Called as subprocess — its internal composition (how it sequences 75.x and 41.x compute scripts) is code-only. |

---

## 3. Reconciliation Semantics

### FULLY EVIDENCED

| Claim | Evidence |
|---|---|
| ReconciliationCorrespondenceCompiler reads 5 inputs: semantic topology, structural topology, crosswalk, signals, traces | `ReconciliationCorrespondenceCompiler.js` lines 1-18 |
| 5-level graduated confidence model: Level 1 UNMAPPED through Level 5 STRUCTURALLY_GROUNDED | `ReconciliationCorrespondenceCompiler.js` assessConfidence() |
| Baseline result: 4 reconciled (Level 5), 1 partial (Level 3, DOMAIN-11), 12 unmapped (Level 1) | `reconciliation_correspondence.v1.json` |
| Enriched result improves some levels: Level 3=5, Level 2=4, Level 1=4 | `reconciliation_correspondence.enriched.v1.json` |
| Reconciliation is purely assessment — reads both ontologies, produces correspondence, never creates or mutates domains | `ReconciliationCorrespondenceCompiler.js` — read-only consumption of inputs |
| Reconciliation loop has 12 lifecycle states, 5 rerun modes, 7-step propagation chain | `ReconciliationLoopOrchestrator.js` |
| `LensReconciliationConsumptionLayer.js` transforms SQO reconciliation artifacts into LENS-consumable shapes | Code file exists with stated purpose |

### STRONGLY INFERRED

| Claim | Basis | Why not fully evidenced |
|---|---|---|
| Enrichment improves UNMAPPED domains by finding indirect structural correspondence | Enriched artifact shows improved levels vs baseline | Enrichment algorithm not fully traced through code |

### STILL UNRESOLVED

None. Reconciliation semantics are fully evidenced through artifact forensics and code traceback.

---

## 4. Semantic Topology Semantics

### FULLY EVIDENCED

| Claim | Evidence |
|---|---|
| 17 semantic domains were constructed by 41.1 `build_semantic_layer.py` from upstream evidence | `build_semantic_layer.py` lines 39-57 embed 17 DOMAIN definitions |
| Construction used: component_model.md, relationship_map.md, execution_paths.md, intent_inference_map.md | `build_semantic_layer.py` import/reference chain |
| Derivation ratio: 89 COMP → 42 CAP → 17 DOMAIN | `build_semantic_layer.py` static data |
| Session comment labels in app.module.ts served as primary categorical grouping signal | `semantic_construction_sequence.md` line 129, `semantic_method_reconstruction.md` lines 25-28 |
| Semantic domains pre-existed structural grounding — grounding was computed AFTER domain construction | `build_semantic_layer.py` runs before crosswalk exists; crosswalk is a post-hoc bridge |
| semantic_topology_model.json was produced by PI.LENS.SEMANTIC-TOPOLOGY-REBUILD.02 (DETERMINISTIC_RECONSTRUCTION) | `semantic_topology_model.json` metadata |
| 4 grounded domains: DOMAIN-01 (DOM-13, 0.95), DOMAIN-10 (DOM-04, 0.78), DOMAIN-14 (DOM-10, 0.92), DOMAIN-16 (DOM-11, 0.93) | `semantic_topology_model.json` lineage_status fields + crosswalk entries |

### STRONGLY INFERRED

| Claim | Basis | Why not fully evidenced |
|---|---|---|
| Stage 3 derivation bundle (COMP re-enumeration, IIM extraction) was produced by a "run_03_blueedge" that is now ABSENT | Multiple documents reference it; no artifact or run directory exists | The run itself is missing — reconstruction was necessary |
| 16-domain capability map from Stage 1 is the conceptual precursor to 17 DOMAIN-NN | `grouping_decision_inventory.md` Decision A-5 lists 16 domains with similar names | No explicit lineage document traces 16→17 transformation |

### STILL UNRESOLVED

| Question | Why unresolved |
|---|---|
| Why 17 domains instead of 16? | Stage 1 produced 16 capability domains. Stage 4 produced 17 semantic domains. The specific decision that created the 17th domain (or split one of the 16) is not documented in any artifact. |
| What happened in run_03_blueedge? | This run produced the Stage 3 derivation bundle (component_model.md, relationship_map.md, etc.) but the run itself is absent from the repository. Its exact execution method and parameters are reconstructed, not directly observed. |

---

## 5. Historical 17/4/13 Meaning

### FULLY EVIDENCED

| Claim | Evidence |
|---|---|
| "17" = total semantic domains from 41.1 construction | `semantic_topology_model.json` — 17 entries |
| "4" = domains with crosswalk lineage_status EXACT or STRONG | `SemanticActorHydrator.js` filter logic |
| "13" = domains with crosswalk lineage_status NONE or WEAK | `SemanticActorHydrator.js` filter logic |
| DOM-09 backend_modules is the root cause of 10/13 unreconciled domains | Crosswalk shows DOM-09 as IRRESOLVABLE; domain recovery shows 10 semantic domains live inside backend/src/modules/ |
| Structural grounding is crosswalk correspondence, NOT evidence existence | Grounding is determined by lineage_status from crosswalk, not by 41.1's evidence-boundary grounding |

### STRONGLY INFERRED

None. The 17/4/13 meaning is fully evidenced.

### STILL UNRESOLVED

None.

---

## 6. Crosswalk Semantics

### FULLY EVIDENCED

| Claim | Evidence |
|---|---|
| Crosswalk is v2.0, maps 13 structural DOMs to semantic DOMAINs | `semantic_continuity_crosswalk.json` — 13 entries, version 2.0 |
| 9/13 DOMs have business labels, 4 are WEAK/unresolvable | Crosswalk entity analysis |
| DOM-09 is IRRESOLVABLE (maps to 6+ semantic domains) | Crosswalk marks it; domain recovery confirms multi-domain mapping |
| Crosswalk is a bridge — not a reconciliation engine, not a domain generator | Vault page correctly states this; code confirms read-only consumption |
| Source contract: PI.CLIENT-LANGUAGE-LAYER.DOM-REDERIVATION-WITH-LINEAGE.01 | `semantic_continuity_crosswalk.json` metadata |
| 5 consumers: GenericSemanticPayloadResolver, SemanticActorHydrator, ReconciliationCorrespondenceCompiler, crosswalk_mapping_validation, LENS report renderer | Code traceback |
| Crosswalk derivation chain: upstream evidence → 41.1 → COMP→CAP→DOMAIN → crosswalk maps DOM→DOMAIN | `build_semantic_layer.py` + crosswalk `comp_evidence` fields |

### STRONGLY INFERRED

None. Crosswalk semantics are fully evidenced.

### STILL UNRESOLVED

None.

---

## Summary

| Area | Fully Evidenced | Strongly Inferred | Still Unresolved |
|---|---|---|---|
| Historical LENS ontology | 5 claims | 1 claim | 0 |
| Runtime chain | 7 claims | 3 claims | 2 questions |
| Reconciliation semantics | 7 claims | 1 claim | 0 |
| Semantic topology semantics | 7 claims | 2 claims | 2 questions |
| 17/4/13 meaning | 5 claims | 0 | 0 |
| Crosswalk semantics | 7 claims | 0 | 0 |
| **Total** | **38 claims** | **7 claims** | **4 questions** |

---

## Confidence Verdict

**The historical ontology is now SUBSTANTIALLY UNDERSTOOD.**

- 38 of 45 claims are fully evidenced through artifact forensics and code traceback.
- 7 claims are strongly inferred with no contradicting evidence.
- 4 questions remain unresolved but none are architecturally critical:
  - Phase numbering reconciliation (IG-era vs current) — confusing but not blocking
  - run_end_to_end.py internals — code-only but operational
  - 16→17 domain count change — historical curiosity, not operational
  - run_03_blueedge absence — reconstructed successfully, original unrecoverable

**The project can proceed with high confidence that the operational ontology is correctly understood.**
