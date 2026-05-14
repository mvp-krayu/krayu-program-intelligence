# Semantic Bundle Loading Trace
## PI.LENS.REPORT-RENDERER.SEMANTIC-BUNDLE-CONSUMPTION.01

**Generated:** 2026-05-02
**Status:** COMPLETE

---

## Load Path

CLI flag: `--semantic-bundle-dir clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/`

Resolved call chain:
```
__main__ → args.semantic_bundle_dir
         → _configure_runtime(semantic_bundle_dir=...)
         → load_semantic_bundle(bundle_dir)
           → _load_semantic_crosswalk(bundle_dir/crosswalk/semantic_continuity_crosswalk.json)
             → _SEMANTIC_CROSSWALK = json.load(...)
           → _load_semantic_topology(bundle_dir/topology/)
             → _SEMANTIC_TOPOLOGY_MODEL = json.load(semantic_topology_model.json)
             → _SEMANTIC_TOPOLOGY_LAYOUT = json.load(semantic_topology_layout.json)
```

## Artifacts Loaded

| Artifact | Path | Global Set |
|----------|------|-----------|
| SEM-001 crosswalk | bundle/crosswalk/semantic_continuity_crosswalk.json | `_SEMANTIC_CROSSWALK` |
| SEM-004 topology model | bundle/topology/semantic_topology_model.json | `_SEMANTIC_TOPOLOGY_MODEL` |
| SEM-005 topology layout | bundle/topology/semantic_topology_layout.json | `_SEMANTIC_TOPOLOGY_LAYOUT` |

## Global State After Load

| Global | Before | After |
|--------|--------|-------|
| `_SEMANTIC_CROSSWALK` | None | 13-entity crosswalk dict |
| `_SEMANTIC_TOPOLOGY_MODEL` | None | 17-domain model dict |
| `_SEMANTIC_TOPOLOGY_LAYOUT` | None | 17-node layout dict |

## Crosswalk Entities Loaded

13 DOM-XX entries. Key entry confirmed:
- `DOM-04` → business_label: "Platform Infrastructure and Data", confidence: 0.78, fallback_used: false

## Topology Model Loaded

17 domains, 5 clusters, 12 edges, metrics.domains_with_structural_evidence=5

## Topology Layout Loaded

17 node_positions (all DOMAIN-01..DOMAIN-17 mapped), 5 cluster_bounding_boxes

## Fallback Behavior (Without Bundle)

If `--semantic-bundle-dir` not provided and `--crosswalk-path` / `--semantic-topology-dir` also absent:
- `_SEMANTIC_CROSSWALK` remains None
- `_SEMANTIC_TOPOLOGY_MODEL` remains None
- `_SEMANTIC_TOPOLOGY_LAYOUT` remains None
- All three loader functions no-op
- `_resolve_domain_display_label()` returns technical_label (anchor_name) unchanged
- `_build_semantic_report_context()` returns fallback_available=False
- `_render_semantic_topology_svg()` returns empty string
- Structural SVG path taken; count cards show 13 domains / 0 backed
