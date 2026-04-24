# STEP 10G-R — Signal Semantics Authority Review + Remediation

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10G-R
**Date:** 2026-04-24
**Branch:** feature/next

---

## Context

STEP 10G-R objective: review the `signal_registry.json` produced in STEP 10G
against canonical signal definitions, decide ACCEPT/REMEDIATE/BLOCK, and
execute any required corrections.

Client: `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
Run: `run_01_oss_fastapi`

Runtime execution: FORBIDDEN in this chunk.
File modification: ALLOWED.

---

## Findings

### F1 — `binding_envelope.json` signal inventory

`binding_envelope.json` (summary.signals_count=6) contains two distinct signal types:

**L1-ST structural telemetry (5 entries):**
| Signal ID | Value | Location |
|---|---|---|
| `L1-ST-CEU-08-001` | `module_count=63` | CEU-08 (backend) |
| `L1-ST-CEU-08-002` | `file_count=397` | CEU-08 (backend) |
| `L1-ST-CEU-09-001` | `pwa_enabled=True` | CEU-09 (frontend) |
| `L1-ST-CEU-09-002` | `file_count=324` | CEU-09 (frontend) |
| `L1-ST-CEU-10-001` | `file_count=741` | CEU-10 (platform) |

These are binding-layer structural telemetry signals (L1-ST scheme). They are NOT
SIG-XXX intelligence signals. They do not belong in `signal_registry.json`.

**SIG-006 contamination (1 entry):**
| Field | Value |
|---|---|
| `signal_id` | `SIG-006` |
| `signal_name` | `sensor_batch_throughput_rate` |
| `value` | `0.333` |
| `authority_chain` | `40.5/signal_output_set.md` |
| `binding_package_contract` | `PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01` |
| `source_config` | `hasi_bridge.py DEFAULT_CONFIG` |
| `node` | `NODE-010 / CEU-10` |

SIG-006 is confirmed BlueEdge contamination. Its `authority_chain` references
`40.5/signal_output_set.md` (BlueEdge stream) and `PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01`
as binding package contract. It entered `binding_envelope.json` via the
`build_binding_package.py` cross-client write defect identified in STEP 10A (CG-4).
It must be excluded from second-client `signal_registry.json`.

### F2 — Generated `signal_registry.json` (STEP 10G output)

| Field | Pre-remediation value | Correct value |
|---|---|---|
| `emission_state` | `EMPTY_BY_EVIDENCE` | `NOT_EVALUATED` |
| `signals` | `[]` | `[]` (correct — no change) |
| `total_signals` | `0` | `0` (correct — no change) |
| `emission_reason` | PiOS 41.4 not performed | Extended — see below |

**`EMPTY_BY_EVIDENCE` is incorrect.** This state implies signal evaluation was
performed and produced an empty result. That is not what happened — PiOS 41.4
intelligence signal evaluation has never been performed for this client/run.

**`NOT_EVALUATED`** correctly represents: SIG-XXX intelligence evaluation is a
required upstream step that has not been performed. `signals=[]` is accurate but
for a different reason than EMPTY_BY_EVIDENCE implies.

The `signals=[]` value itself is correct — there are no SIG-XXX intelligence
signals to include (L1-ST signals are a different layer; SIG-006 is BlueEdge
contamination and explicitly excluded).

---

## Decision

**REMEDIATE to NOT_EVALUATED**

Reasons:
1. `EMPTY_BY_EVIDENCE` misrepresents the evaluation state — intelligence evaluation
   was never performed, not performed-and-empty
2. L1-ST structural signals in `binding_envelope.json` are a different layer and
   must be documented as such to prevent future misclassification
3. SIG-006 BlueEdge contamination must be explicitly documented in the registry
   for audit traceability

---

## CANONICAL Brain

Signal state for second client `run_01_oss_fastapi`:
- SIG-XXX intelligence evaluation: NOT PERFORMED (PiOS 41.4 not run)
- L1-ST structural telemetry: EXISTS in binding_envelope.json (5 entries, different layer)
- SIG-006: EXISTS in binding_envelope.json (BlueEdge contamination, excluded)
- `signal_registry.json` SIG-XXX entries: 0 (correct)
- Correct `emission_state`: `NOT_EVALUATED`

---

## CODE Brain

**Files modified:**

| File | Change |
|---|---|
| `scripts/pios/emit_signals_empty.py` | `emission_state` → `NOT_EVALUATED`; `emission_reason` extended |
| `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/signal_registry.json` | Same corrections + `remediation` block |

**No runtime execution performed.** The `signal_registry.json` artifact was
corrected by direct file write (STEP 10G-R is a remediation chunk, not execution).
`gauge_state.json` consumes `sr.get("signals", [])` — the signals array remains `[]`,
so GAUGE score is not affected by this correction.

**Unaffected:** `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json`,
`canonical_topology.json` — none reference `emission_state` from `signal_registry.json`.

---

## PRODUCT Brain

GAUGE output is unaffected:
- `score.canonical = 60` unchanged
- `score.projected = 100` unchanged
- `band = CONDITIONAL` unchanged
- The `emission_state` field is metadata on the signal registry; it does not
  feed into GAUGE scoring logic

The corrected `emission_reason` provides accurate client-facing language:
- L1-ST signals exist (binding layer) but are not SIG-XXX intelligence signals
- SIG-006 is excluded as BlueEdge contamination
- Intelligence evaluation path is clearly described as NOT_EVALUATED / unperformed

---

## PUBLISH Brain

No publish-layer artifacts exist for the second client yet. No external claims
reference `emission_state`. This correction has zero impact on PUBLISH layer.

The correction PREVENTS a future false claim: if `EMPTY_BY_EVIDENCE` were published
as a signal state, it would imply intelligence evaluation was performed, which is false.

---

## Artifact Changes

| File | Change | Committed |
|---|---|---|
| `scripts/pios/emit_signals_empty.py` | emission_state + emission_reason corrected | YES (with decision trace) |
| `package/signal_registry.json` | emission_state + emission_reason + remediation block | NO (untracked per prior decisions) |
| `decisions/step10g_signal_authority_review.md` | This file | YES |

---

## GAUGE Score Impact

None. `pios compute gauge` consumes `sr.get("signals", [])` which remains `[]`.
`emission_state` is not consumed by GAUGE computation.

**GAUGE results remain:**
- `score.canonical = 60`
- `score.projected = 100`
- `band = CONDITIONAL`
- `terminal_state = S-13`

---

## Next Step (10H)

STEP 10H — Vault Build:
1. Run `build_evidence_vault.py` with `--package-dir` pointing to corrected
   `psee/runs/run_01_oss_fastapi/package/`
2. Validate vault structure (claims, navigation nodes, artifact nodes)
3. Validate `gauge_state.json` is correctly consumed (score=60, projected=100)
4. Validate no BlueEdge data in vault output
5. Confirm `signal_registry.json` (0 signals, NOT_EVALUATED) produces correct
   vault behavior

---

## STEP 10G-R Status

**COMPLETE** (emission_state corrected to NOT_EVALUATED; GAUGE score unaffected;
vault build unblocked)
