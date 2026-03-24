# Step Binding Specification
## Stream 42.18 — ENL & Persona Demo Orchestration Integration

**contract_id:** PIOS-42.18-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-22

---

## 1. Purpose

This document defines the binding between each demo step and its corresponding:
- query selection state
- ENL reveal state
- persona selection state
- semantic activation state expectation
- UI section targeted

Each binding is deterministic. Same step → same state transition. No branching.

---

## 2. Complete Step Binding Table

| Step | Label | Query | ENL Reveal | Persona | Activation Expected | UI Section | Trigger Source |
|---|---|---|---|---|---|---|---|
| 1 | System | — | false | null | INACTIVE | gauges | scroll |
| 2 | Structure | — | false | null | INACTIVE | topology | scroll |
| 3 | Query | GQ-003 | false | null | INACTIVE | query | auto-select + scroll |
| 4 | Signals | GQ-003 | false | null | INACTIVE | signals | scroll |
| 5 | Evidence | GQ-003 | false | null | INACTIVE | evidence | scroll |
| 6 | ENL | GQ-003 | **true** | null | ANY | enl | set + scroll |
| 7 | Navigate | GQ-003 | true | null | ANY | navigation | scroll |
| 8 | Persona | GQ-003 | true | **EXECUTIVE** | ANY | persona | set + scroll |
| 9 | Complete | GQ-003 | true | EXECUTIVE | ANY | — | scroll top |

**Notes:**
- Step 3 auto-selects GQ-003 via `useEffect` (existing 42.8 behavior — unchanged)
- Step 6 sets `enlRevealActive = true` via `useEffect` — triggers ENL panel fetch
- Step 8 sets `activePersona = 'EXECUTIVE'` via `useEffect` if no persona selected yet
- "ANY" activation state means the step does not depend on path_state
- Default persona at step 8 is EXECUTIVE — operator may switch via PersonaPanel selector

---

## 3. Step-by-Step Binding Details

### Step 1 — System

**UI section:** `data-demo-section="gauges"`
**Query:** none
**ENL:** inactive
**Persona:** none
**42.17 mapping:** T+00:00 OPEN — state verification before queries begin
**State change:** none — demo starts

---

### Step 2 — Structure

**UI section:** `data-demo-section="topology"`
**Query:** none
**ENL:** inactive
**Persona:** none
**42.17 mapping:** T+00:30 Phase 1 setup — structural context visible
**State change:** none

---

### Step 3 — Query (GQ-003 Baseline)

**UI section:** `data-demo-section="query"`
**Query:** GQ-003 (auto-selected via existing useEffect)
**ENL:** inactive — baseline view only
**Persona:** none
**42.17 mapping:** T+08:00 WOW-1 SETUP — baseline established before contrast
**State change:** `selectedQuery = 'GQ-003'`

**Binding rule SB-003:** The query selector auto-fires GQ-003 at this step. This is the SAFE MODE baseline. The audience sees the canonical 42.4 adapter output.

---

### Step 4 — Signals

**UI section:** `data-demo-section="signals"`
**Query:** GQ-003 (retained)
**ENL:** inactive
**Persona:** none
**42.17 mapping:** Phase 1 signal display — signals visible before semantic layer
**State change:** none — signals already loaded from step 3

---

### Step 5 — Evidence

**UI section:** `data-demo-section="evidence"`
**Query:** GQ-003 (retained)
**ENL:** inactive
**Persona:** none
**42.17 mapping:** Phase 1 evidence — baseline chains visible before ENL reveal
**State change:** none — evidence already loaded from step 3

**Binding rule SB-005:** This step establishes the baseline evidence view. The audience must see evidence chains in the standard view before the ENL reveal at step 6. Same-source guarantee: both step 5 and step 6 draw from the same query output.

---

### Step 6 — ENL Reveal

**UI section:** `data-demo-section="enl"`
**Query:** GQ-003 (retained — same query as step 5)
**ENL:** **true** — panel fetches and displays ENL chain
**Persona:** none
**42.17 mapping:** WOW-1 T+10:30 — semantic_annotations contrast moment
**State change:** `enlRevealActive = true`

**Binding rule SB-006:** ENL reveal is triggered by step advancement only. The ENL panel fetches from `/api/execlens?enl=GQ-003`. Output is rendered verbatim from `enl_console_adapter.py`. No interpretation added.

