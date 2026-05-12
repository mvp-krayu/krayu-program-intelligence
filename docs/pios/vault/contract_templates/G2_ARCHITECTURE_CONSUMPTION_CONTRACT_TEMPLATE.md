# G2 Architecture Consumption Contract Template

> **Use this template when a stream uses architectural concepts without changing them.**

---

## CONTRACT — [STREAM-ID]

### FORMAT CLASS
EXECUTION_SPEC

### STREAM CLASSIFICATION
G2 — Architecture-Consuming

### REASON FOR G2
[Describe what architectural concepts are consumed:
- Implements within existing architectural boundaries
- Adds features to existing surfaces
- Fixes bugs within existing components
- Extends existing patterns without renaming]

---

### MANDATORY LOAD LIST

Before execution, load:
- CLAUDE.md v3.0
- docs/governance/runtime/git_structure_contract.md
- docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
- docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md

---

### AMOPS PREFLIGHT (REDUCED)

```
ARCHITECTURE MEMORY PREFLIGHT
Date: [date]
Stream: [stream-id]
Classification: G2

LOAD VERIFICATION:
- CLAUDE.md loaded: YES / NO
- git_structure_contract.md loaded: YES / NO
- PIOS_CURRENT_CANONICAL_STATE.md loaded: YES / NO
- TERMINOLOGY_LOCK.md loaded: YES / NO
- Branch authorized: YES / NO

STALENESS:
- Canonical state age: [days]
- Terminology age: [days]
- Last vault commit: [hash] — [date]

BRANCH-DOMAIN:
- Branch: [branch-name]
- Authorization: PASS / FAIL
- Domain scope: PASS / FAIL

PREFLIGHT RESULT: PASS / WARN / FAIL
```

If PREFLIGHT RESULT = FAIL → STOP.

No compatibility check required (G2 does not plan mutations).

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

### RECLASSIFICATION WATCH

If during execution, architecture mutation is detected:
1. STOP
2. Reclassify as G1
3. Load missing concept-specific vault pages
4. Run full preflight compatibility check
5. Begin mutation tracking
6. Log reclassification in execution_report.md
7. Resume as G1 with full G1 obligations

---

### FAIL-CLOSED CONDITIONS

Execution MUST STOP on:
- Vault files missing or corrupted
- Branch unauthorized
- Cross-domain execution detected
- Canonical state >90 days stale
- Architecture mutation detected without reclassification

---

### MANDATORY CLOSURE

Standard CLOSURE.md sections 1-9.

No Section 10 required unless reclassified to G1.

If reclassified to G1: full G1 closure obligations apply.

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
