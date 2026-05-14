# STEP 10H-F — Vault Builder Claim Applicability Fix Assessment

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10H-F
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## STEP 10H Failure Summary

**Trigger:** FAIL-STOP — CLM-20..CLM-24 present in vault output.

**Invalid vault path:**
`clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi/`

**Claim presence:**
| Claim | File | Status in vault | Correct behaviour |
|---|---|---|---|
| CLM-20 | `CLM-20 SIG-001 Sensor Bridge Throughput.md` | ACTIVE, BLOCKED | DEFERRED / OMITTED |
| CLM-21 | `CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions.md` | ACTIVE, BLOCKED | DEFERRED / OMITTED |
| CLM-22 | `CLM-22 SIG-003 Dependency Load 68 Percent.md` | ACTIVE, BLOCKED | DEFERRED / OMITTED |
| CLM-23 | `CLM-23 SIG-004 Structural Volatility Edge Density.md` | ACTIVE, BLOCKED | DEFERRED / OMITTED |
| CLM-24 | `CLM-24 SIG-005 Coordination Pressure Partial.md` | ACTIVE, BLOCKED | DEFERRED / OMITTED |

**No data contamination:** no SIG-006, no "blueedge" strings. Failure is claim
presence + incorrect metadata (`status: ACTIVE`, `lens_admissible: YES`), not
BlueEdge data leakage.

---

## CANONICAL Brain

**C1 authority scope:** BlueEdge vault is schema authority only. It is not
claim-count authority. Claim set for second-client is evidence-derived.

**Signal claim applicability rule:** CLM-20..CLM-24 are signal intelligence claims.
They require SIG-XXX entries from PiOS 40.5/41.4 execution. Signal layer for
second-client is `emission_state=NOT_EVALUATED` — PiOS 40.5/41.4 has not been
executed. These claims have no applicable evidence source.

**Conclusion:** CLM-20..CLM-24 are not evidence-applicable for this client/run.
They must not be generated when `emission_state=NOT_EVALUATED`.

---

## CODE Brain

### Exact generation path for CLM-20..CLM-24

**Step 1 — `CLAIM_DEFS` (lines 496–500):**
```python
("CLM-20", "SIG-001 Sensor Bridge Throughput", "signal"),
("CLM-21", "SIG-002 Platform Runtime State Seven Unknown Dimensions", "signal"),
("CLM-22", "SIG-003 Dependency Load 68 Percent", "signal"),
("CLM-23", "SIG-004 Structural Volatility Edge Density", "signal"),
("CLM-24", "SIG-005 Coordination Pressure Partial", "signal"),
```
Hardcoded BlueEdge signal names embedded in the global definition list.

**Step 2 — `CLAIM_GENERATORS` (lines 1814–1815):**
```python
"CLM-20": gen_clm_20, "CLM-21": gen_clm_21,
"CLM-22": gen_clm_22, "CLM-23": gen_clm_23, "CLM-24": gen_clm_24,
```
All five wired into the unconditional generator dispatch table.

**Step 3 — `build_vault_nodes()` loop (lines 2547–2552):**
```python
for cid, label, _ in CLAIM_DEFS:
    filename = f"{cid} {label}.md"
    gen_fn = CLAIM_GENERATORS.get(cid)
    if gen_fn:
        nodes.append((f"claims/{filename}", gen_fn(m)))
```
No suppression gate. Iterates ALL `CLAIM_DEFS` unconditionally.

**Step 4 — `gen_clm_20..gen_clm_24` (lines 1624–1671):**
Each calls `_gen_signal_claim(m, cid, label, sig_id)`. When signal not found in
registry, `_gen_signal_claim` returns a BLOCKED node with `status: ACTIVE` and
`lens_admissible: YES` (inherited from `_claim_fm()`). There is no NOT_EVALUATED
path — only FOUND or BLOCKED.

### Suppression gate (does not exist today)

`VaultModel` does not store `emission_state` from `signal_registry.json`.
`build_vault_model()` reads `signals_raw["total_signals"]` and `signals_raw.get("signals", [])`
but does not read or store `signals_raw.get("emission_state")`. No field on
`VaultModel` carries signal layer evaluation state. `total_signals == 0` is a
reliable proxy but is semantically weaker than `emission_state == "NOT_EVALUATED"`.

### Wikilink scope

If CLM-20..CLM-24 claim files are suppressed, the wikilink validator will fail
unless all references to those claims in other nodes are also suppressed.

