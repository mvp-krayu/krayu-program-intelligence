# AMOps-Native Contract Checklist

> **Verify any future contract (template-based or custom) is AMOps-compliant.**

---

## Usage

Run this checklist against any stream contract before execution. Every G1/G2 contract MUST pass. G3 contracts must pass the G3-applicable subset.

---

## Universal Checks (All Classifications)

| # | Check | Required For | Present |
|---|---|---|---|
| 1 | Stream classification declared (G1/G2/G3) | ALL | [ ] |
| 2 | Classification reason stated | ALL | [ ] |
| 3 | CLAUDE.md load required | ALL | [ ] |
| 4 | git_structure_contract.md load required | ALL | [ ] |
| 5 | Branch authorization check present | ALL | [ ] |
| 6 | Fail-closed conditions listed | ALL | [ ] |
| 7 | CLOSURE.md format specified | ALL | [ ] |
| 8 | Return format specified (8-item block) | ALL | [ ] |

---

## G1-Specific Checks

| # | Check | Present |
|---|---|---|
| 9 | PIOS_CURRENT_CANONICAL_STATE.md in load list | [ ] |
| 10 | TERMINOLOGY_LOCK.md in load list | [ ] |
| 11 | Concept-specific vault pages in load list (or stated NOT REQUIRED) | [ ] |
| 12 | Full AMOps preflight block present | [ ] |
| 13 | Staleness check present | [ ] |
| 14 | Compatibility check present (terms, concepts, boundaries) | [ ] |
| 15 | Architecture Impact Declaration present (or stated NOT APPLICABLE) | [ ] |
| 16 | Mutation log requirement stated | [ ] |
| 17 | Mutation delta requirement stated | [ ] |
| 18 | Vault propagation requirement stated | [ ] |
| 19 | Vault propagation order specified | [ ] |
| 20 | CLOSURE Section 10 required | [ ] |
| 21 | Vault updates must be committed before closure | [ ] |
| 22 | Git lineage requirements stated (if applicable) | [ ] |

---

## G2-Specific Checks

| # | Check | Present |
|---|---|---|
| 9 | PIOS_CURRENT_CANONICAL_STATE.md in load list | [ ] |
| 10 | TERMINOLOGY_LOCK.md in load list | [ ] |
| 11 | Reduced AMOps preflight block present | [ ] |
| 12 | Staleness check present | [ ] |
| 13 | Reclassification watch stated | [ ] |
| 14 | Reclassification procedure described | [ ] |

---

## G3-Specific Checks

| # | Check | Present |
|---|---|---|
| 9 | Standard preflight block present | [ ] |
| 10 | Reclassification triggers described | [ ] |

---

## Specialized Template Checks

### Repair Contracts (additional)

| # | Check | Present |
|---|---|---|
| 23 | Drift classification present | [ ] |
| 24 | Severity stated | [ ] |
| 25 | Affected vault files listed | [ ] |
| 26 | Remediation authority stated | [ ] |
| 27 | Correction record format specified | [ ] |

### Promotion/Supersession Contracts (additional)

| # | Check | Present |
|---|---|---|
| 23 | Status transition declaration present | [ ] |
| 24 | Promotion criteria check present | [ ] |
| 25 | Authority check present | [ ] |
| 26 | Supersession chain documented (if applicable) | [ ] |
| 27 | Mandatory vault update list present | [ ] |

### Audit Contracts (additional)

| # | Check | Present |
|---|---|---|
| 23 | Audit scope defined | [ ] |
| 24 | Drift report format specified | [ ] |
| 25 | Correction scope defined | [ ] |
| 26 | VAULT_DRIFT_AUDIT skill referenced | [ ] |

### Emergency Recovery Contracts (additional)

| # | Check | Present |
|---|---|---|
| 23 | Failure context documented | [ ] |
| 24 | Blocked phase identified | [ ] |
| 25 | Recovery path specified | [ ] |
| 26 | Minimum safe restoration defined | [ ] |
| 27 | Governance escalation path defined | [ ] |
| 28 | Post-recovery verification specified | [ ] |

---

## Scoring

- **ALL universal checks must pass** — any failure makes the contract non-AMOps-native
- **ALL classification-specific checks must pass** — any failure requires contract amendment
- **Specialized checks apply only to their template type**

---

## What to Do If a Contract Fails

1. Identify which checks failed
2. Amend the contract to include missing elements
3. Re-run checklist
4. Do not begin execution until all applicable checks pass

---

## Cross-References

- [[README]] — template system overview
- [[CONTRACT_TEMPLATE_USAGE_DECISION_TREE]] — which template to use
- [[AMOPS_RUNTIME_ENFORCEMENT_MATRIX]] — what these checks enforce
- [[OPERATIONAL_BOOTSTRAP_ENTRYPOINT]] — the runtime entrypoint these checks validate
