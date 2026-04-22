# Brain Node — Product
# TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01
# Tier-2 Runtime Minimum Viable Surface

**Authority:** TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01
**Brain:** PRODUCT
**Status:** DEFINED — NOT IMPLEMENTED
**Alignment date:** 2026-04-22
**Upstream (structure):** docs/brain/product/TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01.md
**Upstream (query):** docs/brain/product/TIER2.TRACE.QUERY.CONTRACT.01.md
**Canonical link:** docs/brain/canonical/tier2_runtime_mvp_surface.md
**Code link:** docs/brain/code/tier2_runtime_mvp.md
**Publish link:** docs/brain/publish/tier2_runtime_mvp.md

---

## PURPOSE

This node defines the minimum viable runtime surface for Tier-2.

Goal: identify the smallest credible implementation slice that proves Tier-2 as a real governed product capability. This is not full implementation. It is the first valid runtime slice.

---

## A. MINIMUM API SURFACE

Three changes to existing files. Zero new files required.

| File | Change |
|---|---|
| `scripts/pios/lens_report_generator.py` | Add `_build_tier2_diagnostic_narrative()`, `generate_tier2_reports()`, `--tier2` flag |
| `app/gauge-product/pages/api/report.js` | Parse 2 additional `[LENS REPORT] Generated:` lines; return Tier-2 entries in files array |
| `app/gauge-product/pages/api/report-file.js` | Accept `lens_tier2_*.html`; serve from `reports/tier2/` and `reports/tier2/publish/` |

**Deferred:**
- `/api/query` endpoint — entire live query engine deferred to Phase 2
- `tier2_trace_graph.py` — traversal engine deferred to Phase 2

The Diagnostic Narrative is a static-at-generation HTML artifact. Same architecture as Tier-1. No new endpoint class is needed for Phase 1.

---

## B. MINIMUM UI SURFACE

One button addition to the existing `ReportPanel` in `app/gauge-product/pages/lens.js`.

```
[existing]  Executive Report (Internal)      ← Tier-1 Evidence Brief
[existing]  Executive Report (Publish)       ← Tier-1 Evidence Brief pub
[new]       Diagnostic Narrative (Internal)  ← Tier-2 Diagnostic Narrative
```

The opened HTML contains:
- Section 0: Header (run_id, evidence_scope, structural_coverage_status, resolution_boundary)
- Section 1: Diagnostic Overview (zone count, pressure distribution, contradiction flag)
- Section 2: Zone Inventory (card per zone — zone_id, zone_type, severity, confidence)
- Section 3: Per-zone blocks A–F (condition, drivers, propagation, evidence state,
  uncertainty declaration with `inference_prohibition: ACTIVE` visible,
  query hooks as static labeled reference blocks)
- Nav strip: ← Evidence Brief  ← Narrative Brief  [Diagnostic Narrative active]

Query hooks in Section 3F render as static labeled sections (hook_id + query_surface) — not live queries. They define the interrogation surface without requiring Phase 2 execution.

**Deferred UI:**
- Zone-click → live trace expansion
- Interactive query panel
- TRACE traversal visualisation

---

## C. ARTIFACT REUSE

**Already supported — no new work required:**

| Artifact | How it supports Tier-2 MVP |
|---|---|
| `canonical_topology.json` | Zone candidates are WEAKLY GROUNDED domains. Already loaded by generator. |
| `signal_registry.json` | Contributing signals per domain, evidence state, artifacts. Already loaded. |
| `gauge_state.json` | Scoring context for header. Already loaded. |
| `load_canonical_topology()`, `load_signal_registry()`, `load_gauge_state()` | Loader functions exist in generator from Tier-1 build. |
| `_TIER1_EVIDENCE_CSS` variable set | Tier-2 HTML inherits same CSS variables. No new theme work. |
| `/api/report-file` `resolveFilePath()` pattern | Extend with `VALID_TIER2` regex. 4 lines of code. |
| `ReportPanel` button pattern | One additional button, same `window.open()` pattern. |
| `generate_tier2_reports()` file output structure | Mirrors `generate_tier1_reports()`: internal + publish, `reports/tier2/` + `reports/tier2/publish/`. |

**New runtime bindings truly required:**

1. `_build_tier2_diagnostic_narrative(topology, signals, gauge, publish_safe=False)` — HTML template function
2. `generate_tier2_reports(output_dir=None)` — output orchestrator
3. `--tier2` argparse flag
4. Two `TIER2_LABELS` entries in `report.js`
5. `VALID_TIER2` regex + path resolution in `report-file.js`
6. One button in `ReportPanel`

---

## D. FIRST END-TO-END FLOW

