# INVESTIGATION Cognitive Projection Forensics

Stream: PI.PERSONA.COGNITION-TOPOLOGY-FORENSICS.01 — Phase 4
Classification: FORENSIC / CONSTITUTIONAL / NON-IMPLEMENTATION
Date: 2026-05-24
Depends on: STRATUM_DECOMPOSITION.md (22 cognitive functions), DENSE_COGNITIVE_PROJECTION_FORENSICS.md (Phase 3)
Canonical specimen: blueedge/run_blueedge_productized_01_fixed

---

## INVESTIGATION Architecture Note

INVESTIGATION_DENSE IS the investigation persona. No separate INVESTIGATION surface exists. The `densityClass === 'INVESTIGATION_DENSE'` branch in `RepresentationField` routes to `InvestigationTraceField` — a structurally distinct component, not a parameter variation of `DenseTopologyField`.

Phase 3 traced all 22 cognitive functions through INVESTIGATION_DENSE as a column alongside EXECUTIVE_DENSE. Phase 4 does NOT repeat that per-function inventory. Instead, this document answers a different question:

**What is the cognitive architecture that makes INVESTIGATION a distinct persona — not a deeper DENSE, not a parameter-switched variant, but a fundamentally different cognitive instrument?**

---

## Method

Phase 3 documented WHAT each function does in INVESTIGATION_DENSE. Phase 4 documents WHY INVESTIGATION exists as a separate cognitive architecture. The forensic approach:

1. Identify INVESTIGATION-ONLY components (code that exists nowhere else)
2. Trace the INVESTIGATION cognitive sequence (how evidence flows through the surface)
3. Identify the cognitive orientation shift (how the same payload produces different cognition)
4. Map the INVESTIGATION-specific governance architecture
5. Identify the constitutional boundary that separates INVESTIGATION from all other personas

---

## INVESTIGATION-ONLY COMPONENTS

These components render EXCLUSIVELY in INVESTIGATION_DENSE. They do not appear in EXECUTIVE_DENSE, BALANCED, or BOARDROOM.

### 1. InvestigationReadingGuide + TermHint Dual-Level Decode System

**Source:** `InvestigationReadingGuide.jsx` (lines 1-100)

The reading guide is the ONLY persona that tells the operator HOW TO READ the surface before they read it. No other persona provides cognitive orientation instructions.

But the more significant component is `TermHint` — a dual-level hover decode system that maps 9 structural terms to TWO levels of understanding:

| Term | Executive Decode | Technical Decode |
|------|-----------------|------------------|
| ORIGIN | "structural source — pressure originates here" | "Primary attribution in propagation chain. Pressure generation point in directed dependency graph." |
| PASS-THROUGH | "conducts pressure from upstream — carries load without generating it" | "Secondary attribution. Conducts propagated structural load from ORIGIN without local generation." |
| RECEIVER | "absorbs pressure at end of chain — terminal structural load" | "Terminal absorption point. Receives propagated pressure without further downstream propagation." |
| HIGH | "Significant structural concentration — demands attention" | "Signal value substantially exceeds activation threshold relative to normalized cluster baseline." |
| ELEVATED | "Above-normal structural weight — worth understanding" | "Signal value exceeds activation threshold. Structural load disproportionate to normalized baseline." |
| MODERATE | "Within expected range on higher side — monitor, not act" | "Signal value approaches but does not exceed activation threshold." |
| LOW | "Normal structural weight — no pressure concerns" | "Signal value well within normalized baseline. No activation." |
| structurally backed | "Real file-level evidence confirms this domain — grounded" | "Reconciled against structural evidence artifacts. Grounding status Q-00 or Q-01." |
| semantic-only | "Exists in model but lacks structural confirmation — treat as advisory" | "No reconciled structural evidence. Grounding status Q-02+. Qualifier mandate applies." |

Plus `advisory bound`, `Confidence` terms with similar dual-level decoding.

