# External Surface Authority Contract — W.1.C

Program: Krayu — Program Intelligence Discipline
Stream: W.1.C — External Surface Authority Contract
Type: GOVERNANCE CONTRACT / EXTERNALIZATION CONTROL
Date: 2026-03-29
Inputs: external_surface_inventory.md, category_authority_diagnosis.md, external_surface_authority_model.md

---

## 1. Publication Authority Stack

Every external statement, page, or artifact must resolve upward through the following authority chain. No publication may bypass or skip layers.

| Layer | Authority Source | Role |
|-------|-----------------|------|
| GOV | Canonical Knowledge Registry | Definition lock — concept truth origin |
| CAT | Category Authority (Program Intelligence) | Narrative lock — category ownership |
| RES | Research Corpus | Depth lock — legitimacy and substantiation |
| SCI | Validation Layer | Credibility lock — claim integrity enforcement |
| B.1 | Productization Binding Layer | Usability lock — governed final form |

**RULE: NO TRACE → NO PUBLICATION**

Any content that cannot be traced upstream to GOV→CAT→RES→SCI→B.1 must not be published. Traceability is not optional. It is the publication gate.

---

## 2. Surface Role Contract

### 2.1 krayu.be — Discipline Authority Surface

**Role:** Category and discipline authority. Defines Program Intelligence. Hosts the governing narrative. This domain is the canonical identity of Krayu.

**Permitted:**
- Category definition (Program Intelligence, Execution Blindness, Execution Signals)
- Discipline narrative (what Program Intelligence is, why it exists, what it governs)
- Architecture-grounded positioning (derived from GOV/CAT authority stack)
- Product handoff links to signal domains
- All pages from the governed sitemap

**Forbidden:**
- Product positioning dominance (Signäl, Lens capability claims do not lead here)
- Content without upstream GOV/CAT trace
- Draft, versioned, or placeholder pages exposed on live routes
- Terminology not present in Canonical Knowledge Registry

### 2.2 mirror.krayu.be — SEO Reinforcement Layer

**Role:** Crawlable counterpart to krayu.be. Enables index authority to accumulate at krayu.be URLs. Carries no independent authority.

**Permitted:**
- Compressed, crawlable versions of krayu.be governed pages
- Canonical declarations pointing to krayu.be as authority URL
- Structural equivalents of krayu.be pages (same titles, same concept naming, same hierarchy)

**Forbidden:**
- Self-referencing canonical declarations (mirror must never claim its own URL as canonical)
- Content absent from krayu.be
- Alternative narratives or editorial divergence from krayu.be
- Independent category authority claims

**RULE:** mirror.krayu.be is a compression and delivery mechanism. It does not originate content. Any page on mirror.krayu.be without a krayu.be canonical counterpart is a governance violation.

### 2.3 signal-pi.com / signalpi.ai — Product Surfaces

**Role:** Product capability surfaces for Signäl. Scoped entirely to product positioning. No category ownership permitted.

**Permitted:**
- Signäl capability claims (bounded by B.1 claim classifications)
- Product feature description
- Commercial framing and advisory content
- Links back to krayu.be as category authority (REQUIRED — see Section 5)

**Forbidden:**
- Category ownership claims ("Program Intelligence is…" does not belong on signal domains)
- Redefinition of GOV/CAT concepts
- Narratives that can be mistaken for discipline definition
- Content that competes with krayu.be for category-defining search terms

**RULE:**
- **Category = Krayu.** Program Intelligence, Execution Blindness, Execution Signals are defined on krayu.be.
- **Product = Signäl.** Capability implementation lives on signal domains.
- **NEVER MIX.** Product surfaces may not accumulate category authority. Category surfaces may not be dominated by product positioning.

---

## 3. Content Classification Contract

Every external artifact must be classified before publication. Classification determines permitted content, permitted domain, and permitted language.

### CLASS 1 — CATEGORY

**Definition:** Content that defines or extends the Program Intelligence discipline.

**Permitted:**
- Concept definitions: Program Intelligence, Execution Blindness, Execution Signals, Execution Condition
- Discipline structure and rationale
- Category boundary descriptions (what Program Intelligence is and is not)
- Architecture-level claims traceable to GOV/CAT

**Forbidden:**
- Product bias (favoring Signäl in category-definition language)
- Marketing language
- Capability claims

**Domain:** krayu.be only.

---

### CLASS 2 — RESEARCH

**Permitted:**
- Substantiation and depth for category claims
- Evidence from RES corpus
- Analysis and validation of Program Intelligence principles

**Forbidden:**
- Marketing language
- Product promotion
- Claims exceeding RES/SCI authority

**Domain:** krayu.be (primary). mirror.krayu.be (compressed equivalent).

---

### CLASS 3 — PRODUCT

**Permitted:**
- Signäl capability description
- ExecLens and Lens capability claims (bounded by B.1)
- Commercial framing of product capability

