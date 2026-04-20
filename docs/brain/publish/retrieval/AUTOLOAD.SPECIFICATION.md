---
name: AUTOLOAD.SPECIFICATION
type: brain-module
brain: publish
domain: retrieval
version: 1.0
origin_stream: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01
---

# AUTOLOAD.SPECIFICATION

## Purpose

Define how modules are activated without explicit user request. When a trigger fires, applicable modules are considered active and must be applied in reasoning and execution for the duration of the stream.

---

## Formal Auto-Load Model

```
NAME: PUBLISH.AUTO-LOAD.MODEL
Version: 1.0

PRINCIPLE:
  When a publish-related situation is observed, the applicable modules are
  considered ACTIVE without requiring explicit user request. Active modules
  constrain reasoning and execution for the duration of the stream.

ACTIVATION RULES:

  RULE 1 — Surface presence activates WEB pipeline context
    IF: any route on krayu.be or mirror.krayu.be is mentioned, inspected, or modified
    THEN: WEB.SOURCE.ENTRY.PATTERN is active
    EFFECT: The detection pattern is applied as preflight to any route-touching work

  RULE 2 — New or unknown route activates classification
    IF: a route is discovered that is not in the stream's established context
    THEN: ROUTE.CLASSIFICATION.MODEL is active
    EFFECT: The route must be classified before any work proceeds on it

  RULE 3 — Classification activates gate check
    IF: ROUTE.CLASSIFICATION.MODEL produces a class
    THEN: ENTRY.GATE.RULESET is active
    EFFECT: Gate pre-conditions must be verified before the route enters pipeline

  RULE 4 — Gate pass activates pipeline
    IF: ENTRY.GATE.RULESET returns all pre-conditions TRUE
    THEN: PIPELINE.HANDOFF.MODEL is active
    EFFECT: The route moves through stages; no stage may be skipped

  RULE 5 — Semantic observation activates alignment rules
    IF: page content uses prohibited terminology or deviates from CKR definitions
    THEN: SEMANTIC ALIGNMENT stream type is active
    EFFECT: Only language correction is in scope; no route or structural changes

  RULE 6 — Graph gap activates authority linking rules
    IF: a governed page has no inbound root link or no cross-links to core constructs
    THEN: AUTHORITY GRAPH stream type is active
    EFFECT: Only contextual link additions are in scope

MODULE DEACTIVATION:
  A module is deactivated when:
  - Its output has been produced (detection complete, classification assigned, gate passed)
  - The stream type is confirmed as incompatible (e.g. SEMANTIC stream deactivates source entry modules)
  - The stream closure record has been written

CONSTRAINT:
  Active modules may NOT be overridden by user instruction within the same stream.
  If a user instruction conflicts with an active module's rules, the conflict must
  be surfaced explicitly before proceeding.

  RULE X — EXECUTION AUTHORITY ACTIVATION
    IF:
      - a trigger pattern is matched (TRIGGER.PATTERN.MODEL produces at least one label)
      - AND EXECUTION.SEQUENCE.CONTROLLER resolves the trigger set to a named stream
        sequence (a PATTERN module or MODULE.APPLICABILITY.MAP sub-path matches)
      - AND the resolved sequence contains more than one stream type
      - AND not all positions in the sequence are CLOSED (case files not all persisted)
    THEN:
      - EXECUTION.AUTHORITY.MODEL becomes active immediately
      - EXECUTION.SEQUENCE.CONTROLLER defines the required sequence and current position
      - The FIRST unclosed step in the sequence becomes the ONLY valid next stream
      - All other stream types are blocked until that step is CLOSED
    EFFECT:
      The brain does not wait for external orchestration instruction.
      It constrains execution to the next required step.
      Manual stream type selection that contradicts the active sequence is invalid.
    DEACTIVATION:
      EXECUTION.AUTHORITY.MODEL deactivates when:
      - All positions in the resolved sequence are CLOSED, OR
      - An unresolvable escalation stops the sequence permanently
```

---

*AUTOLOAD.SPECIFICATION — Publish Retrieval and Applicability System | origin: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01 | 2026-04-20*
