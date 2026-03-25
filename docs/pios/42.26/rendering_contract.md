# Rendering Contract — 42.26

Source: app/execlens-demo/components/TopologyPanel.js
Branch: feature/42-25-topology-highlight-color-remediation
Date: 2026-03-25
Narrowed: 42.26N — 2026-03-25

---

## Scope Constraint

Rendering contract applies ONLY to:
- topology
- overview
- list
- query

No ENL or persona rendering is validated in this stream. Those surfaces belong to ENL-010 integration and require a separate governed baseline.

---

## Topology

- Structure: domain → capability → component hierarchy (from 42.7 adapter)
- Highlight: driven by `selectedQuery` prop → `?topology=true&highlight=<selectedQuery>`
- No synthetic highlighting — all highlighted flags come from adapter output
- No projection-based coloring — no 43/44 RED-node semantics
- Structural hierarchy preserved — no flat exposure rendering
- Color classes (from globals.css 42.24/42.25 block):
  - `.topo-domain-highlighted` — blue border (#3b82f6), light blue background
  - `.topo-cap-highlighted` — yellow border (#facc15), yellow background
  - `.topo-chip-highlighted` — teal border (#5eead4), teal background, green text
  - `.topo-highlight-dot` — yellow dot (#facc15) with glow

## General

- UI must reflect adapter output only
- No client-side data fabrication
- No synthetic nodes
- No fallback to alternative adapters without explicit contract
- Adapter timeout: 30 seconds — UI must handle gracefully
