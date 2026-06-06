# Program Intelligence Co-Pilot and Customer Access Enablement

**Stream:** PI.ADVISORY-WORKBENCH-AND-CUSTOMER-ACCESS.ENABLEMENT.01
**Classification:** G2 (Architecture Consuming — consumes frozen commercial contracts, consumption architecture, Advisory Workbench charter)
**Date:** 2026-06-02
**Branch:** feature/runtime-demo
**§5.5:** YES — PI Co-Pilot MVP will produce reusable primitives (knowledge graph context assembly, interaction mode engine)

---

## 1. MISSION

Make SA sellable now. Make SA-DD sellable soon. Define exactly what must be built, in what order, with what scope.

The **Program Intelligence Co-Pilot** is the universal intelligence interaction surface for Program Intelligence. It can interrogate anything Program Intelligence knows — doctrine, commercial model, runtime architecture, specimen evidence, structural verdict, and publishing assets — from a single surface.

The Co-Pilot is not architecturally dependent on any single artifact. It operates:

- **Before a specimen exists** — explain PI, compare against competitors, explain the commercial model, explore governance, position the category
- **During runtime** — what is emerging, what appears unusual, which clusters dominate, what should I investigate
- **After verdict generation** — explain the verdict, defend findings, curate consumption artifacts for specific audiences
- **Outside a specimen entirely** — what is Program Intelligence, what is the moat, how does the pricing model work, what is the difference between SA and SA-DD

The Structural Verdict is the richest context the Co-Pilot can consume — but it is not a prerequisite.

The Co-Pilot never creates intelligence. It never changes findings. It never changes evidence. It never changes qualification. It interrogates, explains, curates, and packages what already exists in the PI knowledge graph.

Program Intelligence has two consumption surfaces:
- **LENS** is the customer-side consumption surface — the customer experiences structural reality through it.
- **The PI Co-Pilot** is the operator-side consumption surface — the operator interrogates the entire PI knowledge graph and produces consumption artifacts for delivery.

Both surfaces consume the same governed intelligence. They differ in audience, authority, and what they produce. This stream defines the MVP of both surfaces and the access architecture that connects them to their respective audiences.

---

## 2. BINDING INPUTS

| Input | Source | What It Decides |
|-------|--------|----------------|
| SA commercial contract | SA_PACKAGING.md (frozen) | Assessment Package + LENS (BOARDROOM + BALANCED) + Advisory session |
| SA-DD commercial contract | SA_DD_PACKAGING.md (frozen) | All SA + full LENS (4 modes) + 76+ queries + 30-day access + 10 users |
| Consumption architecture | PI.CONSUMPTION-AND-ACCESS-ARCHITECTURE.01 v1.0 | Three surfaces, consumption levels, workspace model |
| Advisory Workbench charter | PI.OPERATOR-COPILOT.ADVISORY-WORKBENCH.01 (user-provided) | 6 modes, 7 question categories, 6 knowledge layers, advisory cognition |
| Product Gap Register | PRODUCT_GAP_REGISTER.md | SA: 0 blockers, SA-DD: 0 blockers |
| Runtime reality | app/execlens-demo (Next.js 14, pages router) | What exists today |

---

## 3. SA DELIVERY PATH DECISION

### 3.1 The Question

SA promises: Assessment Package + LENS (BOARDROOM + BALANCED) + Advisory Session.

How does the customer experience LENS?

### 3.2 Options

| Option | What Happens | Pros | Cons |
|--------|-------------|------|------|
| **A — Screen-share only** | Advisor drives LENS during 60-90 min session. Customer sees LENS through screen-share. No independent access. | Zero infrastructure. Sellable today. | Customer can't explore independently. No persistent access. |
| **B — Screen-share now + time-boxed hosted access** | Screen-share during advisory session. After session, customer receives a hosted LENS link (BOARDROOM + BALANCED) for the engagement period (~5 days). | Combined experience. Customer explores after walkthrough. | Requires hosting infrastructure for LENS access window. |
| **C — Hosted from day one** | Customer receives hosted LENS link at provisioning (day 3-4). Advisory session uses live LENS (advisor + customer both on hosted instance). | Full product experience from delivery. | Requires hosting before first sale. |

### 3.3 Decision

**Phase 1 (NOW): Option A — Screen-share.**

SA is sellable today with screen-share delivery. The advisory session IS the LENS experience — the advisor drives BOARDROOM and BALANCED, walks through topology, explains findings, demonstrates structural reality. The customer retains the Assessment Package (Structural Verdict + Evidence Record) as permanent governed artifacts.

This is not a compromise — it is the designed engagement model for a per-engagement advisory delivery. The advisor's guided walkthrough is more valuable than unsupported self-service exploration for a first-time buyer.

**Phase 2 (SOON — when SA-DD hosting exists): Option B — Screen-share + access window.**

