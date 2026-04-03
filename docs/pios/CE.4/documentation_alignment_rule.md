# CE.4 — Documentation Alignment Rule

**Stream:** CE.4 — PiOS Signal Emission Contract Definition
**Artifact type:** GOVERNANCE RULE (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.3 `governance_gap_report.md` (D-001, D-002), `signal_emission_surface_assessment.md`
**Authority:** CE.4
**Resolves:** D-001 (documentation misalignment), D-002 (absent canonical documentation for run_02_ce_validation)

---

## 1. PURPOSE

This document defines the authoritative rule for documentation alignment at 40.5.
It formally resolves CE.3 governance gaps D-001 and D-002.

---

## 2. GOVERNANCE GAP RESTATEMENT

**D-001 (as established in CE.3 governance_gap_report.md):**
The four canonical 40.5 documentation artifacts in `docs/pios/40.5/` are authored for
`run_01_blueedge` (BlueEdge Fleet Management Platform v3.23.0). The active 40.5 engine
(`pios/core/v0.1/engine/compute_signals.py`) is materialized from `run_02_ce_validation`.
These are distinct run contexts with incompatible signal semantics, variable schemas,
and entity mappings. The `docs/pios/40.5/` artifacts have zero evidentiary value for
the active engine.

Affected documents:
- `docs/pios/40.5/signal_computation_specification.md` — run_01_blueedge
- `docs/pios/40.5/signal_input_matrix.md` — run_01_blueedge
- `docs/pios/40.5/signal_output_set.md` — run_01_blueedge
- `docs/pios/40.5/signal_traceability_map.md` — run_01_blueedge

**D-002 (as established in CE.3 governance_gap_report.md):**
No canonical governed documentation exists for the run_02_ce_validation signal set.
The engine header references source artifacts from `runs/pios/40.5/run_02_ce_validation/`
(run artifacts, not governed documentation). No `docs/pios/` canonical documentation
covers the PiOS structural signal semantics (SIG-001 through SIG-008 as Coordination
Pressure, Dependency Load, Change Concentration, etc.).

---

## 3. THE DOCUMENTATION ALIGNMENT RULE

### Rule DA-001 — Documentation-Engine Run Context Binding

**Rule:** Every canonical documentation artifact in `docs/pios/40.5/` MUST explicitly
identify the run context it describes. A documentation artifact that does not identify
its run context, or that identifies a run context different from the active engine
implementation, is classified as MISALIGNED and MUST NOT be cited as authoritative
evidence for current engine behavior.

**Enforcement:** A documentation artifact is ALIGNED if and only if:
1. It explicitly names the run context (e.g., "run_02_ce_validation") in its header
2. The run context it names matches the `derivation_run` field in the engine's output
   (currently `"derivation_run": "run_02_ce_validation"` in signal_output.json)
3. The signal IDs, variable names, semantic labels, and formulas in the document match
   those in the engine source

**Current state:** All four `docs/pios/40.5/` documents are MISALIGNED — they identify
run_01_blueedge, not run_02_ce_validation. Signal Ledger entries for all 8 signals carry
`documentation_status: ABSENT` because no ALIGNED documentation exists.

---

### Rule DA-002 — Separation of Run Context Documentation

**Rule:** Documentation artifacts for distinct run contexts MUST be stored in separate
directories or explicitly namespaced. Documentation for run_01_blueedge and documentation
for run_02_ce_validation must not coexist in `docs/pios/40.5/` without explicit run context
namespacing.

**Required resolution:**
The current `docs/pios/40.5/` documents for run_01_blueedge MUST either:
- Be moved to a namespaced path (e.g., `docs/pios/40.5/run_01_blueedge/`) and marked
  as historical, non-authoritative for the current engine; OR
- Be retained in place with explicit header annotations identifying them as run_01_blueedge
  artifacts and declaring them non-authoritative for run_02_ce_validation

Either approach requires that `docs/pios/40.5/` does not present run_01_blueedge documents
as the default canonical reference without qualification.

---

### Rule DA-003 — Canonical Documentation Requirement for Active Engine

**Rule:** The active 40.5 engine implementation (currently run_02_ce_validation) MUST have
corresponding canonical documentation in `docs/pios/40.5/` before any downstream governance
stream may cite 40.5 documentation as evidence.

The required document set for run_02_ce_validation mirrors the existing run_01_blueedge set:
- `signal_computation_specification.md` — formulas, output fields, state per signal
- `signal_input_matrix.md` — variable registry with temporal class and values
- `signal_output_set.md` — output schema per signal, blocking dependencies
- `signal_traceability_map.md` — formula-to-variable traceability per output field

Additionally, CE.4 introduces a new required document type:
- `signal_ledger.md` (or equivalent) — as defined in `signal_ledger_specification.md`

Until these documents exist, the `documentation_status` field in all Signal Ledger entries
remains ABSENT and `governance_status` remains PARTIALLY_GOVERNED.

---

### Rule DA-004 — Engine Source as Interim Authoritative Reference

**Rule:** In the absence of ALIGNED canonical documentation (D-002 unresolved),
the engine source `pios/core/v0.1/engine/compute_signals.py` is the authoritative
reference for 40.5 behavior. Any analysis of 40.5 emission behavior MUST be grounded in
the engine source, not in the `docs/pios/40.5/` documents.

This rule is an interim provision. It remains in force until DA-003 is satisfied and
canonical run_02_ce_validation documentation is produced and verified as ALIGNED.

**Scope of interim authority:**
DA-004 grants interim authority only for describing what the engine currently does.
It does not grant authority for prescribing what the engine should do — that is the
domain of CE.4 governance contracts.

---

### Rule DA-005 — Run Artifact vs Canonical Documentation Distinction

**Rule:** Run artifacts in `runs/pios/40.5/` (signal_output.json, execution_manifest.json,
etc.) are evidence of what the engine produced in a specific invocation. They are NOT
canonical documentation. Run artifacts may be cited as evidence of runtime behavior;
they may not be cited as the authoritative specification of signal semantics or formulas.

The engine header comment referencing `runs/pios/40.5/run_02_ce_validation/` source
artifacts does not constitute canonical documentation. Those run artifacts describe a
past materialization. Canonical documentation must be authored and governed explicitly.

---

## 4. RESOLUTION STATUS

| Gap | Rule | Resolution | Status |
|---|---|---|---|
| D-001 (misaligned docs) | DA-001, DA-002 | Define alignment criteria; namespace or annotate run_01_blueedge docs | RULE DEFINED — implementation pending |
| D-002 (absent run_02 docs) | DA-003, DA-004 | Require canonical documentation; grant interim engine authority | RULE DEFINED — documentation production pending |

These rules define the governance obligation. The actual production of canonical
run_02_ce_validation documentation is a downstream implementation task outside CE.4 scope.

---

## 5. BOUNDARY STATEMENT

This rule governs documentation alignment at 40.5 only. It does not:
- Govern documentation alignment at other pipeline layers
- Define the content of run_02_ce_validation documentation (that is derived from the engine and run artifacts)
- Modify the run_01_blueedge documents (they may be retained as historical evidence)

---

## 6. CONCLUSION

D-001 and D-002 are resolved at the governance rule level by DA-001 through DA-005.
The rules establish: documentation-engine run context binding is mandatory; misaligned
docs must be namespaced or annotated; canonical docs must be produced for the active
engine; the engine source is interim authoritative until canonical docs exist; run
artifacts are not canonical documentation. Implementation of these rules (moving/annotating
run_01_blueedge docs, producing run_02_ce_validation canonical docs) is a subsequent
stream responsibility.
