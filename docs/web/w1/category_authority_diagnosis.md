# Category Authority Diagnosis — W.1.B

Diagnosis date: 2026-03-29
Input: docs/web/w1/external_surface_inventory.md (W.1.A)
Architectural context: krayu.be = CSR/SPA (Base44 runtime); mirror.krayu.be = SSR (Cloudflare); SSR/SPA split is a historically justified workaround.

---

## 1. Category Authority Status

**Status: fragmented**

**Justification:**

The concept being staked — Program Intelligence as a distinct analytical discipline — is consistently referenced across both surfaces. The category name appears on every observable page. That is the extent of the coherence.

Authority is fragmented across four dimensions observed in W.1.A:

1. The primary domain (krayu.be) is a CSR/SPA. Its content is not readable by crawlers without JavaScript execution. The sitemap declares 32 URLs, but none deliver indexable body text, semantic page titles, or meta descriptions in their pre-rendered HTML (W.1.A: I-01, I-02, I-03). Category definition cannot be communicated to a crawler from this surface.

2. The crawlable surface (mirror.krayu.be) carries only 6 of those 32 pages, has divergent titles from krayu.be, and contains outgoing external links back to krayu.be — structurally presenting itself as a secondary or derivative surface while simultaneously being the only surface from which category content is discoverable (W.1.A: I-04, I-08).

3. The two product domains (signal-pi.com, signalpi.ai) do not resolve. Any authority that might be accumulated at those addresses is absent (W.1.A: I-11, I-12).

4. The krayu.be sitemap contains noise pages (Parking, Home_v1, _v1 variants, ExecutiveSlide, Report) that dilute the signal of the URL set without contributing to category definition (W.1.A: I-05, I-06).

The category name is present. The architecture required to make that name authoritative — crawlable content, canonical signals, consistent identity, unified page inventory — is not coherently operating.

---

## 2. Primary Failure Modes

### FM-01 — Primary domain is opaque to crawlers

**Description:**
krayu.be is a CSR/SPA (Base44 runtime). All 32 pages return pre-rendered HTML containing only the page title — no body text, no navigation, no headings, no meta descriptions. The primary domain holds the canonical sitemap and the `krayu.be` brand domain, but produces no indexable content.

**Evidence:**
- W.1.A crawl note: "all krayu.be pages return title-only content"
- W.1.A I-01: "body content, navigation, and internal links are not present in HTTP responses"
- W.1.A I-02: "page titles repeat the URL slug verbatim"
- W.1.A I-03: "homepage has no meta description in pre-rendered HTML"
- All 32 page entries in W.1.A §2 record "Outgoing Links: not extractable (CSR)"

**Impact:**
A crawler indexing krayu.be for "Program Intelligence" finds 32 pages with slug-as-title HTML and no body text. The concept of Program Intelligence — its definition, its arguments, its framework — cannot be read from the primary domain. Category authority requires communicable content at the authoritative domain. This surface communicates nothing to a non-JS crawler.

---

### FM-02 — The crawlable surface is the mirror, not the primary

**Description:**
mirror.krayu.be is the SSR surface — the only location where full page content (headings, body text, navigation) is accessible via HTTP fetch. It holds the only crawlable definition of Program Intelligence, the manifesto, the research summary, the platform description, and the portfolio intelligence page. However, it is a subdomain labeled as a mirror, has only 6 pages in its sitemap, and contains outgoing links back to krayu.be treating krayu.be as the canonical source. The authority-carrying surface and the authority-claiming surface are inverted.

**Evidence:**
- W.1.A §3: mirror.krayu.be pages each return full content; krayu.be pages return title-only
- W.1.A I-08: "mirror.krayu.be pages contain outgoing links to krayu.be as external links"
- mirror.krayu.be/research explicitly labels krayu.be/ProgramIntelligenceResearch the "full research paper" — positioning the mirror as partial
- mirror.krayu.be sitemap: 6 pages vs krayu.be sitemap: 32 pages