Once Customer LENS hosting exists for SA-DD (which requires it), SA customers get hosted LENS access as a natural byproduct. The infrastructure built for SA-DD serves SA at zero marginal cost. No separate SA hosting stream needed.

### 3.4 SA Delivery Playbook (Phase 1)

```
PRE-ENGAGEMENT (Day 0)
├── Engagement agreement signed
├── Client directory created (client.yaml)
├── Source access confirmed
└── Co-Pilot (Level 0): EXPLAIN + COMPARE + POSITION
    └── Explain: domain context, structural vocabulary, PI concepts
    └── Compare: how PI differs from what the prospect currently uses
    └── Position: industry framing, buyer-specific narrative

PIPELINE (Day 1-3)
├── Evidence intake (repository access, dependency exports)
├── Pipeline execution (operator-local Mac Mini)
├── Structural analysis complete
├── Assessment Package generated:
│   ├── Structural Verdict (9-chapter HTML)
│   └── Evidence Record (self-contained HTML)
└── LENS manifest registered

ADVISORY PREPARATION (Day 3-4)
├── Co-Pilot (Level 2): CURATE
│   ├── Generate audience-specific consumption artifact for this buyer
│   ├── Identify highest-impact findings for this audience
│   └── Build walkthrough sequence (which findings first, which topology zones)
├── Co-Pilot (Level 2): EXPLAIN
│   ├── Deep understanding of key findings before delivery
│   └── Prepare structural assets for walkthrough
├── Verify LENS rendering (BOARDROOM + BALANCED both clean)
└── Co-Pilot (Level 2): CHALLENGE
    └── Pre-test: what pushback will the customer raise?

DELIVERY (Day 4-5)
├── Deliver Assessment Package to customer (email/deal room)
├── Advisory session (60-90 min):
│   ├── Screen-share LENS
│   ├── Open in BOARDROOM — posture, headline findings, consequence landscape
│   ├── Transition to BALANCED — operational dynamics, causal understanding
│   ├── Walk topology — show where constriction, fragility, divergence concentrate
│   ├── Present 3-5 highest-impact findings (4-field format)
│   ├── Present operational ceiling assessment
│   ├── Close with governance boundary — what is confirmed, unverified, prohibited
│   └── Q&A — supported by Co-Pilot EXPLAIN + EXPLORE
└── Customer retains: Structural Verdict + Evidence Record

POST-DELIVERY
├── Co-Pilot: CURATE
│   └── Generate follow-up summary, conversion assessment (SA → SC potential)
├── Co-Pilot: PACKAGE (if applicable)
│   └── Generate briefing note or executive one-pager for internal distribution
└── Engagement record archived
```

---

## 4. PROGRAM INTELLIGENCE CO-PILOT

### 4.1 Primary Purpose — Universal Intelligence Interaction Surface

The PI Co-Pilot is the universal intelligence interaction surface for Program Intelligence. It can interrogate anything Program Intelligence knows — from a single surface.

The Co-Pilot is NOT:

- a verdict-consumption-only tool
- a consultant tool
- an advisory platform
- a sales assistant
- a retrieval assistant

Those are secondary effects of a broader capability.

The Co-Pilot can answer any question the PI knowledge graph can support. The Structural Verdict is the richest context it can consume — but it is not a prerequisite.

**The strategic test:** What value can the Co-Pilot create without changing a single finding, a single piece of evidence, or a single qualification state?

If the answer is: better understanding, better explanation, better comparisons, audience-adapted consumption artifacts, visual enhancement, formatted deliverables, challenge handling, commercial positioning — then it belongs in the Co-Pilot.

If the answer requires: new findings, new evidence, new qualification, new verdicts — then it belongs in Program Intelligence Runtime.

### 4.2 The PI Knowledge Graph

The Co-Pilot interrogates the full PI knowledge graph. Not all layers are always available — context is progressive.

**Knowledge Graph Domains:**

| Domain | What It Contains | Requires Specimen? |
|--------|-----------------|-------------------|
| **Doctrine** | Constitution, spine, evolution model, governance, 13 prohibitions, authority model | NO |
| **Commercial** | Offers, packaging, pricing, positioning, objection handling, competitive differentiation | NO |
| **Runtime** | CIP, PICR, PICP, PRE architecture, cognitive functions, cognition strata | NO |
| **Vault** | Canonical state, terminology, architectural history, concept lineage | NO |
| **Specimen** | Topology, signals, findings, conditions, consequences, qualification state | YES — specimen loaded |
| **Verdict** | 9-chapter content, posture, operational ceiling, governance boundary | YES — verdict generated |
| **Publishing** | Previously generated consumption artifacts, curated narratives, visual assets | YES — artifacts produced |

**Progressive Context Levels:**

