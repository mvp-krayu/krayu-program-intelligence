# Projection Constitution

**Artifact:** PI.PROJECTION.CONSTITUTION.01
**Status:** LOCKED
**Effective:** 2026-06-09
**Authority:** Derived from BOARDROOM reference state (2026-06-09), OPERATOR verification surface evolution (2026-06-09), and runtime evidence projection discovery.

---

## §1 — Constitutional Principle

**Explanation ≠ Verification.**

The same cognition object projects differently depending on cognitive purpose. Projection personas are not information density levels. They are orthogonal cognitive functions.

Runtime evidence made this explicit: "Broker dependency creates single-point coordination" is explanation. "RSIG-003 ELEVATED, 5 domains affected, governance replay confirms" is verification. Same finding. Different cognitive act.

This principle is binding on all projection surfaces.

---

## §2 — Projection Contracts

### §2.1 — BOARDROOM

**Question:** What matters?
**Purpose:** Conclude
**Verb:** Synthesize evidence into executive verdict
**Consumer:** Leadership (CEO, Board, Program Sponsor)

**Pipeline:**
```
Evidence → Cognition → Qualification → Board Conclusion
```

The board consumes the end product. They receive a position, not data.

**Shows:**
- Posture (headline conclusion)
- Material findings (consequence themes)
- Severity and blast radius
- Structural center vs execution center (dual-axis)
- Confidence (P-level as authority credit rating)
- Affected regions

**Forbidden:**
- Evidence inspection
- Signal decomposition
- Condition forensics
- Governance lifecycle detail
- Verification workflows
- Explanatory reasoning chains
- Raw domain IDs or technical identifiers

**Authority model:** P-level displayed, S-level hidden. The board sees authority rating, not construction history.

### §2.2 — DENSE

**Question:** Why is this true?
**Purpose:** Explain
**Verb:** Decompose cognition into structural and runtime reasoning
**Consumer:** Architect, Technical Leadership (CTO, VP Engineering, Enterprise Architect)

**Pipeline:**
```
Evidence → Signals → Conditions → Runtime → Propagation → Cognition → Conclusion
```

DENSE is the full reasoning chain. It teaches. It explains. It reveals. It is the closest thing to "show me the brain."

**Shows:**
- Topology with full structural detail
- Signal families with per-signal decomposition
- Condition mechanics (how conditions form from signals)
- Runtime contribution (how runtime reinforces structural findings)
- Propagation chains (how pressure moves through the system)
- Cognition surfaces with originating conditions, reinforcement, consequence widening
- Convergence and synthesis narrative