**Same-query guarantee:** GQ-003 remains selected. The ENL panel shows the ENL chain for the same query the audience just saw in steps 3–5. The contrast is structural depth, not a different query.

**API call:** `GET /api/execlens?enl=GQ-003`
**Script called:** `scripts/pios/42.15/enl_console_adapter.py --query GQ-003`

---

### Step 7 — Navigate

**UI section:** `data-demo-section="navigation"`
**Query:** GQ-003 (retained)
**ENL:** true (retained — panel remains visible)
**Persona:** none
**42.17 mapping:** Phase 2 / pre-persona continuation — vault references visible
**State change:** none

---

### Step 8 — Persona

**UI section:** `data-demo-section="persona"`
**Query:** GQ-003 (retained — same query as all prior steps)
**ENL:** true (retained)
**Persona:** **EXECUTIVE** (default at step entry if no prior selection)
**42.17 mapping:** WOW-2 T+16:30 — persona transition; same evidence at different depth
**State change:** `activePersona = 'EXECUTIVE'` (if null)

**Binding rule SB-008:** Persona panel activates with GQ-003 already selected. The audience has now seen GQ-003 in:
- Step 3: canonical 42.4 output (baseline)
- Step 6: ENL chain depth (enhanced)
- Step 8: EXECUTIVE persona depth (filtered)

All three use the same query. Same truth. Different depth.

**API call:** `GET /api/execlens?persona=EXECUTIVE&query=GQ-003`
**Script called:** `scripts/pios/42.16/persona_view_map.py --persona EXECUTIVE --query GQ-003`

**Operator control:** PersonaPanel includes EXECUTIVE / CTO / ANALYST selector. Operator may switch persona at this step. Each switch issues a new API call. Query remains GQ-003.

---

### Step 9 — Complete

**UI section:** none — scroll to top
**Query:** GQ-003 (retained — no automatic reset)
**ENL:** true (retained)
**Persona:** operator's last selected persona (retained)
**42.17 mapping:** T+26:00 CLOSE
**State change:** demo completes on next → exit

---

## 4. State Invariants Across Steps

| Invariant | Description |
|---|---|
| SI-001 | selectedQuery never changes after step 3 (unless operator manually changes) |
| SI-002 | enlRevealActive is monotonic — once true, remains true for session |
| SI-003 | activePersona defaults to EXECUTIVE at step 8 if null |
| SI-004 | step advancement never resets query, ENL state, or persona state |
| SI-005 | API calls are idempotent — same step + same state = same output |

---

## 5. Query Selection Rules

| Rule | Description |
|---|---|
| QR-001 | GQ-003 is auto-selected at demo step 3 (existing 42.8 behavior) |
| QR-002 | Operator may select any query at any step via QuerySelector — this is additive, not overridden |
| QR-003 | ENL panel and Persona panel use the currently selected query — they follow operator selection |
| QR-004 | When ENL or Persona panel shows a query, it shows it verbatim from the governing adapter |

---

## 6. Semantic Activation State Binding

The semantic activation state (`SEMANTIC_PATH_INACTIVE` / `SEMANTIC_PATH_ACTIVE` / `SEMANTIC_PATH_FALLBACK`) is:
- Determined by `demo_activate.py --status` (CLI — 42.13)
- Visible in the UI via the path state indicator (read from `/api/execlens?status=true`)
- Not controllable from the UI — CLI only

The ENL reveal (step 6) and persona view (step 8) operate regardless of activation state.
The ENL chain is available in INACTIVE mode (evidence mapping mode via 42.15).
The persona view is available in INACTIVE mode.

Activation state is displayed for transparency, not as a gating condition.

---

## 7. CLI–UI Correspondence

| 42.17 CLI step | 42.18 UI step | Correspondence |
|---|---|---|
| T+00:00 OPEN | Step 1 | System gauges = baseline state visible |
| T+00:30 Phase 1 GQ-003 | Step 3 | Query auto-select = GQ-003 baseline |
| T+10:30 WOW-1 (ENL contrast) | Step 6 | enlRevealActive = true |
| T+16:30 WOW-2 (persona switch) | Step 8 | activePersona = EXECUTIVE |
| T+26:00 CLOSE | Step 9 | Complete |
