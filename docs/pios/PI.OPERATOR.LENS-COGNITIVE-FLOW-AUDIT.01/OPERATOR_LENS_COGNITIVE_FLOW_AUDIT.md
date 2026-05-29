# OPERATOR LENS Cognitive Flow Audit

**Stream:** PI.OPERATOR.LENS-COGNITIVE-FLOW-AUDIT.01
**Classification:** G1 — Architecture-Mutating
**Specimen:** BlueEdge / run_blueedge_genesis_e2e_03
**Date:** 2026-05-29

---

## 1. Executive Summary

OPERATOR is a Frankenstein surface. It contains valuable material — in many cases, the deepest and most rigorous evidence presentation in the entire LENS v2 system. But the cognitive flow is broken.

The page currently presents **23 distinct content sections** spanning **6 different cognition families** (PI Core evidence, SW-INTEL domain cognition, SQO governance, Verification, Report Pack, and Chronicle lifecycle) with **no governed sequencing** between them. An operator arriving at this page encounters evidence trace hashes before understanding what specimen they're inspecting, governance lifecycle tables before signal interpretation, and chronicle certification data that belongs to a dedicated replay surface rather than an operational evidence workspace.

The most severe problems:

1. **Governance Audit (GA) has consumed the page.** The GA section alone renders 7 sub-sections totaling more screen surface than all other OPERATOR content combined. It includes proposition corpus analysis (85 rows), constitutional anchor assessment (8 dimensions), revalidation logs (25 checks across 8 phases), evidence enrichment, convergence observations (9 entries), and chronicle certification (62 checks across 10 phases). This is Chronicle/SQO lifecycle data, not OPERATOR evidence inspection.

2. **Labels are not explained.** Of 30+ major labels audited, only 5 have any cognition ontology explanation (the consequence/condition labels in the verification protocol, via CognitionOntology.js). The remaining 25+ labels — including the most prominent ones like "Executive Ready — Qualified", "Structural Backing Insufficient", "Cluster Pressure Index", "coupling_pressure" — are either raw machine identifiers or jargon without inline definition.

3. **Three-column layout creates cognitive whiplash.** The left panel shows "Forensic Interpretation" (narrative prose), the center shows raw evidence (hashes, signal tables, governance tables), and the right panel shows guided actions and report controls. An operator's eye path jumps between narrative, raw data, and action buttons without sequential guidance.

4. **SW-INTEL appears too late.** The SW-INTEL Operator View renders after OperatorTraceField — meaning the operator sees raw signal values, governance tables, and topology before seeing the synthesized consequence cognition that would give those signals meaning.

5. **Verification Protocol is disconnected.** The VERIFY button lives in the SW-INTEL header, but verification results render below the entire OperatorTraceField. The evidence trail (Step 1 → Step 5) is not connected to the cognition surfaces it verifies.

**Verdict:** OPERATOR has coherent components but incoherent flow. It needs resequencing, layer separation, and label explanation — not deletion or redesign.

---

## 2. Current OPERATOR Purpose

**Constitutional definition:** Engineering evidence inspection and governance audit.

**Persona mission contract (locked 2026-05-29):**
- Constitutional objective: Engineering evidence inspection
- Primary question: "What does the evidence show?"
- Operator agency: HIGH (operator-controlled exploration)
- Attention model: Operator-controlled
- Cognition consumed: Raw evidence at full precision, governance lifecycle, signal audit, topology inspection
- Cognition prohibited: Executive narrative synthesis, consequence posture grouping, interpretive prose

**What OPERATOR is supposed to do:**
1. Show a technical operator the raw structural evidence for a specimen
2. Let them inspect signal values at 4-decimal precision
3. Let them audit the governance lifecycle (S-level, propositions, revalidation, certification)
4. Let them explore the forensic topology
5. Let them verify SW-INTEL compilation claims
6. Let them export evidence records

**What OPERATOR actually does:**
All of the above — plus dumps SQO lifecycle history, Chronicle certification, convergence observations, evidence enrichment analytics, reconciliation correspondence tables, report pack controls, guided SQO actions, and structural depth escalation queries. It tries to be an evidence inspection workspace, a governance cockpit, a Chronicle viewer, and an operational action surface simultaneously.

---

## 3. Current OPERATOR Zone Inventory

The OPERATOR page comprises 8 governed disclosure zones plus page-level shell elements. Within these zones, 23 distinct content sections are visible.

### Shell-Level Elements (outside disclosure zones)

| ID | Content | Source |
|---|---|---|
| SHELL-01 | Status bar (LIVE SUBSTRATE, client, run, baseline, qualifier) | LensDisclosureShell |
| SHELL-02 | Persona selector (4 persona radios + BOARDROOM button) | IntelligenceField |
| SHELL-03 | SW-INTEL toggle button | IntelligenceField |
| SHELL-04 | Governance footer (GOVERNANCE ENVELOPE ACTIVE + prohibition text) | LensDisclosureShell |

### Disclosure Zones (DisclosureSequencingContract)

| Order | Zone | Tier | Default State |
|---|---|---|---|
| 1 | DeclarationZone | tier0 | Always visible |
| 2 | SemanticTrustPostureZone | tier1 | Expanded |
| 3 | ReconciliationAwarenessZone | tier1 | Expanded |
| 4 | QualifierMandate | tier1 | Expanded (conditional on Q-02/Q-03) |
| 5 | IntelligenceField | tier2 | Expanded (OPERATOR exception) |
| 6 | SQOIntelligenceZone | tier2 | Expanded (OPERATOR exception) |
| 7 | EvidenceDepthLayer | tier2 | Expanded (OPERATOR exception) |
| 8 | GovernanceRibbon | tier2 | Expanded (OPERATOR exception) |

**OPERATOR exception:** All other personas collapse tier2 by default. OPERATOR expands everything. This means the operator sees ALL content on page load — approximately 4,000+ pixels of vertical content before SW-INTEL or Verification are activated.

### Content Sections Within Zones

