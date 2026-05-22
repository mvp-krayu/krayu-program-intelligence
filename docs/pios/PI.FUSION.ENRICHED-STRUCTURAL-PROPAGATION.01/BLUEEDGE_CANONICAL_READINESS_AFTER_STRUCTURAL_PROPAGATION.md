# BlueEdge Canonical Readiness After Structural Propagation

> **Assessment from main at 10eeeda (2026-05-22)**
> After merge of PI.FUSION.ENRICHED-STRUCTURAL-PROPAGATION.01

---

## 1. Does BlueEdge run from main consume 40.3s imports and 40.3c centrality?

**YES — at ingestion. NO — at fusion.**

Phase 3.6 produces `structure/40.3s/code_graph.json` with 3,331 relationships (2,138 IMPORTS).
Phase 3.7 produces `structure/40.3c/structural_centrality.json` with 643 files ranked.

Both files exist in `run_blueedge_genesis_e2e_02`. The enriched structural evidence is **produced** but never **consumed** by downstream fusion stages.

---

## 2. Do enriched structural weights propagate into Phase 5 binding?

**NO.**

`phase_05_build_binding_envelope` (line 495) checks `source_manifest.get("fastapi_conformance_path")` first. BlueEdge's source manifest sets this to:

```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed
```

This triggers the pre-computed path (lines 501–513), which copies `binding_envelope_fastapi_compatible.json` directly into the run directory and **returns before reaching** `_enrich_binding_with_structural_evidence` at line 729.

The pre-computed binding envelope uses a legacy schema (`bindings`, `domain_telemetry`, `pressure_zone_designations`) that is structurally incompatible with the generic schema (`nodes`, `edges`, `capability_surfaces`). Even if the enrichment call were reached, it could not operate on this schema.

---

## 3. Do enriched structural weights propagate into Phase 5b semantic topology where eligible?

**NO — silent no-op.**

Phase 5b runs successfully. BlueEdge has a CSR (`clients/blueedge/semantic/client_semantic_registry.json`, 17 domains). `generate_semantic_topology.py` produces `semantic_topology_model.json` with 17 domains.

`_enrich_semantic_topology_with_structural_evidence` IS called (line 1251). It loads 40.3s (2,138 IMPORTS) and 40.3c (643 files). Then it looks for `run_dir/dom/dom_layer.json` to build the path→DOM mapping.

**This file does not exist.** The `dom/` directory is never created in BlueEdge's run directory. The function hits `if not path_to_dom: return` and exits silently.

The DOM layer synthesis (`_synthesize_dom_layer_from_ceus`) at line 550 only runs inside the generic Phase 5 binding path — which BlueEdge never enters. So no `dom_layer.json` is ever produced.

Result: 0/17 domains enriched. 0 structural import edges. 0 centrality annotations.

---

## 4. Is BlueEdge still on a pre-computed binding shortcut?

**YES.**

`clients/blueedge/sources/source_01/source_manifest.json` line 17:
```json
"fastapi_conformance_path": "docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed"
```

This is the single field that causes the entire bypass.

---

## 5. What exactly prevents enriched propagation from activating for BlueEdge?

**Two chained causes from one root:**

| # | Cause | Effect | Root |
|---|-------|--------|------|
| 1 | `fastapi_conformance_path` is set | Phase 5 returns at line 513, skipping generic binding + DOM synthesis + enrichment | Source manifest field |
| 2 | No `dom_layer.json` in run directory | Phase 5b enrichment can't build path→DOM mapping, exits silently | Consequence of #1 |

**Root cause:** The `fastapi_conformance_path` field in BlueEdge's source manifest bypasses the entire generic pipeline binding path. This was correct when BlueEdge had no code graph — the pre-computed binding was the only viable path. Now that 40.3s/40.3c exist, the bypass prevents enriched evidence from flowing downstream.

**Additional structural incompatibility:** Even within Phase 5b (which IS reached), the enrichment requires `dom_layer.json` to map file paths to DOM groups. This file is only synthesized inside the generic Phase 5 binding path. There is no independent DOM layer synthesis step in the pipeline.

---

## 6. Corridor Verdict

### PARTIAL_READY_WITH_BINDING_SHORTCUT_GAP

**What works:**
- RAW intake → TypeScript-enriched PATH A: OPERATIONAL (2,138 IMPORTS, 643 centrality-ranked files)
- Chronicle phase semantics: OPERATIONAL (PARTIAL_COGNITIVE_GENESIS corridor, 57 events, 17 checkpoints)
- Generic binding enrichment code: OPERATIONAL (validated on StackStorm — 30 cross-DOM edges, 2,070 imports)
- Semantic topology enrichment code: OPERATIONAL (structurally sound, awaiting DOM layer availability)

**What doesn't work for BlueEdge:**
- Binding/fusion propagation: BYPASSED (pre-computed shortcut)
- Semantic topology enrichment: SILENT NO-OP (no DOM layer)
- LENS/projection boundary visibility of enriched structure: NOT POSSIBLE (binding carries pre-computed evidence only)

**Evidence gap:** 2,138 IMPORTS and 643 centrality-ranked files are produced but never consumed by fusion. The enriched structural intelligence dead-ends at 40.3s/40.3c.

---

## 7. Single Next Corrective Stream

### PI.BLUEEDGE.GENERIC-BINDING-MIGRATION.01

**Mission:** Migrate BlueEdge from the pre-computed FastAPI conformance binding path to the generic pipeline binding path.

**What it does:**
1. Remove or null `fastapi_conformance_path` from BlueEdge's source manifest
2. Ensure the generic binding path produces a valid binding envelope from BlueEdge's existing CEU grounding + DOM synthesis
3. Verify Phase 5 enrichment fires (cross-DOM import edges, GROUNDS annotations, CE centrality)
4. Verify Phase 5b enrichment fires (dom_layer.json now exists → topology enrichment activates)
5. Verify LENS can consume the generic-schema binding envelope (may require adapter if LENS hardcodes the pre-computed schema)

**Why this and not something else:**
- This is the single root blocker. Both Phase 5 and Phase 5b enrichment code already exists and is validated.
- The generic pipeline path already works for StackStorm and pallets-flask.
- The pre-computed path was a legitimate workaround when BlueEdge had no code graph. CC-01 resolved that gap. The workaround is now the obstacle.

**Risk:**
- LENS v2 may depend on the pre-computed binding schema (`bindings`, `domain_telemetry`, `pressure_zone_designations`) for BlueEdge rendering. If so, the generic schema adapter in LENS needs attention. This is a known downstream concern, not a pipeline concern.
- Signal computation (`run_end_to_end.py`, Phase 6+7) uses the binding envelope for signal derivation. The generic-path binding may produce different signal values than the pre-computed path. Regression testing is mandatory.

**Classification:** G2 (architecture-consuming — no new concepts, migrates between existing paths)

**Estimated complexity:** MEDIUM — the pipeline path is proven, but LENS compatibility needs verification.
