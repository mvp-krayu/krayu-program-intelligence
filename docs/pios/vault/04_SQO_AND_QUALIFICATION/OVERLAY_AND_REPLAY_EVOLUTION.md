# Overlay and Replay Evolution

> **How the system governs semantic state mutation — overlays, replay verification, and rollback.**

---

## What Overlays Are

Overlays are **governed modifications to semantic state** — changes to domain labels, grounding status, or qualification claims that go through an approval corridor.

## Why Overlays Exist

Without overlays, the system has no mechanism to:
- Correct a semantic label
- Add evidence for a domain
- Promote a claim from semantic-only to partially grounded
- Remediate debt items

Overlays provide a governed path for semantic evolution without uncontrolled mutation.

## Overlay Governance Model

```
Admissible Candidate
    ↓
Overlay Proposal (generated)
    ↓
Approval Gate (governance check)
    ↓
Overlay Application (state mutation)
    ↓
Replay Verification (deterministic check)
    ↓
Rollback Capability (safety net)
```

## Replay Verification

Replay verification ensures that overlay applications are **deterministic and reproducible:**
- Given the same inputs, the same overlay produces the same result
- Replay can detect if underlying data changed since overlay was approved
- Replay failure → overlay quarantined

## Rollback

Rollback removes an overlay and restores prior state. It exists because:
- Overlays may be approved based on evidence that is later invalidated
- Replay failure may indicate a data integrity issue
- Governance may retroactively reject an overlay class

## Git Lineage

| Commit | Date | Event |
|---|---|---|
| 70fe57f | 2026-05-10 | SQO runtime overlays integrated into LENS v2 |
| f5e3db4 | 2026-05-10 | Runtime overlay reclassified as prototype |
| d7a1e02 | 2026-05-11 | First governed micro-overlay activation |
| 7287db1 | 2026-05-11 | First controlled multi-overlay orchestration |
| 81992a4 | 2026-05-11 | Overlay observability and evolution trace architecture |
| 5a3f9e5 | 2026-05-11 | Replay and rollback certification workflow |
| 687f707 | 2026-05-11 | Overlay proposal and approval workflow |
| ed4e0d1 | 2026-05-11 | BlueEdge runtime corridor in SQO Cockpit |

## Current Status

**OPERATIONAL but PROTOTYPE.**

The overlay infrastructure exists and has been exercised (micro-overlay activation, multi-overlay orchestration), but:
- Overlay proposal corridor is not fully automated
- Authority promotion protocol is not implemented (Phase 4)
- Real-world overlay approval workflow not yet tested with stakeholders

## Cross-References

- [[ADMISSIBILITY_AND_CORRIDORS]] — what feeds overlays
- [[SQO_EVOLUTION]] — qualification context
- [[../05_RUNTIME_AND_CORRIDOR/RUNTIME_CORRIDOR_EVOLUTION]] — corridor governance
- [[../05_RUNTIME_AND_CORRIDOR/REPLAY_AND_ROLLBACK_EVOLUTION]] — replay detail
