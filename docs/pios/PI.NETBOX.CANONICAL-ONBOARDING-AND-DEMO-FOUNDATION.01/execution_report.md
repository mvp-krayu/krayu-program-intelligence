# Execution Report — PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01

## Stream Identity

- **Stream:** PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01
- **Classification:** G1 — Architecture-consuming onboarding and canonical capture
- **Branch:** feature/PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01
- **Date:** 2026-05-20

## Pre-Flight

- [x] CLAUDE.md loaded
- [x] git_structure_contract.md loaded
- [x] Branch: feature/PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01
- [x] Canonical state loaded (PIOS_CURRENT_CANONICAL_STATE.md)
- [x] Terminology loaded (TERMINOLOGY_LOCK.md)
- [x] Live S2 candidate selection confirmed: NetBox (PI.PATHA.LIVE-S2-CANDIDATE-SELECTION.01, commit 67d1c39)

## Execution Log

### Phase A — Source Acquisition

1. Shallow-cloned `netbox-community/netbox` to `/tmp/netbox-clone`
2. Archived FULL repository (excluding .git): `netbox-64d3b11.tar` (59MB)
3. SHA256: `043d4ca2b85fde16e2bc86eea6631e5f363c8f5c59d14332eed11d0f0c44a697`
4. Commit: `64d3b11` (NetBox v4.6.1)
5. Created `clients/netbox/archives/` and `clients/netbox/sources/source_01/`
6. Extracted to `clients/netbox/psee/runs/run_github_netbox_20260520_134600/intake/canonical_repo/`

### Phase B — Client Registration

1. Created `clients/netbox/client.yaml` (uuid: 4c05aeb0-87e5-47bc-a708-75f69f9a2870)
2. Created `clients/netbox/sources/source_01/source_manifest.json`

### Phase C — Source Intake

```
python3 scripts/pios/source_intake.py --client netbox --source source_01 --run-id run_github_netbox_20260520_134600
```

**Result:** 2,169 files inventoried. Source root: `netbox/`. Boundary validations PASS.

### Phase D — Structural Scanning

```
python3 scripts/pios/structural_scanner.py --client netbox --source source_01 --run-id run_github_netbox_20260520_134600
```

**Result:**
- 40.2: 2,540 structural nodes
- 40.3: 2,516 CONTAINS edges, 0 IMPORTS (regex — expected limitation for Django absolute imports)
- 40.4: 24 clusters (CLU-20 absorbs all 2,129 operational nodes)

### Phase E — Pipeline Phases 3.5–3.7

**Phase 3.5 — SRC Classification:**
- 1,848 PRIMARY (72.8%), 138 SUPPORT (5.4%), 554 PERIPHERAL (21.8%)

**Phase 3.6 — Code-Graph Enrichment (40.3s):**

First run: 21 files, 12 imports (source root discovery bug). After fix: 1,155 files, 3,614 IMPORTS, 16,046 total relationships.

Pipeline fixes applied during onboarding:
1. `discover_source_root()` — shallowest-common-ancestor algorithm for multi-app layouts
2. `resolve_absolute_import()` — source-root-prefix candidates for Django-style imports

**Phase 3.7 — Structural Centrality (40.3c):**
- 1,089 files ranked
- Role distribution: RE_EXPORT_HUB (31), INTERFACE_BOUNDARY (876), VALIDATION_SUPPORT (166)
- 4 FP risk categories detected (init_re_export_inflation, conditional_import_overcounting, test_utility_leakage, circular_dependency_masking)
- 40+ circular dependency pairs identified
- 6/6 validation PASS

### Phase F — Artifact Analysis

Cross-domain import analysis revealed:
- 60.8% cross-domain import rate (2,197 of 3,614)
- DCIM as gravitational center (160 inbound)
- Bidirectional DCIM ↔ IPAM entanglement (58 cross-imports)
- 3-tier structural hierarchy (Foundation / Operational Domain / Consumer)
- Choice enumerations as coupling multipliers (203 combined inbound)

See: STRUCTURAL_SURPRISE_REPORT.md, domain_emergence_observations.md

### Phase G — Cockpit Foundation

Created minimal LENS manifest (`netbox.run_github_netbox_20260520_134600.json`). Registered in REGISTRY.

**SQO Cockpit V1:** Renders "Cockpit Unavailable" with full artifact binding diagnostics. 2 MISSING_REQUIRED, 21 MISSING_OPTIONAL. Governance footer intact.

**SQO Cockpit V2:** Role declaration gate renders. After Operator selection, shows same diagnostic view with V2 navigation rail.

**LENS v2:** LIVE_BINDING_FAILED — MANIFEST_INVALID. Missing `semantic_topology_model` and `dpsig_signal_set`. Fixture fallback disabled by contract.

No cockpit logic was modified. All rendering outcomes are observational.

### Phase H — Screenshot Capture

4 screenshots captured via Playwright MCP:
- `netbox-sqo-cockpit-s0-overview.png`
- `netbox-v2-role-gate.png`
- `netbox-v2-cockpit-operator-s0.png`
- `netbox-lens-v2-binding-failure.png`

### Phase I — Governance Artifacts

All artifacts produced in `docs/pios/PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01/`.

## Pipeline Fix Summary

Two generic pipeline improvements were made during this onboarding:

1. **`discover_source_root()` in `code_graph_feasibility.py`**: Replaced "deepest __init__.py parent" algorithm with "shallowest common ancestor" algorithm. For single-package projects (Flask), returns the package directory. For multi-app projects (Django), returns the common parent of all top-level packages.

2. **`resolve_absolute_import()` in `code_graph_feasibility.py`**: Added source-root-relative prefix as a candidate path for absolute import resolution. Previously only tried bare path and `src/` prefix. Now also tries `<source_root>/` prefix, enabling resolution of Django-style cross-app imports (`from circuits.models import ...` → `netbox/circuits/models/__init__.py`).

Both fixes are generic improvements — they apply to all Python projects processed by the pipeline.

## Governance Confirmation

- No data mutation (structural artifacts are additive)
- No semantic computation (no Phase 3b, no CEU grounding)
- No interpretation (structural analysis only)
- No new API calls beyond pipeline execution
- Pipeline fixes are generic improvements, not NetBox-specific patches
