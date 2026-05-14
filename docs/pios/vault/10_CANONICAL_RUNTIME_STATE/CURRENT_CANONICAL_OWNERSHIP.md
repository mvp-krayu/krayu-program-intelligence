# Current Canonical Ownership

> **Who owns what at each layer — from git_structure_contract.md.**

---

## Layer Ownership

| Layer | Name | Branch Owner | Stream Range |
|---|---|---|---|
| L0 | External Evidence Source | (external) | N/A |
| L1 | Ingestion | feature/pios-core | 40.2-40.4 |
| L2 | Evidence Navigation | feature/pios-core | 40.x |
| L3 | Derivation | feature/pios-core | 40.x, 41.x |
| L4 | Semantic Shaping | feature/pios-core | 41.x |
| L5 | Presentation Assembly | feature/activation | 43.x, 44.x |
| L6 | Runtime Experience | feature/runtime-demo | 42.x |
| L7 | Demo/Narrative | feature/runtime-demo | 51.x |
| L8 | Governance/Validation | feature/governance | docs/governance/** |

## Ownership Rules (from git_structure_contract.md)

1. Layer ownership is fixed
2. No downstream layer may absorb upstream computation
3. No upstream layer may absorb downstream presentation
4. Branch "Must not" rules are enforced via pre-flight

## Current Operational Exception

Work branches (`work/*`) operate under per-contract scope authorization. They may touch multiple layers when the stream contract explicitly authorizes it. This is governed by the contract, not the branch name.

## Cross-References

- [[CURRENT_CANONICAL_BRANCHES]] — branch inventory
- [[CURRENT_CANONICAL_BOUNDARIES]] — boundary rules
- [[../01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL]] — layer definitions
