# BlueEdge Signal Intelligence Delta

> **Core question:** Did the generic signal corridor improve, preserve, or reduce BlueEdge early-warning intelligence?
> **Stream:** PI.BLUEEDGE.GENERIC-SIGNAL-COMPUTATION.01
> **Date:** 2026-05-23
> **Verdict:** NET IMPROVEMENT — 4 improved reads, 1 preserved, 1 new, 1 lost (OPEN_GAP)

---

## Methodology

This report compares signal INTELLIGENCE USEFULNESS, not numerical values.

Each signal change is classified as:
- **IMPROVED_READ** — the generic corridor reveals structural truth that was hidden or narrower before
- **DIFFERENT_ABSTRACTION_SAME_READ** — the intelligence is preserved but measured at a different structural level
- **LOST_READ** — intelligence that was available is no longer visible (becomes OPEN_GAP)
- **NEW_READ** — intelligence that was not previously available
- **UNDETERMINED** — insufficient evidence to classify

---

## PSIG-001: coupling_pressure

| Dimension | Historical (Level 1) | Generic (Level 2) |
|-----------|---------------------|-------------------|
| Value | 5.663 | 4.0 |
| State | HIGH | HIGH |
| Primary entity | NODE-0021 (app.module.ts) | CE-04 (api_layer), CE-08 (testing_validation) |
| Primary domain | DOM-04 (backend_app_root) | DOM-05 (backend_common) |
| Zones active in | PZ-001 | PZ-001, PZ-002, PZ-003, PZ-004 |
| Population | 35 nodes, per-file IMPORTS | 33 nodes, binding topology edges |

**Historical intelligence read:** "One file (app.module.ts) imports 69 others — that file is a structural coupling magnet. Coupling is concentrated in DOM-04."

**Generic intelligence read:** "Two capability entities (api_layer, testing_validation) each receive 4× the mean inbound binding connections. Coupling pressure exists across 4 domains."

**Assessment:** Both detect coupling concentration. Historical sees it at file level (one file that imports 69 others). Generic sees it at architectural level (two capability entities receiving disproportionate binding edges). The intelligence "coupling is concentrated in the backend" is preserved. Generic reveals it in TWO entities rather than one, and across 4 domains rather than 1.

### Classification: DIFFERENT_ABSTRACTION_SAME_READ

The intelligence is preserved. The entity identification changed (file → CEU) because the structural level changed. The early-warning value — "coupling is concentrated here, changes propagate through this node" — holds at both levels.

---

## PSIG-002: export_pressure

| Dimension | Historical (Level 1) | Generic (Level 2) |
|-----------|---------------------|-------------------|
| Value | 3.210 | 4.0 |
| State | HIGH | HIGH |
| Primary domain | DOM-04 (backend_app_root) | DOM-04, DOM-05, DOM-08, DOM-09 |
| Zones active in | PZ-001 | PZ-001, PZ-002, PZ-003, PZ-004 |
| Evidence | 71 aggregate outbound IMPORTS from DOM-04 | 4 domains each with fan_out=4 (IMPORTS_ACROSS edges) |

**Historical intelligence read:** "DOM-04 (backend_app_root) broadcasts 71 IMPORTS to other domains — it's the dominant export pressure source."

**Generic intelligence read:** "Four domains (DOM-04, DOM-05, DOM-08, DOM-09) each have 4× the mean outbound edge count. Export pressure is multi-directional — cross-domain coupling flows in all directions, not just from one domain."

**Assessment:** Historical saw export pressure concentrated in ONE domain. Generic reveals export pressure DISTRIBUTED across 4 domains — all with IMPORTS_ACROSS edges. This is a richer, more accurate structural picture. An audience reading the historical signal would think "DOM-04 is the problem." An audience reading the generic signal understands "cross-domain coupling is systemic."

### Classification: IMPROVED_READ

The generic corridor reveals broader structural truth. Export pressure is not concentrated — it is distributed. This changes the executive understanding from "fix one domain" to "the coupling topology itself is the pressure source."

---

## PSIG-004: zone_coverage_concentration

| Dimension | Historical (Level 1) | Generic (Level 2) |
|-----------|---------------------|-------------------|
| Value | 2.182 | 1.0 |
| State | HIGH | HIGH (zone-attributed, not entity-activated) |
| Primary entity | NODE-0021 (app.module.ts) | CE-04 (api_layer) — via domain attribution only |
| Entity-level activation | YES — 15/35 node fraction | NO — all CEs have exactly 1 capability surface |
| Threshold | 2.0 | 2.0 |

**Historical intelligence read:** "One entity covers 15 of 35 nodes (43%) — it's a responsibility magnet. app.module.ts is an integration hub that binds nearly half the structural population."

**Generic intelligence read:** "Capability surfaces are uniformly distributed (1 surface per CE). No capability entity is overloaded."

