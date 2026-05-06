# PSEE ↔ PiOS Lane Governance Lock

Stream: PI.PSEE-PIOS.LANE-GOVERNANCE-LOCK.01  
Status: LOCKED — MANDATORY UPSTREAM CONTEXT  
Generated: 2026-05-06  

Authoritative baselines:
- Productized runtime anchor: 93098cb
- 40.4 boundary correction: 2705bca
- 40.5 consumption verification: cd009b9
- Productized JSON signal path verification: d2cd8c5

**This document is mandatory upstream context for all future PSEE ↔ PiOS integration contracts.**  
Any contract that does not declare its LANE_SCOPE is INVALID.

---

## 1. Purpose

This document locks the four execution lanes that coexist in the PSEE ↔ PiOS system and prevents future lane collapse.

Lane collapse occurs when:
- an inactive reference artifact is treated as an active runtime
- a prototype/forensic artifact is treated as a canonical implementation
- a target architecture document is treated as a current runtime
- filesystem presence is confused with governance authority

Each lane has a distinct authority class, a distinct execution status, and a distinct set of artifacts. They must not be merged, conflated, or allowed to implicitly override one another.

---

## 2. Lane A — Active Productized Generic Runtime

**Status: ACTIVE — canonical execution substrate**  
**Must remain runnable at all times.**

### Description

Lane A is the only currently executing signal pipeline. It is the protected baseline. All implementation work that touches Lane A artifacts must preserve Lane A's runnable state.

### Execution path (proven from 93098cb):

```
clients/<client>/psee/runs/<run_id>/binding/binding_envelope.json
        ↓
scripts/pios/75x/compute_condition_correlation.py
        → 75.x/condition_correlation_state.json  (per-node condition states, no signal values)
        ↓
scripts/pios/75x/compute_pressure_candidates.py
        → 75.x/pressure_candidate_state.json     (★ first artifact with signal values ★)
        ↓
scripts/pios/75x/compute_pressure_zones.py
        → 75.x/pressure_zone_state.json
        ↓
scripts/pios/41x/compute_signal_projection.py
        → 41.x/signal_projection.json
        ↓
run_client_pipeline.py Phase 8a
        → vault/signal_registry.json
        ↓
scripts/pios/lens_report_generator.py
        → clients/<client>/reports/ HTML reports
```

### Active signal namespace

| Signal ID | Productized value (FastAPI) | Formula | Method |
|-----------|----------------------------|---------|--------|
| PSIG-001 | 2.32 | fan_in / mean_fan | RUN_RELATIVE_OUTLIER |
| PSIG-002 | 6.96 | fan_out / mean_fan | RUN_RELATIVE_OUTLIER |
| PSIG-004 | 1.0 | surfaces_per_ceu / mean_surfaces | RUN_RELATIVE_OUTLIER |
| PSIG-006 | 0.2 | isolated node fraction | THEORETICAL_BASELINE |

### Namespace debt declaration

The signals currently labeled PSIG-001/002/004/006 in Lane A are generic distribution-based topology signals derived from any binding_envelope, regardless of PSEE activation state. They are not PSEE-specific.

In the target consolidated architecture (Lane D), these signals belong to the **DPSIG** namespace (Distribution-based PiOS Signals). The current PSIG label is a naming debt inherited from the initial implementation.

**Implication:** "PSIG" in the current running system ≠ "PSIG" in the target architecture.

Any contract that uses PSIG must declare which definition applies:

- `PSIG (LANE_A)` = current active generic distribution signals
- `PSIG (LANE_D)` = future PSEE-specific enriched topology signals

Until the namespace is formally migrated, both usages coexist. Collapse between them is a hard violation.

### Protected artifacts (must not be modified without explicit Lane A contract):

