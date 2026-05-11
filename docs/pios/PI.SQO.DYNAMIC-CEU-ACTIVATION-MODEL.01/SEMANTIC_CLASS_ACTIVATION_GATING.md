# Semantic Class Activation Gating

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines how activation remains constrained to authorized
semantic classes. Semantic class gating is the mechanism that prevents
unauthorized semantic expansion — ensuring that evidence packages only
contribute to the semantic dimensions they are authorized to enrich.

---

## 2. Gating Principle

Semantic class gating operates at THREE enforcement points:

1. **Package creation** — classes declared and justified
2. **Activation Phase 2** — class authorizations verified
3. **Composite construction** — per-entry class enforcement

An entry that fails class gating at ANY point is rejected. Unauthorized
semantic expansion fails closed.

---

## 3. Enforcement Point 1: Package Creation

When an ingestion stream creates a SEP, it must declare
`semantic_class_authorizations`:

```json
"semantic_class_authorizations": [
  { "class": "TECHNICAL", "authorized": true, "justification": "ADR contains technical architecture decisions" },
  { "class": "DOMAIN", "authorized": true, "justification": "ADR defines domain boundaries" },
  { "class": "BUSINESS", "authorized": false, "justification": "ADR does not contain business vocabulary" },
  { "class": "STRUCTURAL", "authorized": false, "justification": "Not applicable — no topology evidence" },
  { "class": "PRODUCT", "authorized": false, "justification": "ADR is technical, not product-oriented" },
  { "class": "OPERATIONAL", "authorized": false, "justification": "No operational evidence" },
  { "class": "GOVERNANCE", "authorized": false, "justification": "No governance evidence" }
]
```

**Rules:**
- ALL 7 classes must be listed (no omission)
- Each class must have explicit `authorized: true/false`
- Each class must have non-empty justification
- Source type defaults apply (per SEMANTIC_CLASS_AUTHORIZATION_MODEL §3.1)
- Overrides beyond defaults require additional justification

---

## 4. Enforcement Point 2: Activation Phase 2

During Phase 2 (Authorization), the following checks enforce class gating:

### Check A-01: At Least One Authorized Class

```
IF count(authorizations WHERE authorized == true) == 0:
    REJECT — no scope
```

A package with no authorized classes is meaningless.

### Check A-02: Entry-Class Alignment

```
FOR EACH entry IN evidence_entries:
    IF entry.semantic_class NOT IN authorized_classes:
        REJECT — unauthorized class
    IF authorizations[entry.semantic_class].authorized != true:
        REJECT — unauthorized class
```

Every entry must reference an authorized class.

### Check A-03: Override Justification

```
FOR EACH authorization WHERE authorized == true:
    IF authorization.class NOT IN default_classes_for_source_type:
        IF authorization.justification == generic OR empty:
            REJECT — unjustified override
```

Non-default class authorizations require substantive justification.

### Check A-04: Single-Class Entry

```
FOR EACH entry IN evidence_entries:
    IF entry targets multiple semantic_classes:
        REJECT — cross-class violation
```

Each entry targets exactly one class.

### Check A-05: Governance-Class Restriction

```
FOR EACH entry WHERE entry.semantic_class == "GOVERNANCE":
    MARK entry as audit-only
    entry MUST NOT produce overlay contribution
```

GOVERNANCE class entries are informational, not enrichment-producing.

---

## 5. Enforcement Point 3: Composite Construction

During composite state computation, class gating is enforced per-entry:

```
function applyEntry(composite, entry, package_authorizations):
    // Final class gate check during application
    if entry.semantic_class not in package_authorizations:
        log: REJECTED_UNAUTHORIZED
        return { success: false, reason: "unauthorized class" }

    // Class-scoped application
    if entry.claim_type == "LABEL_ASSIGNMENT":
        validate: entry.semantic_class allows label assignment
    if entry.claim_type == "LINEAGE_UPGRADE":
        validate: grounding boundary evidence standard met
    // ... per claim type validation

    apply_to_composite(composite, entry)
    return { success: true }
```

