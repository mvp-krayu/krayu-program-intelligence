# A.5B — CONTROL Shadow Parity Trace Log

Stream: A.5B | Execution Trace | Non-Destructive
Authority: A.5, A.5C, A.4, A.3, A.2R, A.2G, canonical-layer-model.md (00.2)
Runtime target: index.js HEAD a5691c3 | Branch: feature/51-9-runtime-convergence
Execution date: 2026-03-28 | Rerun date: 2026-03-28 (post A.5C remediation)

---

## Format

Each entry: `[scenario/event] RESULT — description | field: value (if mismatch)`

Result codes: PASS | FAIL | DOCUMENTED

---

## A. INITIALIZATION

### A1 — INIT from clean load
| Evt | Result | Description |
|-----|--------|-------------|
| A1/1 | PASS | Initial state construction — openPanels=[situation], all flags false |

### A2 — QUERY_SELECT null from clean state
| Evt | Result | Description |
|-----|--------|-------------|
| A2/1 | PASS | Clear query — should clear persona too |

### A3 — QUERY_SELECT non-null from clean state
| Evt | Result | Description |
|-----|--------|-------------|
| A3/1 | PASS | Set query from null — traversalNodeIndex reset |

### A4 — PERSONA_SELECT before guided start
| Evt | Result | Description |
|-----|--------|-------------|
| A4/1 | PASS | Set persona in ENTRY — clears demoComplete, resets guidedStepIndex |

### A5 — Multiple PERSONA_SELECT changes before guided start
| Evt | Result | Description |
|-----|--------|-------------|
| A5/1 | PASS | Change persona EXECUTIVE→CTO in ENTRY |
| A5/2 | PASS | Change persona CTO→ANALYST in ENTRY |

**Section result: 6/6 PASS**

---

## B. GUIDED START

### B1 — DEMO_START EXECUTIVE
| Evt | Result | Description |
|-----|--------|-------------|
| B1/1 | PASS | EXECUTIVE: first step narrative — traversalHistory=[narrative] |

### B2 — DEMO_START CTO
| Evt | Result | Description |
|-----|--------|-------------|
| B2/1 | PASS | CTO: first step signals — traversalHistory=[signals] |

### B3 — DEMO_START ANALYST
| Evt | Result | Description |
|-----|--------|-------------|
| B3/1 | PASS | ANALYST: first step evidence — traversalHistory=[evidence] |

### B4 — AUTO_START EXECUTIVE
| Evt | Result | Description |
|-----|--------|-------------|
| B4/1 | PASS | AUTO_START path — does not set freeMode, same first step as DEMO_START |

### B5 — AUTO_START CTO
| Evt | Result | Description |
|-----|--------|-------------|
| B5/1 | PASS | CTO auto-start — first step signals |

### B6 — AUTO_START ANALYST
| Evt | Result | Description |
|-----|--------|-------------|
| B6/1 | PASS | ANALYST auto-start — first step evidence |

**Section result: 6/6 PASS**

---

## C. GUIDED ADVANCE — Full Sequences

### C1 — EXECUTIVE full sequence (3 steps + terminal)
| Evt | Result | Description |
|-----|--------|-------------|
| C1/1 | PASS | Step 0→1: narrative→signals — traversalHistory=[narrative,signals] |
| C1/2 | PASS | Step 1→2: signals→evidence — traversalHistory=[narrative,signals,evidence] |
| C1/3 | PASS | Step 2→terminal: demoComplete=true, persona cleared |

### C2 — CTO full sequence (3 steps + terminal)
| Evt | Result | Description |
|-----|--------|-------------|
| C2/1 | PASS | Step 0→1: signals→evidence — traversalHistory=[signals,evidence] |
| C2/2 | PASS | Step 1→2: evidence→narrative — traversalHistory=[signals,evidence,narrative] |
| C2/3 | PASS | Step 2→terminal: demoComplete=true, persona cleared |

### C3 — ANALYST full sequence (4 steps + rawStep + terminal)
| Evt | Result | Description |
|-----|--------|-------------|
| C3/1 | PASS | Step 0→1: evidence→signals — traversalHistory=[evidence,signals] |
| C3/2 | PASS | Step 1→2: signals→narrative — traversalHistory=[evidence,signals,narrative] |
| C3/3 | PASS | Step 2→3: rawStep evidence — traversalHistory unchanged, rawStepActive=true |
| C3/4 | PASS | Step 3→terminal: demoComplete=true, persona cleared |

### C4 — DEMO_NEXT after terminal boundary
| Evt | Result | Description |
|-----|--------|-------------|
| C4/1 | PASS | DEMO_NEXT after terminal — no persona, demoStage past TOTAL_STAGES → no-op |

**Section result: 11/11 PASS**

---

## D. EXIT / FREE MODE

### D1 — DEMO_EXIT from active guided mode
| Evt | Result | Description |
|-----|--------|-------------|
| D1/1 | PASS | Exit from GUIDED — freeMode=true, traversalHistory=[], openPanels preserved [A.5C MM-001 resolved] |

