# UI Visible Validation
## PI.LENS.WORKSPACE.EVIDENCE-GRAPH-PSIG-BINDING.02

**Date:** 2026-05-03

---

## API Confirmation

```
GET /api/query?zone_id=PZ-001&mode=EVIDENCE&client=blueedge&runId=run_blueedge_productized_01

Response:
  status: ok
  signal_coverage: 3
    signal_id: PSIG-001
    signal_id: PSIG-002
    signal_id: PSIG-004
  vault_targets: 0 (empty — confirmed live)
```

---

## Browser Path

```
http://localhost:3001/tier2/workspace?client=blueedge
  &displayRun=run_blueedge_productized_01_fixed
  &vaultRun=run_blueedge_productized_01
  &reportRun=run_blueedge_productized_01_fixed
```

HTTP 200 confirmed.

---

## UI Validation Steps

1. Open workspace URL above
2. Click `PZ-001` zone card to expand it
3. Click `EVIDENCE` button

### Expected visible output:

**Signal strip** (between graph panel header and 3D canvas):
```
active signals   [PSIG-001]   [PSIG-002]   [PSIG-004]
```
Green chips on dark background. These are direct text renders of `signal_id` from `signal_coverage`.

**Graph panel header**:
- Title: `VAULT GRAPH — GLOBAL CONTEXT`
- Zone badge: `PZ-001`
- Mode: `zone evidence focus`

**VaultGraph header** (inside canvas component):
- `4 nodes · 3 signals`

**3D graph canvas**:
- 4 bright nodes: PZ-001 (white, large), PSIG-001 (green), PSIG-002 (green), PSIG-004 (green)
- 3 bright green links: PZ-001 → each PSIG
- Star topology

**Signal strip does NOT appear** in OVERVIEW mode, WHY mode, or TRACE mode — it is conditional on `psigSignals.length > 0`.

---

## Code Traceability

Signal strip render path:
```
/api/query response
  → activeQsData.result.signal_coverage
  → graphQs.data.result.signal_coverage
  → psigSignals (filter by signal_id truthy)
  → psigSignals.map(s => <span>{s.signal_id}</span>)
```

This is a direct text render. No inference, no computation, no ID mapping.

VaultGraph PSIG bright path:
```
psigSignals
  → graphVaultIndex.signals = {PSIG-001:null, PSIG-002:null, PSIG-004:null}
  → graphQsForVault.vault_targets = [{type:signal,id:PSIG-001}, ...]
  → computeRelevance returns {PSIG-001, PSIG-002, PSIG-004, PZ-001}
  → all 4 nodes nodeStyle → BRIGHT
```
