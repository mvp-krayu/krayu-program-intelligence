# Demo Adoption Assessment
## Stream 42.12 — Semantic Exposure Optimization

**contract_id:** PIOS-42.12-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## 1. Assessment Purpose

This document evaluates:
1. Whether 42.8 demo choreography remains intact after 42.12 exposure refinement
2. Whether the demo should remain inactive (default) or expose semantic state by default
3. Under what conditions the active semantic path may be shown in the demo
4. Whether any regression is introduced by 42.12

---

## 2. 42.8 Choreography Integrity

42.8 drives the ExecLens demo through queries GQ-001..GQ-010 using 42.4/42.6/42.7 adapters.
The choreography controls query sequencing, not output content.

**Effect of 42.12 on choreography:**

| Aspect | Pre-42.12 | After 42.12 |
|---|---|---|
| Query sequence GQ-001..GQ-010 | Controlled by choreography | Unchanged |
| Per-query output content | Sourced from ENL via 42.4 | Unchanged |
| Adapter calls | 42.4, 42.6, 42.7 | Unchanged |
| Semantic state during demo | INACTIVE | INACTIVE (default) |
| Optional semantic demo mode | Not defined | Defined by 42.12 (requires explicit activation) |

**42.8 choreography regression: NONE**

---

## 3. Demo Default Mode — Recommendation

**Recommendation: Demo default remains INACTIVE.**

Rationale:

1. **Clean by default.** The demo must prove ENL does the heavy lifting. A clean, semantics-free executive answer is more powerful than one cluttered with semantic labels in a first-impression demo context.

2. **Semantic mode as deliberate reveal.** The semantic layer is a discipline advancement — it should be revealed as an explicit "zoom out" moment, not the default state. This preserves the narrative arc: ENL first, semantics as enhancement.

3. **Fallback safety.** Running demo in INACTIVE state means there is zero possibility of a fallback mid-demo. The demo surface is completely decoupled from 41.6 state in INACTIVE mode.

4. **Governance fidelity.** Activating semantics during a demo without explicit contract-level authorization is a governance violation. 42.12 defines exposure rules; 42.13 governs when and whether active semantic mode is used in a controlled demo.

---

## 4. Optional Active Semantic Demo Mode

If a future demo chooses to activate the semantic path explicitly (via 42.13), the following rules apply per 42.12:

### Before activation (pre-demo check)

```
1. Verify 42.10 validator passes (validate_semantic_binding.py)
2. Verify 42.11 validator passes (validate_semantic_activation.py)
3. Set ACTIVATION_STATUS = "ACTIVATED" in semantic_activation.py
4. Confirm get_path_state()["path_state"] == SEMANTIC_PATH_ACTIVE
5. Proceed with demo
```

### During active mode demo

- Small `Semantic: Active` badge visible in UI context panel
- Annotation chips appear on signal cards that have constructs
- Primary executive answer is unchanged
- Evidence chains are unchanged
- Navigation links are unchanged
- The presenter describes annotations as "structural labels grounded in ENL" — not as scores or diagnoses

### Fallback during demo (if AC condition fails mid-session)

- Badge changes to neutral `Running on ENL direct path`
- Annotation chips disappear silently
- Executive answer continues without interruption
- No visible error

---

## 5. Surface-by-Surface Demo Impact

### 42.4 JSON Adapter (Landing Data / Signal Cards)

| Surface Element | INACTIVE Demo | ACTIVE Demo |
|---|---|---|
| Contract ID | Present, unchanged | Unchanged |
| Query text, intent, confidence | Present, unchanged | Unchanged |
| Signal fields (title, evidence, domain, etc.) | Present, unchanged | Unchanged |
| `semantic_annotations` per signal | Absent | Present where construct exists |
| `semantic_path_state` at root | Absent | Present |

### 42.6 Overview Adapter (Landing Gauges)

| Surface Element | INACTIVE Demo | ACTIVE Demo |
|---|---|---|
| Metrics (dependency_load, etc.) | Present, unchanged | Unchanged |
| `semantic_path_state` | Absent | Present |

### 42.7 Topology Adapter (Topology Panel)

| Surface Element | INACTIVE Demo | ACTIVE Demo |
|---|---|---|
| Domain / capability / component hierarchy | Present, unchanged | Unchanged |
| `semantic_domain_id` per domain | Absent | Present where construct exists |

### 42.8 Demo Choreography

| Behavior | INACTIVE Demo | ACTIVE Demo |
|---|---|---|
| Query sequence | GQ-001..010 | Unchanged |
| Timing and transitions | Unchanged | Unchanged |
| Presenter script | Current | Optional: add semantic state reveal step |

---

## 6. No Regression Declaration

| Regression Check | Status |
|---|---|
| 42.8 choreography unmodified | CONFIRMED — 42.12 adds no changes to 42.8 |
| 42.9 package validator passes | CONFIRMED — no 42.12 dependencies in 42.9 scope |
| All demo adapter outputs identical in INACTIVE mode | CONFIRMED — zero surface delta |
| Demo runbook assumptions intact | CONFIRMED — no runbook changes required |
| Demo presentation narrative unchanged | CONFIRMED — ENL-grounded answer is primary |

**Demo regression: NONE**

---

## 7. Assessment Verdict

```
demo_default_mode:        INACTIVE (recommendation enforced)
demo_regression:          NONE
active_demo_defined:      YES (defined; requires 42.13 authorization to execute)
fallback_demo_safety:     VERIFIED
42.8_choreography:        INTACT
demo_adoption_assessment: PASS
```
