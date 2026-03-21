# Runtime State Visibility Specification
## Stream 42.12 — Semantic Exposure Optimization

**contract_id:** PIOS-42.12-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## 1. Overview

This specification defines exactly where `path_state` and `activation_status` are visible
in each surface layer, and under what conditions.

The governing rule: **honesty before enrichment** — state visibility must reflect the actual
runtime state, never an aspirational or cached value.

---

## 2. CLI Surface (42.3)

### State Banner

Produced by: `scripts/pios/42.3/execlens_cli.py` when importing `semantic_activation`.

**When INACTIVE:**
```
(no banner — output identical to pre-42.10)
```

**When ACTIVE:**
```
================================================================================
EXECLENS QUERY EXECUTION
Stream 42.1 — ExecLens Query Execution Layer
PIOS-42.1-RUN01-CONTRACT-v1 / run_01_blueedge
Semantic path: ACTIVE  [semantic_activation.py / run_01_blueedge]
================================================================================
```

**When FALLBACK:**
```
================================================================================
EXECLENS QUERY EXECUTION
...
Semantic path: FALLBACK — ENL direct path operational
================================================================================
```

### Signal Annotation Row

Produced after existing signal fields when annotation is present (ACTIVE state only):

```
  [SIG-001]  Relevance: HIGH
  Title     : <title from ENL>
  ...
  Semantic  : SEM-PAT-001 [SEM-PAT / N-01]
```

When annotation is absent (INACTIVE, FALLBACK, or no matching construct):
— Row is omitted entirely. No placeholder.

---

## 3. JSON Adapter Surface (42.4)

### Top-Level Meta Fields

Added to the root JSON object when semantic path state is ACTIVE or FALLBACK:

```json
{
  "contract_id": "...",
  "query_id": "...",
  ...existing fields unchanged...,
  "semantic_path_state": "SEMANTIC_PATH_ACTIVE",
  "semantic_activation_status": "ACTIVATED"
}
```

**When INACTIVE:**
— Fields are omitted entirely. JSON structure is identical to pre-42.10.

### Signal Annotation Block

Added to each signal entry when annotation is present (ACTIVE only):

```json
{
  "signal_id": "SIG-001",
  ...existing signal fields unchanged...,
  "semantic_annotations": {
    "semantic_id": "SEM-PAT-001",
    "construct_type": "SEM-PAT",
    "normalization_level": "N-01",
    "source_enl_id": "SIG-001"
  }
}
```

**When INACTIVE, FALLBACK, or no matching construct:**
— `semantic_annotations` key is omitted from that signal entry. No `null` value.

### Backward Compatibility Guarantee

Consumers that read only the pre-42.10 fields are unaffected:
- All pre-42.10 fields remain present and unchanged
- New fields are additional — not replacements
- Missing `semantic_annotations` is correct behavior (not an error)
- Missing `semantic_path_state` means INACTIVE — callers may infer this safely

---

## 4. Overview Adapter Surface (42.6)

### Meta Section

Added to root JSON when ACTIVE or FALLBACK:

```json
{
  ...existing overview fields unchanged...,
  "semantic_path_state": "SEMANTIC_PATH_ACTIVE"
}
```

**When INACTIVE:** — Field omitted.

The overview metrics themselves (`dependency_load`, `structural_density`,
`coordination_pressure`, `visibility_deficit`) are never altered by semantic state.
They remain sourced from signal data via 42.2 → 42.1.

---

## 5. Topology Adapter Surface (42.7)

### Domain Entry Annotation

When ACTIVE and a domain has a semantic annotation:

```json
{
  "domain_id": "DOMAIN-001",
  "domain_name": "...",
  ...existing domain fields...,
  "semantic_domain_id": "SEM-OBJ-001"
}
```

**When INACTIVE, FALLBACK, or no matching construct:**
— `semantic_domain_id` key is omitted from that domain entry.

---

## 6. Demo UI / 42.8 Choreography Surface

### State Badge

Displayed in the UI context panel (not in the primary executive answer area):

| State | Badge Text | Visual Weight |
|---|---|---|
| INACTIVE | (none) | — |
| ACTIVE | `Semantic: Active` | Small, secondary |
| FALLBACK | `Running on ENL direct path` | Small, neutral |

### Annotation Chip on Signal Card

When ACTIVE and annotation present, a small chip may appear alongside the signal card:
```
[SEM-PAT-001]
```
No tooltip that interprets or evaluates the semantic construct.
Chip is present = annotation exists. Absent = no annotation.

### Primary Executive Answer Area

**Never touched by semantic exposure.**
The executive narrative, signal statements, evidence chains, and template text are
derived exclusively from ENL and rendered by 42.2. Semantic state does not alter them.

---

## 7. User-Facing Honesty Rules

| Rule | Requirement |
|---|---|
| H-01 | INACTIVE must never show semantic labels, badges, or annotation content |
| H-02 | ACTIVE must only show annotations that exist in the 41.6 registry |
| H-03 | FALLBACK must not be presented as an error if ENL direct path is operational |
| H-04 | `path_state` in adapter output must come from `get_path_state()` — never hardcoded |
| H-05 | No annotation field may contain synthesized, inferred, or manually authored content |
| H-06 | The word "active" must not appear in INACTIVE mode context |
| H-07 | Semantic state changes must not require a page reload or session restart — they resolve at function call time |

---

## 8. Visibility Summary Table

| Surface | INACTIVE | ACTIVE | FALLBACK |
|---|---|---|---|
| 42.3 CLI state banner | absent | present (1 line) | present (1 line) |
| 42.3 signal annotation row | absent | present (when annotation exists) | absent |
| 42.4 JSON meta fields | absent | present | present |
| 42.4 signal annotation block | absent | present (when annotation exists) | absent |
| 42.6 JSON meta field | absent | present | present |
| 42.7 domain annotation | absent | present (when annotation exists) | absent |
| UI state badge | absent | present | present (neutral) |
| UI annotation chip | absent | present (when annotation exists) | absent |
| Primary executive answer | unchanged | unchanged | unchanged |
| Evidence chains | unchanged | unchanged | unchanged |
| Navigation links | unchanged | unchanged | unchanged |
