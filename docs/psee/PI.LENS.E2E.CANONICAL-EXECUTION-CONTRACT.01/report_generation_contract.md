# Report Generation Contract
## PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01 — BLOCK_H

**Generated:** 2026-05-01  
**Mode:** DOCUMENTATION_ONLY / CONTRACT_LOCK  
**Anchor run:** run_be_orchestrated_fixup_01

---

## 1. Canonical Invocation

```bash
python3 scripts/pios/lens_report_generator.py \
  --client <client_id> \
  --run-id <run_id> \
  --package-dir clients/<client_id>/psee/runs/<run_id>/vault \
  --output-root clients/<client_id>/lens/runs/<run_id>
```

This invocation generates all 4 report surfaces, publish variants, graph_state.json, index.json, manifest.json, selector.json, available_runs.json, and the current/ mirror.

---

## 2. CLI Arguments Reference

| Argument | Required | Description |
|----------|----------|-------------|
| `--client` | YES | Client identifier (matches directory name) |
| `--run-id` | YES | Run identifier |
| `--package-dir` | YES | Path to vault artifact directory |
| `--output-root` | YES (for orchestrated runs) | Lens run output root; triggers _write_canonical_run_metadata |
| `--deliverable` | NO | `tier1`, `diagnostic`, `decision`, or `all` (default: all) |
| `--api-base` | NO | API base URL override |
| `--fragments-dir` | NO | Fragments directory override |
| `--claims` | NO | Claims override |
| `--output` | NO | Legacy single-file output path |
| `--output-dir` | NO | Legacy output directory |
| `--crosswalk-path` | NO | Crosswalk path override |
| `--semantic-topology-dir` | NO | Semantic topology directory override |
| `--tier1` | NO | Tier-1 only flag |
| `--legacy` | NO | Legacy mode flag |

---

## 3. Report Surfaces

### 3.1 Tier-1 Evidence Brief
- **File:** `reports/tier1/lens_tier1_evidence_brief.html`
- **Publish:** `reports/tier1/publish/lens_tier1_evidence_brief_pub.html`
- **Content:** Evidence-first signal summary. Primary signals, activation states, pressure zone.
- **Primary inputs:** `vault/signal_registry.json`, `vault/gauge_state.json`

### 3.2 Tier-1 Narrative Brief
- **File:** `reports/tier1/lens_tier1_narrative_brief.html`
- **Publish:** `reports/tier1/publish/lens_tier1_narrative_brief_pub.html`
- **Content:** Narrative summary with key findings and interpretive context.
- **Primary inputs:** `vault/signal_registry.json`, `vault/gauge_state.json`, `vault/evidence_trace.json`

### 3.3 Tier-2 Diagnostic Narrative
- **File:** `reports/tier2/lens_tier2_diagnostic_narrative.html`
- **Publish:** `reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html`
- **Content:** Full diagnostic report with graph topology visualization.
- **Primary inputs:** `vault/canonical_topology.json`, `vault/signal_registry.json`, `reports/tier2/graph_state.json`
- **Requires:** S11 (export_graph_state.mjs) to complete successfully first.

### 3.4 Decision Surface
- **File:** `reports/decision/lens_decision_surface.html`
- **Publish:** `reports/decision/publish/lens_decision_surface_pub.html`
- **Content:** Decision-layer artifact presenting GAUGE score, verdict, and action.
- **Primary inputs:** `vault/gauge_state.json`, `vault/signal_registry.json`

---

## 4. Graph State Export (S11)

Called as subprocess from `generate_tier2_reports()` during Tier-2 generation:

```bash
node scripts/pios/export_graph_state.mjs \
  --client <client_id> \
  --run-id <run_id> \
  --output clients/<client_id>/lens/runs/<run_id>/reports/tier2/graph_state.json
```

- Reads vault topology from `app/gauge-product/public/vault/<client_id>/<run_id>/vault_index.json`
- Settles node x/y positions using d3-force-3d with identical parameters to VaultGraph.js
- Writes `graph_state.json` — sole authoritative x/y position source for Tier-2 graph

**Fail condition:** If export_graph_state.mjs fails (non-zero exit or d3-force-3d unavailable), the Tier-2 report cannot be generated and phase_08b fails.

---

## 5. Metadata Write (_write_canonical_run_metadata)

Triggered when `--output-root` is provided. Executes after all report surfaces are generated.

**Writes:**
1. `<output_root>/index.json` — run index with report paths and metadata
2. `<output_root>/manifest.json` — artifact manifest with timestamps and checksums
3. `clients/<client_id>/lens/selector/selector.json` — updated current_run pointer + run_status
4. `clients/<client_id>/lens/selector/available_runs.json` — run appended (dict format)
5. `clients/<client_id>/lens/current/` — shutil.copytree of `<output_root>/reports/`

---

## 6. Report Generation Fail-Closed Conditions

| Condition | Effect |
|-----------|--------|
| `vault/canonical_topology.json` missing | phase_08b fails → pipeline halt |
| `vault/signal_registry.json` missing | phase_08b fails → pipeline halt |
| `export_graph_state.mjs` non-zero exit | Tier-2 generation fails → phase_08b fails |
| `d3-force-3d` not available | Same as export_graph_state.mjs failure |
| `vault_index.json` missing | Same as export_graph_state.mjs failure |

---

## 7. Publish Variant Rules

- Publish variants (`_pub.html`) are generated alongside each primary report.
- Publish variants are intended for external sharing. They may have different styles or reduced internal navigation.
- Publish variants MUST NOT contain different signal values or evidence than the primary report.
- No manual HTML patching of any variant is permitted. All content must derive from vault artifacts.

---

## 8. Report Integrity Rules

1. All signal values displayed in reports MUST match `vault/signal_registry.json`.
2. PSIG-006 MUST be displayed as BASELINE / THEORETICAL_BASELINE in all reports.
3. GAUGE score, verdict, and action MUST match `vault/gauge_state.json`.
4. No synthetic data, no fallback values, no placeholder content.
5. If a required vault artifact is missing or malformed, the report must fail — not silently degrade.
