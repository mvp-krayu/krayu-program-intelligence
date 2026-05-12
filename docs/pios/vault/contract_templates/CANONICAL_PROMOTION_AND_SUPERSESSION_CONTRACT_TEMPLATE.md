# Canonical Promotion and Supersession Contract Template

> **Use this template for promoting, demoting, superseding, deprecating, or failing concepts.**

---

## CONTRACT — [STREAM-ID]

### FORMAT CLASS
EXECUTION_SPEC

### STREAM CLASSIFICATION
G1 — Architecture-Mutating (Promotion/Supersession)

Status transitions are always G1 because they change canonical architectural state.

---

### MANDATORY LOAD LIST

Before execution, load:
- CLAUDE.md v3.0
- docs/governance/runtime/git_structure_contract.md
- docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
- docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md
- docs/pios/vault/operations/CANONICAL_PROMOTION_AND_SUPERSESSION_PROTOCOL.md
- [Lineage pages for affected concepts]

---

### AMOPS PREFLIGHT

[Use standard G1 preflight block from G1_ARCHITECTURE_MUTATION_CONTRACT_TEMPLATE.md]

---

### PROMOTION / SUPERSESSION DECLARATION

```
STATUS TRANSITION DECLARATION
Date: [date]
Stream: [stream-id]

TRANSITIONS:
| Concept | From | To | Evidence |
|---|---|---|---|
| [concept] | [old status] | [new status] | [why justified] |
```

---

### PROMOTION CRITERIA CHECK

For each PROVISIONAL → CANONICAL promotion:

| Criterion | Status |
|---|---|
| Concept survived ≥2 streams without modification | MET / NOT MET |
| At least 1 stream consumed/extended the concept | MET / NOT MET |
| Term locked in TERMINOLOGY_LOCK.md | MET / NOT MET |
| Git lineage documented | MET / NOT MET |
| No unresolved semantic collisions | MET / NOT MET |
| No open governance disputes | MET / NOT MET |

All criteria must be MET for promotion to proceed.

---

### SUPERSESSION CHAIN (if applicable)

```
SUPERSESSION CHAIN
[old concept] —superseded-by→ [new concept]
  Reason: [why]
  Date: [when]
  Stream: [authorizing stream]
  Consumers affected: [list]
  Migration: [how consumers should adapt]
```

---

### AUTHORITY CHECK

| Check | Result |
|---|---|
| Stream has governance authority | YES / NO |
| Replacement concept exists (for supersession) | YES / NO / N/A |
| Replacement concept is at least PROVISIONAL | YES / NO / N/A |
| All consumers identified | YES / NO |

If any required check = NO → STOP.

---

### MANDATORY VAULT UPDATES

| Vault File | Update |
|---|---|
| TERMINOLOGY_LOCK.md | [new/changed/deprecated terms] |
| PIOS_CURRENT_CANONICAL_STATE.md | [status changes] |
| [Concept lineage page] | [status update, supersession annotation] |
| SUPERSEDED_CONCEPTS.md (vault/12) | [if supersession — add chain] |
| DEPRECATED_TERMS.md | [if deprecation — add entry] |
| FAILED_ARCHITECTURAL_PATHS.md (vault/12) | [if failure — add entry] |
| [Git lineage page] (vault/09) | [commit/branch updates] |

---

### FAIL-CLOSED CONDITIONS

Execution MUST STOP on:
- Promotion criteria not met
- Supersession without replacement concept
- Competing promotions for same architectural space
- Terminology collision from promotion
- Governance authority not established

---

### MANDATORY CLOSURE

Standard sections 1-9 plus Section 10 with:
- Full promotion/supersession records
- All vault file updates listed
- Propagation verification
- Lineage verification

---

### MANDATORY RETURN FORMAT

[Standard 8-item return block]
