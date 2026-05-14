# Governance Origins

> **Where the governance model came from and how it evolved into CLAUDE.md.**

---

## Foundational Documents (Snapshot Era)

Three documents established the original governance framework:

### governance_master_capsule.md

**Role:** Canonical governance reference
**Date:** Foundational (pre-2026-03-20)

Defined:
- 6-stream architecture: 00 (Governance), 10 (Discipline), 20 (Framework), 30 (Commercialization), 40 (Signäl), 50 (Demonstrations), 60 (Case Studies)
- Execution order: 10→40→20→50→60→30
- Dependency chain: Discipline→Signals→Framework→Demonstrations→Case Studies→Commercialization
- Cross-stream adjustment rule: completed streams must not be rewritten; adjustments via alignment artifacts

**Current status:** SUPERSEDED by CLAUDE.md. Stream boundaries evolved to 40.x-75.x model.

### governance_operating_model.md

**Role:** Stream lifecycle and discipline development
**Date:** Foundational

Defined:
- Stream lifecycle: Activation → Execution → Completion → Freeze
- 6-stage discipline development: Exploration → Structuring → Formalization → Integration → Validation → Freeze
- Program state declaration rules
- Stream start procedures

**Current status:** SUPERSEDED by PI stream model (contract → pre-flight → execute → closure → return).

### index.md (Governance Index)

**Role:** Authority hierarchy and document registry
**Date:** 2026-03-28

Defined:
- Authority hierarchy: Canonical Architecture → Remediation Corpus → Runtime Streams
- Canonical architecture registry (L0-L8 model, PROVISIONAL)
- Drift register (DRIFT-001)
- Remediation corpus (Domain A/B/C)

**Current status:** SUPERSEDED by CLAUDE.md authority model (CONTRACT → CLAUDE.md → validators).

## Evolution to CLAUDE.md

```
governance_master_capsule.md (stream architecture, execution rules)
    +
governance_operating_model.md (lifecycle, discipline)
    +
index.md (authority hierarchy)
    +
canonical-layer-model.md (L0-L8)
    +
git_structure_contract.md (branch enforcement)
    +
[May 2026 execution experience — fail-closed, return contract, pre-flight]
    ↓
CLAUDE.md v2.4 (execution constitution)
```

### What Was Preserved

| Origin Concept | CLAUDE.md Location | Preserved As |
|---|---|---|
| Stream lifecycle | §5 (Artifact Discipline) | Mandatory CLOSURE.md format |
| Cross-stream no-rewrite | §9 (Stream Boundaries) | Layer isolation rules |
| Authority hierarchy | §1.2 (Authority Precedence) | CONTRACT → CLAUDE.md → validators |
| Layer model | §9 (Stream Boundaries) | 40.x-75.x stream ranges |
| Evidence-first | §3.1 (Evidence First) | No evidence → no output |
| Frozen stream rule | §11.1 (Stream Repair) | R-stream = correction only |

### What Was Added (Post-Snapshot)

| New Concept | CLAUDE.md Location | Origin |
|---|---|---|
| AI execution engine model | §1.1 (Role Separation) | Claude Code operational experience |
| Forbidden inputs list | §2.2 | Ontology pollution prevention |
| Return contract format | §6 | Stream execution formalization |
| Pre-flight verification | §12 | Branch-domain enforcement need |
| 4-Brain governance | §15 | Product/Publish layer emergence |
| SKILLS.md integration | §15.2 | Reusable execution patterns |
| Fail-closed doctrine | §3.3 | Operational failure experience |

## Cross-References

- Current constitution: `CLAUDE.md`
- Historical source: `~/Projects/k-pi-governance/docs/governance/`
- Authority chain: [[../10_CANONICAL_RUNTIME_STATE/CURRENT_CANONICAL_AUTHORITY]]
- Execution model evolution: [[../07_CANONICAL_LINEAGE/EXECUTION_MODEL_EVOLUTION]]
