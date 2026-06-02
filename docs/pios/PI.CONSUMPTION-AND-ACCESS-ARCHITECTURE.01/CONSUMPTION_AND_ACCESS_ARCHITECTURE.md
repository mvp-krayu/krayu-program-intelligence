# Consumption and Access Architecture

**Stream:** PI.CONSUMPTION-AND-ACCESS-ARCHITECTURE.01
**Classification:** G2 (Architecture Consuming)
**Date:** 2026-06-02
**Branch:** feature/runtime-demo
**§5.5:** NO — architecture proposal only, no reusable code primitives
**Reconciliation pass:** v1.0 — doctrine-down derivation from frozen commercial contracts and vault state

---

## 1. BINDING INPUTS — WHAT THE VAULT ALREADY DECIDED

This architecture inherits from existing frozen commitments. It does not re-derive them.

### 1.1 Frozen Commercial Contracts

Four SKUs are commercially defined and frozen (SKU_MODEL.md, OFFER_CATALOG.md, SA_PACKAGING.md, SA_DD_PACKAGING.md):

| SKU | What the Customer Buys | What the Customer Receives | Binding Constraints |
|-----|----------------------|--------------------------|-------------------|
| **SA** | Per-engagement structural intelligence | LENS (BOARDROOM + BALANCED), Structural Verdict, Evidence Record, 60-90 min advisory session | 3-5 day delivery. Per-program, per-engagement. |
| **SA-DD** | Deal-grade structural intelligence | All SA + full LENS (all 4 modes), 76+ guided queries in DENSE, Evidence Record with investigation trail | 5 business days. 30-day LENS access. Up to 10 concurrent users. Deal-timeline SLA. |
| **SC** | Ongoing structural intelligence | All SA-DD capabilities + multiple assessment runs, qualification progression, structural escalation | Annual subscription. Self-service investigation. Quarterly advisory. |
| **SE** | Platform-level structural intelligence | All SC + operator authority workflow, RBAC, multi-program topology (future), custom domain modules (future) | Multi-year license. Full operator authority. Enterprise-grade. |

These are commercial facts. The consumption architecture's job is to fulfill them.

### 1.2 Frozen Cognition Consumption Architecture

The cognition chain is canonically defined (PICP_CONSUMER_CONTRACT.md, CONSUMER_PROJECTION_BOUNDARY.md):

```
CIP → PICR → PICP → PRE → Consumer
                            ├── EIR (Reference Consumer #1)
                            ├── LENS (Reference Consumer #2 — 5 persona projections)
                            └── Marketplace consumers (#3+)
```

**Consumer-genericity invariant (constitutional):** PRE core must not change when adding a new consumer. Only ProjectionConfig and consumer-specific rendering adapters may change.

**Three-zone PRE (constitutional):**
- Zone A: Deterministic projection (ZERO AI)
- Zone B: Governed narrative (75.x bounded)
- Zone C: Qualification gate (consumer-independent)

### 1.3 Frozen Persona Doctrine

Five personas with locked mission contracts (PERSONA_MISSION_CONTRACTS_AND_COGNITIVE_OBJECTIVES.md):
- BOARDROOM: Executive consequence qualification
- BALANCED: Governed operational cognition briefing
- DENSE: Structural behavior interrogation
- OPERATOR: Engineering evidence inspection and governance audit
- INVESTIGATION: Evidence qualification and governed replay (constitutional — no certified implementation)

### 1.4 Frozen Product Gap State

Five open product capability gaps (PRODUCT_GAP_REGISTER.md):
- PG-001: Cross-Session Qualification Progression (blocks SC, SE)
- PG-002: Multi-Run Comparison (blocks SC, SE)
- PG-003: SKU Gating (blocks SC, SE)
- PG-004: Production RBAC (blocks SE)
- PG-005: Multi-Program Intelligence (blocks SE)

SKU readiness: SA sellable, SA-DD sellable, SC not sellable, SE not sellable.

### 1.5 Advisory Workbench Constitutional Intent

The Advisory Workbench (PI.OPERATOR-COPILOT.ADVISORY-WORKBENCH.01) was created to solve a specific problem:

> "Given that CIP, PICR, PICP, PRE, LENS, Assessment Package, Structural Assessment, and Commercial Packaging all exist — how does the advisor understand, explain, challenge, present, and commercialize all of this?"

This is an **advisory cognition** problem — not a navigation problem, not a query problem, not a governed interpretation problem.

The Workbench has six advisory modes (Explain, Position, Present, Challenge, Sell, Advise), 5 personas, 7 question categories (A-G), 6 knowledge layers, and the same 13 absolute prohibitions as LENS 75.x.

---

## 2. WHAT EACH SKU REQUIRES — DERIVED FROM COMMERCIAL CONTRACTS

Given the frozen commercial contracts, what must the consumption architecture deliver?

### 2.1 SA Consumption Requirements

**Contract promise:** Assessment Package + LENS (BOARDROOM + BALANCED) + advisory session.

