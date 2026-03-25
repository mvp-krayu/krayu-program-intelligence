# Execution Report — 44.4

Stream: 44.4 — GQ-003 Emphasis Materialization (Demo Baseline)
Correction: 44.4C — Projection Emphasis Materialization Correction
Date: 2026-03-25
Branch: feature/42-27-projection-red-node-activation
Mode: STRICT MATERIALIZATION (NO DERIVATION)

---

## File Modified

docs/pios/44.2/projection_attachment.json

---

## 44.4 Initial (Superseded)

Added top-level `query_emphasis.GQ-003` block.
DOMAIN-11 and COMP-65 placed in a new structural key — not consumed by 42.27.
This approach was non-functional: the 42.7 adapter reads from `projections[]` only.

---

## 44.4C Correction

### ID Mapping

DOMAIN-11 and COMP-65 traced to existing projection record via `evidence_reference.association_basis`:

| Projection node_id | association_basis |
|---|---|
| `C_30_Domain_Event_Bus` | `domain_id:DOMAIN-11 / capability_id:CAP-30 / component_ids:[COMP-65]` |

Single record — unambiguous. COMP-65 also appears in projection 1 (C_27_Caching_Layer /
DOMAIN-10), but DOMAIN-11 target uniquely identifies projection 2 as the correct record.

### Change Applied

`C_30_Domain_Event_Bus` projection record:
- `"emphasis"` field: `"none"` → `"high"`

`query_emphasis` top-level block: removed entirely.

### Before (44.4)

```json
{
  "projections": [
    { "node_id": "C_30_Domain_Event_Bus", "emphasis": "none", ... },
    ...
  ],
  "query_emphasis": {
    "GQ-003": { "domains": {"DOMAIN-11": "high"}, "components": {"COMP-65": "high"} }
  }
}
```

### After (44.4C)

```json
{
  "projections": [
    { "node_id": "C_30_Domain_Event_Bus", "emphasis": "high", ... },
    ...
  ]
}
```

---

## Emphasis Assignments (Final — Corrected)

| Projection node_id | Mapped targets | Emphasis |
|---|---|---|
| `C_30_Domain_Event_Bus` | DOMAIN-11 / COMP-65 (SIG-003) | high |

All other 4 projection records: `"emphasis": "none"` — unchanged.

Medium assignments: none.

---

## Validation

| Check | Result |
|---|---|
| JSON valid | PASS |
| `projections[]` count unchanged (5) | PASS |
| `query_emphasis` absent | PASS |
| At least one record carries emphasis:high | PASS |
| Modified record traceable to DOMAIN-11 + COMP-65 | PASS |
| No unrelated records changed | PASS |
| No schema drift | PASS |
