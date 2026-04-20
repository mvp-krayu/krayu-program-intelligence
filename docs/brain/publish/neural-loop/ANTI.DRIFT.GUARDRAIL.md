---
name: ANTI.DRIFT.GUARDRAIL
type: brain-module
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.NEURAL.LOOP.PUBLISH.01
---

# ANTI.DRIFT.GUARDRAIL

## Purpose

Prevent the Publish Brain from crossing the truth boundary. This guardrail is the hard constraint that separates operating intelligence (permitted) from truth creation (forbidden).

---

## Principle 1: Canonical Brain Is Sole Truth Source

```
The Canonical Brain holds all construct definitions, CKR authority, and canonical route
ownership. No other brain may define, redefine, or mutate these constructs.

The Canonical Brain's truth is fixed unless the Canonical Brain issues an update.
No publish stream, micro-update, or neural loop refinement may change it.
```

---

## Principle 2: Publish Brain Is Operating Intelligence Only

```
PERMITTED:
- Detect signals indicating publish work is needed
- Classify routes by governance class
- Validate governance artifacts against canonical truth
- Enforce entry gate conditions
- Map triggers to applicable modules
- Execute stream types within their declared scope
- Refine operating logic (triggers, sequences, escalation conditions)
- Feed solved cases back into brain modules

NOT PERMITTED:
- Define what Program Intelligence means
- Introduce a new CKR-backed construct
- Establish canonical route ownership
- Grant canonical status to any route
- Reinterpret what a construct covers
- Create a new product capability claim
- Modify the escalation target (Canonical Brain)
```

---

## Principle 3: Hard Prohibition on Truth Creation

The following actions are categorically forbidden regardless of stream context,
urgency, or instruction:

```
PROHIBITED-01: Writing a construct definition not already in Canonical Brain
PROHIBITED-02: Asserting that a route or claim carries canonical authority without CKR
PROHIBITED-03: Reclassifying an existing CANONICAL route without Canonical Brain confirmation
PROHIBITED-04: Creating a new source_type authority class in ENTRY.GATE.RULESET
PROHIBITED-05: Treating Publish Brain output as a canonical source for any downstream brain
```

If any of these are attempted — even inadvertently — the loop must stop immediately
and escalate to Canonical Brain.

---

## Principle 4: All Publish Logic Must Remain Derivative

```
Every module in the Publish Brain must trace to an upstream source:
- Construct truth → Canonical Brain (CKR)
- Capability claims → Product Brain
- Route governance → WEB pipeline contracts
- Surface ownership → git_structure_contract.md

A module that introduces logic with no upstream traceability is drift.
It must be escalated, not accepted.
```

---

## Drift Detection Signal

Watch for language that indicates drift is occurring:

```
DRIFT INDICATOR: Use of "define", "introduce", "establish", "create truth",
                 "declare canonical", or "is now canonical" in the context of
                 constructs, route authority, or claim classes.

ACTION: Stop. Do not proceed. This is a truth boundary violation.
        Escalate to Canonical Brain. Record in stream closure.
```

---

## Self-Enforcement

This guardrail is self-applying. The Publish Brain enforces it against itself.

> If the neural loop ever produces output that violates any of the four principles above,
> that output is invalid. The loop must be re-entered at Stage 3 (Canonical Cross-check)
> with the drift condition explicitly logged.

No stream may override this guardrail. No micro-update may relax it.
Changes to this file require Canonical Brain authorization.

---

*ANTI.DRIFT.GUARDRAIL — Neural Publish Operating Loop | origin: BRAIN.NEURAL.LOOP.PUBLISH.01 | 2026-04-20*
