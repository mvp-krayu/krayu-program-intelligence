# Overlay Dependency and Conflict Model

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines how overlays declare dependencies, how conflicts
between overlays are detected and resolved, and how multi-overlay
coexistence is governed under the activation model.

---

## 2. Dependency Model

### 2.1 Default Independence

By default, overlay packages are INDEPENDENT. Package B does not assume
Package A exists. This is the preferred state — it maximizes independent
removability and minimizes activation complexity.

### 2.2 Explicit Dependency Declaration

When a package's evidence entries depend on claims from another package,
the dependency MUST be explicitly declared:

```json
{
  "dependencies": [
    {
      "depends_on_package": "SEP-fastapi-run_02-001",
      "depends_on_entry": "SEP-ENTRY-003",
      "dependency_type": "CLAIM_PREREQUISITE",
      "reason": "LINEAGE_UPGRADE to STRONG assumes LABEL_ASSIGNMENT from package 001"
    }
  ]
}
```

### 2.3 Dependency Types

| Type | Description | Example |
|------|-------------|---------|
| CLAIM_PREREQUISITE | An entry's claim assumes another entry's claim is present | Lineage upgrade assumes label is assigned |
| DOMAIN_CONTEXT | Package provides evidence for a domain that another package has typed | Capability binding assumes domain typing exists |
| PROVENANCE_CHAIN | Package's source material references another package's source | ADR-2 references the architecture record from ADR-1 |

### 2.4 Dependency Resolution During Activation

At Phase 3 (Eligibility Resolution), dependencies are checked:

```
FOR EACH dependency in package.dependencies:
    target_package = LOAD dependency.depends_on_package
    IF target_package.status != ACTIVATED:
        REJECT — unresolved dependency
    IF dependency.depends_on_entry NOT IN target_package.evidence_entries:
        REJECT — missing entry reference
```

**Rule:** All declared dependencies must resolve to ACTIVATED packages.
A package with unresolved dependencies CANNOT be activated.

### 2.5 Dependency Impact on Revocation

When revoking a package that other packages depend on:

```
FOR EACH active_package in package_registry:
    IF active_package has dependency on package_being_revoked:
        BLOCK revocation
        REPORT: "Package X depends on this package via entry Y"
```

**Rule:** A package with active dependents CANNOT be revoked until
all dependents are revoked first (or updated to remove the dependency).

### 2.6 Circular Dependency Prohibition

Circular dependencies are PROHIBITED:

```
IF package_A depends_on package_B
AND package_B depends_on package_A:
    REJECT both packages at Phase 3
```

Dependency chains must be acyclic.

---

## 3. Conflict Model

### 3.1 Conflict Definition

A conflict occurs when two active overlay entries target the same
domain and field with different proposed values:

```
Entry in SEP-001: DOM-05.business_label = "Payment Processing"
Entry in SEP-002: DOM-05.business_label = "Transaction Services"
```

### 3.2 Conflict Detection

Conflict detection occurs at two points:

**At Phase 3 (pre-activation):** Proposed entries are compared against
all active overlay entries. Conflicts are detected before activation.

**At composite construction:** During composite state computation,
conflicts are detected and resolved per the conflict resolution rules.

### 3.3 Conflict Types

| Type | Description | Resolution |
|------|-------------|-----------|
| COMPETING_VALUE | Same domain + field, different values | Precedence rules apply |
| COMPETING_CONFIDENCE | Same claim, different confidence basis | Higher confidence wins |
| CONTRADICTION | Logically contradictory claims | ESCALATION — governance review |
| SUPERSESSION | Later version of same claim | Later version wins (natural) |

### 3.4 Conflict Resolution Rules

**Rule 1 — Later Package Precedence:**
When two packages propose values for the same field on the same domain,
the later-sequenced package's claim takes precedence. This is
deterministic because package ordering is fixed by creation order.

**Rule 2 — Confidence Precedence:**
If packages have different confidence_basis for the same claim:
```
DIRECT_CITATION > STRONG_INFERENCE > CONTEXTUAL_DERIVATION
```
Higher confidence wins regardless of package order. This overrides
Rule 1 only when confidence levels differ.

