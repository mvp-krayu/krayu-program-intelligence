# CE.5 — Propagation Semantics

**Stream:** CE.5 — PiOS Signal Consumption & Propagation Contract Definition
**Artifact type:** GOVERNANCE SPECIFICATION (NORMATIVE)
**Date:** 2026-04-03
**Evidence base:** CE.2 DEC-011, DEC-014, CE.4 INV-001..INV-007,
  QA.3 propagation integrity validation, CE.2 closure certification
**Authority:** CE.5

---

## 1. PURPOSE

This document defines the propagation semantics at and beyond the 40.5 → 40.6 boundary.
It states:
- What is preserved across the 40.5 → 40.6 handoff
- What is discarded at the handoff
- How condition state propagates through 40.7 → 40.10 given CE.4 + CE.5 inputs
- What causal loss is prohibited across all propagation layers

CE.5 governs the handoff itself. CE.2 governs the downstream chain. This document
states CE.5's obligations at the handoff and references CE.2's guarantees downstream.

---

## 2. THE 40.5 → 40.6 HANDOFF

### 2.1 What crosses the boundary

The 40.5 output packet crosses the 40.5 → 40.6 boundary in full. Every signal emission
record — including CE.4 traceability fields, partiality_reasons, blocking metadata — is
present at 40.6 input.

**40.6 does not strip the packet.** It reads what it needs per the binding table. The
remainder persists in the packet for governance traceability purposes.

### 2.2 What 40.6 consumes

40.6 consumes exactly:
- `signal.state` — to determine which consumption rule applies (SC-001..SC-006)
- `signal.output[signal_field]` — the field value for binding rule evaluation

40.6 does not consume:
- `signal.partiality_reasons` — CE.4 internal traceability
- `signal.blocking_class`, `signal.blocking_inputs`, `signal.blocking_reason` — CE.4 traceability
- `signal.traceability` — CE.4 formula traceability
- `signal.ckr`, `signal.canonical_name` — metadata (not binding inputs)

### 2.3 What 40.6 produces

40.6 produces, for each condition:
- `condition_coverage_state` — one tier value from {BLOCKED, DEGRADED, AT_RISK, STABLE}

This is the sole output of the 40.5 → 40.6 → condition activation chain.
It is the boundary object that enters downstream propagation.

---

## 3. WHAT IS DISCARDED AT THE HANDOFF

The following CE.4 payload content does not propagate beyond 40.6:

| CE.4 field | Discarded at | Reason |
|---|---|---|
| `partiality_reasons` | 40.6 consumption | 40.6 null-handling is state-blind (applies BR-NULL-SIGNAL-BLOCKED regardless of cause) |
| `blocking_class` | 40.6 consumption | CE.2 routing does not distinguish F-1a from F-2 from F-3; all BLOCKED output triggers tier=BLOCKED |
| `blocking_inputs` | 40.6 consumption | Repair routing is not a 40.6 function |
| `blocking_reason` | 40.6 consumption | Human-readable; no binding rule uses it |
| `traceability` | 40.6 consumption | Formula traceability is a 40.5 artifact; 40.6 traces to signal field, not to variable formula |
| `state` (signal-level) | After SC rule application | The signal's emission state informs null-handling but is not propagated as a condition attribute |

**This is not information loss — it is boundary isolation.**

CE.4 traceability persists in the 40.5 packet record. It is not consumed by 40.6, but
it is not deleted either. Governance traceability for why a field was null (F-3 upstream
blockage vs F-1b pending input) exists at 40.5 level and is accessible from the run record.

The condition tier (what propagates) is causally traceable to the signal field value (or
null) that produced it. The causal chain is: signal field → binding rule → tier → condition
state → diagnosis → synthesis → delivery → comparison → directive. This chain is complete.

---

## 4. DOWNSTREAM PROPAGATION CHAIN

CE.2 governs the full downstream chain. CE.5 states the chain from the CE.5 perspective:

### 4.1 40.6 → 40.7 (condition state → diagnosis activation)

`condition_coverage_state` maps to `diagnosis_activation_state` per CE.2 DEC-014:
```
BLOCKED   → BLOCKED
DEGRADED  → ACTIVE
AT_RISK   → ACTIVE
STABLE    → INACTIVE
```

This mapping is governed and fixed. CE.5 does not alter it.

**CE.5 propagation constraint:** The tier produced by SC-001..SC-004 at 40.6 determines
exactly which DEC-014 mapping branch is taken. A BLOCKED tier from CS-002 (FIELD_BLOCKED)
and a BLOCKED tier from CS-003 (SIGNAL_BLOCKED) both map to diagnosis_activation_state=BLOCKED.
The distinction between CS-002 and CS-003 does not survive into 40.7. This is intentional:
40.7 diagnoses based on condition state, not on the signal field's blockage cause.

### 4.2 40.7 → 40.8 (diagnosis → synthesis → delivery)

CE.2 CE.2 synthesis logic maps diagnosis_activation_state to synthesis_state.
40.8 packages for delivery. CE.5 has no additional constraints at these layers.

