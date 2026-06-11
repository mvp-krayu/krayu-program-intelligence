# Chip State Machine — Per-Persona Intent Model

**Purpose:** Define what each chip does from each persona. Chips are intent, not navigation.
**Date:** 2026-06-11
**Derived from:** Session feedback — "the user cannot predict what will happen"

---

## Current State (broken)

Chips were born in DENSE. The altitude mapping was:
- `structural` → DENSE
- `operational` → BALANCED
- `executive` → BOARDROOM

Each altitude got traversal paths copied from the DENSE-centric model. From BALANCED, "Explain" navigates to DENSE — but the operator is already in the explanation surface. From BOARDROOM, "Why it matters" navigates to BALANCED — a minor projection shift that feels like nothing happened.

The problem: every chip is Type 2 (navigation). No chip is Type 1 (inline synthesis) or properly differentiated as Type 3 (projection shift).

---

## Three Chip Types

### Type 1 — Inline Synthesis

Stay in current persona. Call synthesis. Update right panel.

The operator asked a question that this persona CAN answer. No navigation needed. The synthesis panel delivers the answer from the current evidence context.

### Type 2 — Investigation Start

Create or continue investigation. Navigate to evidence persona. Activate Guide + synthesis.

The operator asked a question that requires DIFFERENT evidence. The current persona doesn't have it. Navigation is necessary because the evidence lives elsewhere.

### Type 3 — Projection Shift

Switch persona. Carry investigation context if active. See the same finding from a different altitude.

The operator wants a different PERSPECTIVE, not different evidence. The finding is the same. The projection changes.

---

## BOARDROOM

**Audience:** Board of Directors
**What they see:** Posture, severity, consequence themes, investment implications
**What they need:** Decisions confirmed or challenged

### Legal Chips

| Chip | Label | Type | Action |
|------|-------|------|--------|
| implication | "What should we decide?" | **Type 1** | Stay in BOARDROOM. Synthesize: which governance decisions are affected by this finding. Right panel answers. |
| challenge | "How confident is this?" | **Type 1** | Stay in BOARDROOM. Synthesize: qualification level, evidence gaps, what would change the verdict. Right panel answers. |
| descent | "Show me the proof" | **Type 2** | Start investigation. Navigate to OPERATOR. "I don't trust this — show me the evidence chain." |
| adjacent | "What else is affected?" | **Type 1** | Stay in BOARDROOM. Synthesize: compounding verdict across findings. Right panel answers. |

### Removed from BOARDROOM

| Current Chip | Why Removed |
|---|---|
| "Why it matters" | You're already in the "why it matters" surface. Nonsensical. |
| "Explain" | BOARDROOM doesn't explain mechanisms. That's DENSE. |
| "Board view" | You're already here. |

### State Transitions

```
BOARDROOM × "What should we decide?" → STAY (Type 1, synthesis)
BOARDROOM × "How confident is this?"  → STAY (Type 1, synthesis)
BOARDROOM × "Show me the proof"       → OPERATOR (Type 2, investigation)
BOARDROOM × "What else is affected?"  → STAY (Type 1, synthesis)
```

---

## BALANCED

**Audience:** CTO / VP Engineering
**What they see:** Operational consequences, delivery impact, reinforcement relationships
**What they need:** Operational implications understood, evidence accessible

### Legal Chips

| Chip | Label | Type | Action |
|------|-------|------|--------|
| implication | "What operations are affected?" | **Type 1** | Stay in BALANCED. Synthesize: which delivery decisions, coordination assumptions, or monitoring practices are invalidated. Right panel answers. |
| challenge | "Prove it" | **Type 2** | Start investigation. Navigate to OPERATOR. Activate evidence examination with synthesis panel. |
| descent | "Show the evidence" | **Type 2** | Start investigation. Navigate to DENSE. Focus topology with steering contract. Synthesis panel shows structural proof. |
| ascent | "Board summary" | **Type 3** | Shift to BOARDROOM. Carry investigation context. Same finding, executive projection. |

### Removed from BALANCED

| Current Chip | Why Removed |
|---|---|
| "Explain" | BALANCED IS the explanation surface for operational meaning. Navigating to DENSE for "explain" is wrong — DENSE explains mechanism, not meaning. If the operator wants mechanism, they should click "Show the evidence." |
| "What compounds" | Too vague. Compounding is a synthesis question (Type 1) that should be explicit: "Does this compound with [specific finding]?" — driven by adjacency, not a generic chip. |

### State Transitions

```
BALANCED × "What operations are affected?" → STAY (Type 1, synthesis)
BALANCED × "Prove it"                      → OPERATOR (Type 2, investigation)
BALANCED × "Show the evidence"             → DENSE (Type 2, investigation)
BALANCED × "Board summary"                 → BOARDROOM (Type 3, projection shift)
```

---

## DENSE

**Audience:** Chief Architect / Staff Engineer
**What they see:** Topology, structural zones, domain concentration, propagation flow
**What they need:** Structural mechanisms understood, evidence verifiable

### Legal Chips

