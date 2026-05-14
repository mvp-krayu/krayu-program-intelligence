# Server/Client Boundary Fix

PI.SQO.COCKPIT-RUNTIME-RECOVERY.01

---

## Problem

SQO Cockpit pages imported server-only modules (`SQOCockpitStateResolver`, `SQOCockpitArtifactLoader`, `SQOCockpitRouteResolver`, `SQOCockpitFormatter`, `SQOCockpitDegradationHandler`) at module scope using top-level `require()`. This caused webpack to include these modules (and their transitive dependency on `fs` and `path`) in the client-side browser bundle, producing a fatal build error.

## Fix Pattern

All `require()` calls for server-only modules moved inside `getServerSideProps`. React components receive only serialized JSON props from the server.

### Before (broken)
```js
const { resolveCockpitState, COCKPIT_STATES } = require('../../lib/sqo-cockpit/SQOCockpitStateResolver');
const { validateRouteParams } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');

export async function getServerSideProps(context) {
  const state = resolveCockpitState(client, run);
  return { props: { ... } };
}

export default function Page({ cockpitState }) {
  const isCritical = [COCKPIT_STATES.NO_CLIENT_SELECTED, ...].includes(cockpitState.state);
}
```

### After (fixed)
```js
export async function getServerSideProps(context) {
  const { resolveCockpitState } = require('../../lib/sqo-cockpit/SQOCockpitStateResolver');
  const { validateRouteParams } = require('../../lib/sqo-cockpit/SQOCockpitRouteResolver');
  const state = resolveCockpitState(client, run);
  const isCritical = state.cockpit_state === 'NO_CLIENT_SELECTED' || ...;
  return { props: { ..., isCritical } };
}

export default function Page({ cockpitState, isCritical }) {
  // Uses plain string/boolean props only — no server module references
}
```

## Files Modified

| File | Change |
|------|--------|
| pages/sqo/index.js | Moved `resolveClientList` require inside getServerSideProps |
| pages/sqo/client/[client]/index.js | Moved `listAllowedClientRuns` require inside getServerSideProps |
| pages/sqo/client/[client]/run/[run]/index.js | Moved 4 requires inside getServerSideProps, computed `isCritical` server-side |
| pages/sqo/client/[client]/run/[run]/debt.js | Moved 4 requires inside getServerSideProps |
| pages/sqo/client/[client]/run/[run]/continuity.js | Moved 4 requires inside getServerSideProps |
| pages/sqo/client/[client]/run/[run]/maturity.js | Moved 4 requires inside getServerSideProps |
| pages/sqo/client/[client]/run/[run]/progression.js | Moved 4 requires inside getServerSideProps |
| pages/sqo/client/[client]/run/[run]/evidence.js | Moved 4 requires inside getServerSideProps |
| pages/sqo/client/[client]/run/[run]/handoff.js | Moved 4 requires inside getServerSideProps |

## Verification

- `next build` succeeds with no `fs` resolution errors
- All SQO cockpit routes compile as `λ` (server-rendered)
- Client bundle sizes remain small (2.2–2.3 kB per page)
- No webpack fallback hacks applied
- No browser-side artifact loading
