# Exposure Model
## Stream 42.12 — Semantic Exposure Optimization

**contract_id:** PIOS-42.12-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## 1. Semantic Exposure Philosophy

42.12 governs how semantic path state and semantic annotations are surfaced in ExecLens.

Three principles guide every exposure decision:

**Principle 1 — Honesty before enrichment**
The user must always know the actual semantic path state. If inactive, the surface says nothing about semantics. If active, annotations appear. If fallback, the ENL direct path is confirmed operational — not flagged as error.

**Principle 2 — ENL answer first, semantics second**
The executive answer is always derived from ENL. Semantic annotations are contextual additions at the margin. They never replace, reframe, or compete with the governed executive text.

**Principle 3 — Zero clutter in inactive mode**
The default runtime state is `SEMANTIC_PATH_INACTIVE`. In this state, the surface is identical to pre-42.10 ExecLens. No semantic labels, no state banners, no empty annotation blocks. The user sees a clean executive response grounded in ENL.

---

## 2. Inactive / Active / Fallback Display Model

### INACTIVE (default — `ACTIVATION_STATUS = "NOT_ACTIVATED"`)

```
SURFACE RULE: No semantic content of any kind.

CLI:          No state banner. No annotation section. Identical to pre-42.10 output.
JSON Adapter: No path_state field added. No semantic_annotations field added.
UI:           No semantic badge. No state indicator. Clean.
Demo:         Default demo mode. Fully operational. Identical to current demo.
```

### ACTIVE (`ACTIVATION_STATUS = "ACTIVATED"`, all AC-001..008 pass)

```
SURFACE RULE: Semantic state is visible at the margin. Annotations appear where present.

CLI:          Optional single-line state banner after header.
              Optional semantic annotation rows per signal (after existing fields).
JSON Adapter: Optional path_state field at top level.
              Optional activation_status field at top level.
              Optional semantic_annotations block per signal (after existing fields).
UI:           Small semantic readiness badge in context.
              Annotation chips on signal cards where annotation present.
Demo:         Same structure. Optional semantic context panel at bottom.
              Primary executive answer is unchanged.
```

### FALLBACK (`ACTIVATION_STATUS = "ACTIVATED"`, any AC-001..008 fail)

```
SURFACE RULE: Fallback is not an error. ENL is operational. State is honest.

CLI:          Optional single-line fallback notice (e.g. "Semantic path: FALLBACK — ENL direct operational").
JSON Adapter: Optional path_state: SEMANTIC_PATH_FALLBACK.
              No semantic_annotations field (absent = correct for fallback).
UI:           Small neutral indicator: "Running on ENL direct path."
Demo:         No visual degradation. Demo works identically to INACTIVE state.
```

---

## 3. Additive Exposure Rules

The following rules govern all semantic exposure decisions:

**AE-001** — Semantic annotations may only appear when `path_state == SEMANTIC_PATH_ACTIVE` and the specific signal or query has a matching construct.

**AE-002** — Semantic annotation display never replaces existing content. It appends after existing ENL-derived content.

**AE-003** — Annotation fields that may be displayed: `semantic_id`, `construct_type`, `normalization_level` (when present). No evaluative text derived from these values.

**AE-004** — `normalization_level` is a code (`N-01`, `N-02`, `N-03`). It must be displayed verbatim or with its canonical description from the assimilation model. No scoring or judgment derived from it.

**AE-005** — `path_state` and `activation_status` may appear in adapter output and CLI meta. They must always be the honest current values from `get_path_state()`.

**AE-006** — When `annotate_signal()` returns `None`, that signal's output contains no `semantic_annotations` key. No empty objects, no `null` annotations, no placeholder text.

**AE-007** — ENL-derived fields (`title`, `statement`, `evidence_chain`, `domain_name`, `capability_name`) must never be altered by semantic exposure logic.

---

## 4. Zero-Clutter Principle

The zero-clutter principle is active in all states:

| State | Primary Surface | Semantic Surface | Clutter Level |
|---|---|---|---|
| INACTIVE | ENL executive answer, signals, evidence | None | Zero |
| ACTIVE | ENL executive answer, signals, evidence | Annotation rows at signal margin | Minimal |
| FALLBACK | ENL executive answer, signals, evidence | Single-line notice | Zero |

**Implementation rule:** If removing all semantic exposure elements leaves the output unchanged from pre-42.10 behavior, the zero-clutter principle is satisfied.

---

## 5. Exposure Layer Map

| Layer | Exposure Target | When Shown | What Is Shown |
|---|---|---|---|
| 42.3 CLI | State banner | ACTIVE or FALLBACK only | Single line: `Semantic path: <STATE>` |
| 42.3 CLI | Signal annotation row | ACTIVE, annotation present | `  Semantic: <semantic_id> [<construct_type>]` |
| 42.4 JSON | Top-level meta | ACTIVE or FALLBACK | `path_state`, `activation_status` |
| 42.4 JSON | Signal annotation | ACTIVE, annotation present | `semantic_annotations: {semantic_id, construct_type, normalization_level}` |
| 42.6 JSON | Meta section | ACTIVE or FALLBACK | `semantic_path_state` field |
| 42.7 JSON | Domain entry | ACTIVE, annotation present | `semantic_domain_id` field |
| UI/Demo | State badge | ACTIVE | Small label: `Semantic: Active` |
| UI/Demo | Annotation chip | ACTIVE, annotation present | `SEM-PAT-001` chip on signal card |
| UI/Demo | Fallback notice | FALLBACK | `Running on ENL direct path` |

---

## 6. Current Exposure State

```
path_state:         SEMANTIC_PATH_INACTIVE
activation_status:  NOT_ACTIVATED
exposure_active:    NO
surface_change:     NONE (all surfaces identical to pre-42.10)
```
