# PSEE.1 — Heuristic Admissibility Matrix

**Stream:** PSEE.1
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document classifies each of the 12 Phase A heuristics (H-01 through H-12 from PSEE.F1 heuristic_registry.md) for admissibility in future PSEE executions. Four classifications are used: ADMISSIBLE_REFERENCE (non-canonical, may inform decision support), BLOCKED (forbidden from execution), UNKNOWN-SPACE (insufficient evidence to admit or block), and ESCALATE (requires operator judgment before use).

**Value:** PSEE.1 design rule F.2 requires forensic containment: PSEE.F1 findings may inform admissibility decisions but must not be promoted directly into canonical rules. This matrix is the operational form of that containment.

---

#### METHODOLOGY LAYER

1. For each heuristic H-01..H-12: read PSEE.F1 heuristic_registry.md status (RETAINED / MODIFIED / DISCARDED).
2. Cross-reference against determinism_boundary.md FIXED/CONTINGENT/FORBIDDEN.
3. Assign admissibility class:
   - ADMISSIBLE_REFERENCE: heuristic is safe to use as decision support, provided it does not displace a FIXED rule or create FB-xx violations
   - BLOCKED: heuristic violates a canonical rule or forbidden pattern; must not enter execution
   - UNKNOWN-SPACE: heuristic applicability cannot be determined without observing the target corpus
   - ESCALATE: heuristic applicability requires operator judgment; not safe for automated execution
4. For ADMISSIBLE_REFERENCE: state the safe usage boundary (what it informs, what it cannot override).

---

#### TECHNICAL LAYER

| H-ID | Heuristic name | F1 status | Admissibility | Rationale |
|---|---|---|---|---|
| H-01 | Architecture-first decomposition | MODIFIED | BLOCKED | Violates FB-04 (capability/architecture organization at intake level). The MODIFIED canonical form (R-GRP-01) inverts the direction. Using H-01 (architecture → evidence) rather than R-GRP-01 (evidence → structure) is a canonical rule violation. |
| H-02 | Iterative narrative assessment | DISCARDED | BLOCKED | Violates FB-05 and R-NRM-03 directly. Narrative interpretive output is prohibited at all PSEE execution stages. |
| H-03 | Capability-domain taxonomy as classification anchor | DISCARDED | BLOCKED | Violates FB-04. Capability-domain organization is not a 40.2 intake concern. Using H-03 as a grouping principle at intake level would override R-GRP-01. |
| H-04 | Component inventory by repository | RETAINED | ADMISSIBLE_REFERENCE | Directly survives into R-GRP-01. Safe usage: use as a heuristic for identifying candidate top-level domains when evidence_boundary.md primary_evidence_origin_paths is absent. Cannot override the formal domain list when a boundary document exists. |
| H-05 | Module-level enumeration | RETAINED | ADMISSIBLE_REFERENCE | Directly survives into R-ABS-02. Safe usage: use as a guide for identifying whether a source tree is likely to have repeated module patterns (i.e., look for consistent sub-directory structure). Cannot substitute for actual pattern detection (CT-04); observed structure overrides heuristic expectation. |
| H-06 | Cross-component coordination hotspot detection | MODIFIED | ADMISSIBLE_REFERENCE | Narrow safe usage: may inform identification of candidate overlap pairs for R-NRM-02 (which CEU pairs to check for structural similarity). Cannot determine file_level_parity (that requires diff or evidence). Cannot produce canonical preference without evidence. |
| H-07 | Visual graph modeling of program execution | DISCARDED (40.2) | BLOCKED | Not applicable at 40.2 intake scope. Producing visual graph artifacts during PSEE execution would constitute artifact inflation and scope violation. |
| H-08 | Architecture-source reconciliation | MODIFIED | ADMISSIBLE_REFERENCE | Narrow safe usage: may inform Phase 0 identity confirmation (DP-0-04) as a structural sanity check (do named components match what exists in the source tree?). Cannot override formal identity confirmation from version metadata. |
| H-09 | Evidence index with named evidence IDs | MODIFIED | ADMISSIBLE_REFERENCE | Directly informs R-NAM-01 (CEU identifier scheme). Safe usage: if no evidence boundary defines priority tiers, H-09 (any explicit evidence identifier scheme from Phase A materials) may be used to infer priority ordering. The canonical priority-tier system (FX-05) supersedes any prior EVID-NN scheme. |
| H-10 | Reverse engineering mapping table | MODIFIED | ADMISSIBLE_REFERENCE | May inform the structure of Phase A contributor identification during transformation_mapping. Cannot be used as a substitute for tracing each Phase B unit back to its actual Phase A contributor. Iteration pattern (multiple versions) is explicitly BLOCKED — single-pass, immutable artifacts only. |
| H-11 | Source snapshot intake record | RETAINED | ADMISSIBLE_REFERENCE | Directly informs evidence_boundary.md creation when one does not exist (DP-0-02 fallback). Safe usage: if a source snapshot intake record exists in Phase A materials, it may be used as the basis for constructing an evidence_boundary.md equivalent. It does not replace a formally governed evidence_boundary.md. |
| H-12 | Lessons-learned capture (multi-part) | MODIFIED | UNKNOWN-SPACE | The lessons from Phase A streams informed IG.1A bootstrap design. Future lessons from PSEE execution may inform PSEE.1+ evolution. However, the applicability of specific BlueEdge Phase A lessons to a new corpus cannot be determined in advance. Classification: UNKNOWN-SPACE — neither admit nor block; carry forward only what is observable from the new corpus. |

