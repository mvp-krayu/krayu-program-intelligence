---
name: MODULE.APPLICABILITY.MAP
type: brain-module
brain: publish
domain: retrieval
version: 1.0
origin_stream: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01
---

# MODULE.APPLICABILITY.MAP

## Purpose

For each trigger pattern defined in TRIGGER.PATTERN.MODEL, define which modules must be applied and in which order, and which stream type is active.

---

## Applicability Map

```
TRIGGER: R-01 (UNGOVERNED ROUTE)
  APPLIES:
    1. WEB.SOURCE.ENTRY.PATTERN    — confirm route is absent from R1
    2. ROUTE.CLASSIFICATION.MODEL  — classify the route
    3. ENTRY.GATE.RULESET          — determine if registration is possible
    4. PIPELINE.HANDOFF.MODEL      — define path to governed state
  STREAM TYPE: GOVERNANCE RECONCILIATION → or INTEGRITY (if route is invalid)

  SUB-PATH: R-01 + BRIDGE classification + ESCALATION CONDITION 5
    Condition: ROUTE.CLASSIFICATION.MODEL returns BRIDGE AND
               FAILURE.ESCALATION.RULES CONDITION 5 fires (no Publish Brain
               controlled claims table exists for the route)
    Required stream sequence (3 streams, strict order):
      1. GOVERNANCE RECONCILIATION — establish controlled claims basis;
                                     register retrospective route authority
      2. BRIDGE                    — create governed mirror page from
                                     controlled claims table
      3. PROMOTION REVIEW          — verify criteria; upgrade from
                                     provisional/preview to allowed/live
    Do not combine stream types. Each stream is a separate governed execution.
    See: cases/PATTERN.BRIDGE.ROUTE.ENTRY.RESOLUTION.01.md

TRIGGER: R-02 (UNMIRRORED ROUTE)
  APPLIES:
    1. ENTRY.GATE.RULESET          — verify all pre-conditions are met
    2. PIPELINE.HANDOFF.MODEL      — execute from Stage 3 (compile stage)
  STREAM TYPE: INTEGRITY

TRIGGER: R-03 (UNMAPPED ROUTE)
  APPLIES:
    1. ENTRY.GATE.RULESET          — confirm publish_status:live is set
    2. PIPELINE.HANDOFF.MODEL      — Stage 4 (Eleventy + sitemap)
  STREAM TYPE: INTEGRITY

TRIGGER: R-04 (PHANTOM ROUTE)
  APPLIES:
    1. WEB.SOURCE.ENTRY.PATTERN    — confirm the mismatch
    2. ENTRY.GATE.RULESET          — reject the sitemap entry (no backing source)
  STREAM TYPE: INTEGRITY

TRIGGER: R-05 (BLOCKED ROUTE)
  APPLIES:
    1. ENTRY.GATE.RULESET          — confirm blocked verdict, prevent pipeline inclusion
  STREAM TYPE: INTEGRITY (removal or reclassification)

TRIGGER: R-06 (DANGLING LINK)
  APPLIES:
    1. WEB.SOURCE.ENTRY.PATTERN    — determine whether target route exists on krayu.be
    2. ROUTE.CLASSIFICATION.MODEL  — if route exists ungoverned, classify it
    3. ENTRY.GATE.RULESET          — determine governance path
  STREAM TYPE: INTEGRITY or GOVERNANCE RECONCILIATION

TRIGGER: C-01 (SEMANTIC DRIFT)
  APPLIES:
    (No source entry modules)
    → Publish Execution Model: SEMANTIC ALIGNMENT stream type
  STREAM TYPE: SEMANTIC ALIGNMENT

TRIGGER: C-02 (SURFACE DESYNC)
  APPLIES:
    1. PIPELINE.HANDOFF.MODEL      — determine which pipeline stage introduced the desync
  STREAM TYPE: INTEGRITY or DURABILITY (depending on source of desync)

TRIGGER: C-03 (UNGROUNDED CLAIM)
  APPLIES:
    1. ROUTE.CLASSIFICATION.MODEL  — verify the route's authority class allows the claim
    → If BRIDGE class: consult Publish Brain controlled claims table
    → If CANONICAL/DERIVED: escalate to Canonical Brain
  STREAM TYPE: GOVERNANCE RECONCILIATION

TRIGGER: P-01 (COMPILE REVERT)
  APPLIES:
    1. PIPELINE.HANDOFF.MODEL      — identifies Stage 3 as root cause
  STREAM TYPE: DURABILITY
  NOTE: Manual re-application of publish_status:live after every compile is classified
        as NON-DURABLE EDIT (P-02). Permanent fix requires upstream page_class change.

TRIGGER: P-02 (NON-DURABLE EDIT)
  APPLIES:
    1. PIPELINE.HANDOFF.MODEL      — identifies that the fix belongs upstream (Stage 0–1)
  STREAM TYPE: DURABILITY

TRIGGER: P-03 (UNREGISTERED MIRROR PAGE)
  APPLIES:
    1. ROUTE.CLASSIFICATION.MODEL  — classify the page
    2. ENTRY.GATE.RULESET          — define required registration
  STREAM TYPE: GOVERNANCE RECONCILIATION

TRIGGER: G-01 (ISOLATED PAGE)
  APPLIES:
    (No source entry modules)
    → Publish Execution Model: AUTHORITY GRAPH stream type
  STREAM TYPE: AUTHORITY GRAPH
  PATTERN: cases/PATTERN.AUTHORITY.GRAPH.INTEGRATION.01.md
    Condition: G-01 ACTIVE AND route is governed + compiled + published
    Required stream sequence (1 stream):
      1. AUTHORITY GRAPH
    See: cases/PATTERN.AUTHORITY.GRAPH.INTEGRATION.01.md

TRIGGER: G-02 (MISSING ROOT LINK)
  APPLIES:
    (No source entry modules)
    → Publish Execution Model: AUTHORITY GRAPH stream type
  STREAM TYPE: AUTHORITY GRAPH
  PATTERN: cases/PATTERN.AUTHORITY.GRAPH.INTEGRATION.01.md
    Condition: G-02 ACTIVE AND route is governed + compiled + published
    Required stream sequence (1 stream):
      1. AUTHORITY GRAPH
    See: cases/PATTERN.AUTHORITY.GRAPH.INTEGRATION.01.md

TRIGGER: G-03 (SIGNAL ISOLATION)
  APPLIES:
    (No source entry modules)
    → Publish Execution Model: AUTHORITY GRAPH stream type
  STREAM TYPE: AUTHORITY GRAPH
```

---

*MODULE.APPLICABILITY.MAP — Publish Retrieval and Applicability System | origin: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01 | 2026-04-20*