**CE.5 propagation constraint:** CE.4 guarantees (INV-001..INV-007) ensure that the
40.5 packet is structurally complete and consistent. No CE.4 structural violation should
reach 40.7+. If it does, it is a CE.4 compliance failure, not a CE.5 failure.

### 4.3 40.9 → 40.10 (comparison → directive)

CE.2 governs comparison to baseline and directive generation. CE.5 has no additional
constraints at these layers.

**QA.3 validation:** Verified that a single-condition change propagates without loss or
amplification through 40.6 → 40.7 → 40.8 → 40.9 → 40.10. This validation confirms
CE.5 propagation semantics are correctly implemented in the CE.2-R01-MIX baseline.

---

## 5. PROPAGATION RULES

### Rule PR-001 — Causal completeness

Every condition state change at 40.6 MUST be traceable to a specific signal field
value change (or null introduction) in the 40.5 packet. No condition state change
may arise without a governed signal → tier → condition path.

**Governed by:** CE.2 DEC-001 (condition state derived from 40.5 signals only).

### Rule PR-002 — No amplification

A signal field change that produces a tier contribution for condition C MUST NOT
produce condition state changes in conditions other than those that bind to that
signal field. Cross-condition propagation via shared signal evaluation is isolated
per AG-002 and QA.4 validation.

**Validated:** QA.4 confirmed 0 over-propagation events across 6 unaffected entities
when shared signal SIG-002 was evaluated for COND-001 and COND-007.

### Rule PR-003 — No suppression

A signal field value that produces tier=BLOCKED for a condition MUST NOT be silently
ignored or downgraded. Every CS-002 and CS-003 consumption outcome produces
tier=BLOCKED in the aggregation pool. No consumption rule produces a lower tier for
a null or BLOCKED input.

### Rule PR-004 — No causal inversion

A signal field value that produces tier=AT_RISK MUST NOT produce tier=STABLE or lower
in the condition's aggregation. Tier assignment is value-reactive and deterministic
(DEC-013). A lower-tier contribution from another signal may dominate only if DEC-009
max-tier selects it — which it never would, since AT_RISK > STABLE.

**Clarification:** This rule prohibits implementation bugs where null-handling or
evaluation errors silently downgrade a legitimate AT_RISK or BLOCKED contribution.

### Rule PR-005 — Metadata isolation

CE.4 traceability metadata (`partiality_reasons`, `blocking_class`, etc.) MUST NOT
influence condition tier assignment, diagnosis activation, or any downstream layer.
These fields are read-only traceability artifacts at the 40.5 packet level.
Their content has no downstream routing effect within the governed PiOS layer chain.

### Rule PR-006 — No synthetic states

40.6 MUST NOT introduce new condition states beyond the CE.2 tier vocabulary
(BLOCKED, DEGRADED, AT_RISK, STABLE). It MUST NOT synthesize a new state from
multiple tier contributions (e.g., AT_RISK+BLOCKED → "PARTIALLY_BLOCKED").
DEC-009 max-tier is the only synthesis operation.

### Rule PR-007 — Boundary packet integrity

The 40.5 packet delivered to 40.6 MUST be treated as immutable. 40.6 MUST NOT
modify signal emission records in the packet during consumption. Field extraction
is read-only. The packet passes through 40.6 consumption intact.

---

## 6. CAUSAL LOSS TAXONOMY

The following are the governed forms of causal loss. CE.5 prohibits all of them.

| Loss type | Description | Prohibition rule |
|---|---|---|
| Silent BLOCKED suppression | A BLOCKED tier from CS-002/CS-003 fails to enter condition aggregation | PR-003 |
| Over-propagation | A tier contribution from condition A enters aggregation for condition B | PR-002 |
| Synthetic escalation | Tier from binding rule is escalated by observing CE.4 metadata | PR-005 |
| Null-to-zero substitution | A null field is treated as 0.0 and evaluated by a BASELINE_THRESHOLD rule | CI-001 (contract) |
| Metadata routing | blocking_class determines which binding rule is applied | CI-002 (contract) |
| State bleeding | Signal emission state (PARTIAL) is propagated as condition attribute into 40.7 | PR-006 |

---

## 7. PROPAGATION INTEGRITY CONFIRMATION — CE.2-R01-MIX

QA.3 validates full end-to-end propagation integrity:
- Single-field injection: SIG-004.total_edge_density 1.273 → 1.350
- Propagation: COND-002 STABLE → AT_RISK → INTEL-002 stable → synthesized
- 7 of 8 entities unchanged (zero over-propagation)
- No layer boundary loss between 40.6 → 40.7 → 40.8 → 40.9 → 40.10

CE.5 propagation rules PR-001..PR-007 are consistent with this validated behavior.

---

## 8. CONCLUSION

CE.5 defines 7 propagation rules (PR-001..PR-007) and a 6-class causal loss taxonomy.
The propagation model establishes:
- The handoff boundary: what crosses from 40.5 to 40.6, what is consumed, what is discarded
- The downstream chain: how condition state flows through 40.7 → 40.10 under CE.2
- Prohibited loss types: no amplification, suppression, inversion, synthetic states,
  metadata routing, or state bleeding

CE.2 QA.3 validation confirms the propagation model is correctly implemented in the
CE.2-R01-MIX baseline.
