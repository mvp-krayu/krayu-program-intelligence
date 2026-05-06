# PSEE–PiOS Namespace Debt Mapping

Stream: PI.PSEE-PIOS.NAMESPACE-DEBT-MAPPING.01  
Status: COMPLETE  
Generated: 2026-05-05  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A artifacts: NO  
  Modifies Lane B artifacts: NO  
  References Lane C artifacts: NO  
  Advances Lane D target: YES  

Authoritative inputs:
- LANE_GOVERNANCE_LOCK.md (3fa0ad2)
- CONSOLIDATION_RESTART_PLAN.md (5c4786e)
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/signal_registry.json`
- `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/41.x/signal_projection.json`
- `docs/pios/40.5/static_signal_expansion_registry.md`
- `docs/pios/40.4/static_telemetry_expansion_registry.md`

---

## 1. Purpose

This document is the authoritative namespace mapping between:

- **Current Lane A signal identifiers** (PSIG-XXX, generic runtime, computed from any binding_envelope)
- **Target Lane D generic identifiers** (DPSIG-XXX, explicit distribution signal designation)
- **Reserved Lane D PSEE-enriched identifiers** (PSIG-XXX in Lane D context, blocked by BP-01 and BP-02)

This mapping produces no code changes and mutates no runtime artifacts. It is a required reference for all subsequent contracts in the PI.PSEE-PIOS consolidation sequence (Steps B → E of the restart plan).

---

## 2. Current Lane A Signal Inventory

Source: `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/signal_registry.json`  
Productized baseline commit: 93098cb  

All signals below are confirmed emitted by the active Lane A pipeline.

| Signal ID | Label | Value (baseline) | Method | Population Type | Pop Size | Primary Entity |
|-----------|-------|-----------------|--------|-----------------|----------|----------------|
| PSIG-001 | coupling_pressure | 2.32 | RUN_RELATIVE_OUTLIER | per_node_inbound_coupling | 33 | CE-10 / DOM-01 |
| PSIG-002 | export_pressure | 6.96 | RUN_RELATIVE_OUTLIER | per_node_outbound_exports | 33 | DOM-01 |
| PSIG-004 | cluster_fragmentation | 1.0 | RUN_RELATIVE_OUTLIER | cluster_membership | 33 | CE-10 / DOM-01 |
| PSIG-006 | isolation_pressure | 0.13793103448275862 | THEORETICAL_BASELINE | node_isolation_ratio | 33 | (run-wide) |

**Signals not activated in baseline run:**

| Signal ID | Reason |
|-----------|--------|
| PSIG-003 | No derivation formula exists in `compute_condition_correlation.py`; hardcoded absent in `compute_signal_projection.py:360` |
| PSIG-005 | No derivation formula exists; hardcoded absent |

**Authority class:** All active Lane A signals carry `signal_authority: PROVISIONAL_CKR_CANDIDATE`.

**Guardrail GR-01 (from signal_registry.json):** z-scores are run-relative (n=33 nodes). Values are not comparable across runs of different sizes.

---

## 3. Derivation Source — Lane A

Source: `scripts/pios/75x/compute_condition_correlation.py`

Each Lane A signal is derived exclusively from `binding/binding_envelope.json`. No PSEE-specific fields are consumed.

| Signal ID | Formula | Input Fields |
|-----------|---------|--------------|
| PSIG-001 | `fan_in[node] / mean_fan` where `mean_fan = total_edges / total_nodes` | `edges[].to_node`, `nodes[]` |
| PSIG-002 | `fan_out[node] / mean_fan` | `edges[].from_node`, `nodes[]` |
| PSIG-004 | `surfaces_per_ceu[node] / mean_surfaces` where `mean_surfaces = total_surfaces / total_ceus` | `capability_surfaces[].provenance.parent_node`, `nodes[]` |
| PSIG-006 | BFS connected component analysis; isolated nodes (component size = 1) → ACTIVATED | `nodes[]`, `edges[]` |

**Classification:** Each of these is a **GENERIC_RUNTIME_SIGNAL** — derivable from any compliant `binding_envelope.json` regardless of whether the run is PSEE-enriched or generic.

---

## 4. GENERIC_RUNTIME_SIGNAL Classification

The following formal classification applies to all four active Lane A signals:

```
CLASSIFICATION: GENERIC_RUNTIME_SIGNAL
Definition: A signal whose derivation formula depends only on structural topology fields
            present in any compliant binding_envelope.json.
            No PSEE-specific fields are required.
            No ST-030..035 telemetry fields are consumed.
