# CE.3 — Signal Boundary Assessment

**Stream:** CE.3 — Signal Repair Boundary Definition
**Artifact type:** ASSESSMENT
**Date:** 2026-04-02
**Input:** `signal_blockage_analysis.md`, `signal_failure_classification.md`

---

## 1. ASSESSMENT QUESTION

Does the pattern of SIG-003 and SIG-006 blockage, and the cascade to SIG-007 and SIG-008,
constitute a new governance boundary that CE.2 does not cover? Is CE.3 a necessary and
valid new boundary?

---

## 2. CE.2 GOVERNANCE SCOPE (ESTABLISHED)

CE.2 governs the 40.6 → 40.10 activation chain under DEC-001 through DEC-014.

CE.2 decisions explicitly cover:
- Signal → condition binding (DEC-010, DEC-012, DEC-013)
- BLOCKED signal handling at 40.6 (DEC-013: NULL_CHECK evaluation → BLOCKED tier)
- Tier vocabulary (DEC-011)
- Multi-signal conflict resolution (DEC-009: max-tier)
- Tier → activation mapping (DEC-014: AT_RISK/DEGRADED→ACTIVE, STABLE→INACTIVE, BLOCKED→BLOCKED)
- Downstream propagation through 40.7 → 40.8 → 40.9 → 40.10

CE.2 scope begins at 40.6. It accepts signal outputs from 40.5 as-is. It defines no rules
governing signal state (COMPLETE / PARTIAL / BLOCKED) at the 40.5 emission boundary.

---

## 3. WHAT CE.2 DOES NOT COVER

CE.2 handles a BLOCKED signal arriving at 40.6 correctly — it assigns BLOCKED tier via
`BR-NULL-SIGNAL-BLOCKED`. This is downstream handling of an already-blocked signal.

CE.2 does not govern:

1. **Signal completeness at 40.5** — no rule defines what conditions must be met for a
   signal to emit COMPLETE vs PARTIAL vs BLOCKED.

2. **Repair eligibility** — no rule defines when a BLOCKED signal may be repaired, what
   constitutes valid repair, or what scope changes are required.

3. **Formula completeness** — no rule requires that a signal computation function implement
   a formula capable of producing a numeric output for all defined input states.

4. **Temporal class constraints** — no rule governs which variable classes (TIME_SERIES,
   EVENT_BASED, STRUCTURAL) are permissible under which execution contexts.

5. **Input specification completeness** — no rule requires that all declared variables in a
   signal computation function are either available in the current execution context or
   explicitly handled as data-class constraints.

6. **Documentation alignment** — no rule requires that 40.5 documentation and the 40.5
   engine implementation reference the same run context.

---

## 4. ISOLATION TEST — IS THIS A SINGLE-SIGNAL DEFECT?

**Result: NO.**

Two independent root causes are present:

| Root cause | Signal | Failure class | Variable class |
|---|---|---|---|
| Time-series inputs structurally absent + no formula in else branch | SIG-003 | DATA ABSENCE + STRUCTURAL IMPOSSIBILITY | TIME_SERIES (VAR_AT_001, VAR_AT_002) |
| Event-based inputs structurally absent; unconditional block | SIG-006 | UNCONDITIONAL BLOCK | EVENT_BASED (VAR_AT_007, VAR_AT_009, VAR_DT_007, VAR_DT_008) |

SIG-003 and SIG-006 block for different reasons (TIME_SERIES vs EVENT_BASED), against
different variable groups, with different failure classes. They share no inputs and no
code path.

A single-signal defect would be: one signal fails, the cause is isolated, the fix is
contained. Here two signals fail independently, with different failure classes that require
different resolution paths. This is a structural pattern, not a point defect.

---

## 5. BOUNDARY DETERMINATION

The blockage pattern reveals a gap between two existing boundaries:

**40.4 boundary (telemetry intake):** Defines variables, their temporal classifications,
and their values where static. Does not define what signal states will result from the
absence of time-series or event-based variables.

**40.6 boundary (CE.2 activation):** Receives signal outputs and applies binding rules.
Handles BLOCKED signals correctly downstream. Does not govern why signals are blocked or
whether they can be repaired.

Between 40.4 and 40.6 sits 40.5 (Signal Computation). 40.5 currently has no governed
boundary. No decision ledger exists for:
- Signal completeness rules
- Formula presence requirements
- Temporal class constraints
- Repair semantics
- Documentation alignment requirements

**CE.3 defines this boundary.** Its scope is 40.5 signal emission — the rules and
constraints that determine when a signal is permitted to emit BLOCKED and what must be
true for it to emit COMPLETE or PARTIAL.

---

## 6. CE.3 NECESSITY VERDICT

**YES — CE.3 is a necessary and valid new boundary.**

**Justification:**

1. The failure pattern (DATA ABSENCE + STRUCTURAL IMPOSSIBILITY + UNCONDITIONAL BLOCK)
   cannot be resolved under CE.2 governance. CE.2 correctly routes BLOCKED signals
   downstream — it does not prevent them.

2. The pattern is multi-signal and involves two independent root causes with different
   failure classes. Addressing either alone is insufficient.

3. The 40.5 boundary has no governing ledger. No decisions define signal completeness,
   formula requirements, or repair eligibility. This is a verified governance gap, not
   an inference.

4. The documentation misalignment (40.5 docs for run_01_blueedge; engine for
   run_02_ce_validation) constitutes a gap in the evidentiary record that CE.3
   must close. See `governance_gap_report.md`.

5. SIG-007 and SIG-008 are collateral PARTIAL signals. Their resolution is dependent on
   CE.3 addressing their root-cause upstream signals. They require no independent
   boundary — they inherit CE.3's resolution scope.

---

## 7. CE.3 BOUNDARY DEFINITION

**Boundary name:** CE.3 — Signal Repair Boundary
**Layer:** 40.5 (Signal Computation)
**Scope:** Rules governing signal emission state (COMPLETE / PARTIAL / BLOCKED), formula
presence requirements, temporal class constraints, repair eligibility criteria, and
documentation alignment for the 40.5 → 40.6 handoff.

**Upstream dependency:** CE.2 — provides the 40.6 activation model CE.3 feeds into.
**Downstream dependency:** None — CE.3 governs the 40.5 emission surface only.

**Minimum CE.3 decisions required:**
- Signal completeness definition (what constitutes COMPLETE vs PARTIAL vs BLOCKED)
- Formula presence rule (no signal computation function may return BLOCKED without
  an explicit formula in the non-blocking branch)
- Temporal class eligibility rule (per execution context)
- Repair semantics (what constitutes a valid repair of a BLOCKED signal)
- Documentation alignment requirement (40.5 docs and engine must reference same run context)
