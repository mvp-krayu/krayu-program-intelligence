# base44_working_surface_inventory.md
# Base44 Working Surface — Structural Extraction
# Extracted: 2026-03-29

---

## 1. ROUTE INVENTORY (COMPLETE)

| Route Path | Component File | Page Title (from document.title) | Status | Visibility |
|:---|:---|:---|:---|:---|
| `/` | pages/Home.jsx | Krayu — Program Intelligence Advisory and Signal Infrastructure | READY | NAV, LINKED |
| `/Advisory` | pages/Advisory.jsx | Advisory \| KRAYU | READY | NAV, LINKED |
| `/CaseStudies` | pages/CaseStudies.jsx | Case Studies \| KRAYU | READY | NAV, LINKED |
| `/execution-stability-index` | pages/ExecutionStabilityIndex.jsx | Execution Stability Index (ESI) \| Program Intelligence \| Krayu | READY | NAV, LINKED |
| `/risk-acceleration-gradient` | pages/RiskAccelerationGradient.jsx | Risk Acceleration Gradient (RAG) \| Program Intelligence \| Krayu | READY | NAV, LINKED |
| `/program-intelligence` | pages/ProgramIntelligence.jsx | Program Intelligence — Execution Observability for Complex Programs \| Krayu | READY | NAV, LINKED |
| `/manifesto` | pages/ProgramIntelligenceManifesto.jsx | Program Intelligence Manifesto \| KRAYU | READY | NAV, LINKED |
| `/research` | pages/ProgramIntelligenceResearch.jsx | Program Intelligence Research \| KRAYU | READY | NAV, LINKED |
| `/signal-platform` | pages/Product.jsx | NOT DEFINED | READY | NAV, LINKED |
| `/portfolio-intelligence` | pages/ESIComparison.jsx | NOT DEFINED | READY | NAV, LINKED |
| `/program-intelligence-bridging-the-gap` | pages/ProgramIntelligenceBridgingTheGap.jsx | Program Intelligence: Bridging the Gap \| KRAYU | READY | LINKED (from Research Library) |
| `/Analytics` | pages/Analytics.jsx | NOT DEFINED | READY | LINKED (footer, admin only) |
| `/Insights` | pages/Insights.jsx | NOT DEFINED | READY | LINKED (footer) |
| `/research/bridging-the-execution-gap` | NOT DEFINED | NOT DEFINED | ORPHAN / BROKEN | LINKED (Research Library) |
| `/research/founders-letter` | NOT DEFINED | NOT DEFINED | ORPHAN / BROKEN | LINKED (Research Library) |
| `/research/program-intelligence-discipline` | NOT DEFINED | NOT DEFINED | ORPHAN / BROKEN | LINKED (Research Library, MegaMenu) |
| `/research/investor-brief` | NOT DEFINED | NOT DEFINED | ORPHAN / BROKEN | LINKED (Research Library) |
| `/research/defensibility-model` | NOT DEFINED | NOT DEFINED | ORPHAN / BROKEN | LINKED (Research Library) |
| `/ProgramIntelligenceResearch` | REDIRECT → /research | NOT DEFINED | REDIRECT | NOT LINKED |
| `/ProgramIntelligenceManifesto` | REDIRECT → /manifesto | NOT DEFINED | REDIRECT | NOT LINKED |
| `/ProgramIntelligenceBridgingTheGap` | REDIRECT → /program-intelligence (first match) | NOT DEFINED | REDIRECT | NOT LINKED |
| `*` | lib/PageNotFound.jsx | NOT DEFINED | READY | CATCH-ALL |

---

## 2. PAGE STRUCTURE (PER PAGE)

### / — Home
- Page title: Krayu — Program Intelligence Advisory and Signal Infrastructure
- Purpose: Landing page for KRAYU's Program Intelligence advisory and Signäl platform.
- Sections:
  1. HomeHero — Hero section: headline, sub-headline, two CTAs, Program Intelligence Framework card
  2. StrategicThesis — The Program Intelligence Gap: two-column explanation of engineering vs. executive vocabulary
  3. SignalSpotlight — Signäl platform spotlight: description, four feature cards, signal flow diagram, ESI preview strip
  4. Contact — Contact form and contact information block