| Chip | Label | Type | Action |
|------|-------|------|--------|
| clarify | "Why does this happen?" | **Type 1** | Stay in DENSE. Synthesize: the structural mechanism behind the finding. Right panel answers with evidence traces. |
| descent | "Verify the evidence" | **Type 2** | Start investigation. Navigate to OPERATOR. Full evidence inspection with synthesis panel. |
| adjacent | "What does this compound with?" | **Type 1** | Stay in DENSE. Synthesize: compounding verdict against adjacent surfaces. Right panel answers. |
| ascent | "How does the CTO see this?" | **Type 3** | Shift to BALANCED. Carry investigation context. Same finding, operational projection. |

### Removed from DENSE

| Current Chip | Why Removed |
|---|---|
| "Challenge this" | Redundant with "Verify the evidence" — both go to OPERATOR for proof. Keep one. |

### State Transitions

```
DENSE × "Why does this happen?"          → STAY (Type 1, synthesis)
DENSE × "Verify the evidence"            → OPERATOR (Type 2, investigation)
DENSE × "What does this compound with?"  → STAY (Type 1, synthesis)
DENSE × "How does the CTO see this?"     → BALANCED (Type 3, projection shift)
```

---

## OPERATOR

**Audience:** Evidence inspector / Operator
**What they see:** Signal intelligence, runtime connectivity, evidence traces, governance audit
**What they need:** Evidence verified, confidence assessed

### Legal Chips

OPERATOR currently has NO chips. This is correct for the default state — OPERATOR is the evidence terminus.

**During active investigation:** the Guide + Synthesis panel provide the interaction. Investigation proof steps ARE the chips. No additional navigation chips needed.

**After investigation resolves:** offer return chips.

| Chip | Label | Type | Action |
|------|-------|------|--------|
| ascent | "Back to structural view" | **Type 3** | Shift to DENSE. Carry investigation context. |
| ascent | "Back to CTO view" | **Type 3** | Shift to BALANCED. Carry investigation context. |

### State Transitions

```
OPERATOR (no investigation) → no chips (evidence terminus)
OPERATOR (investigation active) → proof steps in Guide (not chips)
OPERATOR (investigation resolved) → Type 3 return chips
```

---

## Summary Matrix

### Type 1 — Inline Synthesis (stay + synthesize)

| Persona | Chips |
|---------|-------|
| BOARDROOM | "What should we decide?", "How confident is this?", "What else is affected?" |
| BALANCED | "What operations are affected?" |
| DENSE | "Why does this happen?", "What does this compound with?" |
| OPERATOR | — (none, evidence terminus) |

### Type 2 — Investigation Start (navigate + investigate)

| Persona | Chips | Destination |
|---------|-------|-------------|
| BOARDROOM | "Show me the proof" | OPERATOR |
| BALANCED | "Prove it" | OPERATOR |
| BALANCED | "Show the evidence" | DENSE |
| DENSE | "Verify the evidence" | OPERATOR |
| OPERATOR | — (none) | — |

### Type 3 — Projection Shift (change persona + carry context)

| Persona | Chips | Destination |
|---------|-------|-------------|
| BOARDROOM | — (none, apex) | — |
| BALANCED | "Board summary" | BOARDROOM |
| DENSE | "How does the CTO see this?" | BALANCED |
| OPERATOR | "Back to structural view" / "Back to CTO view" | DENSE / BALANCED |

---

## Navigation Gravity

```
            BOARDROOM
               ↑ Type 3
            BALANCED
               ↑ Type 3
              DENSE
               ↑ Type 3
            OPERATOR

Type 2 always descends (toward evidence)
Type 3 always ascends (toward executive)
Type 1 never moves (stays in current persona)
```

Type 2 goes DOWN (more evidence). Type 3 goes UP (more executive). Type 1 stays PUT (synthesize here). No chip ever moves laterally. The gravity is vertical.

---

## What Changes in Code

### NavigationChips.jsx

Replace `TRAVERSAL_PATHS` and `ACTION_MAP` with the state machine above. Each entry specifies:
```javascript
{
  typeKey: string,
  label: string,
  chipType: 'SYNTHESIS' | 'INVESTIGATION' | 'PROJECTION_SHIFT',
  targetMode: string | null,    // null for Type 1
  boardroom: boolean,           // for Type 3 to BOARDROOM
  synthesisKey: string | null,  // for Type 1 — what to synthesize
}
```

### handleModeTransition (flagship)

Type 1 chips don't call `handleModeTransition`. They call a new `handleInlineSynthesis(synthesisKey)` that:
1. Stays in current mode
2. Calls the appropriate synthesizer
3. Updates the right panel with the result

Type 2 chips call `handleModeTransition` as today (create investigation, navigate).

Type 3 chips call a new `handleProjectionShift(targetMode)` that:
1. Changes persona
2. Carries investigation context
3. Does NOT create a new investigation

### Right Panel

- **No investigation, no synthesis:** Normal Support Rail
- **Type 1 clicked:** Synthesis panel with inline answer (no investigation created)
- **Type 2 clicked:** Investigation Guide + synthesis panel
- **Type 3 clicked:** Support Rail for new persona (or Guide if investigation active)
