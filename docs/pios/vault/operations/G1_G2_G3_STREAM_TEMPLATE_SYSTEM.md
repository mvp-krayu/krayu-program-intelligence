# G1/G2/G3 Stream Template System

> **Mandatory lifecycle templates for every stream classification.**

---

## 1. Purpose

Every stream follows a lifecycle. The lifecycle obligations vary by classification (G1/G2/G3). This document provides the mandatory template for each classification so that no stream omits a required phase.

---

## 2. G1 Stream Template (Architecture-Mutating)

### PRE-FLIGHT

```
ARCHITECTURE MEMORY PREFLIGHT
Date: <date>
Stream: <stream-id>
Classification: G1

LOAD VERIFICATION:
- CLAUDE.md loaded: YES
- git_structure_contract.md loaded: YES
- PIOS_CURRENT_CANONICAL_STATE.md loaded: YES / NO
- TERMINOLOGY_LOCK.md loaded: YES / NO
- Concept-specific pages loaded: [list] / NOT REQUIRED
- Branch authorized: YES / NO

STALENESS:
- Canonical state age: <days>
- Terminology age: <days>
- Last vault commit: <hash> — <date>

COMPATIBILITY:
- Term collisions: NONE / [list]
- Concept overlaps: NONE / [list]
- Boundary conflicts: NONE / [list]
- Architecture Impact Declaration: PRESENT / MISSING

BRANCH-DOMAIN:
- Branch: <branch-name>
- Authorization: PASS / FAIL
- Domain scope: PASS / FAIL

PREFLIGHT RESULT: PASS / WARN / FAIL
```

If FAIL → STOP. If WARN → proceed with logged acknowledgment.

### EXECUTION

During execution, maintain:

**Architecture Mutation Log:**
```
ARCHITECTURE MUTATION LOG
Stream: <stream-id>
Date: <date>

[1] <mutation-type>: <description>
[2] <mutation-type>: <description>
...
```

Mutation types: NEW_CONCEPT, STATUS_CHANGE, TERMINOLOGY, SUPERSESSION, BOUNDARY, GIT_LINEAGE

**Detection rule:** If uncertain whether a change is architectural — apply the 5-question heuristic from STREAM_TO_VAULT_MUTATION_PROTOCOL.md §3.2.

### POST-FLIGHT

At closure, invoke SKILL: ARCHITECTURE_MEMORY_SYNC:

1. Review mutation log → verify completeness
2. Formalize mutation delta
3. Check terminology collisions
4. Update vault files (in propagation order)
5. Verify propagation
6. Produce CLOSURE Section 10

### PROPAGATION

Vault update order:
1. TERMINOLOGY_LOCK.md
2. SEMANTIC_COLLISIONS.md (if needed)
3. Lineage sections (vault/01-05)
4. PIOS_CURRENT_CANONICAL_STATE.md
5. Chronology tables
6. Git lineage (vault/09)
7. Runtime state (vault/10)
8. Archive (vault/12)

All updates committed before closure.

### ENFORCEMENT

```
ENFORCEMENT CHECKLIST (G1)
[ ] All mutation delta entries mapped to vault files
[ ] No orphan vault updates
[ ] Cross-references intact (wiki-links)
[ ] Terminology consistent
[ ] Canonical state updated
[ ] Chronology updated
[ ] Git lineage updated
[ ] CLOSURE Section 10 complete
[ ] Vault updates committed
```

Any unchecked item → FAIL CLOSED (unless classified as acceptable partial propagation).

---

## 3. G2 Stream Template (Architecture-Consuming)

### PRE-FLIGHT

```
ARCHITECTURE MEMORY PREFLIGHT
Date: <date>
Stream: <stream-id>
Classification: G2

LOAD VERIFICATION:
- CLAUDE.md loaded: YES
- git_structure_contract.md loaded: YES
- PIOS_CURRENT_CANONICAL_STATE.md loaded: YES / NO
- TERMINOLOGY_LOCK.md loaded: YES / NO
- Branch authorized: YES / NO

STALENESS:
- Canonical state age: <days>
- Terminology age: <days>
- Last vault commit: <hash> — <date>

BRANCH-DOMAIN:
- Branch: <branch-name>
- Authorization: PASS / FAIL
- Domain scope: PASS / FAIL

PREFLIGHT RESULT: PASS / WARN / FAIL
```

No compatibility check required (G2 does not plan mutations).

### EXECUTION

- Use vault-loaded terminology and canonical state
- No mutation tracking required
- **Reclassification watch:** If architecture mutation is detected during execution → STOP → reclassify as G1 → run full preflight → begin mutation tracking

### POST-FLIGHT

No vault propagation required (unless reclassified to G1).

Standard CLOSURE.md (sections 1-9). No Section 10 required.

### ENFORCEMENT

```
ENFORCEMENT CHECKLIST (G2)
[ ] Vault was loaded before execution
[ ] Terminology used correctly
[ ] No architecture mutations introduced
[ ] If reclassified to G1: full G1 enforcement applied
```

---

## 4. G3 Stream Template (Architecture-Unrelated)

### PRE-FLIGHT

```
STANDARD PREFLIGHT
Date: <date>
Stream: <stream-id>
Classification: G3

- CLAUDE.md loaded: YES
- git_structure_contract.md loaded: YES
- Branch authorized: YES / NO

PREFLIGHT RESULT: PASS / FAIL
```

No vault load required. No staleness check. No compatibility check.

### EXECUTION

Normal execution per CLAUDE.md constitution. No vault awareness required.

### POST-FLIGHT

Standard CLOSURE.md (sections 1-9). No vault propagation.

### ENFORCEMENT

Standard CLAUDE.md enforcement only. No AMOps enforcement.

---

## 5. Reclassification Protocol

### G2 → G1

Trigger: Architecture mutation detected during G2 execution.

Steps:
1. STOP current execution
2. Log reclassification trigger in execution_report.md
3. Load any missing Phase 4 vault pages
4. Run full preflight compatibility check
5. Begin mutation tracking from reclassification point
6. Resume execution as G1
7. At closure: full G1 post-flight and enforcement

### G3 → G2

Trigger: Stream discovers it needs vault-loaded concepts for correct execution.

Steps:
1. Load PIOS_CURRENT_CANONICAL_STATE.md and TERMINOLOGY_LOCK.md
2. Run G2 preflight
3. Log reclassification in execution_report.md
4. Continue as G2

### G3 → G1

Trigger: Stream discovers it is mutating architecture.

Steps:
1. Full G2 → G1 reclassification steps
2. Log as direct G3 → G1 transition

---

## 6. Template Usage

These templates are NOT optional formatting suggestions. They are mandatory lifecycle phases.

- A G1 stream without POST-FLIGHT is incomplete
- A G2 stream without PRE-FLIGHT is unauthorized
- A reclassification without logging is a governance violation

Enforcement authority: CLAUDE.md §16, FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT.md

---

## 7. Cross-References

- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps lifecycle definition
- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — preflight checklist details
- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — mutation tracking details
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — closure propagation details
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — enforcement details
- [[CLAUDE_RUNTIME_SELF_APPLICATION]] — how Claude applies these templates
