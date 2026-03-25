# Adapter Spec — ENL Console Adapter (42.15)

Stream: 42.29
Contract: PIOS-42.15-RUN01-CONTRACT-v1
Script: scripts/pios/42.15/enl_console_adapter.py

---

## Purpose

Return projection-enriched signal view for a given query_id.

---

## Rules

| Rule | Description |
|---|---|
| R1 | Query-signal data sourced via 42.2 module → 42.1 layer chain |
| R2 | Projection data read read-only from 44.2 projection_attachment.json |
| R3 | No scoring, no inference, no computation of emphasis |
| R4 | Fail closed on invalid or absent query_id (exit 1) |
| R5 | JSON output to stdout only; no file writes |
| R6 | Deterministic — same inputs → same output |

---

## Data Sources

| Source | Purpose | Access |
|---|---|---|
| 42.2 render_executive_narrative.py | Signal registry, query-signal map | Import |
| 41.5 query_signal_map.json | Query → signal bindings | Via 42.1 |
| 41.4 signal_registry.json | Signal metadata | Via 42.1 |
| 44.2 projection_attachment.json | emphasis, signal_state, node_id | Read-only |

---

## Input

```
python3 scripts/pios/42.15/enl_console_adapter.py --query GQ-003
```

---

## Output Fields

| Field | Source | Derivation |
|---|---|---|
| query_id | 42.1 query_signal_map | None |
| query_text | 42.1 query_signal_map | None |
| intent_type | 42.1 query_signal_map | None |
| aggregate_confidence | 42.1 query_signal_map | None |
| enl_signals[].signal_id | 42.1 query_signal_map | None |
| enl_signals[].relevance | 42.1 query_signal_map | None |
| enl_signals[].title | 42.1 signal_registry | None |
| enl_signals[].signal_state | 44.2 projection_attachment | None |
| enl_signals[].emphasis | 44.2 projection_attachment | None |
| enl_signals[].node_id | 44.2 projection_attachment | None |
| enl_signals[].projection_reference | 44.2 projection_attachment | None |
| enl_signals[].domain_* | 42.1 signal_registry | None |
| emphasis_nodes | filtered from enl_signals where emphasis=high | filter only |
| projection_source | literal path to 44.2 artifact | None |

---

## Fix Applied in 42.29

Signal registry from `_r42._q41.load_signal_registry()` returns `dict` keyed by signal_id directly.
Initial implementation incorrectly called `.get("signals", [])`.
Fixed: `sig = signal_registry.get(sig_id)`.
