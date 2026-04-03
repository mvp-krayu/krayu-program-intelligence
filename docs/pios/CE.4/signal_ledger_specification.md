# CE.4 — Signal Ledger Specification

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** LEDGER SPECIFICATION (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** `signal_computability_governance.md`, `signal_emission_contract_specification.md`, `dependency_propagation_rules.md`, CE.3 governance gap report (G-001 through G-005)
**Authority:** CE.4

---

## 1. PURPOSE

This document defines the canonical structure of the Signal Ledger — the governing
registry that formally defines all signals in the PiOS 40.5 signal set. The Signal Ledger
is a new governance object introduced by CE.4. It does not exist in PiOS v0.1 or v0.2.

The Signal Ledger is the authoritative source for signal identity, computability class,
emission constraints, and governance status. No signal may participate in 40.5 computation
unless it is registered in the Signal Ledger.

---

## 2. GOVERNANCE ROLE

The Signal Ledger serves three functions:

1. **Registry function:** Canonical record of all governed signals — their identifiers,
   semantics, and governing constraints.

2. **Computability contract function:** Specifies for each signal what computability class
   it holds, what inputs are required, and what emission states are valid.

3. **Governance status function:** Records whether each signal's specification is complete,
   what documentation supports it, and whether any open governance gaps affect it.

---

## 3. REQUIRED FIELDS PER SIGNAL ENTRY

### Identity fields (required for all signals)

| Field | Type | Description |
|---|---|---|
| `signal_id` | string | Canonical identifier, format SIG-NNN |
| `signal_name` | string | Human-readable canonical name |
| `governing_layer` | string | PiOS layer that computes this signal (currently: "40.5") |
| `semantic_intent` | string | One-sentence description of what this signal measures |
| `ckr` | string | Canonical Knowledge Reference (e.g., CKR-008) |

### Computability fields (required for all signals)

| Field | Type | Allowed values | Description |
|---|---|---|---|
| `computability_class` | enum | CC-001, CC-002, CC-003, CC-004, CC-005 | Classification per `signal_computability_governance.md` |
| `formula_presence` | boolean | true, false | Whether a complete computation formula exists in all non-blocked execution paths |
| `formula_reference` | string or null | Path to governing specification document | Required if `formula_presence=true`; null if `formula_presence=false` |

### Input fields (required for all signals)

| Field | Type | Description |
|---|---|---|
| `required_inputs` | array | Variable IDs (VAR_*) or signal IDs (SIG-*) required for any output |
| `optional_inputs` | array | Variable IDs or signal IDs that improve output but are not required |
| `dependency_inputs` | array | Upstream signal IDs (for CC-004 derived signals; empty for primitive signals) |
| `input_temporal_classes` | object | Per required input: `{"VAR_ID": "STRUCTURAL|EVENT_BASED|TIME_SERIES"}` |

### Emission contract fields (required for all signals)

| Field | Type | Description |
|---|---|---|
| `allowed_emission_states` | array | Subset of [COMPLETE, PARTIAL, BLOCKED, COMPUTABLE_PENDING] — states this signal may legitimately emit |
| `invalid_emission_states` | array | States this signal MUST NOT emit |
| `primary_emission_state` | enum | The expected emission state in the static 40.4 execution context |

### Blockage and partiality rules (required unless computability_class=CC-001)

| Field | Type | Description |
|---|---|---|
| `blockage_rules` | array | Conditions under which this signal emits BLOCKED; each entry references a failure class |
| `partiality_rules` | array | Conditions under which this signal emits PARTIAL; each entry identifies which output fields may be null and why |
| `undefined_rules` | object | Per output field: conditions under which the field is null and what failure class applies |

### Traceability fields (required for all signals)

| Field | Type | Description |
|---|---|---|
| `traceability_requirements` | object | Per output field: the governing formula or specification reference |
| `derivation_run` | string | The canonical run context from which this signal was materialized (e.g., "run_02_ce_validation") |
| `specification_document` | string or null | Path to canonical signal specification document for this signal in its derivation run context |

### Downstream consumption constraints (required for all signals)

| Field | Type | Description |
|---|---|---|
| `downstream_consumption_constraints` | object | Per consuming layer: what states and fields may be consumed and how |

### Governance status fields (required for all signals)

| Field | Type | Description |
|---|---|---|
| `documentation_status` | enum | ALIGNED, MISALIGNED, ABSENT | Whether canonical documentation exists and matches the engine for this signal's derivation run |
| `governance_status` | enum | GOVERNED, PARTIALLY_GOVERNED, UNGOVERNED | Whether all required governance fields in this ledger entry are fully populated |
| `open_gaps` | array | IDs of open governance gaps from CE.3 or CE.4 that apply to this signal |

---

## 4. FIELD POPULATION RULES

**Rule SL-001:** Every signal in the 40.5 computation set MUST have a Signal Ledger entry.
A signal without a ledger entry is ungoverned and must not be used in production execution.

**Rule SL-002:** `formula_presence` MUST be false if the computation function has any
code path where `output=UNDEFINED` is returned without executing a formula. A signal
with `formula_presence=false` MUST have `computability_class=CC-005` (NON_COMPUTABLE).

**Rule SL-003:** `allowed_emission_states` MUST be consistent with `computability_class`:
- CC-001: allowed = [COMPLETE]; invalid = [PARTIAL, BLOCKED]
- CC-002: allowed = [COMPLETE, PARTIAL]; invalid = [BLOCKED] (except if all inputs absent)
- CC-003: allowed = [COMPLETE, BLOCKED]; invalid = [PARTIAL] (no partial output for pure time-series)
- CC-004: allowed = [COMPLETE, PARTIAL, BLOCKED]; invalid = [] (state depends on upstream)
- CC-005: allowed = [BLOCKED]; invalid = [COMPLETE, PARTIAL]

**Rule SL-004:** `specification_document` MUST reference a document in the derivation run
context of the signal. Documents from other run contexts (e.g., run_01_blueedge) MUST NOT
be referenced for signals in run_02_ce_validation. If no such document exists, the field
is null and `documentation_status` is set to ABSENT.

**Rule SL-005:** The Signal Ledger is versioned. A ledger version increment is required
whenever a signal's computability class, allowed emission states, or required inputs change.

---

## 5. SIGNAL LEDGER — INITIAL ENTRIES (PiOS v0.3)

The following entries define the governed state of all 8 signals at CE.4 closure.
Fields with value TBD require completion as part of a subsequent CE.4 implementation stream.

### SIG-001

```yaml
signal_id: SIG-001
signal_name: Coordination Pressure
governing_layer: "40.5"
semantic_intent: Measures the ratio of pipeline coordination edges to pipeline stages, with a runtime component for automation-driven pressure
ckr: CKR-006
computability_class: CC-002
formula_presence: true
formula_reference: runs/pios/40.5/run_02_ce_validation/ (signal_computation_specification)
required_inputs: [VAR_ST_012, VAR_ST_016, VAR_AT_007]
optional_inputs: []
dependency_inputs: []
input_temporal_classes:
  VAR_ST_012: STRUCTURAL
  VAR_ST_016: STRUCTURAL
  VAR_AT_007: EVENT_BASED
allowed_emission_states: [COMPLETE, PARTIAL]
invalid_emission_states: [BLOCKED]
primary_emission_state: PARTIAL
blockage_rules: []
partiality_rules:
  - output_field: runtime_component
    failure_class: F-1b
    cause: VAR_AT_007 EVENT_BASED, PENDING in static context
undefined_rules:
  runtime_component: {failure_class: F-1b, input: VAR_AT_007}
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [D-001, D-002]
```

### SIG-002

```yaml
signal_id: SIG-002
signal_name: Dependency Load
governing_layer: "40.5"
semantic_intent: Measures the ratio of dependency-bearing edges to total PEG nodes
ckr: CKR-007
computability_class: CC-001
formula_presence: true
formula_reference: runs/pios/40.5/run_02_ce_validation/
required_inputs: [VAR_ST_012, VAR_ST_013, VAR_ST_014, VAR_ST_015, VAR_ST_007]
optional_inputs: []
dependency_inputs: []
input_temporal_classes:
  VAR_ST_012: STRUCTURAL
  VAR_ST_013: STRUCTURAL
  VAR_ST_014: STRUCTURAL
  VAR_ST_015: STRUCTURAL
  VAR_ST_007: STRUCTURAL
allowed_emission_states: [COMPLETE]
invalid_emission_states: [PARTIAL, BLOCKED]
primary_emission_state: COMPLETE
blockage_rules: []
partiality_rules: []
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [D-001, D-002]
```

### SIG-003

```yaml
signal_id: SIG-003
signal_name: Change Concentration
governing_layer: "40.5"
semantic_intent: Measures the frequency and concentration of automated change events across push-to-main intervals
ckr: CKR-008
computability_class: CC-005
formula_presence: false
formula_reference: null
required_inputs: [VAR_AT_001, VAR_AT_002]
optional_inputs: []
dependency_inputs: []
input_temporal_classes:
  VAR_AT_001: TIME_SERIES
  VAR_AT_002: TIME_SERIES
allowed_emission_states: [BLOCKED]
invalid_emission_states: [COMPLETE, PARTIAL]
primary_emission_state: BLOCKED
blockage_rules:
  - failure_class: F-1a
    condition: VAR_AT_001 or VAR_AT_002 is UNDEFINED (TIME_SERIES absent in static context)
    blocking_class: F-1a
  - failure_class: F-2
    condition: All inputs supplied; else branch has no formula
    blocking_class: F-2
undefined_rules: {}
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [G-001, G-002, D-001, D-002]
```

### SIG-004

```yaml
signal_id: SIG-004
signal_name: Structural Volatility
governing_layer: "40.5"
semantic_intent: Measures density ratios of structural graph edges relative to PEG node count
ckr: CKR-009
computability_class: CC-001
formula_presence: true
formula_reference: runs/pios/40.5/run_02_ce_validation/
required_inputs: [VAR_ST_007, VAR_ST_009, VAR_ST_010, VAR_ST_011, VAR_ST_006]
optional_inputs: []
dependency_inputs: []
input_temporal_classes:
  VAR_ST_006: STRUCTURAL
  VAR_ST_007: STRUCTURAL
  VAR_ST_009: STRUCTURAL
  VAR_ST_010: STRUCTURAL
  VAR_ST_011: STRUCTURAL
allowed_emission_states: [COMPLETE]
invalid_emission_states: [PARTIAL, BLOCKED]
primary_emission_state: COMPLETE
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [D-001, D-002]
```

### SIG-005

```yaml
signal_id: SIG-005
signal_name: Execution Throughput
governing_layer: "40.5"
semantic_intent: Measures artifact delivery per pipeline stage, with a runtime completion factor
ckr: CKR-010
computability_class: CC-002
formula_presence: true
formula_reference: runs/pios/40.5/run_02_ce_validation/
required_inputs: [VAR_DT_001, VAR_DT_003, VAR_AT_005, VAR_DT_007]
optional_inputs: []
dependency_inputs: []
input_temporal_classes:
  VAR_DT_001: STRUCTURAL
  VAR_DT_003: STRUCTURAL
  VAR_AT_005: STRUCTURAL
  VAR_DT_007: EVENT_BASED
allowed_emission_states: [COMPLETE, PARTIAL]
invalid_emission_states: [BLOCKED]
primary_emission_state: PARTIAL
partiality_rules:
  - output_field: completion_factor
    failure_class: F-1b
    cause: VAR_DT_007 EVENT_BASED, PENDING in static context
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [D-001, D-002]
```

### SIG-006

```yaml
signal_id: SIG-006
signal_name: Execution Stability
governing_layer: "40.5"
semantic_intent: Measures pipeline stability through validation gate enforcement, feedback routing, completion status, and feedback delivery
ckr: CKR-011
computability_class: CC-005
formula_presence: false
formula_reference: null
required_inputs: [VAR_AT_007, VAR_AT_009, VAR_DT_007, VAR_DT_008]
optional_inputs: []
dependency_inputs: []
input_temporal_classes:
  VAR_AT_007: EVENT_BASED
  VAR_AT_009: EVENT_BASED
  VAR_DT_007: EVENT_BASED
  VAR_DT_008: EVENT_BASED
allowed_emission_states: [BLOCKED]
invalid_emission_states: [COMPLETE, PARTIAL]
primary_emission_state: BLOCKED
blockage_rules:
  - failure_class: F-2
    condition: Unconditional — no formula exists
    blocking_class: F-2
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [G-001, G-002, D-001, D-002]
```

### SIG-007

```yaml
signal_id: SIG-007
signal_name: ESI (Execution Stability Index)
governing_layer: "40.5"
semantic_intent: Composite index combining dependency load, throughput completion, and execution stability
ckr: CKR-014
computability_class: CC-004
formula_presence: true
formula_reference: runs/pios/40.5/run_02_ce_validation/
required_inputs: []
optional_inputs: []
dependency_inputs: [SIG-002, SIG-005, SIG-006]
allowed_emission_states: [COMPLETE, PARTIAL, BLOCKED]
invalid_emission_states: []
primary_emission_state: PARTIAL
partiality_rules:
  - output_field: sig_005_completion_factor_component
    failure_class: F-4
    upstream_signal: SIG-005
    upstream_field: completion_factor
  - output_field: sig_006_stability_component
    failure_class: F-3
    upstream_signal: SIG-006
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [D-001, D-002]
```

### SIG-008

```yaml
signal_id: SIG-008
signal_name: RAG (Risk Acceleration Gradient)
governing_layer: "40.5"
semantic_intent: Composite gradient combining coordination pressure, structural density, and change concentration
ckr: CKR-015
computability_class: CC-004
formula_presence: true
formula_reference: runs/pios/40.5/run_02_ce_validation/
required_inputs: []
optional_inputs: []
dependency_inputs: [SIG-001, SIG-003, SIG-004]
allowed_emission_states: [COMPLETE, PARTIAL, BLOCKED]
invalid_emission_states: []
primary_emission_state: PARTIAL
partiality_rules:
  - output_field: sig_003_change_concentration_component
    failure_class: F-3
    upstream_signal: SIG-003
documentation_status: ABSENT
governance_status: PARTIALLY_GOVERNED
open_gaps: [D-001, D-002]
```

---

## 6. MAINTENANCE RULES

**Rule SL-006:** The Signal Ledger MUST be updated whenever a signal's computability class,
formula presence, required inputs, or emission state contract changes. Ledger changes
require an explicit governance decision.

**Rule SL-007:** All signals in the ledger MUST have `governance_status=GOVERNED` before
a new PiOS version may claim full compliance with CE.4. PARTIALLY_GOVERNED entries are
acceptable during CE.4 initialization but must be resolved in subsequent streams.

**Rule SL-008:** `documentation_status=ABSENT` entries (currently all 8 signals) MUST be
resolved as part of the D-002 gap closure work defined in `documentation_alignment_rule.md`.

---

## 7. CONCLUSION

The Signal Ledger is defined with 18 required fields per entry (covering identity,
computability, inputs, emission contract, blockage/partiality rules, traceability,
downstream constraints, and governance status). Eight initial entries are populated for
the PiOS v0.1 signal set. All 8 entries currently have `governance_status=PARTIALLY_GOVERNED`
and `documentation_status=ABSENT` — both reflecting the pre-CE.4 state. The ledger
structure is the canonical governance object introduced by CE.4.
