# Baseline Comparison Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01  
Status: PLANNING — no execution performed  
Baseline: pios-baseline-v1.0-blueedge-authoritative

---

## Purpose

Define how the second-client PiOS → GAUGE → LENS → sellable projection run will be
compared against the locked baseline. This plan establishes what to compare, what to
expect to differ, and what must remain structurally invariant regardless of client-specific
evidence — at both the derivation layer and the projection layer.

---

## 1. Code Tag Reference

| Item | Value |
|---|---|
| Tag | `pios-baseline-v1.0-blueedge-authoritative` |
| Branch at lock | `feature/lens-vnext-product-definition-01` |
| Verification | `git show pios-baseline-v1.0-blueedge-authoritative --stat` |

The second-client run must execute from the same code tag or a formally promoted successor.
No code changes between baseline tag and second-client execution without explicit amendment.

---

## 2. Baseline Capsule Reference

| Item | Value |
|---|---|
| Path | `docs/baseline/pios_baseline_v1.0.md` |
| Status | IMMUTABLE — must not be modified |
| Canonical metrics | Domains: 17, Capabilities: 42, Components: 89, CEUs: 30 |
| Canonical score | 60 |
| Projected score | 100 |

The capsule values are **BlueEdge-specific**. They define the reference point, not a required
target. Second-client metrics will differ — this is expected and not a failure condition.

---

## 3. BlueEdge Reference Run Path

| Item | Value |
|---|---|
| Run path | `clients/blueedge/psee/runs/run_authoritative_recomputed_01/` |
| Lock file | `clients/blueedge/psee/runs/run_authoritative_recomputed_01/BASELINE_LOCK` |
| Artifacts | BASELINE_LOCK, coherence_record.json, intake_record.json, package/ |

The BlueEdge reference run is read-only reference material. It must not be modified or used
as input to the second-client run. Any comparison is structural — not value-matching.

---

## 4. Canonical Metrics Comparison Framework

| Metric | BlueEdge Baseline | Second-Client Expectation | Comparison Rule |
|---|---|---|---|
| Domains | 17 | Client-specific — to be derived | Must be evidence-derived; value will differ |
| Capabilities | 42 | Client-specific | Must be evidence-derived; value will differ |
| Components | 89 | Client-specific | Must be evidence-derived; value will differ |
| CEUs | 30 | Client-specific | Must be evidence-derived; value will differ |
| Canonical score | 60 | Client-specific | Must fall within valid score range (0–100) |
| Projected score | 100 | Client-specific | Must be derivable from evidence chain |

**Structural invariants** (must hold regardless of client):
- Score derivation formula unchanged
- Domain classification logic unchanged
- CEU computation unchanged
- Evidence chain traceable to raw source

---

## 5. GAUGE Score Behavior

| Behavior | Expected |
|---|---|
| Score range | 0–100 |
| Score basis | Canonical score derived from second-client evidence only |
| S4 gate | GAUGE proceeds to S4 only after validated S2 outputs |
| Decision state | PROCEED / INVESTIGATE / ESCALATE — derived, not preset |
| Stop condition | GAUGE stops at STEP 12/S4 per baseline model |

GAUGE behavior must be structurally identical to BlueEdge run. Client-specific inputs will
produce different scores — this is correct behavior, not regression.

---

## 6. Evidence Governance Rules

| Rule | Description |
|---|---|
| Evidence First | No output without traceable evidence |
| No carry-forward | No BlueEdge evidence documents used in second-client run |
| Isolated intake record | New `intake_record.json` written for second-client run |
| Validated handoff | 40.4 handoff must be validated before Core execution begins |
| No synthetic data | All evidence from actual client source — no placeholders |
| Coherence record | New `coherence_record.json` produced for second-client run |
| Determinism | Same evidence → same output on rerun |

---

## 7. Comparison Execution Sequence

1. Confirm code tag matches baseline
2. Confirm no BlueEdge paths in second-client run scripts
3. Execute S0–S1 against new evidence
4. Compare intake_record.json structure (not values) against BlueEdge reference
5. Execute S2–S4
6. Compare GAUGE behavior (step execution, decision state derivation) against baseline model
7. Generate LENS projection — verify portability against `lens_projection_portability_plan.md`
8. Record deviations — expected client-specific differences vs. unexpected structural deviations
9. Pass/fail against validation_matrix.md

---

## 8. Projection-Level Comparison

Comparison at the LENS output layer is behavioral, not content-matching.

| Check | Baseline behavior | Second-client expectation | Rule |
|---|---|---|---|
| Report generated | BlueEdge report generated from BlueEdge evidence | Second-client report generated from second-client evidence | Generator must not require BlueEdge inputs |
| No BlueEdge labels in output | N/A (BlueEdge run is the baseline) | Zero BlueEdge-specific labels, paths, or names | Hard requirement |
| Decision state present | PROCEED / INVESTIGATE / ESCALATE | Same output vocabulary | Vocabulary is canonical — not client-specific |
| Executive readability | BlueEdge report is executive-readable | Second-client report is executive-readable | Qualitative check by reviewer |
| Report structure | BlueEdge report structure | Same structure produced from different evidence | Structure is portable — not evidence-bound |

BlueEdge metrics are reference expectations only. Second-client output must not inherit
BlueEdge-specific content, wording, or structural assumptions.

---

## 9. Security Baseline Note

RBAC and audit logging are not implemented in the baseline (`pios-baseline-v1.0-blueedge-authoritative`).

The second-client run must:
- Document where RBAC roles would apply across the pipeline
- Document where audit events would fire
- Not implement these — only identify and document attachment points

This documentation constitutes the security comparison baseline for future implementation streams.
Reference: `security_audit_architecture_plan.md`
