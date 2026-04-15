---
title: Exposure Zones
node_type: governance
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Exposure Zones

Four zones govern what information is exposed and to whom.

| zone | id | audience | definition |
|------|----|----------|-----------|
| Full Internal Trace Reality | ZONE-0 | System only | Everything the vault knows. Not exposed directly to any audience. Ground truth layer. |
| Operator Surface (GAUGE) | ZONE-1 | Technical operators, CTOs | Full dimension detail, axis results, raw scores, execution state. |
| Client Surface (LENS) | ZONE-2 | Client executives, decision-makers | Summary metrics, business_impact, narrative phrases, score range. No PSEE internals. |
| Audit / Evidence Vault | ZONE-3 | Auditors, client technical representatives | Full evidence chain, blocking conditions, traceability maps. |

## What Is "Too Raw" for ZONE-2

| raw information | reason not client-safe without treatment |
|-----------------|------------------------------------------|
| Individual CEU file names | Technical artifact filenames — confusing without context to executives |
| PSEE terminal state (S-13, S-T3) | Internal state machine labels — no client meaning |
| Reconstruction axis names verbatim | COMPLETENESS/STRUCTURAL_LINK/etc. have technical definitions differing from everyday usage |
| DIM-XX identifiers | Internal PSEE codes — replace with labels: "Coverage", "Reconstruction", etc. |
| confidence_rationale text | Contains INTEL/DIAG/COND/SIG IDs — technical provenance for operators only |

**Authority:** PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
