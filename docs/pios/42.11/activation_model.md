# Activation Model
## Stream 42.11 — Semantic Path Activation

**contract_id:** PIOS-42.11-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## 1. Activation Architecture

42.11 implements a single-switch, deterministic, reversible activation layer
that controls whether the semantic annotation path defined in 42.10 is live.

```
ACTIVATION SWITCH (scripts/pios/42.11/semantic_activation.py)
  │
  ├─ ACTIVATION_STATUS = "NOT_ACTIVATED"   → SEMANTIC_PATH_INACTIVE
  │    ENL direct path operates identically to pre-42.11 behavior.
  │    No semantic annotations emitted.
  │
  └─ ACTIVATION_STATUS = "ACTIVATED"
       │
       ├─ AC-001..008 ALL PASS             → SEMANTIC_PATH_ACTIVE
       │    Semantic annotations available via annotate_signal() / annotate_query().
       │    ENL fields unchanged. Annotations are additive only.
       │
       └─ AC-001..008 ANY FAIL             → SEMANTIC_PATH_FALLBACK
            ENL direct path. No annotations emitted.
            Silent transition. Runtime continues without interruption.
```

---

## 2. Runtime Switch Model

The activation switch is a single module-level string constant:

```python
# scripts/pios/42.11/semantic_activation.py

ACTIVATION_STATUS: str = "NOT_ACTIVATED"
```

**Properties:**
- Explicit: never inferred or auto-detected from environment
- Inspectable: `get_path_state()` always returns the honest current state
- Reversible: changing the constant immediately changes path selection
- Deterministic: same `ACTIVATION_STATUS` + same repository state = same path

**To activate:**

```python
import semantic_activation as sa
sa.ACTIVATION_STATUS = "ACTIVATED"
state = sa.get_path_state()
# state["path_state"] == "SEMANTIC_PATH_ACTIVE"  (if AC-001..008 all pass)
```

**To deactivate:**

```python
sa.ACTIVATION_STATUS = "NOT_ACTIVATED"
state = sa.get_path_state()
# state["path_state"] == "SEMANTIC_PATH_INACTIVE"
```

---

## 3. Active State Behavior

When `path_state == SEMANTIC_PATH_ACTIVE`:

- `annotate_signal(signal_id)` returns a semantic annotation dict for the signal
- `annotate_query(query_id)` returns a semantic intent annotation for the query
- Annotation dicts contain: `semantic_id`, `construct_type`, `normalization_level`, `source_enl_id`
- These are **additive** — no ENL field is replaced, suppressed, or reinterpreted
- When callers receive `None` from annotate functions, they emit no annotation

Annotation dict schema:

```json
{
  "semantic_id":         "SEM-PAT-001",
  "construct_type":      "SEM-PAT",
  "normalization_level": "N-01",
  "source_enl_id":       "SIG-001"
}
```

---

## 4. Inactive State Behavior

When `path_state == SEMANTIC_PATH_INACTIVE`:

- `annotate_signal()` and `annotate_query()` both return `None`
- All 42.x outputs are identical to pre-42.11 ENL-driven behavior
- No 41.6 artifacts are loaded
- No semantic registry is parsed
- No acceptance condition checks are performed
- Performance impact: zero

---

## 5. Fallback State Behavior

When `path_state == SEMANTIC_PATH_FALLBACK`:

- `annotate_signal()` and `annotate_query()` both return `None`
- All 42.x outputs are identical to ENL-driven behavior
- `get_path_state()` returns which AC-IDs failed in `fallback_triggers`
- No exception is raised to the user
- No query execution is interrupted
- No demo experience is altered

The fallback transition is silent and instantaneous at the annotation lookup point.

---

## 6. Acceptance Condition Evaluation

Acceptance conditions are evaluated lazily — only when `ACTIVATION_STATUS == "ACTIVATED"`.

| Condition | ID | Check |
|---|---|---|
| All 6 required 41.6 artifacts exist | AC-001 | file existence check |
| Registry has ≥1 construct | AC-002 | regex on registry text |
| No unanchored constructs | AC-003 | no empty source_enl_id cell |
| SEM-OBJ trace to INTEL | AC-004 | ≥2 INTEL source references |
| run_id present in registry | AC-005 | `run_01_blueedge` in registry |
| All coverage_state canonical | AC-006 | `{computed, blocked, partial}` only |
| fallback_integrity_spec declares VERIFIED | AC-007 | `VERIFIED` in spec text |
| validation_report status is PASS | AC-008 | `VALIDATION STATUS: PASS` in report |

If any AC fails → path_state = SEMANTIC_PATH_FALLBACK. No partial activation.

---

## 7. Explicit Reversibility

42.11 can be fully reversed without affecting any other layer:

| Reversal Action | Effect |
|---|---|
| Set `ACTIVATION_STATUS = "NOT_ACTIVATED"` | Path returns to INACTIVE immediately |
| Remove `scripts/pios/42.11/` | No import of activation module possible — callers return None |
| Neither action modifies ENL, 41.6, or 42.x adapter behavior |  |

No residual semantic state persists in inactive mode. No cache. No file writes.
The ENL direct path is always preserved as-is.

---

## 8. No Interpretation Leakage

The activation module does not:
- Classify signals by risk band
- Score or rank constructs
- Apply thresholds or zones (75.x authority)
- Derive conclusions from semantic annotations
- Generate synthetic data

`annotate_signal()` returns verbatim registry values (labels, IDs, normalization codes).
All evaluative interpretation remains deferred to 75.x, which is explicitly out of scope.

---

## 9. Current Activation State

```
ACTIVATION_STATUS:  NOT_ACTIVATED
path_state:         SEMANTIC_PATH_INACTIVE
enl_direct_path:    OPERATIONAL
semantic_ready:     YES (41.6 validated, 42.10 passed)
activation_module:  scripts/pios/42.11/semantic_activation.py
```
