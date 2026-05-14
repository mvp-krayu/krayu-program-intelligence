# STEP 10H-G — Evidence-Conditional Vault Claim Generation Patch

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10H-G
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE** — Evidence-conditional signal claim generation implemented.
No hardcoded CLM-ID suppression. No runtime execution. Vault not rebuilt.

---

## 4-BRAIN Summary

**CANONICAL:**
- CLAIM_DEFS remains a scaffold (unchanged) — not canonical truth; CLM-20..24 entries remain as data definitions, their generators now return None when evidence absent.
- No canonical applicability rule invented. Patch enforces spec principle 2.5 ("No hardcoded client logic") from `evidence_vault_builder_spec.md`.
- Evidence-conditional rule: a signal claim has no output when `signal_by_id(sig_id)` returns None.

**CODE:**
- Modified: `scripts/psee/build_evidence_vault.py` only.
- Core change: `_gen_signal_claim()` returns `None` (not BLOCKED node) when signal not in registry.
- `collect_nodes()` loop skips None results — no claim file written when evidence absent.
- `gen_claim_index()` derives claim count from emitted claims, not from `len(CLAIM_DEFS)`.
- All 9 wikilink touch points made conditional on `m.total_signals > 0`.
- BlueEdge path preserved: when SIG-001..SIG-005 present in registry, all five claims generate identically to prior behavior.

**PRODUCT:**
- Second-client vault rebuild (STEP 10H-H) will produce 22 structural claims (CLM-01..CLM-19, CLM-25..CLM-27), 0 signal claims.
- Invalid existing vault at `clients/e65d2f0a-.../vaults/run_01_oss_fastapi/` untouched — remains draft-invalid pending STEP 10H-H.

**PUBLISH:**
- No signal, score, or confidence claims activated.
- Non-evidence-backed signal claims will not appear in rebuilt vault.

---

## Files Modified

| File | Change |
|------|--------|
| `scripts/psee/build_evidence_vault.py` | Evidence-conditional signal claim generation (see below) |

No other files modified. No runtime artifacts touched. No BlueEdge artifacts touched.

---

## Evidence-Conditional Rule

**Rule:** A signal claim node is emitted only when backing signal evidence exists in `signal_registry.json` for the given `sig_id`.

**Implementation:**

```
_gen_signal_claim(m, cid, label, sig_id)
  → m.signal_by_id(sig_id) is None → return None   (no claim file written)
  → m.signal_by_id(sig_id) found   → return claim content string
```

```
collect_nodes() claims loop:
  content = gen_fn(m)
  if content is not None:        ← evidence-conditional gate
      nodes.append(...)
```

```
gen_claim_index():
  for each CLAIM_DEFS entry:
      if gen_fn(m) is not None:  ← derives from emitted claims
          include in index
```

**Wikilink touch points (all gated on `m.total_signals > 0`):**

| Function | Conditional wikilinks |
|----------|-----------------------|
| `gen_vault_entry()` | CLM-20, CLM-21 navigation blocks |
| `gen_value_creation_path()` | CLM-21 Stage 4 key claims |
| `gen_ent_signals()` | CLM-20..CLM-24 Related Claims |
| `gen_art_05()` | CLM-20..CLM-24 Claims Grounded |
| `gen_trn_05()` | CLM-20..CLM-24 Claims Produced |
| `gen_client_lineage()` | CLM-21 Most significant finding; CLM-18–24 → CLM-18–19 |
| `gen_lens_admissibility()` | CLM-24 admissibility row |

---

## Confirmation: No Claim-ID Suppression

The patch does NOT use:
- `if cid in SIGNAL_CLAIM_IDS: skip`
- `if m.signal_emission_state == "NOT_EVALUATED": continue`
- Any hardcoded claim-ID set as a suppression gate

The patch uses only: `m.signal_by_id(sig_id) is None → return None` at the evidence boundary.
This generalizes correctly: a client with SIG-001..SIG-005 in their registry generates all five signal claims without code change.

---

## Confirmation: No Runtime Execution

- `build_evidence_vault.py` was NOT run.
- No vault was built or modified.
- No PSEE pipeline was executed.
- Invalid vault at `clients/e65d2f0a-.../vaults/run_01_oss_fastapi/` is untouched.

---

## Validation

```
python3 -m py_compile scripts/psee/build_evidence_vault.py  → COMPILE: OK
git diff --name-only                                          → scripts/psee/build_evidence_vault.py
grep -n "CLM-20" scripts/psee/build_evidence_vault.py       → all occurrences conditional or in generator scaffold
git status --short                                           → M scripts/psee/build_evidence_vault.py (+ untracked client artifacts)
```

All CLM-20 occurrences verified as either:
1. CLAIM_DEFS/CLAIM_GENERATORS scaffold entries — generators return None when evidence absent
2. Inside `gen_clm_20()` — calls `_gen_signal_claim` which returns None when SIG-001 absent
3. Conditional wikilink expressions gated on `m.total_signals > 0`

---

## Next Step: STEP 10H-H

Rebuild second-client vault using patched `build_evidence_vault.py`.

Expected result:
- Exit 0
- 22 claims (CLM-01..CLM-19, CLM-25..CLM-27)
- 0 signal claims (CLM-20..CLM-24 not present)
- 0 broken wikilinks
- No BlueEdge signal names in output
- `ls claims/ | grep CLM-2` returns only CLM-25..CLM-27
