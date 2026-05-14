# Claude Load Requirements

> **What Claude must load before reasoning about architecture.**

---

## Mandatory Loads

### Always Required

| Document | Purpose | When |
|---|---|---|
| CLAUDE.md | Execution constitution | Every session |
| git_structure_contract.md | Branch-domain authority | Every session |
| This vault: PIOS_CURRENT_CANONICAL_STATE.md | Current system state | Every session |
| This vault: TERMINOLOGY_LOCK.md | Authoritative term definitions | Every session |

### Conditionally Required

| Document | Purpose | When |
|---|---|---|
| reference_boundary_contract.md | Cross-layer boundary rules | When stream involves cross-layer operations |
| SKILLS.md | Callable execution patterns | When skill invocation is required |
| Q02_GOVERNANCE_AMENDMENT.md | Q-class rules | When working with Q-class or rendering |
| Vault concept pages | Concept-specific context | When stream touches specific concepts |

## Anti-Patterns

Claude MUST NOT:
- Reason about L0-L8 without loading git_structure_contract.md
- Use "vault" without checking SEMANTIC_COLLISIONS.md
- Assume HYDRATED is degraded without reading TERMINOLOGY_LOCK.md
- Reference PIE vault domains without checking PIE_TO_DOM_LINEAGE.md
- Reconstruct architecture from conversation — use vault instead

## Cross-References

- [[../00_START_HERE/PIOS_LOAD_SEQUENCE]] — full load sequence
- [[../00_START_HERE/PIOS_CLAUDE_RUNTIME_BOOT]] — boot protocol
- [[ARCHITECTURE_LOAD_PROTOCOL]] — architecture-specific loading
