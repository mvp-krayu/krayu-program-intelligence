# Buyer Trigger Matrix

> **Purpose:** Sales enablement. When a salesperson hears a trigger, they know: who to talk to, what to sell, and what the buyer expects to get. This is a lookup table, not a strategy document.

---

## How to Use This

1. Listen for the trigger in conversation
2. Identify the buyer
3. Recommend the SKU
4. Set the expected outcome

---

## Trigger 1: Cloud Migration

**"We're moving to the cloud / migrating our infrastructure / replatforming"**

| Field | Value |
|-------|-------|
| **Buyer** | CTO, VP Infrastructure, Cloud Migration Lead |
| **Why they need Signäl** | Migration planning requires understanding structural dependencies BEFORE moving components. Move a structurally coupled component first and everything downstream breaks. Move an isolated component first and the migration sequence is safe. They don't know which is which. |
| **Recommended SKU** | **SA** (Structural Assessment) — show structural dependencies, coupling inertia, propagation paths. Identify what can be moved safely and what creates cascade risk. |
| **Expected Outcome** | "Now I know which domains are structurally independent and which are coupling anchors. I have a migration sequence informed by structural reality, not guesswork." |
| **Key finding that closes** | Coupling Inertia — "These coupling patterns resist architectural change. Here's where migration will encounter structural resistance." |

---

## Trigger 2: Modernization / Architecture Transformation

**"We're modernizing our monolith / rearchitecting / decomposing into microservices"**

| Field | Value |
|-------|-------|
| **Buyer** | CTO, Chief Architect, Transformation Director |
| **Why they need Signäl** | Modernization programs stall because the existing structure resists evolution — but nobody can show WHERE or WHY. They feel it. They can't prove it. They spend quarters on modernization with no visible progress. |
| **Recommended SKU** | **SA** → **SC** (start with Assessment, convert to Continuous to track modernization progress) |
| **Expected Outcome** | "I can see exactly where coupling inertia resists decomposition and where structural boundaries diverge from intended architecture. I have evidence for my architecture review board, not opinions." |
| **Key finding that closes** | Coupling Inertia + Boundary Divergence — "Your architecture has drifted from its intended boundaries here and here. The coupling between these domains resists separation." |

---

## Trigger 3: Acquisition / Technical Due Diligence

**"We're acquiring a company / evaluating a target / doing technical due diligence"**

| Field | Value |
|-------|-------|
| **Buyer** | PE Partner, M&A Technical Lead, Corporate Development |
| **Why they need Signäl** | Manual due diligence takes 4+ weeks and delivers consultant opinions. They need structural risk assessment within deal timelines. The investment committee needs evidence, not guesses. |
| **Recommended SKU** | **SA-DD** (Structural Due Diligence) — full depth, deal-timeline delivery, investment committee-ready Structural Verdict |
| **Expected Outcome** | "I have a 9-chapter Structural Verdict on the target in 5 days. Every finding is evidence-traced. I can present structural risk to the investment committee with confidence." |
| **Key finding that closes** | Operational Ceiling — "The target has a structurally reinforced operational ceiling driven by 4 conditions. This limits scaling potential without architectural investment. Here's the cost of that investment." |

---

## Trigger 4: Platform Rewrite

**"We're rewriting our platform / building v2 / replacing our core system"**

| Field | Value |
|-------|-------|
| **Buyer** | CTO, VP Engineering, Platform Engineering Lead |
| **Why they need Signäl** | Before rewriting, they need to understand what the current system's structural dynamics ARE — so they don't accidentally reproduce the same problems. "We rewrote it and hit the same bottlenecks" is a $10M mistake. |
| **Recommended SKU** | **SA** (Assessment of the current system) — structural intelligence becomes the architectural specification for v2 |
| **Expected Outcome** | "I now know exactly which structural conditions to eliminate in v2: the dependency choke points, the fragility zones, the coupling anchors. The rewrite has structural targets, not just feature targets." |
| **Key finding that closes** | Dependency Choke Point + Structural Gravity — "These two structural anchors define your current system's ceiling. If v2 reproduces these patterns, it will hit the same ceiling." |

---

## Trigger 5: Scaling Pressure

**"We're scaling the team / growing fast / adding engineers but velocity isn't increasing"**

