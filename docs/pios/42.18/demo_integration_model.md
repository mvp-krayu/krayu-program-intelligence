# Demo Integration Model
## Stream 42.18 — ENL & Persona Demo Orchestration Integration

**contract_id:** PIOS-42.18-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-22

---

## 1. Integration Principle

> Extend the existing validated demo. Replace nothing.

The current ExecLens UI (42.8) already has:
- A 7-step `DemoController` with scroll orchestration and spotlight
- A query-selector-driven execution path fetching from `/api/execlens`
- ENL evidence chain display in the existing `EvidencePanel`
- Navigation vault display in `NavigationPanel`

What 42.18 adds:
- Two new demo steps (ENL Reveal at position 6, Persona at position 8)
- New API routes for ENL chain and persona view output
- Two new UI panels as additive sections (`data-demo-section="enl"` and `data-demo-section="persona"`)
- New state fields in `index.js` to track ENL reveal state and active persona

Total demo steps: 7 → 9

---

## 2. Reused — Unchanged

| Component | What is reused |
|---|---|
| `DemoController.js` | Step structure, scroll orchestration, spotlight, keyboard nav — all preserved |
| `QuerySelector.js` | Unchanged — query selection is the existing path |
| `EvidencePanel.js` | Unchanged — evidence chains remain in step 5 |
| `NavigationPanel.js` | Unchanged — navigation vault remains in step 7 |
| `ExecutivePanel.js` | Unchanged |
| `SignalGaugeCard.js` | Unchanged |
| `TemplateRenderer.js` | Unchanged |
| `LandingGaugeStrip.js` | Unchanged |
| `TopologyPanel.js` | Unchanged |
| `/api/execlens.js` | Extended with new routes only — existing routes unchanged |
| `42.4 adapter` | Unchanged — still the query execution engine |
| `42.13 demo_activate.py` | Unchanged — semantic activation CLI remains outside UI |
| `42.15 enl_console_adapter.py` | Read-only — called via new API route |
| `42.16 persona_view_map.py` | Read-only — called via new API route |

---

## 3. Added — New in 42.18

Step 6 (ENL Reveal) and Step 8 (Persona View) are the two new demo steps. Original steps 6 and 7 renumber to 7 and 9.

| Artifact | What is added |
|---|---|
| `DemoController.js` DEMO_STEPS | Step 6 (ENL) and Step 8 (Persona) added; original steps 6→7, 7→9 renumbered |
| `index.js` state | `enlRevealActive`, `activePersona` fields added |
| `index.js` effects | useEffect triggers for steps 6 and 8 |
| `index.js` panels | ENLRevealPanel section (data-demo-section="enl") and PersonaPanel section (data-demo-section="persona") added |
| `ENLRevealPanel.js` | New component — fetches ENL chain text from API, renders verbatim |
| `PersonaPanel.js` | New component — persona selector + fetches persona view text from API |
| `/api/execlens.js` routes | `?enl=QUERY_ID`, `?persona=PERSONA&query=QUERY_ID`, `?status=true` routes added |
| `scripts/pios/42.18/demo_step_map.py` | CLI orchestration step map — read-only helper |

---

## 4. Unchanged in Content and Behavior

| Guarantee | How enforced |
|---|---|
| Query execution logic | `execlens_adapter.py` (42.4) is read-only |
| ENL chain truth | `enl_console_adapter.py` (42.15) output rendered verbatim — no transformation |
| Persona truth | `persona_view_map.py` (42.16) output rendered verbatim — no transformation |
| Semantic activation state | Not controlled by UI — CLI only. Status visible but not writable |
| Evidence content | `EvidencePanel.js` unchanged — existing evidence still shown in step 5 |
| Demo step 1–5 behavior | Identical to 42.8 behavior — no modification to existing step definitions |

---

## 5. Integration Boundary

```
42.17 demo flow (CLI, terminal)
      │
      │  orchestration binding
      ▼
42.18 step bindings (UI + CLI mapping)
      │
      ├── ENL reveal → api/execlens?enl=... → enl_console_adapter.py (42.15)
      │
      └── Persona switch → api/execlens?persona=...&query=... → persona_view_map.py (42.16)
            │
            ▼
        42.4 adapter → 41.x artifacts → ENL → 40.x
        (unchanged execution path)
```

The integration layer is a pass-through. No content is generated, filtered, or summarized by 42.18.

---

## 6. Demo Flow Before and After

### Before (42.8 — 7 steps)

| Step | Label | Target |
|---|---|---|
| 1 | System | gauges |
| 2 | Structure | topology |
| 3 | Query | query |
| 4 | Signals | signals |
| 5 | Evidence | evidence |
| 6 | Navigate | navigation |
| 7 | Complete | — |

### After (42.18 — 9 steps)

| Step | Label | Target | Added by |
|---|---|---|---|
| 1 | System | gauges | 42.8 |
| 2 | Structure | topology | 42.8 |
| 3 | Query | query | 42.8 |
| 4 | Signals | signals | 42.8 |
| 5 | Evidence | evidence | 42.8 |
| **6** | **ENL** | **enl** | **42.18** |
| 7 | Navigate | navigation | 42.8 |
| **8** | **Persona** | **persona** | **42.18** |
| 9 | Complete | — | 42.8 |

The original steps 6 and 7 (Navigate, Complete) are renumbered to 7 and 9. Their behavior is unchanged.

---

## 7. Failure Safety

| Failure mode | Behavior |
|---|---|
| ENL API call fails | Panel shows error state — demo continues at next step |
| Persona API call fails | Panel shows error state — demo continues at next step |
| Status API call fails | Path state shows as "unknown" — no demo block |
| Script not found | API returns 400 error — panel shows error — demo continues |

In all failure cases: the existing query output (steps 3–5) remains fully visible and functional.

---

## 8. Non-Regression Declaration

42.18 does not:
- Modify any 40.x artifacts
- Modify any ENL artifacts
- Modify any 41.x artifacts
- Modify any 42.1–42.17 scripts or docs
- Change the `/api/execlens?query=`, `/api/execlens?list=`, `/api/execlens?overview=`, or `/api/execlens?topology=` behaviors
- Alter `EvidencePanel`, `NavigationPanel`, `SignalGaugeCard`, `ExecutivePanel`, `TemplateRenderer`, `LandingGaugeStrip`, `TopologyPanel`, or `QuerySelector`
