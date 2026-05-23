# Level 1 vs Level 2 Signal Doctrine

> **Canonical doctrine defining the two abstraction levels of Program Intelligence signal derivation.**
> **Established:** 2026-05-23
> **Stream:** PI.GENESIS.SIGNAL-LEVEL-DOCTRINE-CANONICALIZATION.01
> **Classification:** G1 — constitutional knowledge. This doctrine governs how signals are understood, not how they are computed.
> **Discovery origin:** PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01 intelligence delta certification

---

## Governing Principle

Program Intelligence reads structural truth at two distinct abstraction levels. These levels are NOT interchangeable. They measure different phenomena, see different populations, and produce different early-warning cognition. Both levels are necessary for complete structural intelligence.

---

## Level 1 — File-Topology Structural Intelligence

**What it sees:** Individual source files and their import/dependency relationships.

**Evidence source:** 40.3s code graph (resolved IMPORTS, DEFINES_CLASS, DEFINES_FUNCTION) and 40.3c structural centrality (per-file metrics, role classification).

**Population:** Hundreds to thousands of individual source files per specimen.

**Structural phenomena measured:**
- Import hub pressure — which files are imported by the most other files
- Import fan asymmetry — which files import the most other files
- Centrality concentration — how evenly structural authority is distributed across files
- Role distribution — the balance between structural roles (entrypoints, hubs, boundaries, leaves)
- Throughput chokepoints — files that both receive many imports AND export many

**Intelligence character:** "This FILE is a structural chokepoint. Changes to it propagate to N dependents. It is imported by 111 other files."

**Early-warning value:** Change propagation risk, PR review complexity, deployment coordination cost, build impact radius. These are file-level phenomena — they tell an operator WHERE in the codebase structural pressure concentrates.

**Availability:** PATH A specimens with code graph only. PATH B specimens have no Level 1.

**Signal families at Level 1:**
- ISIG (Import Structure Intelligence Signals) — **OPERATIONAL** (ISIG-001 Import Hub Pressure, ISIG-002 Import Fan Asymmetry)
- CSIG (Centrality Structure Intelligence Signals) — PARTIALLY_IMPLIED, not yet implemented

---

## Level 2 — Architectural Binding Intelligence

**What it sees:** Capability entities, domain groups, capability surfaces, and their binding relationships.

**Evidence source:** Phase 5 binding envelope (CEU→DOM grounding, DOM→CE→CS exposure, cross-DOM IMPORTS_ACROSS coupling).

**Population:** Tens of architectural nodes per specimen (DOM + CE + CS).

**Structural phenomena measured:**
- Coupling pressure — which capability entities receive disproportionate inbound binding connections
- Export pressure — which domains broadcast disproportionate outbound coupling
- Zone coverage concentration — whether capability surfaces are concentrated on few entities
- Isolation pressure — whether the binding graph is fragmented into disconnected regions
- Pressure zone formation — where multiple pressure types converge on the same architectural region

**Intelligence character:** "This DOMAIN has 4× the mean outbound coupling. This CAPABILITY ENTITY receives connections from 4 different domains. The architecture has disconnected regions."

**Early-warning value:** Architectural coupling patterns, cross-domain dependency risk, governance gap detection, structural coherence. These are architectural phenomena — they tell an operator HOW the system's structure distributes responsibility and coupling.

**Availability:** ALL specimens with a binding envelope (PATH A and PATH B).

**Signal families at Level 2:**
- PSIG (Primary Structural Intelligence Signals) — OPERATIONAL
- BSIG (Binding Fusion Intelligence Signals) — SPECIFIED_NOT_IMPLEMENTED

---

## Why Both Levels Matter

Level 1 and Level 2 answer different executive questions:

| Question | Level 1 answers | Level 2 answers |
|----------|----------------|-----------------|
| "Where will a code change propagate?" | YES — import hub pressure shows blast radius | PARTIALLY — cross-domain coupling shows propagation direction |
| "Which files are structural bottlenecks?" | YES — centrality, import degree | NO — files are not visible at Level 2 |
| "How is architectural responsibility distributed?" | NO — files don't know about domains | YES — binding topology shows domain-to-capability mapping |
| "Are there disconnected architectural regions?" | NO — file imports don't reveal architectural gaps | YES — binding graph fragmentation |
| "Is structural mass concentrated?" | PARTIALLY — file clustering, role skew | YES — DPSIG on 40.4 topology |
| "Which capability entities are overloaded?" | NO — files don't map to capabilities | YES — surfaces_per_ceu, zone formation |

**The two levels are complementary, not competing.** Level 2 reveals architectural patterns invisible at file level. Level 1 reveals file-level chokepoints invisible at architectural level.

---

## The Abstraction Gap

Level 2 cannot reproduce Level 1 intelligence because:

