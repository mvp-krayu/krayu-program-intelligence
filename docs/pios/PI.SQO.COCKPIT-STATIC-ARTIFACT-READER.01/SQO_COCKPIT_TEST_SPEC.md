# SQO Cockpit Test Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Test File

`app/execlens-demo/flagship-experience/tests/sqo-cockpit-static-reader.test.js`

## Test Runner

Node.js built-in test runner (`node --test`)

## Test Suites (6) — 37 Tests Total

### SQOCockpitArtifactLoader (6 tests)
- All 15 artifact keys defined
- BlueEdge loads 15/15 artifacts
- FastAPI loads 15/15 artifacts
- Unregistered client/run rejected
- Section-specific artifact loading
- Critical artifact presence check

### SQOCockpitStateResolver (5 tests)
- NO_CLIENT_SELECTED for null params
- BlueEdge resolves to S2_QUALIFIED_WITH_DEBT
- FastAPI resolves to S1_ONBOARDING_REQUIRED
- Handoff status includes blocking conditions
- Replay status included

### SQOCockpitDegradationHandler (6 tests)
- FULLY_OPERATIONAL for complete data
- CLIENT_NOT_REGISTERED for unknown client
- LOAD_FAILURE for null input
- Degraded notice severity
- Null notice for operational state
- Replay status check

### SQOCockpitRouteResolver (5 tests)
- Registered client/run validated
- Unregistered client rejected
- Missing client param rejected
- Correct section paths built
- Navigation items with active section

### SQOCockpitFormatter (9 tests)
- BlueEdge overview (S2, 0.625 maturity, 0.45 gravity, 0.692 stability)
- FastAPI overview (S1, 0.208 maturity, 0.082 gravity, 0.063 stability)
- Debt section (15 items, blocking count)
- Continuity section (PARTIAL, 0.371 coverage)
- Maturity section (8 dimensions, gravity, stability)
- Progression section (S2→S3, 13 blocking)
- Evidence/replay section (all passed)
- Handoff section (blocked, conditions)
- History section (S2 current)

### Governance Compliance (6 tests)
- Read-only artifact consumption (no mutation)
- No LENS flagship binding imports
- No LENS runtime imports in pages
- Deterministic display
- Fail-visible empty states
- No AI interpretation terms
