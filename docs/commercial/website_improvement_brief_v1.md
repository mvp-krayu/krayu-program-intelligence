# Signäl LENS — Website Improvement Brief v1
## Sales Funnel Review + Trust Acceleration Path

**Issued by:** Head of Marketing + CEO  
**Addressed to:** BASE44 implementation + Web Design Specialist  
**Based on:** Full page audit, 15-screenshot review, 2026-04-19  
**Branch:** feature/next

---

## EXECUTIVE SUMMARY

The site is structurally strong. The visual language is correct. The product is real and the copy is grounded. The core problems are:

1. **Section order breaks the buyer journey.** Proof appears before the frame that gives it meaning.
2. **Authority establishment comes too late.** The discipline/credibility section is buried mid-scroll.
3. **Tier 2 and Tier 3 have no conversion path.** Buyers who want more than Tier 1 hit a dead end.
4. **The evidence pipeline component is unframed.** Executive readers see layer codes with no entry context.
5. **No mid-page conversion moment.** The form is only at the very bottom — one location, one chance.
6. **No social proof signal.** Nothing on the page says someone else has done this and found it valuable.

These are fixable. No section needs to be removed. This is sequencing, framing, and CTA density work.

---

## CURRENT PAGE STRUCTURE (observed, top to bottom)

| # | Section | Status |
|---|---|---|
| 1 | Hero | ✅ Strong |
| 2 | Sample Executive Report | ⚠️ Too early — moves before context is built |
| 3 | What LENS Reveals (3 columns) | ✅ Strong |
| 4 | Decision Impact (3 cards) | ✅ Strong |
| 5 | The Discipline | ⚠️ Too late — authority buried |
| 6 | How It Works (5 steps) | ✅ Good |
| 7 | Signal Trace — Evidence Pipeline | ⚠️ Unframed — needs entry/exit copy |
| 8 | Executive LENS View (sample embed) | ✅ High trust — but has data issue (see below) |
| 9 | When to Use (6 trigger cards) | ✅ Excellent |
| 10 | Inside an Assessment (4 steps) | ✅ Good |
| 11 | The Product Ladder (Tiers 1–3) | ⚠️ Too late + Tier 2/3 missing CTAs |
| 12 | Engagement Model | ✅ Good |
| 13 | Get Started / CTA block | ⚠️ Missing inline CTA button |
| 14 | Pre-qualification + Contact Form | ✅ Smart — keep |
| 15 | Footer | ⚠️ Missing firm authority line |

---

## RECOMMENDED SECTION ORDER

Reorder without removing content. Changes to sequence only.

**Proposed order:**
1. Hero *(unchanged)*
2. What LENS Reveals *(move up — frame before proving)*
3. Decision Impact *(unchanged)*
4. **The Discipline** *(move here — establish authority before showing how it works)*
5. How It Works
6. Signal Trace — Evidence Pipeline *(add framing copy — see P1 below)*
7. Sample Executive Report *(move here — proof lands after context is established)*
8. Executive LENS View (sample embed)
9. When to Use
10. Inside an Assessment
11. **Product Ladder teaser — minimal, 3-line version** *(new — add here)*
12. The Product Ladder (Tiers 1–3, full)
13. Engagement Model
14. Get Started + mid-page CTA *(add inline button — see P0 below)*
15. Pre-qualification + Contact Form
16. Footer

---

## INSTRUCTIONS BY PRIORITY

---

### P0 — DO THESE BEFORE ANY OTHER CHANGE

#### P0.1 — Add inline CTA button to "Get Started" block

**Location:** "Start with a controlled LENS Assessment." section (currently screenshot 14)

**Problem:** This is the primary conversion section. It has a heading, body copy, and a "View Sample Report" link — but no primary CTA button. The form is one full scroll below. Buyers who are ready to convert here have to keep scrolling to find the form.

**Instruction:** Add a gold CTA button directly below the body copy in this section.

