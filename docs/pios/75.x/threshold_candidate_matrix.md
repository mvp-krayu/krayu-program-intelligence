# Threshold Candidate Matrix
## Signal Activation Strategy Classification — 75.x Foundation

**Stream:** PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01
**Layer:** 75.x — Condition Activation Authority
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** CANDIDATE MATRIX — no thresholds finalized; no conditions activated

---

## Reading This Matrix

- **Activation Strategy**: Classification of the most defensible threshold approach. See `threshold_foundation_forensics.md` for full taxonomy.
- **External Benchmark**: Whether peer-reviewed or broadly-accepted literature provides relevant numeric guidance. DIRECT = directly applicable; ADAPTED = applicable with documented formula mapping; DIRECTIONAL = direction only, no numeric; NONE = no applicable literature found.
- **Internal Calibration Required**: Whether a PiOS multi-client corpus is needed before a threshold can be proposed.
- **Pressure-Zone Suitability**: HIGH / MEDIUM / LOW — how well this signal supports pressure-zone identification.
- **Focus-Domain Suitability**: HIGH / MEDIUM / LOW — how well this signal supports focus-domain selection.
- **Status**: Current threshold readiness status.

---

## Matrix

| Signal | CKR / Provisional | Pressure Family | Activation Strategy | External Benchmark | Internal Calibration Required | Pressure-Zone Suitability | Focus-Domain Suitability | Status |
|--------|------------------|-----------------|--------------------|--------------------|-------------------------------|--------------------------|--------------------------|--------|
| SIG-002 / CKR-007 | CANONICAL | Coupling pressure (system-level) | REQUIRES_CORPUS_BASELINE (primary); FIXED_EXTERNAL_BENCHMARK (ADAPTED, if CBO mapping documented) | ADAPTED (Chidamber & Kemerer 1994 CBO; Henry-Kafura 1981) | YES | MEDIUM (system-level; needs per-domain disaggregation) | LOW (system-level scalar) | THRESHOLD_PENDING — requires corpus OR documented benchmark adaptation |
| SIG-004 / CKR-009 | CANONICAL | Structural volatility | COMPOSITE_ONLY — aggregation rule for 4 sub-dimensions required first | DIRECTIONAL (graph density theory; architecture smell research) | YES | MEDIUM (after aggregation rule defined) | LOW (as raw multi-dimensional signal) | BLOCKED — aggregation rule must be defined before activation |
| PSIG-001 | PROVISIONAL_CKR_CANDIDATE | Coupling pressure (fan-in / bottleneck) | RUN_RELATIVE_OUTLIER (primary); FIXED_EXTERNAL_BENCHMARK (ADAPTED via Henry-Kafura fan-in / Palomba God Object) | ADAPTED (Henry-Kafura 1981; Palomba et al. architecture smells) | MINIMAL (ratio is self-normalizing) | HIGH — identifies specific bottleneck node and its domain | HIGH — max fan-in node's domain is strongest coupling pressure focus-domain candidate | THRESHOLD_CANDIDATE — ratio threshold (e.g., > 2.0) is statistically defensible; requires calibration documentation |
| PSIG-002 | PROVISIONAL_CKR_CANDIDATE | Propagation pressure (fan-out / blast-radius) | RUN_RELATIVE_OUTLIER (primary); FIXED_EXTERNAL_BENCHMARK (ADAPTED via Henry-Kafura) | ADAPTED (Henry-Kafura 1981; Palomba et al.) | MINIMAL | HIGH — identifies specific blast-radius node and its domain | HIGH — max fan-out node's domain is strongest propagation pressure focus-domain candidate | THRESHOLD_CANDIDATE — same structure as PSIG-001; ratio threshold statistically defensible |
| PSIG-003 | PROVISIONAL_CKR_CANDIDATE | Cross-domain coordination pressure | REQUIRES_CORPUS_BASELINE (primary); DIRECTIONAL external benchmark | DIRECTIONAL (Martin Stable Dependencies; Clean Architecture coupling guidance) | YES | HIGH — each OVERLAP edge is a specific structural pressure point | HIGH — domain with most incoming OVERLAP edges is coupling-hub focus-domain candidate | THRESHOLD_PENDING — corpus required for ratio threshold; zero-edge degenerate case needs special rule |
| PSIG-004 | PROVISIONAL_CKR_CANDIDATE | Responsibility concentration | RUN_RELATIVE_OUTLIER (primary); FIXED_EXTERNAL_BENCHMARK (ADAPTED via God Object / LCOM research) | ADAPTED (Palomba et al.; Lippert & Roock architecture smell taxonomy; LCOM literature) | MINIMAL (ratio is self-normalizing) | HIGH — max-responsibility CEU and its domain = responsibility pressure zone | HIGHEST — directly and deterministically identifies the overloaded domain; strongest single focus-domain signal from static evidence | THRESHOLD_CANDIDATE — concentration ratio threshold (e.g., > 2.0) is statistically defensible; requires calibration |
| PSIG-005 | PROVISIONAL_CKR_CANDIDATE | Interface surface pressure | COMPOSITE_ONLY (system-level ratio); RUN_RELATIVE_OUTLIER (per-domain concentration companion, once formally defined) | DIRECTIONAL (Martin ISP — Interface Segregation Principle; Halstead module size) | YES (system-level); MINIMAL (per-domain companion) | MEDIUM — surface density alone insufficient; high value when combined with PSIG-003 | MEDIUM — per-domain companion useful as tiebreaker; not a primary focus-domain selector alone | BLOCKED (system-level) — per-domain concentration companion must be formally defined; composite-level activation requires additional specification |
| PSIG-006 | PROVISIONAL_CKR_CANDIDATE | Structural fragmentation | FIXED_EXTERNAL_BENCHMARK (ADAPTED, partial — theoretical zero-baseline); REQUIRES_CORPUS_BASELINE (quantitative threshold above zero) | DIRECTIONAL + THEORETICAL_BASELINE (graph theory connected components; software cohesion principles) | NO (binary "fragmentation exists"); YES (quantitative severity threshold) | LOW (isolated nodes lack coupling signals — they are structural blind spots, not active pressure zones) | LOW — fragmented/isolated nodes are poor focus-domain candidates (no structural coupling evidence) | THRESHOLD_CANDIDATE (binary: fragmentation_index > 0 is a structural observation); THRESHOLD_PENDING (quantitative: > X severity requires corpus) |

