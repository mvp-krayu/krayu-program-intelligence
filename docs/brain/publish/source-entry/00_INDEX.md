---
name: Source Entry Control System
type: module-index
brain: publish
domain: source-entry
version: 1.0
tags:
  - publish
  - web
  - mirror
  - base44
  - route-governance
  - source-entry
  - detection
  - classification
origin_stream: WEB.SOURCE.ENTRY.CONTROL.01
---

# Source Entry Control System

## Purpose

Controls how routes enter the governed publish system.

Prevents routes from existing on `krayu.be` without corresponding source authority, mirror presence, and sitemap governance. Defines how detected unregistered routes are classified and brought under control.

---

## Usage Guidance

Apply when:
- new route detected on krayu.be or mirror.krayu.be
- working on any krayu.be / mirror.krayu.be publish stream
- any publish pipeline stage is touched
- `route_source_map.yaml` is involved
- a bridge page between krayu.be and signal-pi.com is proposed or discovered

---

## Modules

| File | Module Name | Purpose |
|---|---|---|
| [WEB.SOURCE.ENTRY.PATTERN.md](WEB.SOURCE.ENTRY.PATTERN.md) | WEB.SOURCE.ENTRY.PATTERN | Detect routes present live but absent from governance |
| [ROUTE.CLASSIFICATION.MODEL.md](ROUTE.CLASSIFICATION.MODEL.md) | ROUTE.CLASSIFICATION.MODEL | Classify any detected route into exactly one governance class |
| [ENTRY.GATE.RULESET.md](ENTRY.GATE.RULESET.md) | ENTRY.GATE.RULESET | Define the conditions under which a route may enter governed status |
| [PIPELINE.HANDOFF.MODEL.md](PIPELINE.HANDOFF.MODEL.md) | PIPELINE.HANDOFF.MODEL | Define the stage-by-stage flow from Base44 creation to governed mirror state |
| [FAILURE.MODE.APPLIED-INTELLIGENCE.md](FAILURE.MODE.APPLIED-INTELLIGENCE.md) | Failure Record | Documents the /program-intelligence-applied governance bypass and how this system prevents recurrence |

---

## Module Dependency Order

```
WEB.SOURCE.ENTRY.PATTERN        ← run first: detect
      ↓
ROUTE.CLASSIFICATION.MODEL      ← classify each detected route
      ↓
ENTRY.GATE.RULESET              ← verify registration preconditions
      ↓
PIPELINE.HANDOFF.MODEL          ← execute through governed stages
```

---

## Relationship to Other Brain Nodes

- Extends: `WEB/contracts/release-control.md` (adds route detection to release checkpoints)
- Extends: `WEB/config/route_source_map.yaml` (adds `bridge_governed` as a new source_type class)
- Informs: `docs/brain/publish/02_UPDATE_RULES.md` (source entry modules are mandatory preflight)
- Triggered by: `WEB/contracts/push-base44-expansion.md` (push is Stage 0 of PIPELINE.HANDOFF.MODEL)

---

*Source Entry Control System Index — Publish Brain | origin: WEB.SOURCE.ENTRY.CONTROL.01 | 2026-04-20*
