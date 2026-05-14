# Current Canonical Branches

> **Active branches and their authorized domains.**

---

## Primary Branches

| Branch | Role | Authorized Layers |
|---|---|---|
| main | Stable integrated baseline | None (governance roots only) |
| feature/pios-core | PiOS Core authority | L1-L4 (40.x, 41.x) |
| feature/activation | Activation authority | L5 (43.x, 44.x) |
| feature/runtime-demo | Runtime/Demo authority | L6-L7 (42.x, 51.x) |
| feature/governance | Governance authority | L8 (docs/governance/**) |

## Work Branches (Active)

| Branch | Purpose | Current Status |
|---|---|---|
| work/semantic-qualification-loop | SQO + LENS v2 operational development | ACTIVE (current) |
| work/lens-v2-productization | LENS v2 productization | ACTIVE |
| work/ig-foundation | IG foundation work | UNKNOWN |
| work/ig-runtime-handoff | IG runtime handoff | UNKNOWN |
| work/psee-runtime | PSEE runtime (non-canonical — see [[../12_ARCHIVE/FAILED_ARCHITECTURAL_PATHS]]) | FLAGGED |

## Brain Branches

| Branch | Domain | Purpose |
|---|---|---|
| brain/canonical | CANONICAL brain | Truth, evidence, existence |
| brain/product | PRODUCT brain | Exposed surfaces, allowed/forbidden outputs |
| brain/publish | PUBLISH brain | External expression boundaries |
| brain/code | CODE brain | Implementation reality |

## Baseline Branches

| Branch | Frozen State |
|---|---|
| baseline/demo-execlens-v1-final | Final ExecLens demo state |
| baseline/governance-v1-final | Final v1 governance |
| baseline/lens-vnext | LENS next baseline |
| baseline/pios-core-v0.4-final | PiOS Core v0.4 final |

## Branch-Domain Violations

See [[../01_FOUNDATIONAL_GOVERNANCE/DRIFT_AND_REMEDIATION]] for violation handling.

Known violation: `work/psee-runtime` is outside authorized branch set (documented in memory: feedback_branch_violation.md).

## Cross-References

- [[CURRENT_CANONICAL_OWNERSHIP]] — layer ownership per branch
- [[../08_EXECUTION_RUNTIME/PREFLIGHT_AND_BRANCH_ENFORCEMENT]] — enforcement protocol
