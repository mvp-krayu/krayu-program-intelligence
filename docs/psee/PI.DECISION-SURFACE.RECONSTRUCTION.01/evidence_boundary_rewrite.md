# Evidence Boundary Rewrite — PI.DECISION-SURFACE.RECONSTRUCTION.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.01  
**Date:** 2026-04-30

## Confirmed (Structurally Verified)

The Decision Surface "Structurally confirmed" section now includes:

1. Structural evidence group grounding — "13 of 13 structural evidence groups are grounded" (artifact-derived, uses correct terminology)
2. Semantic coverage state — "5 of 17 semantic domains have structural backing; 12 remain semantic-only"
3. Active pressure zone — "1 pressure zone identified: PZ-001 — Platform Infrastructure and Data"
4. Active signal IDs — "Active structural signals: PSIG-001 · PSIG-002 · PSIG-004"
5. Baseline signal — "Baseline signal: PSIG-006 — theoretical baseline condition, not an activated pressure signal"
6. Pressure zone class — "Expressed as Multiple structural pressures acting together" (COMPOUND_ZONE)
7. Inference prohibition — "ACTIVE — all data on this surface is structural and evidential only"

## Outside Evidence Scope (Unknown)

The Decision Surface "Not known" section includes:

1. "Execution-layer behavioral state" — exec_evaluated = False (from decision_model)
2. Not-activated signals — "{n} structural signals not activated" (from not_activated list)
3. "Blind spot coverage active — entities outside zone scope not characterized" (when blind_spot_active)
4. "Causal relationships between conditions" — always present
5. "Runtime behavior under load" — always present

## Eliminated Forbidden Language

The following forbidden phrases are confirmed absent from the reconstructed surface:

| Forbidden phrase | Status |
|---|---|
| "No incomplete structural areas detected" | ABSENT — removed from non-semantic fallback |
| "All domains are structurally grounded" | ABSENT — replaced with "X of Y structural evidence groups are grounded" |
| "13 domains" misuse | ABSENT — term not present |
| "4 active signals" | ABSENT — shows "3 active structural signals" |
| "backend_app_root" as primary label | ABSENT — appears only as DOM backing trace |
| "dependency load is low" | ABSENT — dep_load NOT_IN_SCOPE, not classified |
| "elevated dependency or density risk" | ABSENT |
| PZ-002/PZ-003 | ABSENT — 0 matches |
| Any recommendation/remediation | ABSENT — inference prohibition active |
