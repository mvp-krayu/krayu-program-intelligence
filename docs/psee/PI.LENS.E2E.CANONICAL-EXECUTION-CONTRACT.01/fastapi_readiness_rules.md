# FastAPI Readiness Rules
## PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01 — BLOCK_K

**Generated:** 2026-05-01  
**Mode:** DOCUMENTATION_ONLY / CONTRACT_LOCK  
**Anchor run:** run_be_orchestrated_fixup_01

---

## 1. FastAPI Status (BlueEdge)

**Current status:** `ALLOWED_AFTER_OPERATOR_APPROVAL`  
**Gate decision authority:** PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 BLOCK_J (`fastapi_gate_decision.json`)

All technical parity conditions are met. Operator approval is required before binding FastAPI endpoints to `run_be_orchestrated_fixup_01` vault artifacts.

---

## 2. FastAPI Canonical Run Binding

FastAPI endpoints MUST bind to artifacts from the run designated `CANONICAL_ORCHESTRATED` in `selector.json`.

**Current canonical run for BlueEdge:** `run_be_orchestrated_fixup_01`

**Vault artifact paths for FastAPI:**
```
clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/
├── signal_registry.json
├── gauge_state.json
├── canonical_topology.json
├── binding_envelope.json
├── coverage_state.json
├── reconstruction_state.json
├── admissibility_log.json
├── evidence_trace.json
└── vault_manifest.json
```

**Report artifact paths for FastAPI:**
```
clients/blueedge/lens/runs/run_be_orchestrated_fixup_01/reports/
  OR
clients/blueedge/lens/current/   ← stable path (always current_run's reports)
```

---

## 3. FastAPI Forbidden Patterns

The following patterns are forbidden for FastAPI integration:

| Forbidden | Reason |
|-----------|--------|
| Binding to `run_be_orchestrated_01` vault | REJECTED_NON_CANONICAL — wrong signal values |
| Binding to any run not in `selector.json` `run_status` | Ungoverned run — no parity validation |
| Bypassing `selector.json` to choose a run | Selector is the authoritative current-run pointer |
| Recomputing signals in FastAPI | Signal computation is upstream. FastAPI serves pre-computed vault. |
| Serving HTML from any path other than `lens/runs/<run_id>/reports/` or `lens/current/` | Reports must come from governed output paths |
| Modifying vault artifact content at serve time | Read-only serving only |
| Accepting signal override parameters from API callers | No caller-side signal manipulation |

---

## 4. FastAPI Entrypoint Rules

1. FastAPI MUST use the same pipeline entrypoint (`run_client_pipeline.py`) for any pipeline trigger.
2. FastAPI MUST NOT bypass phases or call sub-scripts directly (e.g., calling `lens_report_generator.py` without the orchestrator).
3. FastAPI MUST NOT accept run ID as a user-provided parameter unless the provided ID is validated against `available_runs.json` and `run_status == CANONICAL_ORCHESTRATED`.
4. FastAPI MUST read `selector.json` to determine `current_run` — not hardcode run IDs.
5. FastAPI MUST NOT write to vault artifact directories.

---

## 5. FastAPI Signal Serving Rules

When serving signal data through FastAPI endpoints:

1. Read `vault/signal_registry.json` from the current canonical run.
2. Do NOT recompute `active_pressure_signals`, `telemetry_signals`, or any signal field.
3. Apply the three-class model (documented in BLOCK_F: signal_schema_contract.md) to presentation logic only — classification is already encoded in the vault artifact.
4. PSIG-006 MUST be presented as BASELINE / THEORETICAL_BASELINE — the vault artifact is authoritative.
5. GAUGE score, verdict, and action are read from `vault/gauge_state.json` — no recomputation.

---

## 6. Pre-FastAPI Checklist

Before binding FastAPI to a new canonical run:

- [ ] Run classified as `CANONICAL_ORCHESTRATED` in `selector.json`
- [ ] Parity validation complete (14/14 for BlueEdge)
- [ ] All 9 vault artifacts present
- [ ] All 4 report surfaces generated
- [ ] `selector.json` `current_run` updated
- [ ] `lens/current/` mirror populated
- [ ] Operator approval received
- [ ] No pending selector revert (no rejected run is current)

---

## 7. FastAPI Next Contract

When operator approval for `run_be_orchestrated_fixup_01` is granted, issue:

```
PI.LENS.END-TO-END-RERUN.FASTAPI.01
```

That contract binds FastAPI endpoints to the `run_be_orchestrated_fixup_01` vault artifacts and validates the full FastAPI serving chain.

**fastapi_status:** `ALLOWED_AFTER_OPERATOR_APPROVAL`  
**Gate conditions met:** YES (technical parity 14/14)  
**Remaining blocker:** Operator approval only
