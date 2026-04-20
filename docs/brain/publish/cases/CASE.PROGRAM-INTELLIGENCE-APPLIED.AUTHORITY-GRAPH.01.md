---
name: CASE.PROGRAM-INTELLIGENCE-APPLIED.AUTHORITY-GRAPH.01
type: brain-case
brain: publish
stream: WEB.EXECUTION.AUTHORITY.GRAPH.01
route: /program-intelligence-applied/
date: 2026-04-20
pattern: PATTERN.AUTHORITY.GRAPH.INTEGRATION.01
---

# CASE.PROGRAM-INTELLIGENCE-APPLIED.AUTHORITY-GRAPH.01

## Route

`/program-intelligence-applied/`  
Route class: BRIDGE

---

## Triggers Resolved

```
G-01 (ISOLATED PAGE):    RESOLVED — CLEAR
G-02 (MISSING ROOT LINK): RESOLVED — CLEAR
```

---

## Detection Baseline (Pre-Resolution)

```
G-01: ACTIVE — zero inbound links from any governed pages/ file
G-02: ACTIVE — no navigable path from root authority nodes to this route
Full Governance Condition 4: FAILING
```

---

## Parent Page Used

```
Parent:     /program-intelligence/
File:       pages/program-intelligence.md
Basis:      AG-1 — BRIDGE class; nearest authority construct page that the bridge
            connects FROM; /program-intelligence-applied/ bridges PI discipline
            to Signäl/LENS product surface; upstream authority = /program-intelligence/
```

---

## Inbound Link Added

```
File:       krayu-mirror/pages/program-intelligence.md
Section:    Signal Infrastructure
Placement:  New sentence inserted after existing Signal Infrastructure paragraph,
            before the [Signal Infrastructure →] link reference
Sentence:   "For technology leadership considering how Program Intelligence becomes
             operational in practice, [Program Intelligence Applied](/program-intelligence-applied/)
             describes the engagement path and what the LENS Assessment produces."
```

AG-3 compliance:
- ✓ Semantically aligned section (Signal Infrastructure → operational application of PI)
- ✓ Complete sentence establishing reader value
- ✓ Anchor text = destination page governing name ("Program Intelligence Applied")
- ✓ Not a list item
- ✓ Not opening line of page
- ✓ No duplicate anchor text in paragraph

AG-4 compliance:
- ✓ No navigation structure modified
- ✓ No menu entries added
- ✓ No base.njk modification

---

## Optional Second Inbound Link (TASK 3)

```
Candidate: pages/pios.md → /program-intelligence-applied/
Decision:  NOT ADDED
Reason:    pios.md covers PiOS system architecture (signal derivation, transformation chain).
           /program-intelligence-applied/ covers technology leadership engagement + LENS
           Assessment. The connection is indirect (PiOS → Signäl → LENS → engagement).
           No clearly semantically aligned paragraph in pios.md justifies the link
           without forcing it. AG-3 condition not met — omitted per stream constraint.
```

---

## Validation Results

```
G-01 POST-CHECK:
  Inbound scan of all pages/*.md:
    pages/program-intelligence.md:144 — [Program Intelligence Applied](/program-intelligence-applied/)
  Result: ≥1 inbound contextual link from governed page
  G-01: CLEAR ✓

G-02 POST-CHECK:
  Root authority set: { /, /program-intelligence/ }
  Path: / (index.md → Explore list → /program-intelligence/) → /program-intelligence/
        (program-intelligence.md → Signal Infrastructure section → /program-intelligence-applied/)
  G-02: CLEAR ✓

BUILD:
  Eleventy v3.1.2 — 17 files in 0.12 seconds
  Exit code: 0 ✓

SITEMAP:
  https://mirror.krayu.be/program-intelligence-applied/ present ✓

BROKEN LINKS:
  No new links introduced to ungoverned routes ✓

SEMANTIC REGRESSION:
  One sentence inserted in Signal Infrastructure section
  No new claims introduced
  No prohibited terms introduced
  Existing page meaning unchanged ✓
```

---

## Full Governance Condition — Post-Resolution

```
CONDITION 1 — Route governed:         PASS (verdict:allowed)
CONDITION 2 — Page compiled:          PASS (pages/program-intelligence-applied.md)
CONDITION 3 — Page published:         PASS (publish_status:live; in sitemap)
CONDITION 4 — Authority graph connected: PASS
  G-01: CLEAR — inbound link from pages/program-intelligence.md
  G-02: CLEAR — path exists from root authority node

OVERALL: FULLY GOVERNED ✓
```

---

## Pattern Assessment

```
Pattern applied:    PATTERN.AUTHORITY.GRAPH.INTEGRATION.01
New sub-pattern:    NOT REQUIRED
  This case followed the pattern exactly as defined. No new edge cases,
  no new blocking conditions, no new trigger variants encountered.
  Per P-4: no brain module update required beyond this closure record.
```

---

*CASE.PROGRAM-INTELLIGENCE-APPLIED.AUTHORITY-GRAPH.01 — Publish Brain Authority Graph Closure | stream: WEB.EXECUTION.AUTHORITY.GRAPH.01 | 2026-04-20*
