# Fallback Handling
## Stream 42.17 — Persona Demonstration Strategy / Audience-Specific Demo Flow

**contract_id:** PIOS-42.17-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines how fallback states are handled during a live demo —
how to narrate them, what commands to run, and what the audience hears.

The core principle: **fallback is resilience, not failure.**

---

## 2. Fallback States in ExecLens

| State | System condition | Demo consequence |
|---|---|---|
| `SEMANTIC_PATH_INACTIVE` | Default / post-disable | All personas work; no annotations |
| `SEMANTIC_PATH_ACTIVE` | Post-enable; all ACs pass | Full enhanced mode |
| `SEMANTIC_PATH_FALLBACK` | Post-enable; any AC fails | Silent revert; neutral notice |

The ENL graph remains operational in all three states.
Queries continue to run in all three states.

---

## 3. Scenario 1 — Activation Fails (exit non-zero)

**Trigger:** `demo_activate.py --enable` returns exit code 1.

**What the terminal shows:** Error output from demo_activate.py.

**[SAY]:**
> "The activation check did not pass. The system remains in baseline mode.
> We will continue with ENL output."

**[DO NOT SAY]:**
- "Something went wrong."
- "The AI isn't working right now."
- "Let me restart."

**[DO]:**
```bash
python3 scripts/pios/42.13/demo_activate.py --status
```

Show the path_state. If INACTIVE: continue Phase 2 in SAFE MODE using 42.4 adapter.
If FALLBACK: state neutrally (see Scenario 2).

**Narration (SAFE MODE continuation):**
> "Continuing in baseline mode. ENL output is fully operational."

**Demo continuity:** Phases 2 and 3 run with 42.4 adapter in INACTIVE mode.
Persona views are available but will show evidence-mapping mode only.

---

## 4. Scenario 2 — FALLBACK State Triggered

**Trigger:** Path state is `SEMANTIC_PATH_FALLBACK` — one or more acceptance
conditions failed after activation.

**What the terminal shows:** Single-line notice from 42.15 exposure layer:
```
[path_state: SEMANTIC_PATH_FALLBACK — semantic annotations unavailable]
```

**[SAY]:**
> "The semantic path is in fallback mode.
> The ENL graph is operational. Queries continue to run.
> The discipline layer suspended itself. This is the expected behavior."

**[PAUSE]** 3 seconds.

**[DO NOT SAY]:**
- "The system failed."
- "We have a problem."
- "The AI isn't working."
- "Let me fix this."

**[DO]:** Continue running queries with 42.4 adapter. Output is clean ENL.
State: "ENL output continues normally."

**Recovery (if needed):**
```bash
python3 scripts/pios/42.13/demo_activate.py --disable
python3 scripts/pios/42.13/demo_activate.py --enable
python3 scripts/pios/42.13/demo_activate.py --status
```

Show the status output verbatim. If ACTIVE: continue in ENHANCED MODE.
If FALLBACK again: continue in baseline.

---

## 5. Scenario 3 — Demonstrating Fallback Intentionally (Phase 4 Optional)

This scenario is for technical audiences who want to see fallback as a
system property — not an accident.

**Timing:** T+28:00 (Phase 4, optional)

**[SAY before running:]**
> "The system has a fallback path. I am going to demonstrate it deliberately."

**[DO] Step 1 — Reversibility:**
```bash
python3 scripts/pios/42.13/demo_activate.py --disable
python3 scripts/pios/42.4/execlens_adapter.py GQ-003
```
> "Back to baseline. Same output as Phase 1."

**[DO] Step 2 — Re-enable:**
```bash
python3 scripts/pios/42.13/demo_activate.py --enable
python3 scripts/pios/42.4/execlens_adapter.py GQ-003
```
> "Reactivated. The annotations return."

**[THEN SAY:]**
> "The semantic path is reversible.
> The system reverts cleanly. The ENL graph is unaffected in any state."

**[DO NOT SAY]:**
- "See how robust it is."
- "The AI can handle failures."
- "This proves the system is reliable."

---

## 6. Narration Rules for Fallback

| Language allowed | Language forbidden |
|---|---|
| "Fallback mode — the expected safe behavior." | "Something went wrong." |
| "The ENL graph remains operational." | "The AI isn't working." |
| "The discipline layer suspended itself." | "We have a bug." |
| "The semantic path reverted." | "This shouldn't have happened." |
| "ENL output continues normally." | "Let me restart everything." |
| "The system reverts cleanly." | "Don't worry about that." |

---

## 7. Fallback Recovery Commands Reference

```bash
# Check current state
python3 scripts/pios/42.13/demo_activate.py --status

# Reset to INACTIVE
python3 scripts/pios/42.13/demo_activate.py --disable

# Attempt re-enable
python3 scripts/pios/42.13/demo_activate.py --enable

# Verify validators pass (if FALLBACK persists)
python3 scripts/pios/42.13/validate_demo_strategy.py
```

---

## 8. Fallback Invariants

| Invariant | Description |
|---|---|
| ENL always operational | Queries always run regardless of path_state |
| Neutral notice only | One line, no alarm language, no error icon |
| Recovery is clean | `--disable` + `--enable` is the full recovery sequence |
| Audience knows state | path_state is always shown in persona headers |
| No improvisation | Fallback is narrated from this script only |
