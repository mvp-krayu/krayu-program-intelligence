# OPERATOR Cognitive Flow Resolution

**Stream:** PI.OPERATOR.COGNITIVE-FLOW-RESOLUTION.01
**Classification:** G1 — Architecture-Mutating
**Branch:** feature/runtime-demo
**Baseline:** 64ec729 (PI.OPERATOR.LABEL-EXPLAINABILITY-COVERAGE.01 committed)
**Depends on:** PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01 (OPERATOR recognized)
**Depends on:** PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01 (8-step flow established)
**Depends on:** PI.OPERATOR.LABEL-EXPLAINABILITY-COVERAGE.01 (vocabulary coverage complete)

---

## §1 — Problem Statement

The OPERATOR surface renders sections from 5 different cognition families without governed ownership:

- **OPERATOR-native** sections (topology, signals, evidence trace)
- **SQO qualification overlay** sections (governance audit, posture, reconciliation)
- **SW-Intel domain cognition** sections (conditions, consequences)
- **Cross-persona / Report Pack** sections (declaration, ribbon, evidence record)
- **Future INVESTIGATION** sections (verification protocol)

The prior resequencing (PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01) improved reading order but did NOT resolve which sections belong to which cognition family. Without ownership resolution, any further component moves risk producing a cleaner Frankenstein rather than a governed cognitive workflow.

This document locks section ownership, cognitive sequence, and merge/collapse/move decisions. Implementation follows in a separate stream.

---

## §2 — Current Section Map

### §2.1 Center Lane (OperatorTraceField — IntelligenceField.jsx)

| # | Section | Component | ~Line | Renders |
|---|---------|-----------|-------|---------|
| 1 | Orientation | RepModeTag | 6050 | "Evidence lens" header, zone navigation indicator |
| 2 | Reading Guide | OperatorReadingGuide | 6061 | "HOW TO READ THIS VIEW" preamble, TermHint glossary (53 entries) |
| 3 | Topology Preview | TopologyGraph | 6065 | Clickable SVG topology → TopologyModal (operator mode) |
| 4 | Structural Spines | StructuralSpinesPanel | 6077 | Centrality rankings, structural role analysis (conditional on structural_enrichment.available) |
| 5 | SW-Intel View | SoftwareIntelligenceOperatorView | 6080 | QualificationContextStrip, PeakSeverityStrip, CognitionSurfaceCards, CognitionEvidenceFooter (conditional on swIntelActive) |
| 6 | Verification | VerificationProtocolSection | 8116 | Compilation chain verification corridor (conditional on verificationState.active) |
| 7 | Signal Intelligence | OperatorSignalIntelligence | 6082 | ISIG/DPSIG/PSIG family-grouped cards at 4-decimal precision |
| 8 | Governance Audit | InvestigationGovernanceAudit | 6084 | S-level lifecycle + deep forensics (propositions, enrichment, revalidation, certification, convergence) behind collapse toggle |
| 9 | Evidence Trace | inline | 6086 | Hash chain: evidence_object_hash → derivation_hash → baseline_anchor → run_id |
| 10 | Signal Evidence | inline | 6113 | Per-domain evidence blocks with propagation role, pressure tier, grounding status |
| 11 | Topology Explorer | TopologyModal (portal) | 6143 | Full forensic topology in modal overlay |

### §2.2 Outer Shell Zones (LensDisclosureShell tier allocation)

| Tier | Zone | Component | Renders |
|------|------|-----------|---------|
| tier0 | Declaration | DeclarationZone | Disclosure header, specimen metadata |
| tier1 | Semantic Trust Posture | SemanticTrustPostureZone | SQO posture assessment |
| tier1 | Reconciliation Awareness | ReconciliationAwarenessZone | Reconciliation state summary |
| tier1 | Qualifier Mandate | QualifierMandate | Qualification mandate + ALI rules |
| tier2 | Intelligence Field | IntelligenceField | Center lane (OperatorTraceField) |
| tier2 | SQO Intelligence | SQOIntelligenceZone | SQO summary intelligence |
| tier2 | Evidence Depth Layer | EvidenceDepthLayer | **SUPPRESSED** for OPERATOR_DENSE |
| tier2 | Governance Ribbon | GovernanceRibbon | Summary governance strip |

OPERATOR-specific shell rules (LensDisclosureShell.jsx):
- tier2 does NOT collapse for OPERATOR_DENSE
- EvidenceDepthLayer returns null for OPERATOR_DENSE

