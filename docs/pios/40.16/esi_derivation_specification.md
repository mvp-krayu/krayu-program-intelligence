# ESI Derivation Specification

Stream: 40.16 — Derivation Specification (ESI / RAG)
Artifact: 2 of 7
Date: 2026-03-31
Authority: docs/pios/40.4/ | docs/pios/40.3/ | docs/governance/architecture/
Layer: L3 — Derivation
Coverage Mode: PARTIAL (CG-01: Cost Pressure Signal undefined)

---

## Purpose

Formal derivation specification for the Execution Stability Index (ESI) at the L3 canonical derivation layer. Defines five Primary Execution Signals (PES-ESI-01 through PES-ESI-05), their computation from Telemetry Requirement Classes, and the composite formula that produces the ESI score (0–100).

This specification corrects DRIFT-001: ESI-equivalent computation currently executes at L6 (utils/ssz.js, ExecLens runtime). This document constitutes the canonical L3 derivation authority. L6 computation must be re-grounded to this specification.

---

## ESI Definition

**Execution Stability Index (ESI)** is a composite structural stability indicator. It converts multi-dimensional execution signals into a single 0–100 score measuring whether a program is stable, degrading, or approaching systemic risk.

ESI answers: "Where is the program right now?"

ESI is not a diagnostic tool. It measures state, not cause. Score interpretation is a governance function above the derivation layer.

---

## Primary Execution Signal Registry

### PES-ESI-01 — Schedule Regularity Signal

**Definition:** Measures how consistently the program executes on its expected cadence over a defined time window.

**Input telemetry classes:** TC-01 (Execution Cadence), TC-07 (Activity Regularity)

**Computation:**

```
Let F(t)       = observed trigger frequency in current window (from TC-01)
Let F_expected = expected trigger frequency (program constant, defined per program instance)
Let σ²         = variance of F(t) across N prior windows (from TC-07, N ≥ 3)
Let σ_max      = maximum acceptable variance (program constant, defined per program instance)

frequency_component = min(1.0, F(t) / F_expected)
stability_component = max(0.0, 1.0 - (σ² / σ_max))

PES-ESI-01 = (0.6 × frequency_component) + (0.4 × stability_component)
```

**Output range:** [0.0, 1.0]

**Boundary conditions:**
- If F(t) = 0: frequency_component = 0; PES-ESI-01 driven entirely by stability_component residual
- If N < 3 (insufficient windows for variance): stability_component = 0.5 (neutral); log WARN in manifest
- If σ² > σ_max: stability_component = 0.0

**Coverage status:** COVERED

---

### PES-ESI-02 — Cost Pressure Signal

**Definition:** Measures the degree to which program execution is consuming budget within expected parameters.

**Input telemetry classes:** TC-09 (Cost/Budget Execution) — NOT DEFINED in 40.4

**Computation:** UNDEFINED

**Output:** UNDEFINED — no 40.4 telemetry maps to cost or budget execution. See CG-01 in derivation_input_matrix.md.

**ESI impact:** When PES-ESI-02 is UNDEFINED, ESI enters PARTIAL mode. The composite formula renormalizes weights across the four remaining signals. See §ESI Composite Formula — PARTIAL Mode below.

**Coverage status:** NOT COVERED — CG-01 open

---

### PES-ESI-03 — Delivery Completeness Signal

**Definition:** Measures the degree to which the program successfully completes its pipeline runs and delivers the expected artifact set.

**Input telemetry classes:** TC-02 (Pipeline Completion Rate), TC-03 (Artifact Delivery Completeness)

**Computation:**

```
Let runs_completed = count of successful pipeline runs in current window (from TC-02)
Let runs_total     = count of total pipeline runs attempted in current window (from TC-02)
Let artifacts_delivered = count of artifact types delivered in current run (DT-001 + DT-003, from TC-03)
Let artifacts_expected  = total expected artifact types (program constant; default: 9 from 40.4 catalog)

completion_rate = runs_completed / runs_total        [undefined if runs_total = 0]
artifact_ratio  = artifacts_delivered / artifacts_expected

PES-ESI-03 = (completion_rate + artifact_ratio) / 2
```

**Output range:** [0.0, 1.0]

**Boundary conditions:**
- If runs_total = 0: completion_rate = 0; log WARN in manifest
- If artifact_ratio > 1.0: cap at 1.0 (unexpected artifact surplus does not improve score)

**Coverage status:** COVERED

---

### PES-ESI-04 — Flow Compression Signal

**Definition:** Measures the degree to which the program's end-to-end execution latency is within acceptable bounds, and whether throughput is maintained.

**Input telemetry classes:** TC-04 (Delivery Velocity)

**Computation:**

```
Let L(t)     = observed push-to-delivery latency in current run, minutes (from TC-04)
Let L_target = target latency, minutes (program constant, defined per program instance)
Let L_max    = maximum acceptable latency, minutes (program constant, defined per program instance)

latency_normalized = max(0.0, 1.0 - ((L(t) - L_target) / (L_max - L_target)))
latency_normalized = min(1.0, latency_normalized)

PES-ESI-04 = latency_normalized
```

**Output range:** [0.0, 1.0]

**Boundary conditions:**
- If L(t) ≤ L_target: latency_normalized = 1.0 (fully within target)
- If L(t) ≥ L_max: latency_normalized = 0.0 (at or beyond maximum)
- If L_max = L_target: treat as L_max = L_target + 1 to avoid division by zero; log WARN in manifest