**Cognitive purpose:** INVESTIGATION serves operators at MULTIPLE expertise levels simultaneously. The executive decode provides operational understanding; the technical decode provides forensic precision. This is NOT progressive disclosure (showing less, then more) — it is PARALLEL DECODE (two complete readings of the same term, available simultaneously on hover).

No other persona operates at two expertise levels simultaneously. BOARDROOM speaks only in executive terms. BALANCED speaks in structural terms with narrative framing. DENSE speaks in structural terms without narrative. INVESTIGATION provides BOTH executive and technical decodings — because the investigation operator might be a CTO asking "what does this mean?" or an auditor asking "what does this derive from?"

### 2. InvestigationTraceField — Fixed Evidence Sequence

**Source:** `IntelligenceField.jsx` (lines 3686-3832)

InvestigationTraceField renders a FIXED sequence of actors:

```
ET (Evidence Trace · lineage)     → evidence_object_hash, derivation_hash, baseline_anchor, run_id
    ↓
SS (Signal Stack · N active)      → per-signal: pressure_tier (TermHint), signal_label, domain, evidence_text, grounding + advisory-bound
    ↓
SA (Signal Audit · N signals)     → full signal table: ID, family, name, value (4 decimals), severity, interpretation
    ↓
IP (Inference Prohibition)        → 13 prohibitions statement, qualifier rules applied, ALI rules applied
    ↓
GA (Governance Audit · full)      → lifecycle, transitions, propositions, constitutional anchor, revalidation, enrichment, convergence, chronicle
    ↓
[Forensic Topology Preview]       → clickable topology graph → modal explorer
    ↓
TierHandoffStatement              → terminal governance declaration
```

This sequence is NOT navigable. It is NOT zone-orchestrated. There is no scroll-tracking, no active zone, no spatial priority. The sequence is FIXED because evidence has a natural order:

1. **Where did this evidence come from?** (ET — lineage)
2. **What signals does it contain?** (SS — signal stack)
3. **What is the full signal record?** (SA — audit table)
4. **What are we NOT allowed to infer?** (IP — prohibition)
5. **What governance produced this state?** (GA — full audit)
6. **What does the structure look like?** (topology — on demand)
7. **What are the boundaries of this surface?** (TierHandoffStatement — closure)

The EXECUTIVE_DENSE operator navigates 7 zones by scroll position, choosing which structural question to ask. The INVESTIGATION operator follows a PREDETERMINED evidence chain — the surface decides what to show in what order, because the purpose is VERIFICATION, not EXPLORATION.

This is the deepest orchestration difference: EXECUTIVE_DENSE gives the operator control of cognitive focus. INVESTIGATION controls cognitive sequence because the sequence IS the proof structure.

### 3. Inference Prohibition Zone (IP)

**Source:** `IntelligenceField.jsx` (lines 3789-3811)

The IP zone renders:

```
Executive action on partially-grounded signals requires advisory confirmation.
The system MUST NOT infer beyond evidence, MUST NOT recommend without grounding,
and MUST NOT overstate readiness when a qualifier applies.

Qualifier rules applied: [list]
ALI rules applied: [list]
```

This is the ONLY component in the ENTIRE system that explicitly enumerates what the system CANNOT do. Every other persona demonstrates authority by what it DOES render (BOARDROOM: governance legitimacy, BALANCED: disclosure wrapping, DENSE: per-query boundaries). INVESTIGATION demonstrates authority by enumerating what it WILL NOT render.

The qualifier rules and ALI rules are not decorative — they are the specific governance constraints that were active for this particular report generation. This creates AUDIT-GRADE provenance: an external reviewer can verify exactly which constraints were enforced.

### 4. TierHandoffStatement — Terminal Governance Closure

**Source:** `IntelligenceField.jsx` (lines 3103-3112)

```
This surface presents structurally derived evidence only.
All outputs are deterministic, traceable, and bound by the governance framework.
No inference, ranking, or AI-generated assessment has been applied.
```

