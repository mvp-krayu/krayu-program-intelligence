# LENS / SQO Boundary Classification

PI.SQO.RUNTIME-OVERLAY-BOUNDARY-CORRECTION.01

## Classification

1. LENS is not the SQO cockpit.
2. LENS is not the semantic maturation workbench.
3. LENS consumes projection objects.
4. PATH B owns projection authority.
5. SQO produces qualification and maturation artifacts.
6. SQO artifacts may only appear in LENS through PATH B-approved projection envelopes.
7. Direct SQO→LENS rendering is non-canonical.
8. PI.SQO.RUNTIME-OVERLAY-SYSTEM.01 is retained as experimental evidence only.

## Boundary Verdict

PI.SQO.RUNTIME-OVERLAY-SYSTEM.01 is classified as:

- EXPERIMENTAL_PROTOTYPE
- NON_CANONICAL_RUNTIME_PATH
- EVIDENCE_RETAINED
- DIRECT_LENS_CONSUMPTION_REJECTED

## Rationale

The overlay work demonstrated that SQO qualification state, maturity scoring,
semantic gravity, qualification stability, debt, and progression can be
rendered as UI overlays. However, the implementation violated the canonical
consumption boundary by allowing LENS-side SQO interpretation outside PATH B
packaging.

LENS must remain a projection surface under PATH B control. SQO artifacts
are qualification/maturation evidence — they must be transformed into governed
projection objects before LENS can consume them.

## Retained Evidence

The following modules are retained as experimental prototype evidence:

- `app/execlens-demo/lib/lens-v2/sqo/SQORuntimeOverlayLoader.js`
- `app/execlens-demo/lib/lens-v2/sqo/SQOOverlayDegradationHandler.js`
- `app/execlens-demo/lib/lens-v2/sqo/SQOOverlayFormatter.js`
- `app/execlens-demo/lib/lens-v2/sqo/SQOOverlayStateResolver.js`

These modules are NOT wired into the LENS runtime. They exist as reference
implementations for a future SQO Cockpit or PATH B qualification envelope.
