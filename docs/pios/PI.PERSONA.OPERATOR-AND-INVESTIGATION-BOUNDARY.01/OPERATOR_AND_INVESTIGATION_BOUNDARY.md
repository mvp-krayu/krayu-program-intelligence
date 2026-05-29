# OPERATOR and INVESTIGATION Persona Boundary

**Stream:** PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01
**Classification:** G1 — Architecture-Mutating
**Baseline:** accb7e6 (investigation persona assessment committed)
**Depends on:** PI.SOFTWARE-INTELLIGENCE.INVESTIGATION-PERSONA-ASSESSMENT.01 (Verdict A — Current INVESTIGATION = OPERATOR)
**Depends on:** PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01 (4-persona mission contracts locked)
**Depends on:** PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01 (compilation chain locked)

---

## §1 — Decision Gate

### §1.1 — The Question

Is OPERATOR officially recognized as a persona, or does it remain internal/hidden?

### §1.2 — The Verdict (from prior assessment)

Verdict A: Current INVESTIGATION is functionally an OPERATOR workspace. The behavioral evidence is unambiguous:

| INVESTIGATION Contract | Current Implementation |
|---|---|
| LOW agency | HIGH agency — operator chooses what to inspect |
| SYSTEM-ENFORCED SEQUENCE | OPERATOR-CONTROLLED — exploration-driven |
| Evidence qualification | Engineering analysis |
| Governed replay | Interactive topology |
| Fixed proof steps | Engineering analysis questions |

### §1.3 — The Decision

**OPERATOR is officially recognized as a persona.**

Rationale:

1. **The capabilities are real and valuable.** ET (evidence trace), SA (signal audit), GA (governance audit), IP (inference prohibition) are unique surfaces — no other persona renders them. Destroying these surfaces to "fix" the INVESTIGATION label would lose operational capability.

2. **The behavioral pattern is distinct.** OPERATOR serves engineering analysis: full numeric precision, governance lifecycle inspection, evidence hash visibility, interactive forensic topology. This is neither DENSE's structural behavior interrogation (zone-navigated, 42 queries) nor INVESTIGATION's constitutional verification (fixed sequence, PASS/FAIL assertions). It occupies a distinct cognitive position.

3. **The mission contract exists.** The prior assessment defined the cognitive gap: engineers and technical analysts who need raw evidence inspection at full precision — not topology behavior exploration (DENSE), not compiled briefings (BOARDROOM/BALANCED), not evidence verification (INVESTIGATION). OPERATOR fills the gap between "explore structural behavior interactively" and "verify evidence chains sequentially."

4. **Hiding it creates debt.** If OPERATOR remains "hidden INVESTIGATION," every future stream must work around the mislabeling. Program 2 (INVESTIGATION Revalidation) cannot be correctly scoped. New developers will be confused by code labeled INVESTIGATION that behaves as OPERATOR.

---

## §2 — Is OPERATOR Hidden or Explicit?

**OPERATOR is EXPLICIT.**

| Option | Consequence |
|---|---|
| Hidden (internal label only) | Runtime still shows "INVESTIGATION" to the operator. Mission contract for INVESTIGATION remains violated. Code comments explain the lie. New streams must work around it. |
| Explicit (visible persona) | Runtime shows "OPERATOR" with its own label. Mission contract is honest. INVESTIGATION can be designed correctly later. |

**Decision: EXPLICIT.** The runtime should not present a persona labeled INVESTIGATION that does not perform evidence qualification or governed replay. The operator sees OPERATOR, the code says OPERATOR, the mission contract describes OPERATOR.

### §2.1 — Visibility Scope

OPERATOR is explicit in LENS v2 persona selection. The operator can switch to OPERATOR mode. The persona has its own:
- Mission contract (§4)
- Cognitive objective
- Left panel rendering
- Right panel rendering (guided queries)
- Main canvas rendering (InvestigationTraceField → renamed OPERATOR rendering)
- Escalation conditions

---

## §3 — Capability Boundary

### §3.1 — What Belongs to OPERATOR

OPERATOR owns the current INVESTIGATION_DENSE implementation surfaces:

