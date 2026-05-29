# INVESTIGATION Persona Assessment

**Stream:** PI.SOFTWARE-INTELLIGENCE.INVESTIGATION-PERSONA-ASSESSMENT.01
**Classification:** G2 — Architecture-Consuming (assessment only)
**Baseline:** 6613e9c

**Governing inputs:**
- PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01 — constitutional objective
- PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01 — compilation model
- Runtime evidence: IntelligenceField.jsx (InvestigationTraceField, lines 5956-6102; INVESTIGATION_DENSE queries, lines 3416-3513; SoftwareIntelligenceInvestigationView, lines 354-375)

---

## §1 — What Does Current INVESTIGATION Actually Do Today?

Seven concrete capabilities, verified against code:

### 1.1 — Evidence Trace (ET)

Renders a vertical provenance chain: evidence_object_hash → derivation_hash → baseline_anchor → run_id. These are trace_linkage fields from fullReport. This is **verification infrastructure** — it proves WHICH evidence the system consumed.

### 1.2 — Signal Stack (SS)

Renders signal cards from evidence_blocks: signal_label, pressure_label, pressure_tier, evidence_text, domain, propagation_role, grounding_status. Grouped by domain block. This is **evidence inspection** — it shows the raw evidence building blocks.

### 1.3 — Signal Audit (SA)

Full signal table across all 3 families (ISIG, DPSIG, PSIG): signal_id, family, name, value (4-decimal precision), severity, interpretation. ISIG detail section with concentration and confidence_note. This is **forensic inspection** — the operator sees every signal at full numeric precision.

### 1.4 — Inference Prohibition (IP)

Static governance statement + active qualifier and ALI rules applied to the current report. This is **governance boundary display** — not verification, not replay.

### 1.5 — Governance Audit (GA)

Full governance lifecycle traversal: S-level, provenance, authority ceiling, promotion eligibility, hold reason, state transitions. Proposition corpus: accepted/rejected/arbitrated/contested counts, mean confidence (4 decimal), governance friction rate, by-class and by-tier breakdowns, flagged items. This is **qualification inspection** — the operator audits the governance state machine.

### 1.6 — Forensic Topology

Clickable topology preview that opens TopologyModal in `mode="investigation"`. Full interactive topology with all overlays. This is **structural exploration** — the operator navigates topology interactively.

### 1.7 — Guided Queries (4 questions)

Four INVESTIGATION-specific interrogation questions:
1. "Which evidence chains have structural gaps?" — inspects structural_backing
2. "What is the complete evidence provenance for each propagation role?" — traverses propagation roles
3. "Where do qualification boundaries constrain evidence acceptance?" — inspects qualification posture
4. "What ungrounded claims exist across the domain registry?" — inspects grounding

These are **engineering analysis questions**, not verification assertions. The operator asks; the system derives.

### 1.8 — SW-INTEL Investigation View (STALE)

`SoftwareIntelligenceInvestigationView` renders projection adapter surfaces (CognitionSurfaceCard). This is the pre-compiler view. It shows surfaces with severity and evidence footers but does NOT show:
- Consequence objects
- Consequence derivation chains
- Combination pattern decomposition
- Ontology class assignment
- Slice maturity classifications
- Compilation trace

---

## §2 — Behavioral Classification

### What Constitutional INVESTIGATION Should Be

From the persona mission contract:

- **Constitutional objective:** Evidence qualification and governed replay
- **Primary question:** "Can this be proven?"
- **Attention model:** SYSTEM-ENFORCED SEQUENCE
- **Agency:** LOW
- **Authority projection:** PROHIBITION ENUMERATION + TERMINAL CLOSURE
- **Success:** Operator can verify every structural claim against its evidence source
- **Failure:** Evidence gaps are hidden

### What Current INVESTIGATION Actually Is

