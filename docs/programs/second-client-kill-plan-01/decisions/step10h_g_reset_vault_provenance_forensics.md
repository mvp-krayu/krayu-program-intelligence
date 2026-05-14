# STEP 10H-G-RESET — BlueEdge Vault Provenance + Claim Applicability Forensics

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10H-G-RESET
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Status

**COMPLETE — CANONICAL GAP DECLARED on claim applicability rule.**
**Patch authorized as spec repair (evidence-conditional generation), not as canonical rule application.**

---

## Pre-flight confirmation

```
git branch --show-current → work/psee-runtime
git status --short → ?? clients/e65d2f0a-.../psee/ ?? clients/e65d2f0a-.../vaults/
```
No tracked files modified. Invalid vault exists untracked at
`clients/e65d2f0a-.../vaults/run_01_oss_fastapi/` — untouched per contract.

---

## 1. BlueEdge Vault Provenance

**Built by:** `scripts/psee/build_evidence_vault.py`
**Stream:** `PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01`
**Execution log:** `docs/psee/PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01/EXECUTION_LOG.md`
**Test invocation:**
```
python3 scripts/psee/build_evidence_vault.py \
  --client blueedge \
  --run run_authoritative_recomputed_01 \
  --output-dir clients/blueedge/vaults/run_01_authoritative_generated \
  --client-name "BlueEdge Fleet Management Platform"
```
**Result:** 57 nodes, 27 claims, 0 broken wikilinks, exit 0.

**Source artifacts (BlueEdge run_authoritative_recomputed_01):**

| Artifact | Fields consumed |
|---|---|
| `gauge_state.json` | state, dimensions DIM-01..06, score, confidence |
| `coverage_state.json` | schema validation (values from gauge_state.json) |
| `reconstruction_state.json` | axis_results, state, validated_units |
| `canonical_topology.json` | counts, domains[] |
| `signal_registry.json` | total_signals=5, signals[SIG-001..SIG-005] |
| `admissibility_log.json` | NOT FOUND — unit count from DIM-01 |
| `binding_envelope.json` | NOT SPECIFIED for this invocation |

**Reference vault:** `clients/blueedge/vaults/run_01_authoritative/`
— identical structure, 57 files, 27 claims — the hand-built reference that the generator was designed to replicate.

**Claim source:** All 27 claims were generated from BlueEdge artifact values. The BlueEdge reference vault has no BLOCKED signal claims — SIG-001..SIG-005 all exist in its signal_registry.json with full four-layer chains.

---

## 2. CLAIM_DEFS Status

**Finding: HARDCODED IMPLEMENTATION SCAFFOLD**

`CLAIM_DEFS` at `scripts/psee/build_evidence_vault.py` line 476 is a static Python list:
```python
CLAIM_DEFS = [
    ("CLM-01", "Structural Coverage Completeness", "metric"),
    ...
    ("CLM-20", "SIG-001 Sensor Bridge Throughput", "signal"),
    ("CLM-21", "SIG-002 Platform Runtime State Seven Unknown Dimensions", "signal"),
    ("CLM-22", "SIG-003 Dependency Load 68 Percent", "signal"),
    ("CLM-23", "SIG-004 Structural Volatility Edge Density", "signal"),
    ("CLM-24", "SIG-005 Coordination Pressure Partial", "signal"),
    ...
]
```

This is:
- NOT generated from a canonical data file at runtime
- NOT parameterized by client or signal registry content
- NOT derived from `docs/psee/` at build time
- A hardcoded BlueEdge-specific scaffold

The signal names ("SIG-001 Sensor Bridge Throughput", etc.) are BlueEdge signal titles
copied from `docs/pios/40.5/signal_output_set.md`. They appear in three places:
1. `CLAIM_DEFS` list entries (lines 496–500)
2. `gen_clm_20..gen_clm_24` generator functions (lines 1624–1671)
3. Multiple wikilink strings throughout navigation and entity nodes

**Canonical reference for the claim inventory:**
`docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/gauge_lens_claim_inventory_spec.md`
— forensic inventory of all 27 claims extracted from GAUGE rendering surfaces for BlueEdge.
This document enumerates BlueEdge-specific values for all claims. It is a forensic record, not
a multi-client applicability specification.

**Vault builder spec governing claim count:**
`docs/psee/PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01/evidence_vault_builder_spec.md` Section 6:
> "All 27 claims are generated."