Scope: Lane A only (active runtime)
Target designation in Lane D: DPSIG-XXX (see Section 5)
```

This classification is NOT a demotion. It is a factual statement of input dependency. These signals are valid and correctly computed. The GENERIC_RUNTIME_SIGNAL classification distinguishes them from future PSEE-enriched signals that will require ST-030..035 inputs.

---

## 5. Target DPSIG Alias Mapping (Lane A → Lane D)

When Lane D is activated, the current PSIG-XXX generic distribution signals will be formally aliased to DPSIG-XXX. The table below defines the authoritative mapping.

| Current (Lane A) | Target (Lane D) | Signal Label | Computation | Method | Classification |
|-----------------|-----------------|-------------|-------------|--------|----------------|
| PSIG-001 | DPSIG-001 | coupling_pressure | fan_in / mean_fan | RUN_RELATIVE_OUTLIER | GENERIC_RUNTIME_SIGNAL |
| PSIG-002 | DPSIG-002 | export_pressure | fan_out / mean_fan | RUN_RELATIVE_OUTLIER | GENERIC_RUNTIME_SIGNAL |
| PSIG-004 | DPSIG-004 | cluster_fragmentation | surfaces_per_ceu / mean_surfaces | RUN_RELATIVE_OUTLIER | GENERIC_RUNTIME_SIGNAL |
| PSIG-006 | DPSIG-006 | isolation_pressure | BFS isolated node fraction | THEORETICAL_BASELINE | GENERIC_RUNTIME_SIGNAL |

**Alias rule:** The DPSIG-XXX identifier does not replace PSIG-XXX in Lane A artifacts. It is the designated future name in Lane D context. Until the alias metadata step (PI.PSEE-PIOS.NAMESPACE-ALIAS-METADATA.IMPLEMENTATION.01) is executed, PSIG-XXX is the running label in all Lane A artifacts.

**No-rename rule:** Lane A artifacts (`signal_registry.json`, `signal_projection.json`, `condition_correlation_state.json`) MUST NOT have their `signal_id` fields renamed. The DPSIG mapping is additive metadata, not a field rename.

---

## 6. Reserved Future PSIG Namespace (Lane D, PSEE-Enriched)

When Lane D is activated and BP-01 + BP-02 are resolved, the PSIG namespace in Lane D context designates PSEE-enriched topology signals. These are distinct from the generic DPSIG-XXX signals.

Source: `docs/pios/40.5/static_signal_expansion_registry.md` (PROVISIONAL DESIGN — no execution authorized)

| Reserved ID (Lane D) | Signal Name | Telemetry Source | ST Field | Status |
|---------------------|-------------|-----------------|----------|--------|
| PSIG-001 | Fan-In Concentration | ST-030: MAX_FAN_IN (max incoming edges) | binding_envelope | INPUT_DEFINED |
| PSIG-002 | Fan-Out Propagation | ST-031: MAX_FAN_OUT (max outgoing edges) | binding_envelope | INPUT_DEFINED |
| PSIG-003 | Cross-Domain Coupling Ratio | ST-032: CROSS_DOMAIN_EDGE_COUNT (OVERLAP_STRUCTURAL edges) | binding_envelope | INPUT_DEFINED |
| PSIG-004 | Responsibility Concentration | ST-033: MAX_RESPONSIBILITY_SURFACE (max capability_surfaces per CEU) | binding_envelope | INPUT_DEFINED |
| PSIG-005 | Interface Surface Area | ST-034: TOTAL_INTERFACE_SURFACE (total capability_surface nodes) | binding_envelope | INPUT_DEFINED |
| PSIG-006 | Structural Fragmentation Index | ST-035: STRUCTURAL_CLUSTER_COUNT (BFS connected components) | binding_envelope | INPUT_DEFINED |

**Blocking conditions for Lane D PSIG activation:**

| Blocker | Requirement | Current State |
|---------|-------------|---------------|
| BP-01 | `psig_computation.json` authorization issued (40x.04 contract) | NOT YET ISSUED |
| BP-02 | PSEE pipeline activated: `canonical_topology.cluster_count > 0` | NOT YET (pending run_blueedge_psee_candidate_01) |
| Step C | Sidecar builder implemented | NOT YET (pending PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01) |
| Step B | Binding envelope contract stable | NOT YET (pending PI.PSEE-PIOS.BINDING-ENVELOPE-CONSUMPTION-CONTRACT.01) |

---

## 7. Namespace Collision Rule

The following rule governs all future contracts and run artifacts:

> **PSIG(Lane A) and PSIG(Lane D) MUST NOT coexist in the same run artifact without an explicit lane declaration.**

A run artifact that contains `signal_id: PSIG-001` is a Lane A artifact unless it explicitly declares `lane: D`. Mixing Lane A PSIG values with Lane D PSIG values in the same `signal_registry.json` without a lane declaration is a namespace collision and constitutes an invalid artifact.

**Resolution options:**

1. Separate run contexts with explicit lane declarations per artifact
2. DPSIG-XXX alias field alongside `signal_id: PSIG-XXX` (additive, implemented by PI.PSEE-PIOS.NAMESPACE-ALIAS-METADATA.IMPLEMENTATION.01)
3. Fully renamed Lane D artifacts carrying only DPSIG-XXX (future; not yet authorized)

Option 2 is the recommended path per the restart plan (Step D).

---

## 8. Migration Path

```
Current state:
  Lane A artifacts carry signal_id: PSIG-001/002/004/006
  DPSIG namespace: absent from all scripts and artifacts
  Lane D PSIG: not yet implemented

