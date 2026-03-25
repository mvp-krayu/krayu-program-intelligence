# Adapter Extension Contract — 42.27

Stream: 42.27 — Projection-Driven Red Node Activation
Date: 2026-03-25
Source adapter: scripts/pios/42.7/execlens_topology_adapter.py
Upstream artifact: docs/pios/44.2/projection_attachment.json

---

## Purpose

Extend the 42.7 structural topology adapter to consume the `emphasis` field
from the 44.2 projection attachment artifact and pass it through to the
rendering layer without modification.

---

## Changes Applied

### Constant Added

```
PROJECTION_ATTACHMENT_PATH = Path(__file__).resolve().parents[3] / "docs/pios/44.2/projection_attachment.json"
```

Resolves to the governed 44.2 attachment artifact relative to the adapter script.

### Function Added: `_load_emphasis_lookup()`

Loads `emphasis` values from `projection_attachment.json`.
Returns `{node_id: emphasis_value}` for all `ATTACHED` projection elements.
Returns empty dict on any load failure — emphasis defaults to `"none"` for all nodes.

### Post-processing in `get_topology()`

After hierarchy construction and highlight attachment, emphasis is attached
to all topology nodes (domain, capability, component):

```
dom["emphasis"]  = emphasis_lookup.get(dom["id"], "none")
cap["emphasis"]  = emphasis_lookup.get(cap["id"], "none")
cmp["emphasis"]  = emphasis_lookup.get(cmp["id"], "none")
```

---

## Governance Constraints

| Rule | Constraint | Compliance |
|---|---|---|
| E-ATT-007 | `emphasis` MUST NOT be assigned by 42.x | PASS — adapter reads only |
| E-ATT-005 | `emphasis` MUST NOT be computed from topology structure | PASS — read verbatim from 44.2 |
| E-ATT-006 | `emphasis` MUST NOT be derived from signal count or runtime metric | PASS — read verbatim from 44.2 |
| E-VAL-001 | Rendering layer treats unknown values as `none` | PASS — checked in TopologyPanel.js |
| E-VAL-005 | Absent `emphasis` valid; treated as `none` | PASS — `get(..., "none")` default |

---

## Baseline State

Current projection attachment (`docs/pios/44.2/projection_attachment.json`):
- 5 projections, all `"emphasis": "none"`
- No HIGH emphasis nodes at this baseline
- RED node activation infrastructure present; will activate when upstream assigns `emphasis: high`

---

## Output Field Added

Each topology entity now carries:
```json
"emphasis": "none|low|medium|high"
```

Field is present on domain, capability, and component nodes.
Absence in upstream projection → `"none"`.
