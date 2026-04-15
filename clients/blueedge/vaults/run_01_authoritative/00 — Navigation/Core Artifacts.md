---
title: Core Artifacts — BlueEdge Assessment
node_type: navigation
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

The 7 artifact nodes in this vault represent the key files produced by the PiOS execution chain. Each artifact is the source of truth for a specific set of claims. GAUGE renders output by reading these artifacts — it does not produce them.

---

## Primary Artifacts (claim-bearing)

### [[ART-01 gauge_state.json]]
The terminal output of the entire S0→S4 chain. The single file read by `/api/gauge` to produce all GAUGE assessment output. Contains: all six dimensions (DIM-01..06), canonical score (60), projected score (100), execution state (NOT_EVALUATED), and confidence band ([60, 100]).
**Grounds:** 14 claims — all structural, scoring, and execution-state claims.

### [[ART-02 coverage_state.json]]
Records structural coverage: 30 admitted units, 100% coverage. Produced by `pios emit coverage` (S1). Feeds coverage_points (35) into the score computation.
**Grounds:** CLM-01, CLM-02, CLM-07, CLM-09.

### [[ART-03 reconstruction_state.json]]
Records the four-axis reconstruction result: overall PASS, four axes all PASS, zero violations. Produced by `pios emit reconstruction` (S1). Feeds reconstruction_points (25) into the score computation.
**Grounds:** CLM-03, CLM-04, CLM-09.

### [[ART-04 canonical_topology.json]]
The canonical platform topology: 17 domains, 42 capabilities, 89 components (148 total nodes). Produced by `pios emit topology` (S2). The authoritative structural map of the BlueEdge platform.
**Grounds:** CLM-14, CLM-15, CLM-16, CLM-17, CLM-27.

### [[ART-05 signal_registry.json]]
The governed signal registry: 5 intelligence signals with confidence distribution STRONG:2 / MODERATE:2 / WEAK:1. Produced by `pios emit signals` (S3). Contains business_impact and risk fields that are ZONE-2 safe but currently unrendered in the GAUGE UI — a known V2 gap.
**Grounds:** CLM-18..CLM-24 (all signal claims).

---

## Supporting Artifacts

### [[ART-06 binding_envelope.json]]
Client-specific binding model for the envelope topology surface. Richer than the canonical topology: 45 nodes, 62 edges, 2 structural overlaps (OVL-01/OVL-02), 3 unknown-space records (USP-01/02/03). Used by the envelope adapter path, not the primary GAUGE surface.
**Note:** Explains why CLM-17 shows 0 overlaps in canonical but 2 in the envelope — different scope, not contradictory.

### [[ART-07 admissibility_log.json]]
The IG pipeline forensic record: 30 units admitted, 0 excluded. Produced by `pios ig integrate-structural-layers`. The foundational evidence that the 30 structural units were legitimately classified and accepted.
**Grounds:** CLM-01, CLM-02.

---

## Artifact → Score Chain

```
ART-07 admissibility_log.json     → 30 units admitted
  ↓
ART-02 coverage_state.json        → coverage_percent=100.0 → 35 points
ART-03 reconstruction_state.json  → overall_result=PASS → 25 points
                                  → completion_points=0 (execution not run)
  ↓
ART-01 gauge_state.json           → canonical=60 / projected=100
```
