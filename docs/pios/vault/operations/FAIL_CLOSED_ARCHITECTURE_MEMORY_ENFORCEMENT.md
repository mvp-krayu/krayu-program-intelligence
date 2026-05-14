# Fail-Closed Architecture Memory Enforcement

> **What happens when architecture memory synchronization fails.**

---

## 1. Purpose

CLAUDE.md §3.3 defines fail-closed as the default response to violations. This protocol extends fail-closed to architecture memory operations — defining exactly when enforcement triggers, what it blocks, and how to recover.

---

## 2. Fail-Closed Principle

When architecture memory is corrupted, stale, missing, or contradictory:

**STOP → REPORT → DO NOT PROCEED**

Partial execution with bad architectural state is worse than no execution. A stream that silently uses wrong terminology, wrong status, or wrong lineage produces artifacts that must later be unwound — the cost of unwinding exceeds the cost of stopping.

---

## 3. Enforcement Trigger Conditions

### 3.1 Load Failures (BOOTSTRAP Phase)

| Condition | Severity | Action |
|---|---|---|
| PIOS_CURRENT_CANONICAL_STATE.md missing or unreadable | CRITICAL | STOP — cannot proceed without canonical state |
| TERMINOLOGY_LOCK.md missing or unreadable | CRITICAL | STOP — cannot proceed without terminology |
| Both files present but contradictory | CRITICAL | STOP — report contradiction |
| Concept-specific pages missing (Phase 4) | WARNING | Proceed with awareness, log in preflight |
| Vault directory does not exist | CRITICAL | STOP — vault infrastructure missing |

### 3.2 Preflight Failures (PREFLIGHT Phase)

| Condition | Severity | Action |
|---|---|---|
| Term collision detected between planned work and locked terms | CRITICAL | STOP — resolve collision before proceeding |
| Branch unauthorized | CRITICAL | STOP — per CLAUDE.md §12.1 |
| Cross-domain execution detected | CRITICAL | STOP — per CLAUDE.md §12.1 |
| Canonical state >90 days stale | HIGH | STOP — vault too stale for safe execution |
| Canonical state >30 days stale | MEDIUM | WARN — proceed with explicit acknowledgment |

### 3.3 Execution Failures (EXECUTION Phase)

| Condition | Severity | Action |
|---|---|---|
| G2 stream mutating architecture without reclassification | HIGH | STOP — reclassify as G1, run full preflight |
| Terminology used with wrong definition | HIGH | STOP — correct usage before continuing |
| Superseded concept treated as active | HIGH | STOP — update to current concept |
| Mutation made outside stream authorization scope | CRITICAL | STOP — unauthorized mutation |

### 3.4 Post-Flight Failures (POST-FLIGHT Phase)

| Condition | Severity | Action |
|---|---|---|
| G1 stream closing without mutation delta | CRITICAL | STOP — delta is mandatory for G1 |
| Mutation delta entries not mapped to vault files | HIGH | STOP — complete mapping before closure |
| PIOS_CURRENT_CANONICAL_STATE.md not updated after status changes | HIGH | STOP — update before closure |
| TERMINOLOGY_LOCK.md not updated after new terms | HIGH | STOP — update before closure |
| Vault updates not committed | HIGH | STOP — commit vault changes |

---

## 4. Enforcement Actions

### 4.1 CRITICAL — Execution Blocked

- Stream execution MUST NOT proceed or complete
- Violation logged in execution_report.md
- Operator notified with specific failure details
- Recovery action identified

### 4.2 HIGH — Execution Paused

- Stream execution pauses at current step
- Violation logged in execution_report.md
- Correction required before execution resumes
- If correction not possible → escalate to CRITICAL

### 4.3 MEDIUM — Execution Proceeds with Warning

- Warning logged in execution_report.md
- Execution continues with explicit awareness
- Warning tracked for post-flight review

### 4.4 WARNING — Informational

- Logged in execution_report.md
- No execution impact
- Tracked for governance awareness

---

## 5. Enforcement Report Format

Every enforcement action produces a structured report:

```
ARCHITECTURE MEMORY ENFORCEMENT
Date: <date>
Stream: <stream-id>
Phase: BOOTSTRAP / PREFLIGHT / EXECUTION / POST-FLIGHT
Severity: CRITICAL / HIGH / MEDIUM / WARNING

TRIGGER:
<specific condition that triggered enforcement>

EVIDENCE:
<what was expected vs what was found>

ACTION TAKEN:
BLOCKED / PAUSED / WARNED

RECOVERY PATH:
<specific steps to resolve>

VAULT STATE AT TRIGGER:
- Canonical state loaded: YES/NO
- Terminology loaded: YES/NO
- Last vault update: <date/commit>
```

---

## 6. Recovery Protocols

### 6.1 Missing Vault Files

1. Check if vault directory exists: `ls docs/pios/vault/`
2. Check if specific files exist: `ls docs/pios/vault/00_START_HERE/`
3. If vault exists but files missing → check git history for deletion
4. If vault does not exist → CRITICAL — vault infrastructure must be rebuilt
5. Recovery: restore from git or rebuild from most recent reconciliation stream

### 6.2 Stale Canonical State

1. Identify how stale: compare PIOS_CURRENT_CANONICAL_STATE.md dates against recent G1 stream closures
2. If <30 days: MEDIUM — proceed with awareness
3. If 30-90 days: HIGH — update canonical state before proceeding
4. If >90 days: CRITICAL — governance stream required for vault reconciliation
5. Recovery: run drift audit per [[VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL]], update canonical state

### 6.3 Term Collision

1. Identify colliding terms from TERMINOLOGY_LOCK.md comparison
2. Determine if collision is real (same term, different meaning) or apparent (same term, same meaning, different wording)
3. If real: CRITICAL — governance stream must resolve before stream proceeds
4. If apparent: MEDIUM — harmonize wording, proceed
5. Recovery: update TERMINOLOGY_LOCK.md with resolved definition, record in SEMANTIC_COLLISIONS.md

### 6.4 Missed Post-Flight Propagation

1. Identify which mutations were not propagated
2. Classify each as acceptable or unacceptable partial propagation (per [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] §5)
3. If unacceptable: the NEXT G1 stream must complete propagation before its own execution
4. Recovery: complete propagation, update CLOSURE.md Section 10

---

## 7. Fail-Closed vs Fail-Open Boundary

This protocol is explicitly **fail-closed**. The contrast:

| Scenario | Fail-Open (NOT this) | Fail-Closed (THIS) |
|---|---|---|
| Vault missing | Proceed without vault, hope for the best | STOP — vault is required |
| Terminology unclear | Use best guess from training data | STOP — load TERMINOLOGY_LOCK.md |
| Status uncertain | Assume canonical | STOP — verify against PIOS_CURRENT_CANONICAL_STATE.md |
| Lineage unknown | Fabricate plausible lineage | STOP — check vault and git |
| Post-flight skipped | Close stream, update vault later | STOP — propagate before closure |

Fail-open produces faster execution but corrupted architectural memory. Fail-closed produces slower execution but trustworthy architectural memory.

---

## 8. Cross-References

- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps enforcement phase
- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — preflight failure conditions feed into enforcement
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — post-flight failure conditions feed into enforcement
- [[VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL]] — drift detection triggers enforcement
- [[CHATGPT_AND_CLAUDE_CONSTRAINT_MODEL]] — enforcement applies to both AI systems
- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — mutation failures trigger enforcement