### /Advisory
- Page title: Advisory | KRAYU
- Purpose: Advisory services page for KRAYU.
- Sections:
  1. TwoPillars — Two engagement modes: Strategic Advisory and Program Intelligence
  2. About — About KRAYU: founder profile, mission statement, core capabilities

### /CaseStudies
- Page title: Case Studies | KRAYU
- Purpose: Client case study page.
- Sections:
  1. VWCaseStudy — Featured case study block (Volkswagen)

### /execution-stability-index
- Page title: Execution Stability Index (ESI) | Program Intelligence | Krayu
- Purpose: Reference page defining the ESI analytical construct.
- Sections:
  1. Hero — Breadcrumb back to Program Intelligence; ESI headline and description
  2. Definition — What is the Execution Stability Index?
  3. What ESI Measures — Five execution dimensions
  4. Interpreting ESI — Four scoring bands (85–100, 70–84, 55–69, Below 55)
  5. Example — ESI in Practice: A Stability Decline (6-sprint snapshot)
  6. Back link — Link to Program Intelligence; Link to Risk Acceleration Gradient

### /risk-acceleration-gradient
- Page title: Risk Acceleration Gradient (RAG) | Program Intelligence | Krayu
- Purpose: Reference page defining the RAG analytical construct.
- Sections:
  1. Hero — Breadcrumb back to Program Intelligence; RAG headline and description
  2. Definition — What is the Risk Acceleration Gradient?
  3. What RAG Measures — Three observable risk dynamics
  4. Relationship to ESI — ESI (state) vs. RAG (dynamics) comparison cards
  5. Example — RAG in Practice: Risk Acceleration Across Six Sprints
  6. Back link — Link to Program Intelligence; Link to Execution Stability Index

### /program-intelligence
- Page title: Program Intelligence — Execution Observability for Complex Programs | Krayu
- Purpose: Overview page for the Program Intelligence discipline.
- Sections:
  1. Hero — Badge, headline, two CTAs (Explore Signäl, Contact KRAYU)
  2. In-page nav bar — Overview, The Gap, Execution Signals, Execution Blindness, Signal Infrastructure, Advisory
  3. #overview — What is Program Intelligence?
  4. #execution-blindness — ESI example card (gauge, sparkline, dimension bars), comparison boxes
  5. #program-intelligence-gap — Engineering systems vs. executive leadership two-column card
  6. Why Now? — Contextual explanation
  7. #execution-signals — Translation flow + four core element cards
  8. Core Analytical Constructs — ESI card, RAG card
  9. Related Disciplines — Four discipline comparison cards
  10. #signal-infrastructure — Signäl description, link to /signal-platform
  11. #advisory — KRAYU advisory services description

### /manifesto
- Page title: Program Intelligence Manifesto | KRAYU
- Purpose: Foundational statement on the Program Intelligence discipline.
- Sections:
  1. Hero — Manifesto badge, title, description, author metadata
  2. In-page nav bar — 8 sections
  3. Opening — Data abundance / interpretation problem; "This is the Program Intelligence Gap" callout
  4. #i — The Limits of Traditional Governance
  5. #ii — The Emergence of Program Intelligence
  6. #iii — The Program Intelligence Framework (three-layer flow)
  7. #iv — From Activity to Signal
  8. #v — The Role of Signal Infrastructure (Signäl callout)
  9. #vi — The Future of Technology Program Governance
  10. #vii — The Role of KRAYU
  11. #viii — The Program Intelligence Future
  12. CTA — Contact KRAYU, Program Intelligence Overview

