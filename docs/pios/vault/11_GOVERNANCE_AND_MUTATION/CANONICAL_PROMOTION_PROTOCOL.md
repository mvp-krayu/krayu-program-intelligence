# Canonical Promotion Protocol

> **How a concept moves from provisional to canonical to locked.**

---

## Promotion States

```
EMERGING → PROVISIONAL → CANONICAL → LOCKED
```

| State | Meaning | Who Can Change |
|---|---|---|
| EMERGING | Concept introduced but not yet validated | Stream author |
| PROVISIONAL | Concept validated but not yet enforced | Governance stream |
| CANONICAL | Concept enforced and active | Governance stream |
| LOCKED | Concept enforced and immutable | Only explicit governance override |

## Promotion Requirements

### EMERGING → PROVISIONAL

- Concept has an originating stream
- Concept has at least one commit
- Concept does not collide with existing terminology
- Concept is documented in vault

### PROVISIONAL → CANONICAL

- Concept has been validated in production use
- Concept has governance documentation
- Concept does not conflict with LOCKED concepts
- Concept has operator or stakeholder acceptance

### CANONICAL → LOCKED

- Concept has been stable for multiple streams
- Concept has passed validation criteria
- Locking is explicitly declared in a governance stream
- CLOSURE.md records the lock event

## Demotion Rules

Locked concepts may only be unlocked by:
1. Explicit governance stream declaring the unlock
2. CLOSURE.md recording the unlock and reason
3. Successor concept identified and documented

Canonical concepts may be deprecated by:
1. Successor concept reaching CANONICAL status
2. Original concept moved to [[../12_ARCHIVE/SUPERSEDED_CONCEPTS]]

## Cross-References

- [[VAULT_MUTATION_RULES]] — general mutation rules
- [[STREAM_CLOSURE_PROPAGATION]] — how closures affect vault
- [[ONTOLOGY_DRIFT_DETECTION]] — detecting unauthorized promotion