Rendered at the BOTTOM of InvestigationTraceField (line 3829). Not at the top. Not in a sidebar. At the terminal position — after all evidence has been presented, after all governance has been audited, the surface declares: everything you just saw was deterministic.

No other persona has a terminal governance closure statement. BOARDROOM declares authority at the beginning (declaration zone + footer). BALANCED wraps everything in disclosure. DENSE annotates per-query. INVESTIGATION states at the END — after proof is complete — that the proof is governed.

### 5. InvestigationSignalAudit — Full Signal Forensic Table

**Source:** `IntelligenceField.jsx` (lines 3834-3891)

Where EXECUTIVE_DENSE groups signals by family with interpretive prose (`DenseSignalSection`), INVESTIGATION produces a FULL AUDIT TABLE: signal_id, family tag, signal_name, signal_value (4 decimals), severity, interpretation — organized by family (ISIG → DPSIG → PSIG).

Plus: ISIG-specific detail panel with per-signal header (name + value), concentration, confidence_note. Level 1 file structure signals get ADDITIONAL forensic decomposition because they are the signals closest to raw structural evidence.

The difference: EXECUTIVE_DENSE renders signals as INTERPRETIVE INSTRUMENTS (what does this signal mean?). INVESTIGATION renders signals as AUDIT RECORDS (this is exactly what was computed, to 4 decimal places).

### 6. InvestigationGovernanceAudit — Full Governance Traversal

**Source:** `IntelligenceField.jsx` (lines 3894-4160+)

The most detailed governance rendering in the entire system. Sections:

**Governance Lifecycle:** S-Level, provenance, authority ceiling, promotion eligible, hold reason, last updated. Plus full state transitions table: from → to → actor → action → timestamp.

**Proposition Corpus:** Disposition counts grid (accepted/rejected/arbitrated/contested), mean confidence (4 decimals), friction rate (2 decimal %), derivation path, review status, review completed by, obligations met/total. By-class and by-tier grids. Flagged items table with proposition_id/disposition/rationale per item.

**Constitutional Anchor:** Overall verdict, target level, advancement blocked, reference/candidate specimens. Full dimension assessment table: dimension name, reference value, candidate value, ratio (3 decimals), threshold, verdict — per dimension.

**Revalidation:** Status, total checks, passed, failed. Per-phase breakdown with check number, check name, result, detail — every individual revalidation check visible.

**Evidence Enrichment:** Enrichment events, domains corrected/confirmed/no-SDC-match, capabilities corrected, mean confidence post, domains with change. Debt reassessment: improved/unchanged/worsened/blockers resolved counts, trajectory, per-item table with blocker_id, domain, severity, blocks_s_state, original vs post-enrichment reducibility, impact.

**Convergence Observations:** Total observations, maturity, verdict, convergence/divergence/mixed counts. Per-observation detail: ID, pattern_status, title, observation body, divergence note.

**Chronicle Certification:** Status, phases, passed/failed counts, phase breakdown.

This is NOT a summary. It is the FULL GOVERNANCE RECORD — every transition, every proposition, every check, every dimension, every observation. No compression, no altitude shift, no "3 most relevant items." Everything.

BOARDROOM gives governance as legitimacy sentences. BALANCED gives governance as emergence narrative. EXECUTIVE_DENSE gives governance as operational counts and rates. INVESTIGATION gives governance as the COMPLETE AUDIT TRAIL.

### 7. ReconDomainDrilldownTable — Per-Domain Forensic Correspondence

**Source:** `ReconciliationAwarenessZone.jsx` (lines 165-236)

INVESTIGATION-only (`isInvestigation` gate at line 345). Renders EVERY domain in the reconciliation correspondence with:
- L-level confidence badge (L1/L2/L3/L4)
- domain_id, domain_name, structural_dom_id
- reconciliation_status (color-coded)
- Expandable drilldown per domain with:
  - Enrichment reason or unmapping justification
  - Prior state (if elevated from L1 via AI-assisted enrichment)
  - Enrichment status, lineage status, enrichment confidence, correspondence basis