**Impact:**
If a crawler indexes the system, it indexes mirror.krayu.be, a subdomain presenting itself as secondary. The primary domain (krayu.be) returns nothing crawlable. The entity establishing category authority is identified as a mirror of something else rather than the authoritative source. Authority accumulates on the wrong node.

---

### FM-03 — Sitemap of primary domain contains index pollution

**Description:**
The krayu.be sitemap (32 entries) includes pages that do not carry category-defining content and whose presence weakens the authority signal of the URL set as a whole. Specifically: `Parking` (a placeholder by name convention), 7 `_v1`-suffixed pages (versioned/draft variants publicly indexed alongside their primary equivalents), `Home_v1` (a second homepage-type URL in the sitemap), `ExecutiveSlide` (a presentation asset), and `Report` (a generic slug with no category signal).

**Evidence:**
- W.1.A I-05: 7 `_v1` pages in sitemap: `Home_v1`, `ESIComparison_v1`, `Partner_v1`, `Product_v1`, `ProgramIntelligence_v1`, `ProgramIntelligenceManifesto_v1`, `ProgramIntelligenceResearch_v1`
- W.1.A I-06: `Parking` page in sitemap, title `Parking | Krayu Program Intelligence`
- W.1.A I-14: `ExecutiveSlide` in sitemap
- W.1.A I-13: `Report` in sitemap with generic slug
- W.1.A §2 entries for these pages: all `Category Alignment: unclear`

**Impact:**
A sitemap is a signal of what the site owner considers its authoritative page inventory. A sitemap containing `Parking`, `Home_v1`, and seven `_v1` variants declares these pages as equivalent in weight to `ProgramIntelligenceManifesto` or `ExecutionStabilityIndex`. The category-defining pages are not distinguishable by priority from draft, placeholder, and staging artifacts. The sitemap does not reinforce category authority; it dilutes it.

---

### FM-04 — Homepage identity is inconsistent across surfaces

**Description:**
The two publicly accessible homepages of the Krayu web presence carry different titles, different structural content, and different brand positioning statements.

krayu.be root: title `Krayu Program Intelligence` — minimal, no subtitle, no positioning statement in pre-rendered HTML, no meta description.
mirror.krayu.be root: title `Krayu — Program Intelligence for Technology Organizations` — descriptive subtitle present, section headings observable, content describes the three-layer framework and references ESI and RAG.

**Evidence:**
- W.1.A I-04: "krayu.be root title: `Krayu Program Intelligence`. mirror.krayu.be root title: `Krayu — Program Intelligence for Technology Organizations`"
- W.1.A §2 krayu.be/: "Title is minimal — no subtitle or positioning statement present in pre-rendered HTML"
- W.1.A §3 mirror.krayu.be/: section headings "Program Intelligence for Technology Organizations; The Program Intelligence Framework; Detect Execution Drift Before It Becomes Program Failure"

**Impact:**
A category authority statement depends on a consistent, unambiguous declaration of what the category is and who holds it. The two accessible entry points of the same brand make different declarations. The crawlable one is labeled a mirror. The canonical one is silent. There is no single, authoritative statement of what Krayu is at the domain that carries its name.

---

### FM-05 — Internal linking across surfaces is incoherent

**Description:**
The cross-domain link structure between krayu.be and mirror.krayu.be does not establish a clear canonical relationship. mirror.krayu.be links to krayu.be as external links, treating krayu.be as the source. Three internal links on mirror.krayu.be (`/ProgramIntelligence`, `/Product`, `/ESIComparison`) target routes that do not exist as distinct pages on the mirror — they resolve to the homepage. The manifesto page on mirror.krayu.be contains both `/program-intelligence` and `/program-intelligence/` as distinct outgoing links. mirror.krayu.be/research labels krayu.be/ProgramIntelligenceResearch the "full research paper" while itself being hosted on the crawlable surface.

