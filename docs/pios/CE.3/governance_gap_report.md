# CE.3 — Governance Gap Report

**Stream:** CE.3 — Signal Repair Boundary Definition
**Artifact type:** GAP REPORT
**Date:** 2026-04-02
**Scope:** 40.5 (Signal Computation) governance gaps and documentation misalignment

---

## 1. PURPOSE

This document enumerates the governance constructs missing from the PiOS v0.1 engine
at the 40.5 boundary, identifies the documentation misalignment between 40.5 documentation
and the active engine implementation, and states what must be defined to close each gap.

---

## 2. MISSING GOVERNANCE CONSTRUCTS

### Gap G-001 — No Signal Completeness Rule

**Description:** No decision governs what conditions determine whether a signal emits
`state=COMPLETE`, `state=PARTIAL`, or `state=BLOCKED`. The three states are used in the
engine but are undefined by any governing decision.

**Current behavior:** Each signal computation function independently returns a state value
based on implicit logic embedded in the function body. No cross-signal consistency rule
exists. No contract specifies what inputs must be resolved for a signal to be COMPLETE.

**Required construct:** A decision defining the signal completeness contract — the set of
conditions under which each emission state is valid, and what the downstream 40.6 system
is entitled to expect from each state.

**Impact:** Without this rule, the BLOCKED state at 40.5 is ungoverned. CE.2 handles
BLOCKED signals correctly at 40.6, but CE.2 cannot distinguish a signal that is
incidentally BLOCKED (data gap) from one that is permanently BLOCKED (no formula).

---

### Gap G-002 — No Formula Presence Requirement

**Description:** No rule requires that a signal computation function implement a formula
capable of producing a non-UNDEFINED output when all declared inputs are available.

**Current behavior:** `compute_sig_003` branch 2 (else) returns BLOCKED with UNDEFINED
output and no formula. If VAR_AT_001 and VAR_AT_002 were supplied, the function would
still return BLOCKED. This is a specification incompleteness — the formula for SIG-003
(Change Concentration) from the time-series inputs is not defined or implemented.

`compute_sig_006` is an unconditional BLOCKED return with no formula present. While this
may be intentional for the static execution context, there is no rule governing whether
this is an accepted state or a required resolution target.

**Required construct:** A decision specifying that every signal computation function must
implement a complete formula path for the non-BLOCKED execution context, or explicitly
classify the signal as EXECUTION_CONTEXT_BLOCKED with a defined resolution criterion.

**Impact:** Without this rule, a STRUCTURAL IMPOSSIBILITY (formula absent) is
indistinguishable at the governance level from a DATA ABSENCE (formula present, inputs
absent). These require different resolution paths.

---

### Gap G-003 — No Temporal Class Constraint Rule

**Description:** No rule governs which variable temporal classes (TIME_SERIES, EVENT_BASED,
STRUCTURAL) are permissible inputs in which execution contexts. No rule defines what
happens when a signal's required inputs belong to a temporal class not available in the
current execution context.

**Current behavior:** TIME_SERIES variables (VAR_AT_001, VAR_AT_002) and EVENT_BASED
variables (VAR_AT_007, VAR_AT_009, VAR_DT_007, VAR_DT_008) are declared UNDEFINED in
the static 40.4 context. The engine represents this correctly. No rule declares that this
is an expected boundary condition, nor does any rule specify what must be true before a
time-series-dependent signal is eligible for evaluation.

**Required construct:** A decision classifying execution contexts (static, event-driven,
time-series) and declaring which signal classes are computable in each context. This
provides the basis for signal repair eligibility determination.

---

### Gap G-004 — No Repair Semantics

**Description:** No rule defines what constitutes a "repair" of a BLOCKED signal, what
changes are required, or what validation is required before a repaired signal can be used
in downstream activation.

**Current behavior:** BLOCKED signals propagate to 40.6 and receive BLOCKED tier via
BR-NULL-SIGNAL-BLOCKED. No mechanism exists for signaling that a BLOCKED signal has been
repaired, or for re-evaluating conditions that were previously blocked.

**Required construct:** A decision defining repair eligibility (which failure classes admit
repair), repair evidence requirements, and the protocol for introducing a repaired signal
into the active pipeline.

---

### Gap G-005 — No Null-Handling Guarantee at Emission