```
LEVEL 0 — NO SPECIMEN
    Doctrine + Commercial + Runtime + Vault
    ├── "What is Program Intelligence?"
    ├── "What is the difference between SA and SA-DD?"
    ├── "How does PI compare to SonarQube?"
    ├── "Explain a pressure zone."
    ├── "What is the commercial model?"
    ├── "What is the governance model?"
    └── "How do I explain this category?"

LEVEL 1 — SPECIMEN LOADED (no verdict yet)
    + Specimen
    ├── "What is emerging in this topology?"
    ├── "Which clusters dominate?"
    ├── "What appears unusual?"
    ├── "What should I investigate?"
    ├── "What changed since last run?"
    └── "What is the qualification state?"

LEVEL 2 — VERDICT GENERATED
    + Verdict
    ├── "Explain the verdict."
    ├── "Defend the ESCALATE posture."
    ├── "Generate an Acquisition Risk Summary."
    ├── "Generate a Board Summary."
    ├── "Generate a CTO Summary."
    └── "What would the IC challenge?"

LEVEL 3 — CONSUMPTION ARTIFACTS EXIST
    + Publishing
    ├── "Enhance the IC Brief with topology graphics."
    ├── "Package the Acquisition Risk Summary as a one-pager."
    ├── "Compare the Board Summary to the CTO Summary."
    └── "What has been curated so far?"
```

The Co-Pilot is always useful. Its answers become richer as more context becomes available.

### 4.3 Assembled Operational Context — The Moat

The Co-Pilot is not "Claude with retrieval." The difference is assembled operational context.

Without the Co-Pilot, an operator opens Claude, points it at files, asks questions, and gets generic answers that require manual assembly of specimen facts, commercial positioning, and governance boundaries.

With the Co-Pilot, the operator operates inside a **living operational context** — a pre-assembled cognition state assembled from whichever knowledge graph domains are available.

**At Level 0 (no specimen):**

The Co-Pilot carries PI doctrine, commercial packaging, runtime architecture, and vault state. The operator can explain PI, position it against competitors, prepare for a prospect conversation, or explore governance — all within governed authority.

**At Level 2 (verdict generated — richest context):**

| Context Dimension | What It Contains | Why It Matters |
|------------------|-----------------|---------------|
| **Current Verdict** | 9-chapter content, posture, operational ceiling | The richest artifact — when available, it dominates context |
| **Current Specimen** | Client identity, domain count, cluster topology, structural profile | The operator speaks about THIS program |
| **Current Run** | Run ID, pipeline timestamp, evidence coverage, qualification state | The operator knows exactly what evidence was analyzed |
| **Current Topology** | Domains, clusters, edges, pressure zones, constriction points | The operator references specific structural zones by name |
| **Current Findings** | Named conditions, severity, topology location, consequence attribution | The operator explains each finding in context |
| **Current Offer** | SKU, pricing tier, included surfaces, access terms | The operator frames findings within what the customer bought |
| **Target Audience** | CTO, VP Eng, PE partner, deal team, IC member, board | The operator calibrates for the specific audience |
| **Interaction Mode** | Query, explore, explain, compare, curate, visualize, package, challenge | The operator's intent shapes response construction |
| **Commercial Authority** | Offer catalog, objection handling, competitive positioning | The operator positions commercially without contradicting evidence |
| **PI Doctrine** | 13 prohibitions, governance boundaries, authority model | The operator never exceeds PI's governed authority |

**This assembled context is the moat.** No generic AI assistant carries this context. At Level 2, the Co-Pilot knows: this is BlueEdge, this run produced an ESCALATE posture with coupling inertia in the payments domain, the audience is a PE deal team evaluating acquisition risk, the offer is SA-DD with 30-day access, and the interaction goal is IC presentation preparation. Every response inherits this context.

At Level 0, the Co-Pilot still knows: what Program Intelligence is, how it differs from SonarQube, what SA-DD includes, what the governance model is, what the 13 prohibitions are. That is already more than "Claude with docs."

### 4.4 Interaction Modes

The PI Co-Pilot has 8 interaction modes across 3 tiers. Not all modes require all context levels.

```
PROGRAM INTELLIGENCE KNOWLEDGE GRAPH
        ↓
PI CO-PILOT

1. UNDERSTAND
   ├── Query     — Ask anything across the knowledge graph
   ├── Explore   — Navigate and discover
   └── Explain   — Understand concepts, findings, architecture

2. CURATE (center of gravity when verdict exists)
   ├── Compare   — Differentiate (PI vs competitors, SA vs SA-DD, cross-specimen)
   ├── Curate    — Produce audience-specific consumption artifacts
   └── Challenge — Stress-test findings, handle objections

3. PUBLISH (extends Curate)
   ├── Visualize — Enhance with structural graphics
   ├── Package   — Format into deliverable consumption artifacts
   └── Position  — Frame commercial implications
```

**Per-mode detail:**

