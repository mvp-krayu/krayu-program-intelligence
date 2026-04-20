---
name: CASE.AUTHORITY.GRAPH.BASELINE.01
type: brain-case
brain: publish
stream: BRAIN.PATTERN.AUTHORITY.GRAPH.01
route: /program-intelligence-applied/
date: 2026-04-20
---

# CASE.AUTHORITY.GRAPH.BASELINE.01

## Purpose

Reference case establishing the AUTHORITY GRAPH trigger class and documenting the first observed instance of AUTHORITY_GRAPH_GAP state. This case is the origin reference for PATTERN.AUTHORITY.GRAPH.INTEGRATION.01.

---

## Route Under Evaluation

```
Route:            /program-intelligence-applied/
Route class:      BRIDGE
Governed:         YES — route_source_map.yaml verdict:allowed
Compiled:         YES — pages/program-intelligence-applied.md exists
Published:        YES — publish_status:live; appears in sitemap.xml
```

---

## Detection Results (AUTHORITY GRAPH GAP DETECTION)

```
G-01 CHECK — INBOUND LINK SCAN:
  Scan target:    /program-intelligence-applied/ in all pages/ files
  Files scanned:  all pages/*.md in krayu-mirror (excluding target itself)
  Result:         ZERO inbound links found from any governed pages/ file
  G-01 STATE:     ACTIVE

G-02 CHECK — ROOT PATH CHECK:
  Root authority set: { /, /program-intelligence/ }
  Path from /:               none (no page links to /program-intelligence-applied/)
  Path from /program-intelligence/:  none (program-intelligence.md has no link to target)
  G-02 STATE:     ACTIVE

AUTHORITY_GRAPH_STATE: GAP
```

---

## Full Governance Conditions at Baseline

```
CONDITION 1 — Route governed:        PASS
CONDITION 2 — Page compiled:         PASS
CONDITION 3 — Page published:        PASS
CONDITION 4 — Authority graph connected: FAIL
  G-01: ACTIVE
  G-02: ACTIVE

OVERALL: INCOMPLETELY GOVERNED
```

---

## AG-1 Parent Resolution

```
Route class:       BRIDGE
Rule applied:      AG-1 BRIDGE — nearest authority construct page that bridge connects FROM
Evaluation:
  /program-intelligence-applied/ bridges PI discipline → Signäl/LENS product
  The construct being bridged FROM = Program Intelligence (/program-intelligence/)
  No more specific construct page applies (not a PIOS or signal-infrastructure bridge)
Selected parent:   /program-intelligence/
Parent validation:
  □ route_source_map.yaml entry: verdict:allowed   PASS
  □ pages/program-intelligence.md exists           PASS
  □ publish_status: live                           PASS
Parent confirmed:  /program-intelligence/
```

---

## Resolution Stream

```
Pattern:        PATTERN.AUTHORITY.GRAPH.INTEGRATION.01
Stream type:    AUTHORITY GRAPH (single stream)
Required action: Add contextual inbound link sentence to pages/program-intelligence.md
                 in a semantically aligned paragraph
Link direction:  /program-intelligence/ → /program-intelligence-applied/
AG-3 placement:  Contextually aligned paragraph (not a list item)
AG-4 constraint: No navigation modification
```

---

## Execution Status

```
STATUS: PENDING — NOT EXECUTED IN THIS STREAM

This case was detected and classified during BRAIN.PATTERN.AUTHORITY.GRAPH.01.
The pattern was extracted and persisted. The WEB execution (adding the inbound
link to pages/program-intelligence.md) is out of scope for a brain pattern stream.

A separate AUTHORITY GRAPH stream must be opened to execute the resolution.
Until that stream executes and closes, G-01 and G-02 remain ACTIVE for this route,
and the route remains INCOMPLETELY GOVERNED.
```

---

## Pattern Registration

```
Pattern extracted:   PATTERN.AUTHORITY.GRAPH.INTEGRATION.01.md
Resolution model:    AUTHORITY.GRAPH.RESOLUTION.MODEL.md
MODULE.APPLICABILITY.MAP: G-01 and G-02 updated to reference pattern
CLOSURE.BRAIN.PERSISTENCE.MODEL: P-8 added
```

---

*CASE.AUTHORITY.GRAPH.BASELINE.01 — Publish Brain Authority Graph Reference Case | stream: BRAIN.PATTERN.AUTHORITY.GRAPH.01 | 2026-04-20*
