# L0-L8 to Git Structure Lineage

> **How the PROVISIONAL canonical layer model became the LOCKED branch-domain contract.**

---

## Lineage Chain

```
Stream 00.2 — Canonical Layer Model Restoration (2026-03-22)
    canonical-layer-model.md
    Status: PROVISIONAL
    Content: L0-L8 definitions, governing principles, cross-layer rules
        ↓
canonical-layer-model.validation.md
    11/11 sections PASS
    3 open items prevent LOCK-READY
        ↓
Governance Index (2026-03-28)
    Authority hierarchy: Canonical → Remediation → Runtime
    Canonical model registered as PROVISIONAL
        ↓
    [GAP: April 2026 — no formal promotion event]
    [The layer model was absorbed into git_structure_contract.md
     without a documented promotion stream]
        ↓
git_structure_contract.md (current)
    Status: LOCKED — AUTHORITATIVE
    Content: Layer model + branch ownership + repository model
```

## What Was Added

| Feature | Snapshot (00.2) | Current (git_structure_contract) |
|---|---|---|
| Branch → layer mapping | Not formalized | Explicit (feature/pios-core → L1-L4, etc.) |
| Repository model | Single repo implied | 2 repos: system + publishing |
| Ledger Selector | Not named | L0 pre-system entry mechanism |
| Branch naming rules | Not specified | feature/* + work/* naming convention |
| Enforcement mechanism | Remediation-based | Pre-flight verification (CLAUDE.md §12) |

## What Was Preserved

| Feature | How Preserved |
|---|---|
| L0-L8 layer naming | Identical layer names and numbering |
| Layer ordering | Same strict ordering |
| Evidence-first principle | Embedded in CLAUDE.md §3.1 |
| Separation of concerns | Embedded in branch-domain enforcement |
| Cross-layer flow constraints | Embedded in branch "Must not" rules |

## What Was Lost

| Feature | Status |
|---|---|
| 3 open validation items | Not tracked in current system — gap |
| 6 drift items (D1-D6) | DRIFT-001 resolved; D2-D6 status unknown |
| Formal PROVISIONAL → LOCKED promotion event | Not documented — gap |
| Remediation domain model (A/B/C) | Replaced by PI stream model |

## Promotion Gap

The transition from PROVISIONAL to LOCKED lacks a documented promotion event. This is the most significant lineage gap in the system:

- The snapshot's canonical-layer-model.md was PROVISIONAL with 3 open items
- The current git_structure_contract.md is LOCKED — AUTHORITATIVE
- No stream or commit explicitly records the promotion

**Likely explanation:** The promotion occurred implicitly when git_structure_contract.md was created. The contract absorbed the layer model and declared itself LOCKED without referencing the snapshot's open items.

**Recommendation:** Accept this as historical fact. The current contract is authoritative regardless of the promotion gap.

## Cross-References

- [[../01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL]] — current layer model
- [[PIE_TO_DOM_LINEAGE]] — parallel domain lineage
- [[STREAM_EVOLUTION_CHRONOLOGY]] — timeline context
