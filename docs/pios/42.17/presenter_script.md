# Presenter Script
## Stream 42.17 — Persona Demonstration Strategy / Audience-Specific Demo Flow

**contract_id:** PIOS-42.17-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document provides exact language for each step of the demo. All phrasing
is additive and neutral. No phrasing implies interpretation, scoring, or
AI reasoning.

Script format:
- `[SAY]` — exact language or paraphrase-within-rules
- `[DO]` — command or action
- `[PAUSE]` — mandatory silence in seconds
- `[DO NOT SAY]` — prohibited phrases for this step

---

## 2. Script — OPEN

**[SAY]**
> "What you are about to see is the program intelligence layer operating
> on a live program. The queries are pre-defined. The data is locked.
> I will show you what the system knows."

**[DO NOT SAY]**
- "I'm going to show you something impressive."
- "This is where the AI comes in."
- "Let me explain what you're about to see."

**[DO]** Confirm path state is INACTIVE — show terminal output.

**[PAUSE]** 3 seconds after confirmation.

---

## 3. Script — Phase 1 Queries

### After GQ-001

**[SAY]**
> "Space scope query. Operational dimensions currently invisible to the program."

**[PAUSE]** 4 seconds.

**[DO NOT SAY]**
- "This shows seven blind spots."
- "The program can't see these things, which is a risk."

---

### After GQ-002

**[SAY]**
> "Event layer query. The real-time pipeline state."

**[PAUSE]** 4 seconds.

**[DO NOT SAY]**
- "The system found issues here."
- "This is a red flag."

---

### After GQ-003 (baseline — pause point)

**[SAY]**
> "Blast radius query. What fails if a core component changes right now."

**[PAUSE]** 8 seconds — full silence. Let audience read.

**[THEN SAY]**
> "That is the baseline. Clean ENL output. No additional layers."

**[PAUSE]** 3 seconds.

**[DO NOT SAY]**
- "Notice how many signals came up."
- "This is telling us the program has a problem."
- "The confidence here suggests..."

---

## 4. Script — WOW-1 Setup

**[SAY]**
> "The discipline layer is standing by.
> I am going to activate it now."

**[PAUSE]** 3 seconds.

**[DO NOT SAY]**
- "Watch what the AI adds."
- "Now things get interesting."
- "This is the good part."

---

## 5. Script — Activation Checkpoint

**[DO]**
```bash
python3 scripts/pios/42.13/demo_activate.py --enable
```

**[AFTER OUTPUT — SAY]**
> "Path state: SEMANTIC_PATH_ACTIVE.
> Eight acceptance conditions passed.
> The discipline layer is live."

**[PAUSE]** 4 seconds.

**[DO NOT SAY]**
- "The AI is now running."
- "The system is now smarter."
- "Now the real analysis begins."

---

## 6. Script — GQ-003 Contrast (WOW-1 moment)

**[SAY before running]**
> "Same query. Same program."

**[DO]**
```bash
python3 scripts/pios/42.4/execlens_adapter.py GQ-003
```

**[AFTER OUTPUT — SAY]**
> "The executive answer is unchanged.
> The signals are unchanged.
> The evidence chains are unchanged."

**[PAUSE]** 4 seconds.

**[THEN SAY]**
> "What was added: the semantic_annotations block per signal.
> The discipline layer labeled what was already there."

**[PAUSE]** 6 seconds. [WOW-1 moment — full silence]

**[DO NOT SAY]**
- "The AI identified the constructs."
- "This means the program has a dependency problem."
- "The semantic layer improved the output."
- "See how much more we know now?"

---

## 7. Script — Phase 2 Queries (GQ-004, GQ-005, GQ-006)

For each query:

**[SAY]**
> "{query description from query_signal_map.json query_text}"

**[PAUSE]** 3 seconds after each output.

No additional commentary. Let the output stand.

---

## 8. Script — WOW-2 Setup

**[SAY]**
> "The same evidence is available at different depths.
> I am going to show you the same query through a different lens."

**[PAUSE]** 2 seconds.

**[DO NOT SAY]**
- "Now I'll show you the really useful view."
- "This is the executive summary."
- "This is the version for people who don't want to read all that."

---

## 9. Script — Persona Transition (WOW-2 moment)

**[SAY before running]**
> "Same query. Same data. [PERSONA NAME] view."

**[DO]**
```bash
python3 scripts/pios/42.16/persona_view_map.py --persona [PERSONA] --query GQ-003
```

**[AFTER OUTPUT — SAY]**
> "The answer did not change. The depth changed."

**[PAUSE]** 4 seconds. [WOW-2 moment — full silence]

**[DO NOT SAY]**
- "This is the cleaner view."
- "Now you can see what really matters."
- "The analyst view shows the real evidence."
- "The executive view hides the complexity."

---

## 10. Script — Phase 3 Queries (GQ-007 through GQ-010)

For each query:

**[SAY]**
> "{query description}."

**[PAUSE]** 3 seconds.

No additional commentary after each query.

---

## 11. Script — CLOSE

**[DO]**
```bash
python3 scripts/pios/42.13/demo_activate.py --disable
```

**[AFTER OUTPUT — SAY]**
> "Path state reset to INACTIVE.
> The program is where it was before we started.
> The evidence did not change. The view did."

**[PAUSE]** 4 seconds.

**[DO NOT SAY]**
- "That's what the system can do for your program."
- "Imagine what we could find with more data."
- "This is just the beginning."

---

## 12. Allowed vs Forbidden Phrases — Reference Table

### Allowed phrases

| Phrase | Context |
|---|---|
| "Same query. Same program." | Before contrast run |
| "The discipline layer labeled what was already there." | After WOW-1 |
| "The answer did not change. The depth changed." | After persona transition |
| "Path state: SEMANTIC_PATH_ACTIVE." | After activation |
| "Eight acceptance conditions passed." | After activation |
| "That is the baseline." | After Phase 1 GQ-003 |
| "The evidence did not change." | At close |
| "{field name}: {verbatim value}" | When pointing to specific output |

### Forbidden phrases

| Phrase | Why forbidden |
|---|---|
| "This means..." | Interpretation |
| "The AI identified / detected / found" | Attribution claim |
| "This is a risk" / "This is a problem" | Judgment |
| "The system is smarter now" | Comparative evaluation |
| "Now you can see the real picture" | Implies prior view was incomplete |
| "This view is better" | Comparative evaluation |
| "The program has a bottleneck" | Conclusion from evidence |
| "The score is high/low" | Scoring — 75.x territory |
| "Let me explain what this means" | Interpretation |
| "Imagine if we had more data" | Speculative claim |

---

## 13. Language Rules (Summary)

| Rule | Application |
|---|---|
| Additive only | "What was added:" not "What changed:" |
| No inference | State field names, not conclusions |
| No superlatives | No "impressive", "powerful", "remarkable" |
| Verbatim field values | Cite field name + value, never paraphrase |
| Silence as tool | Pauses are part of the script |
| One sentence per step | Keep narration minimal |