| Section ID | Label | Parent Zone | Vertical Position |
|---|---|---|---|
| OP-01 | OPERATIONAL POSTURE | SemanticTrustPostureZone | ~top |
| OP-02 | 11 Governance Checks | GovernanceRibbon | ~top strip |
| OP-03 | RECONCILIATION POSTURE | ReconciliationAwarenessZone | ~top |
| OP-04 | PER-DOMAIN CORRESPONDENCE (17 domains) | ReconciliationAwarenessZone | below OP-03 |
| OP-05 | QUALIFIER Q-03 alert banner | QualifierMandate | below posture strip |
| OP-06 | FORENSIC INTERPRETATION (left panel) | IntelligenceField/Left | alongside center |
| OP-07 | HOW TO READ THIS VIEW (reading guide) | IntelligenceField/Center | top of center |
| OP-08 | ET — Evidence Trace (hashes) | IntelligenceField/Center | after reading guide |
| OP-09 | SS — Signal Stack (2 active signals) | IntelligenceField/Center | after ET |
| OP-10 | SA — Signal Audit (8 signals, 3 families) | IntelligenceField/Center | after SS |
| OP-11 | IP — Inference Prohibition | IntelligenceField/Center | after SA |
| OP-12 | GA — Governance Audit (7 sub-sections) | IntelligenceField/Center | after IP |
| OP-12a | GA: Governance Lifecycle | IntelligenceField/Center | within GA |
| OP-12b | GA: Proposition Corpus (85 items) | IntelligenceField/Center | within GA |
| OP-12c | GA: Constitutional Anchor (8 dims) | IntelligenceField/Center | within GA |
| OP-12d | GA: Revalidation (25/25, 8 phases) | IntelligenceField/Center | within GA |
| OP-12e | GA: Evidence Enrichment | IntelligenceField/Center | within GA |
| OP-12f | GA: Convergence Observations (9) | IntelligenceField/Center | within GA |
| OP-12g | GA: Chronicle Certification (62/62) | IntelligenceField/Center | within GA |
| OP-13 | Topology Preview (clickable) | IntelligenceField/Center | after GA |
| OP-14 | Structural Centrality — Top 10 Spines | IntelligenceField/Center | after topology |
| OP-15 | Tier Handoff Statement | IntelligenceField/Center | bottom of center |
| OP-16 | EVIDENCE STATE (right rail) | IntelligenceField/Right | right panel top |
| OP-17 | QUALIFIER (right rail) | IntelligenceField/Right | right panel |
| OP-18 | ACTIVE CONDITIONS (right rail, SW-INTEL ON) | IntelligenceField/Right | right panel |
| OP-19 | DOMAIN COGNITION queries (right rail) | IntelligenceField/Right | right panel |
| OP-20 | STRUCTURAL DEPTH button (right rail) | IntelligenceField/Right | right panel |
| OP-21 | EVIDENCE RECORD button (right rail) | IntelligenceField/Right | right panel |
| OP-22 | REPORT PACK (right rail) | IntelligenceField/Right | right panel bottom |
| OP-23 | SW-INTEL Operator View (5 surfaces) | IntelligenceField/Center | after OperatorTraceField |
| OP-24 | Verification Protocol (5 steps + replay) | IntelligenceField/Center | after SW-INTEL |
| OP-25 | SIGNAL EVIDENCE (2 groups, 6 cards) | EvidenceDepthLayer | below IntelligenceField |
| OP-26 | Guided Actions (2-4 action buttons) | SQOIntelligenceZone | below EvidenceDepthLayer |

---

## 4. Zone-by-Zone Cognitive Classification

### OP-01: OPERATIONAL POSTURE

| Dimension | Value |
|---|---|
| Current label | OPERATIONAL POSTURE |
| Visible content | "EXECUTIVE READY — QUALIFIED", domain count, cluster count, coverage label |
| Cognition family | SQO |
| Runtime source | QualificationPostureResolver → fullReport.substrateBinding |
| Operator value | Immediate orientation — qualification state |
| Cognitive role | Orientation |
| Explainability status | LABEL ONLY — "Executive Ready" not explained. What does "ready" mean? Ready for what? |
| Flow status | KEEP — essential orientation, but needs inline explanation of what the posture means operationally |

### OP-02: 11 Governance Checks

| Dimension | Value |
|---|---|
| Current label | (no label — rendered as a check grid) |
| Visible content | 11 checkmarks: topology read only, qualifier never suppressed, blocked state never softened, etc. |
| Cognition family | Governance |
| Runtime source | Hardcoded governance invariants |
| Operator value | LOW for inspection — these are constitutional invariants, not runtime evidence. They never change |
| Cognitive role | Governance audit |
| Explainability status | PARTIALLY EXPLAINED — each check is descriptive text, but why these 11 checks? What are they proving? |
| Flow status | DEMOTE — valuable for an auditor, but these are invariants. Move to expandable governance disclosure or footer |

### OP-03: RECONCILIATION POSTURE

| Dimension | Value |
|---|---|
| Current label | RECONCILIATION POSTURE |
| Visible content | "STRUCTURAL BACKING INSUFFICIENT", weighted confidence (20%), reconciliation ratio (0%), domain coverage (0%), L5 grounded (0/17), unmapped (17) |
| Cognition family | SQO |
| Runtime source | ReconciliationAwarenessZone → reconciliation data |
| Operator value | MEDIUM — shows grounding gap, but most operators won't know what "L5 Grounded" or "Reconciliation Ratio" means |
| Cognitive role | Evidence inspection |
| Explainability status | LABEL ONLY — "Weighted Confidence 20%" with no explanation of how it's computed or what the denominator is |
| Flow status | KEEP BUT EXPLAIN — valuable evidence, jargon-heavy |

### OP-04: PER-DOMAIN CORRESPONDENCE (17 domains)

| Dimension | Value |
|---|---|
| Current label | PER-DOMAIN CORRESPONDENCE |
| Visible content | 17 domain buttons, all UNRECONCILED at L1, showing domain names and DOM-XX mappings |
| Cognition family | SQO |
| Runtime source | ReconciliationAwarenessZone → reconciliation correspondence |
| Operator value | HIGH for domain-level evidence inspection |
| Cognitive role | Evidence inspection |
| Explainability status | PARTIALLY EXPLAINED — domain names are readable, but L1 authority level and UNRECONCILED status not explained |
| Flow status | KEEP — essential OPERATOR content. But position is wrong — appears before signal/condition context |

### OP-05: QUALIFIER Q-03

| Dimension | Value |
|---|---|
| Current label | QUALIFIER Q-03 — Semantic Continuity Only |
| Visible content | Alert banner: "Structural backing is absent. Only semantic continuity supports the projection. Executive caution mandatory." |
| Cognition family | Governance |
| Runtime source | QClassResolver → qualifier_notice |
| Operator value | HIGH — critical governance boundary |
| Cognitive role | Orientation |
| Explainability status | EXPLAINED — Q-03 meaning is stated in the banner text |
| Flow status | KEEP |

### OP-06: FORENSIC INTERPRETATION (Left Panel)

| Dimension | Value |
|---|---|
| Current label | FORENSIC INTERPRETATION |
| Visible content | Three prose sections: "Evidence reading", "What the evidence shows", "Structural lineage" |
| Cognition family | PI Core (interpretive projection, 75.x) |
| Runtime source | ExecutiveInterpretation → narrative derived from fullReport |
| Operator value | LOW — this is executive-altitude prose. OPERATOR should see evidence, not interpretation |
| Cognitive role | Orientation (misplaced — this is BALANCED/DENSE language) |
| Explainability status | N/A — prose, not labels |
| Flow status | KEEP BUT MOVE — transforms to zone-specific context when SW-INTEL condition is focused. The default "Forensic Interpretation" narrative belongs to DENSE, not OPERATOR |

### OP-07: HOW TO READ THIS VIEW

| Dimension | Value |
|---|---|
| Current label | HOW TO READ THIS VIEW |
| Visible content | 4 paragraphs explaining propagation roles, pressure tiers, compound zones, term hints |
| Cognition family | PI Core |
| Runtime source | OperatorReadingGuide (static component) |
| Operator value | HIGH on first visit, LOW on repeat — orientation for unfamiliar operators |
| Cognitive role | Orientation |
| Explainability status | EXPLAINED — this IS the explanation |
| Flow status | KEEP — but consider making it collapsible after first visit |

### OP-08: Evidence Trace (ET)

| Dimension | Value |
|---|---|
| Current label | ET — Evidence Trace · lineage |
| Visible content | Evidence object hash, derivation hash, baseline anchor, run ID |
| Cognition family | PI Core (evidence lineage) |
| Runtime source | OperatorTraceField → traceLinkage from fullReport |
| Operator value | MEDIUM — audit lineage, but 64-char hashes are not inspectable by humans |
| Cognitive role | Evidence inspection |
| Explainability status | LABEL ONLY — "Evidence object hash" is a label, but what does it prove? Why would an operator care about this hash? |
| Flow status | KEEP BUT EXPLAIN — needs a one-line sentence explaining what evidence lineage proves (reproducibility, tamper detection) |

### OP-09: Signal Stack (SS)

