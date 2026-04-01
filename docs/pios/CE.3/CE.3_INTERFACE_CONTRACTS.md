# CE.3 — Interface Contracts

**Stream:** CE.3 — PiOS Interface Contracts
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.2 (Core specification), canonical-layer-model.md (00.2), docs/pios/40.4/, docs/pios/40.16/

---

## I1 — LEDGER → CORE

**Interface name:** Ledger-to-Core Handoff
**Source:** Ledger / Pre-Core ingestion pipeline (40.1–40.4)
**Target:** Core entry point — 40.5 (Signal Computation)
**Canonical layer transition:** L1 (Normalization) → L3 (Derivation)

---

### I1.1 — Allowed Inputs to Core

Core (40.5) accepts ONLY the following artifact types from the upstream handoff:

| Input Type | Source Artifact | Required Fields |
|---|---|---|
| Activity telemetry metrics | docs/pios/40.4/activity_telemetry.md | metric ID, temporal classification, description, explicit per-run value (where stated) |
| Delivery telemetry metrics | docs/pios/40.4/delivery_telemetry.md | metric ID, temporal classification, description, explicit per-run value (where stated) |
| Structural telemetry constants | docs/pios/40.4/structural_telemetry.md | metric ID, temporal classification, value |
| Telemetry schema | docs/pios/40.4/telemetry_schema.md | metric ID registry, dimension definitions, temporal classification definitions |
| Input contract lock | docs/pios/40.16/baseline/input_contract_lock.json | artifact paths, SHA-256 hashes, contract ID |

No other input types are accepted at the Core entry boundary.

### I1.2 — Required Structure

Every value entering Core at 40.5 must conform to:

| Requirement | Rule |
|---|---|
| Metric identity | Each value must carry a declared metric ID (AT-NNN or DT-NNN) |
| Temporal classification | Each value must carry its 40.4 temporal classification (static / event-based / time-series) |
| Null declaration | Absent values must be declared null with a stated reason — not omitted silently |
| Source traceability | Each value must trace to a named 40.4 artifact and section |
| Unit conformance | Values must conform to the unit declared in the telemetry schema |

### I1.3 — Normalization Expectations

Ingestion (40.1–40.4) is responsible for:
- Parsing raw evidence into structured telemetry records
- Classifying metrics by dimension and temporal classification
- Declaring explicit per-run values where stated in source artifacts
- Declaring null with reason for time-series and event-based metrics without stated values

Core does NOT:
- Re-normalize incoming values
- Validate ingestion correctness
- Accept values from sources other than 40.4

### I1.4 — Traceability Requirements

The handoff from Ledger to Core must include:
- Input contract ID (`pios_core_40.16_input_contract_0.1` or successor)
- SHA-256 hashes of all 6 input artifacts (verified at 40.11)
- Window identity for multi-window runs (window_id, start, end, duration)
- Run identity (run_id)

### I1.5 — Forbidden at I1

| Forbidden Operation | Reason |
|---|---|
| Semantic interpretation of metric values | Violates Evidence First; interpretation belongs at L4 |
| Inferred values for missing metrics | Violates PARTIAL state propagation rule PSR-01 |
| Filling null fields with defaults | Violates PSR-01 and DR-04 |
| Passing values from non-40.4 sources | Violates input boundary contract |
| Passing pre-computed signals (ESI, RAG, SSZ) | Core computes its own signals from raw telemetry only |
| Modifying 40.4 artifacts before handoff | 40.4 is read-only |

### I1.6 — Failure Conditions at I1

| Condition | Response |
|---|---|
| Missing run_id | REJECT — execution must not start |
| Missing input contract ID | REJECT — execution must not start |
| Input artifact hash mismatch | REJECT — run is INVALID |
| Metric value outside declared unit range | REJECT — log and stop |
| Null value without reason | REJECT — treat as missing, declare UNDEFINED with gap |

---

## I2 — CORE → SEMANTIC (41.x)

**Interface name:** Core-to-Semantic Handoff
**Source:** Core exit point — 40.11 (Loop Closure and Integrity Validation)
**Target:** 41.x (Semantic Elevation / ENL Navigation)
**Canonical layer transition:** L3 (Derivation) / L4 boundary → L4 (Semantic Shaping) / L5

---

### I2.1 — Allowed Outputs from Core

Core exports the following artifacts at its output boundary:

| Output Artifact | Producing Layer | Required Fields |
|---|---|---|
| ESI manifest (JSON) | 40.5 | run_id, input_source, window_count, NF values, PES values, ESI value+mode+warnings, TC observations, program constants |
| ESI output set (Markdown) | 40.5 | Human-readable derivation record, all UNDEFINED/PARTIAL flags explicit |
| RAG output set (Markdown) | 40.5 | RAG components, INSUFFICIENT_WINDOWS declarations, window count |
| Derivation execution manifest (Markdown) | 40.5 | 9-section structure per execution_manifest.md spec |
| Condition activation record | 40.6 | Per-signal condition states, threshold references, PARTIAL flags |
| Diagnosis structure | 40.7 | Evidence-bound diagnosis, intelligence packet, gap declarations |
| Delivery package | 40.8 | Packaged 40.7 outputs, manifest, lineage metadata |
| Feedback registration record | 40.9 | Recurrence log, unknown space log, coverage pressure, gap log |
| Orchestration directives | 40.10 | Control directives, triggering records, rule references |
| Loop closure assertion | 40.11 | Closure status, integrity record, scope adherence, traceability report |

