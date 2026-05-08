# Stream Governance Load Template

**Document type:** MANDATORY STREAM PREAMBLE TEMPLATE  
**Status:** AUTHORITATIVE — REUSABLE  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Date issued:** 2026-05-08  
**Stream:** PI.PSEE-PIOS.GOVERNED-INTELLIGENCE-EXTENSION-MODEL.BASELINE.01

---

## Purpose

This template defines the mandatory governance preamble that every stream involving intelligence extension, semantic participation, signal classes, projection systems, or runtime enrichment must include.

Copy this preamble verbatim into the stream contract header. Do not abbreviate it.

---

## Mandatory Governance Load Preamble

```
─────────────────────────────────────────────────────
MANDATORY GOVERNANCE LOAD

Before any execution in this stream, Claude MUST:

1. Read:
   docs/governance/GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md

2. Read:
   docs/governance/pipeline_execution_manifest.json

3. Confirm active baseline from:
   docs/governance/governance_baselines.json
   Required: governed-dpsig-baseline-v1 (092e251) or later

THIS STREAM MUST OBEY:

- Additive lane doctrine (Section 6 of extension model)
- Replay-safe integration doctrine (Section 7 of extension model)
- Readiness gating doctrine (Section 8 of extension model)
- E2E certification doctrine (Section 9 of extension model)
- Executive cognitive stabilization doctrine (Section 10 of extension model)
- Manifest authority rules (Section 5 of extension model)

PRE-FLIGHT CONFIRMATION REQUIRED BEFORE ANY TASK BEGINS.
─────────────────────────────────────────────────────
```

---

## Forbidden Drift Patterns

The following patterns violate platform governance. Any stream that produces these is non-compliant:

| Drift Pattern | Violation |
|---|---|
| Modifying DPSIG Class 4 thresholds without SCRIPT_VERSION increment | Breaks TAXONOMY-01 replay safety |
| Adding client-specific logic inside the readiness gate | Violates client-agnostic governance |
| Suppressing DPSIG evidence at the data layer | Violates evidence-first discipline |
| Bypassing readiness gate for any client | Violates false-positive containment |
| Implementing cognitive projection without an authorized IMPLEMENTATION stream | Unauthorized implementation |
| Rendering executive output without executive_rendering_allowed = true | Violates readiness gate authority |
| Committing generated HTML reports as governed artifacts | Reports are reproducible; not evidence |
| Issuing a new signal class without the 6-stage extension lifecycle | Ungoverned intelligence attachment |
| Claiming platform extension is complete without a committed E2E certification artifact | Uncertified operational state |
| Introducing derivation inside a format adapter | Format adapters are translation-only |
| Using conversational memory as execution authority | Memory is not a governed artifact |

---

## Forbidden Side-Pipeline Behavior

The following side-pipeline behaviors are governance violations:

| Behavior | Why Forbidden |
|---|---|
| Creating a parallel derivation path outside the manifest lane | Violates lane isolation |
| Writing derived outputs to a path not declared in the manifest | Violates manifest authority |
| Running signal derivation inside a runtime or demo stream | Violates layer ownership |
| Running projection rendering inside a core derivation stream | Violates layer ownership |
| Running E2E validation on unstaged/uncommitted artifacts | Certification requires committed state |
| Producing a readiness verdict without running the gate code | Violates gate authority |
| Anchoring a new baseline without a formal freeze stream | Violates freeze rules |

---

## Forbidden Semantic Authority Expansion

Semantic authority is grounding-gated. The following expansions are forbidden without explicit authority:

| Expansion | Condition for Authorization |
|---|---|
| Inferring domain meaning for an ungrounded domain | Requires grounding contract per client |
| Applying business aliases to NONE-lineage domains | Never permitted — structural label only |
| Applying cognitive compression to DIAGNOSTIC_ONLY client | Never permitted — evidence-first prohibition |
| Extending cluster alias table without semantic topology re-validation | Requires grounding re-certification stream |
| Treating semantic_topology_model.json as mutable during execution | File is read-only input; modification requires separate stream |
| Overriding inference_prohibition=true for any client | Never permitted — prohibition is locked |
| Adding qualifier-free attributions to PARTIAL-lineage domains | PARTIAL lineage requires explicit qualifier |

---

## Stream Pre-flight Checklist

Before executing any task in a stream that triggers this governance load, confirm:

- [ ] GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md read
- [ ] pipeline_execution_manifest.json read
- [ ] Active baseline confirmed from governance_baselines.json
- [ ] Branch validated against git_structure_contract.md
- [ ] Branch violation (if any) flagged explicitly
- [ ] Planned work classified against allowed/forbidden extension behavior (Section 4)
- [ ] Lane assignment declared
- [ ] No runtime mutation planned
- [ ] No manifest mutation planned (or amendment contract present)
- [ ] No semantic authority expansion planned (or grounding contract present)

---

## Return Format Reminder

All streams using this governance load must return using the standard 8-item RETURN format defined in CLAUDE.md Section 6:

```
STREAM <ID> — RETURN

1. Status: COMPLETE / INCOMPLETE / FAIL
2. Branch:
3. Commit hash:
4. Validation summary:
5. File change summary:
6. Governance confirmation:
7. Execution report path:
8. Validation log path:
```

No narrative before item 1. No text after item 8.