| Dimension | Value |
|---|---|
| Current label | SS — Signal Stack · 2 active |
| Visible content | Per signal: pressure tier, signal name, domain, pressure reading, evidence text, confidence + grounding |
| Cognition family | PI Core (signals) |
| Runtime source | OperatorTraceField → signalRows from evidence_blocks → signal_cards |
| Operator value | HIGH — core signal evidence at operator depth |
| Cognitive role | Signal inspection |
| Explainability status | PARTIALLY EXPLAINED — pressure tier has TermHint, "advisory bound" has TermHint, but "Cluster pressure" and "Receiver pressure" names are not explained (what IS cluster pressure? what computes it?) |
| Flow status | KEEP |

### OP-10: Signal Audit (SA)

| Dimension | Value |
|---|---|
| Current label | SA — Signal Audit · 8 signals across 3 families |
| Visible content | Family chips (ISIG/DPSIG/PSIG), 8-row table (ID, Family, Signal, Value, Severity, Interpretation), ISIG detail expansion |
| Cognition family | PI Core (signals) |
| Runtime source | InvestigationSignalAudit → all signal families |
| Operator value | HIGH — full signal inventory at 4-decimal precision |
| Cognitive role | Signal inspection |
| Explainability status | PARTIALLY EXPLAINED — ISIG detail has narrative text, but PSIG signals show only "architectural pressure at Level 2" with no explanation of what coupling_pressure measures or what 5.6630 means |
| Flow status | KEEP |

### OP-11: Inference Prohibition (IP)

| Dimension | Value |
|---|---|
| Current label | IP — Inference Prohibition |
| Visible content | Prohibition statement, qualifier rules applied, ALI rules applied |
| Cognition family | Governance |
| Runtime source | OperatorTraceField → inferenceProhibition from governance |
| Operator value | LOW — governance invariant statement. Same every time. Displays "Q-02" even when qualifier is Q-03 |
| Cognitive role | Governance audit |
| Explainability status | EXPLAINED — prose explains the prohibition |
| Flow status | DEMOTE — move to governance footer or make collapsible. This is an ambient governance guarantee, not evidence to inspect |

### OP-12: Governance Audit (GA) — 7 Sub-sections

| Dimension | Value |
|---|---|
| Current label | GA — Governance Audit · full traversal |
| Visible content | Governance lifecycle table, proposition corpus (85 items with class/tier breakdowns, 14 flagged items), constitutional anchor (8 dimensions), revalidation (25 checks, 8 phases), evidence enrichment, convergence observations (9 entries), chronicle certification (62 checks, 10 phases) |
| Cognition family | **MIXED** — SQO (lifecycle, propositions, revalidation), Chronicle (certification, convergence, enrichment), PI Core (constitutional anchor) |
| Runtime source | InvestigationGovernanceAudit → governanceLifecycle from fullReport |
| Operator value | MIXED — lifecycle and proposition overview is HIGH value. But 62 certification checks, 9 convergence observations, and enrichment analytics are Chronicle replay data, not OPERATOR evidence |
| Cognitive role | Governance audit |
| Explainability status | DUMPED DATA — tables render with column headers but no explanation of what each sub-section means, why it matters, or what the operator should look for. "Friction rate 4.71%" — what does that mean? "Constitutional distance acceptable" — what is constitutional distance? |
| Flow status | **SPLIT** — Keep OP-12a (lifecycle) and OP-12b summary (proposition stats). Move OP-12c/12d/12e/12f/12g to either a collapsed "Deep Governance Forensics" section or to future INVESTIGATION persona |

### OP-13: Topology Preview

| Dimension | Value |
|---|---|
| Current label | (no label — clickable thumbnail with "Open forensic topology" hint) |
| Visible content | Thumbnail SVG of domain topology with pressure zones and confidence values |
| Cognition family | PI Core (topology) |
| Runtime source | TopologyGraph component → fullReport.semantic_domain_registry + topology data |
| Operator value | HIGH — structural substrate visualization |
| Cognitive role | Topology inspection |
| Explainability status | LABEL ONLY — "Open forensic topology" doesn't explain what the topology shows or how to read it |
| Flow status | KEEP — but position is wrong. Topology should come before signals/conditions (structural substrate precedes signal computation) |

### OP-14: Structural Centrality — Top 10 Spines

| Dimension | Value |
|---|---|
| Current label | (no explicit label — rendered as ranked file list) |
| Visible content | 10 ranked files with classification (VALIDATION_SUPPORT), import counts (↓/↑) |
| Cognition family | PI Core (40.3c structural centrality) |
| Runtime source | OperatorTraceField → centrality data from fullReport |
| Operator value | HIGH — file-level structural spine identification |
| Cognitive role | Evidence inspection |
| Explainability status | PARTIALLY EXPLAINED — file paths are readable, but "VALIDATION_SUPPORT" classification and "IMP" label are not explained. What does it mean that ALL 10 are classified as VALIDATION_SUPPORT? |
| Flow status | KEEP |

### OP-15: Tier Handoff Statement

| Dimension | Value |
|---|---|
| Current label | (no label — static text block) |
| Visible content | "This surface presents structurally derived evidence only. All outputs are deterministic, traceable..." |
| Cognition family | Governance |
| Runtime source | TierHandoffStatement (static component) |
| Operator value | LOW — governance footer text, not evidence |
| Cognitive role | Governance audit |
| Explainability status | EXPLAINED |
| Flow status | MERGE — redundant with OP-SHELL-04 governance footer |

### OP-16 through OP-22: Right Rail

| Section | Label | Family | Value | Explainability | Flow |
|---|---|---|---|---|---|
| OP-16 | EVIDENCE STATE | PI Core | MEDIUM | LABEL ONLY — "—" readiness label is empty | KEEP |
| OP-17 | QUALIFIER | Governance | LOW | PARTIALLY EXPLAINED | MERGE with OP-05 |
| OP-18 | ACTIVE CONDITIONS | SW-INTEL | HIGH | EXPLAINED (condition titles) | KEEP |
| OP-19 | DOMAIN COGNITION queries | SW-INTEL | HIGH | EXPLAINED (question text) | KEEP |
| OP-20 | STRUCTURAL DEPTH | PI Runtime | MEDIUM | LABEL ONLY — "Structural depth available" without explaining what structural depth IS | KEEP BUT EXPLAIN |
| OP-21 | EVIDENCE RECORD | Report Pack | HIGH | EXPLAINED | KEEP |
| OP-22 | REPORT PACK | Report Pack | LOW for OPERATOR | PARTIALLY EXPLAINED — shows tier labels without explaining what each deliverable contains | MOVE TO REPORT PACK |

### OP-23: SW-INTEL Operator View

| Dimension | Value |
|---|---|
| Current label | SW-INTEL |
| Visible content | Peak severity, 5 cognition surface cards (Delivery Fragility, Integration Exposure, Operational Topology Posture, Qualification Exposure, Propagation Risk), expandable structural detail, evidence footer, VERIFY button |
| Cognition family | SW-INTEL (domain cognition) |
| Runtime source | SoftwareIntelligenceOperatorView → SoftwareIntelligenceField → synthesize() projection |
| Operator value | HIGH — synthesized operational cognition from raw signals |
| Cognitive role | Software-intelligence inspection |
| Explainability status | PARTIALLY EXPLAINED — each surface has operational_summary and consequence text, but: (1) "Delivery Fragility" name comes from CONSEQUENCE_VOCABULARY operator_consequence_title, not CognitionOntology; (2) surface_id names (DELIVERY_FRAGILITY, INTEGRATION_EXPOSURE) are internal; (3) no upstream/downstream cognition references; (4) QualificationContextStrip shows "RICHNESS FULL / GOVERNANCE FULL / RECONCILIATION UNRECONCILED" without explaining these terms |
| Flow status | KEEP BUT MOVE — should appear BEFORE raw signal tables, not after |