**What the customer must receive:**
- Structural Verdict (9-chapter HTML/PDF) — operator-generated, delivered to customer
- Evidence Record (self-contained HTML) — operator-generated, delivered to customer
- LENS access at BOARDROOM and BALANCED modes
- 60-90 minute advisory walkthrough

**Consumption model:** Assessment Package + LENS + Advisory session form a single combined experience. The Assessment Package is the governed artifact the customer retains. LENS (BOARDROOM + BALANCED) is the cognitive projection surface through which the customer experiences structural reality. The advisory session is the guided walkthrough that connects the two. None of these is secondary — they are the product.

**Architecture required:** Assessment Package generation (OPERATIONAL). Advisory session preparation (Workbench territory). LENS access can be fulfilled at multiple operational levels for SA — from screen-share through hosted instance — but LENS is part of the product experience, not a delivery bonus.

**Current state:** OPERATIONAL for artifact delivery. Advisory session preparation is manual (no Workbench). LENS access currently requires localhost — no customer-facing path.

**Minimum viable fulfillment:** Operator runs pipeline → generates Assessment Package → delivers artifacts → conducts advisory session using LENS (screen-share or in-person). Customer receives artifacts as permanent property. **This is sellable today.**

### 2.2 SA-DD Consumption Requirements

**Contract promise:** Everything in SA + full LENS (all 4 modes) + 76+ guided queries in DENSE + 30-day access + up to 10 concurrent users + deal-timeline SLA.

**What the customer must receive:**
- Everything SA delivers
- Self-service LENS access — all 4 cognitive modes (BOARDROOM, BALANCED, DENSE, OPERATOR)
- 76+ guided structural queries with evidence-traced answers (DENSE mode)
- Evidence Record with investigation trail
- 30-day access from provisioning
- Up to 10 concurrent users (deal team + IC members)
- 5-day delivery SLA

**Consumption model:** The deal team must be able to explore the target's structural reality independently — without scheduling assessor time, without waiting for follow-up reports. This is the DD value proposition. A screen-share advisory session is insufficient because the deal team needs ongoing self-service access throughout the deal evaluation period.

**Architecture required:**
- Customer-facing LENS access (hosted, not localhost)
- Authentication and workspace scoping
- SKU-based mode gating — all 4 modes enabled for SA-DD
- Access duration enforcement (30-day window)
- Customer isolation — deal team sees only their target's data

**Product gap dependency:** PG-003 (SKU Gating) is needed to restrict future SA customers to BOARDROOM + BALANCED while SA-DD gets all 4 modes. However, SA-DD can be fulfilled WITHOUT PG-003 by deploying a full-access instance — since SA-DD already grants all 4 modes, no gating is needed for the first SA-DD delivery. PG-003 becomes necessary only when SA and SA-DD coexist on the same hosted instance.

### 2.3 SC Consumption Requirements

**Contract promise:** Everything in SA-DD + multiple assessment runs + qualification progression + structural escalation + annual subscription.

**Architecture required (beyond SA-DD):**
- Cross-session qualification progression (PG-001) — the customer tracks how structural posture evolves
- Multi-run comparison (PG-002) — the customer compares assessment results across runs
- SKU gating (PG-003) — mode restriction when SA/SA-DD/SC coexist
- Persistent workspace with multi-run history
- Named user identity (customer tracks who accessed what)

**Current state:** NOT deliverable. Three blocking product gaps (PG-001, PG-002, PG-003).

### 2.4 SE Consumption Requirements

**Contract promise:** Everything in SC + operator authority workflow + RBAC + multi-program topology + custom domain modules.

**Architecture required (beyond SC):**
- Production RBAC (PG-004) — 5 roles with enforcement, not just declaration
- Multi-program intelligence (PG-005) — cross-program aggregation, portfolio view
- Role-based identity with authority enforcement
- Dedicated tenant isolation
- Full SQO cockpit exposure to authorized customer roles

**Current state:** NOT deliverable. Five blocking product gaps (PG-001 through PG-005).

---

## 3. CUSTOMER EXPERIENCE — WHAT EACH BUYER ACTUALLY ENCOUNTERS

### 3.1 SA Customer Experience

```
Day 1:  Customer provides repository access
Day 2-3: Signäl runs structural analysis (invisible to customer)
Day 3-4: Customer receives Structural Verdict + Evidence Record
Day 4-5: Advisory session — advisor walks customer through LENS

Customer's experience:
  1. Receives governed documents (Structural Verdict, Evidence Record)
  2. Participates in advisory walkthrough — advisor drives LENS, explains findings
  3. Explores LENS independently at BOARDROOM + BALANCED

After engagement:
  - Customer retains artifacts permanently
  - LENS access ends with engagement period
  - Customer may convert to SC for ongoing access
```

**Architectural implication:** The SA customer experience is a combined product: governed artifacts + LENS cognitive projection + advisory walkthrough. LENS BOARDROOM and BALANCED are part of the product itself — they are cognitive experiences, not delivery wrappers. For SA, LENS access can be delivered via screen-share or hosted instance, but it is part of the engagement, not an add-on.

### 3.2 SA-DD Customer Experience

