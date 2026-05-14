# Generation Log
## PI.LENS.BLUEEDGE-REPORT-PARITY-ENFORCEMENT.02

**Generated:** 2026-05-01

---

## Command Used

```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault \
  --output-dir /tmp/blueedge_report_parity_02
```

**Exit Code:** 0

**Output Directory:** /tmp/blueedge_report_parity_02

---

## Stdout

```
[export_graph_state] wrote 18 nodes, 17 links (458 ticks) → /tmp/blueedge_report_parity_02/graph_state.json
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/lens_tier1_evidence_brief.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/publish/lens_tier1_evidence_brief_pub.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/lens_tier1_narrative_brief.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/publish/lens_tier1_narrative_brief_pub.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/graph_state.json
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/lens_tier2_diagnostic_narrative.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/publish/lens_tier2_diagnostic_narrative_pub.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/lens_decision_surface.html
[LENS REPORT] Generated: /private/tmp/blueedge_report_parity_02/publish/lens_decision_surface_pub.html
```

**Stderr:** NONE

---

## Invocation Count

Generator invoked: **1 time**

Pre-generation cleanup: `rm -rf /tmp/blueedge_report_parity_02` — CONFIRMED
