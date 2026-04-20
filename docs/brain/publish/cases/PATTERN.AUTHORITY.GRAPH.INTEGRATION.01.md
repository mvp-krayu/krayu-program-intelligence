---
name: PATTERN.AUTHORITY.GRAPH.INTEGRATION.01
type: case-pattern
brain: publish
domain: cases
version: 1.0
origin_stream: BRAIN.PATTERN.AUTHORITY.GRAPH.01
---

# PATTERN.AUTHORITY.GRAPH.INTEGRATION.01

## Pattern Name

Authority Graph Integration — Isolated Governed Page with No Inbound Links

---

## Applicability Conditions

This pattern applies when ANY of the following are true for a governed page:

```
1. G-01 ACTIVE — pages/<route>.md has zero inbound links from any other pages/ file
2. G-02 ACTIVE — no navigable path exists from any root authority node
                  (/ or /program-intelligence/) to the route through the link graph

AND:
3. Route is governed:   route_source_map.yaml verdict:allowed
4. Page is compiled:    pages/<route>.md exists
5. Page is published:   publish_status:live (or preview-pending-publish)
```

Do NOT apply this pattern if:
- The page is not yet governed (apply GOVERNANCE RECONCILIATION or INTEGRITY first)
- Route conditions 1–4 are not yet fully satisfied (Full Governance Condition 1–3 must pass first)
- The isolation is by deliberate design with explicit governance declaration

---

## Trigger Signature

```
Primary triggers:  G-01 (ISOLATED PAGE) and/or G-02 (MISSING ROOT LINK)
Route state:       governed + compiled + published
Authority state:   AUTHORITY_GRAPH_GAP
```

---

## Pattern Classification

```
State assigned:    AUTHORITY_GRAPH_GAP
State type:        Structural visibility failure (NOT route failure, NOT governance failure)
Stream type:       AUTHORITY GRAPH (single stream — not multi-step)
```

---

## Required Stream Sequence

Single stream: AUTHORITY GRAPH

```
STEP 1 — DETECT
  Run AUTHORITY GRAPH GAP DETECTION algorithm (AUTHORITY.GRAPH.RESOLUTION.MODEL):
    □ Confirm G-01 state (inbound link scan across all pages/)
    □ Confirm G-02 state (path check from root authority nodes)
    □ Confirm page is governed, compiled, published (Full Governance Conditions 1–3)
  Output: { G-01: ACTIVE|CLEAR, G-02: ACTIVE|CLEAR, route_class, parent_candidates }

STEP 2 — CLASSIFY
  If G-01 ACTIVE or G-02 ACTIVE:
    Assign state: AUTHORITY_GRAPH_GAP
  If both CLEAR:
    Pattern does not apply — exit; report AUTHORITY_GRAPH_STATE: CONNECTED

STEP 3 — RESOLVE PARENT
  Apply AUTHORITY.GRAPH.RESOLUTION.MODEL AG-1:
    Select parent authority node based on route_class
    Validate parent: governed + compiled + published
  Output: { parent_route, parent_page_path, parent_section_for_link }

STEP 4 — DRAFT INBOUND LINK
  Apply AUTHORITY.GRAPH.RESOLUTION.MODEL AG-3:
    Identify the semantically aligned paragraph in parent_page_path
    Draft the inbound link sentence:
      - anchor text = target route's governing name
      - placement = contextual paragraph (not list item)
      - sentence establishes reader value
  Verify AG-4: no navigation pollution

STEP 5 — APPLY
  Edit parent_page_path (in krayu-mirror/pages/):
    Insert the inbound link sentence at the identified placement
    Do not restructure the parent page; do not add new sections
    Minimal edit: one sentence insertion in existing contextual prose

STEP 6 — VERIFY
  Re-run DETECT algorithm:
    □ G-01: re-scan — must return CLEAR (parent page now contains inbound link)
    □ G-02: re-check path — must return CLEAR
    □ No new triggers introduced on parent page (no dangling links, no prohibited terms)

STEP 7 — CLOSE
  Persist case file:
    docs/brain/publish/cases/CASE.<ROUTE>.AUTHORITY-GRAPH.01.md
  Run Eleventy build (verify compile exits 0)
```

---

## Blocking Conditions

```
BLOCK-01: No valid parent available
  If AG-1 parent selection finds no valid governed parent → STOP
  Escalate: an ungoverned or uncompiled parent cannot receive a link.
  Resolve: govern the parent page first; then re-enter pattern.

BLOCK-02: Parent page requires semantic rewrite to accommodate link
  If the only semantically aligned section does not exist on the parent page
  → this pattern is blocked
  → a SEMANTIC ALIGNMENT or BRIDGE stream must first create appropriate content
  → then re-enter AUTHORITY GRAPH pattern

BLOCK-03: Inbound link would create a dangling link
  If target route is not yet live (publish_status not live)
  → do not add inbound link from a live page to a non-live page
  → resolve: run PROMOTION REVIEW to promote target to live first
```

---

## Promotion Criteria (single stream — no PROMOTION REVIEW required)

```
An AUTHORITY GRAPH stream is complete when:

  □ G-01 CLEAR: target page has ≥1 inbound contextual link from a governed page
  □ G-02 CLEAR: navigable path exists from root authority to target
  □ Inbound link sentence placed in semantically aligned context (AG-3)
  □ No navigation elements modified (AG-4)
  □ Eleventy build exits 0 after link insertion
  □ No new triggers introduced by the link edit
  □ Case file persisted
```

---

## Stop / Escalation Conditions

```
STOP if:
  - Any escalation trigger from CANONICAL.ESCALATION.MODEL fires during detection
    (e.g. the target route is found to be UNGOVERNED — route authority precondition violated)
  - Anti-drift violation detected during link drafting
    (e.g. proposed anchor text redefines a canonical construct)

HOLD if:
  - BLOCK-01: no valid parent available
  - BLOCK-02: parent requires content before link is possible
  - BLOCK-03: target not live
```

---

## Closure Criteria

```
□ G-01 CLEAR after edit
□ G-02 CLEAR after edit
□ pages/<parent>.md contains inbound link sentence
□ No navigation modified
□ Eleventy build: 0 errors
□ Case file persisted: docs/brain/publish/cases/CASE.<ROUTE>.AUTHORITY-GRAPH.01.md
```

---

## Reference Case

First instance: `/program-intelligence-applied` (2026-04-20)

- G-01 state at baseline: ACTIVE (zero inbound links from other pages/ files)
- G-02 state at baseline: ACTIVE (no path from / or /program-intelligence/ to this route)
- Route class: BRIDGE
- AG-1 parent: /program-intelligence/
- Baseline case file: `cases/CASE.AUTHORITY.GRAPH.BASELINE.01.md`
- Resolution stream: pending (not executed in BRAIN.PATTERN.AUTHORITY.GRAPH.01)

---

*PATTERN.AUTHORITY.GRAPH.INTEGRATION.01 — Publish Brain Case Pattern | origin: BRAIN.PATTERN.AUTHORITY.GRAPH.01 | 2026-04-20*