```
Day 1:  Customer provides repository access
Day 2-3: Signäl runs structural analysis
Day 3-4: LENS workspace provisioned + artifacts delivered
Day 4-5: Advisory session — deal-grade framing

Deal team's experience (days 1-30):
  1. Receives Structural Verdict + Evidence Record
  2. Advisory session with deal-grade positioning
  3. Self-service LENS exploration — all 4 modes
  4. Guided structural investigation — 76+ queries in DENSE
  5. Share LENS access with IC members (up to 10 users)
  6. Export Evidence Record with investigation trail
  7. Append to investment committee package

After 30 days:
  - LENS access expires
  - Exported artifacts are customer's property
  - Re-engagement creates new workspace
```

**Architectural implication:** SA-DD is the first SKU where the customer MUST have independent LENS access. The deal team explores without the advisor present. Multiple users access simultaneously. This requires: hosted LENS, authentication, workspace isolation, access expiration.

### 3.3 SC Customer Experience

```
Ongoing:
  - Customer triggers assessment runs (on demand or scheduled)
  - Compares structural posture across runs — tracks evolution
  - Self-service investigation at all times
  - Quarterly advisory review with Signäl team
  - Named users with activity tracking

Customer's experience (annual):
  - "We ran the assessment after the Q3 refactoring. Coupling inertia dropped.
    But execution fragility in the payments domain increased. Why?"
  - Customer navigates run-over-run comparison in LENS
  - Customer explores qualification progression
```

**Architectural implication:** SC is a self-service structural intelligence capability. The customer drives. The advisor reviews periodically. This requires persistent state, cross-run comparison, qualification continuity, named user identity.

### 3.4 SE Customer Experience

```
Ongoing:
  - Enterprise operates its own structural intelligence program
  - Multiple programs assessed across the portfolio
  - Role-based access — analysts, operators, authorities
  - Governed qualification workflows managed by customer operators
  - Custom domain modules activated per portfolio need

Customer's experience (multi-year):
  - "Show me structural posture across our 5 portfolio companies."
  - CTO delegates to Chief Architect (OPERATOR role)
  - Chief Architect manages qualification progression
  - Board receives BOARDROOM projection quarterly
```

**Architectural implication:** SE is a platform. The customer IS the operator (with roles). Signäl provides the platform, modules, and strategic advisory. This requires full RBAC enforcement, multi-program aggregation, dedicated tenant isolation, custom module activation.

---

## 4. ADVISOR EXPERIENCE — ADVISORY COGNITIVE AUGMENTATION

### 4.1 The Advisory Problem

The advisor must understand, explain, challenge, present, and commercialize all of Program Intelligence — across doctrine, commercial packaging, specimen intelligence, assessment outputs, and governance posture.

This is not a navigation problem (finding the right dashboard). This is an advisory cognition problem: how does the advisor form the right understanding of a specimen's structural reality, build the right narrative for a specific audience, and deliver the right positioning for a specific commercial context?

### 4.2 What the Advisory Workbench Produces

The Workbench produces governed advisory output. It does not merely read — it generates:

| Output Category | What It Produces | Example |
|----------------|-----------------|---------|
| **Explanations** | Structural concept explanations calibrated to audience | "Here's what coupling inertia means for your integration timeline" |
| **Narratives** | Advisory narratives for engagement delivery | Executive brief walkthrough structure, finding sequence design |
| **Positioning** | Commercial positioning from structural evidence | "Your target's structural posture is comparable to what we see in..." |
| **Comparisons** | Cross-specimen or cross-run structural comparison | "Here's how this target compares to the other three you're evaluating" |
| **Challenge vectors** | Structural challenges for deal teams | "Here's what the structure suggests about post-acquisition velocity" |
| **Customer explanations** | Pre-built answers to anticipated questions | "When the IC asks about the ESCALATE posture, here's the evidence basis" |

**Constitutional boundary:** The Workbench never mutates Program Intelligence truth. It never creates findings, modifies findings, alters verdicts, or overrides governance. Qualification remains exclusively inside Program Intelligence. The 13 absolute prohibitions apply fully.

**The distinction:** "Never mutates PI truth" is different from "writes nothing." The Workbench produces real advisory output — narratives, comparisons, positioning, framing. These are outputs governed by advisory authority, not by cognition authority. They are advisory cognition, not Program Intelligence cognition.

### 4.3 Advisory Workbench Architectural Position

The Workbench is NOT a consumer in the cognition chain (CIP → PICR → PICP → PRE → Consumer). It does not consume PICP through PRE. It consumes heterogeneous sources ACROSS the architecture:

| Knowledge Layer | What the Workbench Reads | Purpose |
|----------------|-------------------------|---------|
| **Doctrine** | Vault, governance, constitution, CLAUDE.md | Understand the system's own rules and boundaries |
| **Commercial** | Offers, pricing, SKU model, positioning, packaging | Frame structural findings in commercial context |
| **Specimen** | Specimen-level structural facts, topology, signals, conditions | Understand THIS specimen's structural reality |
| **Assessment** | Findings, consequences, verdicts, evidence records | Know exactly what the assessment concluded |
| **Qualification** | SQO state, posture, blockers, progression | Know where this specimen stands in qualification |
| **LENS Context** | Active mode, current view, current run, exploration state | Understand what the advisor is currently looking at |

