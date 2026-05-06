# PSEE Condition Activation Gate — Design Specification

Stream: PI.PSEE-PIOS.PSEE-CONDITION-ACTIVATION-GATE.DESIGN.01  
Status: LOCKED — AUTHORITATIVE GATE DESIGN  
Generated: 2026-05-06  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts: NO  
  Advances Lane D target: YES — defines the gate that must be satisfied before Step E  

Authoritative inputs:
- LANE_GOVERNANCE_LOCK.md (3fa0ad2)
- BINDING_ENVELOPE_CONSUMPTION_CONTRACT.md (da3f1cb)
- ENRICHMENT_BOUNDARY_CONSOLIDATION.md (80aefcc)
- psee_enrichment_schema.json (af18159)
- signal_namespace_alias_registry.json (4b48f01)
- `scripts/pios/75x/compute_condition_correlation.py` (read, source-proven)
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/vault_readiness.json` (status=READY)
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/ceu/grounding_state_v3.json` (ratio=0.9)
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/structure/40.4/canonical_topology.json` (cluster_count=19)

---

## 1. Purpose

The PSEE condition activation gate is the formal control boundary governing when PSEE-enriched semantics are permitted to participate in the 75.x condition activation layer. It is the architectural answer to the question: under what conditions, and by what authority, does `compute_condition_correlation.py` consume PSEE-specific inputs alongside the generic binding_envelope?

This design:
- Defines the four activation states and their transition rules
- Scopes BP-01 and BP-02 precisely as authorization and topology gates
- Specifies which enrichment inputs participate in each gate check
- Mandates fail-closed degradation at every gate failure point
- Defines the additive participation model that prevents enrichment from silently altering generic computation
- Establishes future enriched PSIG authority boundaries
- Assigns ownership of each gate function to the correct layer

This is a design-only document. No implementation. No scripts modified. No runtime behavior changed.

---

## 2. Activation State Model

The enrichment activation state is a global run-scoped property evaluated before 75.x execution. It is not per-signal and not per-node.

### State Definitions

---

**GENERIC_ONLY**

The current productized runtime state for all runs.

- **Meaning:** 75.x reads only `binding/binding_envelope.json`. No PSEE enrichment inputs are consumed. All PSIG conditions derive from generic structural topology.
- **Allowed consumers:** `compute_condition_correlation.py` (generic path), `compute_pressure_candidates.py`, `compute_signal_projection.py`, `lens_report_generator.py`
- **Forbidden consumers:** None forbidden; enrichment inputs simply do not participate
- **Degradation behavior:** This state IS the degraded state; no further fallback required
- **Trigger:** Any failed gate condition, OR no gate evaluation performed, OR BP-01 not issued
- **Current status:** ALL RUNS are in GENERIC_ONLY state as of 2026-05-06

---

**ENRICHMENT_BLOCKED**

PSEE topology artifacts are present but fail one or more readiness conditions.

- **Meaning:** PSEE pipeline has run, but output does not meet the minimum quality threshold for enriched activation. Even if BP-01 were resolved, enriched activation cannot proceed because the input quality is insufficient.
- **Allowed consumers:** Same as GENERIC_ONLY — generic path only
- **Forbidden consumers:** No enriched computation may begin in this state
- **Degradation behavior:** Falls to GENERIC_ONLY immediately; no partial enrichment
- **Trigger:** Any of: `vault_readiness.status ≠ READY`, `canonical_topology.cluster_count = 0`, `grounding_ratio < 0.5`, `grounding_state_v3.validation_status ≠ PASS`, sidecar absent, sidecar `readiness = NOT_READY`
- **Current status:** NOT the current state for run_02_oss_fastapi_pipeline — all readiness conditions are met (see Section 4)

---

**ENRICHMENT_READY**

All PSEE readiness conditions met, but authorization gate (BP-01) not yet issued.

- **Meaning:** The PSEE pipeline has produced sufficient, valid topology outputs. Enriched activation is technically feasible but governance-blocked. The run is waiting for the `psig_computation.json` authorization contract (40x.04).
- **Allowed consumers:** Same as GENERIC_ONLY — generic path only. ENRICHMENT_READY does NOT activate enriched computation.
- **Forbidden consumers:** No enriched computation may begin in this state. `ENRICHMENT_READY ≠ ENRICHMENT_ACTIVE`.
- **Degradation behavior:** Falls to GENERIC_ONLY if any readiness condition subsequently fails; remains ENRICHMENT_READY until BP-01 is issued OR a condition fails
- **Trigger:** All readiness conditions met AND `bp_01_resolved = false`
- **Current status:** `run_02_oss_fastapi_pipeline` is in ENRICHMENT_READY state — cluster_count=19, grounding_ratio=0.9, vault READY, but BP-01 not issued

---

**ENRICHMENT_ACTIVE**

All readiness conditions met AND BP-01 authorization issued AND sidecar present and READY.

- **Meaning:** Enriched condition activation is authorized and executable. `compute_condition_correlation.py` runs its optional PSEE sidecar read path in addition to the generic computation path. Both DPSIG (generic) and PSIG (enriched) condition activation outputs are produced.
- **Allowed consumers:** Extended `compute_condition_correlation.py`, `compute_pressure_candidates.py` (extended), `compute_signal_projection.py` (extended)
- **Forbidden consumers:** 41.x does NOT directly consume enrichment inputs — it receives only 75.x output
- **Degradation behavior:** If sidecar becomes absent or NOT_READY mid-execution, falls to GENERIC_ONLY; PSIG enriched outputs are not produced; DPSIG outputs are produced as normal
- **Trigger:** BP-01 issued AND BP-02 met AND `psee_40_5_input.json` present with `readiness=READY` AND `handoff_mode=PSEE_HANDOFF`
- **Current status:** NOT YET REACHABLE — Step C (sidecar builder) not implemented; BP-01 not issued

### State Transition Rules

```
Initial state (all runs): GENERIC_ONLY

