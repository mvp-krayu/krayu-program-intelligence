# WOW Moments
## Stream 42.17 — Persona Demonstration Strategy / Audience-Specific Demo Flow

**contract_id:** PIOS-42.17-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines the two controlled WOW moments in the ExecLens demo.
WOW moments are not theatrical. They are structural pauses where the system
output is allowed to register without interruption.

---

## 2. WOW-1 — Semantic Activation

**What it is:** The moment when the same query (GQ-003) is run in ENHANCED MODE
and the `semantic_annotations` block appears — where it was absent in SAFE MODE.

**Timing:** T+10:30 (immediately after GQ-003 contrast run)

**Duration of pause:** 6 seconds minimum. Do not speak during this pause.

### Setup (T+08:00–T+10:00)

The audience has seen GQ-003 in SAFE MODE at T+08:00.
They have seen the baseline output. No annotations. Clean ENL.

The activation is explicit: `demo_activate.py --enable` runs in the terminal.
Path state changes from INACTIVE to ACTIVE. This is visible.

### The moment (T+10:30)

```bash
python3 scripts/pios/42.4/execlens_adapter.py GQ-003
```

Output appears. The `semantic_annotations` block is visible per signal.

**[SAY after output]:**
> "The executive answer is unchanged.
> The signals are unchanged.
> The evidence chains are unchanged."

**[PAUSE — 4 seconds]**

**[THEN SAY]:**
> "What was added: the semantic_annotations block per signal.
> The discipline layer labeled what was already there."

**[PAUSE — 6 seconds — WOW-1 silence]**

No follow-up. No explanation. Let the contrast register.

### Why this works

The audience has a reference point (the identical baseline output).
The change is additive and visible. No claim is made about what it means.
The silence invites the audience to draw their own observation — not a conclusion.

### What invalidates WOW-1

- Explaining what `semantic_annotations` means before showing the contrast
- Running GQ-003 in ENHANCED MODE without first establishing the SAFE MODE baseline
- Filling the pause with commentary
- Saying "the AI added" or "the system identified"

---

## 3. WOW-2 — Persona Switch

**What it is:** The moment when the same query (GQ-003) is shown through a
persona-filtered lens — and the output is demonstrably different in depth while
the core answer is demonstrably unchanged.

**Timing:** T+16:30 (after WOW-1 has settled; audience has seen enhanced output)

**Duration of pause:** 4 seconds minimum after the contrast statement.

### Setup (T+16:00)

The audience has seen:
- GQ-003 in SAFE MODE (T+08:00)
- GQ-003 in ENHANCED MODE (T+10:30)

They have a two-point reference for the same query. The persona adds a third
point: the same data, but depth-configured for a specific audience type.

**[SAY before running:]**
> "The same evidence is available at different depths.
> I am going to show you the same query through a different lens."

**[PAUSE — 2 seconds]**

**[SAY before command:]**
> "Same query. Same data. [PERSONA NAME] view."

### The moment

```bash
python3 scripts/pios/42.16/persona_view_map.py --persona [PERSONA] --query GQ-003
```

Output appears. Depth is visibly different from the 42.4 adapter output.
Section ordering is different. Some fields are prominent. Others are not shown.

**[AFTER OUTPUT — SAY:]**
> "The answer did not change. The depth changed."

**[PAUSE — 4 seconds — WOW-2 silence]**

No follow-up. No explanation. Let the depth difference register.

### Why this works

The audience has already seen the 42.4 output twice (SAFE + ENHANCED).
The persona output is unmistakably the same query but filtered. The contrast
statement is minimal and accurate. The silence invites comparison.

### What invalidates WOW-2

- Introducing the persona before the audience has seen the 42.4 output
- Explaining which fields the persona removed or condensed
- Saying "this is the cleaner version" or "this is better for executives"
- Running a different query in the persona view

---

## 4. WOW Moment Timing Matrix

| Moment | Setup begins | Trigger command | Pause duration | Contrast statement |
|---|---|---|---|---|
| WOW-1 | T+08:00 | T+10:30 — GQ-003 contrast run | 6 seconds | "The discipline layer labeled what was already there." |
| WOW-2 | T+16:00 | T+16:30 — persona_view_map.py GQ-003 | 4 seconds | "The answer did not change. The depth changed." |

---

## 5. WOW Moment Properties

| Property | WOW-1 | WOW-2 |
|---|---|---|
| What changes | semantic_annotations appear | Display depth / field ordering changes |
| What does not change | ENL output structure, signals, evidence | Signal IDs, statements, evidence content |
| Visual anchor | Before/after GQ-003 same terminal session | Before/after GQ-003 same terminal session |
| Silence required | YES — 6 seconds | YES — 4 seconds |
| Commentary after | One additive sentence only | One additive sentence only |
| Audience can ask questions after | YES — after pause | YES — after pause |

---

## 6. WOW Moment Failure Modes and Recovery

### WOW-1 fails (activation returns non-zero)

Follow `fallback_handling.md` — Section 3. Continue in SAFE MODE.
State neutrally: "The semantic path is not active. Continuing in baseline mode."
Do not apologize. Do not improvise.

### WOW-1 is muted (audience does not visibly react)

Do not add commentary to compensate. The moment stands. Proceed to Phase 2.
The WOW is in the output, not in the audience reaction.

### WOW-2 fails (persona_view_map.py errors)

State: "The persona view requires — let me check the path state."
Run `demo_activate.py --status`. If INACTIVE, run `--enable` and retry.
If still fails, continue with 42.4 adapter output. State: "Continuing in canonical view."

### WOW-2 is muted

Do not explain what the persona shows differently. Proceed with Phase 3.
If the audience asks "what's different?" — point to the depth label:
"The default drill-down depth for this view is [N] layers."
