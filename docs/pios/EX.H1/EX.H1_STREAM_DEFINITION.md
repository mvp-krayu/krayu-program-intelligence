# EX.H1 — Execution Stream Definitions

**Stream:** EX.H1 — Execution Handover (CE → EX Transition)
**Artifact type:** STREAM DEFINITION (NORMATIVE)
**Date:** 2026-04-03
**Authority:** EX.H1
**Status:** LOCKED

---

## 1. PURPOSE

This document defines the four allowed EX stream types and their respective
scope, authority, and constraints. No EX stream type beyond EX.1–EX.4 is
permitted without a new CE governance event. Each stream type is non-overlapping
in scope.

---

## 2. STREAM TYPE REGISTRY

### EX.1 — Runtime Binding & Verification

**Definition:** Streams that invoke the certified PiOS engine against a declared
telemetry context and validate the outputs against all 4 compliance domains.

**Scope:**
- Engine invocation (compute_signals → activate_conditions pipeline)
- Run archive production (signal_output.json, condition_output.json, run_metadata.json)
- Programmatic compliance validation (all 4 domains)
- Validation result recording (validation_result.json)
- Regression detection against certified baseline

**Authority:** May execute the certified engine. May not modify engine files.

**Output location:** `runs/pios/<layer>/<run_id>/`

**Governing rules:** EX.H1_RUNTIME_BINDING_RULES.md (RB-001..RB-014)

**Forbidden:**
- Modifying engine files before or during invocation
- Skipping programmatic validation
- Asserting compliance without running validation
- Using uncertified engine files

**Examples of EX.1 streams:**
- ce10_validation (retroactively classified as EX.1)
- Any new static baseline run
- Live telemetry verification run (with EX.4 ingestor)

---

### EX.2 — Debug / Trace Interface

**Definition:** Streams that implement read-only inspection and diagnostic tooling
for PiOS engine outputs. EX.2 does not invoke the engine; it reads and surfaces
existing run outputs.

**Scope:**
- Reading and presenting signal_output.json, condition_output.json
- Surfacing the mandatory inspection data (SB-007: signal traceability,
  consumption records, propagation states, diagnosis states, Type 2 structural gaps)
- Producing diagnostic reports or visual representations of governed outputs
- Supporting debugging of non-compliant runs by exposing the exact violation records

**Authority:** Read-only access to run archives. No write access to governed outputs.

**Output location:** `runs/pios/<layer>/<run_id>/debug/` or equivalent

**Governing rules:** EX.H1_SYSTEM_BOUNDARY.md (SB-006, SB-007),
EX.H1_EXECUTION_PRINCIPLES.md (P1, P2, P3)

**Forbidden:**
- Modifying any run output file
- Recomputing any governed output value (may re-invoke engine as DEV-tagged run
  only, not as compliance evidence)
- Presenting derived or reinterpreted values as governed outputs

**Examples of EX.2 streams:**
- Traceability report generator for a specific run
- Signal-to-diagnosis chain visualization
- Compliance gap inspector for a non-compliant run

---

### EX.3 — System Bridge (CE.5B Realization)

**Definition:** Streams that implement the integration layer between the PiOS
governed output (CE.5-compliant consumption records and condition/diagnosis states)
and downstream consumers (layers 40.7–40.10 and external program intelligence
consumers).

**Scope:**
- Reading CE.5-compliant outputs from completed EX.1 runs
- Translating governed outputs to the input schema expected by downstream layers
  (without reinterpreting governed vocabulary)
- Delivering `diagnosis_activation_state` values to 40.7-layer consumers
- Maintaining the governed vocabulary across the bridge (no semantic drift)

**Authority:** May read PiOS outputs. May transform output format for downstream
compatibility. May NOT transform output semantics.

**Governing rules:** EX.H1_SYSTEM_BOUNDARY.md (SB-001..SB-005),
EX.H1_EXECUTION_PRINCIPLES.md (P1: No Semantic Drift is the primary constraint)

**Forbidden:**
- Overriding or supplementing `condition_coverage_state` or `diagnosis_activation_state`
- Injecting external state into the bridge output
- Treating bridge-format outputs as authoritative over PiOS-produced outputs
- Any transformation that changes the effective semantics of a governed term

**Notes:** CE.5B (CE.5 Bridge) is the governance concept underlying EX.3. No CE.5B
contract exists as of CE.11; if a formal bridge contract is required, it must be
defined via a GC-001 / MINOR version event.

**Examples of EX.3 streams:**
- 40.6 → 40.7 handoff bridge implementation
- PiOS output adapter for external program intelligence consumer
- Delivery layer connector that reads diagnosis states and routes to 40.8

---

### EX.4 — Ingestor Module (Future Version Candidate)

**Definition:** Streams that implement governed telemetry ingestion: the path
from live program telemetry data into the PiOS emission layer (`compute_signals.py`)
as a replacement for or supplement to the static STATIC_VARIABLES baseline.

**Scope:**
- Defining a governed telemetry schema mapping (what program metrics map to what
  PiOS signal inputs)
- Implementing the ingestor that transforms live telemetry to PiOS input format
- Declaring the telemetry source in every run (RB-003)
- Ensuring that live telemetry does not alter the emission logic, only the input values

**Authority:** May supply input values to the emission layer. May NOT modify
emission logic, consumption logic, propagation logic, or any governance artifact.

**Status:** FUTURE VERSION CANDIDATE. EX.4 streams require a governing telemetry
schema before execution. The telemetry schema is a GC-001 (governance change) if
it introduces new governed signal fields, or a GC-003 (data change) if it only
changes input values within the existing signal field schema.

**Governing rules:** EX.H1_RUNTIME_BINDING_RULES.md (RB-003, RB-005),
CE.11_CHANGE_CLASSIFICATION.md (GC-003 for data inputs; GC-001 if schema extends)

**Forbidden:**
- Introducing new signal fields not defined in CE.4
- Modifying compute_signals.py emission logic to accommodate telemetry format
  (this is a GC-002 change requiring full CE.11 cycle)
- Using live telemetry runs as static baseline certification evidence

**Examples of EX.4 streams:**
- Live telemetry ingestor v0.1 (future)
- Krayu pipeline metric collector → PiOS signal adapter

---

## 3. STREAM AUTHORIZATION RULES

### SD-001 — No stream type beyond EX.1–EX.4 without governance
If a required execution stream does not fit EX.1, EX.2, EX.3, or EX.4, a new
CE stream (GC-001) must define it before execution begins. This is the same
governance trigger that creates a new CE stream for any behavioral extension.

### SD-002 — Stream instances are numbered within type
Each instance of a stream type carries a unique identifier: EX.1.1, EX.1.2,
EX.2.1, etc. The numbering is sequential per type.

### SD-003 — Stream scope must not overlap
An EX stream instance may not simultaneously claim EX.1 and EX.3 scope. If a
stream invokes the engine AND bridges output to downstream, it is two streams
(EX.1 → EX.3) with a declared dependency.

---

## 4. STREAM TYPE SUMMARY

| Type | Name | Modifies Engine | Modifies Output | Invokes Engine | Delivers Downstream |
|---|---|---|---|---|---|
| EX.1 | Runtime Binding & Verification | NO | NO (archives only) | YES | NO |
| EX.2 | Debug / Trace Interface | NO | NO | NO | NO |
| EX.3 | System Bridge | NO | Format only | NO | YES |
| EX.4 | Ingestor Module | NO | Input values only | Indirectly | NO |
