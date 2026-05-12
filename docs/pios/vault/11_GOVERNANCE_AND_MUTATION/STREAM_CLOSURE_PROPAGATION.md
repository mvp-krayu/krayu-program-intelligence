# Stream Closure Propagation

> **How stream closures affect the vault.**

---

## When a Stream Closes

Every stream closure (CLOSURE.md) may affect the vault in these ways:

### New Concepts

If the stream introduced a new architectural concept:
1. Add vault page in appropriate section
2. Record lineage (stream, commits, branch)
3. Set initial status (EMERGING or PROVISIONAL)
4. Add cross-references

### Status Changes

If the stream changed a concept's status:
1. Update status on the relevant vault page
2. Update [[../10_CANONICAL_RUNTIME_STATE/]] pages as needed
3. Record the status transition with stream reference

### Deprecations

If the stream deprecated a concept:
1. Move concept to [[../12_ARCHIVE/SUPERSEDED_CONCEPTS]]
2. Update [[../06_CANONICAL_TERMINOLOGY/DEPRECATED_TERMS]]
3. Record successor concept
4. Preserve lineage chain

### Terminology Changes

If the stream introduced or changed a term:
1. Check [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]]
2. Update [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]] if canonical
3. Update [[../06_CANONICAL_TERMINOLOGY/VAULT_SEMANTIC_MUTATION]] if term meaning changed

## Not Every Stream Affects the Vault

Many streams (CSS refinement, bug fixes, test improvements) do not introduce architectural concepts. These streams do not require vault updates.

**Rule of thumb:** If the stream's CLOSURE.md introduces no new architectural concepts, changes no concept status, and deprecates nothing — no vault update needed.

## Cross-References

- [[VAULT_MUTATION_RULES]] — mutation rules
- [[CANONICAL_PROMOTION_PROTOCOL]] — promotion protocol
