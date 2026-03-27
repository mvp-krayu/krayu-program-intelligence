# ExecLens Demo Runbook — Persona-Guided Walkthrough
## PIOS-51.8R-RUN05-CONTRACT-v1 · run_02_governed
### (supersedes PIOS-42.9-RUN01-CONTRACT-v1 · run_01_blueedge)

---

## Before You Begin

- [ ] `npm run dev` is running → `http://localhost:3000` is open
- [ ] Browser is on the landing page (Situation panel visible — topology + gauges)
- [ ] No persona selected, no query selected (clean ENTRY state)
- [ ] Obsidian is open (optional — for architecture deep-link reference in topology)

---

## Demo Overview

The Lens demo is persona-driven. Before any query runs, the presenter selects
a lens persona that determines the evidence traversal sequence:

| Persona | Sequence | Best for |
|---------|----------|----------|
| **EXECUTIVE** | Answer → Signal → Evidence | Board-level / investor audience |
| **CTO** | Signal → Evidence → Answer | Technical executive / architecture review |
| **ANALYST** | Evidence → Signal → Answer → Raw | Technical deep-dive / audit audience |

**Recommended default: CTO + GQ-003** (blast radius query, 3-step guided flow)

---

## Primary Demo Script — CTO Lens · GQ-003

---

### Opening (15 seconds)

> "This is Lens. What you're seeing right now is your program's structural
> condition — loaded directly from your architecture artifacts. No surveys. No
> manual reports. No synthetic data."

*[Gesture to the four gauge cards in the Situation panel.]*

> "These four metrics — Dependency Load, Structural Density, Coordination
> Pressure, Visibility Deficit — were extracted from your own signal registry.
> Every number has a direct source."

---

### Persona Selection (10 seconds)

*[Scroll to or click "What does this mean for you?" panel to expand it.]*

> "Before we run anything, we select a lens. The same program intelligence
> surfaces differently depending on who's in the room."

*[Click **CTO**.]*

> "CTO lens: we lead with signals, walk through evidence, and arrive at the
> structured answer."

*[The query selector unlocks. Entry strip shows CTO persona as selected.]*

---

### Query Selection → Auto-Start (10 seconds)

*[Select **GQ-003** from the query selector.]*

> "The hardest question first: what is the blast radius if a core platform
> component fails?"

*[Demo starts automatically. GuidedBar appears at bottom: "CTO — GUIDED FLOW".
Situation panel remains open. Signals panel opens alongside it.]*

---

### Step 1 — Signal (20 seconds)

*[GuidedBar shows step 1 of 3. Signals panel is active.]*

> "Three intelligence signals are bound to this query. Each carries a
> confidence rating, a relevance level, and a direct evidence chain. This is
> exactly what the system used to form its answer."

*[Point to STRONG / MODERATE confidence chips. Note signal IDs.]*

> "No inference. These confidence levels came from your own evidence index."

*[CLICK Next →]*

---

### Step 2 — Evidence (20 seconds)

*[Evidence panel opens. ENLPanel renders with CTO persona analysis.]*

> "Here is the evidence layer. Every signal traces to specific structural
> telemetry artifacts — ST-006, ST-007, and so on. The chain depth tells you
> how many verification steps exist between the signal and the raw artifact."

> "If anyone asks 'why does the system say this?' — the answer is here,
> explicitly, and it's inspectable."

*[CLICK Next →]*

---

### Step 3 — Answer (20 seconds)

*[Narrative panel opens with structured executive response.]*

> "So what? This is the structured answer — evidence-grounded, not generated.
> Same input, same query, same output every time."

*[GuidedBar shows "Try another perspective" on the CTA.]*

*[CLICK Try another perspective.]*

*[Demo completes. Persona clears. Panels reset to Situation. Demo bar disappears.]*

---

### After Completion (10 seconds)

> "The loop is closed. To run again with a different lens — select another
> persona."

*[Select EXECUTIVE or ANALYST from the persona panel for a follow-on run if
the audience wants to see a different traversal sequence.]*

