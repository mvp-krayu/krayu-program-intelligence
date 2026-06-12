# PMO Cognition Discovery

**Artifact:** PI.PMO-COGNITION-DISCOVERY.01
**Status:** DISCOVERY — no implementation
**Date:** 2026-06-12
**Method:** Discover answer shapes from real executive questions. Determine whether the LENS/THORR runtime (Question → Intent → SynthesisContext → Synthesis → Projection) is sufficient to power PMO Cognition.

**Constraint:** Think only in "what answer is the person trying to obtain." Not reports. Not dashboards. Not KPIs.

---

## 1. Questions by Role (normalized)

Each role's recurring questions, deduplicated. Full lists collapsed to distinct cognitive asks.

### CEO
- Will we deliver what we promised the board?
- Which commitments are at risk?
- How much value/revenue is exposed if these slip?
- What decisions need me?
- Are we investing in the right things? Which should we stop?
- Do we have capacity to take on X?
- What is the one thing most likely to blow up?
- Are we getting better or worse? What changed?
- Where are we over-committed?

### COO
- Can the organization actually execute this plan?
- Where are we capacity-constrained? Which teams are overloaded?
- What is blocking throughput? Where will the next bottleneck appear?
- Are dependencies being managed? Which handoffs are failing?
- Is delivery accelerating or decelerating?
- How much rework are we carrying?

### Portfolio Director
- Which investments are at risk?
- Where should I reallocate budget/people?
- What is the aggregate portfolio health?
- Which programs drag the portfolio? Exposure if program X fails?
- Which programs compete for the same resources?
- What is the opportunity cost of continuing X?
- Where are the cross-program dependencies?
- Which programs should advance to the next gate?

### Program Director
- Will we hit the milestone? What is the critical path?
- Which dependencies are at risk? Where is integration risk concentrating?
- Which teams are behind? What is blocking the program?
- Is scope stable? What is the schedule risk?
- Which risks are materializing? What needs escalation?

### PMO Lead
- Is the reported status accurate? Where is the data unreliable?
- Which projects are non-compliant with process?
- Where are blockers aging? What is not being reported?
- Are gates being passed properly? Where is governance bypassed?
- What is the confidence in this forecast?
- Which status reports contradict the evidence?

### RTE (Release Train Engineer)
- Will we meet PI objectives? Is the train on track?
- Where are cross-team dependencies blocking flow?
- What impediments are unresolved? Where is flow stalling?
- Where is WIP piling up? Which teams are misaligned?
- What needs to be re-planned?

### Delivery Manager
- Will we hit the sprint commitment?
- What is blocking the team? Which stories are stuck?
- Is velocity stable? Is scope creeping?
- Where are we carrying rework/debt?
- What is the team's capacity next sprint?
- Which dependencies are we waiting on? What needs escalation?

### Steering Committee
- Should we continue funding this? Go or no-go?
- Should we accept this risk?
- What is the recommendation and why? What changed since last gate?
- What is the exposure if we proceed/stop?
- Are the assumptions still valid? What is the confidence in this plan?
- What are we deciding and what is at stake?

---

## 2. Clusters by Cognitive Intent

The ~200 raw questions collapse into 12 cognitive intents. For each: question pattern, intent, required evidence, candidate answer shape.

### Cluster A — Commitment Reachability
**Pattern:** "Will we hit [milestone / sprint / PI / launch / board commitment]?"
**Intent:** Probability that a stated commitment will be met given current trajectory.
**Evidence:** target (date/scope/objective), current progress, burn rate, remaining work, blocking factors.
**Answer shape:** `COMMITMENT_REACHABILITY` — { commitment, target, current_trajectory, gap, confidence, blocking_factors, projected_outcome }
**Roles:** CEO, Program Director, RTE, Delivery Manager (4)