| Capability | Mission Contract Behavior | Actual Behavior | Match? |
|---|---|---|---|
| ET (Evidence Trace) | Verification — prove evidence lineage | Verification — shows hash chain | YES |
| SS (Signal Stack) | Proof — raw evidence at full depth | Inspection — shows signal cards | PARTIAL — inspection, not verification |
| SA (Signal Audit) | Proof — signal values, derivation | Inspection — full table with values | YES (close enough) |
| IP (Inference Prohibition) | Governance — boundary enforcement | Display — shows active rules | PARTIAL — display, not enforcement |
| GA (Governance Audit) | Proof — governance lifecycle audit | Inspection — shows lifecycle state | YES but exploration-oriented |
| Forensic Topology | Not in mission contract | Exploration — interactive topology | NO MATCH — this is DENSE behavior |
| Guided Queries | Fixed evidence sequence | Operator-driven questions | NO MATCH — this is operator-controlled |
| SW-INTEL View | Consequence verification | Projection adapter surfaces | STALE — wrong substrate |

### Behavioral Summary

Current INVESTIGATION behavior is **primarily inspection and exploration**, not verification and replay.

The operator:
- **Inspects** signals at numeric precision (SA)
- **Inspects** governance lifecycle state (GA)
- **Explores** topology interactively (forensic topology)
- **Asks** engineering analysis questions (guided queries)
- **Views** evidence trace hashes (ET)

The operator does NOT:
- **Verify** that a specific consequence was correctly derived from conditions
- **Replay** a compilation chain from inputs to outputs
- **Qualify** evidence against maturity contracts
- **Traverse** a fixed verification sequence (the mission contract says SYSTEM-ENFORCED SEQUENCE but the operator chooses what to look at)

---

## §3 — Is Current INVESTIGATION Already an OPERATOR Workspace?

**Yes.** The behavioral evidence is clear:

| OPERATOR Indicator | Evidence |
|---|---|
| Exploration-driven, not sequence-driven | Operator chooses what to inspect. No enforced traversal order. |
| Interactive topology | Clickable topology with modal — this is spatial exploration, not evidence verification |
| Guided queries are questions, not assertions | "Which evidence chains have structural gaps?" is an analysis question, not a proof step |
| GA is inspection, not verification | Shows lifecycle state but doesn't assert "this transition is valid" |
| Signal audit is inspection, not proof | Shows values but doesn't assert "this value correctly triggered this condition" |
| Agency is HIGH in practice | Operator controls focus, clicks topology, selects queries — despite mission contract saying LOW |

The mission contract defines INVESTIGATION with LOW agency and SYSTEM-ENFORCED SEQUENCE. The runtime implementation has HIGH agency and OPERATOR-CONTROLLED exploration. This is a behavioral mismatch.

---

## §4 — What Would Be Lost If Current INVESTIGATION Disappeared?

| Capability | Lost? | Impact |
|---|---|---|
| Evidence hash chain (ET) | YES | Only place evidence_object_hash and derivation_hash are visible |
| Signal audit at 4-decimal precision (SA) | YES | Only place raw signal values are visible |
| Governance lifecycle traversal (GA) | YES | Only place state transitions, proposition corpus, friction rate are visible |
| Inference prohibition display (IP) | YES | Only place qualifier and ALI rules are visible |
| Interactive forensic topology | NO | Available in DENSE (same TopologyModal) |
| Engineering analysis queries | PARTIALLY | Query infrastructure exists in all personas. INVESTIGATION-specific questions would be lost. |

**ET, SA, GA, and IP are unique to INVESTIGATION.** These render evidence that no other persona shows. If INVESTIGATION disappeared, the operator would lose visibility into raw evidence, governance state, and inference boundaries.

---

## §5 — Would a Fresh INVESTIGATION Look Different?

If INVESTIGATION were designed today from:
- Evidence First
- Compilation Model
- Consequence Verification
- Replay
- Qualification

It would look **substantially different.**

### What Fresh INVESTIGATION Would Do

1. **Compilation Chain Verification.** For each consequence: show the condition → consequence → combination chain. Verify that the mapping rule (§4) was correctly applied. Show which evidence was preserved and which was lost.

2. **Evidence Completeness Audit.** For each stage of the compilation chain: show what evidence exists and what is missing. Structured derivation_trace, not prose strings. Machine-verifiable, not human-readable.

3. **Combination Pattern Decomposition.** For each combination: show contributing consequences, verify trigger conditions (same locus, ≥3 types), verify escalation was correctly applied.

4. **Ontology Class Verification.** For each consequence: verify its ontology class assignment against the compilation model §6.2. Show which class it belongs to and why.