**Description:** No rule guarantees that a BLOCKED signal emits a specific null contract
to 40.6. The engine uses `output=UNDEFINED` (Python None) consistently, but no governed
rule specifies this as a requirement. The downstream binding rule `BR-NULL-SIGNAL-BLOCKED`
in CE.2 depends on the BLOCKED signal emitting a null output field — this dependency is
undocumented as a contract obligation on the 40.5 side.

**Required construct:** A decision specifying that state=BLOCKED signals must emit
`output=None` (or the canonical UNDEFINED equivalent) and must not emit partial numeric
output that could be misread by downstream binding rules.

---

## 3. DOCUMENTATION MISALIGNMENT

### Gap D-001 — 40.5 Documentation References Wrong Run Context

**Description:** The canonical 40.5 documentation artifacts in `docs/pios/40.5/` are
authored for `run_01_blueedge` (BlueEdge Fleet Management Platform v3.23.0). The active
engine implementation in `pios/core/v0.1/engine/compute_signals.py` is materialized from
`run_02_ce_validation`.

These are distinct run contexts with incompatible signal semantics, variable schemas,
and entity mappings.

| Artifact | Actual run context | Engine run context | Aligned? |
|---|---|---|---|
| `docs/pios/40.5/signal_computation_specification.md` | run_01_blueedge | run_02_ce_validation | NO |
| `docs/pios/40.5/signal_input_matrix.md` | run_01_blueedge | run_02_ce_validation | NO |
| `docs/pios/40.5/signal_output_set.md` | run_01_blueedge | run_02_ce_validation | NO |
| `docs/pios/40.5/signal_traceability_map.md` | run_01_blueedge | run_02_ce_validation | NO |

**Specific mismatches (run_01_blueedge vs run_02_ce_validation):**

| Dimension | run_01_blueedge | run_02_ce_validation |
|---|---|---|
| SIG-001 | Backend Process Heap Usage | Coordination Pressure (CKR-006) |
| SIG-002 | Cache Hit Efficiency | Dependency Load (CKR-007) |
| SIG-003 | Cache Connectivity State | Change Concentration (CKR-008) |
| SIG-006 | Sensor Bridge Batch Throughput Rate | Execution Stability (CKR-011) |
| Variable prefix | VAR_SYS_*, VAR_CACHE_*, VAR_EVT_*, VAR_WS_* | VAR_ST_*, VAR_AT_*, VAR_DT_* |
| SIG-003 blocking cause | VAR_CACHE_003 (Prometheus scrape unavailable) | VAR_AT_001, VAR_AT_002 (time-series absent) |

The `docs/pios/40.5/` artifacts have zero evidentiary value for the active engine. Any
analysis referencing these documents against `compute_signals.py` behavior will reach
incorrect conclusions about signal formulas, input dependencies, and blockage causes.

**Required construct:** CE.3 must require production of canonical 40.5 documentation for
run_02_ce_validation, or must formally designate `compute_signals.py` as the authoritative
specification for 40.5 behavior in the run_02 context with no reference to the run_01
documents.

---

### Gap D-002 — No Canonical 40.5 Documentation for run_02_ce_validation

**Description:** The engine `compute_signals.py` references six source artifacts in its
header comment (signal_computation_specification.md, signal_input_matrix.md,
signal_output_set.md, signal_traceability_map.md, signal_validation_report.md,
execution_manifest.md) from `runs/pios/40.5/run_02_ce_validation/`. These are run
artifacts, not governed documentation. No canonical governed documentation exists for
the run_02 signal set.

**Required construct:** Governed 40.5 documentation for run_02_ce_validation must be
produced and classified as authoritative, distinct from the run_01_blueedge documents.

---

## 4. GAP INVENTORY

| ID | Category | Title | Severity |
|---|---|---|---|
| G-001 | Governance | No signal completeness rule | CRITICAL |
| G-002 | Governance | No formula presence requirement | CRITICAL |
| G-003 | Governance | No temporal class constraint rule | HIGH |
| G-004 | Governance | No repair semantics | HIGH |
| G-005 | Governance | No null-handling guarantee at emission | MEDIUM |
| D-001 | Documentation | 40.5 docs reference wrong run context | CRITICAL |
| D-002 | Documentation | No canonical 40.5 docs for run_02_ce_validation | HIGH |

Total gaps: 7 (4 CRITICAL/HIGH governance, 1 MEDIUM governance, 2 documentation).

All 7 gaps fall within the CE.3 boundary scope. None can be resolved under CE.2.
