---
name: ROUTE.CLASSIFICATION.MODEL
type: brain-module
brain: publish
domain: source-entry
version: 1.0
authority: WEB-CAT-INTEGRATION + Publish Execution Model
origin_stream: WEB.SOURCE.ENTRY.CONTROL.01
---

# ROUTE.CLASSIFICATION.MODEL

## Purpose

Assign every detected route a single governance class. Classification determines required authority, registration path, and verdict eligibility.

---

## Route Classification Model

Every detected route is assigned exactly ONE class.

| Class | Criteria | Required Authority |
|---|---|---|
| **CANONICAL** | Route maps directly to a CKR-numbered construct or doctrine document in k-pi governance. Source file is a `canonical_kpi` governance artifact. | CKR reference + `docs/governance/` source path. Authority: `doctrine_core` or `construct_core`. |
| **DERIVED** | Route maps to a derivative narrative or explanation produced from a canonical construct. Source exists in k-pi governance derivatives. | CAT artifact chain + `cat_governed_derivative` source type. Must trace to a CKR. |
| **BRIDGE** | Route connects the KRAYU authority surface (krayu.be) to the Signäl commercial surface (signal-pi.com) or product offering. Audience-facing crossover. | Publish Brain controlled claim chain + declared Product Brain basis. CAT optional. |
| **SNAPSHOT-DERIVED** | Route's content originated from a Base44 rendered capture. No canonical upstream in k-pi governance. Trusted legacy or expansion origin. | Base44 snapshot capture manifest. Source type: `base44_snapshot_fallback`. Fallback policy required. |
| **INVALID / UNAUTHORIZED** | Route exists live but has no source authority, no governance mapping, no approved derivation path, or maps to a removed/revoked source. | None currently. Route must be blocked or removed. |

### Classification Decision Sequence

```
1. Does a CKR number govern this route's subject matter?
   YES → CANONICAL (if source document exists) or DERIVED (if interpretation layer)
   NO → continue

2. Does this route connect authority surface to product/commercial surface?
   YES → BRIDGE
   NO → continue

3. Was this route's content captured from a Base44 render?
   YES → SNAPSHOT-DERIVED
   NO → continue

4. No authority path identified → INVALID / UNAUTHORIZED
```

---

## Module B Definition

```
Name: ROUTE.CLASSIFICATION.MODEL
Version: 1.0
Authority: WEB-CAT-INTEGRATION + Publish Execution Model
Purpose: Assign every detected route a single governance class

CLASSES AND CRITERIA:

  CANONICAL
    ├── Subject matter governed by a CKR-numbered construct
    ├── Source: docs/governance/ k-pi artifact
    ├── source_type: canonical_kpi
    └── Required: CKR reference in notes

  DERIVED
    ├── Explains or extends a CANONICAL construct
    ├── Source: k-pi derivative narrative or CAT-governed document
    ├── source_type: cat_governed_derivative
    └── Required: CAT artifact chain + CKR traceability

  BRIDGE
    ├── Connects krayu.be authority surface to signal-pi.com product surface
    ├── Contains both discipline framing and commercial/product reference
    ├── Source: Publish Brain controlled claim entry with Product Brain basis
    ├── source_type: bridge_governed (NEW CLASS)
    └── Required: Publish Brain node + controlled claims table entry

  SNAPSHOT-DERIVED
    ├── Content originated from Base44 rendered capture
    ├── No upstream canonical source in k-pi governance
    ├── source_type: base44_snapshot_fallback
    └── Required: capture manifest entry + fallback_policy declared

  INVALID / UNAUTHORIZED
    ├── Live route with no traceable source authority
    ├── Source document does not exist
    ├── OR: route duplicates canonical without derivation chain
    ├── source_type: invalid_unmapped
    └── Verdict: blocked — must be removed or reclassified

CLASSIFICATION IS FINAL PER STREAM.
A route may not carry multiple classes.
If ambiguous between DERIVED and BRIDGE → escalate to governance decision.
```

---

*ROUTE.CLASSIFICATION.MODEL — Source Entry Control System | origin: WEB.SOURCE.ENTRY.CONTROL.01 | 2026-04-20*
