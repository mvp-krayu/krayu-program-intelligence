# ENL & Persona Integration Specification
## Stream 42.18 — ENL & Persona Demo Orchestration Integration

**contract_id:** PIOS-42.18-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-22

---

## 1. Purpose

This document defines how ENL chain reveal and persona view switching are integrated
into the existing ExecLens UI demo flow. It defines the data path, rendering rules,
same-truth guarantees, and non-duplication requirements.

---

## 2. ENL Reveal Integration

### 2.1 Data Path

```
Demo step 6 advances
    │
    ▼
index.js: setEnlRevealActive(true)
    │
    ▼
ENLRevealPanel renders, fetches:
    GET /api/execlens?enl=GQ-003
    │
    ▼
execlens.js API route: enl handler
    │
    ▼
enl_console_adapter.py --query GQ-003   [scripts/pios/42.15]
    │
    ▼
Read-only access to:
  - docs/pios/41.6/ENL-002_minimal_graph_example.json  (ENL graph mode)
  - docs/pios/41.4/evidence_mapping_index.json          (evidence mapping mode)
    │
    ▼
stdout → { text: "..." } → ENLRevealPanel renders verbatim in <pre>
```

### 2.2 Rendering Rules

| Rule | Description |
|---|---|
| ER-001 | ENL chain output rendered verbatim — no parsing, no transformation |
| ER-002 | Output displayed in monospace `<pre>` block |
| ER-003 | No field labels added or removed |
| ER-004 | No interpretation sentence injected above or below the output |
| ER-005 | Panel header: "ENL Chain — {queryId}" — verbatim field reference only |
| ER-006 | Loading state shown during fetch — no spinner animation injected |
| ER-007 | Error state shown on fetch failure — demo is not blocked |

### 2.3 Same-Query Guarantee

The ENL panel always uses the currently selected query (`selectedQuery` from `index.js` state).
When demo advances to step 6:
- `selectedQuery` is still `GQ-003` (set at step 3, unchanged)
- ENL panel fetches ENL chain for GQ-003
- The audience is seeing the same query across steps 3, 4, 5, and 6

**ENL-SQ-001:** The ENL chain displayed at step 6 corresponds to the same query the
audience saw in its canonical 42.4 output at step 3.

### 2.4 No Duplicate Rendering

The existing `EvidencePanel.js` (step 5) already renders evidence chains from 42.4 adapter output.
The ENL panel (step 6) renders ENL chain navigation depth from 42.15 adapter output.

These are distinct views:
- Step 5 (EvidencePanel): evidence fields from `evidence_mapping_index.json` via 42.4 adapter
- Step 6 (ENLRevealPanel): ENL navigation chain from `enl_console_adapter.py` (42.15)

There is no duplicate rendering. The two panels use different source scripts and display
complementary, non-overlapping information.

**ER-DUP-001:** ENLRevealPanel does not re-render content already shown in EvidencePanel.
**ER-DUP-002:** EvidencePanel is not hidden or replaced when ENLRevealPanel is shown.

---

## 3. Persona View Integration

### 3.1 Data Path

```
Demo step 8 advances
    │
    ▼
index.js: setActivePersona('EXECUTIVE')  [if null]
    │
    ▼
PersonaPanel renders, fetches:
    GET /api/execlens?persona=EXECUTIVE&query=GQ-003
    │
    ▼
execlens.js API route: persona handler
    │
    ▼
persona_view_map.py --persona EXECUTIVE --query GQ-003  [scripts/pios/42.16]
    │
    ▼
Read-only access to:
  - docs/pios/41.4/evidence_mapping_index.json
  - docs/pios/41.6/ENL-002_minimal_graph_example.json
  - (same sources as ENL panel — different script, different output)
    │
    ▼
stdout → { text: "..." } → PersonaPanel renders verbatim in <pre>
```

### 3.2 Persona Selector

PersonaPanel includes a three-button selector:
- `[ EXECUTIVE ]` | `[ CTO ]` | `[ ANALYST ]`

On selection change:
- `activePersona` state updates
- New API fetch fires immediately
- Output panel rerenders with new persona output
- Query remains unchanged — same `selectedQuery`

**PS-001:** Persona switch never changes the selected query.
**PS-002:** The selector shows only the three governed personas (EXECUTIVE, CTO, ANALYST).
**PS-003:** No "free text" persona input is allowed.
**PS-004:** The active persona button is visually distinct (active state).

### 3.3 Same-Truth Guarantee

The persona view renders the same evidence as the canonical 42.4 output — at a different
default depth and ordering, as defined by `persona_view_map.py` (42.16).

