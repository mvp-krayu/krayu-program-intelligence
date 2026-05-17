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

### Phase 2 — Canonical State (ALWAYS — mandatory)

```
LOAD: docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
LOAD: docs/pios/vault/00_START_HERE/OPERATIONAL_ONTOLOGY.md
```

This phase provides:
- Current architectural strata and status
- Active runtime surfaces
- Current client states
- Current trustworthiness model
- Current governance documents
- Complete operational chain (dual-path ontology, crosswalk, reconciliation, pipeline, LENS traceback)
- Anti-rediscovery reference (what has been canonicalized and where)

**Cost:** ~500 lines total. Fits within any context window.

**Anti-rediscovery function:** Loading OPERATIONAL_ONTOLOGY.md prevents rediscovery of operational chain knowledge. Before investigating how the system works, check whether OPERATIONAL_ONTOLOGY.md already answers the question.

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
| PATH A.5/semantic participation/domains/CEU compression/dom_layer | vault/03_PATH_SPLIT_EVOLUTION/PATH_A5_PARTICIPATION_ARCHITECTURE.md |
| PATH B/semantic | vault/03_PATH_SPLIT_EVOLUTION/PATH_B_EMERGENCE.md |
| Crosswalk/reconciliation/grounding | vault/03_PATH_SPLIT_EVOLUTION/CROSSWALK_AND_RECONCILIATION.md |
| SQO/qualification | vault/04_SQO_AND_QUALIFICATION/SQO_EVOLUTION.md |
| HYDRATED/Q-class | vault/04_SQO_AND_QUALIFICATION/HYDRATED_AND_QSTATE_EVOLUTION.md |
| Evidence/extraction | vault/05_RUNTIME_AND_CORRIDOR/EVIDENCE_CORRIDOR_EVOLUTION.md |
| Corridors/replay | vault/05_RUNTIME_AND_CORRIDOR/RUNTIME_CORRIDOR_EVOLUTION.md |
| LENS/rendering | vault/02_EXECLENS_LINEAGE/EXECLENS_RUNTIME_EVOLUTION.md |
| Terminology changes | vault/06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS.md |
| Architecture promotion | vault/11_GOVERNANCE_AND_MUTATION/CANONICAL_PROMOTION_PROTOCOL.md |
| Rediscovery prevention | vault/11_GOVERNANCE_AND_MUTATION/ANTI_REDISCOVERY_DISCIPLINE.md |
| Traceback validation | vault/11_GOVERNANCE_AND_MUTATION/TOP_DOWN_TRACEBACK_DISCIPLINE.md |

## 3. Load Verification

After loading, Claude verifies:

| Check | How |
|---|---|
| Canonical state loaded | PIOS_CURRENT_CANONICAL_STATE.md content in context |
| Operational ontology loaded | OPERATIONAL_ONTOLOGY.md content in context |
| Terminology loaded | TERMINOLOGY_LOCK.md content in context |
| Branch authorized | git_structure_contract.md verification passed |
| No term collision risk | Planned work checked against TERMINOLOGY_LOCK.md |
| GIT_LINEAGE present | Vault pages being consumed have GIT_LINEAGE sections with "Last verified" dates |

If any check fails → STOP → report violation.

### 3.1 GIT_LINEAGE Validation

Vault pages updated by PI.VAULT.OPERATIONAL-ONTOLOGY-CANONICALIZATION.01 and later streams include a GIT_LINEAGE section recording:
- Originating streams
- Creation/fix commits
- Recovered-from artifacts
- Authoritative runtime artifacts
- Last verified date

When loading a vault page with a GIT_LINEAGE section, Claude should note the "Last verified" date. Pages verified more than 90 days ago should trigger a WARN per CLAUDE.md §16.5.

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
