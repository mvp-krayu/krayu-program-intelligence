# Semantic Collision Detection

> **How to check for and prevent term meaning conflicts.**

---

## Detection Protocol

Before using any architectural term in a new context:

### Step 1: Check Terminology Lock

Read [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]]. If the term is locked → use the locked definition exactly.

### Step 2: Check Semantic Collisions

Read [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]]. If the term has known collisions → qualify with context.

### Step 3: Check Vault Semantic Mutation

Read [[../06_CANONICAL_TERMINOLOGY/VAULT_SEMANTIC_MUTATION]]. If the term has changed meaning across strata → use current meaning and note historical meaning if relevant.

### Step 4: Check Deprecated Terms

Read [[../06_CANONICAL_TERMINOLOGY/DEPRECATED_TERMS]]. If the term is deprecated → use the replacement.

## Prevention Protocol

When introducing a new term:

1. Search vault for existing usage
2. If found → determine if collision or extension
3. If collision → use a different term or qualify with prefix
4. If extension → document the extension in VAULT_SEMANTIC_MUTATION
5. Add to TERMINOLOGY_LOCK if canonical
6. Add to SEMANTIC_COLLISIONS if collision exists

## Known High-Risk Terms

| Term | Risk Level | Why |
|---|---|---|
| vault | HIGH | Obsidian vs structural evidence collision |
| path | MEDIUM | Traversal vs architectural path collision |
| qualification | MEDIUM | Gate vs SQO assessment collision |
| runtime | MEDIUM | Multiple meanings accumulated |
| extraction | LOW | Meaning narrowed but clear |

## Cross-References

- [[ONTOLOGY_DRIFT_DETECTION]] — broader drift detection
- [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]] — locked definitions
- [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]] — known collisions
