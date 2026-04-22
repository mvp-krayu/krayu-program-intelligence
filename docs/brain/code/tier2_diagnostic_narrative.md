# Brain Node — Code
# Tier-2 Diagnostic Narrative

**Authority:** TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01
**Brain:** CODE
**Status:** NOT IMPLEMENTED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01.md

---

## IMPLEMENTATION STATUS

**NOT IMPLEMENTED**

No code exists for the Tier-2 Diagnostic Narrative at the time of this definition.

---

## REQUIRED IMPLEMENTATION UNITS

The following units MUST be created when the implementation stream is authorized.

### 1. Generator function
```
File:     scripts/pios/lens_report_generator.py
Function: _build_tier2_diagnostic_narrative(topology, signals, gauge, publish_safe=False)
Purpose:  Builds the full HTML Tier-2 diagnostic document from canonical data sources.
Inputs:   canonical_topology.json, signal_registry.json, gauge_state.json
Outputs:  clients/blueedge/reports/tier2/lens_tier2_diagnostic_narrative.html
          clients/blueedge/reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html
```

### 2. Generator integration
```
File:     scripts/pios/lens_report_generator.py
Function: generate_tier2_reports(output_dir=None)
Purpose:  Produces both internal and publish-safe Tier-2 artifacts.
Output:   [LENS REPORT] Generated: <path>  (2 lines)
```

### 3. API route extension
```
File:     app/gauge-product/pages/api/report.js
Change:   Add --tier2 flag or extend existing invocation.
          Parse Tier-2 output lines.
          Return files array includes Tier-2 entries.
Labels:
  lens_tier2_diagnostic_narrative.html     → "Diagnostic Narrative (Internal)"
  lens_tier2_diagnostic_narrative_pub.html → "Diagnostic Narrative (Publish)"
```

### 4. File-serve extension
```
File:     app/gauge-product/pages/api/report-file.js
Change:   Add VALID_TIER2 pattern to resolveFilePath.
          Serve from: reports/tier2/
          Serve from: reports/tier2/publish/
Filenames:
  lens_tier2_diagnostic_narrative.html
  lens_tier2_diagnostic_narrative_pub.html
```

### 5. UI panel extension
```
File:     app/gauge-product/pages/lens.js
Change:   Extend ReportPanel to include Tier-2 links after Evidence Brief buttons.
          Gating behavior (access control): TBD at implementation stream.
```

---

## BLOCKING DEPENDENCY

Product surface definition:
`docs/brain/product/TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01.md` — Status: DEFINED ✓

Canonical construct definition:
`docs/brain/canonical/diagnostic_zone_construct.md` — Status: DEFINED ✓

---

## VALIDATION REQUIREMENT

Implementation stream MUST validate:
- All six per-zone sub-sections (A–F) present in rendered output
- `inference_prohibition: ACTIVE` visible in every zone block
- Zero advisory language in any rendered section
- All cross-links resolve via `/api/report-file?name=...` (no bare filenames)
- Publish-safe variant applies Tier-1 obfuscation rules
- Node chains reference canonical node IDs only
