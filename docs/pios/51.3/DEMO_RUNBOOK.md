# ExecLens Demo Runbook — Unified 9-Step Stakeholder Walkthrough
## PIOS-51.3-RUN01-CONTRACT-v1 · run_01_blueedge
## Supersedes: PIOS-42.9-RUN01-CONTRACT-v1 (7-step flow)

---

## Before You Begin

- [ ] `npm run dev` is running → `http://localhost:3000` is open
- [ ] Browser is on the landing page (full page visible, no query selected)
- [ ] Topology panel is visible — confirm `C_30_Domain_Event_Bus` renders RED (emphasis:high)
- [ ] Obsidian is open (optional — for deep link demo at Step 9)
- [ ] Persona selected for this audience: Exec / CTO / Analyst (choose before starting)

---

## Pre-Demo Verification

Before beginning, verify the RED node is active:

> Scroll to the topology panel.
> Confirm `C_30_Domain_Event_Bus` (Domain Event Bus, DOMAIN-11) has a red border and red background.
> If not visible: check that `docs/pios/44.2/projection_attachment.json` contains
> `C_30_Domain_Event_Bus` with `"emphasis": "high"` and restart the server.

---

## Demo Script

---

### Step 1 — Entry (15 seconds)

*[No clicks. Full page visible. Speak to the screen.]*

> "This is ExecLens — a program intelligence execution surface.
> What you are about to see was extracted from your actual architecture artifacts.
> No surveys. No manual reports. No synthetic data. No inference."

> "Every value on this page is either extracted from a governed source — or it doesn't appear."

---

### Step 2 — Query Selection (20 seconds)

*[Point to the query selector or demo controls at top.]*

> "We're going to ask one question. The hardest one."

*[Select GQ-003 from the query list.]*

> "What is the blast radius if a core platform component fails?"

> "Everything we see from this point forward is the system's answer to that question —
> traversed, not estimated."

---

### Step 3 — Structural Overview (20 seconds)

*[Demo bar or page scrolls to gauge strip. Four metric cards spotlighted.]*

> "Before the query even executes, ExecLens already knows the structural condition."

*[Point to coordination pressure gauge.]*

> "Coordination pressure: 87.5%. That's a ratio extracted from your structural telemetry —
> seven of your eight shared coordination interfaces are in active use."

> "Seven runtime dimensions are currently unknown. This is your baseline — grounded in
> evidence, not estimated."

*[Point to gauges generally.]*

> "Four signals. Four direct source references. If extraction failed, you'd see null — not a default."

---

### Step 4 — Topology Rendering (20 seconds)

*[Scroll to topology panel. Full hierarchy visible without query highlight.]*

> "This is your architecture as ExecLens sees it."

*[Gesture to domain blocks.]*

> "Four domains: Edge Data Acquisition. Platform Infrastructure. Event-Driven Architecture.
> Operational Engineering. Five capabilities. Nine components."

> "These groupings were derived from your own query drill-downs — co-occurrence frequency
> across ten queries. Nothing was invented. Nothing was labelled by hand."

*[Pause briefly — allow RED node to register visually.]*

---

### Step 5 — Highlight Focus (20 seconds)

*[Query-linked highlight activates — blue/yellow/teal highlighting on GQ-003 nodes.]*

> "Watch the topology respond."

*[Point to highlighted nodes.]*

> "These nodes lit up because they appear in the evidence bound to this query.
> Blue border: the domain. Yellow: the capability. Teal: the components.
> Every highlight traces back through the evidence index to a specific vault note."

> "The system isn't deciding what's relevant. It's reading what the evidence says is relevant."

---

### Step 6 — Emphasis Activation (20 seconds)

*[Point to the RED node — C_30_Domain_Event_Bus.]*

> "This node is red. Look carefully — that is not a highlight. That is emphasis."

> "RED means this node carries high-emphasis projection — assigned upstream, in the governed
> projection layer, before ExecLens rendered anything."

> "Domain Event Bus. DOMAIN-11. Event-Driven Architecture. Sole component of its capability."

> "The projection layer determined: this is your blast radius node. ExecLens is showing you
> what the projection layer already knew. Not estimating. Not deciding."

