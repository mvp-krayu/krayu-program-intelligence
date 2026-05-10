# SQO Cockpit Personas and Jobs

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## Persona 1: Semantic Onboarding Operator

**Role:** Guides new clients from structural-only (S0/S1) to semantically qualified (S2+).

**Primary jobs:**
- Assess current qualification state for a new client/run
- Identify missing semantic artifacts blocking S-state progression
- Determine what source material the client must provide
- Prepare re-run checklists for semantic pipeline execution
- Track onboarding progress across enrichment cycles

**Decisions supported:**
- Which missing artifacts are highest priority?
- What source material should be requested first?
- Is the client ready for a semantic pipeline re-run?
- What is the expected outcome of the next enrichment cycle?

**Visible artifacts:**
- qualification_state, semantic_debt_inventory, continuity_assessment
- progression_readiness, maturity_dimension_breakdown

**Forbidden actions:**
- Cannot edit source artifacts
- Cannot override S-state
- Cannot fabricate source material
- Cannot auto-generate semantic labels
- Cannot push data into LENS directly

**Handoff to PATH B/LENS:**
- When client reaches S2+, prepares PATH B handoff package with qualification evidence

---

## Persona 2: Client Implementation Architect

**Role:** Technical counterpart at the client or delivery team who provides source material and validates enrichment outcomes.

**Primary jobs:**
- Understand what source material is needed and why
- Review debt inventory to understand semantic gaps
- Validate that provided source material maps to identified gaps
- Review maturity progression after enrichment cycles
- Confirm domain labeling and structural grounding

**Decisions supported:**
- What documentation do I need to gather?
- Which business domains correspond to structural clusters?
- Are the enrichment outcomes correct?
- What remains after this enrichment cycle?

**Visible artifacts:**
- semantic_debt_inventory (remediation pathways, source material needs)
- continuity_assessment (coverage gaps)
- semantic_maturity_profile (dimension scores)
- maturity_dimension_breakdown (per-dimension detail)

**Forbidden actions:**
- Cannot modify SQO artifacts
- Cannot trigger pipeline re-runs directly
- Cannot override qualification state
- Cannot approve projection directly

**Handoff to PATH B/LENS:**
- Provides source material → onboarding operator prepares re-run → pipeline produces artifacts → qualification re-assessed

---

## Persona 3: Governance Reviewer

**Role:** Validates that qualification operations comply with governance boundaries.

**Primary jobs:**
- Review qualification state for governance compliance
- Verify replay certification passes
- Inspect evidence chains for provenance
- Confirm no semantic fabrication in debt assessments
- Validate handoff package completeness before PATH B submission

**Decisions supported:**
- Is this qualification state governance-compliant?
- Does the replay verification pass?
- Is the handoff package complete and auditable?
- Are there any governance violations in the maturation history?

**Visible artifacts:**
- All SQO artifacts (read-only)
- Replay verification artifacts
- Certification artifacts
- Qualification history

**Forbidden actions:**
- Cannot modify any artifacts
- Cannot override qualification verdicts
- Cannot suppress governance warnings
- Cannot bypass replay verification

**Handoff to PATH B/LENS:**
- Certifies governance compliance → enables PATH B handoff

---

## Persona 4: Delivery/Transformation Lead

**Role:** Manages the overall semantic maturation program for one or more clients.

**Primary jobs:**
- Track maturation progress across multiple clients/runs
- Prioritize which clients need attention
- Understand blockers and timelines
- Report maturation status to stakeholders
- Plan enrichment cycles and resource allocation

**Decisions supported:**
- Which client is closest to S-state progression?
- Where are the biggest blockers?
- What is the maturation trajectory?
- How much source material gathering is needed?

**Visible artifacts:**
- qualification_state (per client)
- progression_readiness (per client)
- semantic_debt_inventory summary (per client)
- maturity_dimension_breakdown overview

**Forbidden actions:**
- Cannot edit artifacts
- Cannot override S-state
- Cannot fabricate enrichment outcomes
- Cannot bypass governance

**Handoff to PATH B/LENS:**
- Coordinates timing of PATH B handoff readiness

---

## Persona 5: Internal Krayu/Signäl Product Operator

**Role:** Manages the SQO Cockpit product itself — its capabilities, content, and evolution.

**Primary jobs:**
- Define and evolve cockpit capabilities
- Ensure cockpit accurately represents SQO engine outputs
- Manage artifact consumption model updates
- Define new UX patterns for maturation workflows
- Validate cockpit against new SQO engine versions

**Decisions supported:**
- Does the cockpit accurately reflect SQO engine state?
- Are new artifact types properly consumed?
- Is the UX appropriate for the personas?
- Are governance boundaries enforced in the UI?

**Visible artifacts:**
- All SQO artifacts and cockpit configuration
- Engine module APIs and artifact schemas

**Forbidden actions:**
- Cannot introduce direct SQO→LENS rendering
- Cannot modify SQO engines through the cockpit
- Cannot introduce AI interpretation in the cockpit
- Cannot bypass PATH B for projection

**Handoff to PATH B/LENS:**
- Defines the PATH B handoff package specification