GENERIC_ONLY ──────────────────────────────────────────────────────────────────────►
                                                                        (permanent fallback)
                ▲ gate failure or sidecar absent or BP-01 not issued
                │
ENRICHMENT_BLOCKED ──► (all conditions met) ──► ENRICHMENT_READY
                                                        │
                                              BP-01 issued + sidecar READY
                                                        │
                                                        ▼
                                              ENRICHMENT_ACTIVE
                                                        │
                                         sidecar failure / BP-01 revoked
                                                        │
                                                        ▼
                                                 GENERIC_ONLY
```

**Non-negotiable rule:** The transition to ENRICHMENT_ACTIVE requires ALL of: BP-01 issued, BP-02 met, sidecar present and READY. No single gate alone is sufficient.

---

## 3. BP-01 / BP-02 Governance

### BP-01 — Authorization Gate

| Property | Value |
|----------|-------|
| Gate type | AUTHORIZATION — governance decision |
| Artifact required | `psig_computation.json` (contract 40x.04) |
| Who issues | Governance authority (ChatGPT) via explicit contract |
| Current state | NOT ISSUED |
| Effect of resolution | Permits enriched PSIG derivation to proceed; transitions ENRICHMENT_READY → ENRICHMENT_ACTIVE (when sidecar also READY) |
| Effect of non-resolution | Prevents ENRICHMENT_ACTIVE regardless of PSEE data quality |
| Can be bypassed? | NO — hard gate; cannot be satisfied by any data condition |
| Verification method | File presence: `psig_computation.json` at governed path; contract claim verified by 75.x gate evaluator |

**BP-01 resolved does NOT mean enrichment is active.** BP-01 removes the authorization block. Enrichment activation also requires BP-02 met, sidecar produced, and sidecar readiness = READY. Resolving BP-01 without all other gates produces ENRICHMENT_READY, not ENRICHMENT_ACTIVE.

### BP-02 — Topology Richness Gate

| Property | Value |
|----------|-------|
| Gate type | DATA QUALITY — automated check |
| Condition | `canonical_topology.cluster_count > 0` |
| Who satisfies | PSEE pipeline execution (produces canonical_topology.json) |
| Current state | RESOLVED for run_02_oss_fastapi_pipeline (cluster_count=19) |
| Effect of resolution | Confirms PSEE topology is non-trivial; necessary but not sufficient for activation |
| Effect of non-resolution | Produces ENRICHMENT_BLOCKED regardless of BP-01 state |
| Can be bypassed? | NO — zero clusters means PSEE topology is empty; no enrichment possible |
| Verification method | `canonical_topology.cluster_count` field read; zero or absent → ENRICHMENT_BLOCKED |

**BP-02 resolved does NOT mean enrichment is active.** BP-02 only establishes that the PSEE topology has meaningful cluster structure. Enrichment activation also requires BP-01, vault readiness, grounding ratio, and sidecar readiness. BP-02 resolved with BP-01 unissued → ENRICHMENT_READY only.

### Combined Gate Summary

| BP-01 | BP-02 | Readiness Conditions | Sidecar READY | Activation State |
|-------|-------|---------------------|---------------|-----------------|
| NOT issued | NOT met | — | — | ENRICHMENT_BLOCKED |
| NOT issued | Met | Failing | — | ENRICHMENT_BLOCKED |
| NOT issued | Met | Passing | — | ENRICHMENT_READY |
| Issued | NOT met | — | — | ENRICHMENT_BLOCKED |
| Issued | Met | Failing | — | ENRICHMENT_BLOCKED |
| Issued | Met | Passing | NOT READY | ENRICHMENT_BLOCKED |
| Issued | Met | Passing | READY | **ENRICHMENT_ACTIVE** |

Only the last row produces ENRICHMENT_ACTIVE. Every other combination produces GENERIC_ONLY behavior.

---

## 4. Enrichment Activation Inputs

The inputs that participate in the gate evaluation are classified below. All values are read from PSEE artifacts; none are computed fresh at gate evaluation time.

### From `psee_context` (in `psee_binding_envelope.json` or evaluated directly from source artifacts)

| Field | Classification | Gate Check | Current Value (run_02) |
|-------|---------------|------------|----------------------|
| `psee_context.readiness` | REQUIRED | Must be `"READY"` | `READY` |
| `psee_context.cluster_count` | REQUIRED | Must be `> 0` (BP-02) | `19` |
| `psee_context.grounding_ratio` | REQUIRED | Must be `>= 0.5` | `0.9` |
| `psee_context.bp_01_resolved` | REQUIRED | Must be `true` | `false` |
| `psee_context.bp_02_resolved` | REQUIRED | Must be `true` (derived from cluster_count > 0) | `true` |

### From `evidence_state` (in `psee_binding_envelope.json`)

| Field | Classification | Gate Check | Current Value (run_02) |
|-------|---------------|------------|----------------------|
| `evidence_state.vault_readiness_status` | REQUIRED | Must be `"READY"` | `READY` |
| `evidence_state.grounding_ratio` | REQUIRED | Corroborates `psee_context.grounding_ratio`; must be `>= 0.5` | `0.9` |
| `evidence_state.total_ceu` | OPTIONAL | Used for diagnostics; not a pass/fail gate | `10` |
| `evidence_state.evidence_confidence` | FUTURE_ONLY | Not yet computed; reserved for future gate strengthening | `null` |

### From `ceu_topology` (in `psee_binding_envelope.json`)

| Field | Classification | Gate Check | Current Value (run_02) |
|-------|---------------|------------|----------------------|
| `ceu_topology.cluster_count` | REQUIRED | Must corroborate `psee_context.cluster_count`; mismatch → ENRICHMENT_BLOCKED | `19` |
| `ceu_topology.clusters` | OPTIONAL for gate | Required for PSEE-specific ST computation (Step E); not a gate pass/fail | 19 cluster objects |
| `ceu_topology.cross_cluster_edges` | FUTURE_ONLY | Not populated until OVERLAP_STRUCTURAL derivation; gates on non-null only in future ST-032 path | `[]` |

### From `selector_context` (in `psee_binding_envelope.json`)

| Field | Classification | Gate Check | Current Value (run_02) |
|-------|---------------|------------|----------------------|
| `selector_context.active_selector` | FUTURE_ONLY | Not yet populated; reserved for selector-gated signal derivation | `null` |
| `selector_context.selector_confidence` | FUTURE_ONLY | Reserved for future gate strengthening | `null` |
| `selector_context.suppression_flags` | FUTURE_ONLY | Reserved for signal suppression control | `[]` |

### From sidecar `psee_40_5_input.json` (Object D — not yet produced)

| Field | Classification | Gate Check |
|-------|---------------|------------|
| `readiness` | REQUIRED | Must be `"READY"` for ENRICHMENT_ACTIVE |
| `handoff_mode` | REQUIRED | Must be `"PSEE_HANDOFF"` |
| `binding_summary.st_030_max_fan_in` | REQUIRED | Non-null required for PSIG-001 enriched derivation |
| `binding_summary.st_031_max_fan_out` | REQUIRED | Non-null required for PSIG-002 enriched derivation |
| `binding_summary.st_032_cross_domain_edge_count` | OPTIONAL | May be null (if dom_layer absent); PSIG-003 derivation conditional |
| `binding_summary.st_033_max_responsibility_surface` | OPTIONAL | May be null; PSIG-004 enriched derivation conditional |
| `binding_summary.st_034_total_interface_surface` | OPTIONAL | May be null; PSIG-005 derivation conditional |
| `binding_summary.st_035_structural_cluster_count` | OPTIONAL | May be null; PSIG-006 enriched derivation conditional |
| `topology_summary.psee_activated` | REQUIRED | Must be `true` |

### REQUIRED gate input summary (all must pass for ENRICHMENT_ACTIVE)

1. `psee_context.readiness = "READY"`
2. `psee_context.cluster_count > 0`
3. `psee_context.grounding_ratio >= 0.5`
4. `psee_context.bp_01_resolved = true`
5. `evidence_state.vault_readiness_status = "READY"`
6. `ceu_topology.cluster_count` equals `psee_context.cluster_count` (consistency check)
7. `psee_40_5_input.json` present at governed path
8. `psee_40_5_input.json.readiness = "READY"`
9. `psee_40_5_input.json.handoff_mode = "PSEE_HANDOFF"`
10. `psee_40_5_input.json.binding_summary.st_030_max_fan_in` non-null
11. `psee_40_5_input.json.binding_summary.st_031_max_fan_out` non-null

---

## 5. Fail-Closed Degradation

### Core Principle

Any single gate failure returns the execution context to **GENERIC_ONLY**. There is no partial enriched activation. The gate is binary: enrichment participates fully or not at all.

### Degradation Table

| Gate Failure Condition | Resulting State | Runtime Behavior |
|------------------------|----------------|-----------------|
| BP-01 not issued (`bp_01_resolved = false`) | ENRICHMENT_READY (if BP-02 met) or ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| BP-02 not met (`cluster_count = 0`) | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| `vault_readiness_status ≠ "READY"` | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| `grounding_ratio < 0.5` | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| `grounding_state_v3.validation_status ≠ "PASS"` | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| `ceu_topology.cluster_count` mismatches `psee_context.cluster_count` | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| Sidecar (`psee_40_5_input.json`) absent | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| Sidecar `readiness = "NOT_READY"` | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| Sidecar `handoff_mode = "GENERIC_HANDOFF"` | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| ST-030 or ST-031 null in sidecar | ENRICHMENT_BLOCKED (minimum viable enrichment set absent) | GENERIC_ONLY execution |
| Any sidecar field schema violation | ENRICHMENT_BLOCKED | GENERIC_ONLY execution |
| Enriched execution begins but sidecar becomes unreadable mid-execution | Fall to GENERIC_ONLY for remainder of run | GENERIC_ONLY execution; PSIG enriched outputs suppressed |

### Degradation Rules

**Rule D-01:** Degradation is instantaneous. The gate evaluator produces a single state before execution begins. There is no runtime state change after the gate is set.

**Rule D-02:** The generic path is always executable independently. `compute_condition_correlation.py` in its current form (unmodified) represents the GENERIC_ONLY path. Any ENRICHMENT_ACTIVE extension must be an additive code branch, not a replacement.

**Rule D-03:** No partial enrichment. If PSIG-001 enriched derivation succeeds but PSIG-002 enriched derivation fails, the entire run reverts to GENERIC_ONLY. Enrichment is all-or-nothing at the run level.

**Rule D-04:** Degradation does not produce an error exit. When degradation occurs, the generic path runs normally and completes. The gate evaluation result is written to `gate_evaluation.json` (see Section 9); the run continues.

**Rule D-05:** No silent degradation. The gate evaluation result (`activation_state`, `degradation_reason`) must be written to a governed artifact before 75.x execution begins.

---

## 6. Condition Activation Participation Model

### The Core Principle

PSEE enrichment **augments the activation context** — it provides additional structural quantities as inputs to condition threshold evaluation. It does NOT inject precomputed results, bypass threshold evaluation, or deliver ready-made signal values.

### What Enrichment Provides (ENRICHMENT_ACTIVE state only)

| Enrichment Input | Source | How It Participates |
|-----------------|--------|---------------------|
| ST-030 (max_fan_in) | sidecar `binding_summary` | Provides PSEE-specific peak fan-in value for PSIG-001 enriched threshold check |
| ST-031 (max_fan_out) | sidecar `binding_summary` | Provides PSEE-specific peak fan-out value for PSIG-002 enriched threshold check |
| ST-032 (cross_domain_edge_count) | sidecar `binding_summary` | Provides cross-domain coupling count for PSIG-003 (if non-null) |
| ST-033 (max_responsibility_surface) | sidecar `binding_summary` | Provides peak surface concentration for PSIG-004 enriched threshold |
| ST-034 (total_interface_surface) | sidecar `binding_summary` | Provides total surface count for PSIG-005 (if non-null) |
| ST-035 (structural_cluster_count) | sidecar `binding_summary` | Provides BFS cluster count for PSIG-006 enriched fragmentation index |

### Explicit Prohibitions

**PRO-01 — No precomputed PSIG injection:**  
Enrichment inputs are structural primitives (counts, max values, ratios). No PSIG signal value (`psig_001_value`, etc.) may appear in any enrichment input artifact (`psee_binding_envelope.json`, `psee_40_5_input.json`). The 75.x layer performs threshold evaluation; enrichment provides raw inputs to that evaluation.

**PRO-02 — No bypass of threshold evaluation:**  
The RUN_RELATIVE_OUTLIER method must still be applied to enriched structural quantities. ST-030 (max fan_in) does not directly produce a HIGH/NORMAL condition — it must be evaluated against the run's own topology baseline (mean_fan) by the extended `compute_condition_correlation.py`.

**PRO-03 — No direct 41.x enrichment consumption:**  
`compute_signal_projection.py` (41.x) receives only the output of 75.x condition activation. It does NOT read `psee_binding_envelope.json`, `psee_40_5_input.json`, or any enrichment source artifact directly. 41.x projects what 75.x has decided; it does not re-evaluate enrichment.

**PRO-04 — No alteration of DPSIG (generic) computation:**  
The existing DPSIG computation paths (fan_in/mean_fan, fan_out/mean_fan, surfaces_per_ceu/mean_surfaces, BFS components from `binding_envelope.json`) must continue to execute identically regardless of enrichment state. Enriched computation runs IN ADDITION, not instead.

**PRO-05 — No report direct enrichment consumption:**  
`lens_report_generator.py` reads from `vault/signal_registry.json` and `41.x/signal_projection.json`. Enriched PSIG values reach reports only by passing through the full 75.x → 41.x → vault pipeline. No direct enrichment artifact is consumed by report generation.

### Participation Diagram (ENRICHMENT_ACTIVE state)

```
binding_envelope.json (unchanged)
    │
    ├─ Generic computation path (unchanged, always runs):
    │       fan_in, fan_out, surfaces_per_ceu, BFS → DPSIG-001/002/004/006 conditions
    │
