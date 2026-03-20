# ExecLens Demo Runbook — 3-Minute Stakeholder Walkthrough
## PIOS-42.9-RUN01-CONTRACT-v1 · run_01_blueedge

---

## Before You Begin

- [ ] `npm run dev` is running → `http://localhost:3000` is open
- [ ] Browser is on the landing page (full page visible)
- [ ] Obsidian is open (optional — for deep link demo at Step 6)
- [ ] No query is selected (clean state)

---

## Demo Script

---

### Opening (15 seconds)

> "This is ExecLens. What you're seeing right now is your program's structural
> condition — loaded directly from your architecture artifacts. No surveys. No
> manual reports. No synthetic data."

*[Gesture to the four gauge cards at the top of the page.]*

> "These four metrics — Dependency Load, Structural Density, Coordination
> Pressure, Visibility Deficit — were extracted from your own signal registry.
> Every number has a direct source. You can see where each one comes from."

---

### CLICK: "Start ExecLens Demo"

*[Click the button in the hero. The demo bar appears at the bottom of the page.]*

---

### Step 1 — System (20 seconds)

*[Demo bar shows: **1 System** active. Page spotlights the gauge strip.]*

> "Before you select any query, the system already knows your structural state.
> Coordination pressure at 87.5%. Seven runtime dimensions currently unknown.
> This is your baseline — evidence-grounded, not estimated."

*[CLICK Next →]*

---

### Step 2 — Structure (25 seconds)

*[Page scrolls to topology panel. Spotlighted.]*

> "This is your architecture as ExecLens sees it — four domains, five
> capabilities, nine components. These groupings came from your own query
> drill-downs. Nothing was invented."

*[Point to domain blocks.]*

> "Edge Data Acquisition. Platform Infrastructure. Event-Driven Architecture.
> Operational Engineering. These are the structural anchors of the BlueEdge
> platform."

*[CLICK Next →]*

---

### Step 3 — Query (30 seconds)

*[GQ-003 auto-selects. Page scrolls to query zone. System begins executing.]*

> "Now we ask the hardest question: what is the blast radius if a core
> platform component fails?"

*[Wait for data to load — ~3 seconds. Results appear.]*

> "The system has traversed your signal registry, bound the evidence, and
> returned a structured response. No inference. No summarization. Pure
> signal extraction."

*[Note: the answer section renders with the executive response.]*

*[CLICK Next →]*

---

### Step 4 — Signals (20 seconds)

*[Page scrolls to Intelligence Signals panel. Spotlighted.]*

> "Three intelligence signals are bound to this query. Each signal has a
> confidence rating, a relevance level, and a direct evidence chain. You
> can see exactly what the system used to form its answer."

*[Point to STRONG / MODERATE confidence chips.]*

*[CLICK Next →]*

---

### Step 5 — Evidence (20 seconds)

*[Page scrolls to Evidence panel. Spotlighted.]*

> "This is the evidence layer. Every signal traces back to specific structural
> telemetry artifacts — ST-006, ST-007, and so on. The chain depth tells you
> how many steps of verification exist between the signal and the raw artifact."

> "If you ask 'why does ExecLens say this?' — the answer is here, explicitly."

*[CLICK Next →]*

---

### Step 6 — Navigate (20 seconds)

*[Page scrolls to Navigation panel. Spotlighted.]*

> "And here's where it connects to your living architecture documentation.
> These are vault-resolved links — direct paths to notes in your Obsidian
> vault."

*[If Obsidian is configured — click a resolved link.]*

> "One click opens the actual architecture note."

*[If Obsidian is not configured.]*

> "When the vault is connected, each resolved entity becomes a direct link
> into your architecture documentation."

*[CLICK Next →]*

---

### Step 7 — Complete (15 seconds)

*[Demo bar shows: **7 Complete**. Page scrolls to top.]*

> "Three minutes. Ten queries available. Four domains. Evidence-first throughout."

> "This isn't a dashboard built on guesses. It's a traversal engine that
> reads your actual program artifacts and returns structured intelligence."

> "Every value you saw is traceable to a specific signal, a specific evidence
> artifact, and a specific source file. That's Program Intelligence."

*[CLICK Finish ✓ — demo mode exits.]*

---

## Post-Demo Exploration

The stakeholder can now freely explore:

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

**"Can we add our own queries?"**
> Yes. Queries are defined in `docs/pios/41.5/query_signal_map.json`.
> Each query maps to signals in the signal registry.

**"How is this different from a dashboard?"**
> A dashboard visualizes data you already have. ExecLens traverses your
> program artifacts and extracts structural intelligence you didn't know
> you had. The intelligence is derived — not reported.

**"What's the evidence-first principle?"**
> Every value displayed traces to a specific source artifact. If ExecLens
> cannot find evidence, it returns null — not an estimate.

---

## Timing Summary

| Step | Duration | Cumulative |
|------|----------|------------|
| Opening | 15s | 0:15 |
| Start Demo | 5s | 0:20 |
| Step 1 — System | 20s | 0:40 |
| Step 2 — Structure | 25s | 1:05 |
| Step 3 — Query | 30s | 1:35 |
| Step 4 — Signals | 20s | 1:55 |
| Step 5 — Evidence | 20s | 2:15 |
| Step 6 — Navigate | 20s | 2:35 |
| Step 7 — Complete | 15s | 2:50 |
| Finish | 10s | **3:00** |
