---
name: EXECUTION.SEQUENCE.CONTROLLER
type: brain-module
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.EXECUTION.AUTHORITY.PUBLISH.01
---

# EXECUTION.SEQUENCE.CONTROLLER

## Purpose

Given a trigger label set, a classification result, and an escalation state, return the exact ordered list of required stream types. The controller is deterministic — the same inputs always produce the same sequence. All sequence logic is derived exclusively from MODULE.APPLICABILITY.MAP and PATTERN modules.

---

## Controller Input

```
INPUT:
  trigger_labels:    set of labeled triggers (R-xx, C-xx, P-xx, G-xx)
  classification:    route class (CANONICAL | DERIVED | BRIDGE |
                     SNAPSHOT-DERIVED | INVALID | unclassified)
  escalation_state:  list of active escalation conditions (or NONE)

PRECONDITION:
  trigger_labels must be non-empty (produced by TRIGGER.PATTERN.MODEL)
  classification may be unclassified if ROUTE.CLASSIFICATION.MODEL has not yet run
  escalation_state must be explicit — NONE is a valid state, ambiguous is not
```

---

## Resolution Logic

```
STEP 1 — IDENTIFY PRIMARY TRIGGER
  Select the trigger with highest governance priority from trigger_labels.
  Priority order: R-xx > C-xx > P-xx > G-xx
  If multiple triggers of same group, select lowest ID (e.g. R-01 before R-06).
  PRIMARY TRIGGER = highest-priority trigger in the input set.

STEP 2 — LOOK UP MODULE.APPLICABILITY.MAP
  Query MODULE.APPLICABILITY.MAP for PRIMARY TRIGGER.
  If a BASE stream type is defined → candidate base sequence = [base stream type]
  If no entry exists → CONTROLLER OUTPUT: ERROR — trigger not mapped; escalate

STEP 3 — CHECK FOR SUB-PATH
  Query MODULE.APPLICABILITY.MAP for a SUB-PATH matching:
    classification = input classification
    escalation_state includes any listed condition in the sub-path
  IF a SUB-PATH match is found:
    → candidate sequence = sub-path stream sequence
    → PATTERN reference = sub-path pattern reference (if any)
  IF no sub-path match:
    → candidate sequence = base sequence from STEP 2
    → PATTERN reference = NONE

STEP 4 — RESOLVE PATTERN MODULE (if referenced)
  IF PATTERN reference is not NONE:
    Load the referenced PATTERN module from cases/
    Verify that APPLICABILITY CONDITIONS are satisfied by current inputs
    IF satisfied: sequence = PATTERN.required_stream_sequence
    IF not satisfied: CONTROLLER OUTPUT: ERROR — pattern not applicable;
                      fall back to STEP 2 base sequence

STEP 5 — VALIDATE SEQUENCE
  The resolved sequence must satisfy:
    □ At least one stream type
    □ No duplicate stream types at adjacent positions
    □ Each stream type is a recognized type:
        GOVERNANCE RECONCILIATION | BRIDGE | PROMOTION REVIEW |
        INTEGRITY | SEMANTIC ALIGNMENT | AUTHORITY GRAPH |
        DURABILITY | GOVERNANCE RECONCILIATION
    □ Stream types do not violate EXECUTION.LINKING.MODEL invalid sequences

  If validation fails → CONTROLLER OUTPUT: ERROR — invalid sequence; report conflict

STEP 6 — OUTPUT SEQUENCE
  Return exactly:
    sequence:        [<stream type 1>, <stream type 2>, ...]
    pattern_bound:   <PATTERN module name> or NONE
    trigger_basis:   <primary trigger label>
    input_echo:      { trigger_labels, classification, escalation_state }
```

---

## Known Sequence Resolutions

The following sequences are confirmed by resolved cases. New entries are added only by P-7 (CLOSURE.BRAIN.PERSISTENCE.MODEL) after a multi-stream case is fully persisted.

```
CASE-01: R-01 + BRIDGE + ESCALATION CONDITION 5
  Input:
    trigger_labels:   {R-01}
    classification:   BRIDGE
    escalation_state: {ESCALATION CONDITION 5}
  Output:
    sequence:        [GOVERNANCE RECONCILIATION, BRIDGE, PROMOTION REVIEW]
    pattern_bound:   PATTERN.BRIDGE.ROUTE.ENTRY.RESOLUTION.01
    trigger_basis:   R-01
  Source: MODULE.APPLICABILITY.MAP R-01 SUB-PATH (BRIDGE + Condition 5)
```

---

## Single-Stream Resolutions (no multi-step pattern)

When the controller resolves to a single stream type, EXECUTION.AUTHORITY.MODEL does not activate. The controller outputs the stream type only.

```
R-01 (no BRIDGE, no Condition 5)  → [GOVERNANCE RECONCILIATION] or [INTEGRITY]
R-02                               → [INTEGRITY]
R-03                               → [INTEGRITY]
R-04                               → [INTEGRITY]
R-05                               → [INTEGRITY]
R-06                               → [INTEGRITY] or [GOVERNANCE RECONCILIATION]
C-01                               → [SEMANTIC ALIGNMENT]
C-02                               → [INTEGRITY] or [DURABILITY]
C-03                               → [GOVERNANCE RECONCILIATION]
P-01                               → [DURABILITY]
P-02                               → [DURABILITY]
P-03                               → [GOVERNANCE RECONCILIATION]
G-01, G-02, G-03                   → [AUTHORITY GRAPH]
```

---

## Controller Guarantees

```
GUARANTEE-01: DETERMINISM
  Same trigger_labels + classification + escalation_state always produces
  the same sequence. No stochastic behavior, no context-sensitive variation.

GUARANTEE-02: SOURCE TRACEABILITY
  Every output sequence traces to either:
    A. A MODULE.APPLICABILITY.MAP entry (base or sub-path), or
    B. A PATTERN module's required_stream_sequence field
  No sequence is hardcoded in this controller independently of those sources.

GUARANTEE-03: ANTI-DRIFT COMPLIANCE
  The controller does not classify routes, define constructs, or interpret
  canonical truth. It resolves sequences from brain artifacts only.
  Any input requiring canonical judgment → escalate before controller runs.

GUARANTEE-04: ERROR SURFACING
  The controller never silently defaults. If no mapping is found, the output
  is an explicit ERROR — not a best-guess stream type.
```

---

*EXECUTION.SEQUENCE.CONTROLLER — Neural Publish Operating Loop | origin: BRAIN.EXECUTION.AUTHORITY.PUBLISH.01 | 2026-04-20*