**Forbidden:**
- Category ownership language
- Discipline definition
- Terms that belong to CATEGORY class

**Domain:** signal-pi.com, signalpi.ai. NOT krayu.be (except in product-handoff context with explicit surface boundary).

---

### CLASS 4 — ADVISORY

**Permitted:**
- Business and commercial framing
- Use-case narratives and organizational value framing
- Investor and client-facing positioning

**Required:** Must reference CATEGORY class authority. Advisory content may not float free of discipline grounding.

**Forbidden:**
- Redefinition of discipline concepts
- Unsourced capability claims
- Language that exceeds B.1 claim classification

**Domain:** Any surface, with appropriate upstream authority trace.

---

## 4. SEO Contract

### 4.1 Canonical URL Rule

One canonical URL per concept. Every concept that appears across multiple surfaces must declare a single canonical URL. That URL belongs to krayu.be. No concept may be indexed at multiple competing URLs.

| Concept | Canonical Owner | Canonical Domain |
|---------|----------------|-----------------|
| Program Intelligence | krayu.be | krayu.be/[program-intelligence] |
| Execution Blindness | krayu.be | krayu.be/[execution-blindness] |
| Execution Signals | krayu.be | krayu.be/[execution-signals] |
| Signäl (product) | signal domain | signal-pi.com or signalpi.ai |

### 4.2 Keyword Ownership

Krayu owns the following search terms. No competing narrative may fragment these terms across surfaces.

- **"Program Intelligence"** — Krayu discipline. krayu.be is the authority URL.
- **"Execution Signals"** — Krayu category concept. krayu.be only.
- **"Execution Blindness"** — Krayu category concept. krayu.be only.

### 4.3 Forbidden SEO Patterns

- Competing keyword narratives across domains (krayu.be and signal domains both ranking for "Program Intelligence" with different framings)
- Fragmented terminology (Program Intelligence / program intelligence / programmatic intelligence used interchangeably)
- Inconsistent concept naming across pages or domains
- Duplicate narrative content that dilutes authority across multiple URLs
- Mirror pages that do not carry canonical declarations back to krayu.be

---

## 5. Linking Contract

### 5.1 Internal Linking

| From | To | Type | Rule |
|------|----|------|------|
| krayu.be (SPA) | mirror.krayu.be | Canonical declaration only | No editorial link; canonical tag only |
| krayu.be | signal domains | Product handoff | Explicit product handoff context required |
| signal domains | krayu.be | Authority backlink | REQUIRED on all signal domain surfaces |

### 5.2 External Linking — Required Backlink Rule

All signal domain surfaces (signal-pi.com, signalpi.ai) MUST carry an authority backlink to krayu.be. This is not optional. Product surfaces that do not link to category authority orphan themselves from the authority chain.

**RULE:** All product flows MUST route back to category authority. A product surface that accumulates search presence without linking back to krayu.be weakens category authority and violates the authority stack.

### 5.3 Forbidden Linking Patterns

- Editorial links from mirror.krayu.be to krayu.be (mirror communicates authority via canonical declarations, not navigation links)
- Signal domains linking to mirror.krayu.be as category authority (signal domains link to krayu.be only)
- krayu.be linking to signal domains in category-definition context (product handoff is distinct from category narrative)

---

## 6. Broken Link Zero-Tolerance

**Standard:** 0 broken links on krayu.be. 0 orphan pages. All declared routes must resolve.

### 6.1 Validation Requirements

Before any deployment:

| Check | Requirement |
|-------|-------------|
| Sitemap integrity | Every URL in sitemap.xml must resolve with HTTP 200 |
| Route resolution | Every internal link on live pages must resolve |
| Anchor consistency | All in-page anchors must target existing elements |
| Canonical consistency | Every mirror page canonical tag must point to a live krayu.be URL |
| Cross-domain links | All links from signal domains to krayu.be must resolve |

### 6.2 Enforcement

**FAIL = BLOCK DEPLOY.** Any validation failure blocks deployment. No exceptions. The following are disqualifying conditions:

- Any sitemap URL returning non-200
- Any page reachable from navigation with no content
- Any canonical tag pointing to a non-existent krayu.be URL
- Any internal link returning 404

---

## 7. Publication Gate

Before any content is published to any external surface, all five checks must pass. A single failure blocks publication.

### CHECK 1 — Authority Trace

Does this content map to at least one layer in GOV → CAT → RES → SCI → B.1?

- PASS: Traceable to a named source in the authority stack
- FAIL: No upstream trace

### CHECK 2 — Classification

Is the content classified as CATEGORY / RESEARCH / PRODUCT / ADVISORY?

- PASS: Classification assigned; classification-appropriate language confirmed
- FAIL: Unclassified, or classification boundary violated

### CHECK 3 — Surface Fit

