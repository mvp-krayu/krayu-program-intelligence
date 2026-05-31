# PICP Consumer Contract

**Stream:** PI.PICP-STRATEGY-AND-CANONICALIZATION.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. Purpose

This document defines the contract between the PICP (L4 cognition artifact) and its consumers (L5 projection families, LENS personas, marketplace modules). It specifies what consumers receive, what they may do, and what they may NOT do.

---

## 2. What Consumers Receive

### 2.1 The PICP

Every consumer receives the same PICP. There is no consumer-specific cognition — all consumer differentiation happens at L5 (projection rendering).

**PICP content:**

| Object | Consumer Access | Notes |
|--------|----------------|-------|
| structural_posture | FULL | Always available, always invariant |
| tension_map | FULL | Always available, always invariant |
| constraint_inventory | FULL | Content varies by active modules |
| exposure_assessment | FULL | Content varies by active modules |
| trajectory_assessment | FULL | Content varies by active modules |
| decision_surface | FULL | Content varies by active modules |
| absence_profile | FULL | Explicitly includes what is NOT measured |
| competitive_intelligence | FULL | Content varies by active modules |
| operational_ceiling | FULL | Content varies by active modules |

"Content varies by active modules" means: the object is always present, but its fields are populated only by active domain cognition modules. Without Software Intelligence, constraint_inventory contains structural constraints only — no software-behavioral constraints.

### 2.2 Metadata

Every PICP includes:

| Metadata Field | Purpose |
|---------------|---------|
| specimen_id | Which program was assessed |
| pipeline_run_id | Which pipeline run produced this PICP |
| production_timestamp | When the PICP was materialized |
| active_modules | Which domain cognition modules contributed |
| qualification_state | S-level and Q-class at production time |
| materialization_log | Per-materializer validation results |
| version | PICP schema version |

### 2.3 Provenance

Every field in every cognition object carries:

| Provenance Field | Purpose |
|-----------------|---------|
| source_artifact | Which pipeline artifact contributed this value |
| derivation_method | DETERMINISTIC or RULE-BASED |
| evidence_classification | EVIDENCE_DERIVED, STRUCTURAL_CENTRALITY_DERIVED, etc. |
| pipeline_stage | Which L-layer produced the source |

---

## 3. What Consumers May Do

### 3.1 Projection Families (L5 Consumers)

Projection families consume the PICP through the PRE. They MAY:

| Action | Example | Governance |
|--------|---------|-----------|
| RENDER any object | Display structural_posture in a report chapter | None required |
| HIDE any non-invariant object | Suppress absence_profile in BOARDROOM BRIEFING | ProjectionConfig.objects_to_hide |
| COMPRESS any object | Reduce tension_map to headline in ADVISORY MEMO | ProjectionConfig.compression |
| EXPAND any object | Show full constraint_inventory in M&A ASSESSMENT | ProjectionConfig.objects_to_expand |
| REFRAME vocabulary | "Execution constriction" → "delivery bottleneck" | ProjectionConfig.vocabulary_domain |
| SEQUENCE content | Recommendations-first in ADVISORY MEMO, evidence-first in REPORT | ProjectionConfig.structure |
| APPLY tone | Analytical for REPORT, facilitative for WORKSHOP | ProjectionConfig.tone |

### 3.2 LENS Personas (Surface Consumers)

LENS personas consume projection outputs. They MAY:

| Action | Example | Governance |
|--------|---------|-----------|
| TRAVERSE cognition objects | Navigate from tension_map to constraint_inventory | Topology-derived (investigative authority) |
| QUERY cognition objects | "What contributes to this convergence center?" | 5B.1 guided query layer |
| COMPARE cognition objects | Cross-object correlation in DENSE mode | Deterministic display |
| EXPORT cognition state | Evidence record with PICP snapshot | Governed export with identity |

### 3.3 Marketplace Modules (Intelligence Consumers)

Domain cognition modules consume the PICP for enrichment. They MAY:

| Action | Example | Governance |
|--------|---------|-----------|
| READ any object | Access structural_posture for domain context | Module activation gate |
| ENRICH with domain fields | Add software-behavioral constraints to constraint_inventory | Module contribution contract |
| PRODUCE domain conditions | SignalSynthesisEngine producing EXECUTION_FRAGILITY | Module L2-L3 pipeline |
| CONTRIBUTE to PICP | Module-specific fields within the 9-object structure | Module L4 contribution |

