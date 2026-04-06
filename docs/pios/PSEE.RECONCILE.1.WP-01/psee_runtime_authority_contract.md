# PSEE Runtime Authority Contract

**Document:** psee_runtime_authority_contract.md
**Stream:** PSEE.RECONCILE.1.WP-01
**Status:** CANONICAL
**Layer:** PSEE — Runtime Authority Definition

---

## 1. Principle

PSEE is the sole authority for all governed runtime evaluation outputs in the Krayu program intelligence pipeline.

No downstream system — including PiOS, UI surfaces, projection layers, or adapter layers — may produce, override, reinterpret, or repair PSEE runtime outputs.

PSEE runtime outputs are canonical at the point of production. Their authority persists through all downstream consumption.

---

## 2. Runtime Ownership Map

| Layer | Role | Ownership |
|---|---|---|
| IG.RUNTIME | Evidence package producer | READ-ONLY source for PSEE |
| PSEE | Runtime evaluator and score authority | OWNS all evaluation outputs |
| PSEE-GAUGE.0 | Scoring rule set | Authoritative locked reference |
| PiOS | Downstream intake and execution system | CONSUMER only — no mutation rights |
| UI / Adapter / Projection | Rendering and surface layers | CONSUMER only — no mutation rights |

---

## 3. Input Contract

PSEE MUST consume the following IG.RUNTIME artifacts as its sole evaluation inputs:

| Input | Required State | Authority |
|---|---|---|
| engine_state.json | psee_engine_invoked = true | Lifecycle gate |
| gauge_inputs.json | Present, schema-valid | DIM-03..06 source |
| coverage_state.json | state = COMPUTED | DIM-01 source |
| reconstruction_state.json | state IN {PASS, PARTIAL, FAIL} | DIM-02 source |
| PSEE-GAUGE.0 authority docs | Loaded and locked | Scoring rule authority |

PSEE MUST NOT accept any input that:
- originates from a non-IG.RUNTIME path
- carries a state not defined by the applicable DIM lifecycle
- has been mutated after IG.RUNTIME handoff sealing

---

## 4. Output Contract

PSEE MUST produce the following governed outputs:

| Output | Content | Authority |
|---|---|---|
| gauge_state.json | canonical_score, band_label, projected_score, confidence_band, all DIM states | PSEE-RUNTIME.5 |
| gauge_view.json | Rendered view of gauge_state.json | PSEE-RUNTIME render |
| coverage_state.json | DIM-01 coverage_percent, state, derivation | PSEE-RUNTIME.5A |
| reconstruction_state.json | DIM-02 state, axis_results, violations | PSEE-RUNTIME.6A |

All PSEE outputs MUST be:
- deterministic (identical inputs → identical outputs)
- traceable (all components reference explicit authority documents)
- immutable after production (no consumer may alter them)

---

## 5. Authority Rules

**Rule A-01 — Score Authority**
The canonical score exists ONLY in gauge_state.json produced by PSEE.
No other surface, file, or system may compute or claim score authority.

**Rule A-02 — Projection Authority**
Projected scores exist ONLY as derived values within gauge_state.json.
Projections are labeled with mandatory caveat and rule reference.
No downstream system may recompute or reassign projections.

**Rule A-03 — Confidence Authority**
Confidence bands exist ONLY in gauge_state.json.
No consumer may expand, compress, or reinterpret confidence bounds.

**Rule A-04 — DIM Authority**
DIM-01 state is owned by coverage_state.json (PSEE-RUNTIME.5A).
DIM-02 state is owned by reconstruction_state.json (PSEE-RUNTIME.6A).
DIM-03..06 states are owned by gauge_inputs.json as read from IG.RUNTIME.
No consumer may alter any DIM state.

**Rule A-05 — Phase Gate Enforcement**
PSEE MUST enforce phase gates before computing any DIM value.
DIM-01 is unavailable before Phase 5 (S-10).
DIM-02 is unavailable before Phase 6 (S-12 → S-13).
Blocked DIM states are legitimate governed states, not errors.

**Rule A-06 — Undefined State Guard**
Any execution_status not in the terminal state lookup table (gauge_score_model.md §G.2)
MUST yield completion_points = 0 via UNDEFINED_STATE guard.
This is not a failure — it is a defined in-flight behavior.

**Rule A-07 — DIM-02 FAIL Override**
If reconstruction_state.json state = FAIL, canonical_score MUST be set to 0
and band_label MUST be set to BLOCKED.
No scoring of other components is permitted when DIM-02 = FAIL.

---

## 6. Forbidden Zones

The following actions are FORBIDDEN for all systems except PSEE:

| Forbidden Action | Applies To |
|---|---|
| Computing or modifying canonical_score | All non-PSEE systems |
| Modifying gauge_state.json after production | All systems |
| Recomputing projected_score | All non-PSEE systems |
| Altering confidence bounds | All non-PSEE systems |
| Modifying coverage_state.json after PSEE sealing | All systems |
| Modifying reconstruction_state.json after PSEE sealing | All systems |
| Reading forbidden paths as inputs (PSEE.3, PSEE.3B, IG.5, IG.6, IG.7 directly) | PSEE runtime scripts |
| Overriding phase gate logic | All systems |
| Suppressing FAIL states | All systems |

---

## 7. Ownership Matrix

| Artifact | Producer | Read rights | Mutation rights |
|---|---|---|---|
| gauge_state.json | PSEE-RUNTIME.5 | All downstream layers | NONE |
| gauge_view.json | PSEE renderer | All downstream layers | NONE |
| coverage_state.json | PSEE-RUNTIME.5A | All downstream layers | NONE after seal |
| reconstruction_state.json | PSEE-RUNTIME.6A | All downstream layers | NONE after seal |
| gauge_inputs.json | IG.RUNTIME (DIM-03..06); PSEE (DIM-01..02 state_label) | All downstream layers | PSEE ONLY during production; NONE after seal |
| PSEE-GAUGE.0 authority docs | Governance stream | All systems | NONE |

---

## 8. Reconciliation Verdict

PSEE runtime outputs are valid for downstream consumption (including PiOS intake) ONLY when:

1. All required inputs are present and in valid states (§3)
2. All four canonical score conditions are met OR a governed BLOCKED/suppressed state is explicitly recorded
3. gauge_state.json has been produced and sealed by PSEE-RUNTIME.5 or later stream
4. Determinism has been verified (dual-run sha256 hash match)
5. No forbidden mutations occurred during PSEE execution
6. verify_psee_runtime.sh PASS with zero failures

If any condition is not met, PSEE runtime outputs MUST NOT be presented as governed authority.

---

## 9. Success State

PSEE runtime execution is complete and authoritative when all of the following hold:

| Condition | Verification method |
|---|---|
| gauge_state.json present and sealed | sha256 recorded in execution log |
| canonical_score computable or governed-blocked | state documented in execution log |
| projected_score present with mandatory caveat | PR-rule reference in gauge_state.json |
| confidence_band COMPUTED | status = COMPUTED in gauge_state.json |
| All DIM states resolved or phase-gated | state ≠ null for all six dimensions |
| Determinism verified | dual-run hash match in execution log |
| No forbidden paths read | confirmed in execution log |
| No IG.RUNTIME mutations | confirmed in execution log |
| Verification script PASS | verify_psee_runtime.sh PASS N/0 |

This contract is the upstream authority reference for all downstream handoff validation gates.
