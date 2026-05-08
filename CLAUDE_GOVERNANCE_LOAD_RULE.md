# Claude Governance Load Rule

**Document type:** CLAUDE EXECUTION RULE — MANDATORY  
**Status:** AUTHORITATIVE — BINDING  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Date issued:** 2026-05-08  
**Stream:** PI.PSEE-PIOS.GOVERNED-INTELLIGENCE-EXTENSION-MODEL.BASELINE.01

---

## Mandatory Load Rule

> **Any stream introducing new intelligence layers, semantic participation, signal classes, projection systems, or runtime enrichment MUST first load:**
>
> 1. `docs/governance/GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md`
> 2. `docs/governance/pipeline_execution_manifest.json`
> 3. Current governance baseline tag from `docs/governance/governance_baselines.json`

This rule is non-negotiable. It applies to every stream that touches any of the following:

- New signal classes (DPSIG Class 1/2/3/5/6/7/8, EXSIG, ORGSIG, FLOWSIG, RISKSIG)
- New semantic participation or domain grounding
- New projection systems or executive rendering layers
- New or modified readiness gate logic
- New executive cognitive stabilization artifacts
- New runtime enrichment layers
- Path B — Agentic Semantic Orchestration

---

## Why This Rule Exists

Prior to governed-dpsig-baseline-v1, platform governance lived in conversational memory and stream-by-stream contracts. This created a dependency:

- a new conversation had no guaranteed access to prior governance decisions
- a new stream could drift from the methodology without explicit violation
- governance could be silently bypassed by not loading it

This rule eliminates that dependency.

Governance now lives in the repository. A stream that loads the three required documents has access to the full governed extension methodology regardless of conversation history.

---

## Trigger Conditions

| Work Type | Load Required |
|---|---|
| Adding a new DPSIG signal class | YES |
| Adding a new client integration | YES |
| Extending the readiness gate | YES |
| Extending the cognitive projection model | YES |
| Starting Path B (agentic orchestration) | YES |
| Adding a new signal class family (EXSIG/ORGSIG/etc.) | YES |
| Extending domain grounding for any client | YES |
| Issuing a new governance baseline freeze | YES |
| Pure documentation stream (no intelligence/runtime) | NO |
| UI/demo stream operating on pre-resolved projections | NO |
| Governance root file updates (CLAUDE.md, SKILLS.md) | NO |

---

## Load Verification

Claude must confirm all three documents are loaded before executing any task in a triggered stream.

Load confirmation must appear in the stream's pre-flight log (execution_report.md).

Format:

```
GOVERNANCE LOAD VERIFIED:
- GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md: LOADED
- pipeline_execution_manifest.json: LOADED
- Active baseline: governed-dpsig-baseline-v1 (092e251) — CONFIRMED
```

A stream that begins task execution without this confirmation is non-compliant.

---

## Relationship to CLAUDE.md

This rule supplements CLAUDE.md Section 12 (Pre-flight). It does not replace it.

CLAUDE.md defines the general execution pre-flight.  
This rule defines the specific governance load obligation for intelligence extension streams.

Both are binding. In case of conflict, the more restrictive rule applies.

---

## Current Baseline

Active baseline: `governed-dpsig-baseline-v1` (commit 092e251)

When a new baseline freeze is completed, update `docs/governance/governance_baselines.json` to reflect the new active baseline. The load rule references the baselines file — it does not need to be updated for each new baseline.
