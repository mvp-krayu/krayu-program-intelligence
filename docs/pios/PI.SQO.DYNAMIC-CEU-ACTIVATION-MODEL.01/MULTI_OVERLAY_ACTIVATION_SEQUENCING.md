# Multi-Overlay Activation Sequencing

**Stream:** PI.SQO.DYNAMIC-CEU-ACTIVATION-MODEL.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 4 — Controlled Semantic Activation Architecture

---

## 1. Purpose

This document defines how multiple overlays are sequenced for activation,
application, and re-evaluation. When multiple SEPs contribute to the same
qualification evaluation, their ordering and interaction must be fully
deterministic.

---

## 2. Sequencing Principle

Multi-overlay sequencing is deterministic and based on creation order:

```
Application Order = package_id sequence number (monotonic, creation-time assigned)
```

This ordering is:
- **Deterministic:** same packages always applied in same order
- **Immutable:** ordering is fixed at creation, never reordered
- **Reproducible:** ordering can be reconstructed from package_id alone

---

## 3. Activation Sequencing

### 3.1 Independent Activation

Each package is activated independently through Phases 0–6. There is
no requirement for packages to be activated simultaneously or in any
particular order.

**Valid sequence:**
```
Time T1: Activate SEP-001 → re-evaluate
Time T2: Activate SEP-002 → re-evaluate
Time T3: Activate SEP-003 → re-evaluate
```

Each activation triggers its own re-evaluation. The re-evaluation
at T2 includes both SEP-001 and SEP-002. The re-evaluation at T3
includes all three.

### 3.2 Batch Activation

Multiple packages MAY be activated in a batch by a single governance
authorization. In this case:

```
Time T1: Activate SEP-001, SEP-002, SEP-003 → single re-evaluation
```

**Rules for batch activation:**
1. Each package must independently pass Phases 1–3
2. Governance authorization covers all packages in the batch
3. Eligibility checks consider the full batch (aggregate limits apply
   to all packages together)
4. A single re-evaluation is triggered after all activations complete
5. If any package in the batch fails eligibility, the entire batch
   is rejected (atomic batch activation)

### 3.3 Activation Serialization

For the same (client, run_id), activations are serialized:

```
IF activation_A is in progress for (client, run_id):
    activation_B for same (client, run_id) MUST WAIT
```

No concurrent activations for the same qualification scope. This
prevents race conditions in eligibility checks and composite
state computation.

---

## 4. Application Sequencing

### 4.1 Overlay Application Order

When computing composite state, overlays are applied in package_id order:

```
Layer 0:  Certified Substrate (Static CEU)
Layer 1:  SEP-<client>-<run>-001 (lowest sequence number)
Layer 2:  SEP-<client>-<run>-002
  ...
Layer N:  SEP-<client>-<run>-NNN (highest sequence number)
          ═══════════════════════
Result:   Composite Semantic State
```

### 4.2 Intra-Package Entry Order

Within each package, entries are applied in entry_id order:

```
Package SEP-001:
  Entry SEP-ENTRY-001 (first)
  Entry SEP-ENTRY-002 (second)
  ...
  Entry SEP-ENTRY-NNN (last)
```

### 4.3 Version Selection

When a package has multiple versions, only the ACTIVATED version
participates in application. SUPERSEDED and REVOKED versions are
excluded.

```
SEP-001.v1 (SUPERSEDED) → excluded
SEP-001.v2 (ACTIVATED)  → applied at Layer 1
SEP-002.v1 (ACTIVATED)  → applied at Layer 2
```

### 4.4 Gap Handling

If a package is REVOKED, its layer is skipped:

```
SEP-001 (ACTIVATED)  → applied at Layer 1
SEP-002 (REVOKED)    → skipped
SEP-003 (ACTIVATED)  → applied at Layer 2
```

The application order of remaining packages is unchanged. Revocation
does not cause resequencing.

---

## 5. Re-evaluation Sequencing

### 5.1 Trigger Serialization

When multiple triggers occur for the same (client, run_id):

