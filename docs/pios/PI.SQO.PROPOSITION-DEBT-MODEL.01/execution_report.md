# Execution Report — PI.SQO.PROPOSITION-DEBT-MODEL.01

## Stream Classification: G2 — Architecture-Consuming

## Pre-flight

- Branch: `feature/PI.SQO.PROPOSITION-DEBT-MODEL.01`
- Base: `main` @ 7af2d72
- Inputs: spine_objects.json (75 propositions), review_obligations.json, spe_derivation_report.json
- Dependencies: PI.SQO.AUTHORITY-WORKFLOW-PROJECTION.01 (merged)
- §5.5: Required — introduces PropositionDebtResolver as reusable primitive

## Scope

Build proposition-based qualification debt model for SPE-path specimens. Resolves BLK-005. Computes debt from proposition coverage, confidence, tier distribution, review state, and reconciliation alignment.

## Execution Log

### Phase 1 — PropositionDebtResolver (new file)

Created `PropositionDebtResolver.server.js` that computes debt from spine propositions and review obligations:

**Debt categories computed:**
- CONFIDENCE_GAP: classes below operational (65%) or high-confidence (85%) thresholds
- COVERAGE_GAP: singleton proposition classes (insufficient structural coverage)
- TIER_IMBALANCE: classes with 100% DERIVED propositions (no direct evidence anchor)
- REVIEW_DEBT: unresolved proposition class obligations blocking progression
- RECONCILIATION_NOVELTY: propositions in NOVEL state not yet aligned with prior evidence

**For NetBox, produces 9 debt items:**
- 3 CONFIDENCE_GAP (Hero Moment HIGH, Authority Topology MEDIUM, Cluster Architecture HIGH)
- 3 TIER_IMBALANCE (Authority Topology MEDIUM, Hero Moment MEDIUM, Cluster Architecture LOW)
- 1 COVERAGE_GAP (Cluster Architecture MEDIUM)
- 1 REVIEW_DEBT (5/6 obligations unresolved — HIGH)
- 1 RECONCILIATION_NOVELTY (11 NOVEL propositions — LOW)

### Phase 2 — Runtime Wiring

- SQORuntimeResolver: added `proposition_debt` capability (spe_derivation_report + review_obligations)
- SQORuntimeResolver: extended `debt` section availability to include proposition_debt
- SQOWorkspaceDataResolver: fallback to resolvePropositionDebt when static debt unavailable

### Phase 3 — Blocker Resolution

- promotion_state.json: qualification_debt lane → COMPLETE / PROPOSITION_DEBT_MODEL
- promotion_state.json: promotion_decision blocking_gaps reduced (removed PROPOSITION_DEBT_PENDING)
- qualification_blockers.json: BLK-005 → resolved with resolution note
- qualification_blockers.json: unresolved_blockers 3 → 2

### Phase 4 — Verification

- NetBox debt page: 9 items across 5 categories, proper severity/blocking display
- BlueEdge debt page: unchanged (15 grounding gap items)
- No console errors on either page

## Files Changed

| File | Action |
|------|--------|
| `lib/sqo-cockpit/server/PropositionDebtResolver.server.js` | Created |
| `lib/sqo-cockpit/server/SQORuntimeResolver.server.js` | Modified (capability + availability) |
| `lib/sqo-cockpit/SQOWorkspaceDataResolver.js` | Modified (proposition debt fallback) |
| `clients/.../sqo/promotion_state.json` | Modified (qualification_debt lane) |
| `clients/.../sqo/qualification_blockers.json` | Modified (BLK-005 resolved) |

## Governance

- No data mutation beyond governed operational state files
- No interpretation — debt computed deterministically from structural evidence thresholds
- No new API calls
- Fail-closed: missing spine → null debt (no section rendered)