This is the ONLY component that lets an operator inspect the reconciliation decision for EACH INDIVIDUAL DOMAIN. Every other persona shows reconciliation as aggregate posture or trend. INVESTIGATION shows the per-domain decision record.

### 8. ReconProvenance — Replay Governance Checks

**Source:** `ReconciliationAwarenessZone.jsx` (lines 238-272)

INVESTIGATION-only. Five governance verification checks:
- **deterministic** — ✓/✗
- **replay-safe** — ✓/✗
- **no inference** — ✓/✗
- **epochs** — count
- **generated** — timestamp

These are the computational governance properties of the reconciliation output ITSELF. The output tells you whether it was computed deterministically, whether replaying it would produce the same result, and whether any inference was applied in its generation.

No other persona surfaces these meta-governance properties. Other personas consume reconciliation output and render it. INVESTIGATION examines whether the reconciliation output was LEGITIMATELY PRODUCED.

### 9. SemanticTrustPostureZone — STRUCTURAL BACKING DETAIL

**Source:** `SemanticTrustPostureZone.jsx` (lines 143-177)

INVESTIGATION-only (`isInvestigation` gate). Renders a 4-cell structural grid:
- Reconciled / total domains (count)
- Ratio (percentage)
- Weighted confidence
- Unresolved count

Plus: UNRESOLVED DOMAIN DISCLOSURE — lists each unresolved domain by ID, name, and type. This is NAMED DISCLOSURE of exactly which domains lack structural backing. Not a count. Not a ratio. THE NAMES.

Every other persona says "X% reconciled" or "trust posture: MODERATE." INVESTIGATION names the domains that are unresolved. The operator can verify each one.

---

## COGNITIVE ORIENTATION ANALYSIS

### The Same Payload, Two Cognitive Architectures

INVESTIGATION_DENSE and EXECUTIVE_DENSE resolve the SAME `fullReport` payload. They share:
- The same `GenericSemanticPayloadResolver` output
- The same `signal_interpretations`, `evidence_blocks`, `governance_lifecycle`, `proposition_corpus`
- The same `reconciliation`, `semantic_domain_registry`, `topology_summary`

No data is added for INVESTIGATION. No data is removed. The SAME payload produces TWO fundamentally different cognitive instruments because the COMPONENTS that render it — and the SEQUENCE in which they render — embody different cognitive orientations.

**EXECUTIVE_DENSE orientation: STRUCTURAL INTERPRETATION**

"Given this evidence, what does the structure mean?"

The operator navigates freely across 7 zones, asking structural questions. Zone interpretations provide `{ heading, body, structuralNote }` — interpretive synthesis per zone. Guided queries let the operator interrogate cause, propagation, concentration, compression, governance. The trail records which questions were asked.

**INVESTIGATION orientation: EVIDENCE VERIFICATION**

"Given this evidence, is every claim provable?"

The operator follows a fixed sequence from lineage → signals → prohibition → governance. Every signal shows its numeric value to 4 decimals. Every governance transition shows actor and timestamp. Every domain shows its L-level and enrichment basis. The surface terminates with a governance closure statement.

### Five Cognitive Signature Differences

**1. Orchestration → None**

EXECUTIVE_DENSE has zone orchestration (scroll-driven focus, active zone tracking, support rail per zone). INVESTIGATION has NO orchestration — the sequence is fixed, the operator reads top-to-bottom. This is not a regression. An audit trail is not navigable because navigation implies the operator CHOOSES what to examine. In INVESTIGATION, the surface determines what must be examined, in what order.

**2. Interpretation → Prohibition**

EXECUTIVE_DENSE has 7 zone interpretation functions, each producing `{ heading, body, structuralNote }`. INVESTIGATION has ZERO interpretation functions. Instead, it has the Inference Prohibition zone — explicitly enumerating what the system WILL NOT interpret. The presence of interpretation functions in EXECUTIVE_DENSE and their replacement by a prohibition zone in INVESTIGATION is the clearest cognitive signature difference.

