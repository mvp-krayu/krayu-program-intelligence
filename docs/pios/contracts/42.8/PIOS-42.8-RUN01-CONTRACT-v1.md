# PIOS-42.8-RUN01-CONTRACT-v1
## ExecLens Demo Choreography & Stakeholder Presentation Layer

**Run:** run_01_blueedge
**Layer:** 42.8 — Demo choreography (presentation-only)
**Status:** PASS — all 21 validation checks passed

---

## Deliverables

| Deliverable | Path |
|-------------|------|
| Demo controller component | `app/execlens-demo/components/DemoController.js` |
| index.js update | `app/execlens-demo/pages/index.js` |
| CSS additions | `app/execlens-demo/styles/globals.css` (`.demo-*` classes) |
| Validator | `scripts/pios/42.8/validate_demo_choreography.py` |

---

## Demo Flow (deterministic, 7 steps, no branching)

| Step | Label | Target Section | Action |
|------|-------|---------------|--------|
| 1 | System | `data-demo-section="gauges"` | Scroll + spotlight overview gauges |
| 2 | Structure | `data-demo-section="topology"` | Scroll + spotlight topology panel |
| 3 | Query | `data-demo-section="query"` | Scroll + spotlight + auto-select GQ-003 via setSelectedQuery |
| 4 | Signals | `data-demo-section="signals"` | Scroll + spotlight signal grid (after data loads) |
| 5 | Evidence | `data-demo-section="evidence"` | Scroll + spotlight evidence chains |
| 6 | Navigate | `data-demo-section="navigation"` | Scroll + spotlight navigation panel |
| 7 | Complete | *(scroll to top, no spotlight)* | Full-page completion state |

---

## Modes

### Mode A — Free Exploration (default)
- Page renders normally with no demo state
- "Start ExecLens Demo" button visible in hero
- All existing 42.4–42.7 functionality fully available

### Mode B — Guided Demo (on activation)
- Fixed bottom bar appears: step pips + step title + Next/Exit controls
- `demo-active` class on `page-root` (adds bottom padding for bar clearance)
- Current section receives `.demo-spotlight` outline ring
- Previous spotlight removed on step advance
- Keyboard: `→ / Enter / Space` = Next, `Escape` = Exit

---

## Governing Rules Applied

| Rule | Implementation |
|------|---------------|
| R3 No content modification | DemoController has zero fetch calls, zero setQueryData/setSelectedQuery calls |
| R4 Spotlight only | Highlight via `classList.add('demo-spotlight')` — no inline style injection |
| R6 Remove on advance | `document.querySelectorAll('.demo-spotlight').forEach(el => el.classList.remove(...))` before each step |
| R7 Query via normal path | Step 3: `setSelectedQuery('GQ-003')` in index.js useEffect — triggers existing fetch logic |
| G4 Fail closed | If target section absent from DOM (e.g. signals before query), spotlight skipped silently |
| G5 No demo magic | DemoController contains no signal IDs, metric values, or hardcoded domain names |

---

## Implementation Details

### Spotlight mechanism
```javascript
const el = document.querySelector(`[data-demo-section="${stepDef.target}"]`)
if (el) {
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => el.classList.add('demo-spotlight'), 100)
}
```

### Step 3 query trigger (index.js)
```javascript
useEffect(() => {
  if (demoActive && demoStep === 3) {
    setSelectedQuery('GQ-003')   // Uses normal query fetch path
  }
}, [demoActive, demoStep])
```

### Exit reset (index.js)
```javascript
const handleDemoExit = () => {
  setDemoActive(false)
  setDemoStep(0)
  // Spotlight removal handled by DemoController useEffect on active=false
}
```

---

## Boundary Declarations

- **No adapter changes**: 42.4, 42.6, 42.7 Python adapters unchanged
- **No new backend endpoints**: API route unchanged from 42.7
- **No content changes**: all displayed data identical to free-exploration mode
- **No upstream layer mutations**: 42.1, 42.2 untouched

---

## Full Stream Validation Chain (post 42.8)

| Stream | Validator | Result |
|--------|-----------|--------|
| 42.4 | validate_demo_surface.py | 20/20 PASS |
| 42.5 | validate_demo_refinement.py | 18/18 PASS |
| 42.6 | validate_overview_adapter.py | 20/20 PASS |
| 42.7 | validate_topology_panel.py | 22/22 PASS |
| 42.8 | validate_demo_choreography.py | 21/21 PASS |

**Total: 101/101 checks passed across the complete 42.x stream chain.**

---

## Handover to 42.9

Stream 42.9 — Packaging / Deployment / Demo Distribution Layer

The demo surface is now:
- Technically complete (42.1–42.7)
- Demo-ready (42.8 guided flow)
- Evidence-first throughout
- No synthetic data anywhere in the stack
- 101/101 governance checks passing
