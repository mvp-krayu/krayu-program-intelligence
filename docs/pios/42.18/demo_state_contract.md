# Demo State Contract
## Stream 42.18 — ENL & Persona Demo Orchestration Integration

**contract_id:** PIOS-42.18-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-22

---

## 1. Purpose

This document defines the required state fields maintained during the demo,
their valid values, transition rules, and failure-safe behaviors.

---

## 2. State Fields

### 2.1 Existing State (42.8 — unchanged)

| Field | Type | Default | Owner | Description |
|---|---|---|---|---|
| `selectedQuery` | string \| null | null | index.js | Currently selected query ID (e.g. "GQ-003") |
| `queryData` | object \| null | null | index.js | Parsed adapter response for selected query |
| `loading` | boolean | false | index.js | True while query fetch is in flight |
| `error` | string \| null | null | index.js | Error message from query fetch |
| `demoActive` | boolean | false | index.js | True when demo mode is running |
| `demoStep` | integer | 0 | index.js | Current step number (1–9 in 42.18) |

### 2.2 New State (42.18 — added)

| Field | Type | Default | Owner | Description |
|---|---|---|---|---|
| `enlRevealActive` | boolean | false | index.js | True when ENL panel should be visible |
| `activePersona` | string \| null | null | index.js | Active persona name or null |

---

## 3. State Transitions

### 3.1 Demo Start

```
demoActive: false → true
demoStep:   0 → 1
enlRevealActive: false (unchanged)
activePersona: null (unchanged)
selectedQuery: null (unchanged)
```

### 3.2 Step Advance to Step 3

```
selectedQuery: null → 'GQ-003'  [via useEffect on demoStep === 3]
```

### 3.3 Step Advance to Step 6

```
enlRevealActive: false → true  [via useEffect on demoStep === 6]
```

ENLRevealPanel mounts and fetches ENL chain for `selectedQuery`.

### 3.4 Step Advance to Step 8

```
activePersona: null → 'EXECUTIVE'  [via useEffect on demoStep === 8, only if null]
```

If `activePersona` is already set (operator pre-selected), no change.
PersonaPanel mounts and fetches persona view for `selectedQuery`.

### 3.5 Demo Exit

```
demoActive: true → false
demoStep: N → 0
enlRevealActive: false  [reset on exit]
activePersona: null  [reset on exit]
selectedQuery: unchanged  [not reset — operator retains context]
```

### 3.6 Persona Change (operator-driven)

```
activePersona: 'EXECUTIVE' → 'CTO' | 'ANALYST'
selectedQuery: unchanged  [invariant]
```

PersonaPanel refetches with new persona. Query does not change.

---

## 4. Transition Rules

| Rule | Description |
|---|---|
| TR-001 | `enlRevealActive` transitions from false to true at step 6 only — never earlier |
| TR-002 | `enlRevealActive` once true, remains true until demo exit |
| TR-003 | `activePersona` defaults to 'EXECUTIVE' at step 8 if currently null |
| TR-004 | Persona change never changes `selectedQuery` |
| TR-005 | `demoStep` advances monotonically during demo — no step skip |
| TR-006 | All state resets on demo exit except `selectedQuery` |
| TR-007 | `queryData` updates when `selectedQuery` changes — existing 42.8 behavior |

---

## 5. State Validity Table

| State | Valid values | Invalid values |
|---|---|---|
| `demoStep` | 0 (inactive), 1–9 | < 0, > 9 |
| `enlRevealActive` | true, false | — |
| `activePersona` | null, 'EXECUTIVE', 'CTO', 'ANALYST' | any other string |
| `selectedQuery` | null, 'GQ-001'..'GQ-010' (from adapter list) | arbitrary strings |

---

## 6. Derived State Rules

| Derived condition | Expression | Meaning |
|---|---|---|
| ENL panel visible | `enlRevealActive && queryData !== null` | ENL chain can be fetched |
| Persona panel visible | `activePersona !== null && queryData !== null` | Persona view can be fetched |
| Demo in ENL phase | `demoActive && demoStep >= 6` | ENL panel is active |
| Demo in persona phase | `demoActive && demoStep >= 8` | Persona panel is active |

---

## 7. Failure-Safe Behaviors

### 7.1 ENL Fetch Failure

| Condition | State effect | UI behavior |
|---|---|---|
| API returns error | `enlRevealActive` remains true | Panel shows error message |
| Script not found | API returns 400 | Panel shows error message |
| Parse error | API returns 500 | Panel shows error message |

**DSC-FS-001:** ENL fetch failure does not block demo step advancement.
**DSC-FS-002:** ENL fetch failure does not affect `queryData`, `selectedQuery`, or any other panel.

### 7.2 Persona Fetch Failure

| Condition | State effect | UI behavior |
|---|---|---|
| API returns error | `activePersona` remains set | Panel shows error, selector stays visible |
| Script not found | API returns 400 | Panel shows error, selector stays visible |
| Invalid persona rejected | API returns 400 | Panel shows error, selector stays visible |

**DSC-FS-003:** Persona fetch failure does not block demo step advancement.
**DSC-FS-004:** Persona selector remains interactive after a failed fetch — operator can retry or switch.

### 7.3 Status Fetch Failure

**DSC-FS-005:** If `/api/execlens?status=true` fails, path state indicator shows "unknown".
**DSC-FS-006:** Status fetch failure has no effect on any other demo state.

### 7.4 Demo Crash Prevention

**DSC-FS-007:** All API calls in ENLRevealPanel and PersonaPanel use try/catch or `.catch()` handlers.
**DSC-FS-008:** No unhandled promise rejection is permitted.
**DSC-FS-009:** The existing query panels (steps 3–5) remain fully functional in all failure states.

---

## 8. State Persistence Rules

| Rule | Description |
|---|---|
| SP-001 | State is session-only — not persisted to localStorage or cookies |
| SP-002 | Refreshing the page resets all state to defaults |
| SP-003 | State is not shared across browser tabs |
| SP-004 | All state lives in React component state (useState) — no external store |

---

## 9. State Observable via URL (None)

42.18 does not add URL query parameters or hash routing for state.
Demo state is fully internal to the React session.
This maintains the existing 42.8 behavior.