**Reads across the architecture, never through the cognition chain.** This is why the Workbench is not Consumer #3 — it reads at multiple points (evidence, derivation, packaging, projection, governance), not at the single PICP → PRE consumption point.

### 4.4 Advisory Authority Model

The Workbench operates under its own output authority — distinct from both the cognition chain authority (L4/L5) and from LENS 75.x persona authority:

| Dimension | LENS 75.x | Advisory Workbench |
|-----------|----------|-------------------|
| **Audience** | Customer | Advisor (operator) |
| **Purpose** | Help customer understand structural reality | Help advisor understand, explain, position, challenge, sell, and advise structural reality |
| **Output visibility** | Customer sees it directly in LENS | Advisor only. Customer never sees Workbench output directly. |
| **Evidence binding** | Every statement traces to structural evidence | Evidence-compatible — narratives must not contradict evidence, but may reframe for audience and commercial context |
| **Finding creation** | Prohibited | Prohibited |
| **PI truth mutation** | Prohibited | Prohibited |
| **Commercial framing** | Not permitted (customer-facing) | Permitted (advisor-facing) — positioning, comparison, competitive framing |
| **13 prohibitions** | Enforced | Enforced — no team behavior, no org intent, no human motive, no cultural diagnosis |

**Governance boundary:** The Workbench may interpret, explain, position, narrate, and commercialize. It may produce advisory output that the advisor uses to prepare sessions, build narratives, and frame findings. It may NOT create structural findings, modify assessment results, alter verdicts, or bypass qualification governance.

### 4.5 Advisory Workbench and SKU Consumption

The Workbench becomes more valuable as the SKU tier increases:

| SKU | Advisory Workbench Role |
|-----|------------------------|
| **SA** | Prepare advisory session narrative. Build walkthrough sequence. Anticipate customer questions. Explain findings in customer's domain context. |
| **SA-DD** | Everything in SA + position findings for investment committee. Build deal-grade narrative. Prepare competitive framing. Anticipate IC challenges. Frame evidence for deal-team consumption. |
| **SC** | Everything in SA-DD + prepare quarterly reviews. Compare runs. Narrate structural evolution. Position qualification progression for customer leadership. |
| **SE** | Everything in SC + manage strategic advisory relationship. Portfolio-level narrative. Cross-program comparison. Governance posture briefing for enterprise CTO. |

SA advisory is a single walkthrough. SE advisory is an ongoing strategic intelligence partnership. The Workbench scales from "prepare a 60-minute session" to "manage a multi-year advisory engagement."

---

## 5. THREE-SURFACE ARCHITECTURE — DERIVED FROM CUSTOMER AND ADVISOR EXPERIENCE

Given the customer experience (§3) and advisor experience (§4), three distinct surfaces emerge:

### Surface 1 — Customer Surface

**Derived from:** SA/SA-DD/SC/SE customer experiences. The customer needs governed access to their structural intelligence — artifacts, LENS exploration, qualification state (SC/SE).

**Who:** The buyer and their delegates (CTO, VP Eng, deal team, IC members, board).

**Contains:**
- LENS — interactive structural intelligence surface (mode-gated per SKU)
- Assessment Package — Structural Verdict + Evidence Record
- Qualification state (SC/SE only — posture, progression, run comparison)
- SQO Cockpit (SE only — role-gated)

**Does not contain:**
- Other customers' data
- SQO qualification internals (SA, SA-DD)
- Operator authority workflow (SA, SA-DD, SC)
- Pipeline mechanics, vault, doctrine, governance streams
- Advisory Workbench

**Access model:** Authenticated, workspace-scoped, time-bounded, SKU-gated.

### Surface 2 — Advisor Surface

**Derived from:** Advisory cognition requirements (§4). The advisor needs to understand, prepare, explain, position, and deliver structural intelligence to customers.

**Who:** Signäl operators, advisory consultants, founder.

**Contains:**
- Everything on the Customer Surface (same LENS, same data)
- Advisory Workbench — advisory cognitive augmentation (6 modes, 7 question categories)
- All cognitive modes (regardless of SKU gating)
- Pipeline status, qualification state, governance posture
- Commercial authority, doctrine, specimen context
- Full SQO visibility and authority actions

**Access model:** Operator-authenticated, all-workspace access, persistent.

### Surface 3 — Platform Surface

**Derived from:** The system's own computational and governance requirements.

**Who:** The system itself. No human user directly consumes this surface.

**Contains:**
- Runtime — CIP → PICR → PICP → PRE pipeline
- Vault — architectural memory, canonical state
- Pipeline — evidence ingestion, structural derivation, semantic compilation
- SQO — qualification state machine, authority workflow
- Governance — CLAUDE.md, git structure contract, stream discipline

**Consumed by:**
- Customer Surface consumes its outputs (via LENS and Assessment Package)
- Advisor Surface consumes its outputs AND its metadata (via Advisory Workbench)

### Surface Nesting

