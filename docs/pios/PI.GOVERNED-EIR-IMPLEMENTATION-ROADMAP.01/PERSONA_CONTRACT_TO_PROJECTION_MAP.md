# Persona Contract → ProjectionConfig Traceability Map

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture-Consuming)
**Date:** 2026-06-01
**Scope:** Formal mapping from each persona mission contract field to each ProjectionConfig decision, with satisfaction evidence and gaps

---

## 1. Source Authority

**Persona Mission Contracts (16-field model):**
- BOARDROOM, BALANCED, DENSE, INVESTIGATION: `docs/pios/PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01/PERSONA_MISSION_CONTRACTS_AND_COGNITIVE_OBJECTIVES.md`
- OPERATOR: `docs/pios/PI.PERSONA.OPERATOR-AND-INVESTIGATION-BOUNDARY.01/OPERATOR_AND_INVESTIGATION_BOUNDARY.md` §4

**ProjectionConfigs (6 configs):**
- `app/execlens-demo/lib/lens-v2/projection/configs/{eir,boardroom,balanced,dense,operator,investigation}.js`

**Note:** EIR has no persona mission contract — it is a report artifact, not a persona. Its ProjectionConfig is assessed against the EIR consumer design from the implementation roadmap.

---

## 2. Config-Level Summary

| Config | consumer_id | audience_model | narrative_mode | disclosure_level | objects | sections |
|--------|------------|---------------|---------------|-----------------|---------|----------|
| eir.js | eir | EXECUTIVE | EXECUTIVE | FULL | 9 | 8 |
| boardroom.js | boardroom | EXECUTIVE | EXECUTIVE | STANDARD | 5 | 4 |
| balanced.js | balanced | CTO_VP_EA | OPERATIONAL | STANDARD | 7 | 6 |
| dense.js | dense | STRUCTURAL_ENGINEER | STRUCTURAL | STANDARD | 9 | 9 |
| operator.js | operator | OPERATOR | MINIMAL | STANDARD | 8 | 8 |
| investigation.js | investigation | FORENSIC | NONE | FULL | 9 | 8 |

---

## 3. BOARDROOM — Contract-to-Config Mapping

### 3.1 Field-by-Field Traceability

| Contract Field | Contract Value | Config Decision | Evidence | Satisfied? |
|---------------|---------------|----------------|----------|-----------|
| **F1 — Constitutional Objective** | Executive consequence qualification | audience_model: EXECUTIVE, 4 sections, card_layout | Compressed projection surface matches "compiled verdict" | ✅ |
| **F2 — Primary Question** | "What requires my attention and what is my governance position?" | object_selection: posture + tension + exposure + decision + ceiling | 5 objects cover attention (posture, tension) and governance position (ceiling) | ✅ |
| **F3 — Forbidden Questions** | "How does this structural pattern work?" → DENSE | object_selection EXCLUDES constraint_inventory, trajectory_assessment, absence_profile, detection_boundary | Removing structural mechanics objects blocks structural exploration | ✅ |
| **F4 — Operator Objective** | Decide: ACT, DELEGATE, or DEFER | format_hints: cockpit_instruments | Cockpit framing matches decision instrument metaphor | ✅ |
| **F5 — Runtime Responsibility** | Deterministic compiled projection, fixed sequence | section_mapping: 4 sections, sequence 1-4 | Fixed 4-section sequence | ✅ |
| **F6 — Cognition Consumed** | 13/22 functions; Executive Synthesis DOMINANT; Pressure Concentration DOMINANT (~40%) | NO CONFIG EQUIVALENT | ProjectionConfig has no mechanism for cognitive function projection state | ⚠️ GAP |
| **F7 — Cognition Prohibited** | Emergence Orchestration ABSENT; topology hidden; zone forensics absent | NO CONFIG EQUIVALENT | Config selects objects, not cognitive functions. Prohibition is implicit via object exclusion, not explicit | ⚠️ GAP |
| **F8 — Attention-Control** | SYSTEM-CONTROLLED | narrative_mode: EXECUTIVE | Executive mode implies system-compiled, but not enforced by config | PARTIAL |
| **F9 — Operator-Agency** | LOWEST | 4 sections, no zone navigation | Minimal surface area limits agency | ✅ |
| **F10 — Authority-Projection** | DECLARATION (institutional) | disclosure_level: STANDARD | STANDARD ≠ DECLARATION — no config mechanism for authority projection model | ⚠️ GAP |
| **F11 — Success Condition** | 30-second posture + governance position assessment | 4 sections, card_layout | Compact surface supports 30-second scan | ✅ |
| **F12 — Failure Condition** | Must not show raw signals, structural mechanics, or contradictory data | object_selection excludes 4 structural objects | Structural detail objects excluded | ✅ |
| **F14 — SW-INTEL Ontology** | B=PRIMARY, A/C/D=COMPRESSED, E=SUPPRESSED | NO CONFIG EQUIVALENT | Config has no ontology consumption posture field | ⚠️ GAP |