This is the authoritative spec statement. It contains no conditional logic.

---

## 3. Claim Applicability

**Existing rule found: NO**

There is no document in:
- `docs/psee/`
- `docs/pios/`
- `docs/programs/second-client-kill-plan-01/decisions/`

that defines a claim applicability rule for CLM-20..CLM-24 under any condition.

**CANONICAL GAP declared:**
No canonical rule exists specifying that CLM-20..CLM-24 should be suppressed, deferred,
or omitted when `emission_state=NOT_EVALUATED`. The prior decisions (STEP 10H-F, STEP 10H-G)
that framed "CLM-20..CLM-24 MUST NOT be generated" derived this from governance principles
stated in execution contracts — not from a pre-existing canonical document.

**What the canonical spec DOES say:**

From `evidence_vault_builder_spec.md` Section 2, Constraint 5:
> "**No hardcoded client logic:** Template functions receive a `VaultModel` — no BlueEdge-specific
> constants appear outside the data model build."

This principle is **violated** by the current implementation: the signal claim labels in
`CLAIM_DEFS` and `gen_clm_20..gen_clm_24` are BlueEdge-specific strings hardcoded in the
generator, not derived from the VaultModel (which itself derives from signal_registry.json).

**The internal contradiction in the spec:**
- Section 2.5: "No hardcoded client logic" — PRINCIPLE
- Section 6: "All 27 claims are generated" — IMPLEMENTATION STATEMENT

These conflict in the multi-client scenario. The principle is the governing constraint;
the "27 claims" statement describes the BlueEdge execution, not a universal law.

---

## 4. CANONICAL Brain

**C1 (BlueEdge vault):** Schema authority only. The BlueEdge vault is the reference
instance for the V3.01 schema structure, node types, frontmatter fields, and section layout.
It is NOT a claim-count template for other clients.

**C1 provenance confirmed:** Built by `PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01` from
BlueEdge artifacts. The vault structure is an artifact of a script run against specific
inputs, not a universal template.

**Claim applicability:** CANONICAL GAP. No rule found. The previous session-level
governance contracts created this rule; it did not pre-exist in the repo.

**Spec principle support for patch:** YES. The "no hardcoded client logic" principle
(Section 2.5 of builder spec) directly supports making signal claims data-driven rather
than BlueEdge-name-hardcoded. The patch should be framed as enforcing this principle.

---

## 5. CODE Brain

**CLAIM_DEFS:** Hardcoded scaffold at line 476. CLM-20..CLM-24 entries carry BlueEdge
signal names that will never be valid for any other client.

**Signal claim generation path:**
```
CLAIM_DEFS[CLM-20..24] → collect_nodes() loop → gen_clm_20(m)..gen_clm_24(m)
  → _gen_signal_claim(m, cid, label, sig_id)
     → m.signal_by_id(sig_id)  ← checks VaultModel.signals list
        → if None → returns BLOCKED node (current behavior)
        → if found → returns full signal claim
```

**Key observation:** `m.signal_by_id(sig_id)` is already called inside `gen_clm_20..gen_clm_24`.
The signal existence check already exists — it currently routes to BLOCKED, not omit.

**Correct evidence-first behavior:**
A claim that derives its content from a specific named signal record (SIG-001, SIG-002, etc.)
has no source data when that record is absent. The evidence-first principle mandates:
no evidence → no output. The BLOCKED node is NOT compliant with this principle — it produces
output (a claim node file) without evidence.

The correct behavior when `m.signal_by_id("SIG-001")` returns None is: no node generated.
Not BLOCKED, not DEFERRED — no node. This is not claim-ID suppression; it is
evidence-conditional node generation.

**Distinction from hardcoded CLM suppression:**
- Hardcoded suppression: `if cid in {"CLM-20", ...}: skip` — wrong approach
- Evidence-conditional: `if m.signal_by_id(sig_id) is None: return None` in the generator,
  and `collect_nodes()` skips None-valued nodes — correct approach

This approach generalizes: any future client with a full SIG-001..SIG-005 registry will
automatically generate all five claims without code change.

---

## 6. Second-Client Vault Status