**Rule 3 — Contradiction Escalation:**
When two claims are logically contradictory (not just different values),
NEITHER claim is applied. The conflict is escalated to governance review.

```json
{
  "conflict_id": "CONFLICT-<client>-<run>-<seq>",
  "type": "CONTRADICTION",
  "entry_a": { "package": "SEP-001", "entry": "SEP-ENTRY-005", "claim": "..." },
  "entry_b": { "package": "SEP-002", "entry": "SEP-ENTRY-003", "claim": "..." },
  "status": "ESCALATED",
  "resolution": null
}
```

**Rule 4 — All Conflicts Recorded:**
Every conflict — whether resolved by precedence rules or escalated —
is recorded in the composite state. No silent overwrites.

### 3.5 Conflict Resolution Audit Record

```json
{
  "conflict_id": "<identifier>",
  "type": "COMPETING_VALUE | COMPETING_CONFIDENCE | CONTRADICTION | SUPERSESSION",
  "domain": "DOM-XX",
  "field": "<target field>",
  "entries": [
    {
      "package_id": "<package>",
      "entry_id": "<entry>",
      "proposed_value": "<value>",
      "confidence_basis": "<basis>"
    }
  ],
  "resolution": "LATER_PACKAGE_PRECEDENCE | CONFIDENCE_PRECEDENCE | ESCALATED | SUPERSEDED",
  "winning_entry": "<entry_id or null if escalated>",
  "timestamp": "<ISO-8601>"
}
```

---

## 4. Conflict Limits

| Limit | Value | Action When Reached |
|-------|-------|-------------------|
| Max conflicts per client/run | 20 | New packages with additional conflicts cannot be activated |
| Max escalated conflicts per client/run | 5 | Activation halted until escalations resolved |
| Max conflicts from a single package | 10 | Package rejected at Phase 3 |

These limits prevent governance complexity explosion. Packages that
introduce excessive conflicts indicate poor evidence quality or
scope overlap with existing overlays.

---

## 5. Conflict Resolution Workflow

### 5.1 Pre-activation Conflict Handling

```
Phase 3: Eligibility Resolution
    │
    ├── Detect conflicts with active overlays
    │
    ├── COMPETING_VALUE / COMPETING_CONFIDENCE
    │     Precedence rules pre-determine resolution
    │     Package is ELIGIBLE with recorded conflicts
    │
    ├── CONTRADICTION
    │     Package ESCALATED to governance review
    │     Remains STAGED until resolution
    │
    └── Conflict limits exceeded
          Package REJECTED
```

### 5.2 Post-activation Conflict Resolution (Escalated)

```
Governance Review
    │
    ├── Review contradictory claims
    │
    ├── Decision options:
    │     a. Entry A wins, Entry B suspended
    │     b. Entry B wins, Entry A suspended
    │     c. Both entries suspended (inconclusive)
    │     d. Both entries revoked (evidence insufficient)
    │
    ├── Resolution recorded
    │
    └── OVERLAY_CONFLICT_RESOLVED trigger emitted
          │
          └── Qualification re-evaluation triggered
```

---

## 6. Dependency-Conflict Interaction

When a conflict resolution affects a dependency chain:

**Scenario:** Package B depends on Package A's entry. A conflict
resolution suspends Package A's entry.

**Rule:** If a dependency target entry is suspended by conflict
resolution, the dependent package's corresponding entries are also
suspended. The dependency chain propagates suspension.

**Recovery:** When the conflict is resolved and the entry is
reinstated, dependent entries are automatically reinstated (if
no other suspensions affect them).

---

## 7. Governance Rules

1. Dependencies MUST be explicitly declared; implicit dependencies
   are not enforced or detected.
2. Conflict detection MUST be deterministic (same overlay set →
   same conflicts detected).
3. Conflict resolution MUST be auditable (every resolution recorded).
4. No hidden semantic precedence — the precedence rules are the
   ONLY mechanism for conflict resolution.
5. Escalated conflicts MUST be resolved before the affected domains
   receive overlay contributions from either conflicting entry.
6. Circular dependencies are prohibited and fail closed.