### OP-24: Verification Protocol

| Dimension | Value |
|---|---|
| Current label | VERIFICATION PROTOCOL |
| Visible content | Verdict (VERIFIED/etc.), N/M steps passed, 5 expandable verification steps with proof data, replay section, cognition ontology explanations (CognitionOntology.js integration) |
| Cognition family | SW-INTEL / Verification |
| Runtime source | VerificationProtocolSection → InvestigationVerifier result |
| Operator value | HIGH — the ONLY section with full cognition ontology explanation (human_name, what_it_means, operational_implication, upstream/downstream refs) |
| Cognitive role | Verification entry/result |
| Explainability status | EXPLAINED — CognitionOntology.js integration provides human_name + graph refs for all 20 nodes |
| Flow status | KEEP — position is correct (invoked from SW-INTEL, renders after it) |

### OP-25: SIGNAL EVIDENCE

| Dimension | Value |
|---|---|
| Current label | SIGNAL EVIDENCE |
| Visible content | 2 evidence group cards (backend ORIGIN/HIGH, .env.example RECEIVER/MODERATE), 6 signal interpretation cards (DPSIG, PSIG values with narrative), compound zone statement |
| Cognition family | PI Core (evidence layer) |
| Runtime source | EvidenceDepthLayer → evidence_blocks from fullReport |
| Operator value | HIGH — raw evidence at operator depth |
| Cognitive role | Evidence inspection |
| Explainability status | PARTIALLY EXPLAINED — DPSIG cards have interpretive narrative, PSIG cards show only "architectural pressure at Level 2" |
| Flow status | KEEP — but overlaps significantly with OP-09 (Signal Stack) and OP-10 (Signal Audit). Three separate signal presentations is excessive |

### OP-26: Guided Actions

| Dimension | Value |
|---|---|
| Current label | Guided Actions |
| Visible content | S-level indicator, 2-4 action buttons (review obligations, request advancement, reconcile domains, etc.) |
| Cognition family | SQO (operator authority workflow) |
| Runtime source | SQOIntelligenceZone → LensSQOOrchestrationAdapter guided actions |
| Operator value | HIGH — operational action surface |
| Cognitive role | Runtime action |
| Explainability status | PARTIALLY EXPLAINED — action labels are descriptive, but "Execute available" dropdown destination is unclear (links to SQO cockpit V2) |
| Flow status | KEEP — but position at bottom of page means operator must scroll past everything to reach actions |

---

## 5. Label Explainability Audit

For each major label family, assessing whether the operator can answer: What does it mean? What source caused it? What mechanic attached it? What evidence supports it? What trace connects it upstream/downstream? What operational implication does it have?

### Orientation Labels

| Label | SOURCE | MECHANIC | MEANING | TRACE | IMPLICATION | Verdict |
|---|---|---|---|---|---|---|
| Executive Ready — Qualified | QualificationPostureResolver | - | - | - | - | **LABEL ONLY** — "Executive Ready" is an SQO posture label without definition. What makes something "ready"? What does "qualified" mean at S2? |
| LIVE SUBSTRATE | StatusBar | - | - | - | - | **LABEL ONLY** — what does "live" mean? What would non-live be? |
| Analyst · evidence trace and confidence | RepModeTag | - | partial | - | - | **PARTIALLY EXPLAINED** — "analyst" is a role descriptor, but "evidence trace and confidence" is system vocabulary |

### Qualifier Labels

| Label | SOURCE | MECHANIC | MEANING | TRACE | IMPLICATION | Verdict |
|---|---|---|---|---|---|---|
| Qualifier Q-03 | QClassResolver | yes | yes | - | yes | **EXPLAINED** — Q-03 banner provides full explanation text |
| Semantic Continuity Only | QClassResolver | - | partial | - | - | **PARTIALLY EXPLAINED** — "semantic continuity" is PI jargon not defined inline |
| advisory bound | TermHint | - | yes | - | - | **EXPLAINED** — TermHint hover provides definition |

### Signal Labels

| Label | SOURCE | MECHANIC | MEANING | TRACE | IMPLICATION | Verdict |
|---|---|---|---|---|---|---|
| Cluster Pressure Index (3.4532) | DPSIG | partial | partial | - | - | **PARTIALLY EXPLAINED** — DPSIG card has interpretation text ("carries 3.4532x avg structural load") but doesn't explain what CPI measures or why 3.4532 matters |
| Cluster Fan Asymmetry (0.5731) | DPSIG | partial | partial | - | - | **PARTIALLY EXPLAINED** — interpretation text exists but mechanic not explained |
| coupling_pressure (5.6630) | PSIG | - | - | - | - | **LABEL ONLY** — snake_case machine identifier with no human name, no explanation, no interpretation beyond "architectural pressure at Level 2" |
| domain_coupling_pressure (3.2098) | PSIG | - | - | - | - | **LABEL ONLY** |
| zone_coverage_concentration (2.1822) | PSIG | - | - | - | - | **LABEL ONLY** |
| unanchored_nodes (0.0000) | PSIG | - | - | - | - | **LABEL ONLY** |
| Import Hub Pressure (35.2875) | ISIG | yes | yes | partial | partial | **EXPLAINED** — ISIG detail provides entity, derivation source, concentration text |
| Import Fan Asymmetry (22.2534) | ISIG | yes | yes | partial | partial | **EXPLAINED** |
| HIGH / ELEVATED / MODERATE / LOW | Signal severity | - | partial | - | - | **PARTIALLY EXPLAINED** — reading guide defines tiers but doesn't explain thresholds |

### SW-INTEL Labels

| Label | SOURCE | MECHANIC | MEANING | TRACE | IMPLICATION | Verdict |
|---|---|---|---|---|---|---|
| Delivery Fragility | CONSEQUENCE_VOCABULARY | - | yes | - | yes | **PARTIALLY EXPLAINED** — operational_summary and consequence text provide meaning, but no SOURCE/MECHANIC (which conditions produced this? what signals? what evidence?) |
| Integration Exposure | CONSEQUENCE_VOCABULARY | - | yes | - | yes | **PARTIALLY EXPLAINED** |
| Operational Topology Posture | CONSEQUENCE_VOCABULARY | - | yes | - | yes | **PARTIALLY EXPLAINED** |
| Qualification Exposure | CONSEQUENCE_VOCABULARY | - | yes | - | yes | **PARTIALLY EXPLAINED** |
| Propagation Risk | CONSEQUENCE_VOCABULARY | - | yes | - | partial | **PARTIALLY EXPLAINED** |
| RICHNESS FULL | QualificationContextStrip | - | - | - | - | **LABEL ONLY** — what does "richness" measure? What is FULL vs not-full? |
| GOVERNANCE FULL | QualificationContextStrip | - | - | - | - | **LABEL ONLY** |
| RECONCILIATION UNRECONCILED | QualificationContextStrip | - | - | - | - | **LABEL ONLY** |
| SW-INTEL | Module label | - | - | - | - | **LABEL ONLY** — abbreviation without expansion or definition |
| VERIFY / VERIFIED | Verification trigger/result | partial | - | partial | - | **PARTIALLY EXPLAINED** — "verified" means all 5 steps passed, but what exactly is being verified? |

### Governance Labels

