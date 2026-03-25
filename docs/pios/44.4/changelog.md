# Changelog — 44.4

Stream: 44.4 — GQ-003 Emphasis Materialization (Demo Baseline)
Date: 2026-03-25

---

## Entry 001 — 2026-03-25

**Action:** Initial emphasis materialization for GQ-003.

- docs/pios/44.2/projection_attachment.json modified
- query_emphasis.GQ-003 block created (new additive top-level key)
- DOMAIN-11 → "high" (mandatory)
- COMP-65 → "high" (mandatory)
- No medium assignments (no traceable candidates without uncertainty)
- No existing projection records modified
- Strict materialization — no derivation, no computation

---

## Constraints

- No 42.x or 43.x files modified
- No projection schema fields changed
- No new IDs introduced (DOMAIN-11 and COMP-65 traceable via SIG-003 evidence_reference)
- No other queries affected

---

## Entry 002 — 2026-03-25 (44.4C Correction)

**Action:** Corrected materialization shape to consumed projection records.

- docs/pios/44.2/projection_attachment.json updated
- `query_emphasis` top-level block removed (was not consumed by 42.27)
- DOMAIN-11 and COMP-65 mapped to existing projection record:
  `C_30_Domain_Event_Bus` (SIG-003 — `domain_id:DOMAIN-11 / component_ids:[COMP-65]`)
- `"emphasis": "high"` set directly on that projection record
- All other 4 projection records remain `"emphasis": "none"` — unchanged
- No schema extension; no 42.x modifications
