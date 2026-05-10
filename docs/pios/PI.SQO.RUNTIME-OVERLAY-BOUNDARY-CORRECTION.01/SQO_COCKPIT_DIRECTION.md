# SQO Cockpit Direction

PI.SQO.RUNTIME-OVERLAY-BOUNDARY-CORRECTION.01

## Context

The PI.SQO.RUNTIME-OVERLAY-SYSTEM.01 prototype demonstrated that SQO
qualification visibility can be rendered as UI overlays. The implementation
proved the concept but violated the LENS/PATH B boundary by wiring SQO
artifacts directly into the LENS projection surface.

## Future Direction

SQO visibility belongs in a dedicated SQO Cockpit — a purpose-built
surface that is architecturally separate from LENS.

### SQO Cockpit (future)

A dedicated surface for:
- Qualification state monitoring (S-state)
- Semantic maturity visibility (D1-D8)
- Semantic gravity assessment
- Qualification stability tracking
- Semantic debt inventory and remediation
- Progression readiness assessment
- Governance disclosure

### LENS Qualification Envelope (future, via PATH B)

If SQO-derived information needs to appear in LENS, the canonical path is:

1. SQO Cockpit produces qualification artifacts.
2. PATH B reads relevant artifacts and packages them as governed envelopes.
3. LENS consumes the envelope as a projection object — like any other.

### Retained Prototype Assets

The following modules from PI.SQO.RUNTIME-OVERLAY-SYSTEM.01 can inform
the SQO Cockpit implementation:

- `SQORuntimeOverlayLoader.js` — artifact loading pattern
- `SQOOverlayFormatter.js` — formatting and lookup tables
- `SQOOverlayDegradationHandler.js` — fail-safety pattern
- `SQOOverlayStateResolver.js` — orchestration pattern

These are retained as experimental evidence, not canonical runtime code.
