# G3 Standard Execution Contract Template

> **Use this template when a stream has no architectural implications.**

---

## CONTRACT — [STREAM-ID]

### FORMAT CLASS
EXECUTION_SPEC

### STREAM CLASSIFICATION
G3 — Architecture-Unrelated

### REASON FOR G3
[Describe why this stream has no architectural implications:
- CSS/UI changes with no architectural meaning
- Documentation rewording without semantic change
- Test additions for existing behavior
- Bug fixes that don't change architectural boundaries]

---

### STANDARD PREFLIGHT

```
STANDARD PREFLIGHT
Date: [date]
Stream: [stream-id]
Classification: G3

- CLAUDE.md loaded: YES
- git_structure_contract.md loaded: YES
- Branch authorized: YES / NO

PREFLIGHT RESULT: PASS / FAIL
```

No vault load required.
No staleness check required.
No compatibility check required.

---

### MISSION

[Describe what this stream produces and why.]

---

### SCOPE

[Define explicit boundaries.]

---

### MANDATORY OUTPUTS

[List all deliverables.]

---

### RECLASSIFICATION TRIGGERS

If during execution any of the following emerge, reclassify:

**G3 → G2** (architecture scope discovered):
- Stream needs vault-loaded concepts for correct execution
- Load PIOS_CURRENT_CANONICAL_STATE.md and TERMINOLOGY_LOCK.md
- Run G2 preflight
- Continue as G2

**G3 → G1** (architecture mutation discovered):
- Stream is introducing or changing architectural concepts
- Full G1 reclassification: load vault, run preflight, begin mutation tracking
- Continue as G1 with full G1 obligations

---

### FAIL-CLOSED CONDITIONS

Execution MUST STOP on:
- Branch unauthorized
- Cross-domain execution detected

---

### MANDATORY CLOSURE

Standard CLOSURE.md sections 1-9.

No vault propagation required.
No Section 10 required.

If reclassified: follow obligations of new classification.

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