| Capability | Source | Purpose | OPERATOR Role |
|---|---|---|---|
| **ET — Evidence Trace** | `InvestigationTraceField` lines 5999-6023 | Evidence hash chain (evidence_object_hash, derivation_hash, baseline_anchor, run_id) | Raw evidence lineage inspection |
| **SS — Signal Stack** | `InvestigationTraceField` lines 6025-6055 | Per-signal evidence rows with confidence, domain, grounding status | Signal evidence inspection at full depth |
| **SA — Signal Audit** | `InvestigationSignalAudit` component | Full signal table: ID, family, name, value (4 decimal), severity, interpretation | Forensic signal inspection |
| **IP — Inference Prohibition** | `InvestigationTraceField` lines 6059-6081 | Static governance statement + active qualifier/ALI rules | Governance boundary display |
| **GA — Governance Audit** | `InvestigationGovernanceAudit` component | Full governance lifecycle: S-level, propositions, enrichment, revalidation, certification | Governance lifecycle inspection |
| **Forensic Topology** | `InvestigationTraceField` lines 6085-6098 | Clickable topology preview → TopologyModal in `mode="investigation"` | Interactive topology exploration |
| **Guided Queries (4)** | `INVESTIGATION_DENSE` in `DENSE_ZONE_PATHS` lines 3416-3513 | 4 engineering analysis questions (structural gaps, role provenance, qualification boundaries, ungrounded claims) | Engineering analysis interrogation |
| **SW-INTEL Investigation View** | `SoftwareIntelligenceInvestigationView` lines 354-375 | Pre-compiler projection adapter surfaces | STALE — predates consequence compiler |
| **Tier Handoff** | `TierHandoffStatement` component | Terminal closure | Session closure |
| **Escalation Conditions** | `STRUCTURAL_ESCALATION_CONDITIONS.investigation` line 361-364 | Evidence blocks with semantic-only backing | Structural depth gate |

### §3.2 — What Belongs to INVESTIGATION (New, Future)

INVESTIGATION will be designed from the compilation model (PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01). It does NOT exist yet. When built, it will own:

| Capability | Purpose | INVESTIGATION Role |
|---|---|---|
| **Compilation Chain Verification** | For each consequence: show condition → consequence → combination chain, verify mapping rule | Verify that the compiler correctly transformed inputs to outputs |
| **Evidence Completeness Audit** | For each compilation stage: show what evidence exists and what is missing | Verify that evidence was preserved through the chain |
| **Combination Pattern Decomposition** | For each combination: show contributing consequences, verify trigger conditions | Verify that combination patterns fired correctly |
| **Ontology Class Verification** | For each consequence: verify ontology class assignment against compilation model §6.2 | Verify that classification is correct |
| **Maturity Classification Audit** | For each slice/condition/consequence: show maturity level, show promotion blockers | Verify maturity claims against evidence |
| **Fixed Verification Sequence** | SYSTEM-ENFORCED: Evidence → Conditions → Consequences → Combinations → Projections | Enforce completeness — every stage must pass |
| **Replay** | Given inputs (fullReport), reproduce compilation output and compare to rendered state | Verify by reproduction |

### §3.3 — Boundary Table

| Dimension | OPERATOR | INVESTIGATION (future) |
|---|---|---|
| **Objective** | Engineering analysis and workspace inspection | Evidence qualification and governed replay |
| **Question** | "What does the evidence show?" | "Can this be proven?" |
| **Agency** | HIGH — operator controls focus | LOW — system enforces sequence |
| **Attention** | OPERATOR-CONTROLLED — exploration | SYSTEM-ENFORCED — verification |
| **Output** | Inspected evidence, observed governance state | PASS / FAIL per verification target |
| **Topology** | Interactive exploration | Not needed (or: verification that topology matches evidence) |
| **Governance** | Inspection — browse lifecycle state | Verification — assert transition validity |
| **Signals** | Inspection — observe values at full precision | Verification — confirm thresholds triggered conditions |
| **Consequence Compiler** | Not consumed (evidence layer, not compilation layer) | PRIMARY consumer — verifies compilation chain |

---

## §4 — OPERATOR Mission Contract

### §4.1 — Constitutional Objective

**Engineering evidence inspection and governance audit.**

OPERATOR exists to allow a technical operator to inspect raw evidence at full numeric precision, audit governance lifecycle state, view inference prohibitions, and explore the forensic topology. The operator INSPECTS everything the system knows about its own evidence and governance state.

OPERATOR is NOT "Prove it." — that is INVESTIGATION's domain (verification, replay, PASS/FAIL). OPERATOR is "What does the evidence show at full depth?"

### §4.2 — Primary Question

