# Gap Consolidation and Execution Roadmap

**Stream:** PI.SOFTWARE-INTELLIGENCE.GAP-CONSOLIDATION-AND-EXECUTION-ROADMAP.01
**Classification:** G2 — Architecture-Consuming
**Baseline:** 6613e9c (compilation model merged to main)

**Governing inputs:**
- PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01
- PI.SOFTWARE-INTELLIGENCE.EXISTING-SLICE-AUDIT-AND-CLASSIFICATION.01
- PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01
- PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-CONSUMPTION-MODEL.01
- PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01

---

## §1 — Purpose

53 implementation gaps were identified across the five governance baselines. This document collapses them into 5 executable programs, classified by type and priority.

The 53 gaps look overwhelming. They are not. Most collapse into a small number of root causes, and many appear in multiple baselines (the same gap surfaces in the slice audit, the compilation model, and the consumption model). Deduplication reveals the actual work.

---

## §2 — Classification Vocabulary

| Type | Definition | Example |
|---|---|---|
| **INFRASTRUCTURE** | Runtime substrate that other work depends on. Enabling, not visible to operators. | Structured derivation_trace, schema validation |
| **GOVERNANCE DEBT** | Constitutional obligations that exist but are not met. The governance model says X should work; it doesn't. | INVESTIGATION staleness, maturity advancement |
| **PRODUCT EXPANSION** | New capability that extends coverage or depth. Not broken — absent. | Class C slice, temporal evidence |
| **REPLAY DEBT** | Inability to reproduce or verify a computation from persisted state. | No persistence, no replay envelope |

| Priority | Definition |
|---|---|
| **MUST FIX** | The system cannot self-verify without this. Blocks INVESTIGATION, blocks maturity promotion, blocks governance compliance. |
| **SHOULD FIX** | Architecturally important but the system operates correctly without it. Compensating mechanisms exist. |
| **CAN WAIT** | Extends the system. Valuable but not debt — new capability. |

---

## §3 — Root Cause Analysis

Before listing programs, identify the root causes that generate multiple gaps:

### Root Cause 1: Unstructured Evidence Chain

`derivation_trace` is a prose string. `evidence_summary` is a prose string. `evidence_refs` are string IDs not addressable references. `_src_type` is stripped before output.

**This single root cause generates 13 of 53 gaps:** E-1, E-2, E-4, E-5, E-8, E-9, E-10, E-11, E-12, E-14, E-15, E-16, S-4.

Fix the evidence chain structure → 13 gaps resolve.

### Root Cause 2: INVESTIGATION Froze at Pre-Compiler State

INVESTIGATION was last modified 2026-05-14. The consequence compiler, slice taxonomy, ontology consumption model, and compilation model all arrived after that date. INVESTIGATION verifies a system that no longer matches what it can see.

**This single root cause generates 9 of 53 gaps:** I-1 through I-9.

Revalidate INVESTIGATION → 9 gaps resolve.

### Root Cause 3: No Maturity Advancement Infrastructure

The slice taxonomy defines a 6-stage maturity lifecycle (CANDIDATE → SPECIMEN → FOUNDATIONAL → COMPOSABLE → CERTIFIED → DEPRECATED). But no schema validation exists, no persistence exists, and no runtime contract defines what a slice must satisfy at each level. Nothing can advance.

**This single root cause generates 10 of 53 gaps:** M-1 through M-7, S-1, G-1, G-2.

Build maturity infrastructure → 10 gaps resolve.

### Root Cause 4: Ontology Classes C, D, E Lack Independent Evidence

Class C has no condition — fragility is a byproduct. Class D has no condition — reinforcement is emergent. Class E has no direct condition — drift is cross-class. 12 CANDIDATE slices have no implementation.

**This single root cause generates 11 of 53 gaps:** O-1 through O-8, G-3, S-5, S-6.

Expand ontology coverage → 11 gaps resolve.

### Root Cause 5: Persona Projection Design Losses + Missing Temporal Substrate

