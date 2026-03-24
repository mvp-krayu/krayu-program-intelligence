# ENL-006: Controlled Drill-Down Model

**Contract:** ENL-006-CONTRACT-v1
**Layer:** Lens Navigation
**Depends On:** ENL-004 (Lens Binding), ENL-005 (Persona Projection)
**Status:** Active

---

## 1. Purpose

The Drill-Down Model provides stepwise navigation across ENL evidence layers, moving from abstract intelligence (INTEL) toward concrete evidence (EVID), using Lens upstream view structures as input.

This module is **controlled navigation**, not free graph exploration. Navigation follows the ENL chain order strictly. No layer bypass. No traversal recomputation. No ENL engine calls.

---

## 2. Scope

The drill-down model operates exclusively on:

- Upstream view structures produced by `bind_get_upstream_view` (ENL-004)
- Persona-projected upstream views produced by `apply_persona` or `project_upstream_view` (ENL-005)

It does not accept raw ENL graphs, node dicts, or query views.

---

## 3. Session Model

### 3.1 Session as Navigation State

A session is a plain dict representing navigation state at a point in time. Sessions are created by `create_drilldown_session` and advanced by navigation functions.

**Session fields:**

| Field | Type | Description |
|---|---|---|
| `entry_node` | dict reference | Original entry node from the view (never copied) |
| `chain` | list reference | Original chain list from the view (never copied) |
| `current_index` | int | Position in the chain (0 = most abstract) |
| `current_node` | dict reference | `chain[current_index]` |
| `current_layer` | str | `current_node['node_type']` |
| `status` | str | Navigation status (see §3.3) |
| `terminates_in_evid` | bool | Whether the chain ends in an EVID node |
| `breadcrumbs` | list | Scalar path from chain[0] to current_index |

### 3.2 Immutability Invariant

**Sessions are immutable.** Every navigation function (`step_forward`, `step_backward`, `jump_to_layer`) returns a **new session dict**. The input session is never modified.

The original view and all ENL node dicts are never mutated. `chain` and `entry_node` are stored as references (not copies). Since they are never written to, deep equality of the original view holds throughout all navigation operations.

### 3.3 Status Values

| Status | Condition |
|---|---|
| `navigating` | Current position is not the last node in the chain |
| `complete` | At the last node AND `terminates_in_evid` is `True` |
| `incomplete_terminal` | At the last node AND `terminates_in_evid` is `False` |

Status `incomplete_terminal` surfaces that the user has reached the end of the navigable chain without arriving at confirmed evidence. The UI must not present this state as resolved.

---

## 4. Chain Order

The chain is ordered from most abstract to most concrete:

```
INTEL → SIG-41 → SIG-40 → EVID
  0        1        2       3
```

- Lower index = further from evidence (more abstract)
- Higher index = closer to evidence (more concrete)
- `step_forward` moves toward EVID (index increases)
- `step_backward` moves toward INTEL (index decreases)

Navigation is confined to nodes actually present in the chain. The chain may be incomplete (e.g., no EVID node present). The drill-down model surfaces this via `terminates_in_evid = False` and `status = incomplete_terminal`.

---

## 5. Breadcrumbs

Breadcrumbs represent the path from the entry node (index 0) to the current node (current_index), inclusive. Each breadcrumb is a scalar dict — not a reference to the ENL node dict.

**Breadcrumb fields:**

| Field | Type | Description |
|---|---|---|
| `node_id` | str | Node identifier |
| `node_type` | str | ENL layer type |
| `title` | str | Node title |
| `index` | int | Position in chain |

Breadcrumbs contain only scalar copies of node fields. This eliminates any risk of mutation through the breadcrumb interface.

---

## 6. Canonical Layer Names

Valid layer names for `jump_to_layer`:

```
INTEL, SIG-41, SIG-40, EVID
```

Names are case-sensitive. Non-canonical names and lowercase variants raise `DrillDownLayerNotFoundError`.

---

## 7. Incomplete Chain Behavior

When the upstream view has `terminates_in_evid = False` (an incomplete chain):

- Navigation proceeds normally through available nodes
- Reaching the last node sets `status = incomplete_terminal`
- `step_forward` at the terminal is a silent no-op (returns unchanged session)
- `jump_to_layer('EVID')` raises `DrillDownLayerNotFoundError` — incomplete chains are never silently navigated to absent layers

---

## 8. Exceptions

| Exception | Raised When |
|---|---|
| `DrillDownInvalidViewError` | Input to `create_drilldown_session` is not a valid upstream view structure |
| `DrillDownLayerNotFoundError` | `jump_to_layer` receives a non-canonical name, or a canonical name not present in the chain |

Both are subclasses of `DrillDownError`.

---

## 9. Constraints

- No ENL engine calls — drill-down reads the pre-built chain only
- No traversal recomputation
- No modification of ENL node dicts or chain list
- No layer bypass in step navigation (only `jump_to_layer` can skip layers)
- `terminates_in_evid = False` at session end must not be presented as complete evidence resolution
