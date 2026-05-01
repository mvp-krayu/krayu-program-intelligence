# Implementation Summary
## PI.LENS.CEU-GROUNDING.GENERIC.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## What Was Built

Two files:
1. `scripts/pios/ceu_registry.json` — Generic CEU registry (10 CEUs, pattern-based detection rules)
2. `scripts/pios/ceu_grounding.py` — Generic deterministic CEU grounding engine

---

## Script Specification

| Property | Value |
|----------|-------|
| Path | `scripts/pios/ceu_grounding.py` |
| Contract | PI.LENS.CEU-GROUNDING.GENERIC.01 |
| CLI | `python3 scripts/pios/ceu_grounding.py --client <id> --run-id <id>` |
| Optional flags | `--dry-run`, `--validate-only` |
| REPO_ROOT resolution | `Path(__file__).resolve().parents[2]` |
| Input dependency | structure/40.2/structural_node_inventory.json (+ 40.3 and 40.4 existence checks) |
| CEU registry | `scripts/pios/ceu_registry.json` (co-located with script) |

---

## CLI Modes

| Mode | Description | Files written |
|------|-------------|---------------|
| Default (write) | Full execution — validate + evaluate + write | YES |
| `--dry-run` | Validate + evaluate + log what would be written | NO |
| `--validate-only` | Check structural inputs only | NO |

---

## Output

```
clients/<client_id>/psee/runs/<run_id>/ceu/grounding_state_v3.json
```

---

## CEU Registry Design

10 generic CEUs targeting common software project architecture patterns:

| CEU | Name | Activation | Trigger |
|-----|------|------------|---------|
| CEU-01 | APPLICATION_CORE | FULL | `src/`, `app/`, `lib/`, `pkg/` directories |
| CEU-02 | SERVICE_LAYER | FULL | `services/` dir or `_service/` in path |
| CEU-03 | DATA_LAYER | FULL | `model`, `database`, `migration`, `.sqlite` in path |
| CEU-04 | API_ROUTING | FULL | `routers/`, `routes/`, `endpoints/`, `views/` dirs |
| CEU-05 | CONFIGURATION | FULL | `pyproject.toml`, `config.yaml`, `Dockerfile`, etc. |
| CEU-06 | TESTING | FULL | `tests/`, `test/`, `__tests__/`, `test_*` patterns |
| CEU-07 | CI_CD | FULL | `.github/`, `.gitlab/`, `Makefile`, `Jenkinsfile` |
| CEU-08 | GENERATED_ARTIFACTS | STRUCTURAL_ONLY | `generated/`, `openapi`, `dist/`, `build/` |
| CEU-09 | LOGGING_OBSERVABILITY | FULL | `logging/`, `middleware/`, `log_config`, `getLogger` |
| CEU-10 | DEPENDENCY_MANAGEMENT | FULL | `uv.lock`, `pyproject.toml`, `*.lock`, `go.mod`, etc. |

---

## Detection Engine

5 rule types evaluated against file node paths from 40.2:

| Type | Semantics |
|------|-----------|
| `path_prefix` | `node.path.startswith(value)` |
| `path_contains` | `value in node.path` (substring, case-sensitive) |
| `filename_equals` | `Path(node.path).name == value` |
| `extension_equals` | `Path(node.path).suffix.lower() == value` |
| `dir_component_equals` | `value in Path(node.path).parts` |

Matching is deterministic — same inputs → same outputs always.

---

## Grounding Logic

| Activation Class | Present | Grounded |
|-----------------|---------|---------|
| FULL | yes | true |
| LIMITED | yes, node_count ≥ 2 | true |
| LIMITED | yes, node_count < 2 | false |
| STRUCTURAL_ONLY | yes | false |
| (any) | no | false → class=NONE |

---

## Fail-Closed Conditions

| Condition | Handling |
|-----------|----------|
| CEU registry missing | fail_closed |
| Any of 40.2/40.3/40.4 missing | fail_closed |
| Registry malformed (no ceus array) | fail_closed |
| CREATE_ONLY violation (output exists, write mode) | fail_closed (exit 1) |

---

## FastAPI Validation Results

| Metric | Value |
|--------|-------|
| total_ceu | 10 |
| grounded_count | 9 |
| ungrounded_count | 1 (CEU-08 GENERATED_ARTIFACTS — STRUCTURAL_ONLY) |
| grounding_ratio | 0.9 |
| coverage_classification | HIGH |
| validation_status | PASS |

---

## Orchestrator Phase 4 Path Gap

The orchestrator (`run_client_pipeline.py`) Phase 4 checks:
```
clients/<client>/psee/runs/<run_id>/binding/provenance/grounding_state_v3.json
```

This script writes to:
```
clients/<client>/psee/runs/<run_id>/ceu/grounding_state_v3.json
```

The paths differ. Phase 4 will not pass from this output alone without an orchestrator patch or copy step. This gap is documented and out of scope for this contract.

---

## Scope Guards

- No semantic inference — all detection deterministic pattern matching
- No BlueEdge mutation
- No FastAPI source modification
- No CEU redesign
- No DOM/41.x/75.x
- No report generation
- No filesystem scanning outside 40.x artifacts
- No reading of previous run artifacts

---

## Gap Chain Position

This contract closes **Step 7** (CEU Grounding) of the minimum orchestration chain.

Remaining gaps:
- Step 9: DOM Layer Construction (PI.LENS.DOM-LAYER.GENERATOR.01 — not yet contracted)
- Orchestrator Phase 4 path alignment (binding/provenance/ vs ceu/)
