# Vault Sync and Drift Audit Contract Template

> **Use this template for periodic vault synchronization and drift audit.**

---

## CONTRACT — [STREAM-ID]

### FORMAT CLASS
EXECUTION_SPEC

### STREAM CLASSIFICATION
G1 — Architecture-Mutating (Audit + Correction)

Drift audits are G1 because they may discover and correct vault state.

---

### MANDATORY LOAD LIST

Before execution, load:
- CLAUDE.md v3.0
- docs/governance/runtime/git_structure_contract.md
- docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
- docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md
- docs/pios/vault/operations/VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL.md

---

### AMOPS PREFLIGHT

[Use standard G1 preflight block from G1_ARCHITECTURE_MUTATION_CONTRACT_TEMPLATE.md]

---

### AUDIT SCOPE

```
DRIFT AUDIT SCOPE
Date: [date]
Stream: [stream-id]

Audit covers:
- [ ] Vault freshness (canonical state age, terminology age)
- [ ] Git lineage currency (vault references vs actual commits)
- [ ] Terminology drift (locked terms vs codebase usage)
- [ ] Broken wiki-links (unresolved [[targets]])
- [ ] Orphan concepts (vault pages with no codebase match)
- [ ] Stale canonical state (concepts listed but no longer active)
- [ ] Missing concepts (codebase patterns not in vault)
```

---

### AUDIT METHOD

Invoke SKILL: VAULT_DRIFT_AUDIT:

1. Load PIOS_CURRENT_CANONICAL_STATE.md
2. For each tracked concept: verify existence, status, terminology, git lineage
3. Scan vault for orphaned or unreferenced pages
4. Scan codebase for architectural patterns not in vault
5. Verify all wiki-links resolve
6. Produce drift report

---

### DRIFT REPORT FORMAT

```
## Vault Drift Report
### Date: [date]
### Auditor: [stream-id]

### Vault Freshness
| File | Last Updated | Age (days) | Status |
|---|---|---|---|
| PIOS_CURRENT_CANONICAL_STATE.md | [date] | [days] | FRESH/STALE/CRITICAL |
| TERMINOLOGY_LOCK.md | [date] | [days] | FRESH/STALE/CRITICAL |

### Content Drift
| Concept | Vault State | Actual State | Severity |
|---|---|---|---|

### Structural Drift
| Issue | Location | Severity |
|---|---|---|

### Temporal Drift
| Indicator | Last Updated | Gap | Severity |
|---|---|---|---|

### Broken Wiki-Links
| Source Page | Broken Link |
|---|---|

### Orphan Concepts
| Vault Page | Status | Recommendation |
|---|---|---|

### Missing Concepts
| Codebase Pattern | Vault Status | Recommendation |
|---|---|---|

### Summary
- Total drift items: [count]
- CRITICAL: [count]
- HIGH: [count]
- MEDIUM: [count]
- LOW: [count]
- Recommended action: SYNC / GOVERNANCE_REVIEW / ACCEPTABLE
```

---

### CORRECTION SCOPE

Based on audit findings:
- CRITICAL and HIGH items: correct in this stream
- MEDIUM items: correct if feasible, otherwise defer with record
- LOW items: record for next audit

---

### FAIL-CLOSED CONDITIONS

Execution MUST STOP on:
- Vault directory missing
- Canonical state contradicts code (CRITICAL drift with no clear resolution)
- Correction would introduce new collision or contradiction

---

### MANDATORY CLOSURE

Standard sections 1-9 plus Section 10 with:
- Full drift report
- Corrections applied
- Items deferred (with justification)
- Propagation verification

---

### MANDATORY RETURN FORMAT

[Standard 8-item return block]