**Notes on throughput:** The 40.4 catalog does not define a throughput-per-time-unit metric for program execution. PES-ESI-04 is therefore derived from TC-04 (latency) alone. A future TC-04b (Throughput Rate) could expand this signal. The formula slot (latency_normalized + throughput_fraction) / 2 is reserved but throughput_fraction defaults to latency_normalized when undefined, yielding the formula above.

**Coverage status:** COVERED (latency component only; throughput component deferred)

---

### PES-ESI-05 — Governance Integrity Signal

**Definition:** Measures the degree to which the program's governance mechanisms — validation gates and feedback loops — are actively enforced.

**Input telemetry classes:** TC-05 (Validation Gate Rate), TC-08 (Feedback Loop Activation)

**Computation:**

```
Let gates_enforced = count of validation gates enforced in current run (from TC-05)
Let gates_defined  = count of validation gates defined in the pipeline architecture (program constant)
Let feedback_events = count of feedback routing + delivery events in current run (from TC-08)
Let feedback_expected = count of expected feedback events per run (program constant)

gate_rate     = gates_enforced / gates_defined          [undefined if gates_defined = 0]
feedback_rate = min(1.0, feedback_events / feedback_expected)

PES-ESI-05 = (gate_rate + feedback_rate) / 2
```

**Output range:** [0.0, 1.0]

**Boundary conditions:**
- If gates_defined = 0: gate_rate = 1.0 (no gates = no gate violations); log WARN in manifest — absence of gates may indicate governance gap, not integrity
- If feedback_expected = 0: feedback_rate = 1.0; log WARN

**Coverage status:** COVERED

---

## ESI Composite Formula

### Full Mode (all 5 PES signals available)

```
ESI = (
    (0.25 × PES-ESI-01) +
    (0.20 × PES-ESI-02) +
    (0.25 × PES-ESI-03) +
    (0.20 × PES-ESI-04) +
    (0.10 × PES-ESI-05)
) × 100
```

**Weight rationale:**
- PES-ESI-01 and PES-ESI-03 carry equal highest weight (0.25 each): schedule regularity and delivery completeness are the primary execution health indicators
- PES-ESI-02 and PES-ESI-04 carry equal second weight (0.20 each): cost pressure and flow compression are structural risk dimensions
- PES-ESI-05 carries lowest weight (0.10): governance integrity is a structural prerequisite, not a performance dimension — its absence is captured in other signals

**Output range:** [0, 100]

---

### PARTIAL Mode (PES-ESI-02 undefined — CG-01)

When PES-ESI-02 is UNDEFINED, its weight (0.20) is redistributed proportionally across the four defined signals:

```
Total defined weight = 0.25 + 0.25 + 0.20 + 0.10 = 0.80
Renormalization factor = 1.0 / 0.80 = 1.25

ESI_PARTIAL = (
    (0.3125 × PES-ESI-01) +
    (0.3125 × PES-ESI-03) +
    (0.2500 × PES-ESI-04) +
    (0.1250 × PES-ESI-05)
) × 100
```

**Manifest requirement:** Any ESI score produced in PARTIAL mode MUST be tagged `coverage_mode: PARTIAL` and MUST record `undefined_signals: [PES-ESI-02]` in the derivation run manifest.

**Interpretation constraint:** PARTIAL mode ESI scores are structurally incomparable to full-mode ESI scores. Cross-run comparison requires that coverage_mode is identical for both runs. Governance consumers must not compare PARTIAL scores against full-mode historical baselines without explicit adjustment.

---

## Score Interpretation Bands

Score interpretation is a governance-layer function and is documented here for reference only. Derivation produces the score; the governance layer assigns meaning.

| Score Range | Label | Governance Implication |
|-------------|-------|----------------------|
| 80–100 | Stable | Normal operating range |
| 60–79 | Degrading | Elevated monitoring warranted |
| 40–59 | Under Pressure | Active governance intervention required |
| 20–39 | High Risk | Escalation threshold |
| 0–19 | Critical | Systemic risk — executive visibility required |

---

## Derivation Constants (Per Program Instance)

The following constants must be defined per program instance. They are not hardcoded in the derivation specification:

| Constant | Description | Source |
|----------|-------------|--------|
| F_expected | Expected trigger frequency per window | Program execution schedule |
| σ_max | Maximum acceptable cadence variance | Program governance baseline |
| artifacts_expected | Total expected artifact types per run | 40.4 catalog (default: 9) |
| L_target | Target end-to-end delivery latency, minutes | Program SLA |
| L_max | Maximum acceptable delivery latency, minutes | Program SLA |
| gates_defined | Count of pipeline validation gates | Pipeline architecture definition |
| feedback_expected | Expected feedback events per run | Program feedback model |

---

## Derivation Constraints

1. **Determinism:** Given identical TC inputs and identical program constants, ESI MUST produce an identical score. No stochastic elements are permitted at the derivation layer.

2. **Layer boundary:** ESI derivation operates at L3. It consumes TC inputs from L2 (normalized telemetry). It does not read from raw source systems directly.

3. **No simulation:** When a TC input is missing, the signal is UNDEFINED. No default values or estimated replacements are used to simulate completeness. PARTIAL mode is the only permitted response to missing inputs.

4. **Traceability:** Every ESI score must be traceable to specific TC observations, window boundaries, and program constant values used in that computation. See derivation_traceability_map.md.

5. **No cross-run smoothing:** ESI is a point-in-time measurement. Rolling averages or smoothed scores are a presentation-layer concern (L5), not a derivation-layer output.