**3. Guided Queries: 42 → 4**

EXECUTIVE_DENSE: 42 interrogation paths across 7 zones with 8 tones, 5 archetypes, 3 depths. INVESTIGATION: 4 forensic expansions. The 4 INVESTIGATION queries are:

1. "Which evidence chains have structural gaps?" (forensic/deep)
2. "What is the complete evidence provenance for each propagation role?" (operational/standard)
3. "Where do qualification boundaries constrain evidence acceptance?" (containment/standard)
4. "What ungrounded claims exist across the domain registry?" (alarming/deep)

These are not structural interpretation queries. They are VERIFICATION QUERIES — each asks whether something is PROVABLE, not what it MEANS.

**4. Compound → Decomposed**

EXECUTIVE_DENSE renders compound_narrative and co_presence for signal co-activation. INVESTIGATION decomposes signals into individual rows with per-signal evidence_text and grounding_status. Compound synthesis disappears because INVESTIGATION does not synthesize — it records individual evidence items for individual verification.

**5. Summary → Enumeration**

EXECUTIVE_DENSE provides per-zone summaries (`heading + body + structuralNote`). INVESTIGATION provides FULL ENUMERATION — every proposition, every transition, every check, every dimension, every domain. The cognitive shift from "summary" to "enumeration" is what separates executive consumption from forensic audit.

---

## SEMANTIC ACTOR ARCHITECTURE

`LENS_MODE_SEMANTICS` (line 29) defines 5 semantic actors for INVESTIGATION_DENSE:

| Actor | Purpose |
|-------|---------|
| `evidenceTrace` | Trace provenance from evidence_object_hash through derivation to baseline |
| `signalStack` | Present each signal with full evidence text and grounding classification |
| `inferenceProhibition` | Enumerate what the system CANNOT do, with active qualifier/ALI rules |
| `confidenceBoundary` | Surface the Q-class grounding boundary per signal |
| `resolutionBoundary` | Identify where evidence resolution limits exist |

Compare EXECUTIVE_DENSE actors: `semanticTopology`, `structuralBacking`, `semanticOnlyExposure`, `clusterConcentration`, `absorptionLoad`, `pressureAnchor`.

The naming reveals the cognitive orientation:
- EXECUTIVE_DENSE actors are STRUCTURAL PROPERTIES: topology, backing, exposure, concentration, absorption, anchor
- INVESTIGATION actors are VERIFICATION OPERATIONS: trace, stack, prohibition, boundary, boundary

Structure vs verification. Properties vs operations. What exists vs what can be proven.

---

## THE INVESTIGATION COGNITIVE STACK

Combining the component analysis, cognitive orientation, and semantic actors, the INVESTIGATION cognitive stack is:

```
┌─────────────────────────────────────────────────────────────┐
│ COGNITIVE ORIENTATION LAYER                                  │
│ InvestigationReadingGuide — tells operator HOW to read       │
│ TermHint dual-decode — executive + technical simultaneously  │
├─────────────────────────────────────────────────────────────┤
│ EVIDENCE PROVENANCE LAYER                                    │
│ ET (Evidence Trace) — hash → derivation → baseline → run     │
│ RepModeTag zones: Z7/Z5/Z2/GA                               │
├─────────────────────────────────────────────────────────────┤
│ SIGNAL FORENSICS LAYER                                       │
│ SS (Signal Stack) — per-signal with TermHint, advisory-bound │
│ SA (Signal Audit) — full table, ISIG detail panel            │
├─────────────────────────────────────────────────────────────┤
│ GOVERNANCE PROHIBITION LAYER                                 │
│ IP (Inference Prohibition) — 13 prohibitions, qualifier/ALI  │
├─────────────────────────────────────────────────────────────┤
│ GOVERNANCE VERIFICATION LAYER                                │
│ GA (Governance Audit) — lifecycle, transitions, propositions │
│ Constitutional anchor, revalidation, enrichment, convergence │
│ ReconDomainDrilldownTable — per-domain L-level drilldown     │
│ ReconProvenance — deterministic/replay-safe/no-inference     │
├─────────────────────────────────────────────────────────────┤
│ STRUCTURAL VERIFICATION LAYER                                │
│ SemanticTrustPosture STRUCTURAL BACKING DETAIL — named       │
│   unresolved domain disclosure                               │
│ EvidenceDepthLayer at tier2 (expanded, not hidden)           │
├─────────────────────────────────────────────────────────────┤
│ TOPOLOGY LAYER (ON DEMAND)                                   │
│ Forensic topology preview → modal explorer                   │
├─────────────────────────────────────────────────────────────┤
│ TERMINAL GOVERNANCE CLOSURE                                  │
│ TierHandoffStatement — "deterministic, traceable, governed"  │
└─────────────────────────────────────────────────────────────┘
```

