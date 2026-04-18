---
type: code-node
brain: code
path: scripts/pios/
---

# scripts_pios_py

## Purpose

Python execution scripts forming the PiOS processing chain. Primary responsibility is LENS HTML report generation — topology composition, domain intelligence assembly, and structural output production.

---

## Key Files

- `lens_report_generator.py` — Primary report generator. Entry point for LENS HTML report production.

---

## Key Functions

| Function | Responsibility |
|---|---|
| `build_html()` | Assembles full LENS report from 10 component sections |
| `compose_system_intelligence()` | 17-domain overview; 2-col layout when domain count > 10 |
| `compose_topology_view(light_mode)` | SVG topology; `light_mode=True` produces white background for print |
| `compose_focus_domain()` | Focus domain spotlight section |
| `_domain_row(label, score, confidence)` | Single domain row renderer |

---

## Streams That Modified This Node

| Stream | Change |
|---|---|
| PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01 | Added compose_system_intelligence, compose_topology_view, compose_focus_domain; build_html updated to 10 sections |
| PRODUCTIZE.LENS.FINAL.POLISH.01 | light_mode parameter; .topo-scroll-outer background #0d1117 → #f8fafc |
| PRODUCTIZE.LENS.MICRO.POLISH.01 | 2-column domain layout when len(domains) > 10; ceiling-split at (len+1)//2 |

---

## Related Canonical Nodes

governed_by: [[../canonical/streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]
governed_by: [[../canonical/streams/PRODUCTIZE.LENS]]

---

## Invariants Impacting This Node

- [[../canonical/04_INVARIANTS]] — INV-06 (Determinism — same inputs produce same report)
- [[../canonical/04_INVARIANTS]] — INV-08 (ZONE-2 — no internal identifiers in generated output)

---

## Dependent Outputs

- `lens_report_YYYYMMDD_HHMMSS.html` — served via /api/report-file
- STREAM_ID embedded in every generated report artifact
