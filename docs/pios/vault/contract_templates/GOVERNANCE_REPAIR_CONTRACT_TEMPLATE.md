# Governance Repair Contract Template

> **Use this template for fixing drift, broken links, stale state, lineage defects, or failed propagation.**

---

## CONTRACT — [STREAM-ID]

### FORMAT CLASS
EXECUTION_SPEC

### STREAM CLASSIFICATION
G1 — Architecture-Mutating (Repair)

Governance repair streams are always G1 because they modify vault state to correct it.

---

### MANDATORY LOAD LIST

Before execution, load:
- CLAUDE.md v3.0
- docs/governance/runtime/git_structure_contract.md
- docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
- docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md
- docs/pios/vault/operations/VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL.md
- [Affected vault pages — list based on drift scope]

---

### AMOPS PREFLIGHT

[Use standard G1 preflight block from G1_ARCHITECTURE_MUTATION_CONTRACT_TEMPLATE.md]

---

### DRIFT CLASSIFICATION

```
DRIFT REPORT
Date: [date]
Stream: [stream-id]

DRIFT TYPE: CONTENT / STRUCTURAL / TEMPORAL
SEVERITY: CRITICAL / HIGH / MEDIUM / LOW

AFFECTED VAULT FILES:
- [file path] — [what is drifted] — [severity]
- [file path] — [what is drifted] — [severity]

ROOT CAUSE:
[How the drift occurred — missed propagation, incomplete closure, etc.]
```

---

### REMEDIATION AUTHORITY

| Drift Type | Required Authority |
|---|---|
| Content drift (status, terminology) | Governance stream (this template) |
| Structural drift (missing pages) | This stream may add; governance to restructure |
| Temporal drift (stale dates) | This stream during post-flight |
| Broken wiki-links | This stream (mechanical fix) |
| Lineage defects | This stream with git verification |

---

### MISSION

[Describe what drift or defect this stream corrects and why.]

---

### SCOPE

Correction scope:
- [List specific vault files to be corrected]
- [List specific drift items to be resolved]

### NON-GOALS

- No new architectural concepts
- No scope expansion beyond drift correction
- No runtime or code changes

---

### MANDATORY OUTPUTS

- Corrected vault files
- Correction record in execution_report.md
- CLOSURE.md with Section 10

---

### CORRECTION RECORD FORMAT

For each drift item corrected:

```
DRIFT CORRECTION
Date: [date]
Stream: [stream-id]
Drift item: [description]
Severity: [CRITICAL/HIGH/MEDIUM/LOW]
Correction: [what was changed]
Vault files updated: [list]
Verification: [how correctness was verified]
```

---

### CLOSURE PROOF

CLOSURE.md must demonstrate:
1. All identified drift items addressed
2. Corrections verified against current codebase/git state
3. Cross-references repaired
4. Section 10 with full propagation verification
5. No new drift introduced by corrections

---

### FAIL-CLOSED CONDITIONS

Execution MUST STOP on:
- Correction would introduce new terminology collision
- Correction would contradict a different canonical vault page
- Drift root cause is ambiguous (cannot determine correct state)
- Correction scope exceeds declared scope

---

### MANDATORY RETURN FORMAT

[Standard 8-item return block]