---

## Strategy Distribution Summary

| Strategy | Signals |
|----------|---------|
| RUN_RELATIVE_OUTLIER | PSIG-001, PSIG-002, PSIG-004 |
| COMPOSITE_ONLY | SIG-004, PSIG-005 (system-level) |
| REQUIRES_CORPUS_BASELINE | SIG-002, PSIG-003 |
| FIXED_EXTERNAL_BENCHMARK (ADAPTED) | PSIG-001, PSIG-002, PSIG-004 (secondary path) |
| FIXED_EXTERNAL_BENCHMARK (partial/theoretical) | PSIG-006 (zero-baseline only) |
| NOT_THRESHOLD_READY | None |

---

## Readiness Tiers

### THRESHOLD_CANDIDATE — can proceed to threshold calibration contract

Signals whose threshold strategy is sufficiently grounded to support a calibration contract without additional research:

| Signal | Strategy | Rationale | Next Step |
|--------|----------|-----------|-----------|
| PSIG-001 | RUN_RELATIVE_OUTLIER | Concentration ratio is self-normalizing; statistical outlier reasoning applies; fan-in literature confirms direction | Define ratio threshold with statistical justification (e.g., > 2.0, > 3.0); document Henry-Kafura adaptation mapping |
| PSIG-002 | RUN_RELATIVE_OUTLIER | Same structure as PSIG-001 | Same as PSIG-001 |
| PSIG-004 | RUN_RELATIVE_OUTLIER | Concentration ratio is self-normalizing; God Object literature confirms direction | Define ratio threshold; document Palomba/LCOM adaptation mapping |
| PSIG-006 | THEORETICAL_BASELINE | Zero-baseline is graph-theory defensible; binary indicator requires no calibration | Formalize binary indicator rule: fragmentation_index > 0 triggers a structural observation (NOT a pressure-zone — a blind-spot map) |

