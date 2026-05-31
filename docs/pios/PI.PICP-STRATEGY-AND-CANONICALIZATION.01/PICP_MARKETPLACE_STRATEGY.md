# PICP Marketplace Strategy

**Stream:** PI.PICP-STRATEGY-AND-CANONICALIZATION.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. The Question

> "Are marketplace entries: Reports, Deliverables, Consumers, or Cognition Modules?"

---

## 2. Option Analysis

### 2.1 Option A: Reports

**Definition:** Marketplace sells Report Types (Executive Report, Board Deck, Advisory Memo).

**Assessment:**
- REJECTED. This was the pre-discovery model that PI.EXECUTIVE-COGNITION-RUNTIME.01 explicitly superseded.
- Reports are L5 surface renderings of L4 cognition. Selling reports sells the medium, not the product.
- Different reports from the same PICP are parameterization variants, not distinct products.
- A "Report" marketplace would force customers to understand rendering configurations rather than intelligence value.

### 2.2 Option B: Deliverables

**Definition:** Marketplace sells Deliverable Packages (Assessment Package, Due Diligence Package, Transformation Package).

**Assessment:**
- PARTIALLY VALID but architecturally imprecise.
- A "deliverable" is a bundled projection — a ProjectionConfig + rendered output + supporting artifacts.
- This is closer to the truth than "Reports" but still conflates L4 cognition with L5 rendering.
- The same PICP can produce multiple deliverables for different engagement contexts.
- Deliverables are combinations of projection families, not independent products.

### 2.3 Option C: Consumers

**Definition:** Marketplace sells Consumer Profiles — named audience configurations that consume the PICP through specific projection families.

**Assessment:**
- ARCHITECTURALLY CORRECT but commercially awkward.
- A "consumer" is a ProjectionConfig — it specifies who receives what, at what depth, in what format.
- This accurately reflects the L4/L5 architecture: one PICP, many consumers.
- But "consumer" is an internal architectural term, not a market-facing concept.
- Customers don't buy "consumers" — they buy intelligence capabilities.

### 2.4 Option D: Cognition Modules

**Definition:** Marketplace sells Domain Cognition Modules — interpretation layers that produce domain-specific PICP objects and projection families.

**Assessment:**
- ARCHITECTURALLY CORRECT AND COMMERCIALLY COHERENT.
- This aligns with the existing marketplace definition: "governed ecosystem of domain cognition modules."
- Software Intelligence is already the first module — it produces conditions, consequences, and cognition objects.
- Each domain module could contribute domain-specific cognition objects to the PICP and domain-specific projection families to the PRE.
- Modules are the atomic commercial unit: they provide both intelligence (L4) and rendering capabilities (L5).

---

## 3. Decision: Cognition Modules + Projection Families

The marketplace operates at TWO levels:

### 3.1 Level 1: Domain Cognition Modules (L2-L4)

Domain cognition modules produce domain-specific intelligence:

| Module | What It Produces | PICP Contribution |
|--------|-----------------|-------------------|
| Software Intelligence (exists) | Conditions, consequences, topology cognition | 9 cognition objects populated with software-domain evidence |
| Financial Intelligence (future) | Financial risk assessment, valuation signals | Cognition objects with financial-domain evidence |
| Compliance Intelligence (future) | Regulatory exposure, governance gap assessment | Cognition objects with compliance-domain evidence |
| Operational Intelligence (future) | Delivery pattern assessment, execution dynamics | Cognition objects with operational-domain evidence |

**Commercial model:** Module activation gates the domain-specific intelligence. Without the module, the PICP contains only structural intelligence. With the module, the PICP is enriched with domain-specific cognition.

**Existing precedent:** The SW-Intel module gating pattern (teaser/full activation toggle) already proves this model. `synthesizeTeaser()` vs `synthesize()` is module activation.

### 3.2 Level 2: Projection Families (L5)

Projection families are rendering configurations that transform a PICP into deliverables:

| Family | Audience | Commercial Unit |
|--------|----------|----------------|
| REPORT | CEO, CTO, Board | Included in base PICP |
| BOARDROOM BRIEFING | Board, C-Suite | Included in base PICP |
| ADVISORY MEMO | CEO/CTO (1:1) | Included in advisory engagement |
| M&A ASSESSMENT | Investment committee, PE | Premium — specialized vocabulary |
| TRANSFORMATION REVIEW | VP Eng, Program Architect | Premium — transformation framing |
| PORTFOLIO REVIEW | CTO, Portfolio Manager | Premium — requires multiple PICPs |
| EXECUTIVE WORKSHOP | Leadership team | Premium — interactive materials |
| INVESTMENT REVIEW | Investors, Fund Managers | Premium — investment vocabulary |

**Commercial model:** Base projection families (Report, Boardroom Briefing) are included. Specialized families (M&A, Investment Review, Workshop) are premium activations.