---

### Timing Summary — CTO Lens

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Opening | 15s | 0:15 |
| Persona selection | 10s | 0:25 |
| Query selection + auto-start | 10s | 0:35 |
| Step 1 — Signal | 20s | 0:55 |
| Step 2 — Evidence | 20s | 1:15 |
| Step 3 — Answer | 20s | 1:35 |
| Completion | 10s | **1:45** |

*Note: EXECUTIVE lens adds ~0 time (same step count). ANALYST lens adds one
step (Raw evidence at step 4) — approximately +20s.*

---

## Operator Mode (FREE) — Post-Demo Exploration

After the guided loop completes, press **Exit** (in demo bar during a run)
or **CTRL-K** at any point to enter OPERATOR MODE.

**What OPERATOR MODE looks like:**
- "OPERATOR MODE" badge appears in the hero
- Entry step strip is hidden
- "Run Lens Demo" button is visible
- All panels are freely toggleable

**What you can do in OPERATOR MODE:**
- Open any panel in any order
- Browse the evidence panel directly (ENLPanel renders with last active persona if still set)
- Toggle topology + signals + narrative freely
- Change persona or query to re-examine any angle

**To re-enter guided mode from FREE:**
*[Ensure persona + query are selected, then click **Run Lens Demo**.]*

> "This is operator mode — the same intelligence, free navigation, no guided
> constraints. The analyst or architect can explore any dimension independently."

---

## Persona Variants

### EXECUTIVE Lens

Sequence: **Answer → Signal → Evidence**

Start with the conclusion. Audience sees the answer immediately, then traces
back through the signals and evidence chain on demand.

Best for: board presentation, investor walkthrough, executive briefing.

*[Use same script structure: select EXECUTIVE → select query → follow 3 steps.]*

---

### ANALYST Lens

Sequence: **Evidence → Signal → Answer → Raw**

Evidence-first. Step 4 opens raw source artifacts directly in the evidence panel.

Best for: technical audit, architecture review, deep-dive session.

> "ANALYST mode exposes the raw structural telemetry artifacts at step 4.
> These are the actual source files the extraction rules ran against."

*[At step 4, the evidence panel switches to source artifact view.]*

---

## Available Queries

| Query | Question |
|-------|----------|
| GQ-001 | What operational dimensions are currently invisible? |
| GQ-002 | Is the real-time event layer operating within tolerance? |
| GQ-003 | What is the blast radius if a core component fails? |
| GQ-004 | How stable is the component boundary architecture? |
| GQ-005 | What is the highest-risk single point of failure? |
| GQ-006 | Is the data ingestion pipeline at declared capacity? |
| GQ-007 | What components have not been confirmed operational? |
| GQ-008 | How much observable state is covered by intelligence? |
| GQ-009 | Are coordination mechanisms operating at adequate frequency? |
| GQ-010 | What structural conditions are compounding risk? |

---

## Handling Questions

**"Is this real data?"**
> Yes. Every signal was extracted from actual structural telemetry and
> architecture artifacts for the BlueEdge program. No values were invented
> or estimated.

**"Why does the same question look different for CTO vs EXECUTIVE?"**
> The underlying data is identical. The traversal sequence is different. CTO
> leads with signals. EXECUTIVE leads with the answer. Same intelligence,
> different entry point.

**"Can we add our own queries?"**
> Yes. Queries are defined in `docs/pios/41.5/query_signal_map.json`.
> Each query maps to signals in the signal registry.

**"How is this different from a dashboard?"**
> A dashboard visualizes data you already have. Lens traverses your program
> artifacts and extracts structural intelligence you didn't know you had.
> The intelligence is derived — not reported.

**"What's the evidence-first principle?"**
> Every value displayed traces to a specific source artifact. If the system
> cannot find evidence, it returns null — not an estimate.

**"What is OPERATOR MODE?"**
> After a guided session exits, OPERATOR MODE gives the presenter or analyst
> free access to all panels — no choreography, no sequence. It's the same
> intelligence surface without the guided flow.
