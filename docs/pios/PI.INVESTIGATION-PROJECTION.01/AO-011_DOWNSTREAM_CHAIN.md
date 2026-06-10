# AO-011 Downstream Chain Analysis

**Question:** Is AO-011 terminal or intermediate?
**Answer:** Intermediate. AO-011 is never the end of an investigation. It is the structural fact that generates decision-relevant implications.

---

## The Structural Fact

AO-011 says: "Structural gravity concentrates in Platform Infrastructure and Data. Operational gravity concentrates in Fleet Core Operations. They don't overlap."

No one acts on this. It's a measurement. The board doesn't say "fix the divergence." The CTO doesn't say "reduce the divergence." They say:

- "Are we investing in the right place?"
- "What are we not monitoring?"
- "Is our modernization sequence wrong?"
- "What should the board worry about?"

Each of these is a different downstream Answer Object.

---

## Downstream Chains

### Chain 1: AO-011 → AO-020 Investment Exposure Area

```
AO-011: structural center ≠ execution center
    ↓
Investment follows structural gravity → targets Platform Infrastructure and Data
Operational risk follows operational gravity → accumulates in Fleet Core Operations
    ↓
AO-020: Investment Exposure Area
  investment: "Platform modernization budget"
  assumption: "structural mass predicts operational risk"
  exposure: "budget targets the structurally heavy region while operationally critical region degrades"
  trigger: "divergence between structural and operational gravity"
  confidence: HIGH (confirmed by independent evidence families)
```

**Generating question:** "Which budget assumptions fail because of this divergence?"
**Audience:** Board, CFO, transformation sponsor.
**Decision it serves:** Budget reallocation. Do we shift investment from where code lives to where risk lives?

### Chain 2: AO-011 → AO-015 Transformation Constraint

```
AO-011: structural center ≠ execution center
    ↓
Modernization sequence based on structural gravity: address Platform Infrastructure first (heaviest)
But: Fleet Core Operations has EXECUTION_FRAGILITY, RUNTIME_DEPENDENCY_CHOKE_POINT, PROPAGATION_ASYMMETRY
These are conditions the structural center does NOT have.
    ↓
AO-015: Transformation Constraint
  constraint: "Modernization of Platform Infrastructure requires stabilizing Fleet Core Operations first"
  blocking_dependencies: [EXECUTION_FRAGILITY, RUNTIME_DEPENDENCY_CHOKE_POINT]
  required_preconditions: ["runtime pressure reduction in Fleet Core Operations"]
  violated_assumption: "investment sequencing based on structural mass"
  program_risk: HIGH
```

**Generating question:** "What sequencing error becomes likely?"
**Audience:** CTO, transformation lead, program office.
**Decision it serves:** Sequencing. Do we modernize the big thing first or the fragile thing first?

### Chain 3: AO-011 → AO-016 Governance Exposure Surface

```
AO-011: structural center ≠ execution center
    ↓
Board confidence based on structural qualification (S2, 85 propositions, replay-certified)
But: qualification measured structural reality, not operational reality
Execution center has conditions (EXECUTION_FRAGILITY, CHOKE_POINT) invisible to structural qualification
    ↓
AO-016: Governance Exposure Surface
  decision: "Platform modernization investment confidence"
  hidden_assumption: "structural qualification reflects operational risk"
  evidence_gap: "execution center conditions not covered by structural qualification"
  organizational_consequence: "board may approve investment based on incomplete risk picture"
```

**Generating question:** "Which governance decisions are exposed?"
**Audience:** Board, risk committee, enterprise architect.
**Decision it serves:** Governance confidence. Should the board trust the current qualification for this decision?

### Chain 4: AO-011 → AO-003 Failure Impact Map

```
AO-011: execution center = Fleet Core Operations
    ↓
Fleet Core Operations has:
  - EXECUTION_FRAGILITY (HIGH)
  - RUNTIME_DEPENDENCY_CHOKE_POINT (HIGH)
  - 2 RSIG signals (ELEVATED + HIGH)
    ↓
AO-003: Failure Impact Map
  trigger: "Fleet Core Operations degradation"
  trigger_type: DOMAIN
  capabilities_lost: [event coordination, real-time streaming, WebSocket broadcast]
  domains_affected: 4+ downstream
  has_fallback: false
  severity_if_triggered: CRITICAL
```

**Generating question:** "What breaks if the execution center fails?"
**Audience:** CTO, SRE lead, incident response.
**Decision it serves:** Resilience. What redundancy does the execution center need?

### Chain 5: AO-011 → AO-002 Compounding Verdict

```
AO-011: divergence exists
    ↓
Does the divergence compound with Execution Blindness?
Fleet Core Operations appears in BOTH Gravity Divergence and Execution Blindness
    ↓
AO-002: Compounding Verdict
  finding_a: GRAVITY_DIVERGENCE
  finding_b: EXECUTION_BLINDNESS
  compounds: true
  bridge_domains: [Fleet Core Operations, Telemetry Transport and Messaging]
  mechanism: "operational gravity concentrates in a region that is also blind to runtime dependencies"
  compound_severity: CRITICAL
```

**Generating question:** "Does this compound with other findings?"
**Audience:** Architect, CTO.
**Decision it serves:** Priority. Is this an isolated finding or a compounding systemic risk?

---

## The Chain Topology

```
                          AO-020 Investment Exposure
                         ╱
                        ╱
AO-011 Divergence Pair ─── AO-015 Transformation Constraint
                        ╲
                         ╲ AO-016 Governance Exposure
                          ╲
                           ╲ AO-003 Failure Impact Map
                            ╲
                             AO-002 Compounding Verdict
```

AO-011 generates 5 downstream objects. Each answers a different decision. None of them are the same question.

---

## What This Means for Projection

### Should LENS project AO-011 directly?

**In DENSE and OPERATOR: yes.** The architect and investigator need to see the divergence itself — the structural fact, the two gravity profiles, the evidence. AO-011 is the thing they're verifying.

**In BOARDROOM and BALANCED: no.** The board and CTO don't need to see the divergence. They need to see what it MEANS:

| Persona | Projects | Not AO-011, but: |
|---|---|---|
| BOARDROOM | AO-020 | "You may be investing in the wrong place" |
| BALANCED | AO-015 | "Your modernization sequence may be wrong" |
| DENSE | AO-011 | The divergence itself — full evidence |
| OPERATOR | AO-011 | The divergence verification — evidence chains |

### The projection rule

AO-011 is projected directly at structural/forensic altitudes (DENSE, OPERATOR).
AO-011 is projected through its implications at executive altitudes (BOARDROOM, BALANCED).

The investigation starts from AO-011 at any altitude. But what the operator SEES depends on altitude:

- Structural: "Here is the divergence. Verify it."
- Executive: "Here is what the divergence means for your decisions."

This means the Guide Runtime needs to show different proof steps per altitude:

| Altitude | Proof steps |
|---|---|
| Structural | Confirm structural center. Confirm execution center. Test compounding. Test falsification. |
| Executive | Which investments are exposed? What governance decisions change? What sequencing constraints exist? |

The structural altitude proves AO-011. The executive altitude proves AO-011's implications.

---

## Classification

| Property | Value |
|---|---|
| Terminal? | No |
| Intermediate? | Yes |
| Downstream objects | 5 (AO-020, AO-015, AO-016, AO-003, AO-002) |
| Directly projected? | DENSE + OPERATOR only |
| Projected via implications? | BOARDROOM + BALANCED |
| Investigation role | Root finding that generates executive questions |
