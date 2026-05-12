# Terminology Lock

> **Authoritative definitions of all architectural terms. Use these. Do not reinterpret.**

---

## Locked Terms

### HYDRATED

**Definition:** The state where semantic reconstruction has achieved high internal coherence and operational usefulness, but without complete structural grounding proof for every semantic claim.

**Status:** CANONICAL — named in strategic roadmap, operationalized in LENS v2.

**What it is NOT:** A degraded state. A staging area. A placeholder for "real" grounding.

### PATH A

**Definition:** The structural grounding path — the concern of proving semantic claims have structural backing in vault anchors, topology reports, or verified registries.

**Status:** CANONICAL — active operational terminology.

### PATH B

**Definition:** The semantic reconstruction path — the concern of producing operationally useful intelligence from evidence, even when complete structural proof is unavailable.

**Status:** CANONICAL — active operational terminology.

### SQO

**Definition:** Semantic Qualification Operations — the qualification state machine that assesses operational maturity of client semantic data.

**Status:** CANONICAL — active runtime component.

### S-State (S0, S1, S2, S3)

**Definition:** Qualification states in the SQO state machine.
- S0: NO_QUALIFICATION
- S1: ONBOARDING_REQUIRED
- S2: QUALIFIED_WITH_DEBT
- S3: AUTHORITY_READY (not yet implemented)

**Status:** CANONICAL — deterministic from data.

### Q-Class (Q-01, Q-02, Q-03, Q-04)

**Definition:** Governance qualification classification based on grounding level.
- Q-01: Fully grounded
- Q-02: Partially grounded (disclosure required)
- Q-03: Semantic only (full disclosure)
- Q-04: Unqualified

**Status:** LOCKED (Q02_GOVERNANCE_AMENDMENT.md).

### Vault (Structural Evidence)

**Definition:** In the current system, "vault" means structural evidence backing — vault anchors provide structural proof for semantic claims.

**WARNING:** This is NOT the Obsidian vault navigation concept from the snapshot era. See [[SEMANTIC_COLLISIONS]].

**Status:** CANONICAL — active operational concept.

### Overlay

**Definition:** A governed modification to semantic state — a change to domain labels, grounding status, or qualification claims that goes through an approval corridor.

**Status:** CANONICAL — operational but prototype-stage.

### Corridor

**Definition:** A governed execution pathway. Two types:
- **Evidence corridor:** How evidence enters the system
- **Runtime corridor:** How SQO manages overlay activation/rollback

**Status:** CANONICAL — active operational concept.

### Crosswalk

**Definition:** The translation layer between technical domain identifiers (DOM-XX) and human-readable business labels. Uses semantic_continuity_crosswalk.json.

**Status:** CANONICAL — active operational component (SemanticCrosswalkMapper).

### DOM (DOM-01 through DOM-17)

**Definition:** Semantic domain identifiers. Descended from PIE vault 17-domain model.

**Status:** CANONICAL — active in crosswalk mapper.

### DPSIG

**Definition:** Deterministic signal family for executive intelligence projection.

**Status:** CANONICAL — active signal infrastructure.

### LENS v2

**Definition:** The executive semantic intelligence rendering surface. Supersedes ExecLens panel model.

**Status:** CANONICAL — active runtime surface.

### ExecLens

**Definition:** The original panel-based traversal runtime surface. Superseded by LENS v2 + SQO Cockpit.

**Status:** HISTORICAL — directory name preserved (`app/execlens-demo/`) but runtime superseded.

### PIE Vault

**Definition:** The original 17-domain, 42-capability, 89-component semantic inventory (Stream 41.2).

**Status:** HISTORICAL — ancestor of current DOM model.

## Term Usage Rules

1. **Use locked definitions exactly.** Do not paraphrase, simplify, or reinterpret.
2. **"Vault" always means structural evidence backing** in current context. Never Obsidian navigation.
3. **HYDRATED is not degraded.** Never describe it as deficient, incomplete, or waiting for real grounding.
4. **Q-class is deterministic.** It is computed from grounding ratio, not assigned by judgment.
5. **PATH A and PATH B are complementary.** Never describe them as competing.

## Cross-References

- [[SEMANTIC_COLLISIONS]] — terms with conflicting meanings
- [[DEPRECATED_TERMS]] — terms that should not be used
- [[VAULT_SEMANTIC_MUTATION]] — how terms evolve
