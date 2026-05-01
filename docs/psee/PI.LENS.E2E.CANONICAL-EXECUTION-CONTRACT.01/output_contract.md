# Output Contract
## PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01 — BLOCK_D

**Generated:** 2026-05-01  
**Mode:** DOCUMENTATION_ONLY / CONTRACT_LOCK  
**Anchor run:** run_be_orchestrated_fixup_01

---

## 1. Pipeline Run Output Tree

All pipeline outputs are written under:  
`clients/<client_id>/psee/runs/<run_id>/`

```
clients/<client_id>/psee/runs/<run_id>/
├── binding/
│   └── binding_envelope.json          # Phase 5 output
├── 75.x/
│   ├── condition_correlation_state.json   # Phase 6+7 output
│   ├── pressure_candidate_state.json      # Phase 6+7 output
│   └── pressure_zone_state.json           # Phase 6+7 output
├── 41.x/
│   ├── signal_projection.json             # Phase 6+7 output
│   └── pressure_zone_projection.json      # Phase 6+7 output
└── vault/                             # Phase 8a outputs (9 artifacts)
    ├── coverage_state.json
    ├── reconstruction_state.json
    ├── gauge_state.json
    ├── canonical_topology.json
    ├── signal_registry.json
    ├── binding_envelope.json
    ├── admissibility_log.json
    ├── evidence_trace.json
    └── vault_manifest.json
```

---

## 2. Lens Run Output Tree

All lens report outputs are written under:  
`clients/<client_id>/lens/runs/<run_id>/`

```
clients/<client_id>/lens/runs/<run_id>/
├── index.json                         # Run index (S13)
├── manifest.json                      # Run manifest (S13)
└── reports/
    ├── tier1/
    │   ├── lens_tier1_evidence_brief.html
    │   ├── lens_tier1_narrative_brief.html
    │   └── publish/
    │       ├── lens_tier1_evidence_brief_pub.html
    │       └── lens_tier1_narrative_brief_pub.html
    ├── tier2/
    │   ├── lens_tier2_diagnostic_narrative.html
    │   ├── graph_state.json           # S11 (export_graph_state.mjs)
    │   └── publish/
    │       └── lens_tier2_diagnostic_narrative_pub.html
    └── decision/
        ├── lens_decision_surface.html
        └── publish/
            └── lens_decision_surface_pub.html
```

---

## 3. Selector Output Tree

```
clients/<client_id>/lens/selector/
├── selector.json                      # current_run pointer + run_status map
└── available_runs.json                # all runs for this client (dict format, generator-authoritative)
```

---

## 4. Current Mirror

```
clients/<client_id>/lens/current/      # shutil.copytree of reports/ (S14)
├── tier1/
│   ├── lens_tier1_evidence_brief.html
│   ├── lens_tier1_narrative_brief.html
│   └── publish/
│       ├── lens_tier1_evidence_brief_pub.html
│       └── lens_tier1_narrative_brief_pub.html
├── tier2/
│   ├── lens_tier2_diagnostic_narrative.html
│   ├── graph_state.json
│   └── publish/
│       └── lens_tier2_diagnostic_narrative_pub.html
└── decision/
    ├── lens_decision_surface.html
    └── publish/
        └── lens_decision_surface_pub.html
```

The `current/` tree is overwritten on every pipeline execution. It provides a stable path for downstream consumers (e.g., FastAPI file-serving endpoints).

---

## 5. Vault Artifact Definitions

| Artifact | Contents |
|----------|----------|
| `coverage_state.json` | Domain coverage signals |
| `reconstruction_state.json` | Structural reconstruction evidence |
| `gauge_state.json` | GAUGE score + classification (score, verdict, action) |
| `canonical_topology.json` | Node/edge topology from structural source |
| `signal_registry.json` | All PSIG signals with activation state, active count, telemetry count |
| `binding_envelope.json` | Canonical binding envelope (copy from binding/) |
| `admissibility_log.json` | Admissibility decisions per signal |
| `evidence_trace.json` | End-to-end evidence provenance |
| `vault_manifest.json` | Artifact inventory and run metadata |

---

## 6. Report Surface Definitions

| Report | File | Description |
|--------|------|-------------|
| Tier-1 Evidence Brief | `lens_tier1_evidence_brief.html` | Evidence-first signal summary |
| Tier-1 Narrative Brief | `lens_tier1_narrative_brief.html` | Narrative summary with key findings |
| Tier-2 Diagnostic Narrative | `lens_tier2_diagnostic_narrative.html` | Full diagnostic with graph topology |
| Decision Surface | `lens_decision_surface.html` | Decision-layer artifact |

Each report surface has a `publish/` variant (suffix `_pub`). The publish variant is the externally shareable form.

---

## 7. Output Artifact Count

| Category | Count |
|----------|-------|
| Vault artifacts | 9 |
| Report HTML files (4 surfaces × 2 variants) | 8 |
| graph_state.json (Tier-2 graph layout) | 1 |
| index.json, manifest.json | 2 |
| selector.json, available_runs.json | 2 |
| **Total governed outputs per run** | **22** |

---

## 8. Fail-Closed Output Guarantee

If **any** phase returns FAIL:
- The orchestrator halts immediately
- Downstream phases do not execute
- Partial outputs in the run directory are not cleaned up automatically
- The selector is NOT updated to the failed run
- The operator must manually remediate before rerunning

A successful run produces all 22 governed outputs exactly as specified above.
