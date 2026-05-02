# Missing Semantic Artifacts
## PI.LENS.SEMANTIC-LAYER-PROMOTION.01

**Generated:** 2026-05-02
**Status:** 2 blocking artifacts absent from repository

---

## SEM-004 — semantic_topology_model.json

| Field | Value |
|-------|-------|
| Expected path | docs/psee/PI.CLIENT-LANGUAGE-LAYER.SEMANTIC-TOPOLOGY-REBUILD.01/semantic_topology_model.json |
| Bundle target | clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_model.json |
| Renderer flag | --semantic-topology-dir |
| Generator function | _load_semantic_topology() (lines 565–573) |
| Impact | Semantic count cards: 17 Semantic Domains / 5 Backed / 12 Semantic-Only; semantic SVG topology; _build_semantic_report_context() fallback_available=True |
| Confirmed present at | 2026-04-30 runtime (PI.LENS.END-TO-END-RERUN.BLUEEDGE.01 execution_report.md preflight: "Semantic topology + crosswalk: CONFIRMED PRESENT") |
| Never committed | Confirmed — not in git history, not in working tree |
| Content known from | tier2_fixup_generation_result.json: "LOADED — 17 domains, 5 clusters, 12 edges" |
| Recovery path | Must reconstruct from BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01 and 41X.SEMANTIC.CONSTRUCTION.FORENSICS.01 methodology or obtain from original creation session |

---

## SEM-005 — semantic_topology_layout.json

| Field | Value |
|-------|-------|
| Expected path | docs/psee/PI.CLIENT-LANGUAGE-LAYER.SEMANTIC-TOPOLOGY-REBUILD.01/semantic_topology_layout.json |
| Bundle target | clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_layout.json |
| Renderer flag | --semantic-topology-dir (same directory as model) |
| Generator function | _load_semantic_topology() — requires BOTH model and layout present |
| Impact | Required alongside semantic_topology_model.json; without it _SEMANTIC_TOPOLOGY_LAYOUT stays None |
| Never committed | Confirmed — not in git history, not in working tree |
| Content known from | Unknown schema; no evidence of its structure in candidate streams |
| Recovery path | Must reconstruct alongside semantic_topology_model.json |

---

## Impact on Report Reproduction

Without SEM-004 and SEM-005:
- lens_report_generator.py with --semantic-topology-dir produces no semantic data
- Count cards fall back to structural: 13 Domains / 0 Capabilities / 35 Components
- Zone labels fall back to technical anchor_names (e.g., "backend_app_root")
- Semantic SVG path not taken
- _build_semantic_report_context() returns fallback_available=False

With SEM-001 (crosswalk) only — partial improvement possible if renderer is patched per PI.LENS.RENDERER-SEMANTIC-CONTEXT-APPLICATION-DIAG.01 findings (3 breakpoint sites):
- Zone labels would improve: "Platform Infrastructure and Data" at 3 render sites
- Count cards, SVG still degraded

Full canonical reproduction requires both SEM-004 and SEM-005.