```
┌──────────────────────────────────────────────────────┐
│                  PLATFORM SURFACE                     │
│                                                       │
│   CIP → PICR → PICP → PRE    Pipeline    SQO        │
│   Vault    Governance    Evidence    Streams           │
│                                                       │
│         ┌───────────────────────────────────┐         │
│         │        ADVISOR SURFACE            │         │
│         │                                   │         │
│         │   Advisory Workbench              │         │
│         │     (advisory cognitive           │         │
│         │      augmentation — produces      │         │
│         │      governed advisory output)    │         │
│         │   Full LENS (all modes)           │         │
│         │   Pipeline + SQO visibility       │         │
│         │   Doctrine + Commercial context   │         │
│         │                                   │         │
│         │     ┌───────────────────────┐     │         │
│         │     │  CUSTOMER SURFACE     │     │         │
│         │     │                       │     │         │
│         │     │  LENS (SKU-gated)     │     │         │
│         │     │  Assessment Package   │     │         │
│         │     │  Evidence Record      │     │         │
│         │     │                       │     │         │
│         │     └───────────────────────┘     │         │
│         └───────────────────────────────────┘         │
└──────────────────────────────────────────────────────┘
```

**Nesting rule:** Customer ⊂ Advisor ⊂ Platform (in terms of data access). No surface may access data from a surface that does not contain it. The Advisory Workbench is advisor-specific tooling with its own output authority — it is not a data subset.

---

## 6. CONSUMPTION MATURITY — WHAT EACH SKU LEVEL REQUIRES

Derived from the per-SKU requirements (§2) and customer experiences (§3):

### Level 0 — Export Only (SA today)

```
Operator runs pipeline → generates Assessment Package → delivers to customer
Customer never needs to authenticate with LENS
Advisory session uses screen-share or in-person walkthrough
```

**Identity required:** None. Operator delivers artifacts.
**Hosting required:** None. Pipeline runs operator-local.
**What it fulfills:** SA minimum viable. LENS access is contractual but can be delivered via screen-share.

### Level 1 — Guided Access (SA-DD requires)

```
Customer receives LENS access URL
Authentication gates access to their workspace
SKU determines which modes are available
Advisor has same access + Workbench
```

**Identity required:** Workspace token (opaque, shared — anyone with the token accesses the workspace). Satisfies "up to 10 concurrent users" without user management.
**Hosting required:** Single hosted LENS instance with workspace routing.
**What it fulfills:** SA-DD. The deal team explores independently for 30 days.

### Level 2 — Self-Service (SC requires)

```
Customer triggers assessment runs
Compares runs over time
Persistent qualification tracking
Named users with activity tracking
```

**Identity required:** Named users (email-based, activity tracking per user).
**Hosting required:** Persistent hosted workspace. Multi-run storage.
**What it fulfills:** SC. Requires PG-001 (cross-session progression) + PG-002 (multi-run comparison) + PG-003 (SKU gating).

### Level 3 — Platform (SE requires)

```
Customer operates their own qualification
Role-based access (5 RBAC roles)
Multi-program portfolio view
Custom domain modules
```

**Identity required:** Role-based identity with enforcement (VIEWER, ANALYST, OPERATOR, ADMINISTRATOR, AUTHORITY). SQOActionEngine already defines these roles declaratively — the gap is enforcement.
**Hosting required:** Dedicated instance per customer. Full tenant isolation.
**What it fulfills:** SE. Requires all product gaps (PG-001 through PG-005).

---

## 7. WORKSPACE MODEL

### 7.1 Definition

A workspace is a customer-scoped environment containing everything needed for one engagement.

```
WORKSPACE = {
    client_id:       string     // e.g. "blueedge"
    run_id:          string     // e.g. "run_blueedge_genesis_e2e_03"
    sku:             SKU        // SA, SA-DD, SC, SE
    created:         timestamp
    expires:         timestamp  // null for SC/SE (subscription/license)
    access_token:    string     // workspace-scoped (Level 1+)
    status:          lifecycle  // CREATED → PROVISIONING → ACTIVE → EXPIRING → EXPIRED → ARCHIVED
    modes_enabled:   Mode[]     // derived from SKU
    exports:         Artifact[] // generated assessment packages
}
```

**Current implementation already provides workspace-like structures:**
- `clients/{client}/` — client directory with registration, evidence, runs
- `clients/{client}/psee/runs/{run_id}/` — per-run artifacts
- Manifest files in `app/execlens-demo/lib/lens-v2/manifests/` — LENS REGISTRY entries
- `ClientScopedSectionResolver` — runtime isolation per client/run

What is missing: access control, expiration, SKU gating, external URL routing.

### 7.2 Workspace Lifecycle

```
CREATED ──→ PROVISIONING ──→ ACTIVE ──→ EXPIRING ──→ EXPIRED ──→ ARCHIVED
```