| Label | SOURCE | MECHANIC | MEANING | TRACE | IMPLICATION | Verdict |
|---|---|---|---|---|---|---|
| S2 | SQO state | - | - | - | - | **LABEL ONLY** — S2 is a state code. What does S2 mean? What can an operator do at S2? What's needed for S3? |
| GOVERNED LIFECYCLE | Provenance label | - | - | - | - | **LABEL ONLY** |
| L3 authority ceiling | Authority label | - | - | - | - | **LABEL ONLY** — what is L3? What would L4 or L5 mean? |
| Constitutional Anchor | Section header | - | - | - | - | **LABEL ONLY** — what is being anchored? Why "constitutional"? |
| Friction rate (4.71%) | Proposition metric | - | - | - | - | **LABEL ONLY** — what is governance friction? Is 4.71% good or bad? |
| REPLAY-CERTIFIED | Certification status | - | partial | - | - | **LABEL ONLY** — what was replayed? What does certification prove? |
| Convergence Observations | Section header | - | - | - | - | **LABEL ONLY** — convergence of what? With what? Why does this matter to an operator? |

### Verification Labels (CognitionOntology.js — the ONLY fully explained labels)

| Label | SOURCE | MECHANIC | MEANING | TRACE | IMPLICATION | Verdict |
|---|---|---|---|---|---|---|
| COORD_FRAG → "Coordination is structurally brittle" | CognitionOntology | yes | yes | yes | yes | **EXPLAINED** — human_name + what_it_means + operational_implication + upstream/downstream refs |
| DEP_AMP → "Dependencies amplify through bottleneck" | CognitionOntology | yes | yes | yes | yes | **EXPLAINED** |
| §4 → "Condition-to-Consequence Derivation Rules" | CognitionOntology | yes | yes | yes | yes | **EXPLAINED** |
| All 20 cognition nodes | CognitionOntology | yes | yes | yes | yes | **EXPLAINED** |

### Summary

| Status | Count | Percentage |
|---|---|---|
| EXPLAINED | 7 | 20% |
| PARTIALLY EXPLAINED | 12 | 34% |
| LABEL ONLY | 15 | 43% |
| DUMPED DATA | 1 | 3% |
| **Total** | **35** | |

---

## 6. SPINE / DNA / Chronicle / PI / SW-INTEL / SQO Mapping

### Layer Assignments

| Section | Primary Layer | Secondary Layer | Mixed? |
|---|---|---|---|
| OP-01 Operational Posture | SQO | — | No |
| OP-02 Governance Checks | Governance | — | No |
| OP-03 Reconciliation Posture | SQO | — | No |
| OP-04 Per-Domain Correspondence | SQO | PI Core (domain registry) | **YES** — SQO reconciliation status shown alongside PI Core domain structure |
| OP-05 Qualifier Q-03 | Governance | — | No |
| OP-06 Forensic Interpretation | PI Core (interpretive) | — | No |
| OP-07 Reading Guide | PI Core | — | No |
| OP-08 Evidence Trace | PI Core (evidence lineage) | — | No |
| OP-09 Signal Stack | PI Core (signals) | — | No |
| OP-10 Signal Audit | PI Core (signals) | — | No |
| OP-11 Inference Prohibition | Governance | — | No |
| OP-12a Governance Lifecycle | SQO | — | No |
| OP-12b Proposition Corpus | SQO | Chronicle (review lifecycle) | **YES** — SQO proposition review state mixed with Chronicle lifecycle narrative |
| OP-12c Constitutional Anchor | Chronicle | — | No — purely a cross-specimen replay concept |
| OP-12d Revalidation | Chronicle | SQO (debt reassessment) | **YES** — revalidation is a Chronicle operation, debt is SQO |
| OP-12e Evidence Enrichment | Chronicle | — | No |
| OP-12f Convergence Observations | Chronicle | — | No — cross-specimen comparative observations |
| OP-12g Chronicle Certification | Chronicle | — | No |
| OP-13 Topology Preview | PI Core (topology) | — | No |
| OP-14 Structural Centrality | PI Core (40.3c) | — | No |
| OP-15 Tier Handoff | Governance | — | No |
| OP-16 Evidence State | PI Core | — | No |
| OP-17 Qualifier | Governance | — | No |
| OP-18 Active Conditions | SW-INTEL | — | No |
| OP-19 Domain Cognition queries | SW-INTEL | — | No |
| OP-20 Structural Depth | PI Runtime | — | No |
| OP-21 Evidence Record | Report Pack | — | No |
| OP-22 Report Pack | Report Pack | — | No |
| OP-23 SW-INTEL Operator View | SW-INTEL | — | No |
| OP-24 Verification Protocol | SW-INTEL / Verification | — | No |
| OP-25 Signal Evidence | PI Core (evidence) | — | No |
| OP-26 Guided Actions | SQO | SW-INTEL (injected actions) | **YES** — SQO actions mixed with SW-INTEL derived actions |

### Layer Distribution

| Layer | Section Count | Screen Weight |
|---|---|---|
| PI Core | 10 | ~35% |
| SQO | 5 | ~15% |
| Chronicle | 5 | **~30%** (GA sub-sections dominate) |
| SW-INTEL | 4 | ~10% |
| Governance | 5 | ~5% |
| Report Pack | 2 | ~3% |
| PI Runtime | 1 | ~2% |

**Critical finding:** Chronicle content occupies approximately 30% of OPERATOR screen real estate despite OPERATOR's mission being engineering evidence inspection, not Chronicle replay. The 5 Chronicle sub-sections (Constitutional Anchor, Revalidation, Evidence Enrichment, Convergence Observations, Chronicle Certification) are a complete governed cognitive replay audit embedded inside an evidence inspection workspace.

### Mixed Sections

4 sections mix cognition layers:

1. **OP-04 (Per-Domain Correspondence):** SQO reconciliation status layered on PI Core domain structure. Acceptable mixing — the operator needs to see both.

2. **OP-12b (Proposition Corpus):** SQO proposition review state intermixed with Chronicle lifecycle. Flagged items table shows governance review history that belongs to Chronicle replay.

3. **OP-12d (Revalidation):** Chronicle revalidation checks contain SQO debt reassessment as a sub-section. Two different governance concerns merged.

4. **OP-26 (Guided Actions):** Core SQO actions (review obligations, request advancement) mixed with SW-INTEL injected actions (reconcile domains, non-operational receiver). Different cognition families producing actions through the same surface.

---

## 7. Frankenstein Symptom Inventory

### CRITICAL

| ID | Symptom | Description | Severity |
|---|---|---|---|
| F-01 | **Chronicle lifecycle dumped into OPERATOR** | Constitutional Anchor, Revalidation, Evidence Enrichment, Convergence Observations, and Chronicle Certification are full governed cognitive replay audit sections. They belong to a Chronicle/INVESTIGATION surface, not an OPERATOR evidence workspace. Together they produce ~300+ table rows of detailed lifecycle data. | CRITICAL |
| F-02 | **Three separate signal presentations** | The same signal data appears in three different sections: Signal Stack (OP-09, 2 signals with narrative), Signal Audit (OP-10, 8 signals in table), and Signal Evidence (OP-25, 6 signal cards with interpretation). Three different renderings of overlapping signal data with inconsistent depth and formatting. | CRITICAL |
| F-03 | **SW-INTEL after raw evidence** | The SW-INTEL Operator View (synthesized cognition) renders BELOW the OperatorTraceField (raw evidence). The operator encounters raw hashes, signal tables, and governance tables before seeing the synthesized meaning those signals produce. This inverts the correct cognition sequence: synthesis should orient, evidence should prove. | CRITICAL |

### HIGH

