# Persona Choreography
## Stream 42.17 — Persona Demonstration Strategy / Audience-Specific Demo Flow

**contract_id:** PIOS-42.17-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines exactly when each persona is used, at which transition
points, and what the transition logic is. Persona switching is never spontaneous.
Every switch is declared before it happens.

---

## 2. Transition Rules

| Rule | Description |
|---|---|
| PC-01 | Persona is declared verbally before the switch command is run |
| PC-02 | Only one persona is active at any point in the demo |
| PC-03 | Persona switches occur only at designated transition points |
| PC-04 | The same query (GQ-003) is used for the first persona contrast |
| PC-05 | After a persona switch, at least one full query output is shown before switching again |
| PC-06 | No more than two persona switches per demo session |
| PC-07 | Return to default output (non-persona 42.4 adapter) is allowed and announced |

---

## 3. Canonical Persona Sequence

The canonical demo uses one persona transition at T+16:30, selected per audience.

```
T+00:00  [no persona — 42.4 adapter baseline]
   ...
T+10:30  [no persona — 42.4 adapter enhanced mode]
   ...
T+16:30  [PERSONA TRANSITION — audience-determined]
   ...
T+26:00  [close — persona still active or reset]
```

### Why persona enters at T+16:30 (not earlier)

The audience must first see the canonical 42.4 adapter output in SAFE MODE and
ENHANCED MODE before a persona view is introduced. This establishes the baseline
that the persona view is filtering — not replacing. The persona arrives as a
depth-revealing tool over already-seen data.

---

## 4. Persona Transition Points

### Primary transition (T+16:30)

This is the WOW-2 moment. The first persona transition uses GQ-003 as the
contrast query — the same query already seen twice (baseline + enhanced).

| Audience type | Persona at T+16:30 | Rationale |
|---|---|---|
| Executive | EXECUTIVE | Confirm the decision-support summary view |
| Technical (CTO/Architect) | CTO | Show structural depth over the known data |
| Mixed (investor/partner) | EXECUTIVE → then CTO on request | Start accessible, deepen if asked |

### Secondary transition (optional, T+21:00)

If audience requests more depth, a second persona switch may occur at T+21:00,
before Phase 3 queries. This is the only optional secondary transition.

| From | To | Trigger |
|---|---|---|
| EXECUTIVE | CTO | Audience asks about architecture |
| EXECUTIVE | ANALYST | Audience asks about evidence provenance |
| CTO | ANALYST | Audience asks for full evidence chain |

A second switch from ANALYST to any other persona is not recommended in a single
session — it reduces the impact of the depth reveal.

---

## 5. Transition Execution

### Declaring the switch (verbal — before command)

```
"I am switching to [PERSONA NAME] view. Same query. Same data."
```

### Running the switch

```bash
python3 scripts/pios/42.16/persona_view_map.py --persona [PERSONA] --query GQ-003
```

### After output

```
"The answer did not change. The depth changed."
```

[pause 4 seconds]

### No verbal follow-up interpretation

Do not explain what the persona output means. Do not translate fields.
Let the output stand.

---

## 6. Persona-Specific Focus After Transition

After the persona is introduced with GQ-003, subsequent queries in Phase 3
may continue in the same persona or revert to the 42.4 adapter.

### Recommended approach by persona

| Persona | Phase 3 approach |
|---|---|
| EXECUTIVE | Revert to 42.4 adapter for GQ-007..GQ-010 (persona served its purpose at T+16:30) |
| CTO | Continue with CTO persona through GQ-007..GQ-010 (structural continuity) |
| ANALYST | Continue with ANALYST persona through GQ-007..GQ-010 (full evidence depth) |

---

## 7. Transition Announcement Template

Every persona transition follows this exact announcement format:

```
"[Current state statement]
 [What is about to change — one sentence]
 [Pause]
 [Run command]
 [After output: what changed / what didn't]"
```

### Example — EXECUTIVE transition

```
"That is the full ENHANCED MODE output."
"I am going to show you the same data in EXECUTIVE view."
[pause 2 seconds]
[run: persona_view_map.py --persona EXECUTIVE --query GQ-003]
"The answer is the same. The view is condensed."
[pause 4 seconds]
```

### Example — CTO transition

```
[SAY before running:]
"That is the full ENHANCED MODE output."
"I am going to switch to CTO view — same evidence, Structural emphasis."
[pause 2 seconds]
[run: persona_view_map.py --persona CTO --query GQ-003]
"Domain. Capability. Component. Blocking points.
 Same evidence. Different depth by default."
[pause 4 seconds]
```

### Example — ANALYST transition

```
"That is the enhanced view."
"I am switching to ANALYST view — full evidence chain, provenance primary."
[pause 2 seconds]
[run: persona_view_map.py --persona ANALYST --query GQ-003]
"The evidence chain is expanded. Supporting objects are listed.
 This is what the signal traces back to."
[pause 6 seconds]
```

---

## 8. What NOT to Do in Persona Transitions

| Prohibited action | Reason |
|---|---|
| Switch persona mid-query output | Violates PC-02 |
| Switch to hide a negative signal | Violates same-truth guarantee (42.16 RULE-001) |
| Switch persona without verbal declaration | Violates PC-01 |
| Explain what a persona field "means" | Violates RULE-002 no interpretation |
| Switch more than twice in a session | Reduces impact; violates PC-06 |
| Mix persona output with 42.4 output in same display | Violates PC-02 |