| State | Trigger | What Happens |
|-------|---------|-------------|
| **CREATED** | Engagement agreement signed | Client directory created. client.yaml written. Source registered. |
| **PROVISIONING** | Evidence intake complete | Pipeline executes. Structural analysis. Assessment Package generated. LENS manifest created. |
| **ACTIVE** | Provisioning complete | Customer receives access. LENS workspace live. Artifacts downloadable. Advisory session scheduled. |
| **EXPIRING** | T-7 days before expiration | Notification sent. Customer can export remaining artifacts. |
| **EXPIRED** | Access duration exceeded | Customer URL returns "workspace expired." No data deletion. |
| **ARCHIVED** | Retention period complete | Data archived per agreement. Workspace metadata retained for governance lineage. |

### 7.3 Per-SKU Workspace Lifecycle

| SKU | Lifecycle | Access Duration | Notes |
|-----|-----------|----------------|-------|
| SA | CREATED → PROVISIONING → ACTIVE → EXPIRED | Engagement period (~5 days) | May not require hosted LENS. Exports delivered. |
| SA-DD | CREATED → PROVISIONING → ACTIVE → EXPIRING → EXPIRED → ARCHIVED | 30 days from provisioning | Full lifecycle. Re-engagement creates new workspace. |
| SC | CREATED → PROVISIONING → ACTIVE (perpetual during subscription) | Annual (renewing) | New runs create workspace versions. Expiration = non-renewal. |
| SE | CREATED → PROVISIONING → ACTIVE (perpetual during license) | License term | Platform access. Expiration = contract end. |

**Post-expiration invariant:** Exported artifacts (Structural Verdict, Evidence Record) are the customer's permanent property. LENS access is revoked. Pipeline data is retained by Signäl per governance requirements.

---

## 8. ACCESS ARCHITECTURE

### 8.1 Customer Identity Model

| Level | Mechanism | Required For | How It Works |
|-------|-----------|-------------|-------------|
| **Level 0** | None | SA (export-only) | Operator delivers artifacts. No authentication. |
| **Level 1** | Workspace token | SA-DD (30-day access) | Opaque token scoped to one workspace. Anyone with the token accesses the workspace. No individual user identity. |
| **Level 2** | Named users | SC (annual subscription) | Email-based identity. Named users assigned to workspace. Activity tracking per user. |
| **Level 3** | Role-based identity | SE (enterprise platform) | Named users with RBAC roles. Role determines available actions. 5 roles already defined in SQOActionEngine. |

### 8.2 Advisor Identity Model

Advisors are operators. Distinct from the customer identity model:

| Aspect | Model |
|--------|-------|
| **Authentication** | Operator-level (infrastructure access, not workspace-scoped) |
| **Authorization** | All workspaces, all modes, all data |
| **Persistence** | Permanent (not engagement-scoped) |
| **Advisory Workbench** | Available to all advisor identities |
| **SQO authority** | Full operator role |

### 8.3 Customer Isolation

| Isolation Boundary | Current State | Required State |
|-------------------|---------------|---------------|
| Data isolation | ClientScopedSectionResolver — fail-closed, no cross-client data leakage | Sufficient at runtime level |
| URL isolation | Single LENS instance, all clients accessible via URL | Workspace-scoped URLs. Authentication required. |
| Export isolation | Exports contain only workspace data | Already satisfied |
| Visual isolation | SQO cockpit, governance, other clients visible in navigation | Customer routes must hide non-customer surfaces |
| Pipeline isolation | Shared infrastructure | Runs are sequential per client. No cross-contamination. |

**Key insight:** Data isolation already works. The gap is access-control isolation — preventing unauthorized navigation, not preventing data leakage.

---

## 9. HOSTING STRATEGY — DERIVED FROM SKU REQUIREMENTS

### 9.1 Options

| Option | Model | Sufficient For |
|--------|-------|---------------|
| **A — Operator-Local** | Mac Mini, localhost:3000 | SA at Level 0 (current) |
| **B — Single Hosted Instance** | Cloud VM, lens.signal.com, workspace routing | SA-DD (Level 1), early SC (Level 2) |
| **C — Per-Customer Instance** | Dedicated VM per customer | SE (Level 3) |
| **D — Hybrid** | Operator-local pipeline + hosted customer LENS | Recommended strategy |

### 9.2 Recommended Strategy (Option D — Hybrid)

```
Operator-Local (pipeline execution, advisory preparation, Workbench)
    ↓
Single Hosted Instance (customer LENS access — SA-DD, SC)
    ↓
Per-Customer Instance (SE only, when commercially justified)
```

The pipeline stays operator-local: security, IP protection, operational control. Customer-facing LENS is a hosted read-only projection. SE customers get dedicated instances when the engagement scale justifies it.

| SKU | Pipeline Execution | Customer LENS | Advisor Access |
|-----|-------------------|--------------|----------------|
| SA | Operator-local | Optional (screen-share or hosted) | Operator-local + Workbench |
| SA-DD | Operator-local | Single hosted instance (30-day token) | Operator-local + Workbench |
| SC | Operator-local (scheduled) | Single hosted instance (annual subscription) | Operator-local + Workbench |
| SE | Operator-local or customer-hosted | Dedicated instance | Operator-local + Workbench |

---

## 10. CUSTOMER LENS EXPOSURE MODEL

Customer LENS is a **read-only projection** of workspace intelligence. It is NOT the operator's development instance.

