# Persona Demo Usage
## Stream 42.16 — Persona-Based Evidence Views

**contract_id:** PIOS-42.16-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines how personas are used in the ExecLens demo, when to switch
between them, what audience each persona maps to, and what must NOT be said during
a persona-based demo.

---

## 2. Persona-to-Audience Mapping

| Persona | Primary audience | Secondary audience |
|---|---|---|
| EXECUTIVE | Program executives, sponsors, funding decision-makers | Non-technical stakeholders |
| CTO | Chief Technology Officers, technical directors, platform architects | Engineering leads |
| ANALYST | Program analysts, data engineers, evidence reviewers, QA | Technical investigators |

---

## 3. When to Switch Personas

Persona switching in a live demo is always:
- Explicit (announced to audience)
- Motivated (reason stated before switching)
- Non-destructive (prior view output remains visible in session)

### Recommended switching points

| Transition | Trigger | Recommended statement |
|---|---|---|
| EXECUTIVE → CTO | Audience asks "what does this mean structurally?" | "Let me switch to the CTO view, which shows the domain and component structure." |
| CTO → ANALYST | Audience asks "where does this evidence come from?" | "Let me switch to the Analyst view, which expands the full evidence chain." |
| Any → EXECUTIVE | Returning to decision-level summary | "Back to the executive view — same data, condensed." |

### Prohibited triggers

- Do not switch persona in response to a negative audience reaction
- Do not switch to hide evidence that appeared in a prior view
- Do not switch to show "more favorable" data — the data is identical across views

---

## 4. Demo Script Fragments

### Introducing persona selection (any persona)

> "ExecLens exposes the same governed evidence to all audiences.
> The persona setting controls how deep you go into the evidence chain by default.
> The underlying facts do not change."

### EXECUTIVE view introduction

> "In executive mode, we lead with the signal and its confidence.
> The evidence is there — one line shows what supports the answer.
> You can always go deeper, but the default view is designed for the question:
> 'What do we know and how confident are we?'"

### CTO view introduction

> "In CTO mode, the domain, capability, and component information moves to the top.
> You can see directly which part of the architecture a signal traces to.
> Blocking points are highlighted — that's where evidence is incomplete."

### ANALYST view introduction

> "In analyst mode, the evidence chain is expanded by default.
> Every supporting object, every source reference is visible.
> This is the full provenance view — nothing is collapsed."

### Contrast statement (safe for any audience)

> "The answer is the same in all three views.
> What changed is how much of the evidence chain is visible by default."

---

## 5. What NOT to Say During a Persona Demo

| Prohibited statement | Why prohibited |
|---|---|
| "The executive view hides the risky parts" | False — no content is hidden; depth is reduced |
| "This persona shows what's really important" | Interpretation — personas do not rank importance |
| "In CTO mode the system identified the bottleneck" | Detection claim — not accurate |
| "The analyst view is more accurate" | Accuracy claim — all views are equally accurate |
| "Switch to EXECUTIVE so the bad news doesn't show" | Manipulation — prohibited by RULE-001 |
| "This persona knows more than that one" | False — same truth across personas |
| "The system recommends the CTO view for this risk" | Auto-inference — prohibited by RULE-004 |
| "In analyst mode you can see the real evidence" | Implies other modes show fake evidence — false |

---

## 6. Demo Flow: Persona Demonstration

This is the recommended sequence for a persona-focused demo segment (~8 minutes):

```
1. State the query (GQ-003 — Blast Radius)
2. Run EXECUTIVE view first (2 min)
   — show: signal, confidence, business impact
   — say: "This is the decision-support view"

3. Switch to CTO view (3 min)
   — show: domain/capability/component, expanded evidence chain to SIG-40
   — say: "Same signal. Now we can see the architectural trace."
   — point to blocking_point if present

4. Switch to ANALYST view (2 min)
   — show: full 4-layer chain, supporting objects, source refs
   — say: "Full evidence chain — this is where the claim traces to."

5. Return to EXECUTIVE and ask: "Did the answer change?"
   — expected: No. Same signal, same confidence, same statement.
   — say: "The persona changes what we emphasize, not what the system knows."
```

---

## 7. Persona Demo Invariants

| Invariant | Description |
|---|---|
| Persona is declared before output | Header always shows which persona is active |
| No unlabeled persona output | Audience always knows which view they are seeing |
| No persona switching mid-signal | A signal block is always fully rendered in one persona |
| No partial views presented as complete | When depth is limited, the depth-limit label is shown |