### §2.3 Columns

| Position | Component | Renders |
|----------|-----------|---------|
| Left | ExecutiveInterpretation | Specimen-oriented overview (OPERATOR variant) |
| Right | SupportRail | EVIDENCE STATE block, EVIDENCE RECORD export, guided queries (Report Pack hidden for OPERATOR) |

---

## §3 — Cognitive Family Classification

### Family A — OPERATOR-Native (Engineering Evidence Inspection)

Sections that exist because of OPERATOR's constitutional objective: "inspect raw evidence at full numeric precision, audit governance lifecycle state."

| Section | Rationale | Constitutional Anchor |
|---------|-----------|----------------------|
| RepModeTag | Sets cognitive mode, identifies evidence lens framing | Persona Mission Contract: primary question "What does the raw evidence show?" |
| OperatorReadingGuide | Explains how to read evidence substrate | Persona Mission Contract: operator-controlled attention requires orientation |
| Topology Preview | Structural substrate inspection in forensic mode | Persona Mission Contract: "full evidence depth" includes structural topology |
| Structural Spines | Centrality evidence inspection at structural level | Persona Mission Contract: "signal audit at 4-decimal precision" extends to centrality |
| Signal Intelligence | Full-depth signal cards with 4-decimal precision, family grouping | Persona Mission Contract: explicit "signal audit at 4-decimal precision" |
| Evidence Trace | Hash chain lineage — evidence_object_hash, derivation_hash, baseline | Persona Mission Contract: "audit governance lifecycle state" includes evidence provenance |
| Signal Evidence | Per-domain propagation evidence blocks | Persona Mission Contract: "full evidence depth" includes per-domain signal backing |
| Topology Explorer | Deep forensic topology modal | Persona Mission Contract: operator-controlled attention, high agency exploration |

### Family B — SQO Qualification Overlay

Sections belonging to the SQO qualification state machine, rendered within OPERATOR as governance context.

| Section | Rationale | Canonical Home |
|---------|-----------|----------------|
| Governance Audit | SQO lifecycle: S-level, propositions, enrichment, revalidation, certification | SQO Cockpit — rendered inline for OPERATOR governance audit |
| SemanticTrustPostureZone | SQO posture assessment | SQO Cockpit — rendered as outer shell zone |
| ReconciliationAwarenessZone | Reconciliation state summary | SQO Cockpit — rendered as outer shell zone |
| QualifierMandate | Qualification mandate + ALI rules | SQO Cockpit — rendered as outer shell zone |
| SQOIntelligenceZone | SQO summary intelligence | SQO Cockpit — rendered as outer shell zone |

### Family C — SW-Intel Domain Cognition Module

Sections belonging to the Software Intelligence domain cognition module, activated by commercial toggle.

| Section | Rationale | Canonical Home |
|---------|-----------|----------------|
| SW-Intel Operator View | Module cognition surface: qualification context, peak severity, cognition surface cards | SW-Intel Module — rendered inline via swIntelSlot render-prop |

### Family D — Cross-Persona / Report Pack

Sections serving evidence record export or cross-persona disclosure.

| Section | Rationale | Canonical Home |
|---------|-----------|----------------|
| DeclarationZone | Specimen disclosure header, rendered by all personas | LENS v2 shell — tier0, universal |
| GovernanceRibbon | Summary governance strip, rendered by all personas | LENS v2 shell — tier2, universal |
| EVIDENCE STATE (SupportRail) | Evidence backing assessment | Report Pack — cross-persona export |
| EVIDENCE RECORD (SupportRail) | Governed evidence export builder | Report Pack — cross-persona export |
| ExecutiveInterpretation | Persona-adapted left column overview | LENS v2 shell — all personas have a variant |

### Family E — Future INVESTIGATION

Sections constitutionally owned by the future INVESTIGATION persona.

| Section | Rationale | Canonical Home |
|---------|-----------|----------------|
| Verification Protocol | Compilation chain verification: fixed sequence, PASS/FAIL assertions | INVESTIGATION persona (per PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01 §3.2) |

Verification Protocol is currently rendered inside OPERATOR conditionally (on VERIFY button invocation). It remains accessible from OPERATOR as a cross-persona invocation until INVESTIGATION is built. Ownership is INVESTIGATION; residency is OPERATOR (temporary).