| Dimension | Operator LENS | Customer LENS |
|-----------|--------------|---------------|
| **Data** | All clients, all runs | Single workspace only |
| **Modes** | All 5 (including INVESTIGATION placeholder) | SKU-gated subset |
| **SQO** | Full cockpit + authority workflow | Hidden (SA/SA-DD). Read-only posture (SC). Role-gated (SE). |
| **Navigation** | All routes, all sections | Workspace-scoped routes only |
| **Export** | Operator-initiated Assessment Package | Customer-downloadable (if enabled per SKU) |
| **Advisory Workbench** | Available | Not available |

### Customer LENS Route Model

```
SA Customer:
    /ws/{token}/lens                     → BOARDROOM (default)
    /ws/{token}/lens/balanced            → BALANCED
    /ws/{token}/export/verdict           → Download Structural Verdict
    /ws/{token}/export/evidence-record   → Download Evidence Record

SA-DD Customer:
    /ws/{token}/lens                     → BOARDROOM (default)
    /ws/{token}/lens/balanced            → BALANCED
    /ws/{token}/lens/dense               → DENSE (with guided queries)
    /ws/{token}/lens/operator            → OPERATOR
    /ws/{token}/export/verdict           → Download Structural Verdict
    /ws/{token}/export/evidence-record   → Download Evidence Record

SC Customer:
    Everything in SA-DD
    /ws/{token}/runs                     → Run comparison view
    /ws/{token}/lens/{run_id}            → Per-run LENS access

SE Customer:
    Everything in SC
    /ws/{token}/sqo                      → SQO Cockpit (role-gated)
    /ws/{token}/authority                → Authority Workflow (role-gated)
    /ws/{token}/programs                 → Multi-program view
```

---

## 11. PRODUCT GAP TO CONSUMPTION ALIGNMENT

| Gap | What It Blocks | Consumption Level Required |
|-----|---------------|--------------------------|
| PG-001 | SC multi-run continuity | Level 2 (Self-Service) |
| PG-002 | SC run-over-run comparison | Level 2 (Self-Service) |
| PG-003 | Mode restriction per SKU | Level 1+ (when SA and SA-DD coexist) |
| PG-004 | SE role-based enforcement | Level 3 (Platform) |
| PG-005 | SE portfolio aggregation | Level 3 (Platform) |

### Critical Path

| Level | Gaps Required | Architecture Required | SKU |
|-------|--------------|----------------------|-----|
| Level 0 | None | Assessment Package generation (OPERATIONAL) | SA |
| Level 1 | PG-003 (deferred — see §2.2) | Hosted LENS + workspace token + expiration | SA-DD |
| Level 2 | PG-001 + PG-002 + PG-003 | Persistent workspace + named identity + multi-run | SC |
| Level 3 | All (PG-001–PG-005) | Dedicated tenant + RBAC enforcement + multi-program | SE |

### Evolution Paths

**Identity evolution:**
```
None → Workspace token → Named users → Role-based identity → Enterprise SSO
```

**Hosting evolution:**
```
Operator-local → Single hosted instance → Multi-workspace → Dedicated tenant
```

**Program scope evolution:**
```
Single program → Multi-run single-program → Multi-program → Cross-portfolio
```

Each level builds on the previous. No level requires the next.

---

## 12. CANONICAL BOUNDARY DEFINITIONS

### Boundary 1: Customer ↔ Advisor

The customer never sees the Advisor Surface. The advisor always sees the Customer Surface.

| What Crosses | Direction | Mechanism |
|-------------|-----------|-----------|
| Assessment Package | Advisor → Customer | Operator generates, delivers |
| LENS access credentials | Advisor → Customer | Operator provisions workspace |
| Advisory session | Advisor ↔ Customer | Live walkthrough using Customer LENS |
| Advisory Workbench output | NEVER crosses to customer | Advisor-only. Informs the advisor's delivery, not the customer's surface. |

### Boundary 2: Advisor ↔ Platform

The advisor reads the Platform Surface. The advisor modifies it only through governed authority actions.

| What Crosses | Direction | Mechanism |
|-------------|-----------|-----------|
| Pipeline execution | Advisor → Platform | Operator triggers pipeline |
| SQO authority actions | Advisor → Platform | Governed mutations via SQOActionEngine |
| All data | Platform → Advisor | Full read access |
| Advisory Workbench queries | Advisor → Platform (read) | Workbench reads across platform sources |

### Boundary 3: Customer ↔ Platform

The customer NEVER directly touches the Platform Surface. All customer access is mediated by the Customer Surface.

| What Crosses | Direction | Mechanism |
|-------------|-----------|-----------|
| Workspace intelligence | Platform → Customer | LENS renders workspace data |
| Export artifacts | Platform → Customer | Assessment Package download |
| Customer authority actions (SE only) | Customer → Platform | Governed by RBAC role and workspace permissions |

### Boundary 4: Advisory Workbench ↔ Program Intelligence Truth

The Advisory Workbench produces governed advisory output. It never mutates Program Intelligence truth.

