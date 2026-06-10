# AO-011 Consumption Validation

**Purpose:** Prove one canonical Answer Object travels the entire stack.
**Object:** AO-011 Divergence Pair
**Specimen:** BlueEdge genesis_e2e_03
**Instance:** Platform Infrastructure and Data (structural) vs Fleet Core Operations (operational)
**Date:** 2026-06-10

---

## 1. Canonical Schema

```json
{
  "ao_type": "DIVERGENCE_PAIR",
  "ao_id": "AO-011",
  "domain_a": {
    "domain": "Platform Infrastructure and Data",
    "gravity_type": "STRUCTURAL",
    "evidence": {
      "condition_count": 5,
      "peak_condition": "COMPOUND_CONVERGENCE (CRITICAL)",
      "rsig_count": 1,
      "narrative": "flow, concentration, and coupling converging — everything flows through a rigidly locked region"
    }
  },
  "domain_b": {
    "domain": "Fleet Core Operations",
    "gravity_type": "OPERATIONAL",
    "evidence": {
      "condition_count": 2,
      "peak_condition": "EXECUTION_FRAGILITY (HIGH)",
      "rsig_count": 2,
      "narrative": "structural concentration — disproportionate mass and dependency"
    }
  },
  "divergence": {
    "structural_center_has": ["mass concentration", "coupling convergence", "flow convergence"],
    "execution_center_has": ["runtime signal concentration", "event handling load", "WebSocket throughput"],
    "overlap": false,
    "mechanism": "Code gravity concentrates in Platform Infrastructure. Operational gravity concentrates in Fleet Core Operations. Investment follows structural gravity. Risk follows operational gravity."
  }
}
```

---

## 2. Generating Question Classes

| Question Class | Example Question | Altitude |
|---|---|---|
| CLARIFY | Why is Fleet Core Operations the execution center rather than Platform Infrastructure and Data? | structural |
| CLARIFY | Why do gravity centers diverge? | structural, operational |
| IMPLICATION | Which investment assumptions are invalidated by this divergence? | executive |
| IMPLICATION | Which delivery decisions are affected by having architecture in one place and operations in another? | operational |
| ASCENT | How does the board see this divergence? | structural → executive |
| CHALLENGE | What evidence would show these are actually converging? | any |

---

## 3. Required Evidence Basis

| Evidence | Source | Required? |
|---|---|---|
| `domain_concentration[0]` | crossDomainCognition | YES — identifies structural center |
| `execution_center` | crossDomainCognition (derived from RSIG concentration) | YES — identifies operational center |
| `structural_center != execution_center` | computed | YES — divergence must exist |
| Projection authority P2+ | ProjectionAuthorityKernel | YES — runtime evidence needed |
| RSIG signals per domain | signal_interpretations filtered by RSIG | YES — quantifies operational gravity |
| Domain narratives | consequence compiler output | RECOMMENDED — provides mechanism text |
| Condition inventory per domain | conditions[].affected_domains | RECOMMENDED — quantifies structural gravity |

**Without P2:** AO-011 cannot be produced. Falls back to AO-006 (Temporal Unavailability): "Execution center unknown — runtime evidence not available."

---

## 4. Consumer Behavior

### 4.1 THORR

THORR synthesizes AO-011 when a CLARIFY or IMPLICATION continuation targets gravity divergence.

**Synthesis path:**
```
operator question
  → question classification (CLARIFY on divergence)
  → evidence resolution (domain_concentration + execution_center)
  → divergence detection (structural != operational)
  → AO-011 assembly
  → altitude-calibrated answer
```

**THORR does NOT render the schema.** THORR consumes AO-011 as a structured input and produces an altitude-calibrated natural language answer. The answer shape changes per altitude, but the underlying object is the same.

**Structural altitude answer:**
> "Structural gravity concentrates in Platform Infrastructure and Data — 5 conditions, CRITICAL compound convergence, all propagation originates here. Operational gravity concentrates in Fleet Core Operations — 2 conditions but HIGH execution fragility, 2 RSIG signals confirming runtime load concentration. The divergence means architectural investment targets Platform Infrastructure while operational risk accumulates in Fleet Core Operations."

**Executive altitude answer:**
> "Where you invest and where risk concentrates are different places. Structural investment follows Platform Infrastructure. Operational risk follows Fleet Core Operations. Decisions based on code structure alone miss where operational pressure actually lands."

**THORR passes AO-011 to the answer as a structured object.** Consumers downstream can use the object directly — they don't need to re-derive it from THORR's natural language.

---

### 4.2 LENS (general)

LENS does not render AO-011 as a component. LENS consumes AO-011 as a projection modifier that affects how existing surfaces display.

**When AO-011 is active (investigation in progress):**
- Topology highlights both domains — structural center and execution center — with distinct visual markers
- The contrast between the two is the projection, not either domain alone
- Other domains recede (not hidden, but de-emphasized)

