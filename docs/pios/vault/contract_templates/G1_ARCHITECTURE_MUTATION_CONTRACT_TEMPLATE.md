# G1 Architecture Mutation Contract Template

> **Use this template when a stream introduces, modifies, deprecates, or supersedes architectural concepts.**

---

## CONTRACT — [STREAM-ID]

### FORMAT CLASS
EXECUTION_SPEC

### STREAM CLASSIFICATION
G1 — Architecture-Mutating

### REASON FOR G1
[Describe which G1 criteria this stream meets:
- Introduces a new named concept
- Changes an existing concept's status
- Deprecates or supersedes an existing concept
- Modifies terminology definitions
- Changes layer ownership or boundaries
- Creates new branch patterns or runtime surfaces
- Modifies vault, AMOps, CLAUDE.md, or SKILLS.md]

---

### MANDATORY LOAD LIST

Before execution, load:
- CLAUDE.md v3.0
- docs/governance/runtime/git_structure_contract.md
- docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
- docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md
- [Concept-specific vault pages — list per CLAUDE_RUNTIME_LOAD_PROTOCOL.md Phase 4]

---

### AMOPS PREFLIGHT

```
ARCHITECTURE MEMORY PREFLIGHT
Date: [date]
Stream: [stream-id]
Classification: G1

LOAD VERIFICATION:
- CLAUDE.md loaded: YES / NO
- git_structure_contract.md loaded: YES / NO
- PIOS_CURRENT_CANONICAL_STATE.md loaded: YES / NO
- TERMINOLOGY_LOCK.md loaded: YES / NO
- Concept-specific pages loaded: [list] / NOT REQUIRED
- Branch authorized: YES / NO

STALENESS:
- Canonical state age: [days]
- Terminology age: [days]
- Last vault commit: [hash] — [date]

COMPATIBILITY:
- Term collisions: NONE / [list]
- Concept overlaps: NONE / [list]
- Boundary conflicts: NONE / [list]

BRANCH-DOMAIN:
- Branch: [branch-name]
- Authorization: PASS / FAIL
- Domain scope: PASS / FAIL

PREFLIGHT RESULT: PASS / WARN / FAIL
```

If PREFLIGHT RESULT = FAIL → STOP.

---

### ARCHITECTURE IMPACT DECLARATION

```
ARCHITECTURE IMPACT:
- Affected lineage zones: [list vault sections affected]
- Affected terminology: [new/changed/deprecated terms]
- Affected runtime boundaries: [layer/branch/surface changes]
- Affected canonical state: [status changes to tracked concepts]
```

---

### MISSION

[Describe what this stream produces and why.]

---

### SCOPE

[Define explicit boundaries.]

### NON-GOALS

[What this stream does NOT do.]

---

### MANDATORY OUTPUTS

[List all deliverables.]

---

### MUTATION TRACKING REQUIREMENT

During execution, maintain:

```
ARCHITECTURE MUTATION LOG
Stream: [stream-id]
Date: [date]

[1] [mutation-type]: [description]
[2] [mutation-type]: [description]
...
```

Mutation types: NEW_CONCEPT, STATUS_CHANGE, TERMINOLOGY, SUPERSESSION, BOUNDARY, GIT_LINEAGE

---

### FAIL-CLOSED CONDITIONS

Execution MUST STOP on:
- Vault files missing or corrupted
- Term collision with locked terms
- Branch unauthorized
- Cross-domain execution detected
- Canonical state >90 days stale
- Unauthorized architecture mutation

---

### MANDATORY CLOSURE

CLOSURE.md must include standard sections 1-9 plus:

**Section 10: Architecture Memory Propagation**

Required:
- Architecture Mutation Delta (full)
- Vault files updated (list with verification)
- Propagation verification (all checks)
- Propagation status: COMPLETE / PARTIAL / FAILED

Vault propagation order:
1. TERMINOLOGY_LOCK.md
2. SEMANTIC_COLLISIONS.md (if needed)
3. Lineage sections (vault/01-05)
4. PIOS_CURRENT_CANONICAL_STATE.md
5. Chronology tables
6. Git lineage (vault/09)
7. Runtime state (vault/10)
8. Archive (vault/12)

All vault updates must be committed before closure.

---

### MANDATORY RETURN FORMAT

```
STREAM [stream-id] — RETURN

1. Status: COMPLETE / INCOMPLETE / FAIL
2. Branch:
3. Commit hash:
4. Validation summary:
5. File change summary:
6. Governance confirmation:
7. Execution report path:
8. Validation log path:
```