| ID | Symptom | Description | Severity |
|---|---|---|---|
| F-04 | **Labels from different doctrines competing** | "OPERATIONAL POSTURE" (SQO), "RECONCILIATION POSTURE" (SQO), "FORENSIC INTERPRETATION" (PI/75.x), "INFERENCE PROHIBITION" (governance), "GOVERNANCE AUDIT" (Chronicle/SQO) all appear as equal-weight section headers. No hierarchy signals which is the primary OPERATOR concern vs ambient context. | HIGH |
| F-05 | **Operator forced to scroll through raw artifacts without narrative order** | The page expands ALL tiers by default. An operator arriving at the page sees ~4,000px of content before SW-INTEL. With SW-INTEL active, the total is ~6,000px. No progressive disclosure, no "start here" marker, no guided path through the content. | HIGH |
| F-06 | **Report Pack controls mixed into evidence inspection** | REPORT PACK (OP-22) shows "Tier-1 Narrative Brief", "Tier-2 Diagnostic Narrative", "Decision Surface" — all labeled "binding pending". These are deliverable packaging controls, not evidence inspection. They belong in an export/report surface, not the OPERATOR right rail. | HIGH |
| F-07 | **Governance checks rendered as primary content** | 11 governance invariant checks (OP-02) display alongside operational posture as equal-weight content. These checks never change — they are constitutional invariants. Displaying them at the same level as dynamic evidence creates false impression of runtime variability. | HIGH |
| F-08 | **Topology shown without explaining relation to signals/conditions** | Topology preview (OP-13) renders deep in the scroll (after GA), disconnected from both Signal Audit (OP-10) and SW-INTEL conditions (OP-23). The topology IS the structural substrate from which signals derive and conditions emerge, but the page doesn't connect them visually or narratively. | HIGH |

### MEDIUM

| ID | Symptom | Description | Severity |
|---|---|---|---|
| F-09 | **Inference Prohibition as full section** | The Inference Prohibition (OP-11) is a static governance statement that takes up a full actor section. It states constitutional invariants that never change. This information is already in the governance footer (OP-SHELL-04). Duplicate governance assertion occupying evidence inspection space. | MEDIUM |
| F-10 | **FORENSIC INTERPRETATION narrative belongs to DENSE, not OPERATOR** | The left panel default shows "Evidence reading" and "What the evidence shows" — executive-altitude prose that OPERATOR's mission contract explicitly prohibits consuming. When SW-INTEL surfaces are focused, the left panel correctly transforms to condition detail. But the default state is wrong for OPERATOR. | MEDIUM |
| F-11 | **Qualifier appears twice** | Qualifier Q-03 appears as OP-05 (alert banner) AND OP-17 (right rail chip). Same information rendered twice in different visual treatments. | MEDIUM |
| F-12 | **Tier Handoff Statement redundant** | OP-15 (Tier Handoff) and OP-SHELL-04 (Governance Footer) make equivalent governance assertions. Both say "structurally derived, no inference." | MEDIUM |
| F-13 | **Structural centrality section has no header label** | OP-14 shows 10 ranked files but has no section title, no actor code, no explanation. It appears between topology preview and tier handoff as an unlabeled ranked list. | MEDIUM |

### LOW

| ID | Symptom | Description | Severity |
|---|---|---|---|
| F-14 | **EVIDENCE STATE shows empty readiness** | OP-16 shows readiness as "—" (dash). The label renders but the value is empty. Either the field should show the computed readiness or the section should be suppressed. | LOW |
| F-15 | **DeclarationZone content invisible** | DeclarationZone is tier0 but its rendered content is unclear — it may be the status bar area or a minimal section. Its contribution is not distinguishable from the shell-level status bar. | LOW |

---

## 8. Current Flow Assessment

### What the operator actually encounters (top to bottom, SW-INTEL OFF)

1. **Status bar** — client, run, qualifier (orientation)
2. **Persona selector** — mode switching (meta-navigation)
3. **Governance strip** — posture + 11 checks + reconciliation (mixed orientation + governance)
4. **Qualifier alert** — Q-03 warning (governance boundary)
5. **Three-column split begins**
6. **Left: Forensic prose** — executive-altitude interpretation (wrong for OPERATOR)
7. **Center: Reading guide** — how to interpret the view (orientation)
8. **Center: Evidence Trace hashes** — lineage audit (deep evidence)
9. **Center: Signal Stack (2)** — selected signals with narrative (signal inspection)
10. **Center: Signal Audit (8)** — full signal table (signal inspection)
11. **Center: Inference Prohibition** — governance statement (governance)
12. **Center: GOVERNANCE AUDIT** — 7 sub-sections of lifecycle/Chronicle data (governance + Chronicle dump)
13. **Center: Topology preview** — clickable thumbnail (structural substrate)
14. **Center: Structural centrality** — 10 ranked files (structural substrate)
15. **Center: Tier Handoff** — governance disclaimer (governance)
16. **Right: Evidence State** — readiness chip (orientation)
17. **Right: Qualifier** — Q-03 chip (duplicate)
18. **Right: Structural Depth** — escalation button (PI Runtime)
19. **Right: Evidence Record** — export button (report pack)
20. **Right: Report Pack** — deliverable list (report pack)
21. **Below three-column: Signal Evidence** — 6 signal cards (signal inspection — duplicate)
22. **Below three-column: Guided Actions** — SQO action buttons (runtime action)

### With SW-INTEL ON (additional)

After step 15, before step 16:
- **Center: SW-INTEL Operator View** — 5 cognition surfaces (SW-INTEL)
- **Right: Active Conditions** — condition list (SW-INTEL)
- **Right: Domain Cognition queries** — query chips (SW-INTEL)

When VERIFY invoked:
- **Center: Verification Protocol** — 5 steps + replay (verification)

### Flow Assessment Against Proposed 8-Step Model

| Proposed Step | Current Position | Gap |
|---|---|---|
| 1. Orientation | Steps 1-4: status bar, posture, qualifier | Mostly present but scattered. "Executive Ready — Qualified" needs definition. |
| 2. Structural Substrate | Steps 13-14: topology + centrality | **Correct content, wrong position** — buried after Governance Audit. Must be Step 2 because all conditions are claims about topology entities. |
| 3. Condition/Consequence Layer | SW-INTEL section (only when active) | **Correct content, wrong position** — appears after all raw evidence. Must follow substrate (Step 2) so consequence labels reference entities the operator has already seen. |
| 4. Signal Layer | Steps 9-10, 21 | **Fragmented** — three separate presentations of the same signal data. |
| 5. Governance State | Step 12: Governance Audit | **Overloaded** — governance lifecycle + Chronicle replay merged into one massive section. |
| 6. Evidence Lineage | Step 8: Evidence Trace | **Correct content, wrong position** — hashes appear too early (before signals). |
| 7. Verification Layer | Verification Protocol (only when invoked) | **Correct** — on-demand invocation is the right pattern. |
| 8. Report/Export Layer | Steps 19-20: Evidence Record + Report Pack | **Correct but wrong surface** — Report Pack belongs in a dedicated export view, not the OPERATOR right rail. |

### Verdict

The current OPERATOR flow is: **orientation → governance (overloaded) → raw evidence (fragmented) → synthesis (SW-INTEL, too late) → action (too far down)**.

The correct flow should be: **orientation → structural substrate (what exists) → synthesis (what it means) → signals (what proves it) → governance (what constrains it) → verification (is it true) → action/export (what to do)**.

The page is approximately **inverted** — it leads with raw data and buries the synthesized cognition that would give that data meaning. Structural substrate must precede SW-INTEL consequence surfaces because conditions are claims ABOUT the topology — "Delivery Fragility at Platform Infrastructure and Data" is meaningless until the operator has seen what Platform Infrastructure and Data IS.