5. **Maturity Classification Audit.** For each slice/condition/consequence: show its maturity level, show what blocks promotion, show the gap to required maturity for each persona.

6. **Fixed Verification Sequence.** SYSTEM-ENFORCED: Evidence → Conditions → Consequences → Combinations → Projections. No operator choice about traversal order. Each stage must pass before the next renders.

7. **Replay.** Given inputs (fullReport), reproduce compilation output and compare to rendered state. This is verification by reproduction.

### What Fresh INVESTIGATION Would NOT Do

- Interactive topology exploration (DENSE territory)
- Engineering analysis questions (OPERATOR territory)
- Governance lifecycle browsing (OPERATOR territory — unless verifying specific transitions)
- Open-ended signal inspection without verification assertion

---

## §6 — Are OPERATOR and INVESTIGATION Now Separate Personas?

**Yes.** They serve different cognitive objectives:

| Dimension | OPERATOR | INVESTIGATION |
|---|---|---|
| **Objective** | Engineering analysis and workspace inspection | Evidence qualification and governed replay |
| **Question** | "What does the evidence show?" | "Can this be proven?" |
| **Agency** | HIGH — operator controls focus | LOW — system enforces sequence |
| **Attention** | OPERATOR-CONTROLLED — exploration | SYSTEM-ENFORCED — verification |
| **Output** | Insights, observations, analysis | PASS / FAIL per verification target |
| **Topology** | Interactive exploration | Not needed (or: verification that topology matches evidence) |
| **Governance** | Inspection — browse lifecycle state | Verification — assert transition validity |
| **Signals** | Inspection — observe values | Verification — confirm thresholds triggered conditions |

Current INVESTIGATION is functionally OPERATOR with evidence-depth rendering. It has the evidence surfaces that OPERATOR needs, but it does not perform the verification that INVESTIGATION is constitutionally required to do.

---

## §7 — Assessment Verdict

### Outcome: A — Current INVESTIGATION = OPERATOR

Current INVESTIGATION is an evidence-depth operator workspace. It inspects, explores, and analyzes. It does not verify, replay, or qualify.

### Recommendation

**Freeze and preserve current INVESTIGATION as OPERATOR.**

The evidence-depth surfaces (ET, SA, GA, IP) are valuable and unique. They should not be destroyed. But they serve operator inspection, not evidence verification.

**Create new INVESTIGATION later** — designed from the compilation model, with:
- Fixed verification sequence (SYSTEM-ENFORCED)
- Compilation chain verification (condition → consequence → combination)
- Evidence completeness audit (structured, not prose)
- Combination pattern decomposition
- Ontology class verification
- Maturity classification audit
- Replay capability

### Implications for Program 2

Program 2 (INVESTIGATION Revalidation) should NOT be "update current INVESTIGATION to consume consequence compiler output." That would add consequence awareness to an OPERATOR workspace — it wouldn't create INVESTIGATION.

Program 2 should instead be reframed as:
1. Recognize current INVESTIGATION as OPERATOR
2. Design true INVESTIGATION from the compilation model
3. Preserve OPERATOR evidence surfaces
4. Build INVESTIGATION as a new verification layer

### What This Means for the 4-Persona Model

If OPERATOR and INVESTIGATION are separated, the system may evolve to 5 personas:

| Persona | Question | Mode |
|---|---|---|
| BOARDROOM | What matters? | Compiled projection |
| BALANCED | Why operationally? | Consequence briefing |
| DENSE | How structurally? | Topology interrogation |
| OPERATOR | What does the evidence show? | Engineering analysis |
| INVESTIGATION | Can this be proven? | Governed verification |

This is a **G1 architectural decision** that goes beyond this assessment. This assessment identifies the split. Whether to act on it is a governance decision.

---

## §8 — Non-Goals

This assessment does NOT:
- Propose implementation
- Modify persona behavior
- Change routes or UI
- Authorize a new persona
- Modify the mission contract
- Execute Program 2

---

## §9 — Closure Verdict

**VERDICT A — CURRENT INVESTIGATION = OPERATOR**

Recommendation: Freeze and preserve. Create new INVESTIGATION later. Reframe Program 2.
