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
| `compose_system_intelligence()` | full-domain overview; 2-col layout when domain count > 10 |
| `compose_topology_view(light_mode)` | SVG topology; `light_mode=True` produces white background for print |
| `compose_focus_domain()` | Focus domain spotlight section |
| `_domain_row(label, score, confidence)` | Single domain row renderer |

---

## Input Authority Classification

Each function consumes one of two input classes. This classification is authoritative.

| Function | Input Class | Source |
|---|---|---|
| `compose_system_intelligence()` | DYNAMIC | Normalized domain payload from 40.4 chain |
| `compose_topology_view()` | STATIC | Curated graph fixture (projection scaffold) |
| `compose_focus_domain()` | DYNAMIC | Focus domain record from LENS runtime payload |
| `_domain_row()` | DYNAMIC | Individual domain tuple from 40.4 chain |
| `build_html()` | MIXED | Section outputs (DYNAMIC) + report metadata (DYNAMIC) |

**DYNAMIC** = sourced from runtime payload / 40.4 chain — authoritative for scores, confidence, domain selection.  
**STATIC** = sourced from curated fixture — authoritative for topology layout and SVG rendering only. Not a source of truth for evidential outputs.

---

## Flow Mapping

Explicit consumes → governed_by → produces chain per function.

---

### compose_system_intelligence()

**Consumes:**
- Domain list: normalized domain tuples (label, score, confidence) from 40.4 output payload
- Domain count threshold: integer (determines single vs 2-column layout)

**Governed by:** [[../canonical/streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01]]

**Produces:**
- HTML domain overview section (n rows or 2-column grid when count > 10; n determined by client environment)
- Embedded in LENS executive report

**Flow:**
`compose_system_intelligence()` → consumes: normalized_domain_payload (40.4) → governed_by: PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01 → produces: domain overview HTML block

---

### compose_topology_view(light_mode)

**Consumes:**
- Curated graph data: static governed fixture (BlueEdge reference: 17 nodes, 12 edges, 5 clusters — client engagements will use client-specific fixture)
- light_mode flag: boolean (True = print-safe, white background)

**Governed by:** [[../canonical/streams/PRODUCTIZE.LENS]]

**Produces:**
- SVG topology artifact embedded in HTML report
- White background (#ffffff), dark labels when light_mode=True
- Dark field when light_mode=False (web surface)

**Flow:**
`compose_topology_view(light_mode=True)` → consumes: curated_graph_fixture → governed_by: PRODUCTIZE.LENS → produces: print-safe topology SVG

---

### compose_focus_domain()

**Consumes:**
- Focus domain selection: single domain record (label, score, rationale) — highest-leverage domain from LENS payload

**Governed by:** [[../canonical/streams/PRODUCTIZE.LENS]]

**Produces:**
- Focus domain spotlight HTML section
- Embedded as named section in LENS executive report

**Flow:**
`compose_focus_domain()` → consumes: focus_domain_record (LENS payload) → governed_by: PRODUCTIZE.LENS → produces: focus domain HTML block

---

### _domain_row(label, score, confidence)

**Consumes:**
- label: string — domain display name (ZONE-2 safe, no internal identifiers)
- score: integer — 0–100
- confidence: string — confidence band descriptor

**Governed by:** [[../canonical/streams/PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01]]

**Produces:**
- Single domain row HTML fragment
- Consumed by compose_system_intelligence()

**Flow:**
`_domain_row(label, score, confidence)` → consumes: individual domain tuple → governed_by: PRODUCTIZE.STRUCTURAL.TRUTH.40.4.01 → produces: domain row HTML fragment

---

### build_html()

**Consumes:**
- All section outputs from: compose_system_intelligence(), compose_topology_view(), compose_focus_domain()
- STREAM_ID constant
- Report metadata: timestamp, client context

**Governed by:** [[../canonical/streams/PRODUCTIZE.LENS]]

**Produces:**
- Complete LENS executive report (lens_report_YYYYMMDD_HHMMSS.html)
- 10 governed sections assembled in deterministic order
- STREAM_ID embedded in artifact

**Flow:**
`build_html()` → consumes: all section outputs + metadata → governed_by: PRODUCTIZE.LENS → produces: lens_report_YYYYMMDD_HHMMSS.html

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
