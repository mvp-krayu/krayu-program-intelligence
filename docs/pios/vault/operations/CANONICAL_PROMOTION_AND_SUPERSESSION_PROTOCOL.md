# Canonical Promotion and Supersession Protocol

> **How concepts gain authority and how old concepts yield to new ones.**

---

## 1. Purpose

Architectural concepts move through a lifecycle: they emerge, stabilize, and eventually may be superseded. This protocol defines how those transitions are governed, recorded, and enforced.

Without this protocol, concept status is informal — "everyone knows" that PATH A replaced the old extraction model, but no record captures the authority transfer.

---

## 2. Concept Status Taxonomy

| Status | Meaning | Vault Treatment |
|---|---|---|
| EMERGING | Recently introduced, not yet validated | Documented with lineage, flagged as unstable |
| PROVISIONAL | Validated in execution, not yet promoted | Documented, may be referenced but not authoritative |
| CANONICAL | Promoted to architectural truth | Authoritative, locked terminology, full lineage |
| DORMANT | Not actively used but not superseded | Preserved in lineage, not in current state |
| SUPERSEDED | Replaced by a newer concept | Moved to archive, supersession chain documented |
| DEPRECATED | Marked for removal, no replacement | Moved to DEPRECATED_TERMS.md, removal timeline set |
| FAILED | Attempted and abandoned | Documented in FAILED_ARCHITECTURAL_PATHS.md |

---

## 3. Promotion Protocol

### 3.1 Promotion Authority

Only governance-class streams may promote concepts. Specifically:

- EMERGING → PROVISIONAL: any G1 stream that validates the concept in execution
- PROVISIONAL → CANONICAL: governance stream only, with evidence of stability
- Any status → SUPERSEDED: governance stream only, with replacement identified
- Any status → DEPRECATED: governance stream only, with rationale documented

### 3.2 Promotion Criteria

For PROVISIONAL → CANONICAL promotion:

| Criterion | Requirement |
|---|---|
| Stability | Concept survived at least 2 streams without modification |
| Consumption | At least 1 stream has consumed/extended the concept |
| Terminology | Term is locked in TERMINOLOGY_LOCK.md |
| Lineage | Git lineage documented with originating commits |
| No collisions | No unresolved semantic collisions |
| No active disputes | No open governance questions about the concept |

### 3.3 Promotion Record

Every promotion MUST produce:

```
PROMOTION RECORD
Date: <date>
Stream: <authorizing-stream-id>
Concept: <concept-name>
From: <old-status>
To: <new-status>
Evidence: <why this promotion is justified>
Vault updates: <list of vault files updated>
```

This record is included in the stream's Architecture Mutation Delta.

---

## 4. Supersession Protocol

### 4.1 Supersession Requirements

A concept may only be superseded when:

1. A replacement concept exists and is at least PROVISIONAL
2. The replacement concept covers the same architectural need
3. The supersession is declared in a governance stream
4. All consumers of the old concept have been identified
5. Migration path is documented (or irrelevance is confirmed)

### 4.2 Supersession Chain

Every supersession creates a chain:

```
[old concept] —superseded-by→ [new concept]
  Reason: <why>
  Date: <when>
  Stream: <which stream authorized>
  Consumers affected: <list>
  Migration: <how consumers should adapt>
```

This chain is recorded in:
- SUPERSEDED_CONCEPTS.md (vault/12)
- The old concept's lineage page (marked SUPERSEDED)
- The new concept's lineage page (marked as successor)
- PIOS_CURRENT_CANONICAL_STATE.md (old concept removed, new concept listed)

### 4.3 Supersession Does Not Delete

Superseded concepts are NEVER deleted from the vault. They are:
- Moved to archive status
- Marked with supersession metadata
- Cross-referenced to their replacement
- Preserved for lineage traversal

---

## 5. Demotion Protocol

### 5.1 CANONICAL → DORMANT

When a canonical concept is no longer actively consumed but has not been replaced:

- Status changes to DORMANT
- Concept remains in vault lineage sections
- Concept removed from PIOS_CURRENT_CANONICAL_STATE.md active listings
- Re-activation requires a new promotion through PROVISIONAL

### 5.2 Any Status → DEPRECATED

When a concept is marked for removal:

- Added to DEPRECATED_TERMS.md with removal rationale
- Removal timeline established (immediate or deferred)
- All consumers identified and warned
- Term collision risk assessed (will the freed term be reused?)

### 5.3 Any Status → FAILED

When an approach is abandoned:

- Documented in FAILED_ARCHITECTURAL_PATHS.md
- Failure analysis recorded: what was tried, why it failed, what replaced it
- Lesson extracted for future reference

---

## 6. Promotion Conflicts

### 6.1 Competing Promotions

If two streams attempt to promote different concepts to CANONICAL for the same architectural need:

1. Neither promotion proceeds
2. Conflict documented in both streams' execution reports
3. Governance stream required to resolve

### 6.2 Premature Promotion

If a concept is promoted to CANONICAL but subsequently found to be unstable:

1. Demotion to PROVISIONAL (not EMERGING — the concept has been validated)
2. Demotion record with rationale
3. Consumers notified via vault update
4. Original promotion record preserved (not deleted) with demotion annotation

---

## 7. Cross-References

- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — how promotions flow through mutation
- [[VAULT_MUTATION_RULES]] — governance authority for promotions
- [[CANONICAL_PROMOTION_PROTOCOL]] — existing vault governance (section 11)
- [[SUPERSEDED_CONCEPTS]] — archive of superseded concepts
- [[FAILED_ARCHITECTURAL_PATHS]] — archive of failed approaches
- [[TERMINOLOGY_LOCK]] — term locking as promotion prerequisite
