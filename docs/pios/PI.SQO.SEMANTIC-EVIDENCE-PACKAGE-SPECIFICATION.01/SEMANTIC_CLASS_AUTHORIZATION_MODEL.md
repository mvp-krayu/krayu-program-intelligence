# Semantic Class Authorization Model

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Definition

Semantic class authorization governs which categories of semantic enrichment
a given evidence package is permitted to contribute. The system must
explicitly authorize each semantic class before evidence entries of that
class can be activated as Dynamic CEU overlays.

Authorization prevents:
- unauthorized semantic projection from thin evidence
- class contamination across semantic boundaries
- scope creep in evidence packages
- untraceable semantic enrichment

---

## 2. Semantic Classes

| Class | Scope | Example Enrichments |
|-------|-------|-------------------|
| STRUCTURAL | Topology, cluster membership, node relationships | Edge enrichment, cluster refinement evidence |
| TECHNICAL | Implementation patterns, technology stacks, dependencies | Component typing, technology classification |
| PRODUCT | Business capabilities, feature areas, product boundaries | Capability binding, product domain assignment |
| OPERATIONAL | Operational workflows, runbooks, incident domains | Operational domain typing, risk classification |
| BUSINESS | Business vocabulary, organizational structure, ownership | Business label assignment, ownership mapping |
| DOMAIN | Semantic domain naming, domain relationships, domain typing | Domain label, domain type refinement |
| GOVERNANCE | Compliance requirements, policy constraints, audit rules | Governance classification, compliance tagging |

---

## 3. Authorization Rules

### 3.1 Source-to-Class Mapping

Each source type has a default authorization profile. The ingestion
stream may override defaults with explicit justification.

| Source Type | Default Authorized Classes |
|-------------|--------------------------|
| ADR (Architecture Decision Record) | STRUCTURAL, TECHNICAL, DOMAIN |
| Component Documentation | TECHNICAL, PRODUCT, DOMAIN |
| Capability Model | PRODUCT, BUSINESS, DOMAIN |
| Ownership Map | BUSINESS, OPERATIONAL |
| Operational Runbook | OPERATIONAL, DOMAIN |
| Delivery Narrative | PRODUCT, BUSINESS |
| Architecture Record | STRUCTURAL, TECHNICAL, DOMAIN |
| API Documentation | TECHNICAL, PRODUCT |
| Organizational Vocabulary | BUSINESS, DOMAIN |
| Incident Material | OPERATIONAL |
| PMO Artifacts | PRODUCT, BUSINESS |
| Issue Tracker Semantics | PRODUCT, OPERATIONAL |

### 3.2 Class Authorization Enforcement

1. Every SEP MUST declare its `semantic_class_authorizations` list.
2. Every evidence entry MUST reference a class from this list.
3. If an entry references an unauthorized class, the entry is REJECTED.
4. If no classes are authorized, the entire package is REJECTED.
5. Authorization is declared at package creation time and is immutable
   for that package version.

### 3.3 Cross-Class Prohibition

An evidence entry MUST NOT claim enrichment across multiple semantic
classes in a single entry. Each entry targets exactly one class.

A single SEP MAY contain entries spanning multiple authorized classes.
This is permitted because a single source document (e.g., an ADR) may
contain evidence relevant to multiple semantic dimensions.

### 3.4 Unauthorized Projection Prohibition

If a source document contains information that COULD be relevant to
a non-authorized semantic class, the ingestion stream MUST NOT
extract or package that information.

Example: An operational runbook contains a passing reference to
business strategy. If BUSINESS is not an authorized class for this
package, the business strategy reference MUST NOT appear as an
evidence entry.

---

## 4. Authorization Override

The default source-to-class mapping may be overridden by:

1. **Explicit stream contract declaration.** The ingestion stream
   contract may authorize additional classes with justification.

2. **Governance review.** A governance authority may authorize or
   deny specific class authorizations before package activation.

Overrides MUST be recorded in the SEP's `semantic_class_authorizations`
with explicit justification text.

Overrides MUST NOT:
- authorize ALL classes without individual justification
- bypass the per-entry class reference requirement
- remove the provenance requirement

---

## 5. Authorization and Q-Class Impact

Different semantic classes contribute to different aspects of
qualification evaluation:

| Class | Qualification Impact |
|-------|---------------------|
| STRUCTURAL | May increase structural grounding (backed_count) |
| TECHNICAL | May enrich domain typing (D4: evidence_depth) |
| PRODUCT | May resolve grounding gaps (debt reduction) |
| OPERATIONAL | May enrich operational domain classification |
| BUSINESS | May extend crosswalk coverage (continuity improvement) |
| DOMAIN | May upgrade lineage status, assign labels |
| GOVERNANCE | No direct qualification impact; audit enrichment only |

The authorization model ensures that the qualification impact pathway
is transparent: a BUSINESS-class SEP can extend crosswalk coverage
but cannot claim structural grounding improvements.

---

## 6. Validation Rules

1. `semantic_class_authorizations` MUST contain at least one `authorized: true` entry.
2. Every `evidence_entries[].semantic_class` MUST appear in `semantic_class_authorizations` with `authorized: true`.
3. Source type MUST be declared (no UNKNOWN source type).
4. Justification MUST be non-empty for any class outside the default profile.
5. GOVERNANCE class entries MUST NOT produce Dynamic CEU overlay contributions (audit-only).
