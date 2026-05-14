# Canonical Contract Alignment
## PI.LENS.PIPELINE-CONFORMANCE.FASTAPI.01

**Generated:** 2026-05-01  
**Reference:** docs/psee/PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01/

---

## Canonical Contract Intent vs. Current Pipeline Behavior

### Canonical E2E Contract (PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01)

The E2E contract was established for BlueEdge and locked as `CANONICAL_E2E_CONTRACT_LOCKED`. It documents the full 9-phase, 14-stage pipeline with the following declared scope:

> "A 9-phase, 14-stage sequential pipeline orchestrated by `run_client_pipeline.py`. The pipeline is fail-closed on any phase failure — downstream phases do not execute."

The contract's `input_contract.md` defines required `source_manifest.json` fields including `dom_layer_path` and `integration_validation_path`. These fields are required for non-conformance-path execution.

The contract's `gap_register_contract.md` documents:
- **GAP-01** (ACTIVE): Signal computation STAGE_NOT_AUTOMATED — mitigated by `fastapi_conformance_path`
- **GAP-02** (ACTIVE): Signal registry STAGE_NOT_AUTOMATED — mitigated by `fastapi_conformance_path`
- **GAP-03** (ACTIVE): vault_index.json not pipeline-generated — no mitigation

### Alignment Analysis

| Contract Claim | Actual Behavior | Aligned? |
|----------------|-----------------|----------|
| "Pipeline orchestrated by run_client_pipeline.py" | Correct: orchestrator is the entrypoint | YES |
| "Fail-closed on any phase failure" | Correct: fail-closed behavior verified | YES |
| "Client-agnostic — all paths resolved through client.yaml + source_manifest.json" | Partially: all path resolution uses source_manifest fields, but source_manifest fields are defined manually per client, with no validation that required fields (dom_layer_path, integration_validation_path) are present | PARTIAL |
| "9-phase, 14-stage" | Phases 1-9 are implemented. Stage subdivision within phases is implicit. | YES |
| "Phase 1-4 gate quality of pre-existing artifacts" | Verified: phases 1-4 are pure validation gates | ALIGNED — but the contract does not explicitly state that these phases have no generation capability |
| "Phase 5: Build Binding Envelope from CEU + DOM" | Correct when non-conformance path. BUT requires dom_layer_path and ceu_grounding_registry, neither of which is produced by Phases 1-4. | ALIGNED_TO_SPEC — gap is acknowledged but not in orchestrator scope |
| "Conditionally automated — Phases 5/6+7 support fastapi_conformance_path" | Correct: conformance path bypasses compute | YES |
| "14 callers documented in caller_inventory.json" | Caller chain matches. phase_03_40x_structural was always a validator; CALLER-06 is listed as "40.x structural verification (PASS gate)" | ALIGNED — contract acknowledges verification-only nature |
| STAGE_NOT_AUTOMATED GAP-01/02 mitigated by conformance path | Correct for BlueEdge. For FastAPI, no fastapi_conformance_path artifacts exist yet. | PARTIAL — mitigation path exists in code but not configured for FastAPI |

### Key Contract Finding

The canonical E2E contract describes Phases 1-4 as "verification" stages — not generation stages. The `stage_contracts.json` labels:
- S01 through S04: "CLIENT_MANIFEST_LOAD, SOURCE_MANIFEST_LOAD, SOURCE_BOUNDARY_VERIFY, INTAKE_VERIFY"
- S05: "40X_STRUCTURAL_VERIFY"
- S06: "CEU_GROUNDING_VERIFY"

The word "VERIFY" in each stage name is accurate. The contract was established for BlueEdge, where all pre-Phase-5 artifacts existed because they were produced by prior BlueEdge-specific pipelines (PI.BLUEEDGE.CLEAN-INTAKE.01, PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01, etc.). Those pipelines are not part of `run_client_pipeline.py`.

### Contract Gap for Multi-Client Generalization

The E2E contract does not define how a NEW client bootstraps the pre-Phase-5 artifact set. The contract assumes artifacts pre-exist. For BlueEdge (the reference client), this assumption holds. For FastAPI (the second client), the artifacts must be produced by client-specific bootstrap contracts that are outside the orchestrator's scope.

**This is the core conformance gap:** The canonical E2E contract is a BlueEdge-anchored document that was never designed to define how a new client bootstraps its artifact preconditions. The orchestrator inherits this design and fails closed at each validation phase when a new client lacks the expected artifacts.

### fastapi_conformance_path: Contract-Sanctioned Bypass

The `fastapi_conformance_path` mechanism is explicitly acknowledged in the canonical E2E contract as a STAGE_NOT_AUTOMATED mitigation for GAP-01 and GAP-02. It is architecturally sanctioned. For a new client to advance through the pipeline without native compute capability for Phases 3/4, a similar "conformance artifact" approach could be used — i.e., a pre-computed structural artifact set that the orchestrator imports at each validation phase rather than computing from scratch.

This would reframe the architecture: instead of a true orchestrator generating all artifacts, the pipeline becomes a **conformance-path orchestrator** that assembles pre-computed artifacts into a complete run. This is a valid design choice but must be explicitly declared.