### /research
- Page title: Program Intelligence Research | KRAYU
- Purpose: Library of research publications.
- Sections:
  1. Hero — "Research Library" badge; headline; Program Intelligence Model flow (right column)
  2. Introduction — Two paragraph intro
  3. Research Publications — Search bar; 5 publications listed:
     - Bridging the Execution Gap → /research/bridging-the-execution-gap
     - Founder's Letter → /research/founders-letter
     - Program Intelligence — A New Discipline → /research/program-intelligence-discipline
     - Investor Brief — Program Intelligence → /research/investor-brief
     - Defensibility Model → /research/defensibility-model

### /program-intelligence-bridging-the-gap
- Page title: Program Intelligence: Bridging the Gap | KRAYU
- Purpose: Full research paper on the Program Intelligence discipline.
- Sections:
  1. Hero — Back link; Research Paper badge; title; metadata (Author: Kurt Horrix, Published: March 2025)
  2. Table of Contents — In-page scrollable navigation
  3. Download PDF — /ProgramIntelligence_BridgingTheGap_KRAYU_2025.pdf
  4. #abstract — Abstract
  5. #section-1 — 1. The Visibility Problem
  6. #section-2 — 2. The Program Intelligence Gap (sub-sections 2.1, 2.2, 2.3)
  7. #section-3 — 3. Defining Program Intelligence (sub-section 3.1)
  8. #section-4 — 4. Execution Signal Infrastructure (sub-sections 4.1, 4.2, 4.3)
  9. #section-5 — 5. Implementing Program Intelligence (3 phase cards)
  10. #section-6 — 6. Strategic Implications (sub-sections 6.1–6.4)
  11. #section-7 — 7. Conclusion
  12. #section-8 — 8. Future Research
  13. Related Research — Links to 4 createPageUrl() targets + Back to Research Hub

### /signal-platform
- Page title: NOT DEFINED
- Purpose: Presents the Signäl platform.
- Sections:
  1. HERO — "Signäl Platform" badge; headline "Signäl"; two CTAs (Request Briefing mailto, Jump to Architecture)
  2. STRUCTURAL GAP — Three feature cards: Execution Systems, The Gap, Executive Reality
  3. #architecture — System Architecture: 6-card grid
  4. Board-Level Signal Engine — ExecLens concept block
  5. ESI — Score bands; 5 dimension cards (interactive); Executive Implication callout
  6. Infrastructure & Scalability — Defensibility checklist, Scalability checklist
  7. Seamless Integrations — 5 system cards
  8. NORTH STAR — Headline; 4 descriptor lines; 2 mailto CTAs
  9. Footer — © 2025 Krayu

### /portfolio-intelligence
- Page title: NOT DEFINED
- Purpose: Dashboard for comparing ESI scores across programs.
- Sections:
  1. HERO HEADER — "Portfolio Intelligence" badge; ESI description
  2. PROGRAM SELECTOR — 6 program chips (Project Alpha, Program Beta, Workstream Gamma, Initiative Delta, Portfolio Epsilon, Program Zeta)
  3. SUMMARY BAR — 4 KPI tiles
  4. INTERVENTION ALERT — Conditional alert for programs below ESI 55
  5. VIEW TOGGLE + SORT — Cards / Matrix toggle; sort options
  6. CARDS VIEW — Per-program card with gauge, sparkline, dimension bars
  7. MATRIX VIEW — Table with ESI, band, trend, dimensions, priority
  8. PORTFOLIO RISK HEATMAP — Dimension-level stress table
  9. SCENARIO SIMULATION — ScenarioSimulation component

### /Analytics
- Page title: NOT DEFINED
- Purpose: Admin-only analytics dashboard for visit data.
- Sections:
  1. Loading spinner
  2. Access Denied (non-admin)
  3. KPI Cards — Total Visits, Unique Visitors, Countries Tracked
  4. Visits by Page — Bar chart
  5. Visits by Country — Pie chart
  6. Recent Visits Table

