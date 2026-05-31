# PICP Terminology Reconciliation

**Stream:** PI.PICP-STRATEGY-AND-CANONICALIZATION.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. Reconciliation Mandate

Two G1 discovery streams introduced 8 new architectural terms and superseded 3 existing concepts. This document evaluates each term for canonical adoption, rejection, or modification.

**Decision criteria:**
1. Does the term accurately describe what it names?
2. Does the term conflict with locked vault terminology?
3. Does the term limit future architectural scope?
4. Is the term necessary or is an existing term sufficient?

---

## 2. Central Question: ECP vs PICP

### 2.1 The Question

> "Is Executive merely one consumer? Does the package exist before executive projection?"

### 2.2 Evidence

The Executive Cognition Package was defined as containing 9 structured objects:

| Object | Executive-Specific? | Domain-Neutral? |
|--------|---------------------|-----------------|
| structural_posture | NO — program identity and qualification | YES |
| tension_map | NO — convergence centers, class activation | YES |
| constraint_inventory | NO — throughput ceilings, blast radii | YES |
| exposure_assessment | NO — concentration, fragility | YES |
| trajectory_assessment | NO — worsening/stable pattern trajectories | YES |
| decision_surface | PARTIALLY — leverage points are domain-neutral, urgency is domain-neutral | YES |
| absence_profile | NO — inactive conditions, unmeasured | YES |
| competitive_intelligence | NO — detection advantages, detectability gaps | YES |
| operational_ceiling | NO — ceiling drivers, properties | YES |

**Result:** 0 of 9 objects are executive-specific. All 9 derive from structural pipeline outputs without audience targeting. The "executive" label was inherited from the EIC specification, which the ECR stream explicitly superseded for conflating cognition with rendering.

### 2.3 Projection Family Evidence

The 8 projection families demonstrate that the SAME package serves:

| Family | Audience | Is this "Executive"? |
|--------|----------|---------------------|
| REPORT | CEO, CTO, Board | Yes |
| BOARDROOM BRIEFING | Board, C-Suite | Yes |
| ADVISORY MEMO | CEO or CTO | Yes |
| M&A ASSESSMENT | Investment committee, PE | Financial, not executive |
| TRANSFORMATION REVIEW | VP Eng, Program Architect | Engineering, not executive |
| PORTFOLIO REVIEW | CTO, Portfolio Manager | Operational, not executive |
| EXECUTIVE WORKSHOP | Leadership team | Yes |
| INVESTMENT REVIEW | Investors, PE, Fund Managers | Financial, not executive |

**Result:** 4 of 8 projections serve non-executive audiences. The package is consumed by financial, engineering, and operational audiences — not exclusively executive.

### 2.4 Decision

**RENAME: ECP → PICP (Program Intelligence Cognition Package)**

Rationale:
- The package is produced by the PI pipeline (L0-L3), not by an executive cognition process
- All 9 objects are structurally derived, audience-independent, and projection-neutral
- 4 of 8 projection families serve non-executive audiences
- "Executive" was contamination from the EIC framing that the ECR stream explicitly superseded
- The package exists BEFORE any projection decision — it is Program Intelligence cognition, not executive cognition
- Naming it "Executive" would constrain future consumers (engineering operational views, compliance assessments, operational dashboards)

**Risk assessment:** Minimal — the term ECP has appeared in only 2 uncommitted stream artifacts and 0 vault pages. Renaming at this stage has zero propagation cost.

---

## 3. Term-by-Term Reconciliation

### 3.1 Terms to LOCK (adopt into canonical vocabulary)

| Term | Definition | Status | Rationale |
|------|-----------|--------|-----------|
| **PICP** (Program Intelligence Cognition Package) | Canonical L4 artifact — 9 structured cognition objects, deterministic, replayable, diffable, projection-independent | **LOCK** | Renamed from ECP. The product is cognition, not executive output. See §2. |
| **Cognition Object** | A structured L4 element within the PICP. 9 defined: structural_posture, tension_map, constraint_inventory, exposure_assessment, trajectory_assessment, decision_surface, absence_profile, competitive_intelligence, operational_ceiling | **LOCK** | Accurate, necessary, no conflict |
| **Materializer** | A pure function that produces a single cognition object from CIP inputs. 9 materializers in the L4 runtime | **LOCK** | Accurate, necessary, standard functional vocabulary |
| **Projection Family** | A named rendering configuration that transforms a PICP into an audience-specific deliverable. 8 defined | **LOCK** | Accurate, necessary, no conflict |
| **ProjectionConfig** | The parameterization schema consumed by the PRE: projection_type, audience, format, rendering_overrides | **LOCK** | Accurate, necessary, no conflict |
| **CIP** (Compiled Intelligence Package) | The input contract for the L4 runtime: fullReport + synthesisResult + consequenceResult + cognitionOntology + classRiskLabels + qualificationPackage | **LOCK** | Retained from EIC specification. Accurately describes the L0-L3 assembly consumed by L4 |

### 3.2 Terms to LOCK WITH RENAME

