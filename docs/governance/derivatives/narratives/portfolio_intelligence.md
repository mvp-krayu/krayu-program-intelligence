# Portfolio Intelligence — Narrative Expansion

Stream: I.6 — Hardening Batch 01 (PROVISIONAL ROUTE ELIMINATION — SET A)
Phase: Canonical Gap Closure — Derivative Narrative
Entity: portfolio_intelligence
Narrative Depth: standard (level 2)
Authority: program_intelligence_stack.md | pios_architecture_whitepaper.md | construct_positioning_map.md | derivative_entity_graph_map.md
Date: 2026-03-31

---

## Portfolio Intelligence

### Definition

The execution-governance layer of Program Intelligence applied across multiple programs simultaneously. Portfolio Intelligence aggregates ESI and RAG outputs from individual programs into a comparative view of execution health, enabling leadership to identify where instability is concentrated, where risk is accelerating, and where interventions are most urgent across the portfolio.

### What It Is

A cross-program application of Program Intelligence — not a distinct discipline, but the portfolio-scale interpretation layer built on the same analytical foundation that operates at program level.

At the program level, ESI answers: "Is this program structurally stable, degrading, or approaching systemic risk?" RAG answers: "How fast is risk moving in this program, and in which direction?" Portfolio Intelligence applies both questions simultaneously across all active programs in a portfolio, enabling a governance view that individual program review cannot produce.

Three capabilities define what Portfolio Intelligence provides:

1. **Cross-program stability comparison** — ESI is directly comparable across programs of different size, structure, and delivery approach because it normalizes across a consistent signal framework. This comparability is the structural property that makes portfolio-level analysis possible. Portfolio Intelligence surfaces where ESI scores are concentrated, which programs share stability bands, and how the distribution changes over time.

2. **Portfolio-level risk direction** — RAG adds the directional layer to cross-program analysis. A portfolio where multiple programs hold similar ESI scores has a materially different risk profile depending on whether those programs have accelerating or decelerating RAG. Portfolio Intelligence surfaces whether risk trajectories are converging, diverging, isolated, or synchronized across programs.

3. **Intervention prioritization** — Portfolio Intelligence provides the comparative basis for directing governance attention. Where execution risk is most concentrated, most accelerating, or most synchronized across programs is where intervention resources have the highest marginal impact. Portfolio Intelligence makes this concentration visible at the governance level.

Portfolio Intelligence does not produce new signals or recompute analytical constructs. It consumes ESI and RAG outputs from individual programs — the same outputs that program-level governance consumes — and positions them in relation to each other.

### What It Is Not

- Not Business Intelligence. Business Intelligence operates on commercial and operational outcomes — revenue, cost, operational efficiency. Portfolio Intelligence operates on program execution dynamics — structural stability, risk acceleration, delivery behavior. The distinction is not semantic; the underlying data, the derivation model, and the consumer role are all different. Portfolio Intelligence must not be positioned as or confused with business analytics.
- Not a separate signal system. Portfolio Intelligence does not produce its own signals. It consumes ESI and RAG — it does not define, derive, or reweight them. Any analytical output of Portfolio Intelligence is a function of ESI and RAG inputs, not an independent computation.
- Not a reinterpretation layer. Portfolio Intelligence aggregates and positions existing analytical construct outputs. It does not reinterpret what ESI or RAG mean. An ESI score of 42 means the same thing at portfolio level as it does at program level — Portfolio Intelligence provides comparative context, not reinterpretation.
- Not a prediction system. Portfolio Intelligence surfaces where execution risk is concentrated and where it is moving. It does not predict which programs will fail, when they will fail, or what the outcome of a given risk pattern will be. These would be claims beyond the evidence boundary.
- Not a complete governance system. Portfolio Intelligence covers execution governance — the structural and dynamic health of program delivery. It does not cover budget governance, resource governance, strategic portfolio management, or commercial outcomes. These domains may consume Portfolio Intelligence outputs but are not within its scope.

### Role in Program Intelligence

Portfolio Intelligence is the executive aggregation layer of Program Intelligence — the layer at which execution governance scales from the individual program to the portfolio. It sits above the program-level analytical constructs (ESI, RAG) in the consumption hierarchy, not above them in the derivation hierarchy.

The structural position:

```
Program Intelligence (discipline)
    ↓ governs
Signal Infrastructure → Signal → ESI / RAG (per program)
    ↓ consumed at portfolio level by
Portfolio Intelligence
    ↓ produces
Portfolio execution governance view
```

