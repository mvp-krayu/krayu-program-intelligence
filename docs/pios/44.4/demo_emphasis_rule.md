# Demo Emphasis Rule — 44.4

Stream: 44.4 — GQ-003 Emphasis Materialization (Demo Baseline)
Date: 2026-03-25
Corrected: 2026-03-25 (44.4C)

---

## Rule — Exact as Provided

Query: GQ-003

MANDATORY:
- DOMAIN-11 → emphasis: high
- COMP-65   → emphasis: high

OPTIONAL (medium):
- Not applied — no candidates traceable without uncertainty

---

## Materialization Target (44.4C correction)

Emphasis placed in existing consumed `projections[]` records only.

DOMAIN-11 and COMP-65 map to a single projection record:
- node_id: `C_30_Domain_Event_Bus`
- association_basis: `domain_id:DOMAIN-11 / capability_id:CAP-30 / component_ids:[COMP-65]`
- `"emphasis": "high"` set on this record directly

Previous `query_emphasis` top-level block removed — it was not consumed by 42.27.

---

## Source

Rule provided directly in 44.4 contract.
No derivation. No computation. Strict materialization only.

---

## Constraints

- Values drawn from closed set: {high, medium, low, none}
- No other queries modified
- No emphasis computed from topology structure, signal count, or runtime metric
- Absent or uncertain medium candidates: not assigned (IF uncertain → DO NOT ADD)
