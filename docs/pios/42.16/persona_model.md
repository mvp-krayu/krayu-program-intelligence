# Persona Model
## Stream 42.16 — Persona-Based Evidence Views

**contract_id:** PIOS-42.16-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines the three official ExecLens personas, their visibility
philosophies, and the same-truth guarantee that governs all persona views.

A persona is a named view configuration. It controls:
- what evidence depth is shown by default
- what is emphasized in display
- what drill-down level is opened first

A persona does NOT:
- alter any governed field value
- create persona-specific intelligence
- add scoring, judgment, or any form of interpretation
- suppress any section entirely (all content remains accessible)
- introduce any derived analysis not present in governed output

---

## 2. Same-Truth Guarantee

**The governed truth is identical across all personas.**

This means:
- signal IDs, titles, statements — unchanged across personas
- evidence_chain content — unchanged
- ENL node fields (node_id, source_ref, derived_from, status) — unchanged
- semantic_annotations — if present, identical across personas; only placement differs
- aggregate_confidence, intent_type — unchanged

A persona change is equivalent to changing a display preference, not a data query.
Two personas looking at GQ-003 receive the same facts in a different order with
different default expansion depth.

---

## 3. Persona Definitions

### PERSONA-01 — EXECUTIVE

**Audience:** Program executives, sponsors, non-technical decision-makers

**Philosophy:** Minimal cognitive load. Show the answer and its confidence.
Keep evidence accessible but secondary. Do not expose chain complexity by default.

**Core display commitment:**
- Signal title and statement are prominent
- Confidence level (evidence_confidence) is shown
- Business impact is surfaced immediately
- Evidence is visible as a single supporting line (not expanded)
- Full chain accessible on demand but not expanded by default
- Risk field shown — no commentary added

**Default drill-down depth:** 1 (INTEL layer only)

**What is NOT reduced:**
- Signal count — all signals for the query are shown
- Confidence values — not hidden
- Risk text — shown verbatim, not softened
- Evidence access — available, not removed

---

### PERSONA-02 — CTO

**Audience:** Chief Technology Officers, technical directors, architects

**Philosophy:** Structural and architectural emphasis. Show domains, capabilities,
and components. Expose unresolved states. Make blast-radius and dependency
structure visible. Evidence chain is prominent, not secondary.

**Core display commitment:**
- Domain / capability / component triple shown immediately for each signal
- Evidence chain shown expanded (SIG-40 → EVID visible by default)
- Blocking points and unresolved states highlighted
- Dependency-related signals (structural topology, dependency load) ordered first
- Source references included in default view
- Provenance is prominent, not secondary

**Default drill-down depth:** 3 (INTEL → SIG-41 → SIG-40, stopping before EVID unless present)

**What is emphasized:**
- domain_name, capability_name, component_names — in the signal header
- blocking_point — shown prominently when non-null
- temporal_reference — shown
- supporting_objects from evidence index — shown by default

---

### PERSONA-03 — ANALYST

**Audience:** Program analysts, data engineers, quality reviewers

**Philosophy:** Maximum evidence depth. Provenance is primary. Full chain
expanded by default. Supporting objects and lineage are shown first.
Nothing is collapsed.

**Core display commitment:**
- Full ENL chain expanded (INTEL → SIG-41 → SIG-40 → EVID)
- Supporting objects listed completely
- All source_refs shown
- Evidence chain string shown verbatim in full
- blocking_point and temporal_reference always shown
- semantic_annotations (when active) shown in full, with source_enl_id
- Chain completeness status (complete / incomplete_terminal) always shown

**Default drill-down depth:** 4 (full chain, all layers)

**What is emphasized:**
- Provenance is primary — shown at top of each signal block
- evidence_chain verbatim string always expanded
- run_id and created_at shown
- chain_status shown per signal

---

## 4. Persona Comparison Table

| Property | EXECUTIVE | CTO | ANALYST |
|---|---|---|---|
| Default drill-down depth | 1 | 3 | 4 |
| Signal title prominent | YES | YES | YES |
| Statement visible | YES | YES | YES |
| Business impact prominent | YES | secondary | shown |
| Domain/capability/component | secondary | prominent | shown |
| Evidence chain expanded | NO (1 line) | partial (depth 3) | YES (full) |
| Supporting objects | NO (hidden) | YES | YES |
| Blocking points | YES (if non-null) | YES (always) | YES (always) |
| Source references | NO | YES | YES |
| run_id / created_at | NO | NO | YES |
| Chain status label | NO | YES | YES |
| Semantic annotations | minimal (if active) | shown | full detail |

---

## 5. Persona Selection Rule

Persona selection is **always explicit**. There is no auto-detection, no implicit
switching, no environment-based persona inference.

```bash
python3 scripts/pios/42.16/persona_view_map.py --persona EXECUTIVE --query GQ-003
python3 scripts/pios/42.16/persona_view_map.py --persona CTO --signal SIG-003
python3 scripts/pios/42.16/persona_view_map.py --persona ANALYST --query GQ-003
```

If `--persona` is not specified, the adapter returns an error and exits 1.
No default persona is assumed.

---

## 6. Persona Identity Table

| Persona ID | Name | RULE Reference |
|---|---|---|
| EXECUTIVE | Program executive view | RULE-005 |
| CTO | Structural/architectural view | RULE-006 |
| ANALYST | Deep evidence view | RULE-007 |

No other personas exist in 42.16.

---

## 7. Same-Truth Verification

A same-truth check confirms that for any given signal or query:
- The set of signal_ids returned is identical across all personas
- The signal statement is identical across all personas
- The evidence_chain string is identical across all personas
- The ENL node content (where used) is identical across all personas

The persona view map applies ordering and depth filters to the display only —
it never filters out a signal, truncates a statement, or paraphrases evidence.