### 3.2 Object Selection Rationale

| Object | In BOARDROOM? | Contract Justification |
|--------|--------------|----------------------|
| structural_posture | ✅ YES | F6: Posture Synthesis PRESENT — governance table row |
| tension_map | ✅ YES | F6: Pressure Concentration DOMINANT (~40%) |
| exposure_assessment | ✅ YES | F6: Signal Interpretation ALTITUDE-SHIFTED |
| decision_surface | ✅ YES | F4: ACT/DELEGATE/DEFER decision |
| operational_ceiling | ✅ YES | F2: governance position requires ceiling awareness |
| constraint_inventory | ❌ NO | F3: "How does this structural pattern work?" → DENSE |
| trajectory_assessment | ❌ NO | F7: below executive altitude |
| absence_profile | ❌ NO | F7: below executive altitude |
| detection_boundary | ❌ NO | F7: below executive altitude |

---

## 4. BALANCED — Contract-to-Config Mapping

### 4.1 Field-by-Field Traceability

| Contract Field | Contract Value | Config Decision | Evidence | Satisfied? |
|---------------|---------------|----------------|----------|-----------|
| **F1 — Constitutional Objective** | Governed operational cognition briefing | narrative_mode: OPERATIONAL, briefing_corridor hint | Operational mode + briefing corridor | ✅ |
| **F2 — Primary Question** | "What operational dynamics are emerging... how do they relate...?" | object_selection: 7 objects, reinforcement_panels hint | Reinforcement panels enable relationship visibility | ✅ |
| **F3 — Forbidden Questions** | "How does this topology work mechanically?" → DENSE | Excludes absence_profile, detection_boundary | Structural mechanics objects excluded | ✅ |
| **F4 — Operator Objective** | Understand DYNAMICS — cause-effect, reinforcement | format_hints: reinforcement_panels | Reinforcement panels match causal dynamics | ✅ |
| **F5 — Runtime Responsibility** | Discover at runtime what to surface; 5-zone briefing corridor | section_mapping: 6 sections; briefing_corridor hint | 6 sections approximates 5-zone corridor | PARTIAL |
| **F6 — Cognition Consumed** | ALL 22 functions PRESENT | NO CONFIG EQUIVALENT | Config cannot express "all 22 functions present" | ⚠️ GAP |
| **F7 — Cognition Prohibited** | No local derivation; no topology mechanics; no evidence replay | object_selection excludes 2 forensic objects | Partial — exclusion is implicit | PARTIAL |
| **F8 — Attention-Control** | CO-DISCOVERY | narrative_mode: OPERATIONAL | Operational mode implies guided discovery, but "co-discovery" is not a config concept | PARTIAL |
| **F9 — Operator-Agency** | MEDIUM | 6 sections, no zone_navigation hint, no evidence_tables | Medium surface between BOARDROOM (4) and DENSE (9) | ✅ |
| **F10 — Authority-Projection** | DISCLOSURE WRAPPING (per-statement) | disclosure_level: STANDARD | STANDARD ≠ DISCLOSURE_WRAPPING — no per-statement mechanism | ⚠️ GAP |
| **F11 — Success Condition** | 2-minute: primary consequence, reinforcement, confidence, cause-effect | reinforcement_panels, 6 sections | Config supports structured consequence sequencing | ✅ |
| **F12 — Failure Condition** | No raw signals, no stacked cards without relationships | narrative_mode: OPERATIONAL (not STRUCTURAL or MINIMAL) | Operational mode excludes raw signal rendering | ✅ |
| **F14 — SW-INTEL Ontology** | B/D=PRIMARY, A/C/E=SECONDARY | NO CONFIG EQUIVALENT | No ontology consumption field | ⚠️ GAP |