**Invalid vault path:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/vaults/run_01_oss_fastapi/`

**Why invalid:** CLM-20..CLM-24 present as BLOCKED nodes carrying BlueEdge signal names
(`claim_label: "SIG-001 Sensor Bridge Throughput"`, etc.) with `status: ACTIVE` and
`lens_admissible: YES`. These are incorrect because no signal source data exists for
second-client.

**Whether generated claims came from canonical rule or unconditional implementation:**
UNCONDITIONAL IMPLEMENTATION. The builder iterates `CLAIM_DEFS` without checking
whether source data exists for each claim. CLM-20..CLM-24 were generated because the loop
is unconditional — not because a canonical rule requires them.

---

## 7. PRODUCT Brain

**Second-client vault build under existing product contract:**
The vault builder was designed for "any client and any run" (evidence_vault_builder_spec.md
Section 1). However, it was only tested and validated against BlueEdge. The second-client
invocation revealed a gap: the builder does not handle absent signal data correctly.

**"Working vault" product mode:**
A vault with structural claims but no signal claims (CLM-20..CLM-24 absent) is a NEW PRODUCT
MODE not explicitly addressed by existing documents. It represents a structural-only assessment
vault. This mode is:
- Supported by the evidence-first principle (claims derive from evidence, no evidence = no claim)
- Not explicitly contracted in any existing product contract
- A natural extension of the vault model, not a contradiction of it

**Tier-2 status:** The invalid vault is NOT accepted as a Tier-2 binding artifact.
A valid vault with evidence-conditional signal claim generation is required.

---

## 8. PUBLISH Brain

No claim activation allowed until:
1. Patch implemented and vault rebuilt
2. Claim provenance and applicability documented
3. Vault validated (exit 0, no broken links, no BlueEdge signal names in second-client vault)

No score, confidence, or signal claims activated from either the invalid vault or any prior
source. This status unchanged from prior steps.

---

## 9. Decision

**Vault-builder patch: ALLOWED**

**Authorizing basis:**
1. `evidence_vault_builder_spec.md` Section 2.5: "No hardcoded client logic" — current
   CLM-20..CLM-24 generators violate this by hardcoding BlueEdge signal names
2. Evidence First principle: no source data → no claim node
3. The patch enforces evidence-conditional generation, not hardcoded CLM-ID suppression
4. This is a spec repair, not a new canonical rule application

**Exact canonical rule supporting patch:**
`evidence_vault_builder_spec.md` Section 2.5 ("No hardcoded client logic") + Evidence First
principle (no evidence → no output). Together: signal claims must derive from source data in
VaultModel; absent source data → no claim generated.

**Patch approach (corrected from STEP 10H-F):**
NOT: `if cid in SIGNAL_CLAIM_IDS and m.signal_emission_state == "NOT_EVALUATED": continue`
YES: `gen_clm_20..gen_clm_24` return `None` when `m.signal_by_id(sig_id)` is None;
`collect_nodes()` skips None entries.

This is evidence-conditional generation, not hardcoded claim suppression. It generalizes
correctly: a client with valid SIG-001..SIG-005 entries generates all five claims.

**Wikilink scope:**
When `gen_clm_20..24` return None, the wikilink validator will fail unless references to
those claims in other nodes are also made conditional. The set of affected nodes is
as documented in STEP 10H-F (9 functions). These must also be made evidence-conditional
(conditional on `m.total_signals > 0` or `len(m.signals) > 0`).

---

## 10. Next Recommendation

**STEP 10H-G (re-chartered):** Implement vault builder signal claim patch.

**Authorized scope:** `scripts/psee/build_evidence_vault.py` only.
**Approach:** Evidence-conditional generation, not hardcoded CLM suppression.
**Spec amendment:** `docs/psee/PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01/evidence_vault_builder_spec.md`
Section 6 must be updated to reflect that signal claims (CLM-20..CLM-24) are generated only
when signal source data is present in VaultModel.

**Not required:** New canonical applicability rule document. The spec repair + evidence-first
principle is sufficient.

---

## Appendix — Decision Trace Lineage

Prior decisions superseded or corrected by this chunk:

| Decision | Prior position | Corrected position |
|---|---|---|
| STEP 10H-F Option A spec | Suppression via `signal_emission_state == NOT_EVALUATED` gate | Evidence-conditional via `signal_by_id() is None` check |
| STEP 10H-F G1 | "No canonical rule exists, patch introduces new rule" | Spec principle 2.5 provides authorizing basis; patch is spec repair |
| STEP 10H-R claim count | Framed CLM-20..CLM-24 as "DEFERRED" state nodes | Correct: not generated at all; BLOCKED state is non-compliant with evidence-first |
