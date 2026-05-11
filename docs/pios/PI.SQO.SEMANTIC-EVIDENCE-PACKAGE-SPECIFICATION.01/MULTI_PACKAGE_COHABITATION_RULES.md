# Multi-Package Cohabitation Rules

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Cohabitation Principle

Multiple Semantic Evidence Packages may be simultaneously ACTIVATED
for the same client/run. This is expected: different source documents
provide evidence for different semantic dimensions, and they should
coexist without conflict.

Cohabitation must be:
- ordered (deterministic application sequence)
- transparent (each package's contributions are attributable)
- conflict-aware (overlapping claims are detected and resolved)
- removable (any package can be revoked independently)

---

## 2. Package Ordering

When multiple packages are ACTIVATED, they are applied in
`package_id` sequence order (creation order):

```
SEP-fastapi-run_02-001 (created first)   → applied first
SEP-fastapi-run_02-002 (created second)  → applied second
SEP-fastapi-run_02-003 (created third)   → applied third
```

Within each package, entries are applied in `entry_id` order.

This ordering is immutable: it is determined by package creation
time, not activation time. Reordering is prohibited.

---

## 3. Cohabitation Scenarios

### 3.1 Non-Overlapping Packages

The simplest case: packages target different domains or different
semantic classes with no shared targets.

```
SEP-001: enriches DOM-01, DOM-02, DOM-03 (from ADR documentation)
SEP-002: enriches DOM-07, DOM-08, DOM-09 (from capability model)
```

Result: both packages apply cleanly with no conflicts. Each domain
receives enrichment from exactly one package.

### 3.2 Complementary Packages

Packages target the same domain but different claim types:

```
SEP-001: LABEL_ASSIGNMENT for DOM-05 (from ADR)
SEP-002: LINEAGE_UPGRADE for DOM-05 (from architecture review)
```

Result: both claims apply. DOM-05 receives a business label from
SEP-001 and a lineage upgrade from SEP-002. No conflict because
the claim types target different fields.

### 3.3 Conflicting Packages

Packages propose competing claims for the same domain and field:

```
SEP-001: LABEL_ASSIGNMENT for DOM-05 = "Payment Processing"
SEP-002: LABEL_ASSIGNMENT for DOM-05 = "Transaction Services"
```

Resolution: conflict resolution rules apply (see §4 below).

---

## 4. Conflict Resolution Rules

### 4.1 Same Field, Different Packages

When two packages propose values for the same field on the same domain:

**Rule: later package wins, conflict recorded.**

The later-sequenced package's claim takes precedence. The conflict is
recorded in the composite state:

```json
{
  "conflicts": [
    {
      "field": "DOM-05.business_label",
      "winning_package": "SEP-002",
      "winning_value": "Transaction Services",
      "losing_package": "SEP-001",
      "losing_value": "Payment Processing",
      "resolution": "LATER_PACKAGE_PRECEDENCE"
    }
  ]
}
```

### 4.2 Same Field, Higher Confidence

If packages have different `confidence_basis` for the same claim:

```
DIRECT_CITATION > STRONG_INFERENCE > CONTEXTUAL_DERIVATION
```

**Rule: higher confidence wins, regardless of package order.**

This override of the default ordering is recorded:

```json
{
  "resolution": "CONFIDENCE_PRECEDENCE",
  "winning_confidence": "DIRECT_CITATION",
  "losing_confidence": "CONTEXTUAL_DERIVATION"
}
```

### 4.3 Contradictory Claims

When two packages make claims that are logically contradictory
(not just different values):

```
SEP-001: LINEAGE_UPGRADE DOM-05 from NONE to STRONG
SEP-002: evidence that DOM-05 has no structural correspondence
```

**Rule: CONFLICT_ESCALATION — neither claim is applied.**

The conflict is escalated to governance review. Both entries are
suspended until manual resolution.

---

## 5. Package Interaction Rules

### 5.1 No Cross-Package Dependency (Default)

By default, packages are independent. Package B's claims should not
assume Package A's claims are present.

If a dependency exists, it must be explicitly declared
(see OVERLAY_VERSIONING_AND_ROLLBACK.md §3.2).

### 5.2 Package Scope Isolation

Each package operates within its declared semantic classes.
A BUSINESS-class package cannot modify fields governed by the
STRUCTURAL class, even if they share a target domain.

### 5.3 Aggregate Impact Calculation

The combined impact of multiple packages is computed by:
1. Starting from the certified substrate
2. Applying all packages in order
3. Summing overlay contributions across all packages
4. Computing composite metrics from the aggregate state

Impact is NOT computed per-package and then summed — it is computed
from the ordered application of all packages together, because
later packages may override earlier ones.

---

## 6. Maximum Package Limits

To prevent governance complexity explosion:

| Limit | Value | Rationale |
|-------|-------|-----------|
| Max ACTIVATED packages per client/run | 10 | Governance auditability |
| Max entries per package | 50 | Package review feasibility |
| Max total active entries per client/run | 200 | Composite computation tractability |
| Max conflicts per client/run | 20 | Conflict management feasibility |

If limits are reached, new packages cannot be ACTIVATED until
existing packages are revoked or consolidated.

### 6.1 Package Consolidation

When the package count approaches limits, packages may be
consolidated by creating a new package that combines the entries
from multiple existing packages:

1. Create new consolidated SEP with merged entries
2. Activate the consolidated package
3. Revoke the source packages
4. Verify composite state is equivalent

Consolidation preserves provenance: each merged entry retains its
original source_hash and evidence_basis references.

---

## 7. Cohabitation Audit

The package registry must support the following audit queries:

1. Which packages are active for this client/run?
2. Which packages contribute to a specific domain?
3. Are there any active conflicts?
4. What is the aggregate overlay impact?
5. If package X were revoked, what would the composite state become?
