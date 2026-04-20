---
name: PIPELINE.HANDOFF.MODEL
type: brain-module
brain: publish
domain: source-entry
version: 1.0
authority: WEB-OPS release governance
origin_stream: WEB.SOURCE.ENTRY.CONTROL.01
---

# PIPELINE.HANDOFF.MODEL

## Purpose

Define how a route moves from live existence in Base44 through the governed pipeline to fully governed mirror status. Every stage has a gate. Missing a gate produces a classified failure state.

---

## Pipeline Handoff Model

A route moves through five stages before it is fully governed.

```
STAGE 0: BASE44 CREATION
  → Route created in Base44 app
  → GATE: push must be executed via push-base44-expansion.md contract
  → Push manifest records the new route
  → FAILURE IF: route created without push manifest = UNGOVERNED ROUTE

STAGE 1: SNAPSHOT CAPTURE
  → extract-base44-pages.js captures the route's rendered content
  → Timestamped snapshot stored in WEB/base44-snapshot/<ts>/
  → capture_manifest.md records the route
  → GATE: route must appear in capture manifest with PASS status
  → FAILURE IF: route not in capture manifest = UNEXTRACTED ROUTE

STAGE 2: SNAPSHOT PROMOTION
  → promote-snapshot.sh updates latest/ symlink
  → GATE: all 7 promotion validation checks PASS
  → Route is now in WEB/base44-snapshot/latest/

STAGE 3: MIRROR COMPILATION
  → build-mirror-from-snapshot.sh compiles route into pages/<route>.md
  → route_source_map.yaml entry MUST be added BEFORE or AT this stage
  → GATE: route has verdict:allowed in route_source_map.yaml
  → GATE: hard validators PASS for compiled content
  → FAILURE IF: route compiled without route_source_map entry = UNREGISTERED MIRROR PAGE

STAGE 4: ELEVENTY BUILD + SITEMAP
  → npx @11ty/eleventy generates _site/<route>/index.html
  → If publish_status:live → route appears in sitemap
  → If publish_status:preview-pending-publish → route excluded from sitemap
  → GATE: Eleventy build exits 0

STAGE 5: GOVERNED STATE
  → Route exists in: route_source_map.yaml + pages/ + _site/ + (sitemap if live)
  → Route is fully governed
  → Internal links from mirror pages may now reference this route
```

### When Each Registry Must Be Updated

| Registry | Must be updated at |
|---|---|
| Push manifest | Stage 0 (before extraction) |
| route_source_map.yaml | Stage 3 (before or during compile) |
| pages/ | Stage 3 output (written by compile script) |
| sitemap | Stage 4 output (conditional on publish_status) |

---

*PIPELINE.HANDOFF.MODEL — Source Entry Control System | origin: WEB.SOURCE.ENTRY.CONTROL.01 | 2026-04-20*
