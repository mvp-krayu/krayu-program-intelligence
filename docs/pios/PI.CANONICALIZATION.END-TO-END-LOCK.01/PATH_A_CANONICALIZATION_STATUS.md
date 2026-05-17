# Path A Canonicalization Status

> **Are the PATH A early stages fully canonically documented, or do undocumented cognition gaps remain?**

---

## Assessment Summary

PATH A stages are **SUBSTANTIALLY documented** but with significant gaps in three areas: (1) pipeline phase numbering reconciliation, (2) intermediate process documentation (run_end_to_end.py), and (3) CEU registry governance.

---

## Stage-by-Stage Documentation Status

### source_intake.py (L0/L1 Boundary)

**Status: FULLY DOCUMENTED**

| Asset | Path |
|---|---|
| Script | `scripts/pios/source_intake.py` (contract: PI.LENS.SOURCE-INTAKE.GENERIC.01) |
| Implementation summary | `docs/psee/PI.LENS.SOURCE-INTAKE.GENERIC.01/implementation_summary.md` |
| Findings | `docs/psee/PI.LENS.SOURCE-INTAKE.GENERIC.01/source_intake_findings.md` |
| Contract closure | `docs/psee/PI.LENS.SOURCE-INTAKE.CONTRACT-CLOSURE.01/source_intake_contract_decision.md` |
| Inventory path contract | `docs/psee/PI.LENS.SOURCE-INTAKE.INVENTORY-PATH.CONTRACT-CLOSURE.01/` |

No gaps. Full docstring, RULE headers, all steps explained inline.

### structural_scanner.py (40.2/40.3/40.4)

**Status: FULLY DOCUMENTED (with historical confusion)**

| Asset | Path |
|---|---|
| Script | `scripts/pios/structural_scanner.py` (contract: PI.LENS.STRUCTURAL-SCANNER.GENERIC.01) |
| Implementation summary | `docs/psee/PI.LENS.STRUCTURAL-SCANNER.GENERIC.01/implementation_summary.md` |
| Findings | `docs/psee/PI.LENS.STRUCTURAL-SCANNER.GENERIC.01/structural_scanner_findings.md` |
| Schema | 3 schema JSON files in same directory |

**Confusion:** `docs/pios/40.2/`, `40.3/`, `40.4/` contain IG-era artifacts (self-analysis of k-pi-core from earlier pipeline version). These are NOT the current generic client scanner documentation. No document explicitly states this transition.

### CEU Detection and Grounding

**Status: DOCUMENTED WITH GOVERNANCE GAP**

| Asset | Path |
|---|---|
| Script | `scripts/pios/ceu_grounding.py` (contract: PI.LENS.CEU-GROUNDING.GENERIC.01) |
| Findings | `docs/psee/PI.LENS.CEU-GROUNDING.GENERIC.01/ceu_grounding_findings.md` |
| Schema | `grounding_state_schema.json` |
| Vault page | `vault/03_PATH_SPLIT_EVOLUTION/PATH_A5_PARTICIPATION_ARCHITECTURE.md` |

**Gap: CEU registry governance.**

`scripts/pios/ceu_registry.json` is the authoritative CEU definition file. There is NO governance document specifying:
- Who owns the registry
- How CEU evolution is governed
- What triggers a registry version change
- How participation surface changes are assessed

The vault page `PATH_A5_PARTICIPATION_ARCHITECTURE.md` warns about CEU registry evolution risk but provides no governance protocol.

**Impact:** CEU registry changes silently change the participation surface (35→67 nodes with current registry vs historical), which changes the executive topology. This is an ungovened mutation path.

### DOM Generation / Path-Prefix Grouping

**Status: DOCUMENTED WITH A.5a/A.5b DISAMBIGUATION GAP**

| Asset | Path |
|---|---|
| Script | `scripts/pios/dom_layer_generator.py` (contract: PI.LENS.DOM-LAYER.GENERATOR.01) |
| Implementation summary | `docs/psee/PI.LENS.DOM-LAYER.GENERATOR.01/implementation_summary.md` |
| Domain rules | `docs/psee/PI.LENS.DOM-LAYER.GENERATOR.01/domain_derivation_rules.md` |
| A.5 policy | `docs/pios/PI.BLUEEDGE.A5-CANONICALIZATION...01/` (13 files) |
| Vault page | `vault/03_PATH_SPLIT_EVOLUTION/PATH_A5_PARTICIPATION_ARCHITECTURE.md` |

**Gap:** The vault page defines the A.5a/A.5b two-layer model clearly, but no document explicitly states which layer `dom_layer_generator.py` currently implements. It implements A.5a (path-prefix on ALL nodes). The grounded A.5b layer (path-prefix on CEU-grounded nodes only) remains unimplemented.

### binding_envelope.json Construction

**Status: CODE-ONLY WITH PARTIAL DOCUMENTATION**

| Asset | Path |
|---|---|
| Code | `run_client_pipeline.py` phase_05_build_binding_envelope() |
| Integration report | `PI.BLUEEDGE.A5-CANONICALIZATION...01/PIPELINE_INTEGRATION_REPORT.md` (field compatibility) |

**Gap:** No standalone design specification. The binding envelope construction logic (nodes by type [bc/ce/cs], edges [GROUNDS/EXPOSES], capability surfaces, majority-vote DOM resolution) is documented only in code comments.

### 75.x Condition/Pressure Activation

**Status: DOCUMENTED WITH IG-ERA CONFUSION**

