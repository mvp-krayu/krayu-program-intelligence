# Persona UI Specification
## Stream 42.16 — Persona-Based Evidence Views

**contract_id:** PIOS-42.16-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines the selector/toggle behavior, label conventions, and
non-invasive UI rules for persona-based evidence views. The persona UI is
minimal by design — it does not redesign ExecLens.

---

## 2. Persona Selector

### CLI interface

Persona is selected via explicit flag:

```bash
python3 scripts/pios/42.16/persona_view_map.py --persona <PERSONA_ID> --query <QUERY_ID>
python3 scripts/pios/42.16/persona_view_map.py --persona <PERSONA_ID> --signal <SIGNAL_ID>
```

Valid `--persona` values: `EXECUTIVE`, `CTO`, `ANALYST`

If `--persona` is omitted: print usage and exit 1. No default persona.
If an invalid persona name is given: print error and exit 1.

### UI Selector Rules

| Rule | Description |
|---|---|
| US-01 | Persona must be explicitly named — no positional default |
| US-02 | Persona name is case-insensitive for input (EXECUTIVE = executive) |
| US-03 | Displayed persona name is always uppercase in output header |
| US-04 | No auto-detection of persona from environment or prior state |
| US-05 | No implicit switching between personas during a single run |

---

## 3. Persona Mode Header

Every persona output begins with a mode header. This is a display element only —
it identifies the active persona and the query/signal being viewed.

### Header format

```
╔══════════════════════════════════════════════════════════════════╗
║  [PERSONA: EXECUTIVE]  GQ-003 — Blast Radius Assessment          ║
║  path_state: SEMANTIC_PATH_INACTIVE  |  mode: EVIDENCE-FIRST     ║
╚══════════════════════════════════════════════════════════════════╝
```

### Header fields

| Field | Source | Notes |
|---|---|---|
| PERSONA | CLI `--persona` argument | Always uppercase |
| Query/signal ID | CLI `--query` or `--signal` argument | Verbatim |
| Query description | query_signal_map.json query_text | Verbatim |
| path_state | `demo_activate.py --status` or `SEMANTIC_PATH_INACTIVE` | Live state |
| mode | Always `EVIDENCE-FIRST` | Static label |

### Path state in header

The `path_state` in the header is sourced from the current system state — the same
value returned by `get_path_state()`. It is not cached from a prior invocation.

---

## 4. Section Labels

Each output section uses a consistent label format:

| Section type | Label format |
|---|---|
| Signal block | `── Signal {N}/{total}: {signal_id} [{relevance}] ──` |
| Provenance section | `  [PROVENANCE]` |
| Evidence chain | `  [EVIDENCE]` |
| Supporting objects | `  [SUPPORTING]` |
| ENL chain | `  [ENL CHAIN]  depth: {shown}/{total}` |
| Blocked state | `  [BLOCKED]  blocking_point: ...` |

Section labels are static strings from 42.16. They do not contain derived analysis.

---

## 5. SAFE / ENHANCED Mode Compatibility

Persona views must work correctly in both SAFE MODE (SEMANTIC_PATH_INACTIVE) and
ENHANCED MODE (SEMANTIC_PATH_ACTIVE).

### SAFE MODE behavior

In SAFE MODE, the semantic path is inactive. Persona views operate on ENL
evidence chain data only (from ENL graph and evidence_mapping_index.json).
No semantic annotations are present. All three personas are fully functional.

### ENHANCED MODE behavior

In ENHANCED MODE, semantic_annotations may be present in adapter output.
Persona display of annotations:

| Persona | Annotation display |
|---|---|
| EXECUTIVE | Annotation construct label shown (one line) — no source_enl_id |
| CTO | Annotation construct label + construct_type — no source_enl_id |
| ANALYST | Full annotation block — construct label + construct_type + source_enl_id |

Annotations are identical in content across personas — only detail depth differs.

### FALLBACK MODE behavior

In FALLBACK MODE, semantic_annotations are absent (path reverts to INACTIVE behavior).
All three personas remain fully functional using ENL evidence chain data.
A single neutral notice is displayed:

```
  [path_state: SEMANTIC_PATH_FALLBACK — semantic annotations unavailable]
```

This is the same neutral notice used in 42.12/42.13 fallback handling. No persona
receives a different or more alarming fallback notice.

---

## 6. Non-Invasive UI Rules

These rules ensure persona views do not redesign or break ExecLens.

| Rule | Description |
|---|---|
| NI-01 | Persona view output is a new section — it does not replace 42.4 output |
| NI-02 | Existing 42.x adapter scripts are not modified |
| NI-03 | No new color codes or terminal escape sequences introduced |
| NI-04 | Frame width: 66 chars for persona headers (matching 42.14 overlay frames) |
| NI-05 | No interactive prompts — all input via CLI flags |
| NI-06 | No file writes — output to stdout only |
| NI-07 | No process-state side effects — persona_view_map.py is read-only |

---

## 7. Error Display

When a required data source is missing or a signal is not found:

```
[ERROR] Signal SIG-007 not found in evidence_mapping_index.json
```

Errors go to stderr. Exit code 1. No partial output.

---

## 8. Compatibility Matrix

| Mode | EXECUTIVE | CTO | ANALYST |
|---|---|---|---|
| SAFE (INACTIVE) | PASS | PASS | PASS |
| ENHANCED (ACTIVE) | PASS | PASS | PASS |
| FALLBACK | PASS | PASS | PASS |
| ENL graph available | PASS | PASS | PASS |
| Evidence mapping only | PASS | PASS | PASS |
| Depth override (--depth N) | PASS | PASS | PASS |