---

### Admissibility Summary

| Classification | Count | Heuristics |
|---|---|---|
| ADMISSIBLE_REFERENCE | 6 | H-04, H-05, H-06, H-08, H-09, H-10, H-11 |
| BLOCKED | 4 | H-01, H-02, H-03, H-07 |
| UNKNOWN-SPACE | 1 | H-12 |
| ESCALATE | 0 | — |

**Correction:** H-11 also ADMISSIBLE_REFERENCE → total ADMISSIBLE_REFERENCE = 7; BLOCKED = 4; UNKNOWN-SPACE = 1.

| Classification | Final count |
|---|---|
| ADMISSIBLE_REFERENCE | 7 (H-04, H-05, H-06, H-08, H-09, H-10, H-11) |
| BLOCKED | 4 (H-01, H-02, H-03, H-07) |
| UNKNOWN-SPACE | 1 (H-12) |
| ESCALATE | 0 |

---

### Safe Usage Constraints for ADMISSIBLE_REFERENCE Heuristics

All ADMISSIBLE_REFERENCE heuristics are subject to the following universal constraints:

1. **Cannot override FIXED decisions.** If a FIXED rule (FX-01..10) produces a definitive output, the heuristic may not modify it.
2. **Cannot produce canonical record fields.** Heuristics may inform where to look but may not fill CEU, OVL, US, or ClassificationRecord fields without observed evidence.
3. **Cannot resolve unknown-space positions.** A heuristic that "suggests" file_level_parity is KNOWN does not make it KNOWN; parity remains UNKNOWN until evidence is observed.
4. **Must be explicitly flagged as heuristic support in execution logs.** Any decision informed by an ADMISSIBLE_REFERENCE heuristic must be flagged in the PSEEContext escalation_log with the heuristic ID.

### Per-Heuristic Safe Usage Summary

| H-ID | Safe usage | Cannot override / Cannot produce |
|---|---|---|
| H-04 | Candidate domain identification when no boundary doc exists | Formal domain list from boundary doc |
| H-05 | Signal to look for repeated module patterns | Actual pattern detection result (CT-04) |
| H-06 | Candidate overlap pair identification for R-NRM-02 check | file_level_parity; canonical preference |
| H-08 | Phase 0 structural sanity check | Version metadata identity confirmation (DP-0-04) |
| H-09 | Priority tier inference when no boundary tier defined | Canonical CEU-NN sequencing (FX-05) |
| H-10 | Phase A contributor identification prompts | Single-pass transformation_mapping; cannot be iterated |
| H-11 | evidence_boundary.md construction basis when absent | Formally governed boundary document |

---

### BLOCKED Heuristic Enforcement

BLOCKED heuristics must not influence any decision in the PSEE execution path. In PSEE.2 implementation:
- H-01 (architecture-first): the system must not accept architectural-role groupings as input for domain formation; only source-directory paths are valid domain boundaries
- H-02 (narrative assessment): no assessment-type artifact may be produced; any such output is a scope violation
- H-03 (capability taxonomy): capability labels may appear as metadata in Phase B semantic layers (40.3+) but must not be used as domain grouping criteria at 40.2
- H-07 (visual graph): visual artifacts are out of scope for all PSEE phases; detection of such output during PSEE execution indicates a forbidden scope expansion

---

#### EVIDENCE LAYER

| Matrix entry | Source |
|---|---|
| H-01..H-12 heuristic definitions | PSEE.F1/heuristic_registry.md |
| BLOCKED classification basis | determinism_boundary.md FB-04, FB-05, FB-07 |
| ADMISSIBLE_REFERENCE usage constraints | psee_v0_execution_spec.md fallback conditions; R-NRM-03 |
| H-11 admissibility for boundary creation | psee_v0_execution_spec.md reusability statement §5 |
| H-12 UNKNOWN-SPACE classification | doctrine_genealogy.md UNTESTED doctrine elements |

---

#### LIMITATIONS & BOUNDARIES

- The ESCALATE class has zero entries. This reflects that all 12 heuristics have either clear canonical alignment (RETAINED/MODIFIED → ADMISSIBLE_REFERENCE), clear canonical violation (DISCARDED → BLOCKED), or unresolvable applicability (UNKNOWN-SPACE). If PSEE.2 encounters a heuristic not in this catalog, ESCALATE is the default classification.
- ADMISSIBLE_REFERENCE heuristics are non-canonical. They are decision support, not decision authority. No PSEE.2 implementation may claim that a heuristic-supported decision is as authoritative as an evidence-backed decision.
- H-12 (UNKNOWN-SPACE) acknowledges that lessons from new corpus execution may reveal new admissible heuristics. These must be registered as new heuristics (with HH-xx IDs for H-harmonics) in a PSEE.2+ stream, not silently incorporated.

---

#### STATUS

| Check | Result |
|---|---|
| All 12 heuristics classified | COMPLETE |
| Admissibility distribution: 7 ADMISSIBLE / 4 BLOCKED / 1 UNKNOWN | CONFIRMED |
| Safe usage constraints documented | CONFIRMED |
| No canonical mutation | CONFIRMED |

**HEURISTIC ADMISSIBILITY MATRIX: COMPLETE**
