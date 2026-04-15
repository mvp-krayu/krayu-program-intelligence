---
title: Exposure Zones
node_type: governance
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
status: ACTIVE
---

## Four Exposure Zones

| zone | id | audience | definition |
|------|-----|---------|------------|
| Full Internal Trace Reality | ZONE-0 | Ground truth layer | Everything the vault knows. Not exposed directly to any audience. |
| Operator Surface (GAUGE) | ZONE-1 | Technical operators, platform engineers, CTOs | Full dimension detail, axis results, raw scores, execution state. |
| Client Surface (LENS) | ZONE-2 | Client executives, non-technical decision-makers | Summary metrics, business_impact, narrative phrases, score range. No raw artifact names, no PSEE internals. |
| Audit / Evidence Vault | ZONE-3 | Auditors, client technical representatives | Full evidence chain, blocking conditions, traceability maps. |

## What Is "Too Raw" for ZONE-2

| raw information | reason not client-safe without treatment |
|-----------------|------------------------------------------|
| Individual CEU file names | Code/artifact filenames (e.g., `hasi_bridge.py`). Meaningful to engineers; confusing to executives without full context. |
| PSEE terminal state (S-13, S-T3) | Internal state machine labels. No client meaning. Replace with execution narrative. |
| Schema version differences (PHASE_1_ACTIVE vs NOT_EVALUATED) | Platform evolution detail — not a client observation. |
| Reconstruction axis names verbatim | COMPLETENESS/STRUCTURAL_LINK/REFERENTIAL_INTEGRITY/LAYER_CONSISTENCY differ from everyday usage without explanation. |
| DIM-XX identifiers | Internal PSEE codes. Replace with labels: "Coverage", "Reconstruction", "Escalation Clearance". |
| confidence_rationale text | Contains INTEL/DIAG/COND/SIG IDs, stream numbers, scoring model details. Operators and auditors only. |
| Projection rule codes (PR-02, PR-NOT-EVALUATED) | Internal rule identifiers. Replace with explanation: "assumes execution completes to maximum structural state". |
| signal.statement | Technical provenance — references CEU IDs, dimension IDs. ZONE-1/3 only. |

## Drill-Down Path Model

For every piece of information in ZONE-0 or ZONE-1, there must be a governed path to it from ZONE-2/3:

```
Summary claim (ZONE-2)
  → operator detail (ZONE-1)
  → evidence chain (ZONE-3)
  → raw artifact (ZONE-0)
```

Each step in this path is governed by the exposure zone policy.

## Full Specification

`docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/gauge_lens_exposure_governance.md`
