# Execution Report — 44.4

Stream: 44.4 — GQ-003 Emphasis Materialization (Demo Baseline)
Date: 2026-03-25
Branch: feature/42-27-projection-red-node-activation
Mode: STRICT MATERIALIZATION (NO DERIVATION)

---

## File Modified

docs/pios/44.2/projection_attachment.json

---

## Change Applied

Added new top-level key `query_emphasis` containing the GQ-003 block.
No existing fields modified. No existing projection records changed.
All 5 projections retain `"emphasis": "none"` (projection-level field unchanged).

---

## Before

```json
{
  ...
  "upstream_binding_artifact": "...",
  "upstream_binding_checksum": "..."
}
```

No `query_emphasis` key. No GQ-003 block.

---

## After

```json
{
  ...
  "upstream_binding_artifact": "...",
  "upstream_binding_checksum": "...",
  "query_emphasis": {
    "GQ-003": {
      "domains": {
        "DOMAIN-11": "high"
      },
      "components": {
        "COMP-65": "high"
      }
    }
  }
}
```

---

## Emphasis Assignments (Final)

| Scope | ID | Value | Source |
|---|---|---|---|
| domain | DOMAIN-11 | high | Mandatory — 44.4 contract |
| component | COMP-65 | high | Mandatory — 44.4 contract |

Medium assignments: none (no candidates traceable without uncertainty).

---

## IDs — Traceability Note

DOMAIN-11 and COMP-65 do not appear as `node_reference.node_id` in the
existing `projections[]` array. They appear in `evidence_reference.association_basis`
of SIG-003 (C_30_Domain_Event_Bus): `DOMAIN-11/CAP-30/COMP-65`.

The `query_emphasis.GQ-003` block is a new additive structure for
query-scoped emphasis assignment. Existing projection records not modified.

---

## Pre-flight Structure Finding

The existing file structure uses a flat `projections[]` array with
capability-level node references. No GQ-specific emphasis block existed.
Per contract: "LOCATE OR CREATE — GQ-003 block" → CREATED as `query_emphasis.GQ-003`.
