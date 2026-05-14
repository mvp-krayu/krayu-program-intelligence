# Vault Mutation Rules

> **How this vault may be modified — and how it may not.**

---

## Allowed Mutations

### Add Concept

A new concept may be added when:
1. It is introduced by a stream contract
2. It has lineage proof (originating stream, commits, branch)
3. It does not collide with existing terminology (check [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]])
4. It is placed in the correct vault section

### Update Concept

An existing concept may be updated when:
1. Its status changes (e.g., PROVISIONAL → LOCKED)
2. New lineage events are recorded (new commits, streams)
3. Its current state changes (e.g., new client onboarded)
4. An error is corrected with evidence

### Deprecate Concept

A concept may be deprecated when:
1. It is superseded by a named successor
2. The supersession is traceable to a stream or commit
3. The deprecated concept is preserved in [[../12_ARCHIVE/]]

## Forbidden Mutations

### Never:

- **Rewrite history** — vault records what happened, not what should have happened
- **Flatten chronology** — strata are real and must remain distinct
- **Remove lineage** — even deprecated concepts retain their lineage chain
- **Merge conflicting terms** — collisions must be resolved, not hidden
- **Invent architecture** — vault records, does not create
- **Session-local reinterpretation** — vault is persistent truth, not conversational

### Specifically Forbidden:

- Removing a vault page without creating an archive entry
- Changing a LOCKED term definition without a governance stream
- Adding a concept without lineage proof
- Modifying chronology tables to "clean up" history
- Treating advisory/aspirational content as canonical

## Mutation Protocol

1. Identify the mutation type (add/update/deprecate)
2. Verify lineage proof exists
3. Check terminology collisions
4. Apply the mutation
5. Update cross-references in affected pages
6. Record the mutation in the originating stream's execution_report.md

## Cross-References

- [[CANONICAL_PROMOTION_PROTOCOL]] — how concepts get promoted
- [[ONTOLOGY_DRIFT_DETECTION]] — detecting unauthorized drift
- [[SEMANTIC_COLLISION_DETECTION]] — collision checking