1. **Population compression.** The binding envelope compresses hundreds of files into tens of architectural nodes. A 944-file specimen becomes a 33-node binding. File-level outliers (app.module.ts with 69 imports) disappear into their parent domain.

2. **Edge abstraction.** IMPORTS_ACROSS edges aggregate file-level import counts. If DOM-04 has 71 aggregate IMPORTS to other domains, that becomes ONE edge in the binding. The distribution within DOM-04 — whether 1 file contributes 69 of those 71 imports — is invisible.

3. **Surface normalization.** The binding's CEU→CS mapping normalizes capability surface distribution. Each CEU maps to exactly 1 CS. File-level surface concentration (one integration hub file serving as the entry point for 43% of the codebase) is not representable.

This is not a deficiency. It is a deliberate architectural property. Level 2 exists to see architectural patterns that file-level data obscures. But it means Level 1 intelligence must be preserved separately.

---

## Level 1→Level 2 Bridge: Enrichment

Level 1 evidence ENTERS Level 2 through Phase 5 enrichment:

```
40.3s code_graph.json (IMPORTS between source files)
  │
  └─ Phase 5 enrichment: _enrich_binding_with_structural_evidence()
       │
       ├─ Cross-DOM IMPORTS → IMPORTS_ACROSS edges in binding
       │   (BlueEdge: 4 edges from 2,138 source IMPORTS)
       │
       └─ Same-DOM IMPORTS → GROUNDS edge import_count annotations
           (decorative — does not change topology)
```

Enrichment is ADDITIVE. It adds edges to the binding, changing fan metrics. But it is also LOSSY — 2,138 source-level IMPORTS compress to 4 IMPORTS_ACROSS edges. The compression ratio (535:1 for BlueEdge) means most file-level structural information does not survive into Level 2.

**This is why Level 1 signal families (ISIG, CSIG) must exist as independent derivations, not as enrichment artifacts.** The enrichment bridge carries aggregate coupling direction into Level 2. It does not carry file-level distribution, hub concentration, or role structure.

---

## DPSIG: Topology-Level (Independent of Both)

DPSIG operates at a third level: raw 40.4 canonical topology. It reads cluster structure directly from the structural substrate — no binding, no enrichment, no file-level evidence. DPSIG is independent of both Level 1 and Level 2.

```
TOPOLOGY LEVEL (DPSIG)     independent — reads 40.4 only
────────────────────────────────────────────────────
LEVEL 2 (PSIG, BSIG)       architectural binding topology
    ↑ enrichment (lossy)
LEVEL 1 (ISIG, CSIG, ESIG) file-level import/centrality
────────────────────────────────────────────────────
RAW SUBSTRATE               40.2 node inventory, 40.3 topology
```

---

## Certification Evidence: BlueEdge Intelligence Delta

The generic corridor (Level 2) compared to the historical shortcut corridor (Level 1) on BlueEdge produced:

| Signal | Historical (Level 1) | Generic (Level 2) | Classification |
|--------|---------------------|-------------------|----------------|
| PSIG-001 | 5.663, 1 entity, 1 zone | 4.0, 2 entities, 4 zones | DIFFERENT_ABSTRACTION_SAME_READ |
| PSIG-002 | 3.210, 1 domain | 4.0, 4 domains | IMPROVED_READ |
| PSIG-004 | 2.182, 1 hub entity | 1.0, uniform distribution | **LOST_READ → RESOLVED by ISIG-001** |
| PSIG-006 | 0, theoretical | 0.1515, genuine isolation | NEW_READ |
| Zones | 1 zone | 4 zones | IMPROVED_READ |
| DPSIG-031 | 2.12, ELEVATED (35 nodes) | 3.45, ELEVATED (944 nodes) | IMPROVED_READ |
| DPSIG-032 | 0.17, BALANCED (false) | 0.57, ASYMMETRIC (true) | IMPROVED_READ |

**Net result:** The generic corridor reveals MORE truthful structural cognition than the historical shortcut corridor. The single LOST_READ (PSIG-004 file-level hub concentration) has been resolved by ISIG-001 (Import Hub Pressure = 35.304 HIGH on BlueEdge, 51.135 HIGH on NetBox). All signal intelligence is now preserved or improved across both abstraction levels.

### Why DPSIG-032 Changed: BALANCED → ASYMMETRIC

The historical DPSIG-032 read from a 35-node DOM-level abstraction where the largest cluster contained 6 of 35 nodes (17%). This looked "balanced."

The generic DPSIG-032 reads from the actual 944-node structural substrate where the "backend" cluster contains 541 of 944 nodes (57%). This is genuinely ASYMMETRIC.

The historical reading was a false reassurance. The generic reading reveals structural truth: more than half of all structural mass is concentrated in one cluster. This is one of the strongest proofs that the generic corridor produces more truthful intelligence.