---

## 9. Proposed Cognitive Flow Model

### OPERATOR Cognitive Sequence (8 steps)

```
STEP 1: ORIENTATION
├── What am I looking at? (specimen, run, state)
├── What is the qualification posture? (S-level, posture label WITH definition)
├── What is the evidence qualification? (Q-class, grounding ratio)
└── What governance boundaries apply? (qualifier, prohibition — compact)

STEP 2: STRUCTURAL SUBSTRATE
├── What does the structural topology look like? (topology — primary orientation instrument)
├── What domains/clusters/files exist? (domain registry, structural centrality)
├── What is structurally grounded vs semantic-only? (per-domain reconciliation)
└── What are the structural spines? (centrality ranking)
    Substrate MUST precede consequence surfaces — conditions are claims ABOUT the topology.

STEP 3: CONDITION / CONSEQUENCE OVERVIEW (SW-INTEL)
├── What operational conditions emerged? (SW-INTEL surfaces)
├── What is the peak severity? (attention routing)
├── Which domains are affected? (structural scope — now meaningful because Step 2 established substrate)
└── What should I inspect first? (guided entry points)

STEP 4: SIGNAL LAYER (unified)
├── What signals fired? (unified signal inventory — ONE presentation)
├── What are the values and severities? (4-decimal precision)
├── Which signal families are represented? (ISIG/DPSIG/PSIG)
├── What evidence derives each signal? (signal-to-evidence trace)
└── What are the compound effects? (pressure zone synthesis)

STEP 5: GOVERNANCE STATE
├── What is the governance lifecycle? (S-level, provenance, transitions)
├── What is the proposition corpus status? (summary stats, not 85-row table)
├── What blocks qualification? (blockers, not full revalidation log)
└── What governance actions are available? (guided actions — ELEVATED)

STEP 6: EVIDENCE LINEAGE
├── What evidence hashes prove reproducibility? (evidence trace)
├── What is the derivation chain? (baseline anchor, run linkage)
└── What confidence boundaries apply? (evidence backing status)

STEP 7: VERIFICATION (on-demand)
├── Can compilation claims be verified? (VERIFY button)
├── What did each verification step prove? (5-step protocol)
├── Does replay match? (determinism check)
└── What cognition ontology explains each result? (CognitionOntology integration)

STEP 8: EXPORT / ACTION
├── Generate evidence record (HTML export)
├── Execute governed actions (SQO workflow)
└── Deep governance forensics (expandable — Chronicle content available but collapsed)
```

### Key differences from current:

1. **Structural substrate moves to Step 2** (currently after Governance Audit — topology must precede consequence surfaces)
2. **SW-INTEL moves to Step 3** (currently buried after raw evidence — consequence surfaces follow substrate)
3. **Signals unified into one section** (currently 3 separate presentations)
4. **Governance compressed** (currently 7 sub-sections; proposed: summary + blockers only)
5. **Chronicle content moves to collapsible Step 8** (currently inline, dominating screen)
6. **Guided Actions elevated** (currently at page bottom; proposed: alongside governance)
7. **Evidence lineage (hashes) moved later** (currently second section; proposed: Step 6)

### Sequencing invariant:

**STRUCTURAL SUBSTRATE must precede SW-INTEL CONSEQUENCE SURFACES.** Conditions are structural claims about topology entities. "Delivery Fragility at Platform Infrastructure and Data" requires the operator to have already seen what Platform Infrastructure and Data is in the topology, what its structural mass is, and what domains surround it. Without substrate context, consequence labels are abstract assertions.

---

## 10. What Must Stay in OPERATOR

| Section | Reason |
|---|---|
| Orientation strip (posture, Q-class, qualifier) | Essential first-glance state |
| SW-INTEL Operator View (5 surfaces) | Core synthesized cognition for OPERATOR |
| Topology Preview | Structural substrate visualization |
| Structural Centrality (top spines) | File-level structural evidence |
| Signal Audit (unified) | Core signal evidence at operator precision |
| Per-Domain Correspondence | Domain-level evidence inspection |
| Governance Lifecycle (summary) | Qualification state + transitions |
| Guided Actions | Operational action surface |
| Evidence Trace (lineage) | Reproducibility proof |
| Verification Protocol (on-demand) | Compilation verification |
| Evidence Record export | Export capability |
| Reading Guide | Orientation for unfamiliar operators |
| CognitionOntology integration | Label explanation (expand from verification to all sections) |

---

## 11. What Should Move Out of OPERATOR

| Section | Destination | Reason |
|---|---|---|
| OP-12c Constitutional Anchor (8 dimensions) | Future INVESTIGATION / collapsed forensics | Cross-specimen governance replay — not evidence inspection |
| OP-12d Revalidation (25 checks, 8 phases) | Future INVESTIGATION / collapsed forensics | Chronicle revalidation — operator needs "25/25 PASS", not 25 individual check rows |
| OP-12e Evidence Enrichment | Future INVESTIGATION / collapsed forensics | Chronicle enrichment analytics |
| OP-12f Convergence Observations (9 entries) | Future INVESTIGATION / collapsed forensics | Cross-specimen comparative analysis — completely foreign to single-specimen evidence inspection |
| OP-12g Chronicle Certification (62 checks) | Future INVESTIGATION / collapsed forensics | Full certification audit — operator needs "CERTIFIED (62/62)", not 10-phase breakdown |
| OP-22 Report Pack (4 deliverables) | Dedicated export surface / SQO V2 | Deliverable packaging is not evidence inspection |
| OP-02 11 Governance Checks | Governance footer (expandable) | Constitutional invariants — never change, not runtime evidence |
| OP-11 Inference Prohibition (full section) | Governance footer | Static governance statement — redundant with governance footer |
| OP-15 Tier Handoff Statement | Remove (redundant) | Duplicate of governance footer assertion |
| OP-06 Forensic Interpretation (default state) | Replace with OPERATOR-specific orientation | Executive-altitude prose violates OPERATOR mission contract (no interpretive synthesis) |

---

## 12. What Must Be Explained Better

### Immediate — Labels with NO explanation

| Label | Required Explanation |
|---|---|
| coupling_pressure / domain_coupling_pressure / zone_coverage_concentration / unanchored_nodes | Human name + what it measures + what the value means. PSIG signals are the worst-explained labels in OPERATOR — machine identifiers with no human translation. CognitionOntology pattern should extend to signals. |
| Executive Ready — Qualified | What "ready" means at S2. What qualification entails. What the operator can do in this state. |
| S2 / S-level | What S2 means. What S0/S1/S3 would mean. What moves between states. |
| L3 authority ceiling | What authority levels exist. What L3 permits vs prohibits. |
| RICHNESS FULL / GOVERNANCE FULL / RECONCILIATION UNRECONCILED | QualificationContextStrip terms are undefined. Each needs a TermHint or inline definition. |
| GOVERNED LIFECYCLE | What "governed" means vs unqualified or bridged. |
| Friction rate (4.71%) | What friction is. How it's computed. What the baseline is. |
| Constitutional distance | What is being measured. Why it matters. |
| Convergence observation | What convergence means. What two specimens are being compared. |
| SW-INTEL | Expand abbreviation. Define Software Intelligence as a domain cognition module. |
| VALIDATION_SUPPORT (structural role) | What this classification means. Why all 10 top spines have the same role. |

### Medium-term — Labels with PARTIAL explanation needing enhancement

