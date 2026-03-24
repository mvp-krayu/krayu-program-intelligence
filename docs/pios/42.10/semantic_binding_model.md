# Semantic Binding Model
## Stream 42.10 — Semantic Binding Contract

**contract_id:** PIOS-42.10-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## 1. Purpose

Stream 42.10 defines the formal binding architecture that allows 42.x (the Exposure Layer) to consume 41.6 semantic assimilation outputs when valid, while guaranteeing that ENL direct consumption remains fully operational at all times.

42.10 does **not** activate the semantic path. It defines the architecture, validates that binding is safe, and hands the activation decision to 42.11.

---

## 2. Architecture

### 2.1 Dual-Path Model

```
PRIMARY PATH (candidate — requires 42.11 activation):
  40.x → ENL → 41.6 Semantic Assimilation → 42.x

FALLBACK PATH (guaranteed operational):
  40.x → ENL → 42.x  (current active path)
```

The fallback path is the current operational path. It is not a degraded state — it is the fully functional path that has been running since 42.1.

### 2.2 Layer Responsibilities

| Layer | Responsibility | Semantic Authority |
|---|---|---|
| 40.x | Evidence, signals, conditions, intelligence | None — evidence generation |
| ENL (001–008) | Navigation, traversal, binding, narrative | None — evidence navigation |
| 41.6 | Semantic assimilation — grouping, labeling, abstraction | Owns semantic definitions |
| 42.10 | Binding contract definition and validation | Consumer — no semantic ownership |
| 42.x (42.1–42.9) | Query execution, rendering, demo surface | Consumer — no semantic ownership |
| 75.x | Interpretation, scoring, classification | Deferred — must not leak into 42.x |

### 2.3 Binding Scope

42.10 defines semantic binding as an **annotation layer** over existing 42.x data structures. When the semantic path is active:

- Signal entries in 42.x outputs may carry optional `semantic_annotations` blocks
- `semantic_annotations` contains: `semantic_id`, `construct_type`, `normalization_level`
- All existing ENL-derived fields remain unchanged and present
- No ENL field is replaced, renamed, or removed by semantic annotation

When the semantic path is inactive:
- No `semantic_annotations` block is present
- 42.x output is identical to current ENL-driven behavior

### 2.4 Binding Point in 42.x Chain

The semantic binding point is between the data assembly layer (42.1) and the output layer (42.2/42.4). Specifically:

```
42.1 (QUERY → SIGNAL → EVIDENCE → NAVIGATION)
  │
  ▼
[42.10 BINDING POINT — optional semantic annotation]
  │
  ▼
42.2 / 42.4 / 42.6 / 42.7 (rendering and adapters)
```

The binding point is additive only. 42.1's traversal output is never modified — only annotated.

---

## 3. Activation Conditions

The semantic path may be activated by 42.11 only if **all** of the following conditions are met:

| Condition ID | Acceptance Condition |
|---|---|
| AC-001 | All 6 required 41.6 artifacts exist at `docs/pios/41.6/` |
| AC-002 | `semantic_construct_registry.md` is parseable and contains at least 1 entry |
| AC-003 | Every semantic construct in the registry carries a non-empty `source_enl_id` |
| AC-004 | Every `source_enl_id` resolves to a known ENL signal or intelligence object |
| AC-005 | `run_id` in 41.6 constructs matches the active run_id |
| AC-006 | No 41.6 construct claims a coverage_state different from its ENL source object |
| AC-007 | `fallback_integrity_spec.md` is present and declares fallback VERIFIED |
| AC-008 | `semantic_validation_report.md` reports overall status PASS |

If any condition fails, the semantic path must not be activated. The fallback path remains active.

---

## 4. Fallback Relationship

### 4.1 Fallback is not a failure state

The fallback path (`ENL → 42.x`) is the canonical path that has been operational since 42.1. Fallback activation does not represent a system failure — it means 42.x is running normally without semantic enrichment.

### 4.2 Fallback is mandatory

No 42.x function, adapter, or UI rendering may depend on 41.6 constructs being present. If a 42.x component cannot operate without `semantic_annotations`, that component has violated the binding contract and must be corrected.

### 4.3 Fallback trigger conditions

See `fallback_runtime_integrity.md` for the full fallback trigger specification. Summary:

- FT-001: 41.6 artifacts unavailable
- FT-002: Registry absent or unparseable
- FT-003: Construct missing `source_enl_id`
- FT-004: run_id mismatch
- FT-005: Validation report status is not PASS
- FT-006: Any acceptance condition (AC-001..008) fails

---

## 5. No-Regression Rule

The semantic binding must not degrade any current behavior:

- Query execution must produce identical ENL-grounded results
- Signal binding must preserve all ENL signal fields
- Evidence binding must be unchanged
- Navigation binding must be unchanged
- Demo choreography must be unaffected
- All test suites (42.1–42.9 validators) must continue to pass

Regression test matrix: see `non_regression_matrix.md`.

---

## 6. Runtime Honesty

The runtime path state must be explicit and inspectable at all times:

| State | Meaning |
|---|---|
| `SEMANTIC_PATH_ACTIVE` | 41.6 binding validated; semantic annotations present in output |
| `SEMANTIC_PATH_INACTIVE` | 41.6 not yet activated; ENL direct path in use; no annotations |
| `SEMANTIC_PATH_FALLBACK` | 41.6 was present but failed validation; reverted to ENL direct path |

**Current state (run_01_blueedge, 42.10):** `SEMANTIC_PATH_INACTIVE`

42.10 does not activate the semantic path. The current state is `SEMANTIC_PATH_INACTIVE`. 41.6 is complete and validated as a standalone layer; it is available for activation by 42.11 but is not yet bound into 42.x runtime behavior.

---

## 7. Interpretation Firewall

42.10 explicitly prohibits the following from being introduced through the semantic binding:

- Threshold values, band assignments, or zone classifications (75.x authority)
- Scoring, ranking, or risk quantification
- Derived conclusions not present in ENL nodes
- Any statement that cannot be traced to a specific ENL `node_id`
- Predictive or probabilistic claims

The `construct_type` and `normalization_level` fields in semantic annotations are labeling only — they do not carry evaluative meaning.