---

## 4. What Consumers May NOT Do

### 4.1 Universal Prohibitions

No consumer, at any level, may:

| Prohibition | Rationale |
|-------------|-----------|
| CREATE cognition not in the PICP | L5 renders L4 output — it does not produce intelligence |
| MODIFY the PICP | The PICP is immutable once materialized. Modifications require re-materialization |
| CLAIM authority beyond the PICP | If the PICP says "unmeasured," the projection may not say "likely" |
| INTRODUCE interpretive judgment at L4 | L4 operates at ZERO interpretive authority |
| EXCEED 75.x bounds at L5 | All 13 absolute prohibitions apply to all projections |
| FABRICATE evidence | Evidence provenance is PICP-bound. No projection may cite evidence not in the PICP |
| SOFTEN qualification state | S-level and Q-class are governance facts. No projection may reframe them as aspirational |
| RANK or PRIORITIZE without evidence | Decision_surface contains urgency classification — projections may render it but not override it |

### 4.2 Projection-Specific Prohibitions

| Prohibition | Applies To | Rationale |
|-------------|-----------|-----------|
| EXPAND invariant elements | All projections | Specimen identity, S-level, convergence count, operational ceiling, evidence disclaimer are always rendered as-is |
| HIDE invariant elements | All projections | See above — these are audience-independent facts |
| RENDER hidden elements | All projections | Pipeline internals, signal technical details, derivation log are never rendered |
| TRANSLATE structural terminology without mapping | Investment Review, M&A Assessment | Vocabulary translation must be governed by vocabulary_domain mapping, not freeform |

### 4.3 The 13 Absolute Prohibitions (Inherited from 75.x)

At L5, all projections are bound by:

1. No team behavior inference
2. No organizational intent inference
3. No human motive interpretation
4. No cultural diagnosis
5. No leadership quality assessment
6. No management effectiveness assessment
7. No personnel attribution
8. No behavioral prediction
9. No organizational sentiment
10. No causal attribution to humans
11. No remediation prioritization
12. No "you should" language
13. No ranked next actions

These are NON-OVERRIDABLE. No ProjectionConfig, no marketplace module, no consumer contract can bypass them.

---

## 5. Consumer Lifecycle

### 5.1 Registration

New consumers (projection families or marketplace modules) register through a G1 governance stream:

| Registration Requirement | Purpose |
|-------------------------|---------|
| Consumer identity | Name, type (projection/module/persona) |
| PICP consumption contract | Which objects consumed, at what depth |
| Rendering authority | Deterministic, investigative, or interpretive (75.x) |
| Prohibition acknowledgment | Explicit confirmation of 13 absolute prohibitions |
| Vocabulary domain | Which vocabulary mapping applies |

### 5.2 Versioning

When the PICP schema evolves (new cognition objects, modified fields):

| Evolution | Consumer Impact | Migration |
|-----------|----------------|-----------|
| New optional object added | No breaking change | Consumer may ignore new object |
| Existing object field added | No breaking change | Consumer may ignore new field |
| Existing object field removed | Breaking change | Consumer must update — G1 stream required |
| Object renamed | Breaking change | Consumer must update — G1 stream required |

### 5.3 Validation

Consumers validate their consumption at projection time:

| Check | Action on Failure |
|-------|-------------------|
| Required objects present | FAIL — projection cannot render |
| Object schema matches expected version | WARN — proceed with available fields |
| Active modules match consumer expectations | DEGRADE — render with reduced content, explicit disclosure |
| Provenance chain intact | FAIL — evidence-bound requirement violated |

---

## 6. Summary

The consumer contract establishes three invariants:

1. **One PICP, many consumers.** All consumers receive the same cognition. Differentiation is rendering, not intelligence.

2. **L4 is the truth ceiling.** No consumer may introduce cognition that does not exist in the PICP. The PICP is what we know. Projections are how we say it.

3. **13 prohibitions are non-negotiable.** No consumer, at any authority level, may infer human behavior, prescribe actions, or rank recommendations. This is the governance moat that makes PI trustworthy in enterprise contexts.
