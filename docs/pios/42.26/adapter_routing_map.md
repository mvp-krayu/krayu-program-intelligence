# Adapter Routing Map — 42.26

Source: app/execlens-demo/pages/api/execlens.js @ 4061d12
Date: 2026-03-25
Narrowed: 42.26N — 2026-03-25

---

| Endpoint | Param(s) | Adapter | Handler |
|---|---|---|---|
| overview | `?overview=true` | 42.6 execlens_overview_adapter.py | runScript |
| topology | `?topology=true[&highlight=GQ-XXX]` | 42.7 execlens_topology_adapter.py | runScript |
| list | `?list=true` | 42.4 execlens_adapter.py --list | runScript |
| query | `?query=GQ-XXX` | 42.4 execlens_adapter.py | runScript |

---

## Rules

- topology MUST use 42.7 (structural hierarchy adapter)
- topology MUST NOT use 42.23 (WOW chain adapter is declared but not routed)
- topology highlight MUST be driven by `highlight` query param, not `query`
- no WOW chain fallback
- no runtime adapter switching

---

## Excluded Routes

| Endpoint | Adapter | Status |
|---|---|---|
| status | 42.13 demo_activate.py | excluded — adapter not present in this baseline |
| enl | 42.15 enl_console_adapter.py | excluded — adapter not present in this baseline |
| persona | 42.16 persona_view_map.py | excluded — adapter not present in this baseline |

These routes are declared in execlens.js but cannot be validated on this branch. They belong to ENL-010 integration and require a separate governed baseline promotion.

---

## Declared But Not Routed

| Constant | Adapter | Status |
|---|---|---|
| ADAPTER_42_23 | scripts/pios/42.23/execlens_wowchain_adapter.py | Declared, no active route |

ADAPTER_42_23 is present in the file as a constant but has no dispatch branch. It must not be reintroduced as a topology fallback without an explicit governing contract.