Button text: `Request Assessment →`  
Button style: same as nav button (gold pill, dark text)  
Placement: below the "Typically initiated within 24 hours." line, above "View Sample Report"

---

#### P0.2 — Remove "(PRODUCTION)" from page title

**Problem:** The browser tab and any link preview (Slack, Teams, email) shows "(PRODUCTION)" in the title. An executive sharing the URL to their CTO sees this.

**Instruction:** Update the page `<title>` and OG title tag to:  
`Signäl LENS — Structural Intelligence for Complex Delivery Environments`

---

#### P0.3 — Fix meta description

**Current:** Generic or empty.

**Instruction:** Set meta description to exactly:  
`Signäl LENS reveals the structural reality of your delivery environment. Decision-ready executive assessment. No instrumentation. No disruption.`

---

#### P0.4 — Fix "17 functional domains" in sample report embed

**Location:** Executive LENS View section — the connected system view caption reads:  
*"17 functional domains · 42 capability surfaces · 89 components mapped"*

**Problem:** These are BlueEdge reference case numbers, not product specifications. Every client engagement produces different counts. Leaving specific numbers on the page anchors buyers to wrong expectations and breaks the accuracy of the "derived from your actual systems" claim directly above it.

**Instruction:** Replace that caption line with:  
`Client-specific domain map · capability surfaces · components mapped by assessment`

Or remove the counts entirely and use only:  
`Functional domains · capability surfaces · components — generated per assessment`

---

### P1 — FIRST SPRINT AFTER P0

#### P1.1 — Reorder sections per recommended sequence above

**Instruction to BASE44:** Reorder sections in the page builder. No content is deleted. The reorder is:
1. Hero
2. What LENS Reveals
3. Decision Impact
4. The Discipline
5. How It Works
6. Signal Trace (Evidence Pipeline)
7. Sample Executive Report
8. Executive LENS View (sample embed)
9. When to Use
10. Inside an Assessment
11. Product Ladder teaser *(new — see P1.2)*
12. Product Ladder full (Tiers 1–3)
13. Engagement Model
14. Get Started + inline CTA
15. Pre-qualification + Contact Form
16. Footer

---

#### P1.2 — Add Product Ladder teaser above full ladder section

**Purpose:** Many buyers scroll past the trigger cards and are ready to evaluate the offer. They currently have to read through "Inside an Assessment" before seeing the product structure. Add a short 3-line teaser section immediately before the full ladder — it anchors the buyer to the product architecture before the detail.

**Instruction:** Add a new section between "Inside an Assessment" and "The Product Ladder" with this content:

---

*Section label:* `THE OFFER`

*Headline:* `Three levels. One starting point.`

*Body — three lines, no bullets:*

`Tier 1 — LENS Assessment. What is structurally true. Included in every engagement.`  
`Tier 2 — Diagnostic Access. Why it is true. Available by entitlement after Assessment.`  
`Tier 3 — Enterprise Access. Interrogate it directly. Governed contract.`

*CTA below:* `See full access details ↓` *(anchor scroll to ladder)*

---

**Design notes:** Minimal section. Dark background, gold tier labels. One light horizontal line between each line. No cards — this is a ladder summary, not a full product block.

---

#### P1.3 — Add CTAs to Tier 2 and Tier 3 cards

**Problem:** Tier 1 card has a clear "Request Assessment" CTA path. Tier 2 ("Entitlement Required") and Tier 3 ("Governed Contract") have no action. Buyers who self-identify at Tier 2 or Tier 3 have no conversion path.

**Instruction:**

On **Tier 2 — Diagnostic Access** card, add below the "WHEN TO USE" block:  
Button/link text: `Discuss Diagnostic Access →`  
Action: scrolls to contact form OR links to contact form with pre-filled message "I would like to discuss Diagnostic Access."

On **Tier 3 — Enterprise Access** card, add below the "WHEN TO USE" block:  
Button/link text: `Contact for Governed Access →`  
Action: scrolls to contact form OR links to contact form with pre-filled message "I would like to discuss Enterprise Access."

