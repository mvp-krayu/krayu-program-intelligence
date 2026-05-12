# AMOps Runtime Enforcement Matrix

> **Explicit mapping between stream types, obligations, and failure conditions.**

---

## 1. Purpose

This matrix is the single-page reference for what every stream type owes to the vault, when enforcement triggers, and what happens on failure. It consolidates obligations scattered across multiple AMOps protocols into one operational lookup.

---

## 2. Stream Type → Obligation Matrix

### Vault Load Obligations

| Obligation | G1 | G2 | G3 |
|---|---|---|---|
| CLAUDE.md load | MANDATORY | MANDATORY | MANDATORY |
| git_structure_contract.md load | MANDATORY | MANDATORY | MANDATORY |
| PIOS_CURRENT_CANONICAL_STATE.md load | MANDATORY | MANDATORY | NOT REQUIRED |
| TERMINOLOGY_LOCK.md load | MANDATORY | MANDATORY | NOT REQUIRED |
| Concept-specific vault pages (Phase 4) | MANDATORY (for affected concepts) | RECOMMENDED | NOT REQUIRED |

### Preflight Obligations

| Obligation | G1 | G2 | G3 |
|---|---|---|---|
| Branch authorization check | MANDATORY | MANDATORY | MANDATORY |
| Load verification | MANDATORY | MANDATORY | NOT REQUIRED |
| Staleness check | MANDATORY | MANDATORY | NOT REQUIRED |
| Compatibility check (terms, concepts, boundaries) | MANDATORY | NOT REQUIRED | NOT REQUIRED |
| Architecture Impact Declaration | RECOMMENDED | NOT REQUIRED | NOT REQUIRED |
| Preflight logged in execution_report.md | MANDATORY | MANDATORY | STANDARD ONLY |

### Execution Obligations

| Obligation | G1 | G2 | G3 |
|---|---|---|---|
| Architecture mutation log | MANDATORY | NOT REQUIRED (watch for reclassification) | NOT REQUIRED |
| Terminology compliance | MANDATORY (locked definitions only) | MANDATORY (locked definitions only) | NOT APPLICABLE |
| Lineage grounding | MANDATORY (vault or git evidence) | RECOMMENDED | NOT APPLICABLE |
| Reclassification watch | NOT APPLICABLE (already G1) | MANDATORY | RECOMMENDED |

### Post-Flight Obligations

| Obligation | G1 | G2 | G3 |
|---|---|---|---|
| Architecture Mutation Delta | MANDATORY | NOT REQUIRED | NOT REQUIRED |
| Terminology collision check | MANDATORY | NOT REQUIRED | NOT REQUIRED |
| Vault propagation | MANDATORY (full order) | NOT REQUIRED | NOT REQUIRED |
| Propagation verification | MANDATORY | NOT REQUIRED | NOT REQUIRED |
| CLOSURE Section 10 | MANDATORY | NOT REQUIRED | NOT REQUIRED |
| Vault updates committed | MANDATORY | NOT REQUIRED | NOT REQUIRED |

### Synchronization Obligations

| Obligation | G1 | G2 | G3 |
|---|---|---|---|
| TERMINOLOGY_LOCK.md update | IF new/changed terms | NEVER | NEVER |
| PIOS_CURRENT_CANONICAL_STATE.md update | IF status changes | NEVER | NEVER |
| Lineage page updates (vault/01-05) | IF concept evolution | NEVER | NEVER |
| Chronology table updates | IF architectural events | NEVER | NEVER |
| Git lineage updates (vault/09) | IF new commits for concepts | NEVER | NEVER |
| Runtime state updates (vault/10) | IF boundary/ownership changes | NEVER | NEVER |
| Archive updates (vault/12) | IF supersession/deprecation | NEVER | NEVER |

### Lineage Obligations

| Obligation | G1 | G2 | G3 |
|---|---|---|---|
| Originating commit recorded | MANDATORY (for new concepts) | NOT APPLICABLE | NOT APPLICABLE |
| Key evolution commits recorded | MANDATORY | NOT APPLICABLE | NOT APPLICABLE |
| Branch history updated | MANDATORY (if branch events) | NOT APPLICABLE | NOT APPLICABLE |
| Stream reference added to lineage | MANDATORY | NOT APPLICABLE | NOT APPLICABLE |

