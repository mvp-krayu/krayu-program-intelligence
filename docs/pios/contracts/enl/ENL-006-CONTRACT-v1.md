# ENL-006-CONTRACT-v1

**Contract ID:** ENL-006-CONTRACT-v1
**Layer:** Lens Navigation
**Run:** run_01_blueedge
**Status:** Closed
**Depends On:** ENL-004-CONTRACT-v1, ENL-005-CONTRACT-v1

---

## 1. Purpose

Define and implement the controlled drill-down navigation model for Lens. Provides stepwise navigation across ENL evidence layers from abstract intelligence (INTEL) toward concrete evidence (EVID), operating on upstream view structures produced by the ENL-004 binding layer or ENL-005 persona projection layer.

---

## 2. Scope

**In scope:**

- Session creation from upstream view structures
- Forward navigation (toward evidence)
- Backward navigation (toward intelligence)
- Direct layer jump within available chain positions
- Breadcrumb trail construction
- Incomplete chain detection and surface

**Out of scope:**

- ENL graph traversal or recomputation
- ENL engine calls
- Query view navigation
- Full graph navigation
- Persona rendering logic

---

## 3. Deliverables

| # | Artifact | Path | Status |
|---|---|---|---|
| 1 | Drill-down module | `scripts/pios/enl/lens_drilldown_v1.py` | ✓ Complete |
| 2 | Test suite | `scripts/pios/enl/test_lens_drilldown.py` | ✓ Complete |
| 3 | Model document | `docs/pios/enl/ENL-006_drilldown_model.md` | ✓ Complete |
| 4 | Rules document | `docs/pios/enl/ENL-006_drilldown_rules.md` | ✓ Complete |
| 5 | Contract record | `docs/pios/contracts/enl/ENL-006-CONTRACT-v1.md` | ✓ Complete |

---

## 4. Public API

```python
# Module: scripts/pios/enl/lens_drilldown_v1.py

create_drilldown_session(view)        → session dict
get_current_step(session)             → step info dict
step_forward(session)                 → new session dict
step_backward(session)                → new session dict
jump_to_layer(session, layer_name)    → new session dict
get_breadcrumbs(session)              → list of breadcrumb dicts
```

---

## 5. Key Design Decisions

### 5.1 Immutable Session Model

Sessions are plain dicts. Navigation functions return **new** session dicts — they never modify the input session. This eliminates mutation side effects and makes navigation deterministic and testable.

### 5.2 Reference Semantics for Chain and Entry Node

`chain` and `entry_node` are stored as references from the source view, not copies. Since navigation functions never write to these references, the original view and all ENL node dicts remain deep-equal throughout all navigation operations.

### 5.3 Breadcrumbs as Scalar Copies

Breadcrumbs extract scalar fields (`node_id`, `node_type`, `title`, `index`) from chain nodes. No ENL node dict references are held in breadcrumbs. This eliminates any mutation risk through the breadcrumb interface.

### 5.4 Silent Boundaries

`step_forward` at the last node and `step_backward` at the first node return the session unchanged (same object). These are silent no-ops, not errors. Callers may inspect `at_start` / `at_end` via `get_current_step` to detect boundary conditions.

### 5.5 Explicit Incomplete Chain Surface

If a chain does not terminate in an EVID node, the session's `terminates_in_evid` is `False` and reaching the end sets `status = incomplete_terminal`. This must not be presented as resolved evidence. `jump_to_layer('EVID')` on an incomplete chain raises `DrillDownLayerNotFoundError` — not a silent bypass.

---

## 6. Acceptance Criteria

| Criterion | Test IDs |
|---|---|
| Session created from complete upstream view | T-02–T-10 |
| Session created from incomplete upstream view | T-64–T-68 |
| Session created from persona-projected view | T-73–T-76 |
| Invalid views rejected at session creation | T-16–T-21 |
| step_forward advances correctly | T-30–T-37 |
| step_forward boundary is silent | T-38, T-71 |
| step_backward retreats correctly | T-40–T-44 |
| step_backward boundary is silent | T-46, T-72 |
| jump_to_layer navigates to correct position | T-48–T-55 |
| jump_to_layer rejects non-canonical names | T-57, T-88, T-89 |
| jump_to_layer rejects absent layers | T-58 |
| Breadcrumbs correct at all positions | T-11–T-15, T-35–T-36, T-44, T-52, T-59–T-63 |
| No session mutation | T-39, T-47, T-56, T-77–T-80 |
| No view or node mutation | T-77–T-80 |
| Status: navigating, complete, incomplete_terminal | T-08, T-37, T-51, T-67, T-87 |
| Determinism — repeated navigation equals same result | T-81–T-85 |
| Exception hierarchy correct | T-90–T-91 |

**Test result:** 91/91 PASS

---

## 7. ENL Stack State

| Contract | Artifact | Status |
|---|---|---|
| ENL-001 | Evidence Navigation Layer concept | Active |
| ENL-002 | Evidence graph schema | Active |
| ENL-002A | Lens integration boundary | Active |
| ENL-003 | Query engine (`enl_query_engine_v1.py`) | Active |
| ENL-004 | Lens binding layer (`lens_binding_v1.py`) | Active |
| ENL-005 | Persona projection layer (`lens_persona_v1.py`) | Closed |
| ENL-006 | Drill-down model (`lens_drilldown_v1.py`) | **Closed** |

---

## 8. Downstream Handover

No downstream ENL contract is defined at this time. ENL-006 closes the navigation stack at v1. Future extension (e.g., multi-chain navigation, cross-query drill-through) would require a new contract version.