Per 42.16 RULE-001 (same-truth guarantee):
- Signal IDs are identical across all personas
- Signal statements are identical
- Evidence source references are identical
- Only depth, field ordering, and display emphasis differ

**PT-001:** PersonaPanel output contains the same signal IDs visible in step 4 (SignalGaugeCard).
**PT-002:** PersonaPanel output contains the same evidence references visible in step 5 (EvidencePanel).
**PT-003:** PersonaPanel does not introduce new signal content not present in the 42.4 adapter output.

### 3.4 No Duplicate Demo Path

The PersonaPanel is a new section added to the existing page. It does not:
- Replace the existing query flow
- Create a second query execution path
- Introduce a parallel DemoController instance
- Create a second query selector

The existing query selector continues to work. The existing demo flow continues to work.
PersonaPanel is an additive section that appears at step 8 and remains visible through step 9.

**PD-001:** PersonaPanel does not render until `activePersona` is non-null (step 8+).
**PD-002:** No second DemoController is introduced.
**PD-003:** PersonaPanel uses the same `selectedQuery` state as all other panels.

---

## 4. API Route Integration

Two new routes added to `/api/execlens.js`:

### Route: `?enl=QUERY_ID`

```javascript
// execlens.js — new ENL route
if (enl) {
  const sanitizedEnl = String(enl).toUpperCase().replace(/[^A-Z0-9\-]/g, '')
  return runScriptText(ADAPTER_42_15, ['--query', sanitizedEnl], res)
}
```

**Adapter:** `scripts/pios/42.15/enl_console_adapter.py`
**Output format:** `{ text: string }` — raw stdout
**Sanitization:** Same pattern as existing query sanitization

### Route: `?persona=PERSONA&query=QUERY_ID`

```javascript
// execlens.js — new persona route
if (persona && query) {
  const sanitizedPersona = String(persona).toUpperCase().replace(/[^A-Z]/g, '')
  const sanitizedQuery = String(query).toUpperCase().replace(/[^A-Z0-9\-]/g, '')
  const allowed = ['EXECUTIVE', 'CTO', 'ANALYST']
  if (!allowed.includes(sanitizedPersona)) {
    return res.status(400).json({ error: 'invalid persona' })
  }
  return runScriptText(ADAPTER_42_16, ['--persona', sanitizedPersona, '--query', sanitizedQuery], res)
}
```

**Adapter:** `scripts/pios/42.16/persona_view_map.py`
**Output format:** `{ text: string }` — raw stdout
**Allowlist:** EXECUTIVE, CTO, ANALYST — no other value accepted

### Route: `?status=true`

```javascript
// execlens.js — new status route
if (status === 'true') {
  return runScriptText(ADAPTER_42_13, ['--status'], res)
}
```

**Adapter:** `scripts/pios/42.13/demo_activate.py`
**Output format:** `{ text: string }` — raw stdout
**Purpose:** Displays current path_state in UI — read-only, no activation capability

### Text output helper

A new `runScriptText` function returns stdout as `{ text: string }` instead of parsed JSON:

```javascript
function runScriptText(scriptPath, args, res) {
  execFile('python3', [scriptPath, ...args], { timeout: 30000 }, (err, stdout, stderr) => {
    if (err) {
      return res.status(400).json({ error: (stderr || err.message || 'adapter error').trim() })
    }
    return res.status(200).json({ text: stdout })
  })
}
```

---

## 5. Component Integration Rules

### ENLRevealPanel

- Fetches on mount when `queryId` prop is non-null
- Refetches if `queryId` changes
- Shows loading state during fetch
- Shows error state on failure — no crash, no demo block
- Renders `text` field from API response in `<pre>` tag
- Header: "ENL Chain — {queryId}"
- No additional UI controls

### PersonaPanel

- Renders persona selector (EXECUTIVE / CTO / ANALYST) at all times when mounted
- Fetches on mount and on persona change
- Shows loading state during fetch
- Shows error state on failure — selector remains usable
- Renders `text` field from API response in `<pre>` tag
- Header: "Persona View — {activePersona} — {queryId}"
- Persona change triggers new fetch, does not change query

---

## 6. No-Interpretation Guarantee

| Rule | Description |
|---|---|
| NI-001 | ENLRevealPanel adds no explanatory text to the chain output |
| NI-002 | PersonaPanel adds no explanatory text to the persona output |
| NI-003 | Neither panel adds "this means" or equivalent phrasing |
| NI-004 | Neither panel summarizes the output |
| NI-005 | Panel headers cite field names only — no conclusions |
| NI-006 | Error messages reference system state only — no interpretation |
