# tier2_query_engine — Publish Brain: Tier-2 Live Interrogation Surface

**Authority:** brain/publish  
**Stream:** TIER2.RUNTIME.QUERY.ENGINE.01  
**Status:** PUBLISH-SAFE VARIANT  
**Publish boundary:** No client names. No internal IDs. No signal IDs. No file paths.

---

## Publish Statement

The Tier-2 Diagnostic Workspace supports live structural interrogation through three controlled investigation modes: WHY, TRACE, and EVIDENCE. The first phase of live interrogation enables WHY and EVIDENCE mode. TRACE mode follows in a subsequent phase.

---

## What Live Interrogation Enables

Rather than reviewing a static report, users of the Diagnostic Workspace can directly query the assessment findings:

**WHY** — understand the structural basis for a zone's classification. The response explains which structural patterns, signal coverage, and grounding state led to the zone being classified as it was. This is not a causal explanation — it is a structural derivation account.

**EVIDENCE** — see the full evidence picture for a zone: what artifacts are available, which signals are bound, and what evidence is absent. The response surfaces structural facts about the evidence set — not guidance on how to obtain missing evidence.

**TRACE** *(Phase 2)* — explore how structural conditions propagate from a zone's anchor domain. Available once the traversal engine is in place.

---

## How It Works

Each zone in the workspace has a WHY and EVIDENCE action. Clicking either fires a live query against the assessment evidence and returns a structured response inline — below the zone card, without leaving the workspace.

Every response includes:
- The inference boundary declaration (`inference_prohibition: ACTIVE`)
- The specific evidence items available for the zone
- What evidence is absent and what that means structurally
- What remains unresolved from the current evidence set

---

## What It Is Not

The live interrogation surface is not:
- A chat or question-answering interface
- An advisory engine
- A root cause analysis tool
- A real-time system monitor
- A speculative analysis layer

Responses are constructed from the assessment evidence. They surface structural facts. They do not recommend actions, project outcomes, or generate claims beyond what the evidence directly supports.

---

## Inference Boundary

All live interrogation responses are bounded by the assessment evidence set.  
`inference_prohibition: ACTIVE` applies to every response in every mode.  
Unresolved structural conditions are declared — not resolved through inference.

---

## Access

Live interrogation is part of the Tier-2 access tier of a LENS Assessment engagement.  
Phase 1 (WHY + EVIDENCE) is the first delivery of this capability.
