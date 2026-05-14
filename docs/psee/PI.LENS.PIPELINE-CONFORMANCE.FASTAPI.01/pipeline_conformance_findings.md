# Pipeline Conformance Findings
## PI.LENS.PIPELINE-CONFORMANCE.FASTAPI.01

**Generated:** 2026-05-01  
**Branch:** work/psee-runtime  
**Inspected:** scripts/pios/run_client_pipeline.py

---

## Executive Finding

**Classification: INCOMPLETE_ORCHESTRATOR**  
**Remediation: UPGRADE_TO_TRUE_ORCHESTRATOR**  
**Drift Risk: CRITICAL**

`run_client_pipeline.py` is not a true E2E orchestrator. It is a sequential validation gate followed by a generation layer. Phases 1–4 check whether externally-produced artifacts exist and meet quality criteria; they have no mechanism to produce those artifacts when absent. Phase 5 and Phase 8a generate outputs but require additional pre-existing inputs not produced by any prior phase. The pipeline generates only its final outputs (binding envelope, signals, vault, reports, selector) — not the structural and grounding artifacts upon which it depends.

---

## Pipeline Entrypoint Behavior

**CLI arguments:** `--client` (required), `--source` (required), `--run-id` (required)

**Client resolution:**
```python
client_cfg = load_client_config(args.client)
# → reads clients/<client_id>/client.yaml
```

**Source resolution:**
```python
source_manifest = load_source_manifest(args.client, args.source)
# → reads clients/<client_id>/sources/<source_id>/source_manifest.json
```

**Run ID behavior:**  
`run_dir = REPO_ROOT / "clients" / args.client / "psee" / "runs" / run_id`  
Created with `mkdir(parents=True, exist_ok=True)` — non-destructive.

**Artifact path derivation:**  
All paths are resolved from `source_manifest` fields. No hardcoded client paths. The client slug (from `client_id` in client.yaml) governs the `clients/<alias>/` output directory. The UUID path is used only when referenced by source_manifest fields.

---

## Phase-by-Phase Analysis

### Phases 1–4: Pure Validation Gate

All four early phases share the same pattern:
1. Resolve an artifact path from source_manifest
2. Check existence (and optionally content quality)
3. If absent → `FAIL CLOSED` with a remediation message pointing to an **external contract**
4. If present → `PASS`

None of these phases invoke any script to produce the missing artifact. The fail-closed message in Phase 3 says: `"REMEDIATION: Re-execute PI.BLUEEDGE.STRUCTURAL-PIPELINE.40X.01"` — a BlueEdge-specific contract that does not exist for FastAPI and that is not invoked by the orchestrator.

**Practical consequence:** When Phase 3 failed for FastAPI, a separate external script (`bootstrap_fastapi_40x.py`) had to be written and run manually. When Phase 4 fails, the same pattern will repeat. Each new client that onboards will require per-phase external bootstrap scripts for every validation-only phase.

### Phase 5: Mixed — Generates but Requires External Inputs

Phase 5 generates `binding_envelope.json`, which is genuinely owned by the orchestrator. However, it requires two pre-existing inputs that no prior phase generates:

1. `ceu_grounding_path/registry/ceu_grounding_registry.json` — a CEU grounding artifact
2. `dom_layer_path` — a DOM domain layer artifact

**Critical defect:** The FastAPI `source_manifest.json` does not define `dom_layer_path` or `integration_validation_path`. If Phase 5 executes without `fastapi_conformance_path` set, it will `KeyError` on `source_manifest["dom_layer_path"]`. The same error occurs in Phase 8a. These are not gap conditions — they are registration defects requiring source_manifest.json updates.

### Phase 5 Conformance Path (fastapi_conformance_path)

The `fastapi_conformance_path` bypass was designed for BlueEdge's STAGE_NOT_AUTOMATED signal computation. It allows the orchestrator to copy pre-computed canonical artifacts instead of running the automated compute path. This is a **permanent bypass**, not a temporary workaround. The compute path (`dom_layer_path` → CEU registry → binding envelope → run_end_to_end.py) is the intended orchestration chain, but it requires pre-existing artifacts that the orchestrator does not know how to produce.

### Phases 6+7, 8a, 8b, 9: Genuine Generators

These phases produce all final LENS outputs. They are orchestrator-owned. Given valid inputs, they will produce: binding envelope, signals (via run_end_to_end.py), 9 vault artifacts, full LENS report tree, and selector.

---

## Critical Structural Defect: Source Manifest Incompleteness

The FastAPI `source_manifest.json` (written by PI.LENS.FASTAPI.CLIENT-SOURCE-REGISTRATION.01) is missing fields that phase_05 and phase_08a require:

| Required Field | Present in FastAPI source_manifest? | Present in BlueEdge source_manifest? |
|---------------|-------------------------------------|--------------------------------------|
| `dom_layer_path` | NO | YES |
| `integration_validation_path` | NO | YES |

If `fastapi_conformance_path` is not set, both Phase 5 and Phase 8a will raise `KeyError`. If `fastapi_conformance_path` IS set, these fields are not accessed, but the conformance path itself requires pre-computed signal artifacts that do not yet exist for FastAPI.

---

## Governance Pattern Observed

The orchestrator's validation-only phases instruct operators to "Re-execute <external_contract>" when an artifact is absent. This establishes a governance pattern where:

1. The orchestrator acts as a quality gate over externally-produced artifacts
2. External bootstrap contracts are required for each failing phase
3. The operator is responsible for resolving phase-local dependencies before re-running

This is a **VALIDATION_GATE + GENERATION_LAYER** hybrid, not a true orchestrator.

---

## Conformance Path as Structural Pattern

The `fastapi_conformance_path` mechanism is architecturally significant. For clients where compute is STAGE_NOT_AUTOMATED, it allows pre-computed canonical artifacts to be injected at Phase 5, 6+7, and 8a. This pattern:
- Bypasses the need for `dom_layer_path`, `integration_validation_path`, and CEU registry
- Enables the orchestrator to proceed from Phase 5 through Phase 9 without live computation
- Requires external bootstrap contracts to produce the conformance artifacts themselves

For FastAPI, this path has not been configured (no `fastapi_conformance_path` in source_manifest). If it were, the pipeline could advance through Phase 9 — but only by importing all signal artifacts as pre-computed externals. The architectural question remains: should the orchestrator own this derivation, or is the conformance path model the intended design?

---

## Summary Table

| Phase | Owned | Generates | Validates | External Input Required |
|-------|-------|-----------|-----------|------------------------|
| Phase 1 | NO | — | archive existence+SHA256 | intake contract |
| Phase 2 | NO | — | extracted_path existence | intake contract |
| Phase 3 | NO | — | 40.x file existence | structural pipeline |
| Phase 4 | NO | — | grounding_state readiness | grounding pipeline |
| Phase 5 | PARTIAL | binding_envelope | conformance/registry inputs | CEU registry + dom_layer |
| Phase 6+7 | YES | 75.x + 41.x | — | binding_envelope (Phase 5 output) |
| Phase 8a | YES | vault (9) | grounding+dom+integration inputs | grounding_state + dom_layer + integration_validation |
| Phase 8b | YES | reports | — | vault (Phase 8a output) |
| Phase 9 | YES | selector | — | none |
