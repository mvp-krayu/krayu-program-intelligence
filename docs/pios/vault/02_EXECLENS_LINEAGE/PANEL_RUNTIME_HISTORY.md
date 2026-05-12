# Panel Runtime History

> **The ExecLens panel state machine — how runtime governance worked before SQO.**

---

## Panel Architecture

ExecLens used a **panel-based runtime model** where each panel represented one intelligence facet:

- Evidence panels (raw evidence display)
- Signal panels (derived signals)
- Topology panels (structural visualization)
- Narrative panels (executive interpretation)
- Diagnostic panels (condition/diagnosis)

### Panel State Machine

Each panel had a state machine governing its behavior:
- `computePanelState()` — determine panel visibility/state from data
- `validatePanelTransition()` — govern transitions between panels
- Panel states: LOCKED, AVAILABLE, ACTIVE, COMPLETED

### Governance Documents

- `execlens_panel_state_model.md` — state machine definition
- `execlens_entry_exit_contract.md` — ingress/egress rules
- `execlens_navigation_contract.md` — navigation constraints
- `execlens_traversal_binding.md` — traversal path → panel binding

## Demo Choreography

The 51.x stream era (18 streams) was the most intensive panel iteration:

| Stream | What It Did |
|---|---|
| 51.1-51.2C | Governed WOW rendering, normalization |
| 51.3 | Unified demo surface recomposition |
| 51.4 | Progressive disclosure panel orchestration |
| 51.5 | ENL materialization |
| 51.6 | ENL traversal runtime engine |
| 51.6R-51.6R.4 | Persona panel corrections (4 repair iterations) |
| 51.7 | Persona hard gate |
| 51.8 | Guided demo choreography |
| 51.8R | 10 repair amendments to guided flow |
| 51.CLOSE | Governed closure for stabilized surface |

**Key learning:** The 51.x repair density (6 R-streams out of 18 total) revealed that panel-based guided choreography was brittle. Each persona change required cascading panel adjustments.

## What Replaced Panels

| Panel Concept | Replaced By | Why |
|---|---|---|
| Panel state machine | SQO S-state machine | S-states are deterministic from data, not panel interaction |
| Panel visibility gating | Q-class disclosure | Q-class determines what renders and how, not panel state |
| Guided choreography | SQO Cockpit sections | Sections are independently accessible, not sequentially locked |
| Panel transitions | Direct section navigation | No transition validation needed — each section is self-contained |

## Current Status: SUPERSEDED

The panel runtime model is fully superseded. No panel-specific code remains active.

The SQO Cockpit's 12 sections are spiritually similar (each renders one facet) but architecturally different:
- Sections are route-based (URL-navigable), not state-machine-gated
- Sections load data independently via server-side resolvers
- No guided sequence — all sections are accessible at any time
- No panel transitions — section switches are simple navigation

## Cross-References

- [[EXECLENS_RUNTIME_EVOLUTION]] — overall evolution
- [[../04_SQO_AND_QUALIFICATION/SQO_EVOLUTION]] — what replaced panels
- [[../12_ARCHIVE/SUPERSEDED_CONCEPTS]] — panels as superseded concept
