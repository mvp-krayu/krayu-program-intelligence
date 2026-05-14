# Git Lineage and Branch Propagation Protocol

> **How commit and branch history flows into the vault.**

---

## 1. Purpose

The vault's git lineage sections (vault/09) anchor architectural concepts to specific commits, branches, and streams. This protocol defines how git events are captured and propagated to maintain that anchoring.

Without git lineage propagation, the vault loses its most concrete evidence: the commits that actually created, changed, or superseded architectural concepts.

---

## 2. What Gets Tracked

### 2.1 Commit-Level Tracking

For each architectural concept, the vault tracks:

| Data | Example | Where Recorded |
|---|---|---|
| Originating commit | d3117bc (2026-03-10) | Concept's lineage page |
| Key evolution commits | [hash list with dates] | Concept's lineage page |
| Current head commit | Latest commit touching concept | Git lineage section (vault/09) |
| Supersession commit | Commit where concept was replaced | SUPERSEDED_CONCEPTS.md |

### 2.2 Branch-Level Tracking

For each architectural concept, the vault tracks:

| Data | Example | Where Recorded |
|---|---|---|
| Originating branch | feature/path-a-grounding | Concept's lineage page |
| Active branches | Branches currently extending concept | CURRENT_CANONICAL_BRANCHES.md |
| Merged branches | Branches that contributed to concept | Git lineage section (vault/09) |
| Violation branches | Branches that operated outside authorization | FAILED_ARCHITECTURAL_PATHS.md |

### 2.3 Stream-Level Tracking

For each architectural concept, the vault tracks:

| Data | Example | Where Recorded |
|---|---|---|
| Originating stream | PI.PIOS.PATH-A.01 | Concept's lineage page |
| Consuming streams | Streams that used concept | Concept's lineage page |
| Mutating streams | Streams that changed concept | Concept's lineage page |
| Superseding stream | Stream that replaced concept | SUPERSEDED_CONCEPTS.md |

---

## 3. Propagation Triggers

### 3.1 Automatic (Every G1 Stream Closure)

At G1 stream closure, the Architecture Mutation Delta includes a git lineage section:

```
### Git Lineage
- [concept] — new commits: [hash list]
- [concept] — branch: [branch-name] — status: [active/merged/abandoned]
- [concept] — stream: [stream-id] — relation: [originated/consumed/mutated/superseded]
```

This section drives vault/09 updates during post-flight.

### 3.2 Manual (Governance Audit)

A governance stream may perform a full git lineage audit:

1. For each concept in PIOS_CURRENT_CANONICAL_STATE.md
2. Run `git log --all --oneline -- <files-related-to-concept>`
3. Compare against vault/09 lineage page
4. Add missing commits/branches/streams
5. Mark completed audit date

---

## 4. Branch Propagation Rules

### 4.1 Branch Creation

When a new branch is created that carries architectural implications:

- Record in CURRENT_CANONICAL_BRANCHES.md
- Note authorization status (per git_structure_contract.md)
- Link to the stream that authorized the branch

### 4.2 Branch Merge

When a branch merges to main or a parent branch:

- Update the concept's lineage page with merge commit
- Update CURRENT_CANONICAL_BRANCHES.md (branch no longer active)
- If the merge introduces architectural changes → trigger G1 post-flight

### 4.3 Branch Abandonment

When a branch is abandoned without merge:

- If the branch carried architectural work → document in FAILED_ARCHITECTURAL_PATHS.md
- Update CURRENT_CANONICAL_BRANCHES.md (branch marked abandoned)
- Preserve the branch reference for lineage (do not delete branch history)

---

## 5. Lineage Page Format

Each vault/09 lineage page follows this structure:

```markdown
# [Concept] Git Lineage

## Originating
- Branch: <branch-name>
- Stream: <stream-id>
- Commit: <hash> — <date> — <description>

## Key Commits
| Hash | Date | Description | Type |
|---|---|---|---|
| <hash> | <date> | <what changed> | ORIGIN/EVOLUTION/SUPERSESSION |

## Branch History
| Branch | Status | Stream | Dates |
|---|---|---|---|
| <branch> | active/merged/abandoned | <stream-id> | <start> → <end> |

## Consuming Streams
- <stream-id> — <how it used this concept>

## Current State
- Status: CANONICAL / PROVISIONAL / SUPERSEDED / etc.
- Head commit: <latest hash>
- Active branch: <branch if any>
```

---

## 6. Lineage Integrity Checks

### 6.1 Forward Integrity

Every concept's originating commit MUST exist in git history:

```bash
git cat-file -t <hash>  # must return "commit"
```

If a referenced commit does not exist → flag as LINEAGE_INTEGRITY_VIOLATION.

### 6.2 Chain Integrity

Every concept's lineage chain MUST be continuous:

- Originating commit → evolution commits → current head
- No gaps in the chain
- Each commit in the chain MUST reference files related to the concept

### 6.3 Branch Integrity

Every referenced branch MUST be accounted for:

- Active branches exist in remote
- Merged branches have merge commits
- Abandoned branches are documented with rationale

---

## 7. Cross-References

- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — mutation delta's git lineage section
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — when lineage propagation happens
- [[PATH_A_LINEAGE]] — example lineage page (vault/09)
- [[PATH_B_LINEAGE]] — example lineage page (vault/09)
- [[SQO_LINEAGE]] — example lineage page (vault/09)
- [[CURRENT_CANONICAL_BRANCHES]] — branch state tracking (vault/10)
