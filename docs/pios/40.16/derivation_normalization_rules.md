# Derivation Normalization Rules

Stream: 40.16 — Derivation Specification (ESI / RAG)
Artifact: 4 of 7
Date: 2026-03-31
Authority: docs/pios/40.4/ | docs/governance/architecture/canonical-layer-model.md
Layer: L3 — Derivation

---

## Purpose

This artifact defines the normalization rules that govern how raw telemetry class values are transformed into inputs suitable for the ESI and RAG derivation computations. Normalization occurs at the boundary between L2 (normalized telemetry) and L3 (derivation). All normalization must preserve the determinism and source-agnosticism guarantees of the 40.16 derivation specifications.

---

## Normalization Principles

**NR-01 — Determinism:** Normalization functions must be pure. Given identical inputs, they must produce identical outputs. No runtime-dependent behavior, timestamps, or system state may enter a normalization function.

**NR-02 — Range enforcement:** All normalization produces values in [0.0, 1.0] for ESI inputs and [-1.0, +1.0] for RAG components. Values outside these ranges are clamped, not rejected.

**NR-03 — Missing value handling:** Missing telemetry class values are propagated as UNDEFINED through normalization. Normalization does not substitute default values. An UNDEFINED input produces an UNDEFINED output, which triggers PARTIAL mode in the downstream computation.

**NR-04 — Constant isolation:** Program constants (F_expected, L_target, L_max, etc.) are injected at the normalization boundary. They must not be hardcoded within normalization functions. Each normalization function receives its constants as explicit parameters.

**NR-05 — No cross-signal contamination:** Normalization of TC-01 must not read TC-02 values. Each TC normalization function is independent. Composite behavior is the exclusive domain of the derivation layer (PES computation and ESI/RAG formula).

**NR-06 — Layer boundary enforcement:** Normalization operates on TC-class values produced by L2. It does not read from raw source systems. If a TC value is not available from L2, the normalization layer reports UNDEFINED and proceeds. It does not fall back to raw source reads.

---

## Normalization Functions by Telemetry Class

### NF-01: TC-01 (Execution Cadence) → frequency_component

**Input:** `F_observed` (float, count per window), `F_expected` (float, program constant)

**Function:**
```
frequency_component = min(1.0, F_observed / F_expected)
```

**Edge cases:**
- `F_observed = 0`: frequency_component = 0.0
- `F_expected = 0`: UNDEFINED — log ERROR; F_expected = 0 is an invalid program constant
- `F_observed > F_expected`: frequency_component = 1.0 (excess cadence does not improve score)

**Output range:** [0.0, 1.0]

---

### NF-02: TC-07 (Activity Regularity) → stability_component

**Input:** `variance_observed` (float, σ²), `sigma_max` (float, program constant)

**Function:**
```
stability_component = max(0.0, 1.0 - (variance_observed / sigma_max))
```

**Edge cases:**
- `variance_observed = 0`: stability_component = 1.0 (perfect regularity)
- `variance_observed ≥ sigma_max`: stability_component = 0.0
- `sigma_max = 0`: UNDEFINED — log ERROR; sigma_max = 0 is an invalid program constant
- Fewer than 3 observations available (N < 3): stability_component = 0.5 (neutral); log WARN

**Output range:** [0.0, 1.0]

---

### NF-03: TC-02 (Pipeline Completion Rate) → completion_rate

**Input:** `runs_completed` (int, count), `runs_total` (int, count)

**Function:**
```
completion_rate = runs_completed / runs_total
```

**Edge cases:**
- `runs_total = 0`: completion_rate = 0.0; log WARN (no runs attempted is treated as no completions, not as undefined)
- `runs_completed > runs_total`: INVALID input — log ERROR; clamp completion_rate = 1.0

**Output range:** [0.0, 1.0]

---

### NF-04: TC-03 (Artifact Delivery Completeness) → artifact_ratio

**Input:** `artifacts_delivered` (int, sum of DT-001 and DT-003 counts), `artifacts_expected` (int, program constant)

**Function:**
```
artifact_ratio = min(1.0, artifacts_delivered / artifacts_expected)
```

**Edge cases:**
- `artifacts_delivered = 0`: artifact_ratio = 0.0
- `artifacts_expected = 0`: UNDEFINED — log ERROR; expected artifact count of 0 is invalid
- `artifacts_delivered > artifacts_expected`: artifact_ratio = 1.0 (surplus does not improve score)

**Default value for `artifacts_expected`:** 9 (4 intelligence output artifacts from DT-001 + 5 reconstruction artifacts from DT-003, per 40.4 catalog)