**Forbidden:**
- Executive summarization (that's BOARDROOM compression)
- Evidence validation workflows (that's OPERATOR verification)
- Falsification paths (verification concern)
- Governance audit trails (operator concern)
- "Can we trust this?" framing (verification question)

**Authority model:** Full S-level and P-level visible. The architect sees both construction history and authority state.

### §2.3 — OPERATOR

**Question:** Can this be verified?
**Purpose:** Verify
**Verb:** Validate cognition against evidence, identify confidence and falsification
**Consumer:** Analyst, Operator (DevOps Lead, QA, Security, Governance Officer)

**Pipeline:**
```
Evidence → Signals → Verification → Confidence → Falsification
```

OPERATOR does not explain why. OPERATOR proves whether. Every surface answers: what supports this, what challenges this, what would invalidate this.

**Shows:**
- Evidence chain (signals → conditions → critical → posture)
- Runtime evidence as first-class verification (RSIG parity with ISIG/DPSIG/PSIG)
- Propagation flow (origin → receiver → pressure zone)
- Governance state (S-level, transitions, replay, certification)
- Evidence lineage (hashes, derivation chain, replay status)
- For each cognition surface: supporting evidence, runtime correlation, governance status, confidence, falsification path

**Forbidden:**
- Narrative explanation (that's DENSE reasoning)
- Executive synthesis (that's BOARDROOM compression)
- "Why does this happen?" framing (explanation question)
- Consequence widening narratives (explanation concern)
- Cognition teaching (explanation concern)

**Authority model:** S-level displayed (construction history matters for verification). P-level displayed. Full qualification provenance visible.

### §2.4 — BALANCED

**Question:** What does this mean for how we operate?
**Purpose:** Narrative interpretation (governed)
**Verb:** Derive organizational meaning from structural findings through governed interpretation calls
**Consumer:** CTO, VP Engineering, Enterprise Architect — operators who accept the posture and want to understand the operational implications

**Pipeline:**
```
Evidence → Cognition → Governed Interpretation Calls → Curated Narrative
```

BALANCED is the narrative interpretation surface. It derives organizational meaning that neither the structural evidence nor its translation explicitly contains. The operator receives interpretation — not raw evidence (OPERATOR), not mechanical explanation (DENSE), not compressed verdict (BOARDROOM).

BALANCED sits next to THORR in the cognitive model, not next to BOARDROOM. Both perform interpretation. THORR does it interactively; BALANCED does it through governed contracts. The distinction:

- **Translation** = convert structural language to business language (dictionary operation)
- **Interpretation** = derive meaning that wasn't explicitly stated in the evidence (cognitive operation)

DENSE says: "Import fan asymmetry 2.04." Translation says: "Dependency risk is concentrated." Interpretation says: "Your delivery roadmap is increasingly governed by the teams maintaining infrastructure, whether feature teams realize it or not." The interpretation creates new understanding from evidence meeting operational context.

**Interpretation call model:**

Each BALANCED interpretation is a governed call with:
- Fixed intent (e.g., `interpret_board_finding`, `interpret_runtime_divergence`)
- Fixed inputs (cognition objects, evidence context, authority state)
- Fixed output schema (narrative with evidence anchors)
- Authority gating (P-level determines which interpretations are available)
- No open prompt box

Example governed calls:
- `interpret_board_finding(finding, evidence_context)` → operational meaning
- `interpret_runtime_divergence(structural_center, execution_center)` → divergence narrative
- `interpret_execution_blindness(blindness_data, runtime_signals)` → operational impact
- `interpret_governance_impact(governance_state, qualification_delta)` → governance narrative
- `interpret_structural_vs_execution_center(topology, runtime)` → dual-axis meaning

**Shows:**
- Consequence dynamics — how findings relate, reinforce, and sequence
- Operational meaning — what findings mean for the organization, not just the codebase
- Emergence patterns — which cognitive functions activated and why
- Confidence calibration — where the system is certain vs advisory
- Reinforcement relationships — how consequences amplify each other
- Curated guided queries — governed interpretation prompts, not freeform

**Forbidden:**
- Freeform operator prompts (that's THORR)
- Executive compression into verdict (that's BOARDROOM)
- Mechanical structural explanation (that's DENSE)
- Evidence validation and falsification (that's OPERATOR)
- Raw signal/condition inspection (that's OPERATOR/DENSE)
- Ungovened interpretation (every interpretation must trace to a governed call contract)

**Boundary with THORR:**

| | BALANCED | THORR |
|---|---|---|
| Prompt source | Governed call contracts | Operator freeform / guided |
| Determinism | Deterministic intent, interpretive output | Interactive, operator-driven |
| Output schema | Fixed per call type | Flexible per conversation |
| Authority | P-level gates available interpretations | P-level gates available context |
| Surface | LENS persona (embedded) | Co-Pilot interface (separate) |

BALANCED is NOT "free THORR inside LENS." BALANCED is curated THORR interpretation through governed contracts. The interpretation is real. The surface is governed.

**Authority model:** P-level determines which interpretation calls are available. S-level visible as context for interpretation (the operator understands what qualification stage produced this intelligence). Governed disclosure wrapping on all interpretive outputs per §3.4.1 of CLAUDE.md.

---

## §3 — The Density Trap

The contracts are NOT density levels:

```
WRONG:  BOARDROOM = less  →  OPERATOR = more  →  DENSE = most
RIGHT:  BOARDROOM = synthesize  |  BALANCED = interpret  |  DENSE = explain  |  OPERATOR = verify
```

If DENSE becomes "OPERATOR with more text" or OPERATOR becomes "DENSE with less text" or BALANCED becomes "THORR without the prompt box," the contracts are violated. The test: can you state what each persona FORBIDS? If you cannot, the contracts have collapsed into density.

---

## §4 — SW-INTEL Projection Matrix

SW-INTEL cognition surfaces exist in all four personas. The same surface projects differently:

| Surface | BOARDROOM | BALANCED | DENSE | OPERATOR |
|---------|-----------|----------|-------|----------|
| Execution Blindness | "Systemic fragility — invisible failure modes" | Governed interpretation: what this means operationally, which teams are affected, how blindness manifests in daily operations | Originating conditions → reinforcement chain → consequence widening → synthesis | Supporting signals + runtime correlation + governance + confidence + falsification |
| Dependency Amplification | "Concentrated dependency pressure" | Governed interpretation: why this concentration matters, operational dynamics, reinforcement patterns | How hub structure creates amplification → which domains → propagation mechanics | Evidence count + affected domains + runtime support + what would disprove |
| Gravity Divergence | "Code gravity ≠ operational gravity" | Governed interpretation: what the divergence means for operational decisions, where attention should shift | Where structural mass concentrates vs where execution load concentrates → why they diverge | Static gravity evidence vs runtime gravity evidence + confidence delta |
| Coordination Fragility | Finding card with severity | Governed interpretation: coordination breakdown dynamics, operational sequencing implications | Propagation chain → coupling corridors → coordination breakdown mechanics | Signal support + condition count + runtime choke points + governance status |

**Rule:** The same `CognitionSurfaceCard` may render in multiple personas. The projection mode — not the component — determines what sections appear.

---

## §5 — Runtime Evidence Doctrine

Runtime evidence (RSIG family) projects differently per persona:

- **BOARDROOM:** Execution center (dual-axis with structural center). Runtime is visible as a named axis, not as individual signals.
- **BALANCED:** Runtime divergence interpreted through governed calls — "execution pressure concentrates in Fleet Core Operations while structural mass sits in Platform Infrastructure, meaning operational risk and structural risk require different remediation strategies." Runtime provides the interpretive delta.
- **DENSE:** Full RSIG decomposition — signal mechanics, affected domains, consequence contribution, propagation reinforcement. Runtime explains why structural findings have operational impact.
- **OPERATOR:** RSIG as first-class evidence family alongside ISIG/DPSIG/PSIG. Severity-grouped, consequence-bridged (structural regions → conditions reinforced → if degraded). Runtime proves that structural findings have operational backing.

---

## §6 — Verification as Cognitive Function

OPERATOR introduces verification as an explicit cognitive function. Verification requires:

1. **Supports** — what evidence affirms this finding
2. **Challenges** — what evidence contradicts or limits this finding
3. **Runtime correlation** — does runtime evidence reinforce or diverge from structural evidence
4. **Governance status** — has this finding survived governed review
5. **Confidence** — how many independent evidence sources converge
6. **Falsification** — what observable condition would prove this finding wrong

Without item 6, OPERATOR is information display, not verification. Falsification is what makes OPERATOR commercially distinct from DENSE.

---

## §7 — Binding Authority

This constitution is authoritative for all projection surface rendering decisions. When a developer asks:

- "Should I explain this?" → check persona contract
- "Should I show this evidence?" → check persona forbidden list
- "Where does SW-INTEL render?" → check §4 matrix
- "How does runtime appear?" → check §5 doctrine

If the answer is ambiguous, the persona's FORBIDDEN list takes precedence over its SHOWS list. What a persona must NOT do is more important than what it CAN do.

---

## §8 — Lineage

This constitution derives from:

- BOARDROOM reference state locked 2026-06-09 (commits 2e2f07d through 8347e8f)
- OPERATOR verification surface evolution 2026-06-09 (commits bc3ab61 through 6f0e6b9)
- Runtime under-projection pattern discovery (dual-axis cognition, RSIG first-class family)
- Persona Mission Contracts (PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01) — extended, not replaced
- PI_STATE_MACHINE_CONTRACT.md (S/E/P three-axis model) — consumed, not modified

The Persona Mission Contracts (16-field model) remain authoritative for cognitive function inventory, attention control, and operator agency. This constitution governs **projection** — what each persona shows and forbids on the rendering surface.
