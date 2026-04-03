# PiOS v0.4 — Executable Certification

**Certification type:** EXECUTABLE-PROVEN
**Date:** 2026-04-03
**Certifying stream:** CE.10 / CE.10C
**Branch:** pios-governance-baseline-v0.4
**Engine:** `pios/core/v0.1/engine/` (post-CE.10)

---

## CERTIFICATION STATEMENT

PiOS v0.4 is **executable-proven** as of CE.10 closure.

PiOS v0.4 was previously **governance-defined only**. The governance contracts (CE.4, CE.5)
were authoritative, but the engine at `pios/core/v0.1/engine/` did not implement the governed
model. CE.6 established this formally. CE.7, CE.8, CE.9, and CE.10 constituted the bounded
remediation path that closed all 18 identified gaps and upgraded the executable status.

---

## CERTIFICATION BASIS

PiOS v0.4 is certified executable-proven on the following evidence:

### Emission — PASS

The engine at `pios/core/v0.1/engine/compute_signals.py` (post-CE.8) satisfies CE.4 INV-001
through INV-007 and §3.3 for all 8 governed signals (SIG-001..SIG-008):

- COMPLETE signals: non-null output, all fields resolved, `traceability` present (INV-001, INV-006)
- PARTIAL signals: non-null output, `partiality_reasons` present for every null field with
  governed `failure_class` (INV-002, INV-005)
- BLOCKED signals: `output` = null, `blocking_class`, `blocking_inputs`, `blocking_reason`
  present (INV-003, INV-004)
- No `note` field in any signal (§3.3)

### Consumption — PASS

The engine at `pios/core/v0.1/engine/activate_conditions.py` (post-CE.8) satisfies CE.5
consumption state model and rules:

- CE.5 vocabulary (AVAILABLE/PARTIAL/BLOCKED) in use; COMPLETE→AVAILABLE implemented (CSM-1, C-001)
- CE.5 consumption record `{signal_id, origin: "CE.4", consumption_state, output_ref}` produced
  per governed signal (PBE-2)
- No null field substitution for PARTIAL signals (C-002)
- No field extraction from BLOCKED signals (C-003)
- No modification of signal records prior to consumption (PBE-1)

### Propagation — PASS

The engine (post-CE.10) satisfies CE.2 DEC-009 and DEC-014:

- DEC-009 per-condition-instance tier derivation implemented via `derive_condition_tier()`
- All 8 `condition_coverage_state` values ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE}
- DEC-014 governing mapping applied: BLOCKED→BLOCKED, DEGRADED→ACTIVE, AT_RISK→ACTIVE,
  STABLE→INACTIVE
- No cross-condition coupling; no aggregation; no intermediate transformation layer (DEC-006,
  DEC-007, DEC-011)

### Traceability — PASS

The engine satisfies CE.4 INV-006 and CE.5 T-001/T-002:

- CE.5 Type 1 consumption records produced for all 8 present governed signals (T-002)
- CE.5 Type 2 structural gap trace records produced for any absent governed signal (T-001)
- Record count equals governed signal count; no signal disappears silently
- `partiality_reasons` present for all null fields in PARTIAL signals; `traceability_coverage`
  criterion satisfied (INV-006)

---

## CERTIFICATION SCOPE

This certification applies to:

- **Governance layer:** PiOS v0.4 (CE.5 Signal Consumption & Propagation Contract, and all
  antecedent layers CE.2/CE.4)
- **Engine:** `pios/core/v0.1/engine/` at branch `pios-governance-baseline-v0.4` post-CE.10
  commit
- **Signal set:** SIG-001..SIG-008 as defined in the PiOS v0.4 Signal Ledger
- **Validated context:** Static 40.4 telemetry baseline (STATIC_VARIABLES in `compute_signals.py`)

---

## WHAT THIS CERTIFICATION DOES NOT MEAN

This certification does not assert:

1. **Certification of live pipeline telemetry.** The static 40.4 baseline produces all
   non-BLOCKED conditions at their threshold values (STABLE tier). Live telemetry will produce
   different signal values and therefore different tier outcomes. Certification covers the
   engine logic, not any specific runtime outcome.

2. **Certification of layers beyond PiOS v0.4.** Layers 40.7 (intelligence synthesis), 40.8
   (delivery), 40.9 (feedback), 40.10 (control), 40.11 (loop closure) are governed under CE.2
   (PiOS v0.2). Those layers are certified under CE.2's QA.1–QA.4 campaign, not this stream.

3. **Certification of the DEC-009 extended binding configuration.** The baseline 8-row binding
   surface governs the certified behavior. Extended binding configurations (e.g., QA.2's 11-row
   table with multi-signal conflict rows) are not part of the certified engine state.

4. **Certification of DEC-012/DEC-013 binding rule thresholds against live program data.**
   Thresholds (0.682, 1.273, 0.875, 1.125) are derived from the static 40.4 telemetry baseline.
   These represent at-baseline reference values. Threshold governance under different telemetry
   contexts is not within the scope of this certification.

5. **Version promotion.** This certification does not merge `pios-governance-baseline-v0.4`
   to any canonical branch, does not increment any version number, and does not supersede
   CE.2 as the certified baseline for layers 40.6–40.11.

---

## GOVERNANCE STACK STATUS (POST-CE.10)

| PiOS Version | Governing Stream | Layer | Status |
|---|---|---|---|
| PiOS v0.2 | CE.2 | 40.6 → 40.11 | EXECUTABLE-PROVEN (QA.1–QA.4, CE.2 certified baseline) |
| PiOS v0.3 | CE.4 | 40.5 signal emission | EXECUTABLE-PROVEN (CE.10 closes CE.4 emission gaps) |
| **PiOS v0.4** | **CE.5** | **40.5 → 40.6 consumption handoff** | **EXECUTABLE-PROVEN (CE.10)** |