---

## §4 — Section Ownership Table

| Section | Current Owner | Canonical Owner | Disposition |
|---------|--------------|-----------------|-------------|
| RepModeTag | OPERATOR | **OPERATOR** | STAY |
| OperatorReadingGuide | OPERATOR | **OPERATOR** | STAY |
| Topology Preview | OPERATOR | **OPERATOR** | STAY |
| Structural Spines | OPERATOR | **OPERATOR** | STAY |
| Signal Intelligence | OPERATOR | **OPERATOR** | STAY |
| Evidence Trace | OPERATOR | **OPERATOR** | STAY |
| Signal Evidence | OPERATOR | **OPERATOR** | MOVE (into Phase 3) |
| Topology Explorer | OPERATOR | **OPERATOR** | STAY |
| SW-Intel View | OPERATOR (inline) | **SW-INTEL MODULE** | STAY (module-gated, architecturally correct) |
| Verification Protocol | OPERATOR (conditional) | **INVESTIGATION** (future) | STAY (temporary — transfer when INVESTIGATION built) |
| Governance Audit | OPERATOR (inline) | **SQO OVERLAY** | STAY (positioned correctly in Phase 5) |
| SemanticTrustPostureZone | Shell tier1 | **SQO OVERLAY** | COLLAPSE into GovernanceRibbon |
| ReconciliationAwarenessZone | Shell tier1 | **SQO OVERLAY** | COLLAPSE into GovernanceRibbon |
| QualifierMandate | Shell tier1 | **SQO OVERLAY** | COLLAPSE into GovernanceRibbon |
| SQOIntelligenceZone | Shell tier2 | **SQO OVERLAY** | COLLAPSE into GovernanceRibbon |
| DeclarationZone | Shell tier0 | **CROSS-PERSONA** | STAY |
| GovernanceRibbon | Shell tier2 | **CROSS-PERSONA** | STAY (absorbs collapsed SQO zones) |
| ExecutiveInterpretation | Left column | **CROSS-PERSONA** | STAY (OPERATOR variant) |
| SupportRail | Right column | **CROSS-PERSONA** | STAY |

---

## §5 — Label Classification: Cognition Objects vs Vocabulary

### §5.1 Cognition Objects

Labels that carry operational meaning dependent on context, qualification state, or cognitive position. These need section-level ownership and cognitive flow resolution — NOT tooltip definitions.

| Label | Cognition Family | Why Not Vocabulary |
|-------|-----------------|-------------------|
| S-levels (S0, S1, S2, S3) | SQO | State machine positions — meaning depends on current vs target vs transition context |
| Q-classes (Q-01–Q-04) | SQO | Governance qualification — requires understanding grounding ratio computation, not a static definition |
| Signal families (ISIG, DPSIG, PSIG) | PI Core | Intelligence families with derivation levels (L1 vs L2 vs topology) — context-dependent meaning |
| Signal severity (HIGH, ELEVATED, MODERATE, NOMINAL) | PI Core | Threshold-dependent severity classification — implication varies by signal family and specimen |
| Propagation roles (ORIGIN, PASS-THROUGH, RECEIVER) | PI Core | Structural positions requiring topological understanding — not standalone glossary entries |
| Pressure tiers (HIGH, ELEVATED, MODERATE, LOW) | PI Core | Pressure zone classification — meaning depends on zone composition and specimen |
| Condition types (DEPENDENCY_CHOKE_POINT, PROPAGATION_ASYMMETRY, etc.) | SW-Intel | Module-synthesized conditions — operational cognition objects, not vocabulary |
| Consequence classes (8 primitives + 3 combinations) | SW-Intel | Compiled operational implications derived from conditions — not static definitions |
| Consequence scope (LOCAL, REGIONAL, SYSTEMIC) | SW-Intel | Structural extent classification — meaning depends on consequence type and evidence |
| Topology cognition slices (corridor vs field) | SW-Intel | Cognition categories with distinct visual languages — require category understanding |

### §5.2 Vocabulary

Glossary candidates appropriate for TermHint hover definitions. All 53 current TERM_DECODE_MAP entries are correctly classified as vocabulary. No additional vocabulary candidates identified by this audit.

### §5.3 Resolution Path for Cognition Objects

Cognition objects require DIFFERENT treatment than vocabulary:

| Object Class | Resolution Mechanism | Stream |
|-------------|---------------------|--------|
| S-levels | Section ownership → Governance Audit owns S-level rendering with lifecycle context | Resolved by THIS stream (§4) |
| Q-classes | Section ownership → GovernanceRibbon or Governance Audit renders with computation context | Resolved by THIS stream (§4) |
| Signal families | Section ownership → Signal Intelligence owns family-grouped rendering with derivation level context | Resolved by THIS stream (§4) |
| Signal severity | Inline context within Signal Intelligence cards — severity shown alongside value/threshold | Already resolved by PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01 |
| Propagation roles | Inline context within Signal Evidence blocks — role shown alongside domain topology | Already resolved by PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01 |
| Pressure tiers | Inline context within Signal Evidence blocks — tier shown alongside zone composition | Already resolved by PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01 |
| Condition types | Section ownership → SW-Intel Operator View renders with evidence classification | Resolved by THIS stream (§4) |
| Consequence classes | Section ownership → SW-Intel Operator View renders with compilation chain context | Resolved by THIS stream (§4) |
| Consequence scope | Inline within SW-Intel consequence cards | Already resolved by SW-Intel implementation |
| Topology cognition slices | Section ownership → SW-Intel via topology overlay rendering | Already resolved by SW-Intel implementation |

---

## §6 — Target Cognitive Sequence

### §6.1 Canonical OPERATOR Reading Flow

```
PHASE 1: ORIENTATION — What am I looking at?
  ├── DeclarationZone (cross-persona)
  ├── GovernanceRibbon (compressed SQO posture: S-level, Q-class, posture state)
  ├── RepModeTag (OPERATOR framing: "Evidence lens")
  └── OperatorReadingGuide (preamble + glossary)

PHASE 2: STRUCTURAL SUBSTRATE — What is the structural shape?
  ├── Topology Preview (clickable → TopologyModal)
  └── Structural Spines (centrality rankings, structural roles)

PHASE 3: SIGNAL INTELLIGENCE — What do the signals say?
  ├── Signal Intelligence (ISIG → DPSIG → PSIG, family-grouped, 4-decimal)
  └── Signal Evidence blocks (per-domain propagation grid) ← MOVED from step 10

PHASE 4: DOMAIN COGNITION — What does the SW-Intel module compute? (module-gated)
  └── SW-Intel Operator View (qualification context, conditions, consequences)

PHASE 5: GOVERNANCE STATE — What governance state is this specimen in?
  ├── Governance Audit (S-level lifecycle, propositions, mean confidence, friction rate)
  └── Deep Forensics (expandable: enrichment, revalidation, certification, convergence, anchor)

PHASE 6: EVIDENCE LINEAGE — Can I trace the evidence chain?
  └── Evidence Trace (evidence_object_hash → derivation_hash → baseline_anchor → run_id)

PHASE 7: VERIFICATION — Can I verify the compilation chain? (conditional, INVESTIGATION future)
  └── Verification Protocol (on VERIFY invocation)
```

### §6.2 Outer Shell Zone Sequence (OPERATOR-specific)

| Tier | Zone | Role |
|------|------|------|
| tier0 | DeclarationZone | Specimen disclosure header |
| tier1 | GovernanceRibbon | Compressed SQO posture summary (absorbs SemanticTrustPosture, Reconciliation, Qualifier, SQOIntelligence) |
| tier2 | IntelligenceField | Center lane — Phases 1-7 |

### §6.3 Column Assignment

| Column | Content | Rationale |
|--------|---------|-----------|
| Left | OPERATOR specimen overview | Contextual orientation (specimen, S-level, posture) |
| Center | OperatorTraceField (Phases 1-7) | Primary cognitive workspace |
| Right | EVIDENCE STATE + EVIDENCE RECORD + guided queries | Export and contextual support |

### §6.4 Differences from Current 8-Step Flow

| Change | Current | Target | Rationale |
|--------|---------|--------|-----------|
| Signal Evidence position | After Evidence Trace (step 10) | Within Phase 3, after Signal Intelligence | Propagation evidence belongs with signal intelligence, not evidence lineage |
| SQO outer zones | 4 separate zones (tier1 + tier2) | Collapsed into GovernanceRibbon | Redundant with Governance Audit; low information density as standalone zones for OPERATOR |
| SW-Intel position | After Structural Spines (step 5) | Phase 4, after Signal Intelligence | Conditions are DERIVED from signals — seeing signals first provides the substrate that conditions interpret |
| GovernanceRibbon position | tier2 (after IntelligenceField) | tier1 (before IntelligenceField) | SQO posture context should be visible BEFORE entering the evidence workspace |

