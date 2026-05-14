# Operational Bootstrap Entrypoint

> **The mandatory runtime entrypoint for all future architecture-sensitive streams.**

---

## 1. Purpose

This is the single operational entrypoint for any stream that touches architecture. Before this document, streams began with ad-hoc pre-flight checks. Now, every G1/G2 stream begins here.

This entrypoint operationalizes:
- Architecture memory preflight
- Stream classification
- Vault loading
- Branch authorization
- Drift detection
- Authority verification

---

## 2. Bootstrap Sequence

```
STEP 1: CONSTITUTION LOAD
  │
  ├─ Read CLAUDE.md
  ├─ Read docs/governance/runtime/git_structure_contract.md
  ├─ Verify branch authorized
  ├─ If unauthorized → STOP
  │
STEP 2: STREAM CLASSIFICATION
  │
  ├─ Read stream contract
  ├─ Invoke SKILL: STREAM_CLASSIFICATION
  ├─ Output: G1 / G2 / G3
  │
  ├─ [G3] → proceed with standard CLAUDE.md pre-flight only
  │
STEP 3: VAULT LOAD (G1/G2 only)
  │
  ├─ Read docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
  ├─ Read docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md
  ├─ [G1] Read concept-specific pages per CLAUDE_RUNTIME_LOAD_PROTOCOL.md Phase 4
  │
  ├─ If any mandatory file missing → FAIL CLOSED
  │
STEP 4: ARCHITECTURE MEMORY PREFLIGHT (G1/G2 only)
  │
  ├─ Load verification (all mandatory files in context?)
  ├─ Staleness check (canonical state age, terminology age)
  ├─ [G1] Compatibility check (terms, concepts, boundaries)
  ├─ Branch-domain check
  │
  ├─ PREFLIGHT RESULT: PASS / WARN / FAIL
  ├─ If FAIL → STOP
  ├─ If WARN → log acknowledgment, proceed
  │
STEP 5: AUTHORITY VERIFICATION (G1 only)
  │
  ├─ Verify stream has authority for planned mutations
  ├─ Verify no term collision with locked terms
  ├─ Verify no unauthorized supersession
  ├─ Verify no cross-domain execution
  │
  ├─ If any violation → STOP
  │
STEP 6: EXECUTION BEGINS
  │
  ├─ [G1] Begin architecture mutation log
  ├─ [G2] Begin reclassification watch
  ├─ Standard contract execution proceeds
```

---

## 3. Preflight Output Format

Every G1/G2 stream produces this preflight block in execution_report.md:

```
## Pre-Flight

| Check | Result |
|-------|--------|
| Branch | <branch-name> (<authorization-status>) |
| Contract type | <description> |
| git_structure_contract.md loaded | PASS / FAIL |
| Stream classification | G1 / G2 |
| PIOS_CURRENT_CANONICAL_STATE.md loaded | PASS / FAIL |
| TERMINOLOGY_LOCK.md loaded | PASS / FAIL |
| Canonical state age | <N> days |
| Terminology age | <N> days |
| Last vault commit | <hash> — <date> |
| Term collision check | CLEAR / COLLISION [details] |
| Branch authorization | PASS / FAIL |
| Domain scope | PASS / FAIL |
| No runtime mutation planned | VERIFIED / NOT VERIFIED |
| No grounding mutation planned | VERIFIED / NOT VERIFIED |
| No authority mutation planned | VERIFIED / NOT VERIFIED |

Architecture Memory Preflight: PASS / WARN / FAIL
```

---

## 4. Bootstrap Failure Modes

| Failure | Phase | Response |
|---|---|---|
| CLAUDE.md missing | Step 1 | CRITICAL — no execution possible |
| git_structure_contract.md missing | Step 1 | CRITICAL — no execution possible |
| Branch unauthorized | Step 1 | CRITICAL — STOP |
| Stream contract ambiguous for classification | Step 2 | Default to G2; reclassify if mutations detected |
| PIOS_CURRENT_CANONICAL_STATE.md missing | Step 3 | CRITICAL — STOP (for G1/G2) |
| TERMINOLOGY_LOCK.md missing | Step 3 | CRITICAL — STOP (for G1/G2) |
| Concept-specific pages missing | Step 3 | WARN — proceed with awareness (G1/G2) |
| Canonical state >90 days stale | Step 4 | HIGH — STOP |
| Canonical state >30 days stale | Step 4 | MEDIUM — WARN |
| Term collision detected | Step 4 | CRITICAL — STOP (resolve before proceeding) |
| Unauthorized mutation planned | Step 5 | CRITICAL — STOP |

---

## 5. Quick Reference Decision Tree

```
Is this stream architecture-sensitive?
├─ NO → G3 → standard CLAUDE.md pre-flight → execute
│
├─ YES → Does it mutate architecture?
│   ├─ YES → G1
│   │   ├─ Full vault load (Phases 1-4)
│   │   ├─ Full preflight (load + stale + compat + branch)
│   │   ├─ Authority verification
│   │   ├─ Mutation tracking during execution
│   │   ├─ Full post-flight propagation
│   │   └─ Full enforcement
│   │
│   └─ NO → G2
│       ├─ Core vault load (Phases 1-3)
│       ├─ Reduced preflight (load + stale + branch)
│       ├─ No mutation tracking (but reclassification watch)
│       ├─ No post-flight propagation
│       └─ Reduced enforcement
```

---

## 6. Integration Points

| System | Integration |
|---|---|
| CLAUDE.md §12.2 | Vault load mandate references this entrypoint |
| CLAUDE.md §12.3 | Preflight mandate references this entrypoint |
| CLAUDE.md §16 | Full AMOps lifecycle references this entrypoint |
| SKILLS.md (STREAM_CLASSIFICATION) | Classification skill invoked at Step 2 |
| SKILLS.md (ARCHITECTURE_MEMORY_SYNC) | Sync skill invoked at post-flight |
| Stream CLOSURE.md | Section 10 produced during post-flight |
| execution_report.md | Preflight block produced at Step 4 |

---

## 7. Mandatory Statement

**No G1 or G2 stream may begin execution without completing this bootstrap.**

Execution that begins without vault loading and preflight verification is unauthorized and produces untrustworthy outputs. The cost of bootstrap (~300 lines of context) is negligible compared to the cost of silent ontology drift.

---

## 8. Cross-References

- [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] — vault load phases
- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — preflight details
- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — full AMOps lifecycle
- [[G1_G2_G3_STREAM_TEMPLATE_SYSTEM]] — stream templates
- [[AMOPS_RUNTIME_ENFORCEMENT_MATRIX]] — obligation/failure matrix
- [[CLAUDE_RUNTIME_SELF_APPLICATION]] — how Claude applies this bootstrap
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — enforcement on bootstrap failure