**Assessment:** The historical Level 1 signal revealed genuine file-level integration hub concentration — one file (app.module.ts) with 69 outbound IMPORTS served as the structural integration point for nearly half the codebase. This intelligence is GENUINELY LOST at Level 2. The generic binding distributes capability surfaces uniformly (10 CEs, 10 CSs, 1:1 mapping). There is no capability surface concentration at the architectural level because the binding construction normalizes surface distribution.

The signal value 1.0 appears as HIGH in the projection through zone-level domain attribution (carried along by PSIG-001 and PSIG-002 activation), but no entity actually triggered PSIG-004. This is domain correlation propagation, not genuine activation.

### Classification: LOST_READ

**OPEN_GAP: LEVEL_1_SIGNAL_FAMILY_REQUIRED**

The file-level integration hub intelligence ("one file imports 69 others and serves as the coupling nexus") is not visible at Level 2. This is not an abstraction shift that preserves meaning — it is a genuine loss of early-warning capability.

**Resolution path:** ISIG-001 (Import Hub Pressure) would capture exactly this intelligence: `max(import_in_degree) / mean(import_in_degree)`. For BlueEdge: `common/dto/index.ts` has 111 inbound IMPORTS; `app.module.ts` has 69 outbound IMPORTS. Both are file-level structural truths that Level 2 binding topology cannot see.

This gap is not shortcut nostalgia. It is a genuine intelligence dimension that Level 2 does not and cannot reproduce. ISIG implementation would close this gap.

---

## PSIG-006: isolation_pressure

| Dimension | Historical (Level 1) | Generic (Level 2) |
|-----------|---------------------|-------------------|
| Value | 0 | 0.1515 |
| State | ACTIVATED (THEORETICAL_BASELINE) | ACTIVATED (genuine isolation) |
| Connected components | N/A (not computed) | 6 components in 33-node graph |
| Isolation detected | NO | YES |

**Historical intelligence read:** "No structural isolation detected. THEORETICAL_BASELINE — the signal exists but has no activation evidence."

**Generic intelligence read:** "The binding graph has 6 disconnected components. 5 of 33 architectural nodes (15.15%) are structurally isolated — they participate in no cross-domain edge. Architectural regions exist that don't interact."

**Assessment:** The generic corridor detects structural isolation that was INVISIBLE at Level 1. The historical signal was a theoretical placeholder with no activation. The generic signal reveals genuine architectural fragmentation — disconnected binding regions that represent domains with no structural coupling to the rest of the architecture.

### Classification: NEW_READ

This is genuinely new intelligence. The audience now knows: "parts of the architecture are structurally disconnected — changes in these regions have zero observed propagation path to other regions." This is an early-warning signal about architectural coherence that did not exist before.

---

## Pressure Zones

| Dimension | Historical | Generic |
|-----------|-----------|---------|
| Total zones | 1 | 4 |
| Zone classes | PZ-001: COMPOUND_ZONE | PZ-001–PZ-004: all COMPOUND_ZONE |
| Zone domains | DOM-04 | DOM-04, DOM-05, DOM-08, DOM-09 |
| Zone conditions | PSIG-001 + PSIG-002 + PSIG-004 | PSIG-001 + PSIG-002 + PSIG-004 (zone-attributed) |
| Members | 2 entities (NODE-0021, DOM-04) | 4 entities (DOM-04, DOM-05, DOM-08, DOM-09) |

**Historical intelligence read:** "One pressure zone exists, anchored at DOM-04 (backend_app_root). All pressure converges on one architectural point."

**Generic intelligence read:** "Four pressure zones exist across 4 domains. Structural pressure is distributed across the binding topology — DOM-04, DOM-05, DOM-08, and DOM-09 all carry compound pressure."

### Classification: IMPROVED_READ

The generic corridor reveals that pressure is systemic, not localized. An executive reading 1 zone sees "a problem spot." An executive reading 4 zones sees "a structural pattern." This is materially better early-warning cognition.

---

## DPSIG-031: Cluster Pressure Index (CPI)

| Dimension | Historical | Generic |
|-----------|-----------|---------|
| Value | 2.1176 | 3.4532 |
| State | CLUSTER_PRESSURE_ELEVATED | CLUSTER_PRESSURE_ELEVATED |
| Source topology | 35 nodes, 13 clusters | 944 nodes, 10 clusters |
| Max cluster | 6 nodes | 541 nodes ("backend") |
| Evidence basis | DOM-level abstraction | Raw 40.4 structural topology |

**Historical intelligence read:** "Cluster pressure is ELEVATED. The largest cluster is modestly larger than average."

**Generic intelligence read:** "Cluster pressure is ELEVATED. The 'backend' cluster contains 541 of 944 structural nodes. The largest cluster is 3.45× the mean non-singleton cluster size. Structural mass is concentrating."

### Classification: IMPROVED_READ

