# Panel Orchestration Spec — 51.4

Stream: 51.4
Date: 2026-03-25
Contract: PIOS-51.4-RUN01-CONTRACT-v1

---

## Panel Registry

| Panel ID | Component | Title | Data Source |
|---|---|---|---|
| situation | DisclosurePanel > LandingGaugeStrip + TopologyPanel | Situation | 42.x runtime |
| signals | DisclosurePanel > SignalGaugeCard[] | Why is this critical? | 42.x runtime |
| persona | DisclosurePanel > PersonaPanel | What does this mean for you? | ENL substrate (42.16) |
| evidence | DisclosurePanel > ENLPanel | Show evidence | ENL substrate (42.4 evidence) |
| narrative | DisclosurePanel > NarrativePanel | So what? | 51.x composition |

---

## Open State Rules

- `openPanels`: array of panel IDs (max 2)
- Opening panel when 2 already open: oldest is dropped
- User can toggle any panel freely (non-demo mode)
- Demo mode: stages open panels deterministically

## Stage → Panel Mapping

```
STAGE_PANEL = {
  1: 'situation',
  2: 'signals',
  3: 'persona',
  4: 'evidence',
  5: 'narrative',
}
```

## Auto-Select

At stage 1: `selectedQuery = 'GQ-003'` — data loads while SituationPanel is being introduced.

---

## Panel Ownership

| Panel | Owns | Does NOT own |
|---|---|---|
| Situation | Topology, gauges | Signals, persona, evidence |
| Signals | SignalGaugeCard entries | Evidence detail, persona framing |
| Persona | Persona selector + ENL lens | Signal computation, emphasis |
| Evidence | EvidencePanel + NavigationPanel | Signal entries, narrative |
| Narrative | ExecutivePanel + TemplateRenderer | Signals, evidence raw data |

Single source rendering — each element in exactly one panel.

---

## Orchestration Non-Computable Guarantee

Panel orchestration MUST NOT:
- compute new meaning
- infer hidden state
- alter runtime outputs
- introduce non-documented branching

`openPanel()` and `togglePanel()` are pure UI state mutations.
No data transformation occurs on panel open/close.

---

## DemoController Integration

DemoController emits `onNext()` → index.js maps to `STAGE_PANEL[demoStage]` → `openPanel(panelId)`.
DemoController has no knowledge of panel IDs or content.
Keyboard: → / Enter / Space = next stage. Escape = exit.
