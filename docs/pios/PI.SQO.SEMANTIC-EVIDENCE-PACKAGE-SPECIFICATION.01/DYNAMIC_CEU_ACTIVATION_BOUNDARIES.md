# Dynamic CEU Activation Boundaries

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Activation Principle

Dynamic CEU activation is the moment when overlay evidence begins
contributing to qualification evaluation. Activation is governed by
strict boundaries to prevent premature, unauthorized, or substrate-
contaminating enrichment.

---

## 2. Pre-Activation Requirements

A SEP MUST satisfy ALL of the following before STAGED → ACTIVATED
transition:

| Requirement | Verification |
|-------------|-------------|
| Package integrity | Package hash matches stored hash |
| Provenance completeness | All entries have source hash, authority, basis |
| Class authorization | All entry classes appear in authorized list |
| No substrate mutation | Package does not modify PATH A or PATH B artifacts |
| No unauthorized classes | No entries reference non-authorized classes |
| No self-referential authority | Source authority is external |
| Dependency resolution | All declared dependencies are ACTIVATED |
| Entry count within limits | Total entries ≤ 50 |
| Aggregate limits respected | Total active entries across all packages ≤ 200 |

If ANY requirement fails, activation is REJECTED.

---

## 3. Activation Boundaries

### 3.1 Temporal Boundary

A SEP may only be activated AFTER:
- the certified substrate exists and is valid
- the qualification state has been evaluated from Static CEU
- the semantic debt inventory has been computed
- the maturity scores have been computed

Dynamic CEU cannot substitute for an absent certified substrate.
It can only augment an existing one.

### 3.2 Scope Boundary

A SEP is scoped to a single `(client, run_id)` pair. It cannot:
- contribute evidence to a different client
- contribute evidence to a different run
- contribute evidence across client/run boundaries
- produce global enrichments

### 3.3 Claim Boundary

A SEP's evidence entries may only make claims within the taxonomy
of defined claim types:

```
LABEL_ASSIGNMENT
LINEAGE_UPGRADE
CONTINUITY_MAPPING
CAPABILITY_BINDING
EDGE_ENRICHMENT
DOMAIN_TYPING
```

Claims outside this taxonomy are REJECTED. New claim types require
governance specification extension.

### 3.4 Grounding Boundary

Dynamic CEU lineage upgrades (NONE → STRONG, WEAK → EXACT) must
satisfy the evidence standard:

| Target Lineage | Required Confidence Basis | Required Evidence |
|---------------|--------------------------|-------------------|
| WEAK → STRONG | DIRECT_CITATION or STRONG_INFERENCE | Architecture record establishing structural correspondence |
| NONE → STRONG | DIRECT_CITATION | Direct evidence of structural-to-business mapping |
| NONE → EXACT | DIRECT_CITATION | Explicit structural identity mapping in source |
| WEAK → EXACT | DIRECT_CITATION | Explicit structural identity mapping in source |

Lineage upgrades with CONTEXTUAL_DERIVATION confidence are capped
at STRONG (never EXACT). EXACT lineage requires DIRECT_CITATION.

### 3.5 Immutability Boundary

Dynamic CEU activation MUST NOT:

| Action | Status |
|--------|--------|
| Modify certified topology | PROHIBITED |
| Modify DPSIG signals | PROHIBITED |
| Modify decision validation results | PROHIBITED |
| Modify reproducibility verdict | PROHIBITED |
| Modify rendering_metadata (certified) | PROHIBITED |
| Modify crosswalk (certified) | PROHIBITED |
| Modify semantic_topology_model (certified) | PROHIBITED |
| Override Q-class formula | PROHIBITED |
| Bypass S-state gates | PROHIBITED |
| Suppress disclosure requirements | PROHIBITED |

Dynamic CEU produces OVERLAY contributions that AUGMENT the composite
evaluation. It NEVER modifies the certified artifacts themselves.

---

## 4. Activation Process

```
1. LOAD SEP from artifact store
2. VERIFY package hash
3. CHECK all pre-activation requirements
4. RESOLVE dependencies (if any)
5. MARK package as ACTIVATED in registry
6. TRIGGER qualification re-evaluation
7. LOG activation event with timestamp and operator
```

---

## 5. Deactivation Process

```
1. MARK package as REVOKED in registry
2. CHECK for dependent packages
   → if dependencies exist: BLOCK revocation
   → if no dependencies: proceed
3. TRIGGER qualification re-evaluation (without revoked package)
4. VERIFY composite state integrity post-removal
5. LOG deactivation event with timestamp, operator, and reason
```

---

## 6. Activation Impact Disclosure

When Dynamic CEU is active, the qualification evaluation MUST
disclose:

1. That overlay contributions are present
2. How many packages are contributing
3. Which domains have overlay contributions
4. The distinction between certified and overlay grounding
5. The aggregate overlay impact on backed_count

This disclosure is mandatory for:
- qualification re-evaluation artifacts
- SQO cockpit display
- governance audit trails
- executive projection (if overlays affect Q-class)

---

## 7. Emergency Boundary

If a governance review determines that an activated overlay is
producing incorrect or misleading qualification state:

1. The overlay MAY be emergency-revoked without operator confirmation
2. The emergency revocation is logged with governance authority
3. Qualification re-evaluation is immediately triggered
4. The composite state reverts to pre-overlay evaluation
5. The revoked package is flagged for review

Emergency revocation does not delete the package. It marks it REVOKED
with an emergency flag for subsequent audit.