### 3.3 Two-Axis Commercial Model

```
                    Projection Families (L5)
                    ─────────────────────────
                    Base  │ Advisory │ Premium
Domain    ┌─────────┬─────┼──────────┼────────┐
Modules   │ PI Core │  ✓  │    ✓     │   ✓    │
(L2-L4)   ├─────────┼─────┼──────────┼────────┤
          │ SW-Intel│  ✓  │    ✓     │   ✓    │
          ├─────────┼─────┼──────────┼────────┤
          │ Finance │  -  │    -     │   ✓    │
          ├─────────┼─────┼──────────┼────────┤
          │ Comply  │  -  │    -     │   ✓    │
          └─────────┴─────┴──────────┴────────┘
```

**Revenue dimensions:**
1. Module activation (which domain intelligence is included)
2. Projection family access (which output formats are available)
3. PICP volume (how many programs are assessed)

---

## 4. Marketplace Architecture Alignment

### 4.1 Existing Marketplace Definition (Canonical)

From TERMINOLOGY_LOCK.md: "Marketplace is domain cognition modules — replaceable interpretation layers that transform PI Core intelligence into domain-specific operational cognition."

**Alignment assessment:** FULLY ALIGNED. The PICP discovery confirms that marketplace modules contribute to a structured cognition package (PICP), not to rendered deliverables. The module boundary is the L4 cognition boundary, not the L5 rendering boundary.

### 4.2 Existing Signäl Structure (Frozen)

From PIOS_CURRENT_CANONICAL_STATE.md:
- Signäl/PMO (Tier 1A): Advisory-led, per-program structural assessment
- Signäl/Engineering (Tier 1B): GitHub evidence, semi-automated

**Alignment assessment:** Signäl packages are PROJECTION FAMILY BUNDLES that consume the PICP:
- Signäl/PMO = PICP + REPORT + BOARDROOM_BRIEFING + ADVISORY_MEMO families
- Signäl/Engineering = PICP + Software Intelligence module + REPORT family

The Signäl brand sits at the intersection of module activation and projection family selection. This is consistent — Signäl packages are the commercial wrapping around module + projection combinations.

### 4.3 Revenue Model

| Revenue Stream | Source | Mechanism |
|---------------|--------|-----------|
| Per-program assessment | PICP production | Advisory engagement + deliverable package |
| Module activation | Domain cognition module | Subscription or per-assessment activation |
| Projection access | Premium projection families | Per-projection or bundled in Signäl package |
| Portfolio intelligence | Multi-PICP comparison | Cross-program PORTFOLIO REVIEW family |
| Workshop facilitation | EXECUTIVE WORKSHOP family | Per-session facilitation + materials |

---

## 5. Architectural Implications

### 5.1 Module Registration Architecture

Each domain cognition module registers:
1. **L2-L3 contributions:** Condition types, consequence mappings, cognition ontology nodes
2. **L4 contributions:** PICP object enrichments (domain-specific fields within the 9 objects)
3. **L5 contributions:** Projection family capabilities (which families the module enables)
4. **Gating contract:** Teaser vs full activation behavior

### 5.2 PICP Extensibility

The PICP has a fixed structure (9 objects) but extensible content:
- **Core fields:** Always populated from PI Core (structural intelligence)
- **Module fields:** Populated when a domain module is active (domain intelligence)
- **Empty fields:** Explicitly marked as unavailable when a module is inactive

This means: a PICP without Software Intelligence has structural_posture and absence_profile populated but constraint_inventory contains only structural constraints, not software-behavioral constraints.

### 5.3 What Marketplace Does NOT Sell

| Not This | Why Not |
|----------|---------|
| Raw pipeline output | L0-L1 artifacts are substrate, not product |
| Signal data | L2 signals are intermediate computation |
| Condition objects | L2-L3 conditions are module internals |
| PICP directly | The PICP is the internal truth artifact, not a deliverable |
| Custom AI models | PI is deterministic governance, not AI services |
| Consulting advice | 13 prohibitions prevent prescriptive output |

The marketplace sells INTELLIGENCE CAPABILITY (modules + projections), not data, not artifacts, not advice.

---

## 6. Summary

Marketplace entries are **Domain Cognition Modules** (L2-L4) paired with **Projection Family access** (L5). This is the only model that:

1. Aligns with the existing canonical marketplace definition
2. Respects the L4/L5 separation discovered in PI.EXECUTIVE-COGNITION-RUNTIME.01
3. Extends naturally from the proven SW-Intel module gating pattern
4. Produces a clean two-axis commercial model (module × projection)
5. Keeps Signäl packages as commercial bundles of module + projection combinations
6. Does not sell the medium (reports/deliverables) — sells the intelligence (cognition + projection)
