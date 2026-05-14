# DOM Layer Findings
## PI.LENS.DOM-LAYER.GENERATOR.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Pre-flight

| Check | Result |
|-------|--------|
| Branch | work/psee-runtime — non-canonical; authorized per standing operator pattern |
| Working tree at start | CLEAN |
| Baseline commit | f415f675e631609adc95beeb945dd461d3537a4c |
| Input: canonical_topology.json | PRESENT — 19 clusters |
| Input: grounding_state_v3.json | PRESENT — 10 CEUs, 9 grounded, PASS |
| Input: source_manifest.json | PRESENT |
| Output: dom/dom_layer.json | ABSENT (CREATE_ONLY safe) |
| Output: dom_layer_path in manifest | ABSENT (will add) |

---

## Execution

| Mode | Exit | Result |
|------|------|--------|
| validate-only | 0 | PASS |
| dry-run | 0 | PASS — 9 domains, 123 nodes |
| write | 0 | PASS — dom_layer.json created, manifest updated |
| CREATE_ONLY guard re-run | 1 | FAIL-CLOSED correctly |
| manifest idempotent re-run | 0 | PASS — "already set to correct value" (skipped) |

---

## Domain Assignment Results

| Domain ID | Name | Nodes | Clusters |
|-----------|------|-------|----------|
| DOM-01 | APPLICATION | 89 | src |
| DOM-02 | CI_INFRA | 6 | .github |
| DOM-03 | CONFIGURATION | 4 | config.yaml, log_config.json, openapitools.json, pyproject.toml |
| DOM-04 | DEPENDENCY | 1 | uv.lock |
| DOM-05 | DOCUMENTATION | 2 | README.md, TODO.md |
| DOM-06 | GENERATED | 7 | generated |
| DOM-07 | INFRA | 1 | run.sh |
| DOM-08 | TESTING | 2 | tests |
| DOM-09 | TOOLING | 11 | .artrc, .gitattributes, .gitignore, .pre-commit-config.yaml, .readme_assets, .sqlite_db, .vscode |

**Total nodes assigned: 123 / 123 — validation_status: PASS**

---

## Dual-Format Output

The dom_layer.json includes both:
- `domains` array — contract-specified format (`domain_id`, `name`, `node_ids`, `node_count`)
- `dom_groups` array — Phase 5 orchestrator-compatible format (`dom_id`, `dom_label`, `included_nodes`, `derivation_rule`, `path_patterns`)

Both arrays cover the same 9 domains and 123 nodes. The `dom_groups` field enables Phase 5 (`phase_05_build_binding_envelope`) to read domain data without orchestrator modification.

---

## Manifest Update

Field added to `clients/fastapi/sources/source_01/source_manifest.json`:
```
"dom_layer_path": "clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/dom/dom_layer.json"
```

Manifest remains valid JSON after update.

---

## Phase 5 Gap Note

Phase 5 also reads `source_manifest["ceu_grounding_path"] / "registry" / "ceu_grounding_registry.json"`. This registry directory does not exist for FastAPI. Phase 5 will fail at that check after dom_layer_path is resolved. This is a separate gap (no CEU grounding registry for FastAPI) — out of scope for this contract.

Phase 5 has a `fastapi_conformance_path` bypass that, if set in the manifest, routes Phase 5 entirely through pre-computed conformance artifacts. Using that bypass is a decision for the next contract.

---

## Scope Guards

| Guard | Status |
|-------|--------|
| CEU logic modified | NO |
| Structural scanner modified | NO |
| BlueEdge artifacts touched | NO |
| FastAPI source files modified | NO |
| DOM used semantic inference | NO — path/extension pattern matching only |
| Integration validation generated | NO |
| 41.x / 75.x artifacts | NO |
