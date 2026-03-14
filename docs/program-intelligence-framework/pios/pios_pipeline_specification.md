# PiOS Pipeline Specification

## Authority

Stream 40.0 — PiOS Runtime Layer

## Purpose

This document defines the canonical runtime pipeline executed by PiOS.

It specifies the ordered sequence of modules, the required inputs and outputs of each stage, and the validation logic required to preserve deterministic execution.

---

## Pipeline Statement

PiOS executes the following canonical pipeline:

Evidence  
→ Reconstruction  
→ Telemetry  
→ Signals  
→ Conditions  
→ Diagnosis  
→ Intelligence  
→ Orchestration  
→ Feedback

The order is mandatory.
No stage may be skipped when its upstream dependency is required.

---

## Stage 1 — Evidence Acquisition

**Owner:** Stream 40.2 — PiOS Evidence Connectors Layer

**Input:**
- configured evidence source definitions
- source credentials or access contracts
- requested snapshot or time window

**Output:**
- evidence snapshot
- source metadata
- provenance and timestamps

**Validation Gate:**
- evidence sources identified
- retrieval reproducible
- provenance preserved

---

## Stage 2 — Program Reconstruction

**Owner:** Stream 40.3 — PiOS Reverse Engineering Engine

**Input:**
- evidence snapshot
- source metadata

**Output:**
- repository map
- architecture inventory
- capability map
- dependency topology
- execution domains
- Program Execution Graph (PEG)

**Validation Gate:**
- structural artifacts complete
- reconstruction deterministic
- PEG reproducible from same evidence snapshot

---

## Stage 3 — Telemetry Extraction

**Owner:** Stream 40.4 — PiOS Telemetry Extraction Layer

**Input:**
- evidence snapshot
- reconstructed program structure
- PEG

**Output:**
- structural telemetry datasets
- engineering activity telemetry datasets
- delivery telemetry datasets

**Validation Gate:**
- telemetry evidence-derived
- transformation rules stable
- dataset schema valid

---

## Stage 4 — Signal Computation

**Owner:** Stream 40.5 — PiOS Signal Computation Engine

**Input:**
- telemetry datasets
- governed signal definitions
- signal model version

**Output:**
- signal datasets
- signal provenance metadata
- computation references

**Validation Gate:**
- signal outputs reproducible
- model version known
- telemetry traceability preserved

---

## Stage 5 — Condition Activation

**Owner:** Stream 40.6 — PiOS Condition and Diagnosis Activation Layer

**Input:**
- signal datasets
- governed condition model definitions

**Output:**
- condition datasets
- observable execution state descriptions

**Validation Gate:**
- conditions derived from signals
- state descriptions traceable
- no diagnosis logic applied prematurely

---

## Stage 6 — Diagnosis Activation

**Owner:** Stream 40.6 — PiOS Condition and Diagnosis Activation Layer

**Input:**
- condition datasets
- governed diagnosis model definitions

**Output:**
- diagnosis outputs
- identified systemic execution dynamics

**Validation Gate:**
- diagnosis traceable to condition states
- State–Diagnosis Separation Principle preserved

---

## Stage 7 — Intelligence Synthesis

**Owner:** Stream 40.7 — PiOS Intelligence Synthesis Layer

**Input:**
- condition datasets
- diagnosis outputs

**Output:**
- intelligence objects
- program state summaries
- evidence-linked intelligence packets

**Validation Gate:**
- intelligence explainable
- upstream lineage preserved
- no rendering logic embedded

---

## Stage 8 — Agentic Orchestration

**Owner:** Stream 40.8 — PiOS Agentic Orchestration Layer

**Input:**
- pipeline schedules or triggers
- runtime state
- validation gate status

**Output:**
- controlled pipeline execution
- execution monitoring records
- anomaly observations

**Validation Gate:**
- agent actions governed
- no model redefinition
- runtime checkpoints enforced

---

## Stage 9 — Feedback and Continuous Improvement

**Owner:** Stream 40.9 — PiOS Feedback and Continuous Improvement Layer

**Input:**
- runtime observations
- anomalies
- repeatability results
- execution lessons

**Output:**
- structured feedback records
- improvement recommendations
- discipline feedback inputs for Stream 77

**Validation Gate:**
- feedback recorded
- governance preserved
- no uncontrolled drift introduced

---

## Cross-Stage Rules

### Rule 1 — Deterministic Inputs
Same snapshot + same model versions + same rules = same outputs.

### Rule 2 — Traceability
Every downstream artifact must retain lineage to upstream evidence.

### Rule 3 — Fail Closed
If a validation gate fails, PiOS must not silently continue downstream.

### Rule 4 — Version Visibility
Every output set must expose the relevant evidence, reconstruction, telemetry, signal, and model versions.

### Rule 5 — No Unbounded Agentic Override
Agentic orchestration may coordinate execution, but cannot redefine analytical or governance rules.

---

## Execution Modes

### Snapshot Mode
Runs the full pipeline on a fixed evidence snapshot.

### Continuous Mode
Runs the pipeline in recurring cycles based on evidence changes.

### Monitoring Mode
Observes runtime health without necessarily executing the full chain.

---

## Recommended Repository Location

`docs/program-intelligence-framework/pios/pios_pipeline_specification.md`
