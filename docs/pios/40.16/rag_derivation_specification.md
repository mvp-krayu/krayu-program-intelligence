# RAG Derivation Specification

Stream: 40.16 — Derivation Specification (ESI / RAG)
Artifact: 3 of 7
Date: 2026-03-31
Authority: docs/pios/40.4/ | docs/pios/40.3/ | docs/governance/architecture/
Layer: L3 — Derivation
Coverage Mode: PARTIAL (inherits CG-01 from ESI; PES-ESI-02 undefined)

---

## Purpose

Formal derivation specification for the Risk Acceleration Gradient (RAG) at the L3 canonical derivation layer. Defines how PES signals from the ESI derivation are used to compute rate-of-change, acceleration, and cross-boundary propagation of risk. Produces the RAG composite score (-100 to +100).

RAG is a dynamic risk measurement. Where ESI answers "Where is the program right now?", RAG answers "How fast is the program moving — and in which direction?"

This specification is the canonical L3 derivation authority for RAG. The SSZ analogue in the architecture documents (pios_architecture_whitepaper.md, marked provisional, DRIFT-001) is the architectural grounding source. This document resolves the derivation gap for the RAG construct.

---

## RAG Definition

**Risk Acceleration Gradient (RAG)** is a dynamic risk measurement model. It captures how execution risk evolves over time — measuring rate of change, acceleration, and cross-boundary propagation of risk within a program environment.

RAG is not a stability measure. It is a dynamics measure. A program can have a low ESI (unstable) but a positive RAG (improving). A program can have a high ESI (stable) but a negative RAG (deteriorating). Both dimensions are required for complete program intelligence.

**Sign convention:**
- Positive RAG: program is improving (risk is decreasing, stability is increasing)
- Negative RAG: program is degrading (risk is increasing, stability is decreasing)
- RAG = 0: no net directional change detected across the measurement window

---

## Temporal Prerequisites

RAG requires temporal observations. The following minimum conditions must be met before a RAG score can be computed:

- **Minimum windows (W_min):** 2 consecutive measurement windows. RAG cannot be computed from a single observation.
- **Window consistency:** All windows must use the same duration. Cross-window comparisons using windows of different durations are invalid.
- **PES availability:** RAG is computed from PES-ESI-01 through PES-ESI-05 observations. For PARTIAL mode (PES-ESI-02 undefined), RAG uses the four defined PES signals. The same PARTIAL mode constraint applies as in the ESI specification.

If fewer than 2 windows are available, RAG output is UNDEFINED. The derivation manifest must record `rag_status: INSUFFICIENT_WINDOWS`.

---

## RAG Component Definitions

RAG is composed of three structural components:

### Component 1 — Rate of Change (RAG_rate)

**Definition:** The net directional movement of each PES signal across one window interval, averaged across all defined signals.

**Computation:**

```
For each defined PES signal i (i ∈ {01, 03, 04, 05} in PARTIAL mode; {01, 02, 03, 04, 05} in FULL mode):

    rate_i = (PES_i(W_n) - PES_i(W_{n-1})) / window_duration

    where:
        PES_i(W_n)     = PES signal i value in current window
        PES_i(W_{n-1}) = PES signal i value in prior window
        window_duration = time in days between window midpoints (or standardized unit)

RAG_rate_raw = mean(rate_i for all defined i)
```

**Sign:** Positive rate_i indicates the signal improved (moving toward 1.0). Negative indicates degradation.

**Normalization:** RAG_rate_raw is normalized to [-1.0, +1.0] by dividing by the maximum observed rate across the historical window set. If no historical reference exists (first computation), use the theoretical maximum rate change per window (±1.0 / window_duration) as the normalization denominator.

```
RAG_rate = RAG_rate_raw / rate_normalization_denominator
RAG_rate = max(-1.0, min(1.0, RAG_rate))
```

---

### Component 2 — Acceleration of Risk (RAG_accel)

**Definition:** The second-order derivative of PES signal movement — the rate at which the rate of change is itself changing. Requires a minimum of 3 windows.

**Computation:**

```
For each defined PES signal i:

    rate_i(W_n)     = (PES_i(W_n)   - PES_i(W_{n-1})) / window_duration
    rate_i(W_{n-1}) = (PES_i(W_{n-1}) - PES_i(W_{n-2})) / window_duration

    accel_i = (rate_i(W_n) - rate_i(W_{n-1})) / window_duration

RAG_accel_raw = mean(accel_i for all defined i)
```

**Boundary condition — insufficient windows for acceleration:**

If only 2 windows are available (W_min = 2), acceleration cannot be computed.

```
If N_windows < 3:
    RAG_accel = 0.0
    log WARN in manifest: "RAG_accel set to neutral (0.0); fewer than 3 windows available"
```

**Normalization:** Same normalization pattern as RAG_rate; divide by theoretical maximum second-order change. Cap at [-1.0, +1.0].