### D2 — PANEL_TOGGLE in FREE mode
| Evt | Result | Description |
|-----|--------|-------------|
| D2/1 | PASS | Toggle signals in FREE mode — opens it |
| D2/2 | PASS | Toggle narrative with 2 open — max-2: drops situation |
| D2/3 | PASS | Toggle signals again — closes it |

### D3 — PANEL_TOGGLE max-2 rule enforcement
| Evt | Result | Description |
|-----|--------|-------------|
| D3/1 | PASS | Open evidence — [situation,evidence] |
| D3/2 | PASS | Open signals — max-2: drops situation → [evidence,signals] |
| D3/3 | PASS | Open narrative — max-2: drops evidence → [signals,narrative] |

### D4 — FREE mode → guided re-entry via DEMO_START
| Evt | Result | Description |
|-----|--------|-------------|
| D4/1 | PASS | Select new persona in FREE mode |
| D4/2 | PASS | Explicit DEMO_START from FREE — freeMode→false, guided starts |

**Section result: 9/9 PASS**

---

## E. POST-COMPLETION

### E1 — Terminal state verification
| Evt | Result | Description |
|-----|--------|-------------|
| E1/1 | PASS | Verify terminal state: demoComplete=true, persona=null, mode=POST_COMPLETION |

### E2 — Post-completion persona toggle allowed
| Evt | Result | Description |
|-----|--------|-------------|
| E2/1 | PASS | Persona panel toggle in POST_COMPLETION — allowed [51.8R amendment 7] |

### E3 — Post-completion non-persona toggle blocked
| Evt | Result | Description |
|-----|--------|-------------|
| E3/1 | PASS | Non-persona toggle in POST_COMPLETION — blocked, state unchanged [51.8R amendment 7] |

**Section result: 3/3 PASS**

---

## F. MID-STATE DISRUPTION

### F1a — PERSONA_SELECT mid-demo (traversalHistory preserved)
| Evt | Result | Description |
|-----|--------|-------------|
| F1a/1 | PASS | PERSONA_SELECT mid-demo — traversalHistory preserved in both runtime and CONTROL [A.5C MM-002/MM-003 resolved] |

### F1b — PERSONA_SELECT mid-demo + AUTO_START
| Evt | Result | Description |
|-----|--------|-------------|
| F1b/1 | PASS | Change persona mid-demo — traversalHistory preserved in both [A.5C fix] |
| F1b/2 | PASS | Net state: both runtime and CONTROL reach traversalHistory=[signals] for CTO after AUTO_START |

### F2 — QUERY_SELECT null in ENTRY with persona
| Evt | Result | Description |
|-----|--------|-------------|
| F2/1 | PASS | Clear query — persona cleared, query null, traversalNodeIndex=0 |

### F3 — QUERY_SELECT non-null in ENTRY with persona
| Evt | Result | Description |
|-----|--------|-------------|
| F3/1 | PASS | Change query — persona preserved [51.8R amendment 8], traversalNodeIndex=0 |

**Section result: 5/5 PASS**

---

## G. NO-OP / DENIAL PATHS

### G1 — PANEL_TOGGLE in GUIDED mode
| Evt | Result | Description |
|-----|--------|-------------|
| G1/1 | PASS | Toggle in GUIDED — blocked, state unchanged |

### G2 — AUTO_START when freeMode=true
| Evt | Result | Description |
|-----|--------|-------------|
| G2/1 | PASS | AUTO_START in FREE mode — CONTROL FAIL; runtime no-op — both agree intent blocked |

### G3 — AUTO_START when demoActive=true
| Evt | Result | Description |
|-----|--------|-------------|
| G3/1 | PASS | AUTO_START when already guided — blocked, state unchanged |

### G4 — AUTO_START when demoComplete=true
| Evt | Result | Description |
|-----|--------|-------------|
| G4/1 | PASS | AUTO_START when demoComplete — blocked, state unchanged |

**Section result: 4/4 PASS**

---

## Aggregate

| Section | Scenarios | Events | Pass | Fail | Documented |
|---------|-----------|--------|------|------|------------|
| A. INITIALIZATION | 5 | 6 | 6 | 0 | 0 |
| B. GUIDED START | 6 | 6 | 6 | 0 | 0 |
| C. GUIDED ADVANCE | 4 | 11 | 11 | 0 | 0 |
| D. EXIT / FREE | 4 | 9 | 9 | 0 | 0 |
| E. POST-COMPLETION | 3 | 3 | 3 | 0 | 0 |
| F. MID-STATE | 4 | 5 | 5 | 0 | 0 |
| G. NO-OP / DENIAL | 4 | 4 | 4 | 0 | 0 |
| **TOTAL** | **30** | **44** | **44** | **0** | **0** |

**VERDICT: PASS** — Zero mismatches. Post A.5C remediation rerun.