### I2.2 — What 41.x Is Allowed to Consume

| Authorized Consumption | Constraint |
|---|---|
| 40.7 diagnosis structures | Read-only; must preserve evidence bindings |
| 40.8 delivery packages | Read-only; must preserve PARTIAL flags |
| 40.5 ESI manifest | Read-only; NF/PES/ESI values must not be modified |
| 40.6 condition activation records | Read-only; condition states must not be recomputed |
| 40.11 loop closure assertion | Read-only; for lineage and validity gating |

### I2.3 — Evidence and Lineage Preservation

41.x must:
- Preserve the `run_id` from Core across all derived semantic artifacts
- Preserve `input_contract_id` reference
- Preserve all UNDEFINED/PARTIAL/INSUFFICIENT_WINDOWS flags in any derived output
- Not strip evidence references from Core outputs

### I2.4 — Traceability Requirements

Every 41.x output must declare:
- Which Core artifact it consumed
- Which fields it used
- That it did not alter the consumed values

### I2.5 — Forbidden at I2

| Forbidden Operation | Reason |
|---|---|
| Recomputing ESI, RAG, or PES signals | Signal derivation is exclusively L3 (40.5); 41.x is L4 |
| Modifying condition states from 40.6 | Conditions are derived at L3; 41.x cannot alter them |
| Removing PARTIAL/UNDEFINED flags | PARTIAL state must propagate downstream |
| Accessing 40.4 directly | 41.x must consume only Core outputs, not raw telemetry |
| Injecting semantic meaning into Core output artifacts | Core outputs are read-only at this boundary |
| Accessing 42.x behavior from within semantic processing | Forward access only; no back-channel to presentation |

### I2.6 — Failure Conditions at I2

| Condition | Response |
|---|---|
| Core output artifact missing | 41.x must not proceed; declare INVALID |
| Loop closure assertion is FAIL | 41.x must not consume Core outputs from that run |
| Run ID inconsistency across Core artifacts | 41.x must reject the output set |
| PARTIAL flag removed in 41.x output | 41.x output is INVALID |

---

## I3 — SEMANTIC → DELIVERY (42.x)

**Interface name:** Semantic-to-Delivery Handoff
**Source:** 41.x (Semantic Elevation / ENL Navigation) outputs
**Target:** 42.x (Runtime Rendering / Delivery)
**Canonical layer transition:** L4 (Semantic Shaping) / L5 (Presentation Assembly) → L6 (Runtime Experience)

---

### I3.1 — Allowed Inputs to 42.x

42.x accepts ONLY L5 assembled presentation payloads. It does NOT consume Core (L3) or Semantic Shaping (L4) artifacts directly.

| Input Type | Source | Constraint |
|---|---|---|
| Presentation payloads | L5 assembly (43.x, 44.x) | Must be assembled from 41.x semantic structures; not raw Core outputs |
| Evidence deep-link bundles | L5 (assembled from L2 ENL references) | Must preserve L2 evidence navigation paths |
| Topology highlight payloads | L5 (from L3-derived structural states) | Must not recompute structural states |
| Module/panel payloads | L5 assembly | Must carry lineage from L3/L4 origin |

### I3.2 — Rendering Constraints

42.x is a rendering and interaction consumer only. It:
- Renders assembled payloads
- Navigates evidence deep links
- Displays condition and diagnosis outputs in structured form
- Does not recompute, reinterpret, or reframe content

### I3.3 — Evidence Preservation

42.x must:
- Display UNDEFINED/PARTIAL states explicitly — no silent substitution with placeholders
- Display INSUFFICIENT_WINDOWS explicitly — not render as zero or empty
- Preserve evidence deep-link references — not strip them from rendered views
- Not introduce new data values in the rendered layer

### I3.4 — Traceability Requirements

42.x rendered outputs must:
- Be traceable to the L5 payload that sourced them
- Not introduce data not present in the L5 payload
- Carry run_id from the originating Core run in any durable rendered output

### I3.5 — Forbidden at I3

| Forbidden Operation | Reason |
|---|---|
| Accessing Core outputs (40.5–40.11) directly | 42.x must consume only L5-assembled payloads |
| Accessing 40.4 telemetry directly | Raw telemetry is below the 42.x input boundary |
| Recomputing signals, conditions, or diagnosis | Derivation belongs at L3; 42.x is L6 |
| Modifying evidence bindings for display convenience | Evidence First; display must not alter truth claims |
| Feeding back rendered state into Core or Semantic layers | No reverse flow at this boundary |
| Substituting UNDEFINED with zero, null display, or placeholder values without declaration | Silent PARTIAL suppression is forbidden |
| SSZ/SSI computation in runtime (utils/ssz.js pattern) | DRIFT-001: SSZ/SSI derivation belongs at L3, not L6 |

### I3.6 — Failure Conditions at I3

| Condition | Response |
|---|---|
| L5 payload missing | 42.x must render explicit unavailable state — not fallback silently |
| PARTIAL flag absent in payload but evidence gap known | 42.x must not proceed; escalate to governance |
| Run ID absent from payload | 42.x must not render without traceability anchor |
| Signal value in payload inconsistent with ESI manifest | 42.x must surface discrepancy — not render silently |
