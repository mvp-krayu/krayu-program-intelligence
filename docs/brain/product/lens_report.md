---
type: product-node
brain: product
---

# lens_report

## What Is Being Offered

The LENS Executive Report: a print-ready HTML artifact produced at the end of each LENS Assessment engagement. Structured for board-level presentation. A structural view — not a status summary, not a narrative composition.

---

## System Capability Mapping

| Report Section | Canonical Basis | Code Basis |
|---|---|---|
| Executive readiness summary | [[../canonical/streams/PRODUCTIZE.LENS]] | [[../code/scripts_pios_py]] |
| System Intelligence Overview (17 domains) | [[../canonical/streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.2.01]] | [[../code/scripts_pios_py]] |
| Structural Topology View (SVG, light mode) | [[../canonical/streams/PRODUCTIZE.LENS]] | [[../code/scripts_pios_py]] |
| Focus Domain Spotlight | [[../canonical/streams/PRODUCTIZE.LENS]] | [[../code/scripts_pios_py]] |
| Score with confidence band | [[../canonical/streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]] | [[../code/runtime_surface]] |

---

## Evidence Supporting This Artifact

- Domain classifications from 40.2
- Normalized evidence from 40.3
- Validated handoff from 40.4
- ZONE-2 projection payload

---

## Constraints

- Filename format: `lens_report_YYYYMMDD_HHMMSS.html` — version-stamped, not user-named
- Served via `/api/report-file` — filesystem path never returned to client
- Light mode topology (white background, dark labels) — print-safe
- 2-column domain layout when domain count > 10 (ceiling-split)
- 10 governed sections — build_html assembles all sections deterministically

---

## What Is Measurable

- Report file present or absent (binary deliverable state)
- Section count: 10
- Domain count in system overview: 17
- Topology node count: 17, edge count: 12
- Timestamp precision: YYYYMMDD_HHMMSS

---

## Justified by

[[../canonical/streams/PRODUCTIZE.LENS]]
[[../canonical/streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]

## Implemented by

[[../code/scripts_pios_py]]
[[../code/runtime_surface]]

## Expressed as

[[../publish/lens_page]]