```
Queue: [SEP_ACTIVATED(SEP-003), SEP_REVOKED(SEP-001), SEP_VERSION_UPGRADE(SEP-002)]

Processing:
  1. Execute re-evaluation for SEP_ACTIVATED(SEP-003)
     Output becomes "prior_state" for next
  2. Execute re-evaluation for SEP_REVOKED(SEP-001)
     Output becomes "prior_state" for next
  3. Execute re-evaluation for SEP_VERSION_UPGRADE(SEP-002)
     Output is final state
```

**Rule:** Each re-evaluation's output is the input for the next.
Re-evaluations are strictly serialized, not parallelized.

### 5.2 Re-evaluation Coalescing

If multiple triggers are queued before the first re-evaluation completes,
they MAY be coalesced into a single re-evaluation:

```
Queue: [SEP_ACTIVATED(SEP-003), SEP_ACTIVATED(SEP-004)]

Coalesced: Single re-evaluation with both SEP-003 and SEP-004 active
```

**Coalescing rules:**
1. Only same-type triggers may be coalesced (activations with activations,
   not activations with revocations)
2. Coalesced re-evaluation produces a single artifact covering all triggers
3. Coalescing is an optimization, not a semantic change — the result is
   identical to serial execution

### 5.3 Re-evaluation Ordering Guarantee

Regardless of coalescing, the following guarantee holds:

```
re_evaluation_output == computeCompositeState(
    certified_substrate,
    FULL active_overlay_set after ALL triggers processed
)
```

The final state is determined by the final overlay set, not by the
order of trigger processing.

---

## 6. Multi-Overlay Interaction Patterns

### 6.1 Additive Stacking

Multiple packages enrich different aspects of the same domain:

```
SEP-001: LABEL_ASSIGNMENT for DOM-05 → "Payment Processing"
SEP-002: LINEAGE_UPGRADE for DOM-05 → NONE → STRONG
SEP-003: CAPABILITY_BINDING for DOM-05 → "process_payment"
```

Result: DOM-05 receives all three enrichments (no conflict).

### 6.2 Progressive Refinement

Later packages refine earlier packages' claims:

```
SEP-001: DOMAIN_TYPING for DOM-05 = "Service" (CONTEXTUAL_DERIVATION)
SEP-002: DOMAIN_TYPING for DOM-05 = "Payment Service" (DIRECT_CITATION)
```

Result: SEP-002 wins (higher confidence). DOM-05 typed as "Payment Service".
Conflict recorded.

### 6.3 Complementary Coverage

Packages from different source types cover different domains:

```
SEP-001 (from ADR): enriches DOM-01, DOM-02, DOM-03
SEP-002 (from capability model): enriches DOM-04, DOM-05, DOM-06
SEP-003 (from operational runbook): enriches DOM-07, DOM-08, DOM-09
```

Result: Full domain coverage from complementary sources. No conflicts.

### 6.4 Dependency Chain

Packages declare dependencies on earlier packages:

```
SEP-001: LABEL_ASSIGNMENT for DOM-05 → "Payment Processing"
SEP-002: depends on SEP-001.ENTRY-003
         LINEAGE_UPGRADE for DOM-05 → NONE → STRONG
         (assumes label from SEP-001 exists)
```

Result: SEP-002 can only be activated if SEP-001 is ACTIVATED.
SEP-001 cannot be revoked while SEP-002 depends on it.

---

## 7. Sequencing Limits

| Limit | Value | Rationale |
|-------|-------|-----------|
| Max ACTIVATED packages per client/run | 10 | Governance auditability |
| Max total active entries | 200 | Composite computation tractability |
| Max concurrent activation requests | 1 per (client, run_id) | Serialization |
| Max queued re-evaluation triggers | 20 | Queue depth limit |
| Max batch activation size | 5 packages | Batch review feasibility |

---

## 8. Governance Rules

1. Application order is fixed by creation order (package_id sequence).
2. No manual reordering of overlay application sequence.
3. Activations for the same scope are serialized (no concurrency).
4. Re-evaluations are serialized or coalesced (never parallel for same scope).
5. Batch activation is atomic — all-or-nothing.
6. Gap handling preserves remaining package ordering.
7. The final composite state is independent of trigger processing order.
