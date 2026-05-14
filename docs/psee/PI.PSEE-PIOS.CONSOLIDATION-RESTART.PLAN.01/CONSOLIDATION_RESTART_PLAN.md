# PSEE → PiOS Consolidation Restart Plan

Stream: PI.PSEE-PIOS.CONSOLIDATION-RESTART.PLAN.01  
Status: LOCKED — AUTHORITATIVE RESTART PLAN  
Generated: 2026-05-06  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Modifies Lane B artifacts: NO  
  References Lane C artifacts: NO  
  Advances Lane D target: YES  

Authoritative inputs:
- LANE_GOVERNANCE_LOCK.md (3fa0ad2)
- PRODUCTIZED_JSON_SIGNAL_PATH.md (d2cd8c5)
- Productized baseline: 93098cb

---

## 1. Restart Rationale

The prior consolidation work produced four research streams, one design, and one boundary correction. All are correct within their stated scope. One requires correction before implementation: the adapter design (e8dc76e) placed its sidecar consumer at the Lane B boundary (40.5 markdown), which is inactive in production. The active runtime (Lane A) begins at `binding/binding_envelope.json → 75.x`. The sidecar consumer must be repointed to that boundary.

Everything else in the prior stream chain is valid and reusable. This plan does not discard prior work. It sequences what exists correctly and defines what to build next.

---

## 2. Prior Adapter Design Status

**PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.DESIGN.01 (e8dc76e)**

| Section | Status | Action Required |
|---------|--------|----------------|
| Allowed inputs (Section 3) | VALID — retain as-is | None |
| Forbidden inputs (Section 4) | VALID — retain as-is | None |
| Sidecar output schema (Section 5) | VALID — retain as-is | None |
| Eligibility rules (Section 6) | VALID — retain as-is | None |
| Fail-closed behavior (Section 7) | VALID — retain as-is | None |
| Generic preservation rules (Section 8) | VALID — strengthen: protects Lane A, not just "generic path" | Clarify in implementation contract |
| Future implementation boundary (Section 9) | VALID — untouched files list correct | None |
| **Adapter location (Section 2)** | **SUPERSEDED for active runtime** | **Consumer target corrected in this plan** |
| Next contract recommendation (Section 10) | PARTIALLY VALID — contract name correct; scope needs correction | Corrected in this plan |

**Specific correction:**

The adapter design states the sidecar feeds "PiOS 40.5 signal derivation" and describes a passive optional sidecar that 40.5 markdown consumers would read. This path is Lane B (inactive).

**Corrected consumer:** `scripts/pios/75x/compute_condition_correlation.py` or a pre-75.x enrichment step that reads the sidecar before compute_condition_correlation.py is invoked. The sidecar file `psee_40_5_input.json` may retain its name for continuity — only its downstream consumer changes.

The sidecar builder script (`build_psee_handoff_sidecar.py`) and its output schema remain valid. The implementation contract must explicitly state it targets the Lane A 75.x boundary.

---

## 3. Locked Truths for All Future Contracts

These truths are non-negotiable and must not be re-derived in each contract.

**From Lane Governance Lock (3fa0ad2):**

