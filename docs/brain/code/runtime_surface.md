---
type: code-node
brain: code
path: app/gauge-product/
---

# runtime_surface

## Purpose

Next.js application forming the GAUGE/LENS runtime surface. Renders the executive intelligence view, handles report delivery, and manages commercial access gating. This is the L6 execution environment.

---

## Key Files

| File | Responsibility |
|---|---|
| `pages/lens.js` | Primary LENS view; fetches ZONE-2 projections; manages access gate state |
| `pages/plans.js` | Static product ladder page — three tiers: LENS, Diagnostic, Enterprise |
| `pages/api/report.js` | Invokes Python generator; returns web-accessible report URL |
| `pages/api/report-file.js` | Serves HTML report by filename; validates pattern; prevents path traversal |
| `lib/lens/useAccessGate.js` | Hook managing access gate state; localStorage key: `lens_access_granted` |
| `components/lens/AccessGateModal.js` | Access gate modal; two modes: capability list, key entry |
| `components/lens/ExploreGovernedDetail.js` | Detail row renderer with gating support |
| `components/lens/EvidenceDepthIndicator.js` | Depth indicator with unlock CTA |
| `components/lens/curatedGraphData.js` | Static governed topology fixture — 17 nodes, 12 edges, 5 clusters |
| `styles/gauge.css` | All LENS/GAUGE styles including gate overlay, modal, report, topology |

---

## Key Architecture Decisions

- Report delivery: filesystem path never exposed to client. `/api/report-file` validates `VALID_FILENAME = /^lens_report_\d{8}_\d{6}\.html$/` before serving.
- Access gating: `useAccessGate` returns `{hasAccess, modalOpen, showModal, hideModal, grantAccess}`. No backend validation.
- Zone-2 enforcement: CLM-09, CLM-20, CLM-25, CLM-12, CLM-10 consumed. No SIG-, DOMAIN-, CAP-, COMP- in rendered output.

---

## Streams That Modified This Node

| Stream | Change |
|---|---|
| PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01 | Report delivery fix; /api/report and /api/report-file created |
| PRODUCTIZE.LENS.COMMERCIAL.GATING.01 | Access gating, plans page, AccessGateModal, useAccessGate |
| PRODUCTIZE.LENS.FINAL.POLISH.01 | Gating polish, report button labels, light mode topology |
| PRODUCTIZE.LENS.MICRO.POLISH.01 | Row overflow fix (120px → auto), 2-col domain layout |

---

## Related Canonical Nodes

governed_by: [[../canonical/streams/PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01]]
governed_by: [[../canonical/streams/PRODUCTIZE.LENS]]

---

## Invariants Impacting This Node

- [[../canonical/04_INVARIANTS]] — INV-08 (ZONE-2 purity)
- [[../canonical/04_INVARIANTS]] — INV-05 (no cross-layer mutation)

---

## Dependent Outputs

- LENS executive view at `/lens` route
- Report artifact via `/api/report` → `/api/report-file`
- Plans page at `/plans`
