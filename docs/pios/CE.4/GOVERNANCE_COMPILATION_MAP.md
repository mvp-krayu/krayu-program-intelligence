# CE.4 → Governance Compilation Map

**Stream:** CE.4 → Governance Compilation
**Date:** 2026-04-03
**Status:** BLOCKED — branch switch failed

---

## COMPILATION STATUS

**BLOCKED at STEP 1 — Branch Verification.**

Branch switch to `feature/i6-i7-canonical-authority` failed.
Canonical compilation has not begun.
No files were written to the canonical authority branch.

---

## BLOCKING CONDITION

```
Starting branch: ce2-v0.2-baseline

git checkout feature/i6-i7-canonical-authority

error: The following untracked working tree files would be overwritten by checkout:
  docs/pios/contracts/A.5B/control_shadow_mismatch_register.md
  docs/pios/contracts/A.5B/control_shadow_trace_log.md
  docs/pios/contracts/A.5B/control_shadow_validation_plan.md
  docs/pios/contracts/A.5B/control_shadow_validation_summary.md
  docs/pios/contracts/A.5C/control_shadow_remediation_record.md
  docs/pios/contracts/A.6/control_authority_switch_record.md
  docs/pios/contracts/A.7/projection_purification_record.md
Aborting
```

These 7 files are untracked on `ce2-v0.2-baseline` but tracked on
`feature/i6-i7-canonical-authority`. Git refuses to overwrite them without explicit
operator resolution.

No destructive action was taken. Files are intact.

---

## FULL WORKING TREE STATE AT BLOCK

Untracked on ce2-v0.2-baseline:

```
docs/governance/runtime/
docs/pios/CE.3/
docs/pios/CE.4/
docs/pios/contracts/40.16/
docs/pios/contracts/A.5B/     ← blocking (7 files)
docs/pios/contracts/A.5C/     ← blocking
docs/pios/contracts/A.6/      ← blocking
docs/pios/contracts/A.7/      ← blocking
app/execlens-demo/.env
```

Note: `docs/pios/CE.3/` and `docs/pios/CE.4/` are NOT in the blocking list.
They are untracked on ce2-v0.2-baseline and do not exist in feature/i6-i7-canonical-authority.
They would survive a checkout (git would leave them in place as untracked in the new branch).

---

## OPERATOR RESOLUTION OPTIONS

The following resolutions are available. Claude did not execute any of them.
Operator must choose.

**Option A — Commit A.5B/A.5C/A.6/A.7 files to ce2-v0.2-baseline first:**
If these files belong in the ce2-v0.2-baseline branch, stage and commit them before
switching. The checkout will then succeed because the files will be tracked and no
overwrite conflict exists.

**Option B — Remove the conflicting untracked files:**
If the local untracked versions are identical to the versions in feature/i6-i7-canonical-authority
(or are superseded by them), the untracked files can be deleted before checkout.
This is destructive — verify content first.

**Option C — Stash untracked files:**
`git stash -u` stashes untracked files. After checkout, `git stash pop` restores them.
This is safe only if the restored files do not conflict with feature/i6-i7-canonical-authority content.

---

## SOURCE AUTHORITY — VERIFIED ACCESSIBLE

CE.4 source files exist and are accessible:

```
docs/pios/CE.4/CE.4_FINAL_GOVERNANCE_STATE.md        EXISTS
docs/pios/CE.4/signal_emission_contract_specification.md  EXISTS
docs/pios/CE.4/signal_computability_governance.md        EXISTS
docs/pios/CE.4/dependency_propagation_rules.md           EXISTS
docs/pios/CE.4/signal_ledger_specification.md            EXISTS
docs/pios/CE.4/documentation_alignment_rule.md           EXISTS
docs/pios/CE.4/CE.4_DECISION.md                          EXISTS
```

CE.4 source authority is intact. It can be compiled once the branch switch is resolved.

---

## PLANNED COMPILATION MAP (PENDING BRANCH RESOLUTION)

Once the branch switch is resolved, compilation will proceed as:

### Architecture targets (primary)

| CE.4 doctrine | Target location | Action |
|---|---|---|
| 40.5 as governed layer | docs/governance/architecture/ | Create or update |
| Signal Emission Contract | docs/governance/architecture/ | Create or update |
| Signal Ledger authority model | docs/governance/architecture/ | Create or update |
| Computability doctrine | docs/governance/architecture/ | Create or update |
| Emission state doctrine | docs/governance/architecture/ | Create or update |
| Dependency propagation boundary | docs/governance/architecture/ | Create or update |
| Downstream invariants for 40.6+ | docs/governance/architecture/ | Create or update |
| PiOS v0.3 boundary statement | docs/governance/architecture/ | Create or update |

Exact file targets depend on the existing canonical architecture structure,
which will be verified at STEP 2 after branch switch succeeds.

### Derivative targets (selective, pending evaluation)

Candidates to evaluate for derivative projection:
- Signal Emission Contract
- Signal Ledger
- Governed Signal Semantics
- BLOCKED State Governance
- PARTIAL State Governance
- Signal Failure Taxonomy

Projection decisions deferred until branch switch succeeds and STEP 2 verification completes.

---

## STATUS

```
Branch verification:      BLOCKED
Branch switch:            FAILED (untracked file conflict)
Target structure verify:  NOT EXECUTED
Source load:              ACCESSIBLE (not loaded into canonical branch)
Architecture compilation: NOT STARTED
Derivative evaluation:    NOT STARTED
Receipt:                  ISSUED (see GOVERNANCE_COMPILATION_RECEIPT.md)
```
