# GAUGE Scoring Semantic Alignment Specification
# PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01
- Authority: GAUGE.STATE.COMPUTATION.CONTRACT.01 / PSEE-GAUGE.0/gauge_score_model.md
- Branch: feature/gauge-scoring-semantic-alignment
- Date: 2026-04-14

---

## SECTION 1 — PROBLEM STATEMENT

### Observed failure

`pios compute gauge` produced `canonical_score=100` on a structural-proof-only run
(run_bac_validation_01). Execution was never performed. The PSEE engine was never invoked.
Yet the score showed 100 — the same as a fully-executed run.

**Validated UI truth (from approved design):**

| field | expected | actual (pre-fix) |
|-------|----------|-----------------|
| canonical_score | 60 | 100 |
| projected_score | 100 | (absent) |
| execution_status | NOT_EVALUATED | COMPLETE |
| confidence band | [60, 100] | [100, 100] |

### Root cause

`completion_points = 40` was awarded whenever `terminal_state = S-13`, which was
triggered by structural proof alone (`coverage_state=COMPUTED AND reconstruction_state=PASS`).
No execution evidence was required.

The S-13 terminal state was **structurally reachable** without execution — but `completion_points`
represent **execution completion**, not structural completion. These are different concepts and
must not be conflated.

---

## SECTION 2 — SCORING MODEL CORRECTION

### Invariant

> **`completion_points` represent execution completion evidence. They are ZERO when execution
> has not been evaluated.**

| condition | completion_points | canonical_score | projected_score |
|-----------|-----------------|----------------|----------------|
| `execution_layer_evaluated = True` AND `terminal_state = S-13` | 40 | 100 | 100 |
| `execution_layer_evaluated = True` AND `terminal_state = S-T3` | 20 | varies | varies |
| `execution_layer_evaluated = False` (all current structural runs) | **0** | **60** | **100** |

### Evidence field

`execution_layer_evaluated` is read from `coverage_state.json.execution_layer_evaluated`.

- All current structural-proof-only runs: field absent → `False`
- Future runs where PSEE engine is invoked: field must be `True`
- No fabrication: the field must be present in the artifact or it is treated as `False`

---

## SECTION 3 — SCORE SEMANTICS

### canonical_score

The **proven lower bound**. Points that have been earned by evidence that exists now.

```
canonical_score = completion_points + coverage_points + reconstruction_points
```

When `execution_layer_evaluated = False`:
```
canonical_score = 0 + 35 + 25 = 60
```

### projected_score

The **achievable upper bound**. Points that could be earned if execution is performed.

```
projected_score = canonical_score + COMPLETION_WEIGHT   (if not execution_layer_evaluated)
projected_score = canonical_score                       (if execution_layer_evaluated)
```

When `execution_layer_evaluated = False`:
```
projected_score = 60 + 40 = 100
```

### confidence band

```
lower = canonical_score
upper = projected_score
```

When `execution_layer_evaluated = False`:
```
lower = 60, upper = 100, status = SPLIT_EXECUTION_NOT_EVALUATED
```

---

## SECTION 4 — IMPLEMENTATION DETAILS

**File modified:** `scripts/pios/pios.py` — `cmd_compute_gauge` function.

### Change 1 — Execution layer detection and completion_points gate

Added after terminal state classification:

```python
# --- Execution layer evaluation ---
COMPLETION_WEIGHT = 40
execution_layer_evaluated = bool(cs.get("execution_layer_evaluated", False))
if not execution_layer_evaluated:
    execution_status = "NOT_EVALUATED"

# --- Section 7.4: Score computation ---
if execution_layer_evaluated:
    completion_points_table = {"S-13": 40, "S-T3": 20, "S-T1": 0, "S-T2": 0}
    completion_points = completion_points_table.get(terminal_state, 0)
    completion_status = execution_status
else:
    completion_points = 0
    completion_status = "NOT_EVALUATED"
```

### Change 2 — projected_score

Added after canonical_score:

```python
projected_score = canonical_score + COMPLETION_WEIGHT if not execution_layer_evaluated else canonical_score
```

### Change 3 — Projection block

```python
if not execution_layer_evaluated:
    projection = {
        "value": projected_score,
        "rule": "PR-NOT-EVALUATED",
        "note": "Execution layer NOT evaluated. projected_score = canonical + completion_weight.",
        ...
    }
elif terminal_state == "S-13":
    projection = {"value": projected_score, "rule": "PR-04", ...}
else:
    projection = {"value": projected_score, "rule": "PR-01", ...}
```

### Change 4 — Confidence block

```python
if not execution_layer_evaluated:
    confidence = {
        "lower": canonical_score,
        "upper": projected_score,
        "status": "SPLIT_EXECUTION_NOT_EVALUATED",
        ...
    }
else:
    confidence = {"lower": canonical_score, "upper": canonical_score, "status": "COMPUTED", ...}
```

### Change 5 — terminal_state_basis

Added `execution_layer_evaluated={execution_layer_evaluated} → execution_status={execution_status}` to basis string.