Same activation state but with dramatically better evidence basis. The historical reading was on a 35-node abstracted topology where "elevated" pressure wasn't particularly alarming. The generic reading is on the actual 944-node structural substrate where 57% of all files live in one cluster. The intelligence value — "structural investment is concentrating" — is far more actionable from the real topology.

---

## DPSIG-032: Cluster Fan Asymmetry (CFA)

| Dimension | Historical | Generic |
|-----------|-----------|---------|
| Value | 0.1714 | 0.5731 |
| State | CLUSTER_BALANCED | CLUSTER_ASYMMETRIC |
| Max cluster share | 17% (6/35) | 57% (541/944) |

**Historical intelligence read:** "Cluster distribution is BALANCED. No single cluster dominates. Structure is evenly spread."

**Generic intelligence read:** "Cluster distribution is ASYMMETRIC. The 'backend' cluster holds 57% of all structural nodes. One cluster gravitationally captures the majority of the structural topology."

### Classification: IMPROVED_READ

This is the single most significant intelligence improvement. The historical reading said "balanced" — a false reassurance derived from the DOM-level abstraction where clusters were small and relatively equal. The generic reading reveals the truth: one cluster dominates the entire structural topology. This is a critical early-warning signal about investment concentration risk that was previously INVISIBLE.

An executive reading the historical signal would feel structurally safe. An executive reading the generic signal understands: "57% of our structural mass is in one architectural cluster. That's a concentration risk."

---

## Intelligence Delta Summary

| Signal | Classification | Direction |
|--------|---------------|-----------|
| PSIG-001 (coupling_pressure) | DIFFERENT_ABSTRACTION_SAME_READ | Intelligence preserved at different level |
| PSIG-002 (export_pressure) | IMPROVED_READ | Broader, more accurate structural picture |
| PSIG-004 (zone_coverage_concentration) | **LOST_READ** | OPEN_GAP — file-level hub concentration invisible at Level 2 |
| PSIG-006 (isolation_pressure) | NEW_READ | Genuine new intelligence — architectural fragmentation |
| Pressure zones | IMPROVED_READ | 4 zones vs 1 — pressure revealed as systemic |
| DPSIG-031 (CPI) | IMPROVED_READ | Same state, real structural substrate |
| DPSIG-032 (CFA) | IMPROVED_READ | False BALANCED → genuine ASYMMETRIC — critical correction |

**Net result:** 4 IMPROVED_READ + 1 DIFFERENT_ABSTRACTION_SAME_READ + 1 NEW_READ + 1 LOST_READ

---

## OPEN_GAP: PSIG-004 LOST_READ

**Gap:** File-level integration hub concentration (import hub pressure, import fan asymmetry) is not visible at Level 2 architectural binding topology.

**Evidence of loss:** BlueEdge has `common/dto/index.ts` with 111 inbound IMPORTS and `app.module.ts` with 69 outbound IMPORTS. These are structural chokepoints that determine change propagation risk, PR review complexity, and deployment coordination cost. Level 2 binding topology does not capture this — it sees CEU-to-DOM relationships, not file-to-file coupling.

**Classification:** LEVEL_1_SIGNAL_FAMILY_REQUIRED

**Resolution path:** ISIG (Import Structure Intelligence Signals) — specifically:
- ISIG-001: Import Hub Pressure = `max(import_in_degree) / mean(import_in_degree)`
- ISIG-002: Import Fan Asymmetry = `max(import_out_degree) / mean(import_out_degree)`

Raw data already exists in `40.3c/structural_centrality.json` (643 ranked files with in_degree and out_degree). Implementation requires naming the signals, not discovering the evidence.

This gap does NOT justify retaining SIGNAL_SHORTCUT_RETAINED. The shortcut produced Level 1 values from a different derivation chain through a non-governed path. The correct resolution is implementing ISIG as a first-class Level 1 signal family on the generic spine.

---

## Certification Gate

**Did the generic signal corridor improve, preserve, or reduce BlueEdge early-warning intelligence?**

**Answer: NET IMPROVEMENT.**

The generic corridor:
- CORRECTS a false reassurance (DPSIG-032 BALANCED → ASYMMETRIC — the most consequential single change)
- BROADENS the pressure picture (4 zones vs 1, export pressure distributed across 4 domains)
- DISCOVERS new intelligence (PSIG-006 genuine isolation, previously invisible)
- PRESERVES the coupling concentration read (PSIG-001 at architectural level)
- LOSES one read (PSIG-004 file-level hub concentration) → classified as OPEN_GAP with clear resolution path

Program Intelligence is NOT blinder. It sees more structural truth than before. The one lost read has a governed resolution path (ISIG) and does not justify retaining legacy shortcuts.

---

## What This Report Does NOT Authorize

- Implementation of ISIG/CSIG/ESIG (requires explicit approval)
- Restoration of SIGNAL_SHORTCUT_RETAINED (permanently removed)
- Modification of PSIG thresholds or formulas
- Modification of DPSIG computation