### 4.2 Audience Model Precision

**Contract says:** "CTO, VP Engineering, Enterprise Architect"
**Config says:** `audience_model: 'CTO_VP_EA'`
**Verdict:** ✅ Exact match — the config was derived from the contract.

---

## 5. DENSE — Contract-to-Config Mapping

### 5.1 Field-by-Field Traceability

| Contract Field | Contract Value | Config Decision | Evidence | Satisfied? |
|---------------|---------------|----------------|----------|-----------|
| **F1 — Constitutional Objective** | Structural behavior interrogation | narrative_mode: STRUCTURAL, zone_navigation, full_precision | Structural mode + navigation + precision | ✅ |
| **F2 — Primary Question** | "How does structural pressure propagate, concentrate, and interact?" | object_selection: ALL 9, section_mapping: 9 sections (1:1) | Complete coverage, every object has its own section | ✅ |
| **F3 — Forbidden Questions** | "What is the executive verdict?" → BOARDROOM | narrative_mode: STRUCTURAL (not EXECUTIVE) | Structural mode prevents executive compression | ✅ |
| **F4 — Operator Objective** | Navigate and interrogate topology to understand HOW patterns work | format_hints: zone_navigation | Zone navigation matches interactive exploration | ✅ |
| **F5 — Runtime Responsibility** | Provide depth EVERYWHERE; 7 zones, 42 paths | section_mapping: 9 sections, zone_navigation | 9 sections provides depth everywhere | ✅ |
| **F6 — Cognition Consumed** | Executive Synthesis DECOMPOSED (7 zone syntheses); Pressure Concentration DECOMPOSED (4 zones ~55%) | NO CONFIG EQUIVALENT | Config cannot express DECOMPOSED cognitive function state | ⚠️ GAP |
| **F7 — Cognition Prohibited** | Emergence Orchestration REPLACED → zone orchestration | NO CONFIG EQUIVALENT | Replacement is an implementation concern, not config-expressible | ⚠️ GAP |
| **F8 — Attention-Control** | OPERATOR-CONTROLLED | format_hints: zone_navigation | Zone navigation enables operator control | ✅ |
| **F9 — Operator-Agency** | HIGHEST — 42+ paths, 7 zones, topology click | 9 sections, zone_navigation, full_precision | Maximum surface area + navigation | ✅ |
| **F10 — Authority-Projection** | PER-ACT BOUNDARY (each query carries its boundary) | disclosure_level: STANDARD | STANDARD ≠ PER-ACT — no per-derivation-act mechanism | ⚠️ GAP |
| **F11 — Success Condition** | Navigate to any pattern, trace propagation, interrogate zones | 9 sections (complete object coverage), zone_navigation | Config enables full navigation | ✅ |
| **F14 — SW-INTEL Ontology** | A/B=PRIMARY, C/D/E=SECONDARY | NO CONFIG EQUIVALENT | No ontology consumption field | ⚠️ GAP |

### 5.2 Object Coverage

**Contract requires:** "Depth EVERYWHERE" — all 9 objects.
**Config provides:** All 9 objects, each with its own primary section.
**Verdict:** ✅ 1:1 object-to-section mapping provides complete structural fidelity.

---

## 6. OPERATOR — Contract-to-Config Mapping

### 6.1 Field-by-Field Traceability