psee_40_5_input.json (sidecar, additive input):
    │
    └─ Enriched computation path (additive, runs alongside generic):
            ST-030..035 → RUN_RELATIVE_OUTLIER → PSIG-001..006 conditions
                                                         │
                                                    75.x output combines:
                                                    DPSIG conditions (generic)
                                                    PSIG conditions (enriched)
                                                         │
                                                    41.x projection (extended)
                                                         │
                                                    vault (extended registry)
                                                         │
                                                    reports (extended)
```

---

## 7. Future Enriched PSIG Authority

### Current State

The current Lane A runtime emits PSIG-001, PSIG-002, PSIG-004, PSIG-006 as **GENERIC_RUNTIME_SIGNAL** values — generic distribution signals computed from any compliant `binding_envelope.json`. These are documented in `signal_namespace_alias_registry.json` as DPSIG-001/002/004/006 in Lane D target naming.

### Namespace Reservation vs. Computation Authority

The namespace reservation in `signal_namespace_alias_registry.json` (future enriched PSIG-001..006 in Lane D) **does NOT authorize computation**. These two actions are independent:

| Action | Status | Authority Source |
|--------|--------|-----------------|
| Namespace reserved | DONE (4b48f01) | signal_namespace_alias_registry.json |
| Computation authorized | NOT DONE | Requires psig_computation.json (40x.04 contract) |
| ENRICHMENT_ACTIVE state reached | NOT DONE | Requires BP-01 + BP-02 + sidecar READY |
| Enriched PSIG values emitted | NOT DONE | Requires ENRICHMENT_ACTIVE + Step E implemented |

### Future Enriched PSIG Authority Rules

**AUTH-01:** Future enriched PSIG outputs require explicit `activation_state = ENRICHMENT_ACTIVE` in the gate evaluation artifact for the run. Enriched PSIG outputs in any run artifact produced during GENERIC_ONLY or ENRICHMENT_READY state are invalid.

**AUTH-02:** Future enriched PSIG outputs require separate derivation authority. The `signal_authority` field in any enriched PSIG output must reference the 40x.04 contract (`psig_computation.json`), not the current `PROVISIONAL_CKR_CANDIDATE` authority.

**AUTH-03:** Enriched PSIG outputs and generic DPSIG outputs must not coexist in the same `signal_registry.json` without explicit lane declaration. The namespace collision rule from NAMESPACE_DEBT_MAPPING.md applies.

**AUTH-04:** Until BP-01 is issued, any signal value labeled `PSIG-001` through `PSIG-006` in any run artifact is a Lane A generic signal (GENERIC_RUNTIME_SIGNAL). It must not be interpreted as an enriched PSEE signal regardless of the presence of PSEE topology artifacts.

---

## 8. Gate Ownership Model

Each gate function belongs to exactly one layer. No cross-layer gate ownership.

### 40.x Layer — Readiness Preparation

The 40.x layer (PSEE pipeline: 40.2 → 40.3 → 40.4) owns the preparation of readiness conditions. It produces:

| Artifact | Readiness Signal |
|----------|-----------------|
| `canonical_topology.json` | `cluster_count > 0` (BP-02) |
| `grounding_state_v3.json` | `grounding_ratio >= 0.5`, `validation_status = PASS` |
| `vault_readiness.json` | `status = READY` |

The 40.x layer does NOT evaluate the activation gate. It only produces the inputs the gate evaluates. The gate check is performed by the gate evaluator (75.x boundary, pre-execution step).

### psee_handoff Layer — Extraction and Sidecar Production

The `psee_handoff` module (`build_psee_handoff_sidecar.py`) owns:

- Eligibility validation (E-01..E-10 from adapter design)
- ST-030..035 extraction from `binding_envelope.json`
- Sidecar production (`psee_40_5_input.json`)
- Sidecar readiness declaration (`readiness`, `handoff_mode`, `disable_reason`)

The psee_handoff layer does NOT make the activation decision. It produces the sidecar; the 75.x gate evaluator reads it and decides.

### 75.x Layer — Activation Decision

The 75.x layer owns:

- **Gate evaluation:** Reading all gate inputs; computing activation state
- **Gate artifact production:** Writing `gate_evaluation.json` before execution
- **Condition activation decision:** Choosing generic path only, or generic + enriched paths
- **Fail-closed enforcement:** If gate produces GENERIC_ONLY or ENRICHMENT_BLOCKED, enriched code paths are not entered
- **Enriched threshold evaluation:** Applying RUN_RELATIVE_OUTLIER to ST-030..035 values (ENRICHMENT_ACTIVE only)

The 75.x layer is the SOLE authority for the activation decision. No other layer may override or pre-set the activation state.

### 41.x Layer — Projection Consumption Only

The 41.x layer (`compute_signal_projection.py`) owns:

- Projection of 75.x activation outputs into the 41.x format
- Formatting of both DPSIG and PSIG condition activation results (ENRICHMENT_ACTIVE)
- No re-evaluation of enrichment; no gate check

The 41.x layer does NOT read enrichment artifacts. It reads only `75.x/condition_correlation_state.json`, `75.x/pressure_zone_state.json`, and `binding/binding_envelope.json` (as proven in da3f1cb). In ENRICHMENT_ACTIVE state, it receives richer 75.x output; it does not make activation decisions.

### Vault and Report Layers — Downstream Only

Vault and reports receive finalized signal artifacts from the 41.x projection. They have no gate ownership and no direct enrichment artifact access.

### Ownership Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│ Layer          │ Owns                                  │ Does NOT own │
├────────────────┼───────────────────────────────────────┼─────────────┤
│ 40.x (PSEE)   │ Readiness preparation                 │ Gate eval,   │
│                │ (canonical_topology, grounding_state, │ activation   │
│                │ vault_readiness)                      │ decision     │
├────────────────┼───────────────────────────────────────┼─────────────┤
│ psee_handoff  │ Eligibility check, ST-030..035        │ Activation   │
│                │ extraction, sidecar production        │ decision     │
├────────────────┼───────────────────────────────────────┼─────────────┤
│ 75.x          │ Gate evaluation, activation           │ Readiness    │
│                │ decision, condition threshold eval    │ preparation  │
├────────────────┼───────────────────────────────────────┼─────────────┤
│ 41.x          │ Projection consumption only           │ Gate eval,   │
│                │                                       │ activation   │
├────────────────┼───────────────────────────────────────┼─────────────┤
│ Vault/Reports │ Final artifact consumption            │ Everything   │
│                │                                       │ above        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Safe Next Implementation Step

**Contract:** PI.PSEE-PIOS.PSEE-GATE-EVALUATOR.IMPLEMENTATION.01  
**Lane scope:** A + D  
**Modifies Lane A runtime behavior:** NO  
**Modifies any 75.x script:** NO  

### What the gate evaluator does

A passive evaluator script (`scripts/pios/psee_handoff/evaluate_activation_gate.py`) that:

1. Accepts `--run-dir <path>` as input
2. Reads all REQUIRED gate inputs (Section 4) from the run's PSEE artifacts
3. Evaluates all gate conditions against the rules in Section 3
4. Determines the current `activation_state` (GENERIC_ONLY, ENRICHMENT_BLOCKED, ENRICHMENT_READY, or ENRICHMENT_ACTIVE)
5. Writes `artifacts/psee_handoff/<client>/<run_id>/gate_evaluation.json` with:
   - `activation_state`
   - `gate_results` (pass/fail per condition with evidence values)
   - `degradation_reason` (if state is ENRICHMENT_BLOCKED)
   - `bp_01_resolved`, `bp_02_resolved`
   - `enrichment_inputs_summary`
6. Does NOT modify `compute_condition_correlation.py`
7. Does NOT trigger any pipeline execution
8. Does NOT change any signal output

### Why passive evaluation first (observability before participation)

The gate evaluator produces a written record of the current gate state for the productized run. This serves three purposes:

1. **Proof of readiness:** Confirms that ENRICHMENT_READY is the correct characterization of the current run (cluster_count=19, grounding_ratio=0.9, vault READY, BP-01 unissued)
2. **Consumer interface test:** Validates that the gate evaluation logic can correctly parse all enrichment inputs before those inputs are consumed by an execution path
3. **BP-01 gate preparation:** When BP-01 is issued, the gate evaluator is the only code that needs to change (`bp_01_resolved = true`); the rest of Step E can proceed knowing the gate logic is proven

### Why before Step C (sidecar builder)

The gate evaluator establishes the `gate_evaluation.json` schema and the sidecar consumption interface before the sidecar exists. When Step C implements `build_psee_handoff_sidecar.py`, it can validate its output by running the gate evaluator and confirming the expected state change (ENRICHMENT_BLOCKED → ENRICHMENT_READY or ENRICHMENT_ACTIVE when BP-01 is also resolved).

---

## 10. Validation

PASS criteria:

- [x] Activation states explicit — 4 states defined (GENERIC_ONLY, ENRICHMENT_BLOCKED, ENRICHMENT_READY, ENRICHMENT_ACTIVE) with trigger conditions, allowed/forbidden consumers, degradation behavior (Section 2)
- [x] State transition rules explicit — directed state machine defined; no implicit transition possible (Section 2)
- [x] BP-01 and BP-02 correctly scoped — BP-01 as authorization gate (governance decision), BP-02 as topology richness gate (data quality check); both required for ENRICHMENT_ACTIVE (Section 3)
- [x] BP-02 resolved ≠ enrichment active — explicit combined gate table shows 6 non-active combinations (Section 3)
- [x] Enrichment activation inputs classified — REQUIRED / OPTIONAL / FUTURE_ONLY for all 11 gate inputs (Section 4)
- [x] Fail-closed degradation explicit — 12 degradation conditions listed; 5 degradation rules; generic path always independent (Section 5)
- [x] No partial enrichment allowed — Rule D-03 explicit; Rule D-05 requires gate artifact before execution (Section 5)
- [x] Participation model explicit — 5 explicit prohibitions (PRO-01..05); participation diagram shows additive path (Section 6)
- [x] Enrichment augments, does not inject — PRO-01 prohibits precomputed PSIG injection; PRO-02 prohibits threshold bypass (Section 6)
- [x] 41.x does not directly consume enrichment — PRO-03 explicit; ownership table confirms (Sections 6, 8)
- [x] Future enriched PSIG authority scoped — namespace reservation ≠ computation authority; AUTH-01..04 rules (Section 7)
- [x] Gate ownership assigned — 5-layer ownership table; 75.x is sole activation authority (Section 8)
- [x] Lane A preservation guaranteed — generic path always independent; DPSIG computation unchanged (Sections 5, 6)
- [x] No implicit activation allowed — all transitions require explicit gate evaluation; no side-channel activation (Sections 2, 3)
- [x] No implementation performed — design only; no scripts created or modified; no artifacts written
- [x] Safe next step defined — passive gate evaluator (observability before participation); sidecar builder comes after (Section 9)

Status: PASS
