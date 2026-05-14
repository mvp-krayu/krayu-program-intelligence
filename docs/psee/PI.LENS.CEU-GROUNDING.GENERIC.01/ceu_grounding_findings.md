# CEU Grounding Findings
## PI.LENS.CEU-GROUNDING.GENERIC.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Pre-flight

| Check | Result |
|-------|--------|
| Branch | work/psee-runtime — non-canonical; authorized per standing operator pattern |
| Working tree at start | CLEAN |
| Baseline commit | ec91f845c2ea2dea28233d1f8643a1be0b179294 |
| 40.2 structural_node_inventory.json | PRESENT |
| 40.3 structural_topology_log.json | PRESENT |
| 40.4 canonical_topology.json | PRESENT |
| ceu_registry.json | CREATED this contract |
| Output: ceu/ directory | ABSENT (CREATE_ONLY safe) |

---

## Execution

**Validate-only:** exit 0, PASS  
**Dry-run:** exit 0, grounding computed correctly  
**Write:** exit 0, `grounding_state_v3.json` created  
**CREATE_ONLY guard re-run:** exit 1, FAIL-CLOSED correctly

---

## CEU Evaluation Results

| CEU | Name | Status | Nodes | Activation | Notes |
|-----|------|--------|-------|------------|-------|
| CEU-01 | APPLICATION_CORE | GROUNDED | 64 | FULL | All Python files under `src/` |
| CEU-02 | SERVICE_LAYER | GROUNDED | 44 | FULL | `src/services/` — 3 services (pet, user, template) |
| CEU-03 | DATA_LAYER | GROUNDED | 8 | FULL | `models.py`, `database.py`, `.sqlite_db/` |
| CEU-04 | API_ROUTING | GROUNDED | 8 | FULL | `src/services/*/routers/` directories |
| CEU-05 | CONFIGURATION | GROUNDED | 2 | FULL | `config.yaml`, `pyproject.toml` |
| CEU-06 | TESTING | GROUNDED | 11 | FULL | `tests/` directories in all 3 services |
| CEU-07 | CI_CD | GROUNDED | 2 | FULL | `.github/actions/`, `.github/workflows/` |
| CEU-08 | GENERATED_ARTIFACTS | PRESENT (not grounded) | 5 | STRUCTURAL_ONLY | `generated/` directory — structural only |
| CEU-09 | LOGGING_OBSERVABILITY | GROUNDED | 9 | FULL | `src/common/logging/` module tree |
| CEU-10 | DEPENDENCY_MANAGEMENT | GROUNDED | 2 | FULL | `pyproject.toml`, `uv.lock` |

**Summary:** 9/10 grounded — grounding_ratio=0.90 — HIGH — PASS

---

## Detection Notes

### CEU-02 SERVICE_LAYER — evidence includes generated/ path
Evidence[0] is `generated/pet_service/openapi.json` because `_service/` substring matches `pet_service/`. This is correct deterministic behavior — the path genuinely signals service architecture. The CEU's 44 total matches are dominated by real `src/services/` files (rules: `dir_component_equals("services")` matches all files under `src/services/`).

### CEU-03 DATA_LAYER — evidence includes .sqlite_db/.gitkeep
`.sqlite_db/.gitkeep` matches `path_contains(".sqlite")`. This is a valid structural signal — the presence of a `.sqlite_db/` directory indicates SQLite data layer infrastructure. The `models.py` and `database.py` files are the primary grounding evidence.

### CEU-08 GENERATED_ARTIFACTS — STRUCTURAL_ONLY
`generated/` directory with 5 matching nodes (openapi.json artifacts). STRUCTURAL_ONLY because generated artifacts are output, not active architectural capability. grounded=False is intentional and correct.

---

## Grounding State Output

```
grounding_ratio:        0.9
coverage_classification: HIGH
validation_status:       PASS
```

---

## Scope Guards

| Guard | Status |
|-------|--------|
| Semantic inference performed | NO — all detection via deterministic pattern matching |
| BlueEdge artifacts modified | NO |
| FastAPI source files modified | NO |
| CEU redesign performed | NO |
| DOM/41.x/75.x performed | NO |
| Report generation | NO |
| Filesystem scanning outside structure artifacts | NO |
| Previous run artifacts read | NO |

---

## Orchestrator Phase 4 Compatibility

Phase 4 of `run_client_pipeline.py` checks for `grounding_state_v3.json` at:
```
clients/<client>/psee/runs/<run_id>/binding/provenance/grounding_state_v3.json
```

The generic grounding engine writes to:
```
clients/<client>/psee/runs/<run_id>/ceu/grounding_state_v3.json
```

**Path mismatch noted.** The orchestrator's Phase 4 path (`binding/provenance/`) does not match the generic pipeline path (`ceu/`). Resolving this mismatch is out of scope for this contract (would require orchestrator modification). The runtime artifact is correctly produced at the generic path. A future contract may align these paths or add a symlink/copy step.
