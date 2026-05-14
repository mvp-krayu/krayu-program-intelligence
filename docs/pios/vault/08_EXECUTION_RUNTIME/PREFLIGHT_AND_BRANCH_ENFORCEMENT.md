# Pre-flight and Branch Enforcement

> **How execution is validated before it begins.**

---

## Pre-flight Protocol

Before any execution, Claude MUST verify:

1. **Branch correct** — current branch authorized for planned work
2. **Inputs present** — all contract-specified inputs available
3. **Dependencies complete** — prior streams referenced in contract are closed
4. **Validators present** — relevant validation scripts exist

If any check fails → FAIL CLOSED.

## Branch-Domain Authorization

Authorized branch domains are defined in git_structure_contract.md:

| Branch | Authorized Layers | Authorized Streams |
|---|---|---|
| main | Stable integrated baseline | None (no direct commits except governance roots) |
| feature/pios-core | L1-L4 | 40.x, 41.x |
| feature/activation | L5 | 43.x, 44.x |
| feature/runtime-demo | L6-L7 | 42.x, 51.x |
| feature/governance | L8 | docs/governance/** |
| work/* | Documentation, operational work | Per-contract scope |

## Enforcement Mechanism

1. Read git_structure_contract.md
2. Identify current branch
3. Identify planned changes (files, layers, streams)
4. Verify all changes fall within authorized domain
5. If mismatch → STOP → report violation

## Cross-References

- [[CLAUDE_LOAD_REQUIREMENTS]] — what to load
- [[STREAM_START_PROTOCOL]] — full start sequence
- [[../01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL]] — layer definitions