**Evidence:**
- W.1.A I-08: mirror.krayu.be outgoing external links to krayu.be
- W.1.A I-09: three internal links on mirror.krayu.be resolve to homepage
- W.1.A I-10: duplicate `/program-intelligence` and `/program-intelligence/` links on manifesto page
- W.1.A §3 mirror.krayu.be/research: `https://krayu.be/ProgramIntelligenceResearch` labeled "full research paper"

**Impact:**
A coherent authority structure requires that links within and between surfaces form a consistent, directed graph where authoritative pages point forward and derivative pages point back. The observed link structure is bidirectional and ambiguous: mirror pages treat the SPA as source, the SPA cannot be crawled to confirm, and internal mirror links lead to dead routes that silently serve the homepage. A crawler traversing this system cannot construct a stable authority graph for the domain cluster.

---

## 3. Surface Authority Ownership

**Assessment: mirror.krayu.be effectively carries authority; krayu.be claims it without delivering it**

### krayu.be

**Crawlability:** None. All 32 pages return title-only pre-rendered HTML. No content is indexable by a standard crawler. The sitemap declares the pages; the pages do not declare their content.

**Structure:** 32 URLs. Hierarchically flat (all depth-1 from root). URL slug naming conventions vary: some lowercase-hyphenated (`/program-intelligence` equivalent does not appear on krayu.be — the equivalent is `/ProgramIntelligence`, CamelCase), some fully descriptive compound CamelCase (`/ProgramIntelligenceDefensibility`), some generic (`/Report`, `/Parking`).

**Content visibility:** Zero. Pre-rendered HTML contains no body content, no semantic headings, no meta descriptions.

**Linking behavior:** Not observable (CSR). Zero outgoing internal links detectable via HTTP fetch.

### mirror.krayu.be

**Crawlability:** Full. All 6 pages return complete body text, section headings, and navigation. Content is indexable. Definitions of Program Intelligence, the manifesto arguments, the research framing, the platform architecture, and the ESI scoring model are all present and readable.

**Structure:** 6 URLs. All depth-1 from root. URL slugs are lowercase-hyphenated and semantically descriptive (`/program-intelligence`, `/manifesto`, `/research`, `/signal-platform`, `/portfolio-intelligence`). Navigation is consistent across all pages.

**Content visibility:** Full. Headings, body text, framework terminology, and named constructs (ESI, RAG, PiOS, ExecLens) are present and visible.

**Linking behavior:** Outgoing internal navigation links are consistent across all 6 pages. Three outgoing links target routes not in the mirror's own sitemap (`/ProgramIntelligence`, `/Product`, `/ESIComparison`) — these resolve to the homepage. Outgoing external links to krayu.be on every page.

**Determination:**
mirror.krayu.be is the surface from which all observable category content is accessible. It is where Program Intelligence is defined, the manifesto is stated, the research is summarized, the platform is described, and the ESI framework is presented. Despite being labeled a mirror and presenting outgoing links to krayu.be as the source, mirror.krayu.be is the operationally authoritative surface for category content. krayu.be holds the brand domain but delivers no content.

---

## 4. SPA vs Mirror Coherence

### Structural alignment

The two surfaces do not share URL structure. krayu.be uses CamelCase path names (`/ProgramIntelligence`, `/ProgramIntelligenceManifesto`, `/ESIComparison`). mirror.krayu.be uses lowercase hyphenated slugs (`/program-intelligence`, `/manifesto`, `/portfolio-intelligence`). The SPA and mirror are not structurally aligned at the path level.

### Page presence

krayu.be sitemap: 32 pages. mirror.krayu.be sitemap: 6 pages. 26 pages exist on krayu.be with no counterpart on mirror.krayu.be. The mirror covers: home, program-intelligence, manifesto, research, signal-platform, portfolio-intelligence. Pages present on krayu.be but absent from mirror.krayu.be include: Advisory, CaseStudies, Partner, DemoExecLens, PmoAudit, SignalModel, RiskAccelerationGradient, ExecutionStabilityIndex, FutureOfProgramIntelligence, ProgramIntelligenceDefensibility, ProgramIntelligenceFounderLetter, ProgramIntelligenceCategory, ProgramIntelligenceBridgingTheGap, ProgramIntelligenceInvestor, ProgramIntelligenceInvestorBrief, Insights, Report, all _v1 variants, Parking, ExecutiveSlide, ExecutiveSlide.

