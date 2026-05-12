# Architecture Memory Operations Model (AMOps)

> **The complete lifecycle for keeping architecture cognition alive.**

---

## 1. Problem Statement

The vault at `docs/pios/vault/` contains 62 files of reconciled architecture memory. Without an operational lifecycle, this memory becomes stale within weeks. Every new stream, every runtime pivot, every terminology change that is not propagated to the vault degrades it from operational cognition into historical artifact.

AMOps exists to make architecture memory self-maintaining.

---

## 2. The AMOps Lifecycle

```
BOOTSTRAP ──→ PREFLIGHT ──→ EXECUTION ──→ POST-FLIGHT ──→ ENFORCEMENT
    ↑                                                          │
    └──────────────────── RELOAD ←─────────────────────────────┘
```

### BOOTSTRAP

Load canonical architecture state before any reasoning begins.

**Who:** Claude, ChatGPT, operators
**When:** Session start, stream start, branch entry
**Protocol:** [[CLAUDE_RUNTIME_LOAD_PROTOCOL]]

### PREFLIGHT

Verify that architecture load is complete and that planned work is compatible with current canonical state.

**Who:** Claude (mandatory), operators (recommended)
**When:** After bootstrap, before any execution
**Protocol:** [[ARCHITECTURE_MEMORY_PREFLIGHT]]

### EXECUTION

Perform stream work. Track architecture mutations as they occur. Bounded mutation — only the contract-authorized scope may mutate architecture state.

**Who:** Execution engine (Claude, operator)
**When:** During stream execution
**Protocol:** [[STREAM_TO_VAULT_MUTATION_PROTOCOL]]

### POST-FLIGHT

Propagate all architecture mutations to the vault. Update chronology, lineage, terminology, and canonical state.

**Who:** Execution engine (mandatory)
**When:** After stream execution, before CLOSURE.md
**Protocol:** [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]]

### ENFORCEMENT

Verify that all architecture mutations have been propagated. Fail closed if synchronization is missing.

**Who:** Automated (pre-commit validation, CLOSURE.md checklist)
**When:** At closure time
**Protocol:** [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]]

### RELOAD

Next session loads the updated vault state. The cycle repeats.

**Who:** Next execution engine session
**When:** Next session bootstrap
**Protocol:** [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] (same as BOOTSTRAP)

---

## 3. Architecture Mutation Classification

Not every stream mutates architecture. Classification:

### G1 — Architecture-Mutating Stream

A stream that introduces, modifies, deprecates, or supersedes architectural concepts.

**Detection criteria:**
- Introduces a new named concept (e.g., new state, new path, new engine)
- Changes an existing concept's status (PROVISIONAL → CANONICAL)
- Deprecates or supersedes an existing concept
- Modifies terminology definitions
- Changes layer ownership or boundaries
- Creates new branch patterns or runtime surfaces

**Vault obligation:** MANDATORY — all mutations must be propagated.

### G2 — Architecture-Consuming Stream

A stream that uses architectural concepts but does not change them.

**Detection criteria:**
- Implements behavior within existing architectural boundaries
- Adds features to existing surfaces
- Fixes bugs within existing components
- Extends existing extraction or rendering patterns

**Vault obligation:** NONE — no vault mutation required. But vault must be loaded for awareness.

### G3 — Architecture-Unrelated Stream

A stream with no architectural implications (CSS, documentation fixes, test improvements).

**Vault obligation:** NONE — no vault load or mutation required.

---

## 4. Stream Declaration Requirements

Every G1 stream contract SHOULD include an **Architecture Impact Declaration**:

```
ARCHITECTURE IMPACT:
- Affected lineage zones: [list vault sections affected]
- Affected terminology: [new/changed/deprecated terms]
- Affected runtime boundaries: [layer/branch/surface changes]
- Affected canonical state: [status changes to tracked concepts]
```

This declaration is advisory — if the stream author doesn't know the impact at contract time, the execution engine identifies it during post-flight.

---

## 5. The Mutation Delta

Every G1 stream produces an **architecture mutation delta** during post-flight:

```markdown
## Architecture Mutation Delta

### New Concepts
- [concept name] — [vault section] — [status: EMERGING/PROVISIONAL]

### Status Changes
- [concept name] — [old status] → [new status]

### Terminology
- [new term] — [definition] — [collision check: CLEAR/COLLISION]
- [changed term] — [old meaning] → [new meaning]

### Chronology
- [commit hash] — [date] — [event description] — [stratum]

### Supersessions
- [old concept] — superseded by → [new concept]

### Git Lineage
- [concept] — new commits: [hash list]
```

This delta drives vault updates during post-flight.

---

## 6. Ownership

| Responsibility | Owner |
|---|---|
| Vault content accuracy | Stream execution engine (at closure time) |
| Vault structure integrity | Governance streams only |
| Terminology lock authority | Governance streams only |
| Canonical promotion authority | Governance streams only |
| Chronology/lineage updates | Any G1 stream |

---

## 7. Integration Points

| System | Integration | Protocol |
|---|---|---|
| CLAUDE.md | Pre-flight step added | [[ARCHITECTURE_MEMORY_PREFLIGHT]] |
| SKILLS.md | AMOps skill added | SKILL: ARCHITECTURE_MEMORY_SYNC |
| Stream CLOSURE.md | Section 10 added (Architecture Memory) | [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] |
| Pre-flight | Architecture load check added | [[ARCHITECTURE_MEMORY_PREFLIGHT]] |
| Branch entry | Vault bootstrap added | [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] |

---

## 8. Cross-References

- [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] — how to load
- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — how to mutate
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — how to propagate
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — how to enforce
- [[VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL]] — how to detect staleness