**Design:** Use ghost/outline button style (not gold) — these are gated tiers. The visual hierarchy should be: gold = open, outline = gated access.

---

#### P1.4 — Add framing copy to Signal Trace / Evidence Pipeline component

**Problem:** The "SIGNAL TRACE — EVIDENCE PIPELINE" component is technically impressive and builds significant credibility. But it currently appears with no introductory copy. Executive readers see layer codes (L0, 40.2, ZONE-2) without being told what they're looking at or why it matters to them.

**Instruction:** Add a short block immediately ABOVE the Signal Trace component:

*Section label:* `HOW EVIDENCE IS GOVERNED`

*Headline:* `Evidence is never exposed externally.`

*Body (2 lines):*  
`Each layer in the pipeline is sealed before the next begins. No raw source data passes through to the report.`  
`What you receive is structurally derived — not summarised, not interpreted.`

Add a single line immediately BELOW the component (currently the footer line reads "Evidence is never exposed externally. Each layer is bounded and sealed before the next begins." — this is good but small):

Replace that footer line with:  
`The report you receive is derived from this chain. Every claim in it is traceable to a layer.`

---

#### P1.5 — Add anonymous social proof block

**Location:** Add immediately before the "Get Started" CTA section (or within it).

**Purpose:** No social proof exists anywhere on the page. An executive evaluating this will silently ask "has anyone else done this?" The absence of any signal is a trust gap at the moment of conversion.

**Instruction:** Add a single-quote block. One quote is enough. Do not use a named client — use an anonymized role:

---

*Block style:* Pull quote. Dark background panel with left gold border accent.

*Quote:*  
> "We understood the structural constraint before the programme stalled. The assessment was the only input the board accepted as evidence."

*Attribution:* `— CTO, Infrastructure Programme` *(or similar anonymized title)*

---

**Note to CEO:** If a real anonymized quote exists from a client engagement, use it here verbatim (with approval). If not, this placeholder sets the structure. Do not use fabricated copy — hold this slot until a real quote is available, or remove entirely.

---

#### P1.6 — Strengthen hero social proof line

**Current:** The italic line below the sub-headline reads:  
*"Used before major transformation and investment decisions to establish what is structurally true — before committing."*

**Problem:** This is the strongest trust line in the hero — it tells an executive *exactly* who uses this and *why*. But it is visually the quietest element above the fold. It renders in italic, lighter weight, smaller size than everything around it.

**Instruction:** Give this line more visual presence. Options (pick one):

A. Change from italic body text → small-caps gold label above it: `USED FOR` + the line in regular weight, slightly larger.

B. Move it below the CTAs as a standalone "used by" line: small gold bullet + the text, centered.

C. Convert to a bordered quote block above the CTAs:  
*"Used before major transformation and investment decisions — to establish what is structurally true before committing."*

The content is correct. The visual weight needs to match the trust value of the statement.

---

### P2 — SECOND SPRINT

#### P2.1 — Add OG image for link previews

**Current:** Link preview shows only the Signäl logo.

**Instruction:** Create a 1200×630px OG image. Dark background (matching site). Large white text centered:

> "See the structure behind your delivery system"

Small gold label above: `SIGNÄL LENS`  
Bottom: `signal-pi.com`

No topology image required — text-only is cleaner for sharing in professional channels (Slack, email, Teams).

---

#### P2.2 — Add mid-page contact form anchor

**Problem:** The contact form exists only at the bottom. Mobile buyers who recognize their trigger at the "When to Use" section have to scroll 4+ full screens to reach the form.

**Instruction:** After the "When to Use" trigger cards section, add a minimal conversion strip:

---

*Strip:* Full-width, slightly different background (dark navy vs. pure black — 2–3% brightness shift).

*Content:*  
Left: `"Ready to establish what is structurally true?"` (heading, smaller than hero)  
Right: Gold CTA button — `Request Assessment →` (scrolls to bottom form OR opens inline form)

