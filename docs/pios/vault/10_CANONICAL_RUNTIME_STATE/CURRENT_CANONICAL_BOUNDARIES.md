# Current Canonical Boundaries

> **What each layer is allowed and forbidden to do.**

---

## Boundary Rules

### L1 (Ingestion)

**Allowed:** Scan, classify, normalize, validate evidence. Produce evidence registry.
**Forbidden:** Semantic interpretation. Grounding claims. Derivation.

### L2 (Evidence Navigation)

**Allowed:** Navigate validated evidence structures.
**Forbidden:** Derivation. Semantic interpretation.

### L3 (Derivation)

**Allowed:** Derive signals, conditions, diagnosis. ESI/RAG. Compute DPSIG signals.
**Forbidden:** Presentation. Runtime rendering. Activation.

### L4 (Semantic Shaping)

**Allowed:** Shape semantic payloads. Q-class classification. Crosswalk translation. Signal projection.
**Forbidden:** Runtime rendering. Evidence ingestion. Authority promotion.

### L5 (Presentation Assembly / Activation)

**Allowed:** Bind and project Core outputs. Manifest-driven payload assembly.
**Forbidden:** Signal computation. Semantic derivation. Evidence ingestion.

### L6 (Runtime Experience)

**Allowed:** Render prepared payloads. Display qualification state. Navigate sections.
**Forbidden:** Compute signals. Derive semantic claims. Modify evidence. Promote authority.

### L7 (Demo / Narrative)

**Allowed:** Package runtime truth for guided demonstration.
**Forbidden:** Derivation. Semantic truth origination.

### L8 (Governance / Validation)

**Allowed:** Define, validate, audit, record.
**Forbidden:** Runtime logic. Core logic. Hidden execution authority.

## Cross-Layer Rules

1. No layer leakage — each layer stays in its lane
2. Evidence flows downstream only (L0 → L1 → L2 → ...)
3. No upstream absorption — L6 cannot do L3 work
4. Contracts constrain but do not define architecture
5. UI is a consumer, not a semantic authority

## Cross-References

- [[CURRENT_CANONICAL_OWNERSHIP]] — who owns each layer
- [[../01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL]] — layer definitions
- [[../08_EXECUTION_RUNTIME/PREFLIGHT_AND_BRANCH_ENFORCEMENT]] — enforcement