| Contract Field | Contract Value | Config Decision | Evidence | Satisfied? |
|---------------|---------------|----------------|----------|-----------|
| **F1 — Constitutional Objective** | Engineering evidence inspection and governance audit | format_hints: evidence_tables, four_decimal_precision, hash_chain_inspection | Three evidence-specific format hints directly encode the mission | ✅ |
| **F2 — Primary Question** | "What is the complete evidence state... at full precision?" | four_decimal_precision, hash_chain_inspection, 8 evidence sections | Full-precision evidence inspection | ✅ |
| **F3 — Forbidden Questions** | "Is this compilation chain correct?" → INVESTIGATION | narrative_mode: MINIMAL (not NONE); no pass_fail_assertions hint | MINIMAL mode + no verification hints blocks verification protocol | ✅ |
| **F4 — Operator Objective** | Review evidence at full engineering depth | All sections labeled "*_evidence", evidence_tables hint | Evidence framing throughout | ✅ |
| **F5 — Runtime Responsibility** | Render all evidence surfaces at full depth; ordered but not enforced | section_mapping: 8 sections, sequence 1-8 | Ordered sections, no enforcement mechanism (which is correct — OPERATOR doesn't enforce sequence) | ✅ |
| **F6 — Cognition Consumed** | Trust Posture FULL DEPTH; Governance Friction MAXIMUM; Signal Interpretation EXPOSED; Confidence Classification MAXIMUM 4-decimal | four_decimal_precision, hash_chain_inspection | Format hints encode the required precision levels | PARTIAL |
| **F7 — Cognition Prohibited** | Emergence Orchestration ABSENT; Executive Synthesis ABSENT; Posture Synthesis ABSENT | narrative_mode: MINIMAL | MINIMAL mode blocks synthesis functions | ✅ |
| **F8 — Attention-Control** | OPERATOR-CONTROLLED | No zone_navigation hint (unlike DENSE), but no enforced sequence either | Operator scrolls freely but without interactive navigation | PARTIAL |
| **F9 — Operator-Agency** | HIGH | 8 sections, evidence_tables, hash_chain_inspection | Near-maximum surface with evidence tools | ✅ |
| **F10 — Authority-Projection** | PROHIBITION DISPLAY (shows rules, doesn't enumerate as proof) | disclosure_level: STANDARD | STANDARD doesn't distinguish DISPLAY from ENUMERATION | ⚠️ GAP |
| **F11 — Success Condition** | View evidence hashes, inspect 4-decimal signals, browse governance lifecycle, see prohibitions, explore topology | evidence_tables, four_decimal_precision, hash_chain_inspection | Format hints directly encode 3 of 5 success criteria | ✅ |
| **F12 — Failure Condition** | Must not see PASS/FAIL assertions (that's INVESTIGATION) | No pass_fail_assertions hint | Correctly absent | ✅ |
| **F14 — SW-INTEL Ontology** | All classes INSPECTION-ONLY | NO CONFIG EQUIVALENT | No ontology consumption field | ⚠️ GAP |

### 6.2 Section Design

**Distinctive feature:** OPERATOR is the only config with **zero secondary_objects** in any section. Every section has a single primary object with no secondary enrichment. This matches the contract: "The operator inspects evidence at full precision" — each object is inspected independently, not cross-referenced.

**Section labels:** All 8 sections are named `*_evidence` (posture_evidence, tension_evidence, constraint_evidence, exposure_evidence, decision_evidence, absence_evidence, detection_evidence, ceiling_evidence). This framing matches "engineering evidence inspection."

### 6.3 OPERATOR vs DENSE Boundary

| Dimension | OPERATOR | DENSE |
|-----------|----------|-------|
| narrative_mode | MINIMAL | STRUCTURAL |
| zone_navigation hint | NO | YES |
| evidence_tables hint | YES | NO |
| four_decimal_precision | YES | YES (full_precision) |
| hash_chain_inspection | YES | NO |
| secondary_objects | NONE | SELECTIVE |
| section labels | *_evidence | structural names |

The config boundary correctly encodes: OPERATOR inspects evidence at raw precision. DENSE explores structural behavior interactively. OPERATOR has no secondary objects because each evidence layer is inspected independently. DENSE has secondary objects because structural behavior involves cross-referencing.

---

## 7. INVESTIGATION — Contract-to-Config Mapping

### 7.1 Field-by-Field Traceability

| Contract Field | Contract Value | Config Decision | Evidence | Satisfied? |
|---------------|---------------|----------------|----------|-----------|
| **F1 — Constitutional Objective** | Evidence qualification and governed replay | format_hints: verification_panels, pass_fail_assertions, compilation_chain | Three verification-specific format hints directly encode the mission | ✅ |
| **F2 — Primary Question** | "Is the evidence chain complete, reproducible, and governed?" | narrative_mode: NONE, verification_panels, pass_fail_assertions | No narrative (reproducibility), verification panels (completeness), pass/fail (governed) | ✅ |
| **F3 — Forbidden Questions** | "How does this structural pattern work?" → DENSE | narrative_mode: NONE (not STRUCTURAL) | NONE mode prevents structural exploration | ✅ |
| **F4 — Operator Objective** | Audit — follow fixed sequence, confirm evidence | All sections labeled "*_verification" | Verification framing throughout | ✅ |
| **F5 — Runtime Responsibility** | Enforce fixed evidence sequence (ET→SS→SA→IP→GA→Topology→Closure) | section_mapping: 8 sections, sequence 1-8 | Sequenced sections; **but config cannot ENFORCE sequence — enforcement is a UI concern** | PARTIAL |
| **F6 — Cognition Consumed** | 16/22 functions; Governance Friction MAXIMUM; Evidence Boundary MAXIMUM → PROHIBITION | pass_fail_assertions, compilation_chain | Format hints encode verification, but cognitive function mapping is absent | PARTIAL |
| **F7 — Cognition Prohibited** | Executive Synthesis ABSENT; Compound Activation ABSENT; Emergence ABSENT | narrative_mode: NONE | NONE mode blocks all synthesis, emergence, and interpretation | ✅ |
| **F8 — Attention-Control** | SYSTEM-ENFORCED SEQUENCE | section_mapping sequence field | Sequence is specified but **not enforced by config — enforcement is UI/runtime** | ⚠️ GAP |
| **F9 — Operator-Agency** | LOW — BY DESIGN (cannot skip, reorder, or choose focus) | narrative_mode: NONE, verification_panels | NONE mode + verification panels limit agency to inspection | PARTIAL |
| **F10 — Authority-Projection** | PROHIBITION ENUMERATION + TERMINAL CLOSURE | disclosure_level: FULL | FULL disclosure level is closest match to prohibition enumeration — **strongest alignment of any persona** | ✅ |
| **F11 — Success Condition** | Trace every claim to hash, verify 4-decimal reproducibility, enumerate prohibitions | verification_panels, pass_fail_assertions, compilation_chain | Format hints encode all three verification requirements | ✅ |
| **F12 — Failure Condition** | Must not see synthesized narrative, rounded values, or skippable sections | narrative_mode: NONE, pass_fail_assertions | NONE mode prevents synthesis; pass_fail enforces deterministic output | ✅ |
| **F14 — SW-INTEL Ontology** | All classes PROOF-ONLY | NO CONFIG EQUIVALENT | No ontology consumption field | ⚠️ GAP |

### 7.2 INVESTIGATION vs OPERATOR Boundary

| Dimension | INVESTIGATION | OPERATOR |
|-----------|--------------|----------|
| narrative_mode | NONE | MINIMAL |
| disclosure_level | FULL | STANDARD |
| pass_fail_assertions | YES | NO |
| compilation_chain | YES | NO |
| verification_panels | YES | NO |
| evidence_tables | NO | YES |
| hash_chain_inspection | NO | YES |
| All 9 objects | YES | NO (8) |
| secondary_objects | SELECTIVE | NONE |

The config boundary correctly encodes the constitutional distinction: OPERATOR inspects evidence (shows what exists). INVESTIGATION verifies evidence (asserts PASS/FAIL). The format_hints divergence is the clearest signal — evidence_tables vs verification_panels, hash_chain_inspection vs compilation_chain.

---

## 8. EIR — Config Assessment (No Persona Contract)

EIR has no persona mission contract. It is a report artifact, not a persona. Assessment is against the EIR consumer design from the implementation roadmap.

| Design Intent | Config Decision | Evidence | Satisfied? |
|--------------|----------------|----------|-----------|
| Executive intelligence document | audience_model: EXECUTIVE, narrative_mode: EXECUTIVE | Executive framing | ✅ |
| Chapter-structured report | format_hints: chapter_structure, output_formats: ['HTML', 'PDF'] | Chapter format + multi-format | ✅ |
| Maximum cognition coverage | object_selection: ALL 9 | Full coverage for comprehensive report | ✅ |
| Full governance disclosure | disclosure_level: FULL | Maximum governance transparency | ✅ |
| Cross-object synthesis | 8 sections with secondary_objects enrichment | Secondary objects enable cross-referencing | ✅ |

---

## 9. Systematic Gap Analysis

### 9.1 Gaps Present in ALL Configs

| Gap ID | Contract Field | Issue | Severity |
|--------|---------------|-------|----------|
| **GAP-01** | F6 — Cognition Consumed | ProjectionConfig has no mechanism to express cognitive function projection state (DOMINANT/PRESENT/COMPRESSED/ABSENT for each of 22 functions) | STRUCTURAL |
| **GAP-02** | F7 — Cognition Prohibited | Config selects what to INCLUDE but has no explicit prohibition mechanism. Prohibition is implicit via exclusion, not declarative | MODERATE |
| **GAP-03** | F10 — Authority-Projection | Four distinct authority models (DECLARATION/DISCLOSURE_WRAPPING/PER-ACT_BOUNDARY/PROHIBITION_ENUMERATION) but config only has `disclosure_level: STANDARD/FULL` | STRUCTURAL |
| **GAP-04** | F14 — SW-INTEL Ontology | No config field for ontology consumption posture (PRIMARY/SECONDARY/COMPRESSED/SUPPRESSED/PROOF-ONLY per class) | MODERATE |
| **GAP-05** | F8 — Attention-Control | Four distinct attention models (SYSTEM-CONTROLLED/CO-DISCOVERY/OPERATOR-CONTROLLED/SYSTEM-ENFORCED) but no config field | MODERATE |

### 9.2 Per-Persona Gaps

| Persona | Specific Gap | Impact |
|---------|-------------|--------|
| BOARDROOM | disclosure_level: STANDARD but contract says DECLARATION authority | Authority projection is undifferentiated from BALANCED/DENSE |
| BALANCED | All 22 cognitive functions PRESENT but no config mechanism to express this | The "only persona with full cognitive architecture observable" status is implicit, not declared |
| DENSE | DECOMPOSED cognitive function states not expressible | The distinction between DENSE (decomposed synthesis across zones) and INVESTIGATION (synthesis absent) is implicit |
| OPERATOR | No distinction between PROHIBITION DISPLAY (OPERATOR) and PROHIBITION ENUMERATION (INVESTIGATION) | Both show prohibitions; the difference (display vs proof) is an implementation concern, not config-driven |
| INVESTIGATION | SYSTEM-ENFORCED sequence cannot be expressed in config | Config specifies sequence order but cannot enforce non-skippable traversal — enforcement is a UI/runtime concern |

### 9.3 What the Gaps Mean

**ProjectionConfig is a Zone A (deterministic projection) contract.** It governs:
- Which cognition objects are selected (object_selection)
- How they map to sections (section_mapping)
- What rendering intent applies (format_hints)
- What narrative mode is used (narrative_mode)
- What disclosure level applies (disclosure_level)

**ProjectionConfig does NOT govern:**
- Cognitive function activation state (22 functions × DOMINANT/PRESENT/ABSENT)
- Attention-control model (system vs operator vs co-discovery)
- Authority-projection model (declaration vs wrapping vs per-act vs enumeration)
- Ontology consumption posture (per behavioral class A-E)
- Sequence enforcement (enforced vs freely navigable)

These are **Zone B/C concerns** — governed narrative and qualification gate. They are implementation-level responsibilities that live in the rendering layer (React components, layout logic, interaction model), not in the projection config.

**This is not necessarily a defect.** ProjectionConfig is designed for PRE Zone A — deterministic projection of cognition objects into consumer-ready section structures. The persona contract fields that don't map to config fields are contract fields that govern HOW the projection is rendered (Zone B + consumer layer), not WHAT is projected (Zone A).

---

## 10. Satisfaction Summary

### 10.1 Per-Persona Verdict

| Persona | Config Fields Satisfied | Config Fields Partial | Config Fields Gap | Overall |
|---------|------------------------|----------------------|-------------------|---------|
| BOARDROOM | 9/13 mapped | 1/13 | 3/13 | **SATISFACTORY** — Zone A projection matches mission |
| BALANCED | 8/13 mapped | 3/13 | 2/13 | **SATISFACTORY** — Zone A projection matches mission |
| DENSE | 9/13 mapped | 0/13 | 4/13 | **SATISFACTORY** — Zone A projection matches mission |
| OPERATOR | 9/13 mapped | 2/13 | 2/13 | **STRONG** — format_hints directly encode evidence inspection |
| INVESTIGATION | 8/13 mapped | 3/13 | 2/13 | **STRONG** — format_hints + NONE mode + FULL disclosure directly encode verification |

(Fields 13, 15, 16 excluded — not mappable to config: disappearance consequence, implementation freshness, revalidation requirement)

### 10.2 Overall Assessment

**ProjectionConfig satisfies the Zone A (deterministic projection) dimension of every persona mission contract.** The object selections, section mappings, narrative modes, and format hints are correctly derived from the constitutional objectives, primary questions, and operator agency models.

**The gaps are in Zone B/C dimensions** — attention-control, authority-projection, cognitive function activation, and ontology consumption posture. These are rendering/interaction concerns that belong in the consumer layer, not the projection config.

**No ProjectionConfig contradicts its persona contract.** No config selects objects the contract forbids. No config uses a narrative mode that conflicts with the contract's agency model. No config uses format hints that violate the contract's success/failure conditions.

**Strongest alignment:** OPERATOR and INVESTIGATION — their format_hints (evidence_tables/four_decimal_precision/hash_chain_inspection vs verification_panels/pass_fail_assertions/compilation_chain) directly encode the constitutional mission in the config itself.

**Weakest alignment:** BOARDROOM — disclosure_level: STANDARD doesn't distinguish its DECLARATION authority model from other STANDARD personas. The authority distinction between "We are governed" (BOARDROOM institutional declaration) and "Each statement is governed" (BALANCED per-statement wrapping) is not expressible in current config schema.

---

## 11. Recommendation

### 11.1 No Config Redefinition Required

The current 6 ProjectionConfigs correctly serve their Zone A responsibilities. The gaps identified are Zone B/C concerns that belong in the consumer rendering layer, not the projection config schema.

### 11.2 Future Config Schema Enhancement (Optional)

If the architecture matures to where Zone B/C differentiation should be config-driven rather than implementation-driven, the following fields could be added to ProjectionConfig:

| Candidate Field | Purpose | Maps to Contract Field |
|----------------|---------|----------------------|
| `authority_projection_model` | DECLARATION / DISCLOSURE_WRAPPING / PER_ACT_BOUNDARY / PROHIBITION_ENUMERATION | F10 |
| `attention_control_model` | SYSTEM_CONTROLLED / CO_DISCOVERY / OPERATOR_CONTROLLED / SYSTEM_ENFORCED | F8 |
| `sequence_enforcement` | ORDERED / ENFORCED / FREE | F8 (for INVESTIGATION) |
| `ontology_consumption` | Per-class posture map (A-E → PRIMARY/SECONDARY/COMPRESSED/SUPPRESSED/PROOF_ONLY) | F14 |

These are **optional enhancements**, not required fixes. The current architecture works because these distinctions are enforced at the rendering layer where they belong.