### THRESHOLD_PENDING — requires additional evidence or specification

| Signal | Blocker | Resolution Path |
|--------|---------|-----------------|
| SIG-002 | Corpus required; per-domain disaggregation formula not defined | PiOS corpus collection contract; per-domain SIG-002 sub-computation specification |
| PSIG-003 | Corpus required; zero-edge degenerate case needs rule | PiOS corpus collection contract; degenerate case rule |
| PSIG-006 (quantitative) | Corpus required for threshold above zero-baseline | PiOS corpus collection contract |

### BLOCKED — structural prerequisite missing

| Signal | Blocker | Resolution Path |
|--------|---------|-----------------|
| SIG-004 | No aggregation rule for 4 sub-dimensions | Authorized 75.x aggregation rule definition contract |
| PSIG-005 (system-level) | Scale-sensitive; per-domain companion not formally defined | PSIG-005b companion signal registration; corpus calibration |

---

## External Benchmark Reference Types

| Benchmark Type | Signals | Literature Sources (type only — not a citation list) |
|---------------|---------|------------------------------------------------------|
| ADAPTED — fan-in/fan-out metrics | PSIG-001, PSIG-002 | Henry-Kafura complexity metrics (1981); architecture smell catalogues |
| ADAPTED — coupling/cohesion | SIG-002 | Chidamber & Kemerer CBO (1994); Basili et al. defect prediction studies |
| ADAPTED — responsibility concentration / God Object | PSIG-004 | Palomba et al. architecture smell detection; Lippert & Roock taxonomy; LCOM family |
| DIRECTIONAL — cross-domain coupling | PSIG-003 | Martin Stable Dependencies Principle; Clean Architecture coupling guidance |
| DIRECTIONAL — graph density / volatility | SIG-004 | Graph theory density bounds; architecture smell research |
| DIRECTIONAL — interface surface | PSIG-005 | Martin Interface Segregation Principle; Halstead module metrics |
| THEORETICAL — graph connectivity | PSIG-006 | Graph theory connected components (standard graph theory) |

**Governance rule:** Before any ADAPTED benchmark is used in a threshold contract, a mapping document must be produced that:
1. States the source metric name, formula, and literature reference
2. States the PiOS metric name and formula
3. Documents the structural analogies and any differences
4. Assigns status: DIRECT, ADAPTED, or DIRECTIONAL
5. Declares any limitations of the adaptation

---

## Compound Signal Notes

Several signals produce complementary evidence and should be evaluated jointly before focus-domain selection:

| Signal Pair / Group | Joint Signal | Compound Observation |
|--------------------|-------------|----------------------|
| PSIG-001 + PSIG-002 (same node) | Coupling + Propagation hub | A node with max fan-in AND max fan-out is the highest compound structural pressure point — simultaneously a bottleneck and a blast-radius source |
| PSIG-003 + PSIG-005 (same domain) | Cross-domain coupling + Surface exposure | A domain receiving OVERLAP edges AND having disproportionate surface count is a surface-exposure pressure zone candidate |
| PSIG-004 + PSIG-001 (same domain) | Responsibility overload + Intake bottleneck | A domain with both max-responsibility CEU and max-fan-in node is the compound structural pressure zone — strongest focus-domain candidate |
| PSIG-006 + PSIG-003 (inverse) | Fragmentation + Coupling concentration | When fragmentation is high (many isolated nodes) AND PSIG-003 is nonzero (few cross-domain edges), the existing cross-domain connections carry disproportionate structural weight — fragmentation amplifies coupling pressure at the few existing coupling points |

Compound signal rules must be formally defined before compound pressure zones can be raised.
