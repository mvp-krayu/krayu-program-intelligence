# Brain Node — Code
# Tier-2 Runtime MVP

**Authority:** TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01
**Brain:** CODE
**Status:** IMPLEMENTED — Phase 1 complete
**Alignment date:** 2026-04-22
**Updated:** 2026-04-23 (BRAIN.RECONCILE.LENS.TIER2.01)
**Product link:** docs/brain/product/diagnostic_access_product.md

---

## IMPLEMENTATION STATUS

**IMPLEMENTED — Phase 1**

All Phase 1 steps (1a–1e generator, Step 2 API, Step 3 file-serve, Step 4 UI) are
complete. Additionally implemented beyond original spec: live query engine (WHY + EVIDENCE
via /api/query), graph state export (export_graph_state.mjs using d3-force-3d),
structural evidence topology graph in Diagnostic Narrative.

Phase 2 deferred items remain: /api/query TRACE mode, traversal engine, interactive
workspace page, deep linking, entitlement gating at workspace level.

Phase 1 implementation units are defined below. All are additive — no existing code is removed or broken.

---

## PHASE 1 IMPLEMENTATION UNITS

### Step 1 — Generator: scripts/pios/lens_report_generator.py

```
1a. _TIER2_DIAGNOSTIC_CSS
    CSS string constant.
    Inherits Tier-1 variable set (--bg, --fg, --gold, --green, --amber, --border).
    max-width: 960px. Dark theme. Matches Tier-1 family.

1b. _build_tier2_diagnostic_narrative(topology, signals, gauge, publish_safe=False)
    Inputs: loaded canonical data (same loaders as Tier-1 already exist)
    Output: HTML string
    Sections:
      0 — Header: run_id, evidence_scope, structural_coverage_status, resolution_boundary
      1 — Diagnostic Overview: zone count, pressure_distribution object,
          contradiction_presence, evidence_completeness_summary
      2 — Zone Inventory: one card per zone (zone_id, zone_type, severity,
          confidence, traceability_status)
      3 — Per-zone blocks A–F:
          A. Condition Description (observable_condition, source_tier1_signals, derived_from)
          B. Structural Drivers (contributing_nodes, contributing_signals, dependency_structure)
          C. Propagation Path (paths with node_chain, path_type, evidence_support;
             inferred_declaration where evidence_support = INFERRED)
          D. Evidence State (evidence_strength, available_evidence, missing_evidence)
          E. Uncertainty Declaration (unresolved_elements, inference_prohibition: "ACTIVE" visible)
          F. Investigation Entry Points (WHY/TRACE/EVIDENCE hooks as static labeled sections)
      Nav strip: links via /api/report-file?name=... to Tier-1 Evidence Brief and Narrative Brief
    Publish-safe: same obfuscation rules as Tier-1

1c. generate_tier2_reports(output_dir=None)
    Writes:
      clients/blueedge/reports/tier2/lens_tier2_diagnostic_narrative.html
      clients/blueedge/reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html
    Prints:
      [LENS REPORT] Generated: <absolute_path>  (2 lines)

1d. Extend main() or generate_tier1_reports() to also invoke generate_tier2_reports()
    when --tier1 flag is active (or add separate --tier2 flag)

1e. Extend argparse with --tier2 flag
```

### Step 2 — API: app/gauge-product/pages/api/report.js

```
Add to TIER1_LABELS (or new TIER2_LABELS):
  'lens_tier2_diagnostic_narrative.html'     → 'Diagnostic Narrative (Internal)'
  'lens_tier2_diagnostic_narrative_pub.html' → 'Diagnostic Narrative (Publish)'

Extend parseAllReportPaths() result handling to include tier2 output lines.
Tier2 files returned in same files[] array as Tier-1 entries.
```

### Step 3 — API: app/gauge-product/pages/api/report-file.js

```
Add VALID_TIER2 regex:
  /^lens_tier2_diagnostic_narrative(_pub)?\.html$/

Extend resolveFilePath():
  lens_tier2_diagnostic_narrative.html     → reports/tier2/
  lens_tier2_diagnostic_narrative_pub.html → reports/tier2/publish/
```

### Step 4 — UI: app/gauge-product/pages/lens.js + styles/gauge.css

```
ReportPanel:
  Add button after existing Evidence Brief buttons:
  label: "Diagnostic Narrative (Internal)"
  onClick: window.open(artifacts.narrative.path)
  where artifacts.narrative = files entry with name 'lens_tier2_diagnostic_narrative.html'

gauge.css:
  Add .lens-report-narrative class if distinct styling required.
  Otherwise reuse existing .lens-report-secondary style.
```

---

## PHASE 1 DEFERRED (DO NOT IMPLEMENT IN PHASE 1)

```
- /api/query endpoint
- tier2_trace_graph.py traversal engine
- Interactive query UI (zone-click → trace expansion)
- Live WHY/TRACE/EVIDENCE query execution
```

---

## EXISTING CODE UNCHANGED

```
- All Tier-1 generator functions
- All Tier-1 report CSS
- _build_tier1_evidence_brief()
- _build_tier1_narrative_brief()
- generate_tier1_reports()
- load_canonical_topology(), load_signal_registry(), load_gauge_state()
- /api/report-file existing VALID_LEGACY and VALID_TIER1 patterns
- ReportPanel existing Evidence Brief and Narrative Brief buttons
```

---

## VALIDATION REQUIREMENTS

Phase 1 implementation MUST validate:
- 2 Tier-2 files generated and written to correct output paths
- `[LENS REPORT] Generated:` emitted for each Tier-2 file
- `inference_prohibition: ACTIVE` visible in every zone's Section 3E
- All zone fields derived from canonical sources — no invented data
- Nav strip cross-links resolve via `/api/report-file?name=...`
- `/api/report-file` returns 200 for both Tier-2 filenames
- ReportPanel renders Diagnostic Narrative button after report generation
