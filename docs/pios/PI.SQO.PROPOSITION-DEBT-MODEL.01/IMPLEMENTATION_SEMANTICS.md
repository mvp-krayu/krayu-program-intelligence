# Implementation Semantics — PI.SQO.PROPOSITION-DEBT-MODEL.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|-------------|
| resolvePropositionDebt | PropositionDebtResolver.server.js | Compute qualification debt from SPE propositions | Reusable — any SPE-path specimen |

## 2. Input Contracts

| Input | Source | Required Fields |
|-------|--------|----------------|
| spine_objects.json | `clients/<client>/psee/runs/<runId>/spine/` | `objects.semantic_propositions[]` with `proposition_class`, `confidence`, `derivation_tier`, `ceu_refs`, `reconciliation_state` |
| review_obligations.json | `clients/<client>/psee/runs/<runId>/sqo/` | `obligations[]` with `status` |

## 3. Output Contracts

Returns object matching SemanticDebtPanel shape:
- `total_items`: count of debt items
- `blocking_count`: items with `blocks_s_state` set
- `by_severity`: `{ HIGH: [...], MEDIUM: [...], LOW: [...] }`
- `by_category`: `{ CONFIDENCE_GAP: [...], COVERAGE_GAP: [...], TIER_IMBALANCE: [...], REVIEW_DEBT: [...], RECONCILIATION_NOVELTY: [...] }`
- `aggregate`: summary statistics (total propositions, classes, CEUs, tier ratios)

Returns `null` when spine propositions unavailable (fail-closed).

## 4. Calibration Assumptions

| Parameter | Value | Status |
|-----------|-------|--------|
| HIGH confidence threshold | 0.85 | Tunable |
| MODERATE confidence threshold | 0.75 | Tunable |
| LOW/operational confidence threshold | 0.65 | Tunable |
| Minimum class coverage | 3 propositions | Tunable |

## 5. Extension Points

- Additional debt categories can be added to the computation loop
- Confidence thresholds can be parameterized per client/run
- CEU-level debt (sparse CEU coverage) could be added as a category

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| PropositionDebtResolver | Compute debt from proposition evidence |
| SQORuntimeResolver | Detect proposition_debt capability |
| SQOWorkspaceDataResolver | Route debt data (static OR proposition fallback) |
| SemanticDebtPanel | Render debt items (unchanged — shape-compatible) |