| Field | Value |
|-------|-------|
| **Buyer** | CTO, VP Engineering, Engineering Director |
| **Why they need Signäl** | They're hiring but throughput isn't proportional. Brooks's Law is familiar, but they can't locate the STRUCTURAL cause. Adding developers to a structurally constricted system doesn't increase throughput — it increases coordination overhead. |
| **Recommended SKU** | **SA** → **SC** (Assessment first, then Continuous to track whether scaling investments change structural posture) |
| **Expected Outcome** | "I can see why adding developers isn't increasing throughput. Execution Constriction at 3 structural bottlenecks limits throughput independent of headcount. Now I know where to invest." |
| **Key finding that closes** | Execution Constriction — "Structural bottlenecks constrain execution throughput. Adding developers creates more coordination load at these bottlenecks without increasing flow capacity." |

---

## Trigger 6: Recurring Delivery Friction

**"We keep missing deadlines / regressions keep appearing / small changes cause big problems"**

| Field | Value |
|-------|-------|
| **Buyer** | VP Engineering, Engineering Director, Delivery Lead |
| **Why they need Signäl** | They experience symptoms (missed deadlines, unexpected regressions, underestimated changes) but can't find the structural cause. The cause is usually dependency amplification — changes to structural hubs cost more than estimated because the blast radius is structurally larger than it appears. |
| **Recommended SKU** | **SA** (Assessment) — name the structural cause of their delivery friction |
| **Expected Outcome** | "NOW I understand why that module causes problems every sprint. Dependency Amplification — every change to this component cascades to 14 dependent files. The true cost of changes here is 3x what we estimate." |
| **Key finding that closes** | Dependency Amplification — "The true cost of changes to this component is systematically underestimated. Your sprint planning doesn't account for structural blast radius." |

---

## Trigger 7: Architecture Uncertainty

**"We're not sure if our architecture is sound / we need an architecture review / we want to validate our technical decisions"**

| Field | Value |
|-------|-------|
| **Buyer** | CTO, Chief Architect, VP Engineering |
| **Why they need Signäl** | Architecture reviews are typically opinion-based. An architect examines the system and delivers a judgment informed by experience but not by structural evidence. Signäl provides the evidence — the structural reality that the architect can then interpret. |
| **Recommended SKU** | **SA** (Assessment) — structural evidence for architecture decision-making |
| **Expected Outcome** | "I have structural evidence for my architecture decisions instead of opinions. The Structural Verdict shows exactly where structural risk concentrates and what the operational ceiling is. I can present evidence to the team, not authority." |
| **Key finding that closes** | The full Structural Verdict — "9 chapters of structural findings. Not what an architect THINKS about your system — what the structure SHOWS." |

---

## Trigger 8: Technical Debt Concentration

**"We have too much technical debt / we don't know where to invest in debt reduction / our debt is slowing us down"**

| Field | Value |
|-------|-------|
| **Buyer** | CTO, VP Engineering, Engineering Director |
| **Why they need Signäl** | "Technical debt" is usually an undifferentiated mass. Teams know they have it but can't locate it, size it, or prioritize it structurally. Code quality tools measure code-level debt (linting, complexity). Signäl reveals STRUCTURAL debt — dependency concentrations, fragility zones, coupling patterns that create systemic risk. |
| **Recommended SKU** | **SA** → **SC** (Assessment to locate and size structural debt, Continuous to track reduction over time) |
| **Expected Outcome** | "I can now distinguish code-level debt (fixable by refactoring) from structural debt (requires architectural intervention). The Structural Verdict shows which debt concentrations carry systemic risk and which are cosmetic." |
| **Key finding that closes** | Compound Convergence — "Multiple independent structural conditions converge here. This isn't one debt item — it's three independent structural problems reinforcing each other. Fixing one without the others won't resolve the systemic risk." |

---

## Quick Reference

| # | Trigger | Primary Buyer | SKU | Key Finding |
|---|---------|--------------|-----|-------------|
| 1 | Cloud migration | CTO, Cloud Lead | SA | Coupling Inertia |
| 2 | Modernization | CTO, Chief Architect | SA → SC | Coupling Inertia + Boundary Divergence |
| 3 | Acquisition / DD | PE, M&A | SA-DD | Operational Ceiling |
| 4 | Platform rewrite | CTO, VP Eng | SA | Dependency Choke Point + Structural Gravity |
| 5 | Scaling pressure | CTO, VP Eng | SA → SC | Execution Constriction |
| 6 | Delivery friction | VP Eng, Delivery Lead | SA | Dependency Amplification |
| 7 | Architecture uncertainty | CTO, Chief Architect | SA | Full Structural Verdict |
| 8 | Technical debt | CTO, VP Eng | SA → SC | Compound Convergence |
