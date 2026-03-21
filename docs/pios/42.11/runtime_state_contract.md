# Runtime State Contract
## Stream 42.11 — Semantic Path Activation

**contract_id:** PIOS-42.11-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## 1. Path State Contract

Three and only three path states are defined. Every runtime moment falls into exactly one.

| path_state | activation_status | AC-001..008 | Semantic Annotations | 42.x Behavior |
|---|---|---|---|---|
| `SEMANTIC_PATH_INACTIVE` | `NOT_ACTIVATED` | not evaluated | absent | ENL direct — unchanged |
| `SEMANTIC_PATH_ACTIVE` | `ACTIVATED` | ALL PASS | present (additive) | ENL direct + annotations |
| `SEMANTIC_PATH_FALLBACK` | `ACTIVATED` | ANY FAIL | absent | ENL direct — unchanged |

**Exhaustive coverage:** No path state outside these three is possible.

---

## 2. Activation Status Contract

| activation_status | Type | Default | Set by |
|---|---|---|---|
| `NOT_ACTIVATED` | str constant | YES | module default |
| `ACTIVATED` | str constant | NO | explicit assignment only |

**Rules:**
- `ACTIVATION_STATUS` is the sole determination of whether acceptance conditions are evaluated
- Activation is never inferred from environment variables, file timestamps, or session state
- No hidden auto-activation behavior exists

---

## 3. `get_path_state()` Return Contract

`get_path_state()` is always available, always honest, and has no side effects.

```python
def get_path_state() -> dict:
    ...

# Return schema:
{
    "path_state":          str,   # SEMANTIC_PATH_INACTIVE | ACTIVE | FALLBACK
    "activation_status":   str,   # NOT_ACTIVATED | ACTIVATED
    "acceptance_results":  dict,  # {AC-001: bool, ..., AC-008: bool} — empty when INACTIVE
    "fallback_triggers":   list,  # [AC-ID, ...] — empty unless FALLBACK
    "run_id":              str,   # "run_01_blueedge"
}
```

**Invariants:**
- When `path_state == SEMANTIC_PATH_INACTIVE`: `acceptance_results == {}`, `fallback_triggers == []`
- When `path_state == SEMANTIC_PATH_ACTIVE`: all values in `acceptance_results` are `True`, `fallback_triggers == []`
- When `path_state == SEMANTIC_PATH_FALLBACK`: at least one AC-ID in `fallback_triggers`, that AC maps to `False` in `acceptance_results`

---

## 4. Semantic Annotation Presence Rules

Annotations are produced only when the following conditions all hold:

1. `ACTIVATION_STATUS == "ACTIVATED"`
2. All acceptance conditions AC-001..008 return `True`
3. The specific `signal_id` or `query_id` has a matching construct in the 41.6 registry

When any condition is not met, `annotate_signal()` and `annotate_query()` return `None`.
Callers must treat `None` as "no annotation" — no exception, no fallback error.

**Annotation field contract (when non-None):**

| Field | Type | Source | Meaning |
|---|---|---|---|
| `semantic_id` | str | 41.6 registry | Construct identifier (e.g. `SEM-PAT-001`) |
| `construct_type` | str | 41.6 registry | Construct family (SEM-OBJ, SEM-PAT, SEM-STATE, SEM-STMT, SEM-INTENT) |
| `normalization_level` | str \| None | 41.6 registry | Normalization operation code (N-01, N-02, N-03, or None) |
| `source_enl_id` | str | 41.6 registry | The ENL object this construct was derived from |

These fields are **labels only**. They carry no evaluative meaning, no scoring, and no thresholds.

---

## 5. User-Facing Honesty Rules

**RULE-005** is enforced through the following behavioral commitments:

| Commitment | State: INACTIVE | State: ACTIVE | State: FALLBACK |
|---|---|---|---|
| `path_state` is declared in runtime context | YES (`INACTIVE`) | YES (`ACTIVE`) | YES (`FALLBACK`) |
| `activation_status` is declared | YES (`NOT_ACTIVATED`) | YES (`ACTIVATED`) | YES (`ACTIVATED`) |
| Semantic annotations in output | NO | YES (optional) | NO |
| ENL-derived fields present | YES | YES (unchanged) | YES (unchanged) |
| Query execution operational | YES | YES | YES |
| Demo behavior identical to pre-42.11 | YES | YES + optional labels | YES |

**No silent semantic activation.**
**No false claim of active semantics.**
**No suppression of ENL data in any state.**

---

## 6. Fallback Trigger Contract

When `ACTIVATION_STATUS == "ACTIVATED"` and any acceptance condition fails:

1. `path_state` is immediately set to `SEMANTIC_PATH_FALLBACK`
2. `fallback_triggers` lists all failing AC-IDs
3. `annotate_signal()` and `annotate_query()` return `None`
4. No exception is raised
5. All 42.x behavior continues on ENL direct path
6. No output difference visible to callers beyond the absent annotation block

The fallback is silent, automatic, and covers any combination of AC failures.

---

## 7. Runtime State at Contract Execution

```
path_state:         SEMANTIC_PATH_INACTIVE
activation_status:  NOT_ACTIVATED
acceptance_results: {}
fallback_triggers:  []
run_id:             run_01_blueedge

CONTRACT STATUS: CLOSED — PASS
```