| Label | Enhancement Needed |
|---|---|
| Delivery Fragility / Integration Exposure / etc. | Add SOURCE (which conditions) and TRACE (upstream/downstream), matching CognitionOntology pattern from verification |
| Signal Stack entries | Add MECHANIC (how computed) and IMPLICATION (what happens if HIGH) |
| ISIG / DPSIG / PSIG family labels | Add level explanation (Level 1 vs Level 2 vs Topology) inline, not just in SA header chips |
| Cluster Pressure Index / Cluster Fan Asymmetry | Add IMPLICATION (what does 3.4532x mean for operations?) |

---

## 13. What Belongs to Future INVESTIGATION

The following content is evidence qualification and governed replay — the constitutional mission of the INVESTIGATION persona:

| Content | Current Location | INVESTIGATION Role |
|---|---|---|
| Constitutional Anchor (8-dimension comparator) | OP-12c (inline GA) | Cross-specimen governance adequacy verification |
| Full Revalidation (25 checks, 8 phases, per-check detail) | OP-12d (inline GA) | Deterministic revalidation audit |
| Evidence Enrichment analytics | OP-12e (inline GA) | Enrichment effectiveness assessment |
| Convergence Observations (9 cross-specimen comparisons) | OP-12f (inline GA) | Cross-specimen governance pattern analysis |
| Chronicle Certification (62 checks, 10 phases) | OP-12g (inline GA) | Full certification audit with per-phase detail |
| Proposition Corpus (85-row flagged items table) | OP-12b (inline GA, detail rows) | Per-proposition evidence qualification review |

**Total screen real estate currently occupied by future-INVESTIGATION content in OPERATOR:** approximately 30% of the page.

**Recommended interim treatment:** Collapse into a "Deep Governance Forensics" section at the bottom of OPERATOR, collapsed by default, with summary badges (e.g., "REVALIDATION 25/25 PASS · CERTIFICATION 62/62 · 9 CONVERGENCE OBSERVATIONS"). An operator who needs this depth can expand. This content will eventually migrate to the INVESTIGATION persona once it has a certified implementation.

---

## 14. What Belongs to SQO

The following content is SQO governance workflow, not evidence inspection:

| Content | Current Location | SQO Role |
|---|---|---|
| Guided Actions (review, advance, reconcile) | OP-26 (SQOIntelligenceZone) | SQO operator authority workflow actions |
| Qualification posture computation | OP-01 | SQO posture resolver output |
| Per-Domain Correspondence (17 domain reconciliation status) | OP-04 | SQO reconciliation awareness |
| Proposition Corpus (summary stats) | OP-12b (inline GA) | SQO proposition review summary |

**Current treatment is acceptable.** SQO content in OPERATOR serves the operator's need to understand qualification state and take governed actions. The Guided Actions section is correctly surfaced.

**One adjustment needed:** Guided Actions should be more prominent (currently at page bottom). Move to Step 5 in the proposed cognitive flow (alongside governance state summary).

---

## 15. What Belongs to Report Pack / Export

| Content | Current Location | Correct Surface |
|---|---|---|
| Report Pack (4 deliverables: Decision Surface, Tier-1 Narrative Brief, Tier-1 Evidence Brief, Tier-2 Diagnostic Narrative) | OP-22 (right rail) | Dedicated export/deliverable surface or SQO V2 cockpit |
| Evidence Record (generate button) | OP-21 (right rail) | Keep in OPERATOR — this is evidence export, not deliverable packaging |

**Report Pack is a deliverable packaging concern.** It shows "binding pending" because live client/run integration is not active. These are commercial deliverables — they belong in a delivery/export workflow, not an evidence inspection right rail. The evidence record button is correctly placed because it exports the operator's current evidence inspection trail.

---

## 16. Recommended Next Stream

### PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01

**Classification:** G2 — Architecture-Consuming
**Branch:** feature/runtime-demo (OPERATOR rendering code)
**Scope:** Resequence OPERATOR zones + add label explanations. No new modules. No new data. No new personas.

**Phase 1 — Resequencing (structural):**
1. Move Topology Preview + Structural Centrality to render FIRST after orientation (Step 2 — substrate precedes consequence surfaces)
2. Move SW-INTEL Operator View to render after topology (Step 3 — consequence surfaces follow substrate)
3. Unify three signal presentations (OP-09, OP-10, OP-25) into single section (Step 4)
4. Collapse GA into: Governance Lifecycle summary (S-level, transitions, blocker count) + expandable "Deep Governance Forensics" containing current OP-12c/d/e/f/g
5. Elevate Guided Actions from page bottom to alongside Governance summary (Step 5)
6. Move Evidence Trace hashes to later position (Step 6)
7. Remove Report Pack from right rail (or collapse to single "Export" button)
8. Merge Inference Prohibition and Tier Handoff into governance footer

**Phase 2 — Label Explanation:**
1. Extend CognitionOntology.js (or create SignalOntology.js) to cover PSIG signals with human names and explanations
2. Add TermHint definitions for S2, L3, RICHNESS, GOVERNANCE, RECONCILIATION
3. Add inline definitions for posture labels ("Executive Ready — Qualified" → + what this means)
4. Add human names for SW-INTEL surfaces matching CognitionOntology pattern
5. Add section labels for Structural Centrality, GA sub-sections

**Phase 3 — Left panel correction:**
1. Replace default "Forensic Interpretation" narrative with OPERATOR-specific orientation (specimen summary, evidence overview, not executive prose)
2. Preserve condition-detail transformation when SW-INTEL surface is focused

**Estimated scope:** 2-3 sessions. No new runtime computation. No new data objects. Pure rendering resequencing + static ontology extension.

### Dependency

This stream consumes the CognitionOntology.js pattern established by PI.COGNITION.HUMAN-EXPLAINABILITY-ONTOLOGY.01 and extends it beyond verification proof components to all OPERATOR labels. The ontology module is the primary explanation mechanism.

---

## 17. Closure Verdict

**PASS — OPERATOR COGNITIVE FLOW AUDIT COMPLETE**

### Findings Summary

| Dimension | Result |
|---|---|
| Zones mapped | 26 content sections + 4 shell elements |
| Major labels audited | 35 labels across 6 families |
| Labels EXPLAINED | 7 (20%) |
| Labels PARTIALLY EXPLAINED | 12 (34%) |
| Labels LABEL ONLY | 15 (43%) |
| Labels DUMPED DATA | 1 (3%) |
| Cognition layers identified | 7 (PI Core, SQO, Chronicle, SW-INTEL, Governance, Report Pack, PI Runtime) |
| Mixed sections | 4 |
| Frankenstein symptoms | 15 (3 CRITICAL, 5 HIGH, 5 MEDIUM, 2 LOW) |
| Proposed flow steps | 8 |
| Sections to stay | 13 |
| Sections to move/collapse | 10 |
| Sections to remove | 2 (redundant) |

### Core Diagnosis

OPERATOR is a valuable but incoherent surface. It contains the deepest evidence in the LENS v2 system — raw signal values at 4-decimal precision, governance lifecycle with full proposition corpus, structural centrality spines, verification protocol with full cognition ontology explanation. This material is operationally essential.

But it is presented as a dump rather than a guided cognitive flow. The three most consequential problems are:

1. **Chronicle lifecycle data dominates** the page (~30% of screen), yet OPERATOR's mission is evidence inspection, not Chronicle replay.
2. **SW-INTEL synthesized cognition appears after raw evidence** instead of before, inverting the correct sequence (understand first, verify second).
3. **Signal evidence is fragmented across three separate sections** with inconsistent formatting and redundant data.

The proposed next stream (PI.OPERATOR.COGNITIVE-FLOW-RESEQUENCING.01) addresses all three through rendering resequencing and label explanation extension — no new computation, no new data, no architectural changes.