**Output range:** [0.0, 1.0]

---

### NF-05: TC-04 (Delivery Velocity) → latency_normalized

**Input:** `L_observed` (float, minutes), `L_target` (float, minutes, program constant), `L_max` (float, minutes, program constant)

**Function:**
```
If L_max = L_target:
    L_max = L_target + 1    [prevent division by zero; log WARN]

raw = (L_observed - L_target) / (L_max - L_target)
latency_normalized = max(0.0, min(1.0, 1.0 - raw))
```

**Edge cases:**
- `L_observed ≤ L_target`: latency_normalized = 1.0
- `L_observed ≥ L_max`: latency_normalized = 0.0
- `L_observed < 0`: INVALID — log ERROR; clamp L_observed = 0

**Output range:** [0.0, 1.0]

---

### NF-06: TC-05 (Validation Gate Rate) → gate_rate

**Input:** `gates_enforced` (int, count), `gates_defined` (int, program constant)

**Function:**
```
gate_rate = min(1.0, gates_enforced / gates_defined)
```

**Edge cases:**
- `gates_defined = 0`: gate_rate = 1.0 (no gates defined = no violations possible); log WARN (governance gap indicator)
- `gates_enforced > gates_defined`: gate_rate = 1.0

**Output range:** [0.0, 1.0]

---

### NF-07: TC-08 (Feedback Loop Activation) → feedback_rate

**Input:** `feedback_events` (int, count; sum of AT-009 and DT-008 values), `feedback_expected` (int, program constant)

**Function:**
```
feedback_rate = min(1.0, feedback_events / feedback_expected)
```

**Edge cases:**
- `feedback_expected = 0`: feedback_rate = 1.0; log WARN
- `feedback_events = 0`: feedback_rate = 0.0

**Output range:** [0.0, 1.0]

---

## RAG-Specific Normalization

### NF-RAG-01: Rate normalization

**Input:** `RAG_rate_raw` (float, mean rate of change per window), `rate_denominator` (float)

**Denominator selection (in order of preference):**
1. Maximum observed |rate_i| across all signals in all prior windows (preferred — data-grounded)
2. Theoretical maximum: `1.0 / window_duration` (used when no historical reference exists)

**Function:**
```
RAG_rate = max(-1.0, min(1.0, RAG_rate_raw / rate_denominator))
```

**Edge cases:**
- `rate_denominator = 0`: UNDEFINED — log ERROR
- First computation (no historical reference): use theoretical maximum; log WARN "Using theoretical normalization denominator — insufficient history"

**Output range:** [-1.0, +1.0]

---

### NF-RAG-02: Acceleration normalization

Same pattern as NF-RAG-01, applied to second-order derivative values.

**When fewer than 3 windows available:** RAG_accel = 0.0 (neutral); log WARN.

**Output range:** [-1.0, +1.0]

---

### NF-RAG-03: Cross-boundary propagation normalization

Propagation_fraction is already bounded [0.0, 1.0] by construction. No further normalization required.

**Function:**
```
If propagation_fraction > 0.5:
    RAG_cross = -(propagation_fraction)
Else:
    RAG_cross = +(1.0 - propagation_fraction)
```

**Output range:** [-1.0, +1.0]

---

## Normalization Execution Order

Normalization must execute in the following sequence to maintain layer boundary integrity:

1. Collect all TC-class values from L2 (or mark UNDEFINED if not available)
2. Validate all program constants (reject UNDEFINED or zero-denominator constants; log ERROR)
3. Apply NF-01 through NF-07 for each TC in order
4. Pass normalized outputs to PES computation layer (esi_derivation_specification.md)
5. After PES computation, apply NF-RAG-01 through NF-RAG-03 for RAG components
6. Record all intermediate normalized values in the derivation manifest (traceability requirement)

---

## Clamping vs. Rejection Policy

| Condition | Policy |
|-----------|--------|
| Value outside expected range due to excess delivery/cadence | CLAMP to maximum; do not reject |
| Value outside expected range due to program constant error | LOG ERROR; treat as UNDEFINED |
| Missing TC value | UNDEFINED; propagate; trigger PARTIAL mode |
| Invalid constant (zero denominator, negative) | LOG ERROR; do not proceed with that signal |
| Temporal window sequence violation (out of order) | LOG ERROR; reject that window pair for RAG |

Clamping is always directionally conservative: excess performance does not inflate scores beyond 1.0. Shortfalls are not softened.
