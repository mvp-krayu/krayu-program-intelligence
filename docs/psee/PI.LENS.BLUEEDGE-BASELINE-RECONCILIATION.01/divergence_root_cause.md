# Divergence Root Cause
## PI.LENS.BLUEEDGE-BASELINE-RECONCILIATION.01

**Generated:** 2026-05-01
**Status:** COMPLETE

All divergences are classified using the contract-defined root cause categories.

---

## RC-01: Missing Intake / Source Grounding

**Applies to:** intake/canonical_repo

**Finding:** BlueEdge canonical_repo does not exist at `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo`. The BlueEdge archive (`blueedge-platform-v3_23_0-COMPLETE.tar`) was analyzed from an external location (`/Users/khorrix/Projects/blueedge-clean-run/`). The extracted canonical_repo was never committed to k-pi-core.

**Pipeline impact:** Phase 2 FAIL. Pipeline cannot advance past Phase 2.

**Severity:** BLOCKING

**Evidence:** source_manifest.json `extracted_path` = UUID intake path; UUID psee/ directory has no intake/ subdirectory.

---

## RC-02: Missing Structural Scanner Equivalence

**Applies to:** structure/40.2, structure/40.3, structure/40.4

**Finding:** BlueEdge 40.x structural pipeline output does not exist at `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/structure/`. The structural scanner was run against the BlueEdge codebase in a prior contract (`PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01`) but its output artifacts are not committed to k-pi-core.

**Additional finding:** The BlueEdge baseline vault topology (35 nodes, 13 domains) was derived from `dom_path_domain_layer.json` (PATH_EVIDENCE_ONLY), NOT from 40.x scanner output. The 40.x scanner (if it ran) would produce different node counts — potentially 955+ nodes per the pipeline code comments. The baseline topology is a PATH-EVIDENCE derivation, not a full structural scan.

**Pipeline impact:** Phase 3 FAIL (if reached). Also VR-02/03/04 FAIL in Phase 8b.

**Severity:** BLOCKING

---

## RC-04: DOM Layer Derivation Difference

**Applies to:** dom/dom_layer.json

**Finding:** The source_manifest.dom_layer_path points to `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json`. This file **does not exist** in the repository. The conformance evidence directory `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` does not exist in docs/psee.

**Additional finding:** The baseline DOM layer was derived using PATH_EVIDENCE_ONLY methodology (13 DOM groups from structural_topology_log.json path patterns). This is different from the generic pipeline's dom_layer_generator.py which uses DOMAIN_RULES (10 rules, first-match-wins). Even if the DOM file existed, the derivation method and resulting domain groupings may differ.

**Pipeline impact:** Phase 5 FAIL on dom file load. VR-06 FAIL in Phase 8b.

**Severity:** BLOCKING

---

## RC-05: Binding Schema Mismatch

**Applies to:** binding/binding_envelope.json

**Finding:**
1. The BlueEdge baseline binding envelope uses a **pre-generic schema** produced by `PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01` (fields: `bindings`, `domain_telemetry`, `pressure_zone_designations`).
2. The generic pipeline's Phase 5 produces a **generic schema** (fields: `nodes`, `edges`, `capability_surfaces`).
3. For BlueEdge, Phase 5 is configured to load from `fastapi_conformance_path = docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed` — this directory **does not exist**.

**Pipeline impact:** Phase 5 FAIL (fastapi_conformance_path missing). VR-07 FAIL in Phase 8b.

**Severity:** BLOCKING (path); ARCHITECTURAL (schema)

---

## RC-07: Pipeline Architectural Gap (Phase 8b VR path divergence)

**Applies to:** Phase 8b vault readiness checks VR-01 through VR-09

**Finding:** Phase 8b's VR checks assume all required artifacts are co-located under `run_dir` (i.e., `clients/blueedge/psee/runs/<run_id>/`). For BlueEdge, the available artifacts are at:
- CEU grounding: UUID run path (not run_dir/ceu/)
- Integration validation: UUID run path (not run_dir/integration/)
- Structure/intake/dom: absent entirely

Even if Phase 1–7 could be made to pass, Phase 8b would fail on VR-01 through VR-06 for BlueEdge because no intake/structure/ceu/dom pipeline stages populate the run_dir with these artifacts.

**Root cause:** The generic pipeline assumes a single-root run_dir layout where ALL artifacts from ALL phases land under one directory. BlueEdge uses a UUID client directory as the source-of-truth for structural artifacts, and a separate run path under the named client directory for pipeline outputs. These two-root patterns are incompatible with the single-root Phase 8b VR check logic.

**Severity:** ARCHITECTURAL

---

## Non-Root-Cause Findings

**RC-03 (CEU grounding mismatch): NOT APPLICABLE**
CEU grounding data is internally consistent. No mismatch between grounding_state_v3.json and vault artifacts. All 10 CEUs at SOURCE_TRUTH. grounding_ratio=1.0 confirmed across all baseline artifacts. No discrepancy detected.

**RC-06 (Projection logic difference): NOT APPLICABLE**
Signal projection logic (RUN_RELATIVE_OUTLIER) is identical between baseline and generic pipeline. Signal values are deterministic from BlueEdge 40.3 topology. No logic difference. Blocked only by upstream path gaps, not by projection logic.

**RC-08 (Unknown): NOT APPLICABLE**
All divergences have identified root causes (RC-01, -02, -04, -05, -07). No unresolved traces.

---

## Summary Table

| Root Cause | Category | Blocking Phase | Severity |
|-----------|----------|----------------|----------|
| RC-01 | Missing intake/source grounding | Phase 2 | BLOCKING |
| RC-02 | Missing structural scanner | Phase 3 + Phase 8b VR-02/03/04 | BLOCKING |
| RC-04 | DOM layer absent | Phase 5 + Phase 8b VR-06 | BLOCKING |
| RC-05 | Binding schema mismatch + path absent | Phase 5 + Phase 8b VR-07 | BLOCKING |
| RC-07 | Pipeline architectural gap (single vs dual root) | Phase 8b VR-01..09 | ARCHITECTURAL |