**When AO-011 is not active:**
- AO-011 does not affect LENS projection
- The divergence data exists in crossDomainCognition but is not foregrounded

---

### 4.3 BOARDROOM

**Audience:** Board of Directors. Decision horizon: governance, risk, institutional exposure.

**What AO-011 becomes:**
A governance risk disclosure. The board sees:

> **Where you invest and where risk lives are different places.**
>
> Structural investment concentrates in Platform Infrastructure and Data.
> Operational risk concentrates in Fleet Core Operations.
>
> Decisions based on architecture alone will target the wrong region.

**Projection rules:**
- No domain IDs. No condition counts. No RSIG references.
- The divergence mechanism is projected as an investment-risk misalignment.
- The board member's question: "Are we investing in the right place?" Answer: "Not necessarily."
- AO-011 provides the evidence for that answer without the board needing to understand gravity divergence.

**What the board does NOT see:**
- Condition inventories
- Signal families
- Domain-level metrics
- The word "divergence"

**What the board sees:**
- Investment target vs risk target — are they the same? No.
- Severity: the mismatch exists and is structurally confirmed.
- Implication: budget assumptions about where to invest may be incorrect.

---

### 4.4 BALANCED

**Audience:** CTO / VP Engineering / Enterprise Architect. Decision horizon: operational coordination, delivery impact.

**What AO-011 becomes:**
An operational divergence briefing. The CTO sees:

> **Structural gravity and operational gravity point at different regions.**
>
> Platform Infrastructure and Data carries the structural mass — 5 conditions, compound convergence, all propagation originates here. This is where the codebase is heaviest.
>
> Fleet Core Operations carries the operational load — runtime signal concentration, event handling pressure, WebSocket throughput. This is where execution actually happens.
>
> The divergence means: delivery coordination based on structural dependencies (import graph, coupling analysis) will miss the operational pressure that runtime evidence reveals.

**Projection rules:**
- Domain names visible. Condition counts visible. Evidence families named.
- The mechanism is projected as delivery coordination risk.
- The CTO's question: "Which coordination assumptions are wrong?" Answer: "The ones based on structural gravity alone."
- Reinforcement relationships shown: structural gravity → investment targeting; operational gravity → incident exposure.

---

### 4.5 DENSE

**Audience:** Chief Architect / Staff Engineer. Decision horizon: architectural integrity, structural dependencies.

**What AO-011 becomes:**
A structural forensic comparison. The architect sees:

> **Divergence Profile**
>
> STRUCTURAL CENTER: Platform Infrastructure and Data
> - 5 conditions (peak: COMPOUND_CONVERGENCE CRITICAL)
> - 1 RSIG signal
> - Narrative: flow, concentration, and coupling converging
>
> EXECUTION CENTER: Fleet Core Operations
> - 2 conditions (peak: EXECUTION_FRAGILITY HIGH)
> - 2 RSIG signals (ELEVATED, HIGH)
> - Narrative: structural concentration — disproportionate mass
>
> DIVERGENCE: No overlap between structural and operational concentration types.
> Structural center has: mass concentration, coupling convergence, flow convergence.
> Execution center has: runtime signal concentration, event handling load, WebSocket throughput.
>
> Mechanism: Code gravity in Platform Infrastructure. Operational gravity in Fleet Core Operations.

**Projection rules:**
- Full evidence detail. Condition types, counts, severities.
- Both gravity profiles shown side-by-side for comparison.
- The architect's question: "Why do these differ?" Answer: the full mechanism with evidence traces.
- Topology highlights both domains with divergence markers.

---

### 4.6 OPERATOR

**Audience:** Operator / Evidence Inspector. Decision horizon: evidence verification, confidence assessment.

**What AO-011 becomes:**
A verification checklist. The operator sees:

> **Divergence Verification**
>
> ☐ Structural center identification
>   Platform Infrastructure and Data — domain_concentration[0], condition_count: 5
>   Confidence: HIGH (structurally derived from import graph + enrichment)
>
> ☐ Execution center identification
>   Fleet Core Operations — execution_center from RSIG concentration
>   Confidence: ELEVATED (runtime-derived, 2 RSIG signals)
>
> ☐ Divergence confirmation
>   structural_center ≠ execution_center: CONFIRMED
>   Overlap between gravity types: NONE
>
> ☐ Evidence family agreement
>   Structural evidence: 5 conditions on Platform Infrastructure
>   Runtime evidence: 2 RSIG signals on Fleet Core Operations
>   Agreement: CONFIRMS DIVERGENCE (different domains, different evidence types, same conclusion)

**Projection rules:**
- Evidence traces visible. Source objects named.
- Confidence assessments per claim.
- The operator's question: "Is this divergence real?" Answer: verification steps with pass/fail.
- No interpretation. No implication. Pure evidence inspection.