This stack descends from cognitive orientation → evidence → signals → prohibition → governance → structure → topology → closure. The stack IS the proof structure.

---

## INVESTIGATION AND THE 5-STRATUM MODEL

### Stratum Dominance

Phase 3 identified that each persona has a dominant stratum:
- BALANCED: Agentic Cognitive Orchestration (~29%)
- BOARDROOM: PI Core + Domain Module
- EXECUTIVE_DENSE: Agentic Cognitive Orchestration (42 paths)

INVESTIGATION's dominant stratum is **Governed Replay** (~70% of cognitive weight).

Evidence:
- ET (Evidence Trace) = governed replay lineage
- SA (Signal Audit) = governed replay artifacts (signals are replay outputs)
- IP (Inference Prohibition) = governed replay boundary enforcement
- GA (Governance Audit) = governed replay lifecycle
- ReconProvenance = governed replay governance checks (deterministic/replay-safe/no-inference)
- TierHandoffStatement = governed replay closure declaration

Governed Replay is a secondary stratum in BALANCED (~18%), absent in BOARDROOM, present in EXECUTIVE_DENSE. In INVESTIGATION, it becomes DOMINANT — the surface IS a governed replay verification instrument.

### Stratum Recession

**Agentic Cognitive Orchestration:** MAXIMUM in EXECUTIVE_DENSE, ABSENT in INVESTIGATION. No zone orchestration, no guided query field (42 → 4), no zone interpretations, no emergence functions. The agentic layer disappears entirely.

**SQO Operational Qualification:** Present but REFRAMED. In BALANCED/DENSE, SQO is about advancement — what blocks S2, what gates remain. In INVESTIGATION, SQO appears in the governance audit as a RECORD (S-level, hold_reason, promotion_eligible) — not as an advancement workflow but as a HISTORICAL FACT about the current state.

**Domain Module:** Present but NOT DOMINANT. Module terms appear in evidence blocks (domain_alias) and signal rows (domain), but module does not create the same "executive gravity" as in BOARDROOM. The module is the SUBJECT of verification, not the FRAME of cognition.

---

## FOUR AUTHORITY PROJECTION MODELS (CONFIRMED)

Phase 2 identified two authority models (declaration, per-act boundary). Phase 3 identified three (added prohibition). Phase 4 confirms FOUR distinct authority projection models across the persona architecture:

| Persona | Authority Model | Implementation | Cognitive Effect |
|---------|----------------|----------------|-----------------|
| BOARDROOM | **DECLARATION** | Single footer: "75.x bounded authority, L3, 13 prohibitions" | "We operate under these rules" |
| BALANCED | **DISCLOSURE WRAPPING** | Every interpretive output wrapped in governance disclosure | "This specific statement is governed" |
| EXECUTIVE_DENSE | **PER-ACT BOUNDARY** | Each of 42 query paths carries `boundary` field | "This specific answer derives from this specific source" |
| INVESTIGATION | **PROHIBITION ENUMERATION + TERMINAL CLOSURE** | IP zone enumerates prohibitions; TierHandoffStatement closes | "These are all the things we CANNOT do. Everything you saw was deterministic." |

