---
name: PATTERN.BRIDGE.ROUTE.ENTRY.RESOLUTION.01
type: case-pattern
brain: publish
domain: cases
version: 1.0
origin_case: CASE.PROGRAM-INTELLIGENCE-APPLIED (GOVREC.01 + BRIDGE.01 + PROMOTION.01)
origin_stream: BRAIN.INTEGRATION.CASE.PROGRAM-INTELLIGENCE-APPLIED.01
---

# PATTERN.BRIDGE.ROUTE.ENTRY.RESOLUTION.01

## Pattern Name

BRIDGE Route Entry Resolution — Ungoverned Live Route with BRIDGE Classification

---

## Applicability Conditions

This pattern applies when ALL of the following are true:

```
1. Trigger: R-01 fires — route exists on krayu.be but is absent from route_source_map.yaml
2. Route content contains both PI discipline framing AND commercial/product reference
3. ROUTE.CLASSIFICATION.MODEL assigns class: BRIDGE
4. FAILURE.ESCALATION.RULES CONDITION 5 fires — no Publish Brain controlled claims table
   exists for the route
5. The route was created in Base44 without a governed push operation
   (pipeline stages 0–4 all absent)
```

Do NOT apply this pattern if:
- ESCALATION TRIGGER 2 fires (DERIVED vs BRIDGE ambiguity unresolved)
- ESCALATION CONDITION 3 fires (route duplicates canonical subject)
- ANTI.DRIFT.GUARDRAIL violation detected during classification

---

## Trigger Signature

```
Primary trigger:  R-01 (UNGOVERNED ROUTE)
Secondary class:  BRIDGE
Escalation fired: FAILURE.ESCALATION.RULES CONDITION 5
Pipeline state:   Stage 0–4 all absent (no push manifest, no snapshot,
                  no pages/ file, no route_source_map.yaml entry)
```

---

## Required Stream Sequence

Three streams, executed in strict order. One stream type per execution. No combining.

```
STREAM 1 — GOVERNANCE RECONCILIATION
  Purpose: Establish the controlled claims basis and route authority entry
  
  Steps:
    A. Inspect live Base44 page content (meta, OG, visible text)
    B. Extract all claims present on the page
    C. For each claim:
         - evaluate against Product Brain (docs/brain/product/*)
         - evaluate against Canonical Brain (docs/brain/canonical/*)
         - ACCEPT if traceable to both Product Brain + Canonical Brain
         - REJECT if prohibited wording present (C-01 list)
         - REJECT if no Product Brain or Canonical Brain basis
    D. Create Publish Brain node:
         docs/brain/publish/<route_slug>_page.md
         - controlled claims table (accepted claims only)
         - prohibited claims table (rejected claims with reasons)
         - bridge governance note
         - audience definition (product-brain-scoped only)
    E. Update docs/brain/publish/01_SITE_MAP.md
    F. Add retrospective route_source_map.yaml entry:
         source_type: bridge_governed
         verdict: provisional
         publish_status: preview-pending-publish
         notes: retrospective entry declaration
    G. Persist GOVREC case file:
         docs/brain/publish/cases/CASE.<ROUTE>.GOVREC.01.md

  Completion condition before Stream 2:
    - Publish Brain node with controlled claims table exists
    - route_source_map.yaml entry exists with all required fields
    - verdict: provisional

STREAM 2 — BRIDGE
  Purpose: Create the governed mirror page from the controlled claims basis
  
  Steps:
    A. Load controlled claims from Publish Brain node created in Stream 1
    B. Create pages/<route>.md
         - frontmatter: publish_status: preview-pending-publish
         - content derived exclusively from controlled claims table
         - no claims outside the table
         - no prohibited terms (C-01 list)
         - structure: framing → bridge → product connection → CTA direction
         - outbound links: governed pages only; no inbound links in this stream
    C. Run Eleventy build — verify compile exits 0
    D. Verify _site/<route>/index.html exists
    E. Verify route NOT in sitemap.xml (preview state)
    F. Persist BRIDGE case file:
         docs/brain/publish/cases/CASE.<ROUTE>.BRIDGE.01.md

  Completion condition before Stream 3:
    - pages/<route>.md exists
    - Build exits 0 with no errors
    - Route excluded from sitemap
    - No prohibited terms in page source

STREAM 3 — PROMOTION REVIEW
  Purpose: Verify all criteria and execute state upgrade if all pass
  
  Promotion criteria (all must PASS):
    A. Claim Governance
         - All 5+ controlled claims present in page source
         - No prohibited claims in page source
         - No unsupported audience expansion
    B. Route Governance
         - route_source_map.yaml entry structurally complete
         - Route class confirmed BRIDGE
         - No unresolved escalation condition
    C. Build / Validation
         - Page compiles without error
         - All outbound links from page are to governed routes
         - Sitemap exclusion working at preview state
         - source_path file exists
    D. Promotion Readiness
         - Content suitable for indexing
         - No page-specific blocker requiring content rewrite
         - Pre-existing template issues are not page-specific blockers

  Decision rule:
    PROMOTE:        All A/B/C/D PASS → execute promotion actions
    HOLD IN PREVIEW: Any criterion fails or HOLDS

  Promotion actions (if PROMOTE):
    - pages/<route>.md: publish_status → live
    - route_source_map.yaml: verdict → allowed; publish_status → live
    - Run Eleventy build
    - Verify route appears in sitemap.xml
    - Persist PROMOTION case file:
        docs/brain/publish/cases/CASE.<ROUTE>.PROMOTION.01.md

  Completion condition (closure):
    - Route in sitemap
    - verdict: allowed
    - All 3 case files persisted
```

