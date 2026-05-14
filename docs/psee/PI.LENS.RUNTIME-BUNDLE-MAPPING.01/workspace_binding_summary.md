# Workspace Binding Summary
## PI.LENS.RUNTIME-BUNDLE-MAPPING.01

**Date:** 2026-05-03

---

## workspace.js Changes

### Imports

Added: `import { useRouter } from 'next/router'`

### Removed Constants

| Removed | Was |
|---------|-----|
| `USE_SECOND_CLIENT` | `true` |
| `_SC_CLIENT_ID` | `'e65d2f0a-dfa7-4257-9333-fcbb583f0880'` |
| `_SC_RUN_ID` | `'run_02_oss_fastapi'` |

### Bundle Param Reading

```js
const effectiveClient     = router.query.client     || null
const effectiveVaultRun   = router.query.vaultRun   || router.query.runId || null
const effectiveDisplayRun = router.query.displayRun || router.query.runId || null
```

Zones fetch gated on `router.isReady`. Re-runs when params change.

### API Call Updates

| Call | Before | After |
|------|--------|-------|
| `/api/zones` | `?client=<uuid>&runId=run_02_oss_fastapi` | `?client=${effectiveClient}&runId=${effectiveVaultRun}` |
| `/api/query` (ZoneCard) | `?...&client=<uuid>&runId=run_02_oss_fastapi` | `?...&client=${effectiveClient}&runId=${effectiveVaultRun}` |
| `/api/query` (handleGraphQuery) | `?...&client=<uuid>&runId=run_02_oss_fastapi` | `?...&client=${effectiveClient}&runId=${effectiveVaultRun}` |

### Header

Topbar run label: `effectiveDisplayRun || zonesData?.run_id`

---

## Validation

```
GET /api/zones?client=blueedge&runId=run_blueedge_productized_01
→ {"status": "ok", "run_id": "run_blueedge_productized_01", zones: [1 zone]}
```

Workspace opens at:
`/tier2/workspace?client=blueedge&displayRun=run_blueedge_productized_01_fixed&vaultRun=run_blueedge_productized_01&reportRun=run_blueedge_productized_01_fixed`
→ HTTP 200

Zones load with `vaultRun=run_blueedge_productized_01` → canonical data available.