| Tier | Mode | Min Context Level | Definition | Examples |
|------|------|------------------|-----------|---------|
| **Understand** | **Query** | Level 0 | Ask anything the knowledge graph can answer | "What is PICP?" "How many cognitive functions exist?" "What does SA-DD include?" |
| **Understand** | **Explore** | Level 0 | Navigate the knowledge graph — discover connections, trace lineage | "Show me the runtime architecture." "What are the 5 cognition strata?" "Walk me through the evidence chain." |
| **Understand** | **Explain** | Level 0 | Understand concepts, findings, or architecture in depth | "Explain convergence." "What does coupling inertia mean for a 200-person org?" "Why does the ESCALATE posture apply?" |
| **Curate** | **Compare** | Level 0 | Differentiate and contrast | "How does PI differ from SonarQube?" "SA vs SA-DD — what's the real difference?" "Compare the payments and platform clusters." |
| **Curate** | **Curate** | Level 2 | Produce audience-specific consumption artifacts from the governed verdict | Acquisition Risk Summary, IC Brief, Board Summary, CTO Summary, Executive Summary, Transformation Summary |
| **Curate** | **Challenge** | Level 1 | Stress-test findings and handle objections with evidence | "The CTO says CI/CD is fast — how does structure respond?" "What if IC questions ESCALATE?" "What are the weakest findings?" |
| **Publish** | **Visualize** | Level 2 | Enhance consumption artifacts with structural graphics | Executive topology graphic, pressure overlay, convergence map, operational ceiling graphic |
| **Publish** | **Package** | Level 2 | Format curated content into deliverable artifacts | Briefing note, board pack, acquisition memo, executive one-pager, workshop deck, slide deck |
| **Publish** | **Position** | Level 0 | Frame commercial implications | "How do I position PI for a PE firm?" "What's the SC upsell from this finding?" "Frame the operational ceiling for a CTO." |

**The Curate workflow — when verdict exists:**

```
Structural Verdict
        ↓
CURATE: "Generate Acquisition Risk Summary"
        ↓
Consumption Artifact (narrative)
        ↓
VISUALIZE: "Enhance with relevant graphics"
        ↓
Consumption Artifact (narrative + structural visuals)
        ↓
PACKAGE: "Format as executive one-pager"
        ↓
Consumption Artifact (formatted, deliverable)
```

This is not FAQ behavior. This is governed content production. But the Co-Pilot is equally useful before the verdict exists — in Query, Explore, Explain, Compare, and Position modes.

### 4.5 MVP Scope

The MVP delivers what an operator needs to prepare and deliver SA and SA-DD engagements. This includes pre-specimen capability (Level 0) and post-verdict capability (Level 2).

**MVP interaction modes:**

| Tier | Mode | MVP Status | Justification |
|------|------|-----------|---------------|
| **Understand** | **Query** | MVP | Universal entry point — operator asks anything, Co-Pilot routes to the right knowledge |
| **Understand** | **Explore** | MVP | Operator navigates the knowledge graph to build understanding |
| **Understand** | **Explain** | MVP | Core to every engagement — operator must understand and explain findings, concepts, architecture |
| **Curate** | **Compare** | MVP | Essential for positioning (PI vs competitors) and specimen understanding (cluster vs cluster) |
| **Curate** | **Curate** | MVP | Center of gravity — consumption artifact production is the primary post-verdict value |
| **Curate** | **Challenge** | Deferred | Stress-testing becomes critical for SC/SE advisory relationships. SA/SA-DD delivery is presenter-driven. |
| **Publish** | **Visualize** | Deferred | Requires PRE asset pipeline (Phase 5 of EIR roadmap) and static rendering path. |
| **Publish** | **Package** | Deferred | Requires template system and multi-format output (PDF, deck, memo). In MVP, curated consumption artifacts are copy-pasteable. |
| **Publish** | **Position** | MVP | Commercial framing required for every delivery and every prospect conversation |

### 4.6 Knowledge Layers

The Co-Pilot reads knowledge layers to assemble operational context. MVP requires 4 layers, with progressive activation:

| Layer | MVP Scope | Context Level | What It Contains |
|-------|----------|--------------|-----------------|
| **Doctrine** | Read-only access to governance and constitutional rules | Level 0 (always) | 13 prohibitions, authority boundaries, governance posture, PI architecture, cognitive functions, what PI can/cannot claim |
| **Commercial** | Read-only access to frozen commercial packaging | Level 0 (always) | SKU definitions, offer details, pricing positioning, objection handling, competitive differentiation |
| **Specimen** | Read-only access to current specimen's structural intelligence | Level 1 (when loaded) | Topology, signals, conditions, consequences, qualification state |
| **Verdict** | Read-only access to the completed Structural Verdict and its underlying data | Level 2 (when generated) | 9-chapter content, findings, posture, operational ceiling, governance boundary |

