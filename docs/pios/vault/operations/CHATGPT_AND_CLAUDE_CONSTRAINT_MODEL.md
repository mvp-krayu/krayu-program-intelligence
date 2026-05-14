# ChatGPT and Claude Constraint Model

> **How both AI execution engines are bound by vault authority.**

---

## 1. Purpose

The PiOS architecture is executed by two AI systems: Claude (via Claude Code) and ChatGPT (via conversational interface). Both systems must operate under vault authority to prevent architectural divergence.

This document defines how each system loads, respects, and propagates vault state — and where their constraint models differ.

---

## 2. Shared Constraints

Both Claude and ChatGPT MUST:

| Constraint | Enforcement |
|---|---|
| Load canonical state before architectural reasoning | [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] / ChatGPT session bootstrap |
| Use locked terminology with locked meanings | TERMINOLOGY_LOCK.md is authoritative for both |
| Not fabricate lineage | All lineage claims must trace to vault or git |
| Not promote concepts without governance authority | [[CANONICAL_PROMOTION_AND_SUPERSESSION_PROTOCOL]] |
| Not mutate vault state without stream authorization | [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] |
| Treat vault as truth, not suggestion | Vault content overrides training-data assumptions |

---

## 3. Claude-Specific Constraints

### 3.1 Execution Model

Claude operates as a deterministic execution engine (CLAUDE.md §1.1). Claude's vault constraints are:

| Constraint | How Enforced |
|---|---|
| Mandatory vault load | CLAUDE.md §12.3 (proposed amendment) |
| Preflight verification | [[ARCHITECTURE_MEMORY_PREFLIGHT]] |
| Mutation tracking | [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] |
| Post-flight propagation | [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] |
| Fail-closed on violation | CLAUDE.md §3.3 + [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] |

### 3.2 What Claude CAN Do

- Read vault pages (all sections)
- Load vault state into session context
- Execute streams that mutate architecture (G1) with proper tracking
- Propagate mutations to vault during post-flight
- Detect drift and report violations

### 3.3 What Claude CANNOT Do

- Reason about architecture without vault load
- Use training-data knowledge as architectural authority
- Promote concepts without governance stream authorization
- Skip post-flight vault propagation for G1 streams
- Override vault state with inferred or assumed state

### 3.4 Claude Anti-Pollution Directives

Per PIOS_CLAUDE_RUNTIME_BOOT.md:

1. Do not fabricate architectural history
2. Do not invent terminology
3. Do not flatten chronology
4. Do not treat superseded concepts as active
5. Do not merge distinct concepts
6. Do not infer governance from code structure alone

---

## 4. ChatGPT-Specific Constraints

### 4.1 Execution Model

ChatGPT operates as a conversational reasoning engine. It does not execute contracts directly but participates in architectural reasoning, stream design, and governance discussion.

### 4.2 ChatGPT Vault Constraints

| Constraint | How Enforced |
|---|---|
| Vault awareness | Operator provides vault pages in session context |
| Terminology compliance | Operator pastes TERMINOLOGY_LOCK.md or relevant sections |
| No lineage fabrication | Operator cross-checks claims against vault |
| No promotion authority | ChatGPT cannot promote — only governance streams can |
| Architecture proposals require vault grounding | Proposals must reference existing vault state |

### 4.3 What ChatGPT CAN Do

- Reason about architecture WITH vault context loaded
- Propose new concepts (as EMERGING — not as truth)
- Analyze architectural evolution with vault lineage
- Draft stream contracts that reference vault state
- Identify potential terminology collisions
- Suggest vault updates (for operator/Claude to execute)

### 4.4 What ChatGPT CANNOT Do

- Directly modify vault files (no file system access)
- Treat its own reasoning as architectural authority
- Promote concepts (authority belongs to governance streams)
- Override vault state with training-data assumptions
- Produce Architecture Mutation Deltas (Claude/operator responsibility)

### 4.5 ChatGPT Session Bootstrap

For ChatGPT sessions involving architectural reasoning:

1. Operator loads PIOS_CURRENT_CANONICAL_STATE.md into session
2. Operator loads TERMINOLOGY_LOCK.md into session
3. Operator loads concept-specific vault pages as needed
4. ChatGPT acknowledges vault state before reasoning

Without steps 1-3, ChatGPT MUST NOT be treated as architecturally authoritative.

---

## 5. Divergence Prevention

### 5.1 The Divergence Risk

If Claude and ChatGPT reason about the same architecture with different vault state:
- They may use the same term with different meanings
- They may treat different concepts as canonical
- They may produce conflicting stream designs
- They may create parallel, incompatible architectural proposals

### 5.2 Divergence Prevention Mechanisms

| Mechanism | How |
|---|---|
| Single vault source | Both systems load from the same docs/pios/vault/ |
| Terminology lock | Both systems use TERMINOLOGY_LOCK.md definitions |
| Vault versioning | Git commits timestamp vault state — both systems can verify currency |
| Operator as bridge | Operator ensures both systems have current vault state |
| Stream-gated mutation | Only authorized streams may mutate vault — prevents ad-hoc changes from either system |

### 5.3 When Divergence Occurs

If Claude and ChatGPT have produced conflicting architectural outputs:

1. Identify which system had current vault state
2. The output grounded in current vault state takes precedence
3. The divergent output is flagged — NOT automatically discarded (it may contain valid insight)
4. Governance stream required to reconcile if both outputs have merit

---

## 6. Authority Hierarchy

```
VAULT (docs/pios/vault/)
  ↓ authoritative for
CLAUDE.md + git_structure_contract.md
  ↓ constrains
CLAUDE (execution engine)
  ↓ produces
Stream artifacts + vault mutations

VAULT (docs/pios/vault/)
  ↓ authoritative for (when loaded)
ChatGPT (reasoning engine)
  ↓ produces
Proposals + analysis (NOT vault mutations)
```

The vault is upstream of both systems. Neither system is upstream of the vault except through governed stream execution.

---

## 7. Cross-References

- [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] — Claude's vault loading protocol
- [[PIOS_CLAUDE_RUNTIME_BOOT]] — Claude's anti-pollution directives
- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — Claude's preflight verification
- [[TERMINOLOGY_LOCK]] — shared terminology authority
- [[PIOS_CURRENT_CANONICAL_STATE]] — shared canonical state
- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps lifecycle
