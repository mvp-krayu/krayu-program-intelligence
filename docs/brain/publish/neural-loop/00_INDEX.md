---
name: 00_INDEX
type: brain-index
brain: publish
domain: neural-loop
version: 1.0
origin_stream: BRAIN.NEURAL.LOOP.PUBLISH.01
---

# Neural Publish Operating Loop — Module Index

## Purpose

This folder contains the governed neural operating loop for the Publish Brain. Together these modules define a self-correcting, governed execution system: detect signals, route to the correct modules, execute at the correct layer, verify closure, and refine without drifting from canonical truth.

---

## Module Registry

| Module | File | Role |
|---|---|---|
| NEURAL.PUBLISH.LOOP | `NEURAL.PUBLISH.LOOP.md` | 8-stage governed operating loop (DETECT → PERSIST REFINEMENT) |
| LINKED.CELL.MODEL | `LINKED.CELL.MODEL.md` | Cell activation map — how each module fires and hands off |
| MICRO.UPDATE.RULES | `MICRO.UPDATE.RULES.md` | Permitted and forbidden brain self-refinements |
| CANONICAL.ESCALATION.MODEL | `CANONICAL.ESCALATION.MODEL.md` | When the loop stops; escalation targets; universal stop condition |
| CLOSURE.BRAIN.PERSISTENCE.MODEL | `CLOSURE.BRAIN.PERSISTENCE.MODEL.md` | How solved cases feed back into brain logic (P-1 through P-6) |
| ANTI.DRIFT.GUARDRAIL | `ANTI.DRIFT.GUARDRAIL.md` | Hard constraint: Publish Brain may not create truth |

---

## Usage Guidance

These modules activate after the Retrieval/Applicability layer has fired (`retrieval/AUTOLOAD.SPECIFICATION.md`). They govern every stream from Stage 1 through Stage 8.

**Sequence:** retrieval/ modules activate the loop → neural-loop/ modules govern its execution

Do not invoke neural-loop modules in isolation. They are a system, not a checklist.

---

## Tags

`brain:publish` `domain:neural-loop` `layer:operating-system` `governs:all-publish-streams`

---

*Neural Publish Operating Loop | origin: BRAIN.NEURAL.LOOP.PUBLISH.01 | 2026-04-20*