---

### 4.7 Guide Runtime

**When AO-011 is the active investigation object:**

The Guide orients around the divergence question, not the personas visited.

```
INVESTIGATION
◆ Gravity Divergence

Why is Fleet Core Operations the execution center
rather than Platform Infrastructure and Data?

PROOF STATUS
■■□□  2/4

PROVEN
✓ Structural center confirmed (5 conditions, CRITICAL)
✓ Execution center confirmed (2 RSIG signals)

TO RESOLVE
◈ Does this compound with Execution Blindness?     DENSE
?  What would disprove this convergence?            OPERATOR

RESOLVED  INCONCLUSIVE  ✕
```

**Guide behavior:**
- The investigation question is the AO-011 generating question
- Proof steps map to AO-011's evidence requirements: structural center confirmation, execution center confirmation, compounding test, falsification test
- Steps complete when the evidence is examined, regardless of persona
- The Guide shows what's proven and what's unresolved — not which zone you're in

**When proof completes:**
- If both centers confirmed + no falsification evidence → RESOLVED. Divergence is real.
- If convergence evidence found → INCONCLUSIVE or RESOLVED with amended verdict.
- The resolved AO-011 instance persists as a confirmed cognition object.

---

### 4.8 Navigation Specs

**Continuations that naturally emerge from AO-011:**

Once AO-011 is confirmed (divergence proven), it generates second-order continuations:

| Type | Question | Target |
|---|---|---|
| IMPLICATION | Which investment decisions target the wrong region? | BALANCED — consequence themes filtered by divergence |
| ADJACENT | Does the divergence compound with Execution Blindness? | DENSE — AO-002 Compounding Verdict |
| ADJACENT | Does the divergence compound with Delivery Fragility? | DENSE — AO-002 Compounding Verdict |
| CHALLENGE | What evidence would show convergence is happening? | OPERATOR — AO-001 Falsification Statement |
| ASCENT | How does the board see this divergence? | BOARDROOM — AO-011 projected as investment-risk misalignment |
| DESCENT | Show the RSIG signals that identify the execution center | OPERATOR — runtime signal detail |

**Key property:** The continuations from AO-011 generate OTHER answer objects. IMPLICATION generates a Causal Consequence Filter. ADJACENT generates AO-002 (Compounding Verdict). CHALLENGE generates AO-001 (Falsification Statement). ASCENT generates AO-011 itself re-projected at executive altitude.

**This is the composability proof.** AO-011 doesn't exist in isolation. It connects to the rest of the ontology through continuations. Each continuation from a confirmed AO-011 either produces another canonical answer object or deepens the current one.

---

## 5. Full Stack Trace

```
EVIDENCE
  domain_concentration[0] = Platform Infrastructure and Data
  execution_center = Fleet Core Operations
  structural_center ≠ execution_center → divergence exists
  P2 authority confirmed (RSIG signals present)

     ↓

FINDING
  AF-001: Structural vs Operational Gravity Divergence
  Surface: GRAVITY_DIVERGENCE
  Severity: by implication (structural CRITICAL, operational HIGH)

     ↓

INVESTIGATION
  Question: Why is Fleet Core Operations the execution center
            rather than Platform Infrastructure and Data?
  Proof steps: confirm structural center, confirm execution center,
               test compounding, test falsification

     ↓

AO-011 DIVERGENCE PAIR
  Synthesized from evidence. Schema populated.
  Captured through AnswerObjectRuntime → matched AO-011.

     ↓

THORR
  Consumes AO-011. Produces altitude-calibrated answer.
  Passes structured object to downstream consumers.

     ↓

LENS
  BOARDROOM: investment-risk misalignment disclosure
  BALANCED: operational divergence briefing with mechanism
  DENSE: structural forensic comparison with full evidence
  OPERATOR: verification checklist with confidence assessment

     ↓

NAVIGATION
  AO-011 generates 6 continuations.
  Each continuation targets another canonical AO.
  IMPLICATION → consequence filter
  ADJACENT → AO-002 compounding verdict
  CHALLENGE → AO-001 falsification statement
  ASCENT → AO-011 re-projected at executive altitude

     ↓

GUIDE
  Tracks proof completion against AO-011's evidence requirements.
  Orients operator around divergence question, not persona.
  Resolution: divergence confirmed or convergence evidence found.
```

---

## 6. Verdict

AO-011 travels the full stack. Every consumer has a defined behavior. The schema is stable. The evidence basis is clear. The continuations compose with other canonical AOs.

The consumption model works because AO-011 is a structured object, not a rendering instruction. Each consumer decides HOW to project it. THORR produces natural language. BOARDROOM strips technical detail. OPERATOR adds verification. The object doesn't change. The projection changes.

**Answer Objects are a runtime primitive.**