Portfolio Intelligence does not change how ESI or RAG are computed. It changes the unit of analysis — from a single program to a collection of programs — and enables the comparative governance questions that leadership requires when overseeing multiple simultaneous delivery programs.

### Relationship to Program Structure

Portfolio Intelligence presupposes that the programs being compared are correctly identified and bounded. A portfolio comparison that conflates programs, excludes active programs, or misattributes workstreams to the wrong program produces a governance view that is misleading regardless of the accuracy of the underlying ESI and RAG computations.

This is the dependency on program_structure: the accuracy of Portfolio Intelligence is bounded by the accuracy of the program architecture that defines what is being compared. Organically evolved delivery environments — where programs span multiple repositories, teams, and delivery domains without clear structural boundaries — require program structure reconstruction before Portfolio Intelligence can produce a reliable governance view.

Portfolio Intelligence consumes program structure outputs as the definition of what constitutes each program in the comparison. It does not perform structure reconstruction itself.

### Relationship to ESI / RAG Aggregation

Portfolio Intelligence consumes ESI and RAG outputs from the individual programs it covers. The aggregation model has two levels:

**Comparative positioning:** ESI scores from multiple programs are positioned on a common scale using the ESI score bands (structurally stable, emerging instability, compounding stress, critical exposure). This positioning does not modify the underlying scores — it provides the governance reference frame within which scores are compared.

**Directional pattern analysis:** RAG values from multiple programs are examined for pattern — whether risk is accelerating independently in single programs (program-specific causes) or accelerating in correlated clusters (systemic causes). This pattern analysis requires at minimum two temporal windows of RAG data per program and a minimum of two programs to produce a meaningful comparison.

Neither aggregation step modifies the source ESI or RAG values. Portfolio Intelligence is a read-only consumer of analytical construct outputs. It does not upstream into the derivation pipeline.

### Portfolio-Level Interpretation Layer

The interpretation layer of Portfolio Intelligence addresses questions that cannot be answered from any single program's ESI and RAG outputs alone:

- **Concentration:** Where is execution risk most concentrated across the portfolio? Which ESI bands hold the largest number of programs? Where is risk mass highest?
- **Synchronization:** Are multiple programs showing correlated RAG acceleration? Synchronized positive RAG across a cluster indicates shared systemic causes — a materially different governance concern from isolated single-program acceleration.
- **Direction of travel:** Is portfolio-wide execution health improving or deteriorating? The aggregate trend of ESI scores over time characterizes the portfolio's structural trajectory.
- **Intervention leverage:** Which programs, if stabilized, would most improve the portfolio's overall execution health? ESI and RAG together identify where marginal governance input has the highest expected impact.

These interpretation outputs are bounded by the evidence and derivation chain underlying each program's ESI and RAG. Portfolio Intelligence does not produce interpretations that exceed the claim boundary of the underlying constructs.

### Claim Boundary

Portfolio Intelligence claims are bounded to:

- Comparative execution governance — how programs compare in structural stability and risk direction
- Aggregation and pattern identification of ESI and RAG outputs across programs
- Prioritization guidance based on concentration and directionality of execution risk

Portfolio Intelligence claims must not:

- Assert predictions about which programs will succeed or fail
- Produce commercial, financial, or operational outcome assessments
- Recompute, reweight, or reinterpret the ESI and RAG values it consumes
- Claim completeness — Portfolio Intelligence covers execution governance dimensions only; it does not represent total program health, strategic fit, or commercial viability

Mandatory framing: all Portfolio Intelligence claims must remain within the execution governance domain. Cross-program comparison is valid; cross-domain comparison (execution vs. financial health, execution vs. strategic priority) is not within Portfolio Intelligence scope.

### Canonical Source

Authority container status: established. Portfolio Intelligence is referenced as the consumer of ESI and RAG outputs in the execution_stability_index and risk_acceleration_gradient narratives ("consumed by portfolio_intelligence for cross-program comparison"). The construct exists in the derivative entity graph as a named consumer node. This narrative establishes the canonical capability definition.

Sources:
- program_intelligence_stack.md — discipline definition; evidence-first constraint applies to all outputs including portfolio aggregation
- pios_architecture_whitepaper.md — L3 derivation layer; consumption model at L6+
- docs/governance/derivatives/narratives/execution_stability_index.md — ESI comparability property; consumer reference
- docs/governance/derivatives/narratives/risk_acceleration_gradient.md — RAG directional layer; consumer reference
- construct_positioning_map.md — parent classification (Program Intelligence)
- Authority codes: CKR-014 | CKR-015 | CAT-00