Step 1 — Alias Metadata (PI.PSEE-PIOS.NAMESPACE-ALIAS-METADATA.IMPLEMENTATION.01):
  Add dpsig_alias field to Lane A artifacts (signal_registry.json, signal_projection.json)
  Pattern: { "signal_id": "PSIG-001", "dpsig_alias": "DPSIG-001", ... }
  No field renamed. No existing consumer broken.

Step 2 — Sidecar Implementation (PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.IMPLEMENTATION.01):
  Build psee_40_5_input.json with ST-030..035 values from binding_envelope
  Consumer: Lane A 75.x boundary (NOT Lane B markdown)

Step 3 — PSIG Derivation (PI.PSEE-PIOS.PSIG-DERIVATION.01):
  Blocked by BP-01 + BP-02
  When activated: compute_condition_correlation.py reads sidecar
  Produces: both DPSIG conditions (generic) + PSIG conditions (PSEE-enriched) from single 75.x run

Step 4 — Full rename (future, no contract yet):
  Lane A artifacts formally adopt DPSIG-XXX as primary signal_id
  PSIG-XXX designation freed for Lane D PSEE-enriched context only
```

---

## 9. No-Change Rule

**The following artifacts MUST NOT be modified by any contract that cites this mapping document as authority:**

| Artifact | Protected Field | Reason |
|----------|----------------|--------|
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/signal_registry.json` | `signal_id` | Productized baseline — canonical reference values |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/41.x/signal_projection.json` | `signal_id` | Canonical projection — protected baseline |
| `scripts/pios/75x/compute_condition_correlation.py` | signal computation | Lane A core runtime |
| `scripts/pios/75x/compute_pressure_candidates.py` | signal computation | Lane A core runtime |
| `scripts/pios/41x/compute_signal_projection.py` | signal emission | Lane A core runtime |

The DPSIG mapping is a governance designation. It does not authorize field renames in any existing artifact.

---

## 10. Recommended Immediate Implementation Step

**Contract:** PI.PSEE-PIOS.NAMESPACE-ALIAS-METADATA.IMPLEMENTATION.01  
**Lane scope:** A + D  
**Modifies Lane A:** YES — additive only  

**Scope:** Add `dpsig_alias` fields to Lane A runtime artifacts without renaming or removing any existing field. This is the minimal step that allows downstream consumers to begin using DPSIG naming while preserving full backward compatibility with PSIG-XXX references.

**Implementation pattern:**

```json
{
  "signal_id": "PSIG-001",
  "dpsig_alias": "DPSIG-001",
  "signal_label": "coupling_pressure",
  "signal_value": 2.32,
  "activation_method": "RUN_RELATIVE_OUTLIER"
}
```

**What this step does NOT do:**
- Does not rename any `signal_id` field
- Does not break any existing report generation
- Does not modify `compute_condition_correlation.py` or any 75.x script
- Does not implement PSIG derivation (that is Step E, blocked by BP-01/BP-02)

**Prerequisites:**
- This mapping document (current document) must be locked
- No further signal path changes may occur before this step

---

## 11. Validation

PASS criteria:

- [x] All active Lane A signals inventoried from authoritative productized baseline (Section 2)
- [x] GENERIC_RUNTIME_SIGNAL classification defined and applied to all four active signals (Section 4)
- [x] DPSIG alias mapping table complete — all four active PSIG-XXX mapped to DPSIG-XXX targets (Section 5)
- [x] Reserved Lane D PSIG namespace documented with blocking conditions (Section 6)
- [x] Namespace collision rule stated (Section 7)
- [x] No-change rule defined — no existing artifacts authorized for field rename (Section 9)
- [x] Minimum implementation step defined as alias metadata only, not runtime rename (Section 10)
- [x] No code changes performed
- [x] No runtime artifacts mutated

Status: PASS
