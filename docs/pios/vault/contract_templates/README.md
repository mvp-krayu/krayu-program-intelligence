# AMOps-Native Contract Template System

> **Canonical templates for every stream classification. Use these. Do not improvise.**

---

## Purpose

This directory contains reusable contract templates that structurally force AMOps compliance. Every future stream begins by selecting the correct template and filling in the delta.

Templates exist because:
- AMOps preflight must be unavoidable, not optional
- Mutation tracking must be embedded in contract shape, not remembered ad hoc
- Vault propagation must be structurally required at closure, not hoped for
- Fail-closed behavior must be wired into the contract, not added as afterthought

---

## When to Use Each Template

| Template | Use When |
|---|---|
| [[G1_ARCHITECTURE_MUTATION_CONTRACT_TEMPLATE]] | Stream introduces, modifies, deprecates, or supersedes architectural concepts |
| [[G2_ARCHITECTURE_CONSUMPTION_CONTRACT_TEMPLATE]] | Stream uses architectural concepts without changing them |
| [[G3_STANDARD_EXECUTION_CONTRACT_TEMPLATE]] | Stream has no architectural implications |
| [[GOVERNANCE_REPAIR_CONTRACT_TEMPLATE]] | Fixing drift, broken links, stale state, lineage defects, or failed propagation |
| [[CANONICAL_PROMOTION_AND_SUPERSESSION_CONTRACT_TEMPLATE]] | Promoting, demoting, superseding, deprecating, or failing concepts |
| [[VAULT_SYNC_AND_DRIFT_AUDIT_CONTRACT_TEMPLATE]] | Periodic vault synchronization and drift audit |
| [[EMERGENCY_FAIL_CLOSED_RECOVERY_CONTRACT_TEMPLATE]] | Recovering when architecture memory execution has stopped |

If unsure which template to use → [[CONTRACT_TEMPLATE_USAGE_DECISION_TREE]]

---

## How G1/G2/G3 Classification Works

**G1 — Architecture-Mutating** (any of these → G1):
- Introduces a new named concept
- Changes an existing concept's status
- Deprecates or supersedes an existing concept
- Modifies terminology definitions
- Changes layer ownership or boundaries
- Creates new branch patterns or runtime surfaces
- Modifies vault, AMOps, CLAUDE.md, or SKILLS.md

**G2 — Architecture-Consuming** (all of these, none of G1):
- Implements within existing architectural boundaries
- Adds features to existing surfaces
- Fixes bugs within existing components
- Extends existing patterns without renaming

**G3 — Architecture-Unrelated:**
- CSS/UI with no architectural implication
- Documentation rewording without semantic change
- Test additions for existing behavior

Full criteria: CLAUDE.md §16.2 and SKILLS.md SKILL: STREAM_CLASSIFICATION

---

## How Templates Prevent Drift

Templates prevent drift through **structural forcing**:

1. **Preflight block** — every G1/G2 template starts with mandatory vault loading and verification. You cannot reach the execution section without completing preflight.

2. **Mutation tracking** — G1 templates include a mandatory mutation log section. The contract shape requires tracking, not memory.

3. **Closure propagation** — G1 templates require CLOSURE Section 10 with vault propagation verification. Closure is structurally incomplete without it.

4. **Fail-closed conditions** — every template includes explicit failure triggers. The contract tells Claude when to stop.

5. **Terminology lock** — every G1/G2 template requires TERMINOLOGY_LOCK.md loading. Terms cannot drift if the lock is always loaded.

---

## Connection to CLAUDE.md v3.0 and SKILLS.md

Templates operationalize:
- CLAUDE.md §12.2 (Architecture Memory Load) — templates include the load block
- CLAUDE.md §12.3 (Architecture Memory Preflight) — templates include the preflight block
- CLAUDE.md §16 (AMOps) — templates embed the full lifecycle
- SKILLS.md STREAM_CLASSIFICATION — templates reference classification criteria
- SKILLS.md ARCHITECTURE_MEMORY_SYNC — G1 templates invoke this skill at closure
- SKILLS.md VAULT_DRIFT_AUDIT — audit templates invoke this skill

---

## Validation

Before using any template, verify it is current:
- [[AMOPS_NATIVE_CONTRACT_CHECKLIST]] — verify any contract (template-based or custom) is AMOps-native
- [[TEMPLATE_SYSTEM_VALIDATION_REPORT]] — validation results for this template system

---

## Cross-References

- [[OPERATIONAL_BOOTSTRAP_ENTRYPOINT]] — the runtime entrypoint templates operationalize
- [[CLAUDE_RUNTIME_SELF_APPLICATION]] — how Claude uses these templates
- [[AMOPS_RUNTIME_ENFORCEMENT_MATRIX]] — obligation/failure matrix templates embed
