# EX.H1 — Execution Principles

**Stream:** EX.H1 — Execution Handover (CE → EX Transition)
**Artifact type:** EXECUTION PRINCIPLES (NORMATIVE)
**Date:** 2026-04-03
**Authority:** EX.H1
**Status:** LOCKED

---

## 1. PURPOSE

This document defines the four binding execution principles that all EX streams
must satisfy. These principles are not guidelines — they are hard constraints
derived from the locked governance baseline. Any EX stream output that violates
a principle is non-compliant and must not be treated as a valid PiOS output.

---

## 2. PRINCIPLE 1 — NO SEMANTIC DRIFT

**Statement:** Signal states, consumption states, tier values, and diagnosis states
MUST carry exactly the semantics defined in the locked governance artifacts. No
EX stream may reinterpret, rename, alias, or extend these vocabularies.

**Scope:**
- CE.4 signal emission states: the state PARTIAL means the signal has non-null
  output with at least one null field traceable to a governed failure_class. No
  other interpretation is valid.
- CE.5 consumption states: AVAILABLE, PARTIAL, BLOCKED are closed. A consumption
  record with a state outside this set is invalid.
- CE.2 tier values: BLOCKED, DEGRADED, AT_RISK, STABLE are closed. A
  `condition_coverage_state` not in this set is invalid.
- DEC-014 diagnosis states: BLOCKED, ACTIVE, INACTIVE are the only valid
  `diagnosis_activation_state` values.

**Prohibited forms of semantic drift:**
- Treating PARTIAL consumption state as "nearly available" for threshold purposes
- Treating BLOCKED condition tier as equivalent to "not applicable"
- Treating INACTIVE diagnosis state as "unknown" or "pending"
- Mapping CE.5 AVAILABLE to any internal state other than the governed tier input

**Enforcement:** Any runtime component that translates, maps, or reinterprets a
governed vocabulary term before passing it downstream introduces semantic drift
and is non-compliant. Governed terms must be propagated verbatim or consumed
per their CE-defined semantics.

---

## 3. PRINCIPLE 2 — NO IMPLICIT LOGIC

**Statement:** All behavior in any EX stream component must be traceable to a
specific governance artifact (CE stream, DEC entry, INV number, or rule
identifier). No behavior may depend on undocumented assumptions.

**Scope:**
- Tier derivation: every tier outcome must be traceable to a binding rule
  (DEC-013), a binding surface row (DEC-012), and a tier derivation step (DEC-009)
- Consumption decisions: every consumption state assignment must cite C-001, C-002,
  C-003, CSM-1, or equivalent CE.5 rule
- Diagnosis state: every diagnosis_activation_state must be traceable to DEC-014
- Signal computation: every signal value must be traceable to CE.4 §3.x definitions
  and the STATIC_VARIABLES baseline (or successor governed telemetry source)

**Prohibited forms of implicit logic:**
- Defaulting a signal to COMPLETE because "it usually works"
- Selecting a tier as STABLE because "no alert has fired"
- Skipping consumption record production for signals deemed "not relevant"
- Emitting a diagnosis state based on any rule not in CE.2 DEC-014

**Enforcement:** If an EX stream component cannot produce a governance citation for
any output value it generates, the component has implicit logic and is non-compliant.

---

## 4. PRINCIPLE 3 — FULL TRACEABILITY

**Statement:** Every governed output must be explainable through the complete
signal → consumption → propagation → diagnosis chain. The traceability chain
must be reconstructible from the CE.5 consumption records and traceability records
produced by each run.

**Required chain links:**
1. Signal (SIG-NNN): emission state, output value or blocking class, failure class
   if PARTIAL, from `compute_signals.py`
2. Consumption record: {signal_id, origin: "CE.4", consumption_state, output_ref},
   produced per CE.5 PBE-2
3. Condition tier: derived from `derive_condition_tier()` per DEC-009; binding
   rule ID and tier contribution traceable
4. Diagnosis state: mapped from condition tier per DEC-014

**Traceability record types (CE.5 T-001/T-002):**
- Type 1: consumption record for every present governed signal
- Type 2: structural gap trace record for every absent governed signal

**No signal disappears silently.** Any signal not present in the input must
produce a Type 2 structural gap trace record. Any signal present must produce
a Type 1 consumption record.

**Enforcement:** A run that cannot produce the full chain for any governed condition
has broken traceability and fails EX-007. The run output is non-compliant.

---

## 5. PRINCIPLE 4 — NO PARTIAL COMPLIANCE

**Statement:** PiOS compliance is all-or-nothing at the system level. A system
is either EXECUTABLE-PROVEN (all 4 domains PASS) or it is not certified. There
is no intermediate "mostly compliant" or "best effort" state.

**Scope:**
- Emission: all 8 signals must be compliant with CE.4 INV-001..INV-007 and §3.3
- Consumption: all 8 consumption records must satisfy CE.5 C-001..C-003, PBE-1/PBE-2
- Propagation: all 8 condition tiers must satisfy DEC-009; all 8 diagnoses must
  satisfy DEC-014
- Traceability: all 8 records must be present (Type 1 or Type 2); INV-006 must hold

**Prohibited forms of partial compliance:**
- Declaring only the emission domain as "certified" while propagation is in PARTIAL
- Producing run outputs that skip compliance validation for "known stable" conditions
- Treating a system with 7/8 compliant signals as sufficiently compliant for deployment
- Issuing partial certification artifacts for subsets of the signal or condition set

**Enforcement:** Any non-compliant output across any governed signal, consumption
record, condition tier, or diagnosis state places the entire run in NON-COMPLIANT
state. There is no per-signal, per-condition, or per-domain partial compliance claim.

---

## 6. PRINCIPLES APPLICABILITY MATRIX

| EX Stream | P1: No Semantic Drift | P2: No Implicit Logic | P3: Full Traceability | P4: No Partial Compliance |
|---|---|---|---|---|
| EX.1 (Runtime Binding) | REQUIRED | REQUIRED | REQUIRED | REQUIRED |
| EX.2 (Debug/Trace) | REQUIRED | REQUIRED | REQUIRED | N/A (read-only) |
| EX.3 (System Bridge) | REQUIRED | REQUIRED | REQUIRED | REQUIRED |
| EX.4 (Ingestor) | REQUIRED | REQUIRED | REQUIRED | REQUIRED |

EX.2 is exempt from P4 because it is a read-only inspection interface — it does
not produce governed outputs, only surfaces existing outputs for inspection.
All other principles apply to EX.2.

---

## 7. PRINCIPLE VIOLATION HANDLING

A principle violation discovered during an EX stream must:

1. Halt further execution of the stream
2. Produce a violation record citing:
   - Which principle was violated (P1..P4)
   - The specific output or behavior that violated it
   - The governance citation that defines the expected behavior
3. NOT proceed to downstream consumers with the non-compliant output
4. Trigger a CE.11 GC-002 classification if an engine fix is required