---

## Stop / Escalation Conditions

```
STOP at Stream 1 if:
  - ESCALATION TRIGGER 2 fires (DERIVED vs BRIDGE ambiguous) → escalate to governance
  - ESCALATION CONDITION 3 fires (route duplicates canonical) → escalate to Canonical Brain
  - Anti-drift violation detected → stop; re-enter loop at Stage 3

HOLD at Stream 3 if:
  - Any promotion criterion FAILS
  - A content issue requires a new GOVERNANCE RECONCILIATION or SEMANTIC ALIGNMENT stream
  - A route-specific template issue blocks indexing readiness

NOTE: Pre-existing site-wide template issues that affect ALL currently-live pages equally
      are NOT page-specific blockers for this route's promotion.
```

---

## Closure Criteria

All must be true for the case to be fully closed:

```
□ docs/brain/publish/<route_slug>_page.md exists with controlled claims table
□ route_source_map.yaml entry: source_type:bridge_governed, verdict:allowed, publish_status:live
□ pages/<route>.md exists with publish_status:live
□ Route appears in _site/sitemap.xml
□ GOVREC case file persisted
□ BRIDGE case file persisted
□ PROMOTION case file persisted
□ No unresolved escalation condition remains
```

---

## Reference Case

First instance: `/program-intelligence-applied` (2026-04-20)

- GOVREC: `cases/CASE.PROGRAM-INTELLIGENCE-APPLIED.GOVREC.01.md`
- BRIDGE: `cases/CASE.PROGRAM-INTELLIGENCE-APPLIED.BRIDGE.01.md`
- PROMOTION: `cases/CASE.PROGRAM-INTELLIGENCE-APPLIED.PROMOTION.01.md`
- Brain integration: `cases/CASE.PROGRAM-INTELLIGENCE-APPLIED.BRAIN-INTEGRATION.01.md`

---

*PATTERN.BRIDGE.ROUTE.ENTRY.RESOLUTION.01 — Publish Brain Case Pattern | origin: BRAIN.INTEGRATION.CASE.PROGRAM-INTELLIGENCE-APPLIED.01 | 2026-04-20*
