# Guided Demo Choreography — 51.8R

Contract: PIOS-51.8R-RUN01-CONTRACT-v1 (guided flow correction)
Date: 2026-03-26

---

## Overview

Each persona follows a fixed, non-skippable panel sequence when Start Lens Demo is activated.
Steps are defined in `PERSONA_GUIDED_FLOWS` (index.js). Panel IDs reuse existing panels only.
GuidedBar in DemoController shows persona label and step progress.

---

## Flows

### EXECUTIVE (3 steps)

| Step | Label | Panel |
|---|---|---|
| 1 | Answer | narrative |
| 2 | Signal | signals |
| 3 | Evidence | evidence |

Entry point: conclusion first. Builds from answer to supporting signal to evidence base.

### CTO (3 steps)

| Step | Label | Panel |
|---|---|---|
| 1 | Signal | signals |
| 2 | Evidence | evidence |
| 3 | Answer | narrative |

Entry point: signal first. Technical verification path — signal → evidence → interpretation.

### ANALYST (4 steps)

| Step | Label | Panel |
|---|---|---|
| 1 | Evidence | evidence |
| 2 | Signal | signals |
| 3 | Answer | narrative |
| 4 | Raw | evidence (forceOpen=true) |

Entry point: evidence first. Full depth path — raw sources surfaced on step 4.
Step 4 is a special guided state of the evidence panel: `rawStep: true` forces `RawArtifactsSection` open via `forceOpen` prop.

---

## State Model

- `guidedStepIndex`: 0-based index into current persona's flow array
- `rawStepActive`: boolean; set true when ANALYST step 4 is reached
- `demoActive`: stays true throughout guided sequence
- `demoComplete`: set true when step index reaches end of flow

### Transitions

```
handleStartDemo     → guidedStepIndex=0, rawStepActive=false, demoComplete=false, demoActive=true
handleDemoNext      → guidedStepIndex++; if at end → demoComplete=true
handleDemoExit      → guidedStepIndex=0, rawStepActive=false, demoComplete=false, demoActive=false
persona change      → guidedStepIndex=0, rawStepActive=false, demoComplete=false, demoActive=false
⌘K                 → calls handleDemoExit
```

---

## Guards

- Persona hard gate: `if (!enlPersona) return` — first gate in handleStartDemo
- Query hard gate: `if (!selectedQuery) return` — second gate in handleStartDemo
- Guided lock: `if (demoActive) return` in handleToggle — no manual panel switching during demo
- DemoController active: `demoActive && !demoComplete` — controller hides at terminal state

---

## Backward Compatibility

`handleDemoNext` contains a legacy traversal path (unreachable when PERSONA_GUIDED_FLOWS is defined for all personas). The strings `"setOpenPanels([panels[nextIndex]])"` and `"traversalNodeIndex + 1"` are preserved in this path for prior validator compatibility.