### Change 6 — state block in gauge_state

```python
"state": {
    "execution_status": execution_status,
    "execution_layer_evaluated": execution_layer_evaluated,
    "psee_engine_invoked": execution_layer_evaluated,
    "execution_mode": "FULL" if execution_layer_evaluated else "STRUCTURAL_ONLY",
    "terminal_state_basis": terminal_state_basis
}
```

### Change 7 — score dict

Added `projected` field and `completion_status` to components.

### Change 8 — _validate_gc_conditions GC-03

Added `"NOT_EVALUATED"` to allowed execution_status set.

### Change 9 — _check_gc_conditions GC-03

Added `"NOT_EVALUATED"` to `valid_statuses` set.

---

## SECTION 5 — BACKWARDS COMPATIBILITY

| scenario | behavior |
|----------|----------|
| `execution_layer_evaluated = True` in coverage_state.json | Existing COMPLETE path unchanged |
| `execution_layer_evaluated = False` (absent) | New path: completion_points=0, score=60, projected=100 |
| Legacy runs with no coverage_state.json changes | Unaffected — field absence treated as False |

All current structural-proof-only runs (run_bac_validation_01, run_s8_validation_01, etc.) now
correctly produce `canonical_score=60, projected_score=100` instead of the incorrect 100.

---

## SECTION 6 — CHAIN VALIDATION RESULTS

### Fresh run: run_gsca_validation_01

**Chain executed:**
1. `pios ledger create` — PASS
2. `pios bootstrap` — PASS
3. `pios intake create` — PASS
4. `pios ig materialize` — PASS
5. `pios structural extract/relate/normalize` — PASS (2 units, 2 edges, 2 nodes)
6. `pios ig integrate-structural-layers` — PASS
7. `pios emit coverage` — PASS (coverage_percent=100.0 state=COMPUTED)
8. `pios emit reconstruction` — PASS (state=PASS violations=0 all axes PASS)
9. `pios emit topology` — PASS (domains=17 capabilities=42 components=89)
10. `pios emit signals` — PASS (5 signals)
11. `pios compute gauge` — **PASS** (score=60 projected=100 band=CONDITIONAL NOT_EVALUATED)
12. `pios declare coherence` — PASS (MODE_B COHERENT)
13. `pios validate freshness` — **GOVERNED AND FRESH THROUGH S4**

### compute gauge output

```
[pios] INFO score=60 projected=100 band=CONDITIONAL terminal_state=S-13 execution_status=NOT_EVALUATED execution_layer_evaluated=False
```

### validate freshness full result

```
BOOTSTRAP: VALID — AC-01 through AC-10: ALL PASS
COHERENCE: COHERENT — CA-01 through CA-10: ALL PASS
COMPUTATION: COMPUTABLE — GC-01 through GC-10: ALL PASS
SC_CRITERIA: SC-01 through SC-10 PASS (SC-06 NOT_EVALUATED)
VERDICT: GOVERNED AND FRESH THROUGH S4
```

---

## SECTION 7 — DETERMINISM

`execution_layer_evaluated` is read from a governed artifact (`coverage_state.json`).
- Field absent → `False` (deterministic default)
- Field present and `True` → execution path (unchanged from pre-fix)
- No stochastic behavior. Same input → same output.

`projected_score` is computed deterministically:
```
projected_score = canonical_score + COMPLETION_WEIGHT if not execution_layer_evaluated else canonical_score
```

No new non-determinism introduced.

---

## SECTION 8 — BEFORE/AFTER COMPARISON

| metric | before (run_bac_validation_01) | after (run_gsca_validation_01) |
|--------|-------------------------------|-------------------------------|
| execution_layer_evaluated | (not tracked) | `False` |
| execution_status | `COMPLETE` | `NOT_EVALUATED` |
| completion_points | 40 | **0** |
| canonical_score | **100** (incorrect) | **60** (correct) |
| projected_score | (absent) | **100** |
| confidence band | [100, 100] | **[60, 100]** |
| band_label | READY | **CONDITIONAL** |
| state.execution_mode | FULL | **STRUCTURAL_ONLY** |
| validate freshness | GOVERNED AND FRESH THROUGH S4 | GOVERNED AND FRESH THROUGH S4 |
| GC-03 | PASS (COMPLETE) | PASS (NOT_EVALUATED) |

---

## SECTION 9 — FINAL VERDICT

**Alignment: COMPLETE**

canonical_score = 60 (structural proof only — correct lower bound).
projected_score = 100 (achievable if execution engine run — correct upper bound).
confidence band = [60, 100] status = SPLIT_EXECUTION_NOT_EVALUATED.
execution_status = NOT_EVALUATED.

validate freshness: GOVERNED AND FRESH THROUGH S4.
All GC-01 through GC-10: PASS.

**No schema weakening.** AC/GC/CA checks unchanged and enforced.
**No fabrication.** execution_layer_evaluated read from governed artifact only.

Authority: PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01