### Cluster B — Exposure Surface
**Pattern:** "What is at risk? What is the exposure if X fails/slips?"
**Intent:** Identify what is threatened and quantify the magnitude.
**Evidence:** threatened object, trigger condition, downstream scope, value/impact estimate.
**Answer shape:** `EXPOSURE_SURFACE` — { threatened_object, trigger, magnitude, affected_scope, confidence }
**Roles:** CEO, Portfolio, Steering (3)

### Cluster C — Flow Constraint
**Pattern:** "What is blocking throughput? Where is the bottleneck? What impediments?"
**Intent:** Locate the binding constraint that limits delivery flow.
**Evidence:** work-in-progress distribution, queue/wait states, handoff points, impediment log.
**Answer shape:** `FLOW_CONSTRAINT` — { constraint_location, type, what_it_blocks, severity, upstream_cause, downstream_effect }
**Roles:** COO, RTE, Delivery Manager, Program Director (4)

### Cluster D — Capacity Saturation
**Pattern:** "Do we have capacity? Which teams are overloaded? Capacity next period?"
**Intent:** Assess load against capacity; find headroom or saturation.
**Evidence:** committed load, available capacity, allocation, historical throughput.
**Answer shape:** `CAPACITY_SATURATION` — { unit, load, capacity, saturation_level, headroom, over_commitment }
**Roles:** CEO, COO, Delivery Manager (3)

### Cluster E — Dependency Amplification
**Pattern:** "Which dependencies are at risk? Cross-program/cross-team dependencies? Integration risk?"
**Intent:** Locate dependency-driven risk and its propagation.
**Evidence:** dependency map, dependency state (met/late/at-risk), direction, blast radius.
**Answer shape:** `DEPENDENCY_AMPLIFICATION` — { dependency, direction, state, blast_radius, coordination_cost }
**Roles:** Portfolio, Program Director, RTE, Delivery Manager (4)

### Cluster F — Allocation Decision
**Pattern:** "Where should I reallocate? Should we stop X? Opportunity cost?"
**Intent:** Decide resource movement between competing investments.
**Evidence:** current allocation, return/risk per investment, alternatives, competition for shared resources.
**Answer shape:** `ALLOCATION_DECISION` (≈ Investment Exposure) — { investment, allocation, return, risk, alternative, recommendation }
**Roles:** CEO, Portfolio (2)

### Cluster G — Decision Surface
**Pattern:** "What decisions need me? Go/no-go? What needs escalation?"
**Intent:** Surface decisions requiring authority, with stakes and recommendation.
**Evidence:** open decisions, options, stakes, deadline, authority level required.
**Answer shape:** `DECISION_SURFACE` — { decision, options, stakes, recommendation, deadline, authority_required }
**Roles:** CEO, Steering, Program Director, Delivery Manager (4)

### Cluster H — Trajectory
**Pattern:** "Getting better or worse? Accelerating or decelerating? What changed?"
**Intent:** Assess direction and rate of movement over time.
**Evidence:** TEMPORAL series — prior vs current state, rate of change, inflection points.
**Answer shape:** `TRAJECTORY` — { subject, direction, rate, vs_prior, inflection, projection }
**Roles:** CEO, COO, Steering (3)
**Note:** Requires temporal evidence. Without it, resolves to Temporal Unavailability (AO-006).

### Cluster I — Confidence / Qualification
**Pattern:** "Is the status accurate? Where is data unreliable? Confidence in forecast?"
**Intent:** Assess reliability of the information itself.
**Evidence:** evidence basis per claim, reporting gaps, contradiction between report and ground truth.
**Answer shape:** `QUALIFICATION` — { claim, evidence_basis, gaps, reliability }
**Roles:** PMO Lead, Steering (2)
**Note:** Identical to LENS `qualification_review` / AO-001. Already exists.

### Cluster J — Posture
**Pattern:** "Aggregate portfolio health? PI health? Program increment health?"
**Intent:** Single synthesized state across a scope.
**Evidence:** all findings within scope, severity distribution, dominant drivers.
**Answer shape:** `POSTURE` — { scope, synthesized_state, drivers, severity }
**Roles:** Portfolio, RTE (2)
**Note:** Identical to LENS posture synthesis. Already exists.