**All functions containing CLM-20..CLM-24 wikilinks (confirmed via code inspection):**

| Function | Location | Wikilinks |
|---|---|---|
| `build_vault_nodes()` loop | line 2548 | generates claim files |
| `gen_claim_index()` | line 509–510 | iterates ALL `CLAIM_DEFS` → includes CLM-20..CLM-24 rows |
| `gen_vault_entry()` | lines 424, 427, 441 | `[[CLM-21...]]`, `[[CLM-20...]]` (2 blocks) |
| `gen_ent_signals()` | line 1932 | `[[CLM-20]]..[[CLM-24]]` wikilinks |
| `gen_art_05()` | line 2124 | `[[CLM-20]]..[[CLM-24]]` wikilinks |
| `gen_trn_05()` | line 2291 | `[[CLM-20]]..[[CLM-24]]` wikilinks |
| `gen_client_lineage()` / value creation path | line 709 | `[[CLM-21...]]` |
| `gen_lens_admissibility()` | line 2516 | `CLM-24 SIG-005` row |
| `gen_known_gaps()` | line 2339 | `CLM-18–24` reference |

**Total touch points: 9 functions + 1 new VaultModel field.**

### Minimal targeted fix (Option A — full specification)

**Gate field:** Add `signal_emission_state: str = "UNKNOWN"` to `VaultModel` dataclass.
Populate in `build_vault_model()`: `signal_emission_state=signals_raw.get("emission_state", "UNKNOWN")`.

**Suppression constant:** Define `SIGNAL_CLAIM_IDS = frozenset({"CLM-20", "CLM-21", "CLM-22", "CLM-23", "CLM-24"})`.

**Touch point 1 — `build_vault_nodes()` loop (line 2547):**
```python
for cid, label, _ in CLAIM_DEFS:
    if cid in SIGNAL_CLAIM_IDS and m.signal_emission_state == "NOT_EVALUATED":
        continue
    filename = f"{cid} {label}.md"
    gen_fn = CLAIM_GENERATORS.get(cid)
    if gen_fn:
        nodes.append((f"claims/{filename}", gen_fn(m)))
```

**Touch point 2 — `gen_claim_index()` (line 509):**
```python
for cid, label, _ in CLAIM_DEFS:
    if cid in SIGNAL_CLAIM_IDS and m.signal_emission_state == "NOT_EVALUATED":
        continue
    rows.append(f"| [[{cid} {label}]] | FULL | ACTIVE |")
```

**Touch point 3 — `gen_vault_entry()` (lines 423–441):**
Wrap the three signal-navigation blocks in `if m.signal_emission_state != "NOT_EVALUATED":`.
Replace with a single deferred note:
```
**Signal layer:** NOT_EVALUATED — signal intelligence claims deferred pending PiOS 40.5/41.4 execution.
```

**Touch points 4–6 — `gen_ent_signals()`, `gen_art_05()`, `gen_trn_05()` (lines 1932, 2124, 2291):**
In each, conditionally omit the `[[CLM-20]]..[[CLM-24]]` wikilinks when NOT_EVALUATED.
Replace with: `Signal claims CLM-20..CLM-24: DEFERRED (emission_state=NOT_EVALUATED)`

**Touch point 7 — `gen_client_lineage()` / value creation path (line 709):**
Conditionally omit `[[CLM-21...]]` reference when NOT_EVALUATED.

**Touch point 8 — `gen_lens_admissibility()` (line 2516):**
Conditionally omit the CLM-24 signal row table entry when NOT_EVALUATED.

**Touch point 9 — `gen_known_gaps()` (line 2339):**
Update `CLM-18–24` reference to `CLM-18–19` when NOT_EVALUATED (signal intelligence
not evaluated is noted, not listed as a gap in the signal claims table).

**Backward compatibility:** All changes are gated on `m.signal_emission_state == "NOT_EVALUATED"`.
BlueEdge has `emission_state` absent or non-NOT_EVALUATED — all existing behavior preserved.
No default changes to existing claim generation.

**Change count:** 1 new field + 1 assignment + 9 conditional blocks across 9 functions.
No new functions. No schema changes. No test breakage on BlueEdge path.

---

## Options Considered

### Option A — Script modification (selected)

Modify `build_evidence_vault.py` to suppress CLM-20..CLM-24 and their wikilinks
when `signal_emission_state == "NOT_EVALUATED"`.

