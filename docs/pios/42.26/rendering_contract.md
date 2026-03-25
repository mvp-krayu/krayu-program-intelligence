# Rendering Contract — 42.26

Source: app/execlens-demo/components/TopologyPanel.js, ENLRevealPanel.js, PersonaPanel.js
Branch: feature/42-25-topology-highlight-color-remediation
Date: 2026-03-25

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

## ENL Chain Reveal

- Text-only output from 42.15 adapter (enl_console_adapter.py)
- Rendered verbatim — no transformation in UI (ER-001 rule)
- No interpretation added by panel
- No inference, no enrichment

## Persona Projection

- Persona allowlist: EXECUTIVE / CTO / ANALYST only
- Requires query param — no fallback persona
- Text-only output from 42.16 adapter (persona_view_map.py)
- Rendered verbatim
- Persona switch never changes selectedQuery (PS-001)

## General

- UI must reflect adapter output only
- No client-side data fabrication
- No synthetic nodes
- No fallback to alternative adapters without explicit contract
- Adapter timeout: 30 seconds — UI must handle gracefully
