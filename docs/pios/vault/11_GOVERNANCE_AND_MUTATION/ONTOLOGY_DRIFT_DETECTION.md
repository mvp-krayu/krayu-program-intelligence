# Ontology Drift Detection

> **How to detect when architecture is silently diverging from vault truth.**

---

## What Ontology Drift Is

Ontology drift occurs when:
- A term is used with a different meaning than its vault-locked definition
- A concept is assumed to exist that is not documented in the vault
- A concept's status is assumed to be different from its vault status
- Architecture is reconstructed from conversation rather than vault

## Detection Signals

### Signal 1: Term Redefinition

If an execution engine or operator uses a vault-locked term with a different meaning:
- Check [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]]
- If the usage contradicts the lock → DRIFT DETECTED

### Signal 2: Undocumented Concept Reference

If a stream or conversation references an architectural concept not in the vault:
- Search vault for the concept
- If not found → either GAP (vault needs update) or DRIFT (concept was invented)

### Signal 3: Status Assumption Mismatch

If a stream assumes a concept has a status different from what the vault records:
- Check the vault page for the concept
- If status differs → DRIFT DETECTED

### Signal 4: Chronology Flattening

If historical strata are treated as simultaneous:
- ExecLens concepts used as if they are current
- Snapshot-era terms used without checking current meaning
- Timeline events placed out of order

## Response Protocol

1. **Flag** the drift with specific evidence
2. **Check** whether the vault is outdated or the usage is wrong
3. **If vault is outdated** → update vault (per [[VAULT_MUTATION_RULES]])
4. **If usage is wrong** → correct the usage and flag to operator

## Cross-References

- [[SEMANTIC_COLLISION_DETECTION]] — term-specific collision checking
- [[VAULT_MUTATION_RULES]] — how to update vault when gaps found
- [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]] — authoritative definitions
