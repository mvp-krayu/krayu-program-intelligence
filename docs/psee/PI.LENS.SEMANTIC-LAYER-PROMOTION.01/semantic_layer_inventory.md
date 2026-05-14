# Semantic Layer Inventory
## PI.LENS.SEMANTIC-LAYER-PROMOTION.01

**Generated:** 2026-05-02
**Branch:** work/psee-runtime

---

## Inventory Method

Read-only inspection of 19 candidate streams listed in contract. No search outside listed candidates. No generation. No inference.

---

## Candidate Streams Inspected

| Stream | Files Found | Semantic Artifacts Identified |
|--------|------------|-------------------------------|
| PI.LENS.END-TO-END-RERUN.BLUEEDGE.01 | 13 | reproducibility_verdict.json |
| PI.CLIENT-LANGUAGE-LAYER.TIER1-NARRATIVE-FINAL-ALIGNMENT.01 | 11 | validation_log.json |
| PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01 | 10 | tier2_fixup_generation_result.json, validation_log.json |
| PI.DECISION-SURFACE.RECONSTRUCTION.01 | 18 | decision_fixup_generation_result.json, decision_validation.json, decision_cross_report_alignment.json |
| BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01 | 5 | MD docs only — REFERENCE_ONLY |
| 41X.SEMANTIC.CONSTRUCTION.FORENSICS.01 | 5 | MD docs only — REFERENCE_ONLY |
| 41X.TOPOLOGY.PRODUCTION.FORENSICS.01 | 5 | MD docs only — REFERENCE_ONLY |
| 41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01 | 4 | canonical_topology.json |
| SEMANTIC.COMPUTATION.AUTHORITY.01 | 1 | MD doc only — REFERENCE_ONLY |
| SEMANTIC.SIGNAL.MODEL.DEFINITION.01 | 5 | semantic_validation_rules.md, signal_derivation_rules.md |
| PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01 | 4 | No semantic layer artifacts (app/gauge-product UI only) |
| PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01 | 2 | MD doc only — REFERENCE_ONLY |
| GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01 | 3 | No semantic layer artifacts (GAUGE runtime) |
| GAUGE.RUNTIME.REMOUNT.TOPOLOGY.ADDON.01 | 3 | No semantic layer artifacts (GAUGE runtime) |
| GAUGE.RUNTIME.RENDERING.VALIDATION.01 | 3 | No semantic layer artifacts (GAUGE runtime) |
| GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.01 | 3 | No semantic layer artifacts (GAUGE runtime) |
| GAUGE.RUNTIME.TOPOLOGY.UI.TUNING.02 | 3 | No semantic layer artifacts (GAUGE runtime) |
| GAUGE.TOPOLOGY.ADDON.RESTORE.INSPECTOR.AND.PRESENTATION.01 | 3 | No semantic layer artifacts (GAUGE runtime) |
| GAUGE.TOPOLOGY.PAGE.EXTRACTION.WITH.CONTEXT.01 | 3 | No semantic layer artifacts (GAUGE runtime) |

---

## Artifacts by Category

### Category 1 — Semantic Continuity Crosswalk
- **SEM-001**: `clients/blueedge/psee/runs/run_blueedge_productized_01_dom_lineage_validation/language_layer/semantic_continuity_crosswalk.json` — FOUND

### Category 2 — Semantic Topology Model
- **SEM-004**: `docs/psee/PI.CLIENT-LANGUAGE-LAYER.SEMANTIC-TOPOLOGY-REBUILD.01/semantic_topology_model.json` — **MISSING** (directory never committed)

### Category 3 — Semantic Topology Layout
- **SEM-005**: `docs/psee/PI.CLIENT-LANGUAGE-LAYER.SEMANTIC-TOPOLOGY-REBUILD.01/semantic_topology_layout.json` — **MISSING** (directory never committed)

### Category 4 — Canonical Topology with Lineage
- **SEM-002**: `clients/blueedge/psee/runs/run_blueedge_productized_01_dom_lineage_validation/vault/canonical_topology_with_lineage.json` — FOUND

### Category 5 — DOM-to-DOMAIN Lineage Mapping
- **SEM-002** (above) contains full DOM-to-DOMAIN lineage annotations per entry
- **SEM-003**: `clients/blueedge/psee/runs/run_blueedge_productized_01_dom_lineage_validation/manifests/vault_compatibility_manifest.json` — FOUND

### Category 6 — Domain Display Labels
- Encoded within **SEM-001** (crosswalk `business_label` fields) — no separate file
- Encoded within **SEM-002** (lineage `semantic_lineage.business_label` fields) — no separate file

### Category 7 — Report Input Snapshots
- **SEM-014**: `docs/psee/PI.LENS.END-TO-END-RERUN.BLUEEDGE.01/reproducibility_verdict.json` — FOUND (confirms canonical input snapshot reproducibility)

### Category 8 — Tier-1 Language Alignment Rules
- **SEM-008**: `docs/psee/PI.CLIENT-LANGUAGE-LAYER.TIER1-NARRATIVE-FINAL-ALIGNMENT.01/validation_log.json` — FOUND

### Category 9 — Tier-2 Diagnostic Semantic Fixups
- **SEM-009**: `docs/psee/PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01/tier2_fixup_generation_result.json` — FOUND
- **SEM-010**: `docs/psee/PI.CLIENT-LANGUAGE-LAYER.TIER2-DIAGNOSTIC-FIXUP.01/validation_log.json` — FOUND

### Category 10 — Decision Surface Reconstruction Inputs
- **SEM-011**: `docs/psee/PI.DECISION-SURFACE.RECONSTRUCTION.01/decision_fixup_generation_result.json` — FOUND
- **SEM-012**: `docs/psee/PI.DECISION-SURFACE.RECONSTRUCTION.01/decision_validation.json` — FOUND
- **SEM-013**: `docs/psee/PI.DECISION-SURFACE.RECONSTRUCTION.01/decision_cross_report_alignment.json` — FOUND

### Category 11 — Graph State / Topology Runtime Context
- **SEM-006**: `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` — FOUND (41.1 full hierarchy: 17 domains, 148 nodes)
- **SEM-007**: `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/tier2/graph_state.json` — FOUND (force-directed graph: 18 nodes, 17 links)

### Category 12 — Semantic Validation Rules
- **SEM-015**: `docs/psee/SEMANTIC.SIGNAL.MODEL.DEFINITION.01/semantic_validation_rules.md` — FOUND
- **SEM-016**: `docs/psee/SEMANTIC.SIGNAL.MODEL.DEFINITION.01/signal_derivation_rules.md` — FOUND

---

## Summary

| Status | Count |
|--------|-------|
| COPIED | 14 |
| MISSING | 2 |
| REFERENCE_ONLY (MD, not copied) | several |

**Blocking missing:** semantic_topology_model.json, semantic_topology_layout.json — required for full canonical reproduction