---

## §7 — Merge/Collapse/Move Decisions

### §7.1 STAY — No Change

| Section | Reason |
|---------|--------|
| RepModeTag | Correctly positioned, OPERATOR-native |
| OperatorReadingGuide | Correctly positioned, OPERATOR-native |
| Topology Preview | Correctly positioned in structural substrate phase |
| Structural Spines | Correctly positioned in structural substrate phase |
| Signal Intelligence | Correctly positioned in signal intelligence phase |
| Evidence Trace | Correctly positioned in evidence lineage phase |
| Verification Protocol | Correctly positioned as conditional invocation |
| DeclarationZone | Cross-persona, correctly in tier0 |
| ExecutiveInterpretation | Correctly adapted per persona |
| SupportRail | Cross-persona export + support |
| SW-Intel Operator View | Module-gated, architecturally correct |
| Governance Audit | Correctly positioned in governance state phase |

### §7.2 MOVE — Signal Evidence Blocks

| Section | From | To | Rationale |
|---------|------|----|-----------|
| Signal Evidence blocks | After Evidence Trace (center lane step 10, ~line 6113) | After Signal Intelligence (Phase 3, ~after line 6082) | Signal Evidence blocks render per-domain propagation evidence (role, tier, grounding). This is signal evidence — it belongs with the Signal Intelligence section, not orphaned after Evidence Trace. Moving it closes the gap between "what signals exist" and "what evidence backs them." |

### §7.3 COLLAPSE — SQO Outer Shell Zones into GovernanceRibbon

For OPERATOR persona only, collapse 4 SQO outer zones into a single GovernanceRibbon:

| Zone | Content | Collapse Target | Why Redundant |
|------|---------|-----------------|---------------|
| SemanticTrustPostureZone | SQO posture assessment | GovernanceRibbon | Posture already shown in Governance Audit (Phase 5) |
| ReconciliationAwarenessZone | Reconciliation state | GovernanceRibbon | Reconciliation detail in Governance Audit deep forensics |
| QualifierMandate | Qualification mandate + ALI | GovernanceRibbon | Qualifier state in Governance Audit |
| SQOIntelligenceZone | SQO summary intelligence | GovernanceRibbon | SQO summary redundant with Governance Audit lifecycle |

**GovernanceRibbon redesign for OPERATOR:** The ribbon splits into two distinct cognitive layers:

#### Layer 1 — Governance Posture Ribbon (always visible)

Specimen governance state. The first thing an operator reads after the declaration header.

| Field | Source | Collapsed From |
|-------|--------|---------------|
| S-level (S0/S1/S2/S3) | `fullReport.governance_lifecycle.current_s_level` | SemanticTrustPostureZone |
| Q-class (Q-01–Q-04) | `fullReport.qualifier_class` | QualifierMandate |
| Qualification posture | `resolveOperatorWorkflow().currentPosture` | SemanticTrustPostureZone |
| Reconciliation state | `fullReport.reconciliation_summary.status` | ReconciliationAwarenessZone |
| Qualification mandate label | `fullReport.qualifier_summary.qualifier_label` | QualifierMandate |
| Active blocker count | `resolveOperatorWorkflow().blockerSummary.total` | SQOIntelligenceZone |

#### Layer 2 — Governance Invariants (collapsed by default)

Implementation policy assertions. Useful for governance certification and architecture audit. NOT part of daily operator flow.

| Field | Source |
|-------|--------|
| topology_always_read_only | `flagshipOrchestration.js` governance object |
| qualifier_never_suppressed | " |
| blocked_state_never_softened | " |
| diagnostic_state_never_softened | " |
| evidence_references_always_preserved | " |
| no_ai_calls | " |
| no_prompt_surfaces | " |
| no_chatbot_ux | " |
| no_animated_propagation | " |
| no_topology_mutation | " |
| no_semantic_mutation | " |

**Rationale:** An operator landing in OPERATOR asks "What is the state of the specimen?" — not "What internal UI laws exist?" Mixing posture (S2, RECONCILED, Q-03, ALI PASS) with invariants (NO CHATBOT UX, NO ANIMATED PROPAGATION) pollutes the primary cognitive flow. Posture is Phase 1 orientation. Invariants are governance certification — available on demand, not in the way.