The mirror is a subset of the SPA — not a full representation of the krayu.be page inventory.

### Linking consistency

mirror.krayu.be links to krayu.be via external links on every page — treating the SPA as the canonical source. The SPA cannot be verified to link back (CSR, not observable). Three CamelCase-formatted internal links on mirror.krayu.be (`/ProgramIntelligence`, `/Product`, `/ESIComparison`) match the naming convention of krayu.be paths rather than mirror paths — suggesting these links were authored against krayu.be URL conventions and produce homepage resolution on the mirror rather than distinct page content.

### Duplication behavior

For the 6 pages that exist on both surfaces (home, program-intelligence/ProgramIntelligence, manifesto/ProgramIntelligenceManifesto, research/ProgramIntelligenceResearch, signal-platform/Product, portfolio-intelligence/ESIComparison), the relationship is content-diverging rather than duplicate. Titles differ. mirror.krayu.be/research is explicitly labeled a summary of krayu.be/ProgramIntelligenceResearch. The content is not identical; it is related but structurally different across surfaces.

### Divergence, ambiguity, and contradictions

**Divergence:** URL structure (CamelCase vs hyphenated-lowercase). Page count (32 vs 6). Homepage titles. Brand subtitle presence. Meta description presence.

**Ambiguity:** Which surface carries canonical authority is not declared anywhere on either surface observable in W.1.A. mirror.krayu.be links to krayu.be as source; krayu.be cannot be read to confirm or deny this. The crawlable surface is labeled derivative; the primary surface is opaque.

**Contradictions:** mirror.krayu.be/research positions krayu.be/ProgramIntelligenceResearch as the fuller/authoritative version, yet mirror.krayu.be is the only surface delivering readable content. The full version is on the uncrawlable surface; the summary is on the crawlable one.

---

## 5. Sitemap Integrity Analysis

### krayu.be sitemap (32 entries)

**Included pages: valid vs noise**

Pages with observable category alignment (slug implies substantive content):
- /ProgramIntelligence, /ProgramIntelligenceManifesto, /ProgramIntelligenceResearch, /ProgramIntelligenceDefensibility, /ProgramIntelligenceFounderLetter, /ProgramIntelligenceCategory, /ProgramIntelligenceBridgingTheGap, /ProgramIntelligenceInvestor, /ProgramIntelligenceInvestorBrief, /ExecutionStabilityIndex, /RiskAccelerationGradient, /SignalModel, /ESIComparison, /DemoExecLens, /Advisory, /CaseStudies, /Partner, /Insights, /FutureOfProgramIntelligence, /PmoAudit, /Product, /Report
— 22 entries with plausible category relevance

Pages with no category authority signal (noise by name convention or confirmed placeholder):
- /Parking — conventionally a placeholder
- /Home_v1 — versioned homepage variant
- /ExecutiveSlide — presentation asset
- /Report — generic slug
- /ESIComparison_v1, /Partner_v1, /Product_v1, /ProgramIntelligence_v1, /ProgramIntelligenceManifesto_v1, /ProgramIntelligenceResearch_v1 — 6 versioned draft variants
— 10 entries contributing noise

**Missing pages:**
No crawlable content is present on krayu.be, so no assessment of missing content pages is possible from observable data. All 32 entries are present by title only.

**Structural clarity: flat**
All 32 entries are depth-1 paths from the root. There is no hierarchical structure (e.g., `/program-intelligence/manifesto` or `/research/esi`). The sitemap is a flat list.