---

## 3. Failure Condition Matrix

### Load Failures

| Condition | G1 Impact | G2 Impact | G3 Impact |
|---|---|---|---|
| PIOS_CURRENT_CANONICAL_STATE.md missing | CRITICAL — STOP | CRITICAL — STOP | No impact |
| TERMINOLOGY_LOCK.md missing | CRITICAL — STOP | CRITICAL — STOP | No impact |
| Vault directory missing | CRITICAL — STOP | CRITICAL — STOP | No impact |
| Concept-specific page missing | WARN — proceed with awareness | WARN — proceed | No impact |
| git_structure_contract.md missing | CRITICAL — STOP | CRITICAL — STOP | CRITICAL — STOP |

### Preflight Failures

| Condition | G1 Impact | G2 Impact | G3 Impact |
|---|---|---|---|
| Branch unauthorized | CRITICAL — STOP | CRITICAL — STOP | CRITICAL — STOP |
| Cross-domain execution | CRITICAL — STOP | CRITICAL — STOP | CRITICAL — STOP |
| Term collision detected | CRITICAL — STOP | N/A | N/A |
| Canonical state >90 days stale | HIGH — STOP | HIGH — STOP | No impact |
| Canonical state >30 days stale | MEDIUM — WARN | MEDIUM — WARN | No impact |

### Execution Failures

| Condition | G1 Impact | G2 Impact | G3 Impact |
|---|---|---|---|
| Architecture mutation without tracking | HIGH — STOP, begin tracking | HIGH — reclassify as G1 | WARN — consider reclassification |
| Terminology used incorrectly | HIGH — STOP, correct | HIGH — STOP, correct | No enforcement |
| Superseded concept treated as active | HIGH — STOP, update | HIGH — STOP, update | No enforcement |
| Unauthorized vault mutation | CRITICAL — STOP | CRITICAL — STOP | CRITICAL — STOP |

### Post-Flight Failures

| Condition | G1 Impact | G2 Impact | G3 Impact |
|---|---|---|---|
| Mutation delta missing | CRITICAL — STOP | N/A | N/A |
| Vault propagation incomplete | HIGH — complete before closure | N/A | N/A |
| CLOSURE Section 10 missing | CRITICAL — STOP | N/A | N/A |
| Vault updates uncommitted | HIGH — commit before closure | N/A | N/A |
| Terminology not propagated | HIGH — propagate before closure | N/A | N/A |
| Canonical state not updated | HIGH — update before closure | N/A | N/A |

---

## 4. Severity Definitions

| Severity | Meaning | Action | Execution Impact |
|---|---|---|---|
| CRITICAL | Architectural integrity at risk | STOP immediately | Execution blocked |
| HIGH | Significant drift or omission | Pause and correct | Execution paused |
| MEDIUM | Non-critical staleness or incompleteness | Warn and proceed | Execution continues with logging |
| LOW | Minor gap, non-misleading | Log for awareness | No execution impact |

---

## 5. Recovery Matrix

| Failure | Recovery Path | Authority |
|---|---|---|
| Vault files missing | Restore from git or rebuild via governance stream | Governance stream |
| Stale canonical state (<90 days) | Update PIOS_CURRENT_CANONICAL_STATE.md | Any G1 stream |
| Stale canonical state (>90 days) | Full vault reconciliation | Governance stream |
| Term collision | Resolve in TERMINOLOGY_LOCK.md + SEMANTIC_COLLISIONS.md | Governance stream |
| Missed post-flight propagation | Complete propagation in next G1 stream's first action | Next G1 stream |
| Drift detected | Correct per VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL.md | Per severity |
| Reclassification needed | Follow reclassification protocol | Current stream |

---

## 6. Cross-References

- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps lifecycle
- [[G1_G2_G3_STREAM_TEMPLATE_SYSTEM]] — stream templates using this matrix
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — detailed enforcement protocol
- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — preflight details
- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — mutation obligations detail
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — post-flight obligations detail
- [[VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL]] — drift detection detail
