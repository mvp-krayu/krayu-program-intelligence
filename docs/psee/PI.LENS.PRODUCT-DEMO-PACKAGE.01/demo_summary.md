# Demo Summary
## PI.LENS.PRODUCT-DEMO-PACKAGE.01

**Date:** 2026-05-03

---

## What Is Packaged

This demo package freezes the validated BlueEdge runtime experience across all prior streams:

| Stream | Fix |
|--------|-----|
| PI.LENS.RUNTIME-SELECTOR-CLEANUP-AND-WORKSPACE-BINDING.01 | Runtime selector; workspace URL binding |
| PI.LENS.RUNTIME-BUNDLE-MAPPING.01 | `vault_run` distinct from `display_run`; workspace uses vaultRun for API calls |
| PI.LENS.WORKSPACE.GRAPH-CONTEXT-BINDING.01 | vaultIndex from graph_state.json; 18-node graph |
| PI.LENS.WORKSPACE.GRAPH-OVERVIEW-START.01 | Initial state = OVERVIEW; label = OVERVIEW |
| PI.LENS.WORKSPACE.EVIDENCE-GRAPH-PSIG-BINDING.02 | EVIDENCE graph = PSIG-001/002/004; visible signal strip |

---

## Demo Entrypoint

```
scripts/pios/lens_demo.sh
```

Step 1: Validates `reports/` and `vault/` paths  
Step 2: Generates reports via `lens_generate.sh --client blueedge --run run_blueedge_productized_01_fixed`  
Step 3: Starts `npm run dev` in `app/gauge-product`  
Step 4: Prints entrypoint URL

---

## Validated Surfaces

### Runtime Selector (`/lens`)
- Dropdown shows `blueedge / run_blueedge_productized_01_fixed`
- Generate button produces report links + workspace URL
- No hardcoded FastAPI UUIDs

### Diagnostic Workspace (`/tier2/workspace`)
- Loads zones from `vault_run` (run_blueedge_productized_01)
- Displays `display_run` in topbar
- OVERVIEW: 18-node full topology, all bright, label = OVERVIEW
- EVIDENCE: signal strip `[PSIG-001] [PSIG-002] [PSIG-004]` + 4-node star graph
- WHY: 18-node topology with capability overlay
- TRACE: 18-node topology with trace path highlighting

### Decision Surface
- WHERE PRESSURE EXISTS — rendered
- INVESTIGATE action — rendered
- Score: 60

---

## What Is NOT Included

- No new UI features
- No refactors
- No pipeline changes
- No semantic mutations
- No new data generation

---

## Reproducibility

Demo is deterministic:
- All canonical data exists in `clients/blueedge/psee/runs/`
- Report generation is idempotent (`lens_generate.sh`)
- No environment variables required beyond what Next.js provides
- No external services required