Deferred: Vault layer (full canonical state — useful but large), Runtime layer (CIP/PICR/PICP internals), Qualification layer (SQO internals — SC/SE), LENS Context layer (real-time mode tracking), Publishing layer (previously generated artifacts).

### 4.7 Context Assembly

The Co-Pilot assembles operational context from available knowledge layers before generating any output:

```
OPERATOR INPUT
    │
    ├── 1. Context Level Detection
    │   └── What knowledge is available? (Level 0 / 1 / 2 / 3)
    │
    ├── 2. Mode Detection
    │   └── What is the operator doing? (Query / Explore / Explain / Compare / Curate / Position)
    │
    ├── 3. Source Selection
    │   └── Which knowledge layers are relevant to this mode at this context level?
    │   └── Progressive weighting: verdict + specimen dominate when available;
    │       doctrine + commercial are primary at Level 0
    │
    ├── 4. Context Assembly
    │   └── Pull relevant facts from selected sources
    │   └── Context-aware: responses reference what is actually available
    │
    └── 5. Response Construction
        └── Apply interaction mode
        └── Apply governance boundary (13 prohibitions)
        └── Produce output (answer, explanation, comparison, or consumption artifact)
```

### 4.8 MVP Governance

The PI Co-Pilot operates under the same 13 absolute prohibitions as LENS 75.x. Additionally:

| Rule | Enforcement |
|------|-------------|
| Never creates intelligence | Co-Pilot interrogates the knowledge graph — never generates findings, evidence, or qualification |
| Never changes findings | Consumption artifacts must be traceable to verdict findings. No invented findings. |
| Never changes evidence | Evidence chain is immutable. Explain and Explore surface it — never modify it. |
| Never changes qualification | SQO state is consumed, not produced. The Co-Pilot operates downstream of qualification. |
| Never visible to customer | Co-Pilot output is operator-only. Customer sees LENS and Assessment Package. |
| Evidence-compatible | All outputs — including curated consumption artifacts and comparisons — must be compatible with structural evidence |
| Audience-adapted, not truth-adapted | Curate changes consumption format (language, emphasis, structure). Never changes what is said — only how it is consumed. |
| Context-honest | The Co-Pilot discloses what context level it is operating at. If no specimen is loaded, it says so. If no verdict exists, it says so. It never hallucinates context it does not have. |

### 4.9 MVP Implementation Approach

**Build order is context-first, not component-first:**

| Step | What It Does | LOC Estimate | Notes |
|------|-------------|-------------|-------|
| **1. Knowledge Graph Context Assembler** | Assembles operational context from available knowledge layers. Detects context level (0/1/2). Reads doctrine, commercial, specimen (when loaded), verdict (when generated). Produces a `PIOperationalContext` object. | ~350 | This IS the moat. Progressive — works at Level 0 (no specimen) through Level 2 (full verdict). |
| **2. Interaction Mode Engine** | Takes `PIOperationalContext` + interaction mode + operator input. Constructs mode-specific prompt. Calls LLM under 75.x governance. Returns governed output with evidence compatibility check when specimen/verdict context exists. | ~300 | 75.x governed — disclosure-wrapped, prohibition-enforced. Curate mode requires consumption artifact templates. |
| **3. Co-Pilot Surface** | Operator-only LENS panel rendering Co-Pilot responses. Context level indicator. Mode selector. Input field. Response rendering with evidence references (when available). | ~250 | Works as standalone surface (Level 0) and within specimen context (Level 1/2). |

**Total MVP estimate:** ~900 LOC of new code. The context assembler reads existing runtime data through existing resolvers when a specimen is loaded, and reads doctrine/commercial docs at Level 0. The interaction mode engine is the governed LLM interaction. The surface is the rendering layer.

**The difference from "Claude with docs":** The context assembler pre-loads the full operational context from the PI knowledge graph BEFORE any question is asked. At Level 0, it carries PI doctrine, commercial model, and governance. At Level 2, it adds specimen, topology, findings, and verdict. Every response inherits this assembled context. A generic AI assistant has none of it.

**Key architectural decision:** The Co-Pilot runs as an operator-only LENS surface — not a separate application. It shares the same Next.js runtime, reads the same resolved data, and renders in the operator's LENS instance. At Level 0 (no specimen), it operates from the LENS landing or a dedicated `/copilot` route. At Level 1/2, it operates within the specimen context.

### 4.10 MVP Routes

```
PI Co-Pilot — Level 0 (no specimen):
    /copilot                                → Co-Pilot (doctrine, commercial, architecture)

PI Co-Pilot — Level 1/2 (specimen/verdict loaded):
    /lens/{client}/{run}/copilot            → Co-Pilot with specimen context
```

Customer LENS (future — never shows /copilot routes):
    /ws/{token}/lens/...

The `/copilot` routes exist only in operator LENS. Customer LENS routing (§5) never exposes them.

---

## 5. SA-DD HOSTING MVP (NOT Customer Hosting Architecture)

