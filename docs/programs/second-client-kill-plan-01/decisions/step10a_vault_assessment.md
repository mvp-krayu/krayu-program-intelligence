# STEP 10A — Vault Construction 4-Brain Assessment Decision Trace

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10A
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Context

STEP 10A objective: validate that vault construction for the second client is
canonically defined, product-complete, code-realizable, and publish-safe before
any implementation or execution. READ-ONLY assessment against four brains.

Client: `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
Run: `run_01_oss_fastapi`

---

## CANONICAL Brain — Verdict: GAP

Required vault inputs not available from `binding_envelope.json` alone:

- `gauge_state.json` — absent from `psee/runs/run_01_oss_fastapi/package/`; required for
  all score fields (`score.canonical`, `score.projected`, `score.band_label`), all six
  dimensions (DIM-01..DIM-06), execution state, and confidence range
- `signal_registry.json` — absent; required for SIG-XXX signal metadata (title,
  business_impact, risk, domain_name, capability_name, component_names); binding_envelope
  has only L1-ST structural signals (different scheme) and one partial SIG-006 entry
- `canonical_topology.json` — absent; required for `topology["counts"]` and
  `domains[].grounding` field used by tier2 zone derivation

Additional governance concern: `binding_envelope.json` carries
`artifact_id = "PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01-BINDING-ENVELOPE"` and
`contract_id = "PSEE.BLUEEDGE.BINDING.PACKAGE.CONSOLIDATION.01"` — BlueEdge governance
identifiers embedded in the second-client artifact. Requires review before ART-06 vault
node emission.

**Gaps: CG-1 (GAUGE absent), CG-2 (signal_registry absent), CG-3 (canonical_topology
absent), CG-4 (BlueEdge identifiers in binding_envelope — governance review required)**

---

## PRODUCT Brain — Verdict: GAP

Tier-2 requirements cannot be fulfilled from `binding/`, `package_manifest.json`, or
`structure_manifest.json` alone:

- Score claims (CLM-09, CLM-10, CLM-11, CLM-12): blocked — require GAUGE `score.*` fields
- Coverage/reconstruction/verdict claims (CLM-01, CLM-03, CLM-25): blocked — require
  DIM-01..DIM-06 from `gauge_state.json`
- Signal explanation layer (CLM-20..24): blocked — `signal_registry.json` absent; SIG-XXX
  fields (business_impact, risk, domain_name) not present in binding_envelope
- Zone classification (`grounding` per domain): blocked — `canonical_topology.json` absent
- `tier2_data.py` default `CANONICAL_PKG_DIR` hardcoded to BlueEdge path (lines 18-22);
  must be configured via `configure()` before use — pre-execution requirement

**Gaps: PG-1 (score/dim claims blocked), PG-2 (signal explanation layer blocked),
PG-3 (zone grounding blocked), PG-4 (tier2_data.py default path — configuration required)**

---

## CODE Brain — Verdict: GAP

`build_evidence_vault.py` requires five artifacts via `REQUIRED_PACKAGE_ARTIFACTS`
(lines 33-39): `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json`,
`canonical_topology.json`, `signal_registry.json`. Missing any artifact → `sys.exit(1)`.
All five are absent from `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/`.

`binding_envelope.json` is OPTIONAL in the vault builder (`try_load_json`, line 225)
and populates only supplementary envelope count fields — it cannot substitute for
`gauge_state.json` from which all VaultModel score/dimension/execution/confidence fields
are derived (lines 283-315). No code path exists to derive these from binding_envelope.

`projection_runtime.py:_find_signal_registry()` (lines 333-347) hardcodes two BlueEdge-era
run IDs as candidate paths: `run_authoritative_recomputed_01` and `run_01_authoritative`.
Neither matches `run_01_oss_fastapi`. Signal claims CLM-20..24 will project with null
signal_title/business_impact/risk. Fix scope: single function replacement, ~15 lines,
no redesign.

Vault output directory naming unresolved: plan references `run_01_authoritative_generated`
(BlueEdge convention); correct path for second client must be determined before
`build_evidence_vault.py` is invoked.

**Gaps: CG-CODE-1 (GAUGE not run → vault builder exits 1), CG-CODE-2 (signal registry
path hardcoded in projection_runtime.py), CG-CODE-3 (vault output directory naming
unresolved)**

---

## PUBLISH Brain — Verdict: GAP

ZONE-2 enforcement in `projection_runtime.py` is correctly implemented — strips SIG-,
COND-, DIAG-, INTEL- content. This is not a blocker in isolation. However:

- Score and verdict claims (CLM-09, CLM-10, CLM-11, CLM-12, CLM-25, CLM-01, CLM-03)
  will return `CLAIM_NOT_IN_VAULT` errors until vault is built — fail-closed, not a
  leakage risk, but no claim output possible
- Signal claims CLM-20..24 will project with null signal fields until
  `_find_signal_registry()` is patched — incomplete but not a ZONE-2 violation
- ART-06 vault node will carry BlueEdge `contract_id` from binding_envelope — must be
  verified as not reaching ZONE-2 claim content before any ZONE-2 payload referencing
  ART-06 is published

**Gaps: PG-PUBLISH-1 (BlueEdge identifier in ART-06 — governance review), PG-PUBLISH-2
(signal claims incomplete without signal registry fix), PG-PUBLISH-3 (score/verdict claims
blocked until GAUGE runs)**

---

## Hard Stop Conditions

1. **GAUGE not executed for second client** — five required package artifacts absent from
   `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/`. `build_evidence_vault.py`
   will `sys.exit(1)` before any vault content is produced.

2. **Package artifacts missing** — `gauge_state.json`, `coverage_state.json`,
   `reconstruction_state.json`, `canonical_topology.json`, `signal_registry.json` all
   absent from the vault builder input path.

3. **`projection_runtime.py:_find_signal_registry()` hardcoded** (lines 340-342) — signal
   claims CLM-20..24 will produce payloads without signal data until fixed.

4. **Contaminated `gauge_state.json` must not be used** —
   `clients/e65d2f0a-.../runs/run_01_oss_fastapi/package/gauge_state.json` contains
   `client_id: "blueedge"` and `run_id: "run_01_authoritative"`. This is cross-client
   contamination. It is NOT at the authorized vault builder input path (`psee/runs/`) and
   MUST NOT be used as input to `build_evidence_vault.py` under any circumstances.

---

## Decisions

### D1 — Vault Construction Blocked

Vault construction for `run_01_oss_fastapi` is BLOCKED. No vault build contract may be
issued until hard stops 1 and 2 are resolved.

### D2 — GAUGE Execution Required Before Vault Build

GAUGE must execute for the second client and produce the five package artifacts at
`clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/` before
`build_evidence_vault.py` can be invoked. A separate GAUGE execution contract is required.

### D3 — projection_runtime Fix Required Before Fragment Export

`_find_signal_registry()` in `scripts/pios/projection_runtime.py` (lines 333-347) must
be patched to derive the signal registry path from the active `run_id` argument before
fragment export can produce complete signal claim payloads. A code fix contract is required.

### D4 — Vault Path to Align with run_id

The vault output directory will use `run_01_oss_fastapi` as the naming anchor, not the
BlueEdge-convention `run_01_authoritative_generated`. Proposed canonical output path:
`clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi/`
This must be confirmed in the vault build contract before execution.

---

## Confirmation: No Runtime Execution

No scripts were executed during STEP 10A. No pipeline commands were run.
All assessment derived from reading existing artifacts and scripts.

---

## Confirmation: No Files Modified

No existing files were modified. This file is a new creation only.

---

## STEP 10A Status

**COMPLETE** (assessment complete; vault construction BLOCKED pending D2 and D3 resolution)
