---
title: EVIDENCE VAULT V2
node_type: root_index
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
status: ACTIVE
vault_root: docs/psee/EVIDENCE.VAULT.V2/
---

**Primary entry point for this client instance: [[VAULT ENTRY — BlueEdge]]**

---

## Purpose

Evidence-first vault for GAUGE claim verification, exposure governance, and LENS client surface preparation. This vault upgrades the V1 document-index model to an evidence graph where every surfaced claim traces backward to a verified artifact chain.

Core formula:
Execution chain computes
GAUGE renders operator-facing truth
Vault proves and structures evidence
LENS explains client-facing meaning

## Locked Baseline

- Tag: `product-gauge-authoritative-v1`
- Commit: `6f8c62b`
- Recomputed run: `run_authoritative_recomputed_01`
- Client: `blueedge` (S3 CLIENT_PROVIDED)
- Stream: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01

## Vault Structure

```
EVIDENCE.VAULT.V2/
  00 — Meta/
    Vault Governance.md        ← exposure zones, LENS admissibility
    Claim Index.md             ← CLM-01..CLM-27 registry
    Entity Index.md            ← 7 entity families
  governance/
    Exposure Zones.md          ← ZONE-0..ZONE-3 definitions
    LENS Admissibility.md      ← 5 conditions for LENS-safe claims
    Known Gaps.md              ← CONCEPT-06, DIM-04, SIG-005 caveats
  claims/                      ← CLM-XX nodes (V3 materialization target)
  entities/                    ← ENT-XX nodes (V3 materialization target)
  artifacts/                   ← ART-XX nodes (V3 materialization target)
  client-lineage/
    BlueEdge — Evidence Path.md  ← BlueEdge client lineage backbone
  00 — Navigation/
    Top Claims.md / Core Artifacts.md / Value Creation Path.md
```

## Governing Specification

`docs/psee/PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01/evidence_vault_v2_architecture.md`

## Claim Summary

27 claim families across 5 rendering surfaces. 72 surfaced value fields enumerated.

| status | count |
|--------|-------|
| Fully traceable | 22 |
| Partial (caveat) | 3 |
| Conditional (audience-gated) | 2 |

## Critical Known Issues

| issue | description | location |
|-------|-------------|----------|
| CONCEPT-06 semantic gap | Predicate matches PHASE_1_ACTIVE — will not trigger on NOT_EVALUATED runs | [[Known Gaps]] |
| DIM-04 minimum observable state | us_records not in declared input artifacts — total_count=0 is not proven zero | [[Known Gaps]] |
| SIG-005 WEAK confidence | Static coordination component only — runtime not evaluated | [[Known Gaps]] |

## Navigation

- [[Vault Governance]] — exposure zone definitions and LENS admissibility
- [[Claim Index]] — all 27 claims with traceability status
- [[Entity Index]] — 7 entity families with counts
- [[Exposure Zones]] — ZONE-0 through ZONE-3 definitions
- [[LENS Admissibility]] — 5 conditions for client-safe claims
- [[Known Gaps]] — documented semantic gaps and caveats
