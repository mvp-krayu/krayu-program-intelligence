# LENS Demo Run Instructions
## PI.LENS.PRODUCT-DEMO-PACKAGE.01

**Date:** 2026-05-03  
**Status:** DEMO_LOCKED

---

## Quick Start

```bash
bash scripts/pios/lens_demo.sh
```

Run from repo root or any subdirectory. Script resolves repo root automatically.

The script will:
1. Validate `reports/` and `vault/` paths — fails fast if missing
2. Generate reports (idempotent — safe to re-run)
3. Start the LENS UI at `http://localhost:3001/lens`

---

## Demo Walkthrough

### 1. Runtime Selector

Open: `http://localhost:3001/lens`

- Selector shows: `blueedge / run_blueedge_productized_01_fixed`
- Click: **Generate**
- Reports generate. Links appear for Tier-1 / Tier-2 / Decision Surface reports.

### 2. Diagnostic Workspace

Click: **Diagnostic Workspace**

Direct URL:
```
http://localhost:3001/tier2/workspace?client=blueedge
  &displayRun=run_blueedge_productized_01_fixed
  &vaultRun=run_blueedge_productized_01
  &reportRun=run_blueedge_productized_01_fixed
```

**OVERVIEW graph** (initial state):
- Label: `OVERVIEW`
- Graph: multi-node topology — 18 nodes (PZ-001 + SIG-001..SIG-005 + CLM-20..CLM-24 + ART-01..ART-07)
- All nodes bright

**Click EVIDENCE on PZ-001:**
- Signal strip appears: `active signals  [PSIG-001]  [PSIG-002]  [PSIG-004]`
- Graph: 4 nodes — PZ-001 (white), PSIG-001 (green), PSIG-002 (green), PSIG-004 (green)
- VaultGraph header: `4 nodes · 3 signals`
- Evidence panel: 3 signal blocks with PSIG-001, PSIG-002, PSIG-004

**Click WHY on PZ-001:**
- Graph: structural scope overlay on 18-node topology
- Capability nodes highlighted if present

**Click TRACE on PZ-001:**
- Graph: trace path nodes highlighted on 18-node topology
- Propagation paths shown in result panel

### 3. Decision Surface

From the selector generate step, open: `lens_decision_surface.html`

Validate:
- WHERE PRESSURE EXISTS — present
- INVESTIGATE action — present
- Score: 60

---

## Demo Runtime (Locked)

| Field | Value |
|-------|-------|
| `client` | `blueedge` |
| `display_run` | `run_blueedge_productized_01_fixed` |
| `vault_run` | `run_blueedge_productized_01` |
| `report_run` | `run_blueedge_productized_01_fixed` |
| `semantic_run` | `run_blueedge_productized_01_fixed` |

**Why two runs?**  
`display_run` has the generated reports, semantic bundle, and graph_state.  
`vault_run` has the canonical vault data (zones, signals, evidence) used for API queries.  
The bundle mapping (`BUNDLE_OVERRIDES` in runtime-list.js and generate-report.js) resolves this automatically.

---

## Prerequisite Check

Before running the demo, confirm:

```bash
ls clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/
# should include: lens_tier1_evidence_brief.html, graph_state.json, etc.

ls clients/blueedge/psee/runs/run_blueedge_productized_01/vault/
# should include: vault_index.json or canonical vault files
```

Both paths are validated by `lens_demo.sh` at startup.
