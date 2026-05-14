# Drift and Remediation

> **The system's first formal governance correction — and the pattern it established.**

---

## DRIFT-001: SSZ/SSI Boundary Violation

### What Happened

SSZ (Signal Significance Zone) and SSI (Signal Significance Index) were signal constructs implemented at **L6** (ExecLens runtime) that canonically belonged at **L3** (Derivation Layer).

This was a **layer boundary collapse** — downstream runtime performing upstream derivation computation.

### Why It Matters

DRIFT-001 was the system's first formal governance violation. It established:
- The drift detection pattern
- The drift registration process
- The principle that mis-layered constructs must be corrected, not promoted

### Timeline

| Date | Event |
|---|---|
| Pre-2026-03-22 | SSZ/SSI implemented at L6 in ExecLens runtime |
| 2026-03-22 | Stream 00.2 defines canonical layer model |
| 2026-03-22 | DRIFT-001 formally registered |
| 2026-03-28 | Governance index marks DRIFT-001 as "Resolved (Governance Reinforced)" |
| Post-April 2026 | SSZ/SSI constructs no longer present in current system |

### Resolution

The governance response was:
1. Formally register the violation
2. Classify SSZ/SSI as "provisional, mis-layered signal constructs"
3. Rule: "They must not be promoted to canonical architecture status until formally specified at L3"
4. In practice: SSZ/SSI were never promoted and are no longer part of the active system

### Current Status

- **DRIFT-001:** RESOLVED — constructs removed from active system
- **Drift register pattern:** DORMANT — no new drift cases registered since snapshot
- **Recommendation:** Revive drift register as governance pattern (see [[../12_ARCHIVE/HISTORICAL_SNAPSHOT_INDEX]])

## Remediation Corpus

The snapshot contained three remediation domains:

| Domain | Layer | Scope | Current Status |
|---|---|---|---|
| Domain A | L3 (Derivation) | Correct L3 layer violations | HISTORICAL — superseded by PI stream model |
| Domain B | L4 (Semantic Shaping) | Correct L4 layer violations | HISTORICAL |
| Domain C | L5-L7 (Activation-Runtime-Demo) | Correct cross-layer violations | HISTORICAL |

### Why Remediation Was Not Extended

The remediation domain model (A/B/C) was replaced by the **PI stream contract model**. Instead of formal remediation domains, the current system uses:
- Stream-scoped execution contracts
- Per-stream CLOSURE.md
- Pre-flight branch-domain verification
- Fail-closed execution on violation

The PI model is more granular and more enforceable than the snapshot-era remediation approach.

## Cross-References

- Original DRIFT-001: `~/Projects/k-pi-governance/docs/governance/drift/cases/DRIFT-001.md`
- Original remediation: `~/Projects/k-pi-governance/docs/governance/remediation/`
- Current enforcement: `docs/governance/runtime/git_structure_contract.md`
- Layer model: [[L0_L8_MODEL]]
