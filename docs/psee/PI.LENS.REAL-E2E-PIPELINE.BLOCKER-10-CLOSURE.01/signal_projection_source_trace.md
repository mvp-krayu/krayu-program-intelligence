# Signal Projection Source Trace
## PI.LENS.REAL-E2E-PIPELINE.BLOCKER-10-CLOSURE.01

**Date:** 2026-05-03
**Contract:** PI.LENS.REAL-E2E-PIPELINE.BLOCKER-10-CLOSURE.01

---

## Required Artifact

```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/signal_projection_fastapi_compatible.json
```

---

## Search Performed

| Location | Files Found |
|----------|-------------|
| `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/41.x/` | `signal_projection.json`, `pressure_zone_projection.json` |
| `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/` | `signal_registry.json` |
| `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/` | `binding_envelope_fastapi_compatible.json` (restored, BLOCKER-09) |
| `clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/` | No signal projection |

---

## Governed Source Identified

`clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/41.x/signal_projection.json`

**Contract ID:** `PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`
**Artifact field:** `signal_projection_fastapi_compatible`
**Generated date:** `2026-04-29`
**SHA256:** `a467ba0b6541e3a558d90ff55f6754332908f13dc536a0f94440feb73fa17e2d`

Signal values confirmed:
- PSIG-001 = 5.663 ✓
- PSIG-002 = 3.2098 ✓
- PSIG-004 = 2.1822 ✓
- PSIG-006 = 0 (THEORETICAL_BASELINE) ✓

All 4 active conditions present: COND-PSIG-001-01, COND-PSIG-002-01, COND-PSIG-004-01, COND-PSIG-006-01

---

## Copy Action

Source: `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/41.x/signal_projection.json`
Destination: `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/signal_projection_fastapi_compatible.json`

Method: `cp` (no content modification)
SHA256 post-copy: `a467ba0b6541e3a558d90ff55f6754332908f13dc536a0f94440feb73fa17e2d` (matches source)

---

## Authority

Source file self-identifies as the required artifact:
- `contract_id: PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`
- `artifact: signal_projection_fastapi_compatible`

Same canonical run as BLOCKER-09 binding envelope source. Consistent provenance.
