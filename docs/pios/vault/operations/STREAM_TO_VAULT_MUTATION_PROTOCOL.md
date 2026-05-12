# Stream-to-Vault Mutation Protocol

> **How architecture mutations flow from stream execution into the vault.**

---

## 1. Purpose

Every G1 stream (architecture-mutating) produces changes to architectural state. This protocol defines how those changes are captured during execution and propagated to the vault during post-flight.

Without this protocol, streams mutate architecture in code and contracts but the vault remains frozen at its last reconciliation state.

---

## 2. Mutation Scope

### What Counts as Architecture Mutation

| Category | Example | Vault Impact |
|---|---|---|
| New concept | New state class, new engine, new path | New entry in relevant lineage section |
| Status change | PROVISIONAL → CANONICAL | Update in PIOS_CURRENT_CANONICAL_STATE.md |
| Supersession | Old concept replaced by new | SUPERSEDED_CONCEPTS.md + lineage update |
| Terminology change | New term, changed definition | TERMINOLOGY_LOCK.md update |
| Layer boundary change | New layer, changed ownership | L0_L8_MODEL.md or CURRENT_CANONICAL_BOUNDARIES.md |
| Branch pattern change | New branch type, changed authorization | CURRENT_CANONICAL_BRANCHES.md |
| Runtime surface change | New surface, deprecated surface | CURRENT_RUNTIME_BOUNDARIES.md |

### What Does NOT Count

- Bug fixes within existing architecture
- CSS/UI changes with no architectural implication
- Test additions for existing behavior
- Documentation rewording without semantic change

---

## 3. Mutation Capture (During Execution)

### 3.1 Inline Tracking

During G1 stream execution, the execution engine MUST maintain an **architecture mutation log** — a running list of architecture changes as they occur.

Format:

```
ARCHITECTURE MUTATION LOG
Stream: <stream-id>
Date: <execution-date>

[1] NEW CONCEPT: <name> — <vault-section> — <status>
[2] STATUS CHANGE: <concept> — <old> → <new>
[3] TERMINOLOGY: <term> — <action: NEW/CHANGED/DEPRECATED>
[4] SUPERSESSION: <old-concept> → <new-concept>
[5] BOUNDARY: <what-changed> — <old-state> → <new-state>
```

### 3.2 Detection Heuristics

If the execution engine is uncertain whether a change is architectural:

1. Does it introduce a named concept that other streams will reference? → YES = mutation
2. Does it change how existing concepts relate to each other? → YES = mutation
3. Does it deprecate or supersede an existing named concept? → YES = mutation
4. Does it change terminology definitions? → YES = mutation
5. Does it only change behavior within existing boundaries? → NO = not mutation

---

## 4. Mutation Delta (Post-Flight)

At stream closure, the mutation log is formalized into an **Architecture Mutation Delta**:

```markdown
## Architecture Mutation Delta

### Stream
<stream-id> — <date> — <commit-hash>

### New Concepts
- [concept] — [vault section] — [status: EMERGING/PROVISIONAL]

### Status Changes
- [concept] — [old status] → [new status]

### Terminology
- [term] — [action] — [definition] — [collision check: CLEAR/COLLISION]

### Chronology
- [commit] — [date] — [event] — [stratum]

### Supersessions
- [old concept] — superseded by → [new concept]

### Git Lineage
- [concept] — new commits: [hash list]

### Vault Files Requiring Update
- [file path] — [what to update]
```

---

## 5. Vault Propagation (Post-Flight)

### 5.1 Propagation Order

Vault updates MUST follow this order to maintain consistency:

1. **TERMINOLOGY_LOCK.md** — new/changed terms first (other updates may reference them)
2. **SEMANTIC_COLLISIONS.md** — if any collision detected
3. **Lineage sections** (vault/01–05) — concept evolution pages
4. **PIOS_CURRENT_CANONICAL_STATE.md** — current state summary
5. **Chronology tables** — date-anchored event records
6. **Git lineage sections** (vault/09) — commit/branch updates
7. **Runtime state sections** (vault/10) — if boundaries/ownership changed
8. **Archive sections** (vault/12) — if anything superseded/deprecated

### 5.2 Propagation Rules

- Every entry in the mutation delta MUST map to at least one vault file update
- No vault file may be updated without a corresponding mutation delta entry
- If a mutation delta entry has no clear vault target → create a new vault page or flag for governance review
- Cross-references ([[wiki-links]]) MUST be added bidirectionally

### 5.3 Propagation Verification

After propagation, verify:

| Check | Method |
|---|---|
| All delta entries mapped | Each delta line has a vault file target |
| No orphan updates | Each vault change traces to a delta entry |
| Cross-references intact | New pages linked from relevant existing pages |
| Terminology consistent | New terms used consistently across all updated pages |
| Canonical state current | PIOS_CURRENT_CANONICAL_STATE.md reflects all changes |

---

## 6. G2 Stream Obligations

G2 streams (architecture-consuming) do NOT produce mutation deltas. However:

- G2 streams MUST load the vault (per [[CLAUDE_RUNTIME_LOAD_PROTOCOL]])
- If a G2 stream discovers that it IS mutating architecture → reclassify as G1 and begin mutation tracking
- Reclassification MUST be logged in execution_report.md

---

## 7. Conflict Resolution

If a mutation delta conflicts with existing vault state:

1. **Term collision** → flag in SEMANTIC_COLLISIONS.md, do NOT overwrite existing definition
2. **Status contradiction** → the more recent stream wins IF it has governance authority
3. **Lineage conflict** → both lineages preserved, conflict documented
4. **Supersession dispute** → governance stream required to resolve

Conflicts that cannot be resolved → FAIL CLOSED → governance stream required.

---

## 8. Cross-References

- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps lifecycle context
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — closure-time integration
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — what happens when propagation fails
- [[CANONICAL_PROMOTION_AND_SUPERSESSION_PROTOCOL]] — how promotions flow through this protocol
- [[VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL]] — detecting missed propagations
