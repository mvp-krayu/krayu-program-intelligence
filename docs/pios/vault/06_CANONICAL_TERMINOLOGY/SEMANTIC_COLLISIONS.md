# Semantic Collisions

> **Terms that mean different things in different architectural strata. Handle with care.**

---

## Active Collisions

### "Vault"

| Stratum | Meaning | Era |
|---|---|---|
| Snapshot (S1-S2) | Obsidian file vault — evidence navigation via obsidian:// links | 2026-03-22 → 2026-04-02 |
| Current (S3-S5) | Structural evidence backing — vault anchors provide grounding proof | 2026-05-07 → present |

**Resolution:** In current context, "vault" ALWAYS means structural evidence backing. Never use "vault" for Obsidian navigation in current system.

**Risk:** If snapshot governance documents are loaded without this awareness, "vault" references will be misinterpreted as structural grounding claims when they actually mean file navigation.

### "PIE Vault"

| Context | Meaning |
|---|---|
| Stream 41.2 | Semantic domain inventory (17 domains, 42 capabilities, 89 components) |
| Current system | Historical ancestor of DOM model. NOT the structural evidence vault. |

**Resolution:** Always qualify: "PIE vault" = semantic inventory (historical); "vault" without prefix = structural evidence backing (current).

### "Path"

| Context | Meaning |
|---|---|
| ExecLens traversal | 4 traversal paths (Primary, Technical Deepening, Drift, Product Bridge) |
| Current architecture | PATH A (structural grounding) / PATH B (semantic reconstruction) |

**Resolution:** In current context, "path" capitalized (PATH A, PATH B) means architectural path. Never use it for ExecLens traversal paths.

### "Topology"

| Context | Meaning |
|---|---|
| ExecLens era | Structural visualization panel — topology of evidence relationships |
| Current system | Structural observation reports — topology as evidence for grounding |
| Semantic context | Semantic topology — the shape of domain relationships |

**Resolution:** Qualify which topology: "structural topology" (observations), "semantic topology" (domain relationships). Avoid unqualified "topology."

### "Qualification"

| Context | Meaning |
|---|---|
| Snapshot gate model | CONTROL-completeness gate (A.10/A.11) — binary pass/fail |
| Current SQO model | S-state qualification — graduated maturity assessment |

**Resolution:** In current context, "qualification" means SQO S-state assessment.

## How to Avoid Collisions

1. Check this page before using ambiguous terms
2. Qualify terms when context is mixed (e.g., loading snapshot + current data)
3. When in doubt, use the longer form: "structural evidence vault" not just "vault"
4. Never assume a snapshot-era term means the same thing in current context

## Cross-References

- [[TERMINOLOGY_LOCK]] — authoritative current definitions
- [[DEPRECATED_TERMS]] — terms to avoid
- [[VAULT_SEMANTIC_MUTATION]] — how meanings evolved