| Original | Renamed | Definition | Rationale |
|----------|---------|-----------|-----------|
| **ECR** (Executive Cognition Runtime) | **PICR** (Program Intelligence Cognition Runtime) | L4 runtime that consumes CIP and produces PICP through 9 materializers | Same "Executive" contamination as ECP. The runtime is Program Intelligence infrastructure, not executive-specific |
| **ECP** (Executive Cognition Package) | **PICP** (Program Intelligence Cognition Package) | See §2 | Central reconciliation decision |

### 3.3 Terms to LOCK UNCHANGED

| Term | Definition | Status | Rationale |
|------|-----------|--------|-----------|
| **PRE** (Projection Rendering Engine) | L5 component that transforms PICP + ProjectionConfig into rendered deliverables | **LOCK** | Accurately named — it IS a rendering engine for projections. No audience contamination |
| **L4** (Cognition layer) | Pipeline layer between L3 (Consequences) and L5 (Projection). Structured cognition, ZERO interpretive authority | **LOCK** | Accurate layer designation. No conflict with git_structure_contract L0-L8 (different namespace) |
| **L5** (Projection layer) | Pipeline layer that renders L4 cognition into audience-specific deliverables. 75.x bounded interpretive authority | **LOCK** | Accurate layer designation |

### 3.4 Terms to SUPERSEDE

| Term | Superseded By | Rationale |
|------|-------------|-----------|
| **EIC** (Executive Intelligence Compiler) | PICR + PRE | The EIC conflated L4 cognition with L5 rendering. Already declared superseded in PI.EXECUTIVE-COGNITION-RUNTIME.01. Never entered vault |
| **T7** (Consulting Judgment) | DISSOLVED — reclassified as 77% L4 cognition + 23% L5 rendering | The category was a conflation, not a genuine transformation type. Never entered vault |
| **55/20/25 Composition Ratio** | 55/20/19/6 (structural/narrative/cognition/rendering) | Corrected after T7 dissolution. Never entered vault |

### 3.5 Terms to RETAIN (not lock — useful but not canonical)

| Term | Status | Rationale |
|------|--------|-----------|
| **T1-T6** (Transformation Taxonomy: Evidence Extraction through Audience Narration) | RETAIN as reference | Useful forensic vocabulary but not runtime-operative. The transformation taxonomy describes how reports are currently built, not how the pipeline operates |
| **55/20/19/6** (Composition Ratio) | RETAIN as reference | Descriptive finding about the BlueEdge report. Not generalizable to all specimens or projections |
| **CF-1 through CF-7** (Cognitive Functions from EIC spec) | RETAIN as reference | Useful for understanding the compilation pipeline but may be revisited when PICR is implemented. Not yet operative |

---

## 4. Conflict Analysis

### 4.1 Vault Terminology Collisions

**None found.** All proposed terms are new additions to the vocabulary. No collision with any of the ~50 locked terms in TERMINOLOGY_LOCK.md.

### 4.2 Namespace Conflicts

| Potential Conflict | Resolution |
|-------------------|------------|
| L4/L5 (pipeline layers) vs L0-L8 (git_structure_contract) | Different namespaces. Pipeline L4/L5 describes processing stages. Git L0-L8 describes branch ownership layers. No collision. Add disambiguation note to vault if both appear on the same page |
| PICP vs PiOS | Different concepts. PICP is a runtime artifact (output of L4). PiOS is the computational substrate (the whole system). The "PI" prefix is shared but unambiguous — PICP is always the cognition package, PiOS is always the operating system |
| PICR vs PiOS | Different concepts. PICR is the L4 runtime component. PiOS is the substrate. Similar to how SignalSynthesisEngine is a component within PiOS |

### 4.3 Scope Creep Risk

| Term | Scope Creep Risk | Mitigation |
|------|-----------------|------------|
| PICP | LOW — well-defined (9 objects, deterministic, projection-independent) | Lock the 9-object inventory. New objects require a G1 stream |
| Projection Family | MODERATE — 8 families defined but more could emerge | Lock as extensible registry with G1 gate for additions |
| Materializer | LOW — 1:1 with cognition objects | Locked by PICP object count |

---

## 5. Reconciliation Summary

### 5.1 Lock Decisions

| Action | Count | Terms |
|--------|-------|-------|
| LOCK (new) | 6 | PICP, Cognition Object, Materializer, Projection Family, ProjectionConfig, CIP |
| LOCK WITH RENAME | 2 | ECR→PICR, ECP→PICP |
| LOCK UNCHANGED | 3 | PRE, L4, L5 |
| SUPERSEDE | 3 | EIC, T7, 55/20/25 |
| RETAIN (not lock) | 3 | T1-T6, 55/20/19/6, CF-1–CF-7 |

### 5.2 Vault Propagation Required

The following terms require TERMINOLOGY_LOCK.md entries:
1. PICP
2. PICR
3. PRE
4. CIP
5. L4 (Pipeline Cognition Layer)
6. L5 (Pipeline Projection Layer)
7. Cognition Object
8. Materializer
9. Projection Family
10. ProjectionConfig

### 5.3 Supersession Declarations

To be recorded in vault:
1. EIC → SUPERSEDED by PICR + PRE
2. ECP → RENAMED to PICP (not superseded — same concept, better name)
3. ECR → RENAMED to PICR (not superseded — same concept, better name)
