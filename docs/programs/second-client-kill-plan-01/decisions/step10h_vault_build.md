# STEP 10H — Evidence Vault Build

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10H
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**FAIL-STOP**

FAIL-STOP condition triggered: CLM-20..CLM-24 present in vault output.

---

## CANONICAL Brain

Schema applied correctly from C1 reference. All structural claims (CLM-01..CLM-19,
CLM-25..CLM-27) generated from second-client evidence with correct values.

**FAIL-STOP trigger:** `build_evidence_vault.py` unconditionally generates all 27
claims regardless of `emission_state` or `total_signals`. When `total_signals=0`
and `emission_state=NOT_EVALUATED`, the builder still generates CLM-20..CLM-24
as BLOCKED nodes rather than omitting them. The script has no suppression path
for NOT_EVALUATED signal claims.

---

## CODE Brain

**Command executed:**
```
python3 scripts/psee/build_evidence_vault.py \
  --client e65d2f0a-dfa7-4257-9333-fcbb583f0880 \
  --run run_01_oss_fastapi \
  --package-dir clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package \
  --output-dir clients/e65d2f0a-.../vaults/run_01_oss_fastapi \
  --client-name "OSS FastAPI Client"
```
**Exit code:** 0
**Script modified:** NO

**Builder output:**
```
[Model] score=60/100  coverage=100%  recon=PASS  signals=0  nodes=45
[Generate] 57 nodes
[Validate] All wikilinks resolve — OK
[Write] 57 files written
[COMPLETE] vault nodes=57 claims=27 broken links=0
```

**FAIL-STOP evaluation:**
| Condition | Result |
|---|---|
| CLM-20..CLM-24 present | **YES → FAIL-STOP** |
| SIG-006 present | NO |
| BlueEdge contamination ("blueedge") | NO |
| NOT_EVALUATED present in vault | YES (correct — CLM-13, VAULT ENTRY, etc.) |
| Missing claims directory | NO |

**CLM-20..CLM-24 content (inspected):**

All five have identical structure — example CLM-20:
```
claim_label: SIG-001 Sensor Bridge Throughput   ← BlueEdge signal name
status: ACTIVE                                   ← INCORRECT (should be DEFERRED)
lens_admissible: YES                             ← INCORRECT (NOT_EVALUATED)

## Explanation
Signal SIG-001 not found in signal_registry.json for run `run_01_oss_fastapi`.

## Authoritative Value
NOT_AVAILABLE

## Traceability
- Status: BLOCKED — signal not present in registry
```

Problems:
1. `claim_label` carries BlueEdge-specific signal names (Sensor Bridge Throughput, etc.)
2. `status: ACTIVE` is wrong — claim has no evidence and should not be ACTIVE
3. `lens_admissible: YES` is wrong — NOT_EVALUATED signal is not lens-admissible

No BlueEdge telemetry values leaked. No SIG-006. Structural claims correct.
The failure is in claim presence and metadata, not in data contamination.

**Root cause:** `build_evidence_vault.py` does not have a code path to
suppress or defer CLM-20..CLM-24 based on `emission_state`. The `_gen_signal_claim()`
function returns a BLOCKED node when signal not found; the generator always calls
all five `gen_clm_20..gen_clm_24` functions regardless of signal count.

---

## PRODUCT Brain

Vault build completed technically (exit 0, 57 nodes, 0 broken links). However,
the FAIL-STOP condition means the vault as produced is NOT an authorized second-client
artifact — it contains 5 claim nodes that:
- carry BlueEdge-specific signal names
- have `status: ACTIVE` with no evidence
- are not evidence-derived from second-client artifacts

The 22 structural claims (CLM-01..CLM-17, CLM-18..CLM-19, CLM-25..CLM-27) are
correctly generated and evidence-accurate. Score=60, coverage=100%, PASS reconstruction,
5 domains / 30 caps / 10 comps are all correctly reflected.

Vault is not authorized for use until CLM-20..CLM-24 are removed.

---

## PUBLISH Brain

No claims activated. The FAIL-STOP prevents any promotion of this vault.
Vault at `clients/e65d2f0a-.../vaults/run_01_oss_fastapi/` is a draft-invalid artifact.

---

## Remediation Path

The FAIL-STOP requires one of:

**Option A — Script modification (requires authorization):**
Modify `build_evidence_vault.py` to suppress CLM-20..CLM-24 generation when
`signals_raw.get("emission_state") == "NOT_EVALUATED"` or `total_signals == 0`.
This is a targeted change to the generator loop.
**Blocked by:** current chunk rule "DO NOT modify scripts"

**Option B — Post-build output cleanup (no script change):**
Delete the 5 BLOCKED claim files from the vault output directory:
```
rm clients/e65d2f0a-.../vaults/run_01_oss_fastapi/claims/CLM-20 *.md
rm clients/e65d2f0a-.../vaults/run_01_oss_fastapi/claims/CLM-21 *.md
rm clients/e65d2f0a-.../vaults/run_01_oss_fastapi/claims/CLM-22 *.md
rm clients/e65d2f0a-.../vaults/run_01_oss_fastapi/claims/CLM-23 *.md
rm clients/e65d2f0a-.../vaults/run_01_oss_fastapi/claims/CLM-24 *.md
```
Requires validation that wikilinks to these claims also be removed or do not exist
in the remaining vault nodes. Wikilinks would need to be verified post-deletion.
**Does not modify scripts.** Vault re-validation required after deletion.

**Preferred path:** Option A — script modification is cleaner and prevents the
problem from recurring. Should be authorized in a repair chunk (STEP 10H.1 or similar).

---

## Anomalies

**A1 — `build_evidence_vault.py` has no NOT_EVALUATED suppression path for signal claims**

The script always generates CLM-20..CLM-24. When `total_signals=0` and signal is not
found in registry, it emits BLOCKED nodes. There is no `if emission_state == "NOT_EVALUATED": skip`
path. This is a builder defect for multi-client use: the claim set is not evidence-gated,
it is hardcoded to the BlueEdge 27-claim template.

This defect was NOT detectable from the 10H-R retrieval analysis — it required
actual execution to observe.

---

## Claim Count

Derived count from successful structural generation: **22** (CLM-01..CLM-19 + CLM-25..CLM-27)
CLM-20..CLM-24: **5** — BLOCKED, FAIL-STOP, must be removed

---

## STEP 10H Status

**FAIL-STOP — vault exists but is invalid. Remediation required before STEP 10I.**

Authorized remediation needed: Option A (script modification) or Option B (post-build cleanup).