**Authority signal:**
The sitemap weakens authority. It declares 32 pages at equal weight, includes draft and placeholder artifacts, and provides no hierarchy or prioritization beyond the homepage (priority 1.0). The signal conveyed: the site has 32 pages of mixed, flat, content-of-unknown-type. No page in the sitemap other than `/` is formally declared more authoritative than another.

---

### mirror.krayu.be sitemap (6 entries)

**Included pages: valid vs noise**
All 6 entries represent substantive content pages: home, program-intelligence, manifesto, research, signal-platform, portfolio-intelligence. No noise entries.

**Missing pages:**
26 pages present on krayu.be have no counterpart in the mirror sitemap. These include: Advisory, CaseStudies, Partner, all investor pages, PmoAudit, SignalModel, RiskAccelerationGradient, ExecutionStabilityIndex, FutureOfProgramIntelligence, ProgramIntelligenceDefensibility, ProgramIntelligenceFounderLetter, ProgramIntelligenceCategory, ProgramIntelligenceBridgingTheGap, DemoExecLens, Insights, and all _v1 variants. The mirror is structurally incomplete relative to the full krayu.be inventory.

**Structural clarity: flat**
6 entries, all depth-1. Flat structure, consistent with the mirror's limited scope.

**Authority signal:**
The mirror sitemap is internally clean — no noise, no draft artifacts. However, it represents only 6 pages for a system that contains at minimum 32 named pages on its primary domain. The clean signal is narrow. It cannot convey the full surface of what Krayu presents at krayu.be.

---

## 6. Index & Surface Noise

### _v1 pages (publicly indexed)

7 pages with `_v1` suffix are present in the krayu.be sitemap and return HTTP 200:
`Home_v1`, `ESIComparison_v1`, `Partner_v1`, `Product_v1`, `ProgramIntelligence_v1`, `ProgramIntelligenceManifesto_v1`, `ProgramIntelligenceResearch_v1`.

These exist alongside their presumed primary counterparts in the same flat sitemap at the same priority level. Both `ProgramIntelligenceManifesto` and `ProgramIntelligenceManifesto_v1` are publicly accessible and indexed.
*(W.1.A: I-05)*

### Parking page

`https://krayu.be/Parking` is in the public sitemap. Title: `Parking | Krayu Program Intelligence`. No body content accessible. Slug is conventionally associated with placeholder content.
*(W.1.A: I-06)*

### Duplicate investor pages

`/ProgramIntelligenceInvestor` and `/ProgramIntelligenceInvestorBrief` both appear in the sitemap as distinct entries. Whether their content overlaps cannot be determined from W.1.A (both return title-only via CSR).
*(W.1.A: I-07)*

### Navigation inconsistencies

mirror.krayu.be navigation (observable via HTTP fetch) lists 5 items: Program Intelligence, Manifesto, Research, Signäl Platform, Portfolio Intelligence. These correspond exactly to the 5 non-root pages in the mirror sitemap.

krayu.be navigation is not observable (CSR). The sitemap contains 32 pages, but which of these appear in navigation cannot be determined.

The mirror navigation does not expose pages that exist only on krayu.be: Advisory, CaseStudies, Partner, PmoAudit, DemoExecLens, and the full set of ProgramIntelligence* sub-pages.

### Broken or misdirected links

Three internal links on mirror.krayu.be resolve to the homepage rather than distinct pages:
- `/ProgramIntelligence` — on mirror.krayu.be/program-intelligence
- `/Product` — on mirror.krayu.be/signal-platform
- `/ESIComparison` — on mirror.krayu.be/portfolio-intelligence

When fetched, all three return the mirror homepage title (`Krayu — Program Intelligence for Technology Organizations`). These are present as internal links in the mirror's content but lead to unresolved or homepage-fallback routes.
*(W.1.A: I-09)*

Duplicate outgoing link on mirror.krayu.be/manifesto: both `/program-intelligence` and `/program-intelligence/` appear as distinct links.
*(W.1.A: I-10)*

### Generic slug pages

`/Report` and `/ExecutiveSlide` are in the krayu.be sitemap. Both return title-only HTML. Neither slug carries a category signal.
*(W.1.A: I-13, I-14)*

