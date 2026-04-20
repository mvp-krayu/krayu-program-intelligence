---
name: Publish Retrieval and Applicability System
type: module-index
brain: publish
domain: retrieval
version: 1.0
tags:
  - publish
  - retrieval
  - applicability
  - autoload
  - web
  - mirror
  - base44
  - route-governance
  - escalation
origin_stream: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01
---

# Publish Retrieval and Applicability System

## Purpose

Controls how the publish brain recognizes context, activates the right modules, and routes execution within governed boundaries.

---

## Usage Guidance

Apply when:
- route/surface mismatch is detected
- a publish stream begins
- a new route is mentioned
- stream type is not yet classified
- publish logic must be selected automatically

---

## Modules

| File | Module Name | Purpose |
|---|---|---|
| [TRIGGER.PATTERN.MODEL.md](TRIGGER.PATTERN.MODEL.md) | TRIGGER.PATTERN.MODEL | Observable signals that indicate a publish situation is active |
| [MODULE.APPLICABILITY.MAP.md](MODULE.APPLICABILITY.MAP.md) | MODULE.APPLICABILITY.MAP | Maps each trigger to the modules and stream type that must be applied |
| [EXECUTION.LINKING.MODEL.md](EXECUTION.LINKING.MODEL.md) | EXECUTION.LINKING.MODEL | Allowed and invalid sequences; required completion before each transition |
| [CONTEXT.INFERENCE.RULES.md](CONTEXT.INFERENCE.RULES.md) | CONTEXT.INFERENCE.RULES | Surface detection, repo context, and stream type inference from observable facts |
| [AUTOLOAD.SPECIFICATION.md](AUTOLOAD.SPECIFICATION.md) | AUTOLOAD.SPECIFICATION | Activation rules, deactivation rules, and constraint on overriding active modules |
| [FAILURE.ESCALATION.RULES.md](FAILURE.ESCALATION.RULES.md) | FAILURE.ESCALATION.RULES | When to stop and escalate; escalation targets and pipeline effects |

---

## Relationship to Source Entry Modules

This retrieval system wraps and activates the source entry modules defined in `docs/brain/publish/source-entry/`. The dependency is:

```
TRIGGER.PATTERN.MODEL           ← detects signal
      ↓
MODULE.APPLICABILITY.MAP        ← selects which source-entry modules apply
      ↓
EXECUTION.LINKING.MODEL         ← chains modules in correct order
      ↓
source-entry/ modules           ← execute classification, gate, pipeline
      ↓
FAILURE.ESCALATION.RULES        ← governs when to stop
```

`CONTEXT.INFERENCE.RULES` and `AUTOLOAD.SPECIFICATION` operate at the session level — they activate modules before any explicit trigger is evaluated.

---

## Relationship to Other Brain Nodes

- Activates: `docs/brain/publish/source-entry/` modules (via MODULE.APPLICABILITY.MAP)
- Informs: `docs/brain/publish/02_UPDATE_RULES.md` (retrieval modules govern preflight reasoning)
- Extends: `WEB/contracts/release-control.md` (adds trigger detection to release checkpoints)
- Constrains: all publish streams touching krayu.be, mirror.krayu.be, or route_source_map.yaml

---

*Publish Retrieval and Applicability System Index — Publish Brain | origin: BRAIN.RETRIEVAL.APPLICABILITY.PUBLISH.01 | 2026-04-20*
