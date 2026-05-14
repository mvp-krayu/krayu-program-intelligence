# Claude Runtime Load Protocol

> **Exactly how Claude loads canonical architecture state before reasoning.**

---

## 1. Load Trigger

The vault load is triggered by:
- Session start involving the Krayu Program Intelligence system
- Stream contract acknowledgment
- Branch entry for any authorized branch
- Architecture-related question from operator

## 2. Load Sequence

### Phase 1 — Constitution (ALWAYS — automatic via CLAUDE.md)

```
LOAD: CLAUDE.md
LOAD: docs/governance/runtime/git_structure_contract.md
VERIFY: branch authorized
```

This phase is already mandatory per CLAUDE.md §12. No change required.

### Phase 2 — Canonical State (ALWAYS — new mandatory step)

```
LOAD: docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
```

This single page provides:
- Current architectural strata and status
- Active runtime surfaces
- Current client states
- Current trustworthiness model
- Current governance documents

**Cost:** ~120 lines. Fits within any context window.

### Phase 3 — Terminology (ALWAYS — new mandatory step)

```
LOAD: docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md
```

This single page provides:
- All locked term definitions
- Usage rules
- Collision warnings

**Cost:** ~180 lines. Fits within any context window.

### Phase 4 — Concept-Specific (CONDITIONAL — on demand)

Load additional vault pages based on stream scope:

| Stream touches | Load |
|---|---|
| Layer boundaries | vault/01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL.md |
| PATH A/grounding | vault/03_PATH_SPLIT_EVOLUTION/PATH_A_EMERGENCE.md |
| PATH B/semantic | vault/03_PATH_SPLIT_EVOLUTION/PATH_B_EMERGENCE.md |
| SQO/qualification | vault/04_SQO_AND_QUALIFICATION/SQO_EVOLUTION.md |
| HYDRATED/Q-class | vault/04_SQO_AND_QUALIFICATION/HYDRATED_AND_QSTATE_EVOLUTION.md |
| Evidence/extraction | vault/05_RUNTIME_AND_CORRIDOR/EVIDENCE_CORRIDOR_EVOLUTION.md |
| Corridors/replay | vault/05_RUNTIME_AND_CORRIDOR/RUNTIME_CORRIDOR_EVOLUTION.md |
| LENS/rendering | vault/02_EXECLENS_LINEAGE/EXECLENS_RUNTIME_EVOLUTION.md |
| Terminology changes | vault/06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS.md |
| Architecture promotion | vault/11_GOVERNANCE_AND_MUTATION/CANONICAL_PROMOTION_PROTOCOL.md |

## 3. Load Verification

After loading, Claude verifies:

| Check | How |
|---|---|
| Canonical state loaded | PIOS_CURRENT_CANONICAL_STATE.md content in context |
| Terminology loaded | TERMINOLOGY_LOCK.md content in context |
| Branch authorized | git_structure_contract.md verification passed |
| No term collision risk | Planned work checked against TERMINOLOGY_LOCK.md |

If any check fails → STOP → report violation.

## 4. What Happens Without Loading

If Claude reasons about architecture without vault loading:
- Terms may be used with wrong meanings (semantic collision)
- Superseded concepts may be treated as active
- Lineage may be fabricated from training data
- Chronology may be flattened
- Branch authority may be violated

**The vault load prevents all five failure modes.**

## 5. Context Budget

| Load Phase | Lines | Required |
|---|---|---|
| Phase 1 (Constitution) | ~400 | ALWAYS (existing) |
| Phase 2 (Canonical State) | ~120 | ALWAYS (new) |
| Phase 3 (Terminology) | ~180 | ALWAYS (new) |
| Phase 4 (Concept-specific) | ~100-300 each | CONDITIONAL |

**Total mandatory new load: ~300 lines.** This is operationally feasible in all context windows.

## 6. Implementation Path

### Step A: CLAUDE.md Amendment

Add to CLAUDE.md §12 (Pre-flight):

```
### 12.3 Architecture Memory Load (MANDATORY)

Claude MUST load the following vault pages before execution:
- docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
- docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md

If the stream involves architectural concepts, load additional
vault pages per docs/pios/vault/operations/CLAUDE_RUNTIME_LOAD_PROTOCOL.md.

If vault pages are unavailable or corrupted → FAIL CLOSED.
```

### Step B: Conversation Bootstrap

When the vault pages are loaded, Claude has immediate architectural awareness — no session-local reconstruction needed.

## 7. Cross-References

- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — preflight checks after loading
- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — overall AMOps lifecycle
- [[CHATGPT_AND_CLAUDE_CONSTRAINT_MODEL]] — Claude + ChatGPT constraints
