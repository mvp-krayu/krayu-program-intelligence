# Runtime API Contract — 42.26

Source: app/execlens-demo/pages/api/execlens.js
Branch: feature/42-25-topology-highlight-color-remediation
Commit: 4061d12
Date: 2026-03-25
Narrowed: 42.26N — 2026-03-25

---

## Scope Constraint

This contract validates ONLY the 4 operational routes confirmed on this baseline.

See [Explicit Scope Exclusion](#explicit-scope-exclusion) for excluded routes.

---

## Endpoints

### 1. Overview
- Route: `?overview=true`
- Adapter: 42.6 (execlens_overview_adapter.py, no args)
- Handler: runScript
- Response: JSON parsed from adapter stdout

### 2. Topology
- Route: `?topology=true` or `?topology=true&highlight=GQ-XXX`
- Adapter: 42.7 (execlens_topology_adapter.py, optional `--query <GQ-XXX>`)
- Handler: runScript
- Response: JSON parsed from adapter stdout
- Highlight: if `highlight` param present, passed as `--query` to adapter
- Sanitization: toUpperCase, strip non-[A-Z0-9-]
- No highlight → adapter returns full topology with all highlighted=false

### 3. Query List
- Route: `?list=true`
- Adapter: 42.4 (execlens_adapter.py `--list`)
- Handler: runScript
- Response: JSON parsed from adapter stdout

### 4. Single Query
- Route: `?query=GQ-XXX`
- Adapter: 42.4 (execlens_adapter.py `<GQ-XXX>`)
- Handler: runScript
- Response: JSON parsed from adapter stdout
- Required: `query` param — 400 if absent
- Sanitization: toUpperCase, strip non-[A-Z0-9-]; 400 if empty after sanitization

---

## Error Responses (in-scope routes)

| Condition | Status |
|---|---|
| Non-GET method | 405 |
| Missing `query` for single-query route | 400 |
| Invalid / empty `query` after sanitization | 400 |
| Adapter execution error | 400 |
| Adapter JSON parse failure | 500 |

---

## Response Format

- All in-scope endpoints use `runScript`: `Content-Type: application/json`, parsed adapter stdout
- Adapter timeout: 30 seconds

---

## Adapter Constants (in-scope only)

| Constant | Path | Status |
|---|---|---|
| ADAPTER_42_4 | scripts/pios/42.4/execlens_adapter.py | PRESENT — validated |
| ADAPTER_42_6 | scripts/pios/42.6/execlens_overview_adapter.py | PRESENT — validated |
| ADAPTER_42_7 | scripts/pios/42.7/execlens_topology_adapter.py | PRESENT — validated |
| ADAPTER_42_23 | scripts/pios/42.23/execlens_wowchain_adapter.py | declared, not routed |

---

## Explicit Scope Exclusion

The following routes are declared in execlens.js but are NOT part of the validated runtime contract on this branch:

| Route | Reason |
|---|---|
| `?status=true` | Adapter scripts/pios/42.13/demo_activate.py not present in this baseline |
| `?enl=GQ-XXX` | Adapter scripts/pios/42.15/enl_console_adapter.py not present in this baseline |
| `?persona=P&query=GQ-XXX` | Adapter scripts/pios/42.16/persona_view_map.py not present in this baseline |

These routes belong to ENL-010 integration. They cannot be validated against this baseline. They must not be reintroduced into this contract without promoting ENL-010 substrate to this branch under a governing contract.