---

## 7. Semantic Consistency (CKR Alignment)

Only mirror.krayu.be delivers observable terminology. krayu.be delivers no readable body text. The following is based exclusively on mirror.krayu.be content from W.1.A.

### "Program Intelligence" usage

Across mirror.krayu.be pages, "Program Intelligence" is used as both a discipline name and a product/service descriptor:

- mirror.krayu.be/ : "Turning engineering execution into executive intelligence" — positions it as a transformation service
- mirror.krayu.be/program-intelligence: "the discipline of translating engineering execution into executive insight" — positions it as a formal discipline
- mirror.krayu.be/manifesto: "The problem is not the absence of data. The problem is interpretation." — positions it as an interpretive framework
- mirror.krayu.be/research: "the discipline of translating engineering execution into executive insight" — consistent with program-intelligence page
- mirror.krayu.be/signal-platform: "Executive signal infrastructure for Program Intelligence" — positions it as an infrastructure layer

The homepage uses "executive intelligence" as the output; the program-intelligence and research pages use "executive insight." These are different terms used for the same apparent output concept across pages on the same surface.

### "Signäl" vs "Signal"

mirror.krayu.be consistently uses "Signäl" (with umlaut) in page titles and section headings: `Signäl Platform | Krayu — Program Intelligence`. The brand construct is consistently spelled.

krayu.be page titles do not contain "Signäl" — the nearest equivalent is `/SignalModel` (no umlaut, different concept). No krayu.be page title uses the Signäl spelling.

### Advisory firm vs discipline holder framing

mirror.krayu.be/program-intelligence describes Krayu as "a Dubai-based advisory firm specializing in complex technology program governance."

mirror.krayu.be/ describes the function as "turning engineering execution into executive intelligence" — consistent with an advisory framing.

The governance artifacts within the repository (program_intelligence_stack.md, pios_investor_narrative.md) frame Krayu as "the holder and author of the Program Intelligence discipline" and "not a software tool vendor." This framing does not appear in the observable mirror.krayu.be content; the visible content uses "advisory firm" consistently.

Note: the repository governance artifacts are not part of W.1.A's observed live surface and are referenced here only to note the observable difference between external surface framing and repository framing. The diagnosis is based on W.1.A data; this divergence is factual and observable across the two source sets.

### ESI terminology

mirror.krayu.be/portfolio-intelligence defines ESI (Execution Stability Index) with 5 dimensions and a 4-band scoring table. mirror.krayu.be/research references ESI as a "framework component." mirror.krayu.be/signal-platform lists "Execution Stability Index (ESI)" as an architecture component. The ESI concept is referenced consistently across three pages with consistent naming.

### RAG terminology

mirror.krayu.be/ mentions "RAG (Risk Acceleration Gradient)." mirror.krayu.be/signal-platform lists "Risk Acceleration Gradient" as an architecture component. The term is present and consistent but appears without the acronym expansion on the signal-platform page.

---

## 8. Authority Flow Breakdown

### User or crawler entering via krayu.be

A crawler or user arriving at `https://krayu.be` receives the pre-rendered shell: title `Krayu Program Intelligence`, no body text, no navigation, no description. A crawler indexes a page with a 4-word title and no content. A human user loading the page in a browser receives the CSR application (JavaScript must execute); their experience depends on the runtime — not observable from W.1.A.

The crawler cannot proceed to any depth-1 page from the homepage because no outgoing links are present in the pre-rendered HTML. The sitemap is the only discovery mechanism. A crawler following the sitemap reaches 32 pages, each returning the same title-only HTML. No concept is communicated. The authority flow ends at the front door.

### User or crawler entering via mirror.krayu.be

A crawler arriving at `https://mirror.krayu.be` receives full pre-rendered HTML: title `Krayu — Program Intelligence for Technology Organizations`, visible body text, section headings, and internal navigation links. The crawler can discover and index all 6 mirror pages.

