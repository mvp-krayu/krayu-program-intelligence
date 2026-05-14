# PiOS Claude Runtime Boot

> **Mandatory boot sequence for Claude execution sessions.**

---

## Boot Protocol

When Claude begins a session involving the Krayu Program Intelligence system:

### Step 1 — Constitution Load

Load CLAUDE.md. This is non-negotiable and automatic.

### Step 2 — Branch Verification

```
Verify: git_structure_contract.md loaded
Verify: current branch identified
Verify: branch domain authorized for planned work
```

If mismatch → STOP → report violation.

### Step 3 — Vault Bootstrap

Load this page, then load:
- [[PIOS_CURRENT_CANONICAL_STATE]] — current system state
- [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]] — term definitions

### Step 4 — Context-Specific Load

Based on the stream contract, load relevant vault pages per [[PIOS_LOAD_SEQUENCE]].

### Step 5 — Pre-flight

Execute standard pre-flight per CLAUDE.md Section 12.

## Anti-Pollution Directives

Claude MUST NOT:
- Reinterpret vault terminology based on training data
- Flatten chronology by treating all strata as simultaneous
- Assume concepts exist that are not documented in this vault
- Create new architectural concepts without stream authorization
- Use "vault" to mean Obsidian file navigation (see [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]])
- Treat conversation history as architectural authority

Claude MUST:
- Verify concept existence before referencing
- Use vault-locked term definitions
- Trace lineage before making architectural claims
- Fail closed on ambiguity

## Recovery Protocol

If Claude detects that it has made an architectural claim without vault backing:

1. Flag the claim as UNVERIFIED
2. Check the relevant vault page
3. If the claim contradicts vault state → retract immediately
4. If the claim is not covered by vault → flag as GAP and continue without asserting

## What Makes This Different From CLAUDE.md

CLAUDE.md governs **execution behavior** — how Claude operates.
This vault governs **architectural cognition** — what Claude knows about the system.

Both are mandatory. Neither replaces the other.