### Cluster K — Governance Exposure
**Pattern:** "Non-compliant? Gates passed properly? Governance bypassed?"
**Intent:** Detect process/governance breaches and their consequence.
**Evidence:** expected process/gate, actual execution, breach, downstream consequence.
**Answer shape:** `GOVERNANCE_EXPOSURE` — { decision/gate, expected, actual, breach, consequence }
**Roles:** PMO Lead, Steering (2)
**Note:** Same as LENS AO-016 candidate. Already discovered.

### Cluster L — Dominant Threat
**Pattern:** "The one thing most likely to blow up? Which risk is materializing?"
**Intent:** Rank threats, surface the load-bearing one.
**Evidence:** threat inventory, likelihood, impact, why one dominates.
**Answer shape:** `DOMINANT_THREAT` — { threat, likelihood, impact, why_dominant, dependents }
**Roles:** CEO, Program Director (2)
**Note:** Structurally identical to LENS AO-010 Load-Bearing Condition.

---

## 3. Unique PMO Answer Shapes

12 cognitive intents → 12 candidate answer shapes. But 5 are already-existing LENS objects:

| PMO Cluster | Answer Shape | LENS Equivalent | Status |
|---|---|---|---|
| I — Confidence | QUALIFICATION | qualification_review / AO-001 | **EXISTS** |
| J — Posture | POSTURE | posture synthesis | **EXISTS** |
| K — Governance | GOVERNANCE_EXPOSURE | AO-016 candidate | **EXISTS (candidate)** |
| L — Dominant Threat | DOMINANT_THREAT | AO-010 Load-Bearing | **EXISTS** |
| E — Dependency | DEPENDENCY_AMPLIFICATION | AO-002 Compounding + AO-005 Propagation | **EXISTS (composable)** |
| B — Exposure | EXPOSURE_SURFACE | AO-004 Blast Radius + AO-020 Investment | **PARTIAL** |
| F — Allocation | ALLOCATION_DECISION | AO-020 Investment Exposure | **PARTIAL** |
| C — Flow Constraint | FLOW_CONSTRAINT | AO-003 Failure Impact (structurally similar) | **PARTIAL** |
| G — Decision Surface | DECISION_SURFACE | AO-016 + decision framing | **PARTIAL** |
| **A — Commitment** | **COMMITMENT_REACHABILITY** | — | **GENUINELY NEW** |
| **D — Capacity** | **CAPACITY_SATURATION** | — | **GENUINELY NEW** |
| **H — Trajectory** | **TRAJECTORY** | AO-006 (only the absence case) | **GENUINELY NEW** |

**Unique shapes that are genuinely new to PMO: 3** — Commitment Reachability, Capacity Saturation, Trajectory.
**Shapes that transfer or compose from LENS: 9.**

---

## 4. Cross-Role Answer Shapes

Shapes appearing across the most roles (these are the canonical cognition objects):

| Answer Shape | Roles | Count |
|---|---|---|
| **Commitment Reachability** | CEO, Program Director, RTE, Delivery Manager | 4 |
| **Flow Constraint** | COO, RTE, Delivery Manager, Program Director | 4 |
| **Dependency Amplification** | Portfolio, Program Director, RTE, Delivery Manager | 4 |
| **Decision Surface** | CEO, Steering, Program Director, Delivery Manager | 4 |
| **Exposure Surface** | CEO, Portfolio, Steering | 3 |
| **Capacity Saturation** | CEO, COO, Delivery Manager | 3 |
| **Trajectory** | CEO, COO, Steering | 3 |
| Qualification | PMO Lead, Steering | 2 |
| Posture | Portfolio, RTE | 2 |
| Governance Exposure | PMO Lead, Steering | 2 |
| Allocation Decision | CEO, Portfolio | 2 |
| Dominant Threat | CEO, Program Director | 2 |

---

## 5. Canonical PMO Cognition Objects

The smallest set covering the majority of executive PMO questions. Ranked by role-coverage × question-frequency:

**Core 5 (covers ~70% of all questions):**
1. **COMMITMENT_REACHABILITY** — "Will we hit X?" The single most-asked PMO question. No LENS equivalent.
2. **FLOW_CONSTRAINT** — "What's blocking?" Second most-asked. Structurally close to AO-003.
3. **DECISION_SURFACE** — "What needs deciding / escalating?" The steering/escalation backbone.
4. **DEPENDENCY_AMPLIFICATION** — "Which dependencies / coordination risk?" Composes from AO-002 + AO-005.
5. **EXPOSURE_SURFACE** — "What's at risk and how much?" Composes from AO-004 + AO-020.

**Supporting 3 (covers the remainder):**
6. **CAPACITY_SATURATION** — load vs capacity. New.
7. **TRAJECTORY** — direction over time. New, temporal-gated.
8. **QUALIFICATION** — reliability of the answer. Reused directly from LENS.

8 canonical objects cover the overwhelming majority. The core 5 alone cover most.

---

## 6. Final Determination

### Can PMO Cognition be expressed as Question → Intent → PMO Answer Object → SynthesisContext → Persona Projection?

**Yes. The runtime is sufficient. The shape transfers directly.**

The intent-routing, SynthesisContext contract, evidence-grounded synthesis, and persona projection are all domain-agnostic. PMO questions map to intents exactly as LENS questions do. The persona projection (CEO vs Delivery Manager) is the same mechanism as (BOARDROOM vs OPERATOR) — same answer object, different rendering altitude.

### What is NOT solved by the existing runtime

PMO Cognition is **primarily an ontology problem — but not only.** Two real gaps:

**Gap 1 — Ontology (expected, tractable):**
Three genuinely new answer objects (Commitment Reachability, Capacity Saturation, Trajectory) plus the maturation of partials (Flow Constraint, Decision Surface, Exposure Surface). This is ontology work — the same discovery→promotion lifecycle already proven for AO-011.

**Gap 2 — Evidence Substrate (the real frontier):**
LENS SynthesisContext is built from STRUCTURAL and RUNTIME evidence (topology, signals, conditions). PMO answer objects need a DIFFERENT evidence substrate:
- Commitments/targets (dates, scope baselines, PI objectives)
- Capacity (allocation, velocity, throughput)
- **Temporal series** (burn-up, trend, rate of change) ← the hardest gap
- Dependencies (cross-team, cross-program edges)
- RAID (risks, assumptions, issues, dependencies)

The runtime consumes a SynthesisContext. It does not care what evidence built it. So the runtime transfers. But a **PMO SynthesisContext builder** must be written against PMO evidence types — analogous to how `buildSynthesisContext` reads structural/runtime evidence today.

**The Temporal problem is the sharpest finding.** LENS never needed time — it assesses present structure. PMO LIVES on trajectory: "are we getting better?", "will we hit the date?", "what changed?". These three of the most-asked PMO questions all require temporal evidence. LENS currently returns Temporal Unavailability (AO-006) for exactly these. PMO Cognition cannot be commercially viable on a point-in-time substrate. **Temporal evidence ingestion is the foundational prerequisite for PMO, not an enhancement.**

### Summary

| Dimension | Verdict |
|---|---|
| Runtime (intent → context → synthesis → projection) | **Sufficient. Transfers directly. No new runtime needed.** |
| Persona projection | **Sufficient. CEO/COO/Director = same mechanism as BOARDROOM/BALANCED/OPERATOR.** |
| Answer object ontology | **Mostly transferable. 3 new objects, 4 partials to mature. Tractable via existing discovery lifecycle.** |
| Evidence substrate | **NEW. PMO SynthesisContext builder required. Temporal evidence is the foundational gap.** |

**PMO Cognition does NOT require a separate cognition runtime.** It requires a PMO ontology (small, ~8 objects) and a PMO evidence substrate (new, temporal-centric). The runtime primitives built for LENS/THORR are the engine. PMO is a new evidence intake + a small ontology on the same engine.