```
                    ADVISORY WORKBENCH
                    ┌─────────────────────────┐
    READS ──────────│  Doctrine               │────────── PRODUCES
    (across the     │  Commercial authority   │           (advisory
     architecture)  │  Specimen intelligence  │            output under
                    │  Assessment outputs     │            advisory
                    │  Qualification state    │            authority)
                    │  LENS context           │
                    └─────────────────────────┘
                              │
                         NEVER MUTATES
                              │
                    Program Intelligence truth
                    (findings, verdicts, evidence,
                     qualification, governance)
```

This replaces the v0.8 formulation "reads everything, writes nothing" with the constitutionally accurate: **produces governed advisory output, never mutates PI truth.**

---

## 13. FUTURE STREAM RECOMMENDATIONS

Ordered by commercial urgency — what the frozen contracts require:

### Stream 1 — SA Delivery Operationalization (IMMEDIATE)

**Why:** SA is sellable today. The delivery process must be repeatable without depending on Claude Code session context.

**Scope:** Pipeline execution → Assessment Package generation → advisory session preparation → delivery → customer handoff. Formalize as a governed delivery playbook.

**Dependency:** None. Current runtime is sufficient.

### Stream 2 — Advisory Workbench Foundation (PARALLEL with Stream 1)

**Why:** The Workbench makes SA and SA-DD advisory sessions more effective immediately — before any hosting infrastructure exists. Advisory cognitive augmentation is valuable at Level 0 (export-only).

**Scope:** Context assembly (6 knowledge layers), intent detection (7 categories), MVP capabilities (Explain, Position, Present modes). Governed advisory output under advisory authority.

**Dependency:** None for MVP. Runs on the Advisor Surface (operator-local).

### Stream 3 — Customer LENS Hosting (SA-DD PREREQUISITE)

**Why:** SA-DD requires customer-facing LENS access. 30-day self-service exploration is the DD value proposition.

**Scope:** Single hosted LENS instance. Workspace token authentication. Customer-only route subset. 30-day expiration. Assessment Package download.

**Dependency:** PG-003 (SKU gating) is deferrable for first SA-DD delivery — SA-DD grants all 4 modes, so no gating needed when only SA-DD workspaces exist.

### Stream 4 — Workspace Lifecycle Engine (SC PREREQUISITE)

**Why:** SC requires persistent multi-run workspaces with qualification continuity.

**Scope:** Workspace provisioning. Multi-run storage. Named user identity. Workspace expiration (subscription-based).

**Dependency:** PG-001 (cross-session progression) + PG-002 (multi-run comparison) + PG-003 (SKU gating) + Stream 3 (hosting).

### Stream 5 — Enterprise Consumption Architecture (SE PREREQUISITE)

**Why:** SE requires platform-level access with full RBAC enforcement.

**Scope:** Identity Level 3. SQOActionEngine enforcement. Portfolio view. Dedicated tenant. Multi-program aggregation.

**Dependency:** All of the above + PG-004 (RBAC) + PG-005 (multi-program).

### Recommended Execution Sequence

```
NOW (parallel):
    Stream 1 — SA Delivery Operationalization
    Stream 2 — Advisory Workbench Foundation

NEXT (SA-DD enablement):
    Stream 3 — Customer LENS Hosting
    (PG-003 deferred — not needed for first SA-DD delivery)

THEN (SC enablement):
    PG-001 + PG-002 + PG-003
    Stream 4 — Workspace Lifecycle Engine

FUTURE (SE enablement):
    PG-004 + PG-005
    Stream 5 — Enterprise Consumption Architecture
```

---

## 14. WORKING DEFINITION

> **Program Intelligence Consumption Architecture** is the governed system of surfaces, workspaces, access models, and boundaries through which customers and advisors interact with structural intelligence — derived from the frozen commercial contracts (SA, SA-DD, SC, SE) that define what each buyer receives, and constrained by the cognition consumption architecture (CIP → PICR → PICP → PRE) that defines how intelligence is formed and projected.
>
> Three surfaces (Customer, Advisor, Platform) nest concentrically: the customer receives governed intelligence, the advisor produces governed advisory cognition to augment delivery, and the platform produces the intelligence itself. The Advisory Workbench is advisory cognitive augmentation — it produces governed advisory output, never mutates Program Intelligence truth.

---

## Cross-References

- [[PRODUCT_GAP_REGISTER]] — 5 open product capability gaps
- [[COMMERCIAL_INFORMATION_ARCHITECTURE]] — commercial tree organization
- [[CONSUMER_PROJECTION_BOUNDARY]] — cognition consumption architecture (CIP → PICR → PICP → PRE → Consumer)
- [[PICP_CONSUMER_CONTRACT]] — what consumers receive and what they may/may not do
- [[SKU_MODEL]] — canonical SKU architecture (frozen)
- [[OFFER_CATALOG]] — purchasable offers (frozen)
- [[SA_PACKAGING]] — SA commercial packaging (frozen)
- [[SA_DD_PACKAGING]] — SA-DD commercial packaging (frozen)
- PI.OPERATOR-COPILOT.ADVISORY-WORKBENCH.01 — Advisory Workbench foundational definition
