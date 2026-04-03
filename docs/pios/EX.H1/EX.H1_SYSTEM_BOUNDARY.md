# EX.H1 — System Boundary

**Stream:** EX.H1 — Execution Handover (CE → EX Transition)
**Artifact type:** SYSTEM BOUNDARY (NORMATIVE)
**Date:** 2026-04-03
**Authority:** EX.H1
**Status:** LOCKED

---

## 1. PURPOSE

This document defines the authoritative boundary of the PiOS system and the
rules that govern how external systems interact with PiOS outputs. PiOS is the
source of truth for program intelligence signals. External systems are consumers,
not peers. No external system may modify, override, supplement, or reinterpret
PiOS outputs within the governed scope.

---

## 2. PIOS AUTHORITY DECLARATION

### SB-001 — PiOS is the authoritative source for program intelligence signals
Within the scope of layers 40.5 → 40.6, PiOS v0.4 produces the ONLY valid:
- Signal emission records (CE.4 governed)
- Consumption records (CE.5 governed)
- Condition coverage states (CE.2 DEC-009 governed)
- Diagnosis activation states (CE.2 DEC-014 governed)

No external system may produce a competing or supplementary set of these records
and treat them as equivalent to PiOS outputs.

### SB-002 — Downstream layers treat PiOS output as authoritative input
Layers 40.7 (intelligence synthesis) through 40.10 (control) receive
`diagnosis_activation_state` values as governed inputs. These values are the
terminal output of the 40.5 → 40.6 handoff. Downstream layers MUST NOT:
- Recompute diagnosis states from raw signals
- Override PiOS-produced diagnosis states with externally derived values
- Apply secondary heuristics to "correct" PiOS outputs

---

## 3. EXTERNAL SYSTEM RULES

### SB-003 — No injection of derived states
An external system that consumes PiOS outputs may derive secondary representations
for its own internal use (e.g., UI display labels, alert classifications), but MUST
NOT inject these derived representations back into the PiOS consumption or
propagation chain as if they were PiOS-produced values.

**Example violation:** An external monitoring system observes that COND-003 is
STABLE and writes a `condition_override: "ELEVATED"` field back to the condition
record consumed by the 40.7 layer. This is a system boundary violation.

**Example compliant behavior:** An external monitoring system reads COND-003 =
STABLE and displays "Program structural coverage: nominal" in a UI. The PiOS
record is not modified.

### SB-004 — No override of propagation results
A `condition_coverage_state` or `diagnosis_activation_state` produced by the
PiOS engine may not be overridden by any external system, human or automated,
without triggering a new CE.11-governed change event.

If a propagation result is believed to be incorrect, the correct path is:
1. Classify as GC-001 (if a governance contract needs updating) or GC-002
   (if engine logic needs fixing)
2. Execute the CE.11 validation and certification cycle
3. Deploy the corrected engine

There is no "hot patch" path that bypasses this cycle.

### SB-005 — External telemetry sources must use the governed ingestor path
An external system that supplies telemetry data (i.e., program metrics) to the
PiOS engine MUST do so through the governed ingestor interface (EX.4 stream, once
defined). Direct modification of STATIC_VARIABLES in `compute_signals.py` to
inject live data is a GC-002 change and triggers the full CE.11 validation cycle.

---

## 4. DEBUG AND INSPECTION BOUNDARY

### SB-006 — Inspection is read-only
The EX.2 (Debug/Trace Interface) stream has read-only access to PiOS engine outputs.
Inspection tooling must not modify signal records, consumption records, or traceability
records. If inspection requires recomputation (e.g., re-running the engine under
different inputs for diagnostic purposes), the result is a DEV-tagged run and not
a governed output.

### SB-007 — Mandatory inspection surface
The following data MUST be surfaced by any inspection or debug interface:
1. Signal-level traceability: per-signal emission state, output, blocking metadata,
   partiality_reasons
2. CE.5 consumption records: per-signal {signal_id, origin, consumption_state, output_ref}
3. Propagation states: per-condition {condition_id, condition_coverage_state,
   binding_rule_contributions}
4. Diagnosis states: per-diagnosis {diagnosis_id, diagnosis_activation_state}
5. Structural gap visibility: Type 2 traceability records for any absent governed signal

This surface is NOT optional. An EX.2 implementation that omits any of these items
is non-compliant with the inspection requirement.

---

## 5. VERSION EVOLUTION BOUNDARY

### SB-008 — EX streams cannot introduce governance
An EX stream that discovers a need for new governance — new signals, new rules,
new layer coverage, new contracts — MUST NOT implement that governance within the
EX stream. It must:
1. Document the need as an evolution candidate
2. Trigger a new CE stream per CE.11 versioning governance
3. Wait for the CE stream to produce locked governance artifacts
4. Then implement the governed behavior in a subsequent EX stream

An EX stream that introduces ungoverned behavior is a PP-005 violation
(heuristic logic outside governance).

### SB-009 — No contract modification in EX streams
EX streams operate under locked governance. If an EX stream encounters behavior
that appears to require a contract modification, the correct path is a CE.11
GC-001 stream, not an EX-level workaround.

---

## 6. BOUNDARY ENFORCEMENT SUMMARY

| Rule | Applies To | Severity |
|---|---|---|
| SB-001 | All external systems | CRITICAL |
| SB-002 | Downstream layers 40.7–40.10 | CRITICAL |
| SB-003 | External monitoring/consumer systems | HIGH |
| SB-004 | All systems consuming PiOS outputs | CRITICAL |
| SB-005 | External telemetry suppliers | HIGH |
| SB-006 | EX.2 inspection tooling | HIGH |
| SB-007 | EX.2 inspection tooling | HIGH |
| SB-008 | All EX streams | HIGH |
| SB-009 | All EX streams | HIGH |

CRITICAL boundary violations require stream halt and CE.11 classification.
HIGH boundary violations require remediation before the next governed run.
