# CE.3 — Boundary Decision

**Stream:** CE.3 — Signal Repair Boundary Definition
**Artifact type:** DECISION
**Date:** 2026-04-02
**Evidence base:**
  - `signal_blockage_analysis.md`
  - `signal_failure_classification.md`
  - `signal_boundary_assessment.md`
  - `governance_gap_report.md`

---

## DECISION

**CE.3 is a valid new governance boundary.**

**Result:** YES

---

## FINDING SUMMARY

Four analysis artifacts establish the following findings:

**Finding 1 — SIG-003 has dual failure (blockage analysis + classification):**
`compute_sig_003` blocks in branch 1 (DATA ABSENCE — VAR_AT_001 and VAR_AT_002 are
time-series variables structurally absent from static 40.4 telemetry) and in branch 2
(STRUCTURAL IMPOSSIBILITY — the else branch contains no formula; SIG-003 returns BLOCKED
with UNDEFINED output regardless of input state). Both failure classes must be resolved
for SIG-003 to reach COMPLETE.

**Finding 2 — SIG-006 is an unconditional block (blockage analysis + classification):**
`compute_sig_006` returns BLOCKED on every invocation with no formula and no conditional
logic. All four inputs (VAR_AT_007, VAR_AT_009, VAR_DT_007, VAR_DT_008) are event-based
and absent in the static context. This is UNCONDITIONAL BLOCK — distinct from DATA ABSENCE
because supplying the inputs would not enable the function to compute an output.

**Finding 3 — Two signals cascade to PARTIAL (blockage analysis):**
SIG-007 (ESI) is PARTIAL due to SIG-006 BLOCKED (`sig_006_stability_component=UNDEFINED`).
SIG-008 (RAG) is PARTIAL due to SIG-003 BLOCKED (`sig_003_change_concentration_component=UNDEFINED`).
Total affected signals: 4 of 8.

**Finding 4 — The failure pattern is structural, not a point defect (boundary assessment):**
SIG-003 and SIG-006 fail independently, for different reasons, with different failure classes,
against different variable groups. This is a multi-signal structural pattern requiring a
governed boundary, not a single-signal patch.

**Finding 5 — CE.2 does not cover this boundary (boundary assessment):**
CE.2 (DEC-001 through DEC-014) governs 40.6 → 40.10 activation. It handles BLOCKED signals
correctly downstream via BR-NULL-SIGNAL-BLOCKED. It does not govern signal completeness,
formula presence, temporal class constraints, or repair semantics at 40.5. The 40.5
boundary has no governing ledger.

**Finding 6 — Seven governance gaps confirmed (governance gap report):**
Five governance gaps (G-001 through G-005) and two documentation gaps (D-001, D-002) are
verified at the 40.5 boundary. The most critical: no signal completeness rule (G-001),
no formula presence requirement (G-002), and complete documentation misalignment between
40.5 docs (run_01_blueedge) and the active engine (run_02_ce_validation) (D-001).

---

## OWNERSHIP

CE.3 is owned at the **40.5 (Signal Computation)** boundary.

**Upstream dependency:** 40.4 (telemetry intake) — provides variable declarations and
static values that 40.5 consumes. CE.3 decisions must be consistent with 40.4 telemetry
classifications.

**Downstream dependency:** CE.2 (40.6 activation) — CE.3 defines what 40.5 emits; CE.2
defines what 40.6 does with it. CE.3 decisions must not alter CE.2 binding contracts.

**What CE.3 owns:**
- Signal completeness rules (what COMPLETE / PARTIAL / BLOCKED mean as governed states)
- Formula presence requirements (each signal computation function must have a formula path)
- Temporal class constraint rules (which variable classes are valid in which execution contexts)
- Repair semantics (eligibility, evidence requirements, re-introduction protocol)
- Null-handling guarantee at emission (BLOCKED signals must emit UNDEFINED output)
- Documentation alignment requirement (40.5 docs and engine must reference same run context)
- Production of canonical 40.5 documentation for run_02_ce_validation

**What CE.3 does not own:**
- 40.6 binding rules (owned by CE.2)
- 40.4 telemetry variable definitions (owned by 40.4)
- Downstream propagation through 40.7 → 40.10 (owned by CE.2)
- PiOS engine version decisions (owned by stream governance)

---

## MINIMUM DECISION LEDGER

CE.3 requires at minimum the following governing decisions:

| ID | Title | Priority |
|---|---|---|
| CE3-DEC-001 | Signal completeness contract — definition of COMPLETE / PARTIAL / BLOCKED emission states | CRITICAL |
| CE3-DEC-002 | Formula presence requirement — non-blocking branch must implement a computable formula | CRITICAL |
| CE3-DEC-003 | Temporal class eligibility — permissible variable classes per execution context | HIGH |
| CE3-DEC-004 | Repair eligibility — which failure classes admit repair and under what conditions | HIGH |
| CE3-DEC-005 | Null-handling contract at emission — BLOCKED signals must emit output=None | MEDIUM |
| CE3-DEC-006 | Documentation alignment requirement — 40.5 docs and engine must reference same run context | HIGH |

---

## SCOPE BOUNDARY STATEMENT

CE.3 governs the 40.5 signal emission surface: the rules that determine when a signal is
permitted to emit each state, what must be true at the function level, what temporal class
constraints apply, and what the evidentiary record must contain.

CE.3 does not expand, modify, or supersede CE.2. CE.2 remains the authoritative governing
ledger for 40.6 → 40.10.

CE.3 does not define repair implementations. It defines repair eligibility and evidence
requirements. Implementations are resolved in subsequent streams.

---

## STATUS

```
Boundary:     CE.3 — Signal Repair Boundary
Layer:        40.5 (Signal Computation)
Decision:     YES — valid new boundary
Date:         2026-04-02
Evidence:     4 analysis artifacts (signal_blockage_analysis.md,
              signal_failure_classification.md,
              signal_boundary_assessment.md,
              governance_gap_report.md)
Gaps closed:  0 of 7 (CE.3 decisions not yet authored)
Next step:    Author CE3-DEC-001 through CE3-DEC-006
```
