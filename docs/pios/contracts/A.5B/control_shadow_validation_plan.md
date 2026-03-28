# A.5B — CONTROL Shadow Parity Validation Plan

Stream: A.5B | Validation | Fail-Closed | Non-Destructive
Authority: A.5, A.4, A.3, A.2R, A.2G, canonical-layer-model.md (00.2)
Runtime target: index.js HEAD a5691c3 | Branch: feature/51-9-runtime-convergence
Execution date: 2026-03-28

---

## 1. Validation Approach

Runtime observability method: **Direct code extraction as pure functions**.

The runtime (index.js, HEAD a5691c3) is a deterministic React state machine. All state transitions are deterministic for identical inputs. The runtime state machine is extracted as pure functions from the current HEAD — an equivalent to live browser capture for deterministic systems. Any non-determinism (React batching timing, ref interactions) that would create observable state differences is noted as an INCOMPLETE path.

Source of truth: actual code at HEAD a5691c3. NOT intended behavior. NOT canonical future behavior.

---

## 2. Scenario Matrix

### A. INITIALIZATION (5 scenarios)

| ID  | Description | Key assertion |
|-----|-------------|---------------|
| A1  | INIT from clean load | openPanels=['situation'], all flags false |
| A2  | QUERY_SELECT null from pre-set state | Clears query and persona |
| A3  | QUERY_SELECT non-null from clean state | Sets query, resets traversalNodeIndex |
| A4  | PERSONA_SELECT before guided start | guidedStepIndex=0, demoComplete cleared |
| A5  | Multiple PERSONA_SELECT changes | Each change resets guidedStepIndex |

### B. GUIDED START (6 scenarios)

| ID  | Description | Key assertion |
|-----|-------------|---------------|
| B1  | DEMO_START EXECUTIVE | firstPanel=narrative, traversalHistory=[narrative] |
| B2  | DEMO_START CTO | firstPanel=signals, traversalHistory=[signals] |
| B3  | DEMO_START ANALYST | firstPanel=evidence, traversalHistory=[evidence] |
| B4  | AUTO_START EXECUTIVE | Same as B1, freeMode not modified |
| B5  | AUTO_START CTO | Same as B2 |
| B6  | AUTO_START ANALYST | Same as B3 |

### C. GUIDED ADVANCE — full sequences (4 scenarios, 11 events)

| ID  | Description | Key assertion |
|-----|-------------|---------------|
| C1  | EXECUTIVE full sequence (3 steps + terminal) | traversalHistory grows [narrative,signals,evidence], terminal clears persona |
| C2  | CTO full sequence (3 steps + terminal) | traversalHistory=[signals,evidence,narrative] |
| C3  | ANALYST full sequence (4 steps + rawStep + terminal) | rawStepActive=true at step 3, evidence dedup in traversalHistory |
| C4  | DEMO_NEXT after terminal boundary | Path C fallback; no-op since demoStage already past TOTAL_STAGES |

### D. EXIT / FREE MODE (4 scenarios)

| ID  | Description | Key assertion |
|-----|-------------|---------------|
| D1  | DEMO_EXIT from active guided mode | freeMode=true, traversalHistory=[], openPanels **preserved** |
| D2  | PANEL_TOGGLE in FREE mode | Max-2 rule applies |
| D3  | PANEL_TOGGLE max-2 rule enforcement | Third open drops oldest |
| D4  | FREE mode → guided re-entry via DEMO_START | freeMode cleared, guided starts |

### E. POST-COMPLETION (3 scenarios)

| ID  | Description | Key assertion |
|-----|-------------|---------------|
| E1  | Terminal state verification | demoComplete=true, persona=null, mode=POST_COMPLETION |
| E2  | Post-completion persona toggle | Allowed per 51.8R amendment 7 |
| E3  | Post-completion non-persona toggle | Blocked per 51.8R amendment 7 |

### F. MID-STATE DISRUPTION (4 scenarios)

| ID  | Description | Key assertion |
|-----|-------------|---------------|
| F1a | PERSONA_SELECT mid-demo (documented mismatch) | traversalHistory NOT cleared by runtime |
| F1b | PERSONA_SELECT mid-demo + AUTO_START | Net parity: both reach [new_firstPanel] |
| F2  | QUERY_SELECT null in ENTRY with persona | Clears persona and query |
| F3  | QUERY_SELECT non-null in ENTRY with persona | Persona preserved per 51.8R amendment 8 |

### G. NO-OP / DENIAL PATHS (4 scenarios)

| ID  | Description | Key assertion |
|-----|-------------|---------------|
| G1  | PANEL_TOGGLE in GUIDED mode | Blocked — no state change |
| G2  | AUTO_START when freeMode=true | CONTROL FAIL; runtime no-op — both produce unchanged state |
| G3  | AUTO_START when demoActive=true | Blocked |
| G4  | AUTO_START when demoComplete=true | Blocked |

---

## 3. Coverage

Total scenarios: 30
Total validation events: 44
Covered intents: INIT, DEMO_START, AUTO_START, DEMO_NEXT, DEMO_EXIT, PANEL_TOGGLE, PERSONA_SELECT, QUERY_SELECT

### Uncovered paths (documented as INCOMPLETE)

- **DEMO_NEXT Path B (legacy selectedFlow)**: All test scenarios use PERSONA_GUIDED_FLOWS (Path A). Path B requires a selectedFlow set without an associated persona. No scenario in the current runtime exercise this path in its primary usage.
- **DEMO_NEXT Path C (stage mode)**: Requires scenarios where no PERSONA_GUIDED_FLOWS entry exists for the persona. Not exercised in primary flows.
- **QUERY_SELECT null mid-demo**: traversalHistory interaction when demo is active at time of query clear. ENTRY-only tested.
- **DEMO_START from mid-demo state (without prior EXIT)**: Not a supported user path in current runtime.

---

## 4. Execution harness

Script: `scripts/pios/A.5B/run_control_shadow_validation.mjs`
Self-contained: all logic inlined (TraversalEngine + Control + runtime state machine)
Run: `node scripts/pios/A.5B/run_control_shadow_validation.mjs`
