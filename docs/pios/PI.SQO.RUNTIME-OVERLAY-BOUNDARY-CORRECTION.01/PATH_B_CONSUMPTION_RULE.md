# PATH B Consumption Rule

PI.SQO.RUNTIME-OVERLAY-BOUNDARY-CORRECTION.01

## Canonical Future Flow

```
SQO artifacts
  → PATH B qualification envelope builder
  → governed projection object
  → LENS rendering
```

## Forbidden Flow

```
SQO artifacts
  → LENS runtime component
  → direct interpretation rendering
```

## Mandatory Rule

No SQO-derived runtime interpretation may be shown in LENS unless
transformed into a governed projection object by PATH B.

## What This Means

PATH B is the single authority for projection objects consumed by LENS.

SQO generates:
- `qualification_state`
- `semantic_debt_inventory`
- `continuity_assessment`
- `semantic_maturity_profile`
- `semantic_gravity_assessment`
- `qualification_stability`
- `progression_readiness`

These are qualification/maturation artifacts, not projection objects.

For LENS to display SQO-derived information, a PATH B qualification
envelope builder must:

1. Read the relevant SQO artifacts.
2. Package them into a governed projection object shape.
3. Apply any authorization gating (S-state, Q-class).
4. Emit the result as a projection-surface-safe envelope.
5. LENS consumes the envelope — not the raw SQO artifacts.

## Governance

- No SQO module may be imported by LENS page code.
- No SQO module may be imported by flagshipBinding.
- SQO overlay modules are retained as prototype evidence.
- SQO backend engines (state detection, debt, maturity) are unaffected.
