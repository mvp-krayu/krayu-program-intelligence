# Current Canonical Authority

> **What is authoritative and what is not — the trust hierarchy.**

---

## Authority Hierarchy

```
1. CONTRACT (explicit scoped instructions for current stream)
2. CLAUDE.md (execution constitution)
3. git_structure_contract.md (branch-domain authority)
4. reference_boundary_contract.md (cross-layer rules)
5. Q02_GOVERNANCE_AMENDMENT.md (Q-class rules)
6. This vault (architecture operating memory)
7. Validators (acceptance criteria)
```

## Authoritative Documents

| Document | Authority Level | Status |
|---|---|---|
| CLAUDE.md v2.4 | EXECUTION CONSTITUTION | LOCKED |
| git_structure_contract.md | BRANCH-DOMAIN AUTHORITY | LOCKED — AUTHORITATIVE |
| reference_boundary_contract.md | CROSS-LAYER BOUNDARY | LOCKED |
| Q02_GOVERNANCE_AMENDMENT.md | Q-CLASS GOVERNANCE | LOCKED |
| This vault | ARCHITECTURE MEMORY | OPERATIONAL |

## Non-Authoritative Sources

| Source | Why Not Authoritative |
|---|---|
| Conversation history | Session-local, not persisted |
| Snapshot governance documents | HISTORICAL — superseded |
| Commercial positioning documents | ADVISORY — not governance |
| Prior stream contracts | SCOPED — authority limited to that stream |
| Training data | EXTERNAL — may conflict with system truth |

## Authority Conflicts

If any source conflicts with the hierarchy above:
1. Higher-numbered authority wins
2. CONTRACT may override CLAUDE.md only if explicitly stated and scoped
3. CLAUDE.md may not be overridden by conversation
4. git_structure_contract.md may not be overridden by any stream
5. This vault may not override governance documents — it records, not governs

## Computable Chain Authority

SQO qualification chain authority:
- S0/S1/S2 contracts LOCKED
- GAP-01/02/07/08 on record
- S3 authority NOT YET ISSUED

## Cross-References

- [[CURRENT_CANONICAL_OWNERSHIP]] — who owns what
- [[CURRENT_CANONICAL_BOUNDARIES]] — what each layer may do
- [[../08_EXECUTION_RUNTIME/CLAUDE_LOAD_REQUIREMENTS]] — load requirements