This section defines the minimum viable hosted LENS for SA-DD delivery. It is NOT the full Customer Hosting Architecture — that requires identity, RBAC, audit, retention, multi-tenant isolation, and monitoring that are not justified until SC/SE consumption levels.

### 5.1 What SA-DD Requires

From the frozen commercial contract:
- Full LENS access (all 4 cognitive modes)
- 76+ guided structural queries in DENSE
- Evidence Record with investigation trail
- 30-day access from provisioning
- Up to 10 concurrent users
- 5-day delivery SLA

### 5.2 MVP Definition

The minimum implementation that fulfills the SA-DD contract:

| Requirement | MVP Implementation |
|-------------|-------------------|
| **Full LENS access** | Hosted Next.js instance. Same codebase as operator LENS, different route set. |
| **All 4 cognitive modes** | BOARDROOM, BALANCED, DENSE, OPERATOR — all already operational |
| **76+ guided queries** | Already operational in DENSE (5B.1+ lattice) |
| **Evidence Record** | InterrogationTrailBuilder.buildTrailHTML() — already operational |
| **30-day access** | Workspace token with TTL. Middleware checks expiration on every request. |
| **10 concurrent users** | Token-shared access. No per-user identity needed. Anyone with the token accesses the workspace. |
| **5-day delivery** | Operational constraint on pipeline execution — no architecture change |

### 5.3 What Must Be Built for SA-DD Access

```
MUST BUILD (MVP):

1. Workspace Token Middleware (~150 LOC)
   ├── Token generation (opaque, workspace-scoped)
   ├── Token validation on every request
   ├── Expiration check (30-day TTL from provisioning)
   ├── Workspace-to-client/run mapping
   └── Expired token → "Workspace expired" page

2. Customer Route Subset (~100 LOC)
   ├── /ws/{token}/lens              → BOARDROOM (default)
   ├── /ws/{token}/lens/balanced     → BALANCED
   ├── /ws/{token}/lens/dense        → DENSE (with guided queries)
   ├── /ws/{token}/lens/operator     → OPERATOR
   ├── /ws/{token}/export/verdict    → Download Structural Verdict
   └── /ws/{token}/export/evidence   → Download Evidence Record

3. Customer Navigation Shell (~200 LOC)
   ├── Mode selector (BOARDROOM / BALANCED / DENSE / OPERATOR)
   ├── Export controls (Structural Verdict, Evidence Record)
   ├── No SQO routes
   ├── No /copilot routes
   ├── No other client data
   └── Workspace identity display (engagement name, expiration countdown)

4. Hosting Infrastructure
   ├── Single VM (Ubuntu/Debian, Node.js 18+, Next.js 14)
   ├── Domain: lens.signal.com (or subdomain)
   ├── TLS certificate (Let's Encrypt or managed)
   ├── Reverse proxy (nginx or Caddy)
   └── Deployment: git pull + npm run build + pm2 restart

5. Workspace Provisioning Script (~100 LOC)
   ├── Input: client_id, run_id, sku, access_duration_days
   ├── Generates workspace token
   ├── Writes workspace config (token → client/run mapping + expiration)
   ├── Outputs: customer access URL
   └── Operator runs after pipeline completion
```

**Total SA-DD MVP estimate:** ~550 LOC of new code + hosting infrastructure setup.

### 5.4 What Is NOT in SA-DD MVP

| Explicitly Excluded | Why |
|--------------------|-----|
| Per-user identity | Token-shared access satisfies "10 concurrent users" without user management |
| SKU gating (PG-003) | SA-DD grants all 4 modes — no need to restrict. PG-003 needed only when SA and SA-DD coexist. |
| SQO cockpit exposure | SA-DD customers never see SQO. Customer route subset excludes it. |
| Run comparison | SA-DD is single-run. Multi-run is SC (Level 2). |
| PI Co-Pilot | Customer never sees it. Operator accesses it separately. |
| Auto-provisioning | Operator runs provisioning script manually after pipeline completion. |

### 5.5 Hosting Maturity Distinction

| Layer | SA-DD Hosting MVP | Customer Hosting Architecture (future) |
|-------|------------------|---------------------------------------|
| **Customer Workspace** | Token → client/run mapping | Workspace lifecycle engine (CREATED → ARCHIVED) |
| **TLS** | Let's Encrypt certificate | Managed certificate with auto-renewal |
| **Reverse Proxy** | nginx or Caddy | Load-balanced, health-checked |
| **Application Runtime** | Single Next.js process (pm2) | Container orchestration, scaling |
| **Workspace Isolation** | URL routing + ClientScopedSectionResolver | Full tenant isolation per workspace |
| **Artifact Storage** | Local filesystem (same as operator) | Object storage with retention policy |
| **Evidence Store** | Local pipeline output | Governed evidence archive with lineage |
| **Identity** | Workspace token (shared) | Named users → Role-based identity → Enterprise SSO |
| **RBAC** | None (all modes accessible) | 5 roles with enforcement |
| **Audit** | Request logging only | Full audit trail with user attribution |
| **Retention** | Manual archival | Policy-driven retention with governance compliance |
| **Monitoring** | Process health only | Application monitoring, alerting, uptime SLA |

