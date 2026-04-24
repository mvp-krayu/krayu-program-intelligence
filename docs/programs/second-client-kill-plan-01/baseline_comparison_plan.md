# Baseline Comparison Plan

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.KILL-PLAN.01  
Status: PLANNING — no execution performed  
Baseline: pios-baseline-v1.0-blueedge-authoritative

---

## Purpose

Define how the second-client run will be compared against the locked baseline. This plan
establishes what to compare, what to expect to differ, and what must remain structurally
invariant regardless of client-specific evidence.

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
7. Record deviations — expected client-specific differences vs. unexpected structural deviations
8. Pass/fail against validation_matrix.md
