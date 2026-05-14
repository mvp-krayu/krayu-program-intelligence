# L0-L8 Canonical Layer Model

> **The foundational architectural skeleton. Everything in the system maps to these layers.**

---

## Origin

- **Originated:** Stream 00.2 — Canonical Layer Model Restoration
- **Date:** 2026-03-22
- **Branch:** feature/governance (snapshot era), now main
- **Original status:** PROVISIONAL (3 open items preventing LOCK-READY)
- **Current status:** LOCKED — AUTHORITATIVE (via git_structure_contract.md)

## The Model

| Layer | Name | Responsibility | Branch Owner |
|---|---|---|---|
| L0 | External Evidence Source | Not owned by system — external reality | (external) |
| L1 | Ingestion | Scan, classify, normalize, validate evidence | feature/pios-core |
| L2 | Evidence Navigation | Navigate validated evidence structures | feature/pios-core |
| L3 | Derivation | Derive signals, conditions, diagnosis, ESI, RAG | feature/pios-core |
| L4 | Semantic Shaping | Shape semantic payloads, manifests, narratives | feature/pios-core |
| L5 | Presentation Assembly / Activation | Bind and project Core outputs | feature/activation |
| L6 | Runtime Experience | Render and interact with prepared payloads | feature/runtime-demo |
| L7 | Demo / Narrative Packaging | Package runtime truth for guided demonstration | feature/runtime-demo |
| L8 | Governance / Validation | Define, validate, audit, record | feature/governance |

## Governing Principles (from Stream 00.2)

1. **Evidence First** — No layer may emit a truth claim unless traceable to evidence or governed transformation
2. **Separation of Concerns** — Each layer owns distinct responsibility; no downstream absorption of upstream computation
3. **No Silent Semantic Mutation** — Truth claims and evidence bindings may not be altered without governed rules
4. **Contracts Are Control Surfaces, Not Architecture** — Contracts constrain; they do not define canonical architecture
5. **UI Is a Consumer, Not a Semantic Authority** — Runtime surfaces may render but may not originate semantic truth

## Lineage

```
Stream 00.2 (2026-03-22)
    canonical-layer-model.md (PROVISIONAL)
        ↓
    canonical-layer-model.validation.md (11/11 PASS, 3 open items)
        ↓
    canonical-layer-model.classification.md (10 constructs classified)
        ↓
    canonical-layer-model.drift.md (6 drift items, 4 open)
        ↓
    [GAP: April 2026 — no formal promotion]
        ↓
    git_structure_contract.md (LOCKED — AUTHORITATIVE)
        absorbed L0-L8 into branch ownership model
        added Ledger Selector concept
        added 2-repository model
        added branch naming rules
```

See [[../07_CANONICAL_LINEAGE/L0_L8_TO_GIT_STRUCTURE_LINEAGE]] for detailed evolution.

## What Changed Between Snapshot and Current

| Aspect | Snapshot (00.2) | Current (git_structure_contract.md) |
|---|---|---|
| Status | PROVISIONAL | LOCKED — AUTHORITATIVE |
| Layers | L0-L8 (8+1 layers) | L0-L8 (same model, operationalized) |
| Branch mapping | Not formalized | Explicit branch → layer ownership |
| Repository model | Single repo implied | 2 repos: system + publishing |
| Ledger Selector | Not named | L0 pre-system entry mechanism |
| Enforcement | Remediation-based | Pre-flight verification (CLAUDE.md §12) |

## Cross-References

- Current authority: `docs/governance/runtime/git_structure_contract.md`
- Historical source: `~/Projects/k-pi-governance/docs/governance/architecture/canonical/canonical-layer-model.md`
- Drift record: [[DRIFT_AND_REMEDIATION]]
- Stream evolution: [[../07_CANONICAL_LINEAGE/STREAM_EVOLUTION_CHRONOLOGY]]
