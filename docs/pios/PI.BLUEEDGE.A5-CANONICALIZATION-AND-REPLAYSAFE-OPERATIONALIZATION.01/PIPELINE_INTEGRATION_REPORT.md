# Pipeline Integration Report

## Stream: PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01

### Scripts Modified

| Script | Lane | Change | Impact |
|--------|------|--------|--------|
| `scripts/pios/structural_scanner.py` | A | Wrapper normalization in `build_canonical_topology()`. Return type: `list[dict]` → `tuple[list[dict], dict]`. Main() updated for tuple unpacking. 40.4 artifact includes `wrapper_normalization` metadata. | All new runs produce wrapper-aware clustering. Existing 40.4 artifacts (without `wrapper_normalization` field) remain valid — dom_layer_generator handles missing field gracefully. |
| `scripts/pios/dom_layer_generator.py` | A.5 | Complete rewrite of domain derivation. Static DOMAIN_RULES replaced with A.5 path-prefix reconstruction. Now reads 40.2 node inventory and 40.4 wrapper_metadata. Two-pass subdivision with intermediate directory expansion. | New runs produce path-prefix domains instead of name-pattern domains. Existing dom_layer.json artifacts remain valid — orchestrator consumes same fields. |
| `scripts/pios/run_client_pipeline.py` | Orchestrator | Vault construction (Phase 8a): removed hardcoded BlueEdge references. `source_authority`, `schema_adaptation_note`, `counts.total_nodes`, `counts.components`, `counts.source` now read from dom_layer.json dynamically. | Client-agnostic vault construction. No hardcoded node counts (35), domain counts (13), or stream references. |

### Orchestrator Compatibility

All fields consumed by `run_client_pipeline.py` from `dom_layer.json` are preserved:

| Field | Status | Used in |
|-------|--------|---------|
| `dom_groups[].dom_id` | Preserved | Phase 5 binding, Phase 8a vault |
| `dom_groups[].dom_label` | Preserved | Phase 5 binding, Phase 8a vault |
| `dom_groups[].included_nodes` | Preserved | Phase 5 binding |
| `dom_groups[].derivation_rule` | Preserved | Phase 5 binding |
| `dom_groups[].path_patterns` | Preserved | Phase 8a vault |
| `dom_groups[].evidence_paths` | Optional (absent in A.5 output) | Phase 8a vault (falls back to path_patterns) |
| `total_nodes` | Preserved | Phase 8a vault counts |
| `contract_id` | Preserved | Phase 8a vault source_authority |
| `generation_rules.method` | NEW | Phase 8a vault schema_adaptation_note |

### End-to-End Pipeline Validation

BlueEdge A.5 validation run (`run_blueedge_a5_validation_01`):

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Source Boundary | PASS | SHA256 verified |
| Phase 2 — Intake | PASS | 741 files extracted |
| Phase 3 — 40.x Structural | PASS | 945 nodes, 11 clusters (wrapper normalized) |
| Phase 4 — CEU Grounding | PASS | 5/10 CEUs grounded |
| Phase 5 — Binding Envelope | PASS | 68 nodes, 22 edges, 10 surfaces |
| Phase 6+7 — 75.x + 41.x | PASS | All 5 output artifacts present |
| Phase 8a — Vault Construction | PASS | 9 vault artifacts |
| Phase 8b — Vault Readiness | PASS | 9/9 checks PASS |
| Phase 9 — Selector Update | PASS | Selector updated (then restored) |
| Integration Validation | PASS | 12/12 checks |

### FastAPI Regression

FastAPI dry-run test with A.5 dom_layer_generator:
- 19 clusters (no wrapper — unchanged from prior behavior)
- 26 domains via path-prefix reconstruction (vs prior name-pattern matching)
- `src/` cluster (89 nodes) correctly subdivided: src_app, src_common, src_root, src_services
- No error, no regression in pipeline mechanics
