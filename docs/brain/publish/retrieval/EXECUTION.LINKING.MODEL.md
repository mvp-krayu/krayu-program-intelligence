---
name: EXECUTION.LINKING.MODEL
type: brain-module
brain: publish
domain: retrieval
version: 1.0
origin_stream: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01
---

# EXECUTION.LINKING.MODEL

## Purpose

Define how modules chain together. Specifies allowed sequences, invalid sequences, and required completion conditions before each transition.

---

## Allowed Sequences

```
SEQUENCE A — Full governance entry (new or ungoverned route)
  DETECT (WEB.SOURCE.ENTRY.PATTERN)
    → CLASSIFY (ROUTE.CLASSIFICATION.MODEL)
    → GATE CHECK (ENTRY.GATE.RULESET)
    → PIPELINE EXECUTION (PIPELINE.HANDOFF.MODEL)
  All four steps required. No step may be skipped.
  GATE CHECK must PASS before PIPELINE EXECUTION begins.

SEQUENCE B — Partial pipeline recovery (route is classified but unmirrored)
  GATE CHECK (ENTRY.GATE.RULESET)
    → PIPELINE EXECUTION (PIPELINE.HANDOFF.MODEL) from Stage 3+
  Classification already known. Starts from gate, not detection.

SEQUENCE C — Sitemap-only repair (route is mirrored but not in sitemap)
  GATE CHECK (ENTRY.GATE.RULESET) — verify publish_status:live
    → PIPELINE EXECUTION (PIPELINE.HANDOFF.MODEL) Stage 4 only
  Shortest valid sequence.

SEQUENCE D — Blocked route removal
  GATE CHECK (ENTRY.GATE.RULESET) — confirm verdict:blocked
    → PIPELINE EXECUTION not triggered
    → Route removed from pages/ and sitemap only
  No classification required (already classified as INVALID/UNAUTHORIZED).
```

---

## Invalid Sequences

```
✗ PIPELINE EXECUTION before GATE CHECK
  — A route may not enter pages/ or sitemap without a passing gate check.

✗ CLASSIFICATION without prior DETECTION
  — Classification must be grounded in a detected state, not assumed.

✗ SEMANTIC ALIGNMENT stream applied to an UNGOVERNED ROUTE
  — An ungoverned route must be governed before semantic work applies.
    Semantic work on an ungoverned route would correct language on a page
    that is not yet under mirror control — the correction would be lost on
    the next pipeline run.

✗ AUTHORITY GRAPH stream applied before a route is GOVERNED
  — Internal links must not point to ungoverned routes. Graph work
    (adding inbound/outbound links) is only valid for governed routes.

✗ BRIDGE stream before Publish Brain controlled claims entry
  — A bridge page may not enter the pipeline without a corresponding
    Publish Brain node with a completed controlled claims table.
```

---

## Required Completion Before Next Step

| From | To | Completion condition |
|---|---|---|
| DETECT | CLASSIFY | Route state confirmed (UNGOVERNED / UNMIRRORED / etc.) |
| CLASSIFY | GATE CHECK | Class assigned (CANONICAL / DERIVED / BRIDGE / SNAPSHOT-DERIVED / INVALID) |
| GATE CHECK | PIPELINE EXECUTION | All gate pre-conditions pass; `route_source_map.yaml` entry complete with `verdict:allowed` |
| PIPELINE EXECUTION (Stage 3) | PIPELINE EXECUTION (Stage 4) | `pages/<route>.md` compiled; hard validators PASS |
| PIPELINE EXECUTION (Stage 4) | GOVERNED STATE | Eleventy build exits 0; sitemap correct |

---

## Cross-Stream Execution Enforcement

When EXECUTION.AUTHORITY.MODEL is active, sequencing rules extend across streams. These rules convert the multi-step sequence from a guideline into an enforced contract.

```
CROSS-STREAM RULE X-1: NO STEP WITHOUT PREDECESSOR CLOSURE
  A stream at sequence position n+1 may NOT begin if the case file for
  position n has not been persisted in docs/brain/publish/cases/.
  Attempting to start position n+1 without n's case file → INVALID SEQUENCE.

CROSS-STREAM RULE X-2: EXPLICIT INVALID CROSS-STREAM TRANSITIONS
  The following cross-stream transitions are INVALID in all contexts:

  ✗ BRIDGE without prior GOVERNANCE RECONCILIATION (when ESCALATION CONDITION 5 applies)
    — A bridge page may not be created without a Publish Brain controlled claims
      node. This invariant holds at the cross-stream level, not only at
      the single-stream gate check level.

  ✗ PROMOTION REVIEW without prior BRIDGE
    — Promoting a route to live requires a governed mirror page to exist.
      There is no valid promotion of a route with no pages/ file.

  ✗ Repeating a CLOSED step in the same sequence instance
    — Once a step's case file is persisted, that step is CLOSED. Re-executing
      the same stream type within the same sequence instance is invalid.
      If the closed step needs correction, a new sequence must be initiated
      by re-entering the neural loop at Stage 1.

  ✗ Changing sequence order mid-execution
    — The sequence is locked at initiation by EXECUTION.SEQUENCE.CONTROLLER.
      Reordering (e.g. attempting PROMOTION REVIEW before BRIDGE) is invalid.

CROSS-STREAM RULE X-3: SEQUENCE POSITION EVIDENCE
  Each stream in a sequence must declare its position in the case file:
    sequence_position: <n> of <total>
    pattern: <PATTERN module name>
  Missing this declaration does not invalidate the stream, but the next step
  may not begin until the position is confirmed in the case file.
```

---

*EXECUTION.LINKING.MODEL — Publish Retrieval and Applicability System | origin: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01 | 2026-04-20*