| Asset | Path |
|---|---|
| Scripts | `scripts/pios/75x/compute_condition_correlation.py`, `compute_pressure_candidates.py`, `compute_pressure_zones.py` |
| IG-era docs | `docs/pios/PIOS.CONDITION.FORMATION.40_7/`, `PIOS.CONDITION.INTERPRETATION.40_8/` |

**Gap:** The IG-era documents under `docs/pios/40.7/` and `40.8/` refer to condition formation and interpretation as pipeline stages 40.7 and 40.8. The current pipeline calls these as part of Phase 6+7 via `run_end_to_end.py` → 75.x scripts. No document reconciles the renumbering.

### 41.x Signal Projection

**Status: DOCUMENTED WITH IG-ERA CONFUSION**

| Asset | Path |
|---|---|
| Scripts | `scripts/pios/41x/compute_signal_projection.py`, `compute_zone_projection.py` |
| IG-era docs | `docs/pios/40.5/` (signal computation spec), `docs/pios/40.6/` (signal extraction) |

**Gap:** Same numbering confusion. IG-era 40.5 signal specs describe PSIG-001/002/004/006. Current 41.x scripts compute signal_projection.json and pressure_zone_projection.json. The relationship between IG-era signal definitions and current signal computation is not formally documented.

### Vault Construction (Phase 8)

**Status: CODE + E2E DOC**

| Asset | Path |
|---|---|
| Code | `run_client_pipeline.py` phase_08a_vault() — 9 artifact types |
| E2E doc | `docs/psee/PI.LENS.E2E-PIPELINE-REALITY-LOCK.01/e2e_pipeline_steps.md` (Step 12) |

No standalone vault construction specification, but adequately documented between code and E2E doc.

### Selector Update (Phase 9)

**Status: ADEQUATELY DOCUMENTED**

| Asset | Path |
|---|---|
| Code | `run_client_pipeline.py` phase_09_selector_update() |
| E2E doc | `docs/psee/PI.LENS.E2E-PIPELINE-REALITY-LOCK.01/e2e_pipeline_steps.md` (Step 14) |

### run_end_to_end.py

**Status: UNDOCUMENTED**

| Asset | Path |
|---|---|
| Script | `scripts/pios/run_end_to_end.py` |

Called as subprocess in Phase 6+7 of the orchestrator. No dedicated documentation in `docs/psee/` or `docs/pios/`. Its internal sequencing of 75.x and 41.x compute scripts is code-only.

### 40.16 ESI/RAG Derivation

**Status: DOCUMENTED BUT DISCONNECTED**

| Asset | Path |
|---|---|
| Scripts | `scripts/pios/40.16/` (6 scripts) |
| Documentation | `docs/pios/40.16/` (esi_derivation_specification, rag_derivation_specification, derivation_input_matrix) |

**Gap:** 40.16 has rich documentation but NO connection to `run_client_pipeline.py`. It is not referenced in any pipeline phase. The relationship between 40.16 and the canonical pipeline is formally undocumented. This is consistent with the maturity classification (IMPLEMENTED_ISOLATED) but the disconnection itself is not documented.

---

## Missing Canonical Artifacts

| # | Missing Artifact | Impact | Priority |
|---|---|---|---|
| 1 | Pipeline phase numbering reconciliation document | Confusion between IG-era (40.5-40.8) and current (75.x, 41.x) numbering | MEDIUM |
| 2 | run_end_to_end.py documentation | Phase 6+7 subprocess has no governing spec | LOW |
| 3 | CEU registry governance protocol | Ungoverned mutation path for participation surface | MEDIUM |
| 4 | binding_envelope.json design specification | Construction logic is code-only | LOW |
| 5 | 40.16 → pipeline disconnection document | ESI/RAG isolation is undocumented | LOW |

## Stale Vault Pages

| # | Page | Staleness |
|---|---|---|
| 1 | `vault/03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION.md` | Says reconciliation compiler "NOT IMPLEMENTED" — it IS implemented |

## Weakly Documented Transitions

| # | Transition | Current State |
|---|---|---|
| 1 | IG-era pipeline (40.2-40.8 as stages) → current pipeline (9 phases) | No reconciliation document |
| 2 | IG-era signal specs (40.5 PSIG-xxx) → current signal computation (41.x) | No formal mapping |
| 3 | Historical CEU registry → current CEU registry | Evolution warning in vault, no governance |

## Reconstruction Assumptions Not Yet Frozen

| # | Assumption | Status |
|---|---|---|
| 1 | A.5b (grounded participation compression) will use same path-prefix method as A.5a but on CEU-grounded nodes | ASSUMED — vault page describes this model but A.5b is not implemented |
| 2 | CEU registry version can be pinned per client | ASSUMED — vault page suggests this as an option but no implementation exists |
| 3 | FastAPI conformance path (STAGE_NOT_AUTOMATED bypass) is temporary | ASSUMED — code comments suggest this but no sunset timeline |

---

## Conclusion

PATH A's early stages are substantially documented thanks to:
- Generic client pipeline scripts with contract IDs and docstrings
- `docs/psee/` implementation summaries for source_intake, structural_scanner, ceu_grounding, dom_layer
- `e2e_pipeline_steps.md` covering the full 14-step pipeline
- `PATH_A5_PARTICIPATION_ARCHITECTURE.md` canonicalizing the 945→35→13 chain

**No cognition gap comparable to the crosswalk/reconciliation gap exists in PATH A.** The PATH B/crosswalk/reconciliation gap was a missing architectural understanding (the dual-path ontology was not understood). PATH A's gaps are documentation gaps (numbering reconciliation, run_end_to_end.py, CEU governance), not conceptual gaps. The architecture is understood; the documentation has holes.