"What is the complete evidence state, governance posture, and inference boundary of this intelligence — at full precision?"

This is specifically about EVIDENCE INSPECTION at full fidelity. The operator needs to see: raw hash chains, 4-decimal signal values, full governance lifecycle, active prohibition rules, and forensic topology. They are an engineer reviewing evidence, not an auditor verifying claims.

### §4.3 — Forbidden Questions

- "What is the executive verdict?" → BOARDROOM
- "What are the operational dynamics?" → BALANCED
- "How does structural pressure propagate?" → DENSE
- "Is this compilation chain correct?" → INVESTIGATION (future)
- "What should I do about this?" → prohibited entirely

### §4.4 — Operator Objective

Review the system's evidence state at full engineering depth. The operator inspects evidence hashes, signal values at 4-decimal precision, governance lifecycle transitions, proposition corpus metrics, and inference prohibition rules. They are building a complete picture of the system's evidence and governance foundation.

### §4.5 — Runtime Responsibility

Render all evidence surfaces at full depth in a deterministic layout. The operator scrolls through evidence sections (ET → SS → SA → IP → GA → Topology). The sections are ordered logically but not system-enforced — the operator can scroll freely and focus on any section.

### §4.6 — Cognition Consumed

| Function | Projection State |
|---|---|
| Trust Posture (#6) | PRESENT at FULL DEPTH |
| Governance Friction (#12) | MAXIMUM — forensic tables |
| Signal Interpretation (#13) | EXPOSED — evidence depth + audit |
| Evidence Boundary (#14) | MAXIMUM — inference prohibition |
| Spatial Anchor (#15) | EXPOSED — per-signal domain |
| Confidence Classification (#19) | MAXIMUM — 4-decimal detail |
| Blockage Detection (#20) | EXPOSED — forensic hold reason |
| Debt Evolution (#21) | EXPOSED — full debt drilldown |
| Authority Mode (#22) | PROHIBITION DISPLAY — rules shown but not enumerated as proof |
| Guided Cognition (#17) | PRESENT — 4 engineering queries |

### §4.7 — Cognition Prohibited

| Function | State | Reason |
|---|---|---|
| Emergence Orchestration (#1) | ABSENT | No discovery — evidence sections are fixed |
| Cognitive Priority Router (#2) | ABSENT | No prioritization — all evidence shown |
| Emergence Dashboard (#3) | ABSENT | No emergence to monitor |
| Executive Synthesis (#4) | ABSENT | No compiled verdict |
| Posture Synthesis (#5) | ABSENT | No synthesized posture |
| Compound Activation (#7) | ABSENT | Inspection, not detection |
| Compression Detection (#11) | ABSENT | No compression — full depth |
| Temporal Cognition (#16) | ABSENT | Below inspection scope |

### §4.8 — Attention-Control Model

**OPERATOR-CONTROLLED.** The operator chooses what to inspect. All evidence sections are present and scrollable. The operator focuses on the evidence section relevant to their current question. No system-enforced traversal order.

### §4.9 — Operator-Agency Model

**HIGH.** The operator can:
- Scroll to any evidence section
- Inspect individual evidence items
- Click forensic topology for interactive exploration
- Trigger 4 engineering analysis queries
- Open topology modal in forensic mode
- View signal values at full precision
- Expand governance audit sections

### §4.10 — Authority-Projection Model

**PROHIBITION DISPLAY.** Authority presents as the inference boundary — what rules constrain the system. The qualifier and ALI rules are shown. The governance statement is displayed. But this is DISPLAY, not ENUMERATION — OPERATOR shows the rules, INVESTIGATION will enumerate them as proof that the system complied.

### §4.11 — Success Condition

The operator can:
1. View the evidence hash chain and verify it is present
2. Inspect signal values at 4-decimal precision
3. Browse the full governance lifecycle (S-level, propositions, enrichment, revalidation)
4. See which inference prohibitions are active
5. Explore the topology in forensic mode
6. Ask 4 engineering analysis questions and receive evidence-derived answers

### §4.12 — Failure Condition

- Signal values are rounded or summarized
- Governance lifecycle is compressed or summarized
- Evidence hashes are not visible
- Inference prohibitions are not displayed
- The operator encounters executive language or operational briefing framing
- The operator encounters PASS/FAIL assertions (that's INVESTIGATION)

### §4.13 — Disappearance Consequence

Without OPERATOR, the runtime loses full-precision evidence inspection, governance lifecycle browsing, and inference prohibition display. No other persona renders evidence_object_hash, 4-decimal signal values, or proposition corpus metrics. Engineers lose the ability to inspect the system's evidence foundation at its native precision.

### §4.14 — SW-INTEL Ontology Consumption Posture

| Ontology Class | Posture | Rationale |
|---|---|---|
| A — Flow & Propagation | INSPECTION-ONLY | Evidence blocks inspected, not explored |
| B — Concentration & Saturation | INSPECTION-ONLY | Signal values inspected at full precision |
| C — Fragility & Resilience | NOT APPLICABLE | No current rendering |
| D — Reinforcement & Accumulation | INSPECTION-ONLY | Governance lifecycle browsed |
| E — Drift & Instability | NOT APPLICABLE | No current rendering |

### §4.15 — Implementation Freshness

**CURRENT.** The current INVESTIGATION_DENSE implementation IS the OPERATOR implementation. No new code needs to be written. The rename and reclassification is the alignment.

### §4.16 — Revalidation Requirement

1. Rename INVESTIGATION_DENSE constant to OPERATOR_DENSE (or OPERATOR)
2. Update RepresentationField branch condition
3. Update persona label in RepModeTag
4. Update DENSE_ZONE_PATHS key from INVESTIGATION_DENSE to operator key
5. Update STRUCTURAL_ESCALATION_CONDITIONS.investigation to .operator
6. Update left panel framing constant
7. Update SoftwareIntelligenceInvestigationView reference (or rename)
8. Verify all 4 guided queries still function
9. Verify topology modal still opens in forensic mode
10. Verify tier handoff statement still renders

---

## §5 — What Survives (From Current INVESTIGATION)

Everything survives. The current INVESTIGATION implementation becomes OPERATOR without capability loss.

| Component | Current Name | Survives As |
|---|---|---|
| `InvestigationTraceField` | Line 5956 | OPERATOR main canvas (rename pending — implementation stream) |
| `InvestigationSignalAudit` | Component | OPERATOR signal audit (rename pending) |
| `InvestigationGovernanceAudit` | Component | OPERATOR governance audit (rename pending) |
| `InvestigationReadingGuide` | Component | OPERATOR reading guide (rename pending) |
| `SoftwareIntelligenceInvestigationView` | Lines 354-375 | OPERATOR SW-INTEL view (STALE — update to consequence compiler in separate stream) |
| `TierHandoffStatement` | Component | OPERATOR terminal closure |
| `TopologyModal mode="investigation"` | Line 6098 | OPERATOR forensic topology (mode rename pending) |
| 4 guided queries | `INVESTIGATION_DENSE` key | OPERATOR engineering queries |
| Escalation condition | Line 361-364 | OPERATOR escalation |
| Left panel framing | "FORENSIC INTERPRETATION" | OPERATOR left panel (relabel pending) |

**Zero capability loss.** Every current surface transfers intact.

---

## §6 — What Migrates (To Future INVESTIGATION)

Nothing migrates from the current implementation. Future INVESTIGATION is built from scratch using the compilation model as its design substrate.

However, three OPERATOR capabilities may be SHARED with future INVESTIGATION:

| Capability | Current Location | Shared? | Rationale |
|---|---|---|---|
| Evidence hash chain (ET) | OPERATOR | YES — INVESTIGATION also needs lineage hashes | Both need evidence_object_hash. Different purpose: OPERATOR inspects, INVESTIGATION verifies. |
| Signal values (SA) | OPERATOR | POSSIBLY — INVESTIGATION may verify signal thresholds | OPERATOR shows values. INVESTIGATION would assert "this value correctly triggered this condition." |
| Inference prohibition (IP) | OPERATOR | YES — INVESTIGATION enumerates prohibitions as proof | OPERATOR displays rules. INVESTIGATION enumerates them as compliance evidence. |

Shared capabilities do NOT mean shared rendering. OPERATOR and INVESTIGATION may render the same data differently — OPERATOR as inspection surfaces, INVESTIGATION as verification assertions.

---

## §7 — What Is Built From Scratch (For Future INVESTIGATION)

| Capability | Design Source | Required Substrate |
|---|---|---|
| Compilation chain verification | Compilation model §4-§8 | ConsequenceCompiler output + derivation traces |
| Evidence completeness audit | Compilation model §11-§12 | Structured derivation_trace (currently string — gap) |
| Combination pattern decomposition | Compilation model §7 | Combination output + contributing consequence IDs |
| Ontology class verification | Compilation model §6 (ontology classification) | Ontology class assignments on consequence objects |
| Maturity classification audit | Slice taxonomy governance doc | Maturity level + promotion blockers per slice |
| Fixed verification sequence | Mission contract §7.8 (SYSTEM-ENFORCED SEQUENCE) | Layout that enforces stage-by-stage traversal |
| Replay | Compilation model §16 | Deterministic compilation reproducer |

### §7.1 — Substrate Readiness

| Required Substrate | Current State | Blocks INVESTIGATION? |
|---|---|---|
| `derivation_trace` structured (not string) | STRING — Gap #3 from evidence loss inventory | YES — cannot verify compilation chain without structured trace |
| Signal IDs preserved in consequences | MISSING — Gap #4 from evidence loss inventory | YES — cannot verify "this signal triggered this condition" |
| Condition IDs preserved in BOARDROOM | MISSING — Gap #7 from evidence loss inventory | Partial — affects BOARDROOM verification only |
| Consequence type ID on combination | PRESENT | No |
| Ontology class on consequence | PRESENT | No |
| Slice maturity level | Governance doc only | YES — not yet in runtime objects |

**Critical blockers for future INVESTIGATION:** Gaps #3 and #4 from the evidence loss inventory (Program 1 — Evidence Chain Structuring). INVESTIGATION cannot be built until Program 1 is executed.

---

## §8 — The 5-Persona Model

### §8.1 — Updated Persona Table

| Persona | Constitutional Objective | Primary Question | Agency | Attention |
|---|---|---|---|---|
| BOARDROOM | Executive consequence qualification | What requires my attention? | LOWEST | System-controlled |
| BALANCED | Governed operational cognition briefing | What dynamics are emerging? | MEDIUM | Co-discovery |
| DENSE | Structural behavior interrogation | How does pressure propagate? | HIGHEST | Operator-controlled |
| OPERATOR | Engineering evidence inspection | What does the evidence show? | HIGH | Operator-controlled |
| INVESTIGATION | Evidence qualification and governed replay | Can this be proven? | LOW | System-enforced |

### §8.2 — Cognitive Altitude Ladder

```
BOARDROOM       ─── compiled verdict ─── executive altitude
    ↓
BALANCED        ─── operational briefing ─── leadership altitude
    ↓
DENSE           ─── structural interrogation ─── engineering altitude
    ↓
OPERATOR        ─── evidence inspection ─── forensic altitude
    ↓
INVESTIGATION   ─── governed verification ─── audit altitude
```

The ladder now has 5 clear levels with no overlap:
- BOARDROOM compresses everything into a verdict
- BALANCED sequences consequence understanding
- DENSE enables interactive topology exploration
- OPERATOR shows raw evidence at full precision
- INVESTIGATION verifies claims against evidence (future)

### §8.3 — Agency Spectrum

```
LOWEST                                              HIGHEST
  |                                                     |
  BOARDROOM    INVESTIGATION    BALANCED    OPERATOR    DENSE
  (receives    (follows         (monitors   (inspects   (navigates
   verdict)     sequence)        emergence)  freely)     freely)
```

BOARDROOM and INVESTIGATION both constrain agency, but for opposite reasons:
- BOARDROOM: the executive needs a verdict, not exploration
- INVESTIGATION: the auditor needs completeness, not freedom

DENSE and OPERATOR both have high agency, but for different purposes:
- DENSE: the engineer navigates structural behavior
- OPERATOR: the engineer inspects raw evidence

### §8.4 — Mutual Exclusivity Verification

| Pair | Overlap Risk | Resolution |
|---|---|---|
| BOARDROOM vs BALANCED | "What matters" vs "Why operationally" | Resolved: BOARDROOM compiles verdict. BALANCED sequences dynamics. Different output. |
| DENSE vs OPERATOR | Both high agency, both engineering | Resolved: DENSE navigates topology behavior (zones, overlays, 42 queries). OPERATOR inspects evidence values (hashes, 4-decimal signals, governance tables). Different substrate. |
| OPERATOR vs INVESTIGATION | Both handle evidence | Resolved: OPERATOR inspects (shows values). INVESTIGATION verifies (asserts correctness). Different output type: data vs assertions. |
| DENSE vs INVESTIGATION | "Prove structurally" vs "Prove evidence" | Resolved: DENSE proves by navigation (HERE is where pressure concentrates). INVESTIGATION proves by verification (THIS derivation chain is complete). Different proof mode. |

---

## §9 — Implementation Implications

### §9.1 — What Changes in Code (Implementation Stream — Separate)

The boundary assessment does NOT implement changes. The following changes are identified for a future implementation stream:

1. **Constant rename:** `INVESTIGATION_DENSE` → new OPERATOR constant throughout IntelligenceField.jsx
2. **Persona selector label:** Update persona selection UI to show OPERATOR instead of INVESTIGATION
3. **Left panel framing:** "FORENSIC INTERPRETATION" → OPERATOR-appropriate label
4. **Component renames:** InvestigationTraceField, InvestigationSignalAudit, InvestigationGovernanceAudit, InvestigationReadingGuide → OPERATOR-prefixed names
5. **Guided query key:** `INVESTIGATION_DENSE` → operator key in DENSE_ZONE_PATHS
6. **Escalation condition:** `.investigation` → `.operator` in STRUCTURAL_ESCALATION_CONDITIONS
7. **INVESTIGATION_DENSE slot empty:** After OPERATOR split, the INVESTIGATION_DENSE constant has no implementation. Future INVESTIGATION will fill it.
8. **Topology modal mode:** `mode="investigation"` → `mode="operator"` or `mode="forensic"`
9. **CSS class:** `.rep-field--investigation` → `.rep-field--operator`

### §9.2 — What Does NOT Change

- BOARDROOM implementation — untouched
- BALANCED implementation — untouched
- DENSE implementation — untouched
- ConsequenceCompiler — untouched
- SignalSynthesisEngine — untouched
- SQO — untouched
- Vault — updated by this stream (G1)
- Mission contracts — updated by this stream (OPERATOR contract added)

### §9.3 — Program 2 Reframe

Program 2 (INVESTIGATION Revalidation from gap roadmap) is reframed:

**Before:** "Update current INVESTIGATION to consume consequence compiler output."
**After:** Two separate programs:

1. **OPERATOR Establishment** — Rename current INVESTIGATION to OPERATOR, update labels, preserve all capabilities. Small implementation stream. No new code — rename and relabel only.

2. **INVESTIGATION Design** — Design new INVESTIGATION from compilation model. Requires Program 1 (Evidence Chain Structuring) to complete first (gaps #3, #4 are blockers). Large design stream producing constitutional definition, not implementation.

---

## §10 — Vault Mutation

### §10.1 — Persona Mission Contracts

The mission contract document (PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01) must be updated to add the OPERATOR mission contract (§4 of this document) and update the 4-persona comparison matrix to 5-persona.

**This is a G1 vault mutation that requires a separate stream** — the mission contract document is locked. This boundary assessment IDENTIFIES the mutation. It does not EXECUTE it.

### §10.2 — Canonical State

PIOS_CURRENT_CANONICAL_STATE.md must be updated:
- "4-persona projection" → "5-persona projection (OPERATOR recognized, INVESTIGATION constitutional — no certified implementation yet)"
- "mission contracts locked 2026-05-29" → "mission contracts locked 2026-05-29, OPERATOR boundary established 2026-05-29"

### §10.3 — Terminology Lock

TERMINOLOGY_LOCK.md must be updated:
- "Persona Projection" term: 4 personas → 5 personas
- New term: "OPERATOR Persona" — engineering evidence inspection and governance audit
- Update "Persona Mission Contract" term: note OPERATOR contract added

### §10.4 — Vault Mutation Delta

| Mutation | Target | Type |
|---|---|---|
| OPERATOR mission contract addition | Mission contract document | EXTENSION — adds persona, does not modify existing |
| 4→5 persona count | Canonical state, terminology lock | UPDATE — count change |
| OPERATOR term | Terminology lock | NEW TERM |
| INVESTIGATION status | Canonical state | UPDATE — INVESTIGATION marked as constitutional, no certified implementation yet |

---

## §11 — Governance Classification

**G1 — Architecture-Mutating.** This stream:
- Introduces a new persona (OPERATOR)
- Modifies the persona model (4 → 5)
- Establishes a boundary that constrains future implementation
- Identifies vault mutations (executed separately)
- Reframes Program 2

Assessment only — no runtime code modified. Vault mutations identified but deferred to post-closure propagation.
