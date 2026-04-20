---
name: CONTEXT.INFERENCE.RULES
type: brain-module
brain: publish
domain: retrieval
version: 1.0
origin_stream: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01
---

# CONTEXT.INFERENCE.RULES

## Purpose

Define how context is determined from observable facts without requiring explicit user input. Covers surface detection, repository context, and stream type inference.

---

## Surface Detection

```
IF target URL or route references krayu.be or mirror.krayu.be
  → surface = WEB pipeline
  → governing artifacts = WEB/contracts/ + route_source_map.yaml
  → active repo = krayu-mirror

IF target URL or route references signal-pi.com
  → surface = Signäl product surface
  → governing artifacts = docs/brain/publish/ (Publish Brain)
  → active repo = k-pi-core (content governance only; deployment = Base44)

IF stream touches BOTH surfaces
  → split into two streams (one per surface)
  → cross-surface streams are a boundary violation
```

---

## Repository Context

```
IF working directory = krayu-mirror
  → WEB contracts apply
  → Source entry modules apply
  → route_source_map.yaml is the authority gate

IF working directory = k-pi-core
  → Brain model applies (canonical / code / product / publish)
  → git_structure_contract.md branch domains apply
  → Publish Brain governs content claims for signal-pi.com
```

---

## Stream Type Inference

```
OBSERVE the primary nature of the work:

IF work involves broken links, malformed XML, invalid routes, missing sitemap entries
  → INTEGRITY

IF work involves wording correction against CKR definitions
  → SEMANTIC ALIGNMENT

IF work involves adding or improving internal links between governed pages
  → AUTHORITY GRAPH

IF work involves connecting krayu.be authority surface to signal-pi.com product surface
  → BRIDGE
  → Requires: ROUTE.CLASSIFICATION.MODEL class = BRIDGE
  → Requires: Publish Brain controlled claims entry

IF work involves making pipeline-vulnerable changes durable
  → DURABILITY
  → Root cause must be at Stage 0–1 (snapshot/compile), not Stage 3–4

IF work involves mismatch between route_source_map.yaml, frontmatter, sitemap, or nav
  → GOVERNANCE RECONCILIATION

RULE: One stream = one type.
If a proposed stream spans two types, it must be split.
```

---

*CONTEXT.INFERENCE.RULES — Publish Retrieval and Applicability System | origin: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01 | 2026-04-20*
