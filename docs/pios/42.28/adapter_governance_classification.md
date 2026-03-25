# Adapter Governance Classification — 42.28

Stream: 42.28 — Unified Live Runtime Surface Certification
Date: 2026-03-25

---

## Classification Criteria

An adapter is CERTIFIED if:
- Source fields traceable to governed artifacts
- No hidden derivation
- No missing-value inference
- No scoring
- No interpretation
- No silent fallback

---

## ADAPTER_42_4 — execlens_adapter.py

**Routes:** `?query=GQ-XXX`, `?list=true`
**Contract:** PIOS-42.4-RUN01-CONTRACT-v2

**Source artifacts:**
- 41.4 signal registry (via 42.2 → 42.1 module chain)
- 41.4 evidence mapping index
- 41.5 response templates
- 41.2 PIE vault (navigation binding)

**Shaping performed:**
- Extracts query response from template section via deterministic regex rules
- Binds signals from signal registry per query_signal_map
- Resolves vault paths via 42.1 bind_navigation()
- Missing value → explicit null (R3: no defaults on extraction failure)
- Invalid/absent query_id → exit 1 (R4: fail closed)

**Governance compliance:**
- R1: all data via 42.2 module (no direct 41.x file access)
- R2: no direct 41.x open()
- R3: no synthetic data, missing → null
- R4: fail closed on invalid query_id
- R5: JSON to stdout only
- R6: deterministic (same input → same output)

**Result: CERTIFIED**

---

## ADAPTER_42_6 — execlens_overview_adapter.py

**Routes:** `?overview=true`
**Contract:** PIOS-42.6-RUN01-CONTRACT-v1

**Source artifacts:**
- 41.4 signal registry (via 42.2 → 42.1 module chain)
- SIG-003 (dependency_load), SIG-004 (structural_density), SIG-005 (coordination_pressure), SIG-002 (visibility_deficit)

**Shaping performed:**
- Deterministic regex/word-map extraction from signal statement fields
- No new computation — reads pre-computed signal values from registry
- Missing extraction → null (not a default)

**Governance compliance:**
- All data via 42.2 → 42.1 module chain
- No direct 41.x file access
- No scoring, no interpretation, no inference
- Deterministic extraction rules (regex / word-map)

**Result: CERTIFIED**

---

## ADAPTER_42_7 — execlens_topology_adapter.py

**Routes:** `?topology=true`, `?topology=true&highlight=GQ-XXX`
**Contract:** PIOS-42.7-RUN01-CONTRACT-v2

**Source artifacts:**
- 41.4 query signal map + response templates (via 42.2 → 42.1)
- 41.2 PIE vault (navigation resolution via 42.1 bind_navigation)
- docs/pios/44.2/projection_attachment.json (emphasis field — read-only)

**Shaping performed:**
- Builds domain → capability → component hierarchy via co-occurrence frequency across all 10 queries
- Co-occurrence algorithm: deterministic, documented (G7 rule), tie-broken alphabetically
- Attaches highlighted=true/false per entity based on query drill-down membership
- Reads emphasis from 44.2 projection attachment — read-only, no modification (44.3 E-ATT-007)
- Vault path transformation: strips prefix/suffix deterministically

**Governance compliance:**
- R1: all query data via 42.2 → 42.1 (no direct 41.x reads)
- R2: no direct 41.x file open
- R3: co-occurrence is deterministic, inspectable — not semantic inference
- R4: read-only (no writes)
- R5: JSON to stdout only
- Emphasis: read from 44.2 governed artifact, never computed by 42.x (44.3 E-ATT-007 compliant)
- highlight_query_id passed as --query arg, sanitized in execlens.js before dispatch

**Deviation on record (from 42.26):**
- File header comment references `42.23 WOW topology` for topology route
- Actual dispatch: ADAPTER_42_7 (correct per 42.24/42.25 parity)
- Non-behavioral deviation — not corrected in non-mutating streams

**Result: CERTIFIED**

---

## ADAPTER_42_23 — execlens_wowchain_adapter.py

**Routes:** none (constant declared, no active dispatch branch)

**Status:** DECLARED BUT UNUSED
Script present on disk but no handler dispatches to it.
Classified per 42.26 CLOSURE as non-mutating deviation.

**Result: NOT APPLICABLE (no active route)**

---

## ENL Adapters (42.13 / 42.15 / 42.16)

**Routes:** `?status=true`, `?enl=GQ-XXX`, `?persona=P&query=GQ-XXX`
**Scripts:** ABSENT from this branch

Routes are wired and dispatch logic is present in execlens.js.
Scripts do not exist → execFile fails → 400 returned.
Cannot be certified — no script to inspect.

**Result: NOT CERTIFIED (scripts absent — cannot evaluate)**

---

## Summary

| Adapter | Routes | Scripts Present | Result |
|---|---|---|---|
| 42.4 | query, list | YES | CERTIFIED |
| 42.6 | overview | YES | CERTIFIED |
| 42.7 | topology, topology+highlight | YES | CERTIFIED |
| 42.23 | none (declared unused) | YES | NOT APPLICABLE |
| 42.13 | status | NO | NOT CERTIFIED (absent) |
| 42.15 | enl | NO | NOT CERTIFIED (absent) |
| 42.16 | persona | NO | NOT CERTIFIED (absent) |

Active routes: 3 adapters CERTIFIED.
ENL/persona routes: 3 adapters NOT CERTIFIED (absent) — not part of active unified demo surface.
