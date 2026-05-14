# Artifact Contract
## PI.LENS.REAL-E2E-PIPELINE.EXECUTION-CLOSURE.01

**Date:** 2026-05-03
**Baseline tag:** lens-e2e-stable-v1
**Execution run:** run_blueedge_e2e_execute_01

---

## Vault Artifacts

Location: `clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/vault/`

| Artifact | Description |
|----------|-------------|
| coverage_state.json | CEU coverage state |
| reconstruction_state.json | reconstruction pass state |
| gauge_state.json | GAUGE signal state |
| canonical_topology.json | 40.4 canonical topology |
| signal_registry.json | signal registry |
| binding_envelope.json | FastAPI-compatible binding envelope |
| admissibility_log.json | admissibility decisions |
| evidence_trace.json | evidence trace |
| vault_manifest.json | vault manifest |

---

## Report Artifacts

Location: `clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/reports/`

| Artifact | Description |
|----------|-------------|
| lens_tier1_evidence_brief.html | Tier-1 Evidence Brief |
| lens_tier1_narrative_brief.html | Tier-1 Narrative Brief |
| lens_tier2_diagnostic_narrative.html | Tier-2 Diagnostic Narrative |
| lens_decision_surface.html | Decision Surface (EPB required) |

### Decision Surface Requirements

`lens_decision_surface.html` MUST contain:
- WHERE PRESSURE EXISTS section
- Structural Pressure Signals section
- INVESTIGATE posture
- Score 60

---

## Projection Artifacts

Location: `clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/41.x/`

| Artifact | Description |
|----------|-------------|
| signal_projection.json | 41.x signal projection |
| pressure_zone_projection.json | pressure zone projection (schema: `zones` key) |

### Schema Note

`pressure_zone_projection.json` uses `zones` key (FastAPI conformance schema).
`lens_report_generator.py` accepts both `zones` and `zone_projection` keys via compat pattern:
```python
pz_proj.get("zone_projection") or pz_proj.get("zones") or []
```

---

## Semantic Reference (LOCKED, READ-ONLY)

Location: `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/`

| Artifact | Description |
|----------|-------------|
| semantic_bundle_manifest.json | semantic bundle manifest |
| (full semantic bundle) | locked reference — never copied |