**Result:** GovernanceRibbon renders posture (6 fields, always visible) and invariants (11 fields, expandable, collapsed by default). The operator's first scan reads specimen state, not system policy.

**Scope:** OPERATOR persona only. Other personas retain their zone compositions unchanged.

### §7.4 RESEQUENCE — SW-Intel Position

| Section | From | To | Rationale |
|---------|------|----|-----------|
| SW-Intel Operator View | Phase 3 (after Structural Spines, before Signal Intelligence) | Phase 4 (after Signal Intelligence) | SW-Intel conditions are DERIVED from signals. The operator should see the raw signals first, then see what the module computed from them. Current position puts derived output before its inputs. |

---

## §8 — Section-to-Stratum Mapping

| Section | Cognition Stratum | Authority Level | Evidence Boundary |
|---------|-------------------|-----------------|-------------------|
| DeclarationZone | S6 — Operational Cognition | DETERMINISTIC | Specimen metadata from manifest |
| GovernanceRibbon | S4 — SQO Qualification | DETERMINISTIC | Qualification state from promotion_state.json |
| RepModeTag | S6 — Operational Cognition | DETERMINISTIC | Static framing |
| OperatorReadingGuide | S6 — Operational Cognition | DETERMINISTIC | Static glossary |
| Topology Preview | S5 — Runtime Corridor | INVESTIGATIVE | Topology from semantic_domain_registry + cluster_registry |
| Structural Spines | S5 — Runtime Corridor | INVESTIGATIVE | Centrality from structural_enrichment |
| Signal Intelligence | S5 — Runtime Corridor | DETERMINISTIC | Signal values from signal_cards |
| Signal Evidence | S5 — Runtime Corridor | DETERMINISTIC | Evidence blocks from signal_cards |
| SW-Intel View | S6 — Operational Cognition | DETERMINISTIC | Conditions from SignalSynthesisEngine compilation |
| Governance Audit | S4 — SQO Qualification | DETERMINISTIC | Governance lifecycle from promotion_state, review_state, enrichment, revalidation |
| Evidence Trace | S5 — Runtime Corridor | DETERMINISTIC | Hash chain from fullReport metadata |
| Verification Protocol | S4/S6 — Cross-stratum | INVESTIGATIVE | Compilation chain verification from proof corridor |
| SupportRail | S6 — Operational Cognition | DETERMINISTIC | Evidence state + export builder |

---

## §9 — Implementation Readiness Checklist

| # | Gate | Status | Reference |
|---|------|--------|-----------|
| 1 | Cognitive family classification LOCKED | **THIS STREAM** | §3 |
| 2 | Section ownership table LOCKED | **THIS STREAM** | §4 |
| 3 | Target cognitive sequence LOCKED | **THIS STREAM** | §6 |
| 4 | Merge/collapse/move decisions LOCKED | **THIS STREAM** | §7 |
| 5 | Label classification LOCKED | **THIS STREAM** | §5 |
| 6 | OPERATOR mission contract exists | COMPLETE | PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01 |
| 7 | Prior resequencing committed | COMPLETE | PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01 (aa93664) |
| 8 | Vocabulary coverage committed | COMPLETE | PI.OPERATOR.LABEL-EXPLAINABILITY-COVERAGE.01 (64ec729) |

### §9.1 Minimum Implementation Plan (for PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.02)

1. **Move Signal Evidence blocks** from after Evidence Trace into Phase 3 (after Signal Intelligence)
2. **Resequence SW-Intel** from Phase 3 (current position 5) to Phase 4 (after Signal Intelligence + Signal Evidence)
3. **Collapse 4 SQO zones** into GovernanceRibbon for OPERATOR persona (DisclosureSequencingContract change)
4. **Split GovernanceRibbon** into two layers: Governance Posture Ribbon (6 fields, always visible) and Governance Invariants (11 fields, collapsed by default)
5. **Promote GovernanceRibbon** from tier2 to tier1 for OPERATOR persona
6. **Verify** GovernanceRibbon renders posture fields prominently, invariants behind expand toggle
7. **Verify** no DENSE/BALANCED/BOARDROOM regression
8. **Verify** no SQO behavior changes

Estimated scope: 4-5 files modified. G2 stream (consumes this architecture without modification).
