# Semantic Annotation Display Specification
## Stream 42.12 — Semantic Exposure Optimization

**contract_id:** PIOS-42.12-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## 1. What May Be Displayed

Semantic annotations are label surfaces only. They carry construct identity, not interpretation.

### Permitted display fields

| Field | Source | Display Form | Example |
|---|---|---|---|
| `semantic_id` | 41.6 registry | Verbatim identifier | `SEM-PAT-001` |
| `construct_type` | 41.6 registry | Verbatim code | `SEM-PAT` |
| `normalization_level` | 41.6 registry | Verbatim code or canonical name | `N-01` or `Grouping` |
| `source_enl_id` | 41.6 registry | Verbatim identifier | `SIG-001` |

### Canonical normalization level descriptions

These are the only permitted descriptive expansions of normalization codes:

| Code | Description |
|---|---|
| `N-01` | Grouping (multiple ENL signals grouped into one pattern) |
| `N-02` | Labeling (ENL signal given a semantic name, one-to-one) |
| `N-03` | Structural abstraction (ENL graph position abstracted to semantic type) |
| `null` | No normalization applied |

These descriptions are informational only. They must not be used to score, rank, or evaluate signal quality.

---

## 2. What Must Not Be Displayed

**Forbidden derived content:**

| Forbidden | Reason |
|---|---|
| "This signal is high risk" | Interpretation — not a registry value |
| "SEM-PAT-001 indicates instability" | Semantic inference — 75.x territory |
| Normalization level as quality score | N-01 is not better than N-02 |
| Construct type as severity indicator | SEM-STATE is not "more serious" than SEM-PAT |
| "3 of 5 signals have semantic coverage" | Coverage reporting — not defined in 42.12 |
| Any comparison between constructs | Ranking is 75.x territory |
| "semantic_id not found — low quality" | Absence of annotation is not a quality signal |

---

## 3. Display Conditions

### When annotations MUST appear: never mandatory

Semantic annotations are always optional. Their presence depends on:
1. `path_state == SEMANTIC_PATH_ACTIVE`
2. The specific signal or query having a matching construct in the 41.6 registry
3. The surface having exposure wired

If any condition is false, no annotation surface appears. No error. No warning. No placeholder.

### When annotations MUST NOT appear

| Condition | Annotation display |
|---|---|
| `path_state == SEMANTIC_PATH_INACTIVE` | Forbidden — zero annotation content |
| `path_state == SEMANTIC_PATH_FALLBACK` | Forbidden — zero annotation content |
| `annotate_signal()` returns `None` | Forbidden — no placeholder |
| Surface has not explicitly wired 42.11 import | Not applicable — no annotation rendered |

---

## 4. Inactive Mode Must Remain Clean

In `SEMANTIC_PATH_INACTIVE` state:

- No annotation rows in CLI output
- No `semantic_annotations` key in JSON adapter output
- No `semantic_path_state` key in any adapter
- No annotation chips in UI
- No state badges of any kind
- Output is byte-for-byte identical to pre-42.10 ExecLens

**Verification:** `diff` between INACTIVE mode output and pre-42.10 output must be empty.

---

## 5. No-Interpretation Rule

Semantic annotations are structural labels derived from ENL graph topology.
They do not evaluate, rank, score, or recommend.

The following display patterns are explicitly prohibited:

**Prohibited pattern A — implicit scoring:**
```
Signal strength: HIGH (semantic pattern confirmed)   ← FORBIDDEN
```

**Prohibited pattern B — construct interpretation:**
```
SEM-STATE-003 — blocked diagnosis detected           ← FORBIDDEN (diagnosis is ENL's)
```

**Prohibited pattern C — absence as negative signal:**
```
Signal SIG-007: No semantic construct assigned       ← FORBIDDEN
```

**Prohibited pattern D — construct comparison:**
```
3 signals have SEM-PAT constructs (strong coverage)  ← FORBIDDEN
```

**Permitted pattern — label only:**
```
  Semantic: SEM-PAT-001 [SEM-PAT / N-01]             ← PERMITTED
```

---

## 6. Progressive Disclosure Model

Semantic annotations should be discoverable, not dominant.

| Disclosure Level | What Is Shown | Where |
|---|---|---|
| Level 0 — INACTIVE | Nothing | All surfaces |
| Level 1 — State indicator | `path_state` and `activation_status` | CLI banner, JSON meta, UI badge |
| Level 2 — Signal annotation | `semantic_id`, `construct_type`, `normalization_level` | Per-signal annotation rows/blocks |
| Level 3 — Full annotation | All annotation fields including `source_enl_id` | JSON adapter, detailed UI view |

Level 0 (INACTIVE) is the default. Levels 1–3 are only reached when explicitly activated.

Within levels 1–3, the executive answer and signal substance remain at the primary level.
Semantic annotations are secondary — below the fold, after existing content, or in a separate panel.

---

## 7. Annotation Display Templates

### CLI annotation row (Level 2)

```
  Semantic  : SEM-PAT-001 [SEM-PAT / Grouping]
```

Single line. After existing signal fields. Indented consistently with other fields.

### JSON annotation block (Level 3)

```json
"semantic_annotations": {
  "semantic_id": "SEM-PAT-001",
  "construct_type": "SEM-PAT",
  "normalization_level": "N-01",
  "source_enl_id": "SIG-001"
}
```

Single block. After existing signal fields. No nesting beyond this level.

### UI annotation chip (Level 2)

```
[ SEM-PAT-001 ]
```

Small, non-intrusive. No color coding that implies quality. No tooltip that interprets.

---

## 8. Summary

| Decision | Ruling |
|---|---|
| Annotations mandatory when ACTIVE | NO — they are optional and presence-dependent |
| Annotations visible when INACTIVE | FORBIDDEN |
| Annotations visible when FALLBACK | FORBIDDEN |
| ENL fields altered by annotations | FORBIDDEN |
| Interpretation or scoring in annotations | FORBIDDEN |
| Annotation absence treated as warning | FORBIDDEN |
| Annotations replace primary output | FORBIDDEN |
| Progressive disclosure preferred | YES |
| Verbatim registry values only | REQUIRED |