---

### Component 3 — Cross-Boundary Propagation (RAG_cross)

**Definition:** Measures the degree to which degradation in one PES signal is correlated with degradation in at least one other PES signal in the same window. Captures systemic versus isolated risk.

**Computation:**

```
For the current window W_n, identify all PES signals with negative rate_i (rate_i < 0):

    degrading_signals = count of PES signals where rate_i < 0
    defined_signals   = count of defined PES signals

propagation_fraction = degrading_signals / defined_signals

If propagation_fraction > 0.5:
    RAG_cross = -(propagation_fraction)    [negative: degradation is propagating across signals]
Else:
    RAG_cross = +(1.0 - propagation_fraction)    [positive: degradation is isolated, program is mostly improving]
```

**Rationale:** RAG_cross is not a signal correlation test (which would require time-series of correlations). It is a window-level count of co-degrading signals. If more than half of defined signals are degrading simultaneously, the interpretation is systemic — cross-boundary propagation. If fewer than half are degrading, the interpretation is isolated.

**Output range:** [-1.0, +1.0]

---

## RAG Composite Formula

### Full Mode (PES-ESI-02 defined)

```
RAG = (
    (0.50 × RAG_rate) +
    (0.30 × RAG_accel) +
    (0.20 × RAG_cross)
) × 100
```

**Output range:** [-100, +100]

**Weight rationale:**
- RAG_rate carries highest weight (0.50): the primary question RAG answers is directional — is the program improving or degrading?
- RAG_accel carries second weight (0.30): acceleration indicates whether the trajectory is stable or itself changing — a degrading program accelerating toward collapse is qualitatively different from a degrading program stabilizing
- RAG_cross carries lowest weight (0.20): cross-boundary propagation is a contextual risk multiplier, not the primary signal

---

### PARTIAL Mode (PES-ESI-02 undefined)

When PES-ESI-02 is undefined, RAG components are computed from the four defined PES signals (PES-ESI-01, 03, 04, 05). The composite formula weights are unchanged (they weight the components, not the individual PES signals). PARTIAL mode affects component _inputs_ only.

```
RAG_PARTIAL = (
    (0.50 × RAG_rate[from 4 signals]) +
    (0.30 × RAG_accel[from 4 signals]) +
    (0.20 × RAG_cross[from 4 signals])
) × 100
```

**Manifest requirement:** Any RAG score produced in PARTIAL mode MUST be tagged `coverage_mode: PARTIAL` and MUST record `undefined_signals: [PES-ESI-02]`.

---

## Interpretation Reference

| Score Range | Label | Meaning |
|-------------|-------|---------|
| +50 to +100 | Strongly Improving | Program is accelerating toward stability |
| +20 to +49 | Improving | Program is moving toward stability |
| -19 to +19 | Neutral / Stable | No significant directional change |
| -20 to -49 | Degrading | Program is moving away from stability |
| -50 to -100 | Strongly Degrading | Program is accelerating away from stability |

Interpretation is a governance-layer function. The derivation layer produces the score only.

---

## RAG and ESI: Relationship Constraints

1. RAG is derived from PES signals, which are themselves intermediate products of the ESI derivation. RAG does not re-read raw telemetry — it consumes PES outputs.

2. An ESI score is required before RAG can be computed for the same window. RAG cannot be computed independently of ESI.

3. The PARTIAL mode status of ESI propagates to RAG automatically. RAG cannot be in FULL mode if ESI is in PARTIAL mode.

4. RAG is cross-classified as both a standalone L1 entity under program_intelligence AND as the fifth named dimension of ESI (structural fact XL-04, documented in derivative_entity_graph_map.md). At the L3 derivation layer, this cross-classification means:
   - RAG is computed as a standalone output signal (this specification)
   - The PES-ESI-01 through PES-ESI-05 input signals from the ESI derivation are also the inputs that ESI records as its fifth dimension output (risk_acceleration_gradient dimension) — the same computation, reported in two graph positions

   This is not a duplication. The same derivation produces one artifact consumed by two graph nodes.

---

## Derivation Constraints

1. **Determinism:** Given identical PES inputs, identical window sequences, and identical program constants, RAG MUST produce an identical score. No stochastic elements permitted.

2. **Temporal ordering:** Window sequence must be chronologically ordered. W_{n-1} must precede W_n. Out-of-order windows must be rejected; log ERROR in manifest.

3. **No imputation:** Missing PES signal values must not be imputed. If a PES signal was computed as UNDEFINED in a given window, that window cannot be used for RAG computation for that signal.

4. **Normalization independence:** RAG normalization denominators must be derived from observed data or theoretical maxima. They must not be tuned to produce aesthetically preferred score ranges.

5. **Window duration consistency:** All windows in a RAG computation sequence must use the same duration. The derivation does not support mixed-duration window sets.