### /Insights
- Page title: NOT DEFINED
- Purpose: Research report — "The Hidden Communication Crisis in PMO Operations"
- Sections:
  1. Header — Back to Home; "Research Report" badge; title; subtitle
  2. Executive Summary — Core problem callout; 3 KPI tiles (86%, 3.5x, 50%)
  3. Key Research Findings — 4 finding blocks
  4. AI-Powered Solution Framework — Core Capabilities, Business Impact
  5. Research Methodology — 4 source tiles
  6. Call to Action — Contact Our Team, View Product Demo

---

## 3. NAVIGATION STRUCTURE

### Header Menu (NAV_SECTIONS — identical in layout.jsx and components/common/MegaMenu.jsx)

Program Intelligence
  - Program Intelligence        → /program-intelligence
  - Manifesto                   → /manifesto
  - Execution Stability Index   → /execution-stability-index
  - Risk Acceleration Gradient  → /risk-acceleration-gradient

Research
  - Research Library            → /research

Signäl
  - Signäl Platform             → /signal-platform
  - Portfolio Intelligence      → /portfolio-intelligence

Company
  - Advisory                    → /Advisory
  - Case Studies                → /CaseStudies

### MegaMenu Right Panel (desktop only — components/common/MegaMenu.jsx)

Latest News (hardcoded LATEST_NEWS array):
  - Program Intelligence: A New Discipline → /research/program-intelligence-discipline (BROKEN)
  - Signäl enters controlled validation phase → /signal-platform
  - Krayu Advisory FZE — Dubai launch → /Advisory

Offerings (OFFERINGS array — display only, no links):
  - Program Intelligence Advisory
  - Signäl Platform
  - Program Architecture
  - Executive Reporting

Latest Impact (LATEST_IMPACT array — display only, no links):
  - Automotive OEM
  - Telco Transformation
  - Financial Services

Quick Links (QUICK_LINKS array):
  - Program Intelligence Overview → /program-intelligence
  - Execution Stability Index → /execution-stability-index
  - Risk Acceleration Gradient → /risk-acceleration-gradient
  - Signäl Platform → /signal-platform
  - Research Library → /research
  - Advisory Services → /Advisory
  - Case Studies → /CaseStudies
  - Contact Krayu → /#contact (scroll button, not a Link)

### Footer (layout.jsx)

Column 1 — Brand
  - Logo (SVG download link — downloads krayu_logo.svg)
  - Text: Krayu Advisory FZE – Dubai, United Arab Emirates
  - Text: Management Consultancy & Strategic Advisory Services

Column 2 — Company
  - Research & Insights → createPageUrl('Insights')
  - Agile Transformation (text only, no link)
  - SAFe Implementation (text only, no link)
  - Enterprise Consulting (text only, no link)
  - Team Training (text only, no link)

Column 3 — Contact
  - Email: info@krayu.ae (mailto link)
  - Phone: +971 585542586 (text only)
  - Contact button → scrolls to #contact on Home page

Footer Bottom
  - © 2024 Krayu. All rights reserved.
  - View Analytics Dashboard → createPageUrl('Analytics') (admin only)

---

## 4. INTERNAL LINK GRAPH (LIGHT)

/ (Home)
  - createPageUrl('Product')
  - /#contact
  - createPageUrl('Insights')
  - createPageUrl('Analytics') (admin only)
  - createPageUrl('ProgramIntelligence') → /program-intelligence (from StrategicThesis)
  - createPageUrl('Product') (from SignalSpotlight)
  - createPageUrl('Partner') (from SignalSpotlight)

/Advisory
  - No explicit internal page links in component body

/CaseStudies
  - No explicit internal page links in component body

/execution-stability-index
  - /program-intelligence
  - /risk-acceleration-gradient

/risk-acceleration-gradient
  - /program-intelligence
  - /execution-stability-index

/program-intelligence
  - /signal-platform
  - /#contact (window.location.href = '/#contact')
  - /execution-stability-index
  - /risk-acceleration-gradient