---

## 6. Class-to-Qualification Impact Gating

Beyond authorization, each class is gated to specific qualification
impacts:

| Class | Allowed Qualification Impacts |
|-------|------------------------------|
| STRUCTURAL | May increase structural grounding (backed_count) |
| TECHNICAL | May enrich domain typing (D4: evidence_depth) |
| PRODUCT | May resolve grounding gaps (debt reduction) |
| OPERATIONAL | May enrich operational domain classification |
| BUSINESS | May extend crosswalk coverage (continuity) |
| DOMAIN | May upgrade lineage status, assign labels |
| GOVERNANCE | No qualification impact — audit enrichment only |

**Rule:** A TECHNICAL-class entry proposing a BUSINESS-vocabulary
crosswalk extension is REJECTED, even if the entry references an
authorized class. The claim must be consistent with the class's
allowed qualification impact.

### 6.1 Class-Claim Compatibility Matrix

| Class | LABEL_ASSIGNMENT | LINEAGE_UPGRADE | CONTINUITY_MAPPING | CAPABILITY_BINDING | EDGE_ENRICHMENT | DOMAIN_TYPING |
|-------|-----------------|----------------|-------------------|-------------------|----------------|---------------|
| STRUCTURAL | — | — | — | — | YES | — |
| TECHNICAL | YES | YES | — | YES | YES | YES |
| PRODUCT | YES | — | YES | YES | — | YES |
| OPERATIONAL | YES | — | — | — | — | YES |
| BUSINESS | YES | — | YES | — | — | — |
| DOMAIN | YES | YES | YES | — | — | YES |
| GOVERNANCE | — | — | — | — | — | — |

Entries proposing claims outside their class's compatibility are
REJECTED at composite construction.

---

## 7. Semantic Class Expansion Governance

### 7.1 Adding a New Class to an Existing Package

When a new package version adds a previously-unauthorized class:

1. Version upgrade detected at Phase 2
2. Class expansion detected: new `authorized: true` for a class that
   was `authorized: false` in the prior version
3. **Automatic escalation to governance review** — stream contract
   authorization is insufficient for class expansion
4. Governance review assesses whether the expansion is justified
5. If approved: activation proceeds with expanded scope
6. If denied: package rejected; must be revised

### 7.2 Adding a New Class to the Taxonomy

The 7-class taxonomy (STRUCTURAL through GOVERNANCE) is governance-locked.
Adding an 8th class requires:
1. Dedicated governance specification stream
2. 4-brain alignment check (Canonical, Product, Publish, Code)
3. CLAUDE.md/governance document update
4. All existing SEP validation must remain compatible

---

## 8. Class Gating and Conflict Resolution

When two entries from different packages conflict:

**Rule:** If the conflicting entries reference DIFFERENT semantic classes
targeting the same domain and field, the conflict is automatically
ESCALATED (not resolved by precedence). Cross-class conflicts indicate
evidence boundary confusion that requires governance review.

**Example:**
```
SEP-001: TECHNICAL class, DOM-05, DOMAIN_TYPING = "API Gateway"
SEP-002: PRODUCT class, DOM-05, DOMAIN_TYPING = "Payment Service"
```

These represent different semantic perspectives on the same domain.
Neither precedence rule applies because the evidence classes are
fundamentally different. Governance review resolves which perspective
is authoritative.

---

## 9. Governance Rules

1. Unauthorized semantic expansion MUST fail closed.
2. All 7 classes MUST be listed in every package's authorization declaration.
3. Class-claim compatibility MUST be enforced at composite construction.
4. Class expansion in version upgrades MUST escalate to governance review.
5. Cross-class conflicts MUST escalate to governance review.
6. GOVERNANCE class entries MUST NOT produce overlay contributions.
7. No implicit class authorization — every class requires explicit declaration.
