# DemoController 9-Step — 42.29

Stream: 42.29
Date: 2026-03-25
Contract: PIOS-51.3-RUN01-CONTRACT-v1
Supersedes: PIOS-42.8-RUN01-CONTRACT-v1 (7-step)

---

## Changes

7-step flow replaced with 9-step unified flow per docs/pios/51.3/demo_sequence.md.

TOTAL_DEMO_STEPS updated from 7 → 9 in index.js.
Auto-select trigger updated from demoStep === 3 → demoStep === 2.

---

## Step Table

| Step | Label | Target Section | DOM Section |
|---|---|---|---|
| 1 | Entry | null (top) | verbal only |
| 2 | Query | query | `[data-demo-section="query"]` |
| 3 | Overview | gauges | `[data-demo-section="gauges"]` |
| 4 | Topology | topology | `[data-demo-section="topology"]` |
| 5 | Focus | topology | `[data-demo-section="topology"]` |
| 6 | Emphasis | topology | `[data-demo-section="topology"]` |
| 7 | Persona | persona | `[data-demo-section="persona"]` |
| 8 | ENL | enl | `[data-demo-section="enl"]` |
| 9 | Narrative | signals | `[data-demo-section="signals"]` |

---

## Notes

- Steps 5 and 6 target "topology" — same section. Query highlight (step 5) and red-node emphasis (step 6) are both visible in the same panel after GQ-003 is selected.
- Step 7 targets "persona" — new PersonaPanel section added in index.js below intelligence output.
- Step 8 targets "enl" — rendered inside PersonaPanel when a persona is selected (data-demo-section="enl" is nested inside PersonaPanel).
- Step 9 targets "signals" — existing section, loaded from ?query=GQ-003 at step 2.
- G4 rule preserved: if target section absent from DOM → skip scroll, continue.
