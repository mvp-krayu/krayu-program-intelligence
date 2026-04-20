---
name: FAILURE.MODE.APPLIED-INTELLIGENCE
type: failure-mode-record
brain: publish
domain: source-entry
version: 1.0
route: /program-intelligence-applied
origin_stream: WEB.SOURCE.ENTRY.CONTROL.01
---

# FAILURE MODE: /program-intelligence-applied

## Summary

A live page at `https://krayu.be/program-intelligence-applied` was discovered during governance audit that had bypassed every layer of the governed publish system. This record documents which stage failed, why it was undetected, and how the Source Entry Control System prevents recurrence.

---

## Failure Mode Analysis

**Route:** `/program-intelligence-applied`

### Stage Failure Table

| Stage | Status | Reason |
|---|---|---|
| Stage 0: Push manifest | ABSENT | The route was created directly in the Base44 app with no governed push operation executed under `push-base44-expansion.md`. No push manifest was written. |
| Stage 1: Snapshot capture | ABSENT | With no push manifest, the extraction pipeline (`extract-base44-pages.js`) was never triggered for this route. The route does not appear in either historical snapshot. |
| Stage 2: Promotion | ABSENT | Not applicable — snapshot was never captured. |
| Stage 3: Mirror compilation | ABSENT | No `pages/program-intelligence-applied.md` exists. No `route_source_map.yaml` entry exists. |
| Stage 4: Eleventy + sitemap | ABSENT | Not in any sitemap. |

### Why It Was Not Detected

The governance model at the time of failure was **entry-only**: it governed what enters the pipeline (push contract, extraction rules, compile rules) but had **no exit check** — no mechanism to audit the live surface and compare it against the governed registry. There was no automated or procedural step that asks: *"Are there routes on krayu.be that are absent from route_source_map.yaml?"*

The detection gap is structural: the push contract prevents unauthorized pushes, but only if the push contract is used. A route created by any other mechanism (direct Base44 edit, manual app configuration) bypasses all pipeline entry points silently.

### How the New System Prevents Recurrence

| New control | How it prevents recurrence |
|---|---|
| `WEB.SOURCE.ENTRY.PATTERN` check at every publish stream preflight | Forces comparison of live routes vs route_source_map.yaml before any stream begins. UNGOVERNED routes surface immediately. |
| Entry Gate Ruleset as a blocking condition | Downstream pipeline (compile, Eleventy, sitemap) may not include a route without a route_source_map.yaml entry. |
| `ROUTE.CLASSIFICATION.MODEL` as a mandatory classification step | Removes ambiguity: any ungoverned route must be classified before it can enter governance — no implicit inclusion. |
| Retrospective entry path | Provides a formal mechanism for routes that bypassed the pipeline, so they can be registered without destruction or re-creation. |

---

## Additional Evidence Recorded

- The page serves Base44 SPA HTML (app ID: `68b96d175d7634c75c234194`, `<div id="root"></div>`)
- Canonical declared: `https://krayu.be/program-intelligence-applied`
- HTTP 200, indexable (no noindex tag)
- Meta description contains pre-Stream-4 language: "advisory firm", "translate" — not corrected by prior semantic alignment streams, which only processed Eleventy mirror pages
- No snapshot in `WEB/base44-snapshot/2026-03-30_170420/` or `WEB/base44-snapshot/2026-03-30_181500/`
- No entry in `WEB/config/route_source_map.yaml`
- No entry in `WEB/config/navigation_structure.yaml`
- No internal links from any `pages/` file
- Role classification: BRIDGE (connects Program Intelligence discipline framing to Signäl product reference)

---

*FAILURE.MODE.APPLIED-INTELLIGENCE — Source Entry Control System | origin: WEB.SOURCE.ENTRY.CONTROL.01 | 2026-04-20*
