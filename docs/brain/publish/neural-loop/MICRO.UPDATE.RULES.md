---
name: MICRO.UPDATE.RULES
type: brain-module
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.NEURAL.LOOP.PUBLISH.01
---

# MICRO.UPDATE.RULES

## Purpose

Formalize how the Publish Brain improves its own operating logic without drifting from canonical truth. Defines the exact boundary between permitted refinement and forbidden truth creation.

---

## Allowed Brain Refinements

```
ALLOWED-01: Add new trigger pattern to TRIGGER.PATTERN.MODEL
  Condition: A new observable signal was encountered that is not in the current
             trigger set. The new signal is distinct and reoccurred at least once.
  Scope: Add to correct signal group (R/C/P/G); assign next available ID.

ALLOWED-02: Add a new trigger → module mapping to MODULE.APPLICABILITY.MAP
  Condition: ALLOWED-01 produced a new trigger that has no existing mapping.
  Scope: Define modules and stream type only; do not modify module content.

ALLOWED-03: Add a new allowed or invalid sequence to EXECUTION.LINKING.MODEL
  Condition: A sequence was attempted that the model did not address, and the
             correct behavior is unambiguous from existing rules.
  Scope: Add to allowed or invalid list; do not modify existing sequences.

ALLOWED-04: Refine failure detection in ENTRY.GATE.RULESET
  Condition: A new rejection condition was encountered that is not in the current list.
  Scope: Add to rejection conditions only; do not modify required fields.

ALLOWED-05: Add an escalation condition to FAILURE.ESCALATION.RULES
  Condition: A new stop condition was encountered that is not covered.
  Scope: Add escalation condition with trigger, target, and pipeline effect.

ALLOWED-06: Add a new failure mode record
  Condition: A new governance bypass or pipeline failure was identified and resolved.
  Scope: Create new FAILURE.MODE.<ROUTE>.md in source-entry/; do not modify existing records.

ALLOWED-07: Refine closure rules
  Condition: A new case type was encountered that the current persistence-back model
             does not classify.
  Scope: Add to persistence-back rule set; do not modify existing rules.
```

---

## Forbidden Brain Refinements

```
FORBIDDEN-01: Changing the definition of Program Intelligence or any CKR construct
  Reason: These are canonical truth. Only Canonical Brain may change them.

FORBIDDEN-02: Adding a new route class to ROUTE.CLASSIFICATION.MODEL without Canonical Brain confirmation
  Reason: Route classes define how publish authority is structured. A new class
          implies a new category of authority that must be canonical before it
          can be projected.

FORBIDDEN-03: Changing the source_type vocabulary in ENTRY.GATE.RULESET
  Reason: source_type values are the authority classes for route_source_map.yaml.
          These must be consistent across the full WEB pipeline. Changes require
          a governed WEB contract amendment, not a brain micro-update.

FORBIDDEN-04: Modifying the escalation target
  Reason: Canonical Brain as escalation target for truth questions is fixed.
          Changing the escalation target would remove the truth boundary.

FORBIDDEN-05: Introducing a new claim class or controlled claim without Product Brain basis
  Reason: Claims on signal-pi.com must trace through Product → Publish Brain.
          A brain micro-update may not shortcut this promotion path.

FORBIDDEN-06: Updating CONTEXT.INFERENCE.RULES to reclassify a surface
  Reason: Surface ownership (krayu.be = WEB pipeline, signal-pi.com = Publish Brain)
          is set by the git_structure_contract and operational contracts. It is
          not a brain-level decision.

FORBIDDEN-07: Self-authorizing a route as CANONICAL without CKR
  Reason: The publish brain may detect and classify routes, but may not grant
          canonical status. That authority belongs to the Canonical Brain exclusively.
```

---

*MICRO.UPDATE.RULES — Neural Publish Operating Loop | origin: BRAIN.NEURAL.LOOP.PUBLISH.01 | 2026-04-20*
