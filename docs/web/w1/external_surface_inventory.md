# External Surface Inventory — W.1.A

Capture date: 2026-03-29
Method: HTTP fetch (WebFetch) — depth ≤ 3 per domain, sitemap-assisted enumeration
Crawl note: krayu.be is a client-side rendered application (CSR/SPA). HTTP fetch returns pre-rendered HTML only — all krayu.be pages return title-only content. Body text, navigation, and internal links are not extractable via HTTP fetch for this domain. mirror.krayu.be is server-side rendered (SSR) and returns full content. Page counts for krayu.be sourced from sitemap.xml (https://krayu.be/sitemap.xml).

---

## 1. Domain Inventory

### krayu.be

- Type: mixed (primary site + tool/demo pages + staging artifacts)
- Status: active
- Notes: 32 URLs in sitemap.xml. Domain returns HTTP 200 for all tested pages. robots.txt: `User-agent: * Allow: / Sitemap: https://krayu.be/sitemap.xml`. Site is CSR (client-side rendered) — content is JavaScript-loaded and not accessible to HTTP fetch. All pages return title-only HTML pre-render. Sitemap includes pages with `_v1` suffix (versioned/draft variants) and a page named `Parking`. Page titles use slug-as-title pattern for most URLs (e.g., `ProgramIntelligenceManifesto | Krayu Program Intelligence`) rather than semantic titles.

---

### mirror.krayu.be

- Type: mirror
- Status: active
- Notes: 6 URLs in sitemap.xml. Full SSR content accessible via HTTP fetch. Site references krayu.be as its canonical/source domain via outgoing external links. Navigation and page titles differ from krayu.be: mirror uses semantic page titles (e.g., `Program Intelligence Manifesto | Krayu — Program Intelligence`) and dash-separated lowercase URL slugs (`/program-intelligence`, `/manifesto`). Brand subtitle differs from krayu.be: mirror uses `Krayu — Program Intelligence for Technology Organizations`; krayu.be root returns `Krayu Program Intelligence`. Footer: © 2025 Krayu Advisory FZE — Dubai, United Arab Emirates.

---

### signal-pi.com

- Type: unknown
- Status: inactive (DNS does not resolve)
- Notes: `getaddrinfo ENOTFOUND signal-pi.com`. Domain does not resolve. No content accessible.

---

### signalpi.ai

- Type: unknown
- Status: inactive (DNS does not resolve)
- Notes: `getaddrinfo ENOTFOUND signalpi.ai`. Domain does not resolve. No content accessible.

---

## 2. Page Surface Map — krayu.be

**Crawl limitation:** All krayu.be pages return title-only pre-rendered HTML. Body text, section headings, navigation menus, and internal links are not extractable via HTTP fetch. Page content is JavaScript-rendered (CSR). The following entries record observable title and sitemap metadata only.

---

### https://krayu.be/

- Title: Krayu Program Intelligence
- Depth: 0
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: Homepage. Title is minimal — no subtitle or positioning statement present in pre-rendered HTML. mirror.krayu.be homepage has a more descriptive title (`Krayu — Program Intelligence for Technology Organizations`).

---

### https://krayu.be/Advisory

- Title: Advisory | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/CaseStudies

- Title: CaseStudies | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable. Title uses CamelCase slug directly.

---

### https://krayu.be/DemoExecLens

- Title: DemoExecLens | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Demo surface page. No body content extractable.

---

### https://krayu.be/ESIComparison

- Title: ESIComparison | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Referenced as an internal link from mirror.krayu.be/portfolio-intelligence. No body content extractable.

---

### https://krayu.be/ESIComparison_v1

- Title: ESIComparison_v1 | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Versioned variant of /ESIComparison. Title includes `_v1` suffix. No body content extractable.

---

### https://krayu.be/ExecutionStabilityIndex

- Title: ExecutionStabilityIndex | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/ExecutiveSlide

- Title: ExecutiveSlide | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: unclear
- Reconstruction Status: KEEP
- Notes: In sitemap. Slug suggests a single slide or slide deck. No body content extractable.

---

### https://krayu.be/FutureOfProgramIntelligence

- Title: FutureOfProgramIntelligence | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/Home_v1

- Title: Home_v1 | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: unclear
- Reconstruction Status: KEEP
- Notes: In sitemap. Title includes `_v1` suffix, indicating a versioned or draft homepage variant. Distinct from the root `/` page. No body content extractable.

---

### https://krayu.be/Insights

- Title: Insights | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/Parking

- Title: Parking | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: unclear
- Reconstruction Status: KEEP
- Notes: In sitemap. Title `Parking` has no apparent content alignment. Slug name is conventionally used for placeholder or parked pages. No body content extractable.

---

### https://krayu.be/Partner

- Title: Partner | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/Partner_v1

- Title: Partner_v1 | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Versioned variant of /Partner. Title includes `_v1` suffix. No body content extractable.

---

### https://krayu.be/PmoAudit

- Title: PmoAudit | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/Product

- Title: Product | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Referenced as an internal link from mirror.krayu.be/signal-platform. No body content extractable.

---

### https://krayu.be/Product_v1

- Title: Product_v1 | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Versioned variant of /Product. Title includes `_v1` suffix. No body content extractable.

---

### https://krayu.be/ProgramIntelligence

- Title: ProgramIntelligence | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Referenced as an internal link from mirror.krayu.be/program-intelligence. When fetched, returns same section headings as homepage (homepage behavior or redirect cannot be confirmed via HTTP fetch alone). No body content extractable.

---

### https://krayu.be/ProgramIntelligenceBridgingTheGap

- Title: ProgramIntelligenceBridgingTheGap | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceCategory

- Title: ProgramIntelligenceCategory | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceDefensibility

- Title: ProgramIntelligenceDefensibility | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceFounderLetter

- Title: ProgramIntelligenceFounderLetter | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceInvestor

- Title: ProgramIntelligenceInvestor | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Distinct from /ProgramIntelligenceInvestorBrief. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceInvestorBrief

- Title: ProgramIntelligenceInvestorBrief | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Distinct from /ProgramIntelligenceInvestor. Two investor-related pages exist with similar names. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceManifesto

- Title: ProgramIntelligenceManifesto | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceManifesto_v1

- Title: ProgramIntelligenceManifesto_v1 | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Versioned variant of /ProgramIntelligenceManifesto. Title includes `_v1` suffix. No body content extractable.

---

### https://krayu.be/ProgramIntelligenceResearch

- Title: ProgramIntelligenceResearch | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Referenced from mirror.krayu.be/research as "full research paper" link (external link on mirror domain). No body content extractable.

---

### https://krayu.be/ProgramIntelligenceResearch_v1

- Title: ProgramIntelligenceResearch_v1 | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Versioned variant of /ProgramIntelligenceResearch. Title includes `_v1` suffix. No body content extractable.

---

### https://krayu.be/ProgramIntelligence_v1

- Title: ProgramIntelligence_v1 | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. Versioned variant of /ProgramIntelligence. Title includes `_v1` suffix. No body content extractable.

---

### https://krayu.be/Report

- Title: Report | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: unclear
- Reconstruction Status: KEEP
- Notes: In sitemap. Slug is generic; no additional context observable. No body content extractable.

---

### https://krayu.be/RiskAccelerationGradient

- Title: RiskAccelerationGradient | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

### https://krayu.be/SignalModel

- Title: SignalModel | Krayu Program Intelligence
- Depth: 1
- Outgoing Links: not extractable (CSR)
- Category Alignment: aligned
- Reconstruction Status: KEEP
- Notes: In sitemap. No body content extractable.

---

## 3. Page Surface Map — mirror.krayu.be

Sitemap: 6 URLs. Full SSR content accessible. Navigation consistent across all pages: Krayu (home), Program Intelligence, Manifesto, Research, Signäl Platform, Portfolio Intelligence. Footer: © 2025 Krayu Advisory FZE — Dubai, United Arab Emirates.

---

### https://mirror.krayu.be/

- Canonical Target: krayu.be (inferred — contains `https://krayu.be/` and `https://krayu.be/program-intelligence/` as external links)
- Content Type: diverging
- Outgoing Links:
  - `/` (home — self)
  - `/program-intelligence`
  - `/manifesto`
  - `/research`
  - `/signal-platform`
  - `/portfolio-intelligence`
  - `https://krayu.be/` (external)
  - `https://krayu.be/program-intelligence/` (external)
- Risk: duplicate-risk
- Notes: Title differs from krayu.be root: `Krayu — Program Intelligence for Technology Organizations` vs `Krayu Program Intelligence`. Section headings: Program Intelligence for Technology Organizations; The Program Intelligence Framework; Detect Execution Drift Before It Becomes Program Failure. Contains outgoing links to krayu.be as external links — cross-domain linking on a page presented as a mirror. Content describes three-layer framework (engineering execution, program intelligence, executive insight) and mentions ESI and RAG.

---

### https://mirror.krayu.be/program-intelligence

- Canonical Target: krayu.be/ProgramIntelligence (inferred from internal link found on this page)
- Content Type: diverging
- Outgoing Links:
  - `/` (home)
  - `/program-intelligence`
  - `/manifesto`
  - `/research`
  - `/signal-platform`
  - `/portfolio-intelligence`
  - `/ProgramIntelligence` (internal — resolves to homepage on mirror.krayu.be when fetched)
- Risk: duplicate-risk
- Notes: Title: `Program Intelligence | Krayu — Program Intelligence`. Section headings: Program Intelligence; The Program Intelligence Gap; Execution Blindness; The Role of Signäl; Portfolio Intelligence; Program Intelligence Knowledge Map. Describes Krayu as a Dubai-based advisory firm. Knowledge map spans: Signal Science, Execution Stability Index, diagnostic models, PiOS, signal infrastructure, portfolio intelligence. Link `/ProgramIntelligence` (CamelCase, no hyphen) found as outgoing internal link — when fetched, returns homepage title, suggesting this path resolves to the homepage or does not have a distinct page on mirror.krayu.be.

---

### https://mirror.krayu.be/manifesto

- Canonical Target: krayu.be/ProgramIntelligenceManifesto (inferred)
- Content Type: diverging
- Outgoing Links:
  - `/` (home)
  - `/program-intelligence`
  - `/manifesto`
  - `/research`
  - `/signal-platform`
  - `/portfolio-intelligence`
  - `/program-intelligence/` (trailing slash variant — same target as /program-intelligence)
  - `https://krayu.be` (external)
- Risk: duplicate-risk
- Notes: Title: `Program Intelligence Manifesto | Krayu — Program Intelligence`. Section headings: Program Intelligence Manifesto; The Limits of Traditional Governance; The Emergence of Program Intelligence. Opening statement: "The problem is not the absence of data. The problem is interpretation." Frames Program Intelligence as an interpretive framework. Contains `/program-intelligence/` (trailing slash) as a distinct outgoing link alongside `/program-intelligence` — both appear to target the same page. Contains `https://krayu.be` as an outgoing external link.

---

### https://mirror.krayu.be/research

- Canonical Target: krayu.be/ProgramIntelligenceResearch (explicitly linked as "full research paper" from this page)
- Content Type: summary
- Outgoing Links:
  - `/` (home)
  - `/program-intelligence`
  - `/manifesto`
  - `/research`
  - `/signal-platform`
  - `/portfolio-intelligence`
  - `https://krayu.be/ProgramIntelligenceResearch` (external — labeled "full research paper")
  - `https://krayu.be` (external)
- Risk: duplicate-risk
- Notes: Title: `Program Intelligence Research Paper | Krayu — Program Intelligence`. Section headings: Program Intelligence Research; The Visibility Problem; Defining Program Intelligence. Contains a discipline comparison table: Engineering Observability (engineers / system health), Business Intelligence (business leaders / KPIs), Program Intelligence (executive leadership / delivery risk and structural health). References ESI, RAG, PiOS, ExecLens as framework components. Links explicitly to krayu.be/ProgramIntelligenceResearch as the full version — confirming mirror.krayu.be/research is a partial/summary form. Contains `https://krayu.be` as an outgoing external link.

---

### https://mirror.krayu.be/signal-platform

- Canonical Target: krayu.be/Product (inferred — `/Product` found as outgoing internal link on this page)
- Content Type: diverging
- Outgoing Links:
  - `/` (home)
  - `/program-intelligence`
  - `/manifesto`
  - `/research`
  - `/signal-platform`
  - `/portfolio-intelligence`
  - `/Product` (internal — resolves to homepage on mirror.krayu.be when fetched)
- Risk: duplicate-risk
- Notes: Title: `Signäl Platform | Krayu — Program Intelligence`. Section headings: Signäl Platform; The Structural Signal Gap; Architecture. Architecture components listed: Signäl Platform, Execution Signal Models, Risk Acceleration Gradient, ExecLens Visualization Layer, Execution Stability Index (ESI). Describes Signäl as operating "above enterprise systems like Jira, GitHub, ServiceNow, and SAP." Link `/Product` (CamelCase) found as outgoing internal link — when fetched, returns homepage title, suggesting this path resolves to the homepage or does not have a distinct page on mirror.krayu.be.

---

### https://mirror.krayu.be/portfolio-intelligence

- Canonical Target: krayu.be/ESIComparison (inferred — `/ESIComparison` found as outgoing internal link on this page)
- Content Type: diverging
- Outgoing Links:
  - `/` (home)
  - `/program-intelligence`
  - `/manifesto`
  - `/research`
  - `/signal-platform`
  - `/portfolio-intelligence`
  - `/ESIComparison` (internal — resolves to homepage on mirror.krayu.be when fetched)
- Risk: duplicate-risk
- Notes: Title: `Portfolio Intelligence — ESI Comparison | Krayu — Program Intelligence`. Section headings: Portfolio Intelligence; What is ESI?; Key dimensions; ESI Score Bands. ESI defined across 5 dimensions: Schedule Stability, Cost Stability, Risk Acceleration Gradient, Delivery Predictability, Flow Compression. ESI score bands: 85–100 Stable; 70–84 Early instability; 55–69 Structural stress; <55 Critical risk. Link `/ESIComparison` found as outgoing internal link — when fetched, returns homepage title, suggesting this path resolves to the homepage or does not have a distinct page on mirror.krayu.be.

---

## 4. Product Surface Mapping

### signal-pi.com

- Pages discovered: none — domain does not resolve (DNS ENOTFOUND)
- Presentation Type: unknown
- Overlap with krayu.be: not determinable
- Notes: Fetch returned `getaddrinfo ENOTFOUND signal-pi.com`. Domain is either unregistered, inactive, or not publicly routable at time of capture (2026-03-29).

---

### signalpi.ai

- Pages discovered: none — domain does not resolve (DNS ENOTFOUND)
- Presentation Type: unknown
- Overlap with krayu.be: not determinable
- Notes: Fetch returned `getaddrinfo ENOTFOUND signalpi.ai`. Domain is either unregistered, inactive, or not publicly routable at time of capture (2026-03-29).

---

## 5. Known Issues (RAW)

**I-01 — krayu.be: body content not accessible via HTTP fetch**
All 32 krayu.be pages (including homepage) return only pre-rendered title HTML. Body content, navigation, and internal links are not present in HTTP responses. Site is client-side rendered (CSR/SPA). Content structure cannot be audited via HTTP fetch.

**I-02 — krayu.be: page titles use slug-as-title pattern**
Majority of krayu.be page titles repeat the URL slug verbatim (e.g., `ProgramIntelligenceManifesto | Krayu Program Intelligence`, `ESIComparison_v1 | Krayu Program Intelligence`). Titles are not distinct semantic descriptions of page content.

**I-03 — krayu.be: homepage has no meta description in pre-rendered HTML**
The homepage pre-rendered HTML contains only the title `Krayu Program Intelligence`. No meta description is present in the extractable HTML.

**I-04 — krayu.be vs mirror.krayu.be: homepage title divergence**
krayu.be root title: `Krayu Program Intelligence`. mirror.krayu.be root title: `Krayu — Program Intelligence for Technology Organizations`. Two titles for the same brand root.

**I-05 — krayu.be: versioned (_v1) pages present in sitemap**
7 pages with `_v1` suffix are listed in the sitemap: `Home_v1`, `ESIComparison_v1`, `Partner_v1`, `Product_v1`, `ProgramIntelligence_v1`, `ProgramIntelligenceManifesto_v1`, `ProgramIntelligenceResearch_v1`. All are publicly accessible and indexed.

**I-06 — krayu.be: `Parking` page present in sitemap**
`https://krayu.be/Parking` is included in the public sitemap. Title: `Parking | Krayu Program Intelligence`. Slug name is conventionally associated with placeholder or parked content.

**I-07 — krayu.be: two investor-adjacent pages with similar names**
`/ProgramIntelligenceInvestor` and `/ProgramIntelligenceInvestorBrief` both appear in the sitemap as distinct pages. Body content not accessible to determine whether these are distinct or duplicative.

**I-08 — mirror.krayu.be: outgoing external links to krayu.be**
mirror.krayu.be pages contain outgoing links to krayu.be as external links (e.g., `https://krayu.be`, `https://krayu.be/program-intelligence/`, `https://krayu.be/ProgramIntelligenceResearch`). A site labeled a "mirror" contains cross-domain links to its presumed source.

**I-09 — mirror.krayu.be: internal links to routes not in mirror sitemap**
Three internal links found on mirror.krayu.be pages target routes not in the mirror sitemap (`/ProgramIntelligence`, `/Product`, `/ESIComparison`). When fetched, these routes return content with the same title as the homepage (`Krayu — Program Intelligence for Technology Organizations`), suggesting they resolve to the homepage or have no distinct content on mirror.krayu.be.

**I-10 — mirror.krayu.be/manifesto: duplicate outgoing link (`/program-intelligence` and `/program-intelligence/`)**
The manifesto page contains both `/program-intelligence` and `/program-intelligence/` (trailing slash) as distinct outgoing links. Both appear to target the same destination.

**I-11 — signal-pi.com: domain does not resolve**
`signal-pi.com` returned DNS ENOTFOUND. Domain is not accessible at time of capture.

**I-12 — signalpi.ai: domain does not resolve**
`signalpi.ai` returned DNS ENOTFOUND. Domain is not accessible at time of capture.

**I-13 — krayu.be: `Report` page present in sitemap with generic slug**
`https://krayu.be/Report` is included in the sitemap. Slug is generic and provides no classification signal. Body content not accessible.

**I-14 — krayu.be: `ExecutiveSlide` page present in sitemap**
`https://krayu.be/ExecutiveSlide` is included in the public sitemap. Slug suggests a presentation slide or single-slide asset. Body content not accessible.

---

*Capture: 2026-03-29 | Stream: W.1.A | Method: HTTP fetch + sitemap.xml enumeration | Domains scanned: 4 | Pages catalogued: 32 (krayu.be) + 6 (mirror.krayu.be) + 0 (signal-pi.com) + 0 (signalpi.ai)*
