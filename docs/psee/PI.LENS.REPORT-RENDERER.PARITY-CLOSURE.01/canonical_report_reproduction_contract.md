# Canonical Report Reproduction Contract
## PI.LENS.REPORT-RENDERER.PARITY-CLOSURE.01

**Date:** 2026-05-02
**Client:** blueedge

---

## Contract

The following inputs, when passed to the renderer, reproduce all four canonical BlueEdge LENS reports within the parity tolerance defined in PI.LENS.REPORT-RENDERER.PARITY-STABILIZATION.01.

---

## Inputs

| Input | Path | Status |
|-------|------|--------|
| Renderer | `scripts/pios/lens_report_generator.py` | LOCKED at bc803b3 |
| Package vault | `clients/blueedge/psee/runs/run_blueedge_productized_01/vault` | GITIGNORED |
| Semantic bundle | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/` | GITIGNORED |
| Canonical lock | `docs/psee/PI.LENS.BLUEEDGE-CANONICAL-REPORT-PATHS.01/canonical_report_paths.json` | TRACKED |

---

## Canonical Reports

| Report Type | Canonical Path | Canonical SHA256 |
|-------------|---------------|------------------|
| TIER1_NARRATIVE | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/tier1/lens_tier1_narrative_brief.html` | `f60134881b2362a5857fc113cf4acde5a4e3513e5864f70b9cab1342e6014511` |
| TIER1_EVIDENCE | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/tier1/lens_tier1_evidence_brief.html` | `84e3d8800ee4c14ac5e19899d064307bcef676622c54cafcbf3ddea0321680ab` |
| TIER2_DIAGNOSTIC | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/tier2/lens_tier2_diagnostic_narrative.html` | `2a69bc0ea65515850da0d63a4392f3bc28abc8fe11d76f65648c42244d3c70fd` |
| DECISION_SURFACE | `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/decision/lens_decision_surface.html` | `36886d0841fdcfc2143d7016d619cafbfcb6b69c660e11c3116be6a78cf2bc06` |

---

## Reproduction Command

```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --run-id run_blueedge_productized_01_fixed \
  --package-dir clients/blueedge/psee/runs/run_blueedge_productized_01/vault \
  --semantic-bundle-dir clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/ \
  --output-dir /tmp/blueedge_report_<run_label>
```

---

## Parity Tolerance

| Report | Tolerance |
|--------|-----------|
| TIER1_NARRATIVE | BYTE_EXACT — sha256 must match |
| TIER1_EVIDENCE | BYTE_EXACT — sha256 must match |
| TIER2_DIAGNOSTIC | BYTE_EXACT — sha256 must match |
| DECISION_SURFACE | NORMALIZED — run-id in href/metadata is VOLATILE; normalized diff must be 0 |

---

## Topology Artifacts Required

The following gitignored topology files must be present with the values locked in DRIFT-REMEDIATION.01:

| File | Root Cause | Locked State |
|------|-----------|--------------|
| `semantic_topology_layout.json` | RC-01 | CANONICAL_SVG_EXTRACTION coordinates (17 nodes, 5 clusters) |
| `semantic_topology_model.json` | RC-02/03 | CLU-01..CLU-05 cluster IDs; DOMAIN-01/16 lineage_status=EXACT; DOMAIN-02 original_status=inferred; 12 canonical edges |

---

## Invariants

The following values must not change between reproductions:
- Gauge score: 60
- Decision class: INVESTIGATE / CONDITIONAL
- Semantic domain count: 17
- Structurally backed count: 5
- Active pressure zone: PZ-001
- Primary pressure domain: DOM-04
- Zone label: Platform Infrastructure and Data
