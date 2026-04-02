# CE.2 — Architectural Boundary Extraction Report

**Generated:** 2026-04-02
**Branch:** feature/ce2-state-activation-boundary
**Purpose:** Extract the exact architectural boundary that blocks reactive state activation in PiOS v0.1
**Scope:** Analytical only. No proposed logic, no pseudocode, no implementation plan.

---

## 1. WHERE STATE INVARIANCE IS ENFORCED IN CODE

State invariance is enforced in `pios/core/v0.1/engine/activate_conditions.py` within the eight
condition activation functions (`activate_cond_001` through `activate_cond_008`).

Each function contains a hardcoded string literal for `condition_coverage_state`. This literal
is the sole determinant of downstream state propagation. It is not derived from incoming signal
values. It does not evaluate thresholds. It is a constant.

**Cited function examples:**

`activate_cond_001` (line 106–118, `activate_conditions.py`):
```
"condition_coverage_state": "complete",
```

`activate_cond_003` (line 149–161, `activate_conditions.py`):
```
"condition_coverage_state": "partial",
```

`activate_cond_005` (line 185–203, `activate_conditions.py`):
```
"condition_coverage_state": "blocked",
```

All eight functions follow this pattern. The `condition_coverage_state` string is present as a
hardcoded literal in each function body, independent of any input parameter value.

---

## 2. WHICH FUNCTIONS HARDCODE OR FREEZE CONDITION STATE

The following functions in `pios/core/v0.1/engine/activate_conditions.py` hardcode
`condition_coverage_state`:

| Function | Governing Signal | Hardcoded State |
|---|---|---|
| `activate_cond_001` | SIG-002 | "complete" |
| `activate_cond_002` | SIG-004 | "complete" |
| `activate_cond_003` | SIG-001 | "partial" |
| `activate_cond_004` | SIG-005 | "partial" |
| `activate_cond_005` | SIG-003 | "blocked" |
| `activate_cond_006` | SIG-006 | "blocked" |
| `activate_cond_007` | SIG-007 | "partial" |
| `activate_cond_008` | SIG-008 | "partial" |

The `activate_diag` function (lines 280–304, `activate_conditions.py`) maps
`condition_coverage_state` → `diagnosis_activation_state` via the
`CONDITION_TO_DIAGNOSIS_STATE` dictionary (lines 73–77):

```python
CONDITION_TO_DIAGNOSIS_STATE = {
    "complete": "active",
    "partial":  "partial",
    "blocked":  "blocked",
}
```

Because `condition_coverage_state` is hardcoded, `diagnosis_activation_state` is also frozen.
No telemetry perturbation can alter it.

---

## 3. VALUE-REACTIVE VS STATE-INVARIANT FIELDS

**Value-reactive fields** — these change when telemetry input changes:

These fields are derived by passing signal output values directly into condition components:

- `COND-001.components.dependency_load_ratio` — sourced from `SIG-002.output.dependency_load_ratio`
- `COND-001.components.dependency_edge_count` — sourced from `SIG-002.output.dependency_edge_count`
- `COND-004.components.throughput_rate` — sourced from `SIG-005.output.throughput_rate`
- `COND-002.components.*` — sourced from `SIG-004.output.*`
- `COND-007.components.sig_002_dependency_load_component` — sourced from `SIG-007.output`
- `COND-008.components.*` — sourced from `SIG-008.output.*`

Confirmed by CE.2-R01-MIX: COND-001 `dependency_load_ratio` changed 0.682→0.773 in response
to VAR_ST_013 perturbation.

**State-invariant fields** — these do not change regardless of telemetry input:

- `condition_coverage_state` in all COND-001 through COND-008 records
- `diagnosis_activation_state` in all DIAG-001 through DIAG-008 records
- `synthesis_state` in all INTEL-001 through INTEL-008 records (derived downstream)

Confirmed by CE.2-R01-MIX: all 8 diagnosis_activation_states unchanged across baseline
and stress-injected runs.

---

## 4. WHY 40.9 CHANGE CLASSIFICATION IS UNREACHABLE UNDER TELEMETRY-ONLY PERTURBATION

The causal chain from telemetry to 40.9 classification:

```
40.4 telemetry variables
  → 40.5 compute_signals.py: signal output values
    → 40.6 activate_conditions.py: condition components (value-reactive) + condition_coverage_state (hardcoded)
      → 40.6 activate_diag(): diagnosis_activation_state (derived from hardcoded coverage_state)
        → 40.7 synthesize_intelligence.py: synthesis_state (derived from diagnosis_activation_state)
          → 40.8 package_delivery.py: delivery_packet synthesis_state (pass-through)
            → 40.9 feedback_registry.py: compare_entities() compares synthesis_state
```

`feedback_registry.py` line 34: `STATE_FIELD = "synthesis_state"`

`feedback_registry.py` lines 119–125:
```python
if baseline_state == current_state:
    classification = "NO_CHANGE"
else:
    classification = "STATE_CHANGE"
```

`synthesis_state` in the delivery packet is invariant because `diagnosis_activation_state`
at layer 40.6 is invariant. Therefore `baseline_state == current_state` is always true
for every entity, and `STATE_CHANGE` is structurally unreachable through telemetry-only
perturbation under v0.1 engine architecture.

---

## 5. WHY 40.10 DIRECTIVES REMAIN NO_ACTION

`control_surface.py` (lines 38–43) implements a strict one-to-one classification mapping:

```python
CLASSIFICATION_TO_DIRECTIVE = {
    "NO_CHANGE":    "NO_ACTION",
    "STATE_CHANGE": "REVIEW_REQUIRED",
    "ADDED":        "REGISTER_ENTITY",
    "REMOVED":      "DEREGISTER_ENTITY",
}
```

`control_surface.py` `build_directive` function (lines 133–154): each 40.9 signal is
translated to exactly one directive with no additional logic. When all 40.9 classifications
are NO_CHANGE, all 40.10 directives are NO_ACTION. `REVIEW_REQUIRED`, `REGISTER_ENTITY`,
and `DEREGISTER_ENTITY` are reachable only if 40.9 produces non-NO_CHANGE classifications.

40.10 is a passthrough translator. The state blockage does not originate here.

---

## 6. EXACT LAYER BOUNDARY CE.2 MUST ADDRESS

The reactive state activation failure originates at one precise boundary:

**40.5 → 40.6**

Specifically: the transition from signal output values (40.5) to condition coverage state (40.6).

In v0.1, `activate_cond_001` through `activate_cond_008` receive signal output values
as arguments, use those values to populate `components`, but hardcode `condition_coverage_state`
as a string literal that does not evaluate those values.

The boundary can be stated precisely:

> In `pios/core/v0.1/engine/activate_conditions.py`, the `activate_cond_*` functions
> accept signal output values but do not evaluate them when determining
> `condition_coverage_state`. The state is hardcoded. Reactive state activation
> requires that `condition_coverage_state` be derived from signal values, not hardcoded.

The downstream consequences (40.6 → 40.9 invariance, 40.9 → 40.10 NO_ACTION) are
cascading effects of this single boundary. No other layer contributes independently
to the blockage.

**SIG-003 secondary factor:**

`compute_signals.py` `compute_sig_003` (lines 134–160) returns `state: "BLOCKED"` via two branches:
- Branch 1 (line 140): `VAR_AT_001 is None or VAR_AT_002 is None` → BLOCKED with blocking_inputs
- Branch 2 (lines 154–160): `VAR_AT_001` and `VAR_AT_002` are non-null → BLOCKED with no output, no computation

Branch 2 carries a code comment on line 153: "Unreachable in static context; both AT-001 and AT-002 are PENDING."
Even when non-null values are injected (as in CE.2-R01-MIX EVENT 3), SIG-003 returns BLOCKED.
This is a secondary invariance source that would block COND-005 and DIAG-005 activation independently
of the 40.6 coverage_state issue.

---

## BOUNDARY SUMMARY

| Layer | Boundary Type | Function(s) | File |
|---|---|---|---|
| 40.5 → 40.6 (primary) | State invariance | `activate_cond_001` to `activate_cond_008` | `activate_conditions.py` |
| 40.5 (SIG-003) | Signal-level block | `compute_sig_003` | `compute_signals.py` |
| 40.6 → 40.9 | Downstream consequence | `activate_diag`, `compare_entities` | `activate_conditions.py`, `feedback_registry.py` |
| 40.9 → 40.10 | Passthrough translation | `build_directive` | `control_surface.py` |

**Primary boundary for CE.2 to address:**
The hardcoded `condition_coverage_state` literals in `activate_cond_*` functions in
`pios/core/v0.1/engine/activate_conditions.py`.

This report is analytical only. No formula, threshold, state rule, or implementation
detail is proposed herein.
