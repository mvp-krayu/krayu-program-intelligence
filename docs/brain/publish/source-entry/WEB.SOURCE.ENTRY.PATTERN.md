---
name: WEB.SOURCE.ENTRY.PATTERN
type: brain-module
brain: publish
domain: source-entry
version: 1.0
authority: WEB-OPS source governance
origin_stream: WEB.SOURCE.ENTRY.CONTROL.01
---

# WEB.SOURCE.ENTRY.PATTERN

## Purpose

Detect routes that exist live on krayu.be but are absent from the governed mirror system at any layer.

---

## Source Entry Detection Model

The detection mechanism compares three registries against the live surface.

### Three Registries

| Registry | Location | What it contains |
|---|---|---|
| R1: Route Authority | `WEB/config/route_source_map.yaml` | Every route with a declared source and verdict |
| R2: Mirror Source | `pages/*.md` filenames → derived URL paths | Every route with a compiled mirror source |
| R3: Sitemap | `_site/sitemap.xml` or generated sitemap | Every route declared publicly indexable |

### One Live Inventory

| Inventory | Source | How obtained |
|---|---|---|
| L1: Live Route Set | krayu.be Base44 app (app ID: `68b96d175d7634c75c234194`) | Enumerate via Base44 MCP `get_app_preview_url` + route manifest, OR via crawl of sitemap + known routes + navigation audit |

### Detection Logic

```
UNGOVERNED ROUTE = any route in L1 that does NOT appear in R1 (route_source_map.yaml)
UNMIRRORED ROUTE = any route in R1 with verdict:allowed that does NOT appear in R2 (pages/)
UNMAPPED ROUTE   = any route in R2 with publish_status:live that does NOT appear in R3 (sitemap)
PHANTOM ROUTE    = any route in R3 that does NOT appear in R2 (sitemap entry with no backing page)
```

### Detection Cadence

- Run at: every push operation (after push manifest), every preflight of any publish stream, every release checkpoint
- Output: a route delta report listing routes in each class above
- Blocking condition: any UNGOVERNED ROUTE discovered → stops downstream pipeline until route is classified and registered

---

## Module A Definition

```
Name: WEB.SOURCE.ENTRY.PATTERN
Version: 1.0
Authority: WEB-OPS source governance
Purpose: Detect routes that exist live but are absent from governance

DETECTION INPUTS:
  - L1: Live route set (Base44 app route manifest or crawl)
  - R1: route_source_map.yaml (authority registry)
  - R2: pages/ directory (mirror source)
  - R3: _site/sitemap.xml (index visibility)

ROUTE STATES:
  UNGOVERNED:  in L1, NOT in R1
  UNMIRRORED:  in R1 (allowed), NOT in R2
  UNMAPPED:    in R2 (live), NOT in R3
  PHANTOM:     in R3, NOT in R2
  GOVERNED:    in L1 ∩ R1 ∩ R2 ∩ R3 (or correctly excluded from R3 as preview)

TRIGGER:
  Run this pattern check at:
  - Every push preflight
  - Every publish stream preflight
  - Every release checkpoint

BLOCKING CONDITION:
  Any UNGOVERNED route found → STOP all downstream pipeline work
  UNGOVERNED routes must be classified before proceeding
```

---

*WEB.SOURCE.ENTRY.PATTERN — Source Entry Control System | origin: WEB.SOURCE.ENTRY.CONTROL.01 | 2026-04-20*