*[If audience asks "who decided it's red?"]*
> "The 44.x projection attachment. It's a governed file. You can inspect it."

---

### Step 7 — Persona Selection (15 seconds)

*[Verbal only — no click required.]*

*[Choose one framing based on your audience. Announce it.]*

> [Exec] "Let's look at what this means for your program commitment."

> [CTO] "Let's look at what this exposes structurally in your architecture."

> [Analyst] "Let's look at what the evidence confirms and what it doesn't."

*[The query response is the same for all personas. The framing differs.]*

---

### Step 8 — ENL Lens Application (20 seconds)

*[Query response panel now visible — response text, intelligence signals, evidence summary.]*

*[Deliver the lens-appropriate framing for the loaded query response.]*

**Exec:**
> "Three intelligence signals are bound to this question. One of them — Dependency Load
> Elevation — is the signal behind the red node. If Domain Event Bus fails, you lose
> the coordination hub for your entire Event-Driven Architecture domain. That's not a
> risk model. That's a structural observation."

**CTO:**
> "COMP-65 is a single-component capability. SIG-003 shows 15 of 22 dependency relationships
> trace through it — a 0.682 load ratio. The blast radius is bounded but concentrated.
> The evidence is structural telemetry, not runtime — so the ratio is static, confirmed."

**Analyst:**
> "SIG-003 is evaluable — awaiting Stream 75.1 threshold activation. SIG-001 and SIG-002
> are blocked: runtime telemetry unavailable. The structural claim is confirmed. The
> activation state is not yet confirmed. Evidence gap: runtime signal states."

---

### Step 9 — Executive Narrative (30 seconds)

*[Point to Intelligence Signals panel, Evidence panel, Navigation panel in sequence.]*

> "Here is the evidence chain — start to finish."

*[Signals panel.]*
> "Three signals bound to this query. Each with a confidence rating and a direct evidence
> reference. Not summarized. The system used these exact artifacts."

*[Evidence panel.]*
> "The evidence chain. ST-006, ST-007, ST-010 — structural telemetry. These are the files
> from which the signal values were extracted. You can see every step."

*[Navigation panel — if Obsidian configured, click a resolved link.]*
> "And here — one click opens the architecture note in your vault. This is the living
> documentation your signal is bound to."

*[Step back. Pause.]*

> "Three minutes. One question. A blast radius identified through a deterministic traversal
> of your own program artifacts. One red node — projection-driven, not guessed."

> "Evidence first. From acquisition to signal to intelligence to narrative — every step
> is traceable, inspectable, and reproducible."

> "That is Program Intelligence."

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

**"Why is that node red?"**
> The emphasis:high value was assigned in the governed projection layer — the 44.x
> projection attachment. ExecLens reads that value and renders it. The decision was
> upstream, before this screen loaded.

**"Is this real data?"**
> Yes. Every signal was extracted from actual structural telemetry and architecture
> artifacts for the BlueEdge program. No values were invented or estimated.

**"Can we add our own queries?"**
> Yes. Queries are defined in `docs/pios/41.5/query_signal_map.json`. Each query
> maps to signals in the signal registry.

**"How is this different from a dashboard?"**
> A dashboard visualizes data you already have. ExecLens traverses your program
> artifacts and extracts structural intelligence you didn't know you had.

**"What's the evidence-first principle?"**
> Every value displayed traces to a specific source artifact. If ExecLens cannot
> find evidence, it returns null — not an estimate.

**"Who is the persona for?"**
> The persona determines how the same governed output is framed for different
> audiences. The data doesn't change. The lens does.

---

## Timing Summary

| Step | Duration | Cumulative |
|---|---|---|
| 1 — Entry | 15s | 0:15 |
| 2 — Query Selection | 20s | 0:35 |
| 3 — Structural Overview | 20s | 0:55 |
| 4 — Topology Rendering | 20s | 1:15 |
| 5 — Highlight Focus | 20s | 1:35 |
| 6 — Emphasis Activation | 20s | 1:55 |
| 7 — Persona Selection | 15s | 2:10 |
| 8 — ENL Lens | 20s | 2:30 |
| 9 — Executive Narrative | 30s | **3:00** |