### Why PSIG-004 Became LOST_READ

PSIG-004 (zone_coverage_concentration) measures whether capability surfaces are concentrated on few entities. At Level 2, the binding distributes surfaces uniformly (1 CS per CE). There is no concentration because the binding construction normalizes this dimension.

At Level 1, the evidence was genuine: one file (app.module.ts) with 69 outbound IMPORTS served as the integration hub for nearly half the codebase. That file-level concentration IS real — but it is a Level 1 phenomenon that architectural binding topology cannot represent.

This is not a generic corridor failure. It is a demonstration that Level 1 and Level 2 see fundamentally different structural realities.

### Why ISIG Was Justified — And Is Now Operational

ISIG (Import Structure Intelligence Signals) is not feature creep, nostalgia, or shortcut rehabilitation. It is a legitimate Level 1 signal family that preserves file-topology early-warning cognition on the generic spine.

**Evidence (operational):**
- `common/dto/index.ts` = 111 inbound IMPORTS → ISIG-001 = 35.304 HIGH (35x mean — structural single-point-of-failure)
- `App.tsx` = 70 outbound IMPORTS → ISIG-002 = 22.264 HIGH (22x mean — integration bottleneck)
- Cross-validated on NetBox: ISIG-001 = 51.135 HIGH, ISIG-002 = 8.949 HIGH (1,155 files, 3,614 IMPORTS)

**ISIG computes:** `max(import_in_degree) / mean(import_in_degree)` (ISIG-001) and `max(import_out_degree) / mean(import_out_degree)` (ISIG-002) directly from 40.3s code graph IMPORTS relationships. Client-agnostic, code-graph-native, standalone derivation.

**Script:** `scripts/pios/isig/derive_import_signals.py`
**Output:** `artifacts/isig/<client>/<run>/isig_signal_set.json`

---

## Signal Family Level Map (LOCKED)

| Family | Level | Evidence Source | Generic? | Status |
|--------|-------|----------------|----------|--------|
| PSIG | Level 2 | binding_envelope.json | YES | OPERATIONAL |
| BSIG | Level 2 | binding_envelope.json | YES | SPECIFIED_NOT_IMPLEMENTED |
| DPSIG | Topology | canonical_topology.json (40.4) | YES | OPERATIONAL |
| ISIG | Level 1 | code_graph.json (40.3s) | PATH A only | **OPERATIONAL** |
| CSIG | Level 1 | structural_centrality.json (40.3c) | PATH A only | PARTIALLY_IMPLIED |
| ESIG | Level 1→2 bridge | Phase 5 enrichment delta | PATH A only | SPECIFIED_NOT_IMPLEMENTED |

---

## Connection to Software Execution Intelligence

Level 1 signals are inherently SOFTWARE EXECUTION signals. They measure phenomena that directly predict:
- **Change propagation risk:** Import hub pressure → blast radius
- **PR review complexity:** Centrality rank → review bottleneck prediction
- **Deployment coordination cost:** Import fan asymmetry → coupling surface
- **Team scaling characteristics:** Role distribution → structural scaling patterns
- **Build impact radius:** Import chain depth → transitive dependency chains

This makes Level 1 the natural bridge between Program Intelligence structural cognition and software execution operational intelligence. When PI evolves toward GitHub-native operationalization (Signäl/Engineering, Tier 1B), Level 1 signals will be the first intelligence layer that connects structural analysis to developer workflow impact.

Level 2 signals are ARCHITECTURAL GOVERNANCE signals. They measure phenomena that predict organizational capability health: domain coupling, capability distribution, governance gaps, structural coherence. These connect to Signäl/PMO (Tier 1A) — advisory structural assessment.

---

## What This Doctrine Does NOT Authorize

- Implementation of ISIG, CSIG, or ESIG computation
- Modification of PSIG formulas or thresholds
- Restoration of SIGNAL_SHORTCUT_RETAINED
- Collapsing Level 1 and Level 2 into a single abstraction
- Treating Level 1 signals as "more precise" versions of Level 2 signals (they measure different things)

---

## Cross-References

- [[SIGNAL_DERIVATION_SPINE]] — full derivation chain
- [[SIGNAL_FAMILY_TAXONOMY]] — family registry with per-family level classification
- [[PATH_A_SIGNAL_INTEGRATION_MAP]] — signal emergence points
- [[../../PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01/BLUEEDGE_SIGNAL_INTELLIGENCE_DELTA]] — certification evidence
- [[../../PI.GENESIS.GENERIC-SIGNAL-LINEAGE-VERIFICATION.01/SIGNAL_DERIVATION_CONTRACT]] — derivation rules (SD-06: Level 1/Level 2 separation)
