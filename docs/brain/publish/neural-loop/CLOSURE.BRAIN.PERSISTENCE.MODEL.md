---
name: CLOSURE.BRAIN.PERSISTENCE.MODEL
type: brain-module
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.NEURAL.LOOP.PUBLISH.01
---

# CLOSURE.BRAIN.PERSISTENCE.MODEL

## Purpose

Define how solved publish cases feed back into persisted brain logic. Prevents solved cases from disappearing at session end while keeping the brain from accumulating noise.

---

## Persistence-Back Rules

```
RULE P-1: UPDATE EXISTING MODULE
  Condition: A solved case revealed an edge case not covered by an existing module,
             but the edge case is a variation of an existing pattern (same trigger
             group, same cell, same module)
  Action: Add the new edge case to the existing module file as an additional entry
  Examples: New rejection condition in ENTRY.GATE.RULESET;
            new trigger ID in TRIGGER.PATTERN.MODEL (same R/C/P/G group)

RULE P-2: CREATE NEW SUB-PATTERN
  Condition: A solved case is structurally novel — it involves a trigger type,
             module sequence, or failure mode with no existing counterpart
  Action: Create a new module file in the appropriate subfolder (source-entry/
          or retrieval/); update 00_INDEX.md in that folder; append to
          02_UPDATE_RULES.md
  Examples: New route class requiring new source_type;
            new surface type requiring new context inference rules

RULE P-3: CREATE FAILURE MODE RECORD
  Condition: A solved case resolved a governance bypass, pipeline failure, or
             undetected route that would be instructive for future streams
  Action: Create FAILURE.MODE.<SUBJECT>.md in source-entry/
  Examples: FAILURE.MODE.APPLIED-INTELLIGENCE.md (precedent already set)

RULE P-4: NO UPDATE REQUIRED
  Condition: The solved case was fully addressed by existing module logic without
             discovering a new edge case, new pattern, or new failure mode
  Action: Write stream closure record only; no brain file changes
  Test: If a future stream facing the identical trigger would produce the correct
        behavior by reading existing modules, no update is needed

RULE P-5: CLOSURE RECORD IS ALWAYS REQUIRED
  Condition: Any stream that completes Stage 7
  Action: Stream closure record must be written (per Publish Stream Closure Model
          in the Publish Execution Model)
  This rule applies regardless of whether P-1 through P-4 require a brain update

RULE P-6: ESCALATIONS THAT RESOLVE MUST UPDATE ESCALATION MODEL
  Condition: An escalation trigger fired, was escalated, and was resolved
  Action: If the resolution revealed a gap in FAILURE.ESCALATION.RULES, add
          the escalation condition; if the resolution introduced a new authority
          source, update MODULE.APPLICABILITY.MAP accordingly

RULE P-7: MULTI-STREAM CASE BECOMES REUSABLE PATTERN
  Condition: A solved case required more than one stream type to fully resolve,
             AND all streams in the sequence are fully persisted with case files,
             AND the compound sequence has not yet been recognized by MODULE.APPLICABILITY.MAP
  Action: Extract the compound resolution sequence as a reusable pattern module;
          create PATTERN.<CLASS>.<SUBJECT>.md in cases/;
          update MODULE.APPLICABILITY.MAP with the compound sub-path
  Examples: UNGOVERNED ROUTE + BRIDGE classification → 3-stream resolution
            (GOVREC → BRIDGE → PROMOTION REVIEW)
  Test: If a future stream facing the same compound trigger would require the
        same sequence of stream types, the pattern is reusable. If MODULE.APPLICABILITY.MAP
        already maps the sub-path, P-7 does not apply.
  Note: P-7 supplements P-4. A case may satisfy P-4 at each individual stream
        (no per-stream module update required) while still satisfying P-7 at
        the compound level (the multi-stream sequence is a new reusable pathway).
```

---

*CLOSURE.BRAIN.PERSISTENCE.MODEL — Neural Publish Operating Loop | origin: BRAIN.NEURAL.LOOP.PUBLISH.01 | 2026-04-20*