*No form fields in this strip* — just the CTA. Keep it frictionless.

---

#### P2.3 — Add firm authority line to footer

**Current footer:** `Signäl LENS · © 2026 Signäl. Executive Structural Intelligence.`

**Problem:** No signal of who Signäl/Krayu is. Executive buyers who make it to the footer and are still evaluating have no anchor to institutional credibility.

**Instruction:** Add one line to the footer:  
`Signäl LENS is a product of Krayu. Program Intelligence for complex delivery environments.`

Or shorter:  
`A Krayu product. · Program Intelligence.`

Place between the logo and copyright line.

---

#### P2.4 — "View engagement ranges" link audit

**Location:** Small grey link appearing above the "Get Started" CTA section: `View engagement ranges`

**Instruction:** Audit where this link points. If it leads to a page with actual scope/pricing information — keep it and make it slightly more prominent (gold text, not grey). If it leads to a generic page or a 404, remove it immediately. A dead or misleading link at the conversion moment creates a trust leak.

---

## TRUST ACCELERATION SUMMARY TABLE

| # | Action | Location | Priority | Type |
|---|---|---|---|---|
| T1 | Fix page title — remove "(PRODUCTION)" | `<title>` tag | P0 | Technical |
| T2 | Fix meta description | `<meta>` tag | P0 | Technical |
| T3 | Fix OG title | `<meta og:title>` | P0 | Technical |
| T4 | Fix "17 functional domains" in sample embed | Section 8 | P0 | Content |
| T5 | Add inline CTA to Get Started block | Section 13 | P0 | Conversion |
| T6 | Add framing copy to Signal Trace | Section 7 | P1 | Framing |
| T7 | Strengthen hero social proof line | Section 1 | P1 | Copy |
| T8 | Add CTAs to Tier 2 + Tier 3 cards | Section 11 | P1 | Conversion |
| T9 | Add anonymous client quote | Above Section 13 | P1 | Social proof |
| T10 | Reorder sections per brief | Full page | P1 | Architecture |
| T11 | Add Product Ladder teaser | Between 10 + 11 | P1 | Clarity |
| T12 | OG image for link preview | Meta | P2 | Distribution |
| T13 | Mid-page conversion strip after trigger cards | After Section 9 | P2 | Conversion |
| T14 | Add firm authority line to footer | Footer | P2 | Credibility |
| T15 | Audit "View engagement ranges" link | Section 13 | P2 | Trust hygiene |

---

## WHAT IS NOT ON THIS LIST

The following are working correctly and should not be changed:

- Hero headline and sub-headline copy
- "Not a status report" anchor line (What LENS Reveals)
- Decision Impact section — copy and structure are excellent
- Signal Trace component itself — keep the content, add framing around it
- When to Use trigger cards — structure and gold arrow copy is right
- Inside an Assessment 4-step section — keep as is
- Pre-qualification section ("Not sure if LENS is applicable...") — this is a smart conversion mechanism, keep it
- Form copy ("You will receive a structured response...") — strong response promise, keep it
- "Typically initiated within 24 hours" — this line is doing significant trust work, do not remove

---

## ONE PARAGRAPH FOR THE DESIGN SPECIALIST

The visual language is correct: dark field, gold accent, serif/monospace type pairing, card-based evidence blocks. Do not change the aesthetic. The work is sequencing and density. The main design tasks are: (1) give the hero social proof line more visual weight without breaking the hero layout — this is a typography decision; (2) design the Product Ladder teaser as a minimal 3-line ladder, not a card grid; (3) add the conversion strip after "When to Use" — this is a full-width strip with left copy + right button, single line height, slightly different background; (4) create the OG image — purely typographic, dark background, no illustration needed.

---

*Document: website_improvement_brief_v1.md*  
*Status: ISSUED — for BASE44 + Web Design implementation*  
*Branch: feature/next*  
*Audit date: 2026-04-19*
