# EX.H1 — Runtime Binding Rules

**Stream:** EX.H1 — Execution Handover (CE → EX Transition)
**Artifact type:** RUNTIME BINDING RULES (NORMATIVE)
**Date:** 2026-04-03
**Authority:** EX.H1
**Status:** LOCKED

---

## 1. PURPOSE

This document defines how the PiOS v0.4 engine must be invoked at runtime, how
outputs must be validated, and how regression against the certified baseline must
be detected. These rules are binding on all EX.1 (Runtime Binding & Verification)
stream executions and on any environment — demo, integration, or production — that
invokes the PiOS engine.

---

## 2. ENGINE INVOCATION RULES

### RB-001 — Only the certified engine may be used
The runtime MUST invoke `pios/core/v0.1/engine/compute_signals.py` and
`pios/core/v0.1/engine/activate_conditions.py` at commit `ed95c81` (or a
successor commit produced under a new CE stream with its own certification).
No other engine implementation may be substituted.

### RB-002 — No interposition between engine components
The output of `compute_signals.py` MUST be passed as-is to `activate_conditions.py`.
No transformation, filtering, enrichment, or substitution of signal records is
permitted between the two engine components. This is CE.5 PBE-1 (no modification
of signal records prior to consumption).

### RB-003 — Telemetry input must be declared
Every runtime invocation must declare the telemetry source used as input. The
telemetry source is either:
- **Static baseline:** STATIC_VARIABLES as defined in `compute_signals.py` post-CE.8;
  this is the certified reference context
- **Live telemetry:** a governed telemetry ingestor (EX.4 stream); the run must
  be tagged as live and its outputs are NOT covered by the static baseline
  certification

Undeclared telemetry source is a RB violation.

### RB-004 — Run ID required
Every runtime invocation must carry a run identifier that is recorded in the
run output. Run IDs enable traceability from output artifacts to the specific
invocation that produced them.

### RB-005 — Output must be written to the run archive
Every runtime invocation must write:
- `signal_output.json`: full output of `compute_signals.py` including all signal
  records, emission states, partiality_reasons, blocking metadata
- `condition_output.json`: full output of `activate_conditions.py` including
  consumption records, condition tiers, diagnosis states, traceability records
- `run_metadata.json`: {run_id, date, telemetry_source, engine_commit, pios_version}

These artifacts are the evidentiary basis for any compliance claim derived from
the run.

---

## 3. OUTPUT VALIDATION RULES

### RB-006 — Programmatic compliance validation is mandatory
Every runtime invocation that will be used to support a compliance claim MUST
be followed by programmatic validation of all 4 compliance domains:

- **Emission validation:** Check all 8 signals against CE.4 INV-001..INV-007 and §3.3
- **Consumption validation:** Check all consumption records against CE.5 C-001..C-003,
  PBE-1/PBE-2
- **Propagation validation:** Check all condition tiers ∈ {BLOCKED, DEGRADED, AT_RISK,
  STABLE}; check all diagnoses match DEC-014 lookup
- **Traceability validation:** Check record count = governed signal count;
  check Type 1/Type 2 record presence

### RB-007 — Validation result must be recorded
Validation results must be written to the run archive as `validation_result.json`
with structure:
```
{
  "run_id": "<run_id>",
  "emission_compliance": "PASS" | "FAIL",
  "emission_violations": [],
  "consumption_compliance": "PASS" | "FAIL",
  "consumption_violations": [],
  "propagation_compliance": "PASS" | "FAIL",
  "propagation_violations": [],
  "traceability_compliance": "PASS" | "FAIL",
  "traceability_violations": [],
  "overall_verdict": "COMPLIANT" | "NON-COMPLIANT"
}
```

### RB-008 — Non-compliant run outputs must be quarantined
If any compliance domain reports FAIL, the run output MUST be marked as
NON-COMPLIANT and MUST NOT be used as input to any downstream system that
expects CE.5-compliant outputs. The run archive must remain for diagnostic use
but must carry a NON-COMPLIANT marker.

---

## 4. REGRESSION DETECTION RULES

### RB-009 — Certified baseline run is the regression anchor
The ce10_validation run at `runs/pios/40.5/ce10_validation/signal_output.json`
and `runs/pios/40.6/ce10_validation/condition_output.json` is the certified
baseline output. All subsequent static baseline runs MUST produce identical
outputs for the static telemetry context.

### RB-010 — Output schema regression
A regression is declared if any of the following fields appear in, or disappear
from, engine output relative to the certified baseline run:
- Signal record fields: {signal_id, emission_state, output, partiality_reasons,
  blocking_class, blocking_inputs, blocking_reason, traceability}
- Consumption record fields: {signal_id, origin, consumption_state, output_ref}
- Condition fields: {condition_id, condition_coverage_state}
- Diagnosis fields: {diagnosis_id, diagnosis_activation_state}

### RB-011 — Value regression (static baseline context only)
For runs using the static 40.4 telemetry baseline, the following values are
fixed and a deviation is a regression:

| Component | Expected Value |
|---|---|
| COND-001..COND-004 condition_coverage_state | STABLE |
| COND-005, COND-006 condition_coverage_state | BLOCKED |
| COND-007, COND-008 condition_coverage_state | STABLE |
| DIAG-001..DIAG-004 diagnosis_activation_state | INACTIVE |
| DIAG-005, DIAG-006 diagnosis_activation_state | BLOCKED |
| DIAG-007, DIAG-008 diagnosis_activation_state | INACTIVE |
| CE.5 traceability record count | 8 (Type 1: 8, Type 2: 0) |
| Overall compliance verdict | COMPLIANT |

Any deviation from these values when running against the static baseline is a
regression and must be escalated to a CE.11 GC-002 classification before the
next execution.

### RB-012 — Regression handling
On regression detection:
1. The run is marked as REGRESSION-DETECTED
2. Execution against this engine state halts for compliance-critical paths
3. A CE.11-governed change stream (GC-002) must be initiated to diagnose and
   close the regression
4. The prior certified baseline remains authoritative until a new VS-CE10C
   closeout is executed

---

## 5. DEMO / DEVELOPMENT ENVIRONMENT RULES

### RB-013 — Demo environments are not exempt
A "demo" invocation of the PiOS engine is subject to the same RB rules as any
other invocation. The demo label does not exempt a run from RB-001 (certified
engine only), RB-002 (no interposition), or RB-006 (programmatic validation).

### RB-014 — Development runs must be tagged
Invocations made during development (i.e., during an active GC-002 change before
VS-CE10C) must be tagged as DEV and must not be used as compliance evidence.
DEV runs may be stored in the run archive with a DEV marker but do not constitute
certification evidence.

---

## 6. RUNTIME BINDING RULE SUMMARY

| Rule | Category | Mandatory |
|---|---|---|
| RB-001 | Engine selection | YES |
| RB-002 | No interposition | YES |
| RB-003 | Telemetry declaration | YES |
| RB-004 | Run ID | YES |
| RB-005 | Output archive | YES |
| RB-006 | Programmatic validation | YES (for compliance claims) |
| RB-007 | Validation result record | YES (for compliance claims) |
| RB-008 | Non-compliant output quarantine | YES |
| RB-009 | Baseline regression anchor | YES |
| RB-010 | Schema regression detection | YES |
| RB-011 | Value regression detection | YES (static baseline runs) |
| RB-012 | Regression handling | YES |
| RB-013 | Demo exemption prohibition | YES |
| RB-014 | Dev run tagging | YES |
