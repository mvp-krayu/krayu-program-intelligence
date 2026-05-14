# Generation Log
## PI.LENS.REPORT-RENDERER.PARITY-STABILIZATION.01

**Generated:** 2026-05-02
**Branch:** work/psee-runtime
**Baseline commit:** d9605f5

---

## Pre-Flight Results

| Check | Result |
|-------|--------|
| Branch == work/psee-runtime | PASS |
| Working tree clean | PASS |
| canonical_report_paths.json lock present | PASS |
| Semantic bundle present (16/16 COMPLETE) | PASS |
| Vault present at run_blueedge_productized_01/vault/ | PASS |

---

## Generation Command (executed once)

```bash
rm -rf /tmp/blueedge_report_parity_semantic_bundle_01

python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_blueedge_productized_01/vault \
  --semantic-bundle-dir clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/ \
  --output-dir /tmp/blueedge_report_parity_semantic_bundle_01
```

---

## Generator Output

```
[export_graph_state] wrote 18 nodes, 17 links (458 ticks) → /tmp/blueedge_report_parity_semantic_bundle_01/graph_state.json
  [GROUNDED] signal_projection.json → 41.x/grounded/signal_projection.json
  [GROUNDED] pressure_zone_projection.json → 41.x/grounded/pressure_zone_projection.json
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/lens_tier1_evidence_brief.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/publish/lens_tier1_evidence_brief_pub.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/lens_tier1_narrative_brief.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/publish/lens_tier1_narrative_brief_pub.html
  [GROUNDED] signal_projection.json → 41.x/grounded/signal_projection.json
  [GROUNDED] pressure_zone_projection.json → 41.x/grounded/pressure_zone_projection.json
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/graph_state.json
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/lens_tier2_diagnostic_narrative.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/publish/lens_tier2_diagnostic_narrative_pub.html
  [GROUNDED] signal_projection.json → 41.x/grounded/signal_projection.json
  [GROUNDED] pressure_zone_projection.json → 41.x/grounded/pressure_zone_projection.json
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/lens_decision_surface.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_semantic_bundle_01/publish/lens_decision_surface_pub.html
```

Exit code: 0

---

## Generated Reports Confirmed

| Report | Path | Present |
|--------|------|---------|
| TIER1_NARRATIVE | /tmp/blueedge_report_parity_semantic_bundle_01/lens_tier1_narrative_brief.html | YES |
| TIER1_EVIDENCE | /tmp/blueedge_report_parity_semantic_bundle_01/lens_tier1_evidence_brief.html | YES |
| TIER2_DIAGNOSTIC | /tmp/blueedge_report_parity_semantic_bundle_01/lens_tier2_diagnostic_narrative.html | YES |
| DECISION_SURFACE | /tmp/blueedge_report_parity_semantic_bundle_01/lens_decision_surface.html | YES |

---

## Note on Run-ID

Canonical reports were generated with `--run-id run_01_authoritative_generated` (visible in canonical decision surface `<span class="ds-run">`). This contract generated with `--run-id run_blueedge_productized_01_fixed`. This run-id difference is expected volatile metadata and is handled by normalization.
