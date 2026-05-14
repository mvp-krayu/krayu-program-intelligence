# Runtime Overlay Revert Report

PI.SQO.RUNTIME-OVERLAY-BOUNDARY-CORRECTION.01

## Summary

Reverted all direct SQO→LENS runtime rendering introduced by
PI.SQO.RUNTIME-OVERLAY-SYSTEM.01. Both modified files
(`flagshipBinding.js`, `lens-v2-flagship.js`) are byte-identical
to their pre-SQO state (commit ae3d657).

## What Was Reverted

### flagshipBinding.js
- Removed `require('./sqo/SQOOverlayStateResolver')` import
- Removed `sqoOverlays: null` from `emptyPropsShape`
- Removed SQO overlay resolution try/catch block
- Removed `sqoOverlays` from all return path props (400, 404, 502, 200)

### lens-v2-flagship.js
- Removed 6 inline SQO overlay component functions:
  - SQOQualificationBanner
  - SQOMaturityPanel
  - SQOGravityStabilityPanel
  - SQODebtProgressionPanel
  - SQOGovernanceStrip
  - SQORuntimeWarnings
- Removed `sqoOverlays` from component function signature
- Removed all SQO component invocations from render tree
- Removed all SQO CSS rules (~215 lines)

## What Was Preserved

- All SQO backend engines (state detection, debt, maturity, gravity,
  stability, progression, replay)
- All SQO artifacts under `artifacts/sqo/`
- All SQO overlay modules (reclassified as prototype evidence)
- All SQO backend test suites
- All PATH B behavior
- All Q-class behavior
- All existing LENS projection behavior

## Verification

- `flagshipBinding.js`: 0 lines diff vs ae3d657
- `lens-v2-flagship.js`: 0 lines diff vs ae3d657
- Boundary enforcement tests: 23/23 PASS
- SQO state detection: 49/49 PASS
- SQO semantic debt: 44/44 PASS
- SQO maturity scoring: 37/37 PASS
- Runtime parameterization: 23/23 PASS
- Q02 and IP: 36/36 PASS
- Live binding: 37/37 PASS
- Generic semantic payload resolver: 33/33 PASS
- Full regression: 647/647 PASS