1. Lane A is the active runtime. Binding_envelope.json → 75.x → 41.x → vault → reports.
2. Lane B (docs/pios/40.4/*.md, docs/pios/40.5/*.md) is inactive in production. No future contract may treat it as active without a promotion stream.
3. Lane C (run_relational_recovery_01, R-PSIG) is isolated. No future contract may import Lane C patterns into Lane A or D without an explicit promotion contract.
4. Current PSIG-001/002/004/006 in Lane A are generic distribution signals. Their target namespace is DPSIG.
5. PSIG in Lane D = PSEE-specific enriched topology signals. These do not yet exist as executable code.

**From Productized JSON Signal Path Verification (d2cd8c5):**

6. The "DPSIG" identifier has no current implementation. It is a governance designation for what PSIG-001/002/004/006 should be called in Lane D.
7. 75x/compute_condition_correlation.py is the first executable signal computation step. Any PSEE enrichment must be injected at or before this step.
8. The only input to signal computation today is `binding/binding_envelope.json`.

---

## 4. What Must Remain Untouched

The following must not be modified by any contract in this restart sequence unless that contract explicitly states Lane A modification with preservation proof.

| Artifact | Protection Reason |
|----------|------------------|
| `scripts/pios/75x/compute_condition_correlation.py` | Lane A signal computation — core runtime |
| `scripts/pios/75x/compute_pressure_candidates.py` | Lane A signal computation — core runtime |
| `scripts/pios/75x/compute_pressure_zones.py` | Lane A signal computation — core runtime |
| `scripts/pios/41x/compute_signal_projection.py` | Lane A projection — core runtime |
| `scripts/pios/run_client_pipeline.py` | Pipeline orchestrator — must remain runnable |
| `scripts/pios/run_end_to_end.py` | E2E orchestrator — must remain runnable |
| `scripts/pios/lens_report_generator.py` | Report generation — active reports must remain valid |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/` | Productized baseline run — reference runtime state |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/signal_registry.json` | Canonical signal values — protected baseline |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/41.x/signal_projection.json` | Canonical projection — protected baseline |
| `docs/psee/PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.01/40_4_HANDOFF_CONTRACT.md` | Locked boundary contract |
| `docs/psee/PI.PSEE-PIOS.LANE-GOVERNANCE-LOCK.01/LANE_GOVERNANCE_LOCK.md` | This governance lock |

---

## 5. Corrected Implementation Sequence

Five steps in dependency order. Each step is a separate contract. Steps may not be reordered.

---

### Step A — Namespace Debt Mapping (DOCUMENTATION, no code change)

**Contract:** PI.PSEE-PIOS.NAMESPACE-DEBT-MAP.01  
**Lane scope:** A + D  
**Modifies Lane A:** NO  

**Objective:** Produce a formal mapping document that explicitly ties current Lane A signal IDs to their Lane D target names. This becomes a required reference for all subsequent contracts.

**Output:** `docs/psee/PI.PSEE-PIOS.NAMESPACE-DEBT-MAP.01/NAMESPACE_DEBT_MAP.md`

**Minimum required content:**

| Current (Lane A) | Target (Lane D) | Computation | Method | Notes |
|-----------------|-----------------|-------------|--------|-------|
| PSIG-001 | DPSIG-001 | fan_in/mean_fan | RUN_RELATIVE_OUTLIER | generic, any binding_envelope |
| PSIG-002 | DPSIG-002 | fan_out/mean_fan | RUN_RELATIVE_OUTLIER | generic |
| PSIG-004 | DPSIG-004 | surfaces_per_ceu/mean_surfaces | RUN_RELATIVE_OUTLIER | generic |
| PSIG-006 | DPSIG-006 | isolated node fraction | THEORETICAL_BASELINE | generic |
| (new) PSIG-001..008 | PSIG-001..008 | ST-030..035 derived | RUN_RELATIVE_OUTLIER | PSEE-enriched; blocked by BP-01/BP-02 |

**Dependencies:** None. Executable immediately.  
**Blocks:** Nothing directly. Clarifies language for all subsequent contracts.

---

### Step B — Binding Envelope Contract (DOCUMENTATION, no code change)

**Contract:** PI.PSEE-PIOS.BINDING-ENVELOPE-CONSUMPTION-CONTRACT.01  
**Lane scope:** A + D  
**Modifies Lane A:** NO  

**Objective:** Define the exact schema contract for `binding/binding_envelope.json` as consumed by Lane A's 75.x scripts. This is the authoritative handoff interface between the PSEE pipeline and signal computation.

**What this is NOT:** This is not a new contract inventing a new interface. It is a formal recording of the existing interface used by compute_condition_correlation.py.

**Output:** `docs/psee/PI.PSEE-PIOS.BINDING-ENVELOPE-CONSUMPTION-CONTRACT.01/BINDING_ENVELOPE_CONTRACT.md`

**Minimum required content:**

1. Exact fields consumed by compute_condition_correlation.py from binding_envelope.json: `nodes[].node_id`, `nodes[].type`, `nodes[].label`, `edges[].from_node`, `edges[].to_node`, `capability_surfaces[].provenance.parent_node`, `capability_surfaces[].parent_context`
2. Exact derivation in compute_condition_correlation.py: fan_in, fan_out, mean_fan, surfaces_per_ceu, connected components — all from binding_envelope fields only
3. Schema stability guarantee: these fields must remain present in any future binding_envelope variant (generic or PSEE-enriched)
4. PSEE enrichment extension rule: any PSEE-enriched binding_envelope must be a superset of the generic schema; generic fields must not be renamed or removed

**Dependencies:** None. Executable immediately.  
**Blocks:** Step C (sidecar implementation requires knowing the binding contract first).

---

### Step C — PSEE-Enriched Binding Sidecar Implementation

**Contract:** PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01  
**Lane scope:** A + D  
**Modifies Lane A:** NO (sidecar is additive; Lane A scripts are not modified)  

**Objective:** Implement `scripts/pios/psee_handoff/build_psee_handoff_sidecar.py` per the existing adapter design (e8dc76e), with the consumer target corrected to the Lane A 75.x boundary.

**Correction from prior design:** The sidecar document (Section 2 of e8dc76e) described the sidecar as a Lane B input. The implementation contract must state:

> The sidecar `psee_40_5_input.json` is produced for consumption by a Lane A pre-75.x enrichment step, not by any Lane B (docs/pios/40.5/) process.

**What the sidecar builder produces (unchanged from prior design):**

`artifacts/psee_handoff/<client>/<run_id>/psee_40_5_input.json`

Fields: `topology_summary` (cluster_count from canonical_topology), `ceu_summary` (grounding_ratio, total_ceu from grounding_state_v3), `binding_summary` (ST-030..035 extracted from binding_envelope), `readiness`, `disable_reason`.

**This contract does NOT:**
- Modify compute_condition_correlation.py or any 75.x script
- Make 75.x consume the sidecar (that is Step E)
- Compute any PSIG values
- Touch Lane A runtime artifacts

**Dependencies:** Step B (binding contract must be stable before implementing extraction from binding_envelope).  
**Blocked by:** BP-02 partially (sidecar can be built and validated against any existing PSEE run; full end-to-end requires run_blueedge_psee_candidate_01).

---

### Step D — DPSIG Alias Layer (OPTIONAL, non-breaking)

**Contract:** PI.PSEE-PIOS.DPSIG-ALIAS.01  
**Lane scope:** A + D  
**Modifies Lane A:** YES — additive only  

**Objective:** Add `dpsig_alias` fields alongside existing `signal_id` fields in Lane A artifacts (signal_registry.json, signal_projection.json) so that downstream consumers can begin using DPSIG naming without breaking the existing PSIG references.

**Pattern:**

```json
{
  "signal_id": "PSIG-001",
  "dpsig_alias": "DPSIG-001",
  ...
}
```

This is additive. No existing field is renamed. Existing consumers of `signal_id: PSIG-001` continue to work unchanged.

**This contract does NOT:**
- Rename any field in any existing artifact
- Break any existing report generation
- Remove any PSIG-XXX identifier from Lane A

**Dependencies:** Step A (namespace mapping must be stable before aliasing).  
**Optional:** Lane D activation does not require this step if both PSIG(Lane A) and PSIG(Lane D) are kept in separate run contexts with explicit lane declarations. However, completing this step prevents future consumer confusion.

---

### Step E — PSIG Derivation Integration (BLOCKED pending BP-01 and BP-02)

**Contract:** PI.PSEE-PIOS.PSIG-DERIVATION.01  
**Lane scope:** A + D  
**Modifies Lane A:** YES — extends 75.x to optionally consume sidecar  

**Objective:** Extend `compute_condition_correlation.py` to optionally read `psee_40_5_input.json` when present and READY, extracting PSEE-specific topology quantities (ST-030..035) for PSIG derivation alongside generic DPSIG derivation.

**Gate conditions (all must be met before this contract is issued):**

| Gate | Requirement | Current State |
|------|-------------|---------------|
| BP-01 | psig_computation.json authorization issued (40x.04 contract) | NOT YET ISSUED |
| BP-02 | PSEE pipeline activated: canonical_topology.cluster_count > 0 | NOT YET (pending run_blueedge_psee_candidate_01) |
| Step C | Sidecar builder implemented and producing valid output | NOT YET IMPLEMENTED |
| Step B | Binding envelope contract stable | NOT YET ISSUED |

**This contract is NOT issuable today.** It is listed here to complete the sequence.

When issued, this contract will:
- Add a conditional sidecar read path to compute_condition_correlation.py
- Derive PSIG-001..006 from ST-030..035 values in the sidecar
- Produce both DPSIG and PSIG conditions from a single 75.x execution
- Preserve all existing DPSIG computation paths unchanged

---

## 6. Implementation Sequence Summary

```
Step A — Namespace Debt Mapping           [NOW — no blockers]
        ↓
Step B — Binding Envelope Contract        [NOW — no blockers]
        ↓
Step C — Sidecar Implementation           [after B; partial validation possible before BP-02]
        ↓
Step D — DPSIG Alias Layer                [after A; optional]
        ↓
Step E — PSIG Derivation Integration      [blocked: requires BP-01 + BP-02 + C + B]
```

Steps A and B are unblocked and executable immediately. They produce no code changes, only documentation artifacts that govern subsequent implementation.

---

## 7. Next Single Implementation Contract

**Recommended:** PI.PSEE-PIOS.NAMESPACE-DEBT-MAP.01 (Step A)

**Rationale:**

Step A is:
- unblocked — no dependencies
- non-invasive — no code changes, no artifact mutations
- foundation-setting — every subsequent contract (B, C, D, E) uses the namespace mapping as its reference
- small — one document, one commit

Step B is equally safe but benefits from having Step A's language established first, so contracts B and subsequent can cite the mapping table rather than re-derive it.

**Step A scope:**

```
LANE_SCOPE: A + D
LANE_IMPACT:
  Modifies Lane A artifacts: NO
  Modifies Lane B artifacts: NO
  References Lane C artifacts: NO
  Advances Lane D target: YES

OUTPUT: docs/psee/PI.PSEE-PIOS.NAMESPACE-DEBT-MAP.01/NAMESPACE_DEBT_MAP.md

CONTENT:
  1. Current PSIG → Target DPSIG mapping table
  2. New PSIG (Lane D) candidate table from static_signal_expansion_registry.md
  3. Namespace collision rule: PSIG(Lane A) and PSIG(Lane D) must not coexist in
     the same run artifact without explicit lane declaration
  4. Migration path: when DPSIG is formally implemented, PSIG(Lane A) artifacts
     are updated; until then, PSIG(Lane A) is the running label
  5. Blocking points for PSIG(Lane D) activation: BP-01, BP-02

VALIDATION:
  PASS only if:
  - all current PSIG-XXX signals are mapped to DPSIG-XXX targets
  - new PSIG-XXX candidates are sourced from static_signal_expansion_registry.md
  - no code changes performed
  - no artifacts mutated
```

---

## 8. Validation

PASS criteria:

- [x] Lane model used — LANE_SCOPE A+D declared; all sections reference lane designations
- [x] Active JSON path is primary — Lane A runtime identified as implementation target; markdown path never referenced as active
- [x] Markdown adapter superseded — prior 40.5 consumer target explicitly marked superseded in Section 2; corrected consumer stated as 75.x
- [x] Namespace debt explicit — Section 5 Step A and Section 3 locked truth 4/5 state PSIG→DPSIG debt; PSIG(Lane A) ≠ PSIG(Lane D)
- [x] No implementation performed — planning document only; no code written; no artifacts mutated

Status: PASS
