# PiOS Load Sequence

> **Mandatory load order for AI execution engines and stream contracts.**

---

## Load Order

### Phase 1 — Governance Constitution (ALWAYS)

```
1. CLAUDE.md                                    ← execution constitution
2. docs/governance/runtime/git_structure_contract.md  ← branch/domain authority
```

### Phase 2 — Canonical State (ALWAYS)

```
3. This vault: 00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md
4. This vault: 10_CANONICAL_RUNTIME_STATE/CURRENT_CANONICAL_AUTHORITY.md
```

### Phase 3 — Terminology (ALWAYS)

```
5. This vault: 06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md
6. This vault: 06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS.md
```

### Phase 4 — Context-Dependent

Load based on stream type:

| Stream Type | Additional Vault Pages |
|---|---|
| Layer boundary work | [[../01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL]] + reference_boundary_contract.md |
| LENS/runtime work | [[../02_EXECLENS_LINEAGE/EXECLENS_RUNTIME_EVOLUTION]] + [[../07_CANONICAL_LINEAGE/PIE_TO_DOM_LINEAGE]] |
| SQO/qualification work | [[../04_SQO_AND_QUALIFICATION/SQO_EVOLUTION]] + [[../04_SQO_AND_QUALIFICATION/HYDRATED_AND_QSTATE_EVOLUTION]] |
| Evidence/corridor work | [[../05_RUNTIME_AND_CORRIDOR/EVIDENCE_CORRIDOR_EVOLUTION]] |
| Grounding work | [[../03_PATH_SPLIT_EVOLUTION/PATH_A_EMERGENCE]] |
| Semantic work | [[../03_PATH_SPLIT_EVOLUTION/PATH_B_EMERGENCE]] |
| Git/branch work | [[../09_GIT_LINEAGE/]] relevant lineage page |
| Governance promotion | [[../11_GOVERNANCE_AND_MUTATION/CANONICAL_PROMOTION_PROTOCOL]] |

### Phase 5 — SKILLS (when applicable)

```
7. SKILLS.md                                    ← callable execution patterns
```

## Anti-Patterns

**DO NOT:**
- Reason about architecture without loading Phase 1 + 2
- Assume terminology without loading Phase 3
- Reconstruct architecture from conversation history
- Treat this vault as optional
- Skip load sequence steps

## Why This Matters

Without this load sequence, execution engines will:
- Rediscover prior truths (wasted cycles)
- Create semantic collisions (conflicting terminology)
- Violate layer boundaries (missing context)
- Produce ontology drift (session-local reinterpretation)

The load sequence eliminates these failure modes.