- `scripts/pios/75x/compute_condition_correlation.py`
- `scripts/pios/75x/compute_pressure_candidates.py`
- `scripts/pios/75x/compute_pressure_zones.py`
- `scripts/pios/41x/compute_signal_projection.py`
- `scripts/pios/run_client_pipeline.py`
- `scripts/pios/run_end_to_end.py`
- `scripts/pios/lens_report_generator.py`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/` (productized run artifacts)

---

## 3. Lane B — Legacy Static Markdown Path

**Status: VALID / REFERENCE — inactive runtime**

### Description

Lane B is the historical static markdown telemetry and signal specification layer. It was the active path for `run_01_blueedge` under contract `PIOS-40.5-RUN01-CONTRACT-v1`. It has not been called by `run_client_pipeline.py` and is not part of the productized pipeline.

Lane B contains valid formulas, reference semantics, and BlueEdge-specific signal specifications. It is a legitimate reference layer. It is not a runtime.

### Lane B artifacts:

**`docs/pios/40.4/` (18 files)**

Static telemetry markdown artifacts: `structural_telemetry.md`, `activity_telemetry.md`, `delivery_telemetry.md`, `telemetry_schema.md`, `telemetry_surface_definition.md`, `telemetry_traceability_map.md`, and 12 additional telemetry reference files.

Read by `build_signal_artifacts.py` and `load_40_4_intake.py`. Neither is invoked by the productized pipeline.

Also contains: `static_telemetry_expansion_registry.md` — provisional ST-030..035 field definitions (governance specification, feature/next). These have design authority for the target architecture.

**`docs/pios/40.5/` (11 files)**

Signal markdown artifacts from `run_01_blueedge`: `signal_input_matrix.md`, `signal_computation_specification.md`, `signal_output_set.md`, `signal_traceability_map.md`, `signal_validation_log.md`, `signal_boundary_enforcement.md`, `execution_manifest.md`.

Plus: `signal_selector_specification.md`, `static_signal_expansion_registry.md`, `static_signal_expansion_index.md` — governance specifications with design authority for the target architecture (feature/next, no execution authorized).

**`scripts/pios/40.5/build_signal_artifacts.py`**

Reads `docs/pios/40.4/*.md`. Passthrough regenerator. Not invoked by `run_client_pipeline.py`.

**`scripts/pios/40.5/validate_signal_artifacts.py`**

Validator locked to `run_01_blueedge`. Hardcoded path: `~/Projects/krayu-program-intelligence`. Not invoked by productized pipeline.

### Lane B authority

Lane B may:
- preserve BlueEdge runtime telemetry signal definitions as historical reference
- serve as design authority for static telemetry field definitions (ST-XXX series)
- provide governance specifications for selector model and PSIG expansion candidates

Lane B must not:
- be invoked as a live signal computation path
- be treated as the active productized runtime
- be updated to match productized runtime without explicit Lane B contract

---

## 4. Lane C — Relational / Forensic Prototype Path

**Status: VALID / EXPERIMENTAL — non-canonical, isolated**

### Description

Lane C is the forensic and prototype exploration lane. It contains artifacts from investigations into relational dependency semantics, OVERLAP_STRUCTURAL edge models, and fan-in/fan-out lineage tracing. Lane C findings may contain valid future semantic concepts but carry no implementation authority.

### Lane C artifacts:

**`clients/fastapi/psee/runs/run_relational_recovery_01/`**

- `signals/relational_signal_set.json` — R-PSIG-001..004 signals, RELATIONAL_EDGE_BASED mode, `isolation_status: FULLY_ISOLATED`
- `binding/binding_model.json` — REL-001/REL-002 OVERLAP_STRUCTURAL edges, `build_binding_convergence_status: BLOCKED_SIGNAL_SEED_PROVENANCE_MISSING`

**Signal namespace in Lane C: R-PSIG-XXX**

| R-PSIG | Value | Formula |
|--------|-------|---------|
| R-PSIG-001 | 0.1 | fan_in_nodes(1) / node_count(10) |
| R-PSIG-002 | 0.2 | fan_out_nodes(2) / node_count(10) |
| R-PSIG-003 | 0.2 | relational_edge_count(2) / node_count(10) |
| R-PSIG-004 | 0.0625 | relational_edge_count(2) / total_edges(32) |

These formulas measure OVERLAP_STRUCTURAL edge ratios — a different computation basis than Lane A.

**Fan-in/fan-out lineage traced in Lane C:**

The 9.43 fan-in/fan-out values in `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/75.x/pressure_candidate_state.json` are DISTRIBUTION_BASED (RUN_RELATIVE_OUTLIER), not RELATIONAL_EDGE_BASED. They originate from UUID client artifacts and are non-canonical (documented in PI.FASTAPI.RELATIONAL-SIGNAL-MODEL-FORENSICS.01). These remain in Lane C scope.

### Lane C authority

Lane C may:
- contain valid relational semantic concepts for future PSIG derivation
- inform the design of PSEE-specific signals (PSIG in Lane D)
- be referenced for forensic analysis

Lane C must not:
- be treated as an active runtime
- be cited as canonical signal provenance
- be used as a basis for productized adapter design without explicit promotion contract
- be referenced in implementation contracts as a pattern source

---

## 5. Lane D — Target Consolidated Architecture

**Status: VALID / TARGET — governed migration target, not yet fully implemented**

### Description

Lane D is the convergence architecture where PSEE topology enrichment joins the generic productized pipeline at the binding_envelope boundary, producing a unified signal surface.

### Target execution path:

```
PSEE 40.2 → 40.3 → 40.4
        ↓
[PSEE Sidecar Adapter]
        ↓
artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json
        ↓
Enriched or supplementary binding_envelope context
        ↓
75.x/compute_condition_correlation.py  (Lane A base — unchanged)
        ↓
DPSIG signals: generic distribution topology (PSIG-001/002/004/006 renamed)
PSIG signals:  PSEE-specific enriched topology (PSIG-001..008 new namespace)
        ↓
Shared 41.x projection + vault + report
```

### Target namespace resolution (Lane D):

| Namespace | Signals | Source | Status |
|-----------|---------|--------|--------|
| DPSIG-001..006 | Generic distribution topology signals | binding_envelope, any client | replaces current PSIG-001/002/004/006 in Lane A |
| PSIG-001..008 | PSEE-specific enriched topology signals | grounding_state_v3 + binding_envelope, PSEE-eligible clients only | provisional candidates in static_signal_expansion_registry.md |
| SIG-001..008 | CKR-governed delivery-domain signals | runtime telemetry (BlueEdge) | Lane B — not active in productized pipeline |

### Migration prerequisites for Lane D activation:

1. PSEE pipeline execution producing `canonical_topology.json` with `cluster_count > 0` (pending `run_blueedge_psee_candidate_01`)
2. Sidecar adapter implemented: `scripts/pios/psee_handoff/build_psee_handoff_sidecar.py` (designed in PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.DESIGN.01 — partially valid; adapter target must be corrected to 75.x input boundary)
3. psig_computation.json authorization contract issued (40x.04 — Blocking Point BP-01)
4. DPSIG namespace migration: formal rename of PSIG-001/002/004/006 in Lane A scripts
5. PSIG computation integrated into 75.x signal path alongside DPSIG

### Lane D authority

Lane D may:
- define target architecture and namespace structure
- authorize migration steps via explicit contracts
- supersede Lane B governance documents when formally promoted

Lane D must not:
- be treated as a current runtime
- be cited as evidence that Lane A is incorrect
- allow its architecture to leak into Lane A via informal implementation

---

## 6. Non-Collapse Governance Rules

The following rules are binding on all future contracts.

**Rule NC-01: Implementation artifacts do not redefine architecture.**

A script, JSON file, or markdown document that exists in the repository does not confer architectural authority by its presence. Architecture is defined by governance contracts.

**Rule NC-02: Filesystem presence ≠ canonical runtime.**

The existence of a file at a path does not make it part of the active runtime. Only files explicitly invoked by the productized pipeline scripts constitute the active runtime.

Examples of violation:
- Citing `docs/pios/40.5/signal_output_set.md` as evidence of the active signal model (Lane B artifact, Lane A says nothing)
- Citing `run_relational_recovery_01/signals/relational_signal_set.json` as an implementation pattern (Lane C artifact)

**Rule NC-03: Prototype artifacts ≠ implementation authority.**

Lane C artifacts may inspire design but do not authorize implementation. No formula, schema, or value from Lane C may be imported into Lane A or Lane D without an explicit promotion contract.

**Rule NC-04: Naming debt ≠ semantic authority.**

The current use of PSIG-XXX in Lane A (generic distribution signals) does not define the semantic meaning of PSIG in the target architecture (Lane D). The namespace debt is documented in Section 2 of this lock. Any contract that uses PSIG must explicitly declare which definition applies.

**Rule NC-05: Lane must be declared at the start of every future contract.**

No future integration contract is valid without a LANE_SCOPE declaration (see Section 7).

**Rule NC-06: Lane A must remain runnable.**

No contract that affects Lane A artifacts may leave Lane A in a non-runnable state. If a transition is required, it must be atomic and tested before commit.

**Rule NC-07: Lane B must not be silently promoted.**

Lane B artifacts may not be treated as active runtime without an explicit promotion contract that reclassifies them. The prior 40.5 consumption verification (cd009b9) confirmed Lane B is inactive. That finding cannot be overridden without a new verification stream.

**Rule NC-08: Lane C must remain isolated.**

Lane C artifacts (`run_relational_recovery_01/`, R-PSIG namespace, UUID client artifacts) must not be cited in Lane A or Lane D implementation contracts. They are forensic artifacts only.

---

## 7. Contract Governance Rule — LANE_SCOPE Header

Every future PSEE ↔ PiOS integration contract must include the following header before any task or execution specification:

```
LANE_SCOPE:
  ACTIVE:    [A | none]
  REFERENCE: [B | none]
  PROTOTYPE: [C | none]
  TARGET:    [D | none]
  
LANE_IMPACT:
  Modifies Lane A artifacts: YES | NO
  Modifies Lane B artifacts: YES | NO
  References Lane C artifacts: YES | NO
  Advances Lane D target: YES | NO
```

**Omission rule:** A contract without LANE_SCOPE is INVALID.

**Combination rules:**

| Combination | Allowed | Constraint |
|-------------|---------|------------|
| A only | YES | Default for runtime work |
| A + D | YES | Migration work; must include Lane A preservation proof |
| B only | YES | Reference/documentation work |
| C only | YES | Forensic/research work |
| D only | YES | Architecture/design work |
| A + C | NO | Prototype artifacts must not enter Lane A |
| B → A (promotion) | YES, if explicit | Requires explicit promotion contract citing this lock |
| C → A (promotion) | NO without promotion contract | Lane C must be formally promoted to Lane B first |
| A + B conflated | NO | Must remain distinct |

---

## 8. Prior Stream Classification

This section classifies all streams executed in this session. History is not rewritten. Each classification reflects current validity relative to this governance lock.

### VALID / ACTIVE

**PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.CORRECTION.01** (2705bca)

The corrected boundary contract. PSEE/PiOS boundary definition is correct. Signal ownership rule is correct. Mode classification correction (evidence-based gate, not invented path) is correct. Binding_envelope as a 40.4 output is correct.

**Note for Lane D use:** The 40.4 boundary remains the PSEE output boundary. Lane D does not change where PSEE ends; it changes what PiOS consumes from it.

**PI.PSEE-PIOS.40_5-CONSUMPTION-VERIFICATION.01** (cd009b9)

All findings are factually correct. 40.5 markdown path confirmed inactive. No PSEE consumption confirmed. 9 gaps correctly identified. 

**Note:** The framing of "40.5 as first signal layer" reflects the governance boundary (Lane B design), not the active runtime (Lane A). Both statements are true in their respective lanes.

**PI.PSEE-PIOS.PRODUCTIZED-JSON-SIGNAL-PATH.VERIFICATION.01** (d2cd8c5)

Full Lane A path proven from source code. Active. Correct adapter target (binding_envelope.json at 75.x input) confirmed.

**PI.PSEE.REINTRODUCTION.BASELINE.01** (fde35e2)

PSEE reintroduction baseline and phase plan remain valid. Phase 0 (signal_selection.json config) remains applicable. Execution target corrected by run selection stream.

**PI.PSEE.REINTRODUCTION.RUN-SELECTION.01** (e9f87e2)

All 12 BlueEdge runs inspected. Tier ranking valid. `run_blueedge_e2e_execute_02` as execution foundation remains correct. `run_01_authoritative` as intake anchor only remains correct.

**PI.FASTAPI.RELATIONAL-SIGNAL-MODEL-FORENSICS.01** (8c6bd62)

All Q1–Q7 answers correct. 9.43 traced to UUID client. No third signal model confirmed. Two models only (DISTRIBUTION_BASED / RELATIONAL_EDGE_BASED). These findings are factual and do not change with Lane classification.

### VALID / PARTIALLY SUPERSEDED

**PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.DESIGN.01** (e8dc76e)

**Sidecar extraction design is valid.** The allowed inputs (Section 3), forbidden inputs (Section 4), sidecar output schema (Section 5), eligibility rules (Section 6), fail-closed behavior (Section 7), and ST-030..035 extraction logic are all correct and remain authoritative.

**Consumer target is incorrect.** The design placed the sidecar output at the 40.5 markdown boundary (`docs/pios/40.5/` context). The correct consumer is the 75.x input boundary (Lane A). The sidecar file `psee_40_5_input.json` may keep its name, but its downstream consumer is `75x/compute_condition_correlation.py` (or a pre-75x enrichment step), not any 40.5 markdown process.

**Classification:** Partially valid. Section 2 (adapter location) requires correction in the implementation contract. All other sections remain authoritative.

### VALID / SUPERSEDED

**PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.01** (e68d6e0, initial version)

Superseded by the correction stream (2705bca). Must not be referenced. The corrected contract is the authoritative version.

---

## 9. Current Governance State

### Execution status of each lane today (2026-05-06, baseline 93098cb):

| Lane | Status | Execution | Namespace |
|------|--------|-----------|-----------|
| A | ACTIVE | `run_client_pipeline.py` → 75.x → 41.x → vault | PSIG-001/002/004/006 (naming debt: should be DPSIG) |
| B | INACTIVE | `build_signal_artifacts.py` (not called by pipeline) | SIG-001..008 (BlueEdge telemetry, run_01_blueedge) |
| C | BLOCKED | `run_relational_recovery_01` isolated | R-PSIG-001..004 |
| D | NOT YET IMPLEMENTED | architecture design only | DPSIG (generic) / PSIG (PSEE-enriched) |

### Blocking points for Lane D activation:

| ID | Blocker | Resolved By |
|----|---------|-------------|
| BP-01 | psig_computation.json authorization not issued (40x.04 contract) | Future: 40x.04 stream |
| BP-02 | PSEE pipeline not activated for any canonical client (canonical_topology.cluster_count=0) | Future: run_blueedge_psee_candidate_01 |
| BP-03 | Sidecar adapter consumer target needs correction (adapter design points to inactive Lane B) | Future: implementation contract with Lane A consumer |
| BP-04 | DPSIG namespace migration not performed (current PSIG-XXX in Lane A must be renamed) | Future: namespace migration contract |
| BP-05 | PSIG-001..008 derivation code does not exist (expansion_registry defines candidates; no implementation) | Future: after BP-01, BP-02 resolved |

### Governance documents with active design authority for Lane D:

| Document | Scope |
|----------|-------|
| `docs/pios/40.5/signal_selector_specification.md` | Selector model for PSIG group selection |
| `docs/pios/40.5/static_signal_expansion_registry.md` | PSIG-001..008 provisional candidate definitions |
| `docs/pios/40.5/static_signal_expansion_index.md` | ST-030..035 field index, key decisions |
| `docs/pios/40.4/static_telemetry_expansion_registry.md` | ST-030..035 field definitions |
| `docs/psee/PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.DESIGN.01/PSEE_HANDOFF_ADAPTER_DESIGN.md` | Sidecar schema and eligibility rules (consumer target requires correction) |
| `docs/psee/PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.01/40_4_HANDOFF_CONTRACT.md` | PSEE/PiOS boundary definition |

---

## 10. Validation

PASS criteria:

- [x] All four lanes explicitly separated with status, artifacts, and authority (Sections 2–5)
- [x] Namespace debt documented — PSIG(Lane A) ≠ PSIG(Lane D); DPSIG as target generic namespace (Sections 2, 5)
- [x] Active runtime correctly identified — Lane A, binding_envelope.json → 75.x, PSIG-XXX (Section 2)
- [x] Markdown path correctly downgraded — Lane B, inactive, run_01_blueedge legacy (Section 3)
- [x] Prototype lane correctly isolated — Lane C, R-PSIG, run_relational_recovery_01, non-canonical (Section 4)
- [x] Target architecture correctly scoped — Lane D, not yet implemented, 5 blocking points defined (Section 5)
- [x] Future contract governance rule explicit — LANE_SCOPE header required; omission = INVALID (Section 7)
- [x] No implementation performed

Status: PASS
