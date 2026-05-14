# Vault Semantic Mutation

> **How architectural terms evolve — tracking meaning changes across strata.**

---

## Why This Page Exists

Terms change meaning as architecture evolves. Without explicit tracking, the same word gets used for different things across strata, creating confusion.

This page documents every known semantic mutation — a term that changed meaning over time.

## Documented Mutations

### "vault"

```
Stratum 1 (Governance):    Not used
Stratum 2 (ExecLens):      Obsidian file vault — evidence navigation links
Stratum 3 (Path Split):    Structural evidence backing — grounding proof
Stratum 4 (SQO):           Structural evidence backing (inherited from S3)
Stratum 5 (Corridor):      Structural evidence backing (inherited from S3)
```

**Mutation point:** Between S2 and S3 (April → May 2026). The term shifted from file navigation to structural evidence without explicit deprecation of the prior meaning.

### "path"

```
Stratum 2 (ExecLens):      Traversal path — navigation route through panels
Stratum 3 (Path Split):    Architectural path — PATH A/B concern separation
```

**Mutation point:** S3 emergence (2026-05-07). Capitalization convention (PATH A vs "primary path") partially disambiguates.

### "qualification"

```
Stratum 1 (Governance):    Gate completion (CONTROL-completeness)
Stratum 4 (SQO):           S-state maturity assessment
```

**Mutation point:** SQO creation (2026-05-10). The gate concept survived conceptually but the term now primarily means SQO assessment.

### "runtime"

```
Stratum 2 (ExecLens):      ExecLens panel rendering engine
Stratum 4 (SQO):           SQO qualification runtime + LENS v2 rendering
Stratum 5 (Corridor):      Runtime corridor — governed overlay/replay execution
```

**Mutation point:** Multiple. "Runtime" accumulated meanings without shedding old ones. Current usage requires qualification: "LENS runtime" vs "SQO runtime" vs "runtime corridor."

### "extraction"

```
Stratum 2 (ExecLens):      Panel data extraction from pipeline
Stratum 4 (SQO):           Semantic candidate extraction from evidence
Stratum 5 (Corridor):      Evidence rebase extraction — governed corridor
```

**Mutation point:** Evidence rebase (2026-05-12). "Extraction" now primarily means evidence-to-candidate transformation in the rebase corridor.

## Mutation Detection Protocol

When adding a new concept that uses an existing term:
1. Check [[TERMINOLOGY_LOCK]] — is the term already locked?
2. Check [[SEMANTIC_COLLISIONS]] — does the term collide?
3. If collision → use a qualified variant or create a new term
4. Document the mutation here

## Cross-References

- [[TERMINOLOGY_LOCK]] — authoritative definitions
- [[SEMANTIC_COLLISIONS]] — active collision list
- [[DEPRECATED_TERMS]] — terms to avoid
