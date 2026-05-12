# Architecture Memory Preflight

> **Mandatory checks after vault loading, before any execution begins.**

---

## 1. Purpose

Preflight verifies that the vault load completed correctly and that the planned work is compatible with current canonical state. It sits between BOOTSTRAP and EXECUTION in the AMOps lifecycle.

Preflight catches:
- Incomplete vault loads
- Stale canonical state
- Terminology conflicts before they propagate
- Unintended architecture mutations
- Branch/domain violations

---

## 2. When Preflight Runs

| Trigger | Required |
|---|---|
| Session start with architecture scope | YES |
| Stream start (any G1 stream) | YES |
| Stream start (G2 stream) | YES (reduced checklist) |
| Stream start (G3 stream) | NO |
| Mid-stream reclassification (G2 → G1) | YES (full checklist) |
| Branch switch during session | YES |

---

## 3. Preflight Checklist

### 3.1 Load Verification

| Check | How | Fail Action |
|---|---|---|
| PIOS_CURRENT_CANONICAL_STATE.md loaded | Content present in context | STOP — reload |
| TERMINOLOGY_LOCK.md loaded | Content present in context | STOP — reload |
| Branch authorized | Checked against git_structure_contract.md | STOP — report violation |
| Concept-specific pages loaded (if needed) | Phase 4 pages present for stream scope | WARN — load missing pages |

### 3.2 Staleness Check

| Check | How | Fail Action |
|---|---|---|
| Canonical state date | Check last-updated date in PIOS_CURRENT_CANONICAL_STATE.md | WARN if >30 days old |
| Terminology date | Check last-updated date in TERMINOLOGY_LOCK.md | WARN if >30 days old |
| Recent vault commits | Check git log for vault/ changes | INFO — note last vault update |

### 3.3 Compatibility Check (G1 Streams Only)

| Check | How | Fail Action |
|---|---|---|
| Planned terminology | Check planned new terms against TERMINOLOGY_LOCK.md | STOP if collision detected |
| Planned concepts | Check planned new concepts against current state | WARN if overlap detected |
| Planned boundaries | Check planned boundary changes against current boundaries | WARN if conflict detected |
| Architecture Impact Declaration | Verify stream contract includes impact declaration | WARN if missing (G1 streams should declare impact) |

### 3.4 Branch-Domain Check

| Check | How | Fail Action |
|---|---|---|
| Current branch | git branch --show-current | Record in preflight log |
| Branch authorization | Check against git_structure_contract.md | STOP if unauthorized |
| Domain scope | Verify planned work matches branch domain | STOP if cross-domain |

---

## 4. Preflight Output

Preflight produces a structured result logged in execution_report.md:

```
ARCHITECTURE MEMORY PREFLIGHT
Date: <date>
Stream: <stream-id>
Classification: G1 / G2 / G3

LOAD VERIFICATION:
- Canonical state: LOADED / MISSING
- Terminology: LOADED / MISSING
- Concept-specific: LOADED / NOT REQUIRED / MISSING [list]
- Branch: AUTHORIZED / VIOLATION

STALENESS:
- Canonical state age: <days since last update>
- Terminology age: <days since last update>
- Last vault commit: <hash> — <date>

COMPATIBILITY (G1 only):
- Term collisions: NONE / [list]
- Concept overlaps: NONE / [list]
- Boundary conflicts: NONE / [list]
- Impact declaration: PRESENT / MISSING

BRANCH-DOMAIN:
- Branch: <branch-name>
- Authorization: PASS / FAIL
- Domain scope: PASS / FAIL

PREFLIGHT RESULT: PASS / WARN / FAIL
```

---

## 5. Preflight Failure Modes

### FAIL — Execution MUST NOT Proceed

- Canonical state not loaded and cannot be loaded
- Terminology not loaded and cannot be loaded
- Branch unauthorized
- Cross-domain execution detected
- Term collision with no resolution path

### WARN — Execution May Proceed With Awareness

- Canonical state stale (>30 days)
- Terminology stale (>30 days)
- Concept overlap detected (may be intentional)
- Architecture Impact Declaration missing from G1 stream contract
- Concept-specific pages not loaded (may not be needed)

### PASS — Execution Proceeds Normally

- All checks pass
- No warnings

---

## 6. G2 Reduced Checklist

G2 streams (architecture-consuming) use a reduced preflight:

- Load verification: YES (all checks)
- Staleness check: YES (all checks)
- Compatibility check: NO (G2 does not plan mutations)
- Branch-domain check: YES (all checks)

If during execution a G2 stream discovers it is mutating architecture → reclassify as G1 → run full preflight compatibility check before continuing.

---

## 7. Integration with CLAUDE.md

This preflight extends CLAUDE.md §12 (Pre-Flight). The existing pre-flight checks (branch, inputs, dependencies, validators) remain. Architecture memory preflight adds:

- Vault load verification
- Staleness detection
- Compatibility checking (G1)

The combined pre-flight sequence:

1. CLAUDE.md §12 checks (existing)
2. Architecture Memory Preflight (this document)
3. Stream-specific pre-flight (if defined in contract)

---

## 8. Cross-References

- [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] — what preflight verifies was loaded
- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps lifecycle context
- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — what preflight compatibility checks prevent
- [[VAULT_SYNCHRONIZATION_AND_DRIFT_PROTOCOL]] — staleness detection in detail
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — enforcement when preflight fails
