# SQO Cockpit Page Specification

PI.SQO.COCKPIT-STATIC-ARTIFACT-READER.01

---

## Page Directory

`app/execlens-demo/pages/sqo/`

## Pages (9)

### /sqo — Client Selector (index.js)
Displays all registered client/run pairs from the manifest registry. Entry point to the cockpit.

### /sqo/client/[client] — Run Selector (client/[client]/index.js)
Displays available runs for a selected client. Shows error state for unregistered clients.

### /sqo/client/[client]/run/[run] — Overview (client/[client]/run/[run]/index.js)
Default cockpit view. Loads full cockpit state, renders navigation + overview panel. Handles degradation and critical states.

### /sqo/client/[client]/run/[run]/debt — Semantic Debt (debt.js)
Full debt exploration view. Navigation + SemanticDebtPanel.

### /sqo/client/[client]/run/[run]/continuity — Continuity (continuity.js)
Continuity assessment view. Navigation + ContinuityAssessmentPanel.

### /sqo/client/[client]/run/[run]/maturity — Maturity Profile (maturity.js)
Maturity dimension view. Navigation + MaturityProfilePanel.

### /sqo/client/[client]/run/[run]/progression — Progression (progression.js)
Progression readiness view. Navigation + ProgressionReadinessPanel.

### /sqo/client/[client]/run/[run]/evidence — Evidence & Replay (evidence.js)
Evidence chain and replay verification view. Navigation + EvidenceReplayPanel.

### /sqo/client/[client]/run/[run]/handoff — PATH B Handoff (handoff.js)
Handoff readiness view. Navigation + HandoffReadinessPanel.

## Server-Side Rendering

All pages use `getServerSideProps` for:
1. Route parameter validation
2. Cockpit state resolution (artifact loading, state determination)
3. Section-specific data formatting
4. Navigation item generation
5. Degradation notice assembly

No client-side artifact loading. All data pre-resolved on server.

## Governance

- No direct LENS imports
- No SQORuntimeOverlay imports
- No flagshipBinding imports
- Read-only artifact consumption
- Deterministic display
