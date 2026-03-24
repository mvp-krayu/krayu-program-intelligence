# Persona Ordering Specification
## Stream 42.16 — Persona-Based Evidence Views

**contract_id:** PIOS-42.16-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines what appears first, second, and at what prominence for
each persona on each major display surface. Ordering changes what is prominent —
it does not change what exists.

All sections are present for all personas. Ordering controls visual priority only.

---

## 2. Signal Block Ordering Per Persona

For each signal returned by a query, the display sections appear in this order:

### EXECUTIVE — Signal block order

```
[1] signal_id  +  title
[2] statement  (full — verbatim)
[3] evidence_confidence
[4] business_impact  (if present)
[5] risk  (if present — verbatim)
[6] evidence summary  (single line: evidence_confidence + source_layer)
    [details accessible on drill-down — not expanded]
```

### CTO — Signal block order

```
[1] signal_id  +  title
[2] domain_name  /  capability_name  /  component_names
[3] statement  (full — verbatim)
[4] evidence_chain  (partial — up to SIG-40 layer)
[5] blocking_point  (prominent if non-null)
[6] source_object_id  +  source_layer
[7] supporting_objects  (listed)
[8] temporal_reference  (if present)
[9] evidence_confidence
[10] business_impact  (if present)
```

### ANALYST — Signal block order

```
[1] signal_id  +  title
[2] evidence_chain  (full verbatim — expanded)
[3] supporting_objects  (all — with layer/object_id/state)
[4] source_object_id  +  source_layer  +  source_file
[5] blocking_point  (always shown — null displayed as null)
[6] temporal_reference  (always shown if present)
[7] statement  (full — verbatim)
[8] domain_name  /  capability_name  /  component_names
[9] evidence_confidence  +  confidence_rationale
[10] business_impact  (if present)
[11] run_id  +  created_at  (from ENL graph when available)
[12] chain_status
```

---

## 3. Query-Level Ordering Per Persona

For query-level output, the top-level sections appear in this order:

### EXECUTIVE

```
[1] query_id  +  query_text  (the question answered)
[2] aggregate_confidence
[3] signals  (ordered by evidence_confidence DESC, then signal_id ASC)
```

### CTO

```
[1] query_id  +  query_text
[2] intent_type
[3] aggregate_confidence
[4] signals  (ordered by: INSTABILITY/STRUCTURAL signals first, then signal_id ASC)
```

### ANALYST

```
[1] query_id  +  query_text
[2] intent_type
[3] aggregate_confidence
[4] semantic_tags  (if present)
[5] signals  (ordered by signal_id ASC — canonical order)
[6] chain_status  per signal
```

---

## 4. Signal Sort Orders

| Persona | Signal Sort Order | Rationale |
|---|---|---|
| EXECUTIVE | evidence_confidence DESC, then signal_id ASC | Highest-confidence first for decision-making |
| CTO | Structural/blast-radius relevant first, then signal_id ASC | Architecture-critical signals lead |
| ANALYST | signal_id ASC (canonical) | Stable reference order for analysis |

### CTO Signal Priority

CTO view orders signals such that signals with the following domain or semantic_tag patterns appear first:
- intent_type = INSTABILITY
- intent_type = STRUCTURAL_RISK
- evidence_chain contains "blast" or "dependency" or "structural"
- domain_name contains "Infrastructure" or "Platform"

All signals still appear — this is ordering only.

---

## 5. Evidence Chain Display Rules

| Persona | Evidence chain display | Default |
|---|---|---|
| EXECUTIVE | Single summary line: `{source_layer} → {source_object_id}  [{evidence_confidence}]` | Collapsed |
| CTO | Partial chain string up to SIG-40 node; EVID accessible on drill-down | Partially expanded |
| ANALYST | Full verbatim chain string; all nodes shown | Fully expanded |

The full verbatim evidence_chain string is never truncated in ANALYST view.
In EXECUTIVE view, the collapsed summary is a fixed-format line — no paraphrase.

### EXECUTIVE evidence summary line format

```
evidence: {source_layer}/{source_object_id} [{evidence_confidence}]
```

Example:
```
evidence: 40.7/INTEL-001 [STRONG]
```

This line is constructed from verbatim field values only. No prose is added.

---

## 6. Supporting Objects Display

| Persona | Supporting objects | Default |
|---|---|---|
| EXECUTIVE | Hidden (accessible via drill-down) | Not shown |
| CTO | Shown — one line per object | Shown |
| ANALYST | Shown — full detail per object | Shown |

---

## 7. Provenance Fields Display

| Field | EXECUTIVE | CTO | ANALYST |
|---|---|---|---|
| source_object_id | Not shown | Shown | Shown |
| source_layer | Not shown | Shown | Shown |
| source_file | Not shown | Not shown | Shown |
| supporting_objects | Not shown | Shown (compact) | Shown (full) |
| evidence_chain | Summary only | Partial | Full verbatim |
| blocking_point | Non-null only | Always | Always |
| temporal_reference | Not shown | Shown | Shown |
| run_id | Not shown | Not shown | Shown |
| created_at | Not shown | Not shown | Shown |

---

## 8. Persona Header

Each persona output begins with a persona header identifying the active view:

```
[PERSONA: EXECUTIVE]  GQ-003 — Blast Radius Assessment
```

```
[PERSONA: CTO]        GQ-003 — Blast Radius Assessment
```

```
[PERSONA: ANALYST]    GQ-003 — Blast Radius Assessment
```

The header is a display element only. It does not alter any data.
