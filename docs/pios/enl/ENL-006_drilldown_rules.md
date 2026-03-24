# ENL-006: Drill-Down Navigation Rules

**Contract:** ENL-006-CONTRACT-v1
**Layer:** Lens Navigation
**Applies To:** `lens_drilldown_v1.py`
**Status:** Active

---

## Rule A — Session Immutability

**A.1** Every navigation function (`step_forward`, `step_backward`, `jump_to_layer`) MUST return a new session dict.

**A.2** The input session MUST NOT be modified under any circumstances.

**A.3** `chain` and `entry_node` are stored as references from the source view. These references MUST NOT be written to at any point during navigation.

**A.4** Breadcrumbs MUST contain only scalar values extracted from node dicts — not references to the ENL node dicts themselves.

---

## Rule B — Navigation Boundaries

**B.1** `step_forward` at the last node in the chain MUST return the same session object unchanged (silent boundary, not an error).

**B.2** `step_backward` at index 0 MUST return the same session object unchanged (silent boundary, not an error).

**B.3** Callers MAY check `get_current_step(session)['at_end']` or `get_current_step(session)['at_start']` to detect boundary conditions before navigating.

**B.4** Navigation MUST follow chain index order. No layer can be skipped via `step_forward` or `step_backward`. `jump_to_layer` is the only mechanism that can skip chain positions.

---

## Rule C — Layer Jump Constraints

**C.1** `jump_to_layer` MUST validate that `layer_name` is a canonical ENL layer name before searching the chain.

**C.2** `jump_to_layer` MUST raise `DrillDownLayerNotFoundError` if the layer name is non-canonical (not in `CANONICAL_LAYERS`).

**C.3** `jump_to_layer` MUST raise `DrillDownLayerNotFoundError` if the layer is canonical but not present in the current chain.

**C.4** Incomplete chains MUST NOT be navigated silently. If a caller requests `jump_to_layer('EVID')` on an incomplete chain, `DrillDownLayerNotFoundError` is the correct response — not a no-op.

**C.5** `jump_to_layer` navigates to the **first** occurrence of `node_type == layer_name` in the chain.

---

## Rule D — Status Computation

**D.1** `status` MUST be recomputed on every navigation operation.

**D.2** Status values and their conditions:

| Status | Condition |
|---|---|
| `navigating` | `current_index < len(chain) - 1` |
| `complete` | `current_index == len(chain) - 1` AND `terminates_in_evid == True` |
| `incomplete_terminal` | `current_index == len(chain) - 1` AND `terminates_in_evid == False` |

**D.3** `incomplete_terminal` MUST NOT be treated as equivalent to `complete` by any consuming layer. The UI layer must surface this distinction to the user.

---

## Rule E — View Validation

**E.1** `create_drilldown_session` MUST validate that the input is a dict.

**E.2** `create_drilldown_session` MUST validate that `'chain'` is present and is a non-empty list.

**E.3** `create_drilldown_session` MUST validate that `'entry_node'` is present and not `None`.

**E.4** If `terminates_in_evid` is absent from the view, it MUST default to `False`.

**E.5** Persona-projected views (which contain additional keys such as `persona` and `node_display`) MUST be accepted without error. The drill-down model is view-type agnostic as long as the required structural fields are present.

---

## Rule F — Breadcrumb Construction

**F.1** Breadcrumbs MUST represent the path from `chain[0]` to `chain[current_index]`, inclusive.

**F.2** Each breadcrumb MUST contain exactly: `node_id`, `node_type`, `title`, `index`.

**F.3** Breadcrumb values MUST be copies of the scalar field values — not references to the node dict or the chain list.

**F.4** Breadcrumbs MUST be rebuilt on every navigation operation that changes `current_index`.

---

## Rule G — ENL Boundary

**G.1** The drill-down model MUST NOT call any ENL engine function (`enl_query_engine_v1`, `load_graph`, `validate_graph`, `get_upstream_chain`, etc.).

**G.2** The drill-down model MUST NOT perform traversal or graph recomputation. It navigates the pre-built chain produced by the ENL-003/ENL-004 layer.

**G.3** The drill-down model MUST NOT modify ENL node fields. All node dicts in the chain are read-only from the perspective of this module.

---

## Rule H — Exception Hierarchy

**H.1** `DrillDownInvalidViewError` and `DrillDownLayerNotFoundError` MUST both be subclasses of `DrillDownError`.

**H.2** `DrillDownError` MUST be a subclass of the built-in `Exception`.

**H.3** Error messages MUST include enough context for the caller to diagnose the issue (e.g., what layer was requested, what layers are present).

---

## Compliance Table

| Rule | Verified by Test(s) |
|---|---|
| A.1 — navigation returns new session | T-30, T-40, T-48 |
| A.2 — input session not modified | T-39, T-47, T-56 |
| A.3 — chain/entry_node not written | T-77, T-78 |
| A.4 — breadcrumbs are scalar | T-62, T-63 |
| B.1 — step_forward boundary silent | T-38, T-71 |
| B.2 — step_backward boundary silent | T-46, T-72 |
| B.4 — no layer skip in step ops | T-31, T-41 |
| C.2 — non-canonical raises error | T-57, T-88, T-89 |
| C.3 — absent layer raises error | T-58 |
| C.4 — incomplete chain jump raises error | T-58 |
| D.2 — status complete at end of full chain | T-37, T-51 |
| D.2 — status incomplete_terminal at end of incomplete chain | T-67, T-87 |
| D.2 — status navigating mid-chain | T-08, T-34, T-43 |
| E.1–E.3 — view validation | T-16–T-21 |
| E.4 — terminates_in_evid defaults False | T-86 |
| E.5 — persona views accepted | T-73–T-76 |
| F.1–F.3 — breadcrumb construction | T-11–T-15, T-59–T-63 |
| G.1–G.3 — no ENL engine calls | (structural — no ENL imports in module) |
| H.1–H.2 — exception hierarchy | T-90, T-91 |