The MVP is the left column. Everything in the right column is justified by SC/SE consumption levels — not by SA-DD.

### 5.6 Security Model (Minimal)

| Concern | MVP Approach |
|---------|-------------|
| **Authentication** | Workspace token in URL path. Token is the credential. |
| **Authorization** | Token maps to exactly one workspace (client + run). No cross-workspace access possible. |
| **Data isolation** | ClientScopedSectionResolver already prevents cross-client data. Token routing adds URL-level isolation. |
| **Token security** | Cryptographically random (UUID v4 or similar). Not guessable. Transmitted via secure channel (email to deal team). |
| **Expiration** | Server-side TTL check. Expired tokens get a clean expiration page. No data leakage. |
| **Transport** | HTTPS required. HTTP redirects to HTTPS. |
| **Rate limiting** | Not in MVP. Single workspace, 10 users max. Low abuse risk. |
| **Audit** | Log token usage (timestamp, route accessed). Not in MVP — add when multiple workspaces exist. |

**Security boundaries:**
- No token = no access (middleware rejects)
- Wrong token = no access (workspace lookup fails)
- Expired token = no access (TTL check fails)
- Valid token = access to ONE workspace ONLY (client + run scoped)
- No route exists to navigate to another client's data from a workspace URL

---

## 6. CONVERGENT CONSUMPTION MODEL

The Consumption Architecture stream asked: "How do customers consume Program Intelligence?"
The Co-Pilot asks: "How do operators interact with everything Program Intelligence knows?"

These converge into the same architectural problem — two interaction surfaces over the same governed knowledge graph.

```
PROGRAM INTELLIGENCE CONSUMPTION ARCHITECTURE

├── Customer Consumption Surface (LENS)
│   ├── Assessment Package (governed artifacts — Structural Verdict, Evidence Record)
│   ├── LENS (cognitive projection — BOARDROOM, BALANCED, DENSE, OPERATOR)
│   └── Advisory Session (operator-mediated walkthrough)
│
├── Operator Interaction Surface (PI Co-Pilot)
│   ├── PI Co-Pilot (knowledge graph → interaction → consumption artifacts)
│   │   ├── 1. UNDERSTAND
│   │   │   ├── Query     — ask anything across the knowledge graph
│   │   │   ├── Explore   — navigate and discover
│   │   │   └── Explain   — understand concepts, findings, architecture
│   │   ├── 2. CURATE (center of gravity when verdict exists)
│   │   │   ├── Compare   — differentiate and contrast
│   │   │   ├── Curate    — produce consumption artifacts
│   │   │   └── Challenge — stress-test with evidence
│   │   └── 3. PUBLISH (extends Curate)
│   │       ├── Visualize — enhance with structural graphics
│   │       ├── Package   — format into deliverable artifacts
│   │       └── Position  — frame commercial implications
│   ├── LENS (full access — all modes, all clients)
│   ├── Assessment Package (same governed artifacts, consumed for preparation)
│   ├── Vault + Doctrine (governance authority, constitutional boundaries)
│   └── Commercial Authority (offers, positioning, objection handling)
│
└── Shared Knowledge Authority
    ├── PI Knowledge Graph (doctrine, commercial, runtime, vault, specimen, verdict, publishing)
    ├── CIP → PICR → PICP → PRE (cognition chain)
    └── Program Intelligence Doctrine (13 prohibitions, authority model, governance)
```

**The architectural distinction:**

LENS is the customer-side consumption surface. The customer experiences structural reality through it. LENS projects governed cognition FOR the customer.

The PI Co-Pilot is the operator-side interaction surface. The operator interrogates the full PI knowledge graph through it. The Co-Pilot produces governed answers, explanations, comparisons, and consumption artifacts FOR the operator — before, during, and after verdict generation.

Both surfaces consume the same governed intelligence. They differ in:
- **Audience:** Customer vs operator
- **Authority:** Customer receives projected cognition. Operator receives assembled operational context from the PI knowledge graph.
- **Scope:** LENS requires a specimen. The Co-Pilot operates at any context level — including Level 0 (no specimen).
- **Output:** Customer sees LENS and receives artifacts. Operator produces answers, explanations, comparisons, consumption artifacts, and formatted deliverables.
- **Visibility:** Customer sees their surface only. Operator sees both surfaces.
- **Invariant:** Neither surface creates intelligence. The runtime creates intelligence. Both surfaces consume it.

