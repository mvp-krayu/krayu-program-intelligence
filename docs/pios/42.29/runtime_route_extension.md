# Runtime Route Extension — 42.29

Stream: 42.29
Date: 2026-03-25

---

## Summary

Three routes activated. All previously wired in execlens.js — adapters were absent (returned 400).
42.29 implements the adapters and confirms 200 responses.

---

## API Change: runScriptText → runScript

All three routes changed from `runScriptText` to `runScript` in execlens.js.

**Reason:** 42.15 and 42.16 output structured JSON (not verbatim text).
`runScriptText` wraps stdout as `{text: "..."}` — inconsistent with JSON contract.
`runScript` parses JSON stdout directly — consistent with existing routes.

---

## Routes

### `?enl=GQ-XXX`

Adapter: `scripts/pios/42.15/enl_console_adapter.py`
Input: `--query GQ-XXX`

Response shape:
```json
{
  "contract_id": "PIOS-42.15-RUN01-CONTRACT-v1",
  "query_id": "GQ-003",
  "query_text": "...",
  "intent_type": "INSTABILITY",
  "aggregate_confidence": "MODERATE",
  "enl_signals": [
    {
      "signal_id": "SIG-003",
      "relevance": "HIGH",
      "title": "...",
      "signal_state": "evaluable",
      "emphasis": "high",
      "node_id": "C_30_Domain_Event_Bus",
      "projection_reference": "...",
      "domain_id": "DOMAIN-11",
      "domain_name": "Event-Driven Architecture",
      "capability_id": "CAP-30",
      "capability_name": "Domain Event Bus",
      "component_ids": ["COMP-65"],
      "component_names": ["FleetEventsModule"]
    }
  ],
  "emphasis_nodes": [
    { "node_id": "C_30_Domain_Event_Bus", "emphasis": "high", "signal_id": "SIG-003" }
  ],
  "projection_source": "docs/pios/44.2/projection_attachment.json"
}
```

---

### `?persona=P&query=GQ-XXX`

Adapter: `scripts/pios/42.16/persona_view_map.py`
Input: `--persona P --query GQ-XXX`
Allowed personas: EXECUTIVE, CTO, ANALYST

Response shape (adds persona-specific fields to ENL output):
```json
{
  "contract_id": "PIOS-42.16-RUN01-CONTRACT-v1",
  "query_id": "GQ-003",
  "persona": "EXECUTIVE",
  "lens": "delivery_commitment",
  "framing_label": "Program Delivery Risk",
  "primary_question": "What does this mean for my program delivery commitment?",
  "enl_signals": [...],
  "emphasis_nodes": [...],
  "projection_source": "docs/pios/44.2/projection_attachment.json"
}
```

---

### `?status=true`

Adapter: `scripts/pios/42.13/demo_activate.py`
Input: `--status`

Response: demo surface activation state + route registry.

---

## Existing Routes: Unchanged

| Route | Adapter | Status |
|---|---|---|
| `?query=GQ-XXX` | 42.4 | CERTIFIED (42.28) |
| `?list=true` | 42.4 | CERTIFIED (42.28) |
| `?overview=true` | 42.6 | CERTIFIED (42.28) |
| `?topology=true` | 42.7 | CERTIFIED (42.28) |
| `?topology=true&highlight=GQ-003` | 42.7 | CERTIFIED (42.28) |
