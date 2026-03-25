# Runtime API Contract — 42.26

Source: app/execlens-demo/pages/api/execlens.js
Branch: feature/42-25-topology-highlight-color-remediation
Commit: 4061d12
Date: 2026-03-25

---

## Endpoints

### 1. Status
- Route: `?status=true`
- Adapter: 42.13 (demo_activate.py `--status`)
- Handler: runScriptText
- Response: `{ text: <stdout> }`
- Evaluated first in handler dispatch order.

### 2. ENL Chain Reveal
- Route: `?enl=GQ-XXX`
- Adapter: 42.15 (enl_console_adapter.py `--query <GQ-XXX>`)
- Handler: runScriptText
- Response: `{ text: <stdout> }`
- Sanitization: toUpperCase, strip non-[A-Z0-9-]
- Error: 400 if sanitized value is empty

### 3. Persona Projection
- Route: `?persona=EXECUTIVE|CTO|ANALYST&query=GQ-XXX`
- Adapter: 42.16 (persona_view_map.py `--persona <P> --query <GQ-XXX>`)
- Handler: runScriptText
- Response: `{ text: <stdout> }`
- Allowed personas: EXECUTIVE, CTO, ANALYST (enforced — 400 on invalid)
- Requires `query` param — 400 if absent or empty after sanitization
- Sanitization: persona → toUpperCase strip non-[A-Z]; query → toUpperCase strip non-[A-Z0-9-]

### 4. Overview
- Route: `?overview=true`
- Adapter: 42.6 (execlens_overview_adapter.py, no args)
- Handler: runScript
- Response: JSON parsed from adapter stdout

### 5. Topology
- Route: `?topology=true` or `?topology=true&highlight=GQ-XXX`
- Adapter: 42.7 (execlens_topology_adapter.py, optional `--query <GQ-XXX>`)
- Handler: runScript
- Response: JSON parsed from adapter stdout
- Highlight: if `highlight` param present, passed as `--query` to adapter
- Sanitization: toUpperCase, strip non-[A-Z0-9-]
- No highlight → adapter returns full topology with all highlighted=false

### 6. Query List
- Route: `?list=true`
- Adapter: 42.4 (execlens_adapter.py `--list`)
- Handler: runScript
- Response: JSON parsed from adapter stdout

### 7. Single Query
- Route: `?query=GQ-XXX`
- Adapter: 42.4 (execlens_adapter.py `<GQ-XXX>`)
- Handler: runScript
- Response: JSON parsed from adapter stdout
- Required: `query` param — 400 if absent
- Sanitization: toUpperCase, strip non-[A-Z0-9-]; 400 if empty after sanitization

---

## Dispatch Order

Handler evaluates params in this priority sequence:

1. `status`
2. `enl`
3. `persona`
4. `overview`
5. `topology`
6. `list`
7. `query` (fallthrough — 400 if absent)

---

## Error Responses

| Condition | Status |
|---|---|
| Non-GET method | 405 |
| Invalid / empty `enl` | 400 |
| Invalid persona value | 400 |
| Missing `query` for persona | 400 |
| Missing `query` for single-query route | 400 |
| Invalid / empty `query` after sanitization | 400 |
| Adapter execution error | 400 |
| Adapter JSON parse failure | 500 |

---

## Response Format

- `runScript` endpoints: `Content-Type: application/json`, parsed adapter stdout
- `runScriptText` endpoints: `Content-Type: application/json`, `{ text: <raw stdout string> }`
- Adapter timeout: 30 seconds

---

## Adapter Constants (as resolved from REPO_ROOT)

| Constant | Path |
|---|---|
| ADAPTER_42_4 | scripts/pios/42.4/execlens_adapter.py |
| ADAPTER_42_6 | scripts/pios/42.6/execlens_overview_adapter.py |
| ADAPTER_42_7 | scripts/pios/42.7/execlens_topology_adapter.py |
| ADAPTER_42_13 | scripts/pios/42.13/demo_activate.py |
| ADAPTER_42_15 | scripts/pios/42.15/enl_console_adapter.py |
| ADAPTER_42_16 | scripts/pios/42.16/persona_view_map.py |
| ADAPTER_42_23 | scripts/pios/42.23/execlens_wowchain_adapter.py (declared, not routed) |