**What the Co-Pilot is becoming:** The universal intelligence interaction surface for Program Intelligence. At Level 0 it is an "Ultimate Query Tool" — interrogating doctrine, commercial model, architecture, and governance. At Level 2 it becomes the internal publishing layer — transforming governed verdict intelligence into consumption artifacts. Both are the same surface, progressively enriched by context.

---

## 7. IMPLEMENTATION SEQUENCE

```
PHASE 1 — SA DELIVERY (NOW — zero infrastructure)
├── Formalize SA delivery playbook (§3.4)
├── Build PI Co-Pilot MVP (§4) — operator-local only
│   ├── Knowledge graph context assembly (4 layers, progressive Level 0→2)
│   ├── 6 interaction modes (QUERY, EXPLORE, EXPLAIN, COMPARE, CURATE, POSITION)
│   └── Operator-only routes (/copilot + /lens/{client}/{run}/copilot)
└── DELIVER FIRST SA

PHASE 2 — SA-DD ACCESS (NEXT — requires hosting)
├── Provision hosted LENS instance (single VM)
├── Build workspace token middleware
├── Build customer route subset
├── Build customer navigation shell
├── Build workspace provisioning script
└── DELIVER FIRST SA-DD

PHASE 3 — SA UPGRADE (AUTOMATIC)
├── SA customers get hosted LENS access as byproduct of Phase 2
├── Advisory session transitions from screen-share to live hosted
└── Option B (§3.2) activated at zero marginal cost
```

### Time Estimates

| Phase | Scope | Estimate |
|-------|-------|---------|
| Phase 1 — SA Delivery | Playbook + PI Co-Pilot MVP (~900 LOC) | 3-5 days |
| Phase 2 — SA-DD Access | Hosting + token + routes + shell (~550 LOC + infra) | 5-7 days |
| Phase 3 — SA Upgrade | Configuration only (SA workspace tokens point to hosted instance) | 1 day |

### Dependencies

```
Phase 1: NONE — runs on operator-local LENS
Phase 2: VM provisioned, domain registered, TLS configured
Phase 3: Phase 2 complete
```

---

## 8. WHAT THIS DOES NOT COVER

| Topic | Why Excluded | When It's Needed |
|-------|-------------|-----------------|
| SC consumption (Level 2) | Requires PG-001, PG-002, PG-003 | After product gaps resolved |
| SE consumption (Level 3) | Requires PG-001 through PG-005 | After all product gaps + SC |
| Per-user identity | SA-DD uses token-shared access | SC (named users) |
| RBAC enforcement | SQOActionEngine roles are declarative | SE (role enforcement) |
| Multi-run workspace | SA-DD is single-run | SC (multi-run comparison) |
| Co-Pilot CHALLENGE mode | Not needed for SA/SA-DD first delivery | SC/SE advisory relationships |
| Co-Pilot VISUALIZE mode | Requires PRE asset pipeline | After EIR roadmap Phase 5 |
| Co-Pilot PACKAGE mode | Requires template system + multi-format output | After curated consumption artifacts prove useful |
| Auto-provisioning | Operator runs script manually | When workspace volume justifies automation |
| Monitoring/alerting | Single instance, low volume | When multiple workspaces exist |

---

## 9. SUCCESS CRITERIA

| Criterion | Verification |
|-----------|-------------|
| SA can be delivered end-to-end without Claude Code session context | Operator follows playbook, generates artifacts, delivers via screen-share |
| Co-Pilot works at Level 0 (no specimen) | Operator can explain PI, compare vs competitors, position for prospects, explore governance — before any specimen exists |
| Co-Pilot MVP helps operator prepare and deliver SA session | Operator uses QUERY/EXPLORE/EXPLAIN (Level 0 for preparation, Level 2 for delivery) + CURATE + POSITION |
| Co-Pilot CURATE produces consumption artifacts from the same verdict | Generated Executive Summary and CTO Summary carry different emphasis but identical findings. Acquisition Risk Summary and IC Brief are different consumption artifacts from the same governed truth. |
| SA-DD customer accesses LENS independently for 30 days | Customer URL works, all 4 modes accessible, queries functional, exports downloadable |
| SA-DD workspace expires after 30 days | Expired token shows clean expiration page, no data access |
| Customer cannot access other clients' data | Token scopes to one workspace. No cross-workspace navigation exists. |
| Customer cannot see SQO, Co-Pilot, governance, or other operator surfaces | Customer route subset excludes all non-customer routes |

---

## Cross-References

- [[CONSUMPTION_AND_ACCESS_ARCHITECTURE]] — consumption architecture v1.0 (binding)
- [[PRODUCT_GAP_REGISTER]] — SA: 0 blockers, SA-DD: 0 blockers
- [[SA_PACKAGING]] — SA commercial contract (frozen)
- [[SA_DD_PACKAGING]] — SA-DD commercial contract (frozen)
- PI.OPERATOR-COPILOT.ADVISORY-WORKBENCH.01 — Advisory Workbench charter (binding)
