# Reconstruction Methodology
## PI.LENS.SEMANTIC-TOPOLOGY-REBUILD.02

**Generated:** 2026-05-02
**Basis:** DETERMINISTIC_RECONSTRUCTION
**Authorization:** Explicit in contract

---

## Why Reconstruction Was Required

Both `semantic_topology_model.json` and `semantic_topology_layout.json` were confirmed present at runtime 2026-04-30 via PI.LENS.END-TO-END-RERUN.BLUEEDGE.01 preflight check ("Semantic topology + crosswalk: CONFIRMED PRESENT"). However, neither file was ever committed to the repository. The directory `docs/psee/PI.CLIENT-LANGUAGE-LAYER.SEMANTIC-TOPOLOGY-REBUILD.01/` (the expected source) was also never committed.

Result: 687 non-run-id content diffs in PI.LENS.BLUEEDGE-CANONICAL-REPORT-GENERATION-CONTRACT.01, verdict NOT_REPRODUCIBLE.

---

## Source Evidence Used

| Source | Fields Extracted |
|--------|-----------------|
| `scripts/pios/41.1/build_semantic_layer.py` lines 40–56 | 17 domain_id, domain_name, domain_type (authoritative Python dicts) |
| `docs/pios/41.1/semantic_domain_model.md` | Summary table confirming 17 domains; cross-check |
| `docs/psee/41X.SEMANTIC.CONSTRUCTION.FORENSICS.01/semantic_transformation_trace.md` | 12 domain-level links L-DOM-01..L-DOM-12 with source, target, relationship_type |
| `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/lineage/canonical_topology_with_lineage.json` | DOM-XX → DOMAIN-XX bindings; lineage_status; confidence; zone_anchor for 5 backed domains |
| `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/crosswalk/semantic_continuity_crosswalk.json` | business_label per DOM-XX; confirms "Platform Infrastructure and Data" for DOM-04/DOMAIN-10 |
| `docs/psee/PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01/tier2_fixup_generation_result.json` | Runtime attestation: "LOADED — 17 domains, 5 clusters, 12 edges" |
| `scripts/pios/lens_report_generator.py` lines 597–872 | Renderer field requirements: exact key names for node_positions, cluster_bounding_boxes, domain fields |

---

## semantic_topology_model.json Reconstruction

### Domain Entries (17)

Each domain entry constructed from:
1. `domain_id`, `domain_name`, `domain_type` — copied exactly from build_semantic_layer.py Python dict
2. `cluster_id` — derived from domain_type:
   - FUNCTIONAL → CLU-FUNCTIONAL
   - INFRASTRUCTURE → CLU-INFRASTRUCTURE
   - OPERATIONAL → CLU-OPERATIONAL
   - CROSS-CUTTING → CLU-CROSS-CUTTING
   - INTEGRATION → CLU-INTEGRATION
3. `lineage_status`, `dominant_dom_id`, `confidence` — sourced from canonical_topology_with_lineage.json semantic_lineage fields:
   - DOMAIN-01: DOM-13, STRONG, 0.95
   - DOMAIN-10: DOM-04, STRONG, 0.78
   - DOMAIN-11: DOM-07, PARTIAL, 0.65
   - DOMAIN-14: DOM-10, EXACT, 0.92
   - DOMAIN-16: DOM-11, STRONG, 0.93
   - All others: lineage_status=NONE, dominant_dom_id=null, confidence=0.0
4. `zone_anchor` — True only for DOMAIN-10 (DOM-04 entry in lineage file has zone_anchor=True, active_zone_id=PZ-001)
5. `business_label` — crosswalk business_label for backed domains; domain_name for all others
6. `original_status` — "verified" for all (all domains originate from validated build_semantic_layer.py)

### Cluster Entries (5)

Color accents selected for renderer compatibility:
- CLU-FUNCTIONAL: #3fb950 (green — renderer uses for EXACT/STRONG backed nodes)
- CLU-INFRASTRUCTURE: #d29922 (amber — infrastructure/PARTIAL)
- CLU-OPERATIONAL: #58a6ff (blue)
- CLU-CROSS-CUTTING: #8b949e (gray — cross-cutting)
- CLU-INTEGRATION: #bc8cff (purple)

Note: renderer checks `if color in ("#a5d6ff", "#79c0ff"): color = "#58a6ff"` — CLU-OPERATIONAL uses #58a6ff directly to avoid this normalization.

### Edge Entries (12)

Sourced from `semantic_transformation_trace.md` L-DOM-01 through L-DOM-12:
- L-DOM-13..L-DOM-20 are composite/aggregated links not included in the simple model
- Runtime attestation confirms 12 edges ("LOADED — 17 domains, 5 clusters, 12 edges")

### Metrics

Hardcoded from runtime attestation:
- total_domains: 17, total_clusters: 5, total_edges: 12, domains_with_structural_evidence: 5

---

## semantic_topology_layout.json Reconstruction

SVG viewBox: 0 0 820 480 (from renderer line 788).

### Cluster Bounding Box Placement

| Cluster | x | y | width | height | Rationale |
|---------|---|---|-------|--------|-----------|
| CLU-FUNCTIONAL (9 domains) | 10 | 10 | 355 | 460 | Largest cluster; left panel full-height |
| CLU-INFRASTRUCTURE (3 domains) | 375 | 10 | 195 | 230 | Top-center; contains zone anchor DOMAIN-10 |
| CLU-OPERATIONAL (2 domains) | 580 | 10 | 230 | 230 | Top-right |
| CLU-CROSS-CUTTING (2 domains) | 375 | 250 | 195 | 220 | Bottom-center |
| CLU-INTEGRATION (1 domain) | 580 | 250 | 230 | 220 | Bottom-right |

### Node Position Placement

Nodes placed within cluster bounding boxes using grid/balanced layout. Node radius:
- Standard: 22 (all domains except zone anchor)
- Zone anchor (DOMAIN-10): 26 (larger ring visible per renderer line 735–739)

FUNCTIONAL cluster: 3×3 grid with columns at cx=65, 185, 305; rows at cy=90, 230, 380.
INFRASTRUCTURE cluster: triangle; DOMAIN-02 cx=425 cy=85; DOMAIN-10 cx=530 cy=85; DOMAIN-16 cx=475 cy=195.
OPERATIONAL cluster: DOMAIN-08 cx=650 cy=100; DOMAIN-12 cx=770 cy=100.
CROSS-CUTTING cluster: DOMAIN-09 cx=425 cy=360; DOMAIN-11 cx=530 cy=360.
INTEGRATION cluster: DOMAIN-13 cx=700 cy=370.

Label lines split at word boundary to fit within node radius.

---

## Limitations

1. The reconstructed layout coordinates differ from the original 2026-04-30 layout (which was lost). The reconstruction is deterministic from domain type groupings and SVG dimensions, not a literal recovery of original coordinates.

2. The original `semantic_topology_model.json` schema may have included additional fields not captured in evidence streams. The reconstruction includes all fields required by `lens_report_generator.py` as confirmed by reading the renderer source.

3. Reconstruction does NOT claim to produce bit-identical output to the original. The 687 content diffs from PI.LENS.BLUEEDGE-CANONICAL-REPORT-GENERATION-CONTRACT.01 may not fully resolve — re-run validation is required.