```
1. User on gauge-product /lens page

2. Click "Generate Executive Report"
   → /api/report invokes generator with --tier1 (extended to also run --tier2,
     or generator --tier1 extended to include tier2 in same pass)

3. Generator produces 4 files (existing Tier-1) + 2 files (new Tier-2):
   clients/blueedge/reports/tier1/lens_tier1_evidence_brief.html
   clients/blueedge/reports/tier1/publish/lens_tier1_evidence_brief_pub.html
   clients/blueedge/reports/tier1/lens_tier1_narrative_brief.html
   clients/blueedge/reports/tier1/publish/lens_tier1_narrative_brief_pub.html
   clients/blueedge/reports/tier2/lens_tier2_diagnostic_narrative.html        [new]
   clients/blueedge/reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html  [new]

4. API returns files array with Tier-2 entries included:
   { name: "lens_tier2_diagnostic_narrative.html",
     label: "Diagnostic Narrative (Internal)",
     path: "/api/report-file?name=lens_tier2_diagnostic_narrative.html" }

5. ReportPanel renders new button:
   → "Diagnostic Narrative (Internal)"

6. User opens Diagnostic Narrative HTML:
   → Sections 0–3 fully rendered from canonical sources
   → Zone inventory shows WEAKLY GROUNDED domains as zone cards
   → Per-zone blocks: all fields evidence-backed, no inference
   → inference_prohibition: ACTIVE visible in every zone's Section 3E
   → Nav strip links back to Tier-1 Evidence Brief and Narrative Brief
```

All content derived from canonical sources. No inference. No advisory language.

---

## E. DEFERRED SCOPE

| Item | Reason for deferral |
|---|---|
| `/api/query` endpoint | Requires traversal engine; not needed for Narrative-only MVP |
| `tier2_trace_graph.py` traversal engine | Phase 2 dependency; propagation paths statically rendered for Phase 1 |
| Interactive WHY/TRACE/EVIDENCE query execution | Live query UI requires `/api/query` |
| Zone-click → live trace expansion | Requires query engine |
| Tier-2 publish-safe panel button in UI | Low-effort; can ship alongside or in immediate follow-on |
| SKILLS.md BRAIN_WRITE_GUARD rule persistence | Separate governance action on `main` |

---

## F. RECOMMENDED FIRST IMPLEMENTATION SEQUENCE

```
Step 1 — Generator: scripts/pios/lens_report_generator.py
  1a. Add _TIER2_DIAGNOSTIC_CSS (inherits Tier-1 variable set; 960px, dark theme)
  1b. Add _build_tier2_diagnostic_narrative(topology, signals, gauge, publish_safe)
      Section 0: Header from gauge_state + topology grounding summary
      Section 1: Overview from zone derivation (WEAKLY GROUNDED domain count,
                 pressure_distribution, contradiction_presence from signal patterns)
      Section 2: Zone Inventory — one card per WEAKLY GROUNDED domain
                 (zone_id, zone_type, severity, confidence, traceability_status)
      Section 3: Per-zone blocks A–F — all fields from signal_registry per domain
                 Query hooks as static labeled sections (not live)
      Nav strip with /api/report-file cross-links
  1c. Add generate_tier2_reports(output_dir=None)
  1d. Extend generate_tier1_reports() or main() to also invoke tier2
  1e. Extend argparse with --tier2 flag

Step 2 — API: app/gauge-product/pages/api/report.js
  Add TIER2_LABELS entries.
  Parse tier2 output lines.
  Include tier2 files in response.

Step 3 — API: app/gauge-product/pages/api/report-file.js
  Add VALID_TIER2 regex.
  Extend resolveFilePath() with tier2 path resolution.

Step 4 — UI: app/gauge-product/pages/lens.js + styles/gauge.css
  Add "Diagnostic Narrative (Internal)" button to ReportPanel.
  Minimal CSS addition for any new class if needed.
```

Steps are sequential. Each step has no external dependency beyond the previous step. Total surface change is analogous to the Tier-1 upgrade already executed on this branch.

---

## IMPLEMENTATION CONTRACT READY STATE

```
Stream:         TIER2.DIAGNOSTIC.NARRATIVE.IMPLEMENT.01
Branch target:  feature/tier2-diagnostic-narrative-implement-01 (new from main)
Stable anchor:  f02d026 (current HEAD of feature/gauge-tier1-report-upgrade-02)
Authority refs:
  brain/product   e3125a7  (TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01)
  brain/canonical 5545fe5  (diagnostic_zone_construct)
Files to modify:
  scripts/pios/lens_report_generator.py
  app/gauge-product/pages/api/report.js
  app/gauge-product/pages/api/report-file.js
  app/gauge-product/pages/lens.js
  app/gauge-product/styles/gauge.css  (minor)
Files NOT touched:
  all brain/* branches
  all Tier-1 content
  generator core logic
Deferred:
  /api/query, traversal engine, live query UI
```
