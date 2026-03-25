# Changelog — 42.26

Stream: 42.26 — ExecLens Runtime Stabilization & Contract Lock
Date: 2026-03-25

---

## Entry 001 — 2026-03-25

**Action:** Runtime contract locked.

- All 7 API routes inspected from execlens.js @ 4061d12
- runtime_api_contract.md produced — full route/adapter/response documentation
- adapter_routing_map.md produced — dispatch order and routing rules
- rendering_contract.md produced — topology, ENL, persona rendering rules

---

## Entry 002 — 2026-03-25

**Action:** Validation guard introduced.

- validate_runtime_contract.py created under scripts/pios/42.26/
- Covers all 7 routes: status, enl, persona, overview, topology, list, query
- Writes results to docs/pios/42.26/validation_log.json
- validation_log.json seeded with NOT_RUN status (app offline at execution time)

---

## Entry 003 — 2026-03-25

**Action:** Deviation documented.

- File header comment in execlens.js references `42.23 WOW topology` for topology route
- Actual runtime dispatch uses 42.7 structural topology adapter (correct — per 42.24/42.25)
- ADAPTER_42_23 declared but not routed
- Deviation noted in execution_report.md; no runtime mutation performed

---

## Entry 004 — 2026-03-25 (42.26N Scope Narrowing)

**Action:** Validation contract reduced from 7 → 4 routes.

- ENL/status/persona routes removed from scope
- Reason: adapter scripts (42.13, 42.15, 42.16) not present in this baseline
- runtime_api_contract.md rewritten — 4 in-scope routes + explicit scope exclusion section
- adapter_routing_map.md rewritten — 4 in-scope routes + excluded routes table
- rendering_contract.md rewritten — ENL/persona sections removed, scope constraint added
- validate_runtime_contract.py narrowed to 4 routes
- Live validation run: 4/4 PASS
- validation_log.json updated with live results
- No runtime changes

---

## Constraints

- No runtime code modified
- No adapters changed
- No API behavior changed
- All outputs under docs/pios/42.26/ and scripts/pios/42.26/ only