BOARDROOM and BALANCED intentionally compress evidence (design choice). Class E requires multi-run temporal comparison that doesn't exist. DENSE needs minor vocabulary revalidation.

**This single root cause generates 8 of 53 gaps:** P-1 through P-4, E-3, E-6, E-7, E-13.

Some are design choices (not bugs). Others require temporal infrastructure that doesn't exist.

### Root Cause 6: No Persistence or Replay

The slice audit flags persistence absence as the LARGEST gap. Everything is in-memory. No evidence store. No replay envelope.

**This generates 2 gaps but has the largest scope:** S-2, S-3.

---

## §4 — The Five Programs

### Program 1: EVIDENCE CHAIN STRUCTURING

**Type:** INFRASTRUCTURE
**Priority:** MUST FIX
**Dependencies:** None — this is the foundation

**Absorbs 13 gaps:**

| Gap | Description | Resolution |
|---|---|---|
| E-1 | derivation_trace is prose string | Replace with structured object: `{ source_id, rule, target_id, section }` |
| E-2 | Signal IDs lost in consequences | Add `source_signal_ids[]` to consequence objects |
| E-4 | evidence_summary is prose | Replace with structured object: `{ condition_count, condition_types[], source_signal_families[] }` |
| E-5 | Cognition slices lack evidence_refs | Add `evidence_refs[]` to slice objects |
| E-8 | Signal numeric values lost at condition stage | Add `source_signal_values{}` to condition (optional — values exist in fullReport) |
| E-9 | Feature tags lost after activation | Add `activation_features[]` to condition (low priority) |
| E-10 | Zone membership lost in consequences | Add `pressure_zone_id` to consequence (when applicable) |
| E-11 | Topology edge data lost | Not carried — reference via condition_id lookup (acceptable loss) |
| E-12 | Condition type stripped from output | Preserve `source_condition_types[]` on consequence (don't strip) |
| E-14 | evidence_refs are string IDs not URIs | Define addressable evidence reference format |
| E-15 | temporal_marker ABSENT everywhere | Add `temporal_marker` field to conditions and consequences |
| E-16 | Condition prose replaced by vocabulary | Acceptable loss — vocabulary is more consistent (NO ACTION) |
| S-4 | No provenance on cognition slices | Add structured provenance to slice objects |

**Resolution:** 11 require implementation. 2 are acceptable losses (E-11 topology edges, E-16 prose replacement).

**Expected streams:**
- PI.SOFTWARE-INTELLIGENCE.EVIDENCE-CHAIN-STRUCTURING.01 — structured derivation_trace, signal preservation, evidence_refs

**Why first:** Structured evidence chain unblocks FOUNDATIONAL promotion (Program 3), INVESTIGATION verification (Program 2), and schema validation. Every other program benefits from this.

---

### Program 2: INVESTIGATION REVALIDATION

**Type:** GOVERNANCE DEBT
**Priority:** MUST FIX
**Dependencies:** Compilation model (LOCKED ✓). Enhanced by Program 1 but not blocked by it.

**Absorbs 9 gaps:**

| Gap | Description | Resolution |
|---|---|---|
| I-1 | SW-INTEL view is pre-compiler | Replace SoftwareIntelligenceInvestigationView with consequence-aware rendering |
| I-2 | Does not consume consequence posture | Wire forInvestigation() output into INVESTIGATION rendering |
| I-3 | Does not consume slice taxonomy | Add ontology class and maturity display |
| I-4 | Does not verify consequence derivation chains | Add derivation chain verification section |
| I-5 | Does not verify combination pattern integrity | Add combination decomposition verification |
| I-6 | SA section lacks condition-level evidence | Add condition evidence classification to Signal Audit |
| I-7 | IP section may miss SW-INTEL prohibitions | Verify and extend Inference Prohibition |
| I-8 | GA section lacks slice maturity | Add maturity classification to Governance Audit |
| I-9 | Class D proof-only not operational | Implement consequence-level verification for combinations |

**Resolution:** All 9 require implementation. This is a G2 runtime stream.

**Expected streams:**
- PI.INVESTIGATION.CONSEQUENCE-VERIFICATION-REVALIDATION.01

**Parallel execution:** Can run in parallel with Program 1. INVESTIGATION revalidation verifies the current compilation chain. Evidence chain improvements (Program 1) are additive — they make INVESTIGATION's job easier but aren't prerequisites. INVESTIGATION can verify against current (string-based) derivation traces, then benefit from structured traces later.

**Why now:** INVESTIGATION is the system's self-verification layer. Every governance baseline assumes INVESTIGATION will eventually verify the claims. A stale INVESTIGATION means the governance arc has no verification closure.

---

### Program 3: RUNTIME SUBSTRATE MATURATION

**Type:** GOVERNANCE DEBT + REPLAY DEBT
**Priority:** SHOULD FIX (after Programs 1 and 2)
**Dependencies:** Program 1 (structured evidence enables schema validation and maturity promotion)

**Absorbs 12 gaps:**

| Gap | Description | Resolution |
|---|---|---|
| M-1 | Cognition slices at CANDIDATE | Promote after evidence enrichment (Program 1) |
| M-2 | Topology conditions at SPECIMEN | Promote to FOUNDATIONAL after structured derivation_trace |
| M-3 | Consequence types at SPECIMEN | Promote to FOUNDATIONAL after structured evidence_summary |
| M-4 | No construct qualifies for COMPOSABLE | Requires composition contracts (slice runtime contract) |
| M-5 | No construct qualifies for CERTIFIED | Requires full governance lifecycle — long-term |
| M-6 | Projection surfaces NON-SLICE | Correct classification — NO ACTION |
| M-7 | ZoneComposer NON-SLICE | Correct classification — NO ACTION |
| S-1 | No schema validation | Define JSON schemas for conditions, consequences, slices |
| S-2 | No persistence | Define evidence store contract — major architectural decision |
| S-3 | No replay envelope | Define replay format — depends on persistence |
| G-1 | Slice Runtime Contract not authorized | Must precede maturity promotion |
| G-2 | Foundational Slice Stabilization not authorized | Stabilize 5 foundational slices at FOUNDATIONAL |

**Resolution:** 2 are correct classifications (NO ACTION). 10 require implementation across 2-3 streams.

**Expected streams:**
- PI.SOFTWARE-INTELLIGENCE.SLICE-RUNTIME-CONTRACT.01 — what a slice must satisfy at each maturity level
- PI.SOFTWARE-INTELLIGENCE.SCHEMA-VALIDATION-AND-FOUNDATIONAL-PROMOTION.01 — JSON schemas + promote conditions/consequences to FOUNDATIONAL
- PI.SOFTWARE-INTELLIGENCE.EVIDENCE-STORE-CONTRACT.01 — persistence architecture (major scope — may be deferred)

**Why after Programs 1-2:** Maturity promotion requires structured evidence (Program 1). Schema validation requires knowing what fields exist (after evidence enrichment). Persistence is architecturally important but the system operates correctly in-memory — this is durability debt, not correctness debt.

---

### Program 4: ONTOLOGY COVERAGE EXPANSION

**Type:** PRODUCT EXPANSION
**Priority:** CAN WAIT
**Dependencies:** Program 3 (maturity pipeline must exist before creating new slices that need to advance through it)

**Absorbs 11 gaps:**

| Gap | Description | Resolution |
|---|---|---|
| O-1 | Class C has no condition | Create independent fragility condition (not DPC byproduct) |
| O-2 | Class D has no condition | Assess whether D needs a condition or is correctly emergent |
| O-3 | Class E has no direct condition | Create independent drift condition (requires temporal evidence) |
| O-4 | Class C has no PRIMARY persona | Will resolve when Class C condition exists — BALANCED or DENSE will become PRIMARY |
| O-5 | Class E has no PRIMARY persona | Will resolve when Class E evidence deepens |
| O-6 | Class C NOT APPLICABLE in INVESTIGATION | Will change to PROOF-ONLY when Class C evidence exists |
| O-7 | 12 CANDIDATE slices have no implementation | Implement in priority order per taxonomy §18 |
| O-8 | Import Pressure Concentration lacks topology projection | Add topology overlay for 5th foundational slice |
| G-3 | Advanced Slice Specimens not authorized | First: Class C foundational slice |
| S-5 | COMPOUND_CONVERGENCE suppressed as slice | Assess whether it should be activated |
| S-6 | GOVERNANCE_COVERAGE_STATUS classified NON-SLICE | Correct classification — NO ACTION |

**Resolution:** 1 is correct classification (NO ACTION). 2 are consequential (resolve when upstream gaps close). 8 require implementation.

**Expected streams:**
- PI.SOFTWARE-INTELLIGENCE.ADVANCED-SLICE-SPECIMENS.01 — first Class C foundational slice, Import Pressure topology
- PI.SOFTWARE-INTELLIGENCE.CLASS-E-TEMPORAL-EVIDENCE.01 — multi-run comparison infrastructure (large scope)

**Why can wait:** The system produces meaningful output with Classes A and B. C, D, E gaps are about depth and breadth, not correctness. The operator sees real structural consequences from real evidence. Missing classes mean some structural dynamics are invisible — but the visible ones are correct.

---

### Program 5: PERSONA PROJECTION ENRICHMENT

**Type:** PRODUCT EXPANSION
**Priority:** CAN WAIT SIGNIFICANTLY
**Dependencies:** Programs 1, 2, and partially 4

**Absorbs 8 gaps:**

| Gap | Description | Resolution |
|---|---|---|
| E-3 | Condition IDs lost in BOARDROOM | DESIGN CHOICE — executive altitude. NO ACTION unless operator descent is required. |
| E-6 | Condition IDs resolved to display_title in BALANCED | PARTIAL DESIGN CHOICE — add optional condition_id alongside display_title |
| E-7 | Ontology class not explicit on consequences | Add `ontology_class` field to consequence objects. Small change, architectural significance. |
| E-13 | Derivation trace lost in BOARDROOM/BALANCED | DESIGN CHOICE — compression. NO ACTION for BOARDROOM. Consider for BALANCED. |
| P-1 | DENSE minor revalidation | Verify topology overlays consume latest 4-slice vocabulary. Minor. |
| P-2 | BOARDROOM Class E permanently SUPPRESSED | DESIGN CHOICE — below executive altitude. NO ACTION. |
| P-3 | BALANCED Class E SECONDARY only | Correct for current evidence depth. NO ACTION until Class E expands. |
| P-4 | Class E requires multi-run temporal evidence | Depends on Program 4 Class E temporal infrastructure. |

**Resolution:** 4 are design choices (NO ACTION). 1 is minor (P-1). 3 require implementation.

**Expected streams:**
- May fold into other programs. E-7 (ontology class field) could attach to Program 1. P-1 (DENSE revalidation) could attach to Program 2.

**Why can wait significantly:** Most gaps here are intentional compression, not bugs. BOARDROOM SHOULD lose condition IDs — that's its constitutional objective (executive altitude). The real implementation items (E-7, P-1) are small enough to fold into adjacent programs.

---

## §5 — Program Dependency Graph

```
Program 1 (Evidence Chain)
  │
  ├──→ Program 2 (INVESTIGATION)  [enhanced by, not blocked by]
  │
  └──→ Program 3 (Runtime Maturation)
         │
         └──→ Program 4 (Ontology Expansion)
                │
                └──→ Program 5 (Persona Enrichment)
```

**Critical path:** 1 → 3 → 4
**Parallel path:** 2 (runs alongside 1)
**Deferred:** 5 (folds into other programs)

---

## §6 — Gap Absorption Summary

| Program | Gaps Absorbed | Require Implementation | Design Choice / No Action | Consequential (resolve upstream) |
|---|---|---|---|---|
| 1 — Evidence Chain | 13 | 11 | 2 | 0 |
| 2 — INVESTIGATION | 9 | 9 | 0 | 0 |
| 3 — Runtime Maturation | 12 | 10 | 2 | 0 |
| 4 — Ontology Expansion | 11 | 8 | 1 | 2 |
| 5 — Persona Enrichment | 8 | 3 | 4 | 1 |
| **TOTAL** | **53** | **41** | **9** | **3** |

**53 gaps → 41 require implementation, 9 are design choices, 3 resolve when upstream closes.**

---

## §7 — Priority Matrix

| Priority | Programs | Gap Count | Character |
|---|---|---|---|
| **MUST FIX** | 1 (Evidence Chain), 2 (INVESTIGATION) | 22 | The system cannot self-verify without these. Evidence chain enables everything. INVESTIGATION is the verification closure. |
| **SHOULD FIX** | 3 (Runtime Maturation) | 12 | The maturity lifecycle exists on paper but nothing can advance. Compensating mechanism (compiler bridge) works but is debt. |
| **CAN WAIT** | 4 (Ontology Expansion) | 11 | More classes, more slices, more coverage. Not broken — absent. |
| **CAN WAIT SIGNIFICANTLY** | 5 (Persona Enrichment) | 8 | Mostly design choices. Fold into adjacent programs. |

---

## §8 — Execution Sequence

### Phase A — Verification Foundation (Programs 1 + 2, parallel)

**Goal:** The system can verify its own compilation chain.

| Stream | Program | Scope |
|---|---|---|
| PI.SOFTWARE-INTELLIGENCE.EVIDENCE-CHAIN-STRUCTURING.01 | 1 | Structured derivation_trace, signal preservation, evidence_refs |
| PI.INVESTIGATION.CONSEQUENCE-VERIFICATION-REVALIDATION.01 | 2 | Bring INVESTIGATION current with compilation model |

These run in parallel. Evidence chain structuring makes the chain machine-parseable. INVESTIGATION revalidation makes the verification layer current. Together they close the self-verification loop.

### Phase B — Maturity Advancement (Program 3)

**Goal:** Constructs can advance through the maturity lifecycle.

| Stream | Program | Scope |
|---|---|---|
| PI.SOFTWARE-INTELLIGENCE.SLICE-RUNTIME-CONTRACT.01 | 3 | Define what a slice must satisfy at each maturity level |
| PI.SOFTWARE-INTELLIGENCE.SCHEMA-VALIDATION-AND-FOUNDATIONAL-PROMOTION.01 | 3 | JSON schemas + promote conditions/consequences to FOUNDATIONAL |

### Phase C — Coverage Expansion (Program 4)

**Goal:** Ontology coverage deepens beyond Classes A and B.

| Stream | Program | Scope |
|---|---|---|
| PI.SOFTWARE-INTELLIGENCE.ADVANCED-SLICE-SPECIMENS.01 | 4 | First Class C foundational slice, Import Pressure topology |

### Phase D — Deferred

**Goal:** Durability and temporal evidence.

| Stream | Program | Scope |
|---|---|---|
| PI.SOFTWARE-INTELLIGENCE.EVIDENCE-STORE-CONTRACT.01 | 3 | Persistence architecture — major scope, deferred to Phase D |
| PI.SOFTWARE-INTELLIGENCE.CLASS-E-TEMPORAL-EVIDENCE.01 | 4 | Multi-run comparison infrastructure — large scope |

---

## §9 — What This Roadmap Does NOT Do

- Does not authorize any stream. Each stream requires its own execution contract.
- Does not prioritize within programs. Stream-level ordering is for the execution contract.
- Does not define implementation detail. Each stream discovers implementation through evidence inspection.
- Does not modify the 5 governing baselines.
- Does not create new architectural concepts.

---

## §10 — Closure Verdict

**PASS — 53 GAPS CONSOLIDATED INTO 5 PROGRAMS**