The progression: BOARDROOM says "we're governed." BALANCED shows "each statement is governed." DENSE proves "each answer is governed by its specific source." INVESTIGATION says "here's everything we're forbidden from doing — and the proof is governed."

This is not a spectrum of MORE authority. It is four qualitatively different MODELS of projecting the same constitutional commitment.

---

## STALE LINEAGE LEAKS

### Leak 1: No Evidence Provenance Hash Verification

InvestigationTraceField renders `evidence_object_hash` and `derivation_hash` as text values (lines 3736-3741). But there is no verification that these hashes are VALID — no link to the actual evidence object, no computation confirming the hash matches. The lineage is DISPLAYED but not VERIFIED.

In an investigation persona oriented toward proof, this is a gap: the surface presents hashes as evidence provenance but relies on upstream integrity. The investigation operator sees a hash but cannot verify it without leaving the surface.

### Leak 2: Signal Audit Conditional Rendering

InvestigationSignalAudit renders only when `sigs.length > signalRowCount` (line 3836). If every signal already appears in the signal stack, the audit table is suppressed. But the audit table provides ADDITIONAL FIELDS not in the signal stack (signal_id, full interpretation, family tag per row). The conditional suppression loses forensic detail when signal counts match.

### Leak 3: TermHint Coverage Gaps

TERM_DECODE_MAP covers 9 terms (11 entries with variants). But the investigation surface uses additional structural vocabulary: "advisory bound" and "Confidence" are covered. "ISIG", "DPSIG", "PSIG" (signal family codes) appear without hover decode. "L1", "L2", "L3", "L4" (confidence levels in ReconDomainDrilldownTable) appear without hover decode. "Q-00", "Q-01", "Q-02" (grounding status codes) appear without hover decode.

The dual-decode system exists for the RIGHT terms — but does not cover all the structural vocabulary the investigation operator encounters.

### Leak 4: RepModeTag Zone ID Mismatch

InvestigationTraceField's RepModeTag declares zones: Z7 (Evidence Trace), Z5 (Signal Stack), Z2 (Resolution Boundary), GA (Governance Audit). But the actual actor codes are: ET, SS, SA, IP, GA. The RepModeTag zone IDs (Z7, Z5, Z2) do not match the actor codes (ET, SS, IP) — creating a labeling discontinuity between the zone declaration and the rendered actors.

---

## CROSS-PERSONA INVESTIGATION IDENTITY SUMMARY

| Dimension | BOARDROOM | BALANCED | EXECUTIVE_DENSE | INVESTIGATION |
|-----------|-----------|----------|-----------------|---------------|
| **Cognitive question** | What's the verdict? | What's happening? | What does it mean? | What can be proven? |
| **Orchestration** | Compiled | Emergence | Zone navigation | Fixed sequence |
| **Interpretation** | 5 compiled outputs | Emergence narrative | 7 zone interpretations | ZERO (prohibition instead) |
| **Guided queries** | 4 executive | 4 emergence | 42 interrogation | 4 forensic verification |
| **Authority model** | Declaration | Disclosure wrapping | Per-act boundary | Prohibition + closure |
| **Dominant stratum** | PI Core + Module | Agentic orchestration | Agentic orchestration | Governed Replay |
| **Numeric precision** | 0 decimals | 0-1 decimals | 3-4 decimals | 4 decimals |
| **Governance depth** | Legitimacy sentences | Emergence event | Operational counts | Full audit record |
| **Evidence orientation** | Consumed (invisible) | Framed (narrative) | Inspectable (per zone) | Verifiable (per item) |
| **Unique capability** | Executive gravity | Cognitive emergence | Interrogation field | Audit-grade provenance |
| **Terminal governance** | None | None | None | TierHandoffStatement |
| **Operator decode** | Single level | Single level | Single level | Dual level (exec+tech) |

---

## ARCHITECTURAL FINDINGS