/manifesto
  - /signal-platform
  - /#contact
  - /program-intelligence

/research
  - /research/bridging-the-execution-gap (BROKEN)
  - /research/founders-letter (BROKEN)
  - /research/program-intelligence-discipline (BROKEN)
  - /research/investor-brief (BROKEN)
  - /research/defensibility-model (BROKEN)

/program-intelligence-bridging-the-gap
  - createPageUrl('ProgramIntelligenceResearch') → REDIRECT → /research
  - createPageUrl('Product')
  - createPageUrl('ProgramIntelligenceFounderLetter') → NOT DEFINED
  - createPageUrl('ProgramIntelligenceCategory') → NOT DEFINED
  - createPageUrl('ProgramIntelligenceInvestorBrief') → NOT DEFINED
  - createPageUrl('ProgramIntelligenceDefensibility') → NOT DEFINED
  - /ProgramIntelligence_BridgingTheGap_KRAYU_2025.pdf (download, existence unconfirmed)

/signal-platform
  - mailto:info@krayu.ae?subject=Signäl Platform Enquiry (external)
  - #architecture (anchor)
  - mailto:info@krayu.ae?subject=Strategic Deep Dive Request (external)
  - mailto:info@krayu.ae (external)

/portfolio-intelligence
  - No explicit internal page links in component body

/Analytics
  - No explicit internal page links in component body

/Insights
  - createPageUrl('Home') → /
  - createPageUrl('Home') + '#contact' → /#contact
  - createPageUrl('Product')

---

## 5. SEO METADATA

/ (Home)
  - title: Krayu — Program Intelligence Advisory and Signal Infrastructure
  - description: KRAYU is a Program Intelligence advisory firm helping technology organizations translate engineering execution into executive insight. Using the Signäl execution signal infrastructure, KRAYU converts delivery data from Jira, Git, DevOps and enterprise systems into credible program intelligence for leadership, boards and investors.
  - canonical: https://krayu.be/
  - robots: index, follow
  - og:title: KRAYU — Program Intelligence Advisory
  - og:description: Turning engineering execution into executive intelligence through Program Intelligence and Signäl execution signals.
  - og:type: website
  - og:url: https://krayu.be/
  - twitter:card: summary_large_image
  - twitter:title: KRAYU — Program Intelligence Advisory
  - twitter:description: Turning engineering execution into executive intelligence using Program Intelligence and Signäl.
  - JSON-LD: Organization schema + Service schema

/Advisory
  - title: Advisory | KRAYU
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/CaseStudies
  - title: Case Studies | KRAYU
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/execution-stability-index
  - title: Execution Stability Index (ESI) | Program Intelligence | Krayu
  - description: The Execution Stability Index (ESI) measures the structural stability of a program's execution system by compositing schedule stability, cost stability, delivery predictability, flow compression, and risk acceleration signals.
  - canonical: https://krayu.be/execution-stability-index
  - robots: index, follow

/risk-acceleration-gradient
  - title: Risk Acceleration Gradient (RAG) | Program Intelligence | Krayu
  - description: The Risk Acceleration Gradient (RAG) measures how execution risk evolves over time — capturing the rate of change, acceleration of risk injection, escalation momentum, and cross-program propagation.
  - canonical: https://krayu.be/risk-acceleration-gradient
  - robots: index, follow

/program-intelligence
  - title: Program Intelligence — Execution Observability for Complex Programs | Krayu
  - description: Program Intelligence is a discipline for observing and interpreting the execution dynamics of complex programs through execution signals such as the Execution Stability Index (ESI) and Risk Acceleration Gradient (RAG).
  - canonical: https://krayu.be/program-intelligence
  - robots: index, follow
  - og:title: Program Intelligence — Execution Observability for Complex Programs | Krayu
  - og:description: Program Intelligence is a discipline for observing and interpreting the execution dynamics of complex programs through execution signals derived from delivery systems.
  - og:url: https://krayu.be/program-intelligence
  - JSON-LD: DefinedTerm schema

