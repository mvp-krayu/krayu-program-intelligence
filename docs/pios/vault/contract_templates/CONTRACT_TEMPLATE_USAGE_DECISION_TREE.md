# Contract Template Usage Decision Tree

> **Quick decision tree for choosing the correct template.**

---

## Decision Tree

```
START: What is this stream doing?
│
├─ Fixing a vault defect (stale state, broken links, missing propagation)?
│   └─ YES → GOVERNANCE_REPAIR_CONTRACT_TEMPLATE
│
├─ Promoting, demoting, superseding, or deprecating a concept?
│   └─ YES → CANONICAL_PROMOTION_AND_SUPERSESSION_CONTRACT_TEMPLATE
│
├─ Running a periodic vault health check?
│   └─ YES → VAULT_SYNC_AND_DRIFT_AUDIT_CONTRACT_TEMPLATE
│
├─ Recovering from a fail-closed enforcement block?
│   └─ YES → EMERGENCY_FAIL_CLOSED_RECOVERY_CONTRACT_TEMPLATE
│
├─ Does it touch architecture at all?
│   ├─ NO → G3_STANDARD_EXECUTION_CONTRACT_TEMPLATE
│   │
│   └─ YES → Does it change architecture?
│       ├─ NO (uses but doesn't change) → G2_ARCHITECTURE_CONSUMPTION_CONTRACT_TEMPLATE
│       │
│       └─ YES (introduces, modifies, deprecates, supersedes) →
│           G1_ARCHITECTURE_MUTATION_CONTRACT_TEMPLATE
```

---

## Quick Classification Signals

### Definite G1

- Contract says "create," "introduce," "define," "deprecate," "supersede," "rename," or "restructure" applied to an architectural concept
- Contract modifies CLAUDE.md, SKILLS.md, vault content, or AMOps protocols
- Contract changes terminology definitions
- Contract changes layer ownership or branch domains
- Contract creates new runtime surfaces

### Definite G2

- Contract says "implement," "extend," "add feature," "fix bug" within existing architecture
- Contract uses SQO, PATH A/B, LENS, corridors, overlays without changing their definitions
- Contract adds UI components to existing surfaces
- Contract implements existing extraction or rendering patterns

### Definite G3

- CSS-only changes
- Test additions for existing behavior
- Documentation rewording without semantic change
- Dependency updates
- Build configuration changes

### Definite Repair

- "Fix stale canonical state"
- "Repair broken wiki-links"
- "Complete missed propagation from stream X"
- "Correct drift detected in audit"

### Definite Promotion/Supersession

- "Promote X to CANONICAL"
- "Supersede X with Y"
- "Deprecate X"
- "Mark X as FAILED"

### Definite Audit

- "Check vault freshness"
- "Run drift detection"
- "Verify terminology compliance"
- "Audit git lineage currency"

### Definite Emergency Recovery

- Previous stream was blocked by enforcement
- Preflight failed and cannot pass
- Vault files are missing or corrupted
- Architecture memory infrastructure is broken

---

## Ambiguous Cases

If classification is unclear:

1. Default to G2 (architecture-consuming)
2. Begin execution with reclassification watch active
3. If mutation detected → reclassify to G1 mid-execution
4. Log the reclassification

This is safer than defaulting to G3 (which skips vault loading) or G1 (which adds unnecessary overhead).

---

## Cross-References

- [[README]] — template system overview
- [[AMOPS_NATIVE_CONTRACT_CHECKLIST]] — verify any contract is AMOps-compliant
- [[G1_G2_G3_STREAM_TEMPLATE_SYSTEM]] — lifecycle templates (operations)
- [[AMOPS_RUNTIME_ENFORCEMENT_MATRIX]] — obligation matrix