Is the domain correct for this content class?

- PASS: CATEGORY and RESEARCH on krayu.be; PRODUCT on signal domains; ADVISORY on appropriate surface with upstream trace
- FAIL: CATEGORY content on signal domains; PRODUCT content dominating krayu.be without explicit handoff boundary

### CHECK 4 — SEO Integrity

Does this content introduce duplicate narratives, competing canonical URLs, or fragmented terminology?

- PASS: No duplication; no drift; canonical URL declared and unique
- FAIL: Competing URL for same concept; fragmented terminology; mirror page without canonical tag

### CHECK 5 — Terminology Alignment

Is all terminology present in and consistent with the Canonical Knowledge Registry (CKR)?

- PASS: All terms match CKR definitions; no invented terms; no redefined concepts
- FAIL: Term not in CKR; term used with definition that diverges from CKR

**ONLY IF ALL FIVE PASS → PUBLISH**

---

## 8. Drift Prevention Rules

### 8.1 Forbidden Actions — Absolute

| Action | Violation Type |
|--------|---------------|
| Inventing new terms outside CKR | GOV violation |
| Redefining Program Intelligence on a downstream surface | CAT violation |
| Product-led category claims on signal domains | Surface role violation |
| Duplicating category narratives across domains with variation | SEO violation |
| Using "program intelligence" as a generic descriptor on non-Krayu content | Category dilution |
| Publishing mirror pages without canonical declarations | SEO authority violation |
| Allowing signal domains to accumulate category keywords | Surface boundary violation |

### 8.2 Enforcement Mechanisms

| Mechanism | Layer | Role |
|-----------|-------|------|
| CKR | GOV | Definition lock — all terms must resolve here |
| Category Authority (CAT) | CAT | Narrative lock — category framing governed here |
| Mirror canonical declarations | SEO | Authority concentration — mirror directs authority to krayu.be |
| Publication gate (Section 7) | All | Pre-publication enforcement |
| Broken link validation (Section 6) | Technical | Post-publication enforcement |

### 8.3 Drift Detection

Drift is detectable when:
- The same concept appears with different definitions on different surfaces
- A signal domain page ranks for a term that belongs to krayu.be
- A mirror page exists without a krayu.be canonical counterpart
- A krayu.be page uses terminology not in the CKR

Drift is a governance violation. Detection triggers a remediation stream, not a manual edit.

---

## 9. Domain Separation Boundary

The separation between Krayu (discipline) and Signäl (product) is a hard governance boundary, not a marketing distinction.

### 9.1 What Belongs to Krayu

- Program Intelligence as a discipline
- Category definitions: Execution Blindness, Execution Signals, Execution Condition
- The rationale for why a governed analytical architecture exists
- The authority claim: "this is a new category, and here is what defines it"

### 9.2 What Belongs to Signäl

- PiOS operationalization as a product
- ExecLens and Lens surfaces as product capability
- Commercial framing of what organizations can do with PiOS outputs
- The capability claim: "this is what the system can surface for you"

### 9.3 What Is Never Mixed

- Signäl does not own the category definition. It implements it.
- krayu.be does not market Signäl. It defines the discipline that Signäl implements.
- No surface may hold both category authority and product promotion as co-equal narratives.

**RULE:** If a single page tries to both define Program Intelligence and sell Signäl, it fails Check 3 of the publication gate. Separate the surfaces.

---

## 10. Readiness Assertions for W.1.D

This contract produces the following conditions required for W.1.D (Website Rewrite Execution Contract) to proceed:

| Assertion | Status |
|-----------|--------|
| Surface roles are defined and non-overlapping | ESTABLISHED (Sections 2, 9) |
| Content classification boundaries are defined | ESTABLISHED (Section 3) |
| SEO canonical ownership is declared | ESTABLISHED (Section 4) |
| Linking structure is governed | ESTABLISHED (Section 5) |
| Broken link standard is set | ESTABLISHED (Section 6) |
| Publication gate is defined | ESTABLISHED (Section 7) |
| Drift prevention rules are in place | ESTABLISHED (Section 8) |
| Krayu / Signäl domain separation is enforced | ESTABLISHED (Section 9) |

W.1.D inputs:
- `external_surface_inventory.md` (W.1.A) — page-by-page inventory of current state
- `category_authority_diagnosis.md` (W.1.B) — failure mode and root cause map
- `external_surface_authority_model.md` (W.1.C model) — architecture definition
- `external_surface_authority_contract.md` (this document) — governance rules

W.1.D output: BASE44 execution instructions, page-by-page rewrite mapping, mirror synchronization plan.

---

*W.1.C External Surface Authority Contract — 2026-03-29 | Stream: W.1.C | Authority: GOV/CAT/B.1 | Governs: krayu.be, mirror.krayu.be, signal-pi.com, signalpi.ai*
