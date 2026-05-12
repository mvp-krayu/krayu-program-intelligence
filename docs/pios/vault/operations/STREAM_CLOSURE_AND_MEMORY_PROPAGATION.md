# Stream Closure and Memory Propagation

> **The mandatory closure-time protocol for synchronizing architecture mutations to the vault.**

---

## 1. Purpose

Stream closure is the last opportunity to propagate architecture mutations to the vault. If propagation is skipped at closure, the vault drifts from architectural reality and subsequent sessions load stale state.

This protocol makes vault synchronization a mandatory closure step — not optional post-hoc cleanup.

---

## 2. When This Protocol Applies

| Stream Type | Vault Propagation Required |
|---|---|
| G1 (architecture-mutating) | MANDATORY — all mutations must propagate |
| G2 (architecture-consuming) | CONDITIONAL — only if reclassified to G1 during execution |
| G3 (architecture-unrelated) | NOT REQUIRED |

---

## 3. Closure Sequence with Memory Propagation

The standard CLOSURE.md format (CLAUDE.md §5.4) has 9 sections. Architecture memory propagation adds a mandatory Section 10 for G1 streams:

```
## 10. Architecture Memory Propagation

### Stream Classification
G1 / G2 (reclassified) / G3

### Architecture Mutation Delta
[Full delta per STREAM_TO_VAULT_MUTATION_PROTOCOL format]

### Vault Files Updated
| File | Change | Verified |
|---|---|---|
| <vault-file-path> | <what changed> | YES/NO |

### Propagation Verification
| Check | Result |
|---|---|
| All delta entries mapped to vault files | PASS/FAIL |
| No orphan vault updates | PASS/FAIL |
| Cross-references intact | PASS/FAIL |
| Terminology consistent | PASS/FAIL |
| Canonical state updated | PASS/FAIL |
| Chronology updated | PASS/FAIL |
| Git lineage updated | PASS/FAIL |

### Propagation Status
COMPLETE / PARTIAL / FAILED

If PARTIAL or FAILED:
- Items not propagated: [list]
- Reason: [why]
- Remediation: [what must happen next]
```

---

## 4. Propagation Steps

### Step 1: Finalize Mutation Delta

At closure time, review the architecture mutation log maintained during execution:

1. Confirm all architectural changes are captured
2. Formalize into Architecture Mutation Delta format
3. Perform collision check against TERMINOLOGY_LOCK.md for any new terms

### Step 2: Update Vault Files

Following the propagation order defined in [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] §5.1:

1. TERMINOLOGY_LOCK.md — new/changed terms
2. SEMANTIC_COLLISIONS.md — if collisions detected
3. Lineage sections (vault/01-05) — concept evolution
4. PIOS_CURRENT_CANONICAL_STATE.md — current state summary
5. Chronology tables — date-anchored events
6. Git lineage sections (vault/09) — commit/branch updates
7. Runtime state sections (vault/10) — boundary/ownership changes
8. Archive sections (vault/12) — superseded/deprecated items

### Step 3: Verify Propagation

Run the propagation verification checklist (Section 3 above).

### Step 4: Record in CLOSURE.md

Add Section 10 to the stream's CLOSURE.md with the full propagation record.

### Step 5: Commit Vault Changes

Vault updates MUST be committed as part of the stream's final commit or as a dedicated vault-sync commit. They MUST NOT be left uncommitted.

---

## 5. Partial Propagation

If not all mutations can be propagated at closure time:

### 5.1 Acceptable Partial Propagation

- Lineage pages missing minor commit references (LOW drift)
- Chronology missing non-critical events
- Cross-references incomplete for newly created pages

### 5.2 Unacceptable Partial Propagation

- New canonical concepts not added to PIOS_CURRENT_CANONICAL_STATE.md
- New terms not added to TERMINOLOGY_LOCK.md
- Superseded concepts still listed as active
- Status changes not recorded

### 5.3 Handling Unacceptable Partial Propagation

If unacceptable partial propagation is detected:

1. CLOSURE.md Section 10 status: PARTIAL
2. List all unpropagated items
3. The NEXT G1 stream MUST complete the propagation as its first post-flight action
4. [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] applies

---

## 6. Memory Propagation for Reclassified Streams

If a G2 stream is reclassified as G1 during execution:

1. The mutation log begins at the point of reclassification
2. Full preflight compatibility check runs at reclassification time
3. All mutations from reclassification onward are captured
4. Closure Section 10 notes the reclassification:

```
### Stream Classification
G2 → G1 (reclassified at [point in execution])
Reclassification trigger: [what caused it]
```

---

## 7. Integration with Existing Closure

### 7.1 CLOSURE.md §5 (Validation)

Architecture memory propagation verification becomes part of validation:

```
| Architecture memory propagation | PASS/FAIL |
```

A FAIL in propagation verification makes the stream's validation section include a FAIL entry.

### 7.2 CLOSURE.md §8 (Artifacts)

Vault files updated during propagation are listed in artifacts:

```
- Vault updates: [list of updated vault files]
```

### 7.3 CLOSURE.md §9 (Ready State)

Ready state includes vault synchronization status:

```
Architecture memory: SYNCHRONIZED / PARTIAL / UNSYNCHRONIZED
```

---

## 8. Cross-References

- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — mutation delta format and propagation order
- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps post-flight phase
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — what happens when propagation fails
- [[VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL]] — detecting missed propagations
- [[STREAM_CLOSURE_PROPAGATION]] — existing vault governance (section 11)
- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — preflight catches missed propagation from prior streams