- Pros: Clean, permanent, backward-compatible, vault validator passes, correct semantics
- Cons: Requires script modification authorization; 9 touch points across one file
- Risk: Low — all changes are additive conditional blocks; existing BlueEdge path untouched
- Authorization needed: YES — "DO NOT modify scripts" constraint in STEP 10H must be lifted

### Option B — Post-build output cleanup

Delete 5 BLOCKED claim files from vault output after builder runs.

- Pros: No script change required
- Cons: Wikilink validator would fail (9 other nodes reference deleted claims);
  requires also patching wikilinks in 8 other vault files; vault re-validation needed;
  this is more complex and fragile than Option A; must be redone on every vault rebuild
- Risk: Moderate — vault wikilink integrity violated unless all references also removed
- Authorization needed: NO for file deletion; but effectively more work than Option A

### Option B rejected

Option B requires either: (1) disabling the wikilink validator, or (2) editing 8 vault
output files to remove CLM-20..CLM-24 references. Both are more invasive than Option A.
And neither is durable — the next vault build would reproduce the same state.

---

## PRODUCT Brain

The invalid vault at `clients/e65d2f0a-.../vaults/run_01_oss_fastapi/` is NOT accepted
as a Tier-2 binding artifact. Its structural content (CLM-01..CLM-19, CLM-25..CLM-27)
is evidence-accurate, but the vault as a whole fails the FAIL-STOP condition.

A valid second-client vault requires:
- Evidence-derived claims only (structural layer: CLM-01..CLM-19, CLM-25..CLM-27)
- Signal claims CLM-20..CLM-24 absent when NOT_EVALUATED
- `status: ACTIVE` only on claims with verified evidence backing
- Wikilink integrity (no broken links)

The fix produces exactly this: 22 structural claims, 0 signal claims, all wikilinks
resolve against the suppressed claim set.

---

## PUBLISH Brain

No signal claims activated. No score/confidence/signal claims promoted from the
invalid vault. The FAIL-STOP prevents any external use of vault content.

After fix:
- Score claims (CLM-09..CLM-12): ALLOWED post-validation
- Topology claims (CLM-14..CLM-16): ALLOWED post-validation
- Execution layer (CLM-13 NOT_EVALUATED): ALLOWED post-validation
- Signal claims: DEFERRED — no external expression until PiOS 40.5/41.4 executed

---

## Selected Remediation Path

**Option A — Targeted script modification of `build_evidence_vault.py`**

**Authorization required:** Script modification in next chunk (STEP 10H-G).

**Exact specification:**
1. Add `signal_emission_state: str = "UNKNOWN"` to `VaultModel` (after `has_admissibility`)
2. Populate in `build_vault_model()`: `signal_emission_state=signals_raw.get("emission_state", "UNKNOWN")`
3. Define `SIGNAL_CLAIM_IDS = frozenset({"CLM-20", "CLM-21", "CLM-22", "CLM-23", "CLM-24"})` near `CLAIM_GENERATORS`
4. `build_vault_nodes()` loop: skip SIGNAL_CLAIM_IDS when NOT_EVALUATED
5. `gen_claim_index()`: skip SIGNAL_CLAIM_IDS rows when NOT_EVALUATED
6. `gen_vault_entry()`: replace signal navigation blocks with deferred note when NOT_EVALUATED
7. `gen_ent_signals()`: conditional wikilink omission
8. `gen_art_05()`: conditional wikilink omission
9. `gen_trn_05()`: conditional wikilink omission
10. `gen_client_lineage()`: conditional CLM-21 omission
11. `gen_lens_admissibility()`: conditional CLM-24 row omission

**Post-fix verification:**
- Rebuild vault (vault builder exit 0)
- `ls claims/ | grep CLM-2` → returns only CLM-25..CLM-27 (no CLM-20..CLM-24)
- `[Validate] All wikilinks resolve — OK`
- Contamination checks pass
- Claim count: 22 (evidence-derived)

---

## Next Step Recommendation

**STEP 10H-G — Implement vault builder claim applicability fix**

Authorized scope: modify `build_evidence_vault.py` only, per the 11-point
specification above. No other scripts. No pipeline re-execution.

After STEP 10H-G, STEP 10H is re-run (vault rebuild) to produce a valid artifact.

---

## STEP 10H-F Status

**COMPLETE** — root cause identified; full touch point scope mapped (9 functions +
1 VaultModel field); Option A selected; specification ready for STEP 10H-G.