### Finding 1: INVESTIGATION is the ONLY persona that CONSTRAINS operator agency

BALANCED: operator queries trigger emergence. BOARDROOM: operator receives verdict. DENSE: operator navigates 7 zones freely. INVESTIGATION: operator follows a fixed evidence chain — the surface dictates the sequence. This is deliberate. In an audit context, operator freedom to skip evidence steps would undermine the integrity of the verification. The surface constrains agency to enforce completeness.

### Finding 2: INVESTIGATION replaces interpretation with prohibition

Every other persona has interpretation functions — mechanisms that produce "what this means." INVESTIGATION replaces all interpretation with the Inference Prohibition zone. The surface does not tell the operator what the evidence means. It tells the operator what the system is FORBIDDEN from inferring. This inversion (from "here's what we think" to "here's what we won't think") is the deepest cognitive signature of the investigation persona.

### Finding 3: Governed Replay stratum dominance creates a unique persona identity

Governed Replay is secondary in BALANCED (~18%), absent in BOARDROOM, present but not dominant in EXECUTIVE_DENSE. In INVESTIGATION, it becomes the dominant stratum (~70% of cognitive weight). This creates a persona whose identity is DEFINED by the governance system itself — the investigation surface IS the governance system's self-representation.

### Finding 4: Dual-level decode is an unrealized architectural primitive

The TermHint dual-decode system is powerful — simultaneous executive and technical understanding of the same term. But it covers only 9 terms. If extended to the full structural vocabulary (signal families, Q-classes, L-levels, governance states, proposition dispositions), it would make INVESTIGATION the ONLY persona capable of serving two operator skill levels simultaneously. Currently underutilized.

### Finding 5: Four personas, four authority models

The authority projection model is now confirmed across all four personas: declaration (BOARDROOM), disclosure wrapping (BALANCED), per-act boundary (EXECUTIVE_DENSE), prohibition enumeration with terminal closure (INVESTIGATION). These are not variations in STRENGTH of authority. They are four qualitatively different MODELS of governance projection — each appropriate to the cognitive orientation of its persona.

### Finding 6: INVESTIGATION is the governance system examining itself

BOARDROOM presents governance as institutional credibility. BALANCED presents governance as operational context. EXECUTIVE_DENSE presents governance as per-query provenance. INVESTIGATION presents the ENTIRE governance record — every transition, every proposition, every check, every dimension. This is not governance FOR the operator. This is the governance system rendering its own complete audit trail. The operator is not the subject — they are the auditor. The governance system is both the subject and the instrument.

---

## PHASE 4 CONCLUSION

INVESTIGATION_DENSE is the fourth persona — not a deeper variant of EXECUTIVE_DENSE, not a parameter switch, but a fundamentally different cognitive architecture. It shares the same payload but produces a different instrument because it embodies a different cognitive orientation: EVIDENCE VERIFICATION rather than STRUCTURAL INTERPRETATION.

The defining characteristics:
- Fixed evidence sequence (not navigable zones)
- Interpretation replaced by prohibition
- Full governance enumeration (not summary or narrative)
- Dual-level decode (executive + technical simultaneously)
- Audit-grade provenance (hashes, timestamps, per-check detail)
- Terminal governance closure

The four personas are now fully forensically mapped:

| Persona | Cognitive Architecture | Primary Question |
|---------|----------------------|-----------------|
| BOARDROOM | Compiled projection | What's the verdict? |
| BALANCED | Emergence orchestration | What's happening? |
| EXECUTIVE_DENSE | Zone-navigated decomposition | What does the structure mean? |
| INVESTIGATION | Fixed-sequence evidence verification | What can be proven? |

**Next:** Phase 5 — PERSONA_COGNITION_TOPOLOGY_MAP.md. The cross-persona cognitive function projection mapping. All four personas have been individually forensically mapped. Phase 5 produces the unified topology: how the 22 cognitive functions, 5 strata, 4 authority models, 4 orchestration models, and domain module embodiment relate across the full persona architecture.
