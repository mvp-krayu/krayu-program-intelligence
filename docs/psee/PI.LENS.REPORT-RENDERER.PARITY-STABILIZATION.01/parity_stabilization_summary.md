# Parity Stabilization Summary
## PI.LENS.REPORT-RENDERER.PARITY-STABILIZATION.01

**Generated:** 2026-05-02
**Branch:** work/psee-runtime
**Baseline commit:** d9605f5

---

## Result Summary

| Report | Byte Parity | Normalized Parity | Classification |
|--------|-------------|-------------------|----------------|
| TIER1_NARRATIVE | PASS | PASS (byte match) | NO_DIFF |
| TIER1_EVIDENCE | FAIL | FAIL (230 lines) | MIXED (TEMPLATE_DRIFT + DATA_DRIFT) |
| TIER2_DIAGNOSTIC | FAIL | FAIL (194 lines) | MIXED (TEMPLATE_DRIFT + DATA_DRIFT) |
| DECISION_SURFACE | FAIL | FAIL (14 lines) | CONTENT_DRIFT |

**Overall: MIXED — 438 non-allowed diffs across 3 reports**

---

## Root Cause Summary

### RC-01 — SVG Topology Coordinates (TEMPLATE_DRIFT)

**Affected:** TIER1_EVIDENCE (192 lines), TIER2_DIAGNOSTIC (192 lines)

The semantic topology SVG is embedded inline in these reports. All node positions (`cx`, `cy`, `radius`), cluster bounding boxes (`x`, `y`, `width`, `height`), and derived edge coordinates (`x1`, `y1`, `x2`, `y2`) differ between canonical and generated.

**Cause:** DETERMINISTIC_RECONSTRUCTION used different coordinates than the original `semantic_topology_layout.json`. Original coordinates are extractable from canonical report inline SVG.

**Canonical cluster rects (extracted from diff):**
- FUNCTIONAL: x=8, y=8, w=283, h=205
- one other cluster: x=322, y=8, w=245, h=205
- another: x=602, y=62, w=190, h=125
- another: x=8, y=248, w=283, h=215
- another: x=322, y=248, w=295, h=215

**Reconstruction cluster rects:**
- CLU-FUNCTIONAL: x=10, y=10, w=355, h=460
- CLU-INFRASTRUCTURE: x=375, y=10, w=195, h=230
...etc (different geometry)

---

### RC-02 — Cluster ID Naming (DATA_DRIFT)

**Affected:** TIER1_EVIDENCE domain cards (34 lines)

Original `semantic_topology_model.json` used numeric cluster IDs: `CLU-01`, `CLU-02`, `CLU-03`, `CLU-04`, `CLU-05`.

Reconstruction used descriptive IDs: `CLU-FUNCTIONAL`, `CLU-INFRASTRUCTURE`, `CLU-OPERATIONAL`, `CLU-CROSS-CUTTING`, `CLU-INTEGRATION`.

Evidence from canonical domain cards:
- DOMAIN-01 → `CLU-01` (FUNCTIONAL)
- DOMAIN-04, DOMAIN-10, DOMAIN-11 → `CLU-04` (mixed; INFRASTRUCTURE + CROSS-CUTTING)
- DOMAIN-09 → (appears as CLU-05 in context)
- DOMAIN-16 → `CLU-03`

The original mapping was not strictly by domain_type.

---

### RC-03 — lineage_status for DOMAIN-01 and DOMAIN-16 (DATA_DRIFT)

**Affected:** TIER1_EVIDENCE domain badges (4 lines), TIER2_DIAGNOSTIC lineage table (2 lines)

| Domain | Original | Reconstructed |
|--------|----------|--------------|
| DOMAIN-01 | EXACT | STRONG |
| DOMAIN-16 | EXACT | STRONG |
| DOMAIN-14 | EXACT | EXACT (correct) |
| DOMAIN-10 | STRONG | STRONG (correct) |
| DOMAIN-11 | PARTIAL | PARTIAL (correct) |

DOMAIN-01 and DOMAIN-16 were reconstructed as STRONG based on provenance_recovery evidence. The canonical model had them as EXACT.

---

### RC-04 — Decision Surface Hero Rationale (CONTENT_DRIFT)

**Affected:** DECISION_SURFACE (14 lines)

| Element | Canonical | Generated |
|---------|-----------|-----------|
| Hero rationale | "5/17 semantic domains backed. Execution evidence is incomplete." | "13 of 13 structural evidence groups are populated." |
| Structure badge | "STRUCTURE: STABLE" | "STRUCTURE: STABLE within structural evidence scope" |
| Risk badge | "RISK: MODERATE" | "RISK: MODERATE — driven by evidence incompleteness..." |
| Truth text | Semantic domain coverage: 5/17 domains backed | Active pressure pattern centered on Platform Infrastructure and Data |
| PZ-001 reference | Absent | Present (generated MORE semantic) |

The decision surface builder generates different hero rationale text depending on semantic context availability. The canonical was generated with a code path that elevated the semantic domain count (5/17) into the hero rationale. The current renderer produces the structural path for hero rationale but the full semantic label elsewhere.

---

## Progress vs Prior Baseline (687 diffs without bundle)

Prior NOT_REPRODUCIBLE verdict: 687 non-run-id diffs
This run (with bundle): 438 non-allowed diffs

Reduction: **249 diffs resolved** by semantic bundle integration.

Tier1 narrative: fully resolved (byte match).
Remaining 438 diffs are classifiable and remediable:
- 384 SVG coordinate lines (RC-01, recoverable from canonical)
- 40 cluster/lineage data lines (RC-02/03, correctable in model JSON)
- 14 decision surface content lines (RC-04, renderer code investigation needed)