The crawler proceeding through mirror.krayu.be encounters:
- On every page: outgoing external links to `https://krayu.be` — an uncrawlable destination
- On program-intelligence: `/ProgramIntelligence` internal link — resolves to homepage (dead end)
- On signal-platform: `/Product` internal link — resolves to homepage (dead end)
- On portfolio-intelligence: `/ESIComparison` internal link — resolves to homepage (dead end)
- On research: external link to `https://krayu.be/ProgramIntelligenceResearch` — uncrawlable destination, labeled "full research paper"

**Where flow breaks:**
At the boundary between mirror.krayu.be and krayu.be. Any link pointing from the mirror to the SPA leads to an uncrawlable destination. The "full research paper" cannot be read by a crawler. The CamelCase internal links on the mirror resolve to the homepage rather than their intended targets. The authority flow is interrupted at every point where the mirror defers to the SPA.

**Where authority splits:**
The crawlable content is on the subdomain (mirror.krayu.be). The canonical brand domain (krayu.be) holds the sitemap and the primary URL identity. A system indexing both finds content on the subdomain and silence on the primary. If the subdomain is treated as the source of crawlable content, the primary domain's URL identity is not what accumulates the index weight.

**Where confusion occurs:**
The mirror labels itself a mirror and links to krayu.be as the source. A crawler following that framing may treat mirror.krayu.be as secondary. The source it points to is uncrawlable. The result is a signal that the authoritative content exists somewhere else — at a location the crawler cannot read.

---

## 9. Root Cause Summary

**RC-01 — The crawlable surface is structurally inverted from the canonical identity surface**
krayu.be holds the brand domain and the 32-page sitemap. It delivers no crawlable content. mirror.krayu.be holds the readable content but is a subdomain that presents itself as derivative. The surface that accumulates indexing weight is the one that does not hold the brand identity. This is not a symptom of another problem — it is the primary structural condition from which multiple other failure modes derive.
*Evidence: W.1.A §1, §2, §3; FM-01, FM-02*

**RC-02 — No canonical declaration exists between the two surfaces**
Neither surface declares a canonical relationship to the other in any form observable via W.1.A. mirror.krayu.be links to krayu.be as a source but does not formally establish it as canonical. krayu.be cannot be read to confirm the relationship. The two surfaces operate in relation to each other without a governed authority statement connecting them.
*Evidence: W.1.A §3 mirror entries (all contain cross-domain links without canonical markup observable); I-08; FM-05*

**RC-03 — The primary domain's sitemap contains draft, staging, and placeholder artifacts at equal weight**
The krayu.be sitemap declares 32 pages. 10 of these are observably noise by name convention (_v1 variants, Parking, generic slugs). These are listed at the same priority as the manifesto and investor pages. The sitemap does not distinguish between authoritative category content and internal/draft artifacts.
*Evidence: W.1.A I-05, I-06, I-13, I-14; FM-03; §5 analysis*

**RC-04 — Page identity is inconsistent across surfaces**
The two surfaces present different titles for the same brand root. They use different URL naming conventions (CamelCase vs hyphenated-lowercase). They contain diverging content for overlapping topics. The homepage of the canonical domain and the homepage of the mirror carry different positioning statements. No page title or URL is shared exactly between the two surfaces.
*Evidence: W.1.A I-04; §4 structural alignment; §7 semantic consistency; FM-04*

**RC-05 — The product domain space (signal-pi.com, signalpi.ai) is absent**
Two domains associated with the product name do not resolve. Any authority that would be accumulated for the Signäl product construct at product-specific domains is not present. The only observable product-name URL coverage is the krayu.be surface (where content is not crawlable) and the mirror (where the Signäl Platform page exists but is labeled secondary).
*Evidence: W.1.A §1 signal-pi.com, signalpi.ai; W.1.A I-11, I-12*

---

*Diagnosis: 2026-03-29 | Stream: W.1.B | Input: W.1.A external_surface_inventory.md | Method: evidence-only, no solutions*
