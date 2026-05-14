# Artifact Source Trace
## PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01.RECOVERY

**Date:** 2026-05-03

---

## Target Artifact

```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json
```

---

## Source

| Field | Value |
|-------|-------|
| Recovery mode | DIRECT_RESTORE |
| Source stash ref | `stash@{0}^3` |
| Stash description | `WIP on work/psee-runtime: 40a5db1 lens: lock e2e pipeline reality and conformance evidence` |
| Source path in stash | `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json` |
| SHA256 | `f5e2a0dfeedeab8f2450b2dc6894fc63d70ed28cf8429eaed7e229f898ca29a6` |
| SHA256 verified (source = destination) | YES |

---

## Content Validation

| Check | Result |
|-------|--------|
| Valid JSON | PASS |
| `contract_id` | `PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` |
| `artifact` | `dom_path_domain_layer` |
| `dom_groups` count | 13 |
| `total_nodes` | 35 |
| First group | `DOM-01 root_configuration` |
| BlueEdge FastAPI topology (not 945-node generic) | CONFIRMED |

---

## Phase 8a Validation

Command: `python3 scripts/pios/run_client_pipeline.py --client blueedge --source source_01 --run-id run_blueedge_e2e_execute_01 --phase 7`

(`--phase 7` = Phase 8a — Vault Construction, which is the 7th phase in the pipeline's phase list)

Result:
- `dom_path_domain_layer.json` loaded successfully — no FileNotFoundError
- 4 vault artifacts written:
  - `vault/coverage_state.json`
  - `vault/reconstruction_state.json`
  - `vault/gauge_state.json`
  - `vault/canonical_topology.json`
- Phase 8a then fails on next missing dependency: `signal_registry_fastapi_compatible.json`

`dom_path_domain_layer.json` restoration: **VALIDATED** — artifact consumed without error.

---

## Content Modified

NO. File extracted from stash verbatim via `git show stash@{0}^3:...`. No transformation applied.