/manifesto
  - title: Program Intelligence Manifesto | KRAYU
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/research
  - title: Program Intelligence Research | KRAYU
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/program-intelligence-bridging-the-gap
  - title: Program Intelligence: Bridging the Gap | KRAYU
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/signal-platform
  - title: NOT DEFINED
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/portfolio-intelligence
  - title: NOT DEFINED
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/Analytics
  - title: NOT DEFINED
  - description: NOT DEFINED
  - canonical: NOT DEFINED

/Insights
  - title: NOT DEFINED
  - description: NOT DEFINED
  - canonical: NOT DEFINED

---

## 6. KNOWN ISSUES (FACTUAL ONLY)

### Broken Links

| Source | Target | Issue |
|:---|:---|:---|
| pages/ProgramIntelligenceResearch.jsx | /research/bridging-the-execution-gap | No Route in App.jsx → PageNotFound |
| pages/ProgramIntelligenceResearch.jsx | /research/founders-letter | No Route in App.jsx → PageNotFound |
| pages/ProgramIntelligenceResearch.jsx | /research/program-intelligence-discipline | No Route in App.jsx → PageNotFound |
| pages/ProgramIntelligenceResearch.jsx | /research/investor-brief | No Route in App.jsx → PageNotFound |
| pages/ProgramIntelligenceResearch.jsx | /research/defensibility-model | No Route in App.jsx → PageNotFound |
| components/common/MegaMenu.jsx (LATEST_NEWS) | /research/program-intelligence-discipline | No Route in App.jsx → PageNotFound |
| pages/ProgramIntelligenceBridgingTheGap.jsx | createPageUrl('ProgramIntelligenceFounderLetter') | No matching page/route defined |
| pages/ProgramIntelligenceBridgingTheGap.jsx | createPageUrl('ProgramIntelligenceCategory') | No matching page/route defined |
| pages/ProgramIntelligenceBridgingTheGap.jsx | createPageUrl('ProgramIntelligenceInvestorBrief') | No matching page/route defined |
| pages/ProgramIntelligenceBridgingTheGap.jsx | createPageUrl('ProgramIntelligenceDefensibility') | No matching page/route defined |
| pages/ProgramIntelligenceBridgingTheGap.jsx | /ProgramIntelligence_BridgingTheGap_KRAYU_2025.pdf | File existence in public/ unconfirmed |
| components/landing/StrategicThesis.jsx | createPageUrl('Partner') | Route depends on pagesConfig; unconfirmed |
| components/landing/SignalSpotlight.jsx | createPageUrl('Partner') | Route depends on pagesConfig; unconfirmed |

### Duplicate Routes in App.jsx

| Path | Issue |
|:---|:---|
| /ProgramIntelligenceResearch | Two entries: Navigate redirect AND component render. Only first match fires. |
| /ProgramIntelligenceBridgingTheGap | Two entries: Navigate redirect AND component render. Only first match fires. |

### Missing SEO Metadata

| Route | Missing |
|:---|:---|
| /Advisory | description, canonical |
| /CaseStudies | description, canonical |
| /manifesto | description, canonical |
| /research | description, canonical |
| /program-intelligence-bridging-the-gap | description, canonical |
| /signal-platform | title, description, canonical |
| /portfolio-intelligence | title, description, canonical |
| /Analytics | title, description, canonical |
| /Insights | title, description, canonical |

### Footer Text Without Links (layout.jsx Column 2)
- Agile Transformation (plain text, no link)
- SAFe Implementation (plain text, no link)
- Enterprise Consulting (plain text, no link)
- Team Training (plain text, no link)

### Copyright Inconsistency
- pages/Product.jsx footer: © 2025 Krayu
- layout.jsx footer: © 2024 Krayu

### Content Mismatch
- pages/Insights.jsx: references "PMO Cloud" and "AI application" — does not match current Krayu/Signäl positioning
