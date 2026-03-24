# Demo Flow Master
## Stream 42.17 — Persona Demonstration Strategy / Audience-Specific Demo Flow

**contract_id:** PIOS-42.17-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Core Principle

> **Show — don't explain. Reveal — don't interpret.**

The system already works. This document orchestrates how it is revealed.

---

## 2. Master Timeline

The canonical demo runs approximately 28 minutes. Steps marked `[fixed]` must
occur in order. Steps marked `[optional]` may be skipped.

```
T+00:00  ── OPEN ──────────────────────────────────────────────────────────────
T+00:30  ── Phase 1: Baseline (SAFE MODE) ─────────────────────────────────────
T+08:00  ── WOW-1 SETUP ──────────────────────────────────────────────────────
T+10:00  ── ACTIVATION CHECKPOINT ────────────────────────────────────────────
T+10:30  ── Phase 2: Contrast (ENHANCED MODE) ────────────────────────────────
T+16:00  ── WOW-2 SETUP ──────────────────────────────────────────────────────
T+16:30  ── PERSONA TRANSITION (audience-specific) ───────────────────────────
T+22:00  ── Phase 3: Continuation / Deep Queries ─────────────────────────────
T+26:00  ── CLOSE ─────────────────────────────────────────────────────────────
T+28:00  ── [optional] Phase 4: Resilience ───────────────────────────────────
```

---

## 3. Step-by-Step Flow

### T+00:00 — OPEN

**Action:** State the demo context. No slides. Terminal visible.

**Say:**
> "What you are about to see is the program intelligence layer operating
> on a live program. The queries are pre-defined. The data is locked.
> I will not explain what the output means. I will show you what the system knows."

**Do not say:** "Let me tell you what this is about to reveal."

**System state:** `SEMANTIC_PATH_INACTIVE` (confirmed via `--status`)

---

### T+00:30 — Phase 1: Baseline (SAFE MODE)

**Action:** Run pre-flight, then GQ-001, GQ-002, GQ-003 in SAFE MODE.

```bash
python3 scripts/pios/42.13/validate_demo_strategy.py
python3 scripts/pios/42.4/execlens_adapter.py GQ-001
python3 scripts/pios/42.4/execlens_adapter.py GQ-002
python3 scripts/pios/42.4/execlens_adapter.py GQ-003
```

**After GQ-001:**
> "Space scope query. Operational dimensions currently invisible to the program."
> [pause 4 seconds]

**After GQ-002:**
> "Event layer. The real-time pipeline state."
> [pause 4 seconds]

**After GQ-003 — pause point [fixed]:**
> "Blast radius query. What fails if a core component changes right now."
> [pause 8 seconds — let audience read]
> "That is the baseline. Clean ENL output. No additional layers."

**System state:** `SEMANTIC_PATH_INACTIVE`

---

### T+08:00 — WOW-1 SETUP

**Action:** Pause. State what is about to happen — once, clearly.

**Say:**
> "The discipline layer is standing by.
> I am going to activate it now."

**Do not say:** "Watch what the AI adds." / "Now things get interesting."

[pause 3 seconds]

---

### T+10:00 — ACTIVATION CHECKPOINT [fixed]

**Action:** Run activation in visible terminal.

```bash
python3 scripts/pios/42.13/demo_activate.py --enable
```

**After output:**
> "Path state: SEMANTIC_PATH_ACTIVE.
> Eight acceptance conditions passed.
> The discipline layer is live."

[pause 4 seconds — let path_state confirmation register]

---

### T+10:30 — Phase 2: Contrast (ENHANCED MODE)

**Action:** Rerun GQ-003. This is the contrast query.

```bash
python3 scripts/pios/42.4/execlens_adapter.py GQ-003
```

**After output:**
> "Same query. Same program. Same ENL graph.
> The executive answer is unchanged.
> The signals are unchanged.
> The evidence chains are unchanged."
> [pause 4 seconds]
> "What was added: the semantic_annotations block per signal.
> The discipline layer labeled what was already there."

[pause 6 seconds — WOW-1 moment]

**Then continue:**

```bash
python3 scripts/pios/42.4/execlens_adapter.py GQ-004
python3 scripts/pios/42.4/execlens_adapter.py GQ-005
python3 scripts/pios/42.4/execlens_adapter.py GQ-006
```

After each:
> "{query_description}." [pause 3 seconds]

---

### T+16:00 — WOW-2 SETUP

**Action:** Pause. State the persona transition — once.

**Say:**
> "The same evidence is available at different depths.
> I am going to show you the same query through a different lens."

[pause 2 seconds]

---

### T+16:30 — PERSONA TRANSITION [audience-specific]

**Action:** Run `persona_view_map.py` with the audience-appropriate persona.

→ See `audience_variants.md` for which persona to use here.

**Say before running:**
> "Same query. Same data. [PERSONA] view."

**After output:**
> "The answer did not change. The depth changed."

[pause 4 seconds — WOW-2 moment]

---

### T+22:00 — Phase 3: Continuation

**Action:** Continue with GQ-007 through GQ-010 in current active persona.

```bash
python3 scripts/pios/42.4/execlens_adapter.py GQ-007
python3 scripts/pios/42.4/execlens_adapter.py GQ-008
python3 scripts/pios/42.4/execlens_adapter.py GQ-009
python3 scripts/pios/42.4/execlens_adapter.py GQ-010
```

After each query: state the query description. Pause 3 seconds. No commentary.

---

### T+26:00 — CLOSE

**Action:** Disable semantic path. State close.

```bash
python3 scripts/pios/42.13/demo_activate.py --disable
```

**Say:**
> "Path state reset to INACTIVE.
> The program is where it was before we started.
> The evidence did not change. The view did."

[pause 4 seconds]

---

### T+28:00 — [optional] Phase 4: Resilience

**Action:** Demonstrate reversibility or fallback. See `fallback_handling.md`.

---

## 4. Timing Reference Table

| Step | Start | Duration | Fixed? |
|---|---|---|---|
| OPEN | T+00:00 | 30s | YES |
| Phase 1: Baseline | T+00:30 | 7:30 | YES |
| WOW-1 Setup | T+08:00 | 2:00 | YES |
| Activation Checkpoint | T+10:00 | 30s | YES |
| Phase 2: Contrast | T+10:30 | 5:30 | YES |
| WOW-2 Setup | T+16:00 | 30s | YES |
| Persona Transition | T+16:30 | 2:30 | NO (audience-dependent) |
| Phase 3: Continuation | T+22:00 | 4:00 | NO (depth varies) |
| CLOSE | T+26:00 | 2:00 | YES |
| [optional] Resilience | T+28:00 | 4:00 | NO |

---

## 5. Invariants

| Invariant | Rule |
|---|---|
| SAFE MODE before activation | RULE-005 |
| Same query (GQ-003) for contrast | RULE-007 |
| Activation visible to audience | RULE-006 |
| Persona stated before switch | RULE-003 |
| No interpretation at any step | RULE-002 |
| Pauses respected | RULE-009 |
| Timing consistent across runs | RULE-008 |
