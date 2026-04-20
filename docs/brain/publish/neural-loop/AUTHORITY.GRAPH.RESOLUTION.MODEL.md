---
name: AUTHORITY.GRAPH.RESOLUTION.MODEL
type: brain-module
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.PATTERN.AUTHORITY.GRAPH.01
---

# AUTHORITY.GRAPH.RESOLUTION.MODEL

## Purpose

Define the formal rules governing authority graph detection, parent selection, link placement, and enforcement. These rules are deterministic — the same page state always produces the same resolution output. Applied by PATTERN.AUTHORITY.GRAPH.INTEGRATION.01.

---

## Detection Algorithm

```
ALGORITHM: AUTHORITY GRAPH GAP DETECTION

INPUT:
  target_route:       the route under evaluation (must be governed + compiled + published)
  pages_directory:    all pages/ files in krayu-mirror
  root_authority_set: { /program-intelligence/, / }

STEP 1 — INBOUND LINK SCAN (G-01 check)
  For each file F in pages_directory where F != target_route:
    Extract all markdown links [text](href) from F
    If any href matches target_route → target has ≥1 inbound link → G-01 CLEAR
  If no inbound link found in any F → G-01 ACTIVE

STEP 2 — ROOT PATH CHECK (G-02 check)
  Build directed link graph from pages_directory:
    node = route (derived from filename)
    edge = any link in that page to another route
  Check if any path exists from any node in root_authority_set to target_route
  If path exists → G-02 CLEAR
  If no path exists → G-02 ACTIVE

OUTPUT:
  G-01: ACTIVE | CLEAR
  G-02: ACTIVE | CLEAR
  AUTHORITY_GRAPH_STATE: GAP (if G-01 or G-02 ACTIVE) | CONNECTED (if both CLEAR)
```

---

## Classification

```
STATE: AUTHORITY_GRAPH_GAP

Definition:
  A governed, compiled, and published page that cannot be reached through
  inbound links from any governed page in the mirror, or that has no navigable
  path from a root authority node.

This state is NOT:
  - a route validity failure
  - a governance failure
  - a semantic issue
  - a pipeline failure

It IS:
  - a structural visibility failure
  - a discoverability failure
  - a hierarchy integrity failure

A page in AUTHORITY_GRAPH_GAP state is considered INCOMPLETELY GOVERNED.
```

---

## AG-1 — Parent Selection Rule

```
RULE AG-1: PARENT AUTHORITY NODE SELECTION

Given:
  target_route:    route under evaluation
  route_class:     from route_source_map.yaml (BRIDGE | DERIVED | CANONICAL | SNAPSHOT-DERIVED)

Resolution:

  IF route_class = BRIDGE:
    Parent = the nearest authority construct page that the bridge connects FROM
    Selection: the canonical PI construct page most closely related to the bridge subject
    Default: /program-intelligence/ (primary PI authority surface)
    Override: if bridge connects to a more specific construct page (e.g. /pios/, /signal-infrastructure/),
              select the most specific applicable construct page

  IF route_class = DERIVED:
    Parent = the canonical construct page from which this route derives
    Source: route_source_map.yaml cat_entity → find corresponding construct page
    Example: a DERIVED page from execution_blindness.md → parent = /execution-blindness/

  IF route_class = CANONICAL:
    Parent = root authority index (/)
    If CANONICAL page covers a sub-construct: parent = the construct's parent page

  IF route_class = SNAPSHOT-DERIVED:
    Parent = nearest thematically related governed page
    If no clear thematic parent: parent = /program-intelligence/ (default authority root)

VALIDATION:
  Selected parent MUST:
    □ Have route_source_map.yaml entry with verdict:allowed
    □ Have a corresponding pages/ file
    □ Be published (publish_status:live)
  If selected parent fails validation → select next closest valid parent
  If no valid parent exists → escalate: AUTHORITY GRAPH stream cannot execute
```

---

## AG-2 — Inbound Link Requirement

```
RULE AG-2: INBOUND LINK MINIMUM

A governed page is NOT fully governed unless:

  □ At least 1 inbound contextual link from at least 1 other governed pages/ file
  □ At least 1 navigable path from a root authority node (/ or /program-intelligence/)
    to the target route through the internal link graph

MINIMUM:
  1 inbound link satisfies both conditions if:
  - the linking page is itself reachable from root, AND
  - the link is a contextual content link (not template/navigation)

BRIDGE class additional requirement:
  The inbound link MUST come from a page that is thematically upstream
  (the authority construct page, not a peer or a less authoritative page).
  Example: /program-intelligence-applied/ must receive its link from
  /program-intelligence/ or /pios/, not from another bridge or expansion page.
```

---

## AG-3 — Link Placement Rule

```
RULE AG-3: CONTEXTUAL LINK PLACEMENT

Links added to satisfy AG-2 MUST be placed in:
  □ A paragraph or section that is semantically related to the target page's subject
  □ A position where the link provides genuine navigational value to the reader
  □ A complete sentence that establishes why the reader would follow the link

Links MUST NOT be placed in:
  ✗ Bullet lists added solely to satisfy the link requirement with no editorial content
  ✗ A section that has no semantic relationship to the target page
  ✗ The opening line of the page (creates clutter before the page establishes its own identity)

ANCHOR TEXT RULE:
  Anchor text MUST:
    □ Describe the destination accurately (not generic "here" or "this page")
    □ Use the destination page's governing name or a close descriptive variant
    □ Not duplicate an anchor text already used for a different destination in the same paragraph

EXAMPLE (valid):
  "For technology leadership considering how to engage, the [Program Intelligence Applied](/program-intelligence-applied/)
   page describes the engagement path and what the LENS Assessment produces."

EXAMPLE (invalid):
  "See also: [Program Intelligence Applied](/program-intelligence-applied/)"
  — link is a list item with no editorial context
```

---

## AG-4 — Navigation Pollution Prevention Rule

```
RULE AG-4: NO NAVIGATION POLLUTION

The AUTHORITY GRAPH stream MUST NOT:
  ✗ Add the target route to the top navigation structure (base.njk navigation, header links)
  ✗ Create a new menu entry or navigation section for the target route
  ✗ Modify navigation_structure.yaml or any equivalent navigation registry
  ✗ Place inbound links in site header, footer, or breadcrumb templates

Authority graph connectivity = internal contextual linking between content pages
Authority graph connectivity ≠ navigation menu inclusion

Navigation menu changes require a separate, explicitly scoped stream.
```

---

## Full Governance Condition (Updated)

```
A page is FULLY GOVERNED when ALL of the following are true:

  □ CONDITION 1 — Route governed
      route_source_map.yaml entry exists with verdict:allowed

  □ CONDITION 2 — Page compiled
      pages/<route>.md exists

  □ CONDITION 3 — Page published
      publish_status:live AND route appears in sitemap.xml

  □ CONDITION 4 — Authority graph connected  [NEW]
      G-01 CLEAR: ≥1 inbound contextual link from another governed pages/ file
      G-02 CLEAR: navigable path exists from a root authority node to this route

FAILURE:
  If any condition fails, the page is INCOMPLETELY GOVERNED.
  Each failure maps to a stream type:
    Condition 1 → GOVERNANCE RECONCILIATION or INTEGRITY
    Condition 2 → INTEGRITY
    Condition 3 → INTEGRITY
    Condition 4 → AUTHORITY GRAPH (this model)
```

---

*AUTHORITY.GRAPH.RESOLUTION.MODEL — Neural Publish Operating Loop | origin: BRAIN.PATTERN.AUTHORITY.GRAPH.01 | 2026-04-20*
